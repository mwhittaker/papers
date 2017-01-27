## [The Homeostasis Protocol: Avoiding Transaction Coordination Through Program Analysis (2015)](https://scholar.google.com/scholar?cluster=7243022338856545577&hl=en&as_sdt=0,5)
Strong consistency is easy to reason about, but typically requires coordination
which increases latency. Weaker consistency can improve performance but is
difficult to reason about. This paper presents a program analysis and
distributed protocol to run transactions with coordination-free strong
consistency.

**Analysing Transactions.**
We model a database as a finite map from objects to integers. Transactions are
ordered sequences of reads, writes, computations, and prints; this is
formalized below. A transaction `T` executes on a database `D` to produce a new
database `D'` state and a log `G'` of printed values. Formally, `eval(D, T) =
<D', G'>`.

*Symbolic tables* categorize the behavior of a transaction based on the initial
database sate. Formally, a symbolic table for transaction `T` is a binary
relation `Q` of pairs `<P, T'>` where `P` is a formula in first order logic
describing the contents of a database, and `T'` is a transaction such that `T`
and `T'` are observationally equivalent when run on databases satisfying `P`. A
symbolic table can also be built for a set of transactions.

Formally, transactions are expressed in a language `L` which is essentially IMP
with database reads, database writes, and prints. A somewhat simple recursive
algorithm walks backwards through the program computing symbolic tables.
Essentially, the algorithm traces all paths through the programs control flow.

There is also a higher-level language `L++` which can be compiled to `L`.

**Homeostasis Protocol.**
Assume data is partitioned (not replicated) across a cluster of `K` nodes. We
model a distributed database as a pair `<D, Loc>` where `D` is a database and
`Loc` is a function from objects to an index between 1 and `K`. Each
transaction `T` runs on a site `i`; formally, `l(T) = i`. For simplicity, we
assume that transactions only write to objects local to the site it is running
on.

Each transaction runs on some site. It reads fresh versions of values on the
site and stale versions of values on other sites. Nodes establish treaties with
one another such that operating with stale data does not affect the correctness
of the transaction. This is best explained by way of example. Imagine the
following transaction is running on a site where x is remote.

```
x' = r(x)
if x' > 0:
    write(y = 1)
else:
    write(y = 2)
```

If we establish the treaty `x > 0`, then it doesn't matter what the actual
value of `x` is. We now formalize this notion.

Given a database `D`, a *local-remote partition* is a function `p` from objects
to booleans. We can represent a database `D` with respect to a local-remote `p`
as a pair `(l, r)` where `l` is a vector of values `x` such that `p(x)`, and
`r` is a vector of values `x` such that `not p(x)`. In words, we can model a
database as disjoint sets of local and remote values.

We say `<(l, r), G> = <(l', r') G'>` if `l = l'` and `r = r'`. Given a database
`D`, local-remote partition `p`, transaction `T`, and set of vectors `L` and
`R`, we say `(L, R)` is a *local-remote slice* (LR-slice) for `T` if `Eval((l,
r), T) = Eval((l, r'), T)` for all `l` in `L` and `r, r'` in `R`. In words, (L,
R) is a local-remote slice for T if T's output depends only on the values of
local values.

A *global treaty* Gamma is a subset of possible database states. A global
treaty is valid for a set of transactions `{T1, ..., Tn}` if `({l | (l, r) in
Gamma}, {r | (l, r) in Gamma})` is an LR-slice for all `T`.

The homoeostasis protocol proceeds in rounds where each round has three phases:

1. *Treaty generation* The system generates a treaty for the current database state.
2. *Normal execution.* Transactions can execute without coordination reading a
   snapshot of remote values. After each site executes a transaction, it checks
   that it does not bring the database to a state outside the treaty. If it
   doesn't, the transaction is committed. If it does, we enter the next phase.
3. *Cleanup.* All sites synchronize and communicate all values that have
   changed since the last round. All sites then run the transaction that caused
   the violation. Finally, we enter the next round.

**Generating Treaties.**
Two big questions remain: how do we generate treaties, and how do we enforce
treaties?

Given an initial database state `D`, we could always pick `Gamma = {D}`. This
requires that we synchronize after every single database modification. We want
to pick the treaties that let us run as long as possible before synchronizing.
We can pick the predicate `P` in the symbolic table that `D` satisfies but this
isn't guaranteed to be a valid treaty. Instead we take the predicate `P` and
divide it into a set of local treaties `P1, ..., PK` where the conjunction of
all local treaties imply the global treaty. Moreover, each local treaty must be
satisfied by the database. The conjunction of the local treaties is our global
treaty and is guaranteed to be valid.

Finding good local treaties is not easy. In fact, it can be undecidable pretty
easily. We limit ourselves to linear arithmetic and leverage SMT solvers to do
the heavy lifting for us. First, we decompose the global treaty into a
conjunction of linear constraints. We then generate templates from the
constraints and instantiate them using Z3.

**Homeostasis in Practice.**
Roy et al. present a homoeostasis prototype. An offline preprocessing component
takes in L++ transactions and computes join symbolic tables, using tricks to
keep the tables small. It them initializes global and local treaties. The
online execution component executes the homeostasis protocol described above.
It is implemented in Java over MySQL. The analysis uses ANTLR-4 and Z3.
