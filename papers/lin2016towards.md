# [Towards a Non-2PC Transaction Management in Distributed Database Systems (2016)](https://scholar.google.com/scholar?cluster=9359440394568724083)
For a traditional single-node database, the data that a transaction reads and
writes is all on a single machine. For a distributed OLTP database, there are
two types of transactions:

1. **Local transactions** are transactions that read and write data on a single
   machine, much like traditional transactions. A distributed database can
   process a local transaction as efficiently as a traditional single-node
   database can.
2. **Distributed transactions**  are transactions that read and write data
   that is spread across multiple machines. Typically, distributed databases
   use two-phase commit (2PC) to commit or abort distributed transactions.
   Because 2PC requires multiple rounds of communications, distributed
   databases process distributed transactions less efficiently than local
   transactions.

This paper presents an alternative to 2PC, dubbed **Localizing Executions via
Aggressive Placement of data (LEAP)**, which tries to avoid the communication
overheads of 2PC by aggressively moving all the data a distributed transaction
reads and writes onto a single machine, effectively turning the distributed
transaction into a local transaction.

## LEAP
LEAP is based on the following assumptions and observations:

- Transactions in an OLTP workload don't read or write many tuples.
- Tuples in an OLTP database are typically very small.
- Multiple transactions issued one after another may access the same data again
  and again.
- As more advanced network technology becomes available (e.g. RDMA), the cost
  of moving data becomes smaller and smaller.

With LEAP, tuples are horizontally partitioned across a set of nodes, and each
tuple is stored exactly once. Each node has two data structures:

- a **data table** which stores tuples, and
- a horizontally partitioned **owner table** key-value store which stores
  ownership information.

Consider a tuple `d = (k, v)` with primary key `k` and value `v`. The owner
table contains an entry`(k, o)` indicating that node `o` owns the tuple with
key `k`. The node `o` contains a `(k, v)` entry in its data table. The owner
table key-value store is partitioned across nodes using any arbitrary
partitioning scheme (e.g. hash-based, range-based).

When a node initiates a transaction, it requests ownership of every tuple it
reads and writes. This migrates the tuples to the initiating node and updates
the ownership information to reflect the ownership transfer. Here's how the
ownership transfer protocol works. For a given tuple `d = (k, v)`, the
**requester** is the node requesting ownership of `d`, the **partitioner** is
the node with ownership information `(k, o)`, and the owner is the node that
stores `d`.

- First, the requester sends an **owner request** with key `k` to the
  partitioner.
- Then, the partitioner looks up the owner of the tuple with `k` in its owner
  table and sends a **transfer request** to the owner.
- The owner retrieves the value of the tuple and sends it in a **transfer
  response** back to the requester. It also deletes its copy of the tuple.
- Finally, the requester sends an **inform** message to the partitioner
  informing it that the ownership transfer was complete. The partitioner
  updates its owner table to reflect the new owner.

Also note that

- if the requester, partitioner, and owner are all different nodes, then this
  scheme requires **4 messages**,
- if the partitioner and owner are the same, then this scheme requires **3
  messages**, and
- if the requester and partitioner are the same, then this scheme requires **2
  messages**.

If the transfer request is dropped and the owner deletes the tuple, data is
lost. See the appendix for information on how to make this ownership transfer
fault tolerant. Also see the paper for a theoretical comparison of 2PC and
LEAP.

## LEAP-Based OLTP Engine
L-Store is a distributed OLTP database based on H-Store which uses LEAP to
manage transactions. Transactions acquire read/write locks on individual tuples
and use strict two-phase locking. Transactions are assigned globally unique
identifiers, and deadlock prevention is implemented with a wait-die scheme
where lower timestamped transactions have higher priority. That is, higher
priority threads wait on lower priority threads, but lower priority threads
abort rather than wait on higher priority threads.

Concurrent local transactions are processed as usual; what's interesting is
concurrent transfer requests. Imagine a transaction is requesting ownership of
a tuple on another node.

- First, the requester creates a **request lock** locally indicating that it is
  currently trying to request ownership of the tuple. It then sends an owner
  request to the partitioner.
- The partitioner may receive multiple concurrent owner requests. It processes
  them serially using the wait-die scheme. As an optimization, it processes
  requests in decreasing timestamp order to avoid aborts whenever possible. It
  then forwards a transfer request to the owner.
- If the owner is currently accessing the tuple being requested, it again uses
  a wait-die scheme to access the tuple before sending it back to the owner.
- Finally, the owner changes the request lock into a normal data lock and
  continues processing.

If a transaction cannot successfully get ownership of a tuple, it aborts.
L-Store also uses logging and checkpointing for fault tolerance (see paper for
details).
