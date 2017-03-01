# [A Fast File System for UNIX (1984)](https://scholar.google.com/scholar?cluster=1900924654174602790)
The **Fast Filesystem** (FFS) improved the read and write throughput of the
original Unix file system by 10x by

1. increasing the block size,
2. dividing blocks into fragments, and
3. performing smarter allocation.

The original Unix file system, dubbed "the old file system", divided disk
drives into partitions and loaded a file system on to each partition. The
filesystem included a superblock containing metadata, a linked list of free
data blocks known as the **free list**, and an **inode** for every file.
Notably, the file system was composed of **512 byte** blocks; no more than 512
bytes could be transfered from the disk at once. Moreover, the file system had
poor data locality. Files were often sprayed across the disk requiring lots of
random disk accesses.

The "new file system" improved performance by increasing the block size to any
power of two at least as big as **4096 bytes**. In order to handle small files
efficiently and avoid high internal fragmentation and wasted space, blocks were
further divided into **fragments** at least as large as the disk sector size.

```
      +------------+------------+------------+------------+
block | fragment 1 | fragment 2 | fragment 3 | fragment 4 |
      +------------+------------+------------+------------+
```

Files would occupy as many complete blocks as possible before populating at
most one fragmented block.

Data was also divided into **cylinder groups** where each cylinder group included
a copy of the superblock, a list of inodes, a bitmap of available blocks (as
opposed to a free list), some usage statistics, and finally data blocks. The
file system took advantage of hardware specific information to place data at
rotational offsets specific to the hardware so that files could be read with as
little delay as possible. Care was also taken to allocate files contiguously,
similar files in the same cylinder group, and all the inodes in a directory
together. Moreover, if the amount of available space gets too low, then it
becomes more and more difficult to allocate blocks efficiently. For example, it
becomes hard to allocate the files of a block contiguously. Thus, the system
always tries to keep ~10% of the disk free.

Allocation is also improved in the FFS. A top level global policy uses file
system wide information to decide where to put new files. Then, a local policy
places the blocks. Care must be taken to colocate blocks that are accessed
together, but crowding a single cyclinder group can exhaust its resources.

In addition to performance improvements, FFS also introduced

1. longer filenames,
2. advisory file locks,
3. soft links,
4. atomic file renaming, and
5. disk quota enforcement.
