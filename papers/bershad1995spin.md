## [SPIN -- An Extensible Microkernel for Application-specific Operating System Services (1995)](https://scholar.google.com/scholar?cluster=4910839957971330989&hl=en&as_sdt=0,5)
**Summary.**
Many operating systems were built a long time ago, and their performance was
tailored to the applications and workloads at the time. More recent
applications, like databases and multimedia applications, are quite different
than these applications and can perform quite poorly on existing operating
systems. SPIN is an extensible microkernel that allows applications to tailor
the operating system to meet their needs.

Existing operating systems fit into one of three categories:

1. They have no interface by which applications can modify kernel behavior.
2. They have a clean interface applications can use to modify kernel behavior
   but the implementation of the interface is inefficient.
3. They have an unconstrained interface that is efficiently implemented but
   does not provide isolation between applications.

SPIN provides applications a way to efficiently and safely modify the behavior
of the kernel. Programs in SPIN are divided into the user-level code and a
spindle: a portion of user code that is dynamically installed and run in the
kernel. The kernel provides a set of abstractions for physical and logical
resources, and the spindles are responsible for managing these resources. The
spindles can also register to be invoked when certain kernel events (i.e. page
faults) occur. Installing spindles directly into the kernel provides
efficiency. Applications can execute code in the kernel without the need for a
context switch.

To ensure safety, spindles are written in a typed object-oriented language.
Each spindle is like an object; it contains local state and a set of methods.
Some of these methods can be called by the application, and some are registered
as callbacks in the kernel. A spindle checker uses a combination of static
analysis and runtime checks to ensure that the spindles meet certain kernel
invariants. Moreover, SPIN relies on advanced compiler technology to ensure
efficient spindle compilation.

General purpose high-performance computing, parallel processing, multimedia
applications, databases, and information retrieval systems can benefit from the
application-specific services provided by SPIN. Using techniques such as

- extensible IPC;
- application-level protocol processing;
- fast, simple, communication;
- application-specific file systems and buffer cache management;
- user-level scheduling;
- optimistic transaction;
- real-time scheduling policies;
- application-specific virtual memory; and
- runtime systems with memory system feedback,

applications can be implemented more efficiently on SPIN than on traditional
operating systems.

