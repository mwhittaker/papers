# [The CQL Continuous Query Language: Semantic Foundations and Query Execution (2006)](https://scholar.google.com/scholar?cluster=17215743948117955326)
Relational database management systems (DBMSs) manage a static collection of
relations. If you sit there and don't do anything to the database, the data
isn't going to change. You can also run ad-hoc queries against the static
database and get back a static answer.

**Data stream management systems** (DSMSs) manage streams of data. You register
a set of **continuous queries** ahead of time and then throw streams of data at
it. The DSMS automatically executes your continuous queries as stream data
pours in. For example, your stream might consist of sensor readings reporting
the speed and location of cars on a highway, and your DSMS stream out toll
information for the cars (more on this later).

In what language should we write continuous queries? Can we just take SQL and
replace all the relations with streams? Not really; it's a bit more complicated
than that. This paper presents a (somewhat) formal semantics for an abstract
continuous query language and instantiate the abstract query language with a
concrete query language CQL which the authors have implemented in their DSMS
STREAM.

## Running Example
As a running example, imagine we have $L$ bi-directional 100-mile long highways
that are divided into 100 1-mile long segments. Every car that drives on these
highways is fitted with a sensor that reports the speed and position (highway
number, $x$ position, direction) of the car every 30 seconds. Our goal is to
assign a toll to each car in a congested segment of highway. We say a segment
is congested if the average speed of the cars in the segment over the last 5
minutes is less than 40 mph. The toll we apply is $basetoll \times (numvehicles
- 150)^2$. Our goal is to take in the sensor reading stream and stream out
tolls.

## Streams and Relations
We assume that we have a countable totally ordered time domain $\mathcal{T}$. A
**stream** $S$ is a multiset of pairs of the form $(s, \tau)$ where $s$ is a
tuple that obeys the schema of $S$ and $\tau \in \mathcal{T}$ is the timestamp
of the tuple. We also require that there is a finite number of tuples
associated with each timestamp.  A **relation** $R$ is a function from the time
domain $\mathcal{T}$ to multisets of tuples that obey the schema of $R$.
$R(\tau)$ is the value of a relation at time $\tau$.

A bit of terminology:

- $S$ up to $\tau$ is the multiset $\setst{(s, \tau') \in S}{\tau' \leq \tau}$.
- $S$ at $\tau$ is the multiset $\setst{(s, \tau') \in S}{\tau' = \tau}$.
- $R$ up to $\tau$ is the sequence $[R(\tau')]_{\tau' \leq \tau}$.
- $R$ at $\tau$ is $R(\tau)$.

## Abstract Semantics
We now describe the semantics of an abstract continuous query language in terms
of three types of operators: **stream-to-relation**, **relation-to-relation**,
and **relation-to-stream**. The semantics are abstract because we will not
describe concrete instantiations of these operators.

- A stream-to-relation operator produces a relation $R$ from a stream $S$ with
  the same schema as $S$. At every time $\tau$, $R(\tau)$ should depend only on
  $S$ up to $\tau$. That is, $R(\tau)$ should not depend on values in the
  stream at time greater than $\tau$.
- A relation-to-relation operator maps a number of relations $R_1$, $\ldots$,
  $R_n$ to a single relation $R$. At every time $\tau$, $R(\tau)$ should be a
  function only of $R_1(\tau)$, $\ldots$, $R_n(\tau)$.
- A relation-to-stream operator produces a stream $S$ from a relation $R$ with
  the same schema as $R$. At every time $\tau$, $S$ at $\tau$ should only
  depend on $R$ up to $\tau$. That is, $S$ at $\tau$ should not depend on
  values in relation at time greater than $\tau$.

Refer to definition 5.1 of the paper for a description of continuous semantics.
Admittedly, I don't understand it, and the next section makes way more sense.

## Continuous Query Language
The **Continuous Query Language** (CQL) is an instantiation of the abstract
query language from the previous section. CQL provides few stream-to-relation
and relation-to-stream operators and a large number of relation-to-relation
operators. This allows CQL to reuse a lot of existing work on query
optimization.

### Stream-To-Relation
All CQL stream-to-relation operators are based on windowing:

- **Time-based windowing.** Syntactically, we represent a time-based windowing
  of stream $S$ as `S[Range t]`. Semantically, `S[Range t]` produces a relation
  $R$ such that $R(\tau)$ consists of all tuples in $S$ with timestamp within
  `t` time units of $\tau$. `S[Now]` and `S[Range Unbounded]` represent `t`
  equal to zero and infinity respectively.
- **Tuple-based windowing.** Syntactically, we represent a tuple-based
  windowing of stream $S$ as `S[Rows n]`. Semantically, `S[Rows n]` produces a
  relation $R$ such that $R(\tau)$ consists of the `n` most recent tuples in
  $S$ as of time $\tau$. Ties are broken non-deterministically.
- **Partition-based windowing.** Syntactically, we represent a partition-based
  windowing of stream $S$ on attributes $A_1$, $\ldots$, $A_k$ as `S[Partition
  By A1, ..., Ak Rows n]`. Semantically, this produces a relation $R$ such that
  $R(\tau)$ consists of the union of the `n` most recent tuples for each group
  with group key $A_1$, $\ldots$, $A_k$.

### Relation-To-Relation
CQL includes most standard SQL operators. For example, consider the following
CQL query

```
SELECT DISTINCT vehicleId
FROM PosSpeedStr[Range 30 Seconds];
```

which returns a list of all the distinct vehicle ids that have reported a
position and speed in the last 30 seconds.

### Relation-To-Stream
There are three relation-to-stream operators:

- **`Istream` (insert stream).** `Istream`$(R)$ produces a stream $S$ such that
  $S$ at $\tau$ contains all the tuples in $R(\tau) - R(\tau - 1)$.
  Essentially, it streams all the insertions to $R$.
- **`Dstream` (delete stream).** `Istream`$(R)$ produces a stream $S$ such that
  $S$ at $\tau$ contains all the tuples in $R(\tau - 1) - R(\tau)$.
  Essentially, it streams all the deletions from $R$.
- **`Rstream` (relation stream).** `Rstream`$(R)$ produces a stream $S$ such
  that $S$ at $\tau$ contains all the tuples in $R(\tau)$. `Rstream` subsumes
  the other two, but having all three is convenient.

The following queries are equivalent:

```
SELECT Istream(*)
FROM PosSpeedStr[Range Unbounded]
WHERE speed > 65;
```

```
SELECT Rstream(*)
FROM PosSpeedStr [Now]
WHERE speed > 65;
```

### Syntactic Sugar
As syntactic sugar, `Istream` is added to monotonic queries and an `[Range
Unbounded]` clause is added to streams. This allows to write the above query
like this:

```
SELECT *
FROM PosSpeedStr
WHERE speed > 65;
```

## Linear Road
The paper discusses how to implement the running example from above using CQL.
It involves six relatively simple queries. Refer to the paper for details.

## Time Management
In order to produce a relation or stream at time $\tau$, STREAM has to have
received all tuples with timestamp $\leq \tau$. To do this, STREAM uses
**heartbeats** (or punctuations, or low watermarks). A heartbeat at time $\tau$
indicates that no other tuples will arrive with timestamp $\leq \tau$. There
are a couple of ways to inject heartbeats:

- If tuples are timestamped by a centralized DSMS, then the DSMS can generate
  the hearbeats.
- If all inputs sources deliver tuples in timestamp order, then the input
  sources can send heartbeats and the minimum of all heartbeats is the true
  heartbeat.
- If all input sources have access to a global clock and there is a bounded
  message delivery delay, then heartbeats can be inferred.

## Equivalences
A couple of CQL query equivalences are useful for query optimizations. Note
that all equivalences used for standard SQL queries and materialized view
maintenance apply to CQL as well.

- **Window Reduction.** `SELECT Istream(L) FROM S[Range Unbounded] WHERE C` is
  equivalent to `SELECT Rstream(L) FROM S[Now] WHERE C`.
- **Filter-Window Commutativity.** `(SELECT L FROM S WHERE C)[Range t]` is
  equivalent to `SELECT L FROM S[Range t] WHERE C`.

## Comparison with Other Languages
CQL subsumes a lot of existing continuous query languages including those used
by Tapestry, Tribeca, Gigascope, and Aurora. CQL is also similar to
TelegraphCQ. One notable difference with TelegraphCQ is that TelegraphCQ's
query language is stream-only whereas CQL includes both streams and relations.

However, it is easy to construct a stream-only variant of CQL which we can
translate to CQL with relations. For example, for every relation-to-relation
operator $O$ in CQL, we introduce a new operator $O_s$ where $O_s(S_1, \ldots,
S_n)$ translates to $Rstream(O(S_1[Now], \ldots, S_n[Now]))$. Similarly, every
stream-to-relation operator $S[W_s]$ can translate to $Rstream(S[W])$.

## STREAM
CQL is implemented in STREAM. STREAM represents both streams and relations as
streams in which each timestamped tuple is also annotated as an insertion or a
deletion. Query plans are graphs in which

- each vertex is an **operator**,
- each edge is a **queue**, and
- each operator maintains its state in a **synopsis**.

Queues and synopses are kept in memory, but tuples are not copied whenever
possible. Moreover, multiple queries will share the same query plan. See the
paper for some concrete examples of query plans.

Concretely, STREAM implements all stream-to-relation operators as a
`seq-window` operator. All relation-to-relation operators are implement in an
incremental fashion. STREAM supports binary and multi-way joins. There is one
operator for each of `Istream`, `Dstream`, and `Rstream`. There are also
**system operators** which handle things like receiving tuples from over the
network. Each operator is sure to output tuples with the correct timestamp
based on the tuples it used to generate it.

<script type="text/javascript" async
  src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/MathJax.js?config=TeX-MML-AM_CHTML">
</script>
