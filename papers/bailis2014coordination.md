## [Coordination Avoidance in Database Systems (2014)](https://scholar.google.com/scholar?cluster=428435405994413003&hl=en&as_sdt=0,5)
**Overivew.**
Coordination in a distributed system is sometimes necessary to maintain
application correctness, or *consistency*. For example, a payroll application
may require that each employee has a unique ID, or that a jobs relation only
include valid employees. However, coordination is not cheap.  It increases
latency, and in the face of partitions can lead to unavailability.  Thus, when
application correctness permits, coordination should be avoided. This paper
develops the necessary and sufficient conditions for when coordination is
needed to maintain a set of database invariance using a notion of
invariant-confluence or I-confluence.

**System Model.**
A *database state* is a set D of object versions drawn from the set of all
states *D*. Transactions operate on *logical replicas* in *D* that contain the
set of object versions relevant to the transaction. Transactions are modeled as
functions T : *D* -> *D*. The effects of a transaction are merged into an
existing replica using an associative, commutative, idempotent merge operator.
Changes are shared between replicas and merges likewise. In this paper, merge
is set union, and we assume we know all transactions in advance. Invariants are
modeled as boolean functions I: *D* -> 2. A state R is said to be I-valid if
I(R) is true.

We say a system has *transactional availability* if whenever a transaction T
can contact servers with the appropriate data in T, it only aborts if T chooses
to abort. We say a system is *convergent* if after updates quiesce, all servers
eventually have the same state. A system is globally *I-valid* if all replicas
always have I-valid states. A system provides coordination-free execution if
execution of a given transaction does not depend on the execution of others.

**Consistency Sans Coordination.**
A state Si is *I-T-Reachable* if its derivable from I-valid states with
transactions in T. A set of transactions is *I*-confluent with respect to
invariant I if for all I-T-Reachable states Di, Dj with common ancestor Di join
Dj is I-valid. A globally I-valid system can execute a set of transactions T
with global validity, transactional availability, convergence, and
coordination-freedom if and only if T is I-confluent with respect to I.

**Applying Invariant-Confluence.**
I-confluence can be applied to existing relation operators and constraints. For
example, updates, inserts, and deletes are I-confluent with respect to
per-record inequality constraint. Deletions are I-confluent with respect to
foreign key constraints; additions and updates are not. I-confluence can also
be applied to abstract data types like counters.

