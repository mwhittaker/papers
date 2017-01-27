## [Conflict-free Replicated Data Types (2011)](https://scholar.google.com/scholar?cluster=4496511741683930603&hl=en&as_sdt=0,5) ##
**Summary.**
Eschewing strong consistency in favor of weaker consistency allows for higher
availability and lower latency. On the other hand, programming with weaker
consistency models like eventual consistency has traditionally been ad-hoc and
error-prone. CRDTs provide a way to achieve eventual consistency in a
principled way.

This paper considers a set of non-byzantine processes `{p_1, ..., p_n}`
connected by an asynchronous network. Each process `p_i` maintains some state
`s_i` that is updated over time. Processes use some mechanism like gossip to
communicate states to one another, and whenever a process `p_i` receives state
`s_j` from process `p_j`, it merges `s_j` into its state `s_i`.

More formally, each process maintains a *state-based object* which we model as
a five tuple `(S, s^0, q, u, m)` where

- `S` is a set of states,
- `s^0 \in S` is the initial state,
- `q: S -> 'a` is a query method,
- `u: S -> 'a -> S` is an update method, and
- `m: S -> S -> S` is a merge method.

All process begin with the initial state `s^0`. Clients can query the value of
the object with `q` (i.e. `s.q()`) and update the object with `u` (e.g.
`s.u(a)`). When processes communicate state, they are merged with `m` (e.g.
`s_i.m(s_j)`).

Method invocations (i.e. invocations of `q`, `u`, or `m`) are totally ordered
on each process and sequentially numbered starting from 1. States are similarly
ordered and numbered, updating with every method invocation:

    s^0 . f^1 . s^1 . f^2 . s^2 . ...

An object's *state-based causal history* traces its updates over logical time.
Formally, a causal history `C = [c_1, ..., c_n]` is an `n`-tuple of versioned
sets `c_i^0, c_i^1, c_i^2, ...` (one for each process) where each set contains
updates (e.g.  `u_i^k(a)`). A causal history is updated at a process `i` as
follows:

- When `i` issues a query, `c_i` is unchanged. That is, `c_i^k = c_i^{k+1}`.
- When `i` issues an update, it is added to `c_i`. That is, `c_i^{k+1} = c_i^k
  \cup {u_i^k}`.
- When `i` merges another state `s_j`, `c_i` and `c_j` are merged. That is,
  `c_i^{k+1} = c_i^k \cup c_j^k`.

An update is *delivered* at `i` when it enters `c_i`. An update `u` *happens
before* another update `v_i^k` when `u` is in `c_i^k`. Two updates are
*concurrent* if neither happens before the other.

These definitions are notationally dense but are a simple formalization of
Lamport's notions of logical time. Here is an illustration of how causal
history evolves over time for a three process system.


    p_0: {} -[u(a)]-> {u(a)} -.
                               \
    p_1: {} -[q]----> {} -------`-[m]-> {u(a)}---.-[m]-> {u(a), v(b)}
                                                /
    p_2: {} -[v(b)]-> {v(b)} ------------------'


We define an object to be *eventually consistent* if it satisfies the following
three properties:

- *Eventual delivery:* An update delivered at a correct process is eventually
  delivered to all correct processes.
- *Convergence:* If two processes have the same updates, they will *eventually*
  have the same states.
- *Termination:* All methods terminate.

A *strongly eventually consistent* (SEC) object is one that is eventually
consistent and additionally satisfies the following property.

- *Strong Convergence:* If two processes have the same updates, they have the
  same states.

A state based object imbued with a partial order `(S, <=, s^0, q, u, m)` is a
*monotonic semilattice* if

- `(S, <=)` is a join semilattice,
- `s_i.m(s_j)` computes the least upper bound (or join) or `s_i` and `s_j`, and
- state is monotonically non-decreasing over updates (i.e. `s <= s.u(x)`).

State-based objects that are monotonic semilattices (CvRDTs) are SEC.

Dual to state-based objects are *operation-based objects*. In the
operation-based model, processes communicate updates to one another rather than
states. When a process receives an update it applies it to its state. Formally,
an op-based object is a 6 tuple `(S, s^0, q, t, u, P)` where

- `S` is a set of states,
- `s^0 \in S` is the initial state,
- `q` is a query method,
- `t` is a side-effect free prepare-update method,
- `u` is an effect-update method, and
- `P` is a precondition (not used much in this paper).

Calls to `u` must be immediately preceded by calls to `t`. Op-based causal
histories are defined similarly to state-based causal histories where `t`
behaves like `q` and `m` is now missing. The definition of happens-before and
concurrent operations extends naturally from earlier. An op-based object whose
updates commute is a CvRDT. If messages are delivered exactly once, message
delivery respect the causal order, then CvRDTs are SEC.

Turns out, CvRDTs and CmRDTs are equivalent in that they can simulate one
another. Moreover SEC is incomparable to sequential consistency. Consider an
add-wins set CRDT in which one process performs `add(e); remove(e')` and
another performs `add(e'); remove(e)`. When the two sets are merged, they
contain `e` and `e'`, but under sequential consistency, one of the removes must
occur last.

Example CRDTs include vector clocks, increment-only counters,
increment-decrement counters add-only sets, add-remove sets, maps, logs, and
graphs.
