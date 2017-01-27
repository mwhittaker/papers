## [Xen and the Art of Virtualization (2003)](https://scholar.google.com/scholar?cluster=11605682627859750448&hl=en&as_sdt=0,5)
**Summary.**
Many virtual machine monitors, or *hypervisors*, aim to run unmodified guest
operating systems by presenting a completely virtual machine. This lets any OS
run on the hypervisor but comes with a significant performance penalty. Xen is
an x86 hypervisor that uses *paravirtualization* to reduce virtualization
overheads. Unlike with full virtualization, paravirtualization only virtualizes
some components of the underlying machine. This paravirtualization requires
modifications to the guest operating systems but not the applications running
on it. Essentially, Xen sacrifices the ability to run unmodified guest
operating systems for improved performance.

There are three components that need to be paravirtualized:

- *Memory management.* Software page tables and tagged page tables are easier
  to virtualize. Unfortunately, x86 has neither. Xen paravirtualizes the
  hardware accessible page tables leaving guest operating systems responsible
  for managing them. Page table modifications are checked by Xen.
- *CPU.* Xen takes advantage of x86's four privileges, called *rings*. Xen runs
  at ring 0 (the most privileged ring), the guest OS runs at ring 1, and the
  applications running in the guest operating systems run at ring 3.
- *Device I/O.* Guest operating systems communicate with Xen via bounded
  circular producer/consumer buffers. Xen communicates to guest operating
  systems using asynchronous notifications.

The Xen hypervisor implements mechanisms. Policy is delegated to a privileged
domain called dom0 that has accessed to privileges that other domains don't.

Finally, a look at some details about Xen:

- *Control transfer.* Guest operating systems request services from the
  hypervisor via *hypercalls*. Hypercalls are like system calls except they are
  between a guest operating system and a hypervisor rather than between an
  application and an operating system. Furthermore, each guest OS registers
  interrupt handlers with Xen. When an event occurs, Xen toggles a bitmask to
  indicate the type of event before invoking the registered handler.
- *Data transfer.* As mentioned earlier, data transfer is performed using a
  bounded circular buffer of I/O descriptors. Requests and responses are pushed
  on to the buffer. Requests can come out of order with respect to the
  requests. Moreover, requests and responses can be batched.
- *CPU Scheduling.* Xen uses the BVT scheduling algorithm.
- *Time and timers.* Xen supports real time (the time in nanoseconds from
  machine boot), virtual time (time that only increases when a domain is
  executing), and clock time (an offset added to the real time).
- *Virtual address translation.* Other hypervisors present a virtual contiguous
  physical address space on top of the actual hardware address space. The
  hypervisor maintains a shadow page table mapping physical addresses to
  hardware addresses and installs real page tables into the MMU. This has high
  overhead. Xen takes an alternate approach. Guest operating systems issue
  hypercalls to manage page table entries that are directly inserted into the
  MMU's page table. After they are installed, the page table entries are
  read-only.
- *Physical memory.* Memory is physically partitioned into reservations.
- *Network.* Xen provides virtual firewall-routers with one or more virtual
  network interfaces, each with a circular ring buffer.
- *Disk.* Xen presents virtual block devices each with a ring buffer.
