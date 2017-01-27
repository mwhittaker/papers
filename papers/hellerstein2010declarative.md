## [The Declarative Imperative: Experiences and Conjectures in Distributed Logic (2010)](https://scholar.google.com/scholar?cluster=1374149560926608837&hl=en&as_sdt=0,5)
**Summary.**
With (a strict interpretation of) Moore's Law in decline and an overabundance
of compute resources in the cloud, performance necessitates parallelism. The
rub?  Parallel programming is difficult. Contemporaneously, Datalog (and
variants) have proven effective in an increasing number of domains from
networking to distributed systems. Better yet, declarative logic programming
allows for programs to be built with orders of magnitude less code and permits
formal reasoning. In this invited paper, Joe discusses his experiences with
distributed declarative programming and conjectures some deep connections
between logic and distributed systems.

Joe's group has explored many distributed Datalog variants, the latest of which
is *Dedalus*. Dedalus includes notions of time: both intra-node atomicity and
sequencing and inter-node causality. Every table in Dedalus includes a
timestamp in its rightmost column. Dedalus' rules are characterized by how they
interact with these timestamps:

- *Deductive rules* involve a single timestamp. They are traditional Datalog
  stamements.
- *Inductive rules* involve a head with a timestamp one larger than the
  timestamps of the body. They represent the creation of facts from one point
  in time to the next point in time.
- *Asynchronous rules* involve a head with a non-deterministically chosen
  timestamp. These rules capture the notion of non-deterministic message
  delivery.

Joe's group's experience with distributed logic programming lead to the
following conclusions:

- Datalog can very concisely express distributed algorithms that involved
  recursive computations of transitive closures like web crawling.
- Annotating relations with a location specifier column allows tables to be
  transparently partitions and allows for declarative communication: a form of
  "network data independence". This could permit many networking optimizations.
- Stratifying programs based on timesteps introduces a notion of
  transactionality. Every operation taking place in the same timestamp occurs
  atomically.
- Making all tables ephemeral and persisting data via explicit inductive rules
  naturally allows transience in things like soft-state caches without
  precluding persistence.
- Treating events as a streaming join of inputs with persisted data is an
  alternative to threaded or event-looped parallel programming.
- Monotonic programs parallelize embarrassingly well. Non-monotonicity requires
  coordination and coordination requires non-monotonicity.
- Logic programming has its disadvantages. There is code redundancy; lack of
  scope, encapsulation, and modularity; and providing consistent distributed
  relations is difficult.

The experience also leads to a number of conjectures:

- The CALM conjecture stats that programs that can be expressed in monotonic
  Datalog are exactly the programs that can be implemented with
  coordination-free eventual consistency.
- Dedalus' asynchronous rules allow for an infinite number of traces. Perhaps,
  all these traces are confluent and result in the same final state. Or perhaps
  they are all equivalent for some notion of equivalence.
- The CRON conjecture states that messages sent to the past lead only to
  paradoxes if the message has non-monotonic implications.
- If computation today is so cheap, then the real computation cost comes from
  coordination between strata. Thus, the minimum number of Dedalus timestamps
  required to implement a program represents its minimum *coordination
  complexity*.
- To further decrease latency, programs can be computed approximately either by
  providing probabilistic bounds on their outputs or speculatively executing
  and fixing results in a post-hoc manner.
