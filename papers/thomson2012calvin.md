# [Calvin: Fast Distributed Transactions for Partitioned Database Systems (2012)](https://scholar.google.com/scholar?cluster=11098336506858442351)
Some distributed data stores do not support transactions at all (e.g. Dynamo,
MongoDB). Some restrict transactions to a single row (e.g. BigTable). Some
support ACID transactions but only single-partition transactions (e.g.
H-Store). Calvin---when combined with an underlying storage system---is a
distributed database that supports distributed ACID transactions without
incurring the overhead of protocols like Paxos or two-phase commit.

## Deterministic Database Systems
In a traditional distributed database, a node executes a transaction by
acquiring some locks, reading and writing data, and then participating in a
distributed commit protocol like two-phase commit. Because these distributed
commit protocols are slow, the node ends up holding locks for a long period of
time, a period of time called the **contention footprint**. As contention
footprints increase, more and more transactions block and the throughput of the
system goes down.

Calvin shrinks contention footprints by having nodes agree to commit a
transaction *before* they acquire locks. Once they agree, they *must* execute
the transaction as planned. They cannot abort.

To understand how to prevent aborts, we first recall why protocols like
two-phase commit abort in the first place. Traditionally, there are two
reasons:

1. **Nondeterministic events** like a node failure.
2. **Deterministic events** like a transaction with an explicit abort.

Traditional commit protocols abort in the face of nondeterministic events, but
fundamentally don't have to. In order to avoid aborting a transaction in the
face of node failure, Calvin runs the same transaction on multiple nodes. If
any one of the nodes fail, the others are still alive to carry the transaction
to fruition. When the failed node recovers, it can simply recover from another
replica.

However, if we execute the same batch of transactions on multiple nodes, it's
possible they may execute in different orders. For example, one node might
serialize a transaction `T1` before another transaction `T2` while some other
node might serialize `T2` before `T1`. To prevent replicas from diverging,
Calvin implements a deterministic concurrency control scheme which ensures that
all replicas serialize all transactions in the same way. In short, Calvin
predetermines a global order in which transactions should commit.

<!-- TODO(mwhittaker): Understand this part of the paper. -->
The paper also argues that deterministic events can be handled in a one-phase
protocol, though I don't understand the details.

## System Architecture
Calvin is not a stand-alone database. Rather, it is a piece of software that
you layer on to an existing storage system. Calvin, along with a storage
system, has three main layers:

1. The **sequencing layer** globally orders all transactions. Nodes execute
   transactions in a way that is equivalent to this global serial order.
2. The **scheduling layer** executes transactions.
3. The **storage layer** stores data.

## Sequencing and Replication
Clients submit transactions to one of the many sequencing nodes in Calvin.
Calvin windows the transactions into 10 millisecond epochs. At the end of each
epoch, a sequencing node will (asynchronously or synchronously) replicate the
batch of transactions. Then, it will send the relevant transactions to the
other partitions in its replica. Once a sequencing node receives all the
transactions during a given epoch, it orders them by unique sequencing node id.

Sequencing nodes can replicate transactions in one of two ways. First, a
sequencing node can immediately send transactions to other sequencing nodes and
replicate transactions asynchronously. This makes recovery very complex.
Second, sequencing nodes in the same **replication group** can run Paxos.

## Scheduling and Concurrency Control
Calvin transactions are written in C++, and each transaction must provide its
read and write set up front (more on this momentarily). Each scheduling node
acquires locks locally and runs two-phase locking with a minor variant:

- If transaction `A` is scheduled before transaction `B` in the global order,
  then `A` must acquire any locks that conflict with `B` before `B` acquires
  them.

Transaction execution proceeds as follows.

1. A node analyzes the read and write set of a transaction to determine which
   reads and writes are remote.
2. A node performs all local reads.
3. A node sends its local reads to the other nodes that need them.
4. A node collects remote reads sent by other nodes.
5. A node runs the transaction and performs local writes.

Transactions must specify their read and write sets ahead of time, but the read
and write set of some transactions---dubbed **dependent transactions**---depend
on values read. To support these transactions, Calvin implements **optimistic
lock location prediction** (OLLP). First, the transaction is run unreplicated
and the read and write set is recorded. Then, the transaction is issued again
with this read and write set. Once the transaction acquires locks, it checks
that the read set has not changed.

## Calvin with Disk-Based Storage
Deterministic scheduling means that transactions execute less concurrently. If
transaction `A` precedes and conflicts with transaction `B`, then `B` has to
wait for `A` to finish before acquiring locks, fetching data from disk, and
then executing. Fetching data from disks while holding locks increases the
contention footprint of the transaction.

To overcome this, a sequencing node does not immediately send a transaction to
a scheduler if it knows the transaction will end up blocking. Instead, it
delays sending the transaction and notifies the scheduler to fetch all the
needed pages into memory. To do this effectively, Calvin must (a) estimate disk
IO latencies and (b) record which pages have been fetched into memory. The
mechanism to do this are future work.

## Checkpointing
Calvin supports three forms of checkpointing for recovery:

1. Naively, Calvin can freeze one replica and snapshot it allowing the other
   replicas to continue processing.
2. Calvin implements a variant of the Zig-Zag algorithm in which a certain
   point in the global transaction order is marked for checkpoint. All
   transactions that execute after the point write to new versions of the data.
   The old versions are checkpointed.
3. If the underlying storage system supports multiple versions, Calvin can
   leverage that for checkpointing.
