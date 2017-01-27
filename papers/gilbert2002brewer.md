## [Brewer's Conjecture and the Feasibility of Consistent, Available, Partition-Tolerant Web Services (2002)](https://scholar.google.com/scholar?cluster=17914402714677808535&hl=en&as_sdt=0,5)
Informally, The CAP theorem states that partition-tolerant distributed systems
cannot be simultaneously consistent and available. Informally,

- a *consistent* system is one which provides ACID-like guarantees;
- an *available* system is one where every request is met with a successful
  response;
- a *partition-tolerant* system is one which behaves correctly despite the
  possibility of partitions (duh!).

**Formal Model.**
Formally, we'll consider a distributed system that implements a single readable
and writeable *data object*. We say the data object is atomic, or consistent,
if it is linearizable. We say the data object is available if "every request
received by a non-failing node in the system [results] in a response." During a
network partition, messages sent across the partition can be arbitrarily lost.
Worse, any message can be lost by modelling it as an instantaneous network
partition between the sender and receiver. Thus, a partition-tolerant system
must be able to handle arbitrary message loss.

**Asynchronous Networks Impossibility Result.**
In an asynchronous network, messages can be reordered and delayed arbitrarily.
Moreover, nodes do not have any form of clock. They must "make decisions based
only on the messages received."

*Theorem 1* It is impossible in the asynchronous network model to implement a
read/write data object that guarantees availability and atomic consistency in
all fair executions (including those in which messages are lost).

*Proof.* Assume for contradiction there is a distributed system under the
asynchronous network model with at least two nodes that is available and
consistent in all fair executions.  Partition the network into two non-empty
subsets `G1` and `G2`, and assume that all messages are dropped between the two
partitions. Also assume the system has initial value `v0`. Consider an
execution which first sends a write request with value `v1 != v0` to `G1`.  By
availability, the write must be accepted. After it does, we issue a read
request to `G2`. Again by availability, we must receive a response. Since `G2`
has received no messages from `G1`, it must return `v0` which is inconsistent.

In our proof, we assumed that messages between the two partitions were dropped.
In the asynchronous model, this assumption is actually too strong. Intuitively,
`G2` cannot differentiate between dropped and delayed messages, so it suffices
to delay messages between `G1` and `G2` rather than just dropping them.

*Corollary 1.1* It is impossible in the asynchronous network model to implement
a read/write data object that guarantees availability in all fair executions
and atomic consistency in fair executions in which no messages are lost.

*Proof.* Take the counterexample execution from above. After the read returns,
deliver all outstanding messages from `G1` to `G2`. In this execution, all
messages are delivered, but the system is still inconsistent.

**Solutions in the Asynchronous Model.**
The CAP theorem tells us that partition-tolerant distributed registers cannot
be simultaneously consistent and available, but we can settle for less.

- *CP*. Trivially, a system which drops all requests is CP. However, we can
  often provide much better availability than this. For example, imagine if all
  nodes in the system forwarded requests to a single master node. This system
  is consistent, and as long as the master is alive, it is also available.
- *CA*. If you assume partitions will never happen, then you can have a
  consistent and available system.
- *AP*. Trivially, a system which always returns the initial value is available
  and partition-tolerant. Alternatively, you can settle for one of many weak
  consistency models.

**Partially Synchronous Networks Impossibility Result.**
In the partially synchronous network model, nodes are equipped with timers that
progress at the same rate. This allows them to trigger events to occur after a
certain amount of time. For example, they can send a message and wait for a
response with a timeout. Moreover, we assume that every message is delivered in
at most `t_msg` or is otherwise lost.

*Theorem 2.* It is impossible in the partially synchronous network model to
implement a read/write data object that guarantees availability and atomic
consistency in all executions (even those in which messages are lost).

*Proof.* The proof is the same as the proof for Theorem 1 with some slight
differences I don't quite understand.

**Solutions in Partially Synchronous Networks.**
The partially synchronous analogue of Corollary 1.1 does not hold. That is,
assuming all messages are delivered, a system can achieve both consistency and
availability. For example, the CP system described above satisfies this
property.

**Weaker Consistency.**
We can easily implement weaker consistency models in the partially synchronous
network model. Here, we define *t-Connected Consistency*. We say an execution
of a read-write object is t-Connected Consistent if

1. If no messages are lost, t-Consistent Consistency is equivalent to
   linearizability.
2. If messages are lost, then there exists a partial order P such that
    1. Writes are totally ordered in P, and reads are ordered with respect to
       writes.
    2. The value returned by every read is the value of the preceding write or
       the initial value if no such write exists.
    3. The ordering of events at each node is respected by P.
    4. If there is an interval of time longer than t in which no messages are
       lost, a completes before the interval, and b starts after the interval,
       then b does not precede a in P.

Intuitively, t-Connected Consistency is very similar to linearizability except
that requests can be reordered when messages are being dropped. We can
implement a read-write data object that is t-Connected Consistent for some t
defined below. We designate a single node as the master node.

- When a read arrives at a node, it forwards it to the master. If the master
  responds, the value is cached and returned to the client. If the master does
  not respond, then the value with the highest sequence number cached at the
  node is returned to the client.
- When a write arrives at a node, it sends it to the master. The node
  acknowledges the client after a response from the master or after a timeout.
  The node periodically sends unacknowledged values to the master.
- When a write arrives at the master, it assigns the write an increasing
  sequence number. Periodically, it broadcasts the latest value and sequence
  number.

Let P be the partial order where writes are ordered according to their sequence
number and reads follow the write that produced its value. Letting t be enough
time for a write to commit and a broadcast to happen, this system is
t-Connected Consistent.
