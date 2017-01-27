## [Realtime Data Processing at Facebook (2016)](http://dl.acm.org/citation.cfm?id=2904441)
There's an enormous number of stream (a.k.a. real-time, interactive) processing
systems in the wild: Twitter Storm, Twitter Heron, Google Millwheel, LinkedIn
Samza, Spark Streaming, Apache Flink, etc. While all similar, the stream
processing systems differ in their ease of use, performance, fault-tolerance,
scalability, correctness, etc. In this paper, Facebook discusses the design
decisions that go into developing a stream processing system and discusses the
decisions they made with three of their real-time processing systems: Puma,
Swift, and Stylus.

**Systems Overview.**
- *Scribe.* Scribe is a persistent messaging system for log data. Data is
  organized into categories, and Scribe buckets are the basic unit of stream
  processing. The data pushed into scribe is persisted in HDFS.
- *Puma.* Puma is a real-time data processing system in which applications are
  written in a SQL-like language with user defined functions written in Java.
  The system is designed for compiled, rather than ad-hoc, queries. It used to
  compute aggregates and to filter Scribe streams.
- *Swift.* Swift is used to checkpoint Scribe streams. Checkpoints are made
  every `N` strings or every `B` bytes. Swift is used for low-throughput
  applications.
- *Stylus.* Stylus is a low-level general purpose stream processing system
  written in C++ and resembles Storm, Millwheel, etc. Stream processors are
  organized into DAGs and the system provides estimated low watermarks.
- *Laser.* Laser is a high throughput, low latency key-value store built on
  RocksDB.
- *Scuba.* Scuba supports ad-hoc queries for debugging.
- *Hive.* Hive is a huge data warehouse which support SQL queries.

**Example Application.**
Imagine a stream of events, where each event belongs to a single topic.
Consider a streaming application which computes the top `k` events for each
topic over 5 minute windows composed of four stages:

1. *Filterer.* The filterer filter events and shards events based on their
   dimension id.
2. *Joiner.* The joiner looks up dimension data by dimension id, infers the
   topic of the event, and shards output by (event, topic).
3. *Scorer.* The scorer maintains a recent history of event counts per topic as
   well as some long-term counts. It assigns a score for each event and shards
   output by topic.
4. *Ranker.* The ranker computes the top `k` events per topic.

The filterer and joiner are stateless; the scorer and ranker are stateful. The
filterer and ranker can be implemented in Puma. All can be implemented in
Stylus.

**Language Paradigm.**
The choice of the language in which users write applications can greatly impact
a system's ease of use:

- *Declarative.* SQL is declarative, expressive, and everyone knows it.
  However, not all computations can be expressed in SQL.
- *Functional.* Frameworks like Dryad and Spark provide users with a set of
  built-in operators which they chain together. This is more flexible that SQL.
- *Procedural.* Systems like Storm, Heron, and Samza allow users to form DAGs
  of arbitrary processing units.

Puma uses SQL, Swift uses Python, and Stylus uses C++.

**Data Transfer.**
Data must be transferred between nodes in a DAG:

- *Direct message transfer.* Data can be transferred directly with something
  like RPCs or ZeroMQ. Millwheel, Flink, and Spark Streaming do this.
- *Broker based message transfer.* Instead of direct communication, a message
  broker can be placed between nodes. This allows an output to be multiplexed
  to multiple outputs. Moreover, brokers can implement back pressure. Heron
  does this.
- *Persistent message based transfer.* Storing messages to a persistent
  messaging layer allows data to be multiplexed, allows for different reader
  and writer speeds, allows data to be read again, and makes failures
  independent. Samza Puma, Swift, and Stylus do this.

Facebook connects its systems with Scribe for the following benefits:

- Fault Tolerance: If the producer of a stream fails, the consumer is not
  affected. This failure independence becomes increasingly useful at scale.
- Fault Tolerance: Recovery can be faster because only nodes need to be
  replaced.
- Fault Tolerance: Multiple identical downstream nodes can be run to improve
  fault-tolerance.
- Performance: Different nodes can have different read and write latencies. The
  system doesn't propagate back pressure to slow down the system.
- Ease of Use: The ability to replay messages makes debugging easier.
- Ease of Use: Storing messages in Scribe makes monitoring and alerting easier.
- Ease of Use: Having Scribe as a common substrate lets different frameworks
  communicate with one another.
- Scalability: Changing the number of Scribe buckets makes it easy to change
  the number of partitions.

**Processing Semantics.**
Stream processors:

1. Proccess inputs,
2. Generate output, and
3. checkpoint state, stream offsets, and outputs for recovery.

Each node has

- state semantics: can each input affect state at least once, at most once, or
  exactly once.
- output semantics: can each output be produced at least once, at most once, or
  exactly once.

For state semantics, we can achieve

- at least once by saving state before saving stream offsets,
- at most once by saving stream offsets before saving state, and
- exactly once by saving both state and stream offsets atomically.

For output semantics, we can achieve

- at least once by saving output before offset/state,
- at most once by saving offset/state before output,
- exactly once by saving output and offset/state atomically.

At-least-once semantics is useful when low latency is more important than
duplicate records. At most once is useful when loss is preferred over
duplication. Puma guarantees at least once state and output semantics, and
Stylus supports a whole bunch of combinations.

**State-saving Mechanisms.**
Node state can be saved in one of many ways:

- *Replication.* Running multiple copies of a node provides fault tolerance.
- *Local DB.* Nodes can save their state to a local database like LevelDB or
  RocksDB.
- *Remote DB.* Nodes can save their state to remote databases. Millwheel does
  this.
- *Upstream backup.* Output messages can be buffered upstream in case
  downstream nodes fail.
- *Global consistent snapshot.* Flink maintains globally consistent snapshots.

Stylus can save to a local RocksDB instance with data asynchronously backed up
to HDFS. Alternatively, it can store to a remote database. If a processing unit
forms a monoid (identity element with associate operator), then input data can
be processed and later merged into the remote DB.

**Backfill Processing.**
Being able to re-run old jobs or run new jobs on old data is useful for a
number of reasons:

- Running new jobs on old data is great for debugging.
- Sometimes, we need to run a new metric on old data to generate historical
  metrics.
- If a node has a bug, we'd like to re-run the node on the data.

To re-run processing on old data, we have three choices:

- *Stream only.*
- *Separate batch and streaming systems.* This can be very annoying and hard to
  manage.
- *Combined batch and streaming system.* This is what Spark streaming, Flink,
  and Facebook does.

Puma and Stylus code can be run as either streaming or batch applications.

