## [The Chubby lock service for loosely-coupled distributed systems (2006)](https://scholar.google.com/scholar?cluster=14281901705280588674&hl=en&as_sdt=0,5)
Chubby is Google's distributed lock service, implemented using consensus,
that allows clients to synchronize and agree on values. Chubby is like a file
system in which clients read and write entire files, but it also supports
advisory locks, event notification and more. Chubby's main goals are
reliability, availability, and easy-to-understand semantics. It's secondary
goals are throughput and storage capacity.

**Rationale.**
Chubby is a centralized lock service that internally uses Paxos. There are a
number of advantages to implementing a lock service rather than providing a
Paxos library that clients can use directly:

1. Programs are often not written like state machines which makes it difficult
   to integrate something like Paxos. It is significantly easier to use change
   code to use a lock service.
2. Often, when Chubby is used for leader election, the elected leader has to
   advertise its address. Thus, it makes sense to add data serving
   functionality into the lock service.
3. Locks are more familiar to programmers than state machines.
4. To be fault tolerant and available, consensus algorithms require a minimum
   number of servers. By using a lock service, the need for multiple servers is
   centralized. Clients don't have to run their own clusters.

Moreover, there are a number of other features that are useful to have in
Chubby including event notification, consistent file caching, and security

Also note that Chubby is designed for coarse, as opposed to fine, grained
locking. That is to say, clients hold locks for minutes to hours instead of
seconds or less. This reduces the load on Chubby and makes clients less
susceptible to Chubby crashes. Finer grained locking can also be implemented on
top of Chubby.

**System Structure.**
Chubby consists of a client library linked into applications and a small
cluster (typically 5) of servers called *replicas*. Replicas use consensus to
elect a master for the duration of a master lease which can be renewed by the
master. The master handles reads and writes which are copied to the replicas
using consensus. DNS is used to find replicas, and replicas forward clients to
the current master. If a replica is down for too long (e.g. multiple hours),
then it is replaced, the DNS entries are updated to point at the new server,
the new server receives data from backups and other replicas, and finally the
master introduces it into the cluster.

**Files, directories, and handles.**
Files in Chubby are identified by a path `ls/cell/dir1/dir2/.../dirn/filename`
where `ls` (lock service) identifies a Chubby file, `cell` is the name of a
cell, and the rest of the path is a usual path. This naming structure
integrates well into Google's existing file libraries and tools. Chubby makes a
couple of simplifying assumptions about files:

- Files cannot be moved between directories.
- Directories do not maintain last modified times.
- Permissions are per-file and do not depend on parents.
- There are no soft or hard links; everything in the file tree is a *node*.

Files can act as advisory locks, and file ACLs are themselves stored as files.
Moreover, files can be *permanent* or *ephemeral*. An ephemeral file is deleted
when no clients have it open; an ephemeral directory is deleted when it is
empty.

Each node maintains four numbers which increase over time:

1. An instance number which is incremented every time a file with a given name
   is created.
2. A content generation number which is incremented every time a file changes.
3. A lock generation number, which is incremented whenever a lock is acquired.
4. An ACL generation number which is incremented whenever ACLs are written.

Files also include 64 bit checksums.

**Locks and sequencers.**
Using distributed locks can be tricky, especially when messages are delayed and
locks are rapidly released and acquired. Each file in Chubby can act as an
advisory reader-writer lock. Lock owners may request a sequencer which is an
opaque byte-string with a name, mode, lock generation number etc. A client
passes the sequencer to a server, like a file server, which can check the
validity of the sequencer with Chubby. There is also a hackier way to prevent
anomalies in which locks cannot be re-acquired since the last release until a
*lock-delay* has passed.

**Events.**
Chubby clients can subscribe to events including:

- file changes,
- children nodes are added, deleted, or changed,
- master fail-over, and
- a lock is acquired.

**API.**
The Chubby API includes `Open`, `Close`, `Poison`, `GetContentsAndStat`,
`GetStat`, `ReadDir`, `SetContents` (with compare-and-swap semantics if need
be), `Delete`, `Acquire`, `TryAcquire`, `Release`, `GetSequencer`,
`SetSequencer`, and `CheckSequencer` calls.

**Caching.**
To reduce read load on Chubby, clients maintain a consistent write-through
cache. The master tracks what each client has cached and issues leases and
invalidations. Chubby uses a simple algorithm to keep caches consistent: when a
client issues a write, the server sends invalidations to all clients who have
the file cached. After all client caches have been invalidated, either by an
acknowledgement or a lease expiration, the write is written.

**Sessions and keep-alives.**
Chubby sessions between clients and servers are maintained by periodic
KeepAlive RPCs. Each session has a lease timeout before which the session is
guaranteed not to expire, and leases are periodically renewed in three
situations:

1. session creation,
2. master failover, and
3. KeepAlive delivery.

Masters do not respond to KeepAlive RPCs immediately. Instead, they wait until
just before the lease expires before responding. They also sent cache
invalidations and event notifications as part of the RPC. Clients respond to
KeepAlive RPCs immediately. Clients also conservatively estimate their lease
timeouts with some assumptions on clock skew and packet delivery times. When a
session expires, clients enter a 45 second grace period where they drop their
cache. If they reconnect to a master, things continue as usual. Otherwise, they
deliver an error to the user.

**Fail-over.**
If a master fails over, the client may reconnect to the new master during its
grace period. The new master follows the following procedure:

1. Generates a new epoch number that is larger than all previous epoch numbers.
2. Responds to master location requests.
3. Builds its in-memory state from the database.
4. Responds to KeepAlive RPCs.
5. Delivers fail-over events to clients.
6. Waits for all existing sessions to expire or for fail-over messages to be
   acked.
7. Responds to all operations.
8. Recreates old handles when necessary.
9. Deletes ephemeral files after some delay.

**DB.**
Originally, Chubby used BerkeleyDB (BDB), but BDB's replication support was
young. Moreover, Chubby didn't need all of the functionality. Ultimately,
Chubby threw out BDB and implemented a persistence layer itself.

**Backup.**
Periodically, Chubby masters back up their state in another cell in GFS.

**Mirroring.**
Chubby's event notifications make it easy to mirror directories.
