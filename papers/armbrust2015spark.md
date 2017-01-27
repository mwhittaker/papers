## [Spark SQL: Relational Data Processing in Spark (2015)](https://scholar.google.com/scholar?cluster=12543149035101013955&hl=en&as_sdt=0,5)
**Summary.**
Data processing frameworks like MapReduce and Spark can do things that
relational databases can't do very easily. For example, they can operate over
semi-structured or unstructured data, and they can perform advanced analytics.
On the other hand, Spark's API allows user to run arbitrary code (e.g.
`rdd.map(some_arbitrary_function)`) which prevents Spark from performing
certain optimizations. Spark SQL marries imperative Spark-like data processing
with declarative SQL-like data processing into a single unified interface.

Spark's main abstraction was an RDD. Spark SQL's main abstraction is a
*DataFrame*: the Spark analog of a table which supports a nested data model of
standard SQL types as well as structs, arrays, maps, unions, and user defined
types. DataFrames can be manipulated as if they were RDDs of row objects (e.g.
`dataframe.map(row_func)`), but they also support a set of standard relational
operators which take ASTs, built using a DSL, as arguments. For example, the
code `users.where(users("age") < 40)` constructs an AST from `users("age") <
40` as an argument to filter the `users` DataFrame. By passing in ASTs as
arguments rather than arbitrary user code, Spark is able to perform
optimizations it previously could not do. DataFrames can also be queries using
SQL.

Notably, integrating queries into an existing programming language (e.g. Scala)
makes writing queries much easier. Intermediate subqueries can be reused,
queries can be constructed using standard control flow, etc. Moreover, Spark
eagerly typechecks queries even though their execution is lazy. Furthermore,
Spark SQL allows users to create DataFrames of language objects (e.g. Scala
objects), and UDFs are just normal Scala functions.

DataFrame queries are optimized and manipulated by a new extensible query
optimizer called *Catalyst*. The query optimizer manipulates ASTs written in
Scala using *rules*, which are just functions from trees to trees that
typically use pattern matching. Queries are optimized in four phases:

1. *Analysis.* First, relations and columns are resolved, queries are
   typechecked, etc.
2. *Logical optimization.* Typical logical optimizations like constant folding,
   filter pushdown, boolean expression simplification, etc are performed.
3. *Physical planning.* Cost based optimization is performed.
4. *Code generation.* Scala quasiquoting is used for code generation.

Catalyst also makes it easy for people to add new data sources and user defined
types.

Spark SQL also supports schema inference, ML integration, and query federation:
useful features for big data.

