## [In Search of an Understandable Consensus Algorithm (2014)](https://scholar.google.com/scholar?cluster=12646889551697084617&hl=en&as_sdt=0,5)
Modelling a distributed system as a replicated state machine provides the
illusion that the distributed system is really just a single machine. At the
core of the replicated state machine approach is a replicated log that is kept
consistent by a consensus algorithm. Traditionally, consensus has been
synonymous with Paxos. Paxos is taught in schools, and most consensus algorithm
implementations are based on Paxos. However, Paxos has two main disadvantages:

1. It is *hard to understand*. Single-decree Paxos is nuanced, and composing
   single-decree Paxos into multi-Paxos is confusing.
2. It is *hard to implement efficiently*. Multi-Paxos is not very well
   described in the literature, and the algorithm is difficult to implement
   efficiently without modification.

This paper presents the Raft consensus algorithm. Raft provides the same
performance and safety as multi-Paxos but it is designed to be much easier to
understand.

**Basics.**
Every node in a raft cluster is in one of three states: *leader*, *follower*,
or *candidate*. The leader receives requests from users and forwards them to
followers. Followers are completely passive and receive messages from leaders.
Candidates perform leader elections in an attempt to become a leader. In normal
operation, there is a single leader, and every other node is a follower.

Raft proceeds in a series of increasingly numbered terms. Each term consists of
a leader election followed by (potentially) normal operation. There is exactly
one leader elected per term. Moreover, each node participates in monotonically
increasing terms. When a node sends a message in Raft, it annotates it with its
term. If a leader receives a message from a later term, it immediately becomes
a follower. Nodes ignore messages annotated with older terms.

Raft uses two RPCs: RequestVote (for leader election) and AppendEntries (for
replication and heartbeats).

**Leader Election.**
Leaders periodically send heartbeats (AppendEntries RPCs without any entries)
to followers. As long as a follower continues to receive heartbeats, it
continues to be a follower. If a follower does not receive a heartbeat after a
certain amount of time, it begins leader election: it increments its term,
enters the candidate state, votes for itself, and sends RequestVote RPCs in
parallel to all other nodes. Either,

1. *It wins.* Nodes issue a single vote per term on a first come first serve
   basis. If a candidate receives a vote from a majority of the nodes, then it
   becomes leader.
2. *It hears from another leader.* If a candidate receives a message from
   another leader in a term at least as large as it, it becomes a follower.
3. *It times out.* It's possible that a split vote occurs and nobody becomes
   leader in a particular term. If this happens, the candidate times out after
   a certain amount of time and begins another election in the next term.

**Log Replication.**
During normal operation, a leader receives a request from a client, appends it
to its log annotated with the current term, and issues AppendEntries to all
nodes in parallel. An entry is considered *committed* after it is replicated to
a majority of the nodes. Once a log entry is committed, all previous log
entries are also committed. Once a log entry is committed, the leader can apply
it and respond to the user. Moreover, once an entry is committed, it is
guaranteed to eventually execute at all available nodes. The leader keeps track
of the index of the largest committed entry and sends it to all other nodes so
that they can also apply log entries.

Raft satisfies a powerful *log matching invariant*:

1. "If two entries in different logs have the same index and term, then they
   store the same command."
2. "If two entries in different logs have the same index and term, then the
   logs are identical in all preceding entries."

1 is ensured by the fact that a single leader is elected for any given term,
the fact that a leader only creates a single log entry per index, and the fact
that once a log entry is created, it never changes index. 2 is ensured by a
runtime check. When a leader sends an AppendEntries RPC for a particular index,
it also sends its log entry for the previous index. The follower only applies
the AppendEntries RPC if it agrees on the previous index. Inductively, this
guarantees 2.

Followers may have missing or extraneous log entries. When this happens, the
leader identifies the longest prefix on which the two agree. It then sends the
rest of its log. The follower overwrites its log to match the leader.

**Safety.**
The protocol described so far is unsafe. If a new leader is elected, it can
accidentally force followers to overwrite committed values with uncommitted
values. Thus, we must ensure that leaders contain all committed entries. Other
consensus algorithms ensure this by shipping committed values to newly elected
leaders. Raft takes an alternative approach and guarantees that if a leader is
elected, it has every committed entry. To ensure this, Raft must restrict which
nodes can be elected.

A follower rejects a RequestVote RPC if the requesting candidate's log is not
as up-to-date as its log. One log is as up-to-date as another if its last entry
has a higher term or has the same term but is longer.

Since a candidate must receive a majority of votes and committed values have
been replicated to a majority of nodes, a candidate must contact a node with
all committed values during its election which will prevent it from being
elected if it doesn't have all the committed log entries.

To prevent another subtle bug, leaders also do not directly commit values from
previous terms. They only commit values from their own term which indirectly
commits previous log entries from previous terms.

**Cluster Membership Changes.**
A Raft cluster cannot be instantaneously switched from one configuration to
another. For example consider a cluster moving from 3 to 5 nodes. It's possible
that two nodes are elected master for the same term which can lead to a safety
violation. Instead, the cluster transitions to a *joint consensus* phase where
decisions require a majority from both the old and new configuration. Once a
majority of nodes accept the new configuration, the cluster can transition to
it.

