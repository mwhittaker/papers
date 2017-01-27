## [Putting Consistency Back into Eventual Consistency (2015)](https://scholar.google.com/scholar?cluster=12926058981780664697&hl=en&as_sdt=0,5)
Many distributed databases geo-replicate data for (i) lower read latency and
(ii) higher fault tolerance in the face of an extreme failure (e.g. [lightning
striking a data
center](https://status.cloud.google.com/incident/compute/15056)). Implementing
strong consistency over a geo-replicated system can incur tremendous write
latency, as updates have to coordinate between geographically distant data
centers. On the other hand, weak consistency is a real brain buster. This paper
introduces a new consistency model between weak and strong consistency,
*explicit consistency*, which takes into account user specified invariants. It
also presents an explicitly consistent system which

1. performs static analysis to determine which operations can be executed
   without coordination,
2. uses *invariant-repair* or *violation-avoidance* to resolve or avoid
   conflicts, and
3. instruments user code with calls to middleware.

The system is called *Indigo* and is built on an existing causally consistent
key-value store with various properties.

**Explicit Consistency.**
A database is a collection of objects replicated across data centers. Users
issue reads and writes as part of transactions, and these transactions are
asynchronously replicated between data centers. We denote by `t(S)` the
database state achieved by applying transaction `t` to database state `S`.
`S_n` is the database state achieved after the `n`th transaction. That is, `S_n
= t_n(...(t_1(t_init))...)`. `T(S_n) = {t_1, ..., t_n}` is the set of
transactions used to create `S_n`. We say a transaction `t_a` happens before a
transaction `t_b`, denoted `t_a --> t_b`, if `t_a` is in `T(S_b)`. `O = (T,
-->)` is a partial order. `O' = (T, <)` is a serialization of `O` if `<` is
total and respects `-->`.

Given an invariant `I`, we say `S` is `I`-valid if `I(S) = true`. `(T, <)` is
an `I`-valid serialization if `I` holds on all prefixes of the serialization.
If a system ensures that all serializations are `I`-valid, it provides explicit
consistency. In other words, an explicitly consistent database ensures
invariants always hold. This builds off of Bailis et al.'s notion of
invariant-confluence.

**Determining I-offender Sets.**
An *invariant* is a universally quantified first order logic formula in prenex
normal form. The invariant can include uninterpreted functions like `Player(P)`
and `enrolled(P, T)`.

A *postcondition* states how operations affect the truth values of the
uninterpreted functions in invariants. Every operation is annotated with
postconditions. A *predicate clause* directly alters the truth assignments of a
predicate (e.g. not `Player(P)`). A *function clause* relates old and new
database states (e.g. `nrPlayers(T) = nrPlayers(T) + 1`).

This language is rather expressive, as evidenced by multiple examples in the
paper.

A set of transactions is an I-offender if it is not invariant-confluent. First,
pairs of operations are checked to see if a contradictory truth assignment is
formed (e.g. `Player(P) and not Player(P)`). Then, every pair of transactions
is considered. Given the weakest liberal precondition of the transactions, we
substitute the effects of the transactions into the invariant to get a formula.
We then check for the validity of the formula using Z3. If the formula is
valid, the transactions are invariant-confluent.

**Handling I-offender Sets.**
There are two ways to handle I-offenders: invariant-repair and
violation-avoidance. Invariant-repair involves CRDTs; the bulk of this paper
focuses on violation-avoidance which leverages existing reservation and escrow
transaction techniques.

- *UID generation.* Unique identifiers can easily be generated without
  coordination. For example, a node can concatenate an incrementing counter
  with its MAC address.
- *Multi-level lock reservation.* Locking is the most general form of
  reservation. Locks come in three flavors: (i) shared forbid, (ii) shared
  allow, and (iii) exclusive allow. Transactions acquire locks to avoid
  invariant violation. For example, an `enrollTournament` could acquire a
  `sharedForbid` lock on removing players, and `removePlayer` could acquire a
  `sharedAllow` lock. Exclusive allow are used for self-conflicting operations.
- *Multi-level mask reservation.* If our invariant is a disjunction `P1 or ...
  or Pn`, then to preserve the invariant, we only need to guarantee that at
  least one of the disjuncts remains true. A mask reservation is a vector of
  locks where an operation can falsify one of the disjuncts only after
  acquiring a lock on another true disjunct preventing it from being
  falsified.
- *Escrow reservation.* Imagine our invariant is `x >= k` and `x` has initial
  value `x0`. Escrow transactions allocate `x0 - k` *rights*. A transaction can
  decrement `x` only after acquiring and spending a right. When `x` is
  incremented, a right is generated. This gets tricker for invariants like `|A|
  >= k` where concurrent additions could generate too many rights leading to an
  invariant violation. Here, we use *escrow transactions for conditions*, where
  a primary is allocated for each reservation. Rights are not immediately
  generated; instead, the primary is responsible for generating rights.
- *Partition lock reservation.* Partition locks allow operations to lock a
  small part of an object. For example, an operation could lock part of a
  timeline to ensure there are no overlapping timespans.

There are many ways to use reservations to avoid invariant violations. Indigo
uses heuristics and estimated operation frequencies to try and minimize
reservation acquisitions.

**Implementation.**
Indigo can run over any key-value store that offers (i) causally consistency,
(ii) snapshot transactions with CRDTs, and (iii) linearizability within a data
center. Currently, it uses Swiftcloud. Its fault tolerance leverages the
underlying fault tolerance of the key-value store. Each reservation is stored
as an object in the key-value store, where operations are structured as
transfers to avoid some concurrency oddities.

