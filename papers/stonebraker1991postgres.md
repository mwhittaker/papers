## [The POSTGRES Next Generation Database Management System (1991)](https://scholar.google.com/scholar?cluster=6521586065605065941&hl=en&as_sdt=0,5)
POSTGRES is a relational database which supports features along three
dimensions:

1. *Data management.* Like all relational databases, POSTGRES processes
   transactions and queries.
2. *Object management.* POSTGRES can efficiently store and manipulate
   non-traditional data types like bitmaps, text, and polygons.
3. *Knowledge management.* POSTGRES provides rules to specify integrity
   constraints and derived data.

**POSTGRES Data Model and Query Language.**
Traditional databases support a very basic set of types: float, int, char,
string, money, date, etc. POSTGRES includes a richer data model. The design of
the data model and query language was governed by three principles:

1. *Orientation towards database access from a query language.* Most people
   will access POSTGRES using a set-oriented, SQL-like query language called
   POSTQUEL. POSTGRES also supports a navigational interface where tuples can
   be navigated using their unique OID. POSTGRES also supports user defined
   functions which include statements, queries, and direct calls into POSTGRES
   internal interfaces. These functions can be called from within POSTQUEL or
   run directly by a program. The ability for programs to call directly into
   POSTGRES internals is known as the *fast path*.
2. *Orientation towards multilingual access.* POSTGRES could have tightly
   integrated into a specific programming language. For example, certain
   variables in a program could be persisted into the database, or perhaps
   queries could be embedded in the control flow of the program. However, the
   authors believe that databases are accessed by multiple programming
   languages. Still, one can still integrate a programming language with
   POSTGRES easily using the fast path.
3. *Small number of concepts.* The POSTGRES data model and query language was
   designed to be simple. They revolve around four basic concepts: classes,
   inheritance, types, and functions.

**POSTGRES Data Model.**
A POSTGRES database is a collection of *classes*. Each class is a collection of
*instances*. Each instance is a collection of named, typed *attributes*. Each
instance is assigned a unique OID. Classes can inherit from other classes, and
multiple inheritance is allowed so long as no ambiguities arise.

| Relational Data Model | POSTGRES Data Model |
| --------------------- | ------------------- |
| relation              | class               |
| tuple                 | instance            |
| field                 | attribute           |

There are three types of *classes*, three types of *types*, and three types of
*functions*. First, the classes:

1. *Real (base) classes* are standard classes which are stored by the database.
2. *Derived (virtual, view) classes* are classes which are derived from other
   classes in the database. These are essentially views.
3. *Versions.* A version is a branched copy of a parent class which is stored
   as a set of diffs from the parent.

Next, the types:

1. *Base types* are the standard set of simple types like float, int, char,
   etc. POSTGRES also allows programmers to define their own base types defined
   by functions which serialize instances of the type to and from character
   strings.
2. *Array types* are arrays of other types.
3. *Composite types* are like records. Instances can hold other instances. For
   example, an employee instance can include an employee field. Moreover,
   POSTGRES supports a `set` type which is a heterogeneously typed set; that
   is, its a set of things where each thing can be of any type.

Finally, the functions:

1. *C Functions.* Users can write arbitrary C functions which operate over base
   and composite types. These functions cannot be optimized by POSTGRES.
2. *Operators.* Operators are like unary or binary functions with optimizer
   hints. For example, a user could provide an "area greater than" operator
   `AGT` to compare the area of two polygons and tell the optimizer that its
   complement is the `ALT` operator. Moreover, programmers can write their own
   custom access methods to efficiently implement operators. For example,
   programmers could implement a special indexing data structure to efficiently
   support polygon overlap queries.
3. *POSTQUEL functions.* POSTQUEL functions wrap up a sequence of POSTQUEL
   queries.

**POSTGRES Query Language.**
POSTQUEL is a superset of a relational query language which supports nested
queries, transitive closures, inheritance, and time travel. Nested queries are
self-explanatory. Transitive closures are like recursive SQL queries.
Inheritance support means that POSTQUEL can query either a class or the class
and all subclasses. Time travel is a fancy term for historical queries.

**Fast Path.**
There are two reasons to include a fast path:

1. Some applications use their own query language. For these applications, they
   construct a query AST and it is difficult to convert the AST to a textual
   query. It is easier to directly call into the POSTGRES internals to execute
   the query.
2. Integrating POSTGRES into programming language sometimes requires some
   low-level tricks. For example, the authors integrated POSTGRES into Lisp
   which required them to reserve sets of OIDs: something which could only be
   done using the fast path.

Note that the fast path is essentially an RPC mechanism.

**POSTGRES Rules.**
POSTGRES wanted *one* rule system which supported *all* of view management,
triggers, integrity constraints, referential integrity, protection, and version
control. POSTGRES rules take the form "if some event happens which satisfies
some properties, then run some sequence of commands."

For example, imagine we want to maintain an invariant that Joe's salary and
Fred's salary are th same.  We can install a rule which updates Joe's salary
whenever Fred's salary is updated. Note that when the body of the rule is
executed, it may trigger other rules to fire. This is known as *forward
chaining*.

Alternatively, imagine we install a rule which rewrites reads of Joe's salary
to reads of Fred's salary. In this case, reading a piece of data may trigger
other rules to generate the read. This is known as *backwards chaining*.

**Implementaton of Rules**
There are two implementations of POSTGRES rules: a record-level implementation
and a query rewrite implementation.

1. *Record-level implementation.* In this implementation, instances or instance
   fields are annotated with markers which point to the rules which must be
   evaluated when the instance or instance field change. For example, Fred's
   salary may be annotated with a marker which points to the rule to update
   Joe's salary. When the query evaluator encounters one of these markers, it
   executes it. Care must be taken to avoid certain corner cases. For example,
   if Fred changes his name, then the marker should be removed.
2. *Query rewrite implementation.* Sometimes, a bulk query would cause a lot of
   individual markers to be executed again and again. These types of queries
   can more efficiently be implemented using a query rewrite mechanism in which
   all the rules are fired at once.

**Rules Semantics.**
The record-level and query rewrite rule implementations provide different
semantics. Moreover, there are other semantic choices to make. Should rules be
run immediately or should their execution be deferred? Should the rule be run
in the same transactions which caused it or in a separate transaction. All
combinations of these choices can be useful. POSTGRES currently only implements
one.

**Rules System Applications.**
Rules can be used to manage *views* and *versions*.

- *Views*. View creation statements are compiled to set of rules which define
  the view. For example, queries against the view can be rewritten as queries
  against the base tables over which the view is defined. By default, views can
  be updated only when doing so is unambiguous. However, POSTGRES allows
  programmers to write custom rules to allow for more complex updates.
- *Versions*. A version of a base table is like a branched copy of the table.
  The version can be updated without affecting the base table. Versions can be
  implemented trivially by copying the base table, but they can be implemented
  more efficiently using diffs. When a user creates a version, POSTGRES creates
  a positive and negative delta table and uses rules to maintain them.

**Storage System.**
POSTGRES uses a no-overwrite storage system. This storage system makes crash
recovery practically instantaneous and allows for historical, time travelling
queries. The implementation of the no-overwrite storage engine requires that
when a transaction commits, all of the pages it modified be written to disk.
Thus, an efficient implementation of the no-overwrite storage engine depends on
something like non-volatile memory.

**POSTGRES implementation.**
POSTGRES has four notable implementation details:

1. POSTGRES uses a process per user. This was done because it was simple.
2. The parser, optimizer, and execution engine are table driven and read
   configuration from the catalog. This makes the database extendable.
3. Types, operators, and functions can be loaded dynamically.
4. The rule system implementations are novel.
