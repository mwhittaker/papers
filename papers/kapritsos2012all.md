# [All about Eve: Execute-Verify Replication for Multi-Core Servers (2012)](https://scholar.google.com/scholar?cluster=5784325423715415895)
__tl;dr__ If we want to implement state-machine replication in which each
replica runs batches of requests with multiple threads, we can _execute_ the
requests first and then _verify_ that the results are the same. If they are,
good. If not, rollback and run sequentially. Also check out the [video
presentation of this paper](https://www.usenix.org/node/170851); it's very
good!

## How do we build fault tolerant systems?
Typically, we use state machine replication (SMR). We model our system as a
deterministic state machine and then uses a consensus algorithm like Paxos or
Raft or Viewstamped Replication to agree on a totally ordered log of commands
that the replicas then execute _serially_. Since the replicas start off in the
same state, execute the same commands in the same order, and are all
deterministic, the replicas never diverge. This paper refers to this as the
__agree-execute__: replicas first _agree_ on the order of inputs and then
_execute_ them.

## Execute everything serially!? Why can't replicas run multithreaded?
In SMR, replicas run commands serially. Imagine instead that replicas were to
execute a batch of commands at a time, executing the batch with multiple
threads. The execution of these threads can be non-deterministic. For example,
imagine a database that is concurrently executing two transactions that write
to the same object. The order in which these two writes are serialized is
non-deterministic. Now that our state-machines are nondeterministic, they can
diverge.

## How can we build fault-tolerant multithreaded systems?
This paper proposes Eve as a way to implement fault-tolerant multithreaded
systems. With Eve, client requests are sent to a master node which clusters
requests into batches and sends these batches to all the other replicas.
Replicas execute requests a batch at a time using (potentially) multiple
threads. Then, they produce a token which summarizes their state and the result
of every request (it's pretty much a hash of state and responses). The replicas
send their tokens to a verification service which checks to see that all the
tokens are the same. If they are, then the replicas can move on to execute the
next batch. If they aren't, then the replicas have to roll back their state,
and re-execute the operations serially to make sure that they don't diverge. In
this paradigm, we first _execute_ requests and then _verify_ that replicas
haven't diverged.

## If we execute batches of requests, aren't there bound to be conflicts?
If a batch of requests has any non-commutative operations and any two replicas
execute them in different orders, then we're destined to have divergence.
Surely, this must be the common case, right? Probably. Eve addresses this issue
with __mixers__. A mixer is a bit of code running on each replica that divides
each batch of requests into a sequence of smaller batches called
__parallelBatches__. A mixer only puts operations into the same parallelBatch,
if it thinks the operations commute. The, replicas execute operations one
parallelBatch at a time. The mixer doesn't have to be an oracle. If it gets
things wrong, the verify portion of Eve will still detect and correct the
divergence.

## Ok, so how does verification work again?
The way that verification is implemented depends on our assumptions about the
system. This paper presents two different verification implementations for two
very different set of assumptions. First, it implements a verifier assuming
Byzantine faults and an asynchronous network. The implementation is similar to
PBFT, and admittedly I don't fully understand the details here. One important
thing to note, though, is that not every replica's token has to agree. We only
need some fraction of the tokens to agree. The replicas who have diverged will
be fixed later. Second, it implements a verifier for a synchronous
primary/backup system. The primary forms a batch and sends it to the backup.
Both execute the batch, and the backup sends its token tot he primary. The
primary verifies. If the primary crashes, the backup becomes the primary and
acts without consulting the failed primary (which is safe to do assuming we
have a synchronous network; otherwise, both could think that they are the
primary).

## If not every replica agrees, how do we fix the divergent replicas?
Eve doesn't require _every_ replica to agree. Some can diverge. How do we make
sure that these replicas eventually become up-to-date? We can have nodes gossip
with one another and use Merkle trees to know which state they have to exchange
with one another. This paper describes that in order for this to work, all
replicas have to agree to the same leaf order of their Merkle trees despite the
fact that they execute nondeterministically. To do so, they implement a
deterministic Merkle tree which takes advantage of the fact that Eve is
implemented in Java. It scans the leaves of the Merkle tree, adding new objects
to the tree. See paper for details.

## Are there any other advantages to Eve besides being faster?
Yes! Eve can help detect and mitigate concurrency bugs. Imagine that two
replicas execute the same batch of requests and diverge only because one had a
concurrency bug. Eve will detect this divergence and force the nodes to
re-execute serially, mitigating the bug. The authors found a real concurrency
bug in the H2 database using this approach.

## What are the alternatives to Eve?
There are a handful:

1. __Deterministic Multithreading.__ Deterministic multithreading is a
   low-level mechanism that ensures that different nodes executing the same
   multithreaded code will execute the exact same sequence of instructions. It
   eliminates all the non-deterministic aspects of multithreading. We could run
   each replica with deterministic multithreading to ensure replicas don't
   diverge. There are two drawbacks. First, deterministic multithreading comes
   with a lot of overhead. Second, not all operations are sent to all replicas.
   For example, some systems don't send reads to all replicas. If different
   replicas run different sets of operations, the deterministic multithreading
   can get out of sync.
2. __Deterministic Locking.__ Some systems like [Calvin][calvin] and [this
   paper][vandiver] implement deterministic locking. Deterministic locking,
   unlike deterministic multithreading, is not a low-level thing. It's a higher
   level modification of a lock manager which ensures that locks are granted to
   transactions in a pre-agreed upon order. Thus, batches of requests could be
   run with multiple threads using deterministic locking and ensure
   convergence. The drawback of this approach is that it's not general.
3. __Semi-active Replication.__ With semi-active replication, a primary
   executes a batch of operations nondeterministically and records all
   nondeterministic choices that it makes. Then, it sends the operations and
   choices to backups which execute the operations according to the primary.
   This approach cannot handle Byzantine failures.
4. __Remus-style Primary/Backup.__ Remus is a system which implements something
   similar to semi-active replication. The primary executes batches of requests
   nondeterministically, and then it sends over entire pages of memory to the
   backup which it then uses. Remus cannot handle Byzantine failures and comes
   with high overhead. Otherwise, it is very general.
5. __Multiple State Machines.__ As Robert Escriva mentions in his question
   after the Eve talk at Usenix ATC, if we want linearizability, we can shard
   our objects and run one state machine for each shard. This incurs some
   higher overheads and is not (I think?) general to serializability.

## Questions
- If a state machine wants to use an external system (e.g. H2), how do we do
  rollback?
- Copy-on-write data structures and fine-grained rollback make rollback faster,
  but like shadow paging, can't it make execution slower because of things like
  worse locality?
- Do we have to have a master node batch requests? Or can a client send
  requests directly to the replicas?

[calvin]: https://scholar.google.com/scholar?cluster=11098336506858442351
[vandiver]: https://scholar.google.com/scholar?cluster=18427232211525620689
