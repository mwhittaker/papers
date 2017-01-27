## [The Five-Minute Rule 20 Years Later (2009)](https://scholar.google.com/scholar?cluster=4362732859860672431&hl=en&as_sdt=0,5)
In 1987, Gray and Putzolu introduced the [five-minute
rule](https://github.com/mwhittaker/five_minute_rule). Ten years later, the
price and performance of hardware had changed, and a new five-minute rule was
formed. Twenty years later, hardware has changed even more (e.g. the rise of
multi-core, hardware virtualization, etc.). One new piece of hardware, flash
memory, is becoming increasingly popular. Flash memory sits between RAM and
disk in terms of cost, latency, bandwidth, power consumption etc. Since flash
memory is still young, there are a lot of questions to be answered:

1. What will be the interface to flash memory?
2. Should flash memory be treated like an extended RAM or like an extended
   disk?
3. How can databases and operating systems best take advantage of flash memory?
4. How can B-trees be optimized for flash memory?

This paper revisits the five-minute rule in the era of flash and attempts to
answer some of these questions.

**Assumptions.**
This paper makes the following assumptions.

*Flash Memory.*
- We assume that flash memory is going to act as a buffer pool sitting between
  RAM and disk. That is, pages will be moved between RAM, flash, and memory
  using some algorithm (e.g. LRU).
- We assume that the data structures used to manage this page migration will be
  stored in memory.
- We assume the hardware details of the flash devices are abstracted behind common hardware interfaces.
- We assume data can be transferred between RAM and flash using DMA. Also, data
  can be transferred between flash and disk either using DMA or by using an
  in-RAM transfer buffer.
- We assume flash memory implements wear leveling.
- We assume data is asynchronously moved from flash to disk.

*File Systems.*
- We assume files are often read in their entirety, modified slightly, and
  written back in their entirety. Thus, the file system performs best when
  files are allocated contiguously.
- We assume that file systems maintain their consistency by cleverly ordering
  writes and performing expensive fsck-like recovery upon rebooting. The file
  systems do not use journaling.

*Databases.*
- We assume databases heavily use B+-trees.
- We assume databases use an ARISE like write-ahead-logging recovery algorithm
  with frequent checkpointing.

*Other Hardware.*
- We assume we have a lot of RAM.
- We assume we have fast CPUs.

**The Five-Minute Rule**
The paper says the original 1987 five-minute rule uses the following formula:
```
                                PagesPerMBofRAM * Price-PerDiskDrive
BreakEvenIntervalinSeconds = ------------------------------------------
                             AccessesPerSecondPerDisk * PricePerMBofRAM
```
which can be derived from equating the cost of storing an object on disk and in
RAM. The paper does not provide the derivation, but we can. Consider an object
that is `MemSize` MB large. We consider the cost of storing the object on disk
and in RAM:

- **On Disk.** Let `NumPages` be the number of pages needed to store our
  object. We can calculate `NumPages` as `NumPages = PagesPerMBofRAM * MemSize`
  The required bandwidth needed to read the object is then `NumPages /
  BreakEvenIntervalinSeconds`. If a disk delivers `AccessesPerSecondPerDisk` of
  bandwidth, then the bandwidth we need for our object takes up the following
  fraction of the disk:

  ```
                PagesPerMBofRAM * MemSize
  -----------------------------------------------------
  BreakEvenIntervalinSeconds * AccessesPerSecondPerDisk
  ```

  Multiplying by the price of a whole disk, we get the price we have to pay for
  the fraction of the disk that we need.
  ```
      PagesPerMBofRAM * MemSize * Price-PerDiskDrive
  -----------------------------------------------------
  BreakEvenIntervalinSeconds * AccessesPerSecondPerDisk
  ```
- **In RAM.** The cost of storing the object in RAM is straightforward.

    ```
    PricePerMBofRAM * MemSize
    ```

If we equate the two equation, we can solve for `BreakEvenIntervalinSeconds`

```

                               PagesPerMBofRAM * MemSize * Price-PerDiskDrive
PricePerMBofRAM * MemSize = -----------------------------------------------------
                            BreakEvenIntervalinSeconds * AccessesPerSecondPerDisk

                         PagesPerMBofRAM * Price-PerDiskDrive
PricePerMBofRAM = -----------------------------------------------------
                  BreakEvenIntervalinSeconds * AccessesPerSecondPerDisk

                                PagesPerMBofRAM * Price-PerDiskDrive
BreakEvenIntervalinSeconds = ------------------------------------------
                             AccessesPerSecondPerDisk * PricePerMBofRAM
```

Plugging in modern values for the variables in the formulas above, we get the
following insights:

- The break-even time for 4KB objects on RAM/disk is 1.5 hours. This was 2
  minutes 20 years ago. Interestingly, RAM prices have dropped by five orders
  of magnitude, but the break-even time has only dropped by 2 orders of
  magnitude. This is because the prices of disks has also dropped while the
  performance of disks has risen.
- The break-even time for 64KB objects on RAM/disk is 5 minutes.
- The break-even time for 4KB objects on RAM/flash is 15 minutes.
- The break-even time for 4KB objects on flash/disk is 2.5 hours.

Note that almost all active data will stay in RAM and flash. Also note that the
5 minute break-even time applies for much larger objects than before.

**Page Movement.**
Since flash memory acts as a buffer pool, data has to be transferred between
RAM and flash and between flash and disk. The page movement policies can be
similar to existing page movement polices for RAM and disk. Moreover, if flash
acts as an extended disk, then movement between flash and disk will look like
movement during defragmentation.

**Tracking Pages Locations.**
File systems track page locations using pointer pages (e.g. indirect blocks).
Databases, on the other hand, use B+-trees. B+-trees have also been heavily
optimized. For example, there are B+-tree variants which are designed to reduce
the overheads of maintaining sibling pointers and of logging. Thus, moving data
around in a file system is not as efficient as in a database. As a result, a
file system would not want to use flash as an extended disk.

**Checkpoint Processing.**
Databases are frequently checkpointing, moving data to the disk. If databases
used flash memory as an extended RAM, then all the data written to it would
still have to be moved to disk. However, if they use it as an extended disk,
they can avoid a lot of checkpointing overhead.

**Page Sizes.**
The size of nodes in a B+-tree is a tunable parameter. If the nodes are small,
then there's not a lot of overhead to reading a node. If the nodes are big,
then the tree is short. The optimal B+-tree node size is not too big and not
too small.

The optimal node size for modern disks is rather large. Most of the overhead of
reading a node from the disk is seek time, not transfer time. Thus, increasing
the block size comes mostly for free. On the other hand, the optimal node size
for modern flash memory is much smaller because the seek time is much lower.
Some B+-tree designs allow for different block sizes, allowing a B+-tree to
optimally use both disk and flash.

**Database Query Processing.**
Some algorithms used in database systems are carefully designed to take
advantage of memory and disk. For example, external sort takes advantage of
memory and disk. These algorithms can be redesigned to take advantage of flash
as well. Query planning may also have to change. For example, reading from an
unclustered index in flash may be less expensive than doing a full table scan,
even though the full table scan may be less efficient that reading the
unclustered index from disk.
