# [Efficient Querying and Maintenance of Network Provenance at Internet-Scale (2010)](https://scholar.google.com/scholar?cluster=16215370428886082563)
**Network provenance** is like provenance, but over the network. It lets you
point at a piece of state in a distributed protocol and ask how it was derived.
Network provenance is useful to debug, find performance bottlenecks, and so on.
This paper makes the following contributions:

1. It presents a **distributed data model for network provenance**. That is, it
   describes a way to physically organize network provenance into a bunch of
   horizontally partitioned relations.
2. It describes a way to **efficiently maintain and query provenance**.
   Essentially, as an instrumented program executes, it proactively maintains a
   set of data structures which it can later use to answer provenance queries.
   It is analogous to a program generating profiles at runtime which a
   profile-guided optimizer later uses to optimize the program. This paper
   describes how to maintain those data structures and how to use them to
   answer queries.
3. It introduces the **ExSPAN prototype** which implements (1) and (2).

## Declarative Networks
**Declarative networks** are distributed systems (or protocols) implemented
using **NDLog**: a variant of Datalog that is very similar to Bloom.

## Network Provenance
Network provenance can be characterized by three axes:

1. **Granularity.** There are three granularities of network provenance.
       - **Tuple-level** provenance is most similar to traditional provenance.
         It records every derivation (including all intermediate results) of
         every tuple.
       - **Node-level** provenance can be used to track which nodes a
         particular output tuple has been on, but does not necessarily include
         information about specific derivations.
       - Finally, **trust domain level** provenance groups together nodes into
         trust domains and provides information about which trust domains a
         tuple has been in.
2. **Representation.** The granularity of provenance determines how provenance
   information is stored. For example, tuple-level provenance requires that the
   system stores all derivations while node-level provenance allows the system
   to store less information. Provenance can also be represented using
   provenance semirings, and provenance semirings can be compressed using BDDs.
3. **Distribution.** All provenance information can be stored on a single
   centralized node, or provenance information can be distributed across
   machines.

## Provenance Data Model
The provenance of a tuple `t` is represented as a graph `(V,E)` where the
vertex set `V` consists of **tuple vertices** (representing base and
intermediate tuples) and **rule execution vertices** (representing rule
instantiations). An edge from tuple vertex `t` to rule execution vertex `r`
signifies that `t` is an input to `r`. An edge from `r` to `t` represents that
`r` derived `t`. Essentially, we take a proof tree

```
        w(b,c)
        ------ [r2]
y(a,b)  z(b,c)
-------------- [r1]
     x(a)
```

and convert everything into a vertex:

```
          [w(b,c)]
             ||
            [r2]
             ||
 [y(a,b)] [z(b,c)]
     \\     //
       [r1]
        ||
      [x(a)]
```

Each tuple vertex `foo(a, b, c)` is assigned a **VID** `SHA-1(foo + a + b +
c)`. Each rule execution vertex `r@x` with children `a, b, c` is assigned a
**RID** `SHA-1(r + x + a + b + c)`. Provenance information is then stored in
two tables:

1. `prov(@Loc, VID, RID, RLoc)`, and
2. `ruleExec(@RLoc, RID, R, VIDList)`

where

- `prov(@LOC, VID, RID, RLoc)` signifies that the tuple with VID `VID` resides
  at `LOC` and can be derived using the rule with RID `RID` which resides at
  `RLoc`; and
- `ruleExec(@RLoc, RID, R, VIDList)` signifies that the rule with RID `RID`
  resides at `RLoc`, has label `R`, and has children with VIDs in `VIDList`.

With these two tables, we can answer provenance queries (more on this later).
When tuples are sent from one node to another, they include the `RID` and
`RLoc` of the rule that derived them. This approach is known as the
**reference-based approach** to network provenance. In alternative approach,
known as the **value-based approach**, each tuple carries around all entries of
`prov` and `ruleExec` needed to form its provenance.

## Distributed Provenance Maintenance
Given an NDLog program, ExSPAN rewrites each inference rule into a set of
inference rules which maintains the `prov` and `ruleExec` rules. That is,
whenever a tuple is inserted or deleted, the corresponding entries of `prov`
and `ruleExec` are simultaneously updated. The specifics of the rewrite are
complicated; see the paper for details.

## Querying Provenance
Users express a provenance query in the form `eProvQuery(@X, QID, VID, Ret)`
which returns the provenance of tuple with VID `VID` residing at `X` to the
node `Ret`. The query is also given a unique identifier `QID`. ExSPAN can
answer a query like this with 10 NDLog rules (see paper for details). These ten
rules are parametrized on three predicates---`f_pEDB`, `f_pIDB`, and
`f_pRULE`---which users can use to customize the result of the query. For
example, they can use them to return provenance semirings or return a count of
the number of derivations for a particular tuple.

## Query Optimization
ExSPAN performs optimizations to reduce the latency and bandwidth requirements
of provenance queries.

- The (intermediate) results of queries are cached so that similar queries can
  avoid redundant work. When tuples are inserted or deleted, the corresponding
  cache entries are invalidated.
- By default, query processing performs a breadth-first search. A depth-first
  search can be more efficient when evaluating threshold queries like "does the
  number of derivations exceed 10?"
- ExSPAN can sometimes condense provenance semiring using BDDs.
