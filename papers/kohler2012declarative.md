<p hidden>
$\newcommand{\fire}{\textsf{fire}}$
$\newcommand{\next}{\textsf{next}}$
$\newcommand{\rin}{\textsf{in}}$
$\newcommand{\rout}{\textsf{out}}$
</p>

# [Declarative Datalog Debugging for Mere Mortals (2012)](https://scholar.google.com/scholar?cluster=15263235670415505934)
Debugging datalog programs is hard. Given a buggy model $M = P(I)$ of a datalog
program $P$ run on database instance $I$, we might want to know why certain
tuples in $M$ appear that shouldn't. This paper presents a technique to rewrite
$P$ to a modified program $\hat{P}$ which computes a modified model $\hat{M}$
which includes the provenance of every tuple in $M$.

## Overview
The modified model $\hat{M}$ represents a provenance graph $(V, E)$ where a
vertex is a rule instance $r$ or an atom $a$. An edge $r \to a$ indicates that
rule instance $r$ derived atom $a$ (i.e. $a$ is the head of $r$), and an edge
$a \to r$ indicates that $a$ appears in the body of $r$. Well, this isn't quite
true.  The graph also includes the iterations in which a tuple is derived using
a naive evaluation strategy.

The rewrite $P \to \hat{P}$ proceeds in three steps: **rule firings**, **graph
reification**, and **statelog rewriting**. The first two construct the
provenance graph; the third adds the iteration information.

## Rule Firings
First, we must capture every rule firing. We rewrite a rule of the form:

```
\(
\begin{array}{lrcl}
  r: & H(\bar{Y}) &\coleq& B_1(\bar{X_1}), \ldots, B_n(\bar{X_n})
\end{array}
\)
```

into two rules:

```
\(
\begin{array}{lrcl}
  r_{in}:  & \fire_r(\bar{X}) &\coleq& B_1(\bar{X_1}), \ldots, B_n(\bar{X_n}) \\
  r_{out}: & H(\bar{Y}) &\coleq& \fire_r(\bar{X})
\end{array}
\)
```

where $\bar{X} \defeq \cup_i \bar{X_i}$.

## Graph Reification
Next, we use Skolemization to convert $r_{in}$ and $r_{out}$ into concrete
nodes in our provenance graph. For each pair $r_{in}$ and $r_{out}$, we
generate the following $n$ rules for edges into $\fire_r(\bar{X})$.

```
\(
\begin{array}{rcl}
  g(B_i(\bar{X_i}), \rin, \fire_r(\bar{X})) &\coleq& \fire_r(\bar{X})
\end{array}
\)
```

We also generate an edge from $\fire_r(\bar{X})$ to $H(\bar{Y})$:

```
\(
\begin{array}{rcl}
  g(\fire_r(\bar{X}), \rout, H(\bar{Y})) &\coleq& \fire_r(\bar{X})
\end{array}
\)
```

## Statelog Rewriting
Finally, we track the iterations at which a rule is derived under a naive
evaluation scheme. We replace $r_{in}$ and $r_{out}$.

```
\(
\begin{array}{lrcl}
  r_{in}: & \fire_r(S1, \bar{X}) &\coleq&
    B_1(S, \bar{X_1}), \ldots, B_n(S, \bar{X_n}), \next(S, S1) \\
  r_{out}: & H(S, \bar{Y}) &\coleq& \fire_r(S, \bar{X})
\end{array}
\)
```

Every iteration `S` has a successor so long as tuples are produced:

```
\(
\begin{array}{rcl}
  \next(0, 1) &\coleq& \textsf{true} \\
  \next(S, S1) &\coleq& \next(\_, S), \textsf{newAtom}(S, A), S1=S+1 \\
  \textsf{newAtom}(S1, A) &\coleq&
    \next(S, S1), g(S1, \_, \rout, A), \lnot g(S, \_, \rout, A)
\end{array}
\)
```

## Debugging and Profiling
Given a provenance graph $\hat{M} = \hat{P}(I)$, we can perform the following
debugging and profiling tasks.

- We can inspect the provenance graph or the provenance graph stripped of
  iteration information.
- We can look at the subgraph that terminates in some atom $A$ to examine its
  derivations.
- For each atom, we can determine the first iteration at which it is derived.
  Similarly, for each rule, we can determine the first iteration in which it is
  fired.
- We can count the total number of derived facts.
- We can count the total number of rules fired.
- We can compute the number of iterations required to terminate.
- We can compute the number of times a rule is re-derived.
- We can count the number of tuples derived per iteration per relation.

<script type="text/javascript" async
  src="https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-MML-AM_CHTML">
</script>
