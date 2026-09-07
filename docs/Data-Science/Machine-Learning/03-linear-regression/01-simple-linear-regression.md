---
sidebar_position: 1
title: Simple Linear Regression
description: Fitting a line to one feature — the two coefficients derived by hand and checked against scikit-learn, the five error measures computed from the same residuals, and why a genuinely useful feature can look exactly like noise.
tags: [machine-learning, linear-regression, scikit-learn]
toc_max_heading_level: 3
---

# Simple Linear Regression

> **Topic —** The first actual algorithm, and the one worth understanding completely, because almost
> everything later is a variation on it. This page fits a line to a single feature and works the
> arithmetic all the way through by hand — two coefficients, five error measures, no estimator doing
> anything you cannot check on paper.

---

## Regression versus classification

The distinction from [Types of Learning](../01-foundations/03-types-of-learning.md#the-rule-worth-memorising),
restated because this is where it starts to matter:

| | **Regression** | **Classification** |
|---|---|---|
| Predicts | A **continuous number** | A **category** from a fixed set |
| Target type | Numeric | Categorical |
| Does "close" count? | **Yes** — ₹52 lakh for a ₹50 lakh house is good | No — "cat" for a dog is simply wrong |
| Error measured as | A distance | A count of mistakes |
| Output range | Unbounded | One of `k` labels |

The load-bearing difference is the third row. Because closeness counts, regression can be scored by
*how far off* it was — which is what makes squared error the natural loss, and what makes the whole
algebraic solution below possible.

---

## The line, and where its two numbers come from

One feature, one target, a straight line:

```
y = b₀ + b₁·x
```

| Symbol | Name | Meaning |
|---|---|---|
| `b₁` | **slope** / coefficient | How much `y` changes per one-unit increase in `x` |
| `b₀` | **intercept** | The value of `y` when `x = 0` |

Fitting means choosing `b₀` and `b₁` to minimise the **sum of squared vertical distances** between
each point and the line. That phrase is usually where explanations stop. It shouldn't — the two
numbers come out of a short calculation you can do on paper, and doing it once removes most of the
mystery from everything that follows.

### The formulas

Minimising `Σ(yᵢ − b₀ − b₁xᵢ)²` — differentiate with respect to each coefficient, set both
derivatives to zero, solve — gives exactly this:

```
        Σ(xᵢ − x̄)(yᵢ − ȳ)        Sxy
b₁ =  ─────────────────────  =  ─────           b₀ = ȳ − b₁·x̄
           Σ(xᵢ − x̄)²            Sxx
```

Two things are worth noticing before computing anything.

**`b₁` is a ratio of sums about the means.** The numerator asks how `x` and `y` deviate *together*;
the denominator asks how much `x` deviates at all. If `x` barely varies, the denominator is tiny and
the slope is unstable — which is the same defect that makes a constant column
[fail a pre-flight audit](../02-data-preprocessing/01-loading-and-preparing-data.md#a-pre-flight-audit).

**`b₀` is not fitted independently.** Once the slope is known, the intercept is forced: the line must
pass through `(x̄, ȳ)`. Every least-squares line goes through the mean of the data. That is not a
convention, it falls out of the algebra.

### Worked all the way through

Five points, chosen so every intermediate value is exact:

| `x` | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|
| `y` | 2 | 4 | 5 | 4 | 5 |

`x̄ = 3`, `ȳ = 4`. The deviation table:

```text title="Output"
      x   y   (x−x̄)    (y−ȳ)   (x−x̄)(y−ȳ)   (x−x̄)²
      1   2     -2.0     -2.0           4.0       4.0
      2   4     -1.0      0.0          -0.0       1.0
      3   5      0.0      1.0           0.0       0.0
      4   4      1.0      0.0           0.0       1.0
      5   5      2.0      1.0           2.0       4.0
                                sums →           6.0      10.0
```

So `Sxy = 6`, `Sxx = 10`, and:

```
b₁ = 6 / 10 = 0.6
b₀ = 4 − 0.6 × 3 = 2.2

ŷ = 2.2 + 0.6·x
```

Check it against scikit-learn — `coef_ = 0.6000`, `intercept_ = 2.2000`. **Identical.** There is no
additional machinery inside `LinearRegression` for this case; it computes the same two numbers.

:::tip Read the third row of the deviation table

At `x = 3`, `(x − x̄) = 0`, so that point contributes **nothing** to either sum — its `y` value cannot
influence the slope at all. A point sitting at the mean of `x` has no leverage over the line's
tilt, only over its height. That is the beginning of the idea of **leverage**, and it is why outliers
far out along `x` are so much more dangerous than outliers in the middle.

:::

---

## How wrong is it? The five error measures

The fit produces predictions, the predictions produce residuals, and every standard error measure is
a different summary of those same residuals. Nothing new is needed — the table below is computed from
the numbers already on this page.

```text title="Output"
      x   y      ŷ   residual   residual²
      1   2    2.8       -0.8        0.64
      2   4    3.4        0.6        0.36
      3   5    4.0        1.0        1.00
      4   4    4.6       -0.6        0.36
      5   5    5.2       -0.2        0.04
```

Two aggregates carry everything else. **SSE** is the sum of the last column, `2.4` — the quantity the
fit minimised. **SST** is `Σ(yᵢ − ȳ)² = 6.0` — the error you would make predicting the mean every
time, which is the baseline any model has to beat.

| Measure | Formula | Value | Reads as |
|---|---|---|---|
| **MAE** | `Σ\|r\| / n` | **`0.6400`** | Average miss, in the units of `y` |
| **MSE** | `SSE / n` | **`0.4800`** | Average squared miss — units are `y²` |
| **RMSE** | `√MSE` | **`0.6928`** | Back in the units of `y`, but outlier-sensitive |
| **R²** | `1 − SSE/SST` | **`0.6000`** | Fraction of variance beaten off the mean baseline |
| **Adjusted R²** | `1 − (1−R²)(n−1)/(n−k−1)` | **`0.4667`** | R², penalised for using `k` features |

All four of the first group match scikit-learn's `mean_absolute_error`, `mean_squared_error`,
`root_mean_squared_error` and `r2_score` exactly. **Adjusted R² has no scikit-learn function** — you
compute it yourself, which is worth knowing before you go looking for one.

Three readings that matter more than the definitions:

**`R² = 0.6` means the model beat the mean by 60% of the available variance.** `R²` is not a
correlation and not an accuracy — it is a comparison against a specific, deliberately stupid
baseline. A model with `R² = 0` is exactly as good as always guessing `ȳ`. A negative `R²` is worse
than that, and is entirely possible on unseen data.

**MAE and RMSE differ here (`0.64` versus `0.69`) and the gap is informative.** RMSE ≥ MAE always,
with equality only when every residual has the same magnitude. The size of the gap is a signal about
whether a few large errors dominate.

**Adjusted R² dropped to `0.4667` from `0.6`** — a large fall, because with `n = 5` and `k = 1` the
penalty factor `(n−1)/(n−k−1) = 4/3` is severe. That severity is entirely a function of how small
`n` is relative to `k`, and it is the reason Adjusted R² behaves so differently on realistic data —
[the next page](./02-multiple-linear-regression.md#does-adjusted-r-actually-catch-the-noise) measures
what it does with 120 rows and finds something unexpected.

:::note Choosing between them is a separate question

This page computes the five so the arithmetic is never mysterious. *Which* one to report — and the
traps in each, including a genuine sign inversion in scikit-learn's cross-validation scoring —
belongs with **regression performance metrics**, along with residual diagnostics. Compute first,
choose later.

:::

---

## `r`, `b₁` and `R²` are three views of one fact

For a one-feature regression with an intercept, the correlation coefficient and the fit are not
separate pieces of information. Two exact identities:

```
b₁ = r × (s_y / s_x)            R² = r²
```

On the five points above, `r = 0.774597`, and both hold to every digit printed:

```text title="Output"
3. r, b1 AND R² ARE THE SAME FACT   (r = 0.774597)
   ddof=0:  r × (s_y/s_x) = 0.600000   b1 = 0.600000
   ddof=1:  r × (s_y/s_x) = 0.600000   b1 = 0.600000
   r² = 0.600000   R² = 0.600000
```

The `ddof` question — population or sample standard deviation — is the one people expect to matter
here, and it **does not**: the identity is exact either way. The same denominator appears in `r` and
in `s_y/s_x`, so it cancels. One less thing to get wrong.

The first identity says a correlation becomes a slope once you rescale it by the spread of the two
variables. The second is narrower than it looks:

:::danger `R² = r²` holds only for simple regression

With one feature and an intercept, `R²` is the squared correlation between `x` and `y`. With **two or
more** features it is not — there is no single `r` to square, and `R²` becomes the squared
correlation between `y` and the model's *predictions*. Carrying the `R² = r²` intuition into multiple
regression is a common and quiet error.

:::

---

## How much data does it take?

The recovered coefficients are never exactly right, because the noise is real. The useful question is
how fast the error shrinks. Theory is specific: the standard deviation of the estimated slope is

```
                σ
SD(b̂₁) = ───────────────
          √( n · Var(x) )
```

so the error should fall as `1/√n`, and `RMSE × √n` should be a **constant** — with `σ = 2` and
`x ~ Uniform(0, 10)`, that constant is `2/√8.3333 = 0.6928`.

Fitting `y = 2.5x + 7` three thousand times at each sample size:

```text title="Output"
4. HOW FAST DOES m̂ APPROACH THE TRUTH   (y = 2.5x + 7, 3000 fits per n)
   theory: SD(m̂) = σ/√(n·Var(x)), so RMSE×√n is constant = 0.6928
         n  RMSE(m̂ − 2.5)   RMSE×√n   vs theory
        50        0.099571    0.7041       +1.6%
       200        0.049592    0.7013       +1.2%
      1000        0.022168    0.7010       +1.2%
     10000        0.006912    0.6912       -0.2%
   ratio test:  2.008 (√4=2.000)   2.237 (√5=2.236)   3.207 (√10=3.162)
```

The scaling law holds, and tightly — every `RMSE × √n` sits within **1.6%** of the predicted
`0.6928`, and the ratio tests land on `2.008`, `2.237` and `3.207` against exact values of `2.000`,
`2.236` and `3.162`.

The practical consequence is discouraging arithmetic: **halving the error costs four times the data.**
Going from `n = 50` to `n = 10000` — 200× the data — improved the slope estimate by about 14×, which
is exactly `√200`.

:::warning Testing this with one fit per sample size gives a false answer

`|b̂₁ − 2.5|` is a random quantity, and `1/√n` describes how its *spread* scales, not how any single
draw behaves. Draw once per `n` and the numbers bounce around enough to look like no law at all —
they did, on the first attempt at this measurement. Averaging over many fits per `n` is not
statistical decoration here; it is the difference between the right conclusion and the wrong one.

:::

---

## What "linear" actually restricts

The most common misreading of linear regression is that it can only fit straight lines. It can't fit
*curves in its coefficients* — a completely different restriction.

The data below is a **parabola**, `y = 2x² − 3x + 5` plus noise:

```text title="Output"
5. 'LINEAR' MEANS LINEAR IN THE COEFFICIENTS
   given x            R² = 0.4559   coefficients [-2.8500]
   given x, x²        R² = 0.9826   coefficients [-3.0394  1.9711]
   given x, x², x³    R² = 0.9826   coefficients [-3.1011  1.9705  0.0113]
```

Given only `x`, the model manages `R² = 0.4559` — it is trying to fit a curve with a line. Given `x`
**and** `x²` as two columns, it reaches **`0.9826`**, and its coefficients `[-3.0394, 1.9711]` recover
the true `−3` and `2`.

Nothing about the estimator changed. `x²` is just another column of numbers, and the model is still
computing a weighted sum:

```
y = b₀ + b₁·x + b₂·(x²)
```

which is **linear in `b₀`, `b₁`, `b₂`** even though it draws a parabola. Adding `x³` gained nothing —
`R²` identical at `0.9826`, and the new coefficient came out at **`0.0113`**, near zero, correctly
reflecting that the true relationship is quadratic. A useless feature is often simply ignored rather
than harmful.

:::tip "Linear" is a statement about the coefficients, not the shape

A model is linear if the prediction is a **weighted sum of its inputs** — whatever those inputs are.

This is why feature engineering is so powerful here: `x²`, `log(x)`, `x₁ × x₂` and `sin(2πh/24)` are
all just columns, and each extends what a linear model can express without changing the model at all.
It is also why [adding `length × width`](../02-data-preprocessing/05-outliers-and-feature-engineering.md#interactions--the-product-a-linear-model-cannot-form)
took `R²` from `0.9023` to `0.9997`.

What linear regression genuinely cannot do is *discover* those columns for itself.

:::

---

## The assumptions

Linear regression is a model of the world, and it assumes four things.

| Assumption | Means | Violated when |
|---|---|---|
| **Linearity** | The relationship really is a weighted sum | Curvature is left in the residuals |
| **Independence** | Rows don't influence each other | Time series; repeated measures per subject |
| **Homoscedasticity** | Error spread is constant across the range | Errors fan out as `y` grows |
| **Normality of residuals** | Errors are roughly normally distributed | Needed for confidence intervals, not for fitting |

Two are worth stressing. **Independence** is the same requirement that made a random
[train/test split](../02-data-preprocessing/06-train-test-split.md#2-grouped-rows--the-worst-case)
invalid on grouped data — one violation, two consequences. And **normality of residuals** is often
over-emphasised: the coefficients are unbiased without it. It matters for inference, not for
prediction.

Checking them is residual work — plotting residuals against fitted values and looking for pattern,
spread or curvature — which belongs with **regression performance metrics**.

---

## Correlation with the target, and why it misleads

The obvious way to decide whether a feature is worth having is to correlate it with the target. Fit
each of three features on its own against house price, where the truth is
`price = 3000·size − 800·age + 50000` and `door_colour` is pure noise:

```text title="Output"
6. CORRELATION WITH THE TARGET   (true: price = 3000·size − 800·age + 50000)
   feature            corr   fitted b1  R² alone
   size            +0.9849     3043.86    0.9700
   age             -0.0392     -332.50    0.0015
   door_colour     +0.0419     5160.69    0.0018
```

`size` behaves as expected: correlation `+0.9849`, a fitted slope of `3043.86` against a true `3000`,
and `R² = 0.9700` on its own. The other two rows are the interesting ones.

**`age` has a real effect of `−800` per year and a marginal correlation of `−0.0392`.** Essentially
zero. Its solo `R²` is `0.0015`. On this evidence you would drop it.

**`door_colour` is meaningless and gets a fitted coefficient of `5160.69`.** A large-looking number,
attached to a column of pure noise. Coefficient magnitude alone tells you nothing — that number is
large because the feature's scale is small, not because the feature matters. Its `R²` of `0.0018` is
the honest signal, and it is *higher* than `age`'s.

So a genuinely useful feature and a meaningless one are **indistinguishable** by marginal correlation
here. The sign is right for `age` and that is all.

### Why the useful feature is invisible

Not a mystery, and worth doing the arithmetic. Price variance is dominated by other terms:

| Source | Rough contribution to the spread of `price` |
|---|---|
| `size` | 150 units × 3000 = **450,000** |
| `age` | 50 units × 800 = **40,000** |
| noise | `σ` = **20,000** |

`age`'s effect is real but roughly a tenth of `size`'s, and only twice the noise. Correlating `age`
against the raw `price` asks it to show up against all of that at once.

Remove `size`'s contribution first, then look again:

```text title="Output"
   now remove size's contribution from price and look again:
   corr(age,  price − size effect) = -0.5758
   corr(door, price − size effect) = -0.0742
   slope on age                    = -845.14   (true −800)
```

The same feature goes from `−0.0392` to **`−0.5758`** — from invisible to obviously important —
because the thing that was drowning it is gone. And the slope fitted on what remains is **`−845.14`**
against a true `−800`. `door_colour` stays at `−0.0742`, still noise, because it never had an effect
to reveal.

:::tip This is what "holding all else constant" buys you

A coefficient in a multiple regression is measured on exactly this basis — the variation left over
once the other features have been accounted for. That is why a multiple regression can find an effect
that no marginal correlation shows, and it is the single strongest argument for fitting features
jointly rather than screening them one at a time.

:::

---

## Common Mistakes

| # | Mistake | Wrong | Right |
|---|---|---|---|
| 1 | "Linear regression only fits straight lines" | It's limited to lines | Given `x²` it reached `R² = 0.9826` on a parabola |
| 2 | Fitting the intercept independently | Two free choices | `b₀ = ȳ − b₁x̄`; the line must pass through `(x̄, ȳ)` |
| 3 | Reading `R²` as an accuracy | 0.6 means "60% correct" | It beat the **mean baseline** by 60% of available variance |
| 4 | Assuming `R² ≥ 0` | It's a square, so positive | Negative on unseen data means worse than guessing `ȳ` |
| 5 | Looking for `adjusted_r2_score` in sklearn | It's in `metrics` | It isn't — compute it yourself |
| 6 | Carrying `R² = r²` into multiple regression | Always true | **Simple regression only** |
| 7 | Worrying about `ddof` in `b₁ = r·(s_y/s_x)` | Must pick correctly | It cancels — exact either way |
| 8 | Judging a feature by coefficient size | `5160.69` is a big effect | Pure noise; magnitude follows the feature's scale |
| 9 | Screening features by marginal correlation | Weak correlation ⇒ drop it | `age` at `−0.0392` had a real `−800` effect |
| 10 | Testing a `1/√n` claim with one fit per `n` | Errors bounce, so no law | Average over many fits; the law holds to 1.6% |
| 11 | Over-worrying about residual normality | It must be normal to fit | Needed for inference, not for coefficients |
| 12 | Forgetting independence | Rows are rows | Same violation as grouped train/test splits |

---

## Summary

| | |
|---|---|
| Model | `y = b₀ + b₁·x` |
| Slope | `b₁ = Sxy / Sxx`, a ratio of sums about the means |
| Intercept | `b₀ = ȳ − b₁x̄` — forced, not fitted |
| Fitted by | Minimising the **sum of squared** vertical distances |
| "Linear" means | The prediction is a **weighted sum of the inputs** |
| Error measures | MAE, MSE, RMSE from the residuals; `R²` against the mean baseline |
| Identities | `b₁ = r·(s_y/s_x)` and `R² = r²` — the latter *only* with one feature |
| Assumptions | Linearity, independence, homoscedasticity, normal residuals |

**Key takeaways**

- Regression predicts a **number** where closeness counts; classification predicts a **category**
  where it doesn't
- Squared error is chosen because it is **convex and differentiable**, which is what permits the
  closed-form solution
- The whole fit is two sums: `Sxy = 6` and `Sxx = 10` give `b₁ = 0.6`, and `b₀ = 2.2` follows —
  **identical** to scikit-learn's `coef_` and `intercept_`
- **Every least-squares line passes through `(x̄, ȳ)`** — the intercept is not an independent choice
- A point at `x = x̄` contributes **zero** to both sums, so it has no influence on the slope — the
  origin of **leverage**
- All five error measures are summaries of the **same residuals**: `MAE 0.6400`, `MSE 0.4800`,
  `RMSE 0.6928`, `R² 0.6000`, `Adjusted R² 0.4667`
- `R²` compares against **predicting the mean every time**, and can go negative out of sample
- **Adjusted R² has no scikit-learn function**; it fell to `0.4667` from `0.6000` because `n = 5`
  makes the `(n−1)/(n−k−1)` penalty severe
- `b₁ = r·(s_y/s_x)` is exact under **both** `ddof=0` and `ddof=1` — the term cancels
- `R² = r²` holds for **simple regression only**
- Coefficient error falls as **`1/√n`**, verified to within **1.6%** of the predicted constant
  `0.6928` — so **halving the error costs 4× the data**
- **"Linear" constrains the coefficients, not the shape** — given `x` and `x²`, `R²` went `0.4559` →
  `0.9826` on a parabola, and the spurious `x³` coefficient came out at `0.0113`
- Pure noise (`door_colour`) drew a fitted coefficient of **`5160.69`** — magnitude is not evidence
- `age`'s real `−800` effect showed a marginal correlation of only **`−0.0392`**, lower in magnitude
  than the noise feature's `+0.0419`
- Remove `size`'s contribution and `age`'s correlation jumps to **`−0.5758`** with a fitted slope of
  **`−845.14`** — which is what a multiple regression does automatically

**Next in this section:** [Multiple Linear Regression](./02-multiple-linear-regression.md) — more than
one feature, the normal equations solved by hand, and what happens to a coefficient when two features
carry the same information

**See also:** [Types of Learning](../01-foundations/03-types-of-learning.md#the-rule-worth-memorising)
for regression versus classification · [Outliers and Feature Engineering](../02-data-preprocessing/05-outliers-and-feature-engineering.md#interactions--the-product-a-linear-model-cannot-form)
for the interaction a linear model cannot form · [Loading and Preparing Data](../02-data-preprocessing/01-loading-and-preparing-data.md#a-pre-flight-audit)
for the constant-column check that a zero `Sxx` implies

---

## Run It Yourself

```python title="simple_linear_regression.py"
"""Simple linear regression — the coefficients by hand, the five error measures, and what 'linear' restricts."""

import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.metrics import (mean_absolute_error, mean_squared_error,
                             root_mean_squared_error, r2_score)

# ---------- 1. the coefficients, by hand ----------
x = np.array([1, 2, 3, 4, 5], dtype=float)
y = np.array([2, 4, 5, 4, 5], dtype=float)
xb, yb = x.mean(), y.mean()

print("1. LEAST SQUARES BY HAND")
print(f"   x̄ = {xb:.1f}   ȳ = {yb:.1f}\n")
print(f"   {'x':>4}{'y':>4}{'(x−x̄)':>9}{'(y−ȳ)':>9}{'(x−x̄)(y−ȳ)':>14}{'(x−x̄)²':>10}")
for xi, yi in zip(x, y):
    print(f"   {xi:>4.0f}{yi:>4.0f}{xi - xb:>9.1f}{yi - yb:>9.1f}"
          f"{(xi - xb) * (yi - yb):>14.1f}{(xi - xb) ** 2:>10.1f}")
Sxy = ((x - xb) * (y - yb)).sum()
Sxx = ((x - xb) ** 2).sum()
print(f"   {'':>17}{'sums →':>18}{Sxy:>14.1f}{Sxx:>10.1f}")

b1 = Sxy / Sxx
b0 = yb - b1 * xb
print(f"\n   b1 = Sxy / Sxx = {Sxy:.0f} / {Sxx:.0f} = {b1}")
print(f"   b0 = ȳ − b1·x̄ = {yb:.0f} − {b1}×{xb:.0f} = {b0}")
print(f"   fitted:  ŷ = {b0} + {b1}·x")

pred = b0 + b1 * x
resid = y - pred
print(f"\n   {'x':>4}{'y':>4}{'ŷ':>7}{'residual':>11}{'residual²':>12}")
for xi, yi, pi, ri in zip(x, y, pred, resid):
    print(f"   {xi:>4.0f}{yi:>4.0f}{pi:>7.1f}{ri:>11.1f}{ri ** 2:>12.2f}")

m = LinearRegression().fit(x.reshape(-1, 1), y)
print(f"\n   scikit-learn: coef_ = {m.coef_[0]:.4f}   intercept_ = {m.intercept_:.4f}   -> identical")

# ---------- 2. the five error measures, from those residuals ----------
n, k = len(x), 1
SSE = (resid ** 2).sum()
SST = ((y - yb) ** 2).sum()
r2 = 1 - SSE / SST
print(f"\n2. THE FIVE ERROR MEASURES   (SSE = {SSE:.1f}, SST = {SST:.1f}, n = {n}, k = {k})")
print(f"   {'measure':<14}{'by hand':>10}{'sklearn':>10}   formula")
rows = [
    ("MAE", np.abs(resid).mean(), mean_absolute_error(y, pred), "Σ|r| / n"),
    ("MSE", SSE / n, mean_squared_error(y, pred), "SSE / n"),
    ("RMSE", np.sqrt(SSE / n), root_mean_squared_error(y, pred), "√MSE"),
    ("R²", r2, r2_score(y, pred), "1 − SSE/SST"),
]
for name, hand, sk, formula in rows:
    print(f"   {name:<14}{hand:>10.4f}{sk:>10.4f}   {formula}")
adj = 1 - (1 - r2) * (n - 1) / (n - k - 1)
print(f"   {'Adjusted R²':<14}{adj:>10.4f}{'—':>10}   1 − (1−R²)(n−1)/(n−k−1)  [no sklearn function]")

# ---------- 3. three descriptions of the same fit ----------
r = np.corrcoef(x, y)[0, 1]
print(f"\n3. r, b1 AND R² ARE THE SAME FACT   (r = {r:.6f})")
for dd in (0, 1):
    print(f"   ddof={dd}:  r × (s_y/s_x) = "
          f"{r * (np.std(y, ddof=dd) / np.std(x, ddof=dd)):.6f}   b1 = {b1:.6f}")
print(f"   r² = {r ** 2:.6f}   R² = {r2:.6f}")

# ---------- 4. how fast does the estimate improve ----------
SIGMA, VAR_X = 2.0, 100 / 12          # x ~ Uniform(0, 10)
predicted = SIGMA / np.sqrt(VAR_X)
print(f"\n4. HOW FAST DOES m̂ APPROACH THE TRUTH   (y = 2.5x + 7, 3000 fits per n)")
print(f"   theory: SD(m̂) = σ/√(n·Var(x)), so RMSE×√n is constant = {predicted:.4f}")
print(f"   {'n':>7}{'RMSE(m̂ − 2.5)':>16}{'RMSE×√n':>10}{'vs theory':>12}")
rmses = []
for nn in [50, 200, 1000, 10000]:
    errs = []
    for seed in range(3000):
        rr = np.random.RandomState(seed + nn * 100003)
        xs = rr.uniform(0, 10, nn)
        ys = 2.5 * xs + 7.0 + rr.normal(0, SIGMA, nn)
        errs.append(LinearRegression().fit(xs.reshape(-1, 1), ys).coef_[0] - 2.5)
    rmse = np.sqrt(np.mean(np.array(errs) ** 2))
    rmses.append(rmse)
    scaled = rmse * np.sqrt(nn)
    print(f"   {nn:>7}{rmse:>16.6f}{scaled:>10.4f}{100 * (scaled - predicted) / predicted:>+11.1f}%")
print("   ratio test:  " + "   ".join(
    f"{rmses[i] / rmses[i + 1]:.3f} (√{[4, 5, 10][i]}={np.sqrt([4, 5, 10][i]):.3f})" for i in range(3)))

# ---------- 5. 'linear' constrains the coefficients, not the shape ----------
rr = np.random.RandomState(50)
xc = rr.uniform(-3, 3, 200)
yc = 2 * xc ** 2 - 3 * xc + 5 + rr.normal(0, 1, 200)   # a parabola
print("\n5. 'LINEAR' MEANS LINEAR IN THE COEFFICIENTS")
for label, F in [("x", xc.reshape(-1, 1)),
                 ("x, x²", np.column_stack([xc, xc ** 2])),
                 ("x, x², x³", np.column_stack([xc, xc ** 2, xc ** 3]))]:
    fit = LinearRegression().fit(F, yc)
    print(f"   given {label:<12} R² = {fit.score(F, yc):.4f}   coefficients "
          f"{np.array2string(fit.coef_, precision=4, floatmode='fixed')}")

# ---------- 6. correlation with the target ----------
rr = np.random.RandomState(4)
n2 = 120
size = rr.uniform(50, 200, n2)
age = rr.uniform(0, 50, n2)
door = rr.normal(0, 1, n2)                              # front-door colour: pure noise
price = 3000 * size - 800 * age + 50000 + rr.normal(0, 20000, n2)

print("\n6. CORRELATION WITH THE TARGET   (true: price = 3000·size − 800·age + 50000)")
print(f"   {'feature':<14}{'corr':>9}{'fitted b1':>12}{'R² alone':>10}")
for nm, v in [("size", size), ("age", age), ("door_colour", door)]:
    f1 = LinearRegression().fit(v.reshape(-1, 1), price)
    print(f"   {nm:<14}{np.corrcoef(v, price)[0, 1]:>+9.4f}{f1.coef_[0]:>12.2f}"
          f"{f1.score(v.reshape(-1, 1), price):>10.4f}")

resid_price = price - LinearRegression().fit(size.reshape(-1, 1), price).predict(size.reshape(-1, 1))
print("\n   now remove size's contribution from price and look again:")
print(f"   corr(age,  price − size effect) = {np.corrcoef(age, resid_price)[0, 1]:+.4f}")
print(f"   corr(door, price − size effect) = {np.corrcoef(door, resid_price)[0, 1]:+.4f}")
print(f"   slope on age                    = "
      f"{LinearRegression().fit(age.reshape(-1, 1), resid_price).coef_[0]:.2f}   (true −800)")
```

```text title="Output"
1. LEAST SQUARES BY HAND
   x̄ = 3.0   ȳ = 4.0

      x   y   (x−x̄)    (y−ȳ)   (x−x̄)(y−ȳ)   (x−x̄)²
      1   2     -2.0     -2.0           4.0       4.0
      2   4     -1.0      0.0          -0.0       1.0
      3   5      0.0      1.0           0.0       0.0
      4   4      1.0      0.0           0.0       1.0
      5   5      2.0      1.0           2.0       4.0
                                sums →           6.0      10.0

   b1 = Sxy / Sxx = 6 / 10 = 0.6
   b0 = ȳ − b1·x̄ = 4 − 0.6×3 = 2.2
   fitted:  ŷ = 2.2 + 0.6·x

      x   y      ŷ   residual   residual²
      1   2    2.8       -0.8        0.64
      2   4    3.4        0.6        0.36
      3   5    4.0        1.0        1.00
      4   4    4.6       -0.6        0.36
      5   5    5.2       -0.2        0.04

   scikit-learn: coef_ = 0.6000   intercept_ = 2.2000   -> identical

2. THE FIVE ERROR MEASURES   (SSE = 2.4, SST = 6.0, n = 5, k = 1)
   measure          by hand   sklearn   formula
   MAE               0.6400    0.6400   Σ|r| / n
   MSE               0.4800    0.4800   SSE / n
   RMSE              0.6928    0.6928   √MSE
   R²                0.6000    0.6000   1 − SSE/SST
   Adjusted R²       0.4667         —   1 − (1−R²)(n−1)/(n−k−1)  [no sklearn function]

3. r, b1 AND R² ARE THE SAME FACT   (r = 0.774597)
   ddof=0:  r × (s_y/s_x) = 0.600000   b1 = 0.600000
   ddof=1:  r × (s_y/s_x) = 0.600000   b1 = 0.600000
   r² = 0.600000   R² = 0.600000

4. HOW FAST DOES m̂ APPROACH THE TRUTH   (y = 2.5x + 7, 3000 fits per n)
   theory: SD(m̂) = σ/√(n·Var(x)), so RMSE×√n is constant = 0.6928
         n  RMSE(m̂ − 2.5)   RMSE×√n   vs theory
        50        0.099571    0.7041       +1.6%
       200        0.049592    0.7013       +1.2%
      1000        0.022168    0.7010       +1.2%
     10000        0.006912    0.6912       -0.2%
   ratio test:  2.008 (√4=2.000)   2.237 (√5=2.236)   3.207 (√10=3.162)

5. 'LINEAR' MEANS LINEAR IN THE COEFFICIENTS
   given x            R² = 0.4559   coefficients [-2.8500]
   given x, x²        R² = 0.9826   coefficients [-3.0394  1.9711]
   given x, x², x³    R² = 0.9826   coefficients [-3.1011  1.9705  0.0113]

6. CORRELATION WITH THE TARGET   (true: price = 3000·size − 800·age + 50000)
   feature            corr   fitted b1  R² alone
   size            +0.9849     3043.86    0.9700
   age             -0.0392     -332.50    0.0015
   door_colour     +0.0419     5160.69    0.0018

   now remove size's contribution from price and look again:
   corr(age,  price − size effect) = -0.5758
   corr(door, price − size effect) = -0.0742
   slope on age                    = -845.14   (true −800)
```

### What to notice in that output

- **The `x = 3` row is all zeros in the product column.** That point cannot affect the slope. Change
  its `y` from 5 to 500 and `b₁` stays at `0.6` — only `b₀` moves.
- **`SSE = 2.4` against `SST = 6.0`** is the entire content of `R² = 0.6`. The model removed `3.6` of
  the `6.0` total squared error available.
- **`door_colour`'s coefficient (`5160.69`) is larger than `age`'s (`−332.50`)**, and `door_colour` is
  noise while `age` has a real effect. If coefficient size were evidence, this pair would prove the
  opposite of the truth.
- **`age`'s solo `R²` (`0.0015`) is lower than the noise feature's (`0.0018`).** Marginal screening
  does not merely underrate `age` here — it ranks it *below* a column that means nothing.
- **`RMSE × √n` barely moves across a 200× change in `n`** (`0.7041 → 0.6912`). That flatness *is*
  the `1/√n` law; a trend in that column would be evidence against it.
- **The `x³` coefficient is `0.0113`, not zero.** With finite noisy data a spurious feature gets a
  small non-zero weight, which is why it costs a little out-of-sample even when it changes `R²` by
  nothing.

**Things worth trying:**

1. Change `y[2]` from `5` to `500` and re-run section 1. The slope is unchanged; only the intercept
   moves. Then change `y[4]` instead and watch the slope swing.
2. Add a sixth point at `x = 20` with `y` on the line, and see how much a single high-leverage point
   tightens `Sxx` and stabilises the slope.
3. In section 4, change `σ` from `2.0` to `5.0`. The predicted constant becomes `5/√8.3333 = 1.7321`
   — check that the measurement follows.
4. In section 4, narrow `x` to `uniform(4, 6)`. `Var(x)` collapses, so the predicted constant grows
   sharply — the same amount of data buys a much worse slope estimate.
5. In section 6, reduce the noise `σ` from `20000` to `2000` and watch `age`'s marginal correlation
   become visible without removing `size`.

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

### Deriving the coefficients

**D1. [THEORY]** Write the formulas for `b₁` and `b₀`, naming every symbol.

**D2. [PROG]** For `x = [2, 4, 6, 8]` and `y = [3, 7, 8, 12]`, compute `x̄`, `ȳ`, `Sxy`, `Sxx`, `b₁`
and `b₀` by hand, then confirm with `LinearRegression`.

**D3. [THEORY]** Why is `b₀` not an independent choice once `b₁` is known? What point must every
least-squares line pass through?

**D4. [OUT]** In the deviation table, the `x = 3` row contributes `0.0` to both sums. What does that
imply about that point's influence on the slope?

**D5. [ANALYZE]** What happens to `b₁` as `Sxx` approaches zero, and what does a near-zero `Sxx` say
about the feature?

**D6. [THEORY]** Give two reasons squared error is minimised rather than absolute error.

### The error measures

**M1. [PROG]** From the residuals `[−0.8, 0.6, 1.0, −0.6, −0.2]`, compute MAE, MSE and RMSE without
using scikit-learn.

**M2. [THEORY]** What baseline does `R²` compare the model against? What does `R² = 0` mean?

**M3. [ANALYZE]** Can `R²` be negative? Explain when, and why that is not a contradiction.

**M4. [OUT]** `SSE = 2.4` and `SST = 6.0`. Derive `R²`, and state in words what the model achieved.

**M5. [THEORY]** Why is RMSE never smaller than MAE? When are they equal?

**M6. [OUT]** Adjusted R² came out at `0.4667` against an `R²` of `0.6000`. Which term in the formula
caused a drop that large, and what would happen to it if `n` were 500 instead of 5?

**M7. [ANALYZE]** MSE is in units of `y²`. Give a situation where you would report it anyway.

### Correlation, slope and R²

**C1. [THEORY]** State the two identities linking `r`, `b₁` and `R²`, and the condition each requires.

**C2. [ANALYZE]** Someone claims `R² = r²` for their five-feature model. Why is that wrong, and what
is `R²` the squared correlation *of* in that case?

**C3. [OUT]** The identity `b₁ = r·(s_y/s_x)` held under both `ddof=0` and `ddof=1`. Explain why the
choice cannot matter.

**C4. [PROG]** Verify both identities on a dataset of your own, printing the difference rather than a
boolean.

### Sample size

**S1. [OUT]** `RMSE × √n` was `0.7041`, `0.7013`, `0.7010`, `0.6912`. What does the near-constancy of
that column demonstrate?

**S2. [THEORY]** Given `SD(b̂₁) = σ/√(n·Var(x))`, how much data is needed to halve the error on `b₁`?

**S3. [ANALYZE]** The first attempt at this measurement used one fit per sample size and concluded the
law failed. Diagnose the error precisely.

**S4. [ANALYZE]** Two datasets have the same `n` and same `σ`, but one measured `x` over a narrow
range. Which gives the better slope estimate, and why?

**S5. [PROG]** Reproduce the sweep with `σ = 5.0`, predict the constant beforehand, and check it.

### What "linear" means

**L1. [OUT]** Given only `x`, `R²` was `0.4559`; given `x` and `x²`, `0.9826`. The data is a parabola.
Explain how a *linear* model achieves the second number.

**L2. [THEORY]** Complete the definition: a model is linear if the prediction is ___.

**L3. [OUT]** Adding `x³` left `R²` at `0.9826` and gave that column a coefficient of `0.0113`. What
did the model do with it, and why isn't the coefficient exactly zero?

**L4. [ANALYZE]** If any function of the features can be added as a column, what is the real
limitation of a linear model?

**L5. [THEORY]** Name the four assumptions and what violates each.

**L6. [ANALYZE]** Which assumption is shared with the requirement for a valid random train/test split?

### Reading a feature's usefulness

**F1. [OUT]** `age` has a true effect of `−800` and a marginal correlation of `−0.0392`. Explain how
both can be true.

**F2. [OUT]** `door_colour` is pure noise and got a coefficient of `5160.69`. Why is that number large,
and what should you look at instead?

**F3. [ANALYZE]** `age`'s solo `R²` (`0.0015`) is *below* the noise feature's (`0.0018`). What does
that do to the case for correlation-based feature screening?

**F4. [OUT]** Removing `size`'s contribution took `age`'s correlation from `−0.0392` to `−0.5758`.
What was hiding it, and what does a multiple regression do about it automatically?

**F5. [PROG]** Build a target dominated by one strong feature plus a weak second one, and show the
weak feature's correlation before and after removing the strong one.

**F6. [ANALYZE]** You are told to drop every feature with `|r| < 0.2` against the target. Argue
against it using the numbers on this page.

### Quick self-check

1. Write the formulas for `b₁` and `b₀`.
2. What point does every least-squares line pass through?
3. What quantity does fitting minimise?
4. Give two reasons for squaring the errors.
5. What is `SST`, and what baseline does it represent?
6. `R² = 0.6` — say what that means without using the word "accuracy".
7. Can `R²` be negative?
8. Which of the five measures has no scikit-learn function?
9. When does `R² = r²` hold?
10. Does `ddof` affect `b₁ = r·(s_y/s_x)`?
11. How much extra data halves the error on a coefficient?
12. What does "linear" restrict?
13. How does a linear model fit a parabola?
14. Name the four assumptions.
15. Can a feature with near-zero marginal correlation be useful?
16. Does a large coefficient mean an important feature?
