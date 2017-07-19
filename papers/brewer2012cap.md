# [CAP Twelve Years Later: How the "Rules" Have Changed (2012)](https://scholar.google.com/scholar?cluster=17642052422667212790)
The CAP theorem dictates that in the face of network partitions, replicated
data stores must choose between high availability and strong consistency. In
this 12 year retrospective, Eric Brewer takes a look back at the CAP theorem
and provides some insights.

## Why 2 of 3 is Misleading
The CAP theorem is misleading for three reasons.

1. Partitions are rare, and when a system is not partitioned, the system can
   have both strong consistency and high availability.
2. Consistency and availability can vary by subsystem or even by operation. The
   granularity of consistency and availability doest not have to be an entire
   system.
3. There are various degrees of consistency and various levels of consistency.

## CAP-Latency Connection
After a node experiences a delay when communicating with another node, it has
to make a choice between (a) aborting the operation and sacrificing consistency
of (b) continuing with the operation anyway and sacrificing consistency.
Essentially, a partition is a time bound on communication. Viewing partitions
like this leads to three insights:

1. There is no global notion of a partition.
2. Nodes can detect partitions and enter a special partition mode.
3. Users can vary the time after which they consider the system partitioned.

## Managing Partitions
Systems should take three steps to handle partitions.

1. Detect the partition.
2. Enter a special partition mode in which nodes either (a) limit the
   operations which can proceed thereby decreasing availability or (b) continue
   with the operations decreasing consistency, making sure to log enough
   information to recover after the partition.
3. Recover from the partition once communication resumes.

## Which Operations Should Proceed
The operations which a node permits during a partition depends on the
invariants it is willing to sacrifice. For example, nodes may temporarily
violate unique id constraints during a partition since they are easy to detect
and resolve. Other invariants are too important to violate, so operations that
could potentially violate them are stalled.

## Partition Recovery
Once a system recovers from a partition it has to

1. make the state consistent again, and
2. compensate any mistakes made during the partition.

Sometimes a system is unable to automatically make the state consistent and
depends on manual intervention. Sometimes, the system can automatically restore
the state because it carefully rejected some operations during the partition.
Other systems can automatically restore consistency because they use clever
data structures like CRDTs.

Some systems, especially those which externalize actions (e.g. ATMs), must
sometimes issue compensations (e.g. emailing users).
