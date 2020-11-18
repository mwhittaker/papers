# [Linearizability: A Correctness Condition for Concurrent Objects (1990)](https://scholar.google.com/scholar?cluster=7860241540823320465)
Imagine a distributed system implementing a single register. A client issues a
read or write request to the system and then waits for a response. The
distributed system receives multiple requests from multiple clients
simultaneously. Ideally, the system executes these requests in parallel, but
interleaving the request processing could return some weird and wonky responses
to the clients. Intuitively, we'd like to make sure that our interleaved
executions are equivalent to some simpler, sequential execution. This intuition
is formalized as **linearizability**.

## Histories
We model a distributed system as a collection of sequentially executing
processes. The processes manipulate named, typed objects by calling their
methods. A **history** is a finite sequence of **invocation** and **response**
operations where

- an invocation is of the form $x\~op(args^\ast)\~A$ and
- a response is of the form $x\~term(res^\ast)\~A$.

Here, $x$ is an object, $op$ is an operation (e.g. $read$, $write$),
$args^\ast$ are arguments, $A$ is a process, $term$ is a termination status
e.g. $Ok$, and $res^\ast$ is the response. A **subhistory** of history $H$ is a
subsequence of $H$.

A response matches an invocation if the two share the same object and process
name. A pending invocation is one without a matching response following it.
$complete(H)$ is the maximal subhistory of $H$ without pending operations.

We say $H$ is **sequential** if it begins with an invocation and then
alternates between matching responses and invocations. The final invocation may
be pending. If a history is not sequential, we say it's **concurrent**.

$H | P$ is the restriction of $H$ to operations with process $P$. Similarly, $H
| x$ is the restriction of $H$ to operations with object $x$. We say two
histories $H$ and $H'$ are equivalent if for all $P$, $H | P = H' | P$. We say
$H$ is **well-formed** if for all $P$, $H | P$ is sequential. We assume all
histories are well-formed.

An **event** is an invocation and its matching response. One event $e$ **lies
within** another $f$ if the invocation of $e$ follows the invocation of $f$ and
the response of $e$ precedes the response of $f$.

A **sequential specification** of an object is a prefix-closed set of
single-object sequential histories. A sequential history $H$ is legal if for
all $x$, $H | X$ is in the sequential specification of $x$.

## Linearizability
Let $e \lt_H f$ if e's response precedes f's invocation in $H$. A history $H$ is
**linearizable** if it can be extended with responses to a history $H'$ such
that

- **L1:** $complete(H')$ is equivalent to a legal sequential history $S$ and
- **L2:** $\lt_H \subseteq \lt_S$.

In English, a history is linearizable if it is equivalent to a legal sequential
history without reordering non-concurrent events.

## Locality
Linearizability is *local* meaning that $H$ is linearizable if and only if $H |
x$ is linearizable for all $x$. This means that linearizable is modular and
composable.

## Blocking vs Nonblocking
Linearizability is *non-blocking* meaning that pending operations do not have
to wait for other pending operations to complete. More formally, if $e$ is a
pending total invocation in a linearizable history $H$, then there exists a
response $r$ such that $H + r$ is linearizable. Certain implementations of
linearizability may block, but fundamentally they need not to. Moreover,
desired blocking (e.g. dequeue blocking on empty queues) can still be
implemented.

## Comparison to Other Correctness Conditions
Sequential consistency is equivalent to linearizability without condition L2.
Serializability is analogous to sequential consistency with transactions (see
https://github.com/mwhittaker/papers/issues/5 for more details), and strict
serializability is analogous to linearizability with transactions.  Sequential
consistency, serializability, and strict serializability do not have the same
locality and non-blocking properties as linearizability. Moreover,
serializability and linearizability are for different domains. Serializability
works well for databases because application developers should be able to
easily express complex transactions.  Linearizability is better for
infrastructure in which the developer is willing to spend considerable effort
to maximize concurrency.

<script type="text/javascript" async
  src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/MathJax.js?config=TeX-MML-AM_CHTML">
</script>
