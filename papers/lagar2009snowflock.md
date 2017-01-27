## [SnowFlock: Rapid Virtual Machine Cloning for Cloud Computing (2009)](https://scholar.google.com/scholar?cluster=3030124086251534312&hl=en&as_sdt=0,5)
**Summary.**
Public clouds like Amazon's EC2 or Google's Compute Engine allow users to
elastically spawn a huge number virtual machines on a huge number of physical
machines. However, spawning a VM can take on the order of minutes, and
typically spawned VMs are launched in some static initial state. SnowFlock
implements the VM fork abstraction, in which a parent VM forks a set of
children VMs all of which inherit a snapshot of the parent. Moreover, SnowFlock
implements this abstraction with subsecond latency. A subsecond VM fork
implementation can be used for sandboxing, parallel computation (the focus of
this paper), load handling, etc.

SnowFlock is built on top of Xen. Specifically, it is a combination of
modifications to the Xen hypervisor and a set of daemons running in dom0 which
together forms a distributed system that manages virtual machine forking.
Guests use a set of calls (i.e. `sf_request_ticket`, `sf_clone`, `sf_join`,
`sf_kill`, and `sf_exit`) to request resources on other machines, fork
children, wait for children, kill children, and exit from a child. This implies
that applications must be modified.  SnowFlock implements the forking mechanism
and leaves policy to pluggable cluster framework management software.

SnowFlock takes advantage of four insights with four distinct implementation
details.

1. VMs can get very large, on the order of a couple of GBs. Copying these
   images between physical machines can saturate the network, and even when
   implemented using things like multicast, can still be slow. Thus, SnowFlock
   must reduce the amount of state transfered between machines. SnowFlock takes
   advantage of the fact that a newly forked VM doesn't need the entire VM
   image to start running. Instead, SnowFlock uses *VM Descriptors*: a
   condensed VM image that consists of VM metadata, a few memory pages,
   registers, a global descriptor table, and page tables. When a VM is forked,
   a VM descriptor for it is formed and sent to the children to begin running.
2. When a VM is created from a VM descriptor, it doesn't have all the memory it
   needs to continue executing. Thus, memory must be sent from the parent when
   it is first accessed. Parent VMs use copy-on-write to maintain an immutable
   copy of memory at the point of the snapshot. Children use Xen shadow pages
   to trap accesses to pages not yet present and request them from the parent
   VM.
3. Sometimes VMs access memory that they don't really need to get from the
   parent. SnowFlock uses two *avoidance heuristics* to avoid the transfer
   overhead. First, if new memory is being allocated (often indirectly through
   a call to something like malloc), the memory contents are not important and
   do not need to be paged in from the parent. A similar optimization is made
   for buffers being written to by devices.
4. Finally, parent and children VMs often access the same code and data.
   SnowFlock takes advantage of this data locality by prefetching; when one
   child VM requests a page of memory, the parent multicasts it to all
   children.

Furthermore, the same copy-on-write techniques to maintain an immutable
snapshot of memory are used on the disk. And, the parent and children virtual
machines are connected by a virtual subnet in which each child is given an IP
address based on its unique id.
