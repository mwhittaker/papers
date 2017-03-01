# [Lineage-driven Fault Injection (2015)](https://scholar.google.com/scholar?cluster=2497750921275499817)
Building fault tolerant systems is hard, like really hard. There are are a
couple approaches to building fault-tolerant systems, but none are perfect.

- In a *bottom-up* approach, we verify individual components of a system are
  fault-tolerant and then glue the components together. Unfortunately,
  fault-tolerance is not closed under composition: the combination of two
  fault-tolerant systems may not be fault tolerant.
- In a *top-down*, we can inject faults into an existing system and see whether
  or not it fails. Fault-injection can discover shallow bugs, but has trouble
  surfacing bugs that require more complex failure scenarios (e.g. a network
  partition followed by a particular sequence of machine failures).

**Lineage-driven Fault Injection** (LDFI) is a top-down approach which uses
lineage and fault injection to carefully discover fault-tolerance bugs in
distributed systems. If a bug is found, the lineage of the bug is given to the
user to help discover the root cause of the bug. If no bugs are found, LDFI
provides some guarantees that there are no possible bugs for that particular
configuration.

In a nutshell, LDFI takes a program written in something like Bloom, inputs to
the program, and some parameters (e.g. to bound the length the execution, to
bound the number of faults, etc.). It runs the given program on the given input
and computes a provenance graph of the output. It then carefully selects a
small number of faults that invalidate every derivation. It then injects these
faults into the system to see if it surfaces a bug. This is repeated until a
bug is found or no such bugs exist.

In this paper, Alvaro presents LDFI and an LDFI implementation named **Molly**.

## System Model
LDFI injects faults, but not every kind of fault. We'll explore dropped
messages, failed nodes, and network partitions. We *won't* explore message
reordering or crash recovery. While we sacrifice generality, we gain
tractability.

LDFI is governed by three parameters:

1. LDFI does not operate over arbitrarily long executions. A parameter **EOT**
   (end of time) prescribes the maximum logical time of any execution examined
   by LDFI.
2. Distributed systems typically tolerate some number of faults, but cannot
   possible tolerate complete message loss for example. A parameter **EFF**
   (end of finite failures) < EOT sets a logical time after which LDFI will not
   introduce faults. The time between EFF and EOT allows a distributed system
   to recover from message losses.
3. A parameter **Crashes** sets an upper limit on the number of node crashes
   LDFI will consider.

A **failure specification** is a three-tuple (EOT, EFF, Crashes). Molly will
automatically find a good failure specification by repeatedly increasing EOT
until programs can create meaningful results and increasing EFF until faults
occur.

We assume programs are written in Dedalus and that pre- and postconditions are
expressed as special relations `pre` and `post` in the program.

## LDFI
Consider an interaction between Molly and a user trying to implement a
fault-tolerant broadcast protocol between three nodes `A`, `B`, and `C` where
`A` begins with a message to broadcast. Our correctness condition asserts that
if a message is delivered to any non-failed node, it is delivered to all of
them.

- **Implementation 1.** Assume a user writes an incredibly naive broadcast
  protocol in which `A` sends a copy of the message to `B` and `C` once. Molly
  drops the message from `A` to `B` inducing a bug.
- **Implementation 2.** The author user then amends the program so that `A`
  continually sends the message to `B` and `C`. Molly drops the message from
  `A` to `B` and then crashes `A`. `C` has the message but `B` doesn't: a bug.
- **Implementation 3.** The author then amends the program so that all three
  nodes continuously broadcast the message. Now, Molly cannot find a set of
  dropped messages or node crashes to prevent all three nodes from obtaining
  the message.
- **Implementation 4.** While implementation 3 is fault-tolerant it is also
  inefficient. The user amends the protocol so that nodes broadcast messages
  until they receive an ack from the other nodes. Molly can devise a sequence
  of message drops and node crashes to prevent the message from being delivered
  to all three nodes, but when it runs the system again with the same faults,
  the messages still appear.
- **Implementation 5.** A "classic" implementation of broadcast in which a node
  broadcasts any message it receives once is found to be buggy by Molly.

## Molly
Molly begins by rewriting a Dedalus program into a Datalog program.

- Each relation is augmented with a time column.

    ```
    foo(A,B) ==> foo(A,B,T)
    foo(B,C) ==> bar(B,C,T)
    baz(A,C) ==> baz(A,C,T)
    ```

- The time column of every predicate in the body of a rule is bound to the same variable `T`.

    ```
    _ :- foo(A,B),   bar(B,C) ==>
    _ :- foo(A,B,T), bar(B,C,T)
    ```
- The head of every deductive rule is bound to `T`.

    ```
    baz(A,C)   :- foo(A,B),   bar(B,C) ==>
    baz(A,C,T) :- foo(A,B,T), bar(B,C,T)
    ```
- The head of every inductive rule is bound to `T + 1`.

    ```
    baz(A,C)     :- foo(A,B),   bar(B,C) ==>
    baz(A,C,T+1) :- foo(A,B,T), bar(B,C,T)
    ```
- For asynchronous rules, we introduce a `Clock(From, To, T)` relation which
  contains an entry `(n, m, T)` if node `n` sent a message to `m` at time `T`.
  Then, the body of asynchronous rules at node `n` whose heads are destined for
  node `n` are augmented with a `Clock(n, m, t)` predicate while the head is
  augmented with `T + 1`. Molly can add and remove entries from `Clock` to
  simulate faults.

    ```
    foo(A,B)     :- foo(B,A) ==>
    foo(A,B,T+1) :- foo(B,A,T), Clock(B,A,T)
    ```

It then rewrites the Datalog program to maintain its own provenance graph, and
extracts lineage from the graph via recursive queries that walk the graph.

Given an execution of the Datalog program, Molly generates a CNF formula where
the disjuncts inside each conjunct `x1 or .. or xn` represent a message drop or
node failure that would invalidate a particular derivation. If all derivations
can be invalidated, then the formula is unsatisfiable and the program is
fault-tolerant. If the formula is satisfiable, then each satisfied conjunct
represents a counterexample of the derivation. Molly uses a SMT solver to solve
these formulas.
