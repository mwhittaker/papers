# [The Gamma Database Machine Project (1990)](https://scholar.google.com/scholar?cluster=8912521541627865753)
Gamma is a distributed shared-nothing relational database. Gamma tables are
horizontally partitioned across a set of machines, and queries are implemented
with distributed hash-based join algorithms. Gamma also includes distributed
concurrency control and recovery.

## Gamma Software Architecture
Gamma is built using the NOSE operating system which was designed for building
databases. It employs non-preemptive scheduling and the Wisconsin storage
system. It offers sequential files of records, byte stream files (a la Unix),
and B+ tree indexes. One index on a file can be clustered.

All Gamma tables are horizontally partitioned using round robin partitioning,
hash partitioning, or range-based partitioning. Gamma supports both clustered
and unclustered indexes over these partitioned relations, and (as we'll see
later) the query optimizer can smartly direct queries only to the necessary
partitions. The authors lament that they should have only partitioned hot
relations.

A Gamma database runs multiple types of processes. There is a single **catalog
manager** that is responsible for caching and distributing the system catalog.
There is one **query manager** per user which is responsible for parsing,
optimizing, and compiling queries. There is one **scheduler process** for each
query which schedules the query to multiple operator processes. If a query can
be executed by a single operator process, however, it skips the scheduler
process and is sent directly to an operator process. Finally there is a set of
**operator processes** that actually execute queries.

Gamma queries can be embedded in C programs or can be issued ad-hoc by users.
Gamma uses a standard query optimizer which only considers left-deep plans and
only chooses from a small set of distributed hash-based join algorithms.

Operator processes read a stream of tuples and write out a stream of tuples
which are fed into a tuple demultiplexer known as a **split table**. The split
table decides where a tuple should be routed. After an operator process
completes, it sends a message to its scheduling process and closes all outbound
connections.

## Query Processing Algorithms
Selection is trivial to parallelize: each partition performs its fraction
of the selection. One small optimization is that operator processes pre-fetch
pages during a sequential scan or clustered index scan.

Gamma supports equijoins but not arbitrary joins. It has four hash-based
equijoin algorithms but defaults to Hybrid hash join. Here's how a Hybrid hash
join is implemented on two relations R and S. First, both R and S are hash
partitioned based on the join columns into a set of logical buckets. Each
bucket is distributed across all the disks in Gamma. Then, one bucket at a
time, each bucket is hash partitioned across all the nodes in Gamma. Each node
then performs a local hash join.

To implement GROUP BY, each partition executes the GROUP BY locally. Then, the
groups are hash partitioned by the grouping key and accumulated at each
partition.

Update operators are rather straightforward with the small exception that if a
node's partition key is updated, it has to be repartitioned.

## Concurrency Control
Gamma implements S, X, IS, IX, and SIX locks over files and pages. Each
operator process runs a local lock manager and deadlock detector. Every so
often, a global deadlock detector accumulates the local deadlock graphs into a
global deadlock graph and checks for deadlock. If no deadlock is found, the
period between global deadlock checks is doubled. If a deadlock is found, the
period is halved. The period is clamped between 1 and 60 seconds.


## Recovery
Gamma uses a distributed variant of ARIES. Every update is annotated with a
globally unique LSN, and every query processor sends log entries to a
predetermined log manager which periodically flushes the log to disk. The log
manager periodically sends the flushedLSN to the query processor. A query
processor can only flush a page if its LSN is less than the flushedLSN.
Otherwise, the query processor has to request that the log manager flush the
log up to the page's LSN. Query processors try to keep a certain amount of
clean pages around to avoid being bottlenecked by the log manager.

## Fault Tolerance
Gamma replicates every relation twice using a replication scheme known as
**chained declustering**. With n disks, each relation is partitioned into `n`
partitions. Disk `i` is assigned partition `i` as its primary and partition `i
- 1 mod N` as its backup. Clients read from the primary and write to both
primary and backup. When a node fails, reads are redirected to the backup.
Moreover, requests can be smeared across the non-failed nodes in a clever way
to balance requests; see paper for details.

Other shared-nothing databases implement **interleaved*declustering**. With
interleaved declustering, the `n` disks are partitioned into logical clusters.
Partition `i`'s primary is stored on disk `i`, and partition `i`'s secondary is
partitioned among the other nodes in the cluster. This scheme cannot tolerate
the loss of two machines in the same cluster.
