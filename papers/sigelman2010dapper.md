# [Dapper, a Large-Scale Distributed Systems Tracing Infrastructure](https://scholar.google.com/scholar?cluster=1437492897248640057&hl=en&as_sdt=0,5)
Understanding the behavior of a distributed system requires us to trace actions
across nodes. For example, imagine web search is slow at Google, and an
engineer wants to figure out why. The engineer will have a hard time
pinpointing the cause of slowness because

1. they may not even know which services are being (transitively) used by web
   search;
2. they almost certainly don't know the details of every service being used by
   web search; and
3. when services and machines are shared, the behavior of an application may be
   an artifact of other unrelated applications.

Dapper is Google's distributed tracing system which aims to be ubiquitous (i.e.
all processes in Google use Dapper) and always on (i.e. Dapper is continuously
tracing). Dapper aims to have low overhead, achieve application-level
transparency (i.e. application developers shouldn't have write tracing code
themselves), be scalable, and enable engineers to explore recent tracing data.

## Distributed Tracing in Dapper
A distributed tracing system needs to track all the work done on behalf of some
initiator. For example, imagine a web server which issues an RPC to some cache.
The cache then issues an RPC to a database and also to a lock service like
Chubby. The database issues an RPC to a distributed file system. A distributed
tracing service should track all of these interactions which were all initiated
by the web server.

There are two main ways to perform distributed tracing.

1. **Black-box** tracing uses a huge corpus of tracing data and statistics to
   infer patterns and interactions post-hoc.
2. **Annotation-based** tracing annotates each message with a globally unique
   ID to constructively build distributed tracing. Dapper is an
   annotation-based tracing system.

### Trace Trees and Spans
Dapper represents a **trace** as a tree. Each node in the tree is a **span**.
Each span corresponds to the execution of a single RPC on a single machine and
includes information about the starting and stopping time of the RPC, user
annotations, other RPC timings, and so on. Each span stores a unique span id,
the span id of its parent, and a trace id, all of which are probabilistically
unique 64-bit integers.

### Instrumentation Points
In order to achieve ubiquity and application-level transparency, Dapper
instruments a few core libraries within Google. Most importantly, Dapper
implements ~1,500 lines of C++ code in the RPC library. It also instruments
some threading and control flow libraries.

### Annotations
Dapper allows application developers to inject their own custom annotations
into spans. Annotations can be strings or key-value mappings. Dapper has some
logic to limit the size of a user's annotations to avoid overzealous
annotating.

### Trace Collection
Applications that are instrumented with Dapper write their tracing information
to local log files. Dapper daemons running on servers then collect the logs and
write them into a global BigTable instance in which each row is a trace and
each column is a span. The median latency from the time of a span to its
appearance in the BigTable is 15 seconds, but the delay can be much larger for
some applications.

Alternatively, traces can be collected **in-band**. That is, Dapper could add
tracing information to the responses of RPCs and spans could build up traces as
the RPCs execute. This has two main disadvantages.

1. While the overhead of attaching span information to leaf spans might be
   negligible, the tracing information that would be sent near the root of a
   tall trace tree would become very large.
2. If a node issues multiple RPCs concurrently and then responds to an RPC
   before waiting for all of its children to respond, an in-band tracing scheme
   would lose information about those children.

### Security and Privacy
Dapper traces could be more informative if they included application data, but
for privacy reasons, including application data is opt-in. Dapper also enables
engineers to audit the security of their systems. For example, Dapper can be
used to check whether sensitive data from one machine is being sent to an
unauthorized service on another machine.

## Dapper Deployment Status
Dapper has been running in production at Google for two years. The authors
predict that nearly every process at Google supports tracing. Only a handful of
applications have to manually adjust Dapper to work correctly and very few
applications use a form of communication (e.g. raw TCP sockets) that is not
traced by Dapper. 70% of spans and 90% of traces have at least one user
annotation.

## Managing Tracing Overhead
Dapper aims to introduce as little overhead as possible. This is especially
important for latency- or throughput-sensitive services.

- **Trace Generation Overhead**
  The majority of Dapper's overhead comes from trace generation. It takes
  roughly 200 nanoseconds to create a span. The overheads of logging traces to
  local disks are mitigated by coalescing multiple spans together and by
  writing to disk asynchronously.
- **Trace Collection Overhead**
  The Dapper daemon uses less that 0.3% of a CPU and less than 0.01% of
  Google's network traffic. The daemon is also scheduled with a very low
  priority so that it doesn't interrupt more important processes.
- **Effect on Production Workflows**
  For extremely latency-sensitive services, tracing every single RPC can
  introduce too much latency. To avoid this, Dapper does not log every single
  trace. Instead, it probabilistically chooses some subset of the traces; that
  is it samples traces. Empirically, logging 1/16 is sufficient to avoid
  overheads and logging 1/1024 of the traces is sufficient to debug most
  things.
- **Adaptive Sampling**
  While latency-sensitive applications can only afford to sample traces,
  applications that produce a modest number of traces can afford to trace
  everything. Adaptive sampling allows applications to log different
  proportions of traces depending on the rate at which it produces traces.
- **Sampling During Collection**
  If every trace that was locally logged was imported in the central BigTable,
  the storage and write-throughput requirements would be enormous. Instead,
  Dapper also samples which traces get stored persistently. The trace sampling
  rate is difficult to change because it is linked into running applications,
  but the collection sampling rate (which is used by the daemons) can be easily
  changed by the Dapper team.

## General-Purpose Dapper Tools
Dapper provides an API, known as the Dapper Deopt API (DAPI), to access the
global BigTable of all trace data. DAPI can query the trace data by trace id,
in bulk using a MapReduce, or via a composite index on (service name, host
machine, timestamp). The returned trace objects are navigable trees with Span
objects as vertices.

Dapper also provides a web UI that engineers can use to explore trace data and
debug applications.

## Experiences
- **Using Dapper for Development**
  The AdWords team used Dapper during the rewrite of one of AdWords'
  components. They used Dapper to ensure good performance, improve correctness
  (e.g. see that database writes were being issued to a stale replica), improve
  understanding, and help with testing.
- **Addressing Long Tail Latency**
  Debugging the tail latency of a system is hard even for veteran engineers.
  Dapper makes it much simpler.
- **Inferring Service Dependencies**
  Dapper can be used to see which services depend on other services.
- **Network Usage**
  Network admins have tools to see the per-link traffic usage, but did not have
  a tool to determine which *applications* were responsible for network usage
  spikes.
