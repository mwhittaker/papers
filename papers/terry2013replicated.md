## [Replicated Data Consistency Explained Through Baseball (2013)](https://scholar.google.com/scholar?cluster=3008756295145383805&hl=en&as_sdt=0,5)
Different cloud providers provide cloud storage with different mixes of
consistency:

- *Azure* provides strong consistency.
- *Amazon S3* provides eventual consistency.
- *Amazon DynamoDB* provides eventual and strong consistency.
- *Amazon SimpleDB* provides eventual and strong consistency.
- *Google App Engine Datastore* provides eventual and strong consistency.
- *PNUTS* provides read-any, read-critical, and read-latest.
- Some systems provide quorum reads.

Cloud providers are motivated to provide multiple consistency guarantees due to
the inherit tradeoff between consistency, performance, and availability. This
paper presents six consistency models in plain English and motivates their use
with a baseball application.

**Read Consistency Guarantees.**
Assuming writes linearized using something like Paxos, we define six read
consistency guarantees:

- *Strong consistency (SC).* Reads reflect all writes at the point of the read.
- *Eventual consistency (EC).* Reads reflect some subset of the writes that
  happened at the point of the read.
- *Consistent prefix (CP).* Reads reflect some prefix of writes at the point of
  the read. This is most useful for multi-object reads.
- *Bounded staleness (BS).* Reads reflect all writes before some time `T`
  before the point of the read.
- *Monotonic reads (MR).* This session guarantee says that repeated reads
  reflect monotonically non-decreasing sets of writes.
- *Read my writes (RMW).* Reads followed by writes reflect the values written.

These consistency guarantees can be organized using the following partial
order:

```
    SC
CP BS MR RMW
    EC
```

**Baseball as a Sample Application.**
Imagine a key-value store which provides all of the read consistency guarantees
outlined above. Consider a baseball application that writes home and visitor
runs into two separate variables in this key value store. Consider the following game:

- `Write("home", 1)`
- `Write("visitors", 1)`
- `Write("home", 2)`
- `Write("home", 3)`
- `Write("visitors", 2)`
- `Write("home", 4)`
- `Write("home", 5)`

|          | 1   | 2   | 3   | 4   | 5   | 6   | 7   | 8   | 9   | RUNS   |
| -------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | ------ |
| Visitors | 0   | 0   | 1   | 0   | 1   | 0   | 0   |     |     | 2      |
| Home     | 1   | 0   | 1   | 1   | 0   | 2   |     |     |     | 5      |

The read consistency guarantees allow for the following reads:

| Read Guarantee | Permitted Reads                                      |
| -------------- | ---------------------------------------------------- |
| SC             | `2-5`                                                |
| EC             | `{0, 1, 2}x{0, 1, 2, 3, 4, 5}`                       |
| CP             | `0-0`,`0-1`,`1-1`,`1-2`,`1-3`,`2-3`,`2-4`,`2-5`      |
| BS             | 1-inning: `2-3`,`2-4`,`2-5`                          |
| MR             | `1-3`: `1-3`,`1-4`,`1-5`,`2-3`,`2-4`,`2-5`           |
| RMW            | writer: `2-5`; other: `{0, 1, 2}x{0, 1, 2, 3, 4, 5}` |

**Read Requirements for Participants.**
Different users of the baseball database have different consistency
requirements:

- *Official scorekeeper.* The official scorekeeper is the sole person
  responsible for updating the scores (e.g. `Write("visitors", Read("visitors")
  + 1)`). The scorekeeper requires strongly consistent writes, but since they
  are the only one writing, they can get by with RMW instead of SC.
- *Umpire.* The umpire reads the score after the top of the 9th inning to see
  if the home team is winning. This requires SC.
- *Radio reporter.* The radio reporter reports the current score of the game
  every 30 minutes. The score doesn't have to be fresh, but it should be a
  score that existed at some point. Moreover, the score should not time travel
  backwards. We can accomplish this with CP and MR. Alternatively, we can use
  30-minute BS.
- *Sports writer.* The sports writer writes a report of the game one hour after
  the game is over. 1 hour BS suffices.
- *Statistician.* The statistician maintains the total yearly runs. They
  require SC to read the daily runs but only RMW to read the yearly runs.
- *Stat watcher.* Stat watchers read the stats every day or so. Eventual
  consistency suffices.

**Lessons.**
- All of the six presented consistency guarantees are useful.
- Different clients may want different consistencies even when accessing the
  same data.
- Even simple databases may have diverse users with different consistency
  needs.
- Clients should be able to choose their desired consistency.

