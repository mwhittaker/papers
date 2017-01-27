## [The Linda alternative to message-passing systems (1994)](https://scholar.google.com/scholar?cluster=2449406388273902590&hl=en&as_sdt=0,5) ##
**Summary.**
*Distributed shared memory* is a powerful abstraction for implementing
distributed programs, but implementing the abstraction efficiently is very
challenging. This led to the popularity of message passing abstractions for
parallel and distributed programming which were easier to implement. Linda is a
programming model and family of programming languages that does implement
distributed shared memory as efficiently (or almost as efficiently) as message
passing.

Linda's memory model revolves around a *tuple space*: a collection of tuples
(pretty much a table). Users interact with the tuple space by writing programs
in one of the Linda languages. For example, C-Linda programs are traditional C
programs that can additionally use one of a few Linda constructs:

- `out(...)` synchronously writes tuples into a tuple space.
- `eval(...)` concurrently evaluates its arguments and writes tuples into a
  tuple space asynchronously.
- `in(...)` reads and removes a single tuple from the tuple space using a tuple
  template: a partial tuple filled in with wildcards.
- `rd(...)` is a nondestructive version of `in`.

The paper argues for the flexibility and expressiveness of Linda's memory
model. It makes it easy to implement master/slave architectures where all
workers can access a shared data structure. The data-centric approach allows
processes to communicate by reading and writing data rather than bothering with
message passing details. Tuple spaces make it easy to implement *static load
balancing* in which some static domain is divided evenly between workers and
*dynamic load balancing* in which the tuple space acts as a queue of requests
which are read and processed by workers.

Linda's implementation comprises three parts:

1. *Language-dependent compilers* compile out the Linda specific constructs.
   For example, the C-Linda compiler compiles a C-Linda compiler into pure C;
   the Linda constructs are compiled to function calls which eventually call
   into the Linda runtime.
2. The *link-time optimizer* chooses the best tuple space accessor
   implementations to use for the specific program.
3. The *machine-dependent run-time* partitions the tuple space so that each
   participating machine serves as both a *computation server* and a *tuple
   space server*. Every tuple of a particular tuple type (determined by the
   number of types of its constituents) is assigned to a single Linda server
   known as the *rendezvous point*. The runtime performs a few notable
   optimizations:

    - Certain tuple types are partitioned across machines, rather than all
      being assigned to a single rendezvous point.
    - Certain tuple fields can be quite large in which case, they are not
      transfered from a machine to the rendezvous point. Instead, they are kept
      locally on the machine that produced them. The rendezvous point is then
      used as a metadata service to locate the field's location. This is
      similar to GFS's design.
    - Some reads are broadcasted to all nodes unsolicitedly as a form of
      prefetching.
    - Rendezvous nodes can be reassigned dynamically depending on the workload
      to place data as close as possible to the accessor.

**Commentary.**
The paper argues that Linda's memory model is expressive, and they support
their claim by implementing a particular scientific computing style
application. I disagree. I think the memory model is primitive and missing some
very useful features. In particular,

- Only one tuple can ever be returned at a time.
- Tuple queries are based solely on equality of individual fields. Queries such
  as "select all tuples whose first column is greater than its third column"
  are not supported.
- There are no transactions. The paper also does not describe the consistency
  of the system.

Essentially, the system is more or less a key-value store which arguably is not
expressive enough for many applications. Moreover, I believe there are some
implementation oversights.

- Data is not replicated.
- Only certain tuple types are sharded, and skewed data distributions are not
  discussed.
