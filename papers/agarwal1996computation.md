# [On the Computation of Multidimensional Aggregates (1996)](https://scholar.google.com/scholar?cluster=8624620981335983298)
Data analysts who interact with OLAP databases issue a lot of GROUP BY queries
over huge amounts of data. These aggregates are often too big to compute
interactively, so data analysts to resort to computing them ahead of time.

Analysts can do so using the CUBE operator which builds a family of aggregates
all at once. Given a set of grouping columns and a set of aggregates, the CUBE
operator performs a GROUP BY on all subsets of the grouping columns. For
example, the following query:

```
CUBE Product, Year, Customer
BY SUM(Sales)
```

will compute the sum of sales for all eight subsets of `Product`, `Year`, and
`Customer`. Each of these eight GROUP BYs is called a **cuboid**. The GROUP BY
on all eight attributes is called the **base cuboid**. This paper presents a
heuristic-based algorithm to efficiently compute a cube. It also proves that
finding an optimal cube is NP-hard.

## Options for Computing the CUBE
Throughout this paper we assume that aggregate functions $F$ are homomorphic.
That is given two sets of tuples $X$ and $Y$, $F(X \cup Y)$ = $F(X) \oplus
F(Y)$. For example, sum is homomorphic, but median is not.

There are three methods to computing cuboids:

1. **Independent Method.** We can compute the base cuboid and then
   independently compute every other cuboid from the base cuboid.
2. **Parent Method.** We can compute a cuboid on attributes $X$ from a cuboid
   with attributes $Y \supset X$. Also, the smaller $Y$, the more likely it
   is that cuboid $Y$ is small, so we typically compute a cuboid on $X$ from a
   cuboid on $Y$ where $|Y| = |X| + 1$. The parent method independently
   computes every cuboid from one of its parent cuboids.
3. **Overlap Method.** The overlap method performs the parent method but
   computes multiple cuboids at once during a single pass of a parent cuboid.

This paper only discusses how to compute cuboids using sorting. Sorting is
desirable because a cuboid derived from a sorted cuboid parent is itself
sorted. Hash based methods exist too but are not discussed here.

## The Overlap Method
First, a bit of terminology. Consider cuboid $S = (A_1, \ldots, A_{l-1},
A_{l+1}, \ldots, A_j)$ computed from $B = (A_1, \ldots, A_j)$.

- A **sorted run** $R$ of $S$ in $B$ is a maximal subsequence of tuples in $B$
  that share the same $l$ attributes and then have the $l$th attribute
  projected away. See paper for example.
- A **partition** of the cuboid $S$ in $B$ is a maximal subsequence of tuples
  in $B$ that share the same $l-1$ attributes and then have the $l$th attribute
  projected away. Note that we can generate a partition from a set of sorted
  runs that share the same first $l - 1$ attributes. See paper for example.

Note that cuboids are formed as a union of disjoint partitions, and cuboids are
totally ordered.

### Overview
The overlap method computes and sorts the base cuboid. It then derives every
other cuboid using a parent. If a cuboid's partitions fit in memory, we can
create the cuboid in a single pass partition by partition. For example,
consider the following parent cuboid $(A, B, C)$ from which we want to compute
cuboid $(A, C)$.

<center>
| A | B | C |
| - | - | - |
| 1 | 1 | 3 |
| 1 | 1 | 4 |
| 1 | 2 | 1 |
| 1 | 2 | 2 |
| 2 | 3 | 9 |
| 2 | 3 | 4 |
</center>

We scan the first partition $(1, 3)$, $(1, 4)$, $(1, 1)$, $(1, 2)$ and sort it
to get $(1, 1)$, $(1, 2)$, $(1, 3)$, and $(1, 4)$. We than scan and sort the
second partition and so on.

### Choosing a Parent to Compute a Cuboid
Every cuboid (except the base cuboid) has multiple parents to choose from.
Ideally, we pick the parent cuboid which yields the fewest partitions. For
example, $(A, C, D)$ is a much better parent than $(A, B, C)$ to build the
cuboid $(A, C)$. As a heuristic, we choose the parent whose stripped attribute
is furthest right.

### Computing a Cuboid From its Parent
As mentioned above, if the largest partition of a cuboid fits in memory, then
we can compute a cuboid in a single pass partition by partition. We build up a
sorted partition and update aggregates along the way. Once a partition is
built, we can immediately emit it for our children.

If a cuboid's permissions do not fit in memory, then we instead use a single
buffer page to write sorted runs to disk. Later, we merge all sorted runs
together using external sort.

### Choosing a Set of Cuboids for Overlapped Computation
Given a fixed amount of memory, we have to decide which cuboids to compute on a
given pass and whether to compute them with partitions or sorted runs. Finding
an optimal scheduling is NP-hard (see next) section. As a heuristic, we can
perform a breadth first search on the parent tree going from left to right.

## Finding an Optimal Allocation Strategy is NP-Hard
The paper performs a reduction from the knapsack problem to a version of the
knapsack problem with $2^m$ objects for some $m$. They then reduce this version
of the knapsack to the problem of finding an optimal scheduling for cuboid
computation. See paper for details; it's complicated.

## Some Important Issues
- In order to limit the number of sorted runs written to disk, we can append
  sorted runs from later partitions on to the sorted runs from previous
  partitions. This way, the number of runs that need to be merged is bounded by
  the maximum number of sorted runs in any partition.
- The initial sort order affects the cost of computing cuboids. Cuboids on the
  left can typically be partitioned easily while those on the right have much
  bigger partitions. Thus, we try to make the right cuboids the smallest
  cuboids. We can also sort attributes in decreasing order of distinct values
  to minimize the number of sorted runs produced.

<script type="text/javascript" async
  src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/MathJax.js?config=TeX-MML-AM_CHTML">
</script>
