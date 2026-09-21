---
sidebar_position: 2
title: Gradient Descent
description: Walking downhill in fog, made precise — why two different plots both get called the gradient descent curve, why the algorithm slows near the bottom with nothing in the loop programming a brake, why flipping one minus sign sends the cost to 6.33e+07, and why the neat round bowl in every textbook is the one case that never happens in practice.
tags: [machine-learning, optimisation, numpy]
toc_max_heading_level: 3
---

# Gradient Descent

> **Topic —** The previous page argued that a loss is a choice and that most choices have no closed
> form. This page is the method you use when there isn't one. It is four lines of arithmetic, and
> almost every confusion about it comes from three places: two completely different plots share the
> name "the gradient descent curve", the halting behaviour near the minimum looks like something
> someone programmed, and the bowl everyone draws is round only because the drawing is a special case.

---

## In plain words

You are somewhere on a hillside in fog. You cannot see the valley floor, but you can feel which way the
ground slopes. So you take a step downhill, feel again, step again. Keep going and you end up at the
bottom. That is gradient descent, complete — there is nothing else to it.

Every symbol on this page is one of those four things:

| In the fog | In the algorithm |
|---|---|
| Where you are standing | The current parameter values `θ` — the model's slope and intercept |
| How high up you are | The cost `J(θ)` — how badly the model currently fits |
| The slope under your boots | The gradient `∇J(θ)` — which way the cost increases, and how fast |
| How big a step you take | The learning rate `α` |

And the four things this page settles, each of which trips people up:

1. **Downhill needs a minus sign.** The gradient points *uphill* by definition. Flip that one sign and
   you climb instead of descend — the run destroys the model rather than fitting it.
2. **"The gradient descent curve" is two different pictures.** One shows the cost dropping over time
   (*is it working?*). The other shows the fitted line swinging into place (*what has it learned?*).
   People routinely show one while answering a question about the other.
3. **It slows down near the bottom for free.** Nobody programs a brake. Near the valley floor the ground
   is nearly level, so the slope you feel is tiny, so your step is tiny. The step size is always the
   learning rate times the steepness — the steepness does the shrinking.
4. **The valley usually isn't a round bowl.** Every textbook draws a neat circular bowl. Real ones are
   long narrow ravines, and in a ravine the downhill direction points mostly at the *side wall* rather
   than along the floor, so you zigzag and progress collapses. This is the single biggest reason a
   gradient-descent run is slow, and the fix is not the learning rate — it is scaling your features.

The rest of the page measures all four, and then names the mathematical objects behind point 4, because
those names (Hessian, eigenvalue, condition number) are how everyone else talks about it.

### Words used on this page

| Term | Say it as | What it means here |
|---|---|---|
| **Gradient** `∇J` | "the uphill direction" | One derivative per parameter, packed into a vector. Its length says how steep |
| **Convex** | "shaped like a bowl, no side pockets" | Wherever you start, walking downhill reaches *the* bottom. No separate dips to get trapped in |
| **Hessian** `H` | "the curvature table" | Second derivatives — how fast the slope itself changes. For squared error it is a fixed matrix, `(2/n)XᵀX`, the same everywhere |
| **Eigenvalue** `λ` | "the steepness of one particular direction" | The bowl has a steepest direction and a shallowest one. `λ_max` and `λ_min` are how sharply it curves along each |
| **Condition number** `κ` | "how squashed the bowl is" | `λ_max / λ_min`. `κ = 1` is a perfect circular bowl; `κ = 900000` is a canyon |
| **Contraction** | "the fraction of the error left after one step" | `0.8` means each step removes 20% of what remained. Small is fast |
| **OLS** | "the exact answer, by formula" | The closed-form least-squares solution, used here as the known target to check against |

:::tip If you only take one thing from this page

`κ`, the condition number, is the number that decides whether gradient descent takes 40 steps or never
finishes. It is set by your *data*, not by your optimiser — and standardising your features is what
brings it down. When a run is mysteriously slow, check `κ` before you touch the learning rate.

:::

---

## The whole algorithm

Pick a starting point, measure the slope, step against it, repeat.

```
θ ← θ − α·∇J(θ)
```

| Symbol | Name | What it is |
|---|---|---|
| `θ` | parameters | Everything being fitted — here `(b, w)` |
| `J(θ)` | cost | The [loss](./01-loss-functions.md#the-loss-is-the-specification-not-a-detail) summed over the data |
| `∇J(θ)` | gradient | The vector of partial derivatives, one per parameter |
| `α` | learning rate | How far to move per step |

For squared error on a linear model, both pieces are one line each:

```
J(θ)  = (1/n) · Σ(Xθ − y)²
∇J(θ) = (2/n) · Xᵀ(Xθ − y)
```

That `2` is not decoration — it comes from differentiating the square. And it is the source of the
single most common cross-referencing error in the whole subject.

### The `1/2` convention, and why `α` is not portable

Many sources define the cost with a `1/2` in front, `J = (1/2n)·Σ(Xθ − y)²`, precisely so that the
`2` cancels and the gradient is the tidier `(1/n)·Xᵀ(Xθ − y)`. That is a legitimate choice and it
changes nothing about where the minimum is. What it *does* change is every gradient's magnitude —
they are all exactly **half**.

Why you should care: your step size is the learning rate **times the gradient**. Halve every gradient and
every step halves too, which is indistinguishable from having halved the learning rate. So the same
`α = 0.1` means two different step sizes in two textbooks, and one of them will be twice the size you
expected.

Three runs on the same data from the same start make the consequence concrete:

```text title="Output"
2. THE 1/2 CONVENTION   (same problem, three runs)
    iter   J=(1/n) a=0.1   J=(1/2n) a=0.1   J=(1/2n) a=0.2  col1/col3
       0     29.46681475      14.73340738      14.73340738 2.00000000
       1     18.92536852      11.95163684       9.46268426 2.00000000
       2     12.17884294       9.69840271       6.08942147 2.00000000
       3      7.86106656       7.87328306       3.93053328 2.00000000
       4      5.09768968       6.39493615       2.54884484 2.00000000
```

The last column is **`2.00000000` on every row**. The `1/2n` cost at `α = 0.2` is tracing the *same
parameter path* as the `1/n` cost at `α = 0.1`, and its cost is exactly half only because the cost
function itself is halved. Meanwhile the middle column — the `1/2n` cost at the *same* `α = 0.1` —
is a genuinely different, slower run: by iteration 3 it is at `7.87` where the others have effectively
reached `7.86` and `3.93`.

:::danger `α = 0.1` in one source is not `α = 0.1` in another

Halving the cost is arithmetically identical to halving the learning rate. So a learning rate copied
from a source that uses the `1/2` convention into code that doesn't will be **twice as large as
intended** — which, as the [next page](./03-the-learning-rate.md#the-divergence-threshold-is-a-computable-number)
shows, is exactly the size of mistake that turns a working setting into a diverging one.

Before reusing anyone's `α`, check whether their cost has the `1/2`. These notes use `J = (1/n)Σ(·)²`
throughout, matching the [MSE definition](../03-linear-regression/01-simple-linear-regression.md#how-wrong-is-it-the-five-error-measures)
used for the error measures.

:::

---

## Two curves, one run

"The gradient descent curve" refers to two different pictures, and people talk past each other
constantly because of it. One run produces both:

```text title="Output"
1. TWO CURVES FROM ONE RUN   (cost vs iteration, and the line in data space)
   n = 50, feature standardised -> kappa = 1.00
    iter         b         w          J      ‖∇J‖     ŷ(−2)      ŷ(0)     ŷ(+2)
       0   0.00000   0.00000   29.46681  10.82253   0.00000   0.00000   0.00000
       1   1.00178   0.40953   18.92537   8.65802   0.18272   1.00178   1.82083
       2   1.80320   0.73715   12.17884   6.92642   0.32890   1.80320   3.27750
       3   2.44434   0.99925    7.86107   5.54114   0.44585   2.44434   4.44283
       5   3.36758   1.37667    3.32913   3.54633   0.61424   3.36758   6.12091
      10   4.47106   1.82777    0.52262   1.16206   0.81552   4.47106   8.12661
      20   4.95114   2.02403    0.18891   0.12478   0.90309   4.95114   8.99920
      50   5.00882   2.04761    0.18502   0.00015   0.91361   5.00882   9.10403
     100   5.00889   2.04764    0.18502   0.00000   0.91362   5.00889   9.10416
     OLS   5.00889   2.04764    0.18502   0.00000   0.91362   5.00889   9.10416
```

| | **The cost curve** | **The fitted-line curve** |
|---|---|---|
| Read from | The `J` column | The three `ŷ` columns |
| x-axis | Iteration number | The feature `x` |
| y-axis | Cost | Predicted `y` |
| One plot shows | The whole run | **One** iteration |
| Shape | Falls, flattens | A line that pivots and rises into place |
| Says | *Is it working?* | *What has it learned?* |

The cost column falls `29.46681 → 0.18502` and then stops moving. The `ŷ` columns do something
different: they *travel*, each to its own destination — `ŷ(−2)` climbs from `0` to `0.91362`,
`ŷ(+2)` from `0` to `9.10416`. Both destinations are the OLS row, printed last: **identical to five
decimal places**. Gradient descent found the exact answer the
[normal equation](../03-linear-regression/03-the-matrix-formulation.md#the-normal-equation) gives in
one algebraic step.

:::tip Which plot you want depends on the question

Debugging the optimiser — diverging, crawling, oscillating — is a **cost curve** question, and the
next page is entirely about reading them. Explaining the model to somebody is a **fitted-line**
question. Presenting one and answering the other is the commonest way these discussions go wrong.

:::

The `‖∇J‖` column is worth a glance now because it does the work of two later sections: it collapses
from `10.82253` to `0.00000`, and it is the *only* quantity in the loop that changes the step size.

---

## Why the surface is a bowl

Everyone draws gradient descent as a ball rolling into a bowl. The picture is doing real work — it is
why the algorithm cannot get stuck part-way — so it deserves a check rather than an assertion.

The reason it matters: if the landscape really is a single bowl, then "keep walking downhill" is
guaranteed to reach the one true bottom, wherever you started. If instead it has side pockets, walking
downhill can drop you into a dip that is *lower than its surroundings but not the lowest place around* —
and you will never know, because from inside the dip every direction is uphill. Bowl-shaped landscapes
are called **convex**, and the guarantee is exactly what makes linear regression by gradient descent
trustworthy.

Here is how to check it without any calculus. Pick two spots on the surface and stretch a straight
string between them. If the surface always sags *below* the string, it is a bowl. If any part of the
surface pokes *above* the string, there is a bump, and bumps mean pockets. Testing the midpoint of the
string is enough to catch this most of the time, so: sample two random parameter vectors, evaluate the
cost at each and at their midpoint, and see whether

```
J(midpoint)  ≤  ( J(a) + J(b) ) / 2
```

Two thousand random pairs, and the same test on a deliberately non-convex loss for contrast:

```text title="Output"
3. CONVEXITY   (midpoint chord test, 2000 random parameter pairs)
   MSE                     0 violations of  J(mid) <= mean(J(a), J(b))
   MSE of sigmoid(Xθ)    957 violations of  J(mid) <= mean(J(a), J(b))
   Hessian (2/n)XᵀX eigenvalues = [2. 2.]   both > 0 -> a bowl
```

**Zero violations out of 2000** for squared error on a linear model. **957 out of 2000** — 48% — once
the same squared error is applied to `sigmoid(Xθ)` instead. Convexity is a property of the
loss-and-model pair, not of optimisation in general, and the contrast is what makes that concrete.

### One parameter, two parameters, and the algebraic reason

With one parameter the cost is a parabola in that parameter — `J(w) = (1/n)Σ(w·xᵢ − yᵢ)²` expands to
`Aw² + Bw + C` with `A = (1/n)Σxᵢ² > 0`. A parabola opening upward. With two parameters it is a
paraboloid: a bowl in three dimensions, with contours that are ellipses.

The general statement uses the **Hessian**. If the gradient tells you the *slope*, the Hessian tells you
the *curvature* — how fast that slope is changing. For squared error it is one fixed matrix, identical at
every point on the surface, which is exactly why the surface is a plain bowl and not something lumpier:

```
H = (2/n) · Xᵀ X
```

Two facts do all the work, and neither needs the derivation.

**A bowl curves upward in every direction.** The Hessian's **eigenvalues** are the curvature measured
along each of the surface's own natural directions. All positive means it curves upward everywhere, so
it is a bowl. One of them zero means there is a direction that is perfectly level — a trough with a flat
floor, so infinitely many equally good answers, which is the same defect that makes the
[normal equation fail on a constant column](../03-linear-regression/03-the-matrix-formulation.md#3-a-constant-column).
A negative one would mean a saddle, and squared error never produces one.

**`XᵀX` can never have a negative eigenvalue.** Whatever `X` is — any data at all, clean or filthy — this
particular product is guaranteed to curve upward or be flat, never downward. (The formal name is
*positive semi-definite*.) That one guarantee is what makes squared error on a linear model convex for
every dataset, with no assumptions to check.

Here the eigenvalues are `[2, 2]`: equal curvature in both directions, so the bowl is perfectly round
and its contours are circles rather than stretched ellipses.

:::warning A round bowl is a special case, not the general picture

`κ = 1.00` here is not a fact about gradient descent — it is what
[standardising](../02-data-preprocessing/04-feature-scaling-and-transformation.md#standardisation-z-score-normalisation)
the single feature did. With mean `0` and standard deviation `1`, `(1/n)XᵀX` is exactly the identity,
so `H = 2·I`.

Textbook illustrations use this case because it draws nicely. Real cost surfaces are elongated, and
the [last section of this page](#the-bowl-is-usually-a-ravine) measures how much that costs.

:::

:::note The chord test is evidence, not proof

2000 samples finding no violation does not prove convexity — it fails to disprove it. The proof is
the positive semi-definite Hessian. The test earns its place by being the thing that *catches*
non-convexity: 957 violations is not a subtle signal, and running it on a loss you are unsure about
is a cheap sanity check.

:::

---

## The minus sign is the whole algorithm

`∇J` points in the direction of **steepest increase**. So `−∇J` points downhill, and the minus sign in
the update is not notation to be skimmed — it is the entire difference between fitting a model and
destroying one. Same data, same start, same `α`, one sign flipped:

```text title="Output"
4. THE MINUS SIGN   (identical init, identical alpha, opposite direction)
    iter     descent  −α∇J      ascent  +α∇J
       0       29.46681475      2.946681e+01
       5        3.32912848      1.814902e+02
      10        0.52261578      1.122779e+03
      20        0.18891189      4.303773e+04
      40        0.18502019      6.325537e+07
```

Descent lands on `0.18502019`. Ascent reaches **`6.33e+07`** at iteration 40 and is still
accelerating — a factor of over **340 million** between two runs whose code differs by one character.

The asymmetry is worth naming. Descent has a floor: the cost cannot go below the minimum, so the run
converges. Ascent has no ceiling — the paraboloid opens upward forever — so it accelerates without
limit. This is the same runaway the next page produces from an `α` that is merely
[too large](./03-the-learning-rate.md#four-regimes-and-what-each-looks-like), and it is why an
exploding cost is the easiest of all optimiser failures to spot.

---

## The braking is free

The most-asked question about gradient descent: with `α` fixed, what stops the algorithm shooting
past the minimum and bouncing around forever? People expect the answer to be a schedule that shrinks
`α`. It isn't. Nothing in the loop shrinks anything.

```text title="Output"
5. THE BRAKING IS FREE   (nothing in the loop shrinks the step)
    iter        ‖Δθ‖        ‖∇J‖   ‖Δθ‖/‖∇J‖   shrink
       1    1.082253   10.822531       0.100        —
       2    0.865802    8.658025       0.100   0.8000
       3    0.692642    6.926420       0.100   0.8000
       4    0.554114    5.541136       0.100   0.8000
       5    0.443291    4.432909       0.100   0.8000
       6    0.354633    3.546327       0.100   0.8000
       7    0.283706    2.837062       0.100   0.8000
       8    0.226965    2.269649       0.100   0.8000
       9    0.181572    1.815719       0.100   0.8000
      10    0.145258    1.452576       0.100   0.8000
   predicted contraction  max|1 − α·λ| = 0.8000
   distance travelled: first 5 iters 3.638102, last 5 of 100 2.262e-09, ratio 1.609e+09
```

Read the third column first. `‖Δθ‖ / ‖∇J‖` is **`0.100` on every row**, exactly `α`, because that is
what the update rule says: `Δθ = −α∇J`. The step length is `α` times the gradient length, always, with
no exceptions and no bookkeeping.

So the step shrinks for one reason: **the gradient shrinks**. Approaching the minimum, the surface
flattens, `‖∇J‖` falls, and the step falls in exact proportion. The algorithm brakes because the road
levels out, not because it is watching a speedometer.

### The braking rate is predictable in advance

The `shrink` column is `0.8000` every single iteration — the same fraction removed every time. That
number is not an accident, and you can work it out before running anything.

**The plain version.** Call the distance still left to travel your *remaining error*. Each step removes a
fixed *percentage* of it — not a fixed amount. Here it removes 20%, leaving `0.8` of what was there
before, every single step. That is why the run gets close quickly and then crawls: 20% of a large gap is
a big move, 20% of a tiny gap is a tiny move.

Where does the `0.8` come from? A step multiplies your remaining error by `(1 − α·λ)`: the learning rate
times the curvature, subtracted from one. With `α = 0.1` and curvature `λ = 2`, that is
`1 − 0.1 × 2 = 0.8`. Larger `α` or steeper curvature means more of the error removed per step — up to a
point, which is the whole subject of the [next page](./03-the-learning-rate.md).

**In symbols**, writing `θ*` for the optimum so `θₜ − θ*` is the remaining error:

```
θₜ₊₁ − θ*  =  (I − αH)(θₜ − θ*)
```

Each of the bowl's natural directions has its own curvature `λᵢ`, so each shrinks by its own factor
`(1 − α·λᵢ)`. The overall rate is set by whichever direction shrinks *least* — the slowest one is what
you end up waiting for:

```
contraction  =  max_i |1 − α·λᵢ|
```

Here both eigenvalues are `2`, so both directions shrink at `0.8` and there is no slow one.
**Predicted `0.8000`, measured `0.8000`** — identical to four decimals, which is as many as were
printed.

The cumulative effect is stark: the first five iterations cover a parameter-space distance of
**`3.638102`**, the last five of a hundred cover **`2.262e-09`**. A ratio of **`1.609e+09`** with `α`
held constant the entire time.

:::tip Convergence is geometric, so cost per extra digit is constant

A contraction of `0.8` per step means roughly `log(10)/log(1/0.8) ≈ 10` iterations per decimal digit
of accuracy, forever. This is why gradient descent gets *close* fast and *exact* slowly, and why a
sensible stopping rule watches `‖∇J‖` or the change in `J` rather than counting iterations.

:::

---

## The bowl is usually a ravine

Everything above ran on a round bowl, and round bowls are produced by standardised features rather than
by nature.

Picture the difference. In a **round** bowl, downhill from anywhere points straight at the bottom, so you
walk more or less directly there. Now squash that bowl sideways into a long narrow **ravine**. Standing
on one wall, the steepest direction is straight across at the opposite wall — barely at all along the
valley floor towards the exit. So you cross, overshoot, cross back, and inch forward a little each time.
The distance to the exit hasn't changed; the number of steps has exploded.

The measurement below squashes the bowl deliberately: take two standardised features, multiply one of
them by a growing factor, give each version the largest `α` it can tolerate, and count iterations to the
same tolerance.

```text title="Output"
6. THE BOWL IS USUALLY A RAVINE   (feature 2 rescaled, own largest stable alpha)
     scale        kappa   2/lambda_max    iters   status
   x     1          1.6   8.199661e-01       40   converged
   x    10         92.9   1.265469e-02      413   converged
   x   100       9294.4   1.265541e-04    41674   converged
   x  1000     929437.6   1.265541e-06   200000   cap reached
```

The `kappa` column is the **condition number** `λ_max / λ_min` — how elongated the bowl is. At `κ = 1`
the contours are circles and `−∇J` points straight at the minimum. As `κ` grows the contours stretch
into a narrow valley, the gradient points mostly *across* the valley rather than along it, and
progress collapses.

Read the two columns together. From `κ = 92.9` to `κ = 9294.4` — a factor of **100** — iterations went
`413 → 41674`, a factor of **100.9**. **Iterations scale essentially linearly with the condition
number.** And at `κ = 929437.6` the run did not finish at all: 200,000 iterations and still short of
tolerance, reported as `cap reached` rather than dressed up as a result.

Notice also what happened to `2/lambda_max`, the largest usable learning rate: `0.82` down to
`1.27e-06`. Rescaling one column by 1000 shrank the whole safe range for `α` by roughly a million.

:::danger An unscaled feature can make gradient descent unusable, not just slow

This is a far sharper consequence of feature scaling than the accuracy differences measured in
[which models actually need it](../02-data-preprocessing/04-feature-scaling-and-transformation.md#which-models-actually-need-it).
There, skipping scaling cost some points of performance. Here it is the difference between
**40 iterations and never finishing**, and neither the code nor the data looks wrong while it happens
— the cost just descends implausibly slowly.

The [normal equation](../03-linear-regression/03-the-matrix-formulation.md#the-normal-equation) is
completely immune to this: `κ` does not appear in it. Scaling matters for the *iterative* solver, and
that is the trade you accept in exchange for `O(np)` steps.

:::

---

## Common Mistakes

| # | Mistake | Wrong | Right |
|---|---|---|---|
| 1 | Saying "the gradient descent curve" | One plot | **Two** — cost vs iteration, and the line in data space |
| 2 | Copying `α` between sources | A learning rate is a number | The `1/2` convention halves every gradient; `col1/col3 = 2.00000000` |
| 3 | Thinking `α` must decay to converge | Needs a schedule | `‖Δθ‖/‖∇J‖ = 0.100` always; the *gradient* shrinks |
| 4 | Expecting the algorithm to overshoot and bounce forever | Fixed step, fixed overshoot | Step contracted by `0.8000` per iteration, predicted exactly |
| 5 | Treating convexity as automatic | Cost surfaces are bowls | `957/2000` chord violations for MSE on a sigmoid |
| 6 | Believing the chord test proves convexity | 0 violations ⇒ convex | It fails to disprove it; the proof is `XᵀX ⪰ 0` |
| 7 | Generalising from the round bowl | Contours are circles | `κ = 1.00` came from standardising; real `κ` reached `929437.6` |
| 8 | Flipping the sign to "maximise the fit" | Ascent improves things | Ascent hit `6.33e+07` from an identical start |
| 9 | Assuming gradient descent only approximates | Iterative ⇒ inexact | It matched the OLS optimum to all five printed decimals |
| 10 | Blaming a slow run on `α` alone | Tune the learning rate | Check `κ` first — at `929437.6` no `α` rescues it |
| 11 | Stopping after a fixed iteration count | 1000 steps is enough | Geometric decay ⇒ watch `‖∇J‖`; ~10 steps per decimal digit here |
| 12 | Forgetting the intercept column in `H` | `H = (2/n)XᵀX` on features only | The column of ones is part of `X`, so part of `H` |

---

## Summary

| | |
|---|---|
| Update | `θ ← θ − α·∇J(θ)` |
| Cost (these notes) | `J = (1/n)·Σ(Xθ − y)²` |
| Gradient | `∇J = (2/n)·Xᵀ(Xθ − y)` |
| Hessian | `H = (2/n)·XᵀX`, positive semi-definite always |
| Convex because | Every eigenvalue of a Gram matrix is `≥ 0` |
| Step length | `‖Δθ‖ = α·‖∇J‖` — exactly, every iteration |
| Contraction per step | `max_i \|1 − α·λᵢ\|` |
| Elongation | `κ = λ_max / λ_min`; iterations grow linearly in `κ` |
| Two curves | Cost vs iteration; fitted line in data space |

**Key takeaways**

- Gradient descent is one line, `θ ← θ − α·∇J(θ)`, and the **minus sign is the algorithm** — ascent
  from an identical start reached **`6.33e+07`** where descent reached **`0.18502019`**
- **"The gradient descent curve" names two different plots.** The `J` column fell
  `29.46681 → 0.18502`; the `ŷ` columns travelled to `0.91362`, `5.00889` and `9.10416`
- Gradient descent reached the **OLS optimum to all five printed decimals** — iterative does not mean
  approximate
- The `1/2` cost convention **halves every gradient**, which is arithmetically the same as halving
  `α`: the `1/2n` run at `α = 0.2` tracked the `1/n` run at `α = 0.1` with a cost ratio of
  **`2.00000000`** on every row
- Convexity is measurable: **0 violations in 2000** chord tests for MSE, **957** for the same squared
  error applied to a sigmoid. Convexity belongs to the loss-and-model pair, not to optimisation
- The chord test **cannot prove** convexity; `XᵀX` being positive semi-definite does
- **Nothing programs the braking.** `‖Δθ‖/‖∇J‖` was `0.100` — exactly `α` — on every iteration; the
  step shrinks only because the gradient does
- The contraction rate is predictable: **predicted `0.8000` from `max|1 − α·λ|`, measured `0.8000`**
- Distance covered fell from **`3.638102`** over the first five iterations to **`2.262e-09`** over the
  last five, a ratio of **`1.609e+09`**, with `α` never changing
- `κ = 1.00` is what **standardisation** produced, not a general truth. Rescaling one feature drove
  `κ` to **`929437.6`**, shrank the usable `α` from **`0.82` to `1.27e-06`**, and left the run
  unfinished after **200,000** iterations
- **Iterations scale linearly with `κ`**: a 100× rise in `κ` (`92.9 → 9294.4`) gave a 100.9× rise in
  iterations (`413 → 41674`)

**Next in this section:** [The Learning Rate](./03-the-learning-rate.md) — the one knob, its four
failure modes, and the fact that the boundary between "works" and "explodes" is a number you can
compute from `λ_max` before running anything

**See also:** [Loss Functions](./01-loss-functions.md#the-loss-decides-whether-the-problem-is-solvable-at-all)
for why a differentiable loss is a precondition for any of this ·
[The Matrix Formulation](../03-linear-regression/03-the-matrix-formulation.md#why-anyone-bothers-with-gradient-descent)
for when to prefer the closed form · [Feature Scaling and Transformation](../02-data-preprocessing/04-feature-scaling-and-transformation.md#standardisation-z-score-normalisation)
for the transform that turned the ravine back into a bowl

---

## Run It Yourself

```python title="gradient_descent.py"
"""Gradient descent — the two curves, convexity, the minus sign, and automatic braking."""
import numpy as np
np.random.seed(42)

def cost(X, y, th, half=False):        # J = (1/n)Σ(ŷ−y)², or (1/2n)Σ(ŷ−y)² if half
    return np.sum((X @ th - y) ** 2) / ((2 if half else 1) * len(y))

def grad(X, y, th, half=False):        # ∇J = (2/n)Xᵀ(ŷ−y), or (1/n)Xᵀ(ŷ−y) if half
    return ((1 if half else 2) / len(y)) * X.T @ (X @ th - y)

def sig_cost(X, y, th):                # MSE of a sigmoid — the non-convex contrast
    return np.sum((1 / (1 + np.exp(-np.clip(X @ th, -500, 500))) - y) ** 2) / len(y)

# ---------- 1. two curves from one run ----------
n, alpha = 50, 0.1
xf = np.random.randn(n, 1)
xf = (xf - xf.mean()) / xf.std()
y = 2 * xf.ravel() + 5 + np.random.randn(n) * 0.5
X = np.c_[np.ones(n), xf]
th_ols = np.linalg.lstsq(X, y, rcond=None)[0]
eig = np.linalg.eigvalsh((2 / n) * (X.T @ X))
x_at = np.array([-2.0, 0.0, 2.0])
print("1. TWO CURVES FROM ONE RUN   (cost vs iteration, and the line in data space)")
print(f"   n = {n}, feature standardised -> kappa = {eig.max() / eig.min():.2f}")
print(f"   {'iter':>5}{'b':>10}{'w':>10}{'J':>11}{'‖∇J‖':>10}{'ŷ(−2)':>10}{'ŷ(0)':>10}{'ŷ(+2)':>10}")
th = np.zeros(2)
for i in range(101):
    if i in (0, 1, 2, 3, 5, 10, 20, 50, 100):
        a = th[0] + th[1] * x_at
        print(f"   {i:>5}{th[0]:>10.5f}{th[1]:>10.5f}{cost(X, y, th):>11.5f}"
              f"{np.linalg.norm(grad(X, y, th)):>10.5f}{a[0]:>10.5f}{a[1]:>10.5f}{a[2]:>10.5f}")
    if i < 100:
        th = th - alpha * grad(X, y, th)
a = th_ols[0] + th_ols[1] * x_at
print(f"   {'OLS':>5}{th_ols[0]:>10.5f}{th_ols[1]:>10.5f}{cost(X, y, th_ols):>11.5f}"
      f"{0.0:>10.5f}{a[0]:>10.5f}{a[1]:>10.5f}{a[2]:>10.5f}")

# ---------- 2. the 1/2 convention halves every gradient ----------
print("\n2. THE 1/2 CONVENTION   (same problem, three runs)")
print(f"   {'iter':>5}{'J=(1/n) a=0.1':>16}{'J=(1/2n) a=0.1':>17}"
      f"{'J=(1/2n) a=0.2':>17}{'col1/col3':>11}")
ta, tb, tc = np.zeros(2), np.zeros(2), np.zeros(2)
for i in range(5):
    ca, cb, cc = cost(X, y, ta), cost(X, y, tb, True), cost(X, y, tc, True)
    print(f"   {i:>5}{ca:>16.8f}{cb:>17.8f}{cc:>17.8f}{ca / cc:>11.8f}")
    ta = ta - 0.1 * grad(X, y, ta)
    tb = tb - 0.1 * grad(X, y, tb, True)
    tc = tc - 0.2 * grad(X, y, tc, True)

# ---------- 3. convexity, measured by chord test ----------
print("\n3. CONVEXITY   (midpoint chord test, 2000 random parameter pairs)")
for name, fn, box in (("MSE", cost, 10.0), ("MSE of sigmoid(Xθ)", sig_cost, 5.0)):
    bad = 0
    for _ in range(2000):
        p, q = np.random.uniform(-box, box, 2), np.random.uniform(-box, box, 2)
        if fn(X, y, (p + q) / 2) > (fn(X, y, p) + fn(X, y, q)) / 2 + 1e-10:
            bad += 1
    print(f"   {name:<20}{bad:>5} violations of  J(mid) <= mean(J(a), J(b))")
print(f"   Hessian (2/n)XᵀX eigenvalues = {eig}   both > 0 -> a bowl")

# ---------- 4. the minus sign ----------
print("\n4. THE MINUS SIGN   (identical init, identical alpha, opposite direction)")
print(f"   {'iter':>5}{'descent  −α∇J':>18}{'ascent  +α∇J':>18}")
td, tu = np.zeros(2), np.zeros(2)
for i in range(41):
    if i in (0, 5, 10, 20, 40):
        print(f"   {i:>5}{cost(X, y, td):>18.8f}{cost(X, y, tu):>18.6e}")
    if i < 40:
        td, tu = td - alpha * grad(X, y, td), tu + alpha * grad(X, y, tu)

# ---------- 5. the braking is free ----------
print("\n5. THE BRAKING IS FREE   (nothing in the loop shrinks the step)")
print(f"   {'iter':>5}{'‖Δθ‖':>12}{'‖∇J‖':>12}{'‖Δθ‖/‖∇J‖':>12}{'shrink':>9}")
th, prev, early, late = np.zeros(2), None, 0.0, 0.0
for i in range(1, 101):
    g = grad(X, y, th)
    gn = np.linalg.norm(g)
    sn = alpha * gn
    if i <= 10:
        print(f"   {i:>5}{sn:>12.6f}{gn:>12.6f}{sn / gn:>12.3f}"
              f"{('—' if prev is None else f'{sn / prev:.4f}'):>9}")
    early += sn if i <= 5 else 0.0
    late += sn if i > 95 else 0.0
    th, prev = th - alpha * g, sn
print(f"   predicted contraction  max|1 − α·λ| = {np.abs(1 - alpha * eig).max():.4f}")
print(f"   distance travelled: first 5 iters {early:.6f}, last 5 of 100 {late:.3e},"
      f" ratio {early / late:.3e}")

# ---------- 6. the bowl is usually a ravine ----------
print("\n6. THE BOWL IS USUALLY A RAVINE   (feature 2 rescaled, own largest stable alpha)")
np.random.seed(43)
x1, x2 = np.random.randn(n, 1), np.random.randn(n, 1)
y2 = 3 * x1.ravel() + 1.5 * x2.ravel() + 7 + 0.5 * np.random.randn(n)
print(f"   {'scale':>7}{'kappa':>13}{'2/lambda_max':>15}{'iters':>9}   status")
for s in (1, 10, 100, 1000):
    Xs = np.c_[np.ones(n), x1, x2 * s]
    es = np.linalg.eigvalsh((2 / n) * (Xs.T @ Xs))
    a_use = 0.9 * (2.0 / es.max())
    floor = cost(Xs, y2, np.linalg.lstsq(Xs, y2, rcond=None)[0])
    th, ok = np.zeros(3), False
    for k in range(1, 200001):
        th = th - a_use * grad(Xs, y2, th)
        if cost(Xs, y2, th) - floor < 1e-6:
            ok = True
            break
    print(f"   x{s:>6}{es.max() / es.min():>13.1f}{2.0 / es.max():>15.6e}{k:>9}"
          f"   {'converged' if ok else 'cap reached'}")
```

```text title="Output"
1. TWO CURVES FROM ONE RUN   (cost vs iteration, and the line in data space)
   n = 50, feature standardised -> kappa = 1.00
    iter         b         w          J      ‖∇J‖     ŷ(−2)      ŷ(0)     ŷ(+2)
       0   0.00000   0.00000   29.46681  10.82253   0.00000   0.00000   0.00000
       1   1.00178   0.40953   18.92537   8.65802   0.18272   1.00178   1.82083
       2   1.80320   0.73715   12.17884   6.92642   0.32890   1.80320   3.27750
       3   2.44434   0.99925    7.86107   5.54114   0.44585   2.44434   4.44283
       5   3.36758   1.37667    3.32913   3.54633   0.61424   3.36758   6.12091
      10   4.47106   1.82777    0.52262   1.16206   0.81552   4.47106   8.12661
      20   4.95114   2.02403    0.18891   0.12478   0.90309   4.95114   8.99920
      50   5.00882   2.04761    0.18502   0.00015   0.91361   5.00882   9.10403
     100   5.00889   2.04764    0.18502   0.00000   0.91362   5.00889   9.10416
     OLS   5.00889   2.04764    0.18502   0.00000   0.91362   5.00889   9.10416

2. THE 1/2 CONVENTION   (same problem, three runs)
    iter   J=(1/n) a=0.1   J=(1/2n) a=0.1   J=(1/2n) a=0.2  col1/col3
       0     29.46681475      14.73340738      14.73340738 2.00000000
       1     18.92536852      11.95163684       9.46268426 2.00000000
       2     12.17884294       9.69840271       6.08942147 2.00000000
       3      7.86106656       7.87328306       3.93053328 2.00000000
       4      5.09768968       6.39493615       2.54884484 2.00000000

3. CONVEXITY   (midpoint chord test, 2000 random parameter pairs)
   MSE                     0 violations of  J(mid) <= mean(J(a), J(b))
   MSE of sigmoid(Xθ)    957 violations of  J(mid) <= mean(J(a), J(b))
   Hessian (2/n)XᵀX eigenvalues = [2. 2.]   both > 0 -> a bowl

4. THE MINUS SIGN   (identical init, identical alpha, opposite direction)
    iter     descent  −α∇J      ascent  +α∇J
       0       29.46681475      2.946681e+01
       5        3.32912848      1.814902e+02
      10        0.52261578      1.122779e+03
      20        0.18891189      4.303773e+04
      40        0.18502019      6.325537e+07

5. THE BRAKING IS FREE   (nothing in the loop shrinks the step)
    iter        ‖Δθ‖        ‖∇J‖   ‖Δθ‖/‖∇J‖   shrink
       1    1.082253   10.822531       0.100        —
       2    0.865802    8.658025       0.100   0.8000
       3    0.692642    6.926420       0.100   0.8000
       4    0.554114    5.541136       0.100   0.8000
       5    0.443291    4.432909       0.100   0.8000
       6    0.354633    3.546327       0.100   0.8000
       7    0.283706    2.837062       0.100   0.8000
       8    0.226965    2.269649       0.100   0.8000
       9    0.181572    1.815719       0.100   0.8000
      10    0.145258    1.452576       0.100   0.8000
   predicted contraction  max|1 − α·λ| = 0.8000
   distance travelled: first 5 iters 3.638102, last 5 of 100 2.262e-09, ratio 1.609e+09

6. THE BOWL IS USUALLY A RAVINE   (feature 2 rescaled, own largest stable alpha)
     scale        kappa   2/lambda_max    iters   status
   x     1          1.6   8.199661e-01       40   converged
   x    10         92.9   1.265469e-02      413   converged
   x   100       9294.4   1.265541e-04    41674   converged
   x  1000     929437.6   1.265541e-06   200000   cap reached
```

### What to notice in that output

- **The `‖∇J‖` column and the `J` column tell different stories.** By iteration 20, `J` has reached
  `0.18891` against a final `0.18502` — 98% of the way — while `‖∇J‖` is still `0.12478`, nowhere near
  its final `0.00000`. Cost converges long before the gradient does, which is why a *cost*-based
  stopping rule stops earlier than a *gradient*-based one.
- **`ŷ(0)` equals `b` on every row.** Not a coincidence: `ŷ(0) = b + w·0`. The intercept *is* the
  prediction at `x = 0`, and the table makes that visible rather than stated.
- **The `col1/col3` ratio is `2.00000000`, not `1.99999`.** Doubling `α` under the halved cost
  reproduces the other run's parameter path bit-for-bit; the factor of two is exact algebra, not an
  approximation.
- **The middle column of section 2 crosses the first.** At iteration 3 the `1/2n, α=0.1` run reads
  `7.87328306` against the `1/n, α=0.1` run's `7.86106656` — but those are costs on *different
  scales*. Comparing cost values across conventions is meaningless; only the ratio column is
  interpretable.
- **957 violations is nearly half of 2000.** A non-convex surface does not hide from this test — the
  failure rate is enormous. That is what makes `0` for MSE informative.
- **Ascent's cost grows faster than geometrically at first glance but is exactly geometric.**
  `2.95e+01 → 1.81e+02 → 1.12e+03` is a factor of about `6.2` per 5 iterations, i.e. `1.44` per
  iteration, which is `|1 + α·λ| = 1.2`… squared. The extra factor comes from cost being *quadratic*
  in the error, so cost grows at `1.2² = 1.44` per step.
- **The `shrink` column is constant from iteration 2, not from iteration 1.** The first step starts
  from `(0, 0)`, which is not on the asymptotic error direction; the geometric rate establishes itself
  immediately afterwards because both eigenvalues are equal here. On a ravine it takes many iterations
  to settle.
- **`2/lambda_max` is identical for `x100` and `x1000`** at `1.265541e-06`… no — read it again: it is
  `1.265541e-04` and `1.265541e-06`, differing by exactly `100`. The mantissa repeats because
  `λ_max` is dominated by the rescaled column, whose contribution scales as the square of the factor.
- **The `x1` row's `κ = 1.6`, not `1.0`,** even though both features are standard normal. Standardising
  makes the *diagonal* of `(1/n)XᵀX` unit, but the features are not exactly orthogonal in a finite
  sample, so the off-diagonal correlation leaves the bowl slightly elliptical.

**Things worth trying:**

1. Set `alpha = 0.5` in section 1. With `H = 2·I` the contraction becomes `|1 − 0.5·2| = 0`, and
   gradient descent lands on the exact optimum in **one** step. Then try `0.9` and watch the `shrink`
   column go to `0.8` again — from the other side.
2. Change `alpha` to `1.1` and re-run section 5. `max|1 − α·λ| = 1.2 > 1`, so the `shrink` column
   exceeds one and the run diverges. The predictor works in both directions.
3. Remove the standardisation of `xf` in section 1 (use raw `randn` scaled by 50) and watch `κ` and the
   iteration count in section 1 both move.
4. In section 3, replace `sig_cost`'s squared error with log loss and re-run the chord test. Log loss
   on a sigmoid *is* convex — the violations should return to `0`, isolating the squared error as the
   culprit rather than the sigmoid.
5. In section 6, add `x=10000` to the ladder. Predict `κ` and `2/lambda_max` before running.
6. Replace the fixed `alpha` in section 5 with `alpha / (1 + i)` and compare the `shrink` column. A
   decaying schedule makes convergence *slower* here, not faster, because the automatic braking was
   already sufficient.

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

### The update rule

**U1. [THEORY]** Write the update rule and name every symbol in it.

**U2. [THEORY]** Derive `∇J = (2/n)Xᵀ(Xθ − y)` from `J = (1/n)Σ(Xθ − y)²`.

**U3. [OUT]** The `col1/col3` column read `2.00000000` on all five rows. State exactly what that
demonstrates, and what it does *not* demonstrate.

**U4. [ANALYZE]** A colleague copies `α = 0.03` from a source whose cost includes a `1/2` factor into
code that does not. What has effectively happened to their learning rate, and what symptom would you
expect first?

**U5. [PROG]** Implement both conventions and empirically find the `α` for the halved cost that
reproduces a given `α` for the unhalved one. Print the parameter difference, not a boolean.

### Two curves

**C1. [THEORY]** Name the two plots that get called "the gradient descent curve" and give each one's
axes.

**C2. [OUT]** By iteration 20, `J = 0.18891` against a final `0.18502`, but `‖∇J‖` was `0.12478`
against a final `0.00000`. Which quantity would you use in a stopping rule, and what does the
discrepancy cost you?

**C3. [OUT]** In the table, `ŷ(0)` equals `b` on every row. Why must that be true?

**C4. [ANALYZE]** Gradient descent matched the OLS optimum to all five printed decimals. Does that
mean the iterative method is exact? Argue carefully.

**C5. [PROG]** Modify section 1 to also print the residual sum of squares at each recorded iteration,
and confirm it is `n × J`.

### Convexity

**V1. [THEORY]** State the chord inequality that defines a convex function.

**V2. [OUT]** MSE gave `0` violations in 2000 tests and MSE-on-a-sigmoid gave `957`. What does each
number license you to conclude?

**V3. [THEORY]** Why is `XᵀX` positive semi-definite for *any* `X`? What does a zero eigenvalue mean
for the fit?

**V4. [ANALYZE]** A colleague runs the chord test on a new loss, gets zero violations, and declares
the loss convex. Where is the flaw, and what would you check instead?

**V5. [THEORY]** The eigenvalues came out `[2, 2]`. Why equal, and what would make them unequal?

**V6. [ANALYZE]** Convexity is described here as a property of the loss-and-model pair. Defend that
phrasing using the two rows of section 3.

### The minus sign and the braking

**B1. [OUT]** Descent reached `0.18502019`; ascent reached `6.33e+07`. Explain the asymmetry — why does
one converge and the other accelerate without limit?

**B2. [OUT]** `‖Δθ‖ / ‖∇J‖` was `0.100` on every row. What does that tell you about how the algorithm
slows down?

**B3. [THEORY]** Derive the contraction factor `max_i |1 − α·λᵢ|` from `θₜ₊₁ − θ* = (I − αH)(θₜ − θ*)`.

**B4. [OUT]** The predicted and measured contraction were both `0.8000`. Compute the prediction
yourself from `α = 0.1` and the eigenvalues.

**B5. [ANALYZE]** Distance travelled fell from `3.638102` to `2.262e-09` between the first and last
five iterations with `α` fixed. Someone concludes the code must contain a decay schedule. Correct them.

**B6. [PROG]** Find, empirically, the `α` that converges in the fewest iterations on this problem, and
compare it with `1/λ_max`.

### Conditioning

**K1. [THEORY]** Define the condition number and say what it means geometrically.

**K2. [OUT]** `κ` went `92.9 → 9294.4` (×100) and iterations went `413 → 41674` (×100.9). State the
scaling law that pair supports.

**K3. [OUT]** At `κ = 929437.6` the status column reads `cap reached`. Why is it important that the
table says this rather than printing `200000` unqualified?

**K4. [ANALYZE]** The `x1` row shows `κ = 1.6` even though both features are standardised. Explain the
residual elongation.

**K5. [ANALYZE]** Compare the cost of skipping feature scaling for gradient descent against skipping
it for the normal equation. Which is worse, and why?

**K6. [PROG]** Extend the ladder to `x = 10000`, predicting `κ` and `2/λ_max` before you run it.

**K7. [ANALYZE]** A run's cost is falling but implausibly slowly, and the code is correct. Give the
order in which you would check `α`, `κ` and the data, with a reason for the order.

### Quick self-check

1. Write the gradient descent update rule.
2. What does `∇J` point towards, and why is there a minus sign?
3. Which two plots share the name "the gradient descent curve"?
4. What is `‖Δθ‖` equal to, exactly?
5. Why does the step shrink near the minimum?
6. What is the Hessian of MSE for a linear model?
7. Why is that Hessian always positive semi-definite?
8. State the chord test for convexity.
9. Does passing the chord test prove convexity?
10. What is the contraction factor per iteration?
11. What is the condition number, and what does `κ = 1` mean?
12. What did rescaling one feature by 1000 do to the largest usable `α`?
13. How do iterations scale with `κ`?
14. What does the `1/2` in some cost definitions change?
15. Is a learning rate portable between sources? Why not?
16. Which is immune to conditioning — gradient descent or the normal equation?
