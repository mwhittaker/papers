# [Bigtable: A Distributed Storage System for Structured Data (2008)](https://scholar.google.com/scholar?cluster=535416719812038974)
Bigtable is a non-relational database developed at Google that is distributed
across 1000s of machines storing petabytes of data. Bigtable is built using a
lot of other Google technology (e.g. GFS, Chubby, Borg, SSTable) and can
achieve both high throughput and low latency.

## Data Model and API
In short, Bigtable is a "sparse, distributed, persistent multi-dimensional
sorted map" of type: `(key: string * column: string * timestamp: int64) ->
value: string`. For example, a web Bigtable could be keyed by URL with columns
like language or content. Each entry in this Bigtable could have multiple
timestamped versions.

Operations on a single Bigtable row are transactional, though Bigtable does not
support multi-row transactions. The keys are also sorted lexicographically and
a range of keys, known as a __tablet__, is the unit of replication and
locality.  This lets users colocate two keys by making the keys
lexicographically close to one another.

Columns in Bigtable are grouped into (a modest number of static) __column
families__ where each column family is a unit of access control. Bigtables can
be scanned by row and by column.

Timestamps are 64 bit integers and can either be assigned by Bigtable in an
increasing way or assigned by the user program. Values can be garbage collected
by keeping at most `n` objects at a time or by keeping all objects that are `n`
seconds old.

## Implementation
BigTable consists of a single __master__, a bunch of __tablet servers__, and a
bunch of __clients__. The master is responsible for system administration. It
assigns tablets to tablet servers, oversees the addition and removal of tablet
servers, performs garbage collection, orchestrates load balancing, and manages
schema changes. Tablet servers host 10-1000 tables and are responsible for
servicing reads and writes. They also split tablets that have grown too large.

- __Tablet location.__ The mapping from tablets to tablet servers is managed by
  a hierarchical metadata tree. First, a Chubby file contains the location of a
  __root tablet__: the first tablet in the METADATA table. The root tablet
  contains the addresses of the other tablets in the METADATA table which in
  turn store the locations of user tablets. Clients walk this hierarchy in
  order to find tablet servers. Note that tablets can find the location of a
  tablet without talking to the master.
- __Tablet assignment.__ Each tablet is assigned to a single tablet server, and
  tablet assignments are managed by the master.

  When a tablet server wants to join Bigtable, it acquires an exclusive lock on
  a file in the `servers` directory in Chubby. So long as it has the lock, it
  can serve tablets. If it loses the lock, it tries to reacquire it, and if the
  file is deleted, the tablet server kills itself. The master heartbeats
  servers periodically. If the server doesn't respond or the server reports it
  lost the lock, the master tries to acquire the lock. If it does, it deletes
  the file and reassigns tablets.

  When a master joins Bigtable, it acquires an exclusive lock on a master file.
  It then scans the `servers` directory, contacts the servers to see what
  tablets they own, and compares it to the METADATA table. It can then start
  assigning unassigned tablets. It also manages the creation, deletion, and
  merging of tablets. Tablet servers manage the splitting of tablets.
- __Tablet serving.__ Tablet servers commit updates to a log and also buffer
  the most recent updates in a sorted __memtable__. The rest of the data is
  stored in a series of SSTables in GFS. Each SSTable is a persistent immutable
  ordered mapping from strings to strings. If a tablet server crashes, its
  state can be recovered from its log. When a tablet server services a read or
  write, it performs access checks and whatnot and then resolves the read using
  the memtable and SSTables.
- __Compactions.__ Periodically, the memtable is written as an SSTable to GFS;
  this is called a __minor compaction__. Also periodically, the memtable and
  multiple SSTables are merged into a single SSTable; this is called a
  __merging compaction__. If all data is compacted into a single SSTable, it's
  called a __major compaction__.

## Refinements
- __Locality groups.__ Bigtable column families can be grouped together into a
  __locality group__ for individual storage. Locality groups can also be
  designated in-memory.
- __Compression.__ Users can specify that data should be compressed. Bigtable
  uses a two-pass compression scheme that favors compression speed or space,
  but in practice, the compression is pretty good.
- __Caching.__ Tablet servers have a __scan cache__ for temporal locality and a
  __block cache__ for spatial locality.
- __Bloom filters.__ When a tablet server services a read, it may have to read
  through every SSTable which can be expensive. To avoid this, tablet servers
  can use Bloom filters to probabilistically determine that an SSTable doesn't
  have a certain key.
- __Commit log.__ Having a commit log per tablet leads to lots of random writes
  and smaller batches, so tablet servers merge updates for multiple tablets
  into a single commit log. This can complicate tablet recovery when multiple
  servers read a commit log applying a small fraction of the updates. To avoid
  this, the commit log can be sorted before being scanned.
- __Immutability.__ The immutability of SSTables allows for concurrent reads
  without synchronization.

## Lessons
- Failures happen all the time, and the failures can be strange and exotic.
- [YAGNI](https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it).
- System monitoring is essential.
- Be simple.
