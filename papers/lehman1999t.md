## [T Spaces: The Next Wave (1999)](https://goo.gl/mxIv4g) ##
**Summary.**
T Spaces is a

> tuplespace-based network communication buffer with database capabilities that
> enables communication between applications and devices in a network of
> heterogeneous computers and operating systems

Essentially, it's Linda++; it implements a Linda tuplespace with a couple new
operators and transactions.

The paper begins with a history of related tuplespace based work. The notion of
a shared collaborative space originated from AI *blackboard systems* popular in
the 1970's, the most famous of which was the Hearsay-II system. Later, the
Stony Brook microcomputer Network (SBN), a cluster organized in a torus
topology, was developed at Stony Brook, and Linda was invented to program it.
Over time, the domain in which tuplespaces were popular shifted from parallel
programming to distributed programming, and a huge number of Linda-like systems
were implemented.

T Spaces is the marriage of tuplespaces, databases, and Java.

- *Tuplespaces* provide a flexible communication model;
- *databases* provide stability, durability, and advanced querying; and
- *Java* provides portability and flexibility.

T Spaces implements a Linda tuplespace with a few improvements:

- In addition to the traditional `Read`, `Write`, `Take`, `WaitToRead`, and
  `WaitToTake` operators, T Spaces also introduces a `Scan`/`ConsumingScan`
  operator to read/take all tuples matched by a query and a `Rhonda` operator
  to exchange tuples between processes.
- Users can also dynamically register new operators, the implementation of
  which takes of advantage of Java.
- Fields of tuples are indexed by name, and tuples can be queried by named
  value. For example, the query `(foo = 8)` returns *all* tuples (of any type)
  with a field `foo` equal to 8. These indexes are similar to the inversions
  implemented in Phase 0 of System R.
- Range queries are supported.
- To avoid storing large values inside of tuples, files URLs can instead be
  stored, and T Spaces transparently handles locating and transferring the file
  contents.
- T Spaces implements a group based ACL form of authorization.
- T Spaces supports transactions.

To evaluate the expressiveness and performance of T Spaces, the authors
implement a collaborative web-crawling application, a web-search information
delivery system, and a universal information appliance.
