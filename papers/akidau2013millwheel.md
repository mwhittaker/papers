## [MillWheel: Fault-Tolerant Stream Processing at Internet Scale (2013)](https://scholar.google.com/scholar?cluster=11192973635829532709&hl=en&as_sdt=0,5)
**Summary.**
MillWheel is a stream processing system built at Google that models computation
as a dynamic directed graph of *computations*. MillWheel allows user's to write
arbitrary code as part of an operation yet still transparently enforces
idempotency and exactly-once message delivery. MillWheel uses frequent
checkpointing and upstream backup for recovery.

Data in MillWheel is represented by (key, value, timestamp) triples. Values and
timestamps are both arbitrary. Keys are extracted from records by user provided
key extraction functions. Computations operate on inputs and the computations
for a single key are serialized; that is, no two computations on the same key
will every happen at the same time. Moreover, each key is associated with some
persistent state that a computation has access to when operating on the key.

MillWheel also supports *low watermarks*. If a computation has a low watermark
of `t`, then it's guaranteed to have processed all records no later than `t`.
Low watermarks use the logical timestamps in records as opposed to arrival time
in systems like Spark Streaming.  Low watermark guarantees are not actually
guarantees; they are approximations.  *Injectors* inject data into MillWheel
and can still violate low watermarks semantics. When a watermark violating
record enters the system, computations can choose to ignore it or try to
correct it. Moreover, the MillWheel API allows users to register for code,
known as *timers*, to execute at a certain wall clock or low watermark time.

MillWheel guarantees messages are logically sent exactly once. Messages may be
sent multiple times within the system, but measures are taken to ensure that
the system appears to have delivered them only once. Similar care must be taken
to ensure that per-key persistent state is not updated erroneously. When a
message is received at a computation, the following events happen:

- The data is deduplicated by checking first against a Bloom filter and then a
  disk.
- User code is executed.
- Pending changes to the persistent state are committed.
- Senders are acknowledged.
- Produced data is sent downstream.

Imagine if a computation commits a change to persistent state but crashes
before acking senders. If the computation is replayed, it may modify the
persistent state twice. To avoid this, each record in the system is given a
unique id. When state is modified in response to a record, the id of the record
is atomically written with the state change. If a computation later
re-processes the record and attempts to re-modify the state, the modification
is ignored.

Before a record is sent downstream, it is checkpointed. These are called
*strong productions*. Programs can opt out of strong productions and instead
use *weak productions*: non-checkpointed productions. When using weak
productions, MillWheel still performs occasional checkpoints to avoid a long
chain of acknowledgements to be blocked by a straggling worker. Programs can
also opt-out of exactly-once semantics.

To avoid zombie writers from corrupting state, each write is associated with a
sequencer token that is invalidated when a new writer becomes active.

MillWheel is implemented using a replicated master that manages key-range
assignments and a single central authority for computing low watermarks.

**Commentary.**
- Spark Streaming claims that using replication for recovery reduces the
  latency of the system. MillWheel frequently checkpoints data. This leads me
  to wonder if MillWheel experiences a latency hit, but the evaluation only
  considers single stage pipelines!
- The evaluation does not evaluate the recovery time of the system, something
  that Spark Streaming would say is very slow.
- The paper also says the Spark Streaming model is limiting and depends heavily
  on the RDD API. I wish there were a concrete example demonstrating Spark
  Streaming's inexpressiveness.
- I'm having trouble understanding how the per-key API allows for things like
  joins.
