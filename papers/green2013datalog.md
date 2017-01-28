# [Datalog and Recursive Query Processing (2013)](https://scholar.google.com/scholar?cluster=11160406363745186504&hl=en&as_sdt=0,5)
Datalog's popularity peaked in the 1980s and 1990s before its hype dwindled.
Recently however, Datalog has been making a comeback, showing up in bigger and
badder applications in both academia and industry. This book surveys the
syntax, semantics, evaluation, extensions, and applications of Datalog.

## A First Example
Let `link` be a binary relation where `(X, Y)` is in `link` (denoted `link(X,
Y)`) if there is a *link* from `X` to `Y`. The following Datalog program
computes a binary relation `reachable` where `reachable(X, Y)` if there is a
*path* from `X` to `Y`.

```
r1: reachable(X, Y) :- link(X, Y)
r2: reachable(X, Y) :- link(X, Z), reachable(Z, Y)
```

The program consists of two rules, `r1` and `r2`. Notably, `r2` is a
**recursive** rule. In fact it is a **linear recursive** rules.

To evaluate the program, we can begin with `reachable` empty. Then, we
repeatedly use the rules in the program to compute new tuples that belong in
`reachable`. We repeat these iterations to a fixpoint. This is known as **naive
evaluation**.

A slightly more sophisticated approach would not re-evaluate a rule like
`link(X, Z), reachable(Z, Y)` if `X`, `Y`, and `Z` were already in `link` and
`reachable` in a previous iteration. That is, we do not want to redundantly
recompute facts we already know. This corresponds loosely to **semi-naive
evaluation**.

Both of these approaches are **bottom-up** (also known as **forward
chaining**).  Prolog, on the other hand, begins with a query and works
backwards finding derivations. This **top-down** approach (also known as
**backwards chaining**) does not compute irrelevant facts. Bottom-up approaches
can be optimized so that they also do not compute irrelevant facts.

## Language
A Datalog program is composed of a set of rules of the form
    `A :- B1, ..., Bn`
where `A` is the **head** and `B1, ..., Bn` is the **body**. A couple of
definitions:

- A **term** (e.g. `X`) is a constant or variable.
- Things like `link` or `reachable` are **predicate symbols** or **functions**.
- An **atom** (or **goal**) is a predicate symbol with terms as arguments (e.g.
  `link(X, Y)`).
- An atom with constant arguments is a **ground atom**.
- Predicate symbols are either **extensional database** (EDB) predicates if
  they belong to a base table or are **intensional database** (IDB) predicates
  if they are derived by a Datalog program.
- A **database instance** is a set of ground instances.
- A **source database instance** is a database instance in which all atoms are
  from EDB predicates.
- The **active domain** is the set of all constants in a database.
- The **Herbrand base** of a Datalog program `P`, denoted `B(P)`, is the set of
  all atoms (EDB or IDB) in computed by `P`.
- A **fact rule** is a rule with an empty body and with no free variables
  appearing in the head.
- A **ground instance** of a rule is the rule in which all variables are
  replaced with constants.

Finally, the **range restriction property** says that all variables in the head
of a rule must appear in the body of the rule.

## Model-Theoretic Semantics
There are three equivalent semantics for core Datalog. The first is the
model-theoretic semantics. In the model theoretic semantics, rules like
`reachable(X, Y) :- reachable(X, Z), link(Z, Y)` are viewed as constraints
`forall X, forall Y, forall Z. reachable(X, Z) and link(Z, Y) ==>
reachable(X, Y)`. A **model** of a source database instance `I` and Datalog
program `P` is a superset `I'` of `I` that satisfies all the constraints.

There always exists a unique minimal model which we denote `P(I)` and the size
of `P(I)` is polynomial with respect to the size of `I`. This result follows
from the following two findings:

1. Consider the database instance `I'` that we get if we let `R(x1, ..., xn)`
   be in `I'` for every IDB predicate `R` and every constants `x1`, ..., `xn`
   in the active domain. `I'` is a model. The size of `I'` is polynomial with
   respect to the size of the active domain. The degree of the polynomial is
   the largest predicate arity in `I`.
2. The intersection of any two models is a model.

Assume for contradiction there did not exist a unique minimal model. 2 tells us
that we can intersect any two minimal models to get a smaller model, violating
our assumption that they were unique. Since there exists a unique minimal
model, either `I'` from 1 is the unique minimal model, or the minimal model is
smaller than it. This implies that the unique minimal model is at worst
polynomial in the size of `I`.

## Fixpoint-Theoretic Semantics
An atom `A` is an **immediate consequence** of program `P` and database instance
`I` if either

1. `A` is a ground atom in an EDB predicate of `I` or
2. `A :- B1, ..., Bn` is a ground instance of a rule in `P`.

The **immediate consequence operator** `T_P` maps database instance `I` to the
set of all atoms `A` such that `A` is an immediate consequence of `P` and `I`.
For any `P` and any `I`, there exists a unique least fixpoint `I` (i.e. `T_P(I)
= I`) and `I = P(I)`. That is, the least fixpoint of `T_P` is equivalent to the
unique minimal model.

Repeatedly applying the immediate consequence operator produces the least
fixpoint it a polynomial number of steps. Each application of the operator
takes a polynomial amount of time. Thus, computing the least fixpoint takes a
polynomial amount of time.

## Proof-Theoretic Semantics
We can also view the meaning of a Datalog program `P` and source database
instance `I` as the set of all ground atoms provable using the ground atoms in
`I` as axioms and the rules in `P` as inference rules.

## Negation
All core Datalog programs are monotone (this is best understood with the
proof-theoretic semantics). That is, for any Datalog program `P` and pair of
source database instances `I` and `J`, if `I` is a subset of `J`, then `P(I)`
is a subset of `P(J)`. This means that core Datalog programs cannot compute
non-monotone queries. For example, we cannot compute a predicate
`unreachable(X, Y)` showing when a node `Y` is unreachable from a node `X`. We
can compute such a predicate if we have negation

```
reachable(X, Y) :- link(X, Y)
reachable(X, Y) :- link(X, Z), reachable(Z, Y)
node(X) :- link(X, _)
node(Y) :- link(_, Y)
unreachable(X, Y) :- node(X), node(Y), not reachable(X, Y)
```

but unfettered negation can lead to some nonsensical programs:

```
p :- not q
q :- not p
```

Here, both `{p}` and `{q}` are minimal models and minimal fixpoints of `P`, but
neither is unique. Moreover, using the proof-theoretic semantics, neither `p`
nor `q` can be proved. To avoid these nonsensical programs, we have to restrict
the use of negation in Datalog programs. We first look at **semipositive
Datalog with negation** and then **stratified Datalog with negation**.

## Semipositive Datalog with Negation
In semipositive Datalog with negation, negation can only appear on an EDB atom.
For example, we can negate `link(X, Y)` but not `reachable(X, Y)`. Moreover,
any variable that appears in the head of a rule must appear in a non-negated
atom in the body of the rule. If we had a rule like this `p(X) :- not q(X)`
then a minimal model could be infinite and depend on values outside of the
source database instance.

The semantics of semipositive Datalog with negation are straightforward. Both
the model-theoretic and fixpoint-theoretic semantics carry over nicely, though
the proof-theoretic semantics do not. As with core Datalog, a least fixpoint of
a semipositive Datalog program can be always be found in polynomial time.

## Stratified Datalog with Negation
A **stratification** of Datalog program `P` is an ordered partition `P1, ...,
Pn` of the IDB predicates in `P` where

1. If `A :- ..., B, ...` appears in `P`, `A` belongs to `Pi`, and `B` belongs
   to `Pj`, then `i >= j`. Intuitively, `A` can belong to the same strata as
   `B` or a future one.
2. If `A :- ..., not B, ...` appears in `P`, `A` belongs to `Pi`, and `B`
   belongs to `Pj`, then `i > j`. Intuitively, `A` must belong to a future
   strata than `B`.

A Datalog program `P` is **stratifiable** if there exists a stratification of
`P`. Given a stratification of `P`, we can run each strata in turn as a
semipositive Datalog with negation program. After each strata is run, its IDB
predicates become EDB predicates for the next strata. It turns out that all
stratifications produce the same result.

We can determine if a program is stratifiable and find a stratification using a
precedence graph. Each IDB predicate becomes a vertex and

1. If `A :- ..., B, ...` appears in the program, then there is an edge from `B`
   to `A`.
2. If `A :- ..., not B, ...` appears in the program, then there is an edge from
   `B` to `A` labelled with a negation.

If the precedence graph is free of cycles in which one edge of the cycle is
labelled with a negation, then the program is stratifiable. Each strongly
connected component of the graph becomes a strata and a topological sort of the
strata orders them. Using a neat algorithm, all of this can be done in linear
time with respect to the number of IDB predicates. Stratifiable Datalog
programs with negation can be run in polynomial time.

The **Immerman-Vardi theorem** says that any query that can be computed in
polynomial time can be expressed by a stratifiable Datalog program with
negation. We've also seen that every stratifiable Datalog program with negation
can be run in polynomial time. This means that stratifiable Datalog with
negation programs capture exactly the queries that can be computed in
polynomial time. Note however that the term "query" is very technical and also
assumes that the active domain is ordered.

## Aggregation
Stratifiable Datalog programs with negation cannot compute aggregates (e.g.
`count`, `sum`, `max`, `min`, `average`) which might come in handy. For
example, we cannot compute the number of nodes reachable from a node `X`:

```
reachable(X, Y) :- link(X, Y)
reachable(X, Y) :- link(X, Z), reachable(Z, Y)
summary(X, count<Y>) :- reachable(X, Y)
```

An **aggregate function** maps bags of values to a single value. An **aggregate
term** is an expression `f<t1, ..., tk>` where `f` is an **aggregate function
sumbol** of arity `k` and `t1` to `tk` are ordinary terms. We also augment the
range restriction property with a new clause:

- If a variable `X` appears in an aggregate term in the head of a rule, it
  cannot appear in the head of a rule outside an aggregate term.

The head variables that do not appear in an aggregate term are known as
**grouping variables**. The meaning of a aggregate in Datalog is pretty much
the same as a GROUP BY in SQL. For example, the Datalog

```
sales_by_product(Product, sum<Sales>) :- sales(Product, City, Sales)
```

is equivalent to the SQL

```
SELECT   S.Product, SUM(S.Sales)
FROM     Sales S
GROUP BY S.Product;
```

Like with negation, unfettered aggregation can lead to some wonky programs:

```
p(X) :- q(X)
p(sum<X>) :- p(X)
```

Here, if `q(1)` and `q(2)`, then we use the first two rules to derive `p(1)`
and `p(2)`. Then, we use the third rule to deduce `p(3)`. But then we have to
deduce `p(6)` and `p(12)` and so on *ad infinitum*.

Like with negation, we can avoid this nonsense with stratification. A
stratification of a Datalog program `P` with both aggregation and negation is
an ordered partition of the IDB predicates in `P` such that:

1. If `A :- ..., B, ...` appears in `P`, `A` belongs to `Pi`, and `B` belongs
   to `Pj`, then `i >= j`. Intuitively, `A` can belong to the same strata as
   `B` or a future one.
2. If `A :- ..., not B, ...` appears in `P`, `A` belongs to `Pi`, and `B`
   belongs to `Pj`, then `i > j`. Intuitively, `A` must belong to a future
   strata than `B`.
3. If `A :- ..., B, ...` appears in `P`, `A` includes an aggregate term and
   belongs to `Pi`, and `B` belongs to `Pj`, then `i > j`.

We can modify the precedence graph algorithm from before. We introduce an edge
from `B` to `A` labelled with an aggregation if `A :- ..., B, ...` and `A`
includes an aggregate. There exists a stratification if there does not exist
any cycles with either an aggregate or negation edge.

We can update the immediate consequence operator to handle aggregation and then
the fixpoint-theoretic semantics carry over. Model-theoretic semantics also
carry over nicely.

Finally, there are a number of optimizations we can do to avoid computing
unnecessary parts of an aggregation. See the paper for an example with
computing shortest paths.
