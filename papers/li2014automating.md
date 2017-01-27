## [Automating the Choice of Consistency Levels in Replicated Systems (2014)](https://scholar.google.com/scholar?cluster=5894108460168532172&hl=en&as_sdt=0,5)
Geo-replicated data stores that replicate data have to choose between incurring
the performance overheads of implementing strong consistency or the brain
boggling semantics of weak consistency. Some data stores allow users to make
this decision on a fine grained level, allowing some operations to operate with
strong consistency while other operations operate under weak consistency. For
example, [*Making Geo-Replicated Systems Fast as Possible, Consistent when
Necessary*](https://scholar.google.com/scholar?cluster=4316742817395056095&hl=en&as_sdt=0,5)
introduced RedBlue consistency in which users annotate operations as red
(strong) or blue (weak). Typically, the process of choosing the consistency
level for each operation has been a manual task. This paper builds off of
RedBlue consistency and automates the process of labeling operations as red or
blue.

**Overview.**
When using RedBlue consistency, users can decompose operations into generator
operations and shadow operations to improve commutativity. This paper automates
this process by converting Java applications that write state to a relational
database to issue operations against CRDTs. Moreover, it uses a combination of
static analysis and runtime checks to ensure that operations are invariant
confluent.

**Generating Shadow Operations.**
Relations are just sets of tuples, so we can model them as CRDT sets. Moreover,
we can model individual fields as CRDTs. This paper presents field CRDTs
(PN-Counters, LWW-registers) and set CRDTs to model relations. Users then
annotate SQL create statements indicating which CRDT to use.

Using a custom JDBC driver, user operations can be converted into a
corresponding shadow operation that issues CRDT operations.

**Classification of Shadow Operations.**
We want to find the database states and transaction arguments that guarantee
invariant-confluence. This can be a very difficult (probably undecidable)
problem in general. Instead, we simplify the problem by considering the
possible trace of CRDT operations through a program. Even with this simplifying
assumption, tracing execution through loops can be challenging. We can again
simplify things by only considering loop where each iteration is independent of
one another.

We model each program as a regular expression over statements. We then unroll
the regular expression to get the set of all execution traces. Using these
traces we can construct a map from traces, or templates, to weakest
preconditions that ensure invariant confluence.

At runtime, we need only look up the weakest precondition given an execution
trace and check that it is true.

**Implementation.**
The system is implemented as 15K lines of Java and 533 lines of OCaml. It
builds off of MySQL, an existing Java parser, and Gemini.

