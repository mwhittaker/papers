# [Experience with Processes and Monitors in Mesa (1980)](https://scholar.google.com/scholar?cluster=492255216248422903)
In 1980, synchronization primitives like semaphores, monitors, and condition
variables had been well studied in the literature, but there weren't any large
systems implementing them. Mesa was a programming language that was being
developed to write the Pilot operating system at Xerox. Due to the inherent
concurrency of an operating system, Mesa was designed to ease the development
of concurrent programs. The Mesa designers considered implementing a message
passing interface, but deemed it too complex. They considered semaphores, but
found them too undisciplined. They considered cooperative multi-threading but
came upon a number of serious disadvantages:

- Cooperative multithreading cannot take advantage of multiple cores.
- Preemption is already required to service time-sensitive I/O devices.
- Cooperation is at odds with modularity. Critical sections have no principled
  way of knowing if they are calling a function which yields control.

Eventually, Mesa settled on implementing monitors and condition variables and
exposed a number of previously undiscussed issues:

- What is the interface for dynamically spawning threads and waiting for them
  to terminate?
- What is the interface for dynamically constructing monitors?
- How are threads scheduled when waiting and notifying each other?
- What are the semantics of `wait` when one monitor calls into another monitor
  which also calls `wait`?
- How are exceptions and I/O devices handled?

Mesa allowed an arbitrary function call to be forked and run by a separate
thread and eventually joined:

```
p <- fork ReadLine[terminal]
...
buffer <- join p
```

Moreover, if a forked thread was not intended to be joined, it could instead be
detached via `detach[p]`. This fork/join style process management had a number
of advantages---(i) processes were first class values, (ii) thread forking was
type checked, and (iii) any procedure could be forked---but also introduced
lots of opportunities for dangling references.

Monitors are objects that only allow a single thread to be executing one of its
functions at any given time. They unify data, synchronization of the data, and
access of the data into one lexical bundle. Mesa monitors included public
**entry preocedures** and private **internal procedures** that operated with
the monitor locked as well as public **external procedures** that operated
without locking the monitor. Monitors, in conjunction with condition variables,
were used to maintain an invariant about an object that was true upon entering
and exiting any of the monitor's methods. Monitors also lead to potential
deadlocks:

- Two monitor methods could wait for one another.
- Two different monitors could enter each other.
- A monitor `M` could enter a monitor `N`, then wait on a condition that could
  only be enabled by another thread entering `M` through `N`.

Special care also had to be taken to avoid priority inversion.

Mesa also introduced Mesa semantics, best explained with this code snippet:

```python
"""
Condition variables typically obey one of two semantics:

1. Under *Hoare semantics* [1], when a thread calls `notify` on a condition
   variable, the execution of one of the threads waiting on the condition
   variable is immediately resumed. Thus, a thread that calls `wait` can assume
   very strong invariants are held when it is awoken.
2. Under *Mesa semantics* [2], a call to `notify` is nothing more than a hint.
   Threads calling `wait` can be woken up at any time for any reason.

Understanding the distinction between Hoare and Mesa semantics can be
solidified by way of example. This program implements a concurrent queue (aka
pipe) to which data can be written and from which data can be read. It spawns a
single thread which iteratively writes data into the pipe, and it spawns
`NUM_CONSUMERS` threads that read from the pipe. The producer produces the same
number of items that the consumers consume, so if all goes well, the program
will run and terminate successfully.

Run the program; not all goes well:

    Exception in thread Thread-3:
    Traceback (most recent call last):
      File "/usr/lib/python2.7/threading.py", line 810, in __bootstrap_inner
        self.run()
      File "/usr/lib/python2.7/threading.py", line 763, in run
        self.__target(*self.__args, **self.__kwargs)
      File "hoare_mesa.py", line 66, in consume
        pipe.pop()
      File "hoare_mesa.py", line 52, in pop
        return self.xs.pop(0)
    IndexError: pop from empty list

Why? The pipe is implemented assuming Python condition variables obey Hoare
semantics. They do not. Modify the pipe's implementation assuming Mesa
semantics and re-run the program. Everything should run smoothly!

[1]: https://scholar.google.com/scholar?cluster=16665458100449755173&hl=en&as_sdt=0,5
[2]: https://scholar.google.com/scholar?cluster=492255216248422903&hl=en&as_sdt=0,5
"""

import threading

# The number of objects read from and written to the pipe.
NUM_OBJECTS = 10000

# The number of threads consuming from the pipe.
NUM_CONSUMERS = 2

# An asynchronous queue (a.k.a. pipe) that assumes (erroneously) that Python
# condition variables follow Hoare semantics.
class HoarePipe(object):
    def __init__(self):
        self.xs = []
        self.lock = threading.Lock()
        self.data_available = threading.Condition(self.lock)

    # Pop the first element from the pipe, blocking if necessary until data is
    # available.
    def pop(self):
        with self.lock:
            # This code is incorrect beacuse Python condition variables follows
            # Mesa, not Hoare, semantics. To correct the code, simply replace
            # the `if` with a `while`.
            if len(self.xs) == 0:
                self.data_available.wait()
            return self.xs.pop(0)

    # Push a value to the pipe.
    def push(self, x):
        with self.lock:
            self.xs.append(x)
            self.data_available.notify()

def produce(pipe):
    for i in range(NUM_OBJECTS):
        pipe.push(i)

def consume(pipe):
    assert NUM_OBJECTS % NUM_CONSUMERS == 0
    for i in range(NUM_OBJECTS / NUM_CONSUMERS):
        pipe.pop()

def main():
    pipe = HoarePipe()
    producer = threading.Thread(target=produce, args=(pipe,))
    consumers = [threading.Thread(target=consume, args=(pipe,))
                 for i in range(NUM_CONSUMERS)]

    producer.start()
    for consumer in consumers:
        consumer.start()

    producer.join()
    for consumer in consumers:
        consumer.join()

if __name__ == "__main__":
    main()
```

Threads waiting on a condition variable could also be awoken by a timeout, an
abort, or a broadcast (e.g. `notify_all`).

Mesa's implementation was divided between the processor, a runtime, and the
compiler. The processor was responsible for process management and scheduling.
Each process was on a ready queue, monitor lock queue, condition variable
queue, or fault queue. The runtime was responsible for providing the fork/join
interface. The compiler performed code generation and a few static sanity
checks.

Mesa was evaluated by Pilot (an OS), Violet (a distributed calendar), and
Gateway (a router).

<link href='../default_highlight.css' rel='stylesheet'>
<script src="../highlight.pack.js"></script>
<script>hljs.initHighlightingOnLoad();</script>
