# [Dataguides: Enabling Query Formulation and Optimization in Semistructured Databases (1997)](https://scholar.google.com/scholar?cluster=1701940952301007499)
Database schemata serve two purposes: (1) they allows users to understand the
structure of the data and form meaningful queries over it, and (2) they allow
the query optimizer to generate efficient query plans. Unfortunately,
semistructured databases do not have clean schemata, so it becomes harder to
accomplish (1) and (2). This paper presents **DataGuides**: a pseudo-schema
data structure for semistructured graph databases. DataGuides are implemented
in the Lore DBMS.

## Object Exchange Model
DataGuides are designed to work with the **object exchange model** (OEM) which
we now describe. In the OEM, data is represented as a directed possible cyclic
graph with a designated root such that:

- Each vertex is an **object** with an **object id**. Every object either
  contains an atomic value like an int or contains edges to other objects.
- Each edge is annotated with a string-valued **label**.
- A **label path** $l$ is a sequence of labels $l_1.l_2.\ldots.l_n$.
- A **data path** $d$ is a sequence of labels and objects
  $l_1.x_1.\ldots.l_n.x_n$.
- A data path $d$ is an **instance of** label path $l$ of the labels in $d$
  correspond to the labels in $l$.
- The **target set** $t = T_s(l)$ of label $l$ in object $s$ is the set of
  object ids reachable by path $l$.

The object exchange model, unlike the relational model, is semistructured. Not
all objects have the same set of outgoing labels. In fact, the set of labels is
not even predetermined.

One such query language for the OEM is Lore's query language called Lorel.
Here's an example Lorel query:

```
SELECT Restarurant.Name
WHERE Restarurant.Entree = 'Burger';
```

## DataGuides
A DataGuide $d$ for OEM object $s$ is an OEM object such that

- every label path of $s$ has exactly one data path in $d$, and
- every label path of $d$ is a label path of $s$.

A DataGuide $d$ makes it easy to answer questions about the source object $s$
that would otherwise be computationally hard to answer. For example, consider
the question "Does $s$ have any object reachable by label path $l =
l_1.\ldots.l_n$?". Without a data guide, we would first have to follow every
$l_1$ edge in $s$, then every $l_2$ edge, and so on. With a DataGuide, we are
guaranteed that $d$ has exactly one label path $l$ if and only if $s$ has label
path $l$. Thus, we can quickly check to see if $s$ has the label path $l$ by
checking if $d$ has label path $l$ which takes time linear in the length of
$l$.

Also note that if we view an OEM object $s$ as nondeterministic finite state
automaton, we can view a DataGuide $d$ as a determinization of $s$. This
intuition is very important, and will come up many times.

## Existence of Multiple DataGuides
There may exist multiple DataGuides for the same object $s$ (similar to how
there are multiple determinizations of an NFA), so there is a question of which
to construct. There always exists a minimal DataGuide (as there always exists a
minimal DFA), and it seems logical to prefer a minimal DataGuide, however, this
is not the case. A minimal DataGuide is a bad choice for a couple of reasons.
For example, a minimal DataGuide can be much harder to maintain than larger
DataGuides. The next section presents another compelling reason why minimal
DataGuides are not preferred.

## Annotations
Vanilla DataGuides do not contain any atomic data. However, it is useful to put
some data into the DataGuide to describe the source object. For example, a
DataGuide could contain example objects from the source object, or it could
contain statistics about the distribution of source objects. Formally, we say
an *annotation* of $l$ is some property of a target set $T_s(l)$.

Let's say we want to store annotations in a DataGuide. Where do we put them? A
natural place is to put them at the single object $x$ reachable by $l$.
However, $x$ may be reachable from multiple labels which have different target
sets. Thus, it would be ambiguous which target set corresponds to a given
annotation. Minimal DataGuides experience this annotation ambiguity, but strong
DataGuides, which we define next, do not.

## Strong Data Guides
Say two labels $l$ and $l'$ are equivalent if they have the same target set.
Let $L_s(l) = \setst{l'}{T_s(l') = T_s(l)}$ be the equivalence class of $l$. A
**strong DataGuide** of $s$ is a DataGuide $d$ such that

- for every label path $l$ in $s$, $L_s(l) = L_d(l)$.

In other words, two label paths in $d$ lead to the same object if and only if
the label paths share the same target set in $s$. Put another way, there exists
a bijection between the target sets of $s$ and the vertices in $d$.

Drawing on our automata intuition, it is pretty easy to build a strong
DataGuide. We simply perform a naive determinization (see [Automata and
Computability](http://dl.acm.org/citation.cfm?id=549365) for more information).
The one small difference is that we maintain the DataGuide graph as we build up
the tabular DFA.

## Incremental Maintenance
Now we describe how to update a strong DataGuide after the source object has
been modified. First, we represent the set of changes as triplets of the form
$u.l.v$ where the label $l$ from node $u$ to $v$ was either added or deleted.
We call $u$ the update point. We maintain a couple of data structures. First,
we maintain a bijection between target sets and the nodes in the strong
DataGuide. Second, we maintain a map from every source object to the set of all
target sets it is included in. The update algorithm essentially re-runs the
determinization algorithm on the affected subgraphs. For each update point $u$,
we find all affected target sets $t$ and re-run the determinization rooted at
$t$.

## Query Formulation
Lore provides an online web UI to interactively expand and collapse a
DataGuide. Users can view the number of source objects at each DataGuide object
and see examples. They can also write simple filters (conjunctions of
comparisons to constants) in the UI which are translated to Lorel queries.

## Query Optimization
A DataGuide acts as an index from a label path to a target set. It prevents a
query plan from crawling the entire source object. Moreover, Lore maintains
**Vindex maps** which map from a label, operator, value triples (e.g. $(Name,
=, foo)$) to a set of object ids. The object ids read from a Vindex map can
be intersected with the ones read from a strong DataGuide to further speed up
queries.

<script type="text/javascript" async
  src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/MathJax.js?config=TeX-MML-AM_CHTML">
</script>

