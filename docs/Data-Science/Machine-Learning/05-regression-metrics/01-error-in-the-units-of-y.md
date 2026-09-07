---
sidebar_position: 1
title: Error in the Units of y
description: Why MAE, MSE and RMSE can report three different numbers for the same predictions, why RMSE is never below MAE, what their ratio tells you about outliers, and why scikit-learn hands back a negative mean squared error.
tags: [machine-learning, linear-regression, metrics, scikit-learn]
toc_max_heading_level: 3
---

# Error in the Units of y

> **Topic —** [Optimisation](../04-optimisation/01-loss-functions.md) chose the loss a model
> *minimises while fitting*. This page covers the numbers you *report afterwards*: MAE, MSE and RMSE.
> They are three averages of the same residuals, and they disagree on purpose. It settles four
> confusions: why RMSE is always at least MAE, what the gap between them measures, why an MSE of
> `6.0` cannot be quoted in rupees, and why `cross_val_score` returns `-6.0`.

---

## In plain words

A fitted model gives you a predicted number. The data gives you the true number. Subtract them and
you have a **miss** — one per row. A metric is nothing more than a rule for turning a whole column of
misses into a single number.

There are only three sensible rules on this page, and they differ in one decision: **how harshly to
treat a big miss compared with several small ones.**

- **MAE** treats every rupee of miss the same. Ten misses of ₹1 lakh cost exactly what one miss of
  ₹10 lakh costs.
- **MSE** squares each miss first, so one miss of ₹10 lakh costs ten times what ten misses of ₹1 lakh
  cost. The price of that is that the answer is in *squared* lakhs, which nobody can picture.
- **RMSE** takes the square root of MSE, which puts the answer back into lakhs — but it keeps MSE's
  opinion that big misses are disproportionately bad.

That is the whole page. What follows is the arithmetic that makes the difference concrete, the exact
identity linking the three, and the one scikit-learn convention that reverses every sign.

### Words used on this page

| Term | Say it as | What it means here |
|---|---|---|
| Residual | "ruh-ZID-you-al" | One row's miss: true value minus predicted value, `r = y − ŷ` |
| `ŷ` | "y-hat" | The model's prediction for a row |
| MAE | "M-A-E" | Mean Absolute Error — the average size of a miss, ignoring direction |
| MSE | "M-S-E" | Mean Squared Error — the average of the squared misses |
| RMSE | "R-M-S-E" | Root Mean Squared Error — the square root of MSE |
| RSS / SSE | "R-S-S" | Residual Sum of Squares — the total of the squared misses, before dividing by `n` |
| Loss | "loss" | The quantity minimised *during* fitting |
| Metric | "MET-rik" | The quantity reported *after* fitting, to a human |
| Bias of the residuals | — | Their mean. Non-zero means the model is systematically high or low |
| Scorer | "SCOR-er" | A scikit-learn object that wraps a metric so bigger always means better |
| Scale-dependent | — | Changes value if you re-express `y` in different units |
| Baseline | "BASE-line" | The score of predicting the mean of `y` for every row |

The five things this page settles:

1. Which of the three you can say out loud to someone who does not know the model.
2. Why `RMSE ≥ MAE` is a theorem, not a coincidence, and what closes the gap.
3. What a ratio of `RMSE / MAE` near `1.0`, near `1.25`, or near `√n` each tell you.
4. Why `mean_squared_error` is positive but `scoring='neg_mean_squared_error'` is negative.
5. Why every number on this page is meaningless until you know the spread of `y`.

:::tip If you only take one thing from this page
The three metrics are locked together by one exact identity:

`RMSE² = MAE² + var(|r|)`

The gap between RMSE and MAE is *precisely* the spread of the absolute errors. Equal-sized misses
close the gap to zero. One dominating miss opens it as wide as it goes.
:::

---

## A metric reports, a loss decides

The two words get used interchangeably and they are not the same job.

| | Loss | Metric |
|---|---|---|
| When | During fitting | After fitting |
| Read by | The optimiser | A person |
| Must be | Differentiable, cheap, well-behaved | Interpretable |
| Changing it | Changes the fitted coefficients | Changes nothing about the model |

Least squares minimises squared error, so MSE is that model's loss *and* a legitimate metric for it.
That coincidence is why the two words blur. But nothing stops you fitting with squared error and
reporting MAE — the coefficients are already fixed by then, and MAE just describes them differently.

The reverse matters more: **switching the metric never improves the model.** If MAE is what you
actually care about, reporting MAE is not enough; you have to *fit* with absolute error, which is a
different line. That distinction is worked through in
[Loss Functions](../04-optimisation/01-loss-functions.md#absolute-error-does-not-care-how-wrong-an-outlier-is).

---

## All three metrics are the same residuals, summarised differently

Start from one residual per row. Everything else is an average over that column.

```text
residual        rᵢ = yᵢ − ŷᵢ

RSS (SSE)       Σ rᵢ²                              total squared miss
MAE             (1/n) Σ |rᵢ|                       mean absolute error
MSE             (1/n) Σ rᵢ²      = RSS / n         mean squared error
RMSE            √( (1/n) Σ rᵢ² ) = √MSE            root mean squared error
```

Sign convention: `y − ŷ`. A **positive** residual means the model **under**-predicted — the truth was
higher than the guess. Reversing the subtraction flips every sign and changes none of the three
metrics, because all three destroy the sign.

### Worked all the way through

Five houses, prices in lakhs of rupees, and one model's predictions.

| House | `y` (true) | `ŷ` (predicted) | `r = y − ŷ` | `abs(r)` | `r²` |
|---|---|---|---|---|---|
| 1 | 52 | 49 | **+3** | 3 | 9 |
| 2 | 60 | 61 | **−1** | 1 | 1 |
| 3 | 71 | 69 | **+2** | 2 | 4 |
| 4 | 88 | 92 | **−4** | 4 | 16 |
| 5 | 95 | 95 | **0** | 0 | 0 |
| | | | **Σr = 0** | **Σ = 10** | **Σ = 30** |

Now every metric falls out of the last two column totals:

```text
n    = 5
RSS  = Σ r²   = 30           (squared lakhs)
MAE  = 10 / 5 = 2.0          lakhs
MSE  = 30 / 5 = 6.0          squared lakhs
RMSE = √6.0   ≈ 2.4495       lakhs
```

Three numbers, one set of predictions. **MAE `2.0` and RMSE `2.4495` are not a disagreement about
accuracy** — they are answers to two different questions about the same five misses.

:::note Two more that scikit-learn ships
`median_absolute_error` is the median of `|r|` — here the middle of `[0, 1, 2, 3, 4]`, so `2.0`. It
ignores an outlier completely rather than merely down-weighting it. `max_error` is `max |r|`, here
`4` — a worst-case guarantee, useful when one bad prediction is unacceptable.
:::

---

## MAE is the only one you can read out loud

MAE is in the units of `y` and it means what it appears to mean.

```text
MAE = (1/n) Σ |yᵢ − ŷᵢ|  =  2.0 lakhs
```

> "On average this model is off by ₹2 lakh."

That sentence is true and needs no footnote. Neither MSE nor RMSE supports an equally plain sentence:
MSE is in the wrong units entirely, and RMSE is an average that has been deliberately tilted towards
the big misses, so "average miss" overstates what it reports.

Three properties follow from the absolute value, and all three are consequences of the same thing —
that `|r|` grows in a straight line rather than a curve.

| Property | Consequence |
|---|---|
| Every rupee of miss weighs the same | Ten misses of 1 cost the same as one miss of 10 |
| Minimised by the **median** of the targets, not the mean | A constant-only model fitted under MAE predicts the median |
| Its slope is `±1` everywhere, undefined at `r = 0` | Gradient descent on it does not slow down near the optimum |

The second row is the useful one for reporting. MAE describes the *typical* row. If you want a number
that a client can act on — "budget ₹2 lakh of slack" — MAE is the number.

The third row is why MAE is a common metric but an uncommon loss. Its gradient carries no information
about how far you still have to go, which is exactly the problem
[Loss Functions](../04-optimisation/01-loss-functions.md#absolute-error-does-not-care-how-wrong-an-outlier-is)
works through.

---

## MSE is in squared units, and splits into spread plus bias

```text
MSE = (1/n) Σ (yᵢ − ŷᵢ)²  =  6.0 squared lakhs
```

"Six squared lakhs" is not a quantity. There is no price, no distance and no error that is measured
in squared lakhs, so MSE cannot be reported to anyone outside the modelling. Its value is elsewhere:
it is smooth, it is the loss least squares actually minimises, and it decomposes.

### The decomposition

For any set of residuals, MSE splits exactly into two interpretable pieces:

```text
MSE = var(r) + (r̄)²

      var(r) = how scattered the misses are        ← precision
      (r̄)²   = how far off-centre they are         ← bias
```

Check it against the worked table. There, `r̄ = 0 / 5 = 0` and `var(r) = 30/5 − 0² = 6.0`, so
`MSE = 6.0 + 0 = 6.0`. The model is **unbiased** on this data: it is scattered, but not systematically
high or low.

Now imagine a second model whose residuals are `[2, 2, 2, 2, 2]` — every prediction exactly ₹2 lakh
low. Then `r̄ = 2`, `var(r) = 0`, and `MSE = 0 + 4 = 4.0`. All of its error is bias and none of it is
scatter, which is the easiest kind of error to fix: subtract 2 from every prediction and MSE goes to
zero.

:::warning On training data with an intercept, `Σr = 0` automatically
Least squares fitted with a constant column forces the residuals to sum to exactly zero — that is one
of the normal equations, derived in
[The Matrix Formulation](../03-linear-regression/03-the-matrix-formulation.md#the-column-of-ones). So
on **training** data the bias term is always `0` and `MSE = var(r)`. On **test** data it is not, and a
non-zero mean residual there is a real finding: the model is calibrated for the wrong level.
:::

### RSS, MSE and the residual standard error

Three numbers that all divide the same RSS, by three different denominators:

| Name | Formula | Divides by | Why |
|---|---|---|---|
| RSS | `Σ r²` | nothing | Grows with `n`; never compare RSS across datasets of different size |
| MSE | `RSS / n` | `n` | The plain average — what the metric reports |
| Residual standard error | `√( RSS / (n − p − 1) )` | `n − p − 1` | Unbiased estimate of the noise σ, for `p` fitted features |

The last row is what statistical software prints as "residual standard error", and it is slightly
larger than RMSE because fitting `p + 1` coefficients uses up `p + 1` degrees of freedom. With
`n = 5` and `p = 1`, RMSE divides by 5 and the residual standard error divides by 3 — the same RSS of
`30` gives `√6 ≈ 2.4495` versus `√10 ≈ 3.1623`. On a few hundred rows the difference is negligible;
on twenty rows with ten features it is not.

---

## RMSE returns to the units of y, and is never smaller than MAE

```text
RMSE = √MSE = √( (1/n) Σ (yᵢ − ŷᵢ)² )  =  √6.0 ≈ 2.4495 lakhs
```

Taking the root undoes the squaring of the *units* but not the squaring of the *weights*. RMSE is in
lakhs, and it is still an average in which a miss of 10 counted a hundred times as much as a miss
of 1 before the root was taken. So it sits above MAE.

That is not a tendency. It is an identity — subtract the two squared:

```text
RMSE² − MAE² = (1/n) Σ r²  −  ( (1/n) Σ |r| )²
             = mean(|r|²) − mean(|r|)²
             = var(|r|)                    ≥ 0
```

A variance cannot be negative, so `RMSE ≥ MAE` always, with equality **exactly** when `var(|r|) = 0`
— when every miss is the same size. Rearranged, that is the identity from the top of the page:

```text
RMSE² = MAE² + var(|r|)
```

Verify on the worked residuals `[3, 1, 2, 4, 0]`: their mean is `2`, their squared deviations are
`[1, 1, 0, 4, 4]` summing to `10`, so `var(|r|) = 2`. And indeed `MAE² + 2 = 4 + 2 = 6 = RMSE²`. ✓

The upper bound comes from the other extreme — a single non-zero residual:

```text
MAE  ≤  RMSE  ≤  √n · MAE
```

The right-hand equality holds when exactly one row carries all the error. Both bounds are tight, and
between them lies the diagnostic in the next section.

---

## The RMSE-to-MAE ratio tells you how uneven the errors are

Divide one by the other and the units cancel. What is left is a pure, scale-free number that says
nothing about *how big* the errors are and everything about *how evenly they are spread*.

```text
1  ≤  RMSE / MAE  ≤  √n
```

Three sets of five residuals, all with **exactly the same MAE of 2.0**:

| Set | Residuals | MAE | MSE | RMSE | RMSE / MAE | What it is |
|---|---|---|---|---|---|---|
| A | `[+3, −1, +2, −4, 0]` | 2.0 | 6.0 | 2.4495 | **1.2247** | Ordinary scatter |
| B | `[0, 0, 0, 0, +10]` | 2.0 | 20.0 | 4.4721 | **2.2361** | One catastrophic row |
| C | `[+2, +2, +2, +2, +2]` | 2.0 | 4.0 | 2.0000 | **1.0000** | Pure constant bias |

Set B's ratio of `2.2361` is `√5` to four decimals — the theoretical maximum for `n = 5`. Set C's
`1.0000` is the theoretical minimum. **MAE alone cannot tell these three models apart.** The pair
can, and so can the ratio on its own.

### The number to compare against: 1.2533

If the residuals are normally distributed with mean zero and standard deviation σ, both metrics have
closed forms:

```text
RMSE = σ
MAE  = σ · √(2/π)  ≈  0.7979 σ

RMSE / MAE = √(π/2)  ≈  1.2533
```

So `≈ 1.25` is what "nothing unusual is happening" looks like. That gives a reading you can apply to
any regression, on any scale, without knowing anything about the target:

| Ratio | Reading | What to do |
|---|---|---|
| `≈ 1.00` | Every miss is nearly the same size | Look for a constant offset — check the mean residual |
| `1.0 – 1.2` | Errors unusually uniform | Often a truncated or clipped target |
| `≈ 1.25` | Consistent with normal errors | Nothing to chase |
| `1.4 – 2.0` | A minority of rows dominates the squared error | Sort by `abs(r)` and read the worst rows |
| `Near √n` | Essentially one row is the error | Almost always a data problem, not a model problem |

:::tip This is an outlier detector you already have
Every regression report contains MAE and RMSE. Dividing them costs nothing and points at the same
rows a `y`-outlier scan would find — but it finds them in the *residuals*, which is where they matter,
rather than in the raw column. Compare with the univariate rules in
[Outliers and Feature Engineering](../02-data-preprocessing/05-outliers-and-feature-engineering.md#z-scores-and-why-outliers-hide-each-other),
which can only see a value that is extreme in itself, not a value the model got badly wrong.
:::

The diagnosis is not automatically "delete the row". A high ratio says one of three things, and they
need different responses: the row is a data error (fix or drop it), the row is genuine but the model
lacks the feature that explains it (add the feature), or the target is heavy-tailed and squared error
is the wrong loss (fit absolute error instead, and report MAE).

---

## scikit-learn negates every error metric on purpose

Two APIs, two sign conventions, and the mismatch is the single most common metric bug.

**The functions in `sklearn.metrics` return the natural, positive value.**

```python
mean_absolute_error(y_true, y_pred)       #  2.0    positive
mean_squared_error(y_true, y_pred)        #  6.0    positive
root_mean_squared_error(y_true, y_pred)   #  2.4495 positive
```

**The scorer *strings* used by `cross_val_score`, `GridSearchCV` and `RandomizedSearchCV` return the
negated value.**

```python
cross_val_score(model, X, y, scoring='neg_mean_squared_error')   # array of −6.0-ish values
```

The reason is a single design decision: **every scorer in scikit-learn obeys "greater is better",**
so that model selection can always maximise, with no per-metric special cases. `r2` and `accuracy`
already satisfy it. Error metrics do not — smaller is better — so they are wrapped with a minus sign
to make them fit. `GridSearchCV` then picks `argmax` of the scores, and `-6.0 > -20.0` correctly
selects the model with the smaller MSE.

| What you want | Function in `sklearn.metrics` | Scorer string | Sign of the scorer |
|---|---|---|---|
| MAE | `mean_absolute_error` | `'neg_mean_absolute_error'` | negative |
| MSE | `mean_squared_error` | `'neg_mean_squared_error'` | negative |
| RMSE | `root_mean_squared_error` | `'neg_root_mean_squared_error'` | negative |
| Median absolute error | `median_absolute_error` | `'neg_median_absolute_error'` | negative |
| MAPE | `mean_absolute_percentage_error` | `'neg_mean_absolute_percentage_error'` | negative |
| R² | `r2_score` | `'r2'` | positive — no `neg_` prefix |

The rule for reading it: **flip the sign at the moment you print, never before.**

```python
scores = cross_val_score(model, X, y, scoring='neg_root_mean_squared_error', cv=5)
print(f"RMSE {-scores.mean():.4f} ± {scores.std():.4f}")   # negate once, at the end
```

:::danger Three ways the sign trap actually bites
- **Reporting `best_score_` unchanged.** `GridSearchCV(...).best_score_` under a `neg_` scorer is
  negative. Printed as-is it reads like an impossible error.
- **Applying `abs()` too early.** `abs(scores)` before averaging is harmless for a mean, but
  `abs(scores).max()` is the *worst* fold while `scores.max()` is the *best*. The two disagree.
- **Writing your own scorer with the wrong flag.** `make_scorer(mean_squared_error)` defaults to
  `greater_is_better=True`, so the search happily selects the model with the **largest** error. It
  must be `make_scorer(mean_squared_error, greater_is_better=False)`, which negates for you.
:::

One API note: `root_mean_squared_error` was added in scikit-learn 1.4, and the older
`mean_squared_error(..., squared=False)` was removed in 1.6. Code that still passes `squared=False`
raises a `TypeError` on a current install.

---

## None of the three means anything without the spread of y

Every metric on this page is **scale-dependent**, and two of the three scale differently from each
other. Re-express the same five houses in rupees instead of lakhs — a factor of `k = 100000`, the same
model, the same fit, the same quality:

| Metric | In lakhs | In rupees | Scales as |
|---|---|---|---|
| MAE | 2.0 | 200000 | `k` |
| MSE | 6.0 | 6.0 × 10¹⁰ | `k²` |
| RMSE | 2.4495 | 244949 | `k` |
| RMSE / MAE | 1.2247 | 1.2247 | unchanged |

So "MAE = 200000" is not a worse model than "MAE = 2.0". It is the same model in different units. It
follows that these numbers cannot be compared across two problems, and cannot be judged in isolation
at all — an MAE of ₹2 lakh is superb on a ₹5 crore house and useless on a ₹6 lakh one.

The fix is to always score the **baseline** alongside the model: predict the mean of `y` for every
row and compute the same metric. For the five houses, `ȳ = 366 / 5 = 73.2`, giving baseline residuals
`[−21.2, −13.2, −2.2, +14.8, +21.8]`:

```text
baseline MAE  = 73.2 / 5     = 14.64   lakhs
baseline MSE  = 1322.8 / 5   = 264.56  squared lakhs
baseline RMSE = √264.56      ≈ 16.2653 lakhs
```

Against a baseline RMSE of `16.2653`, the model's `2.4495` is a factor of `6.6` better — and *that*
statement survives a change of units. Turning exactly this comparison into a single number between
`−∞` and `1` is what R² does, on the next page. `DummyRegressor(strategy='mean')` computes the
baseline for you, so there is no excuse for skipping it.

---

## Common Mistakes

| # | Mistake | Wrong | Right |
|---|---|---|---|
| 1 | Reporting MSE to a person | "The model is off by 6.0" | MSE is in **squared** lakhs; report MAE `2.0` or RMSE `2.4495`, both in lakhs |
| 2 | Treating `RMSE ≠ MAE` as an inconsistency | "Which one is correct, 2.0 or 2.4495?" | Both. `RMSE² = MAE² + var(abs(r))`; the gap of `2` here *is* the spread of the misses |
| 3 | Expecting RMSE below MAE | "My RMSE came out lower, seems fine" | Impossible — the gap is a variance, so `RMSE ≥ MAE` always. A lower RMSE means a coding error |
| 4 | Printing `cross_val_score` output directly | `print(scores.mean())` → `−6.0` | Negate once at the print: `-scores.mean()` |
| 5 | `make_scorer` without the flag | `make_scorer(mean_squared_error)` | `make_scorer(mean_squared_error, greater_is_better=False)`, or the string `'neg_mean_squared_error'` |
| 6 | `abs()` before selecting a fold | `abs(scores).max()` as "best fold" | `scores.max()` is best; `abs()` reverses the ordering of the extremes |
| 7 | Comparing RSS across datasets | "RSS fell from 30 to 20, better" | RSS grows with `n`. Compare MSE or RMSE, which divide by `n` |
| 8 | Judging a metric in isolation | "MAE is 200000, that's terrible" | Score `DummyRegressor(strategy='mean')` too — baseline MAE here is `14.64` against the model's `2.0` |
| 9 | Comparing metrics across different targets | "MAE 2.0 here beats MAE 5.0 there" | Both are scale-dependent; only the ratio `RMSE / MAE` is unit-free |
| 10 | Ignoring a high `RMSE / MAE` | "RMSE is high, use MAE instead" | A ratio near `√n` means one row holds the error — sort by `abs(r)` and read it before choosing a metric |
| 11 | Reading a non-zero mean residual as noise | "Residuals average `+2`, close enough" | That is pure bias: `MSE = var(r) + r̄²`, so `4.0` of it is a fixable constant offset |
| 12 | Using `squared=False` on a current install | `mean_squared_error(y, p, squared=False)` | `root_mean_squared_error(y, p)` — the old argument was removed in scikit-learn 1.6 |

---

## Summary

| | |
|---|---|
| Residual | `rᵢ = yᵢ − ŷᵢ`; positive means the model under-predicted |
| RSS / SSE | `Σ rᵢ²` — total, not an average; grows with `n` |
| MAE | `(1/n) Σ abs(rᵢ)` — units of `y`; minimised by the median |
| MSE | `(1/n) Σ rᵢ²` — **squared** units of `y`; the least-squares loss |
| RMSE | `√MSE` — units of `y`; weights big misses heavily |
| Exact link | `RMSE² = MAE² + var(abs(r))` |
| Bounds | `MAE ≤ RMSE ≤ √n · MAE` |
| Bias split | `MSE = var(r) + (r̄)²`; on training data with an intercept, `r̄ = 0` |
| Residual standard error | `√( RSS / (n − p − 1) )` — slightly above RMSE |
| Normal-errors ratio | `RMSE / MAE = √(π/2) ≈ 1.2533` |
| Ratio range | `1` (all misses equal) to `√n` (one miss carries everything) |
| Robust cousins | `median_absolute_error` ignores outliers; `max_error` reports the worst row |
| Scorer convention | Greater is better, so error metrics get a `neg_` prefix and a negative value |
| RMSE in scikit-learn | `root_mean_squared_error` since 1.4; `squared=False` removed in 1.6 |
| Baseline | `DummyRegressor(strategy='mean')` — always score it alongside |

**Key takeaways**

- MAE, MSE and RMSE are one column of residuals summarised three ways. On the worked five houses:
  `2.0`, `6.0` and `2.4495` from the same `Σ|r| = 10` and `Σr² = 30`.
- Only MAE supports a plain sentence: "off by about ₹2 lakh on a typical house."
- MSE's units are squared, which disqualifies it as a reported number and costs it nothing as a loss.
- `RMSE ≥ MAE` is a theorem: the difference of their squares is `var(|r|)`, and a variance is never
  negative. Equality needs every miss to be the same size.
- The gap is therefore informative rather than annoying — it *is* the spread of the absolute errors.
- Sets `[+3,−1,+2,−4,0]`, `[0,0,0,0,+10]` and `[+2,+2,+2,+2,+2]` all have MAE `2.0` but RMSE `2.4495`,
  `4.4721` and `2.0000`. MAE alone cannot distinguish them.
- `RMSE / MAE` is unit-free and bounded by `1` and `√n`; `√(π/2) ≈ 1.2533` is the normal-errors value,
  so a reading of `2.2` on five rows means one row is the error.
- `MSE = var(r) + (r̄)²` separates scatter from a constant offset. An offset is the cheapest error to
  fix, and on training data with an intercept it is exactly zero by construction.
- Dividing RSS by `n − p − 1` instead of `n` gives the residual standard error: `√10 ≈ 3.1623` versus
  RMSE's `√6 ≈ 2.4495` on `n = 5`, `p = 1`.
- scikit-learn negates error metrics in scorers so that every search maximises. Flip the sign once,
  at the print statement.
- `make_scorer(mean_squared_error)` without `greater_is_better=False` selects the *worst* model, and
  nothing warns you.
- MAE and RMSE scale by `k` when `y` does, MSE by `k²`, and the ratio not at all — so no metric here
  is interpretable without the mean-only baseline beside it.

**Next in this section:** `02-r-squared-and-adjusted-r-squared.md` — turns the baseline comparison
above into R², explains why adding any feature can only inflate it, and covers MAPE's asymmetry.

**See also:**
[Loss Functions](../04-optimisation/01-loss-functions.md#absolute-error-does-not-care-how-wrong-an-outlier-is)
for why the same choice changes the fitted line ·
[Simple Linear Regression](../03-linear-regression/01-simple-linear-regression.md#how-wrong-is-it-the-five-error-measures)
for these measures on a hand-fitted line ·
[The Matrix Formulation](../03-linear-regression/03-the-matrix-formulation.md#the-column-of-ones)
for why the intercept forces `Σr = 0` ·
[Outliers and Feature Engineering](../02-data-preprocessing/05-outliers-and-feature-engineering.md#z-scores-and-why-outliers-hide-each-other)
for finding extreme values before they become residuals

---

## Run It Yourself

```python title="error_metrics.py"
import numpy as np
from sklearn.dummy import DummyRegressor
from sklearn.linear_model import LinearRegression
from sklearn.metrics import (make_scorer, max_error, mean_absolute_error,
                             mean_squared_error, median_absolute_error,
                             root_mean_squared_error)
from sklearn.model_selection import GridSearchCV, cross_val_score

np.random.seed(42)

# ---------- 1. the three metrics, by hand and by sklearn ----------
y_true = np.array([52.0, 60.0, 71.0, 88.0, 95.0])      # lakhs
y_pred = np.array([49.0, 61.0, 69.0, 92.0, 95.0])
r = y_true - y_pred
n = len(r)

print("1. ONE COLUMN OF RESIDUALS, THREE SUMMARIES")
print(f"   residuals      {r}")
print(f"   abs(residuals) {np.abs(r)}")
print(f"   squared        {r ** 2}")
print(f"   sum abs = {np.abs(r).sum():.1f}   RSS = {(r ** 2).sum():.1f}   n = {n}")
print(f"   MAE  by hand {np.abs(r).sum() / n:.4f}   sklearn {mean_absolute_error(y_true, y_pred):.4f}")
print(f"   MSE  by hand {(r ** 2).sum() / n:.4f}   sklearn {mean_squared_error(y_true, y_pred):.4f}")
print(f"   RMSE by hand {np.sqrt((r ** 2).sum() / n):.4f}   "
      f"sklearn {root_mean_squared_error(y_true, y_pred):.4f}")
print(f"   median abs error {median_absolute_error(y_true, y_pred):.4f}   "
      f"max error {max_error(y_true, y_pred):.4f}")

# ---------- 2. MSE splits into scatter plus bias ----------
print("\n2. MSE = var(r) + mean(r)^2")
for name, res in [("unbiased ", r), ("offset +2", np.full(n, 2.0))]:
    mse = np.mean(res ** 2)
    print(f"   {name}  var {res.var():7.4f} + mean^2 {res.mean() ** 2:7.4f} "
          f"= {res.var() + res.mean() ** 2:7.4f}   MSE {mse:7.4f}")

X = np.array([[1.0], [2.0], [3.0], [4.0], [5.0]])
fitted = LinearRegression().fit(X, y_true)
train_r = y_true - fitted.predict(X)
print(f"   least squares with an intercept: sum of residuals = {train_r.sum():.2e}")
print(f"   so MSE {np.mean(train_r ** 2):.6f} equals var(r) {train_r.var():.6f}")

rss = (train_r ** 2).sum()
print(f"   RSS {rss:.4f}: RMSE = sqrt(RSS/n) {np.sqrt(rss / n):.4f}, "
      f"residual std error = sqrt(RSS/(n-2)) {np.sqrt(rss / (n - 2)):.4f}")

# ---------- 3. identical MAE, three different RMSE ----------
print("\n3. THREE RESIDUAL PATTERNS WITH THE SAME MAE")
sets = {"A ordinary scatter": np.array([3.0, -1.0, 2.0, -4.0, 0.0]),
        "B one bad row     ": np.array([0.0, 0.0, 0.0, 0.0, 10.0]),
        "C constant offset ": np.array([2.0, 2.0, 2.0, 2.0, 2.0])}
print(f"   {'set':20s} {'MAE':>7s} {'MSE':>8s} {'RMSE':>8s} {'RMSE/MAE':>9s} {'var(|r|)':>9s}")
for name, res in sets.items():
    mae, rmse = np.abs(res).mean(), np.sqrt(np.mean(res ** 2))
    print(f"   {name:20s} {mae:7.4f} {np.mean(res ** 2):8.4f} {rmse:8.4f} "
          f"{rmse / mae:9.4f} {np.abs(res).var():9.4f}")
print(f"   bounds for n = {n}: min 1.0, max sqrt(n) = {np.sqrt(n):.4f}")
print(f"   identity check on A: MAE^2 + var(|r|) = "
      f"{np.abs(sets['A ordinary scatter']).mean() ** 2 + np.abs(sets['A ordinary scatter']).var():.4f}")

# ---------- 4. the ratio under different error distributions ----------
print("\n4. RMSE/MAE BY ERROR DISTRIBUTION (200000 draws each)")
print(f"   theoretical normal value sqrt(pi/2) = {np.sqrt(np.pi / 2):.4f}")
draws = {"normal      ": np.random.normal(0, 3, 200_000),
         "uniform     ": np.random.uniform(-3, 3, 200_000),
         "heavy-tailed": np.random.standard_t(2, 200_000)}
for name, res in draws.items():
    mae, rmse = np.abs(res).mean(), np.sqrt(np.mean(res ** 2))
    print(f"   {name}  MAE {mae:8.4f}  RMSE {rmse:8.4f}  ratio {rmse / mae:7.4f}")

# ---------- 5. the sign trap ----------
print("\n5. THE SIGN TRAP")
Xb = np.random.uniform(0, 10, size=(120, 3))
yb = 4.0 + 2.5 * Xb[:, 0] - 1.5 * Xb[:, 1] + np.random.normal(0, 2.0, 120)
model = LinearRegression()
cv_neg = cross_val_score(model, Xb, yb, scoring='neg_mean_squared_error', cv=5)
print(f"   scoring='neg_mean_squared_error' folds {np.round(cv_neg, 4)}")
print(f"   printed as-is        {cv_neg.mean():.4f}   <- reads like nonsense")
print(f"   negated once at print {-cv_neg.mean():.4f}   <- the MSE")
print(f"   best fold: scores.max() {cv_neg.max():.4f} -> MSE {-cv_neg.max():.4f}")
print(f"   abs(scores).max()       {np.abs(cv_neg).max():.4f} -> that is the WORST fold")

grid = GridSearchCV(LinearRegression(), {'fit_intercept': [True, False]},
                    scoring='neg_root_mean_squared_error', cv=5).fit(Xb, yb)
print(f"   GridSearchCV best_score_ {grid.best_score_:.4f}  ->  RMSE {-grid.best_score_:.4f}")

wrong = make_scorer(mean_squared_error)                              # defaults to greater is better
right = make_scorer(mean_squared_error, greater_is_better=False)
for label, scorer in [("greater_is_better=True (wrong)", wrong),
                      ("greater_is_better=False (right)", right)]:
    picked = GridSearchCV(LinearRegression(), {'fit_intercept': [True, False]},
                          scoring=scorer, cv=5).fit(Xb, yb)
    print(f"   {label:32s} picks fit_intercept="
          f"{picked.best_params_['fit_intercept']}, score {picked.best_score_:.4f}")

# ---------- 6. scale dependence and the baseline ----------
print("\n6. SCALE DEPENDENCE AND THE MEAN-ONLY BASELINE")
k = 100_000
for label, scale in [("lakhs ", 1.0), ("rupees", float(k))]:
    yt, yp = y_true * scale, y_pred * scale
    print(f"   {label}  MAE {mean_absolute_error(yt, yp):14.4f}  "
          f"MSE {mean_squared_error(yt, yp):18.4f}  "
          f"RMSE {root_mean_squared_error(yt, yp):14.4f}")

base = DummyRegressor(strategy='mean').fit(X, y_true)
base_pred = base.predict(X)
print(f"   baseline predicts the mean {base_pred[0]:.2f} for every row")
print(f"   baseline MAE  {mean_absolute_error(y_true, base_pred):.4f}  "
      f"model MAE  {mean_absolute_error(y_true, y_pred):.4f}")
print(f"   baseline RMSE {root_mean_squared_error(y_true, base_pred):.4f}  "
      f"model RMSE {root_mean_squared_error(y_true, y_pred):.4f}")
print(f"   the model's RMSE is "
      f"{root_mean_squared_error(y_true, base_pred) / root_mean_squared_error(y_true, y_pred):.2f}x "
      f"smaller, and that factor is unit-free")
```

```text title="Output"
OUTPUT PENDING — run the script above and paste the result here.
```

### What to notice in that output

- Block 1: the by-hand and scikit-learn columns agree to four decimals for all three metrics — the
  library is doing exactly the arithmetic in the worked table, nothing more.
- Block 1: `median_absolute_error` and `max_error` sit either side of MAE, and the spread between the
  three of them is itself a hint about how uneven the misses are.
- Block 2: the `offset +2` row puts all of its MSE into `mean²` and none into `var`, which is what a
  purely fixable error looks like.
- Block 2: the sum of training residuals is not `0.0` but something like `1e−14` — floating point, not
  a real bias. Compare RMSE with the residual standard error on the same RSS.
- Block 3: three sets, one MAE, three RMSEs, and the `var(|r|)` column explains every gap. Set B's
  ratio matches `sqrt(5)` and set C's is exactly `1.0`.
- Block 4: the empirical normal ratio lands on `1.2533` from a completely different route than the
  algebra did; the uniform draw sits below it and the heavy-tailed draw well above.
- Block 5: `scores.max()` and `abs(scores).max()` name *different folds* — one is the best, one is the
  worst. This is the bug in miniature.
- Block 5: the two `make_scorer` variants select different values of `fit_intercept`, and only the
  `greater_is_better=False` one is minimising error.
- Block 6: MAE and RMSE grow by `100000` between the two rows while MSE grows by `10¹⁰`, yet the
  baseline-to-model ratio is identical on both scales.

**Things worth trying:**

1. Change one residual in set A from `−4` to `−40` without touching the others. Predict what happens
   to MAE, to RMSE and to the ratio *before* running it — one of the three barely moves.
2. Set `n = 100` in block 3 by padding each set with zeros to length 100, keeping the non-zero
   residuals. The MAE of every set falls; predict which ratio moves most and why the `√n` bound
   changes.
3. Swap `np.random.standard_t(2, ...)` for `np.random.standard_t(30, ...)` in block 4. Predict the
   ratio before running — how many degrees of freedom does it take to look normal?
4. In block 5, change `scoring='neg_mean_squared_error'` to `scoring='mean_squared_error'`. Predict
   the error message, then read it — it names the valid scorer strings.
5. Multiply `yb` by `1000` in block 5 and re-run. Predict which of `best_score_` and the chosen
   `fit_intercept` changes.
6. Add a single extreme row to `Xb`/`yb` — say `yb[0] = yb[0] + 500` — and print MAE, RMSE and their
   ratio before and after. Predict which metric roughly doubles.

---

## Practice Questions

*Work each one out on paper first, then check it by editing the script. The tags say what kind of
answer is wanted. **No answers are included, deliberately.***

| Tag | Means |
|---|---|
| `[THEORY]` | Explain or derive, no code |
| `[PROG]` | Write the code |
| `[OUT]` | Predict the printed output |
| `[ANALYZE]` | Read a result and say what it implies |

### Residuals and the three formulas

**Q1. [THEORY]** Write MAE, MSE and RMSE for `n` rows using `Σ` notation, and state the units of each
when `y` is in kilograms.

**Q2. [OUT]** For `y = [10, 20, 30]` and `ŷ = [12, 20, 27]`, compute the residuals, `Σ|r|`, `Σr²`,
MAE, MSE and RMSE by hand.

**Q3. [THEORY]** A colleague computes residuals as `ŷ − y` instead of `y − ŷ`. Which of the six
quantities in Q2 change, and which do not?

**Q4. [ANALYZE]** A report gives RSS `= 480` and says the model improved because RSS used to be
`600`. What must you know before accepting that?

**Q5. [THEORY]** Why can `median_absolute_error` be `0.0` while RMSE is large? Construct a five-row
example.

### MAE, MSE and what each one weighs

**Q6. [THEORY]** Ten rows each miss by `1`. One row misses by `10`. Show that MAE cannot distinguish
those two situations but MSE can, using the formulas rather than words.

**Q7. [THEORY]** Explain why a constant-only model fitted to minimise MAE predicts the median of `y`,
while one fitted to minimise MSE predicts the mean.

**Q8. [ANALYZE]** A stakeholder asks "how much should I budget for the model being wrong?" Which of
the three metrics answers that, and why are the other two the wrong answer?

**Q9. [THEORY]** MSE is in squared units. Name one thing that fact makes MSE *better* at than RMSE,
despite being unreportable.

**Q10. [PROG]** Write a function that takes `y_true` and `y_pred` and returns MAE, MSE, RMSE and the
mean residual in one dictionary, using numpy only.

### The identity and the bounds

**Q11. [THEORY]** Derive `RMSE² − MAE² = var(|r|)` from the definitions of the two metrics.

**Q12. [THEORY]** From that identity, state the exact condition under which `RMSE = MAE`, and give a
five-row residual set that satisfies it.

**Q13. [THEORY]** Prove that `RMSE ≤ √n · MAE`, and describe the residual pattern that makes it an
equality.

**Q14. [OUT]** For residuals `[0, 0, 6]`, compute MAE, RMSE, the ratio, and `√n`. What do you notice?

**Q15. [THEORY]** Show that `MSE = var(r) + (r̄)²`, and explain which term a constant correction to
every prediction can remove.

**Q16. [ANALYZE]** On test data the mean residual is `+3.4` and MSE is `20.0`. How much of the MSE is
bias, how much is scatter, and what would you change first?

### The ratio as a diagnostic

**Q17. [THEORY]** Why is `RMSE / MAE` unaffected by re-expressing `y` in different units, while both
metrics individually are not?

**Q18. [ANALYZE]** A model on 400 test rows reports MAE `1.8` and RMSE `9.4`. What is the ratio, what
does it suggest, and what is the first thing you would print?

**Q19. [THEORY]** Derive `RMSE / MAE = √(π/2)` for normally distributed residuals, given that
`E|r| = σ√(2/π)`.

**Q20. [ANALYZE]** A model reports a ratio of `1.01` on 5000 rows. Give two plausible explanations,
one about the target and one about the residuals' mean.

**Q21. [PROG]** Write code that reports MAE, RMSE, the ratio, and the five rows with the largest
`|r|`, given `y_true`, `y_pred` and a DataFrame of features.

### The scikit-learn sign convention

**Q22. [THEORY]** Why does scikit-learn negate error metrics in scorers instead of letting each search
know whether to minimise or maximise?

**Q23. [OUT]** `cross_val_score(..., scoring='neg_mean_absolute_error')` returns
`[-2.1, -1.9, -2.4]`. What is the cross-validated MAE, and which fold did best?

**Q24. [ANALYZE]** A search using `make_scorer(mean_squared_error)` selects a model that is visibly
worse. Explain exactly what the search optimised.

**Q25. [PROG]** Write the one-line change that turns that broken scorer into a correct one, and give
the equivalent string-based `scoring` argument.

**Q26. [THEORY]** Why does `'r2'` have no `neg_` prefix while `'neg_root_mean_squared_error'` does?

### Scale, baselines and reporting

**Q27. [OUT]** A model has MAE `2.0` and MSE `6.0` on a target in lakhs. Give both metrics after the
target is converted to rupees.

**Q28. [THEORY]** Explain why an MAE of `50000` may be a better result than an MAE of `500`, with a
concrete pair of targets.

**Q29. [PROG]** Using `DummyRegressor`, write code that prints model and baseline RMSE side by side
plus the ratio between them.

**Q30. [ANALYZE]** A model's RMSE is `16.1` and the mean-only baseline's is `16.3`. What does that
tell you about the features, regardless of how the number reads on its own?

### Quick self-check

1. What are the units of MSE when `y` is in rupees?
2. Which metric is minimised by the median of the targets?
3. Can RMSE ever be less than MAE?
4. What exactly equals `RMSE² − MAE²`?
5. What are the smallest and largest possible values of `RMSE / MAE` on `n` rows?
6. What ratio do normally distributed residuals produce?
7. What does `MSE = var(r) + (r̄)²` let you separate?
8. Why is the mean training residual zero for least squares with an intercept?
9. Which denominator does the residual standard error use instead of `n`?
10. What sign does `GridSearchCV.best_score_` have under `'neg_mean_squared_error'`?
11. What is the default `greater_is_better` in `make_scorer`?
12. Which function replaced `mean_squared_error(..., squared=False)`?
13. If `y` is multiplied by 1000, what happens to MSE?
14. What does `DummyRegressor(strategy='mean')` predict?
15. Which single number on this page is unit-free?
