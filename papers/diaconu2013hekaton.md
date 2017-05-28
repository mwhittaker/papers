# [Hekaton: SQL Server's Memory-Optimized OLTP Engine (2013)](https://scholar.google.com/scholar?cluster=14161764654889427045)
Hekaton is a fast in-memory OLTP engine integrated with Microsoft SQL Server.
Hekaton accesses data via lock-free indexes and compiled stored procedures.
Hekaton also implements optimistic multiversion concurrency control as well as
parallel recovery and garbage collection procedures.

## Design Considerations
1. **Optimize indexes for main memory.** Hekaton uses lock-free hash indexes
   and Bw-tree indexes as opposed to more traditional indexes which were
   designed for disks.
2. **Eliminate latches and locks.** Lock freedom and optimistic concurrency
   control allow for fast transactions.
3. **Compile stored procedures.** Stored procedures that exclusively read
   Hekaton tables are compiled to C code.
4. **Don't partition data.** If everything fits in memory on one machine,
   things will run much faster than if data is partitioned.

## Storage and Indexing
Hekaton stores tuples in-memory row-by-row. Each physical tuple contains three
segments:

1. **A header with logical timestamps.** Because Hekaton implements
   multiversion concurrency control, each tuple is annotated with a logical
   begin and end timestamp.
2. **Links for indexes.** Hekaton uses lock-free hash indexes and Bw-tree
   indexes. Multiple tuple versions that share the same index key are linked
   together.
3. **The tuple's data.** Duh.

Reads are issued at particular logical time and scan through all index entries
matching the specified key. Though all entries are scanned, only those whose
begin and end timestamp envelope the read timestamp are read.

When a transaction deletes a tuple, it temporarily writes its transaction id
into the tuples end timestamp. Similarly, when a transaction inserts a tuple,
it temporarily writes its transaction id in the begin timestamp. Once the
transaction completes, it overwrites its id with its end timestamp. An update
is modelled as a deletion followed by an insertion.

## Programmability and Query Processing
Hekaton compiles stored procedures to C code, then compiles and links the C
code into Hekaton. The compilation re-uses a lot of existing SQL Server
components. First, the stored procedure is run through SQL Server's query
optimizer into a **mixed abstract syntax tree** (MAT). A MAT can encode
metadata, imperative code, expressions, and query plans. The MAT is then
compiled into lower level **pure imperative tree** (PIT) that is easier to
compile to C.

Hekaton does not compile query plans into a series of function calls. Instead,
a query plan is compiled into a single function and operators are connected
together via labels and gotos. This allows the code to bypass some otherwise
unnecessary function calls. For example, when the query is initially executed,
it jumps immediately to the leaves of the query plan rather than recursively
calling down to them. Some code (e.g. sort and complicated arithmetic
functions) is not generated.

Hekaton stored procedures have some restrictions (e.g. the schema of the tables
that a stored procedure reads must be fixed, the stored procedures must execute
within a single transaction). To overcome some of these restrictions, SQL
Server allows regular/unrestricted/interpreted stored procedures to read and
write Hekaton tables.

## Transaction Management
Hekaton supports snapshot isolation, repeatable read, and serializability all
implemented with multiversion concurrency control. There are two conditions
which can be checked during validation:

1. **Read stability**. All the versions that a transaction read must still be
   valid versions upon commit.
2. **Phantom avoidance**. All the scans a transaction made must be repeatable
   upon commit.

Checking both these conditions guarantees serializability. Checking read
stability guarantees repeatable read. Checking neither guarantees snapshot
isolation.

Each transaction is assigned a read timestamp (Hekaton uses the begin timestamp
as the read timestamp) and a commit timestamp. To check the conditions above,
transactions maintain a **read set** pointing to all the read versions and
**scan set** describing how to repeat scans. Upon commit, the transaction
verifies that the read set is still valid as of the commit timestamp, and it
re-executes scans to make sure that no versions have been added, deleted, or
updated.

If a transaction reads something from a yet to be committed transaction, it
marks the transactions as a **commit dependency**. Cascaded aborts are possible
because if the commit dependency aborts, the dependent transaction must also
abort. Moreover, a transaction must wait for all commit dependencies to commit
before it does.

After a transaction commits, it updates the end timestamp of all the tuples it
deleted and the begin timestamp of all the tuples it inserted. To do so
efficiently, transactions maintain a **write set** pointing to these tuples.

## Transaction Durability
Hekaton stores two types of data for recovery:

1. **Log streams.** A log stream records all of the tuple versions inserted and
   deleted by an transaction during a period of logical time.
2. **Checkpoint streams.** There are two types of checkpoint streams. A **data
   stream** records all of the tuples inserted during a period of logical time.
   Every data stream has a corresponding **delta stream** which records the
   version ids of all the deleted tuples during the same period of logical
   time.

Each transaction produces a single record in the log stream once it commits.
This is possible because Hekaton does not use write-ahead logging; it does not
need to flush log entries to disk before flushing pages to disk because it
doesn't flush pages to disk. Remember that everything is kept in memory.
Hekaton also batches log entries together to improve IO efficiency.

Periodically, parts of the log are converted into data and delta streams and
flushed to disk. Even more periodically, data and delta streams are merged
together into more compressed streams that cover a larger period of logical
time.

Upon recovery, Hekaton processes data/delta stream pairs in parallel.

Note that index operations are not logged at all; indexes are rebuilt during
execution. This pushes the bulk recovery overhead to recovery time.

## Garbage Collection
A tuple version is garbage in one of two scenarios:

1. A tuple version was deleted at time `t` and every pending transaction has a
   read timestamp later than `t`.
2. A tuple version was created by a transaction which rolled back.

Garbage collection deletes both kinds of garbage. Hekaton's garbage collector
has two kinds of collection: online and offline.

1. **Online.** Whenever a transaction scans through the entries of an index,
   they are free to remove any tuple versions that are garbage. If a tuple
   version is removed from all indexes, it is reclaimed. This online collection
   piggybacks off the existing cost of scanning indexes. Moreover, it ensures
   that hot indexes are kept clean.
2. **Offline.** Periodically, the garbage collector has to clean out the *dusty
   corners* of indexes that are not cleaned online. This work is parallelized
   across all cores. A worker thread will alternate between processing
   transactions and performing a small amount of garbage collection. This
   mechanism throttles processing to ensure that garbage does not endlessly
   pile up.
