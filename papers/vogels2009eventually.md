# [Eventually Consistent (2009)](https://scholar.google.com/scholar?cluster=4308857796184904369)
In this CACM article, Werner Vogels discusses eventual consistency as well as a
couple other forms of consistency.

## Historical Perspective
Back in the day, when people were thinking about how to build distributed
systems, they thought that strong consistency was the only option. Anything
else would just be incorrect, right? Well, fast forward to the 90's and
availability started being favored over consistency. In 2000, Brewer released
the CAP theorem unto the world, and weak consistency really took off.

## Client's Perspective of Consistency
There is a zoo of consistency from the perspective of a client.

- **Strong consistency.** A data store is strongly consistent if after a write
  completes, it is visible to all subsequent reads.
- **Weak consistency.** Weak consistency is a synonym for no consistency. Your
  reads can return garbage.
- **Eventual consistency.** "the storage system guarantees that if no new
  updates are made to the object, eventually all accesses will return the last
  updated value."
- **Causal consistency.** If A issues a write and then contacts B, B's read
  will see the effect of A's write since it causally comes after it. Causally
  unrelated reads can return whatever they want.
- **Read-your-writes consistency.** Clients read their most recent write or a
  more recent version.
- **Session consistency.** So long as a client maintains a session, it gets
  read-your-writes consistency.
- **Monotonic read consistency.** Over time, a client will see increasingly
  more fresh versions of data.
- **Monotonic write consistency.** A client's writes will be executed in the
  order in which they are issued.

## Server's Perspective of Consistency
Systems can implement consistency using quorums in which a write is sent to W
of the N replicas, and a read is sent to R of the N replicas. If R + W > N,
then we have strong consistency.
