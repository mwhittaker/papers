# Table of Contents #
- [A Relational Model of Data for Large Shared Data Banks (1970)](#a-relational-model-of-data-for-large-shared-data-banks-1970)
- [The Unix Time-Sharing System (1974)](#the-unix-time-sharing-system-1974)
- [A History and Evaluation of System R (1981)](#a-history-and-evaluation-of-system-r-1981)
- [A Fast File System for UNIX (1984)](#a-fast-file-system-for-unix-1984)
- [Generalized Isolation Level Definitions (2000)](#generalized-isolation-level-definitions-2000)
- [Inferring Internet Denial-of-Service Activity (2001)](#inferring-internet-denial-of-service-activity-2001)
- [Analysis and Evolution of Journaling File Systems (2005)](#analysis-and-evolution-of-journaling-file-systems-2005)
- [BOOM Analytics: Exploring Data-Centric, Declarative Programming for the Cloud (2010)](#boom-analytics-exploring-data-centric-declarative-programming-for-the-cloud-2010)
- [Consistency Analysis in Bloom: a CALM and Collected Approach (2011)](#consistency-analysis-in-bloom-a-calm-and-collected-approach-2011)
- [Logic and Lattices for Distributed Programming (2012)](#logic-and-lattices-for-distributed-programming-2012)
- [Resilient Distributed Datasets: A Fault-Tolerant Abstraction for In-Memory Cluster Computing (2012)](#resilient-distributed-datasets-a-fault-tolerant-abstraction-for-in-memory-cluster-computing-2012)
- [Highly Available Transactions: Virtues and Limitations (2014)](#highly-available-transactions-virtues-and-limitations-2014)

## [A Relational Model of Data for Large Shared Data Banks (1970)](A_Relational_Model_of_Data_for_Large_Shared_Data_Banks.pdf) ##
**Summary.**
In this paper, Ed Codd introduces the *relational data model*. Codd begins by
motivating the importance of *data independence*: the independence of the way
data is queried and the way data is stored. He argues that existing database
systems at the time lacked data independence; namely, the ordering of
relations, the indexes on relations, and the way the data was accessed was all
made explicit when the data was queried. This made it impossible for the
database to evolve the way data was stored without breaking existing programs
which queried the data. The relational model, on the other hand, allowed for a
much greater degree of data independence. After Codd introduces the relational
model, he provides an algorithm to convert a relation (which may contain other
relations) into *first normal form* (i.e. relations cannot contain other
relations). He then describes basic relational operators, data redundancy, and
methods to check for database consistency.

**Commentary.**

1. Codd's advocacy for data independence and a declarative query language have
   stood the test of time. I particularly enjoy one excerpt from the paper
   where Codd says, "The universality of the data sublanguage lies in its
   descriptive ability (not its computing ability)".
2. Database systems at the time generally had two types of data: collections
   and links between those collections. The relational model represented both
   as relations. Today, this seems rather mundane, but I can imagine this being
   counterintuitive at the time.  This is also yet another example of a
   *unifying interface* which is demonstrated in both the Unix and System R
   papers.

## [The Unix Time-Sharing System (1974)](The_Unix_Time-Sharing_System.pdf)  ##
TODO(mwhittaker): Complete this paper.

## [A History and Evaluation of System R (1981)](A_History_and_Evaluation_of_System_R.pdf) ##
**Summary.**
System R, developed between 1974 and 1979, was one of the first relational
database systems. It was implemented in three phases: phase 0, 1, and 2. Phase
0 was a throw-away single-user database prototype that was used to polish the
SQL interface. Phase 0 surfaced various problems that were solved in Phase 1:
the full featured multi-user database. Phase 2 was a two year period during
which System R was deployed to a number of real-world customers to assess the
system. System R included

- locking based concurrency control,
- a dynamic programming based query optimizer,
- catalogs represented as relations,
- views and authorization,
- embeddings in PL/I and Cobol,
- B-tree based indexes,
- nested loop joins, index loop joins, and sort merge joins,
- crash recovery,
- query compilation, and
- various tweaks and refinements to SQL.

**Commentary.**
System R introduced a bevy of influential and perennial ideas in the field of
databases. Unix introduced a bevy of influential and perennial ideas in the
field of operating systems. It's no coincidence that there are a striking
number of system design principles that System R and Unix---as presented in
*The Unix Time-Sharing System*---share:

1. *Unified Abstractions.* Unix unified the file and I/O device abstraction
   into a single interface. System R unified the table and catalog/metadata API
   into a single interface (i.e. everything is a relation). System R also
   unifed SQL as the query language used for ad-hoc queries, program-embeded
   queries, and view definitions. System R's decision to use relations to
   represent the catalog can also be seen as a form of dogfooding.
2. *Simple is Better.* Unix started as Ken Thompson's pet project as an effort
   to make development simpler and more enjoyable. Unix's simplicity stuck and
   was one of its selling points. Similarly, System R spent a considerable
   amount of effort simplifying the SQL interface to make it as easy to use as
   possible. If a system's interface is too complicated, nobody will use it.
3. *Performance isn't Everything.* Thompson and Ritchie implemented Unix in C
   instead of assembly despite the fact that the kernel size increased by one
   third because C greatly improved the readability and maintainability of the
   system. Similarly, the System R paper comments that the relational model may
   never exceed the performance of a hand-optimized navigational database, but
   the abstraction it provides is worth the cost. Somewhat comically, today's
   compilers and query optimizers are so good, compiled C is likely smaller
   than hand-written assembly and optimized queries are likely faster than
   hand-optimized ones. This is an example of another systems principle of
   favoring higher-level declarative APIs which leave room for optimization.

## [A Fast File System for UNIX (1984)](Unix_FFS.pdf) ##
**Summary.**
The *Fast Filesystem* (FFS) improved the read and write throughput of the
original Unix file system by 10x by

1. increasing the block size,
2. dividing blocks into fragments, and
3. performing smarter allocation.

The original Unix file system, dubbed "the old file system", divided disk
drives into partitions and loaded a file system on to each partition. The
filesystem included a superblock containing metadata, a linked list of free
data blocks known as the *free list*, and an *inode* for every file. Notably,
the file system was composed of **512 byte** blocks; no more than 512 bytes
could be transfered from the disk at once. Moreover, the file system had poor
data locality. Files were often sprayed across the disk requiring lots of
random disk accesses.

The "new file system" improved performance by increasing the block size to any
power of two at least as big as **4096 bytes**. In order to handle small files
efficiently and avoid high internal fragmentation and wasted space, blocks were
further divided into *fragments* at least as large as the disk sector size.

          +------------+------------+------------+------------+
    block | fragment 1 | fragment 2 | fragment 3 | fragment 4 |
          +------------+------------+------------+------------+

Files would occupy as many complete blocks as possible before populating at
most one fragmented block.

Data was also divided into *cylinder groups* where each cylinder group included
a copy of the superblock, a list of inodes, a bitmap of available blocks (as
opposed to a free list), some usage statistics, and finally data blocks. The
file system took advantage of hardware specific information to place data at
rotational offsets specific to the hardware so that files could be read with as
little delay as possible. Care was also taken to allocate files contiguously,
similar files in the same cylinder group, and all the inodes in a directory
together.

In addition to performance improvements, FFS also introduced

1. longer filenames,
2. advisory file locks,
3. soft links,
4. atomic file renaming, and
5. disk quota enforcement.

## [Generalized Isolation Level Definitions (2000)](generalized_isolation_levels.pdf) ##
**Summary.**
In addition to serializability, ANSI SQL-92 defined a set of weaker isolation
levels that applications could use to improve performance at the cost of
consistency. The definitions were implementation-independent but ambiguous.
Berenson et al. proposed a revision of the isolation level definitions that was
unambiguous but specific to locking. Specifically, they define a set of
*phenomena*:

- P0: `w1(x) ... w2(x) ...`      *"dirty write"*
- P1: `w1(x) ... r2(x) ...`      *"dirty read"*
- P2: `r1(x) ... w2(x) ...`      *"unrepeatable read"*
- P3: `r1(P) ... w2(y in P) ...` *"phantom read"*

and define the isolation levels according to which phenomena they preclude.
This preclusion can be implemented by varying how long certain types of locks
are held:

| write locks | read locks | phantom locks | precluded      |
| ----------- | ---------- | ------------- | -------------- |
| short       | short      | short         | P0             |
| long        | short      | short         | P0, P1         |
| long        | long       | short         | P0, P1, P2     |
| long        | long       | long          | P0, P1, P2, P3 |

This locking-specific *preventative* approach to defining isolation levels,
while unambiguous, rules out many non-locking implementations of concurrency
control. Notably, it does not allow for multiversioning and does not allow
non-committed transactions to experience weaker consistency than committed
transactions. Moreover, many isolation levels are naturally expressed as
invariants between multiple objects, but these definitions are all over a
single object.

This paper introduces implementation-independent unambiguous isolation level
definitions. The definitions also include notions of predicates at all levels.
It does so by first introducing the definition of a *history* as a partial
order of read/write/commit/abort events and total order of commited object
versions.  It then introduces three dependencies: *read-dependencies*,
*anti-dependencies*, and *write-dependencies* (also known as write-read,
read-write, and write-write dependencies). Next, it describes how to construct
dependency graph and defines isolation levels as constraints on these graphs.

For example, the G0 phenomenon says that a dependency graph contains a
write-dependency cycle. PL-1 is the isolation level that precludes G0.
Similarly, the G1 phenomenon says that either

1. a committed transaction reads an aborted value,
2. a committed transaction reads an intermediate value, or
3. there is a write-read/write-write cycle.

The PL-2 isolation level precludes G1 (and therefore G0) and corresponds
roughly to the READ-COMMITTED isolation level.

## [Inferring Internet Denial-of-Service Activity (2001)](Inferring_Internet_Denial-of-Service_Activity.pdf) ##
**Summary.**
This paper uses *backscatter analysis* to quantitatively analyze
denial-of-service attacks on the Internet. Most flooding denial-of-service
attacks involve IP spoofing, where each packet in an attack is given a faux IP
address drawn uniformly at random from the space of all IP addresses. If the
packet elicits the victim to issue a reply packet, then victims of
denial-of-service attacks end up sending unsolicited messages to servers
uniformly at random. By monitoring this *backscatter* at enough hosts, one can
infer the number, intensity, and type of denial-of-service attacks.

There are of course a number of assumptions upon which backscatter depends.

1. *Address uniformity*. It is assumed that DOS attackers spoof IP addresses
   uniformally at random.
2. *Reliable delivery*. It is assumed that packets, as part of the attack and
   response, are delivered reliably.
3. *Backscatter hypothesis*. It is assumed that unsolicited packets arriving at
   a host are actually part of backscatter.

The paper performs a backscatter analysis on 1/256 of the IPv4 address space.
They cluster the backscatter data using a *flow-based classification* to
measure individual attacks and using an *event-based classification* to measure
the intensity of attacks. The findings of the analysis are best summarized by
the paper.

## [Analysis and Evolution of Journaling File Systems (2005)](journaling_filesystems.pdf) ##
**Summary.**
The authors develop and apply two file system analysis techniques dubbed
*Semantic Block-Level Analysis* (SBA) and *Semantice Trace Playback* (STP) to
four journaled file systems: ext3, ReiserFS, JFS, and NTFS.

- Benchmarking a file system can tell you for *which* workloads it is fast and
  for which it is slow. But, these benchmarks don't tell you *why* the file
  system performs the way it does. By leveraging semantic information about
  block traces, SBA aims to identify the cause of file system behavior.

  Users install an SBA driver into the OS and mount the file system of interest
  on to the SBA driver. The interposed driver intercepts and logs all
  block-level requests and responses to and from the disk. Moreover, the SBA
  driver is specialized to each file system under consideration so that it can
  interpret each block operation, categorizing it as a read/write to a journal
  block or regular data block. Implementing an SBA driver is easy to do,
  guarantees that no operation goes unlogged, and has low overhead.
- Deciding the effectiveness of new file system policies is onerous. For
  example, to evaluate a new journaling scheme, you would traditionally have to
  implement the new scheme and evaluate it on a set of benchmarks. If it
  performs well, you keep the changes; otherwise, you throw them away. STP uses
  block traces to perform a light-weight simulation to analyze new file system
  policies without implementation overhead.

  STP is a user-level process that reads in block traces produced by SBA and
  file system operation logs and issues direct I/O requests to the disk. It can
  then be used to evaluate small, simple modifications to existing file
  systems. For example, it can be used to evaluate the effects of moving the
  journal from the beginning of the file system to the middle of the file
  system.

The authors spend the majority of the paper examining *ext3*: the third
extended file system. ext3 introduces journaling to ext2, and ext2 resembles
the [Unix FFS](#a-fast-file-system-for-unix-1984) with partitions divided into
groups each of which contains bitmaps, inodes, and regular data. ext3 comes
with three journaling modes:

1. Using *writeback* journaling, metadata is journaled and data is
   asynchronously written to disk. This has the weakest consistency guarantees.
2. Using *ordered* journaling, data is written to disk before its associated
   metatada is journaled.
3. Using *data* journaling, both data and metadata is journaled before being
   *checkpointed*: copied from the journal to the disk.

Moreover, operations are grouped into *compound transactions* and issued in
batch. ext3 SBA analysis led to the following conclusions:

- The fastest journaling mode depends heavily on the workload.
- Compound transactions can lead to *tangled synchrony* in which asynchronous
  operations are made synchronous when placed in a transaction with synchronous
  operations.
- In ordered journaling, ext3 doesn't concurrently write to the journal and the
  disk.

SPT was also used to analyze the effects of

- Journal position in the disk.
- An adaptive journaling mode that dynamically chooses between ordered and data
  journaling.
- Untangling compound transactions.
- Data journaling in which diffs are journaled instead of whole blocks.

SBA and STP was also applied to ReiserFS, JFS, and NTFS.

## [BOOM Analytics: Exploring Data-Centric, Declarative Programming for the Cloud (2010)](BOOM_Analytics.pdf) ##
**Summary.**
Programming distributed systems is hard. Really hard. This paper conjectures
that *data-centric* programming done with *declarative programming languages*
can lead to simpler distributed systems that are more correct with less code.
To support this conjecture, the authors implement an HDFS and Hadoop clone in
Overlog, dubbed BOOM-FS and BOOM-MR respectively, using orders of magnitude
fewer lines of code that the original implementations. They also extend BOOM-FS
with increased availability, scalability, and monitoring.

An HDFS cluster consists of NameNodes responsible for metadata management and
DataNodes responsible for data management. BOOM-FS reimplements the metadata
protocol in Overlog; the data protocol is implemented in Java. The
implementation models the entire system state (e.g. files, file paths,
heartbeats, etc.) as data in a unified way by storing them as collections. The
Overlog implementation of the NameNode then operates on and updates these
collections. Some of the data (e.g. file paths) are actually views that can be
optionally materialized and incrementally maintained. After reaching (almost)
feature parity with HDFS, the authors increased the availability of the
NameNode by using Paxos to introduce a hot standby replicas. They also
partition the NameNode metadata to increase scalability and use metaprogramming
to implement monitoring.

BOOM-MR plugs in to the existing Hadoop code but reimplements two MapReduce
scheduling algorithms: Hadoop's first-come first-server algorithm, and
Zaharia's LATE policy.

BOOM Analytics was implemented in order of magnitude fewer lines of code thanks
to the data-centric approach and the declarative programming language. The
implementation is also almost as fast as the systems they copy.

## [Consistency Analysis in Bloom: a CALM and Collected Approach (2011)](bloom_calm_and_collected.pdf) ##
**Summary.**
Strong consistency eases reasoning about distributed systems, but it requires
coordination which entails higher latency and unavailability. Adopting weaker
consistency models can improve system performance but writing applications
against these weaker guarantees can be nuanced, and programmers don't have any
reasoning tools at their disposal. This paper introduces the *CALM conjecture*
and *Bloom*, a disorderly declarative programming language based on CALM, which
allows users to write loosely consistent systems in a more principled way.

Say we've eschewed strong consistency, how do we know our program is even
eventually consistent? For example, consider a distributed register in which
servers accept writes on a first come first serve basis. Two clients could
simultaneously write two distinct values `x` and `y` concurrently. One server
may receive `x` then `y`; the other `y` then `x`. This system is not eventually
consistent. Even after client requests have quiesced, the distributed register
is in an inconsistent state. The *CALM conjecture* embraces Consistency As
Logical Monotonicity and says that logically monotonic programs are eventually
consistent for any ordering and interleaving of message delivery and
computation. Moreover, they do not require waiting or coordination to stream
results to clients.

*Bud* (Bloom under development) is the realization of the CALM theorem. It is
Bloom implemented as a Ruby DSL. Users declare a set of Bloom collections (e.g.
persistent tables, temporary tables, channels) and an order independent set of
declarative statements similar to Datalog. Viewing Bloom through the lens of
its procedural semantics, Bloom execution proceeds in timesteps, and each
timestep is divided into three phases. First, external messages are delivered
to a node. Second, the Bloom statements are evaluated. Third, messages are sent
off elsewhere. Bloom also supports modules and interfaces to improve
modularity.

The paper also implements a key-value store and shopping cart using Bloom and
uses various visualization tools to guide the design of coordination-free
implementations.

## [Logic and Lattices for Distributed Programming (2012)](Logic_and_Lattices_for_Distributed_Programming.pdf) ##
**Summary.**
CRDTs provide eventual consistency without the need for coordination. However,
they suffer a *scope problem*: simple CRDTs are easy to reason about and use,
but more complicated CRDTs force programmers to ensure they satisfy semilattice
properties. They also lack composability. Consider, for example, a Students set
and a Teams set. (Alice, Bob) can be added to Teams while concurrently Bob is
removed from Students. Each individual set may be a CRDT, but there is no
mechanism to enforce consistency between the CRDTs.

Bloom and CALM, on the other hand, allow for mechanized program analysis to
guarantee that a program can avoid coordination. However, Bloom suffers from a
*type problem*: it only operates on sets which procludes the use of other
useful structures such as integers.

This paper merges CRDTs and Bloom together by introducing *bounded join
semilattices* into Bloom to form a new language: Bloom^L. Bloom^L operates over
semilattices, applying semilattice methods. These methods can be designated as
non-monotonic, monotonic, or homomorphic (which implies monotonic). So long as
the program avoids non-monotonic methods, it can be realized without
coordination. Moreover, morphisms can be implemented more efficiently than
non-homomorphic monotonic methods. Bloom^L comes built in with a family of
useful semilattices like booleans ordered by implication, integers ordered by
less than and greater than, sets, and maps. Users can also define their own
semilattices, and Bloom^L allows smooth interoperability between Bloom
collections and Bloom^L lattices. Bloom^L's semi-naive implementation is
comparable to Bloom's semi-naive implementation.

The paper also presents two case-studies. First, they implement a key-value
store as a map from keys to values annotated with vector clocks: a design
inspired from Dynamo. They also implement a purely monotonic shopping cart
using custom lattices.

## [Resilient Distributed Datasets: A Fault-Tolerant Abstraction for In-Memory Cluster Computing (2012)](nsdi_spark.pdf) ##
**Summary.**
Frameworks like MapReduce made processing large amounts of data easier, but
they did not leverage distributed memory. If a MapReduce was run iteratively,
it would write all of its intermediate state to disk: something that was
prohibitively slow. This limitation made batch processing systems like
MapReduce ill-suited to *iterative* (e.g. k-means clustering) and *interactive*
(e.g. ad-hoc queries) workflows. Other systems like Pregel did take advantage
of distributed memory and reused the in-memory data across computations, but
the systems were not general-purpose.

*Spark* uses *Resilient Distributed Datasets* (RDDs) to perform general
computations in memory. RDDs are immutable partitioned collections of records.
Unlike pure distributed shared memory abstractions which allow for arbitrary
fine-grained writes, RDDs can only be constructed using coarse-grained
transformations from on-disk data or other RDDs. This weaker abstraction can be
implemented efficiently. Spark also uses RDD lineage to implement low-overhead
fault tolerance. Rather than persist intermediate datasets, the lineage of an
RDD can be persisted and efficiently recomputed. RDDs could also be
checkpointed to avoid the recomputation of a long lineage graph.

Spark has a Scala-integrated API and comes with a modified interactive
interpreter. It also includes a large number of useful *transformations* (which
construct RDDs) and *actions* (which derive data from RDDs). Users can also
manually specify RDD persistence and partitioning to further improve
performance.

Spark subsumed a huge number of existing data processing frameworks like
MapReduce and Pregel in a small amount of code. It was also much, much faster
than everything else on a large number of applications.

## [Highly Available Transactions: Virtues and Limitations (2014)](HAT_virtues_and_limitations.pdf) ##
**Summary.**
Serializability is the gold standard of consistency, but databases have always
provided weaker consistency modes (e.g. Read Committed, Repeatable Read) that
promise improved performance. In this paper, Bailis et al. determine which of
these weaker consistency models can be implemented with high availability.

First, why is high availability important?

1. *Partitions.* Partitions happen, and when they do non-available systems
   become, well, unavailable.
2. *Latency.* Partitions may be transient, but latency is forever. Highly
   available systems can avoid latency by eschewing coordination costs.

Second, are weaker consistency models consistent enough? In short, yeah
probably. In a survey of databases, Bailis finds that many do not employ
serializability by default and some do not even provide full serializability.
Bailis also finds that four of the five transactions in the TPC-C benchmark can
be implemented with highly available transactions.

After defining availability, Bailis presents the taxonomy of which consistency
can be implemented as HATs, and also argues why some fundamentally cannot. He
also performs benchmarks on AWS to show the performance benefits of HAT.
