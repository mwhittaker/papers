# [C-Store: A Column-oriented DBMS (2005)](https://scholar.google.com/scholar?cluster=12924804892742402591)
Row-oriented databases---databases that store data a row at a time---are
write-optimized and suitable for OLTP workloads. Column-oriented
databases---databases that store data a column at a time---are read-optimized
and are suitable for OLAP workloads. This paper presents C-Store: a distributed
shared-nothing column-oriented database.

C-Store has a number of notable features which make it super fast. First,
C-Store physically stores relations as sets of compressed columns called
projections. Second, projections are divided between large read-optimized
storage (RS) and smaller writable-storage (WS). A tuple mover periodically
moves tuples from WS to RS. Finally, read-only queries can be run on a past
snapshot of the data.

## Data Model
Consider a table `R(a,b,c)`. A **projection** anchored on R is a subset of the
columns of `R` (without deduplication) sorted on some subset of the columns
called the **sort key**.  For example `R1(a,b)` sorted on `a`, `R2(b,c)` sorted
on `c` and `R3(a,c)` sorted on `c,a` are all projections anchored on `R`.
C-Store stores a table as a set of projections that cover the table.

Projections are stored column-wise and are horizontally range-partitioned on
their sort key into a set of **segments**. Segments distributed across the
nodes in a C-Store cluster. Moreover, the same column can appear in multiple
projections. Projections can include columns from other relations as well so
long as the two tables are linked by a foreign key.

Column entries in a projection are assigned a logical **storage key** that is
unique within a segment (but not across segments). Column entries with the same
storage key belong to the same logical tuple. Column entries in WS explicitly
store their storage keys whereas tuples in RS compute them when necessary based
on entry offsets.

C-Store uses **join indexes** to combine multiple projections together. A join
index from one projection `P1` to another `P2` is a two-columned relation that
is the exact same size as `P1`. The ith row of the join index is a tuple
`(s,sk)` which says that the ith tuple in `P1` corresponds to the tuple in
segment `s` of `P2` with storage key `sk`. Note that join indexes are difficult
to maintain in the face of updates.

## Read-Optimized Storage
Columns in RS are compressed in one of four ways depending on (a) whether the
column is part of the sort key (**self-ordered**) or not (**foreign-ordered**)
and (b) how many distinct values are in the column.

<center>
  <table>
    <tr>
      <td></td>
      <td>__Self-Ordered__</td>
      <td>__Foreign-Ordered__</td>
    </tr>
    <tr>
      <td>__Few Distinct Values__</td>
      <td>
        A column is stored as set of `(v,f,n)` tuples where value `v` appears
        `n` times at index `f`. A dense B+ tree is stored on the `v` field.
      </td>
      <td>
        A column is stored as a set of `(v,b)` tuples where `b` is a bitmap
        indicating which entries have value `v`. A dense B+ tree maps indexes
        to values.
      </td>
    </tr>
    <tr>
      <td>__Many Distinct Values__</td>
      <td>
        A column is stored as blocks of `value,delta,delta,delta`. For example,
        the sequence `0,3,7,7,9` is stored as `0,3,3,0,2`.
      </td>
      <td>
        Here, a column is not compressed.
      </td>
    </tr>
  </table>
</center>

## Writable Storage
WS has the same physical design as RS; relations are stored as a collection of
projections.  Moreover, WS is horizontally partitioned exactly like RS, so that
each segment in RS is co-located with its corresponding segment in WS.

WS does not compress its projections. Whenever a tuple is inserted into WS, it
is assigned a storage key larger than any in RS, and each column entry
explicitly stores its storage key. Each column has a B+ tree mapping storage
key to value, and a single B+ tree maps sort keys to storage key.

## Updates and Transactions
C-Store stratifies time into a sequence of **epochs** and supports historical
queries at a particular epoch.  C-Store maintains a lower and upper bound on
the epochs at which a query can be run dubbed the **low water mark** and **high
water mark**.

In order to support historical queries, tuples are not updated in place.
Instead, updates are represented as deletion followed by an insertion. Thus, a
historical query at epoch `t` must determine the tuples which were inserted
before `t` and deleted after `t`.  To do, WS maintains an **insertion vector**
and **deleted record vector** which contain the epoch during which each tuple
was inserted and deleted. Tuples in RS are guaranteed to have been inserted
before the low water mark.

To maintain the high water mark, C-Store designates one node as the **timestamp
authority**. Periodically, the timestamp authority sends a message to all other
nodes telling them to increment their epoch. When a node receives this message,
it increments its epoch and waits for all pending transactions to finish before
responding to the timestamp authority. Once the timestamp authority hears back
from all nodes, it increments the high water mark.

C-Store uses strict two-phase locking, write ahead logging, a recovery
mechanism similar to ARIES, and a distributed commit protocol similar to
two-phase commit. See the paper for more details.

<!-- TODO(mwhittaker): Understand this section more deeply. -->

## Tuple Mover
Periodically, a tuple mover moves tuples from WS into RS. It first selects all
the tuples that were inserted before the low watermark. The ones that were
deleted before the low watermark are thrown away. The others are merged into
RS.

The tuple mover creates a new segment `S'` for a segment `S` in RS. It moves
any tuples from `S` into `S'` that were not deleted and also merges in the
tuples from WS. After finishing the merge and updating join indexes, `S` and
`S'` are swapped. The timestamp authority periodically increments the low
watermark.

## Query Execution
Query plans in C-Store are built with the following operators:

- **`Decompress`** decompresses a compressed column.
- **`Select`** produces a bitmap for a selection.
- **`Mask`** applies a bitmap to a projection.
- **`Project`** projects column.
- **`Sort`** sorts a projection by a sort key.
- **`Aggregation Operators`** aggregate.
- **`Concat`** concatenates multiple projections sorted on the same key.
- **`Permute`** permutes a projection according to a join index.
- **`Join`** joins.
- **`Bitstring Operators`** performs bitwise operations.

The work-in-progress C-Store query optimizer differs from a traditional
row-oriented query optimizer because it has to take into account (a) the cost
of decompressing data vs operating on compressed data and (b) which projections
to use to implement a query.
