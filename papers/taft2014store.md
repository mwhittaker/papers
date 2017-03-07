# [E-Store: Fine-Grained Elastic Partitioning for Distributed Transaction Processing Systems (2014)](https://scholar.google.com/scholar?cluster=4610852942244414312)
Databases experience anomalous load in many forms:

- **Hot Spots.** Sometimes, a small *minority* of the tuples in the database
  account for a large *majority* of the load.
- **Time-Varying Skew.** Load is sometimes diurnal (i.e. large in the day,
  small at night) or seasonal (e.g. large around Christmas).
- **Load Spikes.** Sometimes, predictable or unpredictable events cause a huge
  increase in load (e.g. a game winning touchdown in the Superbowl).
- **Hockey Stick Effect.** Startups sometimes experience an exponential growth
  rate leading to an exponential increase in load.

E-Store is an distributed elastic OLTP RDBMs built on top of H-Store that can
handle varying load by (a) adding and removing nodes and (b) moving tuples
between nodes.

## Assumptions
Distributed transactions are much slower than local transactions, so any sort
of data movement to balance load must be careful not to accidentally increase
the number of distributed transactions and end up increasing the load. E-Store
defers this consideration for future work. We assume that all relations follow
a tree-schema pattern and accesses are all root-to-leaf. The root relation is
partitioned by key, and each root tuple is co-located with all its descendants.

## In a Nutshell
There are three components to elasticity:

1. **How to detect load imbalance.**
2. **How to choose which data to move and where to move it.**
3. **How to physically move the data.**

For (1), E-Store uses a novel two-phase monitoring scheme in which a
coarse-grained load measurement triggers a finer-grained tuple-level access
profile. For (2), E-Store uses a novel two-tiered partitioning scheme in which
data is moved at two granularities: hot tuples and cold chunks. For (3),
E-Store uses a modified version of an existing tool named Squall.

## Data Migration
To migrate data, E-Store uses a modified version of an existing tool named
Squall. Squall takes in a **reconfiguration plan** which describes which data
should go where. It divides the plan into subplans and then executes the
subplans in an order that prioritizes moving data from the most loaded server
to the least loaded server. It also allows transactions to be placed between
subplans to avoid stalling the system. It also takes care to make sure that
running transactions are not disrupted by the movement.

## 2-Tiered Partitioning
Typically, data in an RDBMs is range or hash partitioned in units of blocks.
These blocks are then migrated between nodes. E-Store has two tiers of
partitioning. First, it range partitions root keys into blocks of `B` tuples.
Second, it extracts the top `k` hot tuples from the blocks and migrates them
individually.

## Monitoring
In order to partition at tuple granularity, E-Store has to know which tuples
are hot. Counting tuple-level accesses can be prohibitively expensive, so
E-Store uses a two-phase approach. First, E-Store gathers OS-level load from
all nodes. If the load drops below a low watermark or exceeds a high watermark,
the second phase is triggered. In the second phase, the database records the
total number of tuple accesses on each node, and the top `k` hottest tuple on
each node along with their access counts. This information is used by the
reprovisioning algorithms which determine where to move which tuples.

## Reprovisioning
E-Store (a) adds and removes nodes and (b) moves tuples around.

For (a), if the load decreases the low watermark, nodes are removed from the
system. If the load exceeds the high watermark, nodes are added to the system.

For (b), we can make a perfect decision using a integer linear program. The
program has an indicator variable for `x_ij` to assign each hot tuple `i` to
node `j` and an indicator variable `y_ij` to assign every cold block `i` to
node `j`. Constraints ensure that assignments make sense, load is balanced, and
not too many tuples are moved.

The integer linear program solves the problem exactly, but is expensive.
E-Store uses a couple of approximation algorithms to approximate the integer
linear program solution.
