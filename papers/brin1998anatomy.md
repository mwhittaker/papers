# [The Anatomy of a Large-Scale Hypertextual Web Search Engine (1998)](https://scholar.google.com/scholar?cluster=9820961755208603037)
In this paper, Larry and Sergey present Google.

## Features
One of Google's main features is its use of PageRank to rank search results.
For an arbitrary site $A$ and a set of sites $T_1, \ldots, T_n$ that link to
it, the PageRank function satisfies the following equation:

$$
PageRank(A) = (1 - d) + d \sum_{i=1}^n \frac{PageRank(T_i)}{OutDegree(T_i)}
$$

where $d$ is a damping factor. Intuitively, sites get a high PageRank if they
are frequently linked to or linked to by other sites with high PageRank.

Google also associates anchor text (the text part of a link) with the page
being linked to instead of the page with the link. This anchor text provides
information about a site which the site itself may not include.

Google also provides a number of other miscellaneous features. For example, it
scores words in documents based on their size and boldness. It also maintains a
repository of HTML that researchers can use as a dataset.

## Related Work
Most related work is in the field of information retrieval, but this literature
typically assumes that information is being extracted from a small set of
homogeneous documents. The web is huge and varied, and users can even
maliciously try to affect search engine results.

## System Anatomy
A URL Server sends URLs to a set of crawlers which download sites and send them
to a store server which compresses them and stores them in a repository. An
indexer uses the repository to build a forward index (stored in a set of
barrels) which maps documents to a set of hits. Each hit records a word in the
document, its position in the document, its boldness, etc. The indexer also
stores all anchors in a file which a URL resolver uses to build a graph for
PageRank. A sorter periodically converts forward indexes into inverted indexes.

## Data Structures
- **BigFiles.** Big files are really big virtual files that map over multiple file systems.
- **Repository.** The repository contains the HTML of crawled sites compressed
  with zlib. The repository contains a record for each site which contains its
  DocId, URL, length, and HTML contents.
- **Document index.** The index is an ISAM index from DocId to pointers into
  the repository. It also contains pointers to the URL and title of the site.
  Additionally, there is a hash map which maps URLs to DocIds.
- **Lexicon.** The lexicon is an in-memory list of roughly 14 million words.
  The words are stored contiguously with nulls separating them.
- **Hit lists.** Each hit needs to compactly represent the font size,
  capitalization, position, etc of a word. Google uses some custom bit tricks
  to do this with very few bits.
- **Forward index.** The forward index contains a list of DocIds followed by a
  WordId and a series of hits. The index is partitioned by WordId across a
  number of barrels.
- **Inverted index.** The inverted index maps words to DocIds.

## Crawling the Web
The URL server and the crawlers are implemented in Python. Each crawler has
about 300 open connections, performs event loop asynchronous IO, and maintains
a local DNS cache to boost performance. Crawling is the most fragile part of
the entire search engine and requires a lot of corner case handling.

## Indexing
Google implements a custom parser to handle exotic HTML. The HTML is converted
into a set of hits using the lexicon. New words not in the lexicon are logged
and later added to the lexicon.

## Search
A search query is converted into a set of WordIds. The index is searched to
find a set of documents that contain the words. The results are ranked by a
number of factors (e.g. PageRank, proximity for range searches) before being
returned to the user.

<script type="text/javascript" async
  src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/MathJax.js?config=TeX-MML-AM_CHTML">
</script>
