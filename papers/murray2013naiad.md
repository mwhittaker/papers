## [Naiad: A Timely Dataflow System (2013)](https://scholar.google.com/scholar?cluster=2514717880214148696&hl=en&as_sdt=0,5)
Naiad is a data-parallel dataflow framework that supports *low-latency*, *high
throughput*, *iterative and incremental computations*, and *consistent
intermediate results*. There are a lot of batch processing systems, stream
processing systems, graph processing systems, etc. out there. Most of these
systems satisfy most of these properties. Naiad achieves *all* of them in a
single system making things more efficient, succinct, and maintainable. Naiad
uses a new computation model, *timely dataflow*, which includes the following
features:

1. structured loops which allow iterative computation and feedback,
2. stateful vertices, and
3. vertex notifications for the end of a epoch or the end of an iteration.

**Timely Dataflow.**
Computation in the timely dataflow model is expressed as a directed, possibly
cyclic graph of stateful vertices and edges that deliver messages. Messages are
annotated with logical timestamps that allow vertices to distinguish messages
from different epochs and loop iterations. Moreover, vertices are notified when
all of the messages of a given timestamp have been delivered.

*Graph Structure.*
A timely dataflow graph has specially designated *input vertices* and *output
vertices*. Inputs are pumped into the input vertices by an external system, and
all inputs are tagged with an epoch. The output vertices pump outputs to an
external system, and they also tag outputs with epochs.

Timely dataflow graphs can contain cycles, but not arbitrary cycles. Cycles
must be organized into possibly nested structures called *loop contexts*. Each
loop context contains three specially designated vertices:

1. an *ingress vertex* at the beginning of the loop,
2. an *egress vertex* at the end of the loop, and
3. a *feedback vertex* along a cycle within the loop context.

Each message in a timely dataflow is labelled with a logical timestamp of the
form `(e, (c_1, ..., c_k))` where `e` is an epoch and `(c_1, ..., c_k)` is a
list of `k` loop counters. As data flows through a loop context, the three
special nodes adjust the timestamp as follows:

- ingress: `(e, <c_1, ..., c_k>) -> (e, <c_1, ..., c_k, 0>)`
- egress: `(e, <c_1, ..., c_k, c_{k+1}>) -> (e, <c_1, ..., c_k>)`
- feedback: `(e, <c_1, ..., c_k>) -> (e, <c_1, ..., c_k + 1>)`

Timestamps are compared pairwise and loop counters are compared
lexicographically.

*Vertex Computation.*
Vertices implement two callbacks:

- `v.OnRecv(e: Edge, m: Message, t: Timestamp)`
- `v.OnNotify(t: Timestamp)`

and can invoke two library functions:

- `this.SendBy(e: Edge, m: Message, t: Timestamp)`
- `this.NotifyAt(t: Timestamp)`

`OnRecv` is called when a message is received. `SendBy` is used to send a
message. `v.NotifyAt(t)` causes a `v.OnNotify(t)` timestamp to be called
later once all messages with timestamp less than or equal to `t` have been
delivered. `OnRecv` and `OnNotify` can run arbitrary code so long as they don't
send messages back in time.

*Achieving Timely Dataflow.*
Here, we outline how to implement timely dataflow in a single-threaded process.
Let an *event* be a message or notification request. Each event in a timely
dataflow has a position and timestamp, dubbed a *pointsamp*, of the form `(t:
Timestamp, l: Edge | Vertex)`. Specifically,

- a `v.SendBy(e, m, t)` produces an event with pointstamp `(t, e)`, and
- a `v.NotifyAt(t)` produces an event with pointstamp `(t, v)`.

Define a *could-result-in* relation where `(t1, l1)` could-result-in `(t1, l2)`
if there exists a path of vertices and edges `psi = (l1, ..., l2)` where
`psi(t1) <= t2`. That is, there is some path from `l1` to `l2` which updates
`t1` to a timestamp less than `t2`. There may be multiple paths from `l1` to
`l2`, so the system maintains a map `Psi[l1, l2]` of the minimum path.

Our single-threaded timely dataflow scheduler maintains a set of *active
pointstamps*: the set of pointstamps for which there is a pending event. Each
active pointstamp is mapped to an *occurrence count* (the number of pending
events with this particular pointstamp) and a *precursor count* (the number of
active pointstamps that could-result-in this one). When an new pending event is
created, the occurrence count is updated and it's initial precursor count is
created. Moreover, the precursor counts of downstream nodes are updated. All
nodes with a precursor count of 0 are said to be on the frontier, and the
system can deliver notifications on the frontier. Finally, input vertices set
up the appropriate active pointstamps which update as data is fed into the
system.

**Distributed Implementation.**
Naiad is a distributed implementation of the timely dataflow model. Like other
batch and stream processing systems, Naiad uses data parallelism to increase
the aggregate computation, memory, and bandwidth of the system. A logical
dataflow graph is compiled and expanded a physical dataflow graph which
includes physical details like the partitioning along each edge.

Workers are responsible for delivering the messages and notifications to the
vertices it runs. Each vertex is run single-threaded, and if a vertex sends a
message to anther vertex in the same worker, the worker can immediately
transfer control between the two vertexes. Vertexes can specify a level of
re-entrancy but are otherwise assumed to be non-reentrant.

Workers also participate in a global progress tracking protocol. Workers
maintain local occurrence and precursor counts. When a worker invokes one of
the four functions above, it broadcasts updates to the occurrence counts. The
protocol maintains the invariant that if some pointstamp `p` is on the local
frontier at a vertex, it is on the global frontier as well. As an optimization,
the active pointstamps are maintained on the global graph instead of the
physical graph. Deltas are also accumulated and buffered.

For fault tolerance, stateful vertices implement `Checkpoint` and `Restore`
methods. Naiad uses these to orchestrate global checkpoints and restorations.

Micro-stragglers---nodes with unusually high latency---are the main obstacle
for a low-latency system. Micro-stragglers can come about from TCP overheads,
data structure contention, garbage collection etc. Naiad has mechanisms to
mitigate these micro-stragglers.

**Writing Naiad Programs.**
Naiad provides lower-level interfaces for constructing timely dataflow graphs.
Higher-level libraries and interfaces (e.g. SQL, LINQ) can be built on top of
this lower-level interface. This separation of library code from system code
allows for greater flexibility.
