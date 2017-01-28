# [Datalog and Recursive Query Processing (2013)](https://scholar.google.com/scholar?cluster=11160406363745186504&hl=en&as_sdt=0,5)
Datalog's popularity peaked in the 1980s and 1990s before its hype dwindled.
Recently however, Datalog has been making a comeback, showing up in bigger and
badder applications in both academia and industry. This book surveys the
syntax, semantics, evaluation, extensions, and applications of Datalog.

## A First Example
Let `link` be a binary relation where `(X, Y)` is in `link` (denoted `link(X,
Y)`) if there is a **link** from `X` to `Y`. The following Datalog program
computes a binary relation `reachable` where `reachable(X, Y)` if there is a
**path** from `X` to `Y`.

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
## Proof-Theoretic Semantics
