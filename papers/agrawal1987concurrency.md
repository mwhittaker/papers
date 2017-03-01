# [Concurrency Control Performance Modeling: Alternatives and Implications (1987)](https://scholar.google.com/scholar?cluster=9784855600346107276&hl=en&as_sdt=0,5)
## Overview
There are three types of concurrency control algorithms: locking algorithms,
timestamp based algorithms, optimistic algorithms. There have been a large
number of performance analyses aimed at deciding which type of concurrency
algorithm is best, however despite the abundance of analyses, there is no
definitive winner. Different analyses have contradictory results, largely
because there is no standard performance model or set of assumptions. This
paper presents a complete database model for evaluating the performance of
concurrency control algorithms and discusses how varying assumptions affect the
performance of various algorithms.

## Performance Model
This paper analyzes three specific concurrency control mechanisms,

- **Blocking.** Transactions acquire locks before they access a data item.
  Whenever a transaction acquires a lock, deadlock detection is run. If a
  deadlock is detected, the youngest transaction is aborted.
- **Immediate-restart.** Again, transactions acquire locks, but instead of
  blocking if a lock cannot be immediately acquired, the transaction is instead
  aborted and restarted with delay. This delay is adjusted dynamically to be
  roughly equal to the average transaction duration.
- **Optimistic.** Transactions do not acquire locks. A transaction is aborted
  when it goes to commit if it read any objects that had been written and
  committed since the transaction began.

using a closed queueing model of a single-site database. Essentially,
transactions come in, sit in some queues, and are controlled by a concurrency
control algorithm. The model has a number of parameters, some of which are held
constant for all the experiments and some of which are varied from experiment
to experiment. Some of the parameters had to be tuned to get interesting
result. For example, it was found that with a large database and few conflicts,
all concurrency control algorithms performed roughly the same and scaled with
the degree of parallelism.

## Resource-Related Assumptions
Some analyses assume infinite resources. How do these assumptions affect
concurrency control performance?

- **Experiment 1: Infinite Resources.** Given infinite resources, higher
  degrees of parallelism lead to higher likelihoods of transaction conflict
  which in turn leads to higher likelihoods of transaction abort and restart.
  The blocking algorithm thrashes because of these increased conflicts. The
  immediate-restart algorithm plateaus because the dynamic delay effectively
  limits the amount of parallelism. The optimistic algorithm does well because
  aborted transactions are immediately replaced with other transactions.
- **Experiment 2: Limited Resources.** With a limited number of resources, all
  three algorithms thrash, but blocking performs best.
- **Experiment 3: Multiple Resources.** The blocking algorithm performs best up
  to about 25 resource units (i.e. 25 CPUs and 50 disks); after that, the
  optimistic algorithm performs best.
- **Experiment 4: Interactive Workloads.** When transactions spend more time
  "thinking", the system begins to behave more like it has infinite resources
  and the optimistic algorithm performs best.

## Transaction Behavior Assumptions

- **Experiment 6: Modeling Restarts.** Some analyses model a transaction
  restart as the spawning of a completely new transaction. These fake restarts
  lead to higher throughput because they avoid repeated transaction conflict.
- **Experiment 7: Write-Lock Acquisition.** Some analyses have transactions
  acquire read-locks and then upgrade them to write-locks. Others have
  transactions immediately acquire write-locks if the object will ever be
  written to. Upgrading locks can lead to deadlock if two transactions
  concurrently write to the same object. The effect of lock upgrading varies
  with the amount of available resources.
