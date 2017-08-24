# [Managing Update Conflicts in Bayou, a Weakly Connected Replicated Storage System (1995)](https://scholar.google.com/scholar?cluster=13516383847362211388)
Bayou is a replicated eventually consistent storage system designed to be run
on a set of mobile servers and clients that are only intermittently connected.
Unlike previous systems, Bayou uses application-specific logic to detect and
resolve conflicts of concurrent writes. Servers gossip writes to one another
and apply writes immediately (though tentatively). Clients can read tentative
state at any time. Slowly over time, conflicts are resolved and writes are
committed.

## Motivating Examples
Consider two motivating Bayou applications.

1. **Meeting room scheduler.** Consider an application like Google calendar
   which lets people reserve a particular room for a particular amount of time.
   If multiple people concurrently reserve the same room, all but one of the
   reservations has to be adjusted.
2. **Bibliographic database.** Consider an application like Google scholar in
   which users insert entries for a particular paper. Each paper is assigned a
   unique id. If two users concurrently add the same paper with different ids
   or add different papers with the same id, there is a conflict.

## Conflict Detection and Resolution
Bayou replicates collections across a number of servers. Whenever a server
receives a write, it annotates it with a globally unique id and eventually
propagates it to other servers via periodic gossip. Servers order these
writings according to their ids and execute them in order. Imagine if two
servers concurrently receive writes which they then propagate to one another.
These writes may conflict and need to be resolved. Bayou allows applications to
provide application-specific definitions of *what* a conflict is and *how* to
resolve it.

For example, consider again the meeting room scheduler from above. Bayou could
automatically detect concurrent writes to the same page and mark them as
conflicts, but if these two writes affect different meeting rooms, there really
is no conflict. Instead, Bayou allows the application to specify that there is
only a conflict if two writes book the same room at the same time. Moreover,
applications can also specify how to resolve conflicts. For example, the
meeting room scheduler may resolve conflicts by reassigning one of the meetings
to the next available time. Concretely, **dependency checks** allow users to
specify conflicts, and **merge procedures** resolve them.

### Dependency Checks
Every write is bundled with a dependency check. A dependency check is a pair of
(1) a SQL query over the state of a server and (2) an expected results. When
servers execute a write, they first check that executing the query produces the
expected result. For example, a write to book a meeting room could include a
query which returns the meetings which book the same room at an overlapping
time and expect to see the empty set. A dependency check could also check that
the versions of previously read data are the same upon a write, similar to an
optimistic concurrency control scheme. If the dependency check fails, the merge
procedure is executed.

### Merge Procedures
A merge procedure is a program written in a high-level interpreted language
that is run atomically whenever a conflict is detected. The merge procedure
modifies the write to one that will succeed. If it cannot be modified, it
writes enough information so that a user can later manually fix things. For
example, a write to book a meeting room could be bundled with a merge procedure
that tries to book other times.

## Replica Consistency
Every server maintains a logical timestamp that is roughly kept in
correspondence with its physical time. Servers tag writes with an id of the
form (timestamp, server id). These ids form a total order, and servers order
writes with respect to it. Servers immediately apply writes whenever they are
received, and these writes are **tentative**. Slowly, writes are deemed
**committed** and ordered before the tentative writes. It's possible that a new
write appears and is inserted in the middle of the sequence of writes. This
forces a server to *undo* the affects of later writes. The undo process is
described later.

## Write Stability and Commitment
When a write is applied by a server for the last time, it is considered
**stable** (equivalently, committed). Clients can query servers to see which
writes have been committed. How do servers commit writes? One approach is to
commit a write whenever its timestamp is less than the current timestamp of all
servers. Unfortunately, if any of the servers is disconnected, this strategy
can delay commit. In Bayou, a single server is designated as the primary and
determines the order in which writes are committed. If this primary becomes
disconnected, other servers may not see committed data for a while.

## Storage System Implementation Issues
There are three main components to each server: a write log, a tuple store, and
an undo log.

1. **Write log.** Every server maintains a sequence of all writes ordered by
   id, committed writes appearing before tentative writes. As an optimization,
   the servers can throw away a prefix of the committed writes because they
   will never again be executed. However, if a server throws away a write, it
   must be sure not to reintroduce the write via gossip. To do so, servers
   maintain an O-vector which for each server, records the largest timestamp of
   a discarded write from that server. If the server receives a write from a
   server with a timestamp lower than the entry in the O-vector, the write can
   be discarded.
2. **Tuple store.** The tuple store is an in-memory relational database which
   supports a subset of SQL. The database must present a view of the committed
   database as well as the tentative database. To do so, every tuple is
   annotated with a committed and tentative bit. Queries propagate these bits
   to outputs.
3. **Undo log.** The undo log is used to undo things; it is not described in
   any detail.

## Commentary
- The primary approach to committing does not seem well motivated. If the
  master crashes, you're out of luck.
- Bayou's approach re-executes writes frequently.
