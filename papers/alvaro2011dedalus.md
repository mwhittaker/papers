## [Dedalus: Datalog in Time and Space (2011)](https://scholar.google.com/scholar?cluster=4658639044512647014&hl=en&as_sdt=0,5)
**Summary.**
Researchers have explored using Datalog variants to implement distributed
systems, often with orders of magnitude less code. However, there are two
distributed system concepts that are difficult to model in Datalog:

1. *mutable state*, and
2. *asynchronous processing and communication*.

Some Datalog variants add imperative features to Datalog, but this leads to
lost optimization opportunities and ambiguous semantics. *Dedalus* is a subset
of Datalog with negation, aggregation, an infinite successor relation, and
non-deterministic choice that introduces the notion of time to cleanly model
both mutability and asynchrony.

Let Ci and Ai range over constants and variables respectively and consider an
infinite successor relation over an abstract domain Z. We first develop the
core of Dedalus, *Dedalus0*, which is Datalog with negation with the additional
syntactic restrictions:

1. *Schema*. The final attribute of every predicate is from the domain Z. This
   *time suffix* connotes the timestamp of the record.
2. *Time Suffix*. Every subgoal must be unified on a common time suffix `T` and
   the head of every rule can take of of two forms:
    - In *deductive rules*, the head's time suffix `S` is equal to `T`. These
      rules connote deductions in a single time step.
    - In *inductive rules*, the head's time suffix `S` is the successor of `T`.
      These rules connote inductions across time.
3. *Positive and Negative Predicates*. Every extensional predicate `p` has a
   corresponding positive and negative predicate `p_pos` and `p_neg`.
4. *Guarded EDB*. No rule, except for those above, can involve extensional
   predicates.

Dedalus models the *persistence* of a predicate using a simple identity
inductive rule:

    p_pos(A, B, ..., Z) @next <- p_pos(A, B, ..., Z).

*Mutable state* is modeled using a conjunction of `p_pos` and `p_neg`:

    p_pos(A, B, ..., Z) @ next <-
        p_pos(A, B, ..., Z),
        not p_neg(A, B, ..., Z).

This pattern is so common, it is expressed using the `persist[p_pos, p_neg, n]`
macro. We can model a number that increases whenever an event occurs (aka a
*sequence*) as follows:


    seq(B) <- seq(A), event(_), succ(A, B).
    seq(A) <- seq(A), not event(_).
    seq(0)@0.

We can use aggregation to implement a priority queue. Consider a predicate
`priority_queue(X, P)` with values `X` and priority `P`. We can flatten out the
queue's contents over time by buffering values in `m_priority_queue` and
dequeueing them into `priority_queue` in order of priority.

    persist[m_priority_queue_pos, m_priority_queue_neg, 2]

    the_min(min<P>) <- m_priority_queue(_, P).

    priority_queue(X, P)@next <-
        m_priority_queue(X, P),
        the_min(P)

    m_priority_queue_neg(X, P)@next <-
        m_priority_queue(X, P),
        the_min(P)

A Dedalus0 program is *syntactically stratifiable* if there are no cycles in the
predicate dependency graph that contain a negative edge. Similarly, a program
is *temporally stratifiable* if the *deductive reduction* of it is
syntactically stratifiable. Every Dedalus0 program that is temporally
stratifiable has a unique perfect model.

A Datalog program (or Dedalus0 program) is considered *safe* if it has a finite
model. The following syntactic restrictions imply safety:

1. No functions.
2. Range restricted variables. That is, all variables appearing in the head
   must appear in a non-negated subgoal.
3. The EDB is finite.

We say a Dedalus0 rule is *instantaneously safe* if it is deductive,
function-free (1), and range-restricted (2). A Dedalus0 program is
instantaneously safe if all rules in its deductive reduction are
instantaneously safe. Two sets of ground atoms are *equivalent modulo time* if
the two sets are equal after projecting out the time suffix. A Dedalus0 program
is quiescent at time T if it its atoms are equivalent modulo time to those at
time T-1. A Dedalus0 program is *temporally safe* if it is *henceforth
quiescent* after some time T. The paper provides three syntactic restrictions
that are sufficient for a temporally stratifiable program to be temporally
safe.

Dedalus is a superset of Dedalus0 that introduces asynchronous choice.
Intuitively, Dedalus introduces a third *asynchronous* type of rule that allows
the head's timestamp to be a non-deterministic value, even values that are
earlier than the timestamp of the body! In addition, Dedalus introduces
horizontal partitioning by designating the first column of a predicate to be a
*location specifier*. Entanglement:

    p(A, B, N)@async <- p(A, B)@N

can be used to implement things like Lamport clocks.
