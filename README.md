# Table of Contents #
1. [A Relational Model of Data for Large Shared Data Banks (1970)](#a-relational-model-of-data-for-large-shared-data-banks-1970)
1. [The Unix Time-Sharing System (1974)](#the-unix-time-sharing-system-1974)
1. [On the Duality of Operating System Structures (1979)](#on-the-duality-of-operating-system-structures-1979)
1. [Experience with Processes and Monitors in Mesa (1980)](#experience-with-processes-and-monitors-in-mesa-1980)
1. [A History and Evaluation of System R (1981)](#a-history-and-evaluation-of-system-r-1981)
1. [A Fast File System for UNIX (1984)](#a-fast-file-system-for-unix-1984)
1. [End-to-End Arguments in System Design (1984)](#end-to-end-arguments-in-system-design-1984)
1. [The Design of the POSTGRES Storage System (1987)](#the-design-of-the-postgres-storage-system-1987)
1. [Microkernel Operating System Architecture and Mach (1992)](#microkernel-operating-system-architecture-and-mach-1992)
1. [The Linda alternative to message-passing systems (1994)](#the-linda-alternative-to-message-passing-systems-1994)
1. [SPIN -- An Extensible Microkernel for Application-specific Operating System Services (1995)](#spin----an-extensible-microkernel-for-application-specific-operating-system-services-1995)
1. [The HP AutoRAID hierarchical storage system (1996)](#the-hp-autoraid-hierarchical-storage-system-1996)
1. [Disco: Running Commodity Operating Systems on Scalable Multiprocessors (1997)](#disco-running-commodity-operating-systems-on-scalable-multiprocessors-1997)
1. [T Spaces: The Next Wave (1999)](#t-spaces-the-next-wave-1999)
1. [Generalized Isolation Level Definitions (2000)](#generalized-isolation-level-definitions-2000)
1. [The Click Modular Router (2000)](#the-click-modular-router-2000)
1. [Chord: A Scalable Peer-to-peer Lookup Service for Internet Applications (2001)](#chord-a-scalable-peer-to-peer-lookup-service-for-internet-applications-2001)
1. [Inferring Internet Denial-of-Service Activity (2001)](#inferring-internet-denial-of-service-activity-2001)
1. [SEDA: An Architecture for Well-Conditioned, Scalable Internet Services (2001)](#seda-an-architecture-for-well-conditioned-scalable-internet-services-2001)
1. [Xen and the Art of Virtualization (2003)](#xen-and-the-art-of-virtualization-2003)
1. [Analysis and Evolution of Journaling File Systems (2005)](#analysis-and-evolution-of-journaling-file-systems-2005)
1. [Live Migration of Virtual Machines (2005)](#live-migration-of-virtual-machines-2005)
1. [Architecture of a Database System (2007)](#architecture-of-a-database-system-2007)
1. [SnowFlock: Rapid Virtual Machine Cloning for Cloud Computing (2009)](#snowflock-rapid-virtual-machine-cloning-for-cloud-computing-2009)
1. [BOOM Analytics: Exploring Data-Centric, Declarative Programming for the Cloud (2010)](#boom-analytics-exploring-data-centric-declarative-programming-for-the-cloud-2010)
1. [The Declarative Imperative: Experiences and Conjectures in Distributed Logic (2010)](#the-declarative-imperative-experiences-and-conjectures-in-distributed-logic-2010)
1. [Conflict-free Replicated Data Types (2011)](#conflict-free-replicated-data-types-2011)
1. [Consistency Analysis in Bloom: a CALM and Collected Approach (2011)](#consistency-analysis-in-bloom-a-calm-and-collected-approach-2011)
1. [Dedalus: Datalog in Time and Space (2011)](#dedalus-datalog-in-time-and-space-2011)
1. [Mesos: A Platform for Fine-Grained Resource Sharing in the Data Center (2011)](#mesos-a-platform-for-fine-grained-resource-sharing-in-the-data-center-2011)
1. [Logic and Lattices for Distributed Programming (2012)](#logic-and-lattices-for-distributed-programming-2012)
1. [Resilient Distributed Datasets: A Fault-Tolerant Abstraction for In-Memory Cluster Computing (2012)](#resilient-distributed-datasets-a-fault-tolerant-abstraction-for-in-memory-cluster-computing-2012)
1. [Apache Hadoop YARN: Yet Another Resource Negotiator (2013)](#apache-hadoop-yarn-yet-another-resource-negotiator-2013)
1. [Discretized Streams: Fault-Tolerant Streaming Computation at Scale (2013)](#discretized-streams-fault-tolerant-streaming-computation-at-scale-2013)
1. [From L3 to seL4 What Have We Learnt in 20 Years of L4 Microkernels? (2013)](#from-l3-to-sel4-what-have-we-learnt-in-20-years-of-l4-microkernels-2013)
1. [Innovative Instructions and Software Model for Isolated Execution (2013)](#innovative-instructions-and-software-model-for-isolated-execution-2013)
1. [MillWheel: Fault-Tolerant Stream Processing at Internet Scale (2013)](#millwheel-fault-tolerant-stream-processing-at-internet-scale-2013)
1. [Highly Available Transactions: Virtues and Limitations (2014)](#highly-available-transactions-virtues-and-limitations-2014)
1. [Shielding Applications from an Untrusted Cloud with Haven (2014)](#shielding-applications-from-an-untrusted-cloud-with-haven-2014)
1. [Impala: A Modern, Open-Source SQL Engine for Hadoop (2015)](#impala-a-modern-open-source-sql-engine-for-hadoop-2015)
1. [Large-scale cluster management at Google with Borg (2015)](#large-scale-cluster-management-at-google-with-borg-2015)
1. [Spark SQL: Relational Data Processing in Spark (2015)](#spark-sql-relational-data-processing-in-spark-2015)
1. [Borg, Omega, and Kubernetes (2016)](#borg-omega-and-kubernetes-2016)
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

## [The Unix Time-Sharing System (1974)](https://scholar.google.com/scholar?cluster=2132419950152599605&hl=en&as_sdt=0,5)
**Summary.**
Unix was an operating system developed by Dennis Ritchie, Ken Thompson, and
others at Bell Labs. It was the successor to Multics and is probably the single
most influential piece of software ever written.

Earlier versions of Unix were written in assembly, but the project was later
ported to C: probably the single most influential programming language ever
developed. This resulted in a 1/3 increase in size, but the code was much more
readable and the system included new features, so it was deemed worth it.

The most important feature of Unix was its file system. Ordinary files were
simple arrays of bytes physically stored as 512-byte blocks: a rather simple
design. Each file was given an inumber: an index into an ilist of inodes. Each
inode contained metadata about the file and pointers to the actual data of the
file in the form of direct and indirect blocks. This representation made it
easy to support (hard) linking. Each file was protected with 9 bits: the same
protection model Linux uses today. Directories were themselves files which
stored mappings from filenames to inumbers. Devices were modeled simply as
files in the `/dev` directory. This unifying abstraction allowed devices to be
accessed with the same API. File systems could be mounted using the `mount`
command. Notably, Unix didn't support user level locking, as it was neither
necessary nor sufficient.

Processes in Unix could be created using a fork followed by an exec, and
processes could communicate with one another using pipes. The shell was nothing
more than an ordinary process. Unix included file redirection, pipes, and the
ability to run programs in the background. All this was implemented using fork,
exec, wait, and pipes.

Unix also supported signals.

## [On the Duality of Operating System Structures (1979)](https://scholar.google.com/scholar?cluster=12379045883699292297&hl=en&as_sdt=0,5)
**Summary.**
Lauer and Needham explain the duality in expressiveness and performance between

- *message-oriented* concurrency models in which there are a small number of
  fixed tasks that communicate explicitly, and
- *process-oriented* concurrency models in which there are a larger number of
  dynamic processes that share memory.

Message-oriented systems can be characterized by the following hallmarks,
consequences, and provided facilities.

| Hallmark                                                                                 | Consequences                                                                                            | Facilities                                                                                                      |
|------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------|
| Long standing communication channels are typically created during program initialization | Synchronization is implicitly performed in the queues connecting processes                              | Messages and message ids                                                                                        |
| There are a fewer number of long lasting processes                                       | Shared structures are passed by reference; only processes with a reference to a structure can act on it | Message channels and ports that provide the ability to `Send`, `WaitForReply`, `WaitForMessage`, or `SendReply` |
| Processes don't share memory                                                             | Peripheral devices are treated like processes and communicated with                                     | Process creation (but no deletion)                                                                              |
|                                                                                          | Processes read a small number of messages at a time                                                     |                                                                                                                 |

Process-oriented systems can be similarly characterized:

| Hallmark                                                 | Consequences                                                         | Facilities                         |
|----------------------------------------------------------|----------------------------------------------------------------------|------------------------------------|
| Global data can be protected and accessed via interfaces | Synchronization is performed in locks                                | Procedures                         |
| Process creation and deletion is a lightweight task      | Data is shared directly, with small portions being locked            | `fork`/`join` procedure invocation |
| Processes typically have a single job                    | Peripheral interaction typically involves locking and sharing memory | Modules and monitors               |
|                                                          |                                                                      | Module instantiation               |
|                                                          |                                                                      | Condition variables                |

There is a duality between the two concurrency models. Any program in one has a
corresponding program written in the other. Lauer and Needham demonstrate the
duality not by simulating  model's primitives using the other, but by drawing
similarities between the two's components:

| Message-oriented                            | Process-oriented                      |
| ------------------------------------------- | ------------------------------------- |
| Processes, `CreateProcess`                  | Monitors, `NEW`/`START`               |
| Message Channels                            | External Procedure identifiers        |
| Message Ports                               | `ENTRY` procedure identifiers         |
| `SendMessage; AwaitReply`                   | simple procedure call                 |
| `SendMessage; ... AwaitReply`               | `FORK; ... JOIN`                      |
| `SendReply`                                 | `RETURN`                              |
| `WaitForMessage` loop with `case` statement | monitor lock, `ENTRY` attribute       |
| arms of `case` statement                    | `ENTRY` procedure declarations        |
| selective waiting for messages              | condition variables, `WAIT`, `SIGNAL` |

This correspondence can be used to directly rewrite a canonical program between
the two models. In fact, the differences between the two models becomes simply
a matter of keyword choice. Moreover, if both models are implemented with
identical blocking and scheduling mechanism, then the two models lead to
identical performance as well. Since the choice of model does not affect the
user or implementor, the decision of which model to use should be based on the
architecture of the underlying hardware.

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

## [A History and Evaluation of System R (1981)](https://scholar.google.com/scholar?cluster=9472628621431764243&hl=en&as_sdt=0,5)
**Summary.**
Ed Codd proposed the relational model in 1970. As opposed to the navigational
data models that came before it, the relational model boasted *data
independence*: the ability for data storage and access methods to change
independently of applications. Some worried that data independence necessitated
poor performance. System R was one of the first relation databases and proved
that the relational model could be implemented efficiently.

System R development proceeded in three phases. *Phase 0* (1974-1975) was a
single-user PL/I interpreter prototype that processed a subset of SQL (e.g. no
joins) using the XRM access method. The Phase 0 prototype was always intended
to be thrown away. Instead, the focus was on tuning the user interface SQL.
User studies and interviews were performed to increase the usability and
understandability of SQL. Every tuple in the database was labelled with a TID
which contained a page number. Each tuple contained pointers into separate
domains, and *inversions* existed to map domain values to TIDs. The Phase 0
query optimizer aimed to minimize the number of fetched tuples and would
perform tricks like TID intersection to evaluate conjunctions. The prototype
also introduced the design that the system catalog should be stored as
relations. Phase 0 brought about the following ideas:

1. The optimizer should consider more than the cost of fetching tuples. It
   should also take into account the costs of TID manipulation, data fetching,
   etc.
2. Number of I/Os would have been a better metric than the number of tuples
   fetched. This would have also exposed the deficiency of the XRM access
   method.
3. The Phase 0 optimizer was CPU bound! This encouraged the later optimizer to
   be a weighted cost of CPU and I/O.
4. SQL joins are very important.
5. The query optimizer was complicated; more care should be given towards
   simpler and more common queries.

*Phase 1* ranged from 1976 to 1977 and included the implementation of a full
blown multi-user relational database. Phase 1 was divided into two pieces:

1. The *Relational Data System* (RDS) was an optimizing SQL processor
   responsible for query optimization.
2. The *Research Storage System* (RSS) was the access method that replaced XRM
   and was responsible for things like locking and logging.

Users could query System R using interactive queries or by embedding SQL
queries in PL/I or Cobol. A preprocessor would compile the embedded SQL queries
into an access module using a repository of hand-compiled fragments. Of course,
the compiled query plan could be invalidated over time. For example, the query
plan could use an index which is later dropped. Thus, each query's dependencies
were put in the system catalog and queries were recompiled when their
dependencies were invalidated.

Unlike the XRM, the RSS stored data directly in the tuples. This meant that
certain column values were stored redundantly, but an entire row could be read
in a single I/O. RSS also supported B+ tree indexes, tuple links, index scans,
full table scans, link scans, tuple nested loop joins, index nested loop joins,
and sort merge joins.

The query optimizer minimized a weighted sum of RSS calls and I/Os using a
dynamic programming approach. It avoided using some of the TID list
intersection tricks that the Phase 0 optimizer used.

Views were stored as parse trees and merged back into the SQL queries used to
query them. Updates were only allowed on single-table views. Views were the
atomic unit of authorization using a grant/revoke mechanism.

System R used a combination of logging and shadow pages to implement recovery.
During recovery, pages were restored to their old shadow pages, and the log was
processed backwards.

Since Phase 1 was a multi-user database, it introduced multiple granularity
locking in the form of intension locks. Originally, it had predicate locking,
but this was abandoned because it was (1) difficult to check for predicate
disjointness, (2) predicates were sometimes falsely marked as overlapping, and
(3) predicate locking broke the abstraction barrier of the RSS.

*Phase 2* was a two-year period in which System R was evaluated. Users
generally enjoyed the uniformity of SQL, and their recommendations led to the
introduction of EXISTS, LIKE, prepared statements, and outer joins. The query
optimizer was evaluated assuming that data was uniformly distributed and that
all columns were independent. Shadow pages led to poor locality, extra
bookkeeping, and semi-expensive page swapping. System R provided read
uncommitted, read committed, and full serializable transactions. Read
uncommitted wasn't implemented as fast as it should have been. Read committed
had more overhead than expected. Serializable transactions ended up being the
most commonly used.

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
together. Moreover, if the amount of available space gets too low, then it
becomes more and more difficult to allocate blocks efficiently. For example, it
becomes hard to allocate the files of a block contiguously. Thus, the system
always tries to keep ~10% of the disk free.

Allocation is also improved in the FFS. A top level global policy uses file
system wide information to decide where to put new files. Then, a local policy
places the blocks. Care must be taken to colocate blocks that are accessed
together, but crowding a single cyclinder group can exhaust its resources.

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

## [Microkernel Operating System Architecture and Mach (1992)](https://scholar.google.com/scholar?cluster=1074648542567860981&hl=en&as_sdt=0,5)
**Summary.**
A *microkernel* is a very minimal, very low-level piece of code that interfaces
with hardware to implement the functionality needed for an operating system.
Operating systems implemented using a microkernel architecture, rather than a
monolithic kernel architecture, implement most of the operating system in user
space on top of the microkernel.  This architecture affords many advantages
including:

- *tailorability*: many operating systems can be run on the same microkernel
- *portability*: most hardware-specific code is in the microkernel
- *network accessibility*: operating system services can be provided over the
  network
- *extensibility*: new operating system environments can be tested along side
  existing ones
- *real-time*: the kernel does not hold locks for very long
- *multiprocessor support*: microkernel operations can be parallelized across
  processors
- *multicomputer support*: microkernel operations can be parallelized across
  computers
- *security*: a microkernel is a small trusted computing base

This paper describes various ways in which operating systems can be implemented
on top of the Mach microkernel. Mach's key features include:

- *task and thread management*: Mach supports tasks (i.e. processes) and
  threads. Mach implements a thread scheduler, but privileged user level
  programs can alter the thread scheduling algorithms.
- *interprocess communication*: Mach implements a capabilities based IPC
  mechanism known as ports. Every object in Mach (e.g. tasks, threads, memory)
  is managed by sending message to its corresponding port.
- *memory object management*: Memory is represented as memory objects managed
  via ports.
- *system call redirection*: Mach allows a number of system calls to be caught
  and handled by user level code.
- *device support*: Devices are represented as ports.
- *user multiprocessing*: Tasks can use a user-level threading library.
- *multicomputer support*: Mach abstractions can be transparently implemented
  on distributed hardware.
- *Continuations*: In a typical operating system, when a thread blocks, all of
  its registers are stored somewhere before another piece of code starts to
  run. Its stack is also left intact. When the blocking thread is resumed, its
  stored registers are put back in place and the thread starts running again.
  This can be wasteful if the thread doesn't need all of the registers or its
  stack. In Mach, threads can block with a continuation: an address and a bunch
  of state. This can be more efficient since the thread only saves what it
  needs to keep executing.

Many different operating systems can be built on top of Mach. It's ideal that
applications built for these operating systems can continue to run unmodified
even when the underlying OS is implemented on top of Mach. A key part of this
virtualization is something called an *emulation library*. An emulation library
is a piece of code inserted into an application's address space. When a program
issues system call, Mach immediately redirects control flow to the emulation
library to process it. The emulation library can then handle the system call
by, for example, issuing an RPC to an operating system server.

Operating systems built on Mach can be architected in one of three ways:

1. The entire operating system can be baked into the emulation library.
2. The operating system can be shoved into a single multithreaded Mach task.
   This architecture can be very memory efficient, and is easy to implement
   since the guest operating system can be ported with very little code
   modification.
3. The operating system can be decomposed into a larger number of smaller
   processes that communicate with one another using IPC. This architecture
   encourages modularity, and allows certain operating system components to be
   reused between operating systems. This approach can lead to inefficiency,
   especially if IPC is not lighting fast!

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

## [SPIN -- An Extensible Microkernel for Application-specific Operating System Services (1995)](https://scholar.google.com/scholar?cluster=4910839957971330989&hl=en&as_sdt=0,5)
**Summary.**
Many operating systems were built a long time ago, and their performance was
tailored to the applications and workloads at the time. More recent
applications, like databases and multimedia applications, are quite different
than these applications and can perform quite poorly on existing operating
systems. SPIN is an extensible microkernel that allows applications to tailor
the operating system to meet their needs.

Existing operating systems fit into one of three categories:

1. They have no interface by which applications can modify kernel behavior.
2. They have a clean interface applications can use to modify kernel behavior
   but the implementation of the interface is inefficient.
3. They have an unconstrained interface that is efficiently implemented but
   does not provide isolation between applications.

SPIN provides applications a way to efficiently and safely modify the behavior
of the kernel. Programs in SPIN are divided into the user-level code and a
spindle: a portion of user code that is dynamically installed and run in the
kernel. The kernel provides a set of abstractions for physical and logical
resources, and the spindles are responsible for managing these resources. The
spindles can also register to be invoked when certain kernel events (i.e. page
faults) occur. Installing spindles directly into the kernel provides
efficiency. Applications can execute code in the kernel without the need for a
context switch.

To ensure safety, spindles are written in a typed object-oriented language.
Each spindle is like an object; it contains local state and a set of methods.
Some of these methods can be called by the application, and some are registered
as callbacks in the kernel. A spindle checker uses a combination of static
analysis and runtime checks to ensure that the spindles meet certain kernel
invariants. Moreover, SPIN relies on advanced compiler technology to ensure
efficient spindle compilation.

General purpose high-performance computing, parallel processing, multimedia
applications, databases, and information retrieval systems can benefit from the
application-specific services provided by SPIN. Using techniques such as

- extensible IPC;
- application-level protocol processing;
- fast, simple, communication;
- application-specific file systems and buffer cache management;
- user-level scheduling;
- optimistic transaction;
- real-time scheduling policies;
- application-specific virtual memory; and
- runtime systems with memory system feedback,

applications can be implemented more efficiently on SPIN than on traditional
operating systems.

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

## [Disco: Running Commodity Operating Systems on Scalable Multiprocessors (1997)](https://scholar.google.com/scholar?cluster=17298410582406300869&hl=en&as_sdt=0,5)
**Summary.**
Operating systems are complex, million line code bases. Multiprocessors were
becoming popular, but it was too difficult to modify existing commercial
operating systems to take full advantage of the new hardware. Disco is a
*virtual machine monitor*, or *hypervisor*, that uses virtualization to run
commercial virtual machines on cache-coherent NUMA multiprocessors. Guest
operating systems running on Disco are only slightly modified, yet are still
able to take advantage of the multiprocessor. Moreover, Disco offers all the
traditional benefits of a hypervisor (e.g. fault isolation).

Disco provides the following interfaces:

- *Processors.* Disco provides full virtualization of the CPU allowing for
  restricted direct execution. Some privileged registers are mapped to memory
  to allow guest operating systems to read them.
- *Physical memory.* Disco virtualizes the guest operating system's physical
  address spaces, mapping them to hardware addresses. It also supports page
  migration and replication to alleviate the non-uniformity of a NUMA machine.
- *I/O devices.* All I/O communication is simulated, and various virtual disks
  are used.

Disco is implemented as follows:

- *Virtual CPUs.* Disco maintains the equivalent of a process table entry for
  each guest operating system. Dicso runs in kernel mode, guest operating
  systems run in supervisor mode, and applications run in user mode.
- *Virtual physical memory.* To avoid the overhead of physical to hardware
  address translation, Disco maintains a large software physical to hardware
  TLB.
- *NUMA.* Disco migrates pages to the CPUs that access them frequently, and
  replicates read-only pages to the CPUs that read them frequently. This
  dynamic page migration and replications helps mask the non-uniformity of a
  NUMA machine.
- *Copy-on-write disks.* Disco can map physical addresses in different guest
  operating systems to a read-only page in hardware memory. This lowers the
  memory footprint of running multiple guest operating systems. The shared
  pages are copy-on-write.
- *Virtual network interfaces.* Disco runs a virtual subnet over which guests
  can communicate using standard communication protocols like NFS and TCP.
  Disco uses a similar copy-on-write trick as above to avoid copying data
  between guests.

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

## [Xen and the Art of Virtualization (2003)](https://scholar.google.com/scholar?cluster=11605682627859750448&hl=en&as_sdt=0,5)
**Summary.**
Many virtual machine monitors, or *hypervisors*, aim to run unmodified guest
operating systems by presenting a completely virtual machine. This lets any OS
run on the hypervisor but comes with a significant performance penalty. Xen is
an x86 hypervisor that uses *paravirtualization* to reduce virtualization
overheads. Unlike with full virtualization, paravirtualization only virtualizes
some components of the underlying machine. This paravirtualization requires
modifications to the guest operating systems but not the applications running
on it. Essentially, Xen sacrifices the ability to run unmodified guest
operating systems for improved performance.

There are three components that need to be paravirtualized:

- *Memory management.* Software page tables and tagged page tables are easier
  to virtualize. Unfortunately, x86 has neither. Xen paravirtualizes the
  hardware accessible page tables leaving guest operating systems responsible
  for managing them. Page table modifications are checked by Xen.
- *CPU.* Xen takes advantage of x86's four privileges, called *rings*. Xen runs
  at ring 0 (the most privileged ring), the guest OS runs at ring 1, and the
  applications running in the guest operating systems run at ring 3.
- *Device I/O.* Guest operating systems communicate with Xen via bounded
  circular producer/consumer buffers. Xen communicates to guest operating
  systems using asynchronous notifications.

The Xen hypervisor implements mechanisms. Policy is delegated to a privileged
domain called dom0 that has accessed to privileges that other domains don't.

Finally, a look at some details about Xen:

- *Control transfer.* Guest operating systems request services from the
  hypervisor via *hypercalls*. Hypercalls are like system calls except they are
  between a guest operating system and a hypervisor rather than between an
  application and an operating system. Furthermore, each guest OS registers
  interrupt handlers with Xen. When an event occurs, Xen toggles a bitmask to
  indicate the type of event before invoking the registered handler.
- *Data transfer.* As mentioned earlier, data transfer is performed using a
  bounded circular buffer of I/O descriptors. Requests and responses are pushed
  on to the buffer. Requests can come out of order with respect to the
  requests. Moreover, requests and responses can be batched.
- *CPU Scheduling.* Xen uses the BVT scheduling algorithm.
- *Time and timers.* Xen supports real time (the time in nanoseconds from
  machine boot), virtual time (time that only increases when a domain is
  executing), and clock time (an offset added to the real time).
- *Virtual address translation.* Other hypervisors present a virtual contiguous
  physical address space on top of the actual hardware address space. The
  hypervisor maintains a shadow page table mapping physical addresses to
  hardware addresses and installs real page tables into the MMU. This has high
  overhead. Xen takes an alternate approach. Guest operating systems issue
  hypercalls to manage page table entries that are directly inserted into the
  MMU's page table. After they are installed, the page table entries are
  read-only.
- *Physical memory.* Memory is physically partitioned into reservations.
- *Network.* Xen provides virtual firewall-routers with one or more virtual
  network interfaces, each with a circular ring buffer.
- *Disk.* Xen presents virtual block devices each with a ring buffer.

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

## [Live Migration of Virtual Machines (2005)](https://scholar.google.com/scholar?cluster=7787668674412123324&hl=en&as_sdt=0,5)
**Summary.**
Virtual machines have become increasingly popular in cloud and cluster
environments. In these environments, VM migration---the process in which a
virtual machine running on one physical machine is migrated to run on another
physical machine---is incredibly useful. For example, it allows cluster
administrators to migrate VMs off of a machine before decommisioning it for
repair. In this paper, the authors present their live migration scheme that
allows them to migrate Xen virtual machines with a very small amount of
downtime.

A key step in migrating a virtual machine is migrating its memory. There are
typically three phases of memory migration:

1. *Push*. In the push phase, the migrating VM is up and running while pages of
   memory are pushed to the new physical machine.
2. *Stop-and-copy*. In the stop-and-copy phase, the VM is stopped, its state is
   transfered along with any pages that weren't pushed, and the VM is then
   started on the new machine.
3. *Pull*. In the pull phase, the VM is running on the new machine and pages
   from the old machine are faulted over.

A pure stop-and-copy approach is simple, but has down times proportional to the
number of memory. A pure demand-migration scheme has small downtime but makes
VMs slow until enough pages have been shipped over. This paper uses an
iterative pre-copy scheme:

0. *Pre-migration.* Before migration, assume a VM is running on host A.
1. *Reservation.* Resources are reserved on host B.
2. *Iterative pre-copy.* Memory from host A is iteratively copied to host B.
   The pages copied in one round are the pages that were dirtied since the last
   round.
3. *Stop-and-copy.* The VM is stopped on host A and the remaining state and
   memory is sent to host B.
4. *Commitment.* Host B confirms that it has received everything correctly and
   tells host A it is free to destroy itself.
5. *Activation.* Host B starts the VM.

The migration scheme also performs some ARP tricks to transfer the IP address
of the machines. Note that local disk copying is not included in this paper.

Imagine a VM that never writes any memory. Then a single iteration of
pre-copying is sufficient. Alternatively, assume a VM dirties every page of
memory at a rate faster than pre-copying. Then, pre-copying could carry on
indefinitely. Most programs lie within these two extremes. The amount of memory
they quickly write is dubbed the *writable working set* (WWS). The paper
performs some experiments showing the size of the WWS for various benchmarks.

There are two ways to implement VM migration:

1. *Managed Migration.* In managed migration, VM migration is managed by
   migration daemons running in dom0 of each machine. Xen inserts a shadow page
   table underneath the operating system. It marks all the pages in the OS's
   page table as read-only. Then, when an OS goes to write the page, the
   machine traps into Xen which marks the page as writeable and notes that the
   page was dirtied. After each round of pre-copying, the shadow page table and
   dirty bits are reset. When pre-copying is done, Xen notifies the OS to get
   ready to be migrated, then ships over the last bits of state.
2. *Self Migration.* In self migration, each OS is responsible for migrating
   itself. Iterative pre-copy is performed as before. Now, stop-and-copy is
   performed in two phases to allow an OS to stop itself while still running.

A higher transfer bandwidth reduces the downtime of migration but interferes
with active services running on the machines. Conversely, a lower transfer
bandwidth increases the downtime of migration but does not interfere as much
with active services. This paper uses a dynamic rate limiting scheme. An
administrator sets a lower and upper bandwidth limit. Transfer begins at the
lower limit. The next iteration uses the estimated page dirtying rate from the
last round plus a constant. This process terminates when the upper limit is
reached or there is not much memory left to transfer. Moreover, pages that are
repeatedly dirtied are not pre-copied.

Migration can also take advantage of paravirtualization. OSes can sleep
processes that write a lot, and they can report which pages are free to Xen to
limit a full memory scan.

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
The *relational query processor* is responsible for converting a textual query
into an optimized dataflow query plan that's ready to be executed.

The first step in processing a query is that of *query parsing and
authorization*. The query parser must check the syntactic well-formedness of a
textual query, convert the text into an internal query representation, type
check the query by resolving table and column references against information in
the catalog, and perform any necessary authorization. Certain forms of
authorization must be deferred to query execution. For example, a database may
restrict a user's access to tuples from a table that satisfy a certain
predicate. This *row-level security* depends on the values of the tuples and
must be deferred to query execution. In fact, some authorization which *could*
be performed during query parsing is deferred anyway.  For example, deferring
authorization checks to execution time allows for queries to be cached and
reused between multiple clients with varying privileges.

Next, a query processor performs *query rewrites*: logical transformations that
*simplify* and *normalize* a query without altering its semantics. Query
rewrites include:

- *View expansion.* View references in a query must be iteratively unwrapped
  until the final query includes only base table references.
- *Constant folding.* Expressions like `1 + R.a + 2 > 3` can be simplified to
  `R.a > 0`.
- *Logical predicate rewrites.* A query processor can sometimes deduce that a
  collection of predicates is unsatisfiable (e.g. `R.a < 0 AND R.a > 10`).
  Unsatisfiable predicates can be replaced with `FALSE` which enable further
  simplifications and optimizations. In some distributed databases that
  horizontally partition tables, predicates can be used to reduce the number of
  servers that are contacted. For example, if a server is responsible for a
  partition of a table `R` for all tuples where `0 < R.a < 100`, then it need
  not be contacted for a query like `SELECT R.a FROM R WHERE R.a > 10000`.
  Finally, certain *transitive predicates* can be deduced. For example, the
  predicates `R.a = S.b AND S.b = 100` imply `R.a = 100`.
- *Semantic optimization.* Using semantic information from the database catalog
  can be used to further simplify queries. For example, consider an `Employee`
  relation that has a foreign key into a `Department` relation. With this
  information, the query

        SELECT E.name
        FROM Emp E, Department D
        WHERE E.deptno = D.deptno

  can be simplified to

        SELECT E.name
        FROM Emp E
- *Subquery flattening.* Query optimizers are so complicated that they often
  narrow their scope to operate only on SELECT-FROM-WHERE blocks. To enable as
  many optimizations as possible, queries are often canonicalized and
  subqueries are flattened when possible.

Finally, a query is *optimized*. System R compiled queries into executable
code. Later, System R developers regarded this as a mistake. Ingres compiled
queries into interpretable dataflow diagrams. Later, Ingres developers somewhat
ironically also regarded this as a mistake. Both compilation targets have their
merits, but most modern databases have gone the way of Ingres to ensure
portability. Typically, this involves optimizing individual SELECT-FROM-WHERE
blocks into relational operator trees before stitching them all together.
Optimizations involve:

- *Plan space.* System R only considered left-deep query plans and deferred all
  Cartesian products to the top of the plan. Modern databases sometimes
  consider bushier trees with Cartesian products lower in the tree.
- *Selectivity estimation.* System R's selectivity estimation was based solely
  on relation and index cardinalities and is considered naive by today's
  standards. Modern databases summarize data distributions using histograms and
  other sketching data structures and use sampling to avoid expensive
  statistics computations. Moreover, algorithms like histogram joining improve
  selectivity estimation for joins.
- *Search algorithms.* In addition to System R's dynamic programming bottom-up
  approach, other databases have explored top-down approaches. Both have proven
  successful.
- *Parallelism.* In addition to inter-query parallelism, databases often
  implement intra-query parallelism. In a *two-phase approach*, the best
  single-node query plan is formed in one phase and then parallelized in a
  second phase. In a *one-phase approach*, the optimizer takes cluster
  information into account during optimization to try and find an optimal
  distributed plan. It's questionable whether the performance benefits of a
  two-phase plan warrant its complexity.
- *Auto-tuning.* Some databases use query traces to automatically tune the
  databases by, for example, suggesting new indexes to include.

Query optimizers also have to deal with query caching and recompilation. Many
databases allow for queries to be parsed, compiled, and stored ahead of time.
These *prepared* queries can also include placeholders that are filled in at
runtime. Prepared statements occasionally need to be re-optimized when, for
example, an index is dropped. Certain databases avoid re-optimization to ensure
predictability over performance; others aggressively re-optimize to ensure the
best performance.  Prepared queries can improve the performance of an
application, but preparing queries ahead of time can be burdensome.
Consequently, databases also support query caching to reuse (parts of) queries
without necessitating ahead-of-time preparation.

Once a query is parsed, rewritten, and optimized into a dataflow plan, it must
be executed. Typically, query plans are implemented as a tree of iterators with
*exchange nodes* thrown in for parallelism. These iterators typically operate
over *tuple references*: tuples of tuple pointers and column offsets. The
actual tuple data is either stored in the buffer pool (BP-tuples) or copied
from the buffer pool into the heap (M-tuples). Using BP-tuples avoids copies
but is hard to implement correctly and may lead to a page being pinned in the
buffer pool for prohibitively long. Using M-tuples can lead to unnecessary
copies but is much simpler to implement.

Data modification statements (e.g. INSERT, UPDATE, etc) are typically compiled
into simple linear dataflow diagrams. However, care must be taken to avoid
things like the *Halloween problem* in which updates invalidate the index
iterators used to perform the updates.

**Chapter 5 -- Storage Management.**
TODO

**Chapter 6 -- Transactions: Concurrency Control and Recovery.**
TODO

**Chapter 7 -- Shared Components.**
TODO

## [SnowFlock: Rapid Virtual Machine Cloning for Cloud Computing (2009)](https://scholar.google.com/scholar?cluster=3030124086251534312&hl=en&as_sdt=0,5)
**Summary.**
Public clouds like Amazon's EC2 or Google's Compute Engine allow users to
elastically spawn a huge number virtual machines on a huge number of physical
machines. However, spawning a VM can take on the order of minutes, and
typically spawned VMs are launched in some static initial state. SnowFlock
implements the VM fork abstraction, in which a parent VM forks a set of
children VMs all of which inherit a snapshot of the parent. Moreover, SnowFlock
implements this abstraction with subsecond latency. A subsecond VM fork
implementation can be used for sandboxing, parallel computation (the focus of
this paper), load handling, etc.

SnowFlock is built on top of Xen. Specifically, it is a combination of
modifications to the Xen hypervisor and a set of daemons running in dom0 which
together forms a distributed system that manages virtual machine forking.
Guests use a set of calls (i.e. `sf_request_ticket`, `sf_clone`, `sf_join`,
`sf_kill`, and `sf_exit`) to request resources on other machines, fork
children, wait for children, kill children, and exit from a child. This implies
that applications must be modified.  SnowFlock implements the forking mechanism
and leaves policy to pluggable cluster framework management software.

SnowFlock takes advantage of four insights with four distinct implementation
details.

1. VMs can get very large, on the order of a couple of GBs. Copying these
   images between physical machines can saturate the network, and even when
   implemented using things like multicast, can still be slow. Thus, SnowFlock
   must reduce the amount of state transfered between machines. SnowFlock takes
   advantage of the fact that a newly forked VM doesn't need the entire VM
   image to start running. Instead, SnowFlock uses *VM Descriptors*: a
   condensed VM image that consists of VM metadata, a few memory pages,
   registers, a global descriptor table, and page tables. When a VM is forked,
   a VM descriptor for it is formed and sent to the children to begin running.
2. When a VM is created from a VM descriptor, it doesn't have all the memory it
   needs to continue executing. Thus, memory must be sent from the parent when
   it is first accessed. Parent VMs use copy-on-write to maintain an immutable
   copy of memory at the point of the snapshot. Children use Xen shadow pages
   to trap accesses to pages not yet present and request them from the parent
   VM.
3. Sometimes VMs access memory that they don't really need to get from the
   parent. SnowFlock uses two *avoidance heuristics* to avoid the transfer
   overhead. First, if new memory is being allocated (often indirectly through
   a call to something like malloc), the memory contents are not important and
   do not need to be paged in from the parent. A similar optimization is made
   for buffers being written to by devices.
4. Finally, parent and children VMs often access the same code and data.
   SnowFlock takes advantage of this data locality by prefetching; when one
   child VM requests a page of memory, the parent multicasts it to all
   children.

Furthermore, the same copy-on-write techniques to maintain an immutable
snapshot of memory are used on the disk. And, the parent and children virtual
machines are connected by a virtual subnet in which each child is given an IP
address based on its unique id.

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

## [The Declarative Imperative: Experiences and Conjectures in Distributed Logic (2010)](https://scholar.google.com/scholar?cluster=1374149560926608837&hl=en&as_sdt=0,5)
**Summary.**
With (a strict interpretation of) Moore's Law in decline and an overabundance
of compute resources in the cloud, performance necessitates parallelism. The
rub?  Parallel programming is difficult. Contemporaneously, Datalog (and
variants) have proven effective in an increasing number of domains from
networking to distributed systems. Better yet, declarative logic programming
allows for programs to be built with orders of magnitude less code and permits
formal reasoning. In this invited paper, Joe discusses his experiences with
distributed declarative programming and conjectures some deep connections
between logic and distributed systems.

Joe's group has explored many distributed Datalog variants, the latest of which
is *Dedalus*. Dedalus includes notions of time: both intra-node atomicity and
sequencing and inter-node causality. Every table in Dedalus includes a
timestamp in its rightmost column. Dedalus' rules are characterized by how they
interact with these timestamps:

- *Deductive rules* involve a single timestamp. They are traditional Datalog
  stamements.
- *Inductive rules* involve a head with a timestamp one larger than the
  timestamps of the body. They represent the creation of facts from one point
  in time to the next point in time.
- *Asynchronous rules* involve a head with a non-deterministically chosen
  timestamp. These rules capture the notion of non-deterministic message
  delivery.

Joe's group's experience with distributed logic programming lead to the
following conclusions:

- Datalog can very concisely express distributed algorithms that involved
  recursive computations of transitive closures like web crawling.
- Annotating relations with a location specifier column allows tables to be
  transparently partitions and allows for declarative communication: a form of
  "network data independence". This could permit many networking optimizations.
- Stratifying programs based on timesteps introduces a notion of
  transactionality. Every operation taking place in the same timestamp occurs
  atomically.
- Making all tables ephemeral and persisting data via explicit inductive rules
  naturally allows transience in things like soft-state caches without
  precluding persistence.
- Treating events as a streaming join of inputs with persisted data is an
  alternative to threaded or event-looped parallel programming.
- Monotonic programs parallelize embarrassingly well. Non-monotonicity requires
  coordination and coordination requires non-monotonicity.
- Logic programming has its disadvantages. There is code redundancy; lack of
  scope, encapsulation, and modularity; and providing consistent distributed
  relations is difficult.

The experience also leads to a number of conjectures:

- The CALM conjecture stats that programs that can be expressed in monotonic
  Datalog are exactly the programs that can be implemented with
  coordination-free eventual consistency.
- Dedalus' asynchronous rules allow for an infinite number of traces. Perhaps,
  all these traces are confluent and result in the same final state. Or perhaps
  they are all equivalent for some notion of equivalence.
- The CRON conjecture states that messages sent to the past lead only to
  paradoxes if the message has non-monotonic implications.
- If computation today is so cheap, then the real computation cost comes from
  coordination between strata. Thus, the minimum number of Dedalus timestamps
  required to implement a program represents its minimum *coordination
  complexity*.
- To further decrease latency, programs can be computed approximately either by
  providing probabilistic bounds on their outputs or speculatively executing
  and fixing results in a post-hoc manner.

## [Conflict-free Replicated Data Types (2011)](https://scholar.google.com/scholar?cluster=4496511741683930603&hl=en&as_sdt=0,5) ##
**Summary.**
Eschewing strong consistency in favor of weaker consistency allows for higher
availability and lower latency. On the other hand, programming with weaker
consistency models like eventual consistency has traditionally been ad-hoc and
error-prone. CRDTs provide a way to achieve eventual consistency in a
principled way.

This paper considers a set of non-byzantine processes `{p_1, ..., p_n}`
connected by an asynchronous network. Each process `p_i` maintains some state
`s_i` that is updated over time. Processes use some mechanism like gossip to
communicate states to one another, and whenever a process `p_i` receives state
`s_j` from process `p_j`, it merges `s_j` into its state `s_i`.

More formally, each process maintains a *state-based object* which we model as
a five tuple `(S, s^0, q, u, m)` where

- `S` is a set of states,
- `s^0 \in S` is the initial state,
- `q: S -> 'a` is a query method,
- `u: S -> 'a -> S` is an update method, and
- `m: S -> S -> S` is a merge method.

All process begin with the initial state `s^0`. Clients can query the value of
the object with `q` (i.e. `s.q()`) and update the object with `u` (e.g.
`s.u(a)`). When processes communicate state, they are merged with `m` (e.g.
`s_i.m(s_j)`).

Method invocations (i.e. invocations of `q`, `u`, or `m`) are totally ordered
on each process and sequentially numbered starting from 1. States are similarly
ordered and numbered, updating with every method invocation:

    s^0 . f^1 . s^1 . f^2 . s^2 . ...

An object's *state-based causal history* traces its updates over logical time.
Formally, a causal history `C = [c_1, ..., c_n]` is an `n`-tuple of versioned
sets `c_i^0, c_i^1, c_i^2, ...` (one for each process) where each set contains
updates (e.g.  `u_i^k(a)`). A causal history is updated at a process `i` as
follows:

- When `i` issues a query, `c_i` is unchanged. That is, `c_i^k = c_i^{k+1}`.
- When `i` issues an update, it is added to `c_i`. That is, `c_i^{k+1} = c_i^k
  \cup {u_i^k}`.
- When `i` merges another state `s_j`, `c_i` and `c_j` are merged. That is,
  `c_i^{k+1} = c_i^k \cup c_j^k`.

An update is *delivered* at `i` when it enters `c_i`. An update `u` *happens
before* another update `v_i^k` when `u` is in `c_i^k`. Two updates are
*concurrent* if neither happens before the other.

These definitions are notationally dense but are a simple formalization of
Lamport's notions of logical time. Here is an illustration of how causal
history evolves over time for a three process system.


    p_0: {} -[u(a)]-> {u(a)} -.
                               \
    p_1: {} -[q]----> {} -------`-[m]-> {u(a)}---.-[m]-> {u(a), v(b)}
                                                /
    p_2: {} -[v(b)]-> {v(b)} ------------------'


We define an object to be *eventually consistent* if it satisfies the following
three properties:

- *Eventual delivery:* An update delivered at a correct process is eventually
  delivered to all correct processes.
- *Convergence:* If two processes have the same updates, they will *eventually*
  have the same states.
- *Termination:* All methods terminate.

A *strongly eventually consistent* (SEC) object is one that is eventually
consistent and additionally satisfies the following property.

- *Strong Convergence:* If two processes have the same updates, they have the
  same states.

A state based object imbued with a partial order `(S, <=, s^0, q, u, m)` is a
*monotonic semilattice* if

- `(S, <=)` is a join semilattice,
- `s_i.m(s_j)` computes the least upper bound (or join) or `s_i` and `s_j`, and
- state is monotonically non-decreasing over updates (i.e. `s <= s.u(x)`).

State-based objects that are monotonic semilattices (CvRDTs) are SEC.

Dual to state-based objects are *operation-based objects*. In the
operation-based model, processes communicate updates to one another rather than
states. When a process receives an update it applies it to its state. Formally,
an op-based object is a 6 tuple `(S, s^0, q, t, u, P)` where

- `S` is a set of states,
- `s^0 \in S` is the initial state,
- `q` is a query method,
- `t` is a side-effect free prepare-update method,
- `u` is an effect-update method, and
- `P` is a precondition (not used much in this paper).

Calls to `u` must be immediately preceded by calls to `t`. Op-based causal
histories are defined similarly to state-based causal histories where `t`
behaves like `q` and `m` is now missing. The definition of happens-before and
concurrent operations extends naturally from earlier. An op-based object whose
updates commute is a CvRDT. If messages are delivered exactly once, message
delivery respect the causal order, then CvRDTs are SEC.

Turns out, CvRDTs and CmRDTs are equivalent in that they can simulate one
another. Moreover SEC is incomparable to sequential consistency. Consider an
add-wins set CRDT in which one process performs `add(e); remove(e')` and
another performs `add(e'); remove(e)`. When the two sets are merged, they
contain `e` and `e'`, but under sequential consistency, one of the removes must
occur last.

Example CRDTs include vector clocks, increment-only counters,
increment-decrement counters add-only sets, add-remove sets, maps, logs, and
graphs.

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

## [Dedalus: Datalog in Time and Space (2011)](https://scholar.google.com/scholar?cluster=4658639044512647014&hl=en&as_sdt=0,5)
**Summary.**
Researchers have explored using Datalog variants to implement distributed
systems, often with orders of magnitude less code. However, there are two
distributed system concepts that are difficult to model in Datalog:

1. *mutable state*, and
2. *asynchronous processing and communication*.

Some Datalog variants add imperative features to Datalog, but this leads to
lost optimization opportunities and ambiguous semantics. *Dedalus* is a subset
of Datalog with negation, aggregation, an infinite successor relation, and
non-deterministic choice that introduces the notion of time to cleanly model
both mutability and asynchrony.

Let Ci and Ai range over constants and variables respectively and consider an
infinite successor relation over an abstract domain Z. We first develop the
core of Dedalus, *Dedalus0*, which is Datalog with negation with the additional
syntactic restrictions:

1. *Schema*. The final attribute of every predicate is from the domain Z. This
   *time suffix* connotes the timestamp of the record.
2. *Time Suffix*. Every subgoal must be unified on a common time suffix `T` and
   the head of every rule can take of of two forms:
    - In *deductive rules*, the head's time suffix `S` is equal to `T`. These
      rules connote deductions in a single time step.
    - In *inductive rules*, the head's time suffix `S` is the successor of `T`.
      These rules connote inductions across time.
3. *Positive and Negative Predicates*. Every extensional predicate `p` has a
   corresponding positive and negative predicate `p_pos` and `p_neg`.
4. *Guarded EDB*. No rule, except for those above, can involve extensional
   predicates.

Dedalus models the *persistence* of a predicate using a simple identity
inductive rule:

    p_pos(A, B, ..., Z) @next <- p_pos(A, B, ..., Z).

*Mutable state* is modeled using a conjunction of `p_pos` and `p_neg`:

    p_pos(A, B, ..., Z) @ next <-
        p_pos(A, B, ..., Z),
        not p_neg(A, B, ..., Z).

This pattern is so common, it is expressed using the `persist[p_pos, p_neg, n]`
macro. We can model a number that increases whenever an event occurs (aka a
*sequence*) as follows:


    seq(B) <- seq(A), event(_), succ(A, B).
    seq(A) <- seq(A), not event(_).
    seq(0)@0.

We can use aggregation to implement a priority queue. Consider a predicate
`priority_queue(X, P)` with values `X` and priority `P`. We can flatten out the
queue's contents over time by buffering values in `m_priority_queue` and
dequeueing them into `priority_queue` in order of priority.

    persist[m_priority_queue_pos, m_priority_queue_neg, 2]

    the_min(min<P>) <- m_priority_queue(_, P).

    priority_queue(X, P)@next <-
        m_priority_queue(X, P),
        the_min(P)

    m_priority_queue_neg(X, P)@next <-
        m_priority_queue(X, P),
        the_min(P)

A Dedalus0 program is *syntactically stratifiable* if there are no cycles in the
predicate dependency graph that contain a negative edge. Similarly, a program
is *temporally stratifiable* if the *deductive reduction* of it is
syntactically stratifiable. Every Dedalus0 program that is temporally
stratifiable has a unique perfect model.

A Datalog program (or Dedalus0 program) is considered *safe* if it has a finite
model. The following syntactic restrictions imply safety:

1. No functions.
2. Range restricted variables. That is, all variables appearing in the head
   must appear in a non-negated subgoal.
3. The EDB is finite.

We say a Dedalus0 rule is *instantaneously safe* if it is deductive,
function-free (1), and range-restricted (2). A Dedalus0 program is
instantaneously safe if all rules in its deductive reduction are
instantaneously safe. Two sets of ground atoms are *equivalent modulo time* if
the two sets are equal after projecting out the time suffix. A Dedalus0 program
is quiescent at time T if it its atoms are equivalent modulo time to those at
time T-1. A Dedalus0 program is *temporally safe* if it is *henceforth
quiescent* after some time T. The paper provides three syntactic restrictions
that are sufficient for a temporally stratifiable program to be temporally
safe.

Dedalus is a superset of Dedalus0 that introduces asynchronous choice.
Intuitively, Dedalus introduces a third *asynchronous* type of rule that allows
the head's timestamp to be a non-deterministic value, even values that are
earlier than the timestamp of the body! In addition, Dedalus introduces
horizontal partitioning by designating the first column of a predicate to be a
*location specifier*. Entanglement:

    p(A, B, N)@async <- p(A, B)@N

can be used to implement things like Lamport clocks.

## [Mesos: A Platform for Fine-Grained Resource Sharing in the Data Center (2011)](https://scholar.google.com/scholar?cluster=816726489244916508&hl=en&as_sdt=0,5)
See [`https://github.com/mwhittaker/mesos_talk`](https://github.com/mwhittaker/mesos_talk).

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

## [Apache Hadoop YARN: Yet Another Resource Negotiator (2013)](https://scholar.google.com/scholar?cluster=3355598125951377731&hl=en&as_sdt=0,5)
**Summary.**
Hadoop began as a MapReduce clone designed for large scale web crawling. As big
data became trendy and data became... big, Hadoop became the de facto
standard data processing system, and large Hadoop clusters were installed in
many companies as "the" cluster. As application requirements evolved, users
started abusing the large Hadoop in unintended ways. For example, users would
submit map-only jobs which were thinly guised web servers. Apache Hadoop YARN
is a cluster manager that aims to disentangle cluster management from
programming paradigm and has the following goals:

- Scalability
- Multi-tenancy
- Serviceability
- Locality awareness
- High cluster utilization
- Reliability/availability
- Secure and auditable operation
- Support for programming model diversity
- Flexible resource model
- Backward compatibility

YARN is orchestrated by a per-cluster *Resource Manager* (RM) that tracks
resource usage and node liveness, enforces allocation invariants, and
arbitrates contention among tenants. *Application Masters* (AM) are responsible
for negotiating resources with the RM and manage the execution of single job.
AMs send ResourceRequests to the RM telling it resource requirements, locality
preferences, etc. In return, the RM hands out *containers* (e.g.  <2GB RAM, 1
CPU>) to AMs. The RM also communicates with Node Managers (NM) running on each
node which are responsible for measuring node resources and managing (i.e.
starting and killing) tasks. When a user want to submit a job, it sends it to
the RM which hands a capability to an AM to present to an NM. The RM is a
single point of failure. If it fails, it restores its state from disk and kills
all running AMs. The AMs are trusted to be faul-tolerant and resubmit any
prematurely terminated jobs.

YARN is deployed at Yahoo where it manages roughly 500,000 daily jobs. YARN
supports frameworks like Hadoop, Tez, Spark, Dryad, Giraph, and Storm.

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

## [From L3 to seL4 What Have We Learnt in 20 Years of L4 Microkernels? (2013)](https://scholar.google.com/scholar?cluster=10669327659248325680&hl=en&as_sdt=0,5)
**Summary.**
Inter process communication (IPC) was on the critical path of microkernels like
Mach. Traditionally, each IPC took roughly 100 microseconds and was considered
a bit high. In 1993, Jochen Liedtke introduced the L4 microkernel and showed
that IPC could be implemented 10 to 20 times faster. In the next 20 years, L4
developed a rich family of descendants and many lessons have been learned.

Lessons in design:

- *Minimality.* All functionality that can live outside the kernel should live
  outside the kernel. Moreover, all policy should be lifted out of the kernel
  leaving only mechanisms.
- *Synchronous IPC.* The original L4 implementation used synchronous RPC in
  which both the sender and receiver block until the sender calls send and the
  receiver calls receive. This can be implemented efficiently, but forces
  programs to be multithreaded in order to handle multiple inputs. Later
  version of L4 implemented asynchronous IPC in which a sender could send
  without blocking and a receiver could block or poll the receipt of a message.
- *IPC message structure.* The original L4 implementations allowed processes to
  send messages directly via physical registers. This technique was limited by
  the number of physical registers and was a bit clunky. Later version of L4
  introduced virtual registers which were either backed by physical registers
  or by a pinned page of memory.
- *IPC destinations.* Originally, IPC destinations were thread identifiers, but
  this exposed a great deal of information. Later, IPC destinations were
  changed to more port-like endpoints.
- *IPC timeouts.* If a client and server are exchanging messages via IPC, then
  a client can send a message, the server will receive the message and issue a
  send response. If the client never calls receive, then the server is blocked.
  This allows clients to DOS servers. To avoid this, tasks can associate a
  timeout with an IPC call. Originally timeouts could be set at 0, infinity, or
  anywhere from microseconds to weeks. In reality, most programs only used 0 or
  infinity.
- *Communication control.* Tasks were organized into groups called *clans* and
  every clan had a designated *chief*. Messages within a clan could flow
  freely, but messages between clans had to be forwarded through the chief.
  This was weird and later dropped.
- *User-level device drivers.* Putting device drivers in user space has
  remained a good idea.
- *Process hierarchy.* A finite number of task IDs was allocated and
  distributed in a first come first serve fashion. This was later replaced with
  a capability based system.
- *Time.* L4 implements a round-robin priority scheduler. People have tried to
  move the scheduling into user space, but it has yet to be done without
  significant overhead.

Lessons in implementation:

- *Process orientation and virtual TCB array.* Threads' kernel stack was
  allocated above their TCB.
- *Lazy scheduling.* When a thread blocked, it was marked as blocked but not
  yet removed from the ready queue. When the scheduler selected the next task
  to run, it would iterate through the ready queue until it found an actually
  ready task. This meant that scheduling time was bounded only by the number of
  threads. This was later replaced by Benno scheduling.
- *Direct process switch.* When a thread blocked on IPC, the scheduler would
  immediately run another task in its quantum regardless of priority. This
  direct process switch mechanism was kept but made to respect priorities.
- *Preemption.* Most L4 implementations have a nonpreemptable kernel with
  strategic preemption points.
- *Non-portability.* L4 used to be platform specific but now is very portable.
- *Non-standard calling convention.* To get maximum performance, L4 was written
  in assembly and uses weird calling conventions. When implementations moved to
  C and C++, this was removed.
- *Implementation language.* Implementation moved to C and a bit of C++.

## [Innovative Instructions and Software Model for Isolated Execution (2013)](https://scholar.google.com/scholar?cluster=11948934428694485446&hl=en&as_sdt=0,5)
**Summary.**
Applications are responsible for managing an increasing amount of sensitive
information. Intel SGX is a set of new instructions and memory access changes
that allow users to put code and data into secured *enclaves* that are
inaccessible even to privileged code. The enclaves provide confidentiality,
integrity, and isolation.

A process' virtual memory space is divided into different sections. There's a
section for the code, a section for the stack, a section for the heap, etc. An
enclave is just another region in the user's address space, except the enclave
has some special properties. The enclave can store code and data. When a
process is running code in the enclave, it can access data in the enclave.
Otherwise, the enclave data is off limits.

Each enclave is composed of a set of pages, and these pages are stored in the
*Enclave Page Cache (EPC)*.

    +---------------------------------+
    | .-----. .-----. .-----. .-----. |
    | |    \| |    \| |    \| |    \| |
    | |     | |     | |     | |     | | EPC
    | |     | |     | |     | |     | |
    | '.....' '.....' '.....' '.....' |
    +---------------------------------+

In addition to storing enclave pages, the EPC also stores SGX structures (I
guess Enclave Page and SGX Structures Cache (EPSSC) was too long of an
acronym). The EPC is protected from hardware and software access. A related
structure, the *Enclave Page Cache Map* (EPCM), stores a piece of metadata for
each active page in the EPC. Moreover, each enclave is assigned a *SGX Enclave
Control Store* (SECS). There are instructions to create, add pages to, secure,
enter, and exit an enclave.

Computers have a finite, nay scarce amount of memory. In order to allow as many
processes to operate with this scarce resource, operating systems implement
paging. Active pages of memory are stored in memory, while inactive pages are
flushed to the disk. Analogously, in order to allow as many processes to use
enclaves as possible, SGX allows for pages in the EPC to be paged to main
memory. The difficulty is that the operating system is not trusted and neither
is main memory.

    +---------------------------------+
    | .-----. .-----.         .-----. |
    | |    \| |    \|         |    \| |
    | | VA  | |  ^  |    |    |     | | EPC (small and trusted)
    | |     | |  |  |    |    |     | |
    | '.....' '..|..'    |    '.....' |
    +------------|-------|------------+
                 |       | (paging)
    +------------|-------|-----------------------
    | .-----.    |    .--|--. .-----. .-----.
    | |    \|    |    |  | \| |    \| |    \|
    | |     |    |    |  v  | |     | |     | ... main memory (big but not trusted)
    | |     |         |     | |     | |     |
    | '.....'         '.....' '.....' '.....'
    +--------------------------------------------

In order to page an EPC page to main memory, all cached translations that point
to it must first be cleared. Then, the page is encrypted. A nonce, called a
version, is created for the page and put into a special *Version Array* (VA)
page in the EPC. A MAC is taken of the encrypted contents, the version, and the
page's metadata and is stored with the file in main memory. When the page is
paged back into the EPC, the MAC is checked against the version in the VA
before the VA is cleared.

## [MillWheel: Fault-Tolerant Stream Processing at Internet Scale (2013)](https://scholar.google.com/scholar?cluster=11192973635829532709&hl=en&as_sdt=0,5)
**Summary.**
MillWheel is a stream processing system built at Google that models computation
as a dynamic directed graph of *computations*. MillWheel allows user's to write
arbitrary code as part of an operation yet still transparently enforces
idempotency and exactly-once message delivery. MillWheel uses frequent
checkpointing and upstream backup for recovery.

Data in MillWheel is represented by (key, value, timestamp) triples. Values and
timestamps are both arbitrary. Keys are extracted from records by user provided
key extraction functions. Computations operate on inputs and the computations
for a single key are serialized; that is, no two computations on the same key
will every happen at the same time. Moreover, each key is associated with some
persistent state that a computation has access to when operating on the key.

MillWheel also supports *low watermarks*. If a computation has a low watermark
of `t`, then it's guaranteed to have processed all records no later than `t`.
Low watermarks use the logical timestamps in records as opposed to arrival time
in systems like Spark Streaming.  Low watermark guarantees are not actually
guarantees; they are approximations.  *Injectors* inject data into MillWheel
and can still violate low watermarks semantics. When a watermark violating
record enters the system, computations can choose to ignore it or try to
correct it. Moreover, the MillWheel API allows users to register for code,
known as *timers*, to execute at a certain wall clock or low watermark time.

MillWheel guarantees messages are logically sent exactly once. Messages may be
sent multiple times within the system, but measures are taken to ensure that
the system appears to have delivered them only once. Similar care must be taken
to ensure that per-key persistent state is not updated erroneously. When a
message is received at a computation, the following events happen:

- The data is deduplicated by checking first against a Bloom filter and then a
  disk.
- User code is executed.
- Pending changes to the persistent state are committed.
- Senders are acknowledged.
- Produced data is sent downstream.

Imagine if a computation commits a change to persistent state but crashes
before acking senders. If the computation is replayed, it may modify the
persistent state twice. To avoid this, each record in the system is given a
unique id. When state is modified in response to a record, the id of the record
is atomically written with the state change. If a computation later
re-processes the record and attempts to re-modify the state, the modification
is ignored.

Before a record is sent downstream, it is checkpointed. These are called
*strong productions*. Programs can opt out of strong productions and instead
use *weak productions*: non-checkpointed productions. When using weak
productions, MillWheel still performs occasional checkpoints to avoid a long
chain of acknowledgements to be blocked by a straggling worker. Programs can
also opt-out of exactly-once semantics.

To avoid zombie writers from corrupting state, each write is associated with a
sequencer token that is invalidated when a new writer becomes active.

MillWheel is implemented using a replicated master that manages key-range
assignments and a single central authority for computing low watermarks.

**Commentary.**
- Spark Streaming claims that using replication for recovery reduces the
  latency of the system. MillWheel frequently checkpoints data. This leads me
  to wonder if MillWheel experiences a latency hit, but the evaluation only
  considers single stage pipelines!
- The evaluation does not evaluate the recovery time of the system, something
  that Spark Streaming would say is very slow.
- The paper also says the Spark Streaming model is limiting and depends heavily
  on the RDD API. I wish there were a concrete example demonstrating Spark
  Streaming's inexpressiveness.
- I'm having trouble understanding how the per-key API allows for things like
  joins.

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

## [Shielding Applications from an Untrusted Cloud with Haven (2014)](https://scholar.google.com/scholar?cluster=12325554201123386346&hl=en&as_sdt=0,5)
**Summary.**
When running an application in the cloud, users have to trust (i) the cloud
provider's software, (ii) the cloud provider's staff, and (iii) law enforcement
with the ability to access user data. Intel SGX partially solves this problem
by allowing users to run small portions of program on remote servers with
guarantees of confidentiality and integrity. Haven leverages SGX and Drawbridge
to run *entire legacy programs* with shielded execution.

Haven assumes a very strong adversary which has access to all the system's
software and most of the system's hardware. Only the processor and SGX hardware
is trusted. Haven provides confidentiality and integrity, but not availability.
It also does not prevent side-channel attacks.

There are two main challenges that Haven's design addresses. First, most
programs are written assuming a benevolent host. This leads to Iago attacks in
which the OS subverts the application by exploiting its assumptions about the
OS. Haven must operate correctly despite a *malicious host*. To do so, Haven
uses a library operation system LibOS that is part of a Windows sandboxing
framework called Drawbridge. LibOS implements a full OS API using only a few
core host OS primitives. These core host OS primitives are used in a defensive
way. A shield module sits below LibOS and takes great care to ensure that LibOS
is not susceptible to Iago attacks. The user's application, LibOS, and the
shield module are all run in an SGX enclave.

Second, Haven aims to run *unmodified* binaries which were not written with
knowledge of SGX. Real world applications allocate memory, load and run code
dynamically, etc. Many of these things are not supported by SGX, so Haven (a)
emulated them and (b) got the SGX specification revised to address them.

Haven also implements an in-enclave encrypted file system in which only the
root and leaf pages need to be written to stable storage. As of publication,
however, Haven did not fully implement this feature. Haven is susceptible to
replay attacks.

Haven was evaluated by running Microsoft SQL Server and Apache HTTP Server.

## [Impala: A Modern, Open-Source SQL Engine for Hadoop (2015)](https://scholar.google.com/scholar?cluster=14277865292469814912&hl=en&as_sdt=0,5)
**Summary.**
Impala is a distributed query engine built on top of Hadoop. That is, it builds
off of existing Hadoop tools and frameworks and reads data stored in Hadoop
file formats from HDFS.

Impala's `CREATE TABLE` commands specify the location and file format of data
stored in Hadoop. This data can also be partitioned into different HDFS
directories based on certain column values. Users can then issue typical SQL
queries against the data. Impala supports batch INSERTs but doesn't support
UPDATE or DELETE. Data can also be manipulated directly by going through HDFS.

Impala is divided into three components.

1. An Impala daemon (impalad) runs on each machine and is responsible for
   receiving queries from users and for orchestrating the execution of queries.
2. A single Statestore daemon (statestored) is a pub/sub system used to
   disseminate system metadata asynchronously to clients. The statestore has
   weak semantics and doesn't persist anything to disk.
3. A single Catalog daemon (catalogd) publishes catalog information through the
   statestored. The catalogd pulls in metadata from external systems, puts it
   in Impala form, and pushes it through the statestored.

Impala has a Java frontend that performs the typical database frontend
operations (e.g. parsing, semantic analysis, and query optimization). It uses a
two phase query planner.

1. *Single node planning.* First, a single-node non-executable query plan tree
   is formed. Typical optimizations like join reordering are performed.
2. *Plan parallelization.* After a single node plan is formed, it is fragmented
   and divided between multiple nodes with the goal of minimizing data movement
   and maximizing scan locality.

Impala has a C++ backed that uses Volcano style iterators with exchange
operators and runtime code generation using LLVM. To efficiently read data from
disk, Impala bypasses the traditional HDFS protocols. The backend supports a
lot of different file formats including Avro, RC, sequence, plain test, and
Parquet.

For cluster and resource management, Impala uses a home grown Llama system that
sits over YARN.

## [Large-scale cluster management at Google with Borg (2015)](https://scholar.google.com/scholar?cluster=18268680833362692042&hl=en&as_sdt=0,5)
**Summary.**
Borg is Google's cluster manager. Users submit *jobs*, a collection of *tasks*,
to Borg which are then run in a single *cell*, many of which live inside a
single *cluster*. Borg jobs are either high priority latency-sensitive
*production* jobs (e.g. user facing products and core infrastructure) or low
priority *non-production* batch jobs. Jobs have typical properties like name
and owner and can also express constraints (e.g. only run on certain
architectures). Tasks also have properties and state their resource demands.
Borg jobs are specified in BCL and are bundled as statically linked
executables. Jobs are labeled with a priority and must operate within quota
limits.  Resources are bundled into *allocs* in which multiple tasks can run.
Borg also manages a naming service, and exports a UI called Sigma to
developers.

Cells are managed by five-way replicated *Borgmasters*. A Borgmaster
communicates with *Borglets* running on each machine via RPC, manages the Paxos
replicated state of system, and exports information to Sigma. There is also a
high fidelity borgmaster simulator known as the Fauxmaster which can used for
debugging.

One subcomponent of the Borgmaster handles scheduling. Submitted jobs are
placed in a queue and scheduled by priority and round-robin within a priority.
Each job undergoes feasibility checking where Borg checks that there are enough
resources to run the job and then scoring where Borg determines the best place
to run the job. Worst fit scheduling spreads jobs across many machines allowing
for spikes in resource usage. Best fit crams jobs as closely as possible which
is bad for bursty loads. Borg uses a scheduler which attempts to limit
"stranded resources": resources on a machine which cannot be used because other
resources on the same machine are depleted. Tasks that are preempted are placed
back on the queue. Borg also tries to place jobs where their packages are
already loaded, but offers no other form of locality.

Borglets run on each machine and are responsible for starting and stopping
tasks, managing logs, and reporting to the Borgmaster. The Borgmaster
periodically polls the Borglets (as opposed to Borglets pushing to the
Borgmaster) to avoid any need for flow control or recovery storms.

The Borgmaster performs a couple of tricks to achieve high scalability.

- The scheduler operates on slightly stale state, a form of "optimistic
  scheduling".
- The Borgmaster caches job scores.
- The Borgmaster performs feasibility checking and scoring for all equivalent
  jobs at once.
- Complete scoring is hard, so the Borgmaster uses randomization.

The Borgmaster puts the onus of fault tolerance on applications, expecting them
to handle occasional failures. Still, the Borgmaster also performs a set of
nice tricks for availability.

- It reschedules evicted tasks.
- It spreads tasks across failure domains.
- It limits the number of tasks in a job that can be taken down due to
  maintenance.
- Avoids past machine/task pairings that lead to failure.

To measure cluster utilization, Google uses a *cell compaction* metric: the
smallest a cell can be to run a given workload. Better utilization leads
directly to savings in money, so Borg is very focused on improving utilization.
For example, it allows non-production jobs to reclaim unused resources from
production jobs.

Borg uses containers for isolation. It also makes sure to throttle or kill jobs
appropriately to ensure performance isolation.

## [Spark SQL: Relational Data Processing in Spark (2015)](https://scholar.google.com/scholar?cluster=12543149035101013955&hl=en&as_sdt=0,5)
**Summary.**
Data processing frameworks like MapReduce and Spark can do things that
relational databases can't do very easily. For example, they can operate over
semi-structured or unstructured data, and they can perform advanced analytics.
On the other hand, Spark's API allows user to run arbitrary code (e.g.
`rdd.map(some_arbitrary_function)`) which prevents Spark from performing
certain optimizations. Spark SQL marries imperative Spark-like data processing
with declarative SQL-like data processing into a single unified interface.

Spark's main abstraction was an RDD. Spark SQL's main abstraction is a
*DataFrame*: the Spark analog of a table which supports a nested data model of
standard SQL types as well as structs, arrays, maps, unions, and user defined
types. DataFrames can be manipulated as if they were RDDs of row objects (e.g.
`dataframe.map(row_func)`), but they also support a set of standard relational
operators which take ASTs, built using a DSL, as arguments. For example, the
code `users.where(users("age") < 40)` constructs an AST from `users("age") <
40` as an argument to filter the `users` DataFrame. By passing in ASTs as
arguments rather than arbitrary user code, Spark is able to perform
optimizations it previously could not do. DataFrames can also be queries using
SQL.

Notably, integrating queries into an existing programming language (e.g. Scala)
makes writing queries much easier. Intermediate subqueries can be reused,
queries can be constructed using standard control flow, etc. Moreover, Spark
eagerly typechecks queries even though their execution is lazy. Furthermore,
Spark SQL allows users to create DataFrames of language objects (e.g. Scala
objects), and UDFs are just normal Scala functions.

DataFrame queries are optimized and manipulated by a new extensible query
optimizer called *Catalyst*. The query optimizer manipulates ASTs written in
Scala using *rules*, which are just functions from trees to trees that
typically use pattern matching. Queries are optimized in four phases:

1. *Analysis.* First, relations and columns are resolved, queries are
   typechecked, etc.
2. *Logical optimization.* Typical logical optimizations like constant folding,
   filter pushdown, boolean expression simplification, etc are performed.
3. *Physical planning.* Cost based optimization is performed.
4. *Code generation.* Scala quasiquoting is used for code generation.

Catalyst also makes it easy for people to add new data sources and user defined
types.

Spark SQL also supports schema inference, ML integration, and query federation:
useful features for big data.

## [Borg, Omega, and Kubernetes (2016)](#borg-omega-and-kubernetes-2016)
**Summary.**
Google has spent the last decade developing three container management systems.
*Borg* is Google's main cluster management system that manages long running
production services and non-production batch jobs on the same set of machines
to maximize cluster utilization. *Omega* is a clean-slate rewrite of Borg using
more principled architecture. In Omega, all system state lives in a consistent
Paxos-based storage system that is accessed by a multitude of components which
act as peers. *Kubernetes* is the latest open source container manager that
draws on lessons from both previous systems.

All three systems use containers for security and performance isolation.
Container technology has evolved greatly since the inception of Borg from
chroot to jails to cgroups. Of course containers cannot prevent all forms of
performance isolation. Today, containers also contain program images.

Containers allow the cloud to shift from a machine-oriented design to an
application oriented-design and tout a number of advantages.

- The gap between where an application is developed and where it is deployed is
  shrunk.
- Application writes don't have to worry about the details of the operating
  system on which the application will run.
- Infrastructure operators can upgrade hardware without worrying about breaking
  a lot of applications.
- Telemetry is tied to applications rather than machines which improves
  introspection and debugging.

Container management systems typically also provide a host of other niceties
including:

- naming services,
- autoscaling,
- load balancing,
- rollout tools, and
- monitoring tools.

In borg, these features were integrated over time in ad-hoc ways. Kubernetes
organizes these features under a unified and flexible API.

Google's experience has led a number of things to avoid:

- Container management systems shouldn't manage ports. Kubernetes gives each
  job a unique IP address allowing it to use any port it wants.
- Containers should have labels, not just numbers. Borg gave each task an index
  within its job. Kubernetes allows jobs to be labeled with key-value pairs and
  be grouped based on these labels.
- In Borg, every task belongs to a single job. Kubernetes makes task management
  more flexible by allowing a task to belong to multiple groups.
- Omega exposed the raw state of the system to its components. Kubernetes
  avoids this by arbitrating access to state through an API.

Despite the decade of experience, there are still open problems yet to be
solved:

- Configuration. Configuration languages begin simple but slowly evolve into
  complicated and poorly designed Turing complete programming languages. It's
  ideal to have configuration files be simple data files and let real
  programming languages manipulate them.
- Dependency management. Programs have lots of dependencies but don't manually
  state them. This makes automated dependency management very tough.

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
