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

