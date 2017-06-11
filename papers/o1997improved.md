# [Improved Query Performance with Variant Indexes (1997)](https://scholar.google.com/scholar?cluster=3279297021955127822)
This paper surveys three types of indexes: value-list indexes (old), bit-sliced
indexes (new), and projection indexes (new). It then shows how to compute
aggregates, range predicates, and OLAP queries using these three types of
indexes.

## Value-List Indexes
A **Value-List index** is a B+ tree index. Each leaf of a Value-List index
either stores a list of record ids (RIDs) or a bitmap.

A **bitmap** on a set $T$ of $n$ tuples compactly represents a subset of $T$.
It is implemented as an $M$-length bitstring and a mapping $m: T \to [0, M-1]$.
If $t_i$ is present in the subset, then the $m(t_i)$th bit in the bitstring is
set. Note that $m(t_i)$ does not have to be $i$. Often times, if a tuple $t$ is
the $i$th tuple on page $p$, then $m(t)$ is a number $j$ where the high order
bits of $j$ are $p$ and the low order bits of $j$ are $i$.

The leaf entry for key $k$ in a bitmap Value-List index is a bitmap indicating
which tuples have key $k$. If the index key of the B+ tree has only a few
values, then a bitmap B+ tree can take up less space than an RID B+ tree.

Moreover, bitwise operations over a bitmap can be computed very efficiently.
This comes in handy. For example, imagine we have the query `SELECT * FROM R
WHERE a and b`. If we compute two bitmaps $f_a$ and $f_b$ indicating which
tuples of `R` satisfy `a` and `b`, then we can quickly compute the bitwise AND
of $f_a$ and $f_b$.

Imagine that we can fit 1000 bits on a single page. We can segment the rows of
a table into sets of 1000. This lets us compress RID lists and also avoid some
bitstring operations (see paper for details).

## Projection Indexes
A **projection index** on a column is just that column stored contiguously. For
example, if we had the following table `R(a, b, c)`:

```
+---+---+---+
| a | b | c |
+---+---+---+
| 1 | 2 | 3 |
| 2 | 3 | 4 |
| 3 | 4 | 5 |
| 4 | 5 | 6 |
| 5 | 6 | 7 |
+---+---+---+
```

then a projection index on `b` would be

```
+---+
| b |
+---+
| 2 |
| 3 |
| 4 |
| 5 |
| 6 |
+---+
```

## Bit-Sliced Indexes
Imagine a column of integers that looks something like this:

```
+---+
| 0 |
| 1 |
| 2 |
| 3 |
| 4 |
+---+
```

We can view each integer as a bitstring:

```
+-----+
| 000 |
| 001 |
| 010 |
| 011 |
| 100 |
+-----+
```

A **bit-sliced index** stores a bitstring for every column of bits. For
example, a bit-sliced index on the column above would store `00001` (first
column), `00110` (second column), and `01010` (third column).

## Computing Aggregates with Indexes
Imagine we want to compute the query `SELECT SUM(c) FROM R WHERE p` for some
predicate `p`. Imagine we have already computed a bitmap $f_p$ indicating which
tuples satisfy `p`. Here's how compute the query with the various indexes:

1. **No index.** Without any index, we're forced to read through `R`. Assuming
   that only a fraction of the tuples in `R` satisfy `p`, some pages of `R` end
   up not having any satisfied tuples, so we don't have to read those.
2. **Value-List bitmap index.** We iterate over every key $k$ to retrieve a
   bitamap $f_k$ and compute the bitwise AND of $f_k$ and $f_p$. We compute the
   popcount of this AND, multiply it by $k$, and add it to our running sum.
3. **Projection index.** We iterate through the projection index and add any
   value with a bit set in $f_p$.
4. **Bit-sliced index.** For each column $c_i$, we add $\text{popcount}(i) *
   2^i$ to our sum.

There are other algorithms to compute other aggregate functions as well (see
paper). Here is a summary of the best index for each aggregate:

| Aggregate | Best Index      |
| --------- | --------------- |
| sum       | bit-sliced      |
| count     | no index needed |
| average   | bit-sliced      |
| max/min   | value-list      |
| median    | value-list      |

## Computing Range Predicates with Indexes
Imagine we want to compute the query `SELECT * FROM c > 100 AND p` where for
some arbitrary predicate `p`. Given a bitmap $f_p$ indicating which tuples
satisfy `p`, we want to compute a bitmap $f$ indicating which tuples satisfy
`p` and the range predicate `c > 100`.

1. **Value-List bitmap index.** We OR together every bitmap $b$ for every key
   $k$ that satisfies the range predicate and then AND it with $f_p$.
2. **Projection index.** We iterate through the values indicated by $f_p$ and
   see which satisfy the range predicate.
3. **Bit-sliced index.** We perform some intense bit tricks (see paper).

In summary, Value-List indexes are best for narrow ranges and bit-sliced
indexes are best for wide ranges.

TODO(mwhittaker): Read and summarize the last three sections of this paper.
They are pretty dense and a little boring.

<script type="text/javascript" async
  src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/MathJax.js?config=TeX-MML-AM_CHTML">
</script>
