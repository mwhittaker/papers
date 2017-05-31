# [Building Efficient Query Engines in a High-Level Language (2014)](https://scholar.google.com/scholar?cluster=11118963220228843116)
Traditionally, query compilation is done using **template expansion**.
Fragments of a SQL query are pattern matched and substituted with one of a set
of hand-written machine code fragments. Template expansion

- prevents inter-operator optimizations,
- is very brittle and hard to implement, and
- prevents re-compilation based on runtime information.

LegoBase is a query engine written in Scala that avoids these pitfalls.
LegoBase compiles the heck out of a query plan (also written in Scala) into a C
program that can execute the query plan. LegoBase performs a number of
optimizations that other query compilers do not do. Plus, it's written in a
high-level language!

## An Example Query
Consider the following SQL query:

```sql
SELECT *
FROM (SELECT S.D,
             SUM(1-S.B) AS E,
             SUM(S.A*(1-S.B)),
             SUM(S.A*(1-S.B)*(1+S.C))
      FROM S
      GROUP BY S.D) T, R
WHERE R.Z = T.E AND R.B = 3
```

A traditional query compiler will likely miss the following optimization
opportunities:

- There are many common subexpressions (e.g. `1-S.B`, `S.A*(1-S.B)`) which can
  be eliminated.
- A naive implementation of this query will first create a hash table to store
  the aggregates of `T`. Then, if the join is a hash join, another hash table
  will be created to store `T`. We can materialize `T` into a single hash table
  rather than materializing it twice.
- Instead of storing `T` into a hash table, we can play some tricks and use an
  array instead.

## Staged Compilation and LMS
LegoBase makes heavy use of **Lightweight Modular Staging** (LMS): a library
for compiling and optimizing (at runtime) high-level Scala fragments into
lower-level Scala fragments. For example, this Scala code:

```scala
def snippet(x: Rep[Int]) = {
  def compute(b: Boolean): Rep[Int] = {
    if (b) 1 else x
  }
  compute(true)+compute(1==1)
}
```

is compiled to this:

```scala
def snippet(x1:Int): Int = {
  2
}
```

and this code:

```scala
def snippet(x: Rep[Int]) = {
  def compute(b: Rep[Boolean]): Rep[Int] = {
    if (b) 1 else x
  }
  compute(x==1)
}
```

is compiled to this:

```scala
def apply(x3:Int): Int = {
  val x4 = x3 == 1
  val x5 = if (x4) { 1 } else { x3 }
  x5
}
```

In short, LMS partially evaluates as much of the Scala code as it can while
leaving the expressions of `Rep[T]` to be computed by the compiled code.

LMS compiles Scala to Scala. LegoBase extends LMS by compiling LMS-produces
Scala into C code. Moreover, LegoBase introduces a set of database-specific
optimizations.

## General Execution Workflow
A LegoBase-equipped database begins by converting a SQL query into a query plan
using an off-the-shelf query optimizer. It then takes the query plan and
replaces each operator with a LegoBase operator. It then compiles the heck out
of the query plan using LMS and other tricks to produce a C program which can
execute the query.

This architecture also allows LegoBase to re-compile queries based on changing
runtime information. For example, the compiled code does not need to have any
conditionals checking whether a `log` flag is set. Instead, LegoBase can
recompile the code every time the `log` flag is toggled.

## Generating Efficient C Code
Lowering and compiling LMS-produced Scala code is reasonably straightforward.
High-level features like objects and inheritance are compiled away, while
low-level features like loops and conditionals are translated in the obvious
way. There are two bits of complication though:

1. If the Scala code calls into a Scala library (e.g. it uses a hash map from
   the standard library), the corresponding C code has to call into an
   appropriate library. LegoBase compiles data structure library calls into
   calls to GLib.
2. Scala has a garbage collector and C doesn't. LegoBase requires that source
   Scala code manually annotates allocations and deallocations.

## Optimizations
Next, we take a look at the optimizations LegoBase provides.

### Pull to Push
Some have argued that a Volcano-style pull based model of execution incurs
unnecessary overhead. A faster approach is for data to be repeatedly pushed
upwards through a tree until it is materialized (e.g. in a hash table
somewhere). LegoBase converts pull based operators into push based operators.

First, callees have to be converted to callers. Instead of the `next` method
returning a single tuple, `next` instead repeatedly (i.e. in a while loop)
generates a tuple `t` and calls `parent.next(t)`. Second, callers have to be
converted to callees. The `next` method is converted to a `next(t: Record)`
method which accepts a tuple pushed by a child.

### Eliminating Redundant Materializations
As mentioned earlier, naive implementations of certain query plans can
unnecessarily materialize a tuple in multiple places. LegoBase allows you to
pattern match on a query plan and eliminate redundant materializations. For
example, one pattern might match hash joins whose left child is an aggregate
and replace it with a single operator that only materializes the aggregates
once.

### Data Structure Specialization
It's convenient to write operators using hash tables, but hash tables sometimes
be a bit slow. LegoBase can convert hash tables to arrays whose size is set
based on runtime estimates of query size. It can also inline hash and equality
functions used by the hash table.

### Changing Data Layout
LegoBase can automatically convert operators that use a row-oriented data
layout into operators that use a column-oriented data layout. If all queries
are known ahead of time, the optimizer can even remove unneeded columns.

<link href='../css/default_highlight.css' rel='stylesheet'>
<script src="../js/highlight.pack.js"></script>
<script>hljs.initHighlightingOnLoad();</script>
