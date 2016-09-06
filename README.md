# Table of Contents #
1. [A Relational Model of Data for Large Shared Data Banks (1970)](#a-relational-model-of-data-for-large-shared-data-banks-1970)
1. [The Unix Time-Sharing System (1974)](#the-unix-time-sharing-system-1974)
1. [Experience with Processes and Monitors in Mesa (1980)](#experience-with-processes-and-monitors-in-mesa-1980)
1. [A History and Evaluation of System R (1981)](#a-history-and-evaluation-of-system-r-1981)
1. [A Fast File System for UNIX (1984)](#a-fast-file-system-for-unix-1984)
1. [End-to-End Arguments in System Design (1984)](#end-to-end-arguments-in-system-design-1984)
1. [The Design of the POSTGRES Storage System (1987)](#the-design-of-the-postgres-storage-system-1987)
1. [The Linda alternative to message-passing systems (1994)](#the-linda-alternative-to-message-passing-systems-1994)
1. [The HP AutoRAID hierarchical storage system (1996)](#the-hp-autoraid-hierarchical-storage-system-1996)
1. [T Spaces: The Next Wave (1999)](#t-spaces-the-next-wave-1999)
1. [Generalized Isolation Level Definitions (2000)](#generalized-isolation-level-definitions-2000)
1. [The Click Modular Router (2000)](#the-click-modular-router-2000)
1. [Chord: A Scalable Peer-to-peer Lookup Service for Internet Applications (2001)](#chord-a-scalable-peer-to-peer-lookup-service-for-internet-applications-2001)
1. [Inferring Internet Denial-of-Service Activity (2001)](#inferring-internet-denial-of-service-activity-2001)
1. [SEDA: An Architecture for Well-Conditioned, Scalable Internet Services (2001)](#seda-an-architecture-for-well-conditioned,-scalable-internet-services-2001)
1. [Analysis and Evolution of Journaling File Systems (2005)](#analysis-and-evolution-of-journaling-file-systems-2005)
1. [Architecture of a Database System (2007)](#architecture-of-a-database-system-2007)
1. [BOOM Analytics: Exploring Data-Centric, Declarative Programming for the Cloud (2010)](#boom-analytics-exploring-data-centric-declarative-programming-for-the-cloud-2010)
1. [Consistency Analysis in Bloom: a CALM and Collected Approach (2011)](#consistency-analysis-in-bloom-a-calm-and-collected-approach-2011)
1. [Logic and Lattices for Distributed Programming (2012)](#logic-and-lattices-for-distributed-programming-2012)
1. [Resilient Distributed Datasets: A Fault-Tolerant Abstraction for In-Memory Cluster Computing (2012)](#resilient-distributed-datasets-a-fault-tolerant-abstraction-for-in-memory-cluster-computing-2012)
1. [Highly Available Transactions: Virtues and Limitations (2014)](#highly-available-transactions-virtues-and-limitations-2014)
1. [Decibel: The Relational Dataset Branching System (2016)](#decibel-the-relational-dataset-branching-system-2016)
1. [Goods: Organizing Google's Datasets (2016)](#goods-organizing-googles-datasets-2016)

## [A Relational Model of Data for Large Shared Data Banks (1970)](TODO) ##
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

## [The Unix Time-Sharing System (1974)](TODO) ##
TODO(mwhittaker): Complete this paper.

## [Experience with Processes and Monitors in Mesa (1980)](https://goo.gl/1TqQQM) ##
**Summary.**
In 1980, synchronization primitives like semaphores, monitors, and condition
variables had been well studied in the literature, but there weren't any large
systems implementing them. Mesa was a programming language that was being
developed to write the Pilot operating system at Xerox. Due to the inherent
concurrency of an operating system, Mesa was designed to ease the development
of concurrent programs. The Mesa designers considered implementing a message
passing interface, but deemed it too complex. They considered semaphores, but
found them too undisciplined. They considered cooperative multi-threading but
came upon a number of serious disadvantages:

- Cooperative multithreading cannot take advantage of multiple cores.
- Preemption is already required to service time-sensitive I/O devices.
- Cooperation is at odds with modularity. Critical sections have no principled
  way of knowing if they are calling a function which yields control.

Eventually, Mesa settled on implementing monitors and condition variables and
exposed a number of previously undiscussed issues:

- What is the interface for dynamically spawning threads and waiting for them
  to terminate?
- What is the interface for dynamically constructing monitors?
- How are threads scheduled when waiting and notifying each other?
- What are the semantics of `wait` when one monitor calls into another monitor
  which also calls `wait`?
- How are exceptions and I/O devices handled?

Mesa allowed an arbitrary function call to be forked and run by a separate
thread and eventually joined:

    p <- fork ReadLine[terminal]
    ...
    buffer <- join p

Moreover, if a forked thread was not intended to be joined, it could instead be
detached via `detach[p]`. This fork/join style process management had a number
of advantages---(i) processes were first class values, (ii) thread forking was
type checked, and (iii) any procedure could be forked---but also introduced
lots of opportunities for dangling references.

Monitors are objects that only allow a single thread to be executing one of its
functions at any given time. They unify data, synchronization of the data, and
access of the data into one lexical bundle. Mesa monitors included public
*entry preocedures* and private *internal procedures* that operated with the
monitor locked as well as public *external procedures* that operated without
locking the monitor. Monitors, in conjunction with condition variables, were
used to maintain an invariant about an object that was true upon entering and
exiting any of the monitor's methods. Monitors also lead to potential deadlocks:

- Two monitor methods could wait for one another.
- Two different monitors could enter each other.
- A monitor `M` could enter a monitor `N`, then wait on a condition that could
  only be enabled by another thread entering `M` through `N`.

Special care also had to be taken to avoid priority inversion.

Mesa also introduced Mesa semantics, best explained with this code snippet:

```python
"""
Condition variables typically obey one of two semantics:

1. Under *Hoare semantics* [1], when a thread calls `notify` on a condition
   variable, the execution of one of the threads waiting on the condition
   variable is immediately resumed. Thus, a thread that calls `wait` can assume
   very strong invariants are held when it is awoken.
2. Under *Mesa semantics* [2], a call to `notify` is nothing more than a hint.
   Threads calling `wait` can be woken up at any time for any reason.

Understanding the distinction between Hoare and Mesa semantics can be
solidified by way of example. This program implements a concurrent queue (aka
pipe) to which data can be written and from which data can be read. It spawns a
single thread which iteratively writes data into the pipe, and it spawns
`NUM_CONSUMERS` threads that read from the pipe. The producer produces the same
number of items that the consumers consume, so if all goes well, the program
will run and terminate successfully.

Run the program; not all goes well:

    Exception in thread Thread-3:
    Traceback (most recent call last):
      File "/usr/lib/python2.7/threading.py", line 810, in __bootstrap_inner
        self.run()
      File "/usr/lib/python2.7/threading.py", line 763, in run
        self.__target(*self.__args, **self.__kwargs)
      File "hoare_mesa.py", line 66, in consume
        pipe.pop()
      File "hoare_mesa.py", line 52, in pop
        return self.xs.pop(0)
    IndexError: pop from empty list

Why? The pipe is implemented assuming Python condition variables obey Hoare
semantics. They do not. Modify the pipe's implementation assuming Mesa
semantics and re-run the program. Everything should run smoothly!

[1]: https://scholar.google.com/scholar?cluster=16665458100449755173&hl=en&as_sdt=0,5
[2]: https://scholar.google.com/scholar?cluster=492255216248422903&hl=en&as_sdt=0,5
"""

import threading

# The number of objects read from and written to the pipe.
NUM_OBJECTS = 10000

# The number of threads consuming from the pipe.
NUM_CONSUMERS = 2

# An asynchronous queue (a.k.a. pipe) that assumes (erroneously) that Python
# condition variables follow Hoare semantics.
class HoarePipe(object):
    def __init__(self):
        self.xs = []
        self.lock = threading.Lock()
        self.data_available = threading.Condition(self.lock)

    # Pop the first element from the pipe, blocking if necessary until data is
    # available.
    def pop(self):
        with self.lock:
            # This code is incorrect beacuse Python condition variables follows
            # Mesa, not Hoare, semantics. To correct the code, simply replace
            # the `if` with a `while`.
            if len(self.xs) == 0:
                self.data_available.wait()
            return self.xs.pop(0)

    # Push a value to the pipe.
    def push(self, x):
        with self.lock:
            self.xs.append(x)
            self.data_available.notify()

def produce(pipe):
    for i in range(NUM_OBJECTS):
        pipe.push(i)

def consume(pipe):
    assert NUM_OBJECTS % NUM_CONSUMERS == 0
    for i in range(NUM_OBJECTS / NUM_CONSUMERS):
        pipe.pop()

def main():
    pipe = HoarePipe()
    producer = threading.Thread(target=produce, args=(pipe,))
    consumers = [threading.Thread(target=consume, args=(pipe,))
                 for i in range(NUM_CONSUMERS)]

    producer.start()
    for consumer in consumers:
        consumer.start()

    producer.join()
    for consumer in consumers:
        consumer.join()

if __name__ == "__main__":
    main()
```

Threads waiting on a condition variable could also be awoken by a timeout, an
abort, or a broadcast (e.g. `notify_all`).

Mesa's implementation was divided between the processor, a runtime, and the
compiler. The processor was responsible for process management and scheduling.
Each process was on a ready queue, monitor lock queue, condition variable
queue, or fault queue. The runtime was responsible for providing the fork/join
interface. The compiler performed code generation and a few static sanity
checks.

Mesa was evaluated by Pilot (an OS), Violet (a distributed calendar), and
Gateway (a router).

## [A History and Evaluation of System R (1981)](TODO) ##
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

## [A Fast File System for UNIX (1984)](TODO) ##
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

## [End-to-End Arguments in System Design (1984)](TODO) ##
**Summary.**
This paper presents the *end-to-end argument*:

> The function in question can completely and correctly be implemented only
> with the knowledge and help of the application standing at the end points of
> the communication system. Therefore, providing that questioned function as a
> feature of the communication system itself is not possible. (Sometimes an
> incomplete version of the function provided by the communication system may
> be useful as a performance enhancement.)

which says that in a layered system, functionality should, nay must be
implemented as close to the application as possible to ensure correctness (and
usually also performance).

The end-to-end argument is motivated by an example file transfer scenario in
which host A transfers a file to host B. Every step of the file transfer
presents an opportunity for failure. For example, the disk may silently corrupt
data or the network may reorder or drop packets. Any attempt by one of these
subsystems to ensure reliable delivery is wasted effort since the delivery may
still fail in another subsystem. The only way to guarantee correctness is to
have the file transfer application check for correct delivery itself. For
example, once it receives the entire file, it can send the file's checksum back
to host A to confirm correct delivery.

In addition to being necessary for correctness, applying the end-to-end
argument also usually leads to improved performance. When a functionality is
implemented in a lower level subsystem, every application built on it must pay
the cost, even if it does not require the functionality.

There are numerous other examples of the end-to-end argument:

- Guaranteed packet delivery.
- Secure data transmission.
- Duplicate message suppression.
- FIFO delivery.
- Transaction management.
- RISC.

The end-to-end argument is not a hard and fast rule. In particular, it may be
eschewed when implementing a functionality in a lower level can lead to
performance improvements. Consider again the file transfer protocol above and
assume the network drops one in every 100 packets. As the file becomes longer,
the odds of a successful delivery become increasingly small making it
prohibitively expensive for the application alone to ensure reliable delivery.
The network may be able to perform a small amount of work to help guarantee
reliable delivery making the file transfer more efficient.

## [The Design of the POSTGRES Storage System (1987)](TODO) ##
**Summary.**
POSTGRES, the ancestor of PostgreSQL, employed a storage system with three
interesting characteristics:

1. No write-ahead logging (WAL) was used. In fact, there was no recovery code
   at all.
2. The entire database history was recorded and archived. Updates were
   converted to updates, and data could be queried arbitrarily far in the past.
3. The system was designed as a collection of asynchronous processes, rather
   than a monolithic piece of code.

Transactions were sequentially assigned 40-bit transaction identifiers (XID)
starting from 0. Each operation in a transaction was sequentially assigned a
command identifiers (CID). Together the XID and CID formed a 48 bit interaction
identifier (IID). Each IID was also assigned a two-bit transaction status and
all IIDs were stored in a transaction log with a most recent *tail* of
uncommitted transactions and a *body* of completed transactions.

Every tuple in a relation was annotated with

- a record id,
- a min XID, CID, and timestamp,
- a max XID, CID and timestamp, and
- a forward pointer.

The min values were associated with the transaction that created the record,
and the max values were associated with the transaction that updated the
record. When a record was updated, a new tuple was allocated with the same
record id but updated min values, max values, and forward pointers. The new
tuples were stored as diffs; the original tuple was the *anchor point*; and the
forward pointers chained together the anchor point with its diffs.

Data could be queried at a particular timestamp or in a range of timestamps.
Moreover, the min and max values of the records could be extracted allowing for
queries like this:

    SELECT Employee.min_timestamp, Eployee.max_timestamp, Employee.id
    FROM Employee[1 day ago, now]
    WHERE Employee.Salary > 10,000

The timestamp of a transaction was not assigned when the transaction began.
Instead, the timestamps were maintained in a TIME relation, and the timestamps
in the records were left empty and asynchronously filled in. Upon creation,
relations could be annotated as

- *no archive* in which case timestamps were never filled in,
- *light archive* in which timestamps were read from a TIME relation, or
- *heavy archive* in which timestamps were lazily copied from the TIME relation
  into the records.

POSTGRES allowed for any number of indexes. The type of index (e.g. B-tree) and
the operations that the index efficiently supported were explicitly set by the
user.

A *vacuum cleaner* process would, by instruction of the user, vacuum records
stored on disk to an archival storage (e.g. WORM device). The archived data was
allowed to have a different set of indexes. The vacuum cleaning proceeded in
three steps:

1. Data was archived and archive indexes were formed.
2. Anchor points were updated in the database.
3. Archived data space was reclaimed.

The system could crash during this process which could lead to duplicate
entries, but nothing more nefarious. The consistency guarantees were a bit weak
compared to today's standards. Some crashes could lead to slowly accumulating
un-reclaimed space.

Archived data could be indexed by values and by time ranges efficiently using
R-trees. Multi-media indexes which spanned the disk and archive were also
supported.

## [The Linda alternative to message-passing systems (1994)](https://scholar.google.com/scholar?cluster=2449406388273902590&hl=en&as_sdt=0,5) ##
**Summary.**
*Distributed shared memory* is a powerful abstraction for implementing
distributed programs, but implementing the abstraction efficiently is very
challenging. This led to the popularity of message passing abstractions for
parallel and distributed programming which were easier to implement. Linda is a
programming model and family of programming languages that does implement
distributed shared memory as efficiently (or almost as efficiently) as message
passing.

Linda's memory model revolves around a *tuple space*: a collection of tuples
(pretty much a table). Users interact with the tuple space by writing programs
in one of the Linda languages. For example, C-Linda programs are traditional C
programs that can additionally use one of a few Linda constructs:

- `out(...)` synchronously writes tuples into a tuple space.
- `eval(...)` concurrently evaluates its arguments and writes tuples into a
  tuple space asynchronously.
- `in(...)` reads and removes a single tuple from the tuple space using a tuple
  template: a partial tuple filled in with wildcards.
- `rd(...)` is a nondestructive version of `in`.

The paper argues for the flexibility and expressiveness of Linda's memory
model. It makes it easy to implement master/slave architectures where all
workers can access a shared data structure. The data-centric approach allows
processes to communicate by reading and writing data rather than bothering with
message passing details. Tuple spaces make it easy to implement *static load
balancing* in which some static domain is divided evenly between workers and
*dynamic load balancing* in which the tuple space acts as a queue of requests
which are read and processed by workers.

Linda's implementation comprises three parts:

1. *Language-dependent compilers* compile out the Linda specific constructs.
   For example, the C-Linda compiler compiles a C-Linda compiler into pure C;
   the Linda constructs are compiled to function calls which eventually call
   into the Linda runtime.
2. The *link-time optimizer* chooses the best tuple space accessor
   implementations to use for the specific program.
3. The *machine-dependent run-time* partitions the tuple space so that each
   participating machine serves as both a *computation server* and a *tuple
   space server*. Every tuple of a particular tuple type (determined by the
   number of types of its constituents) is assigned to a single Linda server
   known as the *rendezvous point*. The runtime performs a few notable
   optimizations:

    - Certain tuple types are partitioned across machines, rather than all
      being assigned to a single rendezvous point.
    - Certain tuple fields can be quite large in which case, they are not
      transfered from a machine to the rendezvous point. Instead, they are kept
      locally on the machine that produced them. The rendezvous point is then
      used as a metadata service to locate the field's location. This is
      similar to GFS's design.
    - Some reads are broadcasted to all nodes unsolicitedly as a form of
      prefetching.
    - Rendezvous nodes can be reassigned dynamically depending on the workload
      to place data as close as possible to the accessor.

**Commentary.**
The paper argues that Linda's memory model is expressive, and they support
their claim by implementing a particular scientific computing style
application. I disagree. I think the memory model is primitive and missing some
very useful features. In particular,

- Only one tuple can ever be returned at a time.
- Tuple queries are based solely on equality of individual fields. Queries such
  as "select all tuples whose first column is greater than its third column"
  are not supported.
- There are no transactions. The paper also does not describe the consistency
  of the system.

Essentially, the system is more or less a key-value store which arguably is not
expressive enough for many applications. Moreover, I believe there are some
implementation oversights.

- Data is not replicated.
- Only certain tuple types are sharded, and skewed data distributions are not
  discussed.

## [The HP AutoRAID hierarchical storage system (1996)](https://goo.gl/x8Ps2t) ##
**Summary.**
The HP AutoRAID is a hierarchical storage system which caches write-active data
using RAID-1 and stores write-inactive data using RAID-5. The main idea is that
[RAID-1 has higher throughput and lower latency for random
writes](http://pages.cs.wisc.edu/~remzi/OSTEP/file-raid.pdf) but requires more
storage than RAID-5. The AutoRAID system essentially introduces a new level in
the memory hierarchy by using one RAID level (i.e. RAID-1) to cache another
(i.e. RAID-5).

The AutoRAID system implements the following features and functionality:

- Data is dynamically moved between the RAID-1 cache and the RAID-5 storage
  based on the workload.
- Devices can be installed into the system while it is running. For example, a
  new disk can plugged in to an HP AutoRAID device while it is being used. This
  allows for things like rolling disk upgrades.
- If a controller fails, another is ready as backup.
- Writes are written sequentially to the tail of the RAID-5 storage similar to
  a log structured file system.

An HP AutoRAID devices comprises the typical RAID hardware: microprocessors,
disks, volatile memory, non-volatile memory, parity modules, etc. The disks are
divided into (typically 1MB) *physical extents* (PEX) which are grouped into
*physical extent groups* (PEG). Moreover, each PEX is divided into *segments*:
the atomic units used for mirroring or striping.

The logical data model is based on 64 KB *relocation blocks* (RB) that are the
atomic unit of logical data movement. Each AutoRAID device contains multiple
levels of maps (i.e. virtual device table, PEG table, PEX table) to map logical
addresses to physical addresses.

The HP AutoRAID device caches reads and caches writes into NVRAM before issuing
them to the backend (which allows for things like *write coalescing*). If data
is being written and is in the RAID-1 cache, it is written there. Otherwise, it
is promoted from the RAID-5 storage and brought into the RAID-1 cache. Reads
and writes issued to the RAID-1 cache are trivial. Reads from the RAID-5
storage is also simple. Writes to the RAID-5 storage are always appended and
also batched to reduce the number of times parity bits that have to be read,
computed, and written.

Background operations are triggered when the disk is idle and include:

- *Compaction and hole plugging.* Holes in the RAID-1 cache are formed when
  blocks are demoted to RAID-5. Dually, holes in RAID-5 are formed when they
  are promoted to RAID-1 cache. RAID-1 data can be relocated to fill RAID-1
  holes. Similarly, RAID-5 PEGs with few holes can have their holes filled by
  other RAID-5 PEGs that have lots of holes.  Alternatively, RAID-5 PEGs with
  lots of holes can be appended to the RAID-5 storage and reclaimed.
- *Migration* Data is sometimes preemptively demoted from RAID-1 in
  anticipation of accommodating write bursts.
- *Workload Logging*. To create disk traces, I/O requests are logged.

**Commentary.**
- There are a lot of RAID levels and each one has different capacity,
  performance, and reliability. Moreover, performance depends heavily on
  workload. This paper presents the AutoRAID system without much explanation
  for when or why it's expected to perform better than alternatives. For
  example, is AutoRAID only better for random-write workloads? The
  microbenchmarks show that it performs well under sequential writes as well,
  but isn't RAID-1 supposed to perform poorly with sequential writes?
- The AutoRAID system is supposed to be easier to configure than traditional
  RAID devices. The authors argue that typical RAID configuration requires
  detailed knowledge of the expected workloads which can be difficult to come
  by. However, the AutoRAID system also depends on expected workload knowledge.
  The paper admits that the working write set has to be small and slowly
  changing. Later in the paper, the authors also say "it is fairly easy to
  predict or detect the environments that have a large write working-set and to
  avoid them if necessary"; a bit contradictory from earlier. Finally, the
  summary says "there are workloads that do not suit its algorithms well".
- I think the evaluation of the system makes it unclear whether the
  hierarchical storage or the NVRAM caching is responsible for the performance
  improvements.
- The AutoRAID system logs all I/O operations made to it in order to form disk
  traces. Implementing this functionality in the disk device is arguably a
  violation of the end-to-end principle and could have been implemented in the
  OS. However, they argue that the performance overhead is negligible.

## [T Spaces: The Next Wave (1999)](https://goo.gl/mxIv4g) ##
**Summary.**
T Spaces is a

> tuplespace-based network communication buffer with database capabilities that
> enables communication between applications and devices in a network of
> heterogeneous computers and operating systems

Essentially, it's Linda++; it implements a Linda tuplespace with a couple new
operators and transactions.

The paper begins with a history of related tuplespace based work. The notion of
a shared collaborative space originated from AI *blackboard systems* popular in
the 1970's, the most famous of which was the Hearsay-II system. Later, the
Stony Brook microcomputer Network (SBN), a cluster organized in a torus
topology, was developed at Stony Brook, and Linda was invented to program it.
Over time, the domain in which tuplespaces were popular shifted from parallel
programming to distributed programming, and a huge number of Linda-like systems
were implemented.

T Spaces is the marriage of tuplespaces, databases, and Java.

- *Tuplespaces* provide a flexible communication model;
- *databases* provide stability, durability, and advanced querying; and
- *Java* provides portability and flexibility.

T Spaces implements a Linda tuplespace with a few improvements:

- In addition to the traditional `Read`, `Write`, `Take`, `WaitToRead`, and
  `WaitToTake` operators, T Spaces also introduces a `Scan`/`ConsumingScan`
  operator to read/take all tuples matched by a query and a `Rhonda` operator
  to exchange tuples between processes.
- Users can also dynamically register new operators, the implementation of
  which takes of advantage of Java.
- Fields of tuples are indexed by name, and tuples can be queried by named
  value. For example, the query `(foo = 8)` returns *all* tuples (of any type)
  with a field `foo` equal to 8. These indexes are similar to the inversions
  implemented in Phase 0 of System R.
- Range queries are supported.
- To avoid storing large values inside of tuples, files URLs can instead be
  stored, and T Spaces transparently handles locating and transferring the file
  contents.
- T Spaces implements a group based ACL form of authorization.
- T Spaces supports transactions.

To evaluate the expressiveness and performance of T Spaces, the authors
implement a collaborative web-crawling application, a web-search information
delivery system, and a universal information appliance.

## [Generalized Isolation Level Definitions (2000)](TODO) ##
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

## [The Click Modular Router (2000)](https://goo.gl/t1AlsN) ##
**Summary.**
Routers are more than routers. They are also firewalls, load balancers, address
translators, etc. Unfortunately, implementing these additional router
responsibilities is onerous; most routers are closed platforms with inflexible
designs. The Click router architecture, on the other hand, permits the creation
of highly modular and flexible routers with reasonable performance. Click is
implemented in C++ and compiles router specifications to routers which run on
general purpose machines.

Much like how Unix embraces modularity by composing simple *programs* using
*pipes*, the Click architecture organizes a network of *elements* connected by
*connections*. Each element represents an atomic unit of computation (e.g.
counting packets) and is implemented as a C++ object that points to the other
elements to which it is connected. Each element has input and output ports, can
be provided arguments as configuration strings, and can expose arbitrary
methods to other elements and to users.

Connections and ports are either *push-based* or *pull-based*. The source
element of a push connection pushes data to the destination element. For
example, when a network device receives a packet, it pushes it to other
elements. Dually, the destination element of a pull connection can request to
pull data from the source element or receive null if no such data is available.
For example, when a network device is ready to be written to, it may pull data
from other elements. Ports can be designated as pull, push, or agnostic. Pull
ports must be matched with other pull ports, push ports must be matched with
other push ports, and agnostic ports are labeled as pull or push ports during
router initialization. *Queues* are packet storing elements with a push input
port and pull output port; they form the interface between push and pull
connections.

Some elements can process packets with purely local information. Other elements
require knowledge of other elements. For example, a packet dropping element
placed before a queue might integrate the length of the queue in its packet
dropping policy. As a compromise between purely local information and complete
global information, Click provides *flow-based router context* to elements
allowing them to answer queries such as "what queue would a packet reach if I
sent it out of my second port?".

Click routers are specified using a simple declarative configuration language.
The language allows users to group elements into *compound elements* that
behave as a single element.

The Click kernel driver is a single kernel thread that processes elements on a
task queue. When an element is processed, it may in turn push data to or pull
data from other elements forcing them to be processed. To avoid interrupt and
device management overheads, the driver uses polling. Every input and output
device polls for data whenever it is run by the driver. Router configurations
are loaded and element methods are called via the `/proc` file system. The
driver also supports hot-swapping in new router configurations which take over
the state of the previous router.

The authors implement a fully compliant IP router using Click and explore
various extensions to it including scheduling and dropping packets. The
performance of the IP router is measured and analyzed.

## [Chord: A Scalable Peer-to-peer Lookup Service for Internet Applications (2001)](https://goo.gl/AOCTas) ##
**Summary.**
Chord is a peer-to-peer lookup service---today, we'd call it a distributed hash
table---mapping keys to servers that provides load balancing, decentralization,
scalability, availability, and flexible key naming. In a Chord cluster with `N`
nodes, each server stores O(log `N`) data, lookup takes O(log `N`) messages,
and node joining requires O(log `N` * log `N`) messages. Note that Chord maps
keys to *servers*, not *values*, but a key-value interface can easily be built
on top of Chord. In fact, Chord leaves all higher level functionality, like
caching and replication, to the user.

Chord hashes keys and servers (represented by their IP address) into the space
of `m`-bit bitstrings modulo `2^m`. The key `k` is managed by the first server
`n` greater than or equal to `k`. This server is known as the successor of `k`.
Intuitively, keys and servers are assigned to points on a circle of values
ranging from `0` to `2^m`. The successor of a point `k` is the first server
reached by rotating clockwise starting at `k`.

Each node `n` maintains `m` fingers. The `i`th finger is the successor of `n +
2^{i-1}`. For example, the first finger is the successor of `n + 1`, the second
finger is the successor of `n + 2`, the third finger is the successor of `n +
4`, etc. Note that the first finger is the successor of `n`. Under this scheme,
nodes only know about a small fraction of the nodes and cannot identify the
successor of an arbitrary key. In order to find the server assigned to a key
`k`, we follow fingers to the latest node that precedes `k`. Once `k` falls
between a node and its immediate successor, that successor is the successor of
`k`.

In order to handle the joining of a node, servers also maintain a pointer to
their predecessor. When a node `n` joins, it contacts an arbitrary Chord node
`n'` and performs the following procedure:

1. *Update the predecessor and fingers of `n`.* `n` computes its predecessor
   and fingers by simply asking `n'` to look them up. Naively, this requires
   `O(m * log N)` messages. As a small optimization, a node can avoid looking
   up the successor of `n + 2^i` if the successor of `n + 2^{i - 1}` is greater
   than `n + 2^i`. In this case the `i`th finger is the same as the `i-1`th
   finger. This requires `O(log N * log N)` operations. Other optimizations can
   reduce the message complexity to `O(log N)`.
2. *Update the predecessor and fingers of other nodes.* `n` is the `i`th finger
   of a node `p` if `p` precedes `n` by at least `2^i` and `n` precedes the
   `i`th finger of `p`. For `i = 1` to `i = m`, the predecessor `p` of `n -
   2^i` is found. If `n` precedes `p`'s `i`th finger, then its fingers are
   updated. If the fingers are updated, `p` is set to the predecessor of `p`
   and the process repeats.
3. *Notify the application to migrate data to `n`.* Applications are
   responsible for migrating data and therefore must be notified when a new
   node joins the system. Typically a node `n` will take data only from its
   successor.

In order to handle the concurrent joining and leaving of nodes, Chord
periodically runs a stabilization procedure that aims to maintain the
correctness of successor pointers. If a lookup is performed during
stabilization, one of three things can happen:

1. If the successors and fingers are correct, the lookup succeeds as usual.
2. If the successors are correct but the fingers are incorrect, the lookup
   succeeds but may take longer than usual.
3. If the successors are incorrect, the lookup may fail. In this case, the
   application may issue a retry.

When a node `n` joins, it contacts an existing Chord node `n'`. It asks `n'` to
find its successor. Periodically, servers check to see if their successor's
predecessor should be their successor, and they inform their successor about
their existence. They also periodically refresh fingers.

Note that the stabilization cannot handle certain perverse scenarios. For
example, if two disjoint rings form, stabilization will not merge the two
rings.

To handle node failures, nodes maintain `r` successors. When a successors node
fails, lookup is routed to the next of the `r` successors.

## [Inferring Internet Denial-of-Service Activity (2001)](TODO) ##
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

## [SEDA: An Architecture for Well-Conditioned, Scalable Internet Services (2001)](https://goo.gl/wrn04s) ##
**Summary.**
Writing distributed Internet applications is difficult because they have to
serve a huge number of requests, and the number of requests is highly variable
and bursty. Moreover, the applications themselves are also complicated pieces
of code. This paper introduces the *staged event-driven architecture* (SEDA)
which has the following goals.

- *Massive concurrency.* Applications written using SEDA should be able to
  support a very large number of clients.
- *Simplify the construction of well-conditioned services.* A
  *well-conditioned* service is one that gracefully degrades. Throughput
  increases with the number of clients until it saturates at some threshold. At
  this point, throughput remains constant and latency increases proportionally
  with the number of clients. SEDA is designed to make writing well-conditioned
  services easy.
- *Enable introspection.* SEDA applications should be able to inspect and adapt
  to incoming request queues. Some request-per-thread architectures, for
  example, do not enable introspection. Control over thread scheduling is left
  completely to the OS; it cannot be adapted to the queue of incoming
  requests.
- *Self-tuning resource management.* SEDA programmers should not have to tune
  knobs themselves.


SEDA accomplishes these goals by structuring applications as a *network* of
*event-driven stages* connected by *explicit message queues* and managed by
*dynamic resource controllers*. That's a dense sentence, so let's elaborate.

Threading based concurrency models have scalability limitations due to the
overheads of context switching, poor caching, synchronization, etc. The
[event-driven concurrency
model](http://pages.cs.wisc.edu/~remzi/OSTEP/threads-events.pdf) involves
nothing more than a single-threaded loop that reads messages and processes
them. It avoids many of the scalability limitations that threading models face.
In SEDA, the atomic unit of execution is a *stage* and is implemented using an
event-driven concurrency model. Each stage has an input queue of messages which
are read in batches by a thread pool and processed by a user-provided event
handler which can in turn write messages to other stages.

A SEDA application is simply a network (i.e. graph) of interconnected stages.
Notably, the input queue of every stage is finite. This means that when one
stage tries to write data to the input queue of another stage, it may fail.
When this happens, stages have to block (i.e. pushback), start dropping
requests (i.e. load shedding), degrade service, deliver an error to the user,
etc.

To ensure SEDA applications are well-conditioned, various resource managers
tune SEDA application parameters to ensure consistent performance. For example,
the *thread pool controller* scales the number of threads within stages based
on the number of messages in its input queue. Similarly, the *batching
controller* adjusts the size of the batch delivered to each event handler.

The authors developed a SEDA prototype in Java dubbed Sandstorm. As with all
event-driven concurrency models, Sandstorm depends on asynchronous I/O
libraries. It implements asynchronous network I/O as three stages using
existing OS functionality (i.e. select/poll). It implements asynchronous file
I/O using a dynamically resizable thread pool that issues synchronous calls; OS
support for asynchronous file I/O was weak at the time. The authors evaluate
Sandstorm by implementing and evaluating an HTTP server and Gnutella router.

## [Analysis and Evolution of Journaling File Systems (2005)](TODO) ##
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

## [Architecture of a Database System (2007)](https://scholar.google.com/scholar?cluster=11466590537214723805&hl=en&as_sdt=0,5) ##
**Chapter 1 -- Introduction.**
Database textbooks often focus on data structures and algorithms in the context
of a single database component. This paper, as opposed most database textbooks,
focuses instead on *database architecture*: the design and best practices of
modern databases that are otherwise undocumented or exist only as tribal
knowledge.

Modern relational database management systems (RDBMS) comprise five components,
most of which are discussed in detail in this paper:

1. The *client communications manager* is responsible for interfacing with
   client connections.
2. The *process manager* is responsible allocating workers to requests using
   some combination of OS processes, OS threads, and user-level threads. It is
   also responsible for *admission control*: the process by which request
   processing is delayed until sufficient resources are available.
3. The *relational query processor* is responsible for translating a SQL query
   into an optimal query plan. It is also responsible for authorization.
4. The *transactional storage manager* implements the data structures and
   algorithms to store and read data from disk. It is also responsible for
   managing concurrent transactions. It includes the buffer manager, the lock
   manager, and the log manager.
5. Finally, there are miscellaneous *shared components and utilities*.

**Chapter 2 -- Process Models.**
Database management systems have to handle multiple user requests concurrently.
The process manager is responsible for mapping logical DBMS workers, which
handle a DBMS client requests, to OS processes, OS threads, user-level threads,
or some combination of the three. To simplify matters, this chapter discusses
process models only for unikernels. There are three main process models:

1. *Process per DBMS worker*. In this model, a new process is spawned for every
   request. This method is easy to implement and provides a small amount of
   isolation (e.g. a memory overflow in one process won't crash another
   process). However, this model is complicated by shared in-memory data
   structures such as the buffer pool and lock table. These are traditionally
   shared through OS supported shared memory. Moreover, context switching
   between processes is more expensive than context switching between threads.
   IBM DB2, PostgreSQL, and Oracle use this process model.
2. *Thread per DBMS worker*. In this model, a new thread (OS or user-level) is
   spawned for every request. This model can handle more requests than the
   previous model, and shared in-memory data structures (e.g. buffer pool, log
   tail) can simply reside in the heap. However, it is less portable and harder
   to implement and debug.  IBM DB2, Microsoft SQL Server, MySQL, Informix, and
   Sybase use this process model.
3. *Process pool*. In this model, requests are dispatched to a fixed number of
   processes; a new process is not spawned for every request. This approach has
   all the benefits of the process per DBMS worker approach but with much less
   overhead.

The process manager is also responsible for admission control: the process by
which a request is not serviced until sufficient resources are available.
Without admission control, a database can start thrashing; for example, imagine
a situation in which the working set of the database is larger than the buffer
pool, and all I/Os become cache misses. Admission control provides *graceful
degradation*; throughput should not decrease, and latency should scale
proportionally with the number of requests. Typically a two-tier admission
control policy is used:

- First, the client communication manager limits the number of concurrently
  open connections.
- Second, the execution admission controller runs after a query has been
  planned and delays execution until there are enough resources available to
  satisfy the query optimizer's estimated

    - disk access and number of I/Os,
    - CPU load, and
    - memory footprint.

The memory footprint is particularly important because it is most commonly the
cause of thrashing.

**Chapter 3 -- Parallel Architecture: Processes and Memory Coordination.**
Parallel hardware is ubiquitous. This chapter builds off the previous and
explores process models for database systems with multiple cores and multiple
machines.

1. *Shared Memory.* In a shared memory model, all processors can access shared
   RAM and disk with roughly the same performance. All three of the process
   models presented in the last chapter (i.e. process-per-worker,
   thread-per-worker, and process-pool/thread-pool) work well in a shared
   memory model. The OS transparently schedules processes and threads across
   the processors taking advantage of the parallel hardware without much
   effort. It is much more difficult to modify the query evaluator to take
   advantage of the multiple processors. Also, systems employing user-level
   threading must implement thread migration to take full advantage of multiple
   cores.
2. *Shared-Nothing.* A shared-nothing system is a networked cluster of
   independent machines that share, well, nothing. In a shared-nothing system,
   all coordination and communication is left to the DBMS. Typically, tables
   are *horizontally partitioned* between machines. That is, each machine is
   assigned a subset of the tuples in each table using range partitioning, hash
   partitioning, round-robin partitioning, or some sort of hybrid partitioning.
   Each machine uses a shared memory model and receives queries, creates query
   plans, and execute queries as usual. The big difference is that queries are
   now evaluated on multiple machines at once, and the DBMS has to orchestrate
   the exchange of control and data messages. The database also has to
   implement very challenging distributed protocols like distributed deadlock
   detection and two-phase commit. Worse, by virtue of being a distributed
   system, shared-nothing architectures can experience *partial failure* which
   can be handled in one of many ways.

    1. Every machine can be stopped whenever any machine fails. This makes a
       shared-nothing architecture as fault-tolerant as a shared-memory
       architecture.
    2. Some database systems, like Informix, simply skip over data hosted by a
       failed machine. This has weak and unpredictable semantics.
    3. Data can be replicated to tolerate failures. For example, a full
       database backup could be maintained, or more sophisticated techniques
       like [chained
       declustering](https://scholar.google.com/scholar?cluster=10345968159835311656&hl=en&as_sdt=0,5)
       could be employed.

   Despite the complexities that arise from a shared-nothing architecture, they
   achieve unparalleled scalability.
3. *Shared Disk.* In a shared disk system, processors all have access to a
   shared disk with roughly equal performance; they do not share RAM. Shared
   disk systems are much less complicated than shared-nothing systems because
   the failure of any machine does not lead to data unavailability. Still,
   shared disk systems require explicit coordination for in-memory data sharing
   including distributed lock managers, distributed buffer pools, etc.
4. *NUMA.* NUMA systems provide a shared memory model over a cluster of
   independent shared-nothing machines. NUMA clusters are dead, but the idea of
   non-uniform memory access lives on in shared-memory multiprocessors. In
   order to scale to a large number of cores, shared-memory NUMA processors
   organize CPUs and memories into pods where intra-pod memory access is fast
   but inter-pod memory access is slow. Databases may be able to ignore the
   non-uniformity of a NUMA multiprocessor, or they can employ certain
   optimizations:

    - Memory should always be local to a processor.
    - Tasks should be scheduled on the same processor it was previously run.

Almost all databases support shared memory systems, and most support either
shared-disk or shared-nothing architectures as well.

**Chapter 4 -- Relational Query Processor.**
TODO

**Chapter 5 -- Storage Management.**
TODO

**Chapter 6 -- Transactions: Concurrency Control and Recovery.**
TODO

**Chapter 7 -- Shared Components.**
TODO

## [BOOM Analytics: Exploring Data-Centric, Declarative Programming for the Cloud (2010)](TODO) ##
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

## [Consistency Analysis in Bloom: a CALM and Collected Approach (2011)](TODO) ##
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

## [Logic and Lattices for Distributed Programming (2012)](TODO) ##
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

## [Resilient Distributed Datasets: A Fault-Tolerant Abstraction for In-Memory Cluster Computing (2012)](TODO) ##
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

## [Highly Available Transactions: Virtues and Limitations (2014)](TODO) ##
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

## [Decibel: The Relational Dataset Branching System (2016)](TODO) ##
**Summary.**
*Decibel* is like git for relational data.

Often, teams need to simultaneously query, analyze, clean, or curate a
collection of data without clobbering each other's work. Currently, the best
solution available involves each team member making copies of the entire
database. This is undesirable for a number of reasons:

- Data is stored very redundantly, wasting a huge amount of storage.
- It is difficult to share or merge changes made to local snapshots of the
  data.
- There is no systematic way to say which version of the data was used for a
  given experiment.

Version control solves these problems, but existing version control systems
(e.g. git) have a couple of shortcomings when applied naively to large
datasets:

- Using distributed version control systems like git, clients clone an entire
  copy of a repository's contents. This is infeasible when working with large
  datasets.
- Version control systems like git operate on arbitrary data and do not
  understand the structure of relational data. This makes certain operations
  like generic diffing a bad fit.
- Systems like git do not support high-level data management or query APIs.

Decibel manages *datasets* which are collections of relations, and each
relation's schema includes an immutable primary key which is used to track the
version of each row. Beginning with an initial snapshot of a dataset, users can
check out, branch, and commit changes to the data set in a style very similar
to git. When data is merged, non-conflicting changes to separate columns of the
same row are both applied. If conflicting changes to the same column of the
same row occur, one branch's changes take priority. Diffing two tables across
two branches results in a table of insertions and deletions. Finally, data can
be queried across versions using VQuel: a query language which is notably not
SQL.

This paper describes three physical realizations of Decibel's logical data
model.

1. In a *tuple-first* representation, tables contain every version of every
   row, and each row is annotated with a bitmap indicating the set of versions
   in which the row is live. In a *tuple-oriented* approach, each of `N` tuples
   comes with a `B`-bit bitmap for `B` branches. In a *branch-oriented*
   approach, there are `B` `N`-bit bitmaps.
2. In a *version-first* representation, all the changes made to a table in a
   branch are stored together in the same file, and these branched files
   contain pointers to their ancestors forming a directed acyclic graph.
3. In a *hybrid* representation, data is stored similarly to the version-first
   approach, but each of the branched files (called *segments*) includes a
   *segment index*: a bitmap, like in the tuple-first representation, that
   tracks the liveness of each row for all descendent branches. Moreover, there
   is a single *branch-segment bitmap* which for each branch, records the set
   of segments with a tuple live in that branch.

The tuple-first representation is good for multi-version queries, the
version-first representation is good for single-version queries, and the hybrid
approach is good at both.

This paper also presents a versioned database benchmarking framework in the
form of a set of branching strategies and characteristic queries to analyze
Decibel and any future versioned databases.

**Commentary.**
A git-like versioned relational database seems like a great idea! This paper
focuses on how to *implement* and *analyze* such a database efficiently; it
focuses less on the higher-level semantics of data versioning. Notably, two
unanswered questions stuck out to me that seem like interesting areas for
future research.

1. The current merging strategy seems inconvenient, if not inconsistent.
   Imagine a table `R(key, a, b)` with the invariant that `a + b < 10`. Imagine
   branch `b1` updates a tuple `(0, 0, 0)` to `(0, 9, 0)` and branch `b2`
   updates it to `(0, 0, 9)`.  If these tuples are merged, the tuple becomes
   `(0, 9, 9)` violating the invariant. In systems like git, users can manually
   inspect and verify the correctness of the merge, but if a large dataset is
   being merged, this becomes infeasible. I think more research is needed to
   determine if this strategy is good enough and won't cause problems in
   practice. Or if it is insufficient, what merging strategies can be applied
   on large datasets.  Perhaps ideas could be borrowed from CRDT literature; if
   all columns were semilattices, the columns could be merged in a sane way.
2. How useful is diffing when dealing with large datasets? When working with
   git, even a modestly sized diff can become confusing. Would a non-trivial
   diff of a large dataset be incomprehensible?

## [Goods: Organizing Google's Datasets (2016)](TODO) ##
**Summary.**
In fear of fettering development and innovation, companies often allow
engineers free reign to generate and analyze datasets at will. This often leads
to unorganized data lakes: a ragtag collection of datasets from a diverse set
of sources. Google Dataset Search (Goods) is a system which uses unobstructive
post-hoc metadata extraction and inference to organize Google's unorganized
datasets and present curated dataset information, such as metadata and
provenance, to engineers.

Building a system like Goods at Google scale presents many challenges.

- *Scale.* There are 26 billion datasets. *26 billion* (with a b)!
- *Variety.* Data comes from a diverse set of sources (e.g. BigTable, Spanner,
  logs).
- *Churn.* Roughly 5% of the datasets are deleted everyday, and datasets are
  created roughly as quickly as they are deleted.
- *Uncertainty.* Some metadata inference is approximate and speculative.
- *Ranking.* To facilitate useful dataset search, datasets have to be ranked by
  importance: a difficult heuristic-driven process.
- *Semantics.* Extracting the semantic content of a dataset is useful but
  challenging. For example consider a file of protos that doesn't reference the
  type of proto being stored.

The Goods catalog is a BigTable keyed by dataset name where each row contains
metadata including

- *basic metatdata* like timestamp, owners, and access permissions;
- *provenance* showing the lineage of each dataset;
- *schema*;
- *data summaries* extracted from source code; and
- *user provided annotations*.

Moreover, similar datasets or multiple versions of the same logical dataset are
grouped together to form *clusters*. Metadata for one element of a cluster can
be used as metadata for other elements of the cluster, greatly reducing the
amount of metadata that needs to be computed. Data is clustered by timestamp,
data center, machine, version, and UID, all of which is extracted from dataset
paths (e.g. `/foo/bar/montana/August01/foo.txt`).

In addition to storing dataset metadata, each row also stores *status
metadata*: information about the completion status of various jobs which
operate on the catalog. The numerous concurrently executing batch jobs use
*status metadata* as a weak form of synchronization and dependency resolution,
potentially deferring the processing of a row until another job has processed
it.

The fault tolerance of these jobs is provided by a mix of job retries,
BigTable's idempotent update semantics, and a watchdog that terminates
divergent programs.

Finally, a two-phase garbage collector tombstones rows that satisfy a garbage
collection predicate and removes them one day later if they still match the
predicate. Batch jobs do not process tombstoned rows.

The Goods frontend includes dataset profile pages, dataset search driven by a
handful of heuristics to rank datasets by importance, and teams dashboard.
