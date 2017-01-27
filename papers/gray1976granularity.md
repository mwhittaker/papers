## [Granularity of Locks and Degrees of Consistency in a Shared Database (1976)](https://scholar.google.com/scholar?cluster=15730220590995320737&hl=en&as_sdt=0,5)
**Granularity of Locks Summary.**
Locks are needed in a database system to ensure that transactions are isolated
from one another. But what exactly should be locked?

At one extreme, we could lock the entire database using a single lock. This
*coarse-grained* approach has incredibly low locking overhead; only one lock is
ever acquired. However, it limits the amount of concurrency in the system. Even
if two transactions operate on disjoint data, they cannot run concurrently
using a single global lock.

At the other extreme, we could lock individual fields inside of records. This
*fine-grained* approach has incredibly high concurrency. Two transactions could
execute concurrently on the same record, so long as they access disjoint
fields!  However, this approach has very high locking overhead. If the
transaction needs to read a lot of fields from a lot of records, it will spend
a lot of time acquiring a lot of locks.

A compromise between these to extremes is to use *multiple granularity
locking*, where a transaction can choose the granularity of its locks. For
example, one transaction may lock a table, another may lock a page, and another
may lock a record. Note, however, that unlike with single granularity locking,
care must be taken to ensure that locks at different granularities do not
conflict. For example, imagine one transaction has an exclusive lock on a page;
another transaction must be prohibited from acquiring an exclusive lock on the
table that the page belongs to.

In this paper, Gray et al. present an implementation of multiple granularity
locking that exploits the hierarchical nature of databases. Imagine a
database's resources are organized into a hierarchy. For example, a database
has tables, each table has pages, and each page has records. A transaction can
acquire a lock on any node in this hierarchy of one of the following types:

- IS: An *intention shared lock* on a node indicates that a transaction plans
  on acquiring a shared lock on one of the descendants of the node.
- IX: An *intention exclusive lock* on a node indicates that a transaction
  plans on acquiring an exclusive lock on one of the descendants of the node.
- S: A *shared lock* on a node implicitly grants the transaction shared read
  access to the subtree rooted at the node.
- SIX: A *SIX lock* on a node implicitly grants the transaction shared read
  access to the subtree rooted at the node and simultaneously indicates that
  the same transaction may acquire an exclusive lock on one of the descendants
  of the node.
- X: An *exclusive lock* on a node implicitly grants the transaction exclusive
  read and write access to the subtree rooted at the node.

Transactions acquire locks starting at the root and obey the following
compatibility matrix:

|     | IS  | IX  | S   | SIX | X   |
| --- | --- | --- | --- | --- | --- |
| IS  | ✓   | ✓   | ✓   | ✓   |     |
| IX  | ✓   | ✓   |     |     |     |
| S   | ✓   |     | ✓   |     |     |
| SIX | ✓   |     |     |     |     |
| X   |     |     |     |     |     |

More specifically, these are the rules for acquiring locks:

1. If a transaction wants an S or IS lock on a node, it must acquire an IX or
   IS lock on its parent.
2. If a transaction wants an X, SIX, or IX lock on a node, it must acquire a
   SIX, or IX lock on its parent.
3. Locks are either released in any order all at once after the transaction or
   released from leaf to root.

This locking protocol can easily be extended to directed acyclic graphs (DAGs)
as well. Now, a node is implicitly shared locked if one of its parents is
implicitly or explicitly shared locked. A node is implicitly exclusive locked
if all of its parents are implicitly or exclusive exclusive locked. Thus when a
shared lock is acquired on a node, it implicitly locks all nodes reachable from
it. When an exclusive lock is acquired on a node, it implicitly locks all nodes
[dominated](https://en.wikipedia.org/wiki/Dominator_(graph_theory)) by it.

The paper proves that if two lock graphs are compatible, then the implicit
locks on the leaves are compatible. Intuitively this means that the locking
protocol is equivalent to the naive scheme of explicitly locking the leaves,
but it does so without the locking overhead.

The protocol can again be extended to *dyamic lock graphs* where the set of
resources changes over time. For example, we can introduce *index interval
locks* that lock an interval of the index. To migrate a node between parents,
we simply acquire X locks on the old and new location.

**Degrees of Consistency Summary.**
Ensuring serializability is expensive, and some applications can get away with
weaker consistency models. In this paper, Grey et al. present three definitions
of four degrees of consistency.

First, we can informal define what it means for a transaction to observe degree
i consistency.

- Degree 0: no dirty writes.
- Degree 1: Degree 0 plus no writes are committed until the end of the
  transaction.
- Degree 2: Degree 1 plus no dirty reads.
- Degree 3: Degree 2 plus repeatable reads.

Second, we can provide definitions based on locking protocols.

- Degree 0: Short X locks.
- Degree 1: Long X locks
- Degree 2: Long X locks and short read locks.
- Degree 3: Long X locks and long read locks.

Finally, we can define what it means for schedule to have degree i consistency.
A transaction is a sequence of begin, end, S, X, unlock, read, and write
actions beginning with a begin and ending with an end. A schedule is a
shuffling of multiple transactions. A schedule is serial if every transaction
is run one after another. A schedule is legal if obeys a locking protocol. A
schedule is degree i consistent if every transaction observes degree i
consistency according to the first definition.

- *Assertion 1*. Definition 2 implies definition 3. That is, using the locking
  protocol for degree i ensures degree i consistent schedules.
- *Assertion 2*. Transactions can pick their consistency.

Define the following relations on transactions:

- `T1 < T2` if there is a write-write dependency between T1 and T2.
- `T1 << T2` if `T1 < T2` or there is a write-read dependency between T1 and
  T2.
- `T1 <<< T2` if `T1 << T2` or there is a read-write dependency between T1 and
  T2.

Let `<*`, `<<*`, and `<<<*` be the transitive closure of `<`, `<<`, and `<<<`.
If `<*`, `<<*`, `<<<*` is a partial order for a schedule, then the schedule is
degree 1, 2, 3 consistent.

