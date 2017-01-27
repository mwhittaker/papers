## [Apache Hadoop YARN: Yet Another Resource Negotiator (2013)](https://scholar.google.com/scholar?cluster=3355598125951377731&hl=en&as_sdt=0,5)
**Summary.**
Hadoop began as a MapReduce clone designed for large scale web crawling. As big
data became trendy and data became... big, Hadoop became the de facto
standard data processing system, and large Hadoop clusters were installed in
many companies as "the" cluster. As application requirements evolved, users
started abusing the large Hadoop in unintended ways. For example, users would
submit map-only jobs which were thinly guised web servers. Apache Hadoop YARN
is a cluster manager that aims to disentangle cluster management from
programming paradigm and has the following goals:

- Scalability
- Multi-tenancy
- Serviceability
- Locality awareness
- High cluster utilization
- Reliability/availability
- Secure and auditable operation
- Support for programming model diversity
- Flexible resource model
- Backward compatibility

YARN is orchestrated by a per-cluster *Resource Manager* (RM) that tracks
resource usage and node liveness, enforces allocation invariants, and
arbitrates contention among tenants. *Application Masters* (AM) are responsible
for negotiating resources with the RM and manage the execution of single job.
AMs send ResourceRequests to the RM telling it resource requirements, locality
preferences, etc. In return, the RM hands out *containers* (e.g.  <2GB RAM, 1
CPU>) to AMs. The RM also communicates with Node Managers (NM) running on each
node which are responsible for measuring node resources and managing (i.e.
starting and killing) tasks. When a user want to submit a job, it sends it to
the RM which hands a capability to an AM to present to an NM. The RM is a
single point of failure. If it fails, it restores its state from disk and kills
all running AMs. The AMs are trusted to be faul-tolerant and resubmit any
prematurely terminated jobs.

YARN is deployed at Yahoo where it manages roughly 500,000 daily jobs. YARN
supports frameworks like Hadoop, Tez, Spark, Dryad, Giraph, and Storm.

