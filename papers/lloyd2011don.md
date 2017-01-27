## [Don't Settle for Eventual: Scalable Causal Consistency for Wide-Area Storage with COPS (2011)](https://scholar.google.com/scholar?cluster=16870210484225303236&hl=en&as_sdt=0,5)
**Overview.**
Many modern applications require high **a**vailability, low **l**atency,
**p**artition tolerance, and **s**calability. The CAP theorem tells us that
these kind of applications, dubbed *ALPS* applications, cannot be implemented
with strong consistency. However, weaker consistency models can be implemented
with high availability. This paper introduces *causal consistency with
convergent conflict handling* (causal+ consistency), one of the strongest
consistency models that can be supported with high availability, and a causal+
consistent key-value store COPS. It also extends COPS with multi-key get
transactions in a system dubbed COPS-GT.

**Causal+ Consistency.**
We model our system as set of independently executing threads of execution that
issue `get(key)` and `put(key, val)` operations against one replica of a
key-value store. We say operation `a` happens before operation `b`, denoted `a
-> b` if

1. `a` happens before `b` in a single thread of execution,
2. `a = get(key)` returns the value written by `b = put(key, val)`, or
3. there exists a `c` such that `a -> c` and `c -> b`.

A system is causally consistent if reads respect the causal ordering of events.
That is, it must appear the operation that writes a value occurs after all
operations that causally proceed it. For example, imagine Alice adds a photo to
Facebook and then adds a reference to the photo to an album. If Bob sees the
photo reference in the album, then the photo being referenced must exist.
Causal+ consistent is weaker than linearizability and sequential consistency
but is stronger than causal, PRAM, per-key sequential, and eventual
consistency.

Causal consistency governs the behavior of causally related operations; it
doesn't help much to resolve causally unrelated operations. For example, when
two unrelated writes to the same object happen, a causally consistent system is
allowed to indefinitely return either value. Convergent conflict handling
requires that all replicas resolve the conflict in the same way using an
associative and commutative merge operator. COPS allows the user to specify
application specific merge operators but otherwise defaults to use a
last-writer-wins rule.

In COPS, values are versioned with the guarantee that if `x_i -> x_j` then `i <
j`. That is, values are versioned with Lamport timestamps. Moreover, once COPS
returns a value, it guarantees to return the same version of a causally later
one, so version numbers are monotonically non-decreasing.

**Design.**
A COPS system is divided between multiple data centers connected by a wide-area
network. Each data center represents one logical replica of the entire
key-value store. Within the data center, the key space is sharded between
servers and linearizability is provided by using chained replication. Updates
within a data center are asynchronously sent to other data centers in a causal+
consistent fashion.

COPS clients issue get and put operations to COPS. Furthermore, each operation
is associated with a context and each context can have at most one outstanding
operation at a time. The operations associated with a context for a logical
thread of execution. The context maintains a table of (key, version,
dependency) pairs. When a client issues a write, it includes a list of the
versions the write depends on (i.e. the list of versions that causally precede
this write). COPS servers block until the dependencies are themselves committed
to the database to ensure causal consistency.

Get operations in COPS are rather straightforward, but they are often
inexpressive. For example, imagine Alice unfriends Bob and then uploads a
private photo that she doesn't want Bob to see. Bob's client could read Alice's
old friend list, see that Bob is still her friend, and then read Alice's new
private photo. COPS-GT extends COPS with get transactions which allow multiple
keys to be read simultaneously in a causally consistent way. A get transaction
for keys `k1, ..., kn` proceeds in two steps:

1. First, the latest versions and dependencies of every key is read from COPS.
   For example, COPS may return `z_3 = 4` which depends on `x_2` and `y_2`.
2. Next, for every dependency `x_i` where `x` is a key in the transaction, if
   the value of `x` read is not at least as large as `i`, then another read is
   issued to read a value at least as large as `i`.

**Garbage Collection.**
There are miscellaneous pieces of metadata in COPS that can be garbage
collected. For example, COPS-GT maintains many versions of each key-value pair
so that a get transaction can issue a read request at older values. If we're
not careful, the size of this metadata could grow without bound. COPS bounds
the duration of get transactions to some arbitrary time `T`, restarting any
transactions that last longer than `T`. Then, once a new version of a value is
written, the old ones can be garbage collected after roughly `T` amount of
time.

**Fault Tolerance.**
Fault tolerance is provided using chain-replication. If a data center goes
down, data could be lost, but woe is the way of a highly available system.
