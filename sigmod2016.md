### Session 12: Distributed Data Processing
1. **Realtime Data Processing at Facebook** Facebook describes five design
   decisions faced when building a stream processing system, what decisions
   existing stream processing system made, and how their stream processing
   systems (Puma, Swift, and Stylus) differ.
2. **SparkR: Scaling R Programs with Spark** R is convenient but slow. This
   paper presents an R package that provides a frontend to Apache Spark to
   allow large scale data analysis from within R.
3. **VectorH: taking SQL-on-Hadoop to the next level** VectorH is a
   SQL-on-Hadoop system built on the Vectorwise database. VectorH builds on
   HDFS and YARN and supports ordered tables uing Positional Delta Trees. It is
   orders of magnitude faster than existing SQL-on-Hadoop systems HAWQ, Impala,
   SparkSQL, and Hive.
4. **Adaptive Logging: Optimizing Logging and Recovery Costs in Distributed
   In-memory Databases** Some memory databases have eschewed ARIES-like data
   logging for command logging to reduce the size of logs. However, this
   increases recovery time. This paper improves command logging allowing nodes
   to recover in parallel and also introduces an adaptive logging scheme that
   uses both data and command logging.
5. **Big Data Analytics with Datalog Queries on Spark** This paper presents
   BigDatalog: a system which runs Datalog efficiently using Apache Spark by
   exploiting compilation and optimization techniques.
6. **An Efficient MapReduce Cube Algorithm for Varied Data Distributions** This
   paper presents an algorithm that computes Data cubes using MapReduce that
   can tolerate skewed data distributions using a Skews and Partitions Sketch
   data structure.

### Session 18: Transactions and Consistency
1. **TARDiS: A Branch-and-Merge Approach To Weak Consistency**
   TARDiS is a transactional key-value store explicitly designed with weak
   consistency in mind. TARDiS exposes the set of conflicting branches in an
   eventually consistent system and allows clients to merge when desired.
2. **TicToc: Time Traveling Optimistic Concurrency Control** TicToc is a new
   timestamp management protocol that assigns read and write timestamps to data
   items and lazily computes commit timestamps.
3. **Scaling Multicore Databases via Constrained Parallel Execution** 2PL and
   OCC sacrifice parallelism in high contention workloads. This paper presents
   a new concurrency control scheme: interleaving constrained concurrency
   control (IC3). IC3 uses static analysis and runtime techniques.
4. **Towards a Non-2PC Transaction Management in Distributed Database Systems**
   Shared nothing transactional databases have fast local transactions but slow
   distributed transactions due to 2PC. This paper introduces the LEAP
   transaction management scheme that converts distributed transactions into
   local ones. Their database L-store is compared against H-store.
5. **ERMIA: Fast memory-optimized database system for heterogeneous workloads**
   ERMIA is a database that optimizes heterogeneous read-mostly workloads using
   snapshot isolation that performs better than traditional OCC systems.
6. **Transaction Healing: Scaling Optimistic Concurrency Control on Multicores**
   Multicore OCC databases don't scale well with high contention workloads.
   This paper presents a new concurrency control mechanism known as transaction
   healing where dependencies are analyzed ahead of time and transactions are
   not full-blown aborted when validation fails. Transaction healing is
   implemented in TheDB.
