## [A Critique of ANSI SQL Isolation Levels (1995)](https://scholar.google.com/scholar?cluster=2396911751922252868&hl=en&as_sdt=0,5)
**Overview**
The ANSI SQL standard defines Dirty Read, Non-repeatable Read, and Phantom
anomalies. Unfortunately, these definitions are written in English and are a
bit ambiguous. Each definition can be formalized in one of two ways. Dirty
Reads can be characterized by P1 or A1, Non-repeatable Reads by P2 or A2, and
Phantom by P3 or A3. Using these ambiguous definitions, the ANSI standard
defines a set of isolation levels tabularized below.

Alternatively, we can define an isolation level as the set of histories allowed
by a particular lock-based concurrency control mechanism. This is also
tabularized below.

**What's Wrong With ANSI?**
There are a couple things weird about the ANSI definitions besides their
ambiguity. First, they do not prohibit P0: Dirty Writes. Dirty writes can
violate constraints between objects (e.g. `w1[x] w2[x] w2[y] w1[y]`) and also
makes recovery challenging (e.g. `w1[x] w2[x] a1`).

Second, prohibiting A1, A2, and A3 does not provide serializability. That is,
ANOMALY SERIALIZABLE is not SERIALIZABLE. Each of A1, A2, and A3 should be
replaced with P1, P2, and P3. Failure to do so leads to different anomalous
histories: H1, H2, and H3, each of which exploits constraints between multiple
objects.

There is also a natural correspondence between the lock-based concurrency
control mechanisms and the P1, P2, P3 phenomena.

**What's New?**
We can also introduce more isolation levels. *Cursor Stability* is designed to
avoid the lost update phenomenon (P4, P4C) and falls between READ COMMITTED and
REPEATABLE READ. In Cursor Stability, read locks are held on an object until
the cursor pointing at the object advances to the next object. Note that these
read locks are still not long, but they're longer than short.

In *Snapshot Isolation*, each transaction is assigned a begin timestamp when it
first begins executing. Subsequent reads read from the database at this
timestamp. When the transaction commits, it is given a commit timestamp. If the
transaction's write set doesn't overlap with any other transactions that have
committed in [begin timestamp, commit timestamp], then the transaction commits.
Snapshot Isolation prevents A5A but not A5B. It is stronger than READ
COMMITTED, incomparable to REPEATABLE READ, and weaker than SERIALIZABLE.

**Hasse Diagrams**
Let `NSS(L)` be the set of all non-serializable histories satisfying isolation
level `L`. We can define a partial order on isolation levels by ordering their
non-serializable histories by subset. For example, `L1 <= L2` if `NSS(L1)
\subseteq NSS(L2)`. Using this partial order, we can draw the Hasse diagram
below.

**Tables and Figures**

| Code | Name                         | History                              |
| ---- | ---------------------------- | ------------------------------------ |
| P0   | Dirty Write                  | `w1[x] w2[x] {c1/a1}x{c2/a2}`        |
| P1   | Dirty Read                   | `w1[x] r2[x] {c1/a1}x{c2/a2}`        |
| P2   | Non-repeatable or Fuzzy Read | `r1[x] w2[x] {c1/a1}x{c2/a2}`        |
| P3   | Phantom                      | `r1[P] w2[y in P] {c1/a1}x{c2/a2}`   |
| P4   | Lost Update                  | `r1[x] w2[x] w1[x] c1`               |
| P4C  | Cursor Lost Update           | `rc1[x] w2[x] w1[x] c1`              |
| A1   | Dirty Read                   | `w1[x] r2[x] {a1}x{c2}`              |
| A2   | Non-repeatable or Fuzzy Read | `r1[x] w2[x] c2 r1[x] c1`            |
| A3   | Phantom                      | `r1[P] w2[y in P] c2 r1[P] c1`       |
| A5A  | Read Skew                    | `r1[x] w2[x] w2[y] c2 r1[y] {c1/a1}` |
| A5B  | Write Skew                   | `r1[x] r2[y] w1[y] w2[x] {c1}x{c2}`  |

| Name     | History                                                             |
| -------- | ------------------------------------------------------------------- |
| H1       | `r1[x=50] w1[x=10] r2[x=10] r2[y=50] c2 r1[y=50] w1[y=90] c1`       |
| H1.SI    | `r1[x0=50] w1[x1=10] r2[x0=50] r2[y0=50] c2 r1[y0=50] w1[y1=90] c1` |
| H1.SI.SV | `r1[x=50] r1[y=50] r2[x=50] r2[y=50] c2 w1[x=10] w1[y=90] c1`       |
| H2       | `r1[x=50] r2[x=50] w2[x=10] r2[y=50] w2[y=90] c2 r1[y=90] c1`       |
| H3       | `r1[P] w2[insert y to P] r2[z] w2[z] c2 r1[z] c1`                   |
| H4       | `r1[x=100] r2[x=100] w2[x=120] c2 w1[x=130] c1`                     |
| H5       | `r1[x=50] r1[y=50] r2[x=50] r2[y=50] w1[y=40] w2[x=40] c1 c2`       |

| Isolation Level       | P1/A1 Dirty Read | P2/A2 Fuzzy Read | P3/A3 Phantom |
| --------------------- | ---------------- | ---------------- | ------------- |
| ANSI READ UNCOMMITTED | ✓                | ✓                | ✓             |
| ANSI READ COMMITTED   |                  | ✓                | ✓             |
| ANSI REPEATABLE READ  |                  |                  | ✓             |
| ANOMALY SERIALIZABLE  |                  |                  |               |

| Consistency Level                   | Read Locks                 | Write Locks |
| ----------------------------------- | -------------------------- | ----------- |
| Degree 0                            | none                       | short       |
| Degree 1 = Locking READ UNCOMMITTED | none                       | long        |
| Degree 2 = Locking READ COMMITTED   | short                      | long        |
| Cursor Stability                    | cursor lock                | long        |
| Locking REPEATABLE READ             | long item; short predicate | long        |
| Degree 3 = Locking SERIALIZABLE     | long                       | long        |

| Isolation Level  | P0 Dirty Write | P1 Dirty Read | P2 Fuzzy Read | P3 Phantom |
| ---------------  | -------------- | ------------- | ------------- | ---------- |
| READ UNCOMMITTED |                | ✓             | ✓             | ✓          |
| READ COMMITTED   |                |               | ✓             | ✓          |
| REPEATABLE READ  |                |               |               | ✓          |
| SERIALIZABLE     |                |               |               |            |


```
                            Serializable = Degree 3
                             /                 \
                    Repeatable Read             |
                           |               Snapshot Isolation
                    Cursor Stability            |
                             \                 /
                           Read Committed = Degree 2
                                       |
                          Read Uncommitted = Degree 1
                                       |
                                    Degree 0
```
