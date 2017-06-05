# [Scaling Distributed Machine Learning with the Parameter Server (2014)](https://scholar.google.com/scholar?cluster=1004067088924655099)
A parameter server is more or less a distributed key-value store optimized for
training machine learning models. For example, imagine we're learning a weight
vector $w = (w_1, w_2, w_3)$ using logistic regression. We can distribute $w$
across two shards of the parameter server where one shard stores $(1, w_1)$ and
the other stores $(2, w_2)$ and $(3, w_3)$. Worker nodes can then read parts of
the weight vector, perform some computation, and write back parts of the weight
vector.

This paper presents an optimized parameter server with the following features:

1. Efficient communication.
2. Flexible consistency models.
3. Elastic scalability.
4. Fault tolerance and durability.
5. Ease of use.

## Machine Learning
Many machine learning algorithms try to find a weight vector $w \in \reals^d$
that minimizes a regularized cost function of the following form:

$$
F(w) = \Omega(w) + \sum_{i=1}^n l(x_i, y_i, w)
$$

When $n$ and $d$ get really big, it becomes intractable to run these algorithms
on a single machine. Instead, we have to parallelize the algorithm across
multiple machines.

As an example, consider how to perform distributed batch gradient descent
across $m$ workers. We initialize $w$ and store it in a parameter server.
Concurrently, each worker begins by reading $\frac{1}{m}$ of the training data.
Then, every worker reads $w$ from the parameter server and computes a gradient
with respect to its local training data (actually, it only needs to read the
relevant parts of $w$). Then, it pushes its gradient to the parameter server.
Once the server receives gradients from every worker, it aggregates them
together and updates $w$. Finally, workers pull the updated $w$ and loop.

## Architecture
A parameter server consists of a bunch of **servers** that store weights and a
bunch of **workers** that perform computations with the weights (e.g. compute
gradients). Servers are organized into a **server group** managed by a **server
manager**. Workers are organized into multiple **worker groups**, and each
worker group is managed by a **task scheduler**. The server manager manages
which data is assigned to which server. The task scheduler assigns tasks to
workers and monitors progress.

Parameters are stores as key-value pairs. For example, a weight vector $w \in
\reals^d$ can be stored as a set of pairs $(i, w_i)$ for $1 \leq 1 \leq d$. To
store sparse vectors more efficiently, only non-zero entries of $w$ must be
explicitly stored. If a pair $(i, w_i)$ is missing, the parameter server
assumes $w_i = 0$.

Most machine learning algorithms do not update individual entries of a weight
vector at a time. Instead, they typically update part of a matrix or part of a
vector. To take advantage of this workload pattern, the parameter server allows
workers to read and write ranges of values instead of single values at a time.
This reduces network overhead.

In addition to pushing and pulling entries of $w$, workers can also register
user-defined functions to run at a server. For example, a server can compute
the gradient of a regularization term.

By default, the parameter server runs tasks asynchronously. That is, if a
worker issues a pull or push request, it does not block. However, the parameter
server also allows workers to explicitly mark dependencies between different
requests which forces them to serialize.

Some algorithms are robust to weir inconsistencies. These algorithms can often
run faster with weaker consistency. The parameter server provides three levels
of consistency:

1. **Sequential consistency** in which every request is totally serialized.
2. **Eventual consistency** in which requests are run whenever they please.
3. **Bounded delay** in which a request is delayed until all tasks that began
   $\tau$ time ago have completed.

Users can also specify that a certain consistency model only apply to a certain
subset of key-value pairs as specified by a filter.

## Implementation
Data is partitioned across servers using consistent hashing, and the server
manager records the assignment of key ranges to machines. When a new server
joins:

1. The server manager assigns a new key range to the server.
2. The server fetches its data from other servers.
3. The server manager broadcasts the update to the other servers who relinquish
   data they no longer own.

The parameter server uses chain replication to replicate data. Each node forms
a chain with the $k$ previous nodes in the hashing ring. Workers send updates
to the master which is chain replicated to the next $k$ servers.

Logically, the parameter server tags each key-value pair with a vector clock
(though honestly, I'm not exactly sure I understand why). Physically, each
range of key-value pairs is associated with a vector clock. This range-based
vector clock avoids storing redundant vector clock information.

Messages sent from workers to servers are compressed with Snappy. Moreover,
servers cache parts of messages, and workers can send a hash instead of a whole
message if they the think a server has it cached.

<script type="text/javascript" async
  src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/MathJax.js?config=TeX-MML-AM_CHTML">
</script>
