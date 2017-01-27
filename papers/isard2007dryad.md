## [Dryad: Distributed Data-Parallel Programs from Sequential Building Blocks (2007)](https://scholar.google.com/scholar?cluster=4381257520443107986&hl=en&as_sdt=0,5)
Parallel and distributed programming is hard. Dryad is a programming framework,
inspired by parallel databases and MapReduce, which makes distributed
data-parallel program easy by abstracting resource allocation, scheduling,
failure handling, straggler mitigation, etc. In Dryad, computation is expressed
as a directed acyclic graph. The vertexes run user code. The edges, also known
as channels, send data in some form (e.g TCP, files). Users write vertexes and
build graphs using a simple graph description language.

**System Overview.**
Logically, Dryad computations are expressed as directed acyclic graphs of
vertexes (code) and edges (transport). Vertexes can send arbitrary data across
edges; they are responsible for handling data appropriately. Physically, Dryad
execution is orchestrated by a single *Job Manager* (JM) which can run on a
user's machine or in a cluster. The JM contacts a *Name Service* (NS) to get
the addresses and locations of a cluster of workers. Each worker runs a daemon
which coordinates with the JM. The JM, NS, and workers can also be run on a
programmer's machine for debugging. The whole system uses a distributed file
system like GFS.

As an example, consider the following SQL query over a database of celestial
objects. The query computes the set of planets with a similarly colored
neighbor. A RDBMS can execute this query as a pair of index-only joins: one
index on photoObjAll and one on neighbors.

```
SELECT DISTINCT p.objID
FROM photoObjAll p
JOIN neighbors n
ON p.objID = n.objID
    AND n.objID < n.neighborObjID
    AND p.mode = 1
JOIN photoObjAll l
ON l.objID = n.neighborObjID
    AND l.mode = 1
    AND abs((p.u - p.g) - (l.u - l.g)) < 0.05
    AND abs((p.g - p.r) - (l.g - l.r)) < 0.05
    AND abs((p.r - p.i) - (l.r - l.i)) < 0.05
    AND abs((p.i - p.z) - (l.i - l.z)) < 0.05
```

In Dryad, we can represent it as a graph where:

1. Partition the index into pairs `U1, N1, ..., Un, Nn`.
2. One node reads each partition and computes a local join.
3. The data is shuffled and partitioned based on neighborObjID.
4. The data is sorted on neighborObjID.
5. The data is joined with photoObjAll to get the color of the neighbors and
   filtered.
6. The data is sent to a single node for distinct.

**Describing a Dryad Graph.**
Dryad uses a C++ DSL to merge subgraphs into bigger graphs. A graph is a
four-tuple `G = (V_G, E_G, I_G, E_G)` where

- `V_G` is a vector of vertexes,
- `E_G` is a set of edges over `V_G`,
- `I_G` is a subset of `V_G`: the input vertexes, and
- `O_G` is a subset of `V_G`: the output vertexes.

Edges are ordered and multiple edges can exist between a pair of vertexes. Here
are the operation we can use to build or compose graphs:

- Vertex programs are written as a subclass of a C++ `Vertex` class. Given a
  vertex, we can construct the graph `([v], {}, {v}, {v})`.
- Given a graph `G`, we can duplicate the graph `n` times, denoted `G^n`.
- `A >= B` hooks up the outputs of `A` in a round-robin fashion to the inputs
  of `B`.
- `A >> B` hooks up the every output of `A` to every input of `B`.
- `A || B` merges `A` and `B` by taking the union of the vertex, edge, input,
  and output sets.

By default, the edges between vertexes are represented as temporary files. The
upstream node writes to a local file, and the downstream node reads form it. In
addition to this file-based edge, multiple vertexes can also be run in the same
process and communicate via an in-memory pipe. Alternatively, nodes can
communicate via TCP.

**Writing a Vertex Program.**
Vertexes are represented as arbitrary C++ classes that subclass from a `Vertex`
interface. The interface exposes a `Main` method which takes in a number of
readers and writers. Vertexes can also report their status to the JM. Writing
custom vertexes can sometimes be difficult. Dryad also includes a standard set
of default vertexes like map, filter, join. Legacy binaries can also be run as
vertexes.

**Job Execution.**
There is a single JM which is a point-of-failure. Of course, the JM could use
snapshotting or replication. Multiple copies of the same vertex may be run due
to failures and re-execution, so it assumed that vertexes are deterministic.
Vertexes can also provide a preference list describing which machine they want
to run on. This allows a graph to place computation near its input or to group
similar nodes. There are also nice monitoring tools to view the progress of a
Dryad execution.

Each vertex in a graph is put into a stage. Each stage has a stage manager
which manages the execution of the stage. The stage managers do things like
re-execute tasks to avoid stragglers.

The Dryad graph can also be changed at runtime to support optimization like
tree aggregation or partial aggregation.

**Building on Dryad.**
Dryad provides a rather low-level C++ interface. Other teams have developed
higher-level interfaces to Dryad including a Nebual scripting language,
integration with a RDBMS, and hope for integration with SQL or LINQ.

