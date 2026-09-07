---
sidebar_position: 2
title: R², Adjusted R² and MAPE
description: Settles why R² can exceed 1 or go negative, why SST = SSR + SSE only holds for a least-squares fit, why adding a junk feature never lowers R² but does lower Adjusted R², and why scikit-learn's MAPE returns 0.0296 rather than 2.96%.
tags: [machine-learning, linear-regression, metrics, scikit-learn]
toc_max_heading_level: 3
---

# R², Adjusted R² and MAPE

> **Topic —** the previous page gave you three error averages that live in the units of `y`: MAE,
> MSE and RMSE. All three need context before they mean anything. This page covers the metrics
> that carry their own context: **R²**, which compares your model against the laziest possible
> model, **Adjusted R²**, which charges rent for every feature you add, and **MAPE**, which reports
> error as a percentage. It settles four things: why R² is not always "the fraction of variance
> explained", why `SST = SSR + SSE` is a conditional identity rather than a law, why R² alone can
> never tell you a model has too many features, and why MAPE quietly rewards guessing low.

---

## In plain words

Suppose you must predict house prices and you are not allowed to look at a single feature. The
best you can do is guess the average price for every house. That guess is the **baseline** — the
laziest defensible model. **R² measures how much of the baseline's error your model got rid of.**

- R² = 0 → you did exactly as well as guessing the average. Your features bought nothing.
- R² = 1 → no error left. Every prediction is exact.
- R² = 0.85 → you removed 85% of the baseline's squared error.
- R² &lt; 0 → **you did worse than guessing the average.** This is allowed, and it happens.

That last point surprises people. The name "coefficient of determination" and the square in the
symbol both suggest a number trapped in `[0, 1]`. It is not bounded below at all.

**Adjusted R²** exists because plain R² has one specific defect. Add a column of random noise to
your features, refit, and R² goes **up** — never down, not by a hair. So R² can never tell you a
model is carrying features it does not need. Adjusted R² charges a fee per feature, paid in
**degrees of freedom**; a feature that does not earn more than its fee makes the score fall.

**MAPE** answers a different question: how wrong am I *as a percentage of the true value?* An
error of ₹2 lakh on a ₹20 lakh house is 10%; the same ₹2 lakh on a ₹2 crore house is 1%. MAPE
treats those rows differently where MAE treats them identically.

### Words used on this page

| Term | Say it as | What it means here |
|---|---|---|
| `y`, `ŷ`, `r` | "why", "y hat", "residual" | The true value, the prediction, and `y − ŷ` for one row |
| `ȳ` | "y bar" | Mean of all true values — the baseline's constant prediction |
| **SST** | total sum of squares | `Σ(y − ȳ)²` — the baseline's squared error, before any model |
| **SSE** | error sum of squares | `Σ(y − ŷ)²` — your model's squared error. Also RSS |
| **SSR** | regression sum of squares | `Σ(ŷ − ȳ)²` — how far predictions spread from the baseline. Also called *explained* |
| **R²** | "R squared" | `1 − SSE/SST` — the share of the baseline's squared error you removed |
| **baseline** | — | The mean-only model: predict `ȳ` for every row, ignoring all features |
| `n`, `p` | "n", "p" | Rows scored; features, **not** counting the intercept |
| **degrees of freedom** | "D O F" | `n − p − 1` — rows left after the fit spends one per coefficient |
| **Adjusted R²** | — | R² after charging a fee for each of the `p` features |
| **in-sample** | — | Scored on the rows the model was fitted on. *Out-of-sample* is the opposite |
| **APE**, **MAPE** | "A P E", "map-ee" | `abs(y − ŷ)/abs(y)` for one row; and the mean of those, ×100 |
| **sMAPE** | "ess-map-ee" | Symmetric MAPE — divides by the average of `abs(y)` and `abs(ŷ)` |
| **WAPE** | "wap-ee" | `Σabs(r) / Σabs(y)` — one ratio for the whole set, not a mean of ratios |
| **monotone** | "mon-oh-tone" | Moves one direction only. In-sample R² is monotone up in `p` |

**What this page settles:**

1. Why R² can be negative, and why it can exceed 1 if you compute it the wrong way.
2. Why `SST = SSR + SSE` holds for a fitted line but breaks for predictions you invented.
3. Why in-sample R² can only rise when you add a feature — with the one-line reason.
4. What fee Adjusted R² charges, when a feature is worth paying it, and why the fee is too small
   to make Adjusted R² a feature selector.
5. Why MAPE punishes over-prediction without limit but under-prediction by at most 100%, and why
   scikit-learn hands you `0.0296` where you expected `2.96`.

:::tip If you only take one thing from this page
R² compares your model against one specific rival: predicting the mean for every row. Everything
strange about R² — negative values, rising when you add junk, changing when you re-split —
follows from the fact that the rival changes too. Different rows, different mean, different `SST`,
therefore a different R² for the *same* predictions.
:::

---

## R² asks a ratio question, not a magnitude question

MAE, MSE and RMSE answer "how big is the error?" and carry the units of `y`. R² answers "how big
is the error **compared to** doing nothing?" and carries no units at all.

```text
       SSE      Σ(yᵢ − ŷᵢ)²
R² = 1 ───  = 1 ───────────
       SST      Σ(yᵢ − ȳ)²
```

Read the fraction alone: `SSE/SST` is the share of the baseline's squared error that **survived**
your model. Subtract from one and you have the share you **removed**.

| `SSE/SST` | R² | Meaning |
|---|---|---|
| `0.00` | `1.00` | No error left |
| `0.02` | `0.98` | You removed 98% of the baseline's squared error |
| `1.00` | `0.00` | You matched the baseline exactly |
| `1.66` | `−0.66` | You produced 66% **more** squared error than the baseline |

Because units cancel, R² reads the same whether `y` is in rupees, kelvin or millimetres. That is
the appeal, and also the danger: a unitless number is easy to quote without checking what baseline
it was measured against.

:::note
R² is dimensionless but **not** portable across datasets — it depends on `SST`, which depends on how
spread out `y` is in the rows you scored. Quote R² and RMSE together, or you have told half the
story: [why the same RMSE is excellent or useless](./01-error-in-the-units-of-y.md#none-of-the-three-means-anything-without-the-spread-of-y).
:::

---

## The three sums of squares, and why one identity is conditional

Carry over the five-house table from the previous page. Prices are in lakhs.

| # | `y` | `ŷ` | `r = y − ŷ` | `r²` | `y − ȳ` | `(y − ȳ)²` | `ŷ − ȳ` | `(ŷ − ȳ)²` |
|---|---|---|---|---|---|---|---|---|
| 1 | 52 | 49 | +3 | 9 | −21.2 | 449.44 | −24.2 | 585.64 |
| 2 | 60 | 61 | −1 | 1 | −13.2 | 174.24 | −12.2 | 148.84 |
| 3 | 71 | 69 | +2 | 4 | −2.2 | 4.84 | −4.2 | 17.64 |
| 4 | 88 | 92 | −4 | 16 | +14.8 | 219.04 | +18.8 | 353.44 |
| 5 | 95 | 95 | 0 | 0 | +21.8 | 475.24 | +21.8 | 475.24 |
| | **366** | **366** | **0** | **30** | **0** | **1322.80** | **0** | **1580.80** |

So `ȳ = 366/5 = 73.2`, and:

```text
SST = Σ(y − ȳ)²  = 1322.80     ← the baseline's squared error
SSE = Σ(y − ŷ)²  =   30.00     ← your model's squared error
SSR = Σ(ŷ − ȳ)²  = 1580.80     ← spread of the predictions about the baseline

R² = 1 − 30.00 / 1322.80 = 1 − 0.02267938 = 0.97732062  ≈ 0.9773
```

The model removed 97.73% of the baseline's squared error.

### The identity that fails here

Textbooks state `SST = SSR + SSE`, then define R² a second way as `SSR/SST`. Try both:

```text
SSR + SSE = 1580.80 + 30.00 = 1610.80   ≠   1322.80 = SST
SSR / SST = 1580.80 / 1322.80 = 1.1951  ←  an "R²" above 1
```

The reason is algebra, not arithmetic. Write `y − ȳ = (ŷ − ȳ) + (y − ŷ)` and square the sum:

```text
Σ(y − ȳ)² = Σ(ŷ − ȳ)² + Σ(y − ŷ)² + 2·Σ(ŷ − ȳ)(y − ŷ)
   SST    =    SSR     +    SSE    +  2·(cross term)
```

The identity holds **only when the cross term vanishes.** Here it does not:

```text
Σ(ŷ − ȳ)·r = (−24.2)(+3) + (−12.2)(−1) + (−4.2)(+2) + (18.8)(−4) + (21.8)(0)
            = −72.6 + 12.2 − 8.4 − 75.2 + 0  =  −144.0

SSR + SSE + 2(−144.0) = 1610.80 − 288.00 = 1322.80 = SST   ✓
```

The books are quoting a result about **least-squares fits**. Least squares forces the residuals to
be uncorrelated with the fitted values — that is exactly what setting the gradient to zero
achieves. Our `ŷ` column was invented by hand, so no such guarantee applies.

:::warning
`R² = SSR/SST` and `SST = SSR + SSE` require predictions from an ordinary least-squares fit **with
an intercept**. `R² = 1 − SSE/SST` requires nothing. Use the second form always: it is what
`r2_score` computes, and the only one still correct for ridge, a tree, a neural network, or a
number a colleague typed into a spreadsheet.
:::

### The same numbers, from a real fit

Give those five houses a feature — age in decades, `x = [1, 2, 3, 4, 5]` — and fit by least
squares:

```text
x̄ = 3          ȳ = 73.2
Sxy = Σ(x − x̄)(y − ȳ) = (−2)(−21.2) + (−1)(−13.2) + 0 + (1)(14.8) + (2)(21.8) = 114.0
Sxx = Σ(x − x̄)²       = 4 + 1 + 0 + 1 + 4 = 10.0

b₁ = Sxy / Sxx = 114.0 / 10.0 = 11.4        b₀ = ȳ − b₁x̄ = 73.2 − 34.2 = 39.0
ŷ = 39.0 + 11.4x
```

| # | `x` | `y` | `ŷ` | `r` | `r²` | `ŷ − ȳ` | `(ŷ − ȳ)²` |
|---|---|---|---|---|---|---|---|
| 1 | 1 | 52 | 50.4 | +1.6 | 2.56 | −22.8 | 519.84 |
| 2 | 2 | 60 | 61.8 | −1.8 | 3.24 | −11.4 | 129.96 |
| 3 | 3 | 71 | 73.2 | −2.2 | 4.84 | 0.0 | 0.00 |
| 4 | 4 | 88 | 84.6 | +3.4 | 11.56 | +11.4 | 129.96 |
| 5 | 5 | 95 | 96.0 | −1.0 | 1.00 | +22.8 | 519.84 |
| | | **366** | **366** | **0.0** | **23.20** | **0.0** | **1299.60** |

Now the identity closes to the last digit, and both R² formulas agree:

```text
SSR + SSE = 1299.60 + 23.20 = 1322.80 = SST         ✓

R² = 1 − 23.20 / 1322.80 = 1 − 0.01753855 = 0.98246145
R² = 1299.60 / 1322.80                    = 0.98246145   ✓ same
```

One more equality appears, and it holds **only** for simple regression — one feature, fitted with
an intercept:

```text
r  = Sxy / √(Sxx · Syy) = 114.0 / √(10.0 × 1322.80) = 114.0 / 115.01304 = 0.991192
r² = 114.0² / (10.0 × 1322.80) = 12996 / 13228      = 0.98246145 = R²   ✓
```

With two or more features that shortcut dies. The surviving general statement: for any OLS fit
with an intercept, R² equals the **squared correlation between `y` and `ŷ`** — not between `y` and
any single feature.

---

## R² can be negative, and the sign is the useful part

Since `SSE` has no upper bound, `1 − SSE/SST` has no lower bound. Predict a flat 60 lakh for all
five houses:

| `y` | 52 | 60 | 71 | 88 | 95 | Σ |
|---|---|---|---|---|---|---|
| `r = y − 60` | −8 | 0 | +11 | +28 | +35 | — |
| `r²` | 64 | 0 | 121 | 784 | 1225 | **2194** |

```text
R² = 1 − 2194 / 1322.80 = 1 − 1.658605 = −0.658605   ≈ −0.6586
```

That constant produced 66% more squared error than simply guessing 73.2. The negative sign is the
metric doing its job.

| Where negative R² shows up | Why |
|---|---|
| Scoring on a test set | The fit minimised SSE on *train*. Nothing constrains it on *test*, so it can lose to the test set's own mean |
| A badly wrong constant, or a diverged fit | Predictions sit far from the data — see [the learning rate](../04-optimisation/03-the-learning-rate.md) if a fit diverged |

:::danger
`r2_score` is not symmetric. Swapping the arguments does not flip a sign; it computes
`1 − SSE/Σ(ŷ − mean(ŷ))²` — right numerator, wrong denominator. The result looks plausible, which
is why the bug survives review. `mean_squared_error` *is* symmetric, so the habit you built there
does not transfer.
:::

The baseline is also computed from the rows **being scored**, not from training. Score identical
predictions on two test splits and you get two values of `SST`, hence two R² values, from one
model — the same [split lottery](../02-data-preprocessing/06-train-test-split.md#the-split-lottery)
that makes a single train/test split unreliable in the first place.

---

## Adding any feature can only push in-sample R² up

The defect in one sentence: **least squares with `p+1` features can always reproduce the best
solution found with `p` features, by setting the new coefficient to zero.**

So the minimum achievable `SSE` cannot rise when a column is added. `SST` does not move — it
depends only on `y`. Therefore `SSE/SST` cannot rise and `R² = 1 − SSE/SST` cannot fall.

| Claim | Status |
|---|---|
| Adding a useful feature raises in-sample R² | True |
| Adding a **useless** feature raises in-sample R² | Also true — tiny, but never zero and never negative |
| Adding a column of pure random noise raises in-sample R² | Also true |
| In-sample R² can therefore detect an over-featured model | **False.** It structurally cannot |
| With `p = n − 1` features, in-sample R² is exactly 1 | True — the fit interpolates every point, `SSE = 0` |

That last row is the reductio: nineteen features on twenty rows gives R² = 1.0 and a model that
knows nothing. "R² = 0.99" is not a boast until you say how many features, and whether it was
measured in-sample or out-of-sample.

Out-of-sample R² has no such guarantee. Adding a junk feature usually **lowers** test R², because
the coefficient was fitted to noise that does not repeat. Watch the gap between the two.

---

## Adjusted R² charges rent for every feature

Adjusted R² makes each feature pay for the degree of freedom it consumes. Instead of comparing raw
sums of squares it compares **variance estimates** — each sum divided by its own degrees of
freedom:

```text
                SSE / (n − p − 1)                        n − 1
R²_adj  =  1 − ───────────────────  =  1 − (1 − R²) · ───────────
                  SST / (n − 1)                        n − p − 1
```

The two forms are one expression rearranged; use the right-hand one, because you almost always
have R² already. For the five-house fit: `n = 5`, `p = 1`, so `n − p − 1 = 3` and `n − 1 = 4`.

```text
1 − R²  = 1 − 0.98246145 = 0.01753855
R²_adj  = 1 − 0.01753855 × (4 / 3) = 1 − 0.02338473 = 0.97661527   ≈ 0.9766
```

R² was 0.9825; Adjusted R² is 0.9766. The gap is one feature's rent, paid out of five rows. Four
facts fall straight out of the formula:

| Fact | Why |
|---|---|
| `R²_adj ≤ R²` always | The multiplier `(n−1)/(n−p−1)` is ≥ 1 whenever `p ≥ 0` |
| Equal only when `p = 0` | The multiplier becomes `(n−1)/(n−1) = 1`. The baseline scores 0 on both |
| `R²_adj` can be negative while R² is positive | Small R² with large `p/n` inflates `(1 − R²)` past 1 |
| Undefined at `p = n − 1` | `n − p − 1 = 0`. That is precisely the interpolating fit with R² = 1 |

### Model A versus Model B, worked

Fifty house records, two candidate models. Model B wins on R² — now pay the rent.

| | Model A | Model B |
|---|---|---|
| Features `p` | 2 | 7 |
| `n − p − 1` | 47 | 42 |
| In-sample R² | 0.820 | **0.835** |

```text
Model A:  R²_adj = 1 − (1 − 0.820) × 49/47 = 1 − 0.180 × 1.04255319 = 0.81234043
Model B:  R²_adj = 1 − (1 − 0.835) × 49/42 = 1 − 0.165 × 1.16666667 = 0.80750000
```

R² rose by 0.015. Adjusted R² **fell** by 0.0048. The five extra features bought 1.5 percentage
points of fit and cost more than that in degrees of freedom, so on this evidence Model A is the
better model. Invert the arithmetic to see what Model B needed:

```text
1 − (1 − R²) × 49/42 = 0.81234043
        (1 − R²) = 0.18765957 × 42/49 = 0.16085106
              R² = 0.83914894   ≈ 0.8391
```

Model B needed R² ≥ 0.8391 to justify seven features. It managed 0.835 — close, and losing.

:::note
Neither `r2_score` nor `LinearRegression.score()` gives you Adjusted R². scikit-learn does not
implement it, because a scorer sees only `y_true` and `y_pred` and therefore cannot know `p`.
Compute it from `r2_score`, `n` and `X.shape[1]`, or read it off a `statsmodels`
`OLS(...).fit().summary()`, which prints both.
:::

---

## The rent is too cheap to make Adjusted R² a feature selector

Work out exactly when Adjusted R² rises. Adding one feature improves it **if and only if** that
feature's `t`-statistic satisfies `t² > 1`, that is `abs(t) > 1`.

| Threshold | Effective rule |
|---|---|
| `abs(t) > 1` | Adjusted R² rises — the feature is kept |
| `abs(t) > 2` | The coefficient is roughly significant at the 5% level |
| AIC | Charges 2 per parameter instead of 1 — a strictly stronger penalty |

Adjusted R² accepts a feature at half the evidence you would demand before calling its coefficient
real. A pure-noise column clears `abs(t) > 1` about **32%** of the time by chance alone, so throw
ten noise columns at a model and roughly three will look like improvements — the multiple-regression
page runs that experiment and shows
[the penalty being outrun](../03-linear-regression/02-multiple-linear-regression.md#why-the-penalty-fails).

| Job | Adjusted R² |
|---|---|
| Warn you that R² rose only because `p` rose | Good at this |
| Compare two nested models on the same rows | Fine |
| Compare models fitted to **different** targets or row counts | Invalid — `SST` differs |
| Select features from a large pool | Too permissive. Cross-validate instead |

:::tip
The reliable version of the same question needs no formula: fit both models, score both on rows
neither has seen, prefer the winner there. Adjusted R² is an in-sample approximation of that
comparison, invented when refitting a model fifty times was expensive. It no longer is.
:::

---

## MAPE puts the error in percent, and breaks near zero

MAPE divides each residual by its own true value before averaging, so every row contributes a
relative error:

```text
             100     n   | yᵢ − ŷᵢ |
MAPE (%)  =  ───  ·  Σ   ───────────
              n     i=1     | yᵢ |
```

On the original hand table:

| # | `y` | `ŷ` | `abs(r)` | `abs(r)/abs(y)` | as % |
|---|---|---|---|---|---|
| 1 | 52 | 49 | 3 | 3/52 = 0.0576923 | 5.76923% |
| 2 | 60 | 61 | 1 | 1/60 = 0.0166667 | 1.66667% |
| 3 | 71 | 69 | 2 | 2/71 = 0.0281690 | 2.81690% |
| 4 | 88 | 92 | 4 | 4/88 = 0.0454545 | 4.54545% |
| 5 | 95 | 95 | 0 | 0/95 = 0.0000000 | 0.00000% |
| | | | **10** | **0.1479825** | **14.79825%** |

```text
MAPE   = 14.79825% / 5 = 2.95965%              ≈ 2.96%
MAE/ȳ  = 2.0 / 73.2    = 0.0273224 = 2.73224%  ← not the same number
```

The two differ because MAPE is a **mean of ratios** and `MAE/ȳ` is a **ratio of means**. MAPE gives
row 1 — the cheapest house — more weight per rupee of error than row 5. That is either the point or
a distortion, depending on whether a 5% miss on a cheap house matters as much as on a dear one.

### Three ways MAPE misbehaves

**1. Undefined at `y = 0`, and scikit-learn hides it.** A true value of zero divides by zero.
scikit-learn does not raise; it substitutes `np.finfo(float).eps ≈ 2.22e−16` for the denominator,
so one zero-valued row produces a MAPE around `1e+15` and drowns every other row. Nothing warns
you.

**2. Over-prediction is punished without limit; under-prediction is capped at 100%.** With `y > 0`
and `ŷ ≥ 0`:

| `ŷ` | 0 | 50 | 150 | 300 | 10 000 |
|---|---|---|---|---|---|
| APE for `y = 100` | **100%** | 50% | 50% | 200% | 9900% |

Predicting zero is the worst an under-prediction can do. Over-prediction has no ceiling, so a model
tuned to minimise MAPE shades its forecasts **downward** — a documented bias, not a curiosity.

**3. Identical MAE, MAPE 100× apart.** Two rows, `y = [10, 1000]`, two constant models:

| Model | Absolute errors | MAE | APEs | MAPE |
|---|---|---|---|---|
| Predict 10 | `[0, 990]` | 495 | `[0%, 99%]` | **49.5%** |
| Predict 1000 | `[990, 0]` | 495 | `[9900%, 0%]` | **4950%** |

Same MAE. MAPE differs by a factor of 100, entirely because of *which* row carries the error.

### The two repairs

| Metric | Formula | Range | Fixes | Still broken |
|---|---|---|---|---|
| **MAPE** | `mean(abs(r)/abs(y)) × 100` | `[0, ∞)` | — | Zeros; over-prediction asymmetry |
| **sMAPE** | `mean(abs(r)/((abs(y)+abs(ŷ))/2)) × 100` | `[0, 200%]` | Bounded; less one-sided | Undefined when `y` and `ŷ` are both 0 |
| **WAPE** | `Σabs(r) / Σabs(y) × 100` | `[0, ∞)` | Survives individual zeros; no per-row division | Says nothing about single rows |

```text
sMAPE = (3/50.5 + 1/60.5 + 2/70.0 + 4/90.0 + 0/95.0) / 5 × 100
      = (0.0594059 + 0.0165289 + 0.0285714 + 0.0444444 + 0) / 5 × 100
      = 0.1489506 / 5 × 100 = 2.97901%   ≈ 2.98%

WAPE  = Σabs(r) / Σabs(y) = 10 / 366 = 0.0273224 = 2.73224%   ≈ 2.73%
```

WAPE landed on exactly `MAE/ȳ`, and that is no coincidence — divide both sums by `n`:

```text
Σabs(r)     Σabs(r)/n     MAE
───────  =  ─────────  =  ───
Σabs(y)     Σabs(y)/n      ȳ
```

WAPE **is** MAE rescaled by the mean of `y`. So if all you wanted was an error you could quote as
a percentage, WAPE gets you there without any of MAPE's pathologies — and it is what most
demand-planning teams actually report.

:::danger
`mean_absolute_percentage_error` returns a **fraction**, not a percentage. For the table above it
returns `0.0295965`, not `2.95965`. The name says "percentage" and the value does not. Multiply by
100 yourself, and check every dashboard you inherit for a factor-of-100 error.
:::

---

## Common Mistakes

| # | Mistake | Wrong | Right |
|---|---|---|---|
| 1 | Believing R² lives in `[0, 1]` | "R² came out −0.66, my code is broken" | `1 − SSE/SST` has no lower bound. −0.6586 means 66% more squared error than predicting `ȳ = 73.2` |
| 2 | Using `SSR/SST` on predictions that were not least-squares fitted | `1580.80 / 1322.80 = 1.1951` | Use `1 − SSE/SST = 1 − 30/1322.8 = 0.9773`, valid for any predictions at all |
| 3 | Quoting `SST = SSR + SSE` as a law | `1580.80 + 30 = 1610.80`, claimed to be `SST` | It equals `SST` only when the cross term `Σ(ŷ−ȳ)r` vanishes. Here it is −144, and `1610.80 − 288 = 1322.80` |
| 4 | Swapping `r2_score` arguments | `r2_score(y_pred, y_true)` | `r2_score(y_true, y_pred)`. Unlike MSE, R² is not symmetric — the denominator becomes the spread of `ŷ` |
| 5 | Using in-sample R² to choose how many features to keep | "R² went 0.820 → 0.835, so Model B wins" | In-sample R² *cannot* fall when features are added. Adjusted R² fell 0.8123 → 0.8075, so Model A wins |
| 6 | Treating Adjusted R² as a feature selector | Keeping every feature that nudges it up | It rises whenever `abs(t) > 1`, which pure noise clears ~32% of the time. Cross-validate |
| 7 | Comparing R² across different test splits | "R² dropped 0.91 → 0.86, the model degraded" | `SST` comes from the rows being scored. A new split changes the baseline, so R² moves with identical predictions |
| 8 | Counting the intercept in `p` | `n − p` with `p = 3` for two features | `p` excludes the intercept; the denominator is `n − p − 1`. Two features on 50 rows gives 47, not 48 |
| 9 | Expecting scikit-learn to report Adjusted R² | Hunting for `model.adjusted_score_` | It does not exist. Use `1 - (1 - r2) * (n - 1) / (n - p - 1)`, or `statsmodels` |
| 10 | Reading scikit-learn's MAPE as a percentage | Reporting "MAPE = 0.0296%" | It returns a fraction: `0.0295965` → **2.96%** |
| 11 | Running MAPE on data containing zeros | Accepting a MAPE of `4.5e+14` as real | scikit-learn divides by `2.22e−16` instead of raising. Drop zero rows, or use WAPE / MAE |
| 12 | Assuming `MAPE = MAE / mean(y)` | `2.0 / 73.2 = 2.73%`, labelled MAPE | That ratio is WAPE. MAPE is the mean of per-row ratios: 2.96%. They differ whenever `y` varies |

---

## Summary

| | |
|---|---|
| **R²** | `1 − SSE/SST`, with `SSE = Σ(y − ŷ)²` and `SST = Σ(y − ȳ)²` |
| Range | `(−∞, 1]`. Unitless. R² = 0 ties the baseline; R² &lt; 0 loses to it |
| **SSR** | `Σ(ŷ − ȳ)²` — the *explained* sum of squares |
| Decomposition | `SST = SSR + SSE + 2·Σ(ŷ − ȳ)(y − ŷ)`; the cross term is zero **only** for an OLS fit with intercept. `R² = SSR/SST` needs that same condition |
| `R² = r²` | Only for simple regression — one feature, with intercept. In general, any OLS fit with intercept gives `R² = corr(y, ŷ)²` |
| **Adjusted R²** | `1 − (1 − R²)·(n − 1)/(n − p − 1)` |
| `p` | Feature count, intercept **excluded**; degrees of freedom `n − p − 1` |
| `R²_adj` vs `R²` | `R²_adj ≤ R²` always; equal only at `p = 0`; undefined at `p = n − 1` |
| Adjusted R² rises iff | The added feature has `abs(t) > 1` |
| In-sample monotonicity | Adding any feature cannot lower R² — the old solution survives with coefficient 0 |
| `p = n − 1` | In-sample R² = 1 exactly. The fit interpolates |
| **MAPE** | `mean(abs(r)/abs(y)) × 100`. Range `[0, ∞)`. Undefined at `y = 0`, where scikit-learn substitutes `eps ≈ 2.22e−16` |
| MAPE asymmetry | Under-prediction ≤ 100%; over-prediction unbounded |
| **sMAPE** | `mean(abs(r)/((abs(y)+abs(ŷ))/2)) × 100`. Bounded by 200% |
| **WAPE** | `Σabs(r)/Σabs(y) × 100`, and `WAPE = MAE/ȳ` exactly |
| sklearn scale | `mean_absolute_percentage_error` returns a fraction, not a percentage |
| Adjusted R² in sklearn | Not implemented — a scorer cannot see `p` |

**Key takeaways**

- R² is a comparison, not a measurement: `1 − SSE/SST` scores you against predicting `ȳ` for every
  row. Change the rows and you change the rival.
- The five-house table gives `SSE = 30`, `SST = 1322.80`, so `R² = 0.9773` — 97.73% of the
  baseline's squared error removed.
- `SSR/SST` on that same table gives **1.1951**, above 1, because those predictions were invented
  rather than fitted. The cross term `Σ(ŷ−ȳ)r = −144` is what the identity assumes away.
- Fit the line properly (`ŷ = 39.0 + 11.4x`) and the identity closes exactly:
  `1299.60 + 23.20 = 1322.80`, with `R² = 0.98246145` from either formula — and `r² = 0.98246145`
  too, because there is one feature.
- Predicting a flat 60 lakh gives `SSE = 2194` and `R² = −0.6586`. Negative R² is the metric
  working, not failing.
- In-sample R² can never fall when you add a feature, because the fit can set the new coefficient
  to zero. So it structurally cannot diagnose an over-featured model.
- Adjusted R² divides each sum of squares by its own degrees of freedom, giving the multiplier
  `(n − 1)/(n − p − 1)` on `(1 − R²)` — on five rows and one feature, `4/3`: 0.9825 → 0.9766.
- Model A (2 features, R² 0.820) beats Model B (7 features, R² 0.835) once rent is paid: 0.8123
  versus 0.8075. Model B needed R² ≥ 0.8391 to break even.
- Adjusted R² keeps any feature with `abs(t) > 1`, which pure noise clears about 32% of the time.
  It is a sanity check, not a selector; AIC's penalty of 2 per parameter is strictly stronger.
- MAPE on the hand table is 2.96% while `MAE/ȳ` is 2.73% — a mean of ratios versus a ratio of
  means. MAPE over-weights the cheapest rows.
- MAPE caps under-prediction at 100% and leaves over-prediction unbounded, so minimising it biases
  forecasts low: two constant models with identical MAE of 495 score 49.5% and 4950%.
- WAPE equals `MAE/ȳ` exactly — 2.73% here — and survives zeros. If you need a percentage to
  quote, quote that one.

**Next in this section:** `03-residual-analysis-and-choosing-a-metric.md` — why a good R² can sit
on top of a badly wrong model, and how to pick one metric per problem.

**See also:** [Error in the Units of y](./01-error-in-the-units-of-y.md#none-of-the-three-means-anything-without-the-spread-of-y)
for why RMSE needs the spread of `y`, and [the `neg_*` scorer convention](./01-error-in-the-units-of-y.md#scikit-learn-negates-every-error-metric-on-purpose)
that R² alone escapes ·
[Multiple Linear Regression](../03-linear-regression/02-multiple-linear-regression.md#why-the-penalty-fails)
for Adjusted R² losing a race against noise features ·
[Simple Linear Regression](../03-linear-regression/01-simple-linear-regression.md#how-wrong-is-it-the-five-error-measures)
for where `SSE`, `SST` and `R²` first appear ·
[Train / Test Split](../02-data-preprocessing/06-train-test-split.md#the-split-lottery)
for why one split's R² is not the model's R²

---

## Run It Yourself

```python title="r_squared_and_mape.py"
"""R-squared, Adjusted R-squared and percentage error, from the ground up.

Deterministic: seeded once, no plots, no file writes, no network.
"""

import numpy as np
from sklearn.dummy import DummyRegressor
from sklearn.linear_model import LinearRegression
from sklearn.metrics import (
    mean_absolute_error,
    mean_absolute_percentage_error,
    r2_score,
)

np.random.seed(42)
np.set_printoptions(precision=4, suppress=True)


def head(title):
    print(f"\n{'=' * 70}\n{title}\n{'=' * 70}")


def adjusted_r2(r2_value, n_rows, n_features):
    """1 - (1 - R2) * (n - 1) / (n - p - 1). nan when p >= n - 1."""
    dof = n_rows - n_features - 1
    if dof <= 0:
        return float("nan")
    return 1 - (1 - r2_value) * (n_rows - 1) / dof


# ---------- 1. The three sums of squares, and the conditional identity ----------
head("1. SST, SSE, SSR on hand-picked predictions")

y = np.array([52.0, 60.0, 71.0, 88.0, 95.0])
y_hat = np.array([49.0, 61.0, 69.0, 92.0, 95.0])
r = y - y_hat
y_bar = y.mean()

sst = np.sum((y - y_bar) ** 2)
sse = np.sum(r ** 2)
ssr = np.sum((y_hat - y_bar) ** 2)
cross = np.sum((y_hat - y_bar) * r)

print(f"y = {y}   y_hat = {y_hat}   r = {r}   y_bar = {y_bar}")
print(f"SST = {sst:.4f}   SSE = {sse:.4f}   SSR = {ssr:.4f}")
print(f"R2 = 1 - SSE/SST     = {1 - sse / sst:.8f}")
print(f"r2_score(y, y_hat)   = {r2_score(y, y_hat):.8f}")
print(f"SSR/SST              = {ssr / sst:.8f}   <-- above 1")
print(f"SSR + SSE            = {ssr + sse:.4f}  vs  SST = {sst:.4f}")
print(f"cross = sum((y_hat - y_bar) * r) = {cross:.4f}")
print(f"SSR + SSE + 2*cross  = {ssr + sse + 2 * cross:.4f}   <-- now equals SST")
print("Residuals sum to zero but are NOT orthogonal to the fitted values, so the")
print("textbook decomposition does not apply.")

# ---------- 2. A real least-squares fit: the identity closes ----------
head("2. The same y, fitted properly")

X = np.array([[1.0], [2.0], [3.0], [4.0], [5.0]])
fit = LinearRegression().fit(X, y)
y_fit = fit.predict(X)
r_fit = y - y_fit

sse_fit = np.sum(r_fit ** 2)
ssr_fit = np.sum((y_fit - y_bar) ** 2)

print(f"b0 = {fit.intercept_:.4f}   b1 = {fit.coef_[0]:.4f}")
print(f"y_fit = {y_fit}   residuals = {r_fit}")
print(f"sum(residuals) = {r_fit.sum():.2e}")
print(f"SSE = {sse_fit:.4f}   SSR = {ssr_fit:.4f}   SST = {sst:.4f}")
print(f"SSR + SSE = {ssr_fit + sse_fit:.4f}   <-- equals SST")
print(f"cross term = {np.sum((y_fit - y_bar) * r_fit):.2e}   <-- zero, up to float error")
print(f"1 - SSE/SST = {1 - sse_fit / sst:.8f}   SSR/SST = {ssr_fit / sst:.8f}")
print(f"r2_score = {r2_score(y, y_fit):.8f}   fit.score(X, y) = {fit.score(X, y):.8f}")
print(f"adjusted R2 (n=5, p=1) = {adjusted_r2(r2_score(y, y_fit), 5, 1):.8f}")
pearson = np.corrcoef(X.ravel(), y)[0, 1]
print(f"corr(x, y) = {pearson:.8f}   corr(x, y)^2 = {pearson ** 2:.8f}  <-- = R2")
print(f"corr(y, y_fit)^2 = {np.corrcoef(y, y_fit)[0, 1] ** 2:.8f}  <-- the general form")

# ---------- 3. Zero and negative R2, and argument order ----------
head("3. Zero and negative R2")

print(f"predict y_bar ({y_bar}) everywhere:  R2 = {r2_score(y, np.full_like(y, y_bar)):.8f}")
flat_60 = np.full_like(y, 60.0)
sse_60 = np.sum((y - flat_60) ** 2)
print(f"predict 60 everywhere: SSE = {sse_60:.1f}, SSE/SST = {sse_60 / sst:.6f}, "
      f"R2 = {r2_score(y, flat_60):.8f}")
print(f"DummyRegressor(mean).score(X, y) = "
      f"{DummyRegressor(strategy='mean').fit(X, y).score(X, y):.8f}")
print(f"r2_score(y, y_fit)  (correct) = {r2_score(y, y_fit):.8f}")
print(f"r2_score(y_fit, y)  (swapped) = {r2_score(y_fit, y):.8f}  <-- MSE is symmetric, R2 is not")

# ---------- 4. Adding noise features: R2 up, adjusted and test R2 down ----------
head("4. Twelve junk features added one at a time")

n, n_train = 60, 40
x_real = np.random.uniform(0, 10, size=n)
target = 5.0 + 3.0 * x_real + np.random.normal(0, 2.0, size=n)
design = np.column_stack([x_real, np.random.normal(0, 1.0, size=(n, 12))])

print(f"{'p':>3} {'train R2':>11} {'adj R2':>11} {'test R2':>11}")
for p in range(1, 14):
    xs = design[:, :p]
    model = LinearRegression().fit(xs[:n_train], target[:n_train])
    tr = r2_score(target[:n_train], model.predict(xs[:n_train]))
    te = r2_score(target[n_train:], model.predict(xs[n_train:]))
    print(f"{p:>3} {tr:>11.6f} {adjusted_r2(tr, n_train, p):>11.6f} {te:>11.6f}")
print("Only column 0 carries signal. train R2 never falls; the other two do.")

print("\nEnough features to interpolate (y is pure noise, unrelated to X):")
m = 8
xs_small = np.random.normal(0, 1.0, size=(m, m - 1))
ys_small = np.random.normal(100, 15, size=m)
interp = LinearRegression().fit(xs_small, ys_small)
r2_interp = r2_score(ys_small, interp.predict(xs_small))
print(f"  n = {m}, p = {m - 1}:  in-sample R2 = {r2_interp:.10f}, "
      f"SSE = {np.sum((ys_small - interp.predict(xs_small)) ** 2):.2e}")
print(f"  adjusted R2 = {adjusted_r2(r2_interp, m, m - 1)}")

# ---------- 5. Model A versus Model B ----------
head("5. Two candidate models, 50 rows")

rows = 50
for name, p_feat, r2_val in [("Model A", 2, 0.820), ("Model B", 7, 0.835)]:
    print(f"{name}: p = {p_feat}, dof = {rows - p_feat - 1}, R2 = {r2_val:.3f}, "
          f"adjusted R2 = {adjusted_r2(r2_val, rows, p_feat):.8f}")
target_adj = adjusted_r2(0.820, rows, 2)
needed = 1 - (1 - target_adj) * (rows - 8) / (rows - 1)
print(f"Model B must reach R2 >= {needed:.8f} to tie Model A's adjusted R2")
print(f"It reached 0.835, losing by {needed - 0.835:.6f} of R2.")

# ---------- 6. MAPE, sMAPE, WAPE ----------
head("6. Percentage error")

ape = np.abs(r) / np.abs(y)
mae = mean_absolute_error(y, y_hat)
sk_mape = mean_absolute_percentage_error(y, y_hat)

print(f"per-row APE (%)   = {ape * 100}")
print(f"MAPE by hand      = {ape.mean() * 100:.6f} %")
print(f"sklearn MAPE      = {sk_mape:.8f}  <-- a fraction, x100 = {sk_mape * 100:.6f} %")
print(f"sMAPE             = "
      f"{(np.abs(r) / ((np.abs(y) + np.abs(y_hat)) / 2)).mean() * 100:.6f} %")
print(f"WAPE              = {np.abs(r).sum() / np.abs(y).sum() * 100:.6f} %")
print(f"MAE / y_bar       = {mae / y_bar * 100:.6f} %  <-- identical to WAPE")

print("\nA zero in y:")
y_zero, p_zero = np.array([0.0, 60.0, 71.0]), np.array([1.0, 61.0, 69.0])
print(f"  sklearn MAPE = {mean_absolute_percentage_error(y_zero, p_zero):.6e}")
print(f"  WAPE         = "
      f"{np.abs(y_zero - p_zero).sum() / np.abs(y_zero).sum() * 100:.6f} %")

print("\nSame MAE, MAPE 100x apart:")
pair = np.array([10.0, 1000.0])
for const in (10.0, 1000.0):
    pred = np.full_like(pair, const)
    print(f"  predict {const:>6.0f}: MAE = {mean_absolute_error(pair, pred):7.1f}, "
          f"MAPE = {mean_absolute_percentage_error(pair, pred) * 100:10.1f} %")

print("\nUnbounded above, capped at 100% below (y = 100):")
for pv in (0.0, 50.0, 150.0, 300.0, 10000.0):
    print(f"  y_hat = {pv:>8.0f}  ->  APE = {abs(100 - pv):>8.1f} %")
```

```text title="Output"
OUTPUT PENDING — run the script above and paste the result here.
```

### What to notice in that output

- Block 1 prints `SSR/SST` above 1 and `SSR + SSE` above `SST`. Both are corrected by the same
  cross term on the next line — the identity is conditional, and this is the condition failing.
- In block 2, `sum(residuals)` and the cross term print as something like `1e−14` rather than `0`.
  That is floating point; `LinearRegression` with an intercept forces both to zero algebraically.
- `fit.score(X, y)` and `r2_score(y, y_fit)` print the same digits. Every scikit-learn regressor's
  `.score()` is R², which is why `GridSearchCV` on a regressor optimises R² unless told otherwise.
- `corr(x, y)²` matches R² because there is exactly one feature. `corr(y, y_fit)²` matches too —
  and keeps matching once you add features, which the first equality does not.
- The swapped `r2_score(y_fit, y)` in block 3 returns a *different plausible number*, not an error
  and not a sign flip. Nothing in the output would tell you the call was wrong.
- Block 4's `train R2` column is monotone non-decreasing all the way down, by construction, while
  `adj R2` and `test R2` both peak early and fall. Eleven of the twelve added columns are noise.
  The interpolation demo below it prints R² = 1 on data where `y` is unrelated to `X`, and `nan`
  for adjusted R², because `n − p − 1 = 0`.
- In block 6, `sklearn MAPE` prints roughly `0.0296` where the hand computation prints `2.96`.
  The zero-valued row then produces a MAPE around `1e+14` with no warning, while WAPE stays sane.

**Things worth trying:**

1. In block 4, change `n_train` from 40 to 25 and predict first: does the peak of `adj R2` move
   earlier or later? Fewer rows means each feature costs a larger share of the degrees of freedom.
2. Replace the junk columns with twelve near-copies of `x_real` plus a tiny jitter, and predict
   what happens to `train R2` (nearly flat) versus the coefficients (wild). That is collinearity,
   not over-fitting.
3. In block 5, hunt for the `p` at which Model B's Adjusted R² would beat Model A's while R² stays
   fixed at 0.835. Predict whether such a `p` exists before you loop.
4. Rescale `y` by 100 000 in block 1 and re-run. Predict which of `SSE`, `SST`, `R²`, `MAPE` and
   `WAPE` change, then check.

---

## Practice Questions

*Work each one out on paper first, then check against the script's output. Some need a number,
some need an argument. **No answers are included, deliberately.***

| Tag | Means |
|---|---|
| `[THEORY]` | Derive, define, or argue. No code |
| `[PROG]` | Write the code |
| `[OUT]` | Predict the printed output before running |
| `[ANALYZE]` | Diagnose a described situation |

### R² and the baseline

**Q1. [THEORY]** State the formula for R² and name what each sum of squares measures. Which one
depends on the model, and which does not?

**Q2. [OUT]** For `y = [52, 60, 71, 88, 95]` and `ŷ = [49, 61, 69, 92, 95]`, compute `SST`, `SSE`
and R² by hand to four decimals.

**Q3. [THEORY]** Prove that predicting `ȳ` for every row gives R² exactly 0.

**Q4. [ANALYZE]** A colleague reports R² = 0.91 on train and R² = 0.94 on test. Impossible,
suspicious, or fine? Give a reason.

**Q5. [THEORY]** Why is R² unitless when RMSE is not? What does that let you do, and what does it
stop you doing?

### The decomposition

**Q6. [THEORY]** Write `y − ȳ` as a sum of two terms, expand the square, and identify the cross
term.

**Q7. [OUT]** For the hand-picked `ŷ` above, compute `Σ(ŷ − ȳ)r`, then verify that
`SSR + SSE + 2·(that value)` equals `SST`.

**Q8. [THEORY]** What property of a least-squares fit makes the cross term vanish, and why does it
also require an intercept term?

**Q9. [ANALYZE]** Someone computes R² as `SSR/SST` for a random forest and gets 1.34. What went
wrong, and what should they have computed?

**Q10. [PROG]** Write `sums_of_squares(y, y_hat)` returning `(sst, sse, ssr, cross)` and assert
`sst == ssr + sse + 2 * cross` to within `1e−9`.

### Negative R² and argument order

**Q11. [OUT]** Predicting a flat 60 for the five houses gives `SSE = 2194`. Compute R² and say in
words what the sign means.

**Q12. [THEORY]** Give the exact condition on `SSE` under which R² is negative.

**Q13. [THEORY]** `mean_squared_error(a, b) == mean_squared_error(b, a)` but
`r2_score(a, b) != r2_score(b, a)`. Explain the asymmetry by pointing at the formula.

**Q14. [ANALYZE]** The same predictions score R² = 0.88 on one 20% test split and 0.71 on another,
with no refitting. What changed?

### R² and features

**Q15. [THEORY]** Give the one-line argument for why adding a feature cannot lower in-sample R².

**Q16. [THEORY]** With `p = n − 1`, in-sample R² is exactly 1. Explain why, and say what the model
has actually learned.

**Q17. [ANALYZE]** Model A has 3 features and in-sample R² = 0.72; Model B has 30 and R² = 0.79.
What can you conclude about which generalises better? Justify.

**Q18. [PROG]** Fit a `LinearRegression` on one real feature, refit after appending a column of
`np.random.normal`, and assert in-sample R² did not decrease. Repeat with ten seeds.

### Adjusted R²

**Q19. [THEORY]** Write both forms of the Adjusted R² formula and show they are the same
expression.

**Q20. [OUT]** For `n = 5`, `p = 1`, `R² = 0.98246145`, compute Adjusted R² to six decimals.

**Q21. [OUT]** For 50 rows, compute Adjusted R² for `p = 2, R² = 0.820` and `p = 7, R² = 0.835`.
Which wins, and by how much?

**Q22. [THEORY]** By rearranging, find the R² a 7-feature model on 50 rows needs to tie the
2-feature model's Adjusted R² of 0.81234043.

**Q23. [THEORY]** Under what conditions is Adjusted R² negative while R² is positive? Give a
concrete `n`, `p`, R².

**Q24. [ANALYZE]** Why is Adjusted R² undefined at `p = n − 1`? Relate your answer to Q16.

**Q25. [THEORY]** State the `t`-statistic threshold above which adding a feature raises Adjusted
R². Compare it to the threshold for significance, and say what follows.

**Q26. [ANALYZE]** Two models are fitted to *different* targets — one to price, one to log(price) —
and their Adjusted R² values compared. Why is that meaningless?

**Q27. [PROG]** Write `adjusted_r2(r2, n, p)` returning `nan` when `n - p - 1 <= 0`, and test it
against the Model A / Model B figures.

### MAPE and its cousins

**Q28. [OUT]** Compute MAPE by hand for the five-house table to four decimals, then state what
`mean_absolute_percentage_error` would print.

**Q29. [THEORY]** Show why `MAPE ≠ MAE/ȳ` in general, and name the metric that *does* equal
`MAE/ȳ`.

**Q30. [OUT]** For `y = 100`, tabulate APE for `ŷ` of 0, 50, 150, 300 and 10 000. What is the
largest APE an under-prediction can produce?

**Q31. [ANALYZE]** A demand model tuned to minimise MAPE is later found to under-forecast almost
every week. Explain the mechanism using Q30.

**Q32. [OUT]** For `y = [10, 1000]`, compute MAE and MAPE for the constant predictions 10 and
1000. Explain why MAE agrees and MAPE does not.

**Q33. [OUT]** Compute sMAPE and WAPE for the five-house table, and state each one's upper bound.
A pipeline reports MAPE = `4.5e+14` — what is in the data, and which of these two would you use?

**Q34. [PROG]** Write `wape(y, y_hat)` and assert it equals `mean_absolute_error(y, y_hat) /
np.mean(y)` for three different arrays.

### Quick self-check

1. What baseline model does R² compare against?
2. What is the range of R², and what does R² &lt; 0 mean?
3. Which R² formula is always valid, and which is conditional?
4. What exactly must vanish for `SST = SSR + SSE` to hold?
5. Does `SST` depend on the model?
6. Can in-sample R² fall when you add a feature?
7. Does `p` include the intercept, and what are the residual degrees of freedom for 50 rows and 7
   features?
8. Is Adjusted R² ever larger than R², and at what `p` does it become undefined?
9. What `t`-statistic does a feature need to raise Adjusted R²?
10. Does scikit-learn implement Adjusted R², and what does `LinearRegression.score()` return?
11. Does `mean_absolute_percentage_error` return 2.96 or 0.0296 for a 2.96% error?
12. What happens to MAPE when one true value is 0?
13. What is the largest APE an under-prediction can produce, for positive `y`?
14. Which percentage metric equals `MAE / mean(y)` exactly?
15. Is `r2_score` symmetric in its arguments?
