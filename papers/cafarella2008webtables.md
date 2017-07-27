# [WebTables: Exploring the Power of Tables on the Web (2008)](https://scholar.google.com/scholar?cluster=11659194181134800008)
In this paper, the authors scrape 14.1 billion tables from Google and filter
out all but 154 million tables that store relational data. Given this large
corpus of tables, the authors present two things:

1. **A search engine for tables.** With a search engine like Google, you enter
   queries like "height of president" and you get back a ranked list of
   websites. With the search engine presented in this paper, you enter queries
   like "population of US capitals" and you get back a ranked list of tables
   found on the web.
2. **Miscellaneous tools for database administrators.** Using statistics
   gathered from the huge corpus of tables, the authors develop three
   miscellaneous tools for database administrators: a schema auto-completion
   tool, an attribute synonym suggester, and a join graph clustering tool.

## Data Model
The authors scraped 14.1 billion tables from Google's index of the web.
However, a lot of tables are not used to store relational data. A lot are used
for things like layout and don't contain any meaningful data at all. To
distinguish the "good" tables from the "bad", the authors applied a number of
hand-written classifiers as well as a number of classifiers trained on
hand-labelled data. The algorithms favor recall (getting all the good tables)
over precision (kicking out all the bad tables) because later stages in the
pipeline will filter out bad tables. Another classifier then infers the schema
of every table.

The **attribute correlation statistics database** (ACSDb) is a map from a
schema to the number of times that schema appears in the corpus (without double
counting tables from the same URL). Using the ACSDb, we can compute things like
the probability of an attribute (the number of schemas containing the attribute
divided by the total number of schemas) and the probability of an attribute
conditioned on another attribute.

## Relation Search
When a user enters a query like "population of US capitals", we want to return
a ranked list of tables from our corpus. To do so, the authors implemented six
ranking functions. Each ranking function is parameterized by a search query $q$
and a limit $k$ on the number of results.

1. **naiveRank** searches Google with query $q$ and gathers the top $k$
   results. It then extracts and returns all (if any) of the tables found in
   these pages.
2. **filterRank** searches Google with query $q$ and then returns the first $k$
   relations found.
3. **featureRank** ranks each document using a classifier trained on a number
   of hand-scored documents. The classifier uses features such as the number of
   rows, the number of columns, the number of nulls, the number of hits in the
   header, the number of hits in the leftmost column, etc.
4. **schemaRank** ranks each relation using the featureRank classifier and
   using a **schema coherency** metric. The schema coherency of a relation is
   the average **Pointwise Mutual Information** (PMI) of every pair of
   attributes in the relation where the PMI of two attributes $a$ and $b$ is
   $\log\parens{\frac{p(a,b)}{p(a)p(b)}}$. This value is large when the
   attributes are correlated, zero when independent, and negative when
   negatively correlated.

To serve queries, we maintain an inverted index which maps a word $w$ to a list
of pairs of the form $(r, (x, y))$ where $w$ appears in relation $r$ at
position $(x, y)$.

## ACSDb Applications
The ACSDb allows us to build a handful of nifty tools.

1. **Schema Autocomplete**. Imagine you're a database administrator and you're
   designing the schema of a table which records information about people. You
   type "first name", "last name", and "weight". The schema autocomplete engine
   suggests you add "height", "age", etc. The autocomplete works by
   incrementally suggesting the most likely attributed conditioned on the
   existing attributes and the existing suggested attributes.
2. **Attribute Synonym Finding**. The same attribute is often named different
   things in different relations. For example, in one relation, we might have
   an attributed "tel-#" and in another, we might have the attribute "telephone
   number". Given a set of words $C$, the synonym finder suggests pairs of
   synonyms that are likely in the context of words $C$. It does so with two
   observations. First, if two words are synonyms then the likelihood that they
   both appear in the same schema $p(a, b)$ should be very low. Second,
   $p(z|a,C)$ should be roughly equal to $p(z|b,C)$. That is, conditioning on
   $a$ or conditioning on $b$ should have a similar effect.
3. **Join Graph Traversal.** In order to navigate the corpus of scraped
   documents, we can create a graph in which each vertex is a relation and an
   edge between two relations exists if they share an attribute with the same
   name. This graph is really big, so navigating it becomes complex. To reduce
   the burden of traversing the graph, we cluster neighbors together if they
   are similar. To do so, we measure the pointwise similarity of neighbor
   attributes conditioned on the presence of the shared attributes similar to
   how we computed schema coherency. See paper for formula.

<script type="text/javascript" async
  src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/MathJax.js?config=TeX-MML-AM_CHTML">
</script>
