# [The MADlib Analytics Library or MAD Skills, the SQL (2012)](https://scholar.google.com/scholar?cluster=2154261383124050736)
MADlib is a library of machine learning and statistics functions that
integrates into a relational database. For example, you can store labelled
training data in a relational database and run logistic regression over it like
this:

```sql
SELECT madlib.logregr_train(
  'patients',                           -- source table
  'patients_logregr',                   -- output table
  'second_attack',                      -- labels
  'ARRAY[1, treatment, trait_anxiety]', -- features
  NULL,                                 -- grouping columns
  20,                                   -- max number of iterations
  'irls'                                -- optimizer
);
```

MADlib programming is divided into two conceptual types of programming:
macro-programming and micro-programming.  **Macro-programming** deals with
partitioning matrices across nodes, moving matrix partitions, and operating on
matrices in parallel. **Micro-programming** deals with writing efficient code
which operates on a single chunk of a matrix on one node.

## Macro-Programming
MADlib leverages user-defined aggregates to operate on matrices in parallel. A
user defined-aggregate over a set of type `T` comes in three pieces.

- A **transition function** of type `A -> T -> A` folds over the set.
- A **merge function** of type `A -> A -> A` merges intermediate aggregates.
- A **final function** `A -> B` translates the final aggregate.

Standard user-defined aggregates aren't sufficient to express a lot of machine
learning algorithms. They suffer two main problems:

1. User-defined aggregates cannot easily iterate over the same data multiple
   times. Some solutions involve counted iteration by joining with virtual
   tables, window aggregates, and recursion. MADlib elects to express iteration
   using small bits of Python driver code that stores state between iterations
   in temporary tables.
2. User-defined aggregates are not polymorphic. Each aggregate must explicitly
   declare the type of its input, but some aggregates are pretty generic.
   MADlib uses Python UDFs which generate SQL based on input type.

## Micro-Programming
MADlib user-defined code calls into fast linear algebra libraries (e.g. Eigen)
for dense linear algebra. MADlib implements its own sparse linear algebra
library in C. MADlib also provides a C++ abstraction for writing low-level
linear algebra code. Notably, it translates C++ types into database types and
integrates nicely with libraries like Eigen.

## Examples
Least squares regression can be computed in a single pass of the data. Logistic
regression and k-means clustering require a Python driver to manage multiple
iterations.

## University Research
Wisconsin implemented stochastic gradient descent in MADlib. Berkeley and
Florida implemented some statistic text analytics features including text
feature expansion, approximate string matching, Viterbi inference, and MCMC
inference (though I don't know what any of these are).

<link href='../css/default_highlight.css' rel='stylesheet'>
<script src="../js/highlight.pack.js"></script>
<script>hljs.initHighlightingOnLoad();</script>
