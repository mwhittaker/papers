## [Consistency Analysis in Bloom: a CALM and Collected Approach (2011)](https://scholar.google.com/scholar?cluster=9165311711752272482&hl=en&as_sdt=0,5) ##
**Summary.**
Strong consistency eases reasoning about distributed systems, but it requires
coordination which entails higher latency and unavailability. Adopting weaker
consistency models can improve system performance but writing applications
against these weaker guarantees can be nuanced, and programmers don't have any
reasoning tools at their disposal. This paper introduces the *CALM conjecture*
and *Bloom*, a disorderly declarative programming language based on CALM, which
allows users to write loosely consistent systems in a more principled way.

Say we've eschewed strong consistency, how do we know our program is even
eventually consistent? For example, consider a distributed register in which
servers accept writes on a first come first serve basis. Two clients could
simultaneously write two distinct values `x` and `y` concurrently. One server
may receive `x` then `y`; the other `y` then `x`. This system is not eventually
consistent. Even after client requests have quiesced, the distributed register
is in an inconsistent state. The *CALM conjecture* embraces Consistency As
Logical Monotonicity and says that logically monotonic programs are eventually
consistent for any ordering and interleaving of message delivery and
computation. Moreover, they do not require waiting or coordination to stream
results to clients.

*Bud* (Bloom under development) is the realization of the CALM theorem. It is
Bloom implemented as a Ruby DSL. Users declare a set of Bloom collections (e.g.
persistent tables, temporary tables, channels) and an order independent set of
declarative statements similar to Datalog. Viewing Bloom through the lens of
its procedural semantics, Bloom execution proceeds in timesteps, and each
timestep is divided into three phases. First, external messages are delivered
to a node. Second, the Bloom statements are evaluated. Third, messages are sent
off elsewhere. Bloom also supports modules and interfaces to improve
modularity.

The paper also implements a key-value store and shopping cart using Bloom and
uses various visualization tools to guide the design of coordination-free
implementations.
