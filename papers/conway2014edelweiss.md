# Edelweiss: Automatic storage reclamation for distributed programming

Shared mutable state is hard to reason about in distributed systems. As a
result, many systems avoid shared mutable state in favor of having nodes
accumulate immutable messages (or events) in a log and share the logs with
other nodes. This paradigm is known as *Event Log Exchange* (ELE). While the
ELE paradigm is often easier to reason about, the fact that event logs are
perpetually growing makes it challenging to reclaim memory. Many existing
storage systems write their own custom memory reclamation protocols. Edelweiss
is a subset of Bloom.  Edelweiss programs are written in the ELE style but can
be automatically converted to a Bloom program which efficiently reclaims
memory.

## Bloom and Edelweiss.
Recall that a Bloom program runs on a set of *nodes*. Each node manages a set
of local *collections* and uses *rules* to update those collections. Processing
proceeds in *timesteps*. At the beginning of each timestep, nodes receive
messages over the network and add them to their local collections. During the
timestep, the rules are run to a fixed point. This in turn might generate
messages which are sent to other nodes.

The collections can be persisted *tables*, views known as *scratches*, or
*channels* which are pseudo-tables used to send messages to other nodes.
Collections are updated with merge (`<=`), deferred merge (`<+`), deferred
delete (`<-`), and async merge (`<~`) operators.

A *persistent* table is one that only ever grows over time. All tables are
persistent unless they appear on the left hand side of a `<-` operation.
Scratches are persistent if they are derived from other persistent tables
monotonically.

Edelweiss is a subset of Bloom with the following restrictions:

1. Deletion rules (`<-`) are prohibited.
2. Channel messages are stored persistently.
3. Channels are derived from persistent collections.

These restrictions imply that all tables are persistent, though not all
scratches necessarily are. Moreover, once a message is sent, it is never
intended to be retracted. And, once a node receives a message, it persists it.

Edelweiss performs the following program rewrites which reduces the memory
overhead of the program without changing its behavior.

## Avoidance of Redundant Messages (ARM).
Assume an Edelweiss program forwards the contents of a relation into a channel:

```
chn <~ X
```

Because of restriction 2, all messages are persisted, so duplicate messages can
be suppressed. To do so, a new `chn_ack` and `chn_approx` channel is created.
Whenever a node receives a message over the channel, it sends an
acknowledgement on `chn_ack`. Whenever a node receives an acknowledgement, it
persists it in `chn_approx`. The rule above is then rewritten to the following:

```
chn <~ X.notin(chn_approx)
```

## Positive Difference Reclamation (DR+).
Consider a rule of the form

```
chn <~ X.notin(Y)
```

where both `X` and `Y` are persistent. Once a tuple `t` appears in `Y`, it will
never again appear in `X.notin(Y)`. Thus, `t` can be removed from `X`. However,
removing `t` from `X` might affect some other rule like:

```
s <= X
```

where `s` is a scratch. If we can determine that removing `t` from `X` will not
affect any other rules, then we can remove tuples like `t` from it using a rule
like the following:

```
X <- X intersect Y
```

## Range Compression.
Say we have a persistent table `Y` that contains ids. `chn_ack` is one such
table. These tables can grow without bound. We can compactly represent `Y` as a
set of ranges. For example, the relation `Y = {0, 1, 2, 3, 5, 6, 7, 9, 10}` can
be represented as `{[0, 3], [5,7], [9, 10]}`. Assuming that `Y` doesn't have
too many holes, this representation will be compact.

## Punctuations.
Consider a rule of the following form:

```
chn <~ (X join Y) - Z
```

for a persistent `Z`. As we learned with DR+, if a tuple `t` appears in `Z`,
then it can be reclaimed from `X join Y`, but when can we remove a tuple
from `Y`? Well, to remove a tuple `t` from `Y`, we must know that

1. every tuple formed by joining `t` is in `Z` and
2. there will never be a new tuple `u` in `X` that joins with `t`.

Checking 1 is easy, we just take the join of `t` with `X`. To ensure 2, we have
to guarantee ourselves that a tuple matching `t` will never show up in `X`. We
can accomplish this with punctuations. One way to punctuate `X` is to mark it
as sealed which says that its size is fixed. Alternatively, we can have
punctuations like `X` will never receive any message from epoch 42.

## Negative Difference Reclamation (DR-).
Consider rules of the form

```
chn <~ X - Y
```

We saw that we can use DR+ to remove a tuple `t` from `X` once it appears in
`Y`. After we remove `t` from `X`, can we remove it from `Y`? No. `t` may be
sent multiple times and reappear in `X`. To reclaim tuples from `Y`, we have to
do something a bit more clever to ensure that once a tuple is removed from `X`,
it will never appear again.

We create a relation `X_keys` which contains the keys of any element that has
appeared in `X`. When a tuple `t` arrives, it is not inserted back into `X` if
its key appears in `X_keys`. By doing this, we can reclaim tuples from `X` and
`Y` simultaneously resting assured that the tuple will never again appear in
`X`.

## Applications.
Using these optimizations, we can apply them to simple unicast protocols,
broadcast protocols, key-value stores, causally consistent key-value stores,
and single-node registers.
