## [Discretized Streams: Fault-Tolerant Streaming Computation at Scale (2013)](https://scholar.google.com/scholar?cluster=4915408824809554257&hl=en&as_sdt=0,5)
**Summary.**
Many big data applications necessitate streaming (aka real-time, interactive,
or low-latency) data processing. For example

- a social network like Facebook may want to determine trending topics,
- a site like Twitter may want to detect recent spam, or
- a service operator may want to continuously monitor logs for failures.

There are many streaming data processing systems out there (e.g. Storm,
TimeStream, MapReduce Online, S4) and most are based on the *continuous
operator model*. In this model, computation is modelled as a network of
stateful operators that receive data from an upstream operator, update their
internal state, and send data to downstream operators. The continuous operator
model typically employs one of two recovery mechanisms.

1. *Hot replication.* Operators are replicated and data is sent to every one of
   the replicas. Synchronization between replicas can ensure they produce
   equivalent results. Replication has reasonably fast recovery, but it doubles
   deployment cost (at least) and operator synchronization can slow down
   processing.
2. *Upstream backup.* Operators buffer their outputs until downstream consumers
   checkpoint. When a downstream operator fails, a new operator is launched and
   its buffered inputs are sent from the upstream backup. Upstream backup
   doesn't greatly increase deployment cost, but recovery can be slow.

In this paper, Zaharia et al. introduce a new stream processing model,
*discretized streams* (D-Streams), that recovers quickly, handles stragglers,
scales to hundreds of nodes, and aims to support latencies of 0.5 - 2 seconds.
In this model, streams are divided into *stateless, determinstic batch
computations on small time intervals*.  Determinism and lineage tracking allow
for parallel recovery. Moreover, D-Streams are implemented in Spark Streaming
allowing a unified interface between batch and streaming computation: something
of great practical value.

In the discretized streams model, all the data for a given time interval is
collected into an RDD, tasks then operate on the RDD, much like they would in
Spark, to produce outputs (possibly to external systems) or temporary state
that is fed into the next time interval.

- *Timing.* Spark Streaming batches events based on their *arrival time*,
  though some systems may want to batch events based on some external
  *timestamp*. Spark Streaming has some configurable slack time to wait before
  processing a batch, but otherwise this functionality can be solved by
  applications.
- *API.* The D-Stream interface is very similar to that of Spark but also
  includes windowing, incremental aggregation, tracking, and data exporting.
- *Consistency.* Some implementations of the continuous operator model have
  ambiguous consistency guarantees. Some operators can run ahead of others
  giving an inconsistent view of the system. D-Streams design makes consistency
  clear. D-Streams are discretized by interval, so once an RDD for a given
  interval is complete, it is a consistent snapshot of the system.
- *Integration with batch.* Batch and stream processing are married by the
  integration of Spark Streaming into Spark. This allows users to do things
  like join streaming data with a static RDD or issue interactive queries to a
  streaming job.

The Spark Streaming architecture is divided between three main components:

1. The *master* tracks lineage and schedules tasks.
2. The *workers* receive data, store partitions, and execute tasks.
3. The *client* injects data into the system.

Data is either periodically read from a data store like HDFS or is sent into
the system by a client. Workers run an LRU block store to manage RDD partitions
and coordinate with the master which tracks which nodes have which blocks. The
system employs traditional data processing optimizations and also introduces
optimizations to I/O, pipelining, scheduling, etc. Moreover, since streaming
computations run 24/7, Spark Streaming had to introduce master recovery. Master
periodically write their state to HDFS which can be recovered by another
master.
