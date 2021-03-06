## [Logic and Lattices for Distributed Programming (2012)](TODO) ##
**Summary.**
CRDTs provide eventual consistency without the need for coordination. However,
they suffer a *scope problem*: simple CRDTs are easy to reason about and use,
but more complicated CRDTs force programmers to ensure they satisfy semilattice
properties. They also lack composability. Consider, for example, a Students set
and a Teams set. (Alice, Bob) can be added to Teams while concurrently Bob is
removed from Students. Each individual set may be a CRDT, but there is no
mechanism to enforce consistency between the CRDTs.

Bloom and CALM, on the other hand, allow for mechanized program analysis to
guarantee that a program can avoid coordination. However, Bloom suffers from a
*type problem*: it only operates on sets which procludes the use of other
useful structures such as integers.

This paper merges CRDTs and Bloom together by introducing *bounded join
semilattices* into Bloom to form a new language: Bloom^L. Bloom^L operates over
semilattices, applying semilattice methods. These methods can be designated as
non-monotonic, monotonic, or homomorphic (which implies monotonic). So long as
the program avoids non-monotonic methods, it can be realized without
coordination. Moreover, morphisms can be implemented more efficiently than
non-homomorphic monotonic methods. Bloom^L comes built in with a family of
useful semilattices like booleans ordered by implication, integers ordered by
less than and greater than, sets, and maps. Users can also define their own
semilattices, and Bloom^L allows smooth interoperability between Bloom
collections and Bloom^L lattices. Bloom^L's semi-naive implementation is
comparable to Bloom's semi-naive implementation.

The paper also presents two case-studies. First, they implement a key-value
store as a map from keys to values annotated with vector clocks: a design
inspired from Dynamo. They also implement a purely monotonic shopping cart
using custom lattices.
