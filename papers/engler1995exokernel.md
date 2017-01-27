## [Exokernel: An Operating System Architecture for Application-Level Resource Management (1995)](https://scholar.google.com/scholar?cluster=4636448334605780007&hl=en&as_sdt=0,5)
**Summary.**
Monolithic kernels provide a large number of abstractions (e.g. processes,
files, virtual memory, interprocess communication) to applications.
Microkernels push some of this functionality into user space but still provide
a fixed set of abstractions and services. Providing these inextensible fixed
abstractions is detrimental to applications.

- An application cannot be best for all applications. Tradeoffs must be made
  which can impact performance for some applications.
- A rigid set of abstractions can make it difficult for an application to layer
  on its own set of abstractions. For example, a user level threads package may
  encounter some difficulties of not having access to page faults.
- Having a rigid set of abstractions means the abstractions are rarely updated.
  Innovative OS features are seldom integrated into real world OSes.

The exokernel operating system architecture takes a different approach. It
provides protected access to hardware and nothing else. All abstractions are
implemented by library operating systems. The exokernel purely provides
protected access to the unabstracted underlying hardware.

The exokernel interface governs how library operating systems get, use, and
release resources. Exokernels follow the following guidelines.

- *Securely expose hardware.* All the details of the hardware (e.g. privileged
  instructions, DMA) should be exposed to libOSes.
- *Expose allocation.* LibOSes should be able to request physical resources.
- *Expose physical names.* The physical names of resources (e.g. physical page
  5) should be exposed.
- *Expose revocation.* LibOSes should be notified when resources are revoked.

Exokernels use three main techniques to ensure protected access to the
underlying hardware.

1. *Secure bindings.* A secure binding decouples authorization from use and is
   best explained through an example. A libOS can request that a certain entry
   be inserted into a TLB. The exokernel can check that the entry is valid.
   This is the authorization. Later, the CPU can use the TLB without any
   checking. This is use. The TLB entry can be used multiple times after being
   authorized only once.

   There are three forms of secure bindings. First are hardware mechanism like
   the TLB entries or screens in which each pixel is tagged with a process.
   Second are software mechanisms like TLB caching or packet filters. Third is
   downloading and executing code using type-safe languages, interpretation, or
   sandboxing. Exokernels can download Application-Specific Safe Handlers
   (ASHes).
2. *Visible resource revocation.* In traditional operating systems, resource
   revocation is made invisible to applications. For example, when an
   application's page is swapped to disk, it is not notified. The exokernel
   makes resource revocation visible by notifying the libOS. For example, each
   libOS is notified when its quantum is over. This allows it do things like
   only store the registers it needs.
3. *Abort protocol.* If a libOS is misbehaving and not responding to revocation
   requests, the exokernel can forcibly remove allocations. Naively, it could
   kill the libOS. Less naively, ti can simply remove all secure bindings.

The paper also presents the Aegis exokernel and the ExOS library operating
system.
