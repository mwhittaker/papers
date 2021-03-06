<style>
  svg text {
    font-size: 8pt;
  }

  center {
    margin-top: 0em;
    margin-bottom: 1.15em;
  }

  @media screen and (min-width: 800px) {
    .shrink {
      width: 50%;
    }
  }
</style>

# [Transaction Management in the R\* Distributed Database Management System (1986)](https://scholar.google.com/scholar?cluster=6135007404184895390)
This paper describes the vanilla two-phase commit protocol, extends it to a
hierarchical two-phase commit protocol, and then introduces three protocol
optimizations to take advantage of presumed aborts, partially/fully read-only
transactions, and presumed commits. It also discusses how R\* detects deadlocks
and chooses a victim to kill. Two-phase commit is one of those things where the
more you understand it, the more you understand that you don't understand it.
Good luck!

## Two-Phase Commit
Two-phase commit is an atomic commitment protocol. The goal of the protocol is
to have a set of nodes either all commit or all abort. One node is designated
as the **coordinator** and all other nodes are designated as the
**subordinates**. The protocol proceeds in two rounds:

1. In the first round, the coordinator sends **prepare** messages to all
   subordinates. Every subordinate returns either a vote **yes** to commit or
   a vote **no** to abort.
2. In the second round, the coordinator sends a **commit** message to all
   subordinates if they all voted yes. Otherwise, if *any* subordinate voted
   no, the coordinator sends an **abort** message to all the subordinates that
   voted yes.

In Figure 1, Figure 2, and Figure 3, we illustrate a sequence of messages sent
between a coordinator (left) and subordinate (right) assuming no failures. In
Figure 1, all subordinates vote yes. In Figure 2, the subordinate votes yes but
another subordinate votes no. In Figure 3, the subordinate votes no.

Now, let's discuss what the coordinator does when it crashes and restarts.

- The **red state** and **green state** are indistinguishable. In these states,
  the coordinator aborts the transaction and forgets about it. If the coordinator knows the
  participating subordinates, it can send abort messages to them. If a
  subordinate contacts the coordinator in these states, the coordinator will
  have forgotten about the transaction and reply with an abort.
- The **blue state** and **brown state** are indistinguishable. In these
  states, the coordinator must proceed with either the commit or the abort.  If
  the force-written log entry contains the address of all the participants, the
  coordinator can send a commit or abort message to all subordinates. If a
  subordinates contacts the coordinator in this state, it will reply with a
  commit or abort. Note that the coordinator could force-write end log entries
  to avoid re-sending messages to subordinates.

And the subordinate:

- In the **red state**, the subordinate abort the transaction.
- In the **green state**, the subordinate is uncertain about the outcome of the
  transaction and must contact the coordinator to ask for the outcome. As an
  optimization, it can also ask other subordinates.
- In the **blue state**, the transaction no longer needs to contact the
  coordinator. It either commits or aborts.

<center>
 <div class="shrink">
  <svg viewBox="0 0 250 190" id="twopc_yes_commit"></svg>
 </div>
 <caption>Figure 1. Subordinate votes yes; transaction commits.</caption>
</center>
<center>
 <div class="shrink">
  <svg viewBox="0 0 250 190" id="twopc_yes_abort"></svg>
 </div>
 <caption>Figure 2. Subordinate votes yes; transaction aborts.</caption>
</center>
<center>
 <div class="shrink">
  <svg viewBox="0 0 250 190" id="twopc_no_abort"></svg>
 </div>
 <caption>Figure 3. Subordinate votes no; transaction aborts.</caption>
</center>

# Hierarchical 2PC
In hierarchical two-phase commit, nodes are organized in a tree, and each node
can only talk to its parent and its children. The root of the tree is the
coordinator, the leaves of the tree are subordinates, and the internal nodes
play the role of both. The root and the leaves behave as usual. The inner nodes
forward prepare messages down the tree and aggregate votes up the tree. That
is, if all of an inner node's children vote yes, the node forwards a yes
upward. If *any* of the children vote no, the inner node forwards a no upward
and also sends abort messages downward. When an inner node receives a commit or
abort message, it force writes it, sends an acknowledgement upward, and
forwards the abort or commit downward.

## Presumed Abort
Presumed abort recognizes that if a coordinator doesn't know about a
transaction, it presumes that it aborted. This allows us to avoid sending some
messages and avoid force writing some log entries.

Coordinator action on restart:

- The **red state**, the **green state**, and the **orange state** are
  indistinguishable. In these states, the coordinator aborts the transaction.
  If the coordinator knows the addresses of the subordinates, it can send them
  aborts. If a subordinate contacts the coordinator in one of these states, the
  coordinator will have forgotten the transaction and reply with an abort.
- The **blue state** and the **brown state** are indistinguishable. In these
  states, the coordinator must continue with the commit. If the force-written
  commit log entry contains the addresses of the subordinates, the coordinator
  can resend commit messages to them. Otherwise, if a subordinate contacts the
  coordinator in one of these two states, it will reply with a commit.

Subordinate action on restart:

- The **red state** and the **orange state** are indistinguishable. In one of these
  two states, the subordinate aborts the transaction.
- The **green state** and **brown state** are indistinguishable. In one of
  these two states, the subordinate is not sure the fate of the transaction and
  must contact the coordinator or another subordinate.  Note that a subordinate
  can force-write aborts to avoid having to contact the coordinator after
  crashing in the brown state.
- In the **blue state**, the subordinate does not contact the coordinator and
  commits the transaction.

<center>
 <div class="shrink">
  <svg viewBox="0 0 250 190" id="twopcpa_yes_commit"></svg>
 </div>
 <caption>Figure 4. Subordinate votes yes; transaction commits.</caption>
</center>
<center>
 <div class="shrink">
  <svg viewBox="0 0 250 190" id="twopcpa_yes_abort"></svg>
 </div>
 <caption>Figure 5. Subordinate votes yes; transaction aborts.</caption>
</center>
<center>
 <div class="shrink">
  <svg viewBox="0 0 250 190" id="twopcpa_no_abort"></svg>
 </div>
 <caption>Figure 6. Subordinate votes no; transaction aborts.</caption>
</center>

## Read-Only Subordinates
If any subordinate only performed reads, then it responds to prepare messages
with a read vote and then completely forgets about the transaction without
logging anything. If a coordinator receives all read votes, it also forgets
about the transaction and logs nothing.

## Presumed Commit
Presumed abort acks commits but not aborts. Ideally, commits are more common
than aborts, so we'd like to instead ack aborts but not commits. In order to do
so, the coordinator will have to presume that a transaction is committed if it
has forgotten about it.

Coordinator action on restart:

- In the **red state**, the coordinator aborts the transaction.
- The **green state**, the **blue state**, and the **orange state** are
  indistinguishable. In this state, the coordinator sends abort messages to all
  subordinates (which are written in the collecting log entry) and awaits their
  acknowledgement. The coordinator can not forget about the aborted transaction
  until has received acknowledgements from all the subordinates.
- In the **brown state**, the coordinator commits the transaction. If it stores
  the addresses of all subordinates in the commit log entry, it can send commit
  messages to the subordinates. Otherwise, if a subordinates contacts the
  coordinator in the brown state, the coordinator will have forgotten about the
  transaction and respond with a commit message.

Subordinate action on restart:

- The **red state** and **orange state** are indistinguishable. The subordinate
  aborts the transaction.
- The **green state** and the **blue state** are indistinguishable. The
  subordinate is unsure of the fate of the transaction and contacts the
  coordinator or another subordinate. Note that if subordinates force-write
  commit entries, they could avoid contacting other nodes in the blue state.
- In the **brown state**, the subordinate aborts the transaction and must
  ensure that the coordinator has received its acknowledgement.

<center>
 <div class="shrink">
  <svg viewBox="0 0 250 190" id="twopcpc_yes_commit"></svg>
 </div>
 <caption>Figure 7. Subordinate votes yes; transaction commits.</caption>
</center>
<center>
 <div class="shrink">
  <svg viewBox="0 0 250 190" id="twopcpc_yes_abort"></svg>
 </div>
 <caption>Figure 8. Subordinate votes yes; transaction aborts.</caption>
</center>
<center>
 <div class="shrink">
  <svg viewBox="0 0 250 190" id="twopcpc_no_abort"></svg>
 </div>
 <caption>Figure 9. Subordinate votes no; transaction aborts.</caption>
</center>

TODO: deadlock detection section.

<script src="https://cdnjs.cloudflare.com/ajax/libs/snap.svg/0.5.1/snap.svg.js"></script>
<script type="text/javascript">
  function x(element) {
    return Number(element.attr("x"));
  }

  function y(element) {
    return Number(element.attr("y"));
  }

  function rightJustify(element) {
    element.attr({
      "text-anchor": "end",
      "alignment-baseline": "middle",
    });
    return element;
  }

  function leftJustify(element) {
    element.attr({
      "text-anchor": "start",
      "alignment-baseline": "middle",
    });
    return element;
  }

  function bold(element) {
      element.attr({fontWeight: "bold"})
      return element;
  }

  function twopc_yes_commit() {
    var s = Snap("#twopc_yes_commit");
    var leftx = 110;
    var rightx = 150;

    var l1 = rightJustify(s.text(leftx, 40, "send prepare"));
    var l2 = bold(rightJustify(s.text(leftx, 90, "force-write commit")));
    var l3 = rightJustify(s.text(leftx, 100, "send commit"));
    var l4 = rightJustify(s.text(leftx, 150, "write end"));

    var r1 = bold(leftJustify(s.text(rightx, 60, "force-write prepare")));
    var r2 = leftJustify(s.text(rightx, 70, "send yes"));
    var r3 = bold(leftJustify(s.text(rightx, 120, "force-write commit")));
    var r4 = leftJustify(s.text(rightx, 130, "send ACK"));
    var r5 = leftJustify(s.text(rightx, 140, "commit"));

    s.line(x(l1), y(l1), x(r1), y(r1)).attr({stroke:"black"});
    s.line(x(r2), y(r2), x(l2), y(l2)).attr({stroke:"black"});
    s.line(x(l3), y(l3), x(r3), y(r3)).attr({stroke:"black"});
    s.line(x(r4), y(r4), x(l4), y(l4)).attr({stroke:"black"});

    var dy = 10;
    function with_color(element, color) {
      element.attr({stroke:color, strokeWidth:"2pt", strokeOpacity:0.5});
    }
    with_color(s.line(x(l1), y(l1)-40, x(l1), y(l1)-dy), "red");
    with_color(s.line(x(l1), y(l1)+dy, x(l2), y(l2)-dy), "green");
    with_color(s.line(x(l3), y(l3)+dy, x(l4), y(l4)-dy), "blue");
    with_color(s.line(x(l4), y(l4)+dy, x(l4), y(l4)+40), "brown");

    with_color(s.line(x(r1), y(r1)-80, x(r1), y(r1)-dy), "red");
    with_color(s.line(x(r2), y(r2)+dy, x(r3), y(r3)-dy), "green");
    with_color(s.line(x(r5), y(r5)+dy, x(r5), y(r5)+80), "blue");
  }

  function twopc_yes_abort() {
    var s = Snap("#twopc_yes_abort");
    var leftx = 110;
    var rightx = 150;

    var l1 = rightJustify(s.text(leftx, 40, "send prepare"));
    var l2 = bold(rightJustify(s.text(leftx, 90, "force-write abort")));
    var l3 = rightJustify(s.text(leftx, 100, "send abort"));
    var l4 = rightJustify(s.text(leftx, 150, "write end"));

    var r1 = bold(leftJustify(s.text(rightx, 60, "force-write prepare")));
    var r2 = leftJustify(s.text(rightx, 70, "send yes"));
    var r3 = bold(leftJustify(s.text(rightx, 120, "force-write abort")));
    var r4 = leftJustify(s.text(rightx, 130, "send ACK"));
    var r5 = leftJustify(s.text(rightx, 140, "abort"));

    s.line(x(l1), y(l1), x(r1), y(r1)).attr({stroke:"black"});
    s.line(x(r2), y(r2), x(l2), y(l2)).attr({stroke:"black"});
    s.line(x(l3), y(l3), x(r3), y(r3)).attr({stroke:"black"});
    s.line(x(r4), y(r4), x(l4), y(l4)).attr({stroke:"black"});

    var dy = 10;
    function with_color(element, color) {
      element.attr({stroke:color, strokeWidth:"2pt", strokeOpacity:0.5});
    }
    with_color(s.line(x(l1), y(l1)-40, x(l1), y(l1)-dy), "red");
    with_color(s.line(x(l1), y(l1)+dy, x(l2), y(l2)-dy), "green");
    with_color(s.line(x(l3), y(l3)+dy, x(l4), y(l4)-dy), "blue");
    with_color(s.line(x(l4), y(l4)+dy, x(l4), y(l4)+40), "brown");

    with_color(s.line(x(r1), y(r1)-80, x(r1), y(r1)-dy), "red");
    with_color(s.line(x(r2), y(r2)+dy, x(r3), y(r3)-dy), "green");
    with_color(s.line(x(r5), y(r5)+dy, x(r5), y(r5)+80), "blue");
  }

  function twopc_no_abort() {
    var s = Snap("#twopc_no_abort");
    var leftx = 110;
    var rightx = 150;

    var l1 = rightJustify(s.text(leftx, 40, "send prepare"));
    var l2 = bold(rightJustify(s.text(leftx, 90, "force-write abort")));
    var l3 = rightJustify(s.text(leftx, 100, "send abort"));
    var l4 = rightJustify(s.text(leftx, 150, "write end"));

    var r1 = bold(leftJustify(s.text(rightx, 60, "force-write abort")));
    var r2 = leftJustify(s.text(rightx, 70, "send no"));
    var r3 = leftJustify(s.text(rightx, 80, "abort"));

    s.line(x(l1), y(l1), x(r1), y(r1)).attr({stroke:"black"});
    s.line(x(r2), y(r2), x(l2), y(l2)).attr({stroke:"black"});

    var dy = 10;
    function with_color(element, color) {
      element.attr({stroke:color, strokeWidth:"2pt", strokeOpacity:0.5});
    }
    with_color(s.line(x(l1), y(l1)-40, x(l1), y(l1)-dy), "red");
    with_color(s.line(x(l1), y(l1)+dy, x(l2), y(l2)-dy), "green");
    with_color(s.line(x(l3), y(l3)+dy, x(l4), y(l4)-dy), "blue");
    with_color(s.line(x(l4), y(l4)+dy, x(l4), y(l4)+40), "brown");

    with_color(s.line(x(r1), y(r1)-80, x(r1), y(r1)-dy), "red");
    with_color(s.line(x(r3), y(r3)+dy, x(r3), y(r3)+200), "blue");
  }

  function twopcpa_yes_commit() {
    var s = Snap("#twopcpa_yes_commit");
    var leftx = 110;
    var rightx = 150;

    var l1 = rightJustify(s.text(leftx, 40, "send prepare"));
    var l2 = bold(rightJustify(s.text(leftx, 90, "force-write commit")));
    var l3 = rightJustify(s.text(leftx, 100, "send commit"));
    var l4 = rightJustify(s.text(leftx, 150, "write end"));

    var r1 = bold(leftJustify(s.text(rightx, 60, "force-write prepare")));
    var r2 = leftJustify(s.text(rightx, 70, "send yes"));
    var r3 = bold(leftJustify(s.text(rightx, 120, "force-write commit")));
    var r4 = leftJustify(s.text(rightx, 130, "send ACK"));
    var r5 = leftJustify(s.text(rightx, 140, "commit"));

    s.line(x(l1), y(l1), x(r1), y(r1)).attr({stroke:"black"});
    s.line(x(r2), y(r2), x(l2), y(l2)).attr({stroke:"black"});
    s.line(x(l3), y(l3), x(r3), y(r3)).attr({stroke:"black"});
    s.line(x(r4), y(r4), x(l4), y(l4)).attr({stroke:"black"});

    var dy = 10;
    function with_color(element, color) {
      element.attr({stroke:color, strokeWidth:"2pt", strokeOpacity:0.5});
    }
    with_color(s.line(x(l1), y(l1)-40, x(l1), y(l1)-dy), "red");
    with_color(s.line(x(l1), y(l1)+dy, x(l2), y(l2)-dy), "green");
    with_color(s.line(x(l3), y(l3)+dy, x(l4), y(l4)-dy), "blue");
    with_color(s.line(x(l4), y(l4)+dy, x(l4), y(l4)+40), "brown");

    with_color(s.line(x(r1), y(r1)-80, x(r1), y(r1)-dy), "red");
    with_color(s.line(x(r2), y(r2)+dy, x(r3), y(r3)-dy), "green");
    with_color(s.line(x(r5), y(r5)+dy, x(r5), y(r5)+80), "blue");
  }


  function twopcpa_yes_abort() {
    var s = Snap("#twopcpa_yes_abort");
    var leftx = 110;
    var rightx = 150;

    var l1 = rightJustify(s.text(leftx, 40, "send prepare"));
    var l2 = rightJustify(s.text(leftx, 90, "write abort"));
    var l3 = rightJustify(s.text(leftx, 100, "send abort"));

    var r1 = bold(leftJustify(s.text(rightx, 60, "force-write prepare")));
    var r2 = leftJustify(s.text(rightx, 70, "send yes"));
    var r3 = leftJustify(s.text(rightx, 120, "write abort"));
    var r4 = leftJustify(s.text(rightx, 130, "abort"));

    s.line(x(l1), y(l1), x(r1), y(r1)).attr({stroke:"black"});
    s.line(x(r2), y(r2), x(l2), y(l2)).attr({stroke:"black"});
    s.line(x(l3), y(l3), x(r3), y(r3)).attr({stroke:"black"});

    var dy = 10;
    function with_color(element, color) {
      element.attr({stroke:color, strokeWidth:"2pt", strokeOpacity:0.5});
    }
    with_color(s.line(x(l1), y(l1)-40, x(l1), y(l1)-dy), "red");
    with_color(s.line(x(l1), y(l1)+dy, x(l2), y(l2)-dy), "green");
    with_color(s.line(x(l3), y(l3)+dy, x(l3), y(l3)+100), "orange");

    with_color(s.line(x(r1), y(r1)-100, x(r1), y(r1)-dy), "red");
    with_color(s.line(x(r2), y(r2)+dy, x(r3), y(r3)-dy), "green");
    with_color(s.line(x(r4), y(r4)+dy, x(r4), y(r4)+100), "brown");
  }

  function twopcpa_no_abort() {
    var s = Snap("#twopcpa_no_abort");
    var leftx = 110;
    var rightx = 150;

    var l1 = rightJustify(s.text(leftx, 40, "send prepare"));
    var l2 = rightJustify(s.text(leftx, 90, "write abort"));
    var l3 = rightJustify(s.text(leftx, 100, "send abort"));

    var r1 = leftJustify(s.text(rightx, 60, "write abort"));
    var r2 = leftJustify(s.text(rightx, 70, "send no"));
    var r3 = leftJustify(s.text(rightx, 80, "abort"));

    s.line(x(l1), y(l1), x(r1), y(r1)).attr({stroke:"black"});
    s.line(x(r2), y(r2), x(l2), y(l2)).attr({stroke:"black"});

    var dy = 10;
    function with_color(element, color) {
      element.attr({stroke:color, strokeWidth:"2pt", strokeOpacity:0.5});
    }
    with_color(s.line(x(l1), y(l1)-40, x(l1), y(l1)-dy), "red");
    with_color(s.line(x(l2), y(l1)+dy, x(l2), y(l2)-dy), "green");
    with_color(s.line(x(l3), y(l3)+dy, x(l3), y(l3)+200), "orange");

    with_color(s.line(x(r1), y(r1)-80, x(r1), y(r1)-dy), "red");
    with_color(s.line(x(r3), y(r3)+dy, x(r3), y(r3)+200), "orange");
  }

  function twopcpc_yes_commit() {
    var s = Snap("#twopcpc_yes_commit");
    var leftx = 110;
    var rightx = 150;

    var l1 = bold(rightJustify(s.text(leftx, 40, "force-write collecting")));
    var l2 = rightJustify(s.text(leftx, 50, "send prepare"));
    var l3 = bold(rightJustify(s.text(leftx, 100, "force-write commit")));
    var l4 = rightJustify(s.text(leftx, 110, "send commit"));

    var r1 = bold(leftJustify(s.text(rightx, 70, "force-write prepare")));
    var r2 = leftJustify(s.text(rightx, 80, "send yes"));
    var r3 = leftJustify(s.text(rightx, 130, "commit"));

    s.line(x(l2), y(l2), x(r1), y(r1)).attr({stroke:"black"});
    s.line(x(r2), y(r2), x(l3), y(l3)).attr({stroke:"black"});
    s.line(x(l4), y(l4), x(r3), y(r3)).attr({stroke:"black"});

    var dy = 10;
    function with_color(element, color) {
      element.attr({stroke:color, strokeWidth:"2pt", strokeOpacity:0.5});
    }
    with_color(s.line(x(l1), y(l1)-40, x(l1), y(l1)-dy), "red");
    with_color(s.line(x(l2), y(l2)+dy, x(l3), y(l3)-dy), "green");
    with_color(s.line(x(l4), y(l4)+dy, x(l4), y(l4)+200), "brown");

    with_color(s.line(x(r1), y(r1)-80, x(r1), y(r1)-dy), "red");
    with_color(s.line(x(r2), y(r2)+dy, x(r3), y(r3)-dy), "green");
    with_color(s.line(x(r3), y(r3)+dy, x(r3), y(r3)+80), "blue");
  }

  function twopcpc_yes_abort() {
    var s = Snap("#twopcpc_yes_abort");
    var leftx = 110;
    var rightx = 150;

    var l1 = bold(rightJustify(s.text(leftx, 40, "force-write collecting")));
    var l2 = rightJustify(s.text(leftx, 50, "send prepare"));
    var l3 = rightJustify(s.text(leftx, 100, "abort"));
    var l4 = rightJustify(s.text(leftx, 110, "send abort"));
    var l5 = rightJustify(s.text(leftx, 160, "write end"));

    var r1 = bold(leftJustify(s.text(rightx, 70, "force-write prepare")));
    var r2 = leftJustify(s.text(rightx, 80, "send yes"));
    var r3 = bold(leftJustify(s.text(rightx, 130, "force-write abort")));
    var r4 = leftJustify(s.text(rightx, 140, "send ack"));
    var r5 = leftJustify(s.text(rightx, 150, "abort"));

    s.line(x(l2), y(l2), x(r1), y(r1)).attr({stroke:"black"});
    s.line(x(r2), y(r2), x(l3), y(l3)).attr({stroke:"black"});
    s.line(x(l4), y(l4), x(r3), y(r3)).attr({stroke:"black"});
    s.line(x(r4), y(r4), x(l5), y(l5)).attr({stroke:"black"});

    var dy = 10;
    function with_color(element, color) {
      element.attr({stroke:color, strokeWidth:"2pt", strokeOpacity:0.5});
    }
    with_color(s.line(x(l1), y(l1)-40, x(l1), y(l1)-dy), "red");
    with_color(s.line(x(l2), y(l2)+dy, x(l3), y(l3)-dy), "green");
    with_color(s.line(x(l4), y(l4)+dy, x(l5), y(l5)-dy), "blue");
    with_color(s.line(x(l5), y(l5)+dy, x(l5), y(l5)+100), "orange");

    with_color(s.line(x(r1), y(r1)-100, x(r1), y(r1)-dy), "red");
    with_color(s.line(x(r2), y(r2)+dy, x(r3), y(r3)-dy), "green");
    with_color(s.line(x(r5), y(r5)+dy, x(r5), y(r5)+100), "brown");
  }

  function twopcpc_no_abort() {
    var s = Snap("#twopcpc_no_abort");
    var leftx = 110;
    var rightx = 150;

    var l1 = bold(rightJustify(s.text(leftx, 40, "force-write collecting")));
    var l2 = rightJustify(s.text(leftx, 50, "send prepare"));
    var l3 = rightJustify(s.text(leftx, 100, "abort"));
    var l4 = rightJustify(s.text(leftx, 110, "send abort"));
    var l5 = rightJustify(s.text(leftx, 160, "write end"));

    var r1 = leftJustify(s.text(rightx, 70, "write abort"));
    var r2 = leftJustify(s.text(rightx, 80, "send no"));
    var r3 = leftJustify(s.text(rightx, 90, "abort"));

    s.line(x(l2), y(l2), x(r1), y(r1)).attr({stroke:"black"});
    s.line(x(r2), y(r2), x(l3), y(l3)).attr({stroke:"black"});

    var dy = 10;
    function with_color(element, color) {
      element.attr({stroke:color, strokeWidth:"2pt", strokeOpacity:0.5});
    }
    with_color(s.line(x(l1), y(l1)-40, x(l1), y(l1)-dy), "red");
    with_color(s.line(x(l2), y(l2)+dy, x(l3), y(l3)-dy), "green");
    with_color(s.line(x(l4), y(l4)+dy, x(l5), y(l5)-dy), "blue");
    with_color(s.line(x(l5), y(l5)+dy, x(l5), y(l5)+200), "orange");

    with_color(s.line(x(r1), y(r1)-80, x(r1), y(r1)-dy), "red");
    with_color(s.line(x(r3), y(r3)+dy, x(r3), y(r3)+200), "orange");
  }

  function main() {
    twopc_yes_commit();
    twopc_yes_abort();
    twopc_no_abort();
    twopcpa_yes_commit();
    twopcpa_yes_abort();
    twopcpa_no_abort();
    twopcpc_yes_commit();
    twopcpc_yes_abort();
    twopcpc_no_abort();
  }

  window.onload = main;
</script>
