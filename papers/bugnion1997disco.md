## [Disco: Running Commodity Operating Systems on Scalable Multiprocessors (1997)](https://scholar.google.com/scholar?cluster=17298410582406300869&hl=en&as_sdt=0,5)
**Summary.**
Operating systems are complex, million line code bases. Multiprocessors were
becoming popular, but it was too difficult to modify existing commercial
operating systems to take full advantage of the new hardware. Disco is a
*virtual machine monitor*, or *hypervisor*, that uses virtualization to run
commercial virtual machines on cache-coherent NUMA multiprocessors. Guest
operating systems running on Disco are only slightly modified, yet are still
able to take advantage of the multiprocessor. Moreover, Disco offers all the
traditional benefits of a hypervisor (e.g. fault isolation).

Disco provides the following interfaces:

- *Processors.* Disco provides full virtualization of the CPU allowing for
  restricted direct execution. Some privileged registers are mapped to memory
  to allow guest operating systems to read them.
- *Physical memory.* Disco virtualizes the guest operating system's physical
  address spaces, mapping them to hardware addresses. It also supports page
  migration and replication to alleviate the non-uniformity of a NUMA machine.
- *I/O devices.* All I/O communication is simulated, and various virtual disks
  are used.

Disco is implemented as follows:

- *Virtual CPUs.* Disco maintains the equivalent of a process table entry for
  each guest operating system. Dicso runs in kernel mode, guest operating
  systems run in supervisor mode, and applications run in user mode.
- *Virtual physical memory.* To avoid the overhead of physical to hardware
  address translation, Disco maintains a large software physical to hardware
  TLB.
- *NUMA.* Disco migrates pages to the CPUs that access them frequently, and
  replicates read-only pages to the CPUs that read them frequently. This
  dynamic page migration and replications helps mask the non-uniformity of a
  NUMA machine.
- *Copy-on-write disks.* Disco can map physical addresses in different guest
  operating systems to a read-only page in hardware memory. This lowers the
  memory footprint of running multiple guest operating systems. The shared
  pages are copy-on-write.
- *Virtual network interfaces.* Disco runs a virtual subnet over which guests
  can communicate using standard communication protocols like NFS and TCP.
  Disco uses a similar copy-on-write trick as above to avoid copying data
  between guests.
