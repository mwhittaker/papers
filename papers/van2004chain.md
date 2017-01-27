## [Chain Replication for Supporting High Throughput and Availability (2004)](https://scholar.google.com/scholar?cluster=3366172945601823602)
File systems and databases are two examples of *storage systems*. A *storage
service* sits somewhere between a file system and database and is expected to

- *store* objects,
- run *queries* against single objects, and
- perform *atomic updates* of single objects.

Chain replication is a simple algorithm to implement a distributed storage
service with high throughput, high availability, and linearizability (yup,
that's right; we've got a CA system on our hands) using fail-stop servers.

**Storage Service Interface.**
A storage service supports two operations:

- `query(objId, opts)` and
- `update(objId, newVal, opts)`.

`query(o, opts)` performs a query against the object with id `o` returning
something specified by `opts`. A query is idempotent and does not modify the
object. `update(o, n, opts)` performs a (possibly non-deterministic)
computation on the old value of `o` and `n` to produce a value `v` that is
assigned to the object. It is not idempotent.

Storage services are allowed to ignore any request received from the user.
Since this behavior is indistinguishable from a request being dropped by the
network, clients must handle this behavior anyway.

**Chain Replication Protocol.**
Servers are assumed to be *fail-stop*. That is, servers aren't Byzantine and
servers an detect when other servers fail.

A chain replicated service with `t + 1` nodes can tolerate `t` failures before
sacrificing availability. The `t + 1` nodes arrange themselves into a linear
chain with the first node called the head and the last node called the tail.
There are three components to the algorithm:

- *Reply Generation.* Replies sent to clients are generated and sent by the
  tail.
- *Query Processing.* Query operations are sent to and processed by the tail.
- *Update Processing.* Updates are sent to the head. The head executes the
  update and then forwards the result of the update down the chain. Each node
  in the chain performs the update before forwarding it downstream.

Ignoring failures for the moment, note that this provides linearizability. All
operations are totally ordered by the tail. Also note that reads are cheap
(they touch only 1 node) and writes are expensive (they touch all nodes).

**Coping with Server Failure.**
Failures are handled by a single master which is assumed to never fail. In
practice, this can be achieved by replicating the master using something like
Paxos. The master

- detects the failures of the servers (which can be done because they are
  fail-stop),
- informs each server of its new predecessor and successor, and
- informs servers which node is the head and which is the tail.

Let `Hist_i` be the history of an object at node `i`. The history of an object
is just the sequence of operations applied to the object since the beginning of
time. Let `Hist_i <= Hist_j` if the history at node `i` is a prefix of the
history at node `j`. The *Update Propagation Invariant* says that if node `i`
precedes node `j` in the chain then `Hist_j <= Hist_i`. In words, each node has
a prefix of its predecessor's history. Using this invariant, we analyze three
failure scenarios.

- *Failure of the Head.* When the head fails, the master appoints the successor
  of the head as the new head. If the old head had pending updates, they are
  lost, but this is acceptable behavior. If the head didn't have any pending
  updates, then nothing is lost.
- *Failure of the Tail.* The predecessor of the tail becomes the new tail. The
  Update Propagation Invariant tells us that the new tail has everything the
  old tail had and potentially then some.
- *Failure of Other Servers.* When a node `S` in the middle of the chain fails,
  the master will notify the successor `S+` and predecessor `S-`, but it must
  be careful not to violate the Update Propagation Invariant. Imagine node `S`
  had pending updates it hadn't yet sent to `S+` when it failed. If new updates
  come and `S-` forwards them to `S+`, then the history at `S+` is not a prefix
  of the history of `S-`.

  To avoid this, each node `i` maintains a set `Sent_i` of pending updates that
  it has sent downstream that may not have been processed yet by the tail.
  Whenever a node sends an update downstream, it adds it to `Sent_i`. When the
  tail processes an update, it sends an acknowledgement to its predecessor. Upon
  receiving an acknowledgement for an update, node `i` removes the update from
  `Sent_i` and forwards the acknowledgement to its predecessor.

  When `S` fails, `S-` must sent `Send_S-` to `S+` before it begins forwarding
  new updates. Doing this preserves the Update Propagation Invariant.

When a node fails, the number of non-crashed nodes in the chain decreases. The
fewer the nodes, the more likely it is to lose availability. Thus, it is
desirable to add nodes to the chain. A new node can be added anywhere in the
chain, but it's easiest to do at the end. The new tail receives the history
from the old tail. While this is happening, the old tail is free to process
updates, so long as it records them in `Sent_i`. When the new tail is ready,
the old tail forwards the pending operations and the master informs the servers
and clients of the new node.

**Primary/Backup Protocols.**
In a Primary/Backup system, a single master replicates operations to a set of
backups in parallel. Chain replication is similar to primary/backup techniques,
but there are a few differences. First, a query at a primary may need to stall
waiting for a pending update to be acknowledged by a backup. With chain
replication, queries never stall. On the other hand, chain replication has much
higher update latency that primary/backup systems. Moreover, when nodes in a
chain replicated system fail, there is typically fewer messages that have to be
sent to resolve the failure compared to when a node fails in a primary/backup
system.
