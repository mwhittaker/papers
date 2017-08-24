# [Resilient Distributed Datasets: A Fault-Tolerant Abstraction for In-Memory Cluster Computing (2012)](TODO) ##
Frameworks like MapReduce made processing large amounts of data easier, but
they did not leverage distributed memory. If a MapReduce was run iteratively,
it would write all of its intermediate state to disk: something that was
prohibitively slow. This limitation made batch processing systems like
MapReduce ill-suited to *iterative* (e.g. k-means clustering) and *interactive*
(e.g. ad-hoc queries) workflows. Other systems like Pregel did take advantage
of distributed memory and reused the in-memory data across computations, but
the systems were not general-purpose.

Spark uses **Resilient Distributed Datasets** (RDDs) to perform general
computations in memory. RDDs are immutable partitioned collections of records.
Unlike pure distributed shared memory abstractions which allow for arbitrary
fine-grained writes, RDDs can only be constructed using coarse-grained
transformations from on-disk data or other RDDs. This weaker abstraction can be
implemented efficiently. Spark also uses RDD lineage to implement low-overhead
fault tolerance. Rather than persist intermediate datasets, the lineage of an
RDD can be persisted and efficiently recomputed. RDDs could also be
checkpointed to avoid the recomputation of a long lineage graph.

Spark has a Scala-integrated API and comes with a modified interactive
interpreter. It also includes a large number of useful **transformations**
(which construct RDDs) and **actions** (which derive data from RDDs). Users can
also manually specify RDD persistence and partitioning to further improve
performance.

Spark subsumed a huge number of existing data processing frameworks like
MapReduce and Pregel in a small amount of code. It was also much, much faster
than everything else on a large number of applications.
