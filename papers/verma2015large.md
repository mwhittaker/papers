## [Large-scale cluster management at Google with Borg (2015)](https://scholar.google.com/scholar?cluster=18268680833362692042&hl=en&as_sdt=0,5)
**Summary.**
Borg is Google's cluster manager. Users submit *jobs*, a collection of *tasks*,
to Borg which are then run in a single *cell*, many of which live inside a
single *cluster*. Borg jobs are either high priority latency-sensitive
*production* jobs (e.g. user facing products and core infrastructure) or low
priority *non-production* batch jobs. Jobs have typical properties like name
and owner and can also express constraints (e.g. only run on certain
architectures). Tasks also have properties and state their resource demands.
Borg jobs are specified in BCL and are bundled as statically linked
executables. Jobs are labeled with a priority and must operate within quota
limits.  Resources are bundled into *allocs* in which multiple tasks can run.
Borg also manages a naming service, and exports a UI called Sigma to
developers.

Cells are managed by five-way replicated *Borgmasters*. A Borgmaster
communicates with *Borglets* running on each machine via RPC, manages the Paxos
replicated state of system, and exports information to Sigma. There is also a
high fidelity borgmaster simulator known as the Fauxmaster which can used for
debugging.

One subcomponent of the Borgmaster handles scheduling. Submitted jobs are
placed in a queue and scheduled by priority and round-robin within a priority.
Each job undergoes feasibility checking where Borg checks that there are enough
resources to run the job and then scoring where Borg determines the best place
to run the job. Worst fit scheduling spreads jobs across many machines allowing
for spikes in resource usage. Best fit crams jobs as closely as possible which
is bad for bursty loads. Borg uses a scheduler which attempts to limit
"stranded resources": resources on a machine which cannot be used because other
resources on the same machine are depleted. Tasks that are preempted are placed
back on the queue. Borg also tries to place jobs where their packages are
already loaded, but offers no other form of locality.

Borglets run on each machine and are responsible for starting and stopping
tasks, managing logs, and reporting to the Borgmaster. The Borgmaster
periodically polls the Borglets (as opposed to Borglets pushing to the
Borgmaster) to avoid any need for flow control or recovery storms.

The Borgmaster performs a couple of tricks to achieve high scalability.

- The scheduler operates on slightly stale state, a form of "optimistic
  scheduling".
- The Borgmaster caches job scores.
- The Borgmaster performs feasibility checking and scoring for all equivalent
  jobs at once.
- Complete scoring is hard, so the Borgmaster uses randomization.

The Borgmaster puts the onus of fault tolerance on applications, expecting them
to handle occasional failures. Still, the Borgmaster also performs a set of
nice tricks for availability.

- It reschedules evicted tasks.
- It spreads tasks across failure domains.
- It limits the number of tasks in a job that can be taken down due to
  maintenance.
- Avoids past machine/task pairings that lead to failure.

To measure cluster utilization, Google uses a *cell compaction* metric: the
smallest a cell can be to run a given workload. Better utilization leads
directly to savings in money, so Borg is very focused on improving utilization.
For example, it allows non-production jobs to reclaim unused resources from
production jobs.

Borg uses containers for isolation. It also makes sure to throttle or kill jobs
appropriately to ensure performance isolation.

