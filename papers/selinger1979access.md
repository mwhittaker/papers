# [Access Path Selection in a Relational Database Management System (1979)](https://scholar.google.com/scholar?cluster=102545501597608314)
SQL queries declaratively describe some subset of the tuples in a database, but
they do not specify the method by which these tuples should be retrieved. The
same SQL query can be implemented in *many* different ways. For example, a
single-relation query can be implemented with a full table scan, with an index
scan, with an index-only scan, etc. Each of these different methods of
accessing tuples is called an **access path**, and it's the job of the query
optimizer to select the most efficient access path. This paper explores how
System R's query optimizer selects access paths.

## Processing of a SQL Statement
A SQL query goes through four phases: parsing, optimization, code generation,
and execution. First, the query is **parsed** where it is decomposed into a set
of SELECT-FROM-WHERE **query blocks**. Then, it is **optimized**. The optimizer
first typechecks the query against type information in the catalog. It then
chooses an order to evaluate the blocks and for each block chooses an access
path. Each access path is expressed in the **Access Specification Language**
(ASL). Then, the ASL plans are **compiled** to machine code by a table-driven
code generator that maps specific forms of joins to precompiled machine code.
Subqueries are treated as subroutines. Finally, the query is ready to be
**executed**.

## Research Storage System
The **Research Storage System** (RSS) is System R's storage subsystem that is
responsible for managing the physical layout and physical access of relations.
Tuples are stored in 4KB pages, and pages are logically organized into
segments. Tuples from different relations can share the same pages (each tuple
is annotated with the id of its relation), but each relation is sequestered to
a single segment. Tuples are accessed through the tuple-oriented Relation
Storage Interface (RSI) which supports an OPEN/NEXT/CLOSE scan interface. The
RSI supports full segment scans as well as B-tree backed index scans (including
range scans). Moreover, the RSI accepts a set of **search arguments** or
(SARGS)&mdash;a collection of predicates of the form `column op value` in
disjunctive normal form&mdash;to filter the returned tuples. If a predicate is
in the form `column op value`, we say it's a **sargable predicate**.

## Costs for Single Relation Access Paths
System R's query optimizer tries to select an access path which minimizes cost
as defined by the following formula:

```
COST = PAGE_FETCHES + w*RSI_CALLS
```

`PAGE_FETCHES` (the number of page fetches) is a measure of the amount of I/O a
query has to perform, and `RSI_CALLS` (the number of calls to the RSI) is a
measure of the amount of CPU a query has to perform. `RSI_CALLS` also
approximates the number of tuples a query returns.

The System R catalog maintains the following statistics which are used by the
query optimizer. They are updated periodically.

- **`NCARD(T)`**: the cardinality of relation `T`.
- **`TCARD(T)`**: the number of pages that hold tuples from relation `T`.
- **`P(T)`**: `TCARD(T)` divided by the number of pages in `T`'s segment.
- **`ICARD(I)`**: The number of distinct keys in index `I`.
- **`NINDX(I)`**: the number of pages in index `I`.

The WHERE clause of a query is considered in conjunctive normal form, and each
conjunct is called a **boolean factor**. The query optimizer estimates a
**selectivity factor** `F` for each boolean factor with the following rules.

<table>
<tr>
<td>`column = value`</td>
<td>`F = 1 / ICARD(column index)`</td>
<td>If there exists an index.</td>
</tr>
<tr>
<td>`column = value`</td>
<td>`F = 1 / 10`</td>
<td>If there does not exist an index.</td>
</tr>
<tr>
<td>`column1 = column2`</td>
<td>`F = 1 / MAX(ICARD(columnn1 index), ICARD(columnn2 index))`</td>
<td>If there exists two indexes.</td>
</tr>
<tr>
<td>`column1 = column2`</td>
<td>`F = 1 / ICARD(columnni index)`</td>
<td>If there exists one index.</td>
</tr>
<tr>
<td>`column1 = column2`</td>
<td>`F = 1 / 10`</td>
<td>If there does not exist an index.</td>
</tr>
<tr>
<td>`column > value`</td>
<td>`F = (high key - value) / (high key - low key)`</td>
<td>If `column` is arithmetic.</td>
</tr>
<tr>
<td>`column > value`</td>
<td>`F = 1/3`</td>
<td>If `column` is not arithmetic.</td>
</tr>
<tr>
<td>`column BETWEEN value1 AND value2`</td>
<td>`F = (value2 - value1) / (high key - low key)`</td>
<td>If `column` is not arithmetic.</td>
</tr>
<tr>
<td>`column BETWEEN value1 AND value2`</td>
<td>`F = 1/4`</td>
<td>If `column` is not arithmetic.</td>
</tr>
<tr>
<td>`column IN (list of values)`</td>
<td>`F = (number of items in list) * (F for column=value)`</td>
<td>Capped at `1/2`.</td>
</tr>
<tr>
<td>`column IN subquery`</td>
<td>`F = (expected cardinality of subquery result) /
     (product of subquery FROM cardinalities)`</td>
<td></td>
</tr>
<tr>
<td>`a OR b`</td>
<td>`F = F(a) + F(b) - F(a)*F(b)`</td>
<td></td>
</tr>
<tr>
<td>`a AND b`</td>
<td>`F = F(a)*F(b)`</td>
<td></td>
</tr>
<tr>
<td>`NOT a`</td>
<td>`F = 1 - F(a)`</td>
<td></td>
</tr>
</table>

The cardinality of query (QCARD) is the product of the sizes of the relations
in the FROM clause multiplied by the selectivity factor of every boolean factor
in the WHERE clause. The number of RSI calls (RSICARD) is the product of the
sizes of the relations in the FROM clause multiplied by the selectivity of the
sargable boolean factors.

Some access paths produce tuples in a particular order. For example, an index
scan produces tuples in the order of the index key. If this order is consistent
with the order of a GROUP BY or ORDER BY clause, we say it is an **interesting
order**. The query optimizer computes the minimum cost unordered plan and the
minimum cost plan for every interesting order. After taking into account the
(potential) additional overhead of sorting unordered tuples for a GROUP BY or
ORDER BY, the least cost plan is selected.

The following costs include the number of index pages fetched, then the number
of data pages fetched, and then the number of RSI calls weighted by `W`.

<table>
<tr>
<td>Unique index matching an equal predicate.</td>
<td>`1 + 1 + W`</td>
</tr>
<tr>
<td>Clustered index `I` matching one or more boolean factors.</td>
<td>`F(preds)*(NINDX(I) + TCARD) + W*RSICARD`</td>
</tr>
<tr>
<td>Non-clustered index `I` matching one or more boolean factors.</td>
<td>`F(preds)*(NINDX(I) + NCARD) + W*RSICARD`</td>
</tr>
<tr>
<td>Clustered index `I` not matching any boolean factors</td>
<td>`NINDX(I) + TCARD + W*RSICARD`</td>
</tr>
<tr>
<td>Non-clustered index `I` not matching any boolean factors</td>
<td>`NINDX(I) + NCARD + W*RSICARD`</td>
</tr>
<tr>
<td>Segment scan.</td>
<td>`TCARD/P + W*RSICARD`</td>
</tr>
</table>

## Access Path Selection for Joins
The System R query optimizer considers access plans with (pipelined)
tuple-nested loop joins and sort-merge joins. The most critical part of
choosing an access plan is choosing a join order. There are `n!` left-deep
access plans for `n` relations (that's a lot). To avoid enumerating all of
them, the query optimizer uses dynamic programming.

First, it determines the cheapest single-relation access path for each relation
and for each interesting order. Note that interesting orders now include
ordering by a GROUP BY or ORDER BY clause *and* any joining predicates which
could take advantage of the order with a sort-merge join.
Then, it determines the cheapest 2-way join with each single-relation access
path as the outer relation. Then, it determines the cheapest 3-way join with
the 2-way joins as the outer relation. And so on.

The query optimizer performs a couple of tricks to speed up this algorithm.
First, it does not consider a cross-join if there are other more selective
joins possible. Second, it computes interesting order equivalence classes to
avoid computing redundant interesting orders. For example, if there are
predicates `E.DNO = D.DNO` and `D.DNO = F.DNO`, then all three columns belong
to the same equivalence class.

This algorithm computes at worst (2<sup>n</sup> times the number of interesting
orders) intermediate access paths.

## Nested Queries
Non-correlated subqueries are evaluated once before their parent query.
Correlated subqueries are evaluated every time the parent query is evaluated.
As an optimization, we can sort the parent tuples by the correlated column and
compute the subquery once for every unique value of the correlated column.
