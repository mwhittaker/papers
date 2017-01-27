## [TARDiS: A Branch-and-Merge Approach To Weak Consistency (2016)](https://scholar.google.com/scholar?q=TARDiS%3A+A+Branch-and-Merge+Approach+To+Weak+Consistency&btnG=&hl=en&as_sdt=0%2C5)
**Overview.**
Strong consistency is expensive. The alternative, weak consistency, is hard to
program against. The lack of distributed synchronization or consensus in a
weakly consistent system means that replica state can diverge. Existing systems
try to hide this divergence with *causal consistency* to deal with read-write
conflicts and per-object *eventual convergence* to deal with write-write
conflicts, but neither is sufficient to deal with complex multi-object
write-write conflicts.

As a motivating example, imagine a Wikipedia article for Donald Trump with
three parts: some text, an image, and some references. In one partition,
Hillary modifies the text to oppose Trump and subsequently, Tim changes the
picture to a nastier image of Trump. In another picture, Trump modifies to the
text to support Trump and subsequently, Mike changes the references to link to
pro-Trump websites. Later, the partitions need to be merged. The write-write
conflict on the text needs to be reconciled. Moreover, the modifications to the
image and references do not produce conflicts but still need to be updated to
match the text. Existing systems solve this in one of two ways:

1. *syntactic conflict resolution:* Some policy like last-writer-wins is
   chosen.
2. *lack of cross-object semantics:* Users are forced to merge individual
   objects.

TARDiS (**T**ransactional **A**synchronously **R**eplicated **Di**vergent
**S**tore) is a distributed weakly-consistent transactional key-value store
that supports branching computation as a core abstraction. When working off a
single branch, applications are shielded from diverging computations.
Conversely, applications can merge branches and reconcile conflicts.  By
allowing applications to merge entire branches rather than single objects,
users have the ability to perform semantically rich multi-object merges.

TARDiS employs three techniques:

1. *branch-on-conflict*
2. *inter-branch isolation*
3. *application-driven cross-object merge*

and has the following properties:

1. *TARDiS knows history:* TARDiS maintains a DAG of branching execution and
   uses DAG compression to minimize memory overhead.
2. *TARDiS merges branches, not objects:* TARDiS allows applications to merge
   branches rather than single-objects.
3. *TARDiS is expressive:* TARDiS supports various isolation levels.
4. *TARDiS improves performance of the local site:* Branching on conflict and
   deferring merge until later can improve performance in a local setting as
   well as in a distributed setting.

**Architecture.**
TARDiS is a distributed multi-master key value store with asynchronous
replication. There are four main layers to TARDiS:

1. *Storage layer:* this layer implements a disk-backed multiversion B-tree.
2. *Consistency layer:* this layer maintains the DAG of execution branches
   where each vertex is a logical state.
3. *Garbage collection layer:* this layer performs DAG compression and record
   pruning.
4. *Replicator service layer:* this layer propagates transactions.

**Interface.**
Applications use TARDiS in either

- *single-mode*, where transaction execute on a single branch, or
- *multi-mode*, where a transaction can read from multiple branches and create
  a new merged branch.

TARDiS provides an API to find the set of conflicting writes for a set of
branches, the find the fork points for a set of branches, and to get the
versioned values of objects. It also supports varying levels of begin and end
constraints including serializability, snapshot isolation, read committed, etc.

Here's an example TARDiS application that implements a counter.

```
func increment(counter)
    Tx t = begin(AncestorConstraint)
    int value = t.get(counter)
    t.put(counter, value + 1)
    t.commit(SerializabilityConstraint)

func decrement(counter)
    Tx t = begin(AncestorConstraint)
    int value = t.get(counter)
    t.put(counter, value - 1)
    t.commit(SerializabilityConstraint)

func merge()
    Tx t = beginMerge(AnyConstraint)
    forkPoint forkPt = t.findForkPoints(t.parents).first
    int forkVal = t.getForId(counter, forkPt)
    list<int> currentVals = t.getForId(counter, t.parents)
    int result = forkVal
    foreach c in currentVals
        result += (c - forkVal)
    t.put(counter, result)
    t.commit(SerializabilityConstraint)
```

**Design and Implementation.**
When a transaction begins, TARDiS performs a BFS from the leaves of the state
DAG to find the first state satisfying the begin constraint. When a transaction
is committed, TARDiS walks down the state DAG as far as possible until a state
is reached that doesn't satisfy the end constraint, branching if necessary.
Branches are represented as a set of (b, i) pairs to indicate the bth child of
the ith node. Keys are mapped to a topologically sorted list of versions used
during reading.

The garbage collector performs DAG compression, eliminating unneeded states in
the state DAG. It also prunes record unneeded record versions after DAG
compression.
