## [Generalized Isolation Level Definitions (2000)](TODO) ##
**Summary.**
In addition to serializability, ANSI SQL-92 defined a set of weaker isolation
levels that applications could use to improve performance at the cost of
consistency. The definitions were implementation-independent but ambiguous.
Berenson et al. proposed a revision of the isolation level definitions that was
unambiguous but specific to locking. Specifically, they define a set of
*phenomena*:

- P0: `w1(x) ... w2(x) ...`      *"dirty write"*
- P1: `w1(x) ... r2(x) ...`      *"dirty read"*
- P2: `r1(x) ... w2(x) ...`      *"unrepeatable read"*
- P3: `r1(P) ... w2(y in P) ...` *"phantom read"*

and define the isolation levels according to which phenomena they preclude.
This preclusion can be implemented by varying how long certain types of locks
are held:

| write locks | read locks | phantom locks | precluded      |
| ----------- | ---------- | ------------- | -------------- |
| short       | short      | short         | P0             |
| long        | short      | short         | P0, P1         |
| long        | long       | short         | P0, P1, P2     |
| long        | long       | long          | P0, P1, P2, P3 |

This locking-specific *preventative* approach to defining isolation levels,
while unambiguous, rules out many non-locking implementations of concurrency
control. Notably, it does not allow for multiversioning and does not allow
non-committed transactions to experience weaker consistency than committed
transactions. Moreover, many isolation levels are naturally expressed as
invariants between multiple objects, but these definitions are all over a
single object.

This paper introduces implementation-independent unambiguous isolation level
definitions. The definitions also include notions of predicates at all levels.
It does so by first introducing the definition of a *history* as a partial
order of read/write/commit/abort events and total order of commited object
versions.  It then introduces three dependencies: *read-dependencies*,
*anti-dependencies*, and *write-dependencies* (also known as write-read,
read-write, and write-write dependencies). Next, it describes how to construct
dependency graph and defines isolation levels as constraints on these graphs.

For example, the G0 phenomenon says that a dependency graph contains a
write-dependency cycle. PL-1 is the isolation level that precludes G0.
Similarly, the G1 phenomenon says that either

1. a committed transaction reads an aborted value,
2. a committed transaction reads an intermediate value, or
3. there is a write-read/write-write cycle.

The PL-2 isolation level precludes G1 (and therefore G0) and corresponds
roughly to the READ-COMMITTED isolation level.
