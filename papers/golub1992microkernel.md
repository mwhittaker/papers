# [Microkernel Operating System Architecture and Mach (1992)](https://scholar.google.com/scholar?cluster=1074648542567860981)
A **microkernel** is a very minimal, very low-level piece of code that
interfaces with hardware to implement the functionality needed for an operating
system.  Operating systems implemented using a microkernel architecture, rather
than a monolithic kernel architecture, implement most of the operating system
in user space on top of the microkernel.  This architecture affords many
advantages including:

- **tailorability**: many operating systems can be run on the same microkernel
- **portability**: most hardware-specific code is in the microkernel
- **network accessibility**: operating system services can be provided over the
  network
- **extensibility**: new operating system environments can be tested along side
  existing ones
- **real-time**: the kernel does not hold locks for very long
- **multiprocessor support**: microkernel operations can be parallelized across
  processors
- **multicomputer support**: microkernel operations can be parallelized across
  computers
- **security**: a microkernel is a small trusted computing base

This paper describes various ways in which operating systems can be implemented
on top of the Mach microkernel. Mach's key features include:

- **task and thread management**: Mach supports tasks (i.e. processes) and
  threads. Mach implements a thread scheduler, but privileged user level
  programs can alter the thread scheduling algorithms.
- **interprocess communication**: Mach implements a capabilities based IPC
  mechanism known as ports. Every object in Mach (e.g. tasks, threads, memory)
  is managed by sending message to its corresponding port.
- **memory object management**: Memory is represented as memory objects managed
  via ports.
- **system call redirection**: Mach allows a number of system calls to be
  caught and handled by user level code.
- **device support**: Devices are represented as ports.
- **user multiprocessing**: Tasks can use a user-level threading library.
- **multicomputer support**: Mach abstractions can be transparently implemented
  on distributed hardware.
- **Continuations**: In a typical operating system, when a thread blocks, all
  of its registers are stored somewhere before another piece of code starts to
  run. Its stack is also left intact. When the blocking thread is resumed, its
  stored registers are put back in place and the thread starts running again.
  This can be wasteful if the thread doesn't need all of the registers or its
  stack. In Mach, threads can block with a continuation: an address and a bunch
  of state. This can be more efficient since the thread only saves what it
  needs to keep executing.

Many different operating systems can be built on top of Mach. It's ideal that
applications built for these operating systems can continue to run unmodified
even when the underlying OS is implemented on top of Mach. A key part of this
virtualization is something called an **emulation library**. An emulation
library is a piece of code inserted into an application's address space. When a
program issues system call, Mach immediately redirects control flow to the
emulation library to process it. The emulation library can then handle the
system call by, for example, issuing an RPC to an operating system server.

Operating systems built on Mach can be architected in one of three ways:

1. The entire operating system can be baked into the emulation library.
2. The operating system can be shoved into a single multithreaded Mach task.
   This architecture can be very memory efficient, and is easy to implement
   since the guest operating system can be ported with very little code
   modification.
3. The operating system can be decomposed into a larger number of smaller
   processes that communicate with one another using IPC. This architecture
   encourages modularity, and allows certain operating system components to be
   reused between operating systems. This approach can lead to inefficiency,
   especially if IPC is not lighting fast!
