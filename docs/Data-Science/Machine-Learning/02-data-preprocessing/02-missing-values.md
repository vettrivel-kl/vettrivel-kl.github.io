---
sidebar_position: 2
title: Missing Values
description: Why a value is missing decides what you may do about it — MCAR, MAR and MNAR, what mean imputation costs a distribution, when a smarter imputer pays, and the fit/transform contract that keeps it honest.
tags: [machine-learning, data-preprocessing, scikit-learn, pandas]
toc_max_heading_level: 3
---

# Missing Values

> **Topic —** `SimpleImputer(strategy="mean")` is two lines and it always "works" — no error, no
> warning, a full table at the end. This page is about what those two lines actually did to your
> data, when they were the right call, and how to tell the difference.

The central claim, which the measurements below support: **why a value is missing matters more than
which function you use to fill it.**

---

## First, why is it missing?

Statisticians classify missingness into three mechanisms. This isn't a theoretical nicety — the
mechanism decides whether imputation can work *at all*.

| Mechanism | Means | Example | Can imputation recover it? |
|---|---|---|---|
| **MCAR** — Missing Completely At Random | Missingness is unrelated to anything, observed or not | A lab machine failed on random samples | **Yes**, in principle |
| **MAR** — Missing At Random | Missingness depends on **other observed columns** | Older patients skip a question, and you recorded age | **Yes**, using those columns |
| **MNAR** — Missing Not At Random | Missingness depends on **the missing value itself** | The highest earners decline to state income | **No** — the information is gone |

The names are unhelpful (MAR isn't "random" in any everyday sense), but the distinction is sharp:

- Under **MCAR**, the rows with data look like the rows without. Your sample is smaller but unbiased.
- Under **MAR**, the rows differ — but in ways *other columns can explain*, so a model can compensate.
- Under **MNAR**, the rows differ for reasons **nothing in your data captures**. No technique fixes
  this, because the systematic difference is invisible.

### The difference, measured

Take a complete column — median income across 2,000 California districts — remove 30% of it two
different ways, and compare against the truth you still have:

```text title="Output"
   scenario                                mean     std     corr
   complete truth                         3.851   1.936   -0.097
   MCAR 30% gone, before imputing         3.815   1.885   -0.120
   MCAR + mean imputation                 3.815   1.573   -0.101
   MNAR top 30% hidden, before            2.877   0.831   -0.069
   MNAR + mean imputation                 2.877   0.696   -0.056
```

**Under MCAR the surviving data is trustworthy.** Mean `3.815` against a true `3.851`, std `1.885`
against `1.936`. Losing 30% of values at random cost almost nothing in accuracy, because what
remained was a fair sample.

**Under MNAR it is not.** Hiding the top 30% of incomes gives an observed mean of `2.877` against a
true `3.851` — a **25% underestimate**. And imputing with the mean cannot help, because the mean you
have available is *already* the wrong mean. You fill 600 gaps with `2.877` and every one is
confidently, systematically too low.

:::danger No imputer can fix MNAR

Look at the two MNAR rows: imputation left the mean at `2.877` and pushed the std *further* from the
truth. Applying a more sophisticated imputer would not have helped — KNN and Iterative imputers
learn from the observed values, and every observed value here is from the bottom 70%.

When missingness is MNAR, the honest options are: **model the missingness itself** (see
`add_indicator` below), **collect the data differently**, or **state the limitation**. Silently
imputing produces a confident, biased model.

:::

Diagnosing the mechanism is a domain question, not a statistical one — the same conclusion as the
sentinel values on the [previous page](./01-loading-and-preparing-data.md#the-missingness-pandas-cannot-see).
A useful test: *could the value itself plausibly be the reason it's absent?* Income, weight, symptom
severity, salary expectations — usually yes. Sensor readings dropped by a network fault — usually no.

---

## What mean imputation costs

Return to the MCAR rows, the case where imputation is legitimate:

| | mean | std |
|---|---|---|
| Complete truth | 3.851 | **1.936** |
| MCAR, before imputing | 3.815 | 1.885 |
| MCAR + mean imputation | 3.815 | **1.573** |

The mean survived. **The standard deviation fell from 1.936 to 1.573 — a 19% loss.**

This is not a bug, it's arithmetic. You replaced 600 varied values with 600 copies of one number.
Those 600 rows now contribute **zero** variance. The column's spread is understated, and so is
anything computed from it.

Consequences worth knowing:

- **Variance and standard deviation shrink**, so confidence intervals are too narrow and significance
  is overstated
- **Correlations are diluted** — a block of identical values can't co-vary with anything
- **The distribution grows a spike** at the mean that does not exist in reality
- The more you impute, the worse all three get — at 50% missing, half your column is one number

:::note Mean imputation is a *point estimate* pretending to be data

`SimpleImputer` fills the single most likely value and discards all uncertainty. The model then
treats an imputed `3.815` with exactly the same confidence as a measured `3.815`.

This is what **multiple imputation** exists to fix: impute several times with different plausible
values, fit a model to each, and combine — so the uncertainty survives into the results.
`IterativeImputer` is scikit-learn's single-imputation approximation of that idea.

:::

---

## Deletion, and its arithmetic

The alternative to filling gaps is dropping rows — **listwise deletion**, `df.dropna()`. It's honest
in a way imputation isn't: nothing is invented. It's also more expensive than people expect, because
a row is discarded if **any** column is missing.

For `k` columns each independently missing a fraction `p`, the share of complete rows is
`(1 − p)ᵏ`:

```text title="Output"
2. LISTWISE DELETION — dropna() on 8 columns
     missing per column  rows kept (theory)  measured
                    1%              92.3%     91.6%
                    5%              66.3%     65.0%
                   10%              43.0%     42.6%
```

**8 columns at 5% missing each — a level nobody would call a problem — costs you 35% of your rows.**
At 10% each you keep **43%**. The measured figures track the formula closely, so this is predictable
rather than bad luck.

The exponent is what hurts: the loss compounds across columns, so wide datasets are punished hardest.

| | Deletion | Imputation |
|---|---|---|
| Invents data? | No | Yes |
| Keeps sample size? | **No** — loses `1 − (1−p)ᵏ` | Yes |
| Biased under MCAR? | No, just smaller | No |
| Biased under MNAR? | **Yes** | **Yes** |
| Distorts variance? | No | **Yes** |
| Reasonable when | Few missing, plenty of rows, MCAR | Missing spread across many columns |

Neither is safe under MNAR. Deletion under MNAR quietly removes exactly the rows that differ, which
is the same bias by another route.

Two other options worth naming:

- **Drop the column.** If a feature is 80% missing, it carries little and imputing it fabricates most
  of it. Often the right call.
- **Treat missing as a category.** For categorical data, `"Unknown"` is a legitimate value rather than
  a gap to be filled. This is `strategy="constant"`.

---

## Choosing a strategy

`SimpleImputer` offers four:

| `strategy` | Fills with | Use for |
|---|---|---|
| `"mean"` | Column mean | Numeric, roughly symmetric, no wild outliers |
| `"median"` | Column median | Numeric that is **skewed** or has outliers |
| `"most_frequent"` | The mode | **Categorical**, or low-cardinality integers |
| `"constant"` | `fill_value` | When missing has meaning, or for text |

**Prefer `median` over `mean` more often than you'd think.** The mean is pulled by outliers, and one
extreme value drags every imputed cell with it. On the previous page's data, `AveOccup` had a maximum
442× its median — a mean imputation there fills gaps with a number inflated by a handful of
extremes. Median is unaffected.

### Mean on a categorical column produces nonsense

This is the most common strategy error, and it's silent:

```python
cat = pd.DataFrame({"employed": [1, 1, 0, 1, 1, np.nan, 1, 0]})
SimpleImputer(strategy="mean").fit_transform(cat)
SimpleImputer(strategy="most_frequent").fit_transform(cat)
```

```text title="Output"
mean imputation gives: 0.714286
most_frequent gives:   1
```

`employed` is a yes/no fact. **`0.714286` is not a possible value of it** — nobody is 71% employed.
The array is still numeric so nothing complains, and a model will happily consume a column containing
a value that cannot exist.

The trap is that `0` and `1` *look* numeric. A column being stored as a number does not make it a
quantity — the same test as the postcode case on the previous page: **would arithmetic on this mean
anything?**

---

## When a smarter imputer is worth it

`SimpleImputer` ignores every other column. Two alternatives don't:

- **`KNNImputer`** — find the `k` most similar rows by their other features, and average their values
  for the missing one
- **`IterativeImputer`** — model each column as a function of the others, and iterate

The natural assumption is that these must be better. Here is the honest measurement. Take complete
data, **hide 20% of one column**, impute, and compare against the values we hid. Error is normalised
so that `0.0` is perfect recovery and `1.0` is no better than guessing the column mean:

```text title="Output"
3. RECOVERY ERROR vs THE VALUES WE HID  (0 = perfect, 1 = no better than the mean)

   predictable column  (r = 0.83)
     SimpleImputer(mean)        1.4752
     KNNImputer(5)              0.7255
     IterativeImputer           0.7276

   unpredictable column  (r = 0.03)
     SimpleImputer(mean)        0.9840
     KNNImputer(5)              1.0566
     IterativeImputer           0.9840
```

The result reverses depending on one thing: **how well the other columns predict the missing one.**

**When the column is predictable (`r = 0.83`)** — average bedrooms, given average rooms — `KNNImputer`
cut the error roughly in half, `1.4752 → 0.7255`. Real, substantial, worth the extra cost.

**When it isn't (`r = 0.03`)** — house age, given average occupancy — `KNNImputer` was **worse than
the mean** (`1.0566` vs `0.9840`). It averaged neighbours that were neighbours in an irrelevant space,
adding noise. `IterativeImputer` scored `0.9840`, *identical* to the mean, because its regression
found no usable signal and correctly fell back.

:::tip Check the correlation before reaching for a fancy imputer

```python
df.corr()[column_with_gaps].abs().sort_values(ascending=False)
```

If the missing column's best correlation with another feature is weak, `KNNImputer` and
`IterativeImputer` have nothing to work with, and the median is both cheaper and safer. **The
sophistication pays in proportion to the correlation, and not otherwise.**

:::

Two further cautions from the same experiment. When all five columns were masked at once, plain `mean`
beat both — with gaps everywhere, KNN's neighbours are themselves incomplete. And `IterativeImputer`
scored far worse than the mean on heavily skewed columns (`AveOccup`, skew 44.7), because its linear
model extrapolates catastrophically into a long tail.

| Imputer | Cost | Good when | Bad when |
|---|---|---|---|
| `mean` / `median` | Trivial | Weak correlations; a quick baseline | You had usable signal and ignored it |
| `KNNImputer` | Expensive — distances between all rows | Strong correlations; few gaps | Many gaps; irrelevant features; large data |
| `IterativeImputer` | Expensive — iterated regressions | Strong linear structure | Heavy tails; extrapolation |

Always **measure** rather than assume, using exactly the method above: hide values you have, and see
which imputer recovers them.

---

## Keeping the fact that it was missing

If missingness is informative — which is precisely the MAR and MNAR cases — then *whether a value was
missing* is itself a feature, and imputation destroys it.

`add_indicator=True` keeps it:

```python
imp = SimpleImputer(strategy="mean", add_indicator=True).fit(tr)
```

```text title="Output"
without indicator: 2 columns
with indicator:    4 columns  <- 2 extra flags

 age  salary  age_missing  salary_missing
25.0 50000.0          0.0             0.0
30.0 72500.0          0.0             1.0
35.0 70000.0          0.0             0.0
32.5 80000.0          1.0             0.0
40.0 90000.0          0.0             0.0
```

You get the filled column **and** a binary flag per column recording where the gaps were. The model
can then learn "customers who didn't state income behave differently" — a pattern that survives even
when the imputed number itself is wrong.

This is the closest thing to a free win on this page. Under MNAR it's often the *only* part of the
signal you can legitimately keep.

---

## The `fit` / `transform` contract

Imputation is the clearest possible illustration of the rule from
[The Toolkit and the Pipeline](../01-foundations/05-toolkit-and-pipeline.md#the-contract-that-makes-it-work):
**`fit` learns, `transform` applies.**

`fit` computes the statistics and stores them:

```python
imp = SimpleImputer(strategy="mean").fit(train)
print(imp.statistics_)
```

```text title="Output"
imp.statistics_ (learned from train) = [3.25e+01 7.25e+04]
```

`transform` fills gaps using **those** numbers — including on the test set:

```text title="Output"
test set after transform:
 age  salary
32.5 72500.0
99.0 10000.0
-> the test row was filled with TRAIN means, not its own
```

The test row's `NaN`s became `32.5` and `72500` — the *training* means. That's correct and it's the
whole point. If `transform` recomputed the mean from the test set, the test set would have influenced
its own preparation, and its score would no longer estimate performance on unseen data.

:::danger `fit_transform` on train, `transform` on test

```python
X_train = imp.fit_transform(X_train)   # learn AND apply
X_test   = imp.transform(X_test)       # apply only — never fit_transform here
```

Calling `fit_transform` on the test set is **data leakage**. It raises no error, changes the numbers
only slightly, and inflates your score. The most reliable defence is a `Pipeline`, which makes the
mistake structurally impossible.

:::

### An all-`NaN` column silently disappears

A genuine trap:

```python
bad = pd.DataFrame({"a": [1.0, 2.0, 3.0], "b": [np.nan] * 3})
out = SimpleImputer(strategy="mean").fit_transform(bad)
```

```text title="Output"
input shape  (3, 2)   columns ['a', 'b']
output shape (3, 1)   <- column 'b' has VANISHED
statistics_ = [ 2. nan]  (nan means 'unusable')
```

There is no mean of nothing, so `SimpleImputer` **drops the column** and returns fewer columns than
it received. No warning.

This bites when a column happens to be entirely missing in your training slice but present in test —
the shapes then disagree, and the error surfaces somewhere unrelated. Check
`imp.statistics_` for `nan` entries, or use `keep_empty_features=True` to retain the column.

---

## Common Mistakes

| # | Mistake | Wrong | Right |
|---|---|---|---|
| 1 | Imputing before asking **why** it's missing | Fill and move on | Establish MCAR / MAR / MNAR first |
| 2 | Imputing MNAR data and trusting it | Mean fills the gaps | It cannot recover; flag it or model missingness |
| 3 | Assuming imputation is harmless | The mean is preserved | The **std fell 19%** |
| 4 | `mean` on a skewed column | Outliers drag every filled cell | `median` |
| 5 | `mean` on a categorical column | `0.714286` employed | `most_frequent` |
| 6 | Assuming KNN/Iterative beat the mean | Sophisticated must be better | **Measured worse** at `r = 0.03` |
| 7 | Not checking correlations first | Reach for `KNNImputer` | `df.corr()` decides whether it can help |
| 8 | Discarding the missingness pattern | Fill and forget | `add_indicator=True` |
| 9 | `dropna()` without doing the arithmetic | "only 10% missing" | 8 columns × 10% ⇒ **57% of rows gone** |
| 10 | `fit_transform` on the test set | Symmetry with train | `transform` only |
| 11 | Computing statistics before splitting | Impute the whole frame | Fit on train only |
| 12 | Not noticing a dropped column | Trust the output shape | All-`NaN` columns **vanish** |

---

## Summary

| Task | Code |
|---|---|
| Count gaps per column | `df.isna().sum()` |
| Mean / median / mode fill | `SimpleImputer(strategy=...)` |
| Keep the missingness pattern | `SimpleImputer(add_indicator=True)` |
| Inspect what `fit` learned | `imp.statistics_` |
| Use other columns | `KNNImputer`, `IterativeImputer` |
| Check whether they can help | `df.corr()[col].abs()` |
| Drop incomplete rows | `df.dropna()` |
| Retain all-`NaN` columns | `keep_empty_features=True` |

**Key takeaways**

- **Why** a value is missing matters more than which function fills it
- **MCAR** — unrelated to anything; **MAR** — explained by observed columns; **MNAR** — depends on the
  hidden value itself
- Under MCAR, 30% removal barely moved the mean (`3.851 → 3.815`); under MNAR it was off by **25%**
  (`3.851 → 2.877`) and **no imputer can recover it**
- Mean imputation preserves the mean by construction but cost **19% of the standard deviation**
  (`1.936 → 1.573`) — imputed rows contribute zero variance
- It also dilutes correlations and puts a spike in the distribution that reality doesn't have
- Mean imputation is a **point estimate pretending to be data**; multiple imputation exists to keep
  the uncertainty
- Listwise deletion loses `1 − (1−p)ᵏ` of rows: **8 columns at 5% each ⇒ 35% of rows**, at 10% ⇒ **57%**
- Prefer **`median`** for skewed columns and **`most_frequent`** for categorical ones
- `mean` on a binary column produced **`0.714286`** — a value that cannot exist, with no warning
- Smarter imputers pay **in proportion to correlation**: KNN halved the error at `r = 0.83`
  (`1.4752 → 0.7255`) and was **worse than the mean** at `r = 0.03` (`1.0566` vs `0.9840`)
- `IterativeImputer` fell back to exactly the mean when there was no signal, and did far worse than
  the mean on a column with skew 44.7
- **Measure imputers** by hiding values you already have — never assume
- `add_indicator=True` keeps the missingness as a feature; often the only recoverable signal under MNAR
- `fit` learns `statistics_` from **train only**; `transform` applies them to test — `fit_transform`
  on test is leakage
- A column that is **all `NaN` at fit time is silently dropped**, changing the output shape

**Next in this section:** [Encoding Categorical Data](./03-encoding-categorical-data.md) — turning
`Country` into something a model can consume, which is the other half of why `X` was still `object`

**See also:** [Loading and Preparing Data](./01-loading-and-preparing-data.md#the-missingness-pandas-cannot-see)
for finding the gaps in the first place · [The Toolkit and the Pipeline](../01-foundations/05-toolkit-and-pipeline.md#the-contract-that-makes-it-work)
for the `fit`/`transform` rule

---

## Run It Yourself

```python title="missing_values.py"
"""Missing values — what imputation costs, and when a smarter imputer is worth it."""

import warnings
import numpy as np
import pandas as pd
from sklearn.datasets import fetch_california_housing
from sklearn.experimental import enable_iterative_imputer   # noqa: F401
from sklearn.impute import SimpleImputer, KNNImputer, IterativeImputer

warnings.filterwarnings("ignore")
rng = np.random.RandomState(0)

df = fetch_california_housing(as_frame=True).frame.sample(2000, random_state=0).reset_index(drop=True)
truth = df["MedInc"]

# ---------- 1. MCAR vs MNAR ----------
print("1. WHAT MEAN IMPUTATION DOES TO A DISTRIBUTION")
print(f"   {'scenario':<36}{'mean':>8}{'std':>8}{'corr':>9}")

def report(label, col):
    print(f"   {label:<36}{col.mean():>8.3f}{col.std():>8.3f}"
          f"{col.corr(df['HouseAge']):>+9.3f}")

report("complete truth", truth)

mcar = truth.copy()
mcar[rng.rand(len(mcar)) < 0.30] = np.nan            # missing at random
report("MCAR 30% gone, before imputing", mcar)
report("MCAR + mean imputation", mcar.fillna(mcar.mean()))

mnar = truth.copy()
mnar[truth > truth.quantile(0.70)] = np.nan          # top earners decline
report("MNAR top 30% hidden, before", mnar)
report("MNAR + mean imputation", mnar.fillna(mnar.mean()))

# ---------- 2. deletion arithmetic ----------
X = df.drop(columns=["MedHouseVal"])
print(f"\n2. LISTWISE DELETION — dropna() on {X.shape[1]} columns")
print(f"   {'missing per column':>20}{'rows kept (theory)':>20}{'measured':>10}")
for p in [0.01, 0.05, 0.10]:
    theory = (1 - p) ** X.shape[1]
    measured = X.mask(rng.rand(*X.shape) < p).dropna().shape[0] / len(X)
    print(f"   {p:>19.0%}{theory:>19.1%}{measured:>10.1%}")

# ---------- 3. when is a smarter imputer worth it? ----------
def trial(cols, label):
    Xc = df[cols].copy()
    local = np.random.RandomState(42)                # fixed, so this is reproducible
    mask = np.zeros(Xc.shape, bool)
    mask[:, 0] = local.rand(len(Xc)) < 0.20          # hide only column 0
    Xm, sd = Xc.mask(mask), Xc.std()

    def nrmse(filled):
        f = pd.DataFrame(filled, columns=cols)
        return float(np.sqrt((((f - Xc) / sd) ** 2).values[mask].mean()))

    r = Xc.corr().iloc[0, 1:].abs().max()
    print(f"\n   {label}  (r = {r:.2f})")
    for n, imp in [("SimpleImputer(mean)", SimpleImputer(strategy="mean")),
                   ("KNNImputer(5)", KNNImputer(n_neighbors=5)),
                   ("IterativeImputer", IterativeImputer(random_state=0, max_iter=20))]:
        print(f"     {n:<24}{nrmse(imp.fit_transform(Xm)):>9.4f}")

print("\n3. RECOVERY ERROR vs THE VALUES WE HID  (0 = perfect, 1 = no better than the mean)")
trial(["AveBedrms", "AveRooms"], "predictable column")
trial(["HouseAge", "AveOccup"], "unpredictable column")

# ---------- 4. fit learns; transform applies ----------
print("\n4. fit() LEARNS FROM TRAIN, transform() APPLIES TO TEST")
tr = pd.DataFrame({"age": [25, 30, 35, np.nan, 40],
                   "salary": [50e3, np.nan, 70e3, 80e3, 90e3]})
te = pd.DataFrame({"age": [np.nan, 99], "salary": [np.nan, 10e3]})
imp = SimpleImputer(strategy="mean").fit(tr)
print(f"   imp.statistics_ (learned from train) = {imp.statistics_}")
print(f"   test set after transform:")
print(pd.DataFrame(imp.transform(te), columns=te.columns).to_string(index=False))
print("   -> the test row was filled with TRAIN means, not its own")
```

```text title="Output"
1. WHAT MEAN IMPUTATION DOES TO A DISTRIBUTION
   scenario                                mean     std     corr
   complete truth                         3.851   1.936   -0.097
   MCAR 30% gone, before imputing         3.815   1.885   -0.120
   MCAR + mean imputation                 3.815   1.573   -0.101
   MNAR top 30% hidden, before            2.877   0.831   -0.069
   MNAR + mean imputation                 2.877   0.696   -0.056

2. LISTWISE DELETION — dropna() on 8 columns
     missing per column  rows kept (theory)  measured
                    1%              92.3%     91.6%
                    5%              66.3%     65.0%
                   10%              43.0%     42.6%

3. RECOVERY ERROR vs THE VALUES WE HID  (0 = perfect, 1 = no better than the mean)

   predictable column  (r = 0.83)
     SimpleImputer(mean)        1.4752
     KNNImputer(5)              0.7255
     IterativeImputer           0.7276

   unpredictable column  (r = 0.03)
     SimpleImputer(mean)        0.9840
     KNNImputer(5)              1.0566
     IterativeImputer           0.9840

4. fit() LEARNS FROM TRAIN, transform() APPLIES TO TEST
   imp.statistics_ (learned from train) = [3.25e+01 7.25e+04]
   test set after transform:
 age  salary
32.5 72500.0
99.0 10000.0
   -> the test row was filled with TRAIN means, not its own
```

### What to notice in that output

- **MCAR barely moved the mean; MNAR destroyed it.** `3.815` versus `2.877` against a truth of
  `3.851`. Identical amount of missing data — 30% — and one is usable while the other is a 25% error
  that no function call can undo.
- **Mean imputation cost 19% of the standard deviation** under MCAR, `1.936 → 1.573`, while leaving
  the mean untouched at `3.815`. It is *designed* to preserve the mean, so the mean can never warn
  you. Watch the spread instead.
- **Under MNAR, imputing made the std worse**, `0.831 → 0.696`, moving further from the true `1.936`.
  Imputation isn't neutral when the mechanism is wrong; it actively compounds the damage.
- **Theory and measurement agree on deletion**, `66.3%` predicted against `65.0%` observed at 5%
  missing. So the loss is calculable in advance — you never need to be surprised by it.
- **The imputer ranking reverses between the two trials.** KNN halves the error at `r = 0.83` and is
  worse than the mean at `r = 0.03`. This is the whole argument for checking correlations first.
- **`IterativeImputer` scored `0.9840` — exactly the mean's score — on the unpredictable column.**
  Its internal regression found no usable relationship and degenerated to the intercept. A well
  behaved failure, and a useful diagnostic in itself.
- **The test row was filled with `32.5` and `72500`**, the training means, not values derived from the
  two test rows. That asymmetry is what keeps a test score meaningful.

**Things worth trying:**

1. Change the MNAR cutoff from `quantile(0.70)` to `quantile(0.90)`. Less data is hidden, so the bias
   shrinks — trace how the observed mean approaches the truth as the mechanism weakens.
2. Swap `strategy="mean"` for `"median"` in the MCAR case and compare the std loss. Does the more
   robust statistic preserve spread any better?
3. Raise the mask in `trial()` from `0.20` to `0.50` and re-run. KNN's advantage on the predictable
   column should erode, because its neighbours are now missing values too.
4. Add `add_indicator=True` to the imputers in `trial()` and confirm the output gains a column.
5. Impute `AveOccup` (skew 44.7) with `IterativeImputer` and compare against `median`. This is the
   heavy-tail extrapolation failure in isolation.

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

### Mechanisms

**M1. [THEORY]** Define MCAR, MAR and MNAR, and give an example of each.

**M2. [THEORY]** For which mechanisms can imputation recover the information, and for which can it
not? Explain why.

**M3. [ANALYZE]** A survey asks for income and 30% decline. Which mechanism is most likely, and what
does that imply about imputing the mean?

**M4. [ANALYZE]** Give a practical test for suspecting MNAR, and explain why the question cannot be
answered from the data alone.

**M5. [ANALYZE]** Under MNAR, listwise deletion is sometimes described as "at least honest". Argue
against that.

### The cost of imputation

**C1. [OUT]** Complete truth had mean `3.851`, std `1.936`. After MCAR removal plus mean imputation:
mean `3.815`, std `1.573`. Explain why the mean survived and the std did not.

**C2. [THEORY]** Explain, in terms of what imputed rows contribute, why mean imputation must shrink
variance.

**C3. [THEORY]** Name three consequences of variance shrinkage for downstream analysis.

**C4. [ANALYZE]** "The mean is unchanged, so mean imputation is safe." Rebut this using the measured
figures.

**C5. [THEORY]** What is mean imputation failing to represent that multiple imputation captures?

### Deletion

**D1. [THEORY]** Give the formula for the fraction of rows surviving `dropna()` with `k` columns each
missing a fraction `p`.

**D2. [OUT]** With 8 columns at 10% missing each, what fraction of rows is kept? Show the calculation.

**D3. [ANALYZE]** A dataset has 40 columns, each 2% missing. Would you use `dropna()`? Justify with
the arithmetic.

**D4. [THEORY]** Name two situations where dropping the whole **column** is better than either
imputing or dropping rows.

### Strategies

**S1. [THEORY]** List the four `SimpleImputer` strategies and the data type each suits.

**S2. [OUT]** Mean imputation on a `0`/`1` column produced `0.714286`. Explain why this is invalid and
what should have been used.

**S3. [ANALYZE]** Why should `median` be preferred to `mean` on a column whose maximum is 442× its
median?

**S4. [THEORY]** A column stores `0` and `1`. What single question determines whether `mean` is a
legitimate strategy?

### Smarter imputers

**K1. [OUT]** Interpret this result: `[THEORY]` why does the ranking reverse?

```text
   predictable column  (r = 0.83)
     SimpleImputer(mean)        1.4752
     KNNImputer(5)              0.7255
   unpredictable column  (r = 0.03)
     SimpleImputer(mean)        0.9840
     KNNImputer(5)              1.0566
```

**K2. [THEORY]** Explain how `KNNImputer` fills a value, and why weak correlations make it perform
worse than the mean.

**K3. [OUT]** `IterativeImputer` scored `0.9840` on the unpredictable column — identical to the mean.
Explain what happened inside it.

**K4. [ANALYZE]** Describe the procedure for measuring which imputer is best on your own data,
without needing any external ground truth.

**K5. [ANALYZE]** Why did `IterativeImputer` do much worse than the mean on a column with skew 44.7?

**K6. [THEORY]** What single check should you run before choosing `KNNImputer` over `median`?

### `fit` and `transform`

**F1. [THEORY]** What does `fit` compute for a `SimpleImputer`, and where is it stored?

**F2. [OUT]** A test row's `NaN`s were filled with `32.5` and `72500`, which are the training means.
Explain why using the test set's own means would be wrong.

**F3. [THEORY]** Which method do you call on training data, and which on test data?

**F4. [OUT]** An input of shape `(3, 2)` produced output of shape `(3, 1)`. What happened, why, and
what would you inspect to detect it?

**F5. [ANALYZE]** Describe a concrete scenario in which the dropped-column behaviour causes a failure
that surfaces far from its cause.

### Applying it

**P1. [PROG]** For a DataFrame, print each column's missing count and percentage, sorted worst first.

**P2. [PROG]** Write a function that hides 20% of a chosen complete column at random, imputes with
`mean`, `median` and `KNNImputer`, and prints the RMSE of each against the hidden truth.

**P3. [PROG]** Impute with `add_indicator=True` and print the resulting column count before and after.

**P4. [PROG]** Compute, for a given DataFrame, the fraction of rows that `dropna()` would keep, and
compare it against `(1−p)ᵏ` using the mean missing rate as `p`.

**P5. [PROG]** Build a `Pipeline` containing a `SimpleImputer` and a `StandardScaler`, fit it on
train, and explain in a comment why this arrangement prevents leakage.

**P6. [ANALYZE]** You have a medical dataset where `blood_pressure` is 35% missing, and you learn the
reading was skipped when patients were too unwell. State the mechanism, say whether you would impute,
and describe what you would do instead.

### Quick self-check

1. What do MCAR, MAR and MNAR stand for?
2. Which mechanism makes imputation impossible, and why?
3. Mean imputation preserves the mean. What does it damage?
4. By how much did the standard deviation fall in the measured example?
5. With 8 columns at 5% missing each, what fraction of rows survives `dropna()`?
6. When should you use `median` instead of `mean`?
7. What is wrong with `0.714286` as an imputed value for `employed`?
8. What decides whether `KNNImputer` beats the mean?
9. What does `IterativeImputer` do when there is no signal to find?
10. What does `add_indicator=True` preserve, and when does it matter most?
11. Which of `fit_transform` and `transform` belongs on the test set?
12. What happens to a column that is entirely `NaN` when `fit` is called?
