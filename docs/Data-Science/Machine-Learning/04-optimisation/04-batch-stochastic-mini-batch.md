---
sidebar_position: 4
title: Batch, Stochastic and Mini-Batch
description: One decision left — how many rows the model looks at before each step. "Stochastic is faster" turns out to need a unit attached, because batch beat single-row descent on passes, on seconds and on final cost, single-row descent could not converge at all at a constant step size, and yet mini-batch 32 reached a loose target after reading 4% of one pass where batch read 50 full passes and still missed.
tags: [machine-learning, optimisation, numpy, scikit-learn]
toc_max_heading_level: 3
---

# Batch, Stochastic and Mini-Batch

> **Topic —** One remaining decision: how many rows each update is allowed to see. The usual summary is
> that batch is slow, stochastic is fast, and mini-batch is the best of both. Every part of that
> sentence needs a unit attached before it can be checked, and once the units are attached the
> measurement does not support it. What survives is a narrower and more useful claim.

---

## In plain words

Back to the hiker in the fog, with one change: they are not alone. There are 20,000 people spread over the
hillside, and each one can feel the slope where *they* are standing. Before taking a step, the hiker has to
decide how many of them to ask.

| Variant | The hiker asks | What they get |
|---|---|---|
| **Batch** | Everyone, all 20,000 | The perfect downhill direction — but polling 20,000 people takes a while |
| **Stochastic (SGD)** | One random person | An answer instantly, pointing *roughly* downhill |
| **Mini-batch** | 32, or 256, or 2048 of them | Almost the perfect direction, for almost none of the cost |

That is the entire topic. The update rule never changes; only the size of the poll does.

**Everyone says asking one person is "faster" — and that is where the confusion starts.** Faster in what?
There are four completely different stopwatches, and the popular ranking is only true on one of them:

| "Faster" could mean | Who actually wins |
|---|---|
| Fewer **steps** taken | Large batches — a noisy direction wastes steps |
| Fewer **passes over the data** | Large batches, again |
| Fewer **seconds on the clock** | A large mini-batch. One 2048-row calculation is a single fast matrix multiply; 2048 separate one-row updates are 2048 rounds of overhead |
| Less **data read before the model is usable** | **Small** mini-batches, by a factor of over a thousand — and *this* is the honest version of the folk claim |

The last row is where small batches genuinely shine, and it matters exactly when reading the data is the
expensive part: data too big for memory, data arriving as a stream, or a budget measured in rows rather
than seconds.

### The other thing to know: the noise floor

Ask one person for directions and their answer points at *their* idea of downhill, not the group's. Far up
the hillside that hardly matters — everyone agrees which way is down. But once you are near the bottom, the
group's answer is "you're there, stop", while any individual still insists you should move a bit their way.
With a fixed stride length you keep taking those steps, so you circle the destination forever without
landing on it. That radius is the **noise floor**, and no amount of extra time shrinks it.

The fix is the important part, because it is widely misremembered: the problem is **not** that the direction
is noisy. It is a noisy direction *combined with a stride that never gets shorter*. Shorten the stride as
you go and the circling tightens onto the exact answer — measured below as a factor of 20,000 improvement
from that change alone. Every real stochastic optimiser has such a schedule, which is why scikit-learn's
`SGDRegressor` decays its learning rate by default.

### Two words to keep apart

Almost every muddled comparison on this topic comes from mixing these up:

| Term | Definition | With `n = 20000` |
|---|---|---|
| **Update** (step, iteration) | One application of `θ ← θ − α·∇J` | Batch: 1 per pass. SGD: 20000 per pass |
| **Epoch** | One complete pass over the data | The same amount of data read, either way |

"Converged in 50 epochs" therefore means something wildly different for each variant, and comparing that
column across batch sizes is meaningless.

---

## Only one thing differs

All three variants run the identical update from the [gradient descent page](./02-gradient-descent.md#the-whole-algorithm):

```
θ ← θ − α·∇J(θ)
```

The only change is which rows `∇J` is computed on.

| Variant | Rows per update | Gradient is |
|---|---|---|
| **Batch** (full-batch) | all `n` | Exact |
| **Stochastic** (SGD) | 1 | An unbiased but very noisy estimate |
| **Mini-batch** | `b`, typically 32–512 | An unbiased estimate with variance `∝ 1/b` |

Keeping [**update** and **epoch**](#two-words-to-keep-apart) apart is what makes the rest of the page
readable: for batch, one epoch **is** one update, while for SGD one epoch is `n` updates. So "faster"
means completely different things depending on which you count:

```text title="Output"
1. ONE CHOICE: ROWS PER UPDATE   (n = 20000, d = 5, alpha = 0.005, tol = 1e-05)
   exact OLS minimum J_min = 4.005043
   variant          rows/update  updates/epoch
   batch                  20000              1
   SGD (1 row)                1          20000
   mini-batch 8               8           2500
   mini-batch 32             32            625
   mini-batch 256           256             79
   mini-batch 2048         2048             10
```

Every comparison below is made against `J_min = 4.005043`, the closed-form
[normal equation](../03-linear-regression/03-the-matrix-formulation.md#the-normal-equation) minimum, so
"how close did it get" is measured against a real number rather than against wherever a run happened to
stop.

:::tip The stochastic gradient is unbiased, which is the whole justification

`E[∇J on one random row] = ∇J on all rows`. That is why a noisy gradient works at all: the errors
cancel over many steps. What differs is the *variance*, which falls as `1/b`. So the choice of batch
size is a choice about how much variance you accept in exchange for how many updates you get per pass.

The rest of this page is about what that trade actually buys.

:::

---

## Time to converge, and the ranking that fails

Same `α = 0.005`, same start at zero, same seed. Each variant runs until the cost is within `10⁻⁵` of
`J_min`, or until it has made a million updates:

```text title="Output"
2. TIME TO CONVERGE   (same alpha, same start, same seed)
   variant           epochs   updates  seconds    J − J_min   status
   batch                705       705    0.762   9.8075e-06   converged
   SGD (1 row)           50   1000000    3.945   2.0651e-01   update cap
   mini-batch 8         400   1000000    4.346   7.7852e-03   update cap
   mini-batch 32       1600   1000000    5.504   3.1412e-03   update cap
   mini-batch 256       332     26228    0.430   6.1436e-06   converged
   mini-batch 2048       71       710    0.072   9.0281e-06   converged
   of the runs that converged, fewest epochs:  mini-batch 2048 < mini-batch 256 < batch
   of the runs that converged, fewest seconds: mini-batch 2048 < mini-batch 256 < batch
   repeatability of the timing (mini-batch 256, 3 runs): 0.433s, 0.438s, 0.437s
```

Three of the six runs did not converge, and the status column says which — that matters, because a
table of epoch counts where some rows are budget limits presented as results is worse than no table.

**Three variants converged; the three smallest batch sizes did not.** SGD used **1,000,000 updates** —
1418× more than batch's **705** — and finished **2.0651e-01** above the minimum, five orders of
magnitude worse than batch's **9.8075e-06**. Mini-batch 8 and 32 did better than SGD but still could
not reach the tolerance.

**Both rankings among the converged runs are the same, and neither favours small batches.**
`mini-batch 2048 < mini-batch 256 < batch` on epochs *and* on seconds. The conventional ordering —
SGD fastest, batch slowest, mini-batch in between — is contradicted twice over: SGD was the worst on
every column, and the largest mini-batch tested was the best on every column.

The most informative pair is batch against mini-batch 2048:

| | batch | mini-batch 2048 |
|---|---|---|
| Updates to converge | **705** | **710** |
| Rows touched per update | 20000 | 2048 |
| Epochs | 705 | **71** |
| Seconds | 0.762 | **0.072** |

**Almost identical update counts — 705 against 710 — but 10.6× faster in wall-clock.** A gradient
computed on 2048 rows was, for this problem, just as good a direction as one computed on all 20000, and
cost a tenth as much to compute. That is the real argument for mini-batching, and it is about *cost per
update*, not about noise being helpful.

:::danger "SGD converges faster" is a claim about a quantity nobody was measuring

The familiar ranking is usually defended by saying SGD makes progress after one row instead of waiting
for `n`. That is true, and it concerns **progress per row seen**, which is measured in the
[section after next](#where-fewer-rows-per-update-actually-wins) and where SGD-style updates do win.

It is not a claim about seconds, and in a vectorised implementation it is emphatically false about
seconds: `20000` one-row updates each carry Python and NumPy call overhead, while one 20000-row update
is a single matrix product. SGD spent **3.945s** to get nowhere; batch spent **0.762s** to converge.

It is also not a claim about epochs, and it is not a claim about the final cost.

:::

The timing repeats to within about 1% (`0.433s`, `0.438s`, `0.437s`), so the wall-clock figures are
stable enough to compare. The absolute values are machine-dependent; the *ratios* are the finding.

---

## The noise floor

SGD's `2.0651e-01` after a million updates is not slowness. It is a ceiling, and no update budget
removes it.

This is the circling-the-destination effect from the [opening](#the-other-thing-to-know-the-noise-floor),
stated precisely. With a **constant** step size, each SGD update follows a gradient computed from one row,
which points at *that row's own* best answer rather than the dataset's. Near the true minimum the dataset's
gradient has vanished, but the individual rows' gradients have not — each still wants to pull somewhere. So
the parameters never settle; they wander inside a cloud whose radius is set by `α` and by how much the
per-row gradients disagree. Batch has no cloud at all: its gradient is the real one, and at the minimum the
real one is exactly zero.

Giving every variant the same two seconds — so batch is not starved of updates, which is what made a
first attempt at this measurement say the opposite — the floors are directly visible:

```text title="Output"
3. THE NOISE FLOOR   (2 seconds each, so batch is not starved of updates)
   variant                             J − J_min   var of last 50 epochs
   batch                              1.7764e-15              8.6775e-31
   SGD (1 row)                        1.0595e-01              5.3662e-03
   mini-batch 256                     2.1275e-05              2.7590e-09
   SGD (1 row) + alpha/(1+t/1000)     5.1036e-06              1.5083e-06
```

**Batch reaches `1.7764e-15`** — machine precision — with a variance of `8.6775e-31`. It is not
approaching a floor; there isn't one.

**SGD at a constant `α` sits at `1.0595e-01`** and its cost *variance* over the last 50 epochs is
`5.3662e-03`. It is still moving, permanently, and averaging over more epochs will not help because it
is not converging to anything.

**Mini-batch 256 sits at `2.1275e-05`**, four orders of magnitude below SGD, with variance `2.759e-09`.
Gradient variance falls as `1/b`, so `b = 256` shrinks the cloud radius by about `16×` and the cost
floor — quadratic in the radius — by about `256×`.

### Decaying the step size removes the floor

If the cloud radius is set by `α`, shrinking `α` over time should shrink the cloud. Adding
`αₜ = α / (1 + t/1000)`:

**`1.0595e-01 → 5.1036e-06`.** The same SGD, the same two seconds, the same seed — a factor of about
**20,700** closer to the minimum, purely from letting the step size decay.

:::tip The plateau is a step-size artefact, not a limit of stochastic gradients

This is the single most useful thing on the page. A noisy gradient does not prevent convergence to the
exact minimum; a *constant step size combined with* a noisy gradient does. Decay the rate and the floor
goes away.

The classical conditions on the schedule are `Σαₜ = ∞` and `Σαₜ² < ∞`, and they are less forbidding than
they look. The first says the strides must still **add up to enough distance to get there** — shrink them
too aggressively and you stall short of the answer. The second says the strides must shrink **fast enough
for the accumulated noise to stay finite** — that is what closes the cloud down to a point. You need both,
and they pull in opposite directions.

| Schedule | `Σαₜ = ∞`? (gets there) | `Σαₜ² < ∞`? (noise dies) | Result |
|---|---|---|---|
| `α/t` | ✓ | ✓ | Converges to the exact minimum |
| `α/√t` | ✓ | ✗ | Reaches the right area, keeps circling |
| constant `α` | ✓ | ✗ | Reaches the right area, keeps circling — the failure measured above |
| `α/t²` | ✗ | ✓ | Stalls early; the strides run out before the answer does |

A constant rate fails on the second condition, not the first: it has all the distance in the world, but
because the strides never shrink, neither does the cloud.

This is why every practical stochastic optimiser has a schedule, and why scikit-learn's default
`learning_rate='invscaling'` is a decay rather than a constant.

:::

Note that the decayed run's variance, `1.5083e-06`, is *larger* than mini-batch 256's `2.759e-09` even
though its mean cost is lower. It is still jittering; the jitter is simply centred much closer in.

:::note These four numbers move between runs, the pattern does not

The budget is wall-clock, so a faster machine grants more epochs and each figure shifts — batch has
been observed anywhere from `0.0000e+00` to `1.8e-15`, and SGD between about `8.5e-02` and `1.1e-01`.
The orders of magnitude, and the `~10⁴×` gap from decay, are stable. Read the exponents, not the
mantissas.

:::

---

## Where fewer rows per update actually wins

Everything so far asked for a tight tolerance on a dataset small enough that a full pass is cheap. That
is the regime batch is built for. The argument for small batches is about a different regime: a large
dataset and a *loose* target, where the question is not "how many seconds" but **"how much data must be
read before the model is usable"**.

The mechanism is not subtle, and it is worth stating before the numbers. Batch cannot take its **first**
step until it has read every row. Mini-batch 32 has taken its first step after 32 rows, and its
two-hundredth after 6,400. So on a large dataset with a modest accuracy target, one of them is finished
before the other has done anything at all.

Ten times the rows, `n = 200000`, target `J_min + 0.01`, and the run checked every ~2000 rows so the
comparison is uniform rather than an artefact of how often each variant happened to be examined:

```text title="Output"
4. ROWS SEEN TO REACH J_min + 0.01   (n = 200000, alpha = 0.01, checked every ~2000 rows)
   variant             rows seen  x the dataset    J − J_min   status
   batch              10,000,000          50.00   3.1172e+00   not reached
   SGD (1 row)           600,000           3.00   2.2485e-01   not reached
   mini-batch 32           7,936           0.04   2.9661e-03   reached
   mini-batch 256         51,968           0.26   8.8645e-03   reached
```

**Mini-batch 32 hit the target after reading 7,936 rows — 4% of a single pass.** Batch read
**10,000,000** rows, 50 complete passes, and finished `3.1172` away. The ratio in data read is over
**1,250×**.

The reason is arithmetic rather than subtle. In 7,936 rows, mini-batch 32 made **248 updates**. In the
same 7,936 rows, batch made **zero** — it cannot update until it has seen all 200,000. By the time batch
has made its first update, mini-batch 32 has made 6,250 and is already finished.

:::tip This is the honest form of "stochastic descent is faster"

It is about **progress per row read**, and in that unit small batches win by three orders of magnitude.
It matters whenever a pass over the data is the expensive thing: data that does not fit in memory, data
arriving as a stream, or a training budget measured in data read rather than in seconds.

It does not transfer to wall-clock time on data that fits in memory, and it does not transfer to tight
tolerances. Those are the two places the folk ranking is applied and the two places it is wrong.

:::

**SGD did not reach the target either**, stopping at `2.2485e-01` after 600,000 rows. This is not a
different phenomenon from the previous section — it is the same noise floor. At `α = 0.01` with one row
per update, SGD's floor is around `0.22`, which is **22× above the `0.01` target**. No quantity of data
gets it there, because the target is inside its noise cloud.

That completes the picture, and it is why 32 rather than 1:

| | Progress per row read | Cost per update | Noise floor |
|---|---|---|---|
| **SGD** (1 row) | Excellent | Terrible (per row) | **Too high to be usable here** |
| **Mini-batch 32** | **Best measured** | Low | Low enough |
| **Mini-batch 2048** | Moderate | Low per row | Very low |
| **Batch** | Worst possible | Highest | **None** |

Mini-batch is not a compromise that splits the difference. It is the setting where all three columns are
simultaneously acceptable, and both extremes fail one column outright.

---

## What scikit-learn does with the same data

```text title="Output"
5. THE SAME PROBLEM THROUGH SCIKIT-LEARN
   LinearRegression            J − J_min = 0.0000e+00
   SGDRegressor, defaults      J − J_min = 7.8196e-03
   SGDRegressor, constant lr   J − J_min = 4.2844e-02
```

`LinearRegression` returns `0.0000e+00` — it *is* the closed-form solution, so this is a tautology and a
useful check that `J_min` was computed correctly.

`SGDRegressor` at its defaults lands `7.8196e-03` above the minimum. Configured with a **constant**
learning rate it is *worse*, at `4.2844e-02` — 5.5× further away. The default is
`learning_rate='invscaling'`, a decaying schedule, and the two rows are the noise-floor result appearing
in library code: the decaying default beats the hand-set constant.

:::warning `SGDRegressor` is not a better `LinearRegression`

On 20,000 rows and 5 features it lands `7.8e-03` from an answer `LinearRegression` gets exactly, in less
code. `SGDRegressor` exists for the cases where the closed form is not available — too many features for
`O(p³)`, data that does not fit in memory, or `partial_fit` on a stream. Reaching for it on data this
size trades exactness for nothing.

Note also that `SGDRegressor` applies L2 regularisation by default (`alpha=0.0001`), so it is not
minimising the same objective unless you set `alpha=0`. Comparisons against `LinearRegression` that
skip that are comparing two different problems.

:::

---

## Common Mistakes

| # | Mistake | Wrong | Right |
|---|---|---|---|
| 1 | "SGD is faster" without a unit | It converges quicker | Faster per **row read**; slower per epoch, per second and in final cost |
| 2 | Comparing epochs across batch sizes | An epoch is an epoch | One epoch is 1 update for batch, **20000** for SGD |
| 3 | Expecting SGD to converge at a constant `α` | More updates will get there | It sat at **2.0651e-01** after 1,000,000 updates |
| 4 | Reading a noise floor as slow convergence | Needs more epochs | Variance of last 50 epochs was **5.3662e-03** — still moving |
| 5 | Believing noise is inherent to stochastic gradients | Noisy gradient ⇒ noisy answer | Decay took it from **1.0595e-01** to **5.1036e-06** |
| 6 | Giving each variant equal **epochs** | Fair comparison | Batch gets 1 update per epoch; use equal time or equal updates |
| 7 | Publishing a cap as a result | "705 epochs" | Print a status column; three of six runs here did not converge |
| 8 | Checking progress every `k` **updates** across batch sizes | Same interval | That is every 1 row for SGD and 256 for mini-batch 256; use rows |
| 9 | Assuming mini-batch is a middle-of-the-road compromise | Between the extremes | Mini-batch 2048 was **best** on epochs *and* seconds |
| 10 | Thinking batch's cost is the exact gradient | Exactness is the expense | Mini-batch 2048 needed **710** updates against batch's **705** — the direction was as good |
| 11 | Using `SGDRegressor` on small tabular data | It's the scalable one | `7.8e-03` off what `LinearRegression` gets exactly |
| 12 | Comparing `SGDRegressor` to `LinearRegression` at defaults | Same objective | `SGDRegressor` regularises by default (`alpha=0.0001`) |
| 13 | Setting a constant learning rate on `SGDRegressor` | More control | It was **5.5× worse** than the decaying default |
| 14 | Tuning batch size before the learning rate | Batch size is the knob | The floor is set by `α`; batch size only scales it by `1/b` |

---

## Summary

| | |
|---|---|
| The only difference | Rows per update |
| Update vs epoch | 1 epoch = `n/b` updates; batch has `b = n`, so 1 |
| Gradient quality | Unbiased at every `b`; variance `∝ 1/b` |
| Noise floor | Caused by constant `α` **with** noise, not by noise alone |
| Removing the floor | Decay `α`: `Σαₜ = ∞` and `Σαₜ² < ∞` |
| Fastest to a tight tolerance | Largest batch that still gives many updates |
| Fewest rows read to a loose target | Small mini-batch |
| Exact solution available? | Use `LinearRegression`, not `SGDRegressor` |
| Sensible default | Mini-batch, 32–512 rows, with a decaying rate |

**Key takeaways**

- The three variants are **one algorithm**; only the number of rows behind each `∇J` changes. With
  `n = 20000`: batch makes **1** update per epoch, SGD makes **20000**
- **The conventional ranking failed on both metrics.** Among the runs that converged, `mini-batch 2048 <
  mini-batch 256 < batch` on epochs *and* on seconds. SGD was worst on every column
- SGD used **1,000,000** updates against batch's **705** and finished **2.0651e-01** from the minimum
  against batch's **9.8075e-06**
- **Mini-batch 2048 matched batch's update count almost exactly — 710 against 705 — and was 10.6×
  faster** (`0.072s` against `0.762s`). A gradient from 2048 of 20000 rows was as good a direction and
  a tenth of the cost
- **A constant step size, not the noisy gradient, creates the plateau.** On an equal 2-second budget:
  batch **1.7764e-15**, SGD **1.0595e-01**, mini-batch 256 **2.1275e-05**
- Adding `αₜ = α/(1 + t/1000)` took SGD to **5.1036e-06** — about **20,700×** closer, same time, same
  seed. The classical conditions are `Σαₜ = ∞` and `Σαₜ² < ∞`
- Gradient variance falls as **`1/b`**, which is why `b = 256` sat four orders of magnitude below `b = 1`
- **Where small batches genuinely win is rows read.** On `n = 200000`, mini-batch 32 reached
  `J_min + 0.01` after **7,936 rows — 4% of one pass** and **248 updates**. Batch read **10,000,000**
  rows over 50 passes and was still `3.1172` away: over **1,250×** more data
- In those first 7,936 rows batch made **zero** updates. It cannot act until it has read all `n`
- **SGD missed that target too**, at `2.2485e-01`, because its noise floor at `α = 0.01` is roughly `0.22`
  — **22× above** the target. No amount of data reaches inside a noise cloud
- `LinearRegression` gives `J − J_min = 0.0000e+00`; `SGDRegressor` at defaults gives `7.8196e-03`, and
  with a **constant** rate `4.2844e-02` — the decaying default beat the hand-set constant by **5.5×**
- `SGDRegressor` regularises by default (`alpha=0.0001`), so it is not solving the same problem as
  `LinearRegression` unless `alpha=0`

**Next in this section:** **regression performance metrics** — how to score the fitted model once the
optimiser has stopped, and which of MAE, MSE, RMSE, R² and MAPE answers which question

**See also:** [Gradient Descent](./02-gradient-descent.md#the-whole-algorithm) for the update rule all
three variants share · [The Learning Rate](./03-the-learning-rate.md#the-divergence-threshold-is-a-computable-number)
for why `α` is the knob that sets the noise floor · [Loss Functions](./01-loss-functions.md#the-loss-decides-whether-the-problem-is-solvable-at-all)
for the differentiability that makes any of this possible ·
[The Matrix Formulation](../03-linear-regression/03-the-matrix-formulation.md#why-anyone-bothers-with-gradient-descent)
for when the closed form is the right answer instead

---

## Run It Yourself

```python title="gd_variants.py"
"""Batch, stochastic and mini-batch gradient descent — how many rows per update."""
import numpy as np
import time
from sklearn.linear_model import LinearRegression, SGDRegressor

SEED, ALPHA, TOL, UCAP = 42, 0.005, 1e-5, 1_000_000

def make(n, d, seed):
    rng = np.random.RandomState(seed)
    Z = rng.randn(n, d)
    Z = (Z - Z.mean(axis=0)) / Z.std(axis=0)
    return Z, Z @ (rng.randn(d) * 2.0) + rng.randn() * 5.0 + rng.randn(n) * 2.0

def cost(X, y, th):
    return np.sum((X @ th - y) ** 2) / len(y)          # J = (1/n)Σ(ŷ−y)²

def step(X, y, th, rows, alpha):
    g = (2 / len(rows)) * X[rows].T @ (X[rows] @ th - y[rows])
    return th - alpha * g

def label(bs, n):
    return "batch" if bs == n else "SGD (1 row)" if bs == 1 else f"mini-batch {bs}"

def train(X, y, bs, floor, alpha=ALPHA, tol=TOL, ucap=UCAP):
    """Run until the cost is within tol of floor, or until ucap updates."""
    m = len(y)
    th, rng = np.zeros(X.shape[1]), np.random.RandomState(SEED)
    epochs, updates, t0 = 0, 0, time.perf_counter()
    while True:
        epochs += 1
        order = rng.permutation(m)
        for i in range(0, m, bs):
            th = step(X, y, th, order[i:i + bs], alpha)
            updates += 1
            if updates >= ucap:
                return epochs, updates, time.perf_counter() - t0, cost(X, y, th), "update cap"
        if cost(X, y, th) - floor < tol:
            return epochs, updates, time.perf_counter() - t0, cost(X, y, th), "converged"

# ---------- 1. only one thing differs: rows per update ----------
n, d = 20000, 5
Z, y = make(n, d, SEED)
X = np.c_[np.ones(n), Z]
floor = cost(X, y, np.linalg.lstsq(X, y, rcond=None)[0])
print(f"1. ONE CHOICE: ROWS PER UPDATE   (n = {n}, d = {d}, alpha = {ALPHA}, tol = {TOL})")
print(f"   exact OLS minimum J_min = {floor:.6f}")
print(f"   {'variant':<16}{'rows/update':>12}{'updates/epoch':>15}")
for bs in (n, 1, 8, 32, 256, 2048):
    print(f"   {label(bs, n):<16}{bs:>12}{-(-n // bs):>15}")

# ---------- 2. epochs, updates and seconds ----------
print("\n2. TIME TO CONVERGE   (same alpha, same start, same seed)")
print(f"   {'variant':<16}{'epochs':>8}{'updates':>10}{'seconds':>9}{'J − J_min':>13}   status")
rows = []
for bs in (n, 1, 8, 32, 256, 2048):
    ep, up, sec, J, st = train(X, y, bs, floor)
    rows.append((label(bs, n), ep, up, sec, J - floor, st))
    print(f"   {label(bs, n):<16}{ep:>8}{up:>10}{sec:>9.3f}{J - floor:>13.4e}   {st}")
ok = [r for r in rows if r[5] == "converged"]
print("   of the runs that converged, fewest epochs:  "
      + " < ".join(r[0] for r in sorted(ok, key=lambda r: r[1])))
print("   of the runs that converged, fewest seconds: "
      + " < ".join(r[0] for r in sorted(ok, key=lambda r: r[3])))
reps = [train(X, y, 256, floor)[2] for _ in range(3)]
print(f"   repeatability of the timing (mini-batch 256, 3 runs): "
      + ", ".join(f"{t:.3f}s" for t in reps))

# ---------- 3. the noise floor, on an equal wall-clock budget ----------
print("\n3. THE NOISE FLOOR   (2 seconds each, so batch is not starved of updates)")
print(f"   {'variant':<32}{'J − J_min':>13}{'var of last 50 epochs':>24}")
for bs, decay in ((n, False), (1, False), (256, False), (1, True)):
    th, seen, rng, t0, t = np.zeros(X.shape[1]), [], np.random.RandomState(SEED), time.perf_counter(), 0
    while time.perf_counter() - t0 < 2.0:
        order = rng.permutation(n)
        for i in range(0, n, bs):
            th = step(X, y, th, order[i:i + bs], ALPHA / (1 + t / 1000.0) if decay else ALPHA)
            t += 1
        seen.append(cost(X, y, th))
    name = label(bs, n) + (" + alpha/(1+t/1000)" if decay else "")
    print(f"   {name:<32}{seen[-1] - floor:>13.4e}{np.var(seen[-50:]):>24.4e}")

# ---------- 4. rows seen to reach a target, on a much larger problem ----------
NL, AL, TGT = 200000, 0.01, 0.01
ZL, yL = make(NL, d, SEED + 1)
XL = np.c_[np.ones(NL), ZL]
fl = cost(XL, yL, np.linalg.lstsq(XL, yL, rcond=None)[0])
print(f"\n4. ROWS SEEN TO REACH J_min + {TGT}   (n = {NL}, alpha = {AL}, checked every ~2000 rows)")
print(f"   {'variant':<16}{'rows seen':>13}{'x the dataset':>15}{'J − J_min':>13}   status")
for bs in (NL, 1, 32, 256):
    th, rng = np.zeros(XL.shape[1]), np.random.RandomState(SEED)
    every, seen_rows, hit, since, ups = max(1, 2000 // bs), 0, False, 0, 0
    for _ in range(50):                    # up to 50 passes, or 600k updates, whichever first
        order = rng.permutation(NL)
        for i in range(0, NL, bs):
            th = step(XL, yL, th, order[i:i + bs], AL)
            seen_rows += len(order[i:i + bs])
            since += 1
            ups += 1
            if ups >= 600_000:
                hit = False
                break
            if since >= every:
                since = 0
                if cost(XL, yL, th) - fl < TGT:
                    hit = True
                    break
        if hit or ups >= 600_000:
            break
    print(f"   {label(bs, NL):<16}{seen_rows:>13,}{seen_rows / NL:>15.2f}"
          f"{cost(XL, yL, th) - fl:>13.4e}   {'reached' if hit else 'not reached'}")

# ---------- 5. what scikit-learn does with the same data ----------
print("\n5. THE SAME PROBLEM THROUGH SCIKIT-LEARN")
for name, est in (("LinearRegression", LinearRegression()),
                  ("SGDRegressor, defaults", SGDRegressor(random_state=SEED)),
                  ("SGDRegressor, constant lr",
                   SGDRegressor(max_iter=1000, eta0=0.0025, learning_rate="constant",
                                random_state=SEED, alpha=0))):
    f = est.fit(Z, y)
    ic = f.intercept_ if np.isscalar(f.intercept_) else f.intercept_[0]
    print(f"   {name:<28}J − J_min = {cost(X, y, np.r_[ic, f.coef_]) - floor:.4e}")
```

```text title="Output"
1. ONE CHOICE: ROWS PER UPDATE   (n = 20000, d = 5, alpha = 0.005, tol = 1e-05)
   exact OLS minimum J_min = 4.005043
   variant          rows/update  updates/epoch
   batch                  20000              1
   SGD (1 row)                1          20000
   mini-batch 8               8           2500
   mini-batch 32             32            625
   mini-batch 256           256             79
   mini-batch 2048         2048             10

2. TIME TO CONVERGE   (same alpha, same start, same seed)
   variant           epochs   updates  seconds    J − J_min   status
   batch                705       705    0.762   9.8075e-06   converged
   SGD (1 row)           50   1000000    3.945   2.0651e-01   update cap
   mini-batch 8         400   1000000    4.346   7.7852e-03   update cap
   mini-batch 32       1600   1000000    5.504   3.1412e-03   update cap
   mini-batch 256       332     26228    0.430   6.1436e-06   converged
   mini-batch 2048       71       710    0.072   9.0281e-06   converged
   of the runs that converged, fewest epochs:  mini-batch 2048 < mini-batch 256 < batch
   of the runs that converged, fewest seconds: mini-batch 2048 < mini-batch 256 < batch
   repeatability of the timing (mini-batch 256, 3 runs): 0.433s, 0.438s, 0.437s

3. THE NOISE FLOOR   (2 seconds each, so batch is not starved of updates)
   variant                             J − J_min   var of last 50 epochs
   batch                              1.7764e-15              8.6775e-31
   SGD (1 row)                        1.0595e-01              5.3662e-03
   mini-batch 256                     2.1275e-05              2.7590e-09
   SGD (1 row) + alpha/(1+t/1000)     5.1036e-06              1.5083e-06

4. ROWS SEEN TO REACH J_min + 0.01   (n = 200000, alpha = 0.01, checked every ~2000 rows)
   variant             rows seen  x the dataset    J − J_min   status
   batch              10,000,000          50.00   3.1172e+00   not reached
   SGD (1 row)           600,000           3.00   2.2485e-01   not reached
   mini-batch 32           7,936           0.04   2.9661e-03   reached
   mini-batch 256         51,968           0.26   8.8645e-03   reached

5. THE SAME PROBLEM THROUGH SCIKIT-LEARN
   LinearRegression            J − J_min = 0.0000e+00
   SGDRegressor, defaults      J − J_min = 7.8196e-03
   SGDRegressor, constant lr   J − J_min = 4.2844e-02
```

### What to notice in that output

- **Batch's `epochs` and `updates` columns are the same number, `705`.** That identity is the whole
  reason epoch-based comparisons across batch sizes are meaningless: for batch the two units coincide,
  for SGD they differ by 20000×.
- **The seconds column is not monotone in batch size.** `0.762` for batch, `3.945` for SGD, then down to
  `0.072` for mini-batch 2048. Two different costs are competing — per-update Python overhead (worst at
  `b = 1`) and per-update matrix size (worst at `b = n`) — and the minimum is in between.
- **Mini-batch 32 took 1600 epochs to make a million updates and still finished worse than batch's 705
  updates.** More updates is not more progress once each one is following noise.
- **The three unconverged rows improve monotonically in `b`**: `2.0651e-01`, `7.7852e-03`, `3.1412e-03`
  for `b = 1, 8, 32`. Same update count, same time-order of magnitude; the only difference is gradient
  variance, and the final cost tracks it.
- **Batch's variance in section 3 is `8.6775e-31`**, which is `(1e-15)²` — the square of machine epsilon
  territory. There is no residual motion at all, whereas SGD's `5.3662e-03` is comparable in size to
  many *real* differences between models.
- **The decayed SGD run has a lower mean but a higher variance than mini-batch 256** (`5.1036e-06` with
  variance `1.5083e-06`, against `2.1275e-05` with variance `2.759e-09`). It is bouncing more widely
  around a much better centre — two different ways of being close.
- **In section 4, mini-batch 32 read 7,936 rows, which is 248 updates of 32.** Batch's first update
  requires 200,000. The comparison is not close and does not depend on any implementation detail.
- **Mini-batch 32 finished at `2.9661e-03` and mini-batch 256 at `8.8645e-03`**, both under the `0.01`
  target, but 32 overshot the target by more — it took a check-interval step past it. Comparing
  "rows to reach" is fair; comparing the final `J` in that table is not.
- **`SGDRegressor` with a hand-set constant rate is 5.5× worse than its own default.** The default is
  `invscaling`, a decay. The library encodes the noise-floor lesson; overriding it discards the lesson.

**Things worth trying:**

1. Raise `ALPHA` from `0.005` to `0.2` and re-run section 2. Batch should converge in far fewer epochs
   (`λ_max ≈ 2`, so the ceiling is near `1.0`), while SGD's noise floor gets *worse* — the two respond in
   opposite directions to the same change.
2. Add `b = 8192` and `b = 20000` to section 2 and find where the seconds column turns back upward.
3. In section 3, replace `α/(1 + t/1000)` with `α/√(1 + t)`. It satisfies `Σαₜ = ∞` but not
   `Σαₜ² < ∞` — check whether the floor comes back.
4. In section 3, halve `ALPHA` for the constant-rate SGD run. The floor should fall by roughly `4×`,
   since the cost is quadratic in the cloud radius.
5. In section 4, loosen `TGT` from `0.01` to `0.5` and see whether SGD can now reach it. Its floor at
   `α = 0.01` is around `0.22`.
6. In section 4, tighten `TGT` to `1e-6`. Predict which variants can reach it at all before running.
7. Remove `alpha=0` from the tuned `SGDRegressor` and watch `J − J_min` grow — you are now measuring a
   different objective.
8. Replace the `permutation` with a fixed order that never reshuffles, and check whether SGD's floor
   changes. Shuffling matters more than it looks when the data has any ordering.

---

## Practice Questions

*Work each one out on paper first, then check it by running the code — everything you need is on
this page. **No answers are included, deliberately.***

| Tag | Means |
|---|---|
| **[THEORY]** | *Explain in words.* Definitions, reasons, comparisons. |
| **[PROG]** | *Write the program.* Complete, runnable code. |
| **[OUT]** | *Read the output.* Interpret given results exactly as printed. |
| **[ANALYZE]** | *Argue a position.* Weigh a claim, diagnose a failure, justify a trade-off. |

### Updates and epochs

**U1. [THEORY]** Define update and epoch, and give the relation between them in terms of `n` and `b`.

**U2. [OUT]** With `n = 20000`, batch makes 1 update per epoch and SGD makes 20000. Why does that make
"epochs to converge" a misleading comparison?

**U3. [OUT]** Batch's `epochs` and `updates` columns both read `705`. Explain the identity.

**U4. [THEORY]** Why is the single-row gradient described as *unbiased*, and what quantity does differ
between batch sizes?

**U5. [PROG]** Write a single function that performs all three variants, taking batch size as its only
structural argument.

### The ranking

**R1. [OUT]** Give the two rankings printed for the converged runs. What does the conventional summary
claim, and how does the measurement compare?

**R2. [OUT]** SGD made 1,000,000 updates and finished `2.0651e-01` from the minimum; batch made 705 and
finished `9.8075e-06`. What does that pair rule out?

**R3. [OUT]** Mini-batch 2048 used `710` updates against batch's `705` but took `0.072s` against
`0.762s`. Explain both numbers.

**R4. [ANALYZE]** From R3, what does batch's exact gradient actually buy on this problem?

**R5. [OUT]** The seconds column is not monotone in `b`. Name the two competing costs and say which
dominates at each end.

**R6. [ANALYZE]** Someone reports "SGD converges fastest". List every unit in which that could be meant
and say which one it is true in.

**R7. [OUT]** Three of six rows read `update cap`. Why must a table like this carry a status column?

### The noise floor

**N1. [THEORY]** Explain why SGD at a constant `α` does not settle at the minimum, while batch does.

**N2. [OUT]** Batch reached `1.7764e-15` with variance `8.6775e-31`; SGD reached `1.0595e-01` with
variance `5.3662e-03`. Which number shows there is a floor rather than slow progress?

**N3. [OUT]** Mini-batch 256 sat at `2.1275e-05` against SGD's `1.0595e-01`. Relate the ratio to the
`1/b` variance law.

**N4. [OUT]** Decay took SGD from `1.0595e-01` to `5.1036e-06`. What does that prove about the cause of
the plateau?

**N5. [THEORY]** State the two classical conditions on `αₜ` and say which is violated by a constant rate
and which by `α/t²`.

**N6. [ANALYZE]** The decayed run has a lower mean cost but a *higher* variance than mini-batch 256.
Explain how both can be true and which you would prefer.

**N7. [ANALYZE]** An earlier version of this measurement gave every variant 200 epochs and concluded
batch had the largest noise floor. Diagnose that experiment.

**N8. [PROG]** Measure the noise floor at four values of `α` for `b = 1` and check whether it scales as
`α`, `α²`, or neither.

### Rows read

**D1. [OUT]** Mini-batch 32 reached the target after `7,936` rows; batch read `10,000,000` and missed.
Compute the update counts behind both figures.

**D2. [THEORY]** In which units is "stochastic descent is faster" actually true? Name a situation where
that unit is the binding constraint.

**D3. [OUT]** SGD read `600,000` rows and finished `2.2485e-01`, missing a `0.01` target. Explain using
section 3's result rather than section 4's.

**D4. [ANALYZE]** Why does the win in rows read *not* transfer to wall-clock time on in-memory data?

**D5. [OUT]** The check interval was made uniform in rows rather than in updates. Why does the update
version bias the comparison, and in whose favour?

**D6. [ANALYZE]** Given the three-column table at the end of that section, argue for `b = 32` over both
`b = 1` and `b = n`.

**D7. [PROG]** Sweep `b` over powers of two and plot rows-read-to-target. Predict the shape first.

### scikit-learn

**K1. [OUT]** `LinearRegression` gives `J − J_min = 0.0000e+00`. Why is that a tautology, and what is it
still useful for?

**K2. [OUT]** `SGDRegressor` at defaults gives `7.8196e-03` and with a constant rate `4.2844e-02`.
Explain the ordering.

**K3. [THEORY]** What is `SGDRegressor`'s default `learning_rate`, and how does this page's evidence
justify it?

**K4. [ANALYZE]** When would you choose `SGDRegressor` over `LinearRegression`? Give two distinct
reasons that have nothing to do with accuracy.

**K5. [ANALYZE]** `SGDRegressor` regularises by default. Why does that make a naive comparison against
`LinearRegression` invalid?

### Quick self-check

1. What is the only difference between the three variants?
2. How many updates does batch make per epoch?
3. How many does SGD make, with `n = 20000`?
4. Is the single-row gradient biased?
5. How does gradient variance scale with `b`?
6. Which variant won on seconds among the converged runs?
7. Which won on epochs?
8. How many updates did mini-batch 2048 need versus batch?
9. What causes the noise floor?
10. What removes it?
11. State the two conditions on `αₜ`.
12. What was SGD's cost variance over the last 50 epochs?
13. How many rows did mini-batch 32 need to reach the loose target?
14. How many did batch read without reaching it?
15. How many updates had batch made after 7,936 rows?
16. Why did SGD miss the loose target no matter how much data it read?
17. In which unit is "stochastic descent is faster" true?
18. What is `SGDRegressor`'s default learning-rate schedule?
19. Does `SGDRegressor` regularise by default?
20. When should you prefer the closed form?
