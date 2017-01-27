## [Storm @ Twitter (2014)](https://scholar.google.com/scholar?cluster=17632042616176969463&hl=en&as_sdt=0,5)
Storm is Twitter's stream processing system designed to be scalable, resilient,
extensible, efficient, and easy to administer. In Storm, streams of tuples flow
through (potentially cyclic) directed graphs, called *topologies*, of
processing elements. Each processing element is either a *spout* (a source of
tuples) or a *bolt* (a tuple processor).

**Storm Overview.**
Storm runs on a cluster, typically over something like Mesos. Each Storm
cluster is managed by a single master node knows as a Nimbus. The Nimbus
oversees a cluster of workers. Each worker runs multiple worker processes which
run a JVM which run multiple executors which run multiple tasks:

```
worker
+--------------------------------------------------------------+
| worker process                 worker process                |
| +---------------------------+  +---------------------------+ |
| | JVM                       |  | JVM                       | |
| | +-----------------------+ |  | +-----------------------+ | |
| | | executor   executor   | |  | | executor   executor   | | |
| | | +--------+ +--------+ | |  | | +--------+ +--------+ | | |
| | | | +----+ | | +----+ | | |  | | | +----+ | | +----+ | | | |
| | | | |task| | | |task| | | |  | | | |task| | | |task| | | | |
| | | | +----+ | | +----+ | | |  | | | +----+ | | +----+ | | | |
| | | | +----+ | | +----+ | | |  | | | +----+ | | +----+ | | | |
| | | | |task| | | |task| | | |  | | | |task| | | |task| | | | |
| | | | +----+ | | +----+ | | |  | | | +----+ | | +----+ | | | |
| | | +--------+ +--------+ | |  | | +--------+ +--------+ | | |
| | +-----------------------+ |  | +-----------------------+ | |
| +---------------------------+  +---------------------------+ |
| supervisor                                                   |
| +----------------------------------------------------------+ |
| |                                                          | |
| +----------------------------------------------------------+ |
+--------------------------------------------------------------+
```

Users specify a topology which acts as a logical topology. Storm exploits data
parallelism by expanding the logical topology into a physical topology in which
each logical bolt is converted into a replicated set of physical bolts. Data is
partitioned between producer and consumer bolts using one of the following
partitioning scheme:

- *shuffle*: Data is randomly shuffled.
- *fields*: Data is hash partitioned on a subset of fields.
- *all*: All data is sent to all downstream bolts.
- *global*: All data is sent to a single bolt.
- *local*: Data is sent to a task running on the same executor.

Each worker runs a *supervisor* which communicates with the Nimbus. The Nimbus
stores its state in Zookeeper.

**Storm Internals.**

*Nimbus and Zookeeper.*
In Storm, topologies are represented as Thrift objects, and the Nimbus is a
Thrift server which stores topologies in Zookeeper. This allows topologies to
be constructed in any programming language or framework. For example,
Summingbird is a Scala library which can compile dataflows to one of many data
processing systems like Storm or Hadoop. Users also send over a JAR of the code
to the Nimbus which stores it locally on disk. Supervisors advertise openings
which the Nimbus fills. All communication between workers and the Nimbus is
done through Zookeeper to increase the resilience of the system.

*Supervisor.*
Each worker runs a supervisor process which is responsible for communicating
with the Nimbus, spawning workers, monitoring workers, restarting workers, etc.
The supervisor consists of three threads: (1) a *main thread*, (2) an *event
manager thread*, and (3) a *process event manager thread*. The main thread
sends heartbeats to the Nimbus every 15 seconds. The event manager thread looks
for assignment changes every 10 seconds. The process event manager thread
monitors workers every 3 seconds.

*Workers and Executors.*
Each executor is a thread running in a JVM. Each worker process has a thread to
receive tuples and thread to send tuples. The receiving thread multiplexes
tuples to different tasks' input queues. Each executor runs (1) a *user logic
thread* which reads tuples from its input queue and processes them and (2) an
*executor send thread* which puts outbound tuples in a global outbound queue.

**Processing Semantics.**
Storm provides *at most once* and *at least once* semantics. Each tuple in the
system is assigned a unique 64 bit identifier. When a bolt processes a tuple,
it can generate new tuples. Each of these tuples is also given a unique
identifier. The lineage of each tuple is tracked in a lineage tree. When a
tuple leaves the system, all bolts that contributed to it are acknowledged and
can retire their buffered output. Storm implements this using a
memory-efficient representation that uses bitwise XORs.

**Commentary.**
The paper doesn't mention stateful operators.

