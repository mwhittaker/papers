## [The HP AutoRAID hierarchical storage system (1996)](https://goo.gl/x8Ps2t) ##
**Summary.**
The HP AutoRAID is a hierarchical storage system which caches write-active data
using RAID-1 and stores write-inactive data using RAID-5. The main idea is that
[RAID-1 has higher throughput and lower latency for random
writes](http://pages.cs.wisc.edu/~remzi/OSTEP/file-raid.pdf) but requires more
storage than RAID-5. The AutoRAID system essentially introduces a new level in
the memory hierarchy by using one RAID level (i.e. RAID-1) to cache another
(i.e. RAID-5).

The AutoRAID system implements the following features and functionality:

- Data is dynamically moved between the RAID-1 cache and the RAID-5 storage
  based on the workload.
- Devices can be installed into the system while it is running. For example, a
  new disk can plugged in to an HP AutoRAID device while it is being used. This
  allows for things like rolling disk upgrades.
- If a controller fails, another is ready as backup.
- Writes are written sequentially to the tail of the RAID-5 storage similar to
  a log structured file system.

An HP AutoRAID devices comprises the typical RAID hardware: microprocessors,
disks, volatile memory, non-volatile memory, parity modules, etc. The disks are
divided into (typically 1MB) *physical extents* (PEX) which are grouped into
*physical extent groups* (PEG). Moreover, each PEX is divided into *segments*:
the atomic units used for mirroring or striping.

The logical data model is based on 64 KB *relocation blocks* (RB) that are the
atomic unit of logical data movement. Each AutoRAID device contains multiple
levels of maps (i.e. virtual device table, PEG table, PEX table) to map logical
addresses to physical addresses.

The HP AutoRAID device caches reads and caches writes into NVRAM before issuing
them to the backend (which allows for things like *write coalescing*). If data
is being written and is in the RAID-1 cache, it is written there. Otherwise, it
is promoted from the RAID-5 storage and brought into the RAID-1 cache. Reads
and writes issued to the RAID-1 cache are trivial. Reads from the RAID-5
storage is also simple. Writes to the RAID-5 storage are always appended and
also batched to reduce the number of times parity bits that have to be read,
computed, and written.

Background operations are triggered when the disk is idle and include:

- *Compaction and hole plugging.* Holes in the RAID-1 cache are formed when
  blocks are demoted to RAID-5. Dually, holes in RAID-5 are formed when they
  are promoted to RAID-1 cache. RAID-1 data can be relocated to fill RAID-1
  holes. Similarly, RAID-5 PEGs with few holes can have their holes filled by
  other RAID-5 PEGs that have lots of holes.  Alternatively, RAID-5 PEGs with
  lots of holes can be appended to the RAID-5 storage and reclaimed.
- *Migration* Data is sometimes preemptively demoted from RAID-1 in
  anticipation of accommodating write bursts.
- *Workload Logging*. To create disk traces, I/O requests are logged.

**Commentary.**
- There are a lot of RAID levels and each one has different capacity,
  performance, and reliability. Moreover, performance depends heavily on
  workload. This paper presents the AutoRAID system without much explanation
  for when or why it's expected to perform better than alternatives. For
  example, is AutoRAID only better for random-write workloads? The
  microbenchmarks show that it performs well under sequential writes as well,
  but isn't RAID-1 supposed to perform poorly with sequential writes?
- The AutoRAID system is supposed to be easier to configure than traditional
  RAID devices. The authors argue that typical RAID configuration requires
  detailed knowledge of the expected workloads which can be difficult to come
  by. However, the AutoRAID system also depends on expected workload knowledge.
  The paper admits that the working write set has to be small and slowly
  changing. Later in the paper, the authors also say "it is fairly easy to
  predict or detect the environments that have a large write working-set and to
  avoid them if necessary"; a bit contradictory from earlier. Finally, the
  summary says "there are workloads that do not suit its algorithms well".
- I think the evaluation of the system makes it unclear whether the
  hierarchical storage or the NVRAM caching is responsible for the performance
  improvements.
- The AutoRAID system logs all I/O operations made to it in order to form disk
  traces. Implementing this functionality in the disk device is arguably a
  violation of the end-to-end principle and could have been implemented in the
  OS. However, they argue that the performance overhead is negligible.
