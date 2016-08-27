# Table of Contents #
- [A Relational Model of Data for Large Shared Data Banks (1970)](#a-relational-model-of-data-for-large-shared-data-banks-1970)
- [The Unix Time-Sharing System (1974)](#the-unix-time-sharing-system-1974)
- [A History and Evaluation of System R (1981)](#a-history-and-evaluation-of-system-r-1981)
- [Inferring Internet Denial-of-Service Activity (2001)](#inferring-internet-denial-of-service-activity-2001)
- [BOOM Analytics: Exploring Data-Centric, Declarative Programming for the Cloud](#boom-analytics-exploring-data-centric-declarative-programming-for-the-cloud)

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

## [BOOM Analytics: Exploring Data-Centric, Declarative Programming for the Cloud](BOOM_Analytics.pdf) ##
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
