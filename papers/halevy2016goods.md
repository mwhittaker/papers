## [Goods: Organizing Google's Datasets (2016)](TODO) ##
**Summary.**
In fear of fettering development and innovation, companies often allow
engineers free reign to generate and analyze datasets at will. This often leads
to unorganized data lakes: a ragtag collection of datasets from a diverse set
of sources. Google Dataset Search (Goods) is a system which uses unobstructive
post-hoc metadata extraction and inference to organize Google's unorganized
datasets and present curated dataset information, such as metadata and
provenance, to engineers.

Building a system like Goods at Google scale presents many challenges.

- *Scale.* There are 26 billion datasets. *26 billion* (with a b)!
- *Variety.* Data comes from a diverse set of sources (e.g. BigTable, Spanner,
  logs).
- *Churn.* Roughly 5% of the datasets are deleted everyday, and datasets are
  created roughly as quickly as they are deleted.
- *Uncertainty.* Some metadata inference is approximate and speculative.
- *Ranking.* To facilitate useful dataset search, datasets have to be ranked by
  importance: a difficult heuristic-driven process.
- *Semantics.* Extracting the semantic content of a dataset is useful but
  challenging. For example consider a file of protos that doesn't reference the
  type of proto being stored.

The Goods catalog is a BigTable keyed by dataset name where each row contains
metadata including

- *basic metatdata* like timestamp, owners, and access permissions;
- *provenance* showing the lineage of each dataset;
- *schema*;
- *data summaries* extracted from source code; and
- *user provided annotations*.

Moreover, similar datasets or multiple versions of the same logical dataset are
grouped together to form *clusters*. Metadata for one element of a cluster can
be used as metadata for other elements of the cluster, greatly reducing the
amount of metadata that needs to be computed. Data is clustered by timestamp,
data center, machine, version, and UID, all of which is extracted from dataset
paths (e.g. `/foo/bar/montana/August01/foo.txt`).

In addition to storing dataset metadata, each row also stores *status
metadata*: information about the completion status of various jobs which
operate on the catalog. The numerous concurrently executing batch jobs use
*status metadata* as a weak form of synchronization and dependency resolution,
potentially deferring the processing of a row until another job has processed
it.

The fault tolerance of these jobs is provided by a mix of job retries,
BigTable's idempotent update semantics, and a watchdog that terminates
divergent programs.

Finally, a two-phase garbage collector tombstones rows that satisfy a garbage
collection predicate and removes them one day later if they still match the
predicate. Batch jobs do not process tombstoned rows.

The Goods frontend includes dataset profile pages, dataset search driven by a
handful of heuristics to rank datasets by importance, and teams dashboard.
