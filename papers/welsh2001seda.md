## [SEDA: An Architecture for Well-Conditioned, Scalable Internet Services (2001)](https://goo.gl/wrn04s) ##
**Summary.**
Writing distributed Internet applications is difficult because they have to
serve a huge number of requests, and the number of requests is highly variable
and bursty. Moreover, the applications themselves are also complicated pieces
of code. This paper introduces the *staged event-driven architecture* (SEDA)
which has the following goals.

- *Massive concurrency.* Applications written using SEDA should be able to
  support a very large number of clients.
- *Simplify the construction of well-conditioned services.* A
  *well-conditioned* service is one that gracefully degrades. Throughput
  increases with the number of clients until it saturates at some threshold. At
  this point, throughput remains constant and latency increases proportionally
  with the number of clients. SEDA is designed to make writing well-conditioned
  services easy.
- *Enable introspection.* SEDA applications should be able to inspect and adapt
  to incoming request queues. Some request-per-thread architectures, for
  example, do not enable introspection. Control over thread scheduling is left
  completely to the OS; it cannot be adapted to the queue of incoming
  requests.
- *Self-tuning resource management.* SEDA programmers should not have to tune
  knobs themselves.


SEDA accomplishes these goals by structuring applications as a *network* of
*event-driven stages* connected by *explicit message queues* and managed by
*dynamic resource controllers*. That's a dense sentence, so let's elaborate.

Threading based concurrency models have scalability limitations due to the
overheads of context switching, poor caching, synchronization, etc. The
[event-driven concurrency
model](http://pages.cs.wisc.edu/~remzi/OSTEP/threads-events.pdf) involves
nothing more than a single-threaded loop that reads messages and processes
them. It avoids many of the scalability limitations that threading models face.
In SEDA, the atomic unit of execution is a *stage* and is implemented using an
event-driven concurrency model. Each stage has an input queue of messages which
are read in batches by a thread pool and processed by a user-provided event
handler which can in turn write messages to other stages.

A SEDA application is simply a network (i.e. graph) of interconnected stages.
Notably, the input queue of every stage is finite. This means that when one
stage tries to write data to the input queue of another stage, it may fail.
When this happens, stages have to block (i.e. pushback), start dropping
requests (i.e. load shedding), degrade service, deliver an error to the user,
etc.

To ensure SEDA applications are well-conditioned, various resource managers
tune SEDA application parameters to ensure consistent performance. For example,
the *thread pool controller* scales the number of threads within stages based
on the number of messages in its input queue. Similarly, the *batching
controller* adjusts the size of the batch delivered to each event handler.

The authors developed a SEDA prototype in Java dubbed Sandstorm. As with all
event-driven concurrency models, Sandstorm depends on asynchronous I/O
libraries. It implements asynchronous network I/O as three stages using
existing OS functionality (i.e. select/poll). It implements asynchronous file
I/O using a dynamically resizable thread pool that issues synchronous calls; OS
support for asynchronous file I/O was weak at the time. The authors evaluate
Sandstorm by implementing and evaluating an HTTP server and Gnutella router.
