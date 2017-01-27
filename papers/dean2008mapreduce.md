## [MapReduce: Simplified Data Processing on Large Clusters (2004)](https://scholar.google.com/scholar?cluster=10940266603640308767&hl=en&as_sdt=0,5)
In order to be robust and efficient, programs that process huge amounts of data
have to take into account how to parallelize work, distribute work, handle
failures, and load balance work. The MapReduce framework implements these
complicated pieces of boilerplate, allowing programmers to process huge amounts
of data only having to write simple map and reduce functions.

**Programming Model.**
Logically, users implement map and reduce functions of the following type:

- `map: (k1, v1) -> (k2, v2) list`
- `reduce: (k2, v2 list) -> v2 list`

though in reality, the MapReduce framework deals only with strings. In addition
to providing map and reduce functions, the user also provides the name of
inputs, the name of outputs, tuning parameters, etc. The MapReduce framework
is expressive enough to implement distributed grep, URL access counts, reverse
web-link graph, inverted index, and distributed sort.

**Implementation.**
The MapReduce interface can be implemented in many different ways. For example,
a simple single-threaded implementation could be used for debugging, or a NUMA
multi-processor implementation could be used for datasets that fit in memory.
Here, we discuss an implementation for a cluster of commodity machines.
Execution proceeds in a number of steps:

1. The input data is split into `M` 16-64 MB partitions. A master and a
   collection of workers are spawned.
2. The single master assigns the `M` map tasks and `R` reduce tasks to workers.
3. A mapper reads in its assigned partitions and applies the user provided map
   function to them. The intermediate key-value pairs are buffered in memory.
4. Periodically, a mapper writes intermediate data to a local disk and sends
   the location of the files to the master who forwards them to the reducers.
5. Reduces read the data written by the mappers using RPC when prompted to do
   so by the master. The reducer then (externally) sorts the data by
   intermediate key.
6. The reducer applies the user provided reduce function creating one output
   file for each of the `R` output partitions.
7. Finally, the user program is awoken.

- *Master data structure.* For each task, the master records the status of the
  task (idle, in-progress, completed) and the worker assigned to the task.
  Moreover, for each map task, it records the location of the output data.
- *Worker fault tolerance.* Masters detect worker failure via heartbeats. If a
  worker fails, the master reassigns all the map tasks assigned to it, even the
  ones that have completed. We have to redo completed map tasks because the
  intermediate data is stored locally on the machine and therefore may be
  unavailable. Workers are also notified of the failure and informed to read
  from the new mapper.
- *Master fault tolerance.* The current implementation has no fault tolerance.
  Simple master checkpointing could be implemented.
- *Failure semantics.* If map and reduce functions are deterministic, then the
  computation is deterministic.
- *Locality.* The master attempts to schedule map tasks on the same machine
  where the data is located.
- *Task granularity.* Increasing `M` and `R` improves load balancing and
  decreases the time it takes for work to be redone after a worker failure.
  However, if there are too many tasks, the master becomes a memory bottleneck.
- *Backup tasks.* Near the end of the computation, the master begins to
  reassign incomplete work to mitigate stragglers.

**Refinements.**
- *Partition function.* Users can specify custom partition functions to replace
  the default (i.e. `hash(k) % R`). This is useful if, for example, users want
  to place logically grouped keys on the same reducer.
- *Combiner function.* Users can specify a reduce function, known as a
  combiner, to run at the mapper.
- *Input/output types.* There are a number of default input types (e.g. text,
  SSTable) and users can implement their own as well.
- *Skipping bad records.* Sometimes a bug in the code causes a map or reduce
  function to deterministically crash. The MapReduce framework will inform
  workers to skip this task. Each worker registers a signal handler which sends
  a last-breathe UDP message to the master informing of the record which caused
  the crash. If the master sees multiple failures caused by the same record, it
  tells workers not to process it.
- *Local execution.* The MapReduce framework supports a local execution to
  allow for easier debugging.
- *Status information.* The master exports an HTTP server which includes a
  bunch of useful statistics and metadata.
- *Counters.* The MapReduce framework also supports global counters which can
  be incremented and decremented by workers. The increments and decrements are
  aggregated by the master and are displayed on the master's HTTP server.
