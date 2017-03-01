# [The Design of the POSTGRES Storage System (1987)](https://scholar.google.com/scholar?cluster=6675294870941893293)
POSTGRES, the ancestor of PostgreSQL, employed a storage system with three
interesting characteristics:

1. No write-ahead logging (WAL) was used. In fact, there was no recovery code
   at all.
2. The entire database history was recorded and archived. Updates were
   converted to updates, and data could be queried arbitrarily far in the past.
3. The system was designed as a collection of asynchronous processes, rather
   than a monolithic piece of code.

Transactions were sequentially assigned 40-bit transaction identifiers (XID)
starting from 0. Each operation in a transaction was sequentially assigned a
command identifiers (CID). Together the XID and CID formed a 48 bit interaction
identifier (IID). Each IID was also assigned a two-bit transaction status and
all IIDs were stored in a transaction log with a most recent **tail** of
uncommitted transactions and a **body** of completed transactions.

Every tuple in a relation was annotated with

- a record id,
- a min XID, CID, and timestamp,
- a max XID, CID and timestamp, and
- a forward pointer.

The min values were associated with the transaction that created the record,
and the max values were associated with the transaction that updated the
record. When a record was updated, a new tuple was allocated with the same
record id but updated min values, max values, and forward pointers. The new
tuples were stored as diffs; the original tuple was the **anchor point**; and
the forward pointers chained together the anchor point with its diffs.

Data could be queried at a particular timestamp or in a range of timestamps.
Moreover, the min and max values of the records could be extracted allowing for
queries like this:

    SELECT Employee.min_timestamp, Eployee.max_timestamp, Employee.id
    FROM Employee[1 day ago, now]
    WHERE Employee.Salary > 10,000

The timestamp of a transaction was not assigned when the transaction began.
Instead, the timestamps were maintained in a TIME relation, and the timestamps
in the records were left empty and asynchronously filled in. Upon creation,
relations could be annotated as

- **no archive** in which case timestamps were never filled in,
- **light archive** in which timestamps were read from a TIME relation, or
- **heavy archive** in which timestamps were lazily copied from the TIME
  relation into the records.

POSTGRES allowed for any number of indexes. The type of index (e.g. B-tree) and
the operations that the index efficiently supported were explicitly set by the
user.

A **vacuum cleaner** process would, by instruction of the user, vacuum records
stored on disk to an archival storage (e.g. WORM device). The archived data was
allowed to have a different set of indexes. The vacuum cleaning proceeded in
three steps:

1. Data was archived and archive indexes were formed.
2. Anchor points were updated in the database.
3. Archived data space was reclaimed.

The system could crash during this process which could lead to duplicate
entries, but nothing more nefarious. The consistency guarantees were a bit weak
compared to today's standards. Some crashes could lead to slowly accumulating
un-reclaimed space.

Archived data could be indexed by values and by time ranges efficiently using
R-trees. Multi-media indexes which spanned the disk and archive were also
supported.
