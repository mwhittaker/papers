# [On Optimistic Methods for Concurrency Control (1981)](https://scholar.google.com/scholar?cluster=14884990087876248723)
__tl;dr__ OCC transactions are split into a read phase, a validation phase, and
a write phase. A transaction is assigned a timestamp at the beginning of its
validation phase, and validation passes if the transaction respects the
serialization of transactions by their assigned timestamps. A serial validation
implementation implements the validation and write phase atomically, and a
parallel implementation allows for concurrent validation and write phases.

## Overview
Lock-based concurrency control comes with a lot of overhead. If a transaction
holds a lock while fetching data from disk, it may end up holding locks for
quite a while. _Strict_ two-phase locking is needed to ensure recoverability,
so transactions cannot release locks early. Dealing with deadlock (be it
avoidance or detection) also incurs some overhead. Worse yet, if transactions
rarely conflict, this overhead is largely unnecessary.

In contrast with lock-based concurrency control, optimistic concurrency control
(OCC) allows transactions to run with unbridled enthusiasm, reading and writing
whatever they want with reckless abandon. Then, when a transaction goes to
commit, the database validates that if the transaction were to commit, it would
not violate serializability. If the validation is successful, the transaction
commits; otherwise, it aborts. If conflicts are common, OCC leads to a lot of
preventable aborts, but if conflicts are uncommon (e.g. with a read-mostly
workload), OCC can incur less overhead than a lock-based approach.

In OCC, transactions are divided into three phases: a read phase, a validation
phase, and a write phase.

1. The __read phase__. "Read" is a bit of a misnomer here. During the read
   phase, transactions read from _and write to_ the database, executing
   whatever logic they want. The only thing is that instead of writing directly
   into the database, they cache all of their writes.
2. The __validation phase__. The validation phase checks to make sure that a
   transaction commits only if doing so will preserve serializability. If a
   transaction validates, it will enter the write phase and then commit. It it
   does not validate, then it will abort and be restarted.
3. The __write phase__. During the write phase, a transaction copies its cached
   writes into the database.

## The Read and Write Phases
During the read phase, transactions cache their writes and maintain a __read
set__ (a set of all the objects read) and __write set__ (a set of all the
objects written). During the write phase, transactions flush their cached
writes into the database. Besides that, there's not much to say about the read
and write phase. The paper goes into a bit of detail about how to perform the
read and write phase for a particular object based data model, but the details
are not particularly salient.

## The Validation Phase
In OCC, every transaction is assigned a unique timestamp either during its read
phase or at the beginning of its validation phase. For now, assume it is
assigned at the beginning of its validation phase; we'll talk more about this
in a bit. OCC ensures that transactions are executed in a way that is
equivalent to executing all transactions serially in timestamp order. The
validation of a transaction $j$ follows the following logic:

- for every transaction $i < j$:
    1. If the write set of $i$ overlaps the read set of $j$, then $i$ must
       finish completely before $j$ starts. Why is this? Well, if $j$ read
       something that $i$ wrote, then $i$ has to finish writing it before $j$
       starts reading it. If $j$ were to read a value before $i$ wrote it, this
       would violate serializability.
    2. Otherwise, if the write set of $i$ overlaps with the write set of $j$,
       then $i$ has to finish its write phase before $j$ starts its write
       phase.  Why is this? Well, we know that $i$ doesn't write anything that
       $j$ reads, so we can overlap $i$'s write phase with $j$'s read phase if
       we want. But, we have to make sure that $i$'s writes happen before $j$'s
       writes since $i$ is serialized before $j$.
    3. Otherwise, $i$ has to finish its read phase before $j$ finishes its read
       phase. Why is this? Well, we know that $i$ doesn't write anything that
       $j$ reads or writes, so $i$ is free to write during $j$'s read or write
       phase. The only thing is that we have to be careful not to let $j$ write
       something that $i$ reads, which is forbidden since $i$ is serialized
       before $j$. To ensure this, we make sure that $i$ finishes its read
       phase completely, before $j$ has a chance to enter its validation or
       write phase. Note that if we assign timestamps at the beginning of the
       validation phase, then this condition is enforced automatically. $i < j$
       is only possible when $i$ finished its read phase before $j$.

Note that we can also hand out timestamps during the read phase, but it might
require a transaction to block when it enters its validation phase. Imagine we
hand transaction $a$ a timestamp of 1. Then, we hand transaction $b$ a
timestamp of $2$. If transaction $b$ finishes its read phase quickly and enters
its validation phase, it has to wait for transaction $a$ to finish its read
phase in order to know its read and write sets.

On the other hand, assigning timestamps at the beginning of the validation
phase can lead to an unbounded number of read and write sets that we have to
keep track of. If a transaction has a particularly long read phase, then when
it enters its validation phase, it will have to know the read and write sets of
all other transactions that started after it but entered their validation phase
before it. Assigning timestamps during the read phase prevents this.

Finally, note that a transaction can be infinitely aborted and restarted if it
gets really unlucky. To prevent this, we can assign each transaction a priority
based on its age and allow a high priority transaction to start locking things
if its been restarted too many times.

## Serial Validation
Now we know the logical steps involved with validation, but how to we actually
implement it. One way is to implement __serial validation__ in which we
atomically execute validation and write phases together. With this approach,
the second and third conditions above are guaranteed automatically. All we need
to do is ensure that for all overlapping transactions $i$, $i$ doesn't write
anything that we read. See
[github.com/mwhittaker/occ](https://github.com/mwhittaker/occ) for an
implementation of serial validation.

## Parallel Validation
Parallel validation allows transactions to concurrently execute validation and
write phases. Condition 3 from above is still guaranteed automatically, but we
have to check condition 2. To do so, we abort if our write set overlaps any
write set of a concurrently executing transaction. See the paper for details.

<script type="text/javascript" async
  src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/MathJax.js?config=TeX-MML-AM_CHTML">
</script>
