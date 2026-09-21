---
sidebar_position: 3
title: The Learning Rate
description: The learning rate is your stride length, and there is an exact cutoff between working and exploding that you can compute instead of guess — verified to 3.3e-16. Also why an alpha 0.4% too large looks merely slow for a thousand iterations, why overshooting is the fastest regime rather than a fault, and why the textbook optimal alpha measured 2.20x slower than a slightly smaller one.
tags: [machine-learning, optimisation, numpy]
toc_max_heading_level: 3
---

# The Learning Rate

> **Topic —** One number, `α`, and it is the only free choice in plain gradient descent. The previous
> page left the ravine unresolved: the usable range for `α` shrank by a factor of a million when one
> feature was rescaled. This page shows that the boundaries of that range are *computable* from the
> Hessian rather than found by trial, that each failure mode has a readable signature, and that the
> conventional advice about which setting is fastest does not survive measurement.

---

## In plain words

The learning rate `α` is your **stride length** while walking downhill in fog. It is the only thing you
get to choose in plain gradient descent, and both extremes fail:

- **Too short** and you take thousands of tiny shuffles to cross the room. Nothing looks broken; it is
  just never finished.
- **Too long** and each step carries you past the bottom and *further up the other side* than you were
  before. Repeat that and you end up higher and higher — the run explodes.

The useful and slightly surprising part is that there is a **sharp cutoff** between those two, and it is
not something you have to discover by trial and error. You can compute it from your data in one line.

### The one idea the whole page rests on

Each step multiplies the distance you still have to travel by

```
1 − α·λ
```

where `λ` is how sharply the bowl curves. Everything else on this page is a consequence of reading that
one expression, so it is worth walking through the cases. Think of it as aiming at a target on the floor:

| `α·λ` | What one step does | Result |
|---|---|---|
| tiny | Moves you a sliver of the way there | Correct but glacial |
| `1` | Lands you **exactly** on the target | Done in one step — but only when every direction curves identically, i.e. a perfectly round bowl |
| between `1` and `2` | Overshoots the target, but ends up **closer than it started** | Still converges — and on a stretched bowl this is where the *fastest* settings live |
| exactly `2` | Overshoots to the mirror-image spot, same distance out the other side | Bounces between two points forever, never arriving |
| above `2` | Overshoots to somewhere **further out** than it started | Diverges, getting worse every step |

Read the bottom two rows again, because they are the whole answer. The run survives as long as
`α·λ < 2` — that is, as long as

```
α  <  2 / λ_max
```

using the *sharpest* curvature, since that is the direction that blows up first. This page measures that
threshold and finds it exact to machine precision.

Three practical consequences follow, and they are what to take away:

1. **Overshooting is not a bug.** The `1 < α·λ < 2` row converges, and on any realistically shaped bowl
   it converges *fastest*. The common advice "reduce the learning rate until the parameters stop
   oscillating" throws away about half your speed.
2. **The safe zone is lopsided.** Being somewhat too small costs you proportionally more steps. Being
   slightly too large falls off a cliff. So aim for roughly `0.9 × 2/λ_max` — near the fast end, with
   room to spare.
3. **A learning rate is not portable.** `λ_max` is a property of *your data on its current scale*.
   Someone else's `α = 0.03` means nothing without their preprocessing, and rescaling one column can
   move the safe range by orders of magnitude.

:::note If you are unsure what `λ` and `κ` are

They were introduced on the [previous page](./02-gradient-descent.md#in-plain-words). Short version:
`λ` (an **eigenvalue**) is how sharply the cost surface curves along one particular direction, `λ_max` is
the sharpest and `λ_min` the shallowest, and `κ = λ_max / λ_min` says how squashed the bowl is — `1` for a
perfect circle, large for a narrow ravine. All of them come out of one call to
`np.linalg.eigvalsh((2/n) * X.T @ X)`.

:::

---

## Every threshold comes from the Hessian

`α` is usually presented as something to tune by hand. For a quadratic cost it isn't — the interesting
values are determined by the curvature of the bowl, which takes one line to compute.

Three thresholds matter, all read off `λ_min` and `λ_max`:

| Value | Name | In plain terms |
|---|---|---|
| `1 / λ_max` | monotone limit | Below this you always approach the target **from one side**. Above it you start overshooting on every step — which, per the [table above](#the-one-idea-the-whole-page-rests-on), is fine |
| `2 / (λ_max + λ_min)` | classical optimum | The textbook "best" `α`. It is optimal for a different quantity than the one you usually care about, and this page shows it losing badly |
| `2 / λ_max` | divergence limit | The cliff edge. At or above this the run **cannot** converge, no matter how long you let it run |

The last one is the load-bearing fact of this page. It is just the last two rows of that table restated:
each step multiplies the remaining error by `(1 − α·λᵢ)` in every direction `i`, and you only make
progress if every one of those factors is smaller than one in size — `|1 − α·λᵢ| < 1`, which rearranges to
`0 < α < 2/λᵢ`. The direction that constrains you hardest is the sharpest-curving one, so:

```
α < 2 / λ_max
```

On a standardised single feature:

```text title="Output"
1. THE THRESHOLDS ARE COMPUTED, NOT GUESSED   (standardised feature, n = 200)
   lambda_min = 2.0000   lambda_max = 2.0000   kappa = 1.00   J at optimum = 3.735305
   1/lambda_max = 0.500000 (monotone limit)   2/(lam_max+lam_min) = 0.500000 (fastest)   2/lambda_max = 1.000000 (divergence)
```

:::tip You can compute a safe `α` instead of searching for one

`np.linalg.eigvalsh((2 / n) * X.T @ X).max()` costs microseconds and hands you the exact ceiling.
Starting from `0.9 × 2/λ_max` and working down beats starting from `0.01` and working up, and it
removes the entire class of "why is nothing happening" debugging.

For very large `p` where the eigendecomposition is too expensive, `λ_max ≤ trace(H) = (2/n)Σ‖xⱼ‖²`
gives a conservative bound for free.

:::

---

## Four regimes, and what each looks like

Same data, same start at `(0, 0)`, only `α` changed. The last column tracks the **sign** of `w − w*`
over the first ten iterations, which is what distinguishes approaching from overshooting:

```text title="Output"
2. FOUR REGIMES   (same data, same start, only alpha differs)
     alpha       J(0)        J(10)      J(50)     J(200)   sign(w−w*)   verdict
     0.001   257.2903     247.3385   211.2870   117.5737   ----------   crawling
     0.300   257.2903       3.7353     3.7353     3.7353   ----------   converged
     0.800   257.2903       3.7446     3.7353     3.7353   -+-+-+-+-+   converged
     1.000   257.2903     257.2903   257.2903   257.2903   -+-+-+-+-+   never moves
     1.200   257.2903  212148.7747          —          —   -+-+-+-+-+   diverged at 26
```

**`α = 0.001` — too small.** After 200 iterations the cost is `117.5737` against an optimum of
`3.735305`. It is working; it will get there; it needs tens of thousands of iterations. The signature
is a cost curve that is *smooth, decreasing, and still visibly sloped* at the end of the run.

**`α = 0.3` — sensible.** Reached `3.7353` by iteration 10 and did not move afterwards.

**`α = 0.8` — above the monotone limit.** Note what did and did not happen. The sign column reads
`-+-+-+-+-+`: the parameter error flips side on **every single step**, so this run genuinely
overshoots. And yet the cost column is `3.7446 → 3.7353 → 3.7353`, still decreasing. It converged, one
iteration later than `α = 0.3`.

**`α = 1.0` — exactly the divergence limit.** `|1 − 1.0 × 2| = 1`, so the error is reflected with no
shrinkage at all, and the iterate bounces between two points forever. The cost is **`257.2903` at
iterations 0, 10, 50 and 200** — identical to four decimals. A run that is not diverging and not
converging.

**`α = 1.2` — past the limit.** `|1 − 2.4| = 1.4`, so the error grows by 40% per step. Cost passed
`1e10` at **iteration 26**.

:::danger Overshooting is invisible in the cost curve on a well-conditioned problem

This is the trap in the standard "read the shape of your loss curve" advice. At `α = 0.8` the
parameters alternate on every step — textbook overshoot — and the cost curve is a clean monotone
decrease. It looks *identical* to the `α = 0.3` curve.

The reason is `κ = 1`: both eigen-directions contract by the same `|1 − 0.8 × 2| = 0.6`, so the cost,
which is a positively weighted sum of squared errors, is multiplied by `0.36` every step regardless of
sign. Zigzag only becomes visible in the cost when the directions contract at *different* rates — that
is, when the bowl is elongated.

So a monotone cost curve does not mean `α` is below the monotone limit. If you want to know, look at a
parameter's error sign, not the cost.

:::

---

## The divergence threshold is a computable number

The prediction is `2/λ_max = 1.0` exactly. Testing it is harder than it looks, and the reason is worth
understanding because it will bite you in real debugging.

An `α` a hair over the limit does not blow up dramatically — it grows the error by a tiny percentage each
step. `1.008× per step` sounds harmless, and for hundreds of iterations it looks exactly like a run that is
merely struggling with a hard problem. Only much later does compounding turn it into an explosion. That is
what **asymptotic** means here: the failure is certain but slow to become visible. So a test asking "did it
blow up within N steps?" is really measuring N, not the threshold. The test below instead asks "is the cost
higher at the end than in the middle?", and bisects on that, with 20,000 iterations per trial:

```text title="Output"
3. THE DIVERGENCE THRESHOLD   (bisection on an asymptotic criterion)
   predicted 2/lambda_max = 1.00000000   measured = 1.00000000   error = 3.3e-16
   alpha = 1.004 is only 0.4% too large. Cost at iteration:
     10: 3.011e+02   100: 1.252e+03   500: 7.322e+05   1000: 2.114e+09
   first exceeds its own starting cost at iteration 1, passes 1e10 at iteration 1098
```

**Predicted `1.00000000`, measured `1.00000000`, agreeing to `3.3e-16`** — machine precision. The
threshold is not approximately `2/λ_max`; it is `2/λ_max`.

The second half of that output is the practically important part. `α = 1.004` is **0.4% over** the
limit. It does not explode immediately: the cost sits at `3.011e+02` at iteration 10 and `1.252e+03` at
iteration 100 — the same order of magnitude as the starting `257.29`. It looks like a run that is
struggling, not one that is broken. It reaches `2.114e+09` by iteration 1000 and only passes `1e10` at
**iteration 1098**.

:::warning A first attempt at this measurement got the wrong answer, for an instructive reason

Bisecting on "did the cost exceed `1e10` within 1000 iterations" measured the threshold as
**`1.00439616`** and reported a 0.44% error against theory, which looks like a tolerable experimental
discrepancy. It isn't a discrepancy at all — at `α = 1.004` the growth factor per step is `1.008`, and
1000 iterations only multiply the error by about `e⁸ ≈ 3000`, leaving the cost just under the `1e10`
gate. The measurement was reporting **how long the run was given**, not where the threshold is.

Changing the criterion from "got big" to "is asymptotically increasing" moved the answer from
`1.00439616` to `1.00000000`. Any threshold measured with a time limit needs this check.

:::

The practical reading: **a diverging run is not always obvious from a short trace.** If the cost is
rising slowly and erratically over a few hundred iterations, treat `α` as too large rather than
assuming a hard problem. And note the `first exceeds its own starting cost at iteration 1` line — the
very first step already made things worse, which is a far earlier signal than the eventual explosion.

---

## One step, on a round bowl

When `κ = 1`, `α = 2/(λ_max + λ_min)` reduces to `1/λ` and the contraction factor becomes
`|1 − α·λ| = 0`. The error is annihilated, not shrunk:

```text title="Output"
4. ONE STEP   (alpha = 2/(lambda_max+lambda_min), round bowl)
   after 1 step: b = 14.81495320  w = 5.83713585
   OLS optimum:  b = 14.81495320  w = 5.83713585   difference 1.8e-15, 0.0e+00
```

**One iteration, and the parameters are the OLS solution to `1.8e-15`** — the `w` difference is exactly
zero. Gradient descent with a perfectly chosen `α` on a perfectly round bowl is not iterative at all;
it is the closed-form solution reached in a single multiply.

That is a boundary case rather than a technique — it needs `κ = 1`, which needs standardised,
uncorrelated features — but it makes the mechanism unmistakable: `α` is not "a small number for
safety". It is the factor that scales the gradient into a *displacement*, and `1/λ` is the value at
which that displacement is exactly right.

---

## A worked convergence trace

Everything above in one table, at `α = 0.3`, followed step by step:

```text title="Output"
5. WORKED TRACE   (alpha = 0.3)
    iter          w          b      dJ/dw      dJ/db            J    delta w
       0   0.000000   0.000000 -11.674272 -29.629906 257.29029809   3.502282
       1   3.502282   8.888972  -4.669709 -11.851963  44.30410373   1.400913
       2   4.903194  12.444561  -1.867883  -4.740785  10.22631263   0.560365
       3   5.463559  13.866796  -0.747153  -1.896314   4.77386606   0.224146
       4   5.687705  14.435690  -0.298861  -0.758526   3.90147460   0.089658
       5   5.777364  14.663248  -0.119545  -0.303410   3.76189197   0.035863
       6   5.813227  14.754271  -0.047818  -0.121364   3.73955875   0.014345
       7   5.827572  14.790680  -0.019127  -0.048546   3.73598543   0.005738
      10   5.836524  14.813400  -0.001224  -0.003107   3.73530759   0.000367
      20   5.837136  14.814953  -0.000000  -0.000000   3.73530480   0.000000
      50   5.837136  14.814953  -0.000000  -0.000000   3.73530480   0.000000
   standardised coefficients: w = 5.8371, b = 14.8150
   back on the original x scale: slope = 1.9844, intercept = 5.2104   (truth 2.0, 5.0)
```

Four things to follow across the rows.

**Both gradients are negative throughout.** `w` and `b` both start below their optima, so the
derivative of cost with respect to each is negative, and `−α·∇J` moves both upward. No parameter ever
needs the algorithm to know which direction it is on; the sign of the derivative carries it.

**`delta w` shrinks by exactly `0.4` per step.** `3.502282 → 1.400913 → 0.560365 → 0.224146` — each
`0.4` of the last. That is `|1 − α·λ| = |1 − 0.3 × 2| = 0.4`, the same predictor as on the
[previous page](./02-gradient-descent.md#the-braking-rate-is-predictable-in-advance), now visible in a
single column.

**The cost converges long before the parameters do.** By iteration 4, `J = 3.90147460` against a final
`3.73530480` — within 4.5%. But `delta w` is still `0.089658`, and `w` has another `0.15` to travel.
Cost is quadratic in the error, so the last stretch of parameter movement barely registers in `J`. Any
stopping rule based on "the cost has stopped changing" stops with the parameters still moving.

**The fitted numbers are `5.8371` and `14.8150`, not `2.0` and `5.0`.** The feature was standardised, so
these are the coefficients in standardised space. Undoing the transform gives `slope = 1.9844` and
`intercept = 5.2104` against the true `2.0` and `5.0` — recovered correctly, with the gap being noise
in 200 samples rather than optimiser error.

:::note This demo is deliberately constructed to be readable

`n = 200`, a standardised single feature and `α = 0.3` were chosen so every column changes by a clean
factor and the run finishes in a handful of rows. The next section removes the standardisation and the
tidiness goes with it.

:::

---

## Overshooting is not a failure mode — and the classical formula is not the answer

Everything so far ran on `κ = 1`, where the monotone limit and the classical optimum coincide at `0.5`
and there is nothing to choose between them. That coincidence is the *only* reason the well-conditioned
case looks simple. Two features on wildly different scales — one spanning `0..10`, the other `0..0.3` —
and the picture changes:

```text title="Output"
6. AN ILL-CONDITIONED BOWL   (two features on very different scales)
   eigenvalues of H = [1.5141e-02 5.0447e-01 7.2536e+01]   kappa = 4791
   1/lambda_max = 0.013786   2/(lam+lam) = 0.027567   2/lambda_max = 0.027573
        alpha  x 1/lam_max  iters to 1e-6   regime
     0.003447       0.2500          86755   monotone
     0.006893       0.5000          43377   monotone
     0.013786       1.0000          21688   monotone
     0.017233       1.2500          17350   oscillating
     0.020680       1.5000          14458   oscillating
     0.024126       1.7500          12392   oscillating
     0.026194       1.9000          11414   oscillating
     0.026883       1.9500          11121   oscillating
     0.027435       1.9900          10897   oscillating
     0.027504       1.9950          10870   oscillating
     0.027559       1.9990          11007   oscillating
     0.027571       1.9999          99672   oscillating
   fastest measured: 1.9950 x 1/lambda_max at 10870 iterations
   textbook optimum 2/(lam_max+lam_min) = 0.027567 (1.9996 x 1/lambda_max) took 23876 iterations  -> 2.20x SLOWER than the measured best
   sign(w1 − w1*) over 12 steps, fastest alpha:        -+-+-+-+-+-+
   sign(w1 − w1*) over 12 steps, 0.5/lambda_max:       --++++++++++
```

Two findings here, and the second was not expected.

**The fastest `α` is firmly in the "overshooting" regime.** Iterations fall monotonically as `α` rises
past the monotone limit: `21688` at exactly `1/λ_max`, down to `10870` at `1.9950 × 1/λ_max` — **twice
as fast as the largest non-overshooting setting.** The sign column confirms these are real overshoots:
`-+-+-+-+-+-+` at the fastest `α` against `--++++++++++` at half the monotone limit, which crosses once
and then approaches from one side.

So "overshooting" belongs in the diagnostic table as a *description*, not a fault. On any bowl that is
not round, the setting that converges fastest overshoots on every step. Advice to reduce `α` until the
parameters stop oscillating will systematically leave you about **2× slower than necessary**.

**The classical `α* = 2/(λ_max + λ_min)` was 2.20× slower than a slightly smaller `α`.** It took
**23876** iterations against **10870**. That is not a small discrepancy and it is worth understanding,
because the formula is not wrong — it is optimal for a different objective.

The plain version. A stretched bowl has a sharp direction and a shallow one, and a single `α` has to
serve both. The classical formula picks the `α` that makes **both directions finish at the same time** —
a sensible-sounding fairness rule. But fairness is the wrong goal here, because the two directions are
not worth the same. Cost is far more sensitive to error in the *sharp* direction than in the shallow one:
here, `4791×` more sensitive. So handicapping the sharp direction in order to help the shallow one buys a
tiny gain at a large price. The `α` that actually minimises cost fastest is the one that keeps the sharp
direction moving, and lets the shallow one lag.

The arithmetic behind it, for completeness: `α* = 2/(λ_max + λ_min)` balances the two extreme directions
so both shrink at the same rate. With `κ = 4791`, `α*` lands at `1.9996 × 1/λ_max`, which makes the
`λ_max` direction shrink by a factor of `|1 − 1.9996| = 0.0004` per step — that is, it barely moves the
error there at all. Cost, though, weights each direction by its own `λ`: an error along `λ_max = 72.5`
costs `4791×` more than the same error along `λ_min = 0.0151`. Deliberately stalling the stiffest
direction to help the flattest one is a bad trade when the objective is cost.

The last three rows show the resulting shape: `10870` at `1.9950`, `11007` at `1.9990`, then **`99672`
at `1.9999`** — a 9× penalty for moving `α` by 0.02%.

:::danger The optimum is a cliff on one side and a gentle slope on the other

`α` between `1.5×` and `1.99×` the monotone limit all landed within 33% of the best result. Push to
`1.9999×` and it costs **9×**. The cost of being too small is linear and forgiving; the cost of being
too large is a cliff, and just past it lies non-convergence.

Practical rule: aim for roughly `1.8 × 1/λ_max`, i.e. `0.9 × 2/λ_max`. It is close to the flat part of
the curve and safely off the edge. **Do not** try to sit exactly on `2/λ_max`, and do not trust
`2/(λ_max+λ_min)` when `κ` is large.

:::

---

## The diagnostic table

Every row below is a description of something measured above, with the threshold that produces it.

| Symptom in the trace | `α` relative to thresholds | Parameter error signs | What to do |
|---|---|---|---|
| Cost falls smoothly, still sloping after many iterations | `α ≪ 1/λ_max` | all one sign | **Increase** `α`; `0.001` needed >200 iterations for what `0.3` did in 10 |
| Cost falls fast, then flat | `α` near `1/λ_max` … `1.8/λ_max` | one sign, or alternating | Nothing — this is the target |
| Cost falls but parameters alternate every step | `1/λ_max < α < 2/λ_max` | strict `-+-+-+` | Nothing. Fastest setting measured was `1.9950/λ_max` |
| Cost zigzags visibly up and down | `α` near `2/λ_max`, `κ` large | strict `-+-+-+` | Reduce slightly; you are near the cliff |
| Cost exactly constant, never moves | `α = 2/λ_max` | strict `-+-+-+` | Reduce. Measured `257.2903` at iterations 0, 10, 50, 200 |
| Cost rises slowly and erratically | `α` barely above `2/λ_max` | strict `-+-+-+` | Reduce. `α = 1.004` needed **1098** iterations to pass `1e10` |
| Cost explodes to `inf` / `nan` | `α ≫ 2/λ_max` | — | Reduce hard. `α = 1.2` diverged at iteration **26** |
| Cost falls, but implausibly slowly at any `α` | `κ` is large | — | Not an `α` problem — **scale the features** |

The last row is the one people reach for last and should reach for first.

---

## Scaling moves the whole usable range

`α` is not a property of gradient descent. It is a property of the data's scale, and the same code
needs completely different values on the same numbers measured in different units:

```text title="Output"
7. SCALING MOVES THE WHOLE USABLE RANGE   (one feature, two versions)
   version           lambda_max   2/lambda_max  iters at 0.9x limit
   standardised          2.0000       1.000000                   54
   raw, x in 0..10      65.6303       0.030474                  695
   not scaling shrank the safe range for alpha by 32.8x
```

One feature, the same values, standardised versus left on its raw `0..10` range. `λ_max` went
`2.0000 → 65.6303`, so the ceiling on `α` fell **32.8×**, and iterations at each version's own best
setting went `54 → 695` — nearly **13× more work** for having skipped one transform.

That is a modest range. The [previous page's ravine ladder](./02-gradient-descent.md#the-bowl-is-usually-a-ravine)
pushed `κ` to `929437.6` and the run never finished at all.

:::tip This is the concrete reason to standardise before an iterative solver

[Feature scaling](../02-data-preprocessing/04-feature-scaling-and-transformation.md#which-models-actually-need-it)
is usually justified by appeals to fairness between features. The sharper argument is arithmetic:
standardising makes `λ_max` small and known, which makes `α` transferable between problems and puts
the safe ceiling near `1.0` instead of somewhere you have to discover.

It is also why a learning rate copied from someone else's code is meaningless without their
preprocessing. Their `α = 0.03` may have been `0.9 × 2/λ_max` on unscaled data.

:::

---

## Common Mistakes

| # | Mistake | Wrong | Right |
|---|---|---|---|
| 1 | Treating `α` as something only tuning can find | Try `0.1`, `0.01`, `0.001` | `2/λ_max` is the exact ceiling; measured to `3.3e-16` |
| 2 | Calling overshoot a failure | Reduce `α` until it stops | Fastest measured `α` was `1.9950/λ_max`, overshooting every step |
| 3 | Trusting `2/(λ_max+λ_min)` when `κ` is large | It is *the* optimal `α` | It measured **2.20× slower** than `1.9950/λ_max` |
| 4 | Reading overshoot off the cost curve | Zigzag cost ⇔ overshoot | At `κ = 1`, `α = 0.8` overshot with a perfectly monotone cost |
| 5 | Declaring an `α` safe because 500 iterations looked fine | No explosion ⇒ stable | `α = 1.004` needed **1098** iterations to pass `1e10` |
| 6 | Measuring a divergence threshold with a time limit | Cost `> 1e10` within 1000 steps | That gave `1.00439616`; the asymptotic test gave `1.00000000` |
| 7 | Pushing `α` as close to `2/λ_max` as possible | Bigger is faster | `1.9999/λ_max` cost **9×** more than `1.9950/λ_max` |
| 8 | Stopping when the cost stops changing | Cost flat ⇒ converged | At iteration 4, `J` was within 4.5% while `w` still had `0.15` to move |
| 9 | Copying `α` between projects | It is a number | It scales as `1/λ_max`; unscaled vs standardised differed **32.8×** |
| 10 | Tuning `α` when the real problem is conditioning | Search harder | At `κ = 4791` even the best `α` needed `10870` iterations |
| 11 | Reading standardised coefficients as the answer | `w = 5.8371` is the slope | Back-transformed it is `1.9844` against a true `2.0` |
| 12 | Assuming a constant cost means convergence | Nothing is changing, so it's done | At `α = 2/λ_max` the cost sat at `257.2903` forever, unconverged |

---

## Summary

| | |
|---|---|
| Monotone limit | `1 / λ_max` — above it, parameter errors alternate sign |
| Classical optimum | `2 / (λ_max + λ_min)` — optimal for *parameter* error, not cost |
| Divergence limit | `2 / λ_max` — exact, verified to `3.3e-16` |
| Practical choice | `≈ 0.9 × 2/λ_max`, i.e. `1.8 × 1/λ_max` |
| Compute it with | `np.linalg.eigvalsh((2/n) * X.T @ X).max()` |
| Free upper bound | `λ_max ≤ (2/n)·Σ‖xⱼ‖²` |
| Contraction per step | `max_i \|1 − α·λᵢ\|` |
| Overshoot test | Sign of `θ − θ*` per iteration, **not** the cost curve |
| Real fix for slowness | Scale the features; `α` follows |

**Key takeaways**

- The divergence threshold is **exactly `2/λ_max`** — predicted `1.00000000`, measured `1.00000000`,
  error `3.3e-16`. It is computed, not tuned
- At exactly `α = 2/λ_max` the run **neither converges nor diverges**: cost `257.2903` at iterations
  0, 10, 50 and 200
- `α = 1.2` (20% over) diverged at iteration **26**; `α = 1.004` (0.4% over) took **1098** iterations to
  pass `1e10` and looked merely slow until then
- A first attempt measured the threshold as **`1.00439616`** because the criterion was time-limited;
  switching to an asymptotic test moved it to **`1.00000000`**
- On a round bowl (`κ = 1.00`), `α = 2/(λ_max+λ_min) = 0.5` reached the OLS optimum in **one step**,
  to `1.8e-15`
- **Overshooting is not a failure mode.** On the ill-conditioned problem the fastest setting was
  `1.9950 × 1/λ_max` at **10870** iterations against **21688** for the largest non-overshooting `α` —
  exactly **2× faster** while flipping sign every step
- **The classical `α* = 2/(λ_max+λ_min)` was 2.20× slower** than the measured best: **23876** against
  **10870**. It optimises parameter-error contraction, while cost weights each direction by its own
  eigenvalue, so slowing the `λ_max = 72.5` direction to help the `λ_min = 0.0151` one is a bad trade
- The optimum is **asymmetric**: `1.5×` to `1.99×` the monotone limit all landed within 33% of best,
  but `1.9999×` cost **9×** (`99672` iterations)
- **Overshoot is invisible in the cost curve when `κ = 1`.** At `α = 0.8` the parameter error read
  `-+-+-+-+-+` while the cost fell monotonically `3.7446 → 3.7353`
- Step length shrank by exactly `|1 − α·λ| = 0.4` per iteration in the trace:
  `3.502282 → 1.400913 → 0.560365 → 0.224146`
- Cost converges before parameters do: at iteration 4, `J = 3.90147460` was within 4.5% of the final
  `3.73530480` while `w` still had `0.15` to travel
- `α` is a property of the **data's scale**. Standardising took `λ_max` from `65.6303` to `2.0000`,
  raised the ceiling **32.8×**, and cut iterations from **695 to 54**

**Next in this section:** [Batch, Stochastic and Mini-Batch](./04-batch-stochastic-mini-batch.md) —
how many rows each update is allowed to see, and whether the familiar ranking of the three survives a
stopwatch

**See also:** [Gradient Descent](./02-gradient-descent.md#the-braking-rate-is-predictable-in-advance)
for the `max|1 − α·λ|` contraction this page's thresholds come from ·
[Gradient Descent](./02-gradient-descent.md#the-bowl-is-usually-a-ravine) for the condition-number
ladder · [Feature Scaling and Transformation](../02-data-preprocessing/04-feature-scaling-and-transformation.md#standardisation-z-score-normalisation)
for the transform that makes `α` portable

---

## Run It Yourself

```python title="the_learning_rate.py"
"""The learning rate — four regimes, a computable divergence threshold, and a worked trace."""
import numpy as np
np.random.seed(42)

def cost(X, y, th):
    return np.mean((X @ th - y) ** 2)                    # J = (1/n)Σ(ŷ−y)²

def grad(X, y, th):
    return (2 / len(y)) * X.T @ (X @ th - y)             # ∇J = (2/n)Xᵀ(ŷ−y)

def run(X, y, alpha, iters):
    """Batch GD from zero. Returns (costs, blew_up_at or None)."""
    th, costs = np.zeros(X.shape[1]), []
    for i in range(iters):
        J = cost(X, y, th)
        costs.append(J)
        if not np.isfinite(J) or J > 1e10:
            return costs, i
        th = th - alpha * grad(X, y, th)
    return costs, None

def iters_to(X, y, alpha, floor, tol, cap):
    th = np.zeros(X.shape[1])
    for i in range(cap):
        J = cost(X, y, th)
        if not np.isfinite(J) or J > 1e10:
            return cap
        if J - floor < tol:
            return i
        th = th - alpha * grad(X, y, th)
    return cap

def err_signs(X, y, alpha, star, k, j=1):
    th, out = np.zeros(X.shape[1]), ""
    for _ in range(k):
        out += "+" if th[j] - star[j] > 0 else "-"
        th = th - alpha * grad(X, y, th)
    return out

# ---------- 1. every threshold comes from the Hessian ----------
n = 200
x = np.random.uniform(0, 10, n)
y = 2 * x + 5 + np.random.normal(0, 2.0, n)
X = np.c_[np.ones(n), (x - x.mean()) / x.std()]
lo_eig, hi_eig = np.linalg.eigvalsh((2 / n) * X.T @ X)
star = np.linalg.lstsq(X, y, rcond=None)[0]
floor = cost(X, y, star)
print("1. THE THRESHOLDS ARE COMPUTED, NOT GUESSED   (standardised feature, n = 200)")
print(f"   lambda_min = {lo_eig:.4f}   lambda_max = {hi_eig:.4f}   "
      f"kappa = {hi_eig / lo_eig:.2f}   J at optimum = {floor:.6f}")
print(f"   1/lambda_max = {1 / hi_eig:.6f} (monotone limit)   "
      f"2/(lam_max+lam_min) = {2 / (hi_eig + lo_eig):.6f} (fastest)   "
      f"2/lambda_max = {2 / hi_eig:.6f} (divergence)")

# ---------- 2. four regimes ----------
print("\n2. FOUR REGIMES   (same data, same start, only alpha differs)")
print(f"   {'alpha':>7}{'J(0)':>11}{'J(10)':>13}{'J(50)':>11}{'J(200)':>11}"
      f"   {'sign(w−w*)':<12} verdict")
for alpha in (0.001, 0.3, 0.8, 1.0, 1.2):
    costs, blew = run(X, y, alpha, 201)
    cells = [f"{costs[i]:.4f}" if i < len(costs) else "—" for i in (0, 10, 50, 200)]
    if blew is not None:
        verdict = f"diverged at {blew}"
    elif abs(costs[-1] - costs[0]) < 1e-9:
        verdict = "never moves"
    else:
        verdict = "crawling" if costs[-1] - floor > 1.0 else "converged"
    print(f"   {alpha:>7.3f}{cells[0]:>11}{cells[1]:>13}{cells[2]:>11}{cells[3]:>11}"
          f"   {err_signs(X, y, alpha, star, 10):<12} {verdict}")

# ---------- 3. the divergence threshold, and how slowly it fails ----------
print("\n3. THE DIVERGENCE THRESHOLD   (bisection on an asymptotic criterion)")
lo, hi = 0.98, 1.10
for _ in range(50):
    mid = (lo + hi) / 2
    c, blew = run(X, y, mid, 5000)
    if blew is not None or c[-1] > c[len(c) // 2]:
        hi = mid
    else:
        lo = mid
print(f"   predicted 2/lambda_max = {2 / hi_eig:.8f}   measured = {lo:.8f}   "
      f"error = {abs(2 / hi_eig - lo):.1e}")
c, blew = run(X, y, 1.004, 5000)
print(f"   alpha = 1.004 is only 0.4% too large. Cost at iteration:")
print("     " + "   ".join(f"{k}: {c[k]:.3e}" for k in (10, 100, 500, 1000) if k < len(c)))
print(f"   first exceeds its own starting cost at iteration "
      f"{next(k for k, v in enumerate(c) if v > c[0])}, "
      f"passes 1e10 at iteration {blew}")

# ---------- 4. on a round bowl the fastest alpha lands in one step ----------
print("\n4. ONE STEP   (alpha = 2/(lambda_max+lambda_min), round bowl)")
th1 = -0.5 * grad(X, y, np.zeros(2))
print(f"   after 1 step: b = {th1[0]:.8f}  w = {th1[1]:.8f}")
print(f"   OLS optimum:  b = {star[0]:.8f}  w = {star[1]:.8f}   "
      f"difference {abs(th1[0] - star[0]):.1e}, {abs(th1[1] - star[1]):.1e}")

# ---------- 5. a worked convergence trace ----------
print("\n5. WORKED TRACE   (alpha = 0.3)")
print(f"   {'iter':>5}{'w':>11}{'b':>11}{'dJ/dw':>11}{'dJ/db':>11}{'J':>13}{'delta w':>11}")
th = np.zeros(2)
for i in range(51):
    g = grad(X, y, th)
    if i in (0, 1, 2, 3, 4, 5, 6, 7, 10, 20, 50):
        print(f"   {i:>5}{th[1]:>11.6f}{th[0]:>11.6f}{g[1]:>11.6f}{g[0]:>11.6f}"
              f"{cost(X, y, th):>13.8f}{-0.3 * g[1]:>11.6f}")
    th = th - 0.3 * g
print(f"   standardised coefficients: w = {th[1]:.4f}, b = {th[0]:.4f}")
print(f"   back on the original x scale: slope = {th[1] / x.std():.4f}, "
      f"intercept = {th[0] - th[1] * x.mean() / x.std():.4f}   (truth 2.0, 5.0)")

# ---------- 6. an ill-conditioned bowl moves the optimum ----------
print("\n6. AN ILL-CONDITIONED BOWL   (two features on very different scales)")
np.random.seed(43)
x1, x2 = np.random.uniform(0, 10, n), np.random.uniform(0, 0.3, n)
Xi = np.c_[np.ones(n), x1, x2]
yi = 2 * x1 + 5 * x2 + 10 + np.random.normal(0, 2.0, n)
ei = np.linalg.eigvalsh((2 / n) * Xi.T @ Xi)
star_i = np.linalg.lstsq(Xi, yi, rcond=None)[0]
floor_i = cost(Xi, yi, star_i)
print(f"   eigenvalues of H = {np.array2string(ei, precision=4, floatmode='fixed')}"
      f"   kappa = {ei.max() / ei.min():.0f}")
print(f"   1/lambda_max = {1 / ei.max():.6f}   2/(lam+lam) = {2 / (ei.max() + ei.min()):.6f}"
      f"   2/lambda_max = {2 / ei.max():.6f}")
CAP, TOL = 100000, 1e-6
mults = [0.25, 0.5, 1.0, 1.25, 1.5, 1.75, 1.9, 1.95, 1.99, 1.995, 1.999, 1.9999]
print(f"   {'alpha':>10}{'x 1/lam_max':>13}{'iters to 1e-6':>15}   regime")
best_m, best_k = None, CAP + 1
for m in mults:
    k = iters_to(Xi, yi, m / ei.max(), floor_i, TOL, CAP)
    if k < best_k:
        best_m, best_k = m, k
    print(f"   {m / ei.max():>10.6f}{m:>13.4f}{(str(k) if k < CAP else '>' + str(CAP)):>15}"
          f"   {'oscillating' if m > 1 else 'monotone'}")
k_star = iters_to(Xi, yi, 2 / (ei.max() + ei.min()), floor_i, TOL, CAP)
print(f"   fastest measured: {best_m:.4f} x 1/lambda_max at {best_k} iterations")
print(f"   textbook optimum 2/(lam_max+lam_min) = {2 / (ei.max() + ei.min()):.6f} "
      f"({2 * ei.max() / (ei.max() + ei.min()):.4f} x 1/lambda_max) took {k_star} iterations"
      f"  -> {k_star / best_k:.2f}x SLOWER than the measured best")
best_a = best_m / ei.max()
print(f"   sign(w1 − w1*) over 12 steps, fastest alpha:        "
      f"{err_signs(Xi, yi, best_a, star_i, 12)}")
print(f"   sign(w1 − w1*) over 12 steps, 0.5/lambda_max:       "
      f"{err_signs(Xi, yi, 0.5 / ei.max(), star_i, 12)}")

# ---------- 7. scaling moves the whole usable range ----------
print("\n7. SCALING MOVES THE WHOLE USABLE RANGE   (one feature, two versions)")
print(f"   {'version':<16}{'lambda_max':>12}{'2/lambda_max':>15}{'iters at 0.9x limit':>21}")
for name, col in (("standardised", (x - x.mean()) / x.std()), ("raw, x in 0..10", x)):
    Xv = np.c_[np.ones(n), col]
    lmax = np.linalg.eigvalsh((2 / n) * Xv.T @ Xv).max()
    fl = cost(Xv, y, np.linalg.lstsq(Xv, y, rcond=None)[0])
    print(f"   {name:<16}{lmax:>12.4f}{2 / lmax:>15.6f}"
          f"{iters_to(Xv, y, 0.9 * 2 / lmax, fl, 1e-8, 200000):>21}")
lmax_raw = np.linalg.eigvalsh((2 / n) * np.c_[np.ones(n), x].T @ np.c_[np.ones(n), x]).max()
print(f"   not scaling shrank the safe range for alpha by {lmax_raw / hi_eig:.1f}x")
```

```text title="Output"
1. THE THRESHOLDS ARE COMPUTED, NOT GUESSED   (standardised feature, n = 200)
   lambda_min = 2.0000   lambda_max = 2.0000   kappa = 1.00   J at optimum = 3.735305
   1/lambda_max = 0.500000 (monotone limit)   2/(lam_max+lam_min) = 0.500000 (fastest)   2/lambda_max = 1.000000 (divergence)

2. FOUR REGIMES   (same data, same start, only alpha differs)
     alpha       J(0)        J(10)      J(50)     J(200)   sign(w−w*)   verdict
     0.001   257.2903     247.3385   211.2870   117.5737   ----------   crawling
     0.300   257.2903       3.7353     3.7353     3.7353   ----------   converged
     0.800   257.2903       3.7446     3.7353     3.7353   -+-+-+-+-+   converged
     1.000   257.2903     257.2903   257.2903   257.2903   -+-+-+-+-+   never moves
     1.200   257.2903  212148.7747          —          —   -+-+-+-+-+   diverged at 26

3. THE DIVERGENCE THRESHOLD   (bisection on an asymptotic criterion)
   predicted 2/lambda_max = 1.00000000   measured = 1.00000000   error = 3.3e-16
   alpha = 1.004 is only 0.4% too large. Cost at iteration:
     10: 3.011e+02   100: 1.252e+03   500: 7.322e+05   1000: 2.114e+09
   first exceeds its own starting cost at iteration 1, passes 1e10 at iteration 1098

4. ONE STEP   (alpha = 2/(lambda_max+lambda_min), round bowl)
   after 1 step: b = 14.81495320  w = 5.83713585
   OLS optimum:  b = 14.81495320  w = 5.83713585   difference 1.8e-15, 0.0e+00

5. WORKED TRACE   (alpha = 0.3)
    iter          w          b      dJ/dw      dJ/db            J    delta w
       0   0.000000   0.000000 -11.674272 -29.629906 257.29029809   3.502282
       1   3.502282   8.888972  -4.669709 -11.851963  44.30410373   1.400913
       2   4.903194  12.444561  -1.867883  -4.740785  10.22631263   0.560365
       3   5.463559  13.866796  -0.747153  -1.896314   4.77386606   0.224146
       4   5.687705  14.435690  -0.298861  -0.758526   3.90147460   0.089658
       5   5.777364  14.663248  -0.119545  -0.303410   3.76189197   0.035863
       6   5.813227  14.754271  -0.047818  -0.121364   3.73955875   0.014345
       7   5.827572  14.790680  -0.019127  -0.048546   3.73598543   0.005738
      10   5.836524  14.813400  -0.001224  -0.003107   3.73530759   0.000367
      20   5.837136  14.814953  -0.000000  -0.000000   3.73530480   0.000000
      50   5.837136  14.814953  -0.000000  -0.000000   3.73530480   0.000000
   standardised coefficients: w = 5.8371, b = 14.8150
   back on the original x scale: slope = 1.9844, intercept = 5.2104   (truth 2.0, 5.0)

6. AN ILL-CONDITIONED BOWL   (two features on very different scales)
   eigenvalues of H = [1.5141e-02 5.0447e-01 7.2536e+01]   kappa = 4791
   1/lambda_max = 0.013786   2/(lam+lam) = 0.027567   2/lambda_max = 0.027573
        alpha  x 1/lam_max  iters to 1e-6   regime
     0.003447       0.2500          86755   monotone
     0.006893       0.5000          43377   monotone
     0.013786       1.0000          21688   monotone
     0.017233       1.2500          17350   oscillating
     0.020680       1.5000          14458   oscillating
     0.024126       1.7500          12392   oscillating
     0.026194       1.9000          11414   oscillating
     0.026883       1.9500          11121   oscillating
     0.027435       1.9900          10897   oscillating
     0.027504       1.9950          10870   oscillating
     0.027559       1.9990          11007   oscillating
     0.027571       1.9999          99672   oscillating
   fastest measured: 1.9950 x 1/lambda_max at 10870 iterations
   textbook optimum 2/(lam_max+lam_min) = 0.027567 (1.9996 x 1/lambda_max) took 23876 iterations  -> 2.20x SLOWER than the measured best
   sign(w1 − w1*) over 12 steps, fastest alpha:        -+-+-+-+-+-+
   sign(w1 − w1*) over 12 steps, 0.5/lambda_max:       --++++++++++

7. SCALING MOVES THE WHOLE USABLE RANGE   (one feature, two versions)
   version           lambda_max   2/lambda_max  iters at 0.9x limit
   standardised          2.0000       1.000000                   54
   raw, x in 0..10      65.6303       0.030474                  695
   not scaling shrank the safe range for alpha by 32.8x
```

### What to notice in that output

- **`λ_min` and `λ_max` are both exactly `2.0000`**, which is why every threshold in section 1
  degenerates: the monotone limit and the classical optimum are both `0.5`. Section 6 exists because
  that degeneracy hides the interesting behaviour.
- **The `α = 0.8` row is the important one in section 2.** Its cost column is monotone and its sign
  column alternates. If you only had the cost curve you would conclude `α` was comfortably below the
  monotone limit. It is 1.6× above it.
- **`α = 1.0` gives a cost that is constant to four decimals across 200 iterations.** Not converged —
  the cost is `257.2903`, and the optimum is `3.735305`. A perfectly flat cost curve at a high value is
  the signature of sitting exactly on `2/λ_max`.
- **`first exceeds its own starting cost at iteration 1`.** The 0.4%-too-large run was detectably wrong
  after a *single step*, a thousand iterations before it looked wrong. Comparing `J(1)` against `J(0)`
  is a cheap and very early divergence check.
- **In the worked trace, `dJ/db` is always about 2.5× `dJ/dw`.** `b`'s gradient is `(2/n)Σr` while
  `w`'s is `(2/n)Σr·x_std`; with a standardised feature the second is a correlation-weighted sum and
  comes out smaller. Different parameters get different-sized gradients from the same `α`, which is the
  seed of the conditioning problem.
- **`delta w` at iteration 20 prints `0.000000` while `J` is still changing in the 6th decimal**
  (`3.73530759 → 3.73530480`). Six printed digits is not convergence; it is the limit of the format.
- **The `iters to 1e-6` column in section 6 is not monotone.** It falls to `10870` at `1.9950` and then
  rises to `11007` and `99672`. That non-monotonicity is the whole finding — there is an interior
  optimum, and it is not at either end.
- **`2/(lam+lam) = 0.027567` and `2/lambda_max = 0.027573` differ in the fifth decimal.** When `κ` is
  large, `λ_min` is negligible and the classical optimum sits essentially *on* the divergence limit —
  which is precisely why it performed badly here.
- **Section 7's raw version needed `695` iterations against `54`**, a 12.9× penalty, while the `α`
  ceiling moved by 32.8×. The two ratios differ because iterations depend on `κ`, not on `λ_max`
  alone.

**Things worth trying:**

1. In section 2, add `α = 0.5` — exactly `1/λ_max` on this problem. Predict the sign column before you
   run it, then check.
2. Change the `1e10` gate in `run` to `1e6` and re-run the section 3 bisection. Watch the measured
   threshold move away from `1.0` — reproducing the original mistake on purpose.
3. In section 6, change `x2` from `uniform(0, 0.3)` to `uniform(0, 10)`. `κ` collapses, and the gap
   between the measured best `α` and `2/(λ_max+λ_min)` should close.
4. In section 6, change `TOL` from `1e-6` to `1e-3`. The optimum should shift *towards* larger `α`,
   because a loose tolerance rewards fast early progress and never feels the slow direction.
5. Add a fourth feature to section 6 on yet another scale and watch `κ` and the best `α` move together.
6. In section 7, replace the raw `0..10` feature with `0..10000`. Predict `λ_max` first — it scales as
   the square of the feature's magnitude.
7. Replace the fixed `α` in section 5 with `α_t = 0.9 × 2/λ_max` for the first 5 iterations and `0.3`
   afterwards, and see whether the hybrid beats either constant.

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

### The three thresholds

**T1. [THEORY]** Derive `α < 2/λ_max` from the requirement `|1 − α·λᵢ| < 1` for every eigenvalue.

**T2. [THEORY]** What does `α = 1/λ_max` separate, and what is the observable difference either side
of it?

**T3. [OUT]** On the well-conditioned problem, `1/λ_max` and `2/(λ_max+λ_min)` were both `0.500000`.
Why must they coincide when `κ = 1`?

**T4. [PROG]** Write a function that takes `X` and returns the divergence limit for gradient descent on
squared error, then verify it empirically by bisection.

**T5. [ANALYZE]** `λ_max ≤ trace(H)` gives a free upper bound. When would you use the bound instead of
the true eigenvalue, and what does it cost you?

### The four regimes

**R1. [OUT]** Match each of `0.001`, `0.3`, `0.8`, `1.0`, `1.2` to its regime, and give the signature
you used.

**R2. [OUT]** At `α = 0.8` the sign column read `-+-+-+-+-+` while the cost fell monotonically. Explain
how both can be true.

**R3. [ANALYZE]** A colleague says "my loss curve is smooth and decreasing, so my learning rate is
fine". Using the `α = 0.8` row, say what they have and have not established.

**R4. [OUT]** At `α = 1.0` the cost was `257.2903` at iterations 0, 10, 50 and 200, while the optimum
is `3.735305`. Diagnose it precisely.

**R5. [THEORY]** Why does the cost at `κ = 1` fall monotonically even when the parameters overshoot?

**R6. [PROG]** Add `α = 0.5` and `α = 0.99` to the regimes table and predict both sign columns first.

### Divergence

**D1. [OUT]** Predicted `1.00000000`, measured `1.00000000`, error `3.3e-16`. What is the significance
of an error at machine precision rather than at a few percent?

**D2. [ANALYZE]** The first measurement returned `1.00439616`. Diagnose the flaw in that experiment and
say what the number was actually measuring.

**D3. [OUT]** `α = 1.004` reached `1.252e+03` at iteration 100 and only passed `1e10` at iteration
1098. What practical warning follows?

**D4. [THEORY]** Why is divergence asymptotic rather than immediate for an `α` just above the limit?

**D5. [PROG]** Write the cheapest divergence check you can that uses only `J(0)` and `J(1)`, and say
when it would fail to fire.

### Which `α` is fastest

**F1. [OUT]** On the ill-conditioned problem, `1/λ_max` needed `21688` iterations and
`1.9950/λ_max` needed `10870`. What does that do to the advice "reduce `α` until oscillation stops"?

**F2. [OUT]** `2/(λ_max+λ_min)` took `23876` iterations against `10870` for a slightly smaller `α`.
Explain why the classical formula lost, referring to how cost weights each eigen-direction.

**F3. [OUT]** Iterations went `10870 → 11007 → 99672` as `α` went `1.9950 → 1.9990 → 1.9999` times the
monotone limit. What shape is this curve, and what does its asymmetry imply for how to pick `α`?

**F4. [THEORY]** State what `α* = 2/(λ_max+λ_min)` actually optimises, and why that is not the same as
minimising iterations-to-cost-tolerance.

**F5. [ANALYZE]** Given the numbers on this page, justify `0.9 × 2/λ_max` as a default. What are you
giving up?

**F6. [PROG]** Reproduce the section 6 sweep with `TOL = 1e-3` and report whether the optimum moves.

### The trace, and scaling

**W1. [OUT]** In the trace, `delta w` went `3.502282 → 1.400913 → 0.560365`. Compute the ratio and
predict it from `α` and `λ`.

**W2. [OUT]** At iteration 4, `J = 3.90147460` against a final `3.73530480`, but `w` still had `0.15`
to travel. What does that say about cost-based stopping rules?

**W3. [OUT]** Both gradients are negative on every printed row. What does that tell you about where the
starting point sits relative to the optimum?

**W4. [OUT]** The trace converged to `w = 5.8371`, `b = 14.8150`, and the truth is `2.0` and `5.0`.
Reconcile them.

**W5. [OUT]** `λ_max` went `2.0000 → 65.6303` and iterations `54 → 695`. Why is the iteration ratio
(12.9×) not the same as the `α`-ceiling ratio (32.8×)?

**W6. [ANALYZE]** Someone shares `α = 0.03` that "works well". What must you know before using it, and
what could `0.03` mean on differently scaled data?

**W7. [ANALYZE]** A run's cost decreases but far too slowly. Order your checks — `α`, conditioning,
data — and justify the order using this page's numbers.

### Quick self-check

1. What is the exact divergence limit for `α`?
2. What separates the monotone regime from the oscillating one?
3. How do you compute `λ_max` from `X`?
4. What happens at exactly `α = 2/λ_max`?
5. How many iterations did `α = 1.2` survive?
6. How many did `α = 1.004` survive?
7. Why can a slightly-too-large `α` look fine for a thousand steps?
8. Can you see overshoot in a cost curve when `κ = 1`?
9. What *does* reveal overshoot?
10. Was the fastest measured `α` in the monotone or the oscillating regime?
11. How much slower was `2/(λ_max+λ_min)` than the measured best?
12. What does `2/(λ_max+λ_min)` actually optimise?
13. Is the cost of too-large `α` symmetric with too-small?
14. What did `α = 2/(λ_max+λ_min)` achieve in one step on the round bowl?
15. By how much did the step length shrink per iteration at `α = 0.3`?
16. What did standardising do to `λ_max` and to the iteration count?
17. Is a learning rate transferable between datasets?
