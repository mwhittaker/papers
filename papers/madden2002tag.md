# [TAG: A Tiny AGgregation Service for Ad-Hoc Sensor Networks (2002)](https://scholar.google.com/scholar?cluster=15109435484888639161)
People deploy networks of itty-bitty sensors and compute aggregates over the
data read by each of these sensors (e.g. average temperature). Previously,
people would implement this aggregation using low-level C. This paper proposes
TAG: a system which (a) allows users to express aggregation using a declarative
query language and (b) implements the aggregation efficiently using tree
aggregation and a handful of optimizations.

## Motes and Ad-Hoc Networks
TAG runs on small battery-powered sensors called motes which run TinyOS. Every
mote has a very weak processor and a very small amount of memory. Each mote has
a half-duplex mote (i.e. they can send and receive messages but not at the same
time).

Motes communicate using a CSMA protocol over a shared backbone in which
messages are broadcast to all motes. To achieve point-to-point communication,
every mote is assigned a unique id and every message is prefixed with the id
its recipient. Though motes receive every message sent, the ignore the ones
that are not destined for them.

In order to route messages and compute aggregates, motes for a routing tree. A
root node broadcasts a message with its current level (i.e. 0). When a mote
receives a routing message for the first time, it sets its level, increments
the level and broadcasts the message. Later, during aggregation, children send
messages up the tree to the root.

## Query Model and Environment
TAG employs a SQL-like query language. For example, the following query returns
the average volume of all rooms on the sixth floor that are louder than some
threshold.

```sql
SELECT AVG(volume), room
FROM sensors
WHERE floor=6
GROUP BY room
HAVING AVG(volume) > threshold
EPOCH DURATION 30s;
```

TAG queries deviate from SQL queries only in that they are streaming. For
example, the query above will generate an average volume every 30 seconds. This
epoch must be enough time for aggregates to be computed by the sensor network.

Tag computes aggregates using a tree reduction parameterized by a merge
function `f`, an initializer `i`, and an evaluator `e`. Leaves generate
intermediate records with `i` which they send to their parents. Inner nodes
merge intermediate records with `f` to create new intermediate records. Running
`e` on the final intermediate records produces the final aggregate.

There are four dimensions by which we can taxonomize aggregates:

1. **Duplicate Sensitivity.** Some operators like `MAX` are not sensitive to
   duplicates while some like `AVERAGE` are.
2. **Exemplary vs Summary.** Some operators like `MAX` return one of the input
   data points while some like `AVERAGE` may return a value that did not appear
   in the input.
3. **Monotonic.** An aggregate is monotonic (or increasing) if for every
   intermediate record `s` and `s'`, `e(f(s, s')) >= MAX(e(s), e(s'))`. In
   words, merging two records produces an output larger than the two inputs.
4. **Amount of State.**
    - **Distributive.** The intermediate records are the final records. That
      is, `e` is the identity function.
    - **Algebraic.** The intermediate records have the same size as the final
      records. That is `e` preserves size.
    - **Holistic.** The intermediate records' size is proportional to the
      amount of data being aggregated.
    - **Unique.** The intermediate records' size is proportional to the number
      of unique values in the input.
    - **Context-Sensitive.** The intermediate records' size is proportional to
      statistical property of the input data.

Motes also maintain a catalog of their available attributes which is cached by
the querier. A mote returns NULL if it is queried for an attribute it doesn't
have.

## In Network Aggregates
When the root receives a query with epoch duration `d`, it propagates the query
down through the tree. Whenever a parent forwards the query down towards its
children, it includes a deadline by which it expects its children to return a
response. When a child receives such a message, it decreases the deadline
before propagating to its children. If all nodes know the depth of the network,
dividing the epoch by the diameter is a good heuristic for setting deadlines.
Nodes could potentially pipeline messages, but that is not implemented by this
paper.

For GROUP BY queries, nodes annotate every intermediate record with the group
that it belongs to. Nodes maintain a table mapping group ids to intermediate
records. If the node runs out of memory, it evicts some of these entries
upwards through the tree. Monotonic aggregates with a HAVING clause can be
pruned early.

## Optimizations
Since all messages are broadcast, motes can snoop messages sent by other motes
and potentially use the information to avoid sending messages. For example, if
a node snoops the MAX value sent by another node and it is higher than its
current value, then it does not need to propagate its value upwards.

Similarly, motes can propagate information down the tree that motes can use to
prune some messages. The paper describes this strategy as **hypothesis
testing**. For example, imagine the root sends an estimated average and an
error bounds. If a node's intermediate average is within the error bounds, it
does not have to send it upwards.

## Fault Tolerance
In order to tolerate faults, nodes automatically reorganize themselves in the
face of mote failure. Every mote measures the link quality to all of its
neighbors. If there is some mote `p'` with better link quality than the parent
`p` that is higher in the tree, then the node replaces `p` with `p'`. A node
does a similar thing when it detects its parent has failed.

The basic TAG algorithm is not super resilient to message loss. To handle
losses better, the paper proposes two optimizations. First, nodes can
maintained a cache of their children's values. If they do not hear from their
children in a given epoch, they can report the cached values. If we clear cache
more frequently than it takes for a mote to re-join the network, then we don't
have to worry about double counting aggregates. Second, motes can send their
aggregates to more than one parent. For example, with a duplicate-insensitive
aggregate, motes can send heir intermediate record to all parents. For other
aggregates, intermediate records can sometimes be divided nicely (e.g. sending
`c/2` to two parents for a COUNT).

<link href='../css/default_highlight.css' rel='stylesheet'>
<script src="../js/highlight.pack.js"></script>
<script>hljs.initHighlightingOnLoad();</script>
