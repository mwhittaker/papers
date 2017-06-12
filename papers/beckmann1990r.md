<style>
svg text {
    font-family: monospace;
    text-anchor: start;
    alignment-baseline: hanging;
    font-size: 20pt;
}

.level1 {
    stroke: black;
    fill: transparent;
    stroke-dasharray: 10,5;
}

.level2 {
    stroke: blue;
    fill: transparent;
    stroke-dasharray: 10,5;
}

.level3 {
    stroke: red;
    fill: transparent;
}
</style>

# [The R\*-tree: An Efficient and Robust Access Method for Points and Rectangles (1990)](https://scholar.google.com/scholar?cluster=12598191799855638408)
This paper introduces the R\*-tree: an optimized variant of an R-tree. The
authors show that the R\*-tree outperforms all other R-tree variants on point
queries, rectangle intersection queries, rectangle enclosure queries, and
spatial join queries (e.g. select all overlapping objects).

## R-trees
An R-tree is a map from rectangles (or points) to values. You can insert a
rectangle and corresponding value and then search for regions that contain a
point, regions that intersect a rectangle, or regions that enclose a rectangle.

R-trees are implemented as a slight variant of a B+-tree. Internal nodes have
between $m$ and $M$ child pointers indexed by a bounding box. Similarly, leaf
nodes store between $m$ and $M$ entries and their associated bounding box. See
[Database Management Systems](http://pages.cs.wisc.edu/~dbbook/) for a good
introduction on implementing R-trees.

Below is an illustration of a simple R-tree.

<svg id="rtree" viewBox="0 0 1000 500"></svg>

R-trees can try to achieve some combination of the following things.

1. Minimize rectangle area.
2. Minimize rectangle overlap.
3. Minimize rectangle perimeter.
4. Maximize storage utilization (i.e. the number of entries in each node).

These goals are at odds with one another. Minimizing (1) and (2) typically
worsens (3) and (4).

## R-tree Variants
R-tree variants differ in their implementations of (1) a **ChooseSubtree**
method which determines into which leaf node an entry should be inserted and
(2) a **Split** method which determines how an overfull leaf node is split.

At every internal node, the **original ChooseSubtree method** selects the child
which requires the least amount of enlargement to accommodate the rectangle
being inserted, choosing the smallest child in the event of a tie. This method
aims to minimize the area of every rectangle in the R-tree.

The **original Split method** partitions $M + 1$ entries in two in a way that
minimizes the area of the two bounding boxes. An exact minimization takes
exponential time, but there are approximations that run in linear and quadratic
time.

The quadratic approximation begins by selecting two of the $M + 1$ rectangles
as seeds; one of the seeds goes in one partition, and the other seed goes in
the other partition. The two seeds are the two rectangles with the sparsest
bounding box. In the example below, `R2` and `R3` would be chosen as seeds.

<svg id="seed" viewBox="0 0 1000 500"></svg>

Then, for each entry, we compute the enlargement required to insert the entry
into both groups. The entry with the biggest difference between these two
enlargements is chosen and inserted into the group which requires less
enlargement.

**Greene's Split method** selects seeds in the same way. It then determines the
axis along which the seeds are most distant, and divides the entries in half
along this axis. In the example below, the $x$-axis is selected and the nodes
are divided into a group of `R1`-`R4` and a group of `R5`-`R8`.

<svg id="greene" viewBox="0 0 1000 300"></svg>

## R\*-tree
Given a node with entries $E_1, \ldots, E_n$ define the overlap of $E_k$ to be
  $$\sum_{i=1, i \neq k}^n \text{area}(E_k \cap E_i)$$

The **R\*-tree ChooseSubtree method** selects the child which increases overlap
the least. Ties are broken by least area increase and then least area.

The **R\*-tree Split method** sorts each entry along every axis (first by low
point, ties broken by high point). We then consider all possible splits of the
entries such that both partitions contain at least $m$ entries. The axis which
minimizes the sum of the perimeter of the bounding boxes for every partition is
chosen. Next, the points are sorted along the chosen axis and the partition
which minimizes bounding box overlap is selected (ties broken by minimum area).

R\*-trees also perform reinsertion during a regular insertion. If a node is
overfull, we sort the entries in decreasing order based on their center
distance to the center of the bounding box. We then reinsert the first $p$
values (for some $p$). These insertions may in turn cause more re-insertions,
but at most one reinsertion is performed at every level. Finally, if a split
still occurs, things are propagated upwards through the tree.

<script type="text/javascript">
  function add_rectangle(svg, name, cls, x, y, w, h) {
    var rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("x", x);
    rect.setAttribute("y", y);
    rect.setAttribute("width", w);
    rect.setAttribute("height", h);
    rect.setAttribute("class", cls);
    svg.appendChild(rect);

    var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    var padding = 3;
    text.setAttribute("x", x + padding);
    text.setAttribute("y", y + padding);
    text.innerHTML = name;
    svg.appendChild(text);
  }

  function rtree() {
    var svg = document.getElementById("rtree");
    add_rectangle(svg, "R1", "level1", 0, 0, 1000, 250);
    add_rectangle(svg, "R2", "level1", 500, 100, 400, 400);

    add_rectangle(svg, "R3", "level2", 10, 100, 300, 140);
    add_rectangle(svg, "R4", "level2", 400, 10, 590, 150);

    add_rectangle(svg, "R5", "level2", 510, 200, 100, 290);
    add_rectangle(svg, "R6", "level2", 600, 110, 290, 300);
  }

  function seed() {
    var svg = document.getElementById("seed");
    add_rectangle(svg, "R1", "level3", 0, 50, 600, 300);
    add_rectangle(svg, "R2", "level3", 400, 0, 500, 250);
    add_rectangle(svg, "R3", "level3", 100, 400, 600, 100);
  }

  function greene() {
    var svg = document.getElementById("greene");
    for (var i = 1; i <= 8; ++i) {
      var x = (900 / 8) * (i - 1);
      var y = Math.random() * 200;
      var w = (900 / 8) + 50;
      var h = 100;
      add_rectangle(svg, "R" + i, "level3", x, y, w, h);
    }
  }

  function main() {
    rtree();
    seed();
    greene();
  }

  window.onload = main;
</script>

<script type="text/javascript" async
  src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/MathJax.js?config=TeX-MML-AM_CHTML">
</script>
