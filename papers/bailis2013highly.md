## [Highly Available Transactions: Virtues and Limitations (2014)](TODO) ##
**Summary.**
Serializability is the gold standard of consistency, but databases have always
provided weaker consistency modes (e.g. Read Committed, Repeatable Read) that
promise improved performance. In this paper, Bailis et al. determine which of
these weaker consistency models can be implemented with high availability.

First, why is high availability important?

1. *Partitions.* Partitions happen, and when they do non-available systems
   become, well, unavailable.
2. *Latency.* Partitions may be transient, but latency is forever. Highly
   available systems can avoid latency by eschewing coordination costs.

Second, are weaker consistency models consistent enough? In short, yeah
probably. In a survey of databases, Bailis finds that many do not employ
serializability by default and some do not even provide full serializability.
Bailis also finds that four of the five transactions in the TPC-C benchmark can
be implemented with highly available transactions.

After defining availability, Bailis presents the taxonomy of which consistency
can be implemented as HATs, and also argues why some fundamentally cannot. He
also performs benchmarks on AWS to show the performance benefits of HAT.
