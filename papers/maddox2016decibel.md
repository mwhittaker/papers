## [Decibel: The Relational Dataset Branching System (2016)](TODO) ##
**Summary.**
*Decibel* is like git for relational data.

Often, teams need to simultaneously query, analyze, clean, or curate a
collection of data without clobbering each other's work. Currently, the best
solution available involves each team member making copies of the entire
database. This is undesirable for a number of reasons:

- Data is stored very redundantly, wasting a huge amount of storage.
- It is difficult to share or merge changes made to local snapshots of the
  data.
- There is no systematic way to say which version of the data was used for a
  given experiment.

Version control solves these problems, but existing version control systems
(e.g. git) have a couple of shortcomings when applied naively to large
datasets:

- Using distributed version control systems like git, clients clone an entire
  copy of a repository's contents. This is infeasible when working with large
  datasets.
- Version control systems like git operate on arbitrary data and do not
  understand the structure of relational data. This makes certain operations
  like generic diffing a bad fit.
- Systems like git do not support high-level data management or query APIs.

Decibel manages *datasets* which are collections of relations, and each
relation's schema includes an immutable primary key which is used to track the
version of each row. Beginning with an initial snapshot of a dataset, users can
check out, branch, and commit changes to the data set in a style very similar
to git. When data is merged, non-conflicting changes to separate columns of the
same row are both applied. If conflicting changes to the same column of the
same row occur, one branch's changes take priority. Diffing two tables across
two branches results in a table of insertions and deletions. Finally, data can
be queried across versions using VQuel: a query language which is notably not
SQL.

This paper describes three physical realizations of Decibel's logical data
model.

1. In a *tuple-first* representation, tables contain every version of every
   row, and each row is annotated with a bitmap indicating the set of versions
   in which the row is live. In a *tuple-oriented* approach, each of `N` tuples
   comes with a `B`-bit bitmap for `B` branches. In a *branch-oriented*
   approach, there are `B` `N`-bit bitmaps.
2. In a *version-first* representation, all the changes made to a table in a
   branch are stored together in the same file, and these branched files
   contain pointers to their ancestors forming a directed acyclic graph.
3. In a *hybrid* representation, data is stored similarly to the version-first
   approach, but each of the branched files (called *segments*) includes a
   *segment index*: a bitmap, like in the tuple-first representation, that
   tracks the liveness of each row for all descendent branches. Moreover, there
   is a single *branch-segment bitmap* which for each branch, records the set
   of segments with a tuple live in that branch.

The tuple-first representation is good for multi-version queries, the
version-first representation is good for single-version queries, and the hybrid
approach is good at both.

This paper also presents a versioned database benchmarking framework in the
form of a set of branching strategies and characteristic queries to analyze
Decibel and any future versioned databases.

**Commentary.**
A git-like versioned relational database seems like a great idea! This paper
focuses on how to *implement* and *analyze* such a database efficiently; it
focuses less on the higher-level semantics of data versioning. Notably, two
unanswered questions stuck out to me that seem like interesting areas for
future research.

1. The current merging strategy seems inconvenient, if not inconsistent.
   Imagine a table `R(key, a, b)` with the invariant that `a + b < 10`. Imagine
   branch `b1` updates a tuple `(0, 0, 0)` to `(0, 9, 0)` and branch `b2`
   updates it to `(0, 0, 9)`.  If these tuples are merged, the tuple becomes
   `(0, 9, 9)` violating the invariant. In systems like git, users can manually
   inspect and verify the correctness of the merge, but if a large dataset is
   being merged, this becomes infeasible. I think more research is needed to
   determine if this strategy is good enough and won't cause problems in
   practice. Or if it is insufficient, what merging strategies can be applied
   on large datasets.  Perhaps ideas could be borrowed from CRDT literature; if
   all columns were semilattices, the columns could be merged in a sane way.
2. How useful is diffing when dealing with large datasets? When working with
   git, even a modestly sized diff can become confusing. Would a non-trivial
   diff of a large dataset be incomprehensible?

