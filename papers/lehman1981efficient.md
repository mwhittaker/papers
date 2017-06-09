<div hidden>
</div>

# [Efficient Locking for Concurrent Operations on B-Trees (1981)](https://scholar.google.com/scholar?cluster=4919657903329720293)
This paper introduces the **B-link tree**: a variant of a B+ tree (the paper
says B\* tree, but they mean B+ tree) which allows for concurrent searches,
insertions, and deletions. Operations on a B-link tree lock at most three nodes
at any given time, and searches are completely lock free.

## Storage Model
We assume that every node of a B+ tree or B-link tree is stored on disk.
Threads read nodes from disk into memory, modify them in memory, and then write
them back to disk. Threads can also lock a specific node which will block other
threads trying to acquire a lock on the same node. However, we'll also see that
threads performing a search will not acquire locks at all and may read a node
which is locked by another thread.

## Concurrent B+ Trees
Let's see what goes wrong when we concurrently search and insert into a B+ tree
without any form of concurrency control. Consider a fragment of a B+ tree shown
below with two nodes `x` and `y`. Imagine a thread is searching for the value 2
and reads the pointer to `y` from `x`.

```
            +-------+
          x | 5 |   |
            +-------+
           /    |
  +-------+    ...
y | 1 | 2 |
  +-------+
```

Then, another thread inserts the value `3` which reorganizes the tree like
this:

```
            +-------+
          x | 2 | 5 |
            +-------+
           /    |    \
  +-------+ +-------+ ...
y | 1 |   | | 2 | 3 |
  +-------+ +-------+
```

Next, the searching thread reads from `y` but cannot find the value 2!

Clearly, concurrently searching and inserting into a B+ tree requires some sort
of locking. There are already a number of locking protocols:

- The simplest protocol requires searches and insertions to lock every node
  along their path from root to leaf. This protocol is correct, but limits
  concurrency.
- Smarter protocols have insertions place write intention locks along a path
  and upgrade those locks to exclusive locks when performing a write. Searches
  can read nodes with write intention locks on them but not with exclusive
  locks on them.
- Even smarter protocols lock a subsection of the tree and bubble this
  subsection upwards through the tree. B-link trees will do something similar
  but will guarantee that at most three nodes are locked at any given point in
  time.

## B-link Trees
B-link trees are B+ trees with two small twists:

1. Typically, an internal node in a B+ tree with $n$ keys has $n + 1$ pointers.
   For example, if an internal node has keys $(5, 10, 15)$, then it has four
   pointers for values in the range $[-\infty, 5)$, $[5, 10)$, $[10, 15)$, and
   $[15, \infty)$.
   Internal nodes in a B-link tree with $n$ keys have $n$ pointers where the
   last key is known as the **high key**. For example, if an internal node has
   keys $(5, 10, 15)$ then it has three pointers for values in the range
   $[-\infty, 5)$, $[5, 10)$, and $[10, 15)$.
2. In a B+ tree, leaves are linked together, but internal nodes are not. In a
   B-link tree, all sibling nodes (internal nodes and leaves) are linked
   together left to right.

## Search Algorithm
The search algorithm for a B-link tree is very similar to the search algorithm
for a B+ tree. To search for a key $k$, we traverse the tree from root to leaf.
At every internal node, we compare $k$ against the internal node's keys to
determine which child to visit next.

However, unlike with a B+ tree, we might have to walk rightward along the
B-link tree to find the correct child pointer. For example, imagine we are
searching for the key $20$ at an internal node $(5, 10, 15)$. Because $20 \gt
15$, we have to walk rightward to the next internal node which might have keys
$(22, 27, 35)$. We do something similar at leaves as well to find the correct
value.

Note that searching does not acquire any locks.

## Insertion Algorithm
To insert a key $k$ into a B-link tree, we begin by traversing the tree from
root to leaf in exactly the same way as we did for the search algorithm. We
walk downwards and rightwards and do not acquire locks. One difference is that
we maintain a stack of the rightmost visited node in each level of the tree.
Later, we'll use the stack to walk backwards up the tree.

One we reach a leaf node, we acquire a lock on it and crab rightward until we
reach the correct leaf node $a$. If $a$ is not full, then we insert $k$ and
unlock $a$. If $a$ is full, then we split it into $a'$ (previously $a$) and
$b'$ (freshly allocated). We flush $b'$ to disk and then flush $a'$ to disk.
Next, we have to adjust the parent of $a'$ (formerly $a'$). We acquire a lock
on the parent node and then crab rightward until we reach the correct parent
node. At this point, we repeat our procedure upwards through the tree.

At worst, we hold three locks at a time.

## Correctness Proof
To prove that the B-link tree works as we intend, we have to prove three
things:

1. First, we have to prove that multiple threads operating on a B-link tree
   cannot deadlock. This is straightforward. If we totally order nodes
   bottom-to-top and left-to-right, then threads always acquire locks according
   to this total order.
2. Second, we have to prove that whenever a node modifies a B-link tree, the
   B-link tree still appears like a valid tree to all nodes except the
   modifying thread. Again, this is straightforward. The insertion procedure
   only makes three writes to disk.
    - Writing to a node that is not full clearly does not invalidate the tree.
    - Writing a newly allocated $b'$ node does not affect the tree because
      there are not any pointers to it.
    - Writing $a'$ atomically transitions the tree from one legal state to
      another.
3. Finally, we have to ensure that concurrently executing operations do not
   interfere with one another. See paper for proof (it's complicated).

## Deletion
B-link trees punt on deletion. They simply let leaf nodes get underfull and
periodically lock the whole tree and reorganize it if things get too sparse.

<script type="text/javascript" async
  src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/MathJax.js?config=TeX-MML-AM_CHTML">
</script>
