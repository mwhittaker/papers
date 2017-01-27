## [CRDTs: Consistency without concurrency control (2009)](https://scholar.google.com/scholar?cluster=9773072957814807258&hl=en&as_sdt=0,5)
**Overview.**
Concurrently updating distributed mutable data is a challenging problem that
often requires expensive coordination. *Commutative replicated data types*
(CRDTs) are data types with commutative update operators that can provide
convergence without coordination. Moreover, non-trivial CRTDs exist; this paper
presents Treedoc: an ordered set CRDT.

**Ordered Set CRDT.**
An ordered set CRDT represents an ordered sequence of atoms. Atoms are
associated with IDs with five properties:
1. Two replicas of the same atom have the same ID.
2. No two atoms have the same ID.
3. IDs are constant for the lifetime of an ordered set.
4. IDs are totally ordered.
5. The space if IDs is dense. That is for all IDS P and F where P < F, there
   exists an ID N such that P < N < F.

The ordered set supports two operations:

1. insert(ID, atom)
2. delete(ID)

where atoms are ordered by their corresponding ID. Concretely, Treedoc is
represented as a tree, and IDs are paths in the tree ordered by an infix
traversal. Nodes in the tree can be *major nodes* and contain multiple
*mini-nodes* where each mini-node is annotated with a totally ordered
*disambiguator* unique to each node.

Deletes simply tombstone a node. Inserts work like a typical binary tree
insertion. To avoid the tree and IDs from getting too large, the tree can
periodically be *flattened*: the tree is restructured into an array of nodes.
This operation does not commute nicely with others, so a coordination protocol
like 2PC is required.

**Treedoc in the Large Scale.**
Requiring a coordination protocol for flattening doesn't scale and runs against
the spirit of CRDTs. It also doesn't handle churn well. Instead, nodes can be
partitioned into a set of core nodes and a set of nodes in the nebula. The core
nodes coordinate while the nebula nodes lag behind. There are protocols for
nebula nodes to catch up to the core nodes.
