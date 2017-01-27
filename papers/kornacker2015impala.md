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

