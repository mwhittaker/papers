# [Implementing Data Cubes Efficiently (1996)](https://scholar.google.com/scholar?cluster=9112921129698038148&hl=en&as_sdt=0,5)
Pre-materialized datacubes allow analysts to more quickly execute
aggregate-heavy OLAP queries. However, there is a trade-off between the space
used to materialize the cube and the time the cube saves. On one extreme, we
can materialize the entire cube and speed up every query. On the other extreme,
we can materialize none of the cube and run all queries from scratch. This
paper presents an algorithm which selects an optimal amount of the cube to
pre-materialize.

## The Datacube
Imagine performing a GROUP BY on a set of attributes $A$, $B$, and $C$. We can
imagine the result of the GROUP BY as a three-dimensional cube in which one
axis is the domain of $A$, the next axis is the domain of $B$, and the final
axis is the domain of $C$. Each entry of the cube contains the aggregated
value. For example, consider the following two-dimensional cube on $A$ (left
axis)and $B$ (top axis):

<center>
|       | 0 | 1 | 2 | 3 |
| ----- | - | - | - | - |
| **0** | 2 | 3 | 5 | 1 |
| **1** | 1 | 4 | 9 | 1 |
| **2** | 9 | 0 | 1 | 2 |
</center>

We can also introduce a new value `ALL` into each domain which grows the cube
to include aggregates along other dimensions. For example, imagine adding an
`ALL` value to $A$:

<center>
|         | 0  | 1 | 2  | 3 |
| ------- | -- | - | -- | - |
| **0**   | 2  | 3 | 5  | 1 |
| **1**   | 1  | 4 | 9  | 1 |
| **2**   | 9  | 0 | 1  | 2 |
| **ALL** | 12 | 7 | 15 | 4 |
</center>

The cube (without `ALL`) corresponds to a GROUP BY on all attributes. Every
face of the cube (view, query, cuboid) corresponds to a GROUP BY on some subset
of the attributes.

## The Lattice Framework
Consider the lattice of cuboids where $a \leq b$ if $a$ can be derived from
$b$. Cuboid $X$ is less than cuboid $Y$ whenever $X \subset Y$. Moreover,
assume that each attribute forms a hierarchy. For example, a time attribute can
be divided into days, weeks, and years. These hierarchies are used for
drill-downs and roll-ups. They also impose a lattice (e.g. $year \leq month
\leq day$). We assume each attribute has some hierarchy and model a query as a
product lattice of all hierarchy lattices.

## Cost Model
To answer query $Q$, we need a materialized query $Q_A$ where $Q \leq Q_A$. We
assume that there are no indexes on the cuboids, so the time to query any
cuboid takes time proportional to $|Q_A|$. If we had indexes, we could speed up
point queries, but we ignore that. Also note that query size can be estimated
(e.g. by sampling).

## Optimizing Datacube Lattices
We want to find an optimal point in the time-space tradeoff of materializing
parts of a datacube, but what is optimal? Here, we consider a simple problem
and later relax the assumptions. We want to minimize the time taken to run all
queries subject to a fixed number of materialized views.

This problem is NP-hard, but we can propose a greedy approximation. Let each
view $v$ have a cost $C(v)$ which is the number of tuples in $v$. First, let's
define the benefit $B(v, S)$ of view $s$ given existing materialized views $S$.
For every $w \leq v$, let $u$ be the lowest cost view in $S$ such that $w \leq
u$. If $C(u) > C(v)$, let $B_w = C(u) - C(v)$. Otherwise, let $B_w = 0$. $B(v,
S) = \sum_{w \leq v} B_w$. Given a limit of $k$ materialized views, the greedy
algorithm incrementally picks the $k$ with maximum benefit.

A proof is deferred to another paper, but the benefit of the greedy approach
compared to the benefit of the optimal approach is tightly lower bounded by $1
- \frac{1}{e}$. Some theory shows that this bound is as good as it gets unless
P = NP.

We can relax our assumptions a bit in two ways. First, we can assume that some
views are run more than others. To accommodate this, we weight benefit by the
likelihood of view $w$. Second, we can assume a fixed space rather than a fixed
number of views by measuring benefit in terms of benefit per space instead of
overall benefit. Given some slight caveats, all bounds still apply.

## Hypercube Lattice
Forget about the hierarchies and consider the produced hypercube lattices.
Assume each attribute has the same domain with size $r$ and assume the top
lattice has $m$ values. A cuboid with $i$ attributes has approximately $r^i$
possible entries. If $r^i > m$, then it only really has $m$ entries. Otherwise
it has $m$. If $r^i > m$, then there is no reason to materialize the view. The
paper describes the space and time for various parameters of $r$ and $m$.

<script type="text/javascript" async
  src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/MathJax.js?config=TeX-MML-AM_CHTML">
</script>
