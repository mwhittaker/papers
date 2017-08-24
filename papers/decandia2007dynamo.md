# [Dynamo: Amazon's Highly Available Key-value Store (2007)](https://scholar.google.com/scholar?cluster=5432858092023181552&hl=en&as_sdt=0,5)
## Overview
Amazon has a service-oriented infrastructure which consists of a large number
of networked services, each with a strict *SLA*: a formal contract between the
clients and server which guarantees the server meet certain performance
benchmarks (e.g. 99.9% of responses are within 500 milliseconds). Amazon's
user-facing business model makes it more important to meet the SLAs by
providing availability, scalability, and low-latency than it is to provide
strong consistency. Dynamo is Amazon's distributed higly-available eventually
consistent zero-hop distributed hash table (a.k.a. key-value store) that uses
consistent hashing, vector clocks, quorums, gossip, and more.

## System Interface
Dynamo is a key-value store where the values are arbitrary blobs of data. Users
can issue `get(key)` requests which returns either an object or a list of
conflicting objects and a context. If multiple objects are returned, the user
is responsible for merging them. Moreover, users can issue `put(key, context,
value)` requests where `context` is used to maintain version clocks.

## Partitioning Algorithm
Dynamo uses consistent hashing to partition data very similarly to Chord. Data
is hashed into a circular space. Nodes are broken down into virtual nodes, each
of which is randomly provided a point in the circular key space. Each node is
responsible for all the keys between it and its predecessor. The number of
virtual nodes at each physical node can be tuned according to the capacity of
the node.

## Replication
Data is sent to a *coordinator* which writes the data locally and also sends
the data to N-1 other nodes. Moreover, each data item has a *preference list*
of nodes where it should be written, and each node in the system knows the
preference list for all data items.

## Data Versioning
Data in Dynamo is timestamped with a vector clock. If a write `a` happens
before a write `b`, then the two writes can be reconciled trivially; this is
known as *syntactic reconciliation*. However, if `a` and `b` are concurrent,
then the system or the user has to perform *semantic reconciliation*. To avoid
vector clocks of unbounded size, vector clocks are given a maximum size, and
each entry in a vector clock is timestamped with a physical time. When the
vector clock exceeds its maximum size, the oldest entry is evicted.

## Execution of `get()` and `put()`
To execute a `get()` or `put()`, a Dynamo client can

1. Issue a request to a load balancer, or
2. issue it itself if it is a partition aware client (more on this later).

Dynamo uses quorums to write data. A read must be acknowledged by `R` servers,
a write must be acknowledged by `W` servers, and `R + W > N`.

## Handling Failures
Dynamo uses a *sloppy quorum* where data can be stored at a node outside its
preference list. The data is tagged with the node where the data should be, and
the node transfers it there eventually. Moreover, preference lists span
multiple data centers.

## Handling Permanent Failures
Nodes user Merkle trees to determine what state has diverged from one another.

## Membership and Failure Detection
Membership changes are initiated manually by a human. Nodes gossip membership
information and use it transfer data to the newly joined and removed nodes.
There are also seed nodes in the ring which nodes always gossip with to avoid
a split ring.

## Implementation
Dynamo is implemented with a pluggable storage engine and uses a SEDA
architecture implemented in Java.

## Experiences and Lessons Learned
Amazon has learned a lot from its experience with Dynamo:

- *Balancing performance and durability.* Improving durability can decrease
  performance. For example, if we want to write to `W` nodes, then increasing
  `W` decreases the availability of the system. Dynamo allows writes to be
  buffered by nodes, rather than written to their disks to increase
  availability at the cost of durability.
- *Ensuring uniform load.* Assuming there are enough hot keys, hashing data
  into a circular key space should ensure uniform load. However, the
  partitioning scheme described above where each node is divided into some
  number of virtual nodes, the virtual nodes are placed randomly on the ring,
  and the node placement determines data partitioning has some downsides. Two
  alternatives are to divide the key space into equal sized partitions and give
  each node a random number of virtual nodes. Or, to divide the key space into
  equal sized partitions and adjust the total number of tokens as nodes join
  and leave the system.
- *How many divergent versions.* Evaluation showed that there were not many
  divergent data items.
- *Client or server coordination.* Instead of communicating with a load
  balancer, clients can periodically request membership information and route
  requests themselves.
- *Balancing foreground and background.* Dynamo uses a resource controller to
  implement admission control for background tasks, preventing them from
  interfering with important foreground tasks.
