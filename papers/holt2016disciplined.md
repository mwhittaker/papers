## [Disciplined Inconsistency with Consistency Types (2016)](https://scholar.google.com/scholar?hl=en&q=disciplined+inconsistency+with+consistency+types&btnG=&as_sdt=1%2C5)
**Overview.**
In the face of latency, partitions, and failures, application sometimes turn to
weak consistency for improved performance. However, strong consistency cannot
always be avoided, so some data stores (e.g. Cassandra, Riak) allow
applications to operate on some data with weak consistency and on other data
with strong consistency. However, it is difficult to ensure that data read with
weak consistency does not leak into the strongly consistent data.

For example, imagine a ticketing application that displays the number of
remaining tickets for an upcoming movie. To improve performance, an application
may choose to read the data using weak consistency; it's okay if the displayed
number is slightly erroneous. However, now imagine that we want to increase the
price of the last 10 tickets. If we used the same weakly consistent value to
determine the price of a ticket, we may make less money that we expect. Weak
and strong consistency cannot be carelessly mixed.

The *Inconsistent, Performance-bound, Approximate* (IPA) storage system uses a
type system of *consistency types* to ensure *consistency safety*: the
guarantee that weakly consistent data does not leak into strongly consistent
data. They also introduce error-bounded consistency which allows a runtime to
dynamically choose the strongest consistency that satisfies certain constraints
(e.g. latency or accuracy).

**Programming Model.**
The IPA programming model involves three components: abstract data types,
consistency policies, and consistency types. Users annotate ADTs with
consistency policies which determines the consistency types returned by the
ADT's methods.

1. *ADTs.* IPA is bundled with a set of common ADTs (e.g. sets, maps, lists)
   that can be implemented with any number of backing stores (e.g. Cassandra,
   Riak, Redis). The collection of ADTs is also extensible; users can add their
   own ADTs.
2. *Consistency Policies.* ADT instances (or their methods) are annotated with
   consistency policies which designate the level of consistency the user
   desires. *Static policies*, like strong consistency, are fixed throughout
   the lifetime of the ADT. *Dynamic policies* allow the runtime to dynamically
   choose the consistency of the system to meet some constraint. For example, a
   user can set a policy LatencyBound(x), and the system will choose the
   strongest consistency that can be served and still satisfy the latency
   bound. Or, a user can set a ErrorTolerance(x) allowing the system to return
   approximate results with weaker consistency.
3. *Consistency Types.* Consistency types are parameterized on a type `T` and
   are partially ordered

                  Consistent[T]
                  /     |     \
        Interval[T] Rushed[T] ...
                  \     |     /
                 Inconsistent[T]

   Users can explicitly endorse, or upcast, weak types to stronger types.
   Rushed types are produced by ADTs with LatencyBound policies and are a sum
   of other consistency types. Interval types are a numeric interval which are
   guaranteed to contain the correct value.

**Enforcing Consistency Policies.**
Static consistency policies are easy to enforce. The ADT operations simply set
flags that are used by the underlying store. Dynamic policies are trickier to
implement.

- *Latency bounds.* To service a read with a latency bound of `x` milliseconds,
  for example, a read is issued at every single consistency level. The
  strongest to return in less that `x` milliseconds is used. This naive
  approach can put unwanted load on a system, so IPA can also monitor and
  predict the strongest consistency model for a given latency bound in order to
  issue only a couple of reads.
- *Error bounds.* Error bounds are enforced using a reservation scheme similar
  to the one used by bounded CRDTs. For example, imagine a counter with value
  10 should be concurrently decremented but never drop below 0. We can allocate
  10 decrement tokens and distribute them to nodes. A node can decrement so
  long as it has enough tokens. IPA involves reservation servers which are
  assigned tokens. A node can return an approximate read by knowing the number
  of outstanding tokens. For example, given a value of 100 and knowing there
  are 10 outstanding increment tokens, the true value is somewhere in the range
  [100, 110]. The more outstanding tokens there are, the weaker the error
  bounds. To avoid unnecessarily granting tokens, IPA uses an *allocation
  table* which maps reservation servers to tokens. Tokens are only allocated
  when necessary.

**Implementaton.**
IPA is implemented in Scala on top of Cassandra with some middleware for the
reservation servers. Type checking is done by leveraging Scala's type system.
