# [Schema Mapping as Query Discovery (2000)](http://osm.cs.byu.edu/CS652s02/miller00schema.pdf)
Often times, people have a bunch of legacy data in one schema and want to
migrate the data into a new system with a new schema. Typically, this schema
migration is done with hand-written one-off scripts which are finicky and hard
to optimize. This paper presents an algorithm to semi-automatically infer SQL
queries which can perform the migration with a small amount of feedback and
interaction from a database administrator. The algorithm is implemented in a
system called Clio.

## Value Correspondence
Traditional schema mapping research focuses on generating a new schema to
migrate to and simultaneously generating a query to perform the migration.
Typically, this approach requires database administrators to specify **schema
assertions** relating *sets* of values from the input database to *sets* of
values in the target database (e.g. attribute $A$ is a subset of attribute
$B$).

This paper takes an alternative approach and assumes that the target schema is
already specified. Instead of relying on schema assertions, we rely on **value
correspondences** which describes how to generate tuples in the target database
from tuples in the source database. More formally, a value correspondence is a
pair of

- a correspondence function which maps input tuples in the source database to
  tuples in the target database and
- a filter function which filters out tuples from the source database.

For example, a correspondence function may prepend the '#' character to
employee ids and filter out the employee ids of all the fired employees.

Value correspondences are arguably easier to specify than schema assertions.
Database administrators do not have to know database-wide schema relations in
order to perform a migration. They just have to know how to construct tuples in
the output database. Moreover, value correspondences  are more amenable to a
programming-by-example system which recommends schema mappings.

## Constructing Schema Mappings from Value Correspondences
Consider `PayRate(Rank, HourlyRate)` and `WorksOn(Name, Proj, Hours, ProjRank)`
source databases and a target database with a single salary field. A user can
click on the `HourlyRate` attribute and the `Hours` attribute and specify that
salary is the product of hourly rate and the number of hours.  This value
correspondence says how to generate output tuples from input tuples, but it
doesn't specify which input tuples should be paired and run through the
correspondence function. This bit is inferred by the schema mapping generator.
In this example, it would infer that `PayRate` and `WorksOn` should be joined
on `Rank = ProjRank`.

Now consider that there is another `Professor(Id, Name, Sal)` source relation
and that a user specifies an identity value correspondence between
`Professor.Sal` and the salary field in the output database. The schema mapping
generator should infer that the results from the previous joined should be
unioned with the professors' salaries.

Generalizing a bit, the schema mapping generator should follow two heuristics:

- All values in the source should somehow end up producing a tuple in the
  target. This favors unions over intersections.
- Values in the source should contribute only once to a tuple in the output.
  This favors joins over cross products.

## Search Space
There is a strong theoretical basis for the search space of schema mappings,
but the paper omits the details. In short, there are two main classes of
mappings:

1. **Vertical Compositions** (aka joins). N:1 joins through foreign keys are
   preferred. If not, outer joins are preferred over inner joins.
2. **Horizontal Compositions** (aka unions). Multiset union is used unless the
   sets being unioned can be shown to be disjoint.

## Query Discovery Algorithm
First, a bit of notation:

- Let $S_1$, $\ldots$, $S_n$ be a set of source relations.
- Let $T_1$, $\ldots$, $T_n$ be a set of source relations.
- Let $A$ range over source attributes.
- Let $B$ range over target attributes.
- Let $dom(A)$ be the domain of attribute $A$.
- Let $\mu(A)$ = ($\mu_1(A)$, $\ldots$, $\mu_n(A)$) be the tuple of metadata
  for attribute $A$.
- Let $v_i = (f_i, p_i)$ be a value correspondence with correspondence function
  $f_i$ that takes in values and metadata from domains $Attrs(f_i)$ and returns
  a value of attribute $TargetAttr(f_i)$ and filter $p_i$ that takes in values
  and metadata from domains $Attrs(p_i)$ and returns a boolean.

Given a set $V$ of value correspondences and a target relation $T$, we only
consider the value correspondences where $Attrs(f_i)$ is an attribute in $T$.
We generate a multiple candidate sets of value correspondences where each
candidate set is mapped to a single SELECT-FROM-WHERE query. All queries are
then unioned together. The procedure proceeds in four phases:

1. We partition $V$ into a set of **candidate sets** where each candidate set
   $c_i$ is a set of value correspondences. A candidate set does not contain
   multiple value correspondences which map to the same target attribute. We
   say a candidate set is complete if it has a value correspondence that maps
   to *every* attribute in the target relation. The set of candidate sets is
   huge, but they are accessed in a pipeline and can be processed in a smart
   order where complete candidate sets and candidate sets with fewer source
   relations are favored.
2. We prune candidate sets. For each candidate set with multiple source
   relations, we try to generate a join ordering by traversing foreign keys. If
   multiple exist, a user is prompted to select one. If none exist, we can find
   approximate foreign keys or just ask a user for a join ordering. If no good
   join ordering is found, the candidate set is filtered out.
3. We find a set of candidate sets that cover the attributes of the target
   relation. We favor covers with fewer candidate sets, but have a user select
   the best one.
4. We generate a SQL query for each candidate set and union together all the
   queries. The query generation is somewhat straightforward.

## Making the Algorithm Incremental
Given a cover $\Gamma$ and an insertion or deletion of a value correspondence
$\Delta V$, we want to output a new schema mapping query. The incremental
update algorithm proceeds in three phases.

1. For each candidate set $c_i \in \Gamma$, we try to add the new value
   correspondence to $c_i$ and find a new join ordering as above. If no
   candidate set can accommodate the new value correspondence, then we create a
   new singleton candidate set. If $\Delta V$ is a deletion, then we delete the
   value correspondence.
2. For every candidate set $c_i \in \Gamma$ that could accommodate the new
   value correspondence, we generate a new cover with the value correspondence
   inserted. The user selects the best cover.
3. We generate a query as above.

## Nested-Sets in Target Relations
This algorithm can be tweaked to work for output relations which include
relations within a column. Covers for every relation (nested or otherwise) are
formed into a tree. Children queries may additionally need to join with
parents. See paper for details.

<script type="text/javascript" async
  src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/MathJax.js?config=TeX-MML-AM_CHTML">
</script>
