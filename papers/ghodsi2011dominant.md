## [Dominant Resource Fairness: Fair Allocation of Multiple Resource Types (2011)](https://scholar.google.com/scholar?cluster=9727161448401355953&hl=en&as_sdt=0,5)
Scheduling and resource allocation policies are at the heart of many systems.
However, most resource allocation policies, including very popular ones like
*max-min fairness*, involve allocating a single resource type. In distributed
data processing frameworks like Hadoop and Dryad, resources often come in many
forms (e.g. CPU, GPU, disk size, memory size, network bandwidth, etc.) and
clients often have varying resource requirements. This paper introduces
*dominant resource fairness* (DRF): a new resource allocation policy that
handles multiple resource types. DRF satisfies a good number of desirable
properties and is implemented in Mesos.

**Allocation Properties.**
It's not easy to describe what makes a resource allocation policy "good" or
"fair", especially since most resource allocation policies don't concern
multiple object types. Here, we present a set of desirable properties that any
resource allocation policy ought to have. The first four are essential; the
last four are nice.

1. **Sharing incentive.** No user should be better off if resource were
   statically and equally partitioned between users.
2. **Strategy proofness.** Users should be able to improve their allocations by
   lying about their requirements.
3. **Envy-freeness.** No user should prefer the allocation of another user.
4. **Pareto efficient.** We should not be able to allocate more resources to a
   user without taking away resources from another.
5. *Single resource fairness.* For a single resource, the solution should
   reduce to max-min fairness.
6. *Bottleneck fairness.* If all users want the same resource the most, the
   solution should reduce to max-min fairness.
7. *Population monotonicity.* When a user leaves the system, nobody's
   allocation should decrease.
8. *Resource monotonicity.* When new resources are introduced into the system,
   nobody's allocation should decrease.

**Dominant Resource Fairness.**
Assume our system has 9 CPU and 18 GB of memory. Assume job A has tasks that
require `<1 CPU, 4 GB>` and job B has tasks that require `<3 CPU, 1 GB>`. Tasks
of A need `1/9` of the CPU and `4/18 = 2/9` of the memory. Tasks of B need
`3/9 = 1/3` of the CPU and `1/18` of the memory. We say that CPU is the
*dominant share* of A and memory is the dominant share of B. Generally, given
resource capacity vector `<c_1, ..., c_n>` and a user task requirement vector
`<a_1, ..., a_n>`, the dominant share is the max of all `a_i/c_i`.

DRF aims to maximize allocations such that all users have an equal dominant
share. In the example above, we want to find `x` allocations for A and `y`
allocations for B such that:

```
max(x, y)
x + 3y <= 9
4x + y <= 18
2x/9    = y/3
```

Algorithmically, we repeatedly choose the user with the lowest dominant share
and grant it its resource requirements if necessary while updating its dominant
share. If we assign a weight vector `<w_1, ..., w_n>` to each user and scale
each dominant share by `s_i` by `w_i`, then we have *weighted DRF*.

**Alternate Policies.**
There are other resource allocation policies that can be used to manage
multiple resource types.

First is *Asset Fairness*. In asset fairness, we maximize resource allocation
while ensuring that each user has an equal total allocation. In our example,

```
max(x, y)
x + 3y <= 9
4x + y <= 18
6x = 7y
```

Here, we imagine each CPU costs $2 and each GB costs $1. Job A spends $6 per
task, and job B spends $7 per task.

Second is *Competitive Equilibrium from Equal Incomes* (CEEI) where the product
of all dominant shares is maximized. That is,

```
max(xy)
x + 3y <= 9
4x + y <= 18
```

**Analysis.**

| Property                 | Asset | CEEI | DRF |
| ------------------------ | ----- | ---- | --- |
| Sharing Incentive        |       | ✓    | ✓   |
| Strategy-proofness       | ✓     |      | ✓   |
| Envy-freeness            | ✓     | ✓    | ✓   |
| Pareto efficiency        | ✓     | ✓    | ✓   |
| Single Resource Fairness | ✓     | ✓    | ✓   |
| Bottleneck Fairness      |       | ✓    | ✓   |
| Population Monotonicity  | ✓     |      | ✓   |
| Resource Monotonicity    |       |      |     |

Note that Asset Fairness does not provide Sharing Incentive and CEEI is not
strategy proof. DRF does not provide Resource Monotonicity, but it can be shown
that no resource allocation policy that satisfies sharing incentive and Pareto
efficiency can provide resource monotonicity.

Up until now, we've assumed continuous allocations. We can extend DRF to use
discrete allocations for K machines where each machine has at least a max-task
amount of resources. Here the max-task is `<max d_i1, ..., max d_im>`. It's
guaranteed that the difference in dominant share allocations between any two
users is less than one max-task compared to the continuous case.
