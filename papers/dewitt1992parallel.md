# [Parallel Database Systems: the Future of High Performance Database Systems (1992)](https://scholar.google.com/scholar?cluster=8498695891165572028)
Back in the day, like way back in the day, people thought parallel databases
were never going to take off and that specialized hardware was the way of the
future. They were wrong.

## Parallel Database Techniques
The relational model permits two forms of parallelism which parallel databases
take advantage of:

1. **Pipelined parallelism** occurs when multiple operators that pipe into one
   another are implemented in parallel.
2. **Partitioned Parallelism** occurs when portions of the same SQL query can
   be executed in parallel on different data on different machines.

There are two metrics by which we typically evaluate a parallel database.

1. **Speedup** is a measure of how much faster a fixed size task runs when we
   scale up the size of the database. Ideally, with `n` times the number of
   machines, a task will take `n` times less time.
2. **Scaleup** is a measure of how much more load a database can handle when we
   scale up the size of the database. Ideally, with `n` times the number of
   machines, the database can handle `n` times the amount of load.

There are three main overheads which prevent perfect speedup and scaleup:

1. There is a fixed **startup** overhead to starting multiple threads,
   processors, machines, etc.
2. **Interference** between nodes contending over a shared resource (e.g. in a
   shared-memory database) decreases speedup and scaleup.
3. As we add more nodes, the mean completion time might decrease, but the
   variance increases. This leads to **skew** and long tails.

## Hardware Architecture: The Trend to Shared-Nothing Machines
We are unable to build an infinitely large, infinitely fast computer. The goal
of parallelization is to simulate such a machine with an infinite amount of
finite machines. There are currently three approaches:

1. **Shared-Memory.** In a shared-memory system, multiple threads or processes
   share a common memory and a common set of disks.
2. **Shared-Disks.** In a shared-disk system, multiple processes do not share
   memory, but they share a common set of disks.
3. **Shared-Nothing.** In a shared-nothing system, nodes don't share anything.

The first two approaches require complex hardware and do not scale as well as
the third. Thus, for large problems, shared-nothing architectures reign
supreme.

## A Parallel Dataflow Approach to SQL Software
The relational operator model of executing SQL queries lends itself nicely to
pipeline parallelism, but unfortunately, there are some limitations:

- Query execution plans are typically not that deep, so there isn't a boatload
  of parallelism to take advantage of.
- Some operators like aggregates cannot be pipelined.
- Some operators take significantly longer than others. This asymmetry in
  compute time can cause some operators to stall and wait for others.

## Data Partitioning
There are a couple of ways to partition data across a number of nodes: round
robin partitioning, hash partitioning, and range partitioning. Round robin
partitioning is really only good if the only thing we're doing is full table
scans. Hash partitioning helps spread data and avoid data skew problems but
doesn't permit range queries. Range partitioning permits range queries is
susceptible to data skew.

## Parallelism within Relational Operators
Many parallel database inject distribute query operators into their query plan
to orchestrate data across multiple machines. The **merge** operator (really a
union operator) merges in the results of a subquery being run on multiple
nodes. The **split** operator takes a set of data and distributed it across
multiple machines. For example, imagine joining two relations on a common
attribute. The split operator might hash partition data to a set of nodes based
on the join columns. These operators often implement some form of push back to
avoid overloading an operator.

## State of the Art
There are many state of the art (as of 1992) parallel databases including
Teradata, Tandem Nonstop SQL, Gamma, Bubba, and Super Database Computer. Refer
to the paper for details.

## Future Work
There is a lot of future work (in 1992) in mixed OLTP/OLAP workloads,
distributed query optimization, parallel programs (e.g. Spark), and online data
reorganization.
