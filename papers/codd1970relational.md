# [A Relational Model of Data for Large Shared Data Banks (1970)](https://scholar.google.com/scholar?cluster=1624408330930846885&hl=en&as_sdt=0,5)

## Summary
In this paper, Ed Codd introduces the *relational data model*. Codd begins by
motivating the importance of *data independence*: the independence of the way
data is queried and the way data is stored. He argues that existing database
systems at the time lacked data independence; namely, the ordering of
relations, the indexes on relations, and the way the data was accessed was all
made explicit when the data was queried. This made it impossible for the
database to evolve the way data was stored without breaking existing programs
which queried the data. The relational model, on the other hand, allowed for a
much greater degree of data independence. After Codd introduces the relational
model, he provides an algorithm to convert a relation (which may contain other
relations) into *first normal form* (i.e. relations cannot contain other
relations). He then describes basic relational operators, data redundancy, and
methods to check for database consistency.

## Commentary
1. Codd's advocacy for data independence and a declarative query language have
   stood the test of time. I particularly enjoy one excerpt from the paper
   where Codd says, "The universality of the data sublanguage lies in its
   descriptive ability (not its computing ability)".
2. Database systems at the time generally had two types of data: collections
   and links between those collections. The relational model represented both
   as relations. Today, this seems rather mundane, but I can imagine this being
   counterintuitive at the time.  This is also yet another example of a
   *unifying interface* which is demonstrated in both the Unix and System R
   papers.


