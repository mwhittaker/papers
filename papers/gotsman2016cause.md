## ['Cause I'm Strong Enough: Reasoning about Consistency Choices in Distributed Systems (2016)](https://scholar.google.com/scholar?cluster=16043456868654348168&hl=en&as_sdt=0,5)
Strong consistency increases latency; weak consistency is hard to reason about.
Compromising between the two, a number of databases allow each operation to run
with either strong or weak consistency. Ideally, users choose the minimal set
of strongly consistent operations needed to enforce some application specific
invariant. However, deciding which operations to run with strong consistency
and which to run with weak consistency can be very challenging. This paper

1. introduces a formal hybrid consistency model which subsumes many existing
   consistency models,
2. introduces a modular proof rule which can determine whether a given
   consistency model enforces an invariant, and
3. implements a prototype using a standard SMT solver.

**Consistency Model, Informally.**
Consider

- a set of states `s, s_init \in State`,
- a set of operations `Op = {o, ...}`,
- a set of values `\bot in Val`, and
- a set of replicas `r_1, r_2, ...`.

The denotation of an operation is denoted `F_o` where

- `F_o: State -> (Val x (State -> State))`,
- `F_o^val(s) = F_o(s)[0]` (the value returned by the operation), and
- `F_o^eff(s) = F_o(s)[1]` (the effect of the operation).

For example, a banking operation may let states range over natural numbers
where

- `F_deposit_a(s) = (\bot, fun s' -> s' + a)`
- `F_interest(s) = (\bot, fun s' -> s' + 0.05 * s)`
- `F_query(s) = (s, fun s' -> s')`

If all operations commute (i.e. `forall o1, o2, s1, s2. F_o1(s1) o F_o2(s2) =
F_o2(s2) o F_o1(s1)`), then all replicas are guaranteed to converge. However,
convergence does not guarantee all application invariants are maintained. For
example, an invariant `I = {s | s >= 0}` could be violated by merging
concurrent withdrawals. To enforce invariants, we introduce a token system
which can be used to order certain operations.

A token system `TS = (Token, #)` is a set of tokens `Token` and a symmetric
relation `#` over `Token`. We say two sets of tokens `T1 # T2` if `exists t1 in
T1, t2 in T2. t1 # t2`. We also update our definition of operations to acquire
tokens:

- `F_o: State -> (Val x (State -> State) x P(Token))`,
- `F_o^val(s) = F_o(s)[0]` (the value returned by the operation),
- `F_o^eff(s) = F_o(s)[1]` (the effect of the operation), and
- `F_o^tok(s) = F_o(s)[2]` (the tokens acquired by the operation).

Our consistency model will ensure that two operations that acquire conflicting
operations will be ordered.

**Formal Semantics.**
Recall a *strict partial order* is a partial order that is transitive and
irreflexive (e.g. sets ordered by strict subset). Given a partial order `R`, we
say `(a, b) \in R` or `a -R-> b`. Consider a countably infinite set `Event` of
events ranged over by `e, f, g`. If operations are like transactions, an event
is like applying a transaction at a replica.

- *Definition 1.* Given token system `TS = (Token, #)`, an *execution* is a
  tuple `X = (E, oper, rval, tok, hb)` where
    - `E \subset Event` is a finite subset of events,
    - `oper: E -> Op` designates the operation of each event,
    - `rval: E -> Val` designates the return value of each event,
    - `tok: E -> P(Token)` designates the tokens acquired by each event, and
    - `hb \subset Event x Event` is a happens before strict partial order where
      `forall e, f. tok(e) # tok(f) => (e-hb->f or f-hb->e)`.

An execution formalizes operations executing at various replicas concurrently,
and the happens before relation captures how these operations are propagated
between replicas. The transitivity of the happens before relation ensures at
least causal consistency.

Let

- `Exec(TS)` be the set of all executions over token system `TS`, and
- `ctxt(e, X) = (E, X.oper|E, X.rval|E, X.tok|E, X.hb|E)` be the context of `e`
  where `E = X.hb^-1(e)`. Intuitively, `ctxt(e, X)` is the subexection of `X`
  that only includes operations causally preceding `e`.

Executions are directed graphs of operations, but without a semantics, they are
rather meaningless. Here, we define a relation `evald_F \subset Exec(TS) x
P(State)` where `evald_F(Y)` is the set of all final states `Y` can be in after
all operations are propagated to all replicas. We'll see shortly that if all
non-token-conflicting operations commute, then `evald_F` is a function.

- `evald_F(Y) = {}` if `Y.E = {}`, and
- `evald_F(Y) = {F_e^eff(s)(s') | e \in max(Y), s \in evald_F(ctxt(e, Y)), s'
  \in evalfd_F(Y|Y.E - {e})}` otherwise.

Now,

- *Definition 2.* An execution `X \in Exec(TS)` is *consistent* with `TS` and
  `F` denoted `X |= TS, F` if `forall e \in X.e. exists s \in evald_F(ctxt(e,
  x)). X.val(e) = F_X.oper(e)^val(s) and X.tok(e = F_X.oper(e)^tok(s))`.

We let `Exec(TS, F) = {X | X |= TS, F}`. Consistent operations are closed under
context. Furthermore, `evald_F` is a function when restricted to consistent
executions where non-token-conflicting operations commute. We call this
function `eval_F`.

This model can model a number of consistency models:

- *Causal consistency.* Let `Token = {}`.
- *Sequential consistency.* Let `Token = {t}`, `t # t`, and `F_o^tok(s) = {t}`
  for all `o`.
- *RedBlue Consistency.* Let `Token = {t}`, `t # t`, and `F_o^tok(s) = {t}` for
  all red `o` and `F_o^tok(s) = {}` for all blue `o`.

**State Based Proof Rule.**
We want to construct a proof rule to establish the fact that `Exec(TS, F)
\subset eval_F^-1(I)`. That is, every execution results in a state that
satisfies the invariant. Since executions are closed under context, this also
means that all operations execute on a state that satisfies the invariant.

Our proof rule involves a *guarantee relation* `G(t)` over states which
describes all possible state changes that can occur while holding token `t`.
Similarly, `G_0` describes the state transitions that can occur without holding
any tokens.

Here is the proof rule.

- *S1*: `s_init \in I`.
- *S2*: `G_0(I) \subset I and forall t. G(t)(I) \subset I`.
- *S3*: `forall o, s, s'.`
    - `s \in I and`
    - `(s, s') \in (G_0 \cup G(F_o^tok(s)^\bot))* =>`
    - `(s', F_o^eff(s)(s')) \in G_0 \cup G(F_o^tok(s))`.

In English,

- *S1*: `s_init` satisfies the invariant.
- *S2*: `G` and `G_0` preserve the invariant.
- *S3*: If we start in any state `s` that satisfies the invariant and can
  transition in any finite number of steps to any state `s'` without acquiring
  any tokens conflicting with `o`, then we can transition from `s'` to
  `F_o^eff(s)(s')` in a single step using the tokens acquired by `o`.

**Event Based Proof Rule and Soundness.**
Instead of looking at states, we can instead look at executions. That is, if we
let invariants `I \subset Exec(TS)`, then we want to write a proof rule to
ensure `Exec(TS, F) \subset I`. That is, all consistent executions satisfy the
invariant. Again, we use a guarantee `G \subset Exec(TS) x Exec(TS)`.

- *E1*: `X_init \in I`.
- *E2*: `G(I) \in I.`
- *E3*: `forall X, X', X''. forall e in X''.E.`
    - `X'' |= TS, F and`
    - `X' = X''|X''.E - {e} and`
    - `e \in max(X'') and`
    - `X = ctxt(e, X'') and`
    - `X \in I and `
    - `(X, X') \in G* =>`
    - `(X', X'') \in G`.

This proof rule is proven sound. The event based rule and its soundness is
derived from this.

**Examples and Automation.**
The authors have built a banking, auction, and courseware application in this
style. They have also built a prototype that you give `TS`, `F`, and `I` and it
determines if `Exec(T, f) \subset eval_F^-1(I)`. Their prototype modifies the
state-based proof rule eliminating the transitive closure and introducing
intermediate predicates.
