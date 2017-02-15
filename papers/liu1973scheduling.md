# [Scheduling Algorithms for Multiprogramming in a Hard-Real-Time Environment (1973)](https://scholar.google.com/scholar?cluster=11972780054098474552&hl=en&as_sdt=0,5)
Consider a hard-real-time environment in which tasks *must* finish within some
time after they are requested. We make the following assumptions.

- (A1) Tasks are periodic with fixed periods.
- (A2) Tasks must finish before they are next requested.
- (A3) Tasks are independent.
- (A4) Tasks have constant runtime.
- (A5) Non-periodic tasks are not realtime.

Thus, we can model each task $t_i$ as a period $T_i$ and runtime $C_i$. A
scheduling algorithm that immediately preempts tasks to guarantee that the task
with the highest priority is running is called a **preemptive priority
scheduling algorithm**. We consider three preemptive priority scheduling
algorithms: a static/fixed priority scheduler (in which priorities are assigned
ahead of time), a dynamic priority scheduler (in which priorities are assigned
at runtime), and a mixed scheduling algorithm.

## Fixed Priority Scheduling Algorithm
First, a few definitions:

- The **deadline** of a task is the time at which the next request is issued.
- An **overflow** occurs at time $t$ if $t$ is the deadline for an unfulfilled
  task.
- A schedule is **feasible** if there is no overflow.
- The response time of a task is the time between the task's request and the
  task's finish time.
- A **critical instant** for task $t$ is the instant where $t$ has the highest
  response time.

It can be shown that the critical instant for any task occurs when the task is
requested simultaneously with all higher priority tasks. This result lets us
easily determine if a feasible fixed priority schedule exists by
pessimistically assuming all tasks are scheduled at their critical instant.

It also suggests that given two tasks with periodicities $T_1$ and $T_2$ where
$T_1 < T_2$, we should give higher priority to the shorter task with period
$T_1$.  This leads to the **rate-monotonic priority scheduling algorithm**
where we assign higher priorities to shorter tasks. A feasible static schedule
exists if and only if a feasible rate-monotonic scheduling algorithm exists.

Define **processor utilization** to be the fraction of time the processor
spends running tasks. We say a set of tasks **fully utilize** the processor if
there exists a feasible schedule for them, but increasing the running time of
any of the tasks implies there is no feasible schedule. The least upper bound
on processor utilization is the minimum processor utilization for tasks that
fully utilize the processor. For $m$ tasks, the least upper bound is $m(2^{1/m}
- 1)$ which approaches $\ln(2)$ for large $m$.

## Deadline Driven Scheduling Algorithm
The **deadline driven scheduling algorithm** (or earliest deadline first
scheduling algorithm) dynamically assigns the highest priority to the task with
the most imminent deadline. This scheduling algorithm has a least upper bound
of 100% processor utilization. Moreover, if any feasible schedule exists for a
set of tasks, a feasible deadline driven schedule exists.

## Mixed Scheduling Algorithm.
Scheduling hardware (at the time) resembled a fixed priority scheduler, but a
dynamic scheduler could be implemented for less frequent tasks. A hybrid
scheduling algorithm scheduled the $k$ most frequent tasks using the
rate-monotonic scheduling algorithm and scheduled the rest using the deadline
driven algorithm.

<script type="text/javascript" async
  src="https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-MML-AM_CHTML">
</script>
