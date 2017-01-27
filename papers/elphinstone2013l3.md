## [From L3 to seL4 What Have We Learnt in 20 Years of L4 Microkernels? (2013)](https://scholar.google.com/scholar?cluster=10669327659248325680&hl=en&as_sdt=0,5)
**Summary.**
Inter process communication (IPC) was on the critical path of microkernels like
Mach. Traditionally, each IPC took roughly 100 microseconds and was considered
a bit high. In 1993, Jochen Liedtke introduced the L4 microkernel and showed
that IPC could be implemented 10 to 20 times faster. In the next 20 years, L4
developed a rich family of descendants and many lessons have been learned.

Lessons in design:

- *Minimality.* All functionality that can live outside the kernel should live
  outside the kernel. Moreover, all policy should be lifted out of the kernel
  leaving only mechanisms.
- *Synchronous IPC.* The original L4 implementation used synchronous RPC in
  which both the sender and receiver block until the sender calls send and the
  receiver calls receive. This can be implemented efficiently, but forces
  programs to be multithreaded in order to handle multiple inputs. Later
  version of L4 implemented asynchronous IPC in which a sender could send
  without blocking and a receiver could block or poll the receipt of a message.
- *IPC message structure.* The original L4 implementations allowed processes to
  send messages directly via physical registers. This technique was limited by
  the number of physical registers and was a bit clunky. Later version of L4
  introduced virtual registers which were either backed by physical registers
  or by a pinned page of memory.
- *IPC destinations.* Originally, IPC destinations were thread identifiers, but
  this exposed a great deal of information. Later, IPC destinations were
  changed to more port-like endpoints.
- *IPC timeouts.* If a client and server are exchanging messages via IPC, then
  a client can send a message, the server will receive the message and issue a
  send response. If the client never calls receive, then the server is blocked.
  This allows clients to DOS servers. To avoid this, tasks can associate a
  timeout with an IPC call. Originally timeouts could be set at 0, infinity, or
  anywhere from microseconds to weeks. In reality, most programs only used 0 or
  infinity.
- *Communication control.* Tasks were organized into groups called *clans* and
  every clan had a designated *chief*. Messages within a clan could flow
  freely, but messages between clans had to be forwarded through the chief.
  This was weird and later dropped.
- *User-level device drivers.* Putting device drivers in user space has
  remained a good idea.
- *Process hierarchy.* A finite number of task IDs was allocated and
  distributed in a first come first serve fashion. This was later replaced with
  a capability based system.
- *Time.* L4 implements a round-robin priority scheduler. People have tried to
  move the scheduling into user space, but it has yet to be done without
  significant overhead.

Lessons in implementation:

- *Process orientation and virtual TCB array.* Threads' kernel stack was
  allocated above their TCB.
- *Lazy scheduling.* When a thread blocked, it was marked as blocked but not
  yet removed from the ready queue. When the scheduler selected the next task
  to run, it would iterate through the ready queue until it found an actually
  ready task. This meant that scheduling time was bounded only by the number of
  threads. This was later replaced by Benno scheduling.
- *Direct process switch.* When a thread blocked on IPC, the scheduler would
  immediately run another task in its quantum regardless of priority. This
  direct process switch mechanism was kept but made to respect priorities.
- *Preemption.* Most L4 implementations have a nonpreemptable kernel with
  strategic preemption points.
- *Non-portability.* L4 used to be platform specific but now is very portable.
- *Non-standard calling convention.* To get maximum performance, L4 was written
  in assembly and uses weird calling conventions. When implementations moved to
  C and C++, this was removed.
- *Implementation language.* Implementation moved to C and a bit of C++.
