## [Lottery and Stride Scheduling: Flexible Proportional-Share Resource Management (1994)](https://scholar.google.com/scholar?cluster=15431493885859350148&hl=en&as_sdt=0,5)
Schedulers multiplex scarce resources and can greatly impact the throughput and
response times of a system. Ideally, schedulers service clients with *relative
computation rates*. Existing priority schedulers do this to some degree but are
ad-hoc. Similarly, fair-share and microeconomic schedulers are too coarse. This
paper introduces *lottery scheduling* which implements proportional-share
resource management: consumption rates are proportional to relative shares
allocated.

**Lottery Scheduling.**
Lottery schedulers allocate resource rights to clients in the form of
*tickets*. Lotteries are held, and the client with the winning ticket is
granted the resource.

Tickets are

- *abstract*: tickets are a logical entity independent of underlying machine
  details.
- *relative*: the value of a ticket varies with the total number of tickets.
- *uniform*: heterogeneous resources can be managed homogeneously with tickets.

Lottery scheduling is a probabilistic scheduling algorithm, but when quanta are
small, fairness can be achieved rapidly. Moreover, there is no fear of
starvation. As long as a client has tickets, it will eventually be scheduled.

**Modular Resource Management.**
- *Ticket transfers.* Clients can transfer tickets to others. For example, a
  client blocking on a server can transfer tickets to the server. This
  effectively avoids priority inversion.
- *Ticket inflation.* Mutually trusting applications can inflate or deflate
  tickets in order to change resource allocation without communication.
- *Currencies.* Logically distinct groups of mutually trusting applications can
  establish their own currencies backed by the same base currency. This allows
  for finer grained ticket allocation.
- *Compensation tickets.* If a client runs for only `f` of its quanta, its
  number of tickets is boosted by `1/f` to ensure fairness.

**Implementation.**
The authors implemented a lottery scheduling prototype in the Mach 3.0
microkernel with all of the features listed above and with a 100 ms quantum.

- *Random numbers.* Random numbers are generated using a 10 instruction pseudo-random number generator.
- *Lotteries.* Clients can be stored in a list where each list entry includes
  the number of tickets assigned to the client. Given a ticket number drawn for
  a lottery, the client with that ticket can be found by linearly searching
  through the clients maintaining a partial sum along the way. Sorting clients
  in descending order starting with those with the most tickets decreases the
  number of clients that need to be searched. This can be implemented also with
  a move-to-front policy. Moreover, one could also use a tree or a binary
  search.
- *Mach kernel interface.* Mach provides a minimal interface to create and
  destroy tickets ad currencies, fund currencies, unfund currencies, etc. A
  ticket includes its name and amount. A currency includes a list of backing
  tickets, its name, the amount of tickets allocated, and a list of the
  allocated tickets.
- *Ticket currencies.* Currencies are subdivided into other currencies forming
  a currency graph which makes it easy to translate all currency amounts into a
  base currency amount. The prototype uses a move-to-front linear search with
  partial sums computed in the base currency.
- *Compensation tickets.* Compensation tickets ensure that two clients with the
  same number of tickets execute for the same amount of time even if one of
  them does not use its full quantum. This is good for I/O bound tasks.
- *Ticket transfer.* The prototype instrumented synchronous IPC calls to
  automatically transfer tickets from clients to servers.
- *User interface.* Users can manage tickets through the command line.

**Managing Diverse Resources.**
Lottery scheduling can be used to manage more than CPU quanta.

- *Synchronization resources.* The prototype implements lottery scheduled
  mutexes in which all threads blocked on the mutex transfer tickets to the
  thread who holds the mutex. When the mutex is released, a lottery is held to
  hand it off to one of the waiting threads. This type of mutex does not suffer
  from priority inversion.
- *Space-shared resources.* Lottery scheduling can also be used to multiplex
  space. We run an inverse-lottery in which a loser, as opposed to a winner, is
  chosen. For example, if we need to allocate a physical page to back a virtual
  page, but all the virtual pages are taken, we run an inverse lottery to
  select a loser and flush the page to disk. Each transaction is chosen with
  probability `(1/(n-1))(1 - t/T)` where `n` is the number of clients, `t` is
  the number of tickets for a client, and `T` is the total number of tickets.
  The multiplier is a normalizing factor and the multiplicand is the inverse
  probability.

