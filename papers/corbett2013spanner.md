# [Spanner: Google's Globally Distributed Database (2012)](https://scholar.google.com/scholar?cluster=3523173873845838643)
Spanner is Google's globally distributed, linearizable, semi-relational
database. It supports full linearizable read-write transactions, read-only
transaction, and snapshot read transactions. It implements linearizable
transactions using TrueTime.

## Implementation
A (global) Spanner instance called a **universe** (e.g. test, dev, prod). Each
universe contains multiple databases, and the data within a database is
replicated across multiple **zones**. Each zone has

- hundreds of **span servers** which store and serve data,
- a **zone master** which assigns data to span servers, and
- multiple **location proxies** that the span servers use to find the zone
  master.

A universe also has a single **universe master** that's used to debug a
universe and a single **placement driver** which moves data between zones.

Each span server manages 100-1000 **tablets** where each tablet is dictionary
of type `(key: string, timestamp: int64) -> string`. Tablets are stored in B+
trees and write-ahead logs which are stored in Colossus. Each tablet is
replicated across multiple span servers in multiple zones using Paxos. This
group of span servers is called a **Paxos group**.

One member of each Paxos group is designated as leader. The leader maintains a
lock table for pessimistic concurrency control. It also implements a
transaction manager and acts as a **participant leader**; the other members of
the Paxos group are **participant slaves**. The participant leader performs
two-phase commit with other participant leaders. The leader of the two-phase
commit is the **coordinator leader**; the other participant leaders are
**coordinator slaves**.

Each tablet contains multiple directories. A **directory** is a contiguous
range of rows prefixed by the same key. Data is moved between Paxos groups
directory by directory (e.g. to reduce load on a Paxos group, to co-locate
directories commonly accessed together, to place a directly geographically
closer to a reader).

Spanner supports a hierarchical relational model in which certain relations are
nested under parent relations. Every table *must* have a primary key and the
primary key of a child table is prefixed by the primary key of the parent
table. A row of a root table is stored contiguously with the rows of its
children forming a directory.

## TrueTime
TrueTime is a library for getting bounds on the actual global time. It provides
a function `TT.now()` which returns a tuple `(earliest, latest)` with the
guarantee that the actual time is somewhere between `earliest` and `latest`.

The TrueTime API is implemented with a combination of GPS clocks and atomic
clocks spread across multiple **time masters** within a data center.
Periodically, time masters synchronize with one another. Time masters also
check against their local clock, evicting themselves if there is too much
drift. TrueTime clients poll multiple time masters and run Marzullo's
algorithm.

## Concurrency Control
Spanner labels every transaction with a timestamp. It supports four types of
transactions:

1. (Linearizable) read-write transactions.
2. (Linearizable) read-only transactions.
3. Snapshot read transactions at a user specified timestamp.
4. Snapshot read transactions with a user specified staleness bound.

Spanner guarantees that transactions are linearizable, so if a transaction `T1`
commits before transaction `T2` starts, then the timestamp of `T1` must be less
than the timestamp of `T2`. To do so, it ensures that the timestamp of a
transaction is between the actual start time and the actual end time. Here's
how it does that:

- **Start** When a transaction arrives at Spanner, Spanner retrieves an
  interval `(earliest, latest)` using TrueTime.  It then ensures that the
  transaction's timestamp is greater than `latest`.
- **Commit** When Spanner is about to commit a transaction, it retrieves an
  interval `(earliest, latest)` using TrueTime and waits until `earliest` is
  greater than the timestamp.

Spanner implements Paxos with long-lived leaders. Leaders establish disjoint
leases during which they are leader. A Paxos group assigns timestamps in
monotonically increasing fashion.

Read-only transactions at time `t` can be serviced by any partition that is
up-to-date enough with respect to `t`. To know whether a partition is up to
date, each partition maintains a `t_safe` high watermark. `t_safe` is the
minimum of a safe Paxos timestamp `t_Paxos` and a safe two-phase commit
timestamp `t_TM`. `t_Paxos` is the timestamp of the oldest Paxos write, and
since Paxos writes are processed in order, so no write will precede `t_Paxos`.
`t_TM` is a lower bound on the commit time of pending transactions.

Clients buffer reads and writes as they execute a transaction. To read, they
contact a replica leader to acquire read locks and use keepalives to hold on to
their locks. When they are done with their transaction, they send their
buffered writes to a coordinator leader to initiate two-phase commit.

Spanner also implements atomic schema change.
