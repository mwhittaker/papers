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

## Chapter 2: Why-Provenance
TODO

## Chapter 3: How-Provenance
TODO

## Chapter 4: Where-Provenance
TODO

## Chapter 5: Comparing Models of Provenance
TODO

<script type="text/javascript" async
  src="https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-MML-AM_CHTML">
</script>
