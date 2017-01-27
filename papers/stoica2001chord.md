## [Chord: A Scalable Peer-to-peer Lookup Service for Internet Applications (2001)](https://goo.gl/AOCTas) ##
**Summary.**
Chord is a peer-to-peer lookup service---today, we'd call it a distributed hash
table---mapping keys to servers that provides load balancing, decentralization,
scalability, availability, and flexible key naming. In a Chord cluster with `N`
nodes, each server stores O(log `N`) data, lookup takes O(log `N`) messages,
and node joining requires O(log `N` * log `N`) messages. Note that Chord maps
keys to *servers*, not *values*, but a key-value interface can easily be built
on top of Chord. In fact, Chord leaves all higher level functionality, like
caching and replication, to the user.

Chord hashes keys and servers (represented by their IP address) into the space
of `m`-bit bitstrings modulo `2^m`. The key `k` is managed by the first server
`n` greater than or equal to `k`. This server is known as the successor of `k`.
Intuitively, keys and servers are assigned to points on a circle of values
ranging from `0` to `2^m`. The successor of a point `k` is the first server
reached by rotating clockwise starting at `k`.

Each node `n` maintains `m` fingers. The `i`th finger is the successor of `n +
2^{i-1}`. For example, the first finger is the successor of `n + 1`, the second
finger is the successor of `n + 2`, the third finger is the successor of `n +
4`, etc. Note that the first finger is the successor of `n`. Under this scheme,
nodes only know about a small fraction of the nodes and cannot identify the
successor of an arbitrary key. In order to find the server assigned to a key
`k`, we follow fingers to the latest node that precedes `k`. Once `k` falls
between a node and its immediate successor, that successor is the successor of
`k`.

In order to handle the joining of a node, servers also maintain a pointer to
their predecessor. When a node `n` joins, it contacts an arbitrary Chord node
`n'` and performs the following procedure:

1. *Update the predecessor and fingers of `n`.* `n` computes its predecessor
   and fingers by simply asking `n'` to look them up. Naively, this requires
   `O(m * log N)` messages. As a small optimization, a node can avoid looking
   up the successor of `n + 2^i` if the successor of `n + 2^{i - 1}` is greater
   than `n + 2^i`. In this case the `i`th finger is the same as the `i-1`th
   finger. This requires `O(log N * log N)` operations. Other optimizations can
   reduce the message complexity to `O(log N)`.
2. *Update the predecessor and fingers of other nodes.* `n` is the `i`th finger
   of a node `p` if `p` precedes `n` by at least `2^i` and `n` precedes the
   `i`th finger of `p`. For `i = 1` to `i = m`, the predecessor `p` of `n -
   2^i` is found. If `n` precedes `p`'s `i`th finger, then its fingers are
   updated. If the fingers are updated, `p` is set to the predecessor of `p`
   and the process repeats.
3. *Notify the application to migrate data to `n`.* Applications are
   responsible for migrating data and therefore must be notified when a new
   node joins the system. Typically a node `n` will take data only from its
   successor.

In order to handle the concurrent joining and leaving of nodes, Chord
periodically runs a stabilization procedure that aims to maintain the
correctness of successor pointers. If a lookup is performed during
stabilization, one of three things can happen:

1. If the successors and fingers are correct, the lookup succeeds as usual.
2. If the successors are correct but the fingers are incorrect, the lookup
   succeeds but may take longer than usual.
3. If the successors are incorrect, the lookup may fail. In this case, the
   application may issue a retry.

When a node `n` joins, it contacts an existing Chord node `n'`. It asks `n'` to
find its successor. Periodically, servers check to see if their successor's
predecessor should be their successor, and they inform their successor about
their existence. They also periodically refresh fingers.

Note that the stabilization cannot handle certain perverse scenarios. For
example, if two disjoint rings form, stabilization will not merge the two
rings.

To handle node failures, nodes maintain `r` successors. When a successors node
fails, lookup is routed to the next of the `r` successors.
