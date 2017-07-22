# [Combining Systems and Databases: A Search Engine Retrospective (2005)](https://scholar.google.com/scholar?cluster=15869287167041695406)
Search engines are big data systems. So are databases. It's natural then to
wonder if search engines can be efficiently implemented using a relational
database.  Unfortunately, search engines written from scratch can exploit a
number of assumptions that databases cannot. For example, search engines
typically focus on availability over consistency, they deal with a large number
of relatively homogeneous read-only queries, updates are rare and can be done
offline, etc.

In this paper, Brewer argues that even if a search engine cannot be efficiently
implementing using a database, it should be implemented with database
principles such as data independence and declarative query languages. Brewer
presents the design of a search engine that exploits many database principles.

## Search Engine Overview
In this paper, we consider a simple search engine with the following design.
Users write queries consisting of **words** (e.g. "java list sort") and
**properties** (e.g. "language:english  filetype:pdf"). The search engine
then finds every document that contains the words and satisfies the properties.
Each document is scored based on the search, and the top results are returned.
The score of a document $d$ for a query $Q$ with words $w_1, \ldots, w_k$ is
computed as follows:

<div class="math">
$$
Score(Q, d) \defeq Quality(d) + \sum_{i=1}^k Score(w_i, d)
$$
</div>

Here, $Quality$ determines the quality of a document irrespective of query
(e.g. how long is it, what is its page rank). $Score(w, d)$ assigns a score to
each word and document pair based on the location and frequency of the word.
For example, if the title of a page is "Java List Sort" and its body contains
the word "list" 49 times, it will probably receive a higher score for word
"list" than a page titled "How to Wax a Llama" that includes the word "list"
once.

A **crawler** periodically crawls the web looking for pages. An **indexer**
indexes these pages and computes an inverted index mapping words to the
documents that contain the word (also annotated with scores). Finally, a
**server** parses, optimizes, and executes queries and returns results back to
the user.

## Logical Query Plan
We store documents and inverted indexes as relational tables with the following
schema:

- `Document(DocId, URL, Date, Size, Abstract)`
- `Word(WordId, DocId, Score, PositionInfo)`
- `Property(WordId, DocId)`
- `Term(String, WordId, Stats)`

Every document is assigned a `DocId`. Every word and property is assigned a
`WordId`. The `Document` tables contains a row for every document. The `Word`
and `Property` tables are inverted indexes from words and properties to
documents. The `Term` table maps words to their `WordId`s. For example, imagine
the following documents:

```
echo "foo foo foo bar" >> foo.html
echo "bar bar bar" >> bar.html
```

We would have the following tables:

<center>
| DocId | URL      | Date | Size | Abstract |
|-------|----------|------|------|----------|
| 13048 | foo.html | -    | -    | -        |
| 91481 | bar.html | -    | -    | -        |

| WordId | DocId | Score | PositionInfo |
|--------|-------|-------|--------------|
| 0      | 13048 | 100   | -            |
| 1      | 13048 | 10    | -            |
| 1      | 91481 | 100   | -            |

| String | WordId | Stats |
|--------|--------|-------|
| foo    | 0      | -     |
| bar    | 1      | -     |
</center>

With these tables, we can express a search engine query as a relational algebra
query which joins together quality scores, word scores, and documents (see
Figure 2 in the paper). The meat of the query involves finding all the
documents that match a given query. For this, we use a custom query language:

```
expr ::= expr AND expr
       | expr OR expr
       | expr FILTER prop
       | word

prop ::= prop AND prop
       | prop OR prop
       | NOT prop
       | NOT expr
       | property
```

## Query Implementation
Logical queries are transformed into physical query plans with the following
four physical operators:

- `OR($\bar{e}$) -> expr` performs an outer join (with scoring) on the
  subexpressions.
- `ORp($\bar{p}$) -> prop` performs an outer join (without scoring) on the
  subexpressions.
- `ANDp($\bar{p}$) -> prop` performs an inner join (without scoring) on the
  subexpressions.
- `FILTER($\bar{e}$)($\bar{p}$) -> expr` performs an inner join on the
  subexpressions with scoring only using $\bar{e}$.

Admittedly, I don't really understand this section of the paper. The operators
are described as joins, but it seems like they're just unions and
intersections.  The distinction between `expr`s and `prop`s is also a bit
unclear to me here.

The query optimizer transforms logical queries into physical query plans using
these four operators. The queries are evaluated without any pipelining and all
intermediate values are cached. For example, if a query computes all the
documents which contain the words "foo" and "bar", then this is cached for
later queries. Moreover, the plan is implemented with as many multiway joins as
possible.

The query optimizer uses a top-down Cascades style approach. It begins by
flattening physical plans as much as possible and then tries to re-use cached
results as much as possible. For example, if we have the query `OR(a, b, c, d,
e, f, g)` and we have `OR(a, c, d)` and `OR(f, g)` cached, then the plan will
generate `OR(OR(a, c, d), b, e, OR(f, g))`.

These physical query plans are then executed on multiple nodes. The documents,
words, and properties table are horizontally partitioned into units called
**chunks**. Each chunk contains the entries for a subset of the documents. Each
node is assigned a couple of chunks. The terms table is replicated on all the
nodes. A master node receives a query and optimizes it. It then sends this
query to a set of followers which execute the query on the documents in their
chunks. They each send back their local top $k$ results, and the master
computes the global top $k$ results.

As further optimizations, search engines can compress the inverted indexes. For
example, instead of storing a sequence of document ids like `134134134134135,
13513852492452, 13859138519359135, 845294589139851`, you can store a set of
differences like `135135135,+19214,-1931341,+245991231,-134`. The master can
also compute a local top $k$ results and use its $k$th score as a lower bound
on the followers to allow them to prune bad results.

## Updates
Updates occur at the granularity of chunks. That is, tuples are never inserted
or deleted from chunks. Instead, chunks are atomically swapped out between
queries. The chunks of a database are also divided into a set of partitions
where each partition can specify policies for thinks like how often to refresh
chunks or how many times to replicate a chunk.

Periodically, the crawler will create a new chunk with refreshed values of all
the documents in an old chunk. The crawler will also create chunks for newly
discovered web pages.

All chunks are assigned monotonically increasing ids. Every node maintains a
version vector indicating the id of every chunk it owns. In order to atomically
swap out a chunk for a new chunk, a node will load the new chunk into memory
and then atomically swap out the version vector to include the id of the new
chunk. Moreover, a cache is created for each chunk. Whenever a chunk is
upgraded, its cache is cleared.

In order to support real-time deletions (e.g. for illegal results), each node
maintains a small deletion table that is part of the right hand side of an
anti-join. Administrators can insert tuples into this table to remove them from
search results.

For system-wide updates (e.g. to the scoring algorithm), every node can load in
the update and then in a couple of minutes of down time can transition over to
the new stuff.

## Fault Tolerance
If a disk on a node fails and an unreplicated chunk is lost, the chunk is just
reloaded on another node. If the chunk is replicated and the primary's disk
fails, the secondary becomes the primary. If the master detects that a follower
has failed (via a timeout), then it simply continues the query without chunks
on the failed follower. If a master fails, the web server retries with a
different master, potentially on a different data center.

Sometimes events like natural disasters or touchdowns in the superbowl cause an
influx in queries. In these events, a search engine has to handle the extra
load by gracefully degrading (throughput remains saturated and latency
increases proportional to the number of requests). In order to do so, queries
can start looking at fewer chunks, and expensive queries can be outright
rejected.

When an entire data center fails, web server will start redirecting the queries
to other data centers which can handle the failover load using graceful
degradation. Important chunks will be replicated on multiple data centers.

## Other Topics
- **Personalization.** Search engines can store user personalization
  information in a cookie, or it can store a user id in the cookie and store
  the information in a database. Storing the information in a database makes it
  much easier to do things like schema evolution.
- **Logging.** Search engines produce a lot of logs and require custom logging
  frameworks.
- **Query rewriting.** Sometimes queries can be rewritten with things like the
  preferred language or some words on the current page being looked at.
- **Phrase queries.** In order to support phrase queries (e.g. "New York"),
  search engines can measure the nearness of words in a document or can
  straight up search for whole sequences of words.

<script type="text/javascript" async
  src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/MathJax.js?config=TeX-MML-AM_CHTML">
</script>
