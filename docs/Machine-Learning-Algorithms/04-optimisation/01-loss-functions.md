---
sidebar_position: 1
title: Loss Functions
description: The loss function is how you tell a model what "good" means, and changing it changes the answer. Three losses gave three different slopes on identical data; absolute error ignored an outlier at 60, 200 and 10000 alike; counting mistakes turned out to be unminimisable, with 1998 of 2000 gradients exactly zero; and squared error on a sigmoid was 11014x weaker than cross-entropy exactly where the model was most wrong.
tags: [machine-learning, optimisation, scikit-learn]
toc_max_heading_level: 3
---

# Loss Functions

> **Topic —** Every fitted model is the answer to "which parameters minimise *this quantity*", and the
> quantity is something you choose. This page argues that the choice is not a detail of the reporting:
> it changes the fitted parameters, it changes which points can influence them at all, and — for one
> extremely natural-looking choice — it makes the problem unsolvable by any gradient method.

---

## In plain words

A model has no idea what "good" means until you tell it. The **loss function** is how you tell it: a
formula that turns one prediction into a penalty. Training is then nothing more than hunting for the
parameters that make the total penalty as small as possible.

Everything on this page follows from three consequences of that.

1. **Change the penalty and you get a different model.** Not better or worse — *different*. The same
   thirty points, fitted three ways, gave three different slopes.
2. **Some penalties ignore how big a mistake is.** Absolute error only asks *which side* of the line a
   point landed on, never how far. That makes it immune to a wild outlier — and equally deaf to a large
   value that was real signal.
3. **Some penalties cannot be used at all.** "Count the mistakes" sounds like the obvious thing to
   minimise. It can't be done, and the reason is worth having a picture for.

That third one is the least intuitive, so here is the picture. Training works like a hiker in thick fog
who can only feel the slope of the ground under their boots. On a hillside that is enough — they always
know which way is down. But put them on a **staircase**: every spot they can feel is perfectly flat, so
they have no reason to move in any direction, even though there are steps all around them. Counting
mistakes builds a staircase. Squared error and log loss build hillsides.

The fix, used everywhere in machine learning, is to minimise a smooth stand-in (a **surrogate loss**)
and report the count you actually cared about afterwards. That is the single most useful idea here.

:::tip How to read this page

Every claim below is backed by a printed number, often to six or seven digits. On a first pass, read
the **bold sentences and the section headings** and let the digits go past — they are there so you can
verify the claim later, not so you can memorise them. The `Summary` at the bottom collects them if you
want them.

:::

### Words used on this page

| Term | Say it as | What it means here |
|---|---|---|
| **Residual** `r` | "how far off this one row was" | `yᵢ − ŷᵢ` — actual minus predicted, for one example |
| **Gradient** | "which way is uphill, and how steeply" | The derivative of the cost with respect to each parameter |
| **Leverage** | "how much pull this point has on the tilt" | How far a point's `x` sits from the average `x`. Points at the far ends can tilt the line; points in the middle barely can |
| **Subgradient** | "a stand-in slope at a corner" | What you use where a loss has a kink instead of a smooth slope, e.g. `\|r\|` at `r = 0` |
| **Surrogate loss** | "the trainable stand-in" | A smooth loss you minimise *because* the thing you care about (accuracy, F1) has no usable slope |
| **Calibrated** | "the probabilities mean what they say" | Of the cases predicted at `0.7`, about 70% actually happen |
| **Margin** `m` | "how far onto the right side of the fence" | `y·f(x)` — positive when the prediction is on the correct side, larger when further from the boundary |

---

## The loss is the specification, not a detail

The words get used loosely, so it is worth being precise once.

| Term | Applies to | Definition |
|---|---|---|
| **Loss** | One example | The penalty for one prediction, e.g. `(ŷᵢ − yᵢ)²` |
| **Cost** / objective | The whole dataset | The aggregate that is minimised, e.g. `(1/n)Σ(ŷᵢ − yᵢ)²` |
| **Metric** | The whole dataset | What you *report*. Need not be differentiable, and need not match the loss |

Training minimises the cost. Reporting quotes the metric. They are frequently different quantities,
and the reason is the whole of this page: many good metrics cannot be minimised, so you minimise a
differentiable stand-in and report the metric afterwards.

The [error measures](../03-linear-regression/01-simple-linear-regression.md#how-wrong-is-it-the-five-error-measures)
computed earlier were all metrics — summaries of residuals *after* a fit. Squared error was doing
double duty there: it was also the thing being minimised. That coincidence is the exception.

---

## Three losses, three different lines

Thirty points on `y = 2x + 5` with light noise. Fit three times, changing only what is minimised:
squared error (`LinearRegression`), absolute error (`QuantileRegressor(quantile=0.5)`), and Huber
(`HuberRegressor`). Then corrupt exactly one target to `60` — first a point in the **middle** of the
`x` range, then the point at the **end**.

```text title="Output"
1. ONE DATASET, THREE LOSSES   (truth: slope 2.0, intercept 5.0)
   loss      clean slope     int    centre-out     int    edge-out     int
   squared        1.9490    5.16        1.9780    6.51      2.6066    3.04
   absolute       1.9752    4.94        1.9432    5.25      1.9752    4.94
   Huber          1.9526    5.14        1.9531    5.16      1.9581    5.12
```

The clean fits already differ — `1.9490`, `1.9752`, `1.9526` — on identical data. Three losses, three
answers, none of them wrong. That is the first point and it is easy to skip past: **there is no such
thing as "the" line of best fit** until you say what "best" means.

Now the corruption. Read the `centre-out` columns first, because they are the ones that look wrong.

**The centre outlier barely moved any slope.** Squared error went `1.9490 → 1.9780`; absolute error
actually moved *further*, `1.9752 → 1.9432`. If you were testing robustness, this comparison would tell
you squared error is more robust than absolute error, which is false.

The reason has nothing to do with the loss. A point at `x ≈ x̄` has almost no
[leverage](../03-linear-regression/01-simple-linear-regression.md#worked-all-the-way-through) — it
contributes nearly zero to `Sxy` and `Sxx`, so it can hardly tilt the line at all. What it *can* do is
lift the line, and it does: the squared-error intercept moved `5.16 → 6.51`.

**The edge outlier is where the losses separate.** Same corruption, now on the highest-leverage point:
squared error's slope goes `1.9490 → 2.6066`, a 34% error. Absolute error goes `1.9752 → 1.9752`.
Huber, `1.9526 → 1.9581`.

:::danger Testing outlier robustness with a low-leverage point measures nothing

Both corruptions moved `y` by the same amount. One produced a `+0.0290` slope shift and the other
`+0.6576`, from the same loss. The variable being tested was position, not the loss function.

This is the same failure mode as
[the `1/√n` measurement done with one fit per sample size](../03-linear-regression/01-simple-linear-regression.md#how-much-data-does-it-take)
— a plausible experiment whose design cannot detect the effect it is looking for. It was the first
version of this demo, and it produced a confident, backwards conclusion.

:::

---

## Absolute error does not care how wrong an outlier is

`1.9752 → 1.9752` is worth more than a passing note. It is not "small"; it is exact, and there is a
clean reason.

The plain version first. Squared error asks each point *"how far off am I?"* and pulls on the line in
proportion to the answer — so a point that is ten times further away pulls ten times harder. Absolute
error asks only *"am I above the line or below it?"* Every point above the line pulls up by the same
fixed amount, every point below pulls down by the same fixed amount, and that is the entire input. Move
a point from just above the line to miles above the line and the answer to the only question being
asked has not changed, so nothing about the fit changes either.

In symbols, the gradient of absolute-error cost is

```
∂/∂θ Σ|yᵢ − θᵀxᵢ|  =  −Σ sign(rᵢ) · xᵢ
```

Every residual enters through `sign(rᵢ)` and nothing else. The *magnitude* of a residual is absent from
the gradient entirely. So moving a point further from the line changes the fit only if it changes which
**side** of the line that point is on:

```text title="Output"
   absolute loss depends only on sign(residual), never on its size:
   sign(r[15]) clean -1 -> corrupted +1   FLIPPED   (row 15)
   sign(r[29]) clean +1 -> corrupted +1   unchanged   (row 29)

   push the high-leverage point further and further away:
      y[29]   absolute slope   squared slope
         60         1.975169          2.6066
        200         1.975169          5.2260
      10000         1.975169        188.5808
```

Row 15's residual was **negative** under the clean fit and became **positive** when set to `60` — the
subgradient changed, so the fit moved. Row 29's residual was already positive and stayed positive — the
subgradient is *identical*, so the fit does not move at all.

The consequence is the strongest number on this page. Pushing that point to `200` and then `10000`:
**absolute error returns `1.975169` all three times**, to every printed digit. Squared error returns
`2.6066`, `5.2260`, `188.5808`. One loss is indifferent to how wrong the outlier is; the other is
approximately proportional to it.

:::note This is also absolute error's weakness, stated honestly

Ignoring magnitude is exactly what makes the median fit robust, and exactly what makes it *insensitive*
— it discards real information when the large residual is genuine signal rather than corruption. A
point at `y = 10000` might be the most informative row in the dataset. Absolute error will not notice.

Robustness is not a free upgrade; it is a decision to stop listening to extremes.

:::

### Where the difference comes from

The per-residual arithmetic explains all of it:

```text title="Output"
2. WHAT ONE RESIDUAL COSTS UNDER EACH LOSS
       r   squared  absolute  Huber d=1
     0.0      0.00      0.00       0.00
     0.5      0.25      0.50       0.12
     1.0      1.00      1.00       0.50
     2.0      4.00      2.00       1.50
     5.0     25.00      5.00       4.50
    10.0    100.00     10.00       9.50
     sum    130.25     18.50      16.12
   the single r = 10 is 76.8% of the squared total, 54.1% of the absolute total
```

Under squared error the single `r = 10` accounts for **76.8%** of the total. The optimiser is therefore
mostly working on that one point, and the fit it produces is mostly a compromise with it. Under absolute
error the same residual is **54.1%** of the total. Same data, and the objective has a different opinion
about what matters.

Note the crossover at `r = 1`: below it, squared error penalises *less* than absolute error (`0.25`
against `0.50`), above it, much more. Squared error is lenient about small misses and severe about large
ones, which is a real modelling statement, not a technicality.

**Huber** is the deliberate hybrid: quadratic within `δ` of zero, linear beyond it. At `r = 0.5` it
reads `0.12` (quadratic, `½r²`); at `r = 10` it reads `9.50` (linear, `|r| − ½`). That gives it squared
error's smooth gradient near the optimum and absolute error's bounded influence far from it, which is why
its slope moved only `1.9526 → 1.9581`.

| Loss | Formula | Optimises for | Gradient | Outlier influence |
|---|---|---|---|---|
| **Squared** (L2) | `r²` | The **mean** | `2r` — proportional to error | Unbounded |
| **Absolute** (L1) | `\|r\|` | The **median** | `sign(r)` — constant | Bounded, and magnitude-blind |
| **Huber** | `½r²` or `δ(\|r\|−δ/2)` | Between the two | `r` then `δ·sign(r)` | Bounded beyond `δ` |

:::tip Squared error fits the mean; absolute error fits the median

This is the cleanest way to remember the difference. Minimising `Σ(y − c)²` over a constant `c` gives
`c = ȳ`; minimising `Σ|y − c|` gives `c = median(y)`. The regression versions inherit exactly those
properties, including the median's indifference to how extreme the extremes are.

The corollary matters for reporting: if you fit with absolute error, do not be surprised when the
residuals do not sum to zero. That is a property of least squares, not of fitting in general.

:::

---

## The loss decides whether the problem is solvable at all

Everything above concerned *which* answer you get. This section is about whether you get one.

This is the staircase from the [opening](#in-plain-words), measured. The claim to test: a loss made of
*counts* has no slope to follow, so a gradient method cannot move at all. The way to test it is to
nudge one weight by a hair and ask whether the loss changed. If nothing changed, the slope is zero and
the optimiser is standing on a flat step.

For classification, the obvious thing to minimise is the number of mistakes. It is what you care about,
it needs no parameters, and it is the metric you will report. Take a two-feature binary problem, sweep
one weight across 2000 values, and compute the numerical derivative of misclassification count at each:

```text title="Output"
3. SOLVABILITY   (gradient surveyed over 2000 values of w1, w2 held at 0.3)
   0/1 loss   1998 of 2000 gradients are exactly 0.0   max |gradient| = 833.3333
   log loss      0 of 2000 gradients are exactly 0.0   max |gradient| = 0.6903
   200 gradient descent steps from the same start (12/60 correct):
      minimising 0/1 loss -> 12/60      minimising log loss -> 60/60
```

**1998 of 2000 gradients are exactly `0.0`.** Not small — zero, bit-for-bit. Misclassification count is
a step function: nudging a weight slightly changes no prediction at all, so the count is locally
constant everywhere except at the 2 sampled points where some example crosses the boundary. There, the
derivative is `833.3333` — one example flipping (`1/60`) divided by the step size (`2 × 10⁻⁵`).

So the derivative of 0/1 loss is either **exactly zero** or **an artefact of the step size**. It is
never informative. Compare log loss: **`0` of 2000** gradients are zero, and the largest is `0.6903` —
a bounded, meaningful number at every point.

Running gradient descent on each confirms the consequence. From an identical, deliberately bad start at
**12/60 correct**:

- minimising 0/1 loss: **12/60** after 200 steps. It did not move. It cannot.
- minimising log loss: **60/60**. Every row correct.

:::danger You cannot optimise accuracy directly, and this is why

Accuracy, precision, recall and F1 are all built from counts, so all of them are piecewise constant in
the parameters. A gradient method has nothing to follow. This is not a limitation of gradient descent —
it is the reason **surrogate losses** exist.

The pattern is universal in supervised learning: minimise a smooth surrogate (log loss, hinge), report
the discrete metric (accuracy, F1). Anyone who says "just optimise the metric you care about" is
describing something a first-order method cannot do.

:::

Two properties are being asked of a loss here, and they are separate:

| Requirement | Why | 0/1 loss |
|---|---|---|
| **Differentiable** (almost everywhere) | A gradient must exist to follow | Fails — flat with jumps |
| **Informative gradient** | The gradient must point somewhere useful | Fails — zero where it exists |
| **Convex** (desirable, not required) | Guarantees one minimum | Not convex either |

Absolute error is interesting against this table: it is *not* differentiable at `r = 0`, yet it works
fine, because the non-differentiable set has measure zero and a subgradient exists. Non-differentiability
at isolated points is tolerable. Being flat everywhere is not.

---

## Loss by task

With that constraint in place, the standard choices follow.

| Task | Loss | Formula | Minimises |
|---|---|---|---|
| **Regression** | Squared error / MSE | `(ŷ − y)²` | Distance to the mean |
| Regression, outliers present | Absolute error, Huber | `\|ŷ − y\|` | Distance to the median |
| **Binary classification** | Cross-entropy / log loss | `−[y·ln p + (1−y)·ln(1−p)]` | Divergence from the true distribution |
| Multi-class | Categorical cross-entropy | `−Σ yₖ·ln pₖ` | Same, over `k` classes |
| **Classification with margins (SVM)** | Hinge | `max(0, 1 − m)` | Margin violations |

### Log loss is unbounded, and that is the design

```text title="Output"
4. LOSS BY TASK
   log loss = −ln(p) on the true class:
            p    −ln(p)
     9.90e-01      0.01
     9.00e-01      0.11
     5.00e-01      0.69
     1.00e-01      2.30
     1.00e-02      4.61
     1.00e-07     16.12
```

`p = 0.5` — no opinion — costs `0.69`, which is `ln 2`. A confident correct answer at `p = 0.99` costs
`0.01`. A confident *wrong* answer at `p = 10⁻⁷` costs **`16.12`**, and there is no upper limit: as
`p → 0` the loss goes to infinity.

That asymmetry is the point. Log loss does not score whether you were right; it scores how much
probability you assigned to what actually happened. Being confidently wrong is punished without bound,
which is what forces a model to produce calibrated probabilities rather than confident guesses.

:::warning `log_loss` on a probability of exactly zero

Because `−ln(0) = ∞`, any implementation must clip. scikit-learn's `log_loss` clips predictions away
from `0` and `1` internally, so it returns a large finite number rather than `inf`. If you write the
loss yourself, clip explicitly — a single `p = 0.0` on a positive example will otherwise turn your
entire cost into `inf` or `nan` and every gradient with it.

:::

### Hinge loss cares about the margin, then stops caring

Hinge loss is a fussy examiner who stops marking once you are safely past. Get a point onto the right
side of the boundary *with room to spare* and it scores zero — no complaint, no pull on the fit at all.
Only the points near the boundary, or on the wrong side of it, still cost anything. That is why a
support vector machine ends up defined by a handful of points: the rest have been marked zero and have
nothing left to say.

Formally, hinge is stated in terms of the **margin** `m = y·f(x)`, positive when the prediction is on
the correct side and larger when it is further from the boundary:

```text title="Output"
   loss against the margin m (positive = correct side, |m| = confidence):
        m   hinge  sq hinge  (sig(m)−1)^2   0/1
      2.0    0.00      0.00        0.0142     0
      1.0    0.00      0.00        0.0723     0
      0.5    0.50      0.25        0.1425     0
      0.0    1.00      1.00        0.2500     1
     -1.0    2.00      4.00        0.5344     1
     -2.0    3.00      9.00        0.7758     1
```

Read the `hinge` column. At `m = 2` and `m = 1` it is **exactly `0.00`** — a correctly classified point
comfortably past the margin contributes *nothing*, so it exerts no pull on the fit whatsoever. Below
`m = 1` the loss rises linearly. That flat region is the whole idea of a support vector machine: only
the points near the boundary are support vectors, and the rest could be deleted without changing the
model.

Compare the columns:

- **`0/1`** is a step: it drops from `1` to `0` between `m = 0` and `m = 0.5` and is flat either side —
  the flatness this page has already shown to be fatal.
- **hinge** is `0/1`'s tightest convex upper bound with a useful gradient: constant slope `−1` while
  violated, `0` when satisfied.
- **squared hinge** grows quadratically (`9.00` at `m = −2` against hinge's `3.00`), so it is smooth at
  the kink but far more outlier-sensitive.
- **`(σ(m) − 1)²`** — squared error applied to a probability — never reaches zero and never gets steep.
  At `m = −2`, badly wrong, it is only `0.7758`, less than 3× its value at `m = 0`. That flatness is the
  subject of the next section.

### Does the choice actually change the classifier?

Same 60 rows, same seed, same estimator, five losses:

```text title="Output"
   the same linear classifier trained on the same 60 rows, five losses:
   loss              max_iter=1000  max_iter=200000   stopped on tol?
   log_loss                  60/60            60/60   yes / yes
   hinge                     59/60            59/60   yes / yes
   squared_hinge             58/60            58/60    no / no
   modified_huber            59/60            59/60   yes / yes
   squared_error             57/60            57/60   yes / yes
   hinge has no probabilities: AttributeError: This 'SGDClassifier' has no attribute 'predict_proba'
```

The spread is real but small: `57/60` to `60/60`, three rows out of sixty. Crucially it **survives**
raising `max_iter` from `1000` to `200000` and tightening `tol` — every accuracy is identical in both
columns, so this is a property of the losses rather than of how long the optimiser ran.

`squared_hinge` is the one that never hits its tolerance, in either column. It still lands at `58/60`
both times, so the non-convergence did not cost it anything here — but a non-convergence warning
sitting next to an accuracy comparison is a reason to check, not to publish.

:::note An earlier version of this measurement produced a false finding

The first run of this comparison reported all five losses clustered at chance level and concluded that
the choice of loss makes no difference to accuracy. The labels had accidentally been generated from a
*separate* random draw rather than from the feature columns, so they carried no information about `X` at
all and every classifier was guessing.

Two lessons. A result showing "no effect" deserves the same scrutiny as one showing a large effect —
more, because it is easier to believe. And any classification demo should print an accuracy that is
clearly above chance before any comparison between methods is read.

:::

The last line of that output is the difference that dwarfs three rows of accuracy:

**`AttributeError: This 'SGDClassifier' has no attribute 'predict_proba'`**

Hinge loss produces a *decision value*, not a probability, so `predict_proba` does not exist on the
fitted estimator — not a low-quality probability, no probability. `log_loss` and `modified_huber` give
you one; `hinge` and `squared_hinge` do not. If anything downstream needs a probability — a threshold,
a cost-weighted decision, a calibration plot — that choice is made when the loss is chosen, and it is
irreversible without refitting.

---

## Cross-entropy versus squared error on a sigmoid

Squared error on a classifier's probability output is a natural-looking mistake: the output is a number,
the target is `0` or `1`, so square the difference. The table above showed it stays flat when badly
wrong.

The plain statement of what goes wrong: **squared error's alarm goes quiet exactly when the fire is
worst.** A classifier ends in a squashing function (the sigmoid) that maps any score onto a probability
between `0` and `1`. Squashing means that far out at either end, a large change in the score barely
moves the probability. Squared error measures the mistake *in probability*, so when the model is
confidently, catastrophically wrong it sees a tiny distance and asks for a tiny correction — precisely
when it should be shouting. Cross-entropy is built to cancel the squashing out, so its correction stays
proportional to the actual mistake.

Here is that in arithmetic, differentiating with respect to the pre-sigmoid score `z`.

With `p = σ(z)` and true label `y = 1`:

```
cross-entropy:   dL/dz = p − y                      the sigmoid's derivative cancels
squared error:   dL/dz = 2(p − y) · σ′(z)           and σ′(z) = p(1 − p)
```

`σ′(z)` is the problem. It peaks at `0.25` when `p = 0.5` and collapses towards zero at both extremes:

```text title="Output"
5. GRADIENT AT THE OUTPUT, y = 1   (cross-entropy vs squared error)
       z  p = sig(z)     CE dL/dz     SE dL/dz     ratio
     -10     0.00005   -1.000e+00   -9.079e-05    11014x
      -4     0.01799   -9.820e-01   -3.469e-02       28x
      -1     0.26894   -7.311e-01   -2.875e-01        3x
       0     0.50000   -5.000e-01   -2.500e-01        2x
       1     0.73106   -2.689e-01   -1.058e-01        3x
       4     0.98201   -1.799e-02   -6.354e-04       28x
      10     0.99995   -4.540e-05   -4.122e-09    11014x
```

Read the `z = −10` row. The true label is `1` and the model predicts `p = 0.00005` — as wrong as it is
possible to be. Cross-entropy's gradient is `−1.000` — maximal, demanding a large correction. Squared
error's is `−9.079e-05`, effectively nothing. The ratio is **`11014×`**.

The mechanism is that squared error multiplies the error by `σ′(z)`, and `σ′` is smallest exactly where
the model is most confident. A confidently wrong prediction is therefore where squared error learns
*slowest*. Cross-entropy's `−ln p` was constructed so that the `σ′` term cancels, leaving `p − y`: the
gradient is the error itself.

:::tip Cross-entropy is not "better", it is the loss whose gradient survives the sigmoid

The cancellation is the design, not a happy accident. `−ln p` is chosen because its derivative is
`−1/p` and `σ′ = p(1−p)`, so the product is `−(1−p)`, giving `p − y` overall. Any smooth loss paired
with a saturating output needs this check.

The same reasoning explains the `28×` at `z = ±4`. The problem is not confined to extreme values —
`p = 0.018` is not an unusual prediction, and squared error is already learning 28 times more slowly
there.

:::

The `z = +10` row is the mirror image: the model is confidently *right*, and both gradients are tiny —
correctly, since nothing needs changing. The ratio is again `11014×`, but of two negligible numbers.
Confident correctness is where a small gradient is the right answer.

---

## Common Mistakes

| # | Mistake | Wrong | Right |
|---|---|---|---|
| 1 | "The line of best fit" | One canonical answer | Three losses gave `1.9490`, `1.9752`, `1.9526` on identical clean data |
| 2 | Testing outlier robustness at `x ≈ x̄` | Any outlier will do | Centre gave `+0.0290`, edge `+0.6576` — from the same loss |
| 3 | Concluding squared error is robust from a centre outlier | The numbers say so | Absolute error moved *more* there; it was a leverage effect |
| 4 | Thinking absolute error is "less affected" by outliers | Somewhat affected | **Unaffected**: `1.975169` at `y = 60`, `200` and `10000` |
| 5 | Treating robustness as a free upgrade | Strictly better | Magnitude-blind means blind to genuine large signal too |
| 6 | Optimising accuracy directly | It's what we care about | `1998/2000` gradients exactly zero; 200 steps moved nothing |
| 7 | Reading a non-zero 0/1 gradient as usable | It's `833.3333`, so it exists | That is `(1/60)/(2e−5)` — an artefact of the step size |
| 8 | Requiring a loss to be differentiable everywhere | `\|r\|` has a kink, so it's unusable | It works fine; a measure-zero kink is harmless |
| 9 | Squared error on a probability output | It's a number, so square it | Gradient `11014×` weaker than cross-entropy when confidently wrong |
| 10 | Assuming the vanishing gradient only bites at extremes | Only at `p ≈ 0` or `1` | Already `28×` at `p = 0.018` |
| 11 | Expecting probabilities from a hinge-loss fit | Call `predict_proba` | `AttributeError` — hinge has no probabilities at all |
| 12 | Publishing a "no difference" result unchecked | It's a null finding | The first run had labels unrelated to `X`; every model was guessing |
| 13 | Comparing losses without checking convergence | Compare final accuracies | `squared_hinge` never hit tolerance in either column |
| 14 | Hand-writing log loss without clipping | `−ln p` | A single `p = 0.0` makes the whole cost `inf` |
| 15 | Assuming residuals sum to zero | Always true of a fit | True of least squares; not of an absolute-error fit |

---

## Summary

| Task | Loss | scikit-learn |
|---|---|---|
| Regression, mean-like | Squared error | `LinearRegression`, `SGDRegressor(loss='squared_error')` |
| Regression, robust | Absolute error | `QuantileRegressor(quantile=0.5)` |
| Regression, compromise | Huber | `HuberRegressor(epsilon=1.35)` |
| Binary classification | Log loss | `SGDClassifier(loss='log_loss')`, `LogisticRegression` |
| Classification, margins | Hinge | `SGDClassifier(loss='hinge')`, `LinearSVC` |
| Classification, both | Modified Huber | `SGDClassifier(loss='modified_huber')` — has `predict_proba` |
| Anything count-based | **Not directly minimisable** | Minimise a surrogate, report the count |

**Key takeaways**

- **The loss is the specification of the answer.** Three losses on identical clean data gave slopes
  `1.9490`, `1.9752` and `1.9526`
- Squared error fits the **mean**, absolute error fits the **median**, Huber sits between them
- **Absolute-error loss is indifferent to how wrong an outlier is.** With the high-leverage point at
  `60`, `200` and `10000` its slope was **`1.975169` every time**, while squared error gave
  `2.6066`, `5.2260`, `188.5808`
- The mechanism is that the gradient of `Σ|r|` is `−Σ sign(rᵢ)·xᵢ` — magnitude never appears. Row 29's
  residual sign was unchanged (`+1 → +1`) so the fit did not move; row 15's **flipped** (`−1 → +1`) so
  it did
- **A low-leverage outlier tests nothing.** Same corruption gave `+0.0290` at the centre and `+0.6576`
  at the edge, and at the centre absolute error looked *worse* than squared error
- One `r = 10` residual is **76.8%** of the squared total but **54.1%** of the absolute total. Squared
  error crosses over at `r = 1`: gentler below, far harsher above
- **Misclassification count cannot be minimised by any gradient method.** `1998` of `2000` sampled
  gradients were **exactly `0.0`**; the non-zero ones read `833.3333`, which is just `(1/60)/(2×10⁻⁵)`
- From the same start at `12/60`, minimising 0/1 loss gave **`12/60`** after 200 steps; minimising log
  loss gave **`60/60`**
- Accuracy, precision, recall and F1 are all count-based and share this defect — hence **surrogate
  losses**
- Log loss is **unbounded**: `0.69` at `p = 0.5`, `16.12` at `p = 10⁻⁷`. That is what forces calibrated
  probabilities
- Hinge loss is **exactly `0.00`** for margins of `1` and `2` — comfortably-correct points exert no pull,
  which is what makes support vectors a small subset
- The five losses differed by `57/60` to `60/60`, and the ranking **survived** `max_iter = 200000`
- **Hinge loss has no probabilities at all** — `predict_proba` raises
  `AttributeError: This 'SGDClassifier' has no attribute 'predict_proba'`
- **Squared error on a sigmoid nearly stops learning where it is most wrong.** At `z = −10` with `y = 1`,
  cross-entropy's gradient is `−1.000e+00` against squared error's `−9.079e-05` — **`11014×`** — and it
  is already **`28×`** at `p = 0.018`
- Cross-entropy is constructed so the `σ′(z)` factor **cancels**, leaving `dL/dz = p − y`

**Next in this section:** [Gradient Descent](./02-gradient-descent.md) — the method that follows one of
these gradients downhill, the two different plots that share its name, and why the step size shrinks
near the minimum without anyone programming it

**See also:** [Simple Linear Regression](../03-linear-regression/01-simple-linear-regression.md#how-wrong-is-it-the-five-error-measures)
for the error measures as *metrics* rather than objectives ·
[Outliers and Feature Engineering](../02-data-preprocessing/05-outliers-and-feature-engineering.md#robust-models-fix-y-outliers-not-x-outliers)
for why a robust loss fixes `y`-outliers and not `X`-outliers ·
[The Matrix Formulation](../03-linear-regression/03-the-matrix-formulation.md#why-anyone-bothers-with-gradient-descent)
for the closed form that exists only for squared error

---

## Run It Yourself

```python title="loss_functions.py"
"""Loss functions — what changes when you minimise a different quantity."""
import numpy as np
import warnings
from sklearn.linear_model import (LinearRegression, QuantileRegressor,
                                 HuberRegressor, SGDClassifier)
from sklearn.exceptions import ConvergenceWarning

def fit3(X, y):
    """The same data fitted by minimising squared, absolute and Huber loss."""
    return (LinearRegression().fit(X, y),
            QuantileRegressor(quantile=0.5, alpha=0, solver="highs").fit(X, y),
            HuberRegressor(epsilon=1.35).fit(X, y))

# ---------- 1. same data, three losses, three different lines ----------
rng = np.random.RandomState(42)
xs = np.linspace(0, 10, 30)
X = xs.reshape(-1, 1)
y = 2 * xs + 5 + rng.normal(0, 0.5, 30)
y_mid, y_edge = y.copy(), y.copy()
y_mid[15], y_edge[-1] = 60.0, 60.0          # same corruption, low then high leverage
clean, mid, edge = fit3(X, y), fit3(X, y_mid), fit3(X, y_edge)
print("1. ONE DATASET, THREE LOSSES   (truth: slope 2.0, intercept 5.0)")
print(f"   {'loss':<9}{'clean slope':>12}{'int':>8}   {'centre-out':>11}{'int':>8}"
      f"   {'edge-out':>9}{'int':>8}")
for i, name in enumerate(("squared", "absolute", "Huber")):
    print(f"   {name:<9}{clean[i].coef_[0]:>12.4f}{clean[i].intercept_:>8.2f}"
          f"   {mid[i].coef_[0]:>11.4f}{mid[i].intercept_:>8.2f}"
          f"   {edge[i].coef_[0]:>9.4f}{edge[i].intercept_:>8.2f}")

print("\n   absolute loss depends only on sign(residual), never on its size:")
for label, fitted, target, k in (("row 15", mid[1], y_mid, 15), ("row 29", edge[1], y_edge, 29)):
    s0 = np.sign(y - clean[1].predict(X))[k]
    s1 = np.sign(target - fitted.predict(X))[k]
    print(f"   sign(r[{k}]) clean {s0:+.0f} -> corrupted {s1:+.0f}   "
          f"{'FLIPPED' if s0 != s1 else 'unchanged'}   ({label})")

print("\n   push the high-leverage point further and further away:")
print(f"   {'y[29]':>8}{'absolute slope':>17}{'squared slope':>16}")
for val in (60, 200, 10000):
    yt = y.copy()
    yt[-1] = val
    a = QuantileRegressor(quantile=0.5, alpha=0, solver="highs").fit(X, yt)
    s = LinearRegression().fit(X, yt)
    print(f"   {val:>8}{a.coef_[0]:>17.6f}{s.coef_[0]:>16.4f}")

# ---------- 2. per-residual arithmetic ----------
r = np.array([0, 0.5, 1, 2, 5, 10])
sq, ab = r ** 2, np.abs(r)
hu = np.where(np.abs(r) <= 1, 0.5 * r ** 2, np.abs(r) - 0.5)
print("\n2. WHAT ONE RESIDUAL COSTS UNDER EACH LOSS")
print(f"   {'r':>5}{'squared':>10}{'absolute':>10}{'Huber d=1':>11}")
for i in range(len(r)):
    print(f"   {r[i]:>5.1f}{sq[i]:>10.2f}{ab[i]:>10.2f}{hu[i]:>11.2f}")
print(f"   {'sum':>5}{sq.sum():>10.2f}{ab.sum():>10.2f}{hu.sum():>11.2f}")
print(f"   the single r = 10 is {100 * sq[-1] / sq.sum():.1f}% of the squared total, "
      f"{100 * ab[-1] / ab.sum():.1f}% of the absolute total")

# ---------- 3. the loss decides whether the problem is solvable ----------
rng2 = np.random.RandomState(99)
Xb = rng2.randn(60, 2)
yb = (Xb[:, 0] + 0.5 * Xb[:, 1] > 0).astype(int)

def loss01(w):
    return np.mean((Xb @ w > 0) != yb)

def losslog(w):
    z = Xb @ w
    return np.mean(np.where(yb == 1, np.log1p(np.exp(-z)), np.log1p(np.exp(z))))

def numgrad(fn, w, eps=1e-5):
    g = np.zeros_like(w)
    for i in range(len(w)):
        hi, lo = w.copy(), w.copy()
        hi[i] += eps
        lo[i] -= eps
        g[i] = (fn(hi) - fn(lo)) / (2 * eps)
    return g

print("\n3. SOLVABILITY   (gradient surveyed over 2000 values of w1, w2 held at 0.3)")
for name, fn in (("0/1 loss", loss01), ("log loss", losslog)):
    gs = np.array([numgrad(fn, np.array([v, 0.3]))[0] for v in np.linspace(-2, 2, 2000)])
    print(f"   {name:<10}{int((gs == 0).sum()):>5} of 2000 gradients are exactly 0.0"
          f"   max |gradient| = {np.abs(gs).max():.4f}")
start = np.array([-0.5, 0.1])
w01, wlog = start.copy(), start.copy()
for _ in range(200):
    w01 -= 0.1 * numgrad(loss01, w01)
    wlog -= 0.1 * numgrad(losslog, wlog)
acc = lambda w: int(((Xb @ w > 0) == yb).sum())
print(f"   200 gradient descent steps from the same start ({acc(start)}/60 correct):")
print(f"      minimising 0/1 loss -> {acc(w01)}/60      minimising log loss -> {acc(wlog)}/60")

# ---------- 4. loss by task ----------
print("\n4. LOSS BY TASK")
print("   log loss = −ln(p) on the true class:")
print(f"   {'p':>10}{'−ln(p)':>10}")
for p in (0.99, 0.9, 0.5, 0.1, 0.01, 1e-7):
    print(f"   {p:>10.2e}{-np.log(p):>10.2f}")
print("\n   loss against the margin m (positive = correct side, |m| = confidence):")
print(f"   {'m':>6}{'hinge':>8}{'sq hinge':>10}{'(sig(m)−1)^2':>14}{'0/1':>6}")
for m in (2, 1, 0.5, 0, -1, -2):
    h = max(0.0, 1 - m)
    print(f"   {m:>6.1f}{h:>8.2f}{h ** 2:>10.2f}"
          f"{(1 / (1 + np.exp(-m)) - 1) ** 2:>14.4f}{(1.0 if m <= 0 else 0.0):>6.0f}")

names = ["log_loss", "hinge", "squared_hinge", "modified_huber", "squared_error"]
print("\n   the same linear classifier trained on the same 60 rows, five losses:")
print(f"   {'loss':<16}{'max_iter=1000':>15}{'max_iter=200000':>17}   stopped on tol?")
for nm in names:
    fits, flags = [], []
    for iters, tol in ((1000, 1e-3), (200000, 1e-6)):
        with warnings.catch_warnings(record=True) as caught:
            warnings.simplefilter("always", ConvergenceWarning)
            f = SGDClassifier(loss=nm, random_state=42, max_iter=iters, tol=tol).fit(Xb, yb)
        fits.append(f"{(f.predict(Xb) == yb).sum()}/60")
        flags.append("no" if any(issubclass(c.category, ConvergenceWarning)
                                 for c in caught) else "yes")
    print(f"   {nm:<16}{fits[0]:>15}{fits[1]:>17}   {flags[0]:>3} / {flags[1]}")
try:
    SGDClassifier(loss="hinge", random_state=42).fit(Xb, yb).predict_proba(Xb)
except AttributeError as e:
    print(f"   hinge has no probabilities: {type(e).__name__}: {e}")

# ---------- 5. why squared error fails on a sigmoid ----------
print("\n5. GRADIENT AT THE OUTPUT, y = 1   (cross-entropy vs squared error)")
print(f"   {'z':>5}{'p = sig(z)':>12}{'CE dL/dz':>13}{'SE dL/dz':>13}{'ratio':>10}")
for z in (-10, -4, -1, 0, 1, 4, 10):
    p = 1 / (1 + np.exp(-z))
    ce, se = p - 1, 2 * (p - 1) * p * (1 - p)
    print(f"   {z:>5}{p:>12.5f}{ce:>13.3e}{se:>13.3e}{abs(ce / se):>9.0f}x")
```

```text title="Output"
1. ONE DATASET, THREE LOSSES   (truth: slope 2.0, intercept 5.0)
   loss      clean slope     int    centre-out     int    edge-out     int
   squared        1.9490    5.16        1.9780    6.51      2.6066    3.04
   absolute       1.9752    4.94        1.9432    5.25      1.9752    4.94
   Huber          1.9526    5.14        1.9531    5.16      1.9581    5.12

   absolute loss depends only on sign(residual), never on its size:
   sign(r[15]) clean -1 -> corrupted +1   FLIPPED   (row 15)
   sign(r[29]) clean +1 -> corrupted +1   unchanged   (row 29)

   push the high-leverage point further and further away:
      y[29]   absolute slope   squared slope
         60         1.975169          2.6066
        200         1.975169          5.2260
      10000         1.975169        188.5808

2. WHAT ONE RESIDUAL COSTS UNDER EACH LOSS
       r   squared  absolute  Huber d=1
     0.0      0.00      0.00       0.00
     0.5      0.25      0.50       0.12
     1.0      1.00      1.00       0.50
     2.0      4.00      2.00       1.50
     5.0     25.00      5.00       4.50
    10.0    100.00     10.00       9.50
     sum    130.25     18.50      16.12
   the single r = 10 is 76.8% of the squared total, 54.1% of the absolute total

3. SOLVABILITY   (gradient surveyed over 2000 values of w1, w2 held at 0.3)
   0/1 loss   1998 of 2000 gradients are exactly 0.0   max |gradient| = 833.3333
   log loss      0 of 2000 gradients are exactly 0.0   max |gradient| = 0.6903
   200 gradient descent steps from the same start (12/60 correct):
      minimising 0/1 loss -> 12/60      minimising log loss -> 60/60

4. LOSS BY TASK
   log loss = −ln(p) on the true class:
            p    −ln(p)
     9.90e-01      0.01
     9.00e-01      0.11
     5.00e-01      0.69
     1.00e-01      2.30
     1.00e-02      4.61
     1.00e-07     16.12

   loss against the margin m (positive = correct side, |m| = confidence):
        m   hinge  sq hinge  (sig(m)−1)^2   0/1
      2.0    0.00      0.00        0.0142     0
      1.0    0.00      0.00        0.0723     0
      0.5    0.50      0.25        0.1425     0
      0.0    1.00      1.00        0.2500     1
     -1.0    2.00      4.00        0.5344     1
     -2.0    3.00      9.00        0.7758     1

   the same linear classifier trained on the same 60 rows, five losses:
   loss              max_iter=1000  max_iter=200000   stopped on tol?
   log_loss                  60/60            60/60   yes / yes
   hinge                     59/60            59/60   yes / yes
   squared_hinge             58/60            58/60    no / no
   modified_huber            59/60            59/60   yes / yes
   squared_error             57/60            57/60   yes / yes
   hinge has no probabilities: AttributeError: This 'SGDClassifier' has no attribute 'predict_proba'

5. GRADIENT AT THE OUTPUT, y = 1   (cross-entropy vs squared error)
       z  p = sig(z)     CE dL/dz     SE dL/dz     ratio
     -10     0.00005   -1.000e+00   -9.079e-05    11014x
      -4     0.01799   -9.820e-01   -3.469e-02       28x
      -1     0.26894   -7.311e-01   -2.875e-01        3x
       0     0.50000   -5.000e-01   -2.500e-01        2x
       1     0.73106   -2.689e-01   -1.058e-01        3x
       4     0.98201   -1.799e-02   -6.354e-04       28x
      10     0.99995   -4.540e-05   -4.122e-09    11014x
```

### What to notice in that output

- **The three clean fits already disagree, and all three miss the true `2.0`.** `1.9490`, `1.9752`,
  `1.9526` — the spread between losses (`0.026`) is comparable to each one's distance from the truth
  (`0.025`–`0.051`). With `n = 30` and `σ = 0.5`, the choice of loss matters about as much as the
  sampling noise. On dirtier data the loss dominates.
- **Squared error's intercept moved in *opposite directions* for the two outliers** — `5.16 → 6.51` for
  the centre point, `5.16 → 3.04` for the edge point. The edge point pulled the right end of the line up,
  which pivots the left end down. Same corruption, opposite effect on `b`.
- **The absolute-error row is byte-identical in the `clean` and `edge-out` columns** — `1.9752/4.94`
  twice. Not "similar": the fitted model is the same object's worth of numbers.
- **Huber's slope moved `+0.0055` at the edge, not `0.0000`.** It is not fully robust — beyond `δ` its
  gradient is bounded but the point still contributes a constant pull, so `δ` controls a genuine
  trade-off rather than eliminating one.
- **`max |gradient| = 833.3333` for 0/1 loss is `(1/60) / (2 × 10⁻⁵)`.** Change `eps` in `numgrad` and
  that number changes proportionally, which is the tell that it carries no information about the loss —
  only about the probe.
- **The starting point scores `12/60`, well below chance.** Deliberate: it makes the 0/1 result
  unambiguous. A start at 30/60 could be confused with a model that had nothing to learn.
- **Hinge is `0.00` at both `m = 1` and `m = 2`, identically.** The flat region is genuinely flat, not
  merely small — which is why deleting well-classified points changes an SVM by exactly nothing.
- **`(σ(m) − 1)²` is `0.0142` at `m = 2` and `0.7758` at `m = −2`** — a range of about 55×, against
  hinge's `0.00` to `3.00`. Squared error on a probability is bounded above by `1`, so it can never
  express "this is very wrong".
- **`squared_hinge` reads `no / no`** — it failed to hit its tolerance even at `max_iter = 200000`. Its
  accuracy was stable at `58/60` regardless, so nothing here depends on it, but the flag is the reason
  to trust the comparison rather than assume it.
- **The `28×` rows at `z = ±4` matter more than the `11014×` rows.** `p = 0.018` and `p = 0.982` are
  ordinary predictions from a working model, and squared error is already an order of magnitude slower
  there.

**Things worth trying:**

1. Change `y_edge[-1]` from `60` to `-60` — below the line rather than above. The residual sign at row 29
   now *does* flip, so the absolute-error slope moves. Predict the direction first.
2. In section 1, corrupt row `29` to `26` instead of `60` (just above the line). Check whether the sign
   flips, and whether the absolute-error fit stays put.
3. Change `HuberRegressor(epsilon=1.35)` to `epsilon=1.0` and then `10.0`. At large `δ` Huber should
   converge on squared error's answer; at small `δ`, on absolute error's.
4. Change `eps` in `numgrad` from `1e-5` to `1e-3` and re-run section 3. The count of exactly-zero
   gradients should fall (a wider probe catches more boundary crossings) and `max |gradient|` should
   shrink proportionally. Neither change makes 0/1 loss optimisable.
5. In section 3, run gradient descent on 0/1 loss from **1000** random starts and record the best
   accuracy reached. This is random search, not gradient descent, and it is the only thing that works on
   a flat loss.
6. Add `p = 1e-15` to the log loss table, then try `np.log(0.0)` and see what a real zero does.
7. In section 5, replace the sigmoid with `tanh` and redo the derivative. `tanh′ = 1 − tanh²` saturates
   the same way, so the same trap applies.
8. Fit `SGDClassifier(loss='modified_huber')` and compare its `predict_proba` output against
   `log_loss`'s on the same rows — same accuracy (`59/60` vs `60/60`), different probabilities.

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

### Loss, cost and metric

**L1. [THEORY]** Distinguish loss, cost and metric, giving an example of each.

**L2. [THEORY]** Why are the loss and the reported metric usually different quantities?

**L3. [ANALYZE]** Squared error served as both loss and metric for linear regression. Explain why that
is unusual rather than typical.

**L4. [OUT]** Three losses gave `1.9490`, `1.9752` and `1.9526` on identical clean data. What does that
do to the phrase "the line of best fit"?

### Regression losses

**R1. [THEORY]** Write the formulas for squared, absolute and Huber loss, and state which statistic each
fits.

**R2. [THEORY]** Show that minimising `Σ(y − c)²` over a constant `c` gives the mean, and
`Σ|y − c|` gives the median.

**R3. [OUT]** The absolute-error slope was `1.975169` at `y[29] = 60`, `200` and `10000`. Explain why it
is exactly unchanged, using the gradient of `Σ|r|`.

**R4. [OUT]** `sign(r[15])` flipped from `-1` to `+1` and the absolute-error fit moved; `sign(r[29])`
stayed `+1` and it did not. State the general rule.

**R5. [OUT]** At the centre outlier, absolute error's slope moved `-0.0320` and squared error's
`+0.0290`. Why does this *not* show squared error is more robust?

**R6. [ANALYZE]** Design a correct experiment to compare outlier robustness across losses, naming what
you would hold fixed.

**R7. [OUT]** One `r = 10` was `76.8%` of the squared total and `54.1%` of the absolute total. What does
that predict about which points each fit is negotiating with?

**R8. [OUT]** At `r = 0.5`, squared error is `0.25` and absolute error is `0.50`; at `r = 10` they are
`100.00` and `10.00`. Where do they cross, and what modelling statement does the crossover make?

**R9. [ANALYZE]** Argue *against* using absolute error on a dataset where the largest residuals are real.

**R10. [PROG]** Fit all three losses on data with two outliers, one at each end of the `x` range, and
report which loss recovers the true slope best.

### Solvability

**S1. [OUT]** `1998` of `2000` sampled gradients of 0/1 loss were exactly `0.0`. Explain why, from the
shape of the loss.

**S2. [OUT]** The non-zero 0/1 gradients read `833.3333`. Show that this is `(1/60)/(2 × 10⁻⁵)` and say
why the value is uninformative.

**S3. [OUT]** From the same start at `12/60`, 0/1 loss reached `12/60` and log loss reached `60/60`.
What has been demonstrated, and what has not?

**S4. [THEORY]** Name the two properties a loss must have for gradient descent to work, and give an
example of a loss that fails each.

**S5. [ANALYZE]** Absolute error is not differentiable at `r = 0`, yet it works. Reconcile that with S4.

**S6. [THEORY]** Why can accuracy, precision, recall and F1 all not be minimised directly? What is done
instead?

**S7. [ANALYZE]** A colleague proposes optimising F1 by gradient descent. Respond using this page's
numbers.

**S8. [PROG]** Replace gradient descent on 0/1 loss with random search over 1000 starts and report the
best accuracy found. What does the comparison show about flat losses?

### Classification losses

**C1. [THEORY]** Write the binary cross-entropy formula and explain each term.

**C2. [OUT]** Log loss is `0.69` at `p = 0.5` and `16.12` at `p = 10⁻⁷`. Where does `0.69` come from,
and what does the unboundedness accomplish?

**C3. [THEORY]** Define the margin `m` and explain why hinge loss is stated in terms of it.

**C4. [OUT]** Hinge is `0.00` at both `m = 1` and `m = 2`. What does that imply about which training
points influence the fit?

**C5. [OUT]** Squared hinge is `9.00` at `m = -2` against hinge's `3.00`. What does it buy, and what
does it cost?

**C6. [OUT]** `(σ(m) − 1)²` is `0.7758` at `m = -2` and `0.2500` at `m = 0`. Why is that ratio a problem?

**C7. [OUT]** The five losses spanned `57/60` to `60/60`, unchanged at `max_iter = 200000`. What does the
stability of the columns establish?

**C8. [ANALYZE]** `squared_hinge` never hit its tolerance in either column. Does that invalidate the
comparison? Justify your answer.

**C9. [OUT]** `predict_proba` on a hinge-loss fit raises `AttributeError`. Why is that a design
consequence rather than a missing feature?

**C10. [ANALYZE]** You need calibrated probabilities for a cost-weighted decision. Which of the five
losses can you use, and what does that constrain?

### The sigmoid trap

**V1. [THEORY]** Derive `dL/dz = p − y` for cross-entropy with `p = σ(z)`.

**V2. [THEORY]** Derive `dL/dz = 2(p − y)·σ′(z)` for squared error, and state what `σ′(z)` equals.

**V3. [OUT]** At `z = -10` the gradients are `-1.000e+00` and `-9.079e-05`. Explain the `11014×` ratio
in terms of `σ′`.

**V4. [OUT]** At `z = +10` the ratio is also `11014×`, but the situation is fine. Why?

**V5. [ANALYZE]** The `28×` rows at `z = ±4` are argued to matter more than the `11014×` rows. Make that
case.

**V6. [THEORY]** Why is the cancellation in V1 called a design property rather than a coincidence?

**V7. [PROG]** Repeat section 5 with `tanh` in place of the sigmoid and state whether the trap persists.

**V8. [ANALYZE]** A colleague uses squared error on a classifier's probability output and reports that
training "plateaus early". Diagnose it from this page's numbers.

### Quick self-check

1. Distinguish loss, cost and metric.
2. Which statistic does squared error fit? Absolute error?
3. What is the gradient of `Σ|r|`?
4. Why did the absolute-error slope not move when `y[29]` went to `10000`?
5. Why did it move when `y[15]` was corrupted?
6. What is leverage, and why does it break a naive robustness test?
7. Where do squared and absolute loss cross over?
8. What does Huber's `δ` control?
9. How many of 2000 sampled 0/1 gradients were exactly zero?
10. Why is the non-zero 0/1 gradient meaningless?
11. What is a surrogate loss, and why is one needed?
12. What is log loss at `p = 0.5`, and why?
13. Is log loss bounded?
14. What is the margin, and where does hinge loss reach zero?
15. Which two `SGDClassifier` losses give you probabilities?
16. What does `predict_proba` do on a hinge fit?
17. What is `dL/dz` for cross-entropy on a sigmoid?
18. Why does squared error nearly stop learning when confidently wrong?
19. Name a loss that is convex but not differentiable everywhere.
20. Can you minimise accuracy directly?
