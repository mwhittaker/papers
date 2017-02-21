<style>
  table {
    border-collapse: collapse;
  }

  th, td {
    border: 2px solid black;
    min-width: 50px;
    padding: 4pt;
  }
</style>

<p hidden>
$\newcommand{\set}[1]{\left\\{#1\right\\}}$
$\newcommand{\setst}[2]{\left\\{#1 \\,\middle|\\, #2\right\\}}$
$\newcommand{\lam}[2]{\lambda #1.\\>#2}$
$\newcommand{\typedlam}[3]{\lam{#1\in#2}{#3}}$
$\newcommand{\denote}[1]{[ \\! [{#1}] \\! ]}$
$\newcommand{\domain}{\textbf{D}}$
$\newcommand{\relations}{\mathcal{R}}$
$\newcommand{\fields}{\mathcal{U}}$
$\newcommand{\getfield}[2]{t \cdot A}$
$\newcommand{\Tuple}{Tuple}$
$\newcommand{\UTuple}{U\text{-}Tuple}$
$\newcommand{\TupleLoc}{TupleLoc}$
$\newcommand{\FieldLoc}{FieldLoc}$
$\newcommand{\select}[1]{\sigma_{#1}}$
$\newcommand{\project}[1]{\pi_{#1}}$
$\newcommand{\join}{\bowtie}$
$\newcommand{\setdiff}{\backslash}$
</p>

# [Provenance in Databases: Why, How, and Where](https://scholar.google.com/scholar?cluster=14688264622623487965)
## Chapter 1: Introduction
**Data provenance**, also known as **data lineage**, describes the origin and
history of data as it is moved, copied, transformed, and queried in a data
system. In the context of relational databases, provenance will allow us to
point at a tuple (or part of a tuple) in the output of a query and ask why or
how it got there. In this book, we'll study three forms of provenance known as
*why-provenance*, *how-provenance*, and *where-provenance*.

### Lineage
The **lineage** of tuple $t$ in the output of evaluating query $Q$ against
database instance $I$ is a subset of the tuples in $I$ (known as a **witness**)
that are sufficient for $t$ to appear in the output. Lineage is best explained
through an example. Consider the following relations $R$

| id    | A |
| ----- | - |
| $t_1$ | 1 |
| $t_2$ | 2 |

and $S$

| id    | A | B    |
| ----- | - | ---- |
| $t_3$ | 1 | blue |
| $t_4$ | 1 | blue |
| $t_5$ | 1 | red  |
| $t_6$ | 2 | blue |
| $t_7$ | 2 | red  |


and consider the query $Q$:

```
SELECT R.A
FROM   R, S
WHERE  R.A = S.A AND S.B = blue
```

The result of evaluating query $Q$ is:

| id    | A |
| ----- | - |
| $t_8$ | 1 |
| $t_9$ | 2 |

The lineage of $t_8$ is $\set{t_1, t_3, t_4}$, and the lineage of $t_9$ is
$\set{R(t_2), S(t_6)}$. While the lineage of a tuple $t$ is sufficient for $t$
to appear in the output, the lineage is not necessary. For example, the lineage
of $t_8$ does not capture the fact that $t_3$ and $t_4$ do not both have to
appear in the input for $t_8$ to appear in the output. In fact, for a given
output tuple $t$ there could be an exponential number of sufficient (but not
necessary) witnesses for it.

### Why-Provenance
**Why-provenance** is similar to lineage but tries to avoid considering an
exponential number of potential witnesses. Instead, it focuses on a restricted
set of witnesses known as the **witness basis**. For example, the witness basis
of $t_8$ is $\set{\set{t_1, t_3}, \set{t1_, t_4}}$. A **minimal witness
basis** is a witness basis consisting only of minimal witnesses. That is, it
won't include two witnesses $w$ and $w'$ where $w \subseteq w'$. The witness
basis of two equivalent queries might differ, but the two queries are
guaranteed to share the same minimal witness basis.

### How-Provenance
Given an output tuple $t$, why-provenance provides witnesses that prove $t$
should appear in the output. However, why-provenance does not tell us *how* $t$
was formed from a witness. **How-provenance** uses a **provenance semiring** to
hint at how an tuple was derived. The semiring consists of polynomials over
tuple ids. The polynomial $t^2 + t \cdot t'$ hints at two derivations: one
which uses $t$ twice and one which uses $t$ and $t'$.

### Where-Provenance
**Where-provenance** is very similar to why-provenance except that we'll now
point at a particular entry (or **location**) of an output tuple $t$ and ask
which input locations it was copied from. For example, the where-provenance of
the $A$ entry of tuple $t_8$ is the $A$ entry of tuple $t_3$ or $t_4$.

### Eager vs Lazy
There are two main ways to implement data lineage:

1. an **eager** (or **bookkeeping** or **annotating**) approach, and
2. a **lazy** (or **non-annotating**) approach.

In the eager approach, tuples are annotated and their annotations are
propagated through the evaluation of a query. The lineage of an output tuple
can then be directly determined using its annotations. In the lazy approach,
tuples are not annotated. Instead, the lineage of a tuple must be derived by
inspecting the query and input database.

### Notational Preliminaries
- Let $\domain = \set{d_1, \ldots, d_n}$ be a finite domain of data values.
- Let $\fields$ be a collection of **field names** (or **attribute names**)
  where $U, V \subseteq \fields$.
- A **record** (or **tuple**) $t, u$ is a function $U \to \domain$ written
  $(A_1:d_1, \ldots, A_n:d_n)$.
- A tuple whose domain is $U$ is said to be a **$U$-tuple**.
- $\Tuple$ is the set of all tuples and $\UTuple$ is the set of all $U$-tuples.
- We write $\getfield{t}{A}$ as a shorthand for $t(A)$.
- We write $t[U]$ as a shorthand for the restriction of $t$ to $U$:
  $\typedlam{A}{U}{\getfield{t}{A}}$.
- We write $t[A \mapsto B]$ for the renaming of field $A$ to $B$.
- We write $(A: e(A))$ as a shorthand for $\typedlam{A}{U}{e(A)}$.
- A **relation** (or **table**) $r: U$ is a finite set of tuples over $U$.
- $\relations$ is a finite collection of **relation names**.
- A schema $\textbf{R}$ is a function $(R_1:U_1, \ldots, R_n:U_n)$ from
  $\relations$ to $2^{\fields}$.
- A **database** (or **instance**) $I: \textbf{R}$ is a function mapping each
  $R_i:U_i \in \textbf{R}$ to a relation $r_i$ over $U_i$.
- A **tuple location** is a tuple tagged with a relation name and is written
  $(R, t)$. We write $\TupleLoc = \relations \times \Tuple$ for the set of all
  tagged tuples.
- We can view a database $I$ as $\setst{(R, t)}{t \in I(R)} \subseteq \TupleLoc$.
- A **field location** is a triple $(R, t, A)$  which refers to a particular
  field or a particular tuple. We let $\FieldLoc$ be the set of all field
  locations.
- Letting $Y_{\bot} = Y \cup \set{\bot}$, we'll view a partial function $f: X
  \rightharpoonup Y$ as a total function $f: X \to Y_{\bot}$.

Finally, this is the syntax of **monotone relation algebra**:

```
$$
\begin{array}{rrl}
  Q & ::= & R \\
    & |   & \set{t} \\
    & |   & \sigma_{\theta}(Q) \\
    & |   & \pi_{U}(Q) \\
    & |   & Q_1 \bowtie Q_2 \\
    & |   & Q_1 \cup Q_2 \\
    & |   & \rho_{A \mapsto B}(Q) \\
\end{array}
$$
```

This is the semantics:

```
$$
\begin{array}{rrl}
  \denote{R}(I) & = &
    \set{t} \\
  \denote{\set{t}}(I) & = &
    I(R) \\
  \denote{\sigma_{\theta}(Q)}(I) & = &
    \setst{t \in \denote{Q}(I)}{\theta(t)} \\
  \denote{\pi_{U}(Q)}(I) & = &
    \setst{t[U]}{t \in \denote{Q}(I)} \\
  \denote{Q_1 \bowtie Q_2}(I) & = &
    \setst{t}{t[U_1] \in \denote{Q_1}(I), t[U_2] \in \denote{Q_2}(I)} \\
  \denote{Q_1 \cup Q_2}(I) & = &
    \denote{Q_1}(I) \cup \denote{Q_2}(I) \\
  \denote{\rho_{A \mapsto B}(Q)}(I) & = &
    \setst{t[A \mapsto B]}{t \in \denote{Q}(I)} \\
\end{array}
$$
```

Often, we will omit the denotational brackets $\denote{\cdot}$ and abbreviate
$\denote{Q}(I)$ as $Q(I)$. We will also sometimes denote a grouping by columns
$G$ as $\alpha_G(Q)$.

## Chapter 2: Why-Provenance
### Lineage
<p hidden>
$\newcommand{\Rs}{R_1, \ldots, R_n}$
$\newcommand{\Rprimes}{R_1', \ldots, R_n'}$
$\newcommand{\Qs}{Q_1, \ldots, Q_n}$
$\newcommand{\Ss}{S_1, \ldots, S_n}$
$\newcommand{\lineage}{\textsf{Lineage}}$
$\newcommand{\blue}{\text{blue}}$
$\newcommand{\red}{\text{red}}$
</p>

First, we review lineage. Let $Op$ be a relation operator over input relations
$(\Rs)$. The **lineage** of a tuple $t \in Op(\Rs)$ is a subset $(\Rprimes)$ of
$(\Rs)$ such that:

1. $Op(\Rprimes) = \set{t}$;
2. For all $i \in [n]$ and for all $t_i \in R_i'$, $Op(R_1', \ldots, \set{t_i},
   \ldots, R_n') \neq \emptyset$; and
3. $(\Rprimes)$ is maximal among subsets satisfying 1 and 2.

1 ensures the lineage is relevant to $t$, 2 ensures that no irrelevant tuples
are included, and 3 ensures the lineage is "complete". Given the definition of
lineage, we can compute it. Let $\lineage(t, Op(\Rs))$ be the lineage of tuple
$t \in Op(\Rs)$.

```
$$
\begin{align*}
  \lineage(t, \select{\theta}(R))
    &= (\set{t}) \\
  \lineage(t, \project{U}(R))
    &= (\setst{t' \in R}{t'[U] = t}) \\
  \lineage(t, R_1 \join \cdots \join R_n)
    &= \left.(\setst{t_i \in R_i}{t[U_i] = t_i})\right\vert_{i \in [n]} \\
  \lineage(t, R_1 \cup \cdots \cup R_n)
    &= \left.(\setst{t_i \in R_i}{t = t_i})\right\vert_{i \in [n]} \\
  \lineage(t, R_1 \setdiff R_2)
    &= (\set{t}, R_2) \\
  \lineage(t, \alpha_G(R))
    &= (\setst{t' \in R}{t[G] = t'[G]})
\end{align*}
$$
```

Next, consider a query $Op(\Qs)$ run on a database $I$. Let $S_i = Q_i(I)$ and
let $\lineage(t, Op(\Qs), I)$ be the lineage of $t$ in $Op(\Qs)(I)$.

```
$$
\lineage(t, Op(\Qs), I) =
  \bigcup_{S_i(t') \in \lineage(t, Op(\Ss))} \lineage(S_i(t'), S_i)
$$
```

Consider again the relations $R$ and $S$ and the query $Q$ from above. We can
express $Q$ in the relation algebra---$Q = \project{A}(\select{S.B =
\text{blue}}(R \join S))$---and compute the lineage of $t_8$.

```
$$
\begin{align*}
  \lineage(t_8, \project{A}(\select{S.a=\blue}(R(I) \join S(I))))
    &= \set{(1, blue)} \\
  \lineage(\set{(1, blue)}, \select{S.a=\blue}(R(I) \join S(I)))
    &= \set{(1, blue)} \\
  \lineage(\set{(1, blue)}, R(I) \join S(I))
    &= \set{\set{t_1}, \set{t_3, t_4}}
\end{align*}
$$
```

### A Compositional Definition of Lineage

### Why-Provenance

## Chapter 3: How-Provenance
TODO

## Chapter 4: Where-Provenance
TODO

## Chapter 5: Comparing Models of Provenance
TODO

<script type="text/javascript" async
  src="https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-MML-AM_CHTML">
</script>
