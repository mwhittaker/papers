## [Analysis and Evolution of Journaling File Systems (2005)](TODO) ##
**Summary.**
The authors develop and apply two file system analysis techniques dubbed
*Semantic Block-Level Analysis* (SBA) and *Semantice Trace Playback* (STP) to
four journaled file systems: ext3, ReiserFS, JFS, and NTFS.

- Benchmarking a file system can tell you for *which* workloads it is fast and
  for which it is slow. But, these benchmarks don't tell you *why* the file
  system performs the way it does. By leveraging semantic information about
  block traces, SBA aims to identify the cause of file system behavior.

  Users install an SBA driver into the OS and mount the file system of interest
  on to the SBA driver. The interposed driver intercepts and logs all
  block-level requests and responses to and from the disk. Moreover, the SBA
  driver is specialized to each file system under consideration so that it can
  interpret each block operation, categorizing it as a read/write to a journal
  block or regular data block. Implementing an SBA driver is easy to do,
  guarantees that no operation goes unlogged, and has low overhead.
- Deciding the effectiveness of new file system policies is onerous. For
  example, to evaluate a new journaling scheme, you would traditionally have to
  implement the new scheme and evaluate it on a set of benchmarks. If it
  performs well, you keep the changes; otherwise, you throw them away. STP uses
  block traces to perform a light-weight simulation to analyze new file system
  policies without implementation overhead.

  STP is a user-level process that reads in block traces produced by SBA and
  file system operation logs and issues direct I/O requests to the disk. It can
  then be used to evaluate small, simple modifications to existing file
  systems. For example, it can be used to evaluate the effects of moving the
  journal from the beginning of the file system to the middle of the file
  system.

The authors spend the majority of the paper examining *ext3*: the third
extended file system. ext3 introduces journaling to ext2, and ext2 resembles
the [Unix FFS](#a-fast-file-system-for-unix-1984) with partitions divided into
groups each of which contains bitmaps, inodes, and regular data. ext3 comes
with three journaling modes:

1. Using *writeback* journaling, metadata is journaled and data is
   asynchronously written to disk. This has the weakest consistency guarantees.
2. Using *ordered* journaling, data is written to disk before its associated
   metatada is journaled.
3. Using *data* journaling, both data and metadata is journaled before being
   *checkpointed*: copied from the journal to the disk.

Moreover, operations are grouped into *compound transactions* and issued in
batch. ext3 SBA analysis led to the following conclusions:

- The fastest journaling mode depends heavily on the workload.
- Compound transactions can lead to *tangled synchrony* in which asynchronous
  operations are made synchronous when placed in a transaction with synchronous
  operations.
- In ordered journaling, ext3 doesn't concurrently write to the journal and the
  disk.

SPT was also used to analyze the effects of

- Journal position in the disk.
- An adaptive journaling mode that dynamically chooses between ordered and data
  journaling.
- Untangling compound transactions.
- Data journaling in which diffs are journaled instead of whole blocks.

SBA and STP was also applied to ReiserFS, JFS, and NTFS.
