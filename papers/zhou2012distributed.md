<p hidden>
$\newcommand{\trace}{\mathcal{E}}$
</p>

# [Distributed Time-aware Provenance (2012)](https://scholar.google.com/scholar?cluster=3898580135111314003)
Adapting traditional data provenance to distributed systems would make
distributed systems easier to *debug*, *profile*, *audit*, and so on. To do so,
provenance has to be augmented in the following ways.

- Traditional data lineage allows us to get the lineage of any output tuple
  produced by a query run against a fixed database. In a distributed system, it
  is still useful to know the lineage of a tuple stored at a node, but it is
  also useful to the know the lineage of tuples that existed in the past.
- Networks are free to drop, delay, and reorder messages arbitrarily.
- In a distributed system, lineage can either be computed **proactively** (i.e.
  provenance information is computed at runtime while the system executes) or
  **reactively** (i.e. inputs to programs can be logged and provenance can be
  re-derived on the fly). A provenance system would have to allow users to
  choose between these two alternatives.

This paper presents **distributed time-aware provenance** (DTaP)---a form of
distributed lineage that can handle the scenarios above---and an implementation
of DTaP named **DistTape**.

## System Model
We assume programs are written in NDLog: a variant of datalog intended for
writing distributed systems. An NDLog program is executed by expanding each
NDLog rule into multiple delta rules which compute the tuples that should be
inserted and deleted from a node's relations. We can also capture the execution
of an NDLog program with an **execution trace**: a sequence of all the
insertions, deletions, and derivations that occur in the system. The execution
trace is like a flattened version of every tuple's proof tree.

## DTaP Model
First, a few definitions:

- An update is either $+\tau$ (the derivation of tuple $\tau$) or
  $-\tau$ (the *un*derivation of tuple $\tau$). $\Delta \tau$ is used to range
  over both $+\tau$ and $-\tau$.
- An event $d@N_i = (e, r, t, c, e')$ signifies that the inference
  rule instantiation $\frac{e \quad c}{e'}[r]$ occurred at time $t$ on node
  $N_i$.
- A trace $\trace$ is a sequence of events.
- A subtrace $\trace' \subseteq \trace$ is a subsequence of a trace.
- Given a trace $\trace$, event $d_i@N_i$ happens-before $d_j@N_j$ if the
  former precedes the latter in $\trace$.

Given a trace $\trace$, DTaP models provenance as a graph $G(\trace) = (V, E)$
where each vertex is in one of six forms:

- `INSERT`$(t, n, \tau)$ signifies that tuple $\tau$ was inserted at node $n$
  at time $t$.
- `DELETE`$(t, n, \tau)$ signifies that tuple $\tau$ was deleted at node $n$
  at time $t$.
- `DERIVE`$(t, n, r, \tau)$ signifies that tuple $\tau$ was derived using rule
  $r$ at node $n$ at time $t$.
- `UNDERIVE`$(t, n, r, \tau)$ signifies that tuple $\tau$ was underived using
  rule $r$ at node $n$ at time $t$.
- `SEND`$(t, n, \Delta \tau, n')$ was sent from node $n$ to node $n'$ at time
  $t$.
- `RECEIVE`$(t, n', \Delta \tau, n)$ was received at node $n'$ (sent from node
  $n$) at time $t$.

Edges are added in a straightforward way. For example, when a base tuple is
inserted, an `INSERT` vertex is created. Or, when a tuple is derived, a
`DERIVE` vertex is created. Or, when a tuple is sent from one node to another,
a `SENT` vertex is created. The graph represents a proof tree in much the same
way it does in *TAP: Time-aware Provenance for Distributed Systems*.

Given a provenance graph $G(\trace)$, the provenance of event $\Delta \tau$,
denoted $G(\Delta\tau, \trace)$, is the subgraph of $G(\trace)$ rooted at the
`INSERT` or `DELETE` node corresponding to $\Delta\tau$. Let
$\mathcal{A}(\Delta\tau, \trace)$ be the subsequence of $\trace$ obtained by a
topological sort of $G(\Delta\tau, \trace)$. The paper defines what it means
for $\mathcal{A}(\Delta\tau, \trace)$ to be **valid**, **sound**, **complete**,
and **minimal** and argues that it is all four.

## Maintenance
The DTaP graph is stored in four relations: `prov`, `ruleExec`, `send`, and
`recv` where

- `prov(@N, VID, Time, RLoc, RID)` represents that tuple with VID `VID` was
  derived at node `N` at time `Time` using the rule with RID `RID` on node
  `RLoc`.
- `ruleExec(@RLoc, RID, Rule, ExecTime, Event, CList)` indicates that the rule
  with RID `RID` and label `Rule` executed at `RLoc` at time `ExecTime` with
  children `Event` and `CList`.
- `send(@Sender, VID, STime, RID)` signifies that rule with RID `RID` at node
  `Sender` sent the tuple with VID `VID` at time `STime`.
- `recv(@Receiver, VID, RTime, Sender, STime)` signifies that `Receiver`
  received tuple with VID `VID` at `RTime` from `Sender` which sent it at time
  `STime`.

NDLog programs are rewritten to maintain all four relations as they execute.
See paper for details. As discussed earlier, provenance information can be
computed proactively or reactively. When computed proactively, all provenance
information is computed during execution. When computed reactively, only inputs
are logged, and provenance is re-derived on the fly during query time. The
reactive approach can also be combined with checkpointing.

## Querying
Given a query `provQuery(@N, VID, Time)`, DistTape generates a set of NDLog
rules which recursively walk the relations and build the provenance tree. The
rules are also parametrized by UDFs which users can modify to tune the behavior
of the queries.

## Cost-Based Optimization
Many things affect whether proactive or reactive provenance is superior. For
example, if provenance queries are rare, then the storage overhead of reactive
provenance likely outweighs the increased query time. In order to intelligently
choose between proactive and reactive provenance, DistTape includes a
cost-based decision procedure. The decision procedure is parametrized on many
parameters including:

- The average number of predicates in rule bodies.
- The size of a log entry.
- The message frequency.
- The query frequency.

Given these parameters, DistTape has a formula for the storage overhead and
query latency for the proactive and reactive models which can be used to decide
between the two. The current prototype only supports choosing ahead of time,
but a more sophisticated implementation could dynamically switch between the
two at runtime.

<script type="text/javascript" async
  src="https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-MML-AM_CHTML">
</script>
