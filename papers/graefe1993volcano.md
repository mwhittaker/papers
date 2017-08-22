# [The Volcano Optimizer Generator: Extensibility and Efficient Search (1993)](https://scholar.google.com/scholar?cluster=23045311511264775115)
Query optimizers take in a query (e.g. `SELECT x FROM Foo WHERE x = 10 ORDER BY
x`) and output a plan to efficiently execute the query (e.g. Perform a B+ tree
index only scan on `Foo`). **Optimizer generators** take in a model of queries
and plans and output a query optimizer that performs the actual optimization.
This paper describes the Volcano optimizer generator which is an improved
version of the authors' previous work on the EXODUS optimizer generator.

## Optimizer Generator Input and Optimizer Output
The Volcano optimizer generator takes as input the following things.

1. **A set of logical operators** (and their arities) that compose the
   **logical algebra** in which queries are written. For example, the logical
   algebra of a relational database is the relational algebra, and the
   operators include things like select, project, and join.
2. **A set of physical algorithms** (and their arities) that compose the
   **physical algebra** in which plans are formed. For example, the physical
   operators of a relational database would be things like sort-merge join,
   hash join, nested loop join, full table scan, etc.
3. **A set of algebraic transformation rules** which transform a logical
   algebra expression into another logical algebra expression. These rules are
   written like the rules you'd see in a match expression in a functional
   programming language. For example, `a JOIN b -> b JOIN a` is a rule which
   says joining is commutative.
4. **A set of implementation rules** which define how a logical algebra
   expression can be mapped to a physical algebra expression. For example, `a
   JOIN b -> a TNLJ b` is a rule which says that a join can be implemented
   using a tuple-nested loop join.
5. Some algorithms have no corresponding logical algebra operator. For example,
   the sort algorithm has no corresponding logical relational operator. These
   algorithms are called **enforcers** and are used to enforce certain physical
   properties without affecting logical semantics.
6. **An abstract cost data type** and **a cost function** for each algorithm
   and enforcer. Volcano generated query optimizers try to find a plan with
   minimum cost, but the definition of cost is left to the database
   implementor. For example, a cost function for a relational database could
   count the number of I/Os. A System R style cost function might take into
   consideration the number of I/Os and the expected CPU cost. The cost
   function assigns a cost to each algorithm and enforcer.
7. **An abstract data type for logical and physical properties.** Logical
   properties describe logical algebra expressions (technically, equivalence
   classes of logical algebra expressions). For example, a logical property
   might be the number of output tuples or the schema of the output. Physical
   properties describe physical algebra expressions. For example, a physical
   property might be the sort order. Users must also supply a **property
   function** for each operator, algorithm, and enforcer.
8. **An applicability function for each algorithm and enforcer** which returns
   whether or not an algorithm or enforcer can implement a logical algebra
   expression and provide a certain set of physical properties. The
   applicability function also outputs the physical properties required of its
   inputs. For example, the sort merge join algorithm can implement a logical
   join with the requirement that the output is sorted on the join columns with
   the requirements that both of its inputs are sorted on the join columns.

## Design Principles
The Volcano optimizer generator follows the following design principles:

1. **Lots of domains can be modelled with algebras.** Here, the term algebra is
   used a bit loosely and roughly refers to things that look like relational
   algebra.
2. **Patterns and rules are great for specifying transformations.**
3. **Don't use intermediate representations.** Just compile straight from
   queries to plans. This simplifies the life of a database implementer as they
   no longer have to specify a bunch of intermediate representations.
4. **Compile plans, don't interpret them.**
5. **Use dynamic programming in the search algorithm.**

## The Search Engine
The algorithm used by Volcano generated query optimizers uses
backwards-chaining and dynamic programming.

The algorithm takes as input (1) a logical expression to optimize, (2) a set of
physical properties to satisfy (e.g. a sort order specified by a query), and
(3) a cost limit. The cost limit can be set to infinity, but can also be set to
some smaller number to ensure that no outrageously expensive plan is generated.

The algorithm maintains a memoization table mapping pairs of (logical
expression equivalence class, set of physical properties) to the most efficient
physical plan found so far.

For example, consider (1) the following input query with (2) no physical
properties to satisfy and (3) an infinite cost limit.

<div id="tree1" style="width: 100%; height: 150pt;"></div>

The algorithm considers three **moves** it can perform. *First*, it can apply a
logical transformation rule to convert the query to an equivalent query. For
example, we might rewrite the query to reorder the join, as shown below. After
we transform the query, we recurse.

<div id="tree2" style="width: 100%; height: 150pt;"></div>

*Second*, we can instantiate a logical operator with a physical algorithm. We
use the applicability function to determine whether the algorithm can implement
the operator and satisfy the physical properties. We then recurse on the
children of the algorithm using the required physical properties generated by
the applicability function. If we ever bust the cost limit, we bail out early.
Here, we instantiate the top join with a sort merge join.

<div id="tree3" style="width: 100%; height: 150pt;"></div>

Then, we recurse on the children. Here, we show the left child with the
requirement that the output of this child is sorted on the join column of the
sort merge join.

<div id="tree4" style="width: 100%; height: 75pt;"></div>

*Third*, we can apply an enforcer. For example, we could apply a sort enforcer
for this child and recurse on the same logical algebra expression but without
the requirement that the output is sorted (it will be sorted by the sort
enforcer).

See the paper for a full description of the algorithm and an overview of some
small tricks to speed things up.

## Comparison to the EXODUS Optimizer Generator
The EXODUS code was messy and slow. Here are the main differences between
EXODUS and Volcano.

1. EXODUS did not distinguish logical from physical algebra which led to some
   inefficiencies.
2. EXODUS had no notion of physical properties.
3. EXODUS did not use a top-down search strategy and ended up re-analyzing a
   lot of things. In particular, it would optimize the root of the tree then
   change the leaves and end up having to re-optimize the roots.
4. EXODUS did not have a generic cost function.
5. It is easier to modify Volcano's generated search strategy.

<script src="https://cdnjs.cloudflare.com/ajax/libs/cytoscape/3.1.0/cytoscape.min.js"></script>
<script src="https://cdn.rawgit.com/cpettitt/dagre/v0.7.4/dist/dagre.js"></script>
<script src="https://cdn.rawgit.com/cytoscape/cytoscape.js-dagre/1.5.0/cytoscape-dagre.js"></script>
<script type="text/javascript">
  function main() {
    var style = [
      {
        selector: "node",
        style: {
          "background-color": "white",
          "text-halign": "center",
          "text-valign": "center",
          "label": "data(label)",
        }
      },
      {
        selector: "edge",
        style: {
          "width": 2,
          "line-color": "#ccc",
        }
      }
    ];

    var layout = {
      name: "dagre",
      padding: 0,
      nodeSep: 20,
      edgeSep: 20,
      rankSep: 20,
    };

    var tree1 = cytoscape({
      container: document.getElementById("tree1"),
      elements: [
        {data: {id: "j1", label: "JOIN"}},
        {data: {id: "j2", label: "JOIN"}},
        {data: {id: "a",  label: "A"}},
        {data: {id: "b",  label: "B"}},
        {data: {id: "c",  label: "C"}},
        {data: {source: "j1", target: "j2"}},
        {data: {source: "j1", target: "c"}},
        {data: {source: "j2", target: "a"}},
        {data: {source: "j2", target: "b"}},
      ],
      style: style,
      layout: layout,
    });

    var tree2 = cytoscape({
      container: document.getElementById("tree2"),
      elements: [
        {data: {id: "j1", label: "JOIN"}},
        {data: {id: "j2", label: "JOIN"}},
        {data: {id: "a",  label: "A"}},
        {data: {id: "b",  label: "B"}},
        {data: {id: "c",  label: "C"}},
        {data: {source: "j1", target: "j2"}},
        {data: {source: "j1", target: "b"}},
        {data: {source: "j2", target: "a"}},
        {data: {source: "j2", target: "c"}},
      ],
      style: style,
      layout: layout,
    });

    var tree3 = cytoscape({
      container: document.getElementById("tree3"),
      elements: [
        {data: {id: "j1", label: "SMJ"}},
        {data: {id: "j2", label: "JOIN"}},
        {data: {id: "a",  label: "A"}},
        {data: {id: "b",  label: "B"}},
        {data: {id: "c",  label: "C"}},
        {data: {source: "j1", target: "j2"}},
        {data: {source: "j1", target: "b"}},
        {data: {source: "j2", target: "a"}},
        {data: {source: "j2", target: "c"}},
      ],
      style: style,
      layout: layout,
    });

    var tree4 = cytoscape({
      container: document.getElementById("tree4"),
      elements: [
        {data: {id: "j1", label: "JOIN"}},
        {data: {id: "a",  label: "A"}},
        {data: {id: "c",  label: "C"}},
        {data: {source: "j1", target: "a"}},
        {data: {source: "j1", target: "c"}},
      ],
      style: style,
      layout: layout,
    });

    var trees = [tree1, tree2, tree3, tree4];
    for (var i = 0; i < trees.length; ++i) {
      var tree = trees[i];
      tree.panningEnabled(false);
      tree.userPanningEnabled(false);
      tree.zoomingEnabled(false);
      tree.userZoomingEnabled(false);
      tree.boxSelectionEnabled(false);
      tree.nodes().ungrabify();
    }
  }

  window.onload = main;
</script>
