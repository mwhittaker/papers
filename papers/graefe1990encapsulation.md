# [Encapsulation of Parallelism in the Volcano Query Processing System (1990)](https://scholar.google.com/scholar?cluster=12203514891599153151)
The Volcano query processing system uses the operator model of query execution
that we all know and love. In this paper, Graefe discusses the **exchange
operator**: an operator that you can insert into a query plan which
automatically parallelizes the execution of the query plan. The exchange
operator allows queries to be executed in parallel without having to rewrite
existing operator.

## The Template Approach
Parallel databases like Gamma and Bubba used a **template approach** to query
parallelization. With the template approach, algorithms are plugged into
templates which abstract away the details of where tuples come from and where
they are sent to. They also abstract away the mechanisms used to send a tuple
over the network or to another process using some IPC mechanism.
Unfortunately, the template approach *required* that tuples either be sent over
the network or over IPC which greatly reduced its performance.

## Volcano Design
Volcano implements queries as a tree of iterators with an open-next-close
interface. The paper discusses something called state records which allow the
same operator multiple times with different parameters, though this seems
obsolete now that we have modern programming languages. Iterators return
structures which contain record ids and pointers to the records which are
pinned in the buffer pool.

## The Operator Model of Parallelization
In the operator model of parallelization, exchange operators are placed in
query plans which automatically parallelize its execution. Exchange operators
provide three forms of parallelism.

1. **Pipeline parallelism.** The exchange operator allows its child and parent
   to run in different processes. When opened, the exchange operator forks a
   child and establishes a region of shared memory called a **port** which the
   parent and child use to communicate with one another. The child part of the
   exchange operator (known as the **producer**) continuously calls next on its
   child, buffers the records into batches called packets, and writes them into
   the port (with appropriate synchronization). The parent part of the exchange
   operator (known as the consumer **consumer**) reads a record from a packet
   in the port whenever its next method is invoked. For flow control, the
   producer can decrement a semaphore and the producer can increment a
   semaphore.
2. **Bushy parallelism.** Busy parallelism is when multiple siblings in a query
   plan are executed in parallel. Bushy parallelism is really just pipeline
   parallelism applied to multiple siblings.
3. **Intra-operator parallelism.** Intra-operator parallelism allows the same
   operator to run in parallel on multiple partitions of input data. As before,
   the exchange operator forks a (master) producer and establishes a port. This
   master producer forks other producers and gives them the location of the
   port. Each forked producer might eventually invoke another group of exchange
   operators. The master consumer will fork a master producer and create a
   port. Producers can send messages to producers using round-robin, hash, or
   range partitioning. When a node is out of records, its sends an
   end-of-stream message to all consumers. Consumers end their stream when they
   count the appropriate number of end-of-stream messages. Unlike the pipelined
   parallelism version of the exchange operator, the intra-operator version is
   not so obvious how to implement. Moreover, I think it involves modifications
   to the leaves of a query plan.

## Variants of Exchange
Producers can also broadcast tuples to consumers. A merge operator sits on top
of an exchange operator and merges together the sorted streams produced by each
producer. The paper also discusses sorting files and having exchange operators
in the middle of a query fragment, but it's hard to understand.
