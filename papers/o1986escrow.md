# [The Escrow Transactional Method (1986)](https://scholar.google.com/scholar?cluster=395072728627094003)
<style>
    .infvalsup {
        text-align: center;
        border-top: 0pt solid black;
        border-right: 0pt solid black;
        border-bottom: 2pt solid black;
        border-left: 0pt solid black;
    }

    .inf {
        text-align: center;
        border-top: 2pt solid black;
        border-right: 2pt solid gray;
        border-bottom: 2pt solid gray;
        border-left: 2pt solid black;
    }

    .val {
        text-align: center;
        border-top: 2pt solid black;
        border-right: 2pt solid gray;
        border-bottom: 2pt solid gray;
        border-left: 2pt solid gray;
    }

    .sup {
        text-align: center;
        border-top: 2pt solid black;
        border-right: 2pt solid black;
        border-bottom: 2pt solid gray;
        border-left: 2pt solid gray;
    }

    .timestamp {
        text-align: center;
        border-top: 2pt solid gray;
        border-right: 2pt solid black;
        border-bottom: 2pt solid black;
        border-left: 2pt solid black;
    }

    .northwest {
        border-top: 2pt solid black;
        border-right: 0pt solid black;
        border-bottom: 0pt solid black;
        border-left: 2pt solid black;
    }

    .northeast {
        border-top: 2pt solid black;
        border-right: 2pt solid black;
        border-bottom: 0pt solid black;
        border-left: 0pt solid black;
    }

    .west {
        border-top: 0pt solid black;
        border-right: 0pt solid black;
        border-bottom: 0pt solid black;
        border-left: 2pt solid black;
    }

    .east {
        border-top: 0pt solid black;
        border-right: 2pt solid black;
        border-bottom: 0pt solid black;
        border-left: 0pt solid black;
    }

    .southwest {
        border-top: 0pt solid black;
        border-right: 0pt solid black;
        border-bottom: 2pt solid black;
        border-left: 2pt solid black;
    }

    .southeast {
        border-top: 0pt solid black;
        border-right: 2pt solid black;
        border-bottom: 2pt solid black;
        border-left: 0pt solid black;
    }
</style>

Imagine that we have a database consisting of three integers `x`, `y`, and `z`,
each representing some amount of money. And, imagine that we have the following
transaction that transfers money from `x` and `y` to `z`, with the invariant
that all three dollar amounts are nonnegative.

```
if x - 10 >= 0:
  x -= 10
else:
  abort

if y - 20 >= 0:
  y -= 20
else:
  abort

z += 30
commit
```

Now imagine that we want to run this transaction many times concurrently with
itself. Using a standard two-phase locking approach, a transaction would lock
`x`, then lock `y`, and then lock `z`. This locking would limit the throughput
of the system because when one transaction has an exclusive lock on `x`, no
other transaction can touch `x`.

Worse, this locking is not necessary. Instead of issuing reads and writes,
transactions can issue reads, increments, and decrements. As long as a
transaction can guarantee that executing its increments or decrements will not
violate its invariants no matter which other transactions commit or abort, the
increments and decrements can be executed in any order, and transactions can
issue their increments and decrements without locking.

This is the main idea behind escrow transactions.

## The General Escrow Transactional Method
Escrow transactions provide the following API:

```
IF ESCROW(field=<F>, quantity=<C>, test=<condition>):
  continue with normall processing
ELSE:
  perform exception handling such as abort
```

If quantity `C` can be subtracted from field `F` with the guarantee that
`condition` will not be violated, then the `ESCROW` call returns true.
Otherwise it returns false. The tricky bit is that other in-progress
transactions may have incremented and decremented `F`, and we don't know which
of these transactions will commit and which will abort.

For example, imagine we want to issue a `ESCROW(a, 10, a >= 0)` command where
`a = 50` and where there are outstanding transactions with the following
increments and decrements: `+30`, `+10`, `-15`, `-10` and `-20`. If all of
these increments and decrements commit, then we're safe to subtract `10` from
`a`. However, if all the increments abort and all the decrements commit, then
we cannot subtract `10` from `a` while preserving our condition.

## Internal Design for the Escrow Method
To implement escrow transactions, we store a __logical field__ record with each
field in our database. The logical field contains four things:

- `inf`: the lowest possible value the field can take on given that some
  in-progress transactions abort and some commit
- `val`: the value the field can take on given that all transactions commit.
- `sup`: the highest possible value the field can take on given that some
  in-progress transactions abort and some commit.
- `timestamp`: a unique monotonically increasing timestamp.

In addition, whenever a transaction issues an escrow request, it appends an
__escrow journal entry__ to the logical field and updates the `INF`, `VAL`,
`SUP`, and `TIMESTAMP` fields accordingly. The journal entry includes:

- the __transaction id__,
- the __pool__ (an unimportant detail),
- the __lower bound__ on the condition (e.g. `x >= 10` has lower bound 10; `x
  <= 10` has lower bound -infty),
- the __upper bound__ on the condition (e.g. `x >= 10` has upper bound infty;
  `x <= 10` has upper bound 10),
- the __amount escrowed__, and
- the __amount used__ (an unimportant detail).

An escrow journal can be successfully appended only if performing the increment
or decrement satisfies the condition and all the conditions in existing journal
entries. This is best explained with the example below.

When a transaction commits or aborts, its journal entry is removed and the
values of `INF`, `VAL`, `SUP`, and `TIMESTAMP` are updated accordingly.

## An Example
Consider a field `A` that is initially equal to `100`. We have the following
logical field:
<center id="logical_field_0"></center>

Next, transaction 1 makes a `ESCROW(A, 50, A >= 0)` request. The request is
granted, and we get the following logical field:
<center id="logical_field_1"></center>

Next, transaction 2 makes a `ESCROW(A, 50, A >= 20)` request. The request is
denied because decrementing `50` would take `INF` below `20`.

Next, transaction 2 makes a `ESCROW(A, 20, A >= 30)` request. The request is
granted, and we get the following logical field:
<center id="logical_field_2"></center>

Next, transaction 1 makes a `ESCROW(A, 20, A >= 0)` request. The request is
denied because decrementing `20` from `A` would violated transaction 2's
journal entry.

Next, transaction 3 makes a `ESCROW(A, -30, A <= 200)` request. The request is
granted, and we get the following logical field:
<center id="logical_field_3"></center>

Then, transaction 1 commits:
<center id="logical_field_4"></center>

Transaction 2 commits:
<center id="logical_field_5"></center>

Transaction 3 commits:
<center id="logical_field_6"></center>

## Utility and Benefits of Escrow Transactions
Escrow transactions allow increment/decrement transactions to run with higher
degrees of concurrency. This is particularly important if the fields being
incremented and decremented are hot spots in an application.

Moreover, escrow transactions are guaranteed to never deadlock since escrow
requests are non-blocking. It is possible to have an escrow request wait on
other escrow requests, but deadlock detection becomes quite a bit more
complicated.

## Odds and Ends
This paper also discusses how to perform recovery for escrow transactions, but
the details are left for future work. It also discusses an API to `USE`
escrowed values, but the paper admits that this feature is not really
necessary.

<script type="text/javascript">
  function create_element(parent, name, attributes) {
    var el = document.createElement(name);
    for (var k in attributes) {
        if (attributes.hasOwnProperty(k)) {
          el.setAttribute(k, attributes[k]);
        }
    }
    parent.appendChild(el);
    return el;
  }

  function create_text(parent, text) {
    var el = document.createTextNode(text);
    parent.appendChild(el);
    return el;
  }

  function create_logical_field(field) {
    var table = document.createElement("table");

    // Header.
    var header_row = create_element(table, "tr", {});
    var header_attrs = {class: "infvalsup", colspan: 2}
    var inf_header = create_element(header_row, "td", header_attrs);
    create_text(inf_header, "INF");
    var val_header = create_element(header_row, "td", header_attrs);
    create_text(val_header, "VAL");
    var sup_header = create_element(header_row, "td", header_attrs);
    create_text(sup_header, "SUP");

    // Logical field.
    var infvalsup_row = create_element(table, "tr", {});
    var inf = create_element(infvalsup_row, "td", {class: "inf", colspan: 2});
    create_text(inf, field.inf);
    var val = create_element(infvalsup_row, "td", {class: "val", colspan: 2});
    create_text(val, field.val);
    var sup = create_element(infvalsup_row, "td", {class: "sup", colspan: 2});
    create_text(sup, field.sup);

    var ts_row = create_element(table, "tr", {});
    var ts = create_element(ts_row, "td", {class: "timestamp", colspan: 6})
    create_text(ts, "TIMESTAMP = " + field.timestamp);

    // Journal entries.
    for (var i = 0; i < field.journals.length; ++i) {
      var journal = field.journals[i];

      var row0 = create_element(table, "tr", {});
      var txn = create_element(row0, "td", {class: "northwest", colspan: 3});
      create_text(txn, "txn #" + journal.txn);
      var pool = create_element(row0, "td", {class: "northeast", colspan: 3});
      create_text(pool, "pool = " + journal.pool);

      var row1 = create_element(table, "tr", {});
      var lo = create_element(row1, "td", {class: "west", colspan: 3});
      create_text(lo, "low = " + journal.lo);
      var hi = create_element(row1, "td", {class: "east", colspan: 3});
      create_text(hi, "high = " + journal.hi);

      var row2 = create_element(table, "tr", {});
      var e = create_element(row2, "td", {class: "southwest", colspan: 3});
      create_text(e, "escrowed = " + journal.e);
      var u = create_element(row2, "td", {class: "southeast", colspan: 3});
      create_text(u, "used = " + journal.u);
    }

    return table;
  }

  function draw_logical_field(id, field) {
    var el = document.getElementById(id);
    el.appendChild(create_logical_field(field));
  }

  var f = {
    inf: 100,
    val: 100,
    sup: 100,
    timestamp: 0,
    journals: [],
  }
  draw_logical_field("logical_field_0", f);

  f.inf = 50;
  f.val = 50;
  f.timestamp = 1;
  f.journals.push({txn: 1, pool: "p", lo: 0, hi: "infty", e: 50, u: 50});
  draw_logical_field("logical_field_1", f);

  f.inf = 30;
  f.val = 30;
  f.timestamp = 2;
  f.journals.push({txn: 2, pool: "p", lo: 30, hi: "infty", e: 20, u: 20});
  draw_logical_field("logical_field_2", f);

  f.val = 60;
  f.sup = 130;
  f.timestamp = 3;
  f.journals.push({txn: 3, pool: "n", lo: "-infty", hi: 200, e: -30, u: -30});
  draw_logical_field("logical_field_3", f);

  f.sup = 80;
  f.timestamp = 4;
  f.journals.shift()
  draw_logical_field("logical_field_4", f);

  f.inf = 50;
  f.val = 80;
  f.timestamp = 5;
  f.journals.shift()
  draw_logical_field("logical_field_5", f);

  f.inf = 80;
  f.sup = 80;
  f.timestamp = 5;
  f.journals.shift()
  draw_logical_field("logical_field_6", f);
</script>
