# [Hogwild!: A Lock-Free Approach to Parallelizing Stochastic Gradient Descent (2011)](https://scholar.google.com/scholar?cluster=15767443633562170558)
Hogwild! is a lock-free algorithm that implements stochastic gradient descent
on a multi-core machine. Sparsity is defined formally later, but intuitively if
each step of a stochastic gradient descent only updates a small part of the
weight vector, we say it is sparse. The authors also provide a theoretical
analysis of Hogwild!.

## Sparse Separable Cost Functions
Hogwild! performs stochastic gradient descent on cost functions $f: \reals^n
\to \reals$ of the following form:
<div class="math">
$$
  f(x) = \sum_{e \in E} f_e(x_e)
$$
</div>

where $e \subseteq \set{1, \ldots, n}$ and $x_e$ are the elements of $x$
indexed by $e$. For example, if $e = \set{1, 3, 4}$ and $x = (10, 20, 30, 40,
50)$, then $x_e = (10, 30, 40)$. We say a cost function is **sparse** if $|E|$
and $n$ are large, but $|e|$ is small for all $e$ (formalized more precisely
later).

Are sparse cost functions found in the wild? Yes, consider sparse SVMs as an
example (the paper also presents examples for matrix compression and graph
cuts). We are given a set of labelled data points $E = \set{(z_1, y_1), \ldots,
(z_n, y_n)}$ and want to find the $x$ that minimizes:

$$
  \parens{\sum_{i \in \set{1, \ldots, n}} \max(1 - y_i(x \cdot z_i), 0)} +
  \lambda \twonorm{x}^2
$$

[Wikipedia](https://en.wikipedia.org/wiki/Support_vector_machine#Soft-margin)
has an entry explaining this cost function. We can shove the $\lambda
\twonorm{x}^2$ into the sum like this:

$$
  \sum_{i \in \set{1, \ldots, n}} \parens{
    \max(1 - y_i(x \cdot z_i), 0) +
    \lambda \sum_{j \in e_i} \frac{x_j^2}{d_j}
  }
$$

where $e_i$ is the set of non-zero indexes for $z_i$ and $d_j$ is the number of
$z$s which have a non-zero $j$th entry. For example, imagine 10 $z$s have a
non-zero second entry. All 10 will contribute $\lambda \frac{x_2^2}{10}$ to the
sum. Now, each entry in the outer sum depends only on the non-zero entries of
$z$.

There are a few metrics that we can use to measure the sparsity of a cost
function.

$$
\begin{align}
  \Omega &\defeq
    \max_{e \in E} |e| \\\\
  \Delta &\defeq
    \max_{v \in \set{1, \ldots, n}} \frac{|\setst{e \in E}{v \in e}|}{|E|} \\\\
  \rho &\defeq
    \max_{e \in E} \frac{|\setst{e' \in E}{e \cap e' \neq \emptyset}|}{|E|}
\end{align}
$$

- $\Omega$ is the size of the largest index set $e$.
- $\Delta$ is the largest fraction of index sets $e$ that include a common
  index $v$.
- $\rho$ is the largest fraction of index sets $e'$ that overlap with a given
  index set $e$.

## The Hogwild! Algorithm
The Hogwild! algorithm runs on a multicore machine in which each core has
access to $E$ and $x$ (i.e. the weight vector). We assume that scalar addition
is atomic, but vector addition is not. Here's the whole algorithm:

```
while true:
    sample $e$ uniformally at random from $E$
    read $x_e$ and compute $\nabla_{x_e} f$
    for $v$ in $e$:
        $x_v \gets x_v - \gamma (\nabla_{x_e} f)_v$
```

Let $x_j$ be the value of $x$ after $j$ updates, and let $x_{k(j)}$ be the
value of $x$ that was read to produce $x_j$.

## Fast Rates for Lock-Free Parallelism
Next, we analyze when Hogwild! converges quickly. First, we assume a couple
properties about $f$ (see paper). Second, assume there is a bounded lag $\tau$
between $x_k(j)$ and $x_j$. Using $\tau$, we choose an $\epsilon$ and then
define a step size $\gamma$ in terms of $\epsilon$, $\Omega$, $\Delta$, and
$\rho$. Then, we define a $k$ (again in terms of $\epsilon$, $\Omega$, and
$\rho$). Hogwild! guarantees that after $k$ updates, the expected difference
between $x$ and the true optimal $x$ is bounded by $\epsilon$. See paper for
details (it's complicated).

Moreover, convergence rates can be further increased by periodically decreasing
the step size $\gamma$. This requires periodically synchronizing the cores.

<script type="text/javascript" async
  src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/MathJax.js?config=TeX-MML-AM_CHTML">
</script>
