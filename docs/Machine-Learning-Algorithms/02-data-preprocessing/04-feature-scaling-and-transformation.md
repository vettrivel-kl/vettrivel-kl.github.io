---
sidebar_position: 4
title: Feature Scaling and Transformation
description: Which models need scaling and which are provably indifferent, why one outlier ruins MinMaxScaler, what log transforms actually fix, and how large the scaling leak really is.
tags: [machine-learning, data-preprocessing, scikit-learn]
toc_max_heading_level: 3
---

# Feature Scaling and Transformation

> **Topic —** Everything is finally numeric. Now the columns are on absurdly different scales — and
> some models are crippled by that while others are **provably indifferent** to it. This page is about
> knowing which situation you're in, then choosing a scaler that survives your data.

---

## The problem

One dataset, four of its columns:

```text title="Output"
                      min        max       std
mean area        143.5000  2501.0000  351.9141
worst area       185.2000  4254.0000  569.3570
mean radius        6.9810    28.1100    3.5240
mean smoothness    0.0526     0.1634    0.0141
   largest std 569.36 (worst area), smallest 0.002646 (fractal dimension error)
   ratio: 215,171x
```

**The most variable column has 215,171× the spread of the least variable one.** Both describe the same
tumours; they're simply measured in different units.

Now consider what a distance calculation does with that. Euclidean distance between two samples sums
squared differences across all columns. A 100-unit difference in `worst area` contributes
`100² = 10,000`. A difference spanning the *entire range* of `mean smoothness` — about `0.11` —
contributes `0.0121`. The area column outvotes the smoothness column by roughly a million to one.

The model isn't weighing evidence. **It's reading the units.**

---

## The two formulas

### Standardisation (Z-score normalisation)

Subtract the mean, divide by the standard deviation:

```
z = (x − mean) / std
```

The result has **mean 0 and standard deviation 1**. Values are *not* bounded — an extreme input stays
extreme, just expressed in standard deviations.

```python
StandardScaler()
```

### Min–max normalisation

Subtract the minimum, divide by the range:

```
x' = (x − min) / (max − min)
```

The result is **bounded to `[0, 1]`** by construction, with the smallest value at exactly `0` and the
largest at exactly `1`.

```python
MinMaxScaler()
```

| | Standardisation | Min–max |
|---|---|---|
| Output | mean 0, std 1 | bounded `[0, 1]` |
| Bounded? | No | **Yes** |
| Uses | mean, std | **min, max** |
| Outlier sensitivity | Moderate | **Severe** |
| Preserves shape of distribution | Yes | Yes |
| Default choice | **Usually this** | When bounds are required |

Neither changes the *shape* of a distribution — both are linear rescalings. A skewed column stays
exactly as skewed after either. Fixing shape is what transformations, further down, are for.

---

## Which models actually need it

This is the question worth answering precisely, and it's measurable. Same data, same folds, only
scaling differs:

```text title="Output"
   model                     unscaled   scaled     gain
   KNeighbors(5)               0.9279   0.9649  +0.0369
   SVC(rbf)                    0.9122   0.9736  +0.0615
   LogisticRegression          0.9526   0.9807  +0.0281
   RandomForest                0.9631   0.9631  +0.0000
```

**SVC gained 6.2 points. RandomForest gained exactly zero** — identical to four decimal places.

That zero isn't luck, it's structural:

| Model family | Needs scaling? | Why |
|---|---|---|
| **kNN**, **K-Means**, **SVM** | **Yes** — critically | They compute **distances**; units become weights |
| **Logistic / linear regression** | Yes, when regularised | The penalty shrinks all coefficients equally, so scale decides who gets penalised |
| **Neural networks** | Yes | Gradient descent converges badly on mismatched scales |
| **PCA** | **Yes** | It maximises variance, so the largest-variance column dominates |
| **Decision trees, Random Forest, Boosting** | **No** | They split on **thresholds**, and thresholds are scale-free |

### Why trees are immune

A tree asks *"is `area ≤ 750`?"* Rescale that column and the question simply becomes *"is
`area_scaled ≤ 0.31`?"* — **the same split, partitioning the same rows.**

Any **monotonic** transformation preserves the ordering of values, and a tree only ever uses ordering.
So scaling, log transforms, and square roots are all invisible to it. This is a genuinely useful
property: it means you can skip scaling entirely for tree ensembles, and it explains why boosted trees
are so forgiving of raw, messy features.

:::tip Unsure? Scale anyway

Scaling costs nothing for models that don't need it — the RandomForest row proves that, at `+0.0000`.
It's substantial for models that do. Inside a `Pipeline` it's one extra line.

The asymmetry is decisive: forgetting to scale kNN cost 3.7 points here; scaling a forest
unnecessarily cost nothing at all.

:::

---

## One outlier, four scalers

Both formulas above are computed *from the data*, so a single extreme value poisons them. Here are
200 values drawn around 50, plus a single `5000`:

```text title="Output"
   scaler            uses                range of the 200     span
   StandardScaler    mean / std        -0.1460 .. -0.0043   0.1417
   MinMaxScaler      min / max           0.0000 .. 0.0099   0.0099
   RobustScaler      median / IQR       -1.7187 .. 1.5329   3.2516
   MaxAbsScaler      max absolute        0.0049 .. 0.0148   0.0099
```

Read the `span` column — how much room the **200 real values** got:

**`MinMaxScaler` compressed them into `0.0099`** — under **1%** of its output range. The outlier
claimed `1.0` for itself and everything real is squashed against zero, effectively indistinguishable.
This is the worst case because `min` and `max` are each set by exactly **one** data point.

**`StandardScaler` gave them `0.1417`** — better, but still badly compressed. The mean was dragged
upward and the std inflated by the single outlier, so genuine variation shrank to a seventh of what it
should be.

**`RobustScaler` gave them `3.2516`** — the real structure survives intact. It centres on the
**median** and divides by the **interquartile range**, and neither statistic notices one extreme value.

| Scaler | Centre | Scale | Robust? |
|---|---|---|---|
| `StandardScaler` | mean | std | No |
| `MinMaxScaler` | min | max − min | **No — worst** |
| `RobustScaler` | **median** | **IQR** | **Yes** |
| `MaxAbsScaler` | none | max abs | No — but preserves sparsity |

:::warning `MinMaxScaler` and outliers do not mix

If a column might contain an extreme value, min–max is the wrong choice — one point defines your
entire range. Use `RobustScaler`, or handle the outliers first — see
[Outliers and Feature Engineering](./05-outliers-and-feature-engineering.md).

`MinMaxScaler` earns its place when bounded output is a *requirement* — image pixel values, or a
neural network layer expecting `[0, 1]` — not as a default.

:::

### `Normalizer` is not a scaler — it works on rows

A genuinely common confusion, worth seeing directly:

```text title="Output"
   input rows      [1.0, 2.0, 3.0] and [100.0, 200.0, 300.0]
   StandardScaler  [[-1.0, -1.0, -1.0], [1.0, 1.0, 1.0]]
   Normalizer      [[0.267, 0.535, 0.802], [0.267, 0.535, 0.802]]
```

`StandardScaler` works **down columns** — each feature is rescaled independently. `Normalizer` works
**across rows** — each *sample* is scaled to unit length.

Notice what happened: the two input rows differ by a factor of 100, and `Normalizer` made them
**identical**. It discarded magnitude entirely, keeping only direction. That's the right thing for
text frequency vectors, where document length shouldn't matter — and completely wrong if magnitude
carries information.

**Everything else on this page scales columns. `Normalizer` scales rows. It is not a substitute for
any of them.**

---

## Transformations: changing the shape

Scaling moves and stretches a distribution. It never changes its **shape**. When a column is heavily
skewed, shape is the problem — and a linear model asked to fit a variable whose values span four
orders of magnitude will be dominated by the tail.

Skew measures asymmetry, where `0` is symmetric:

```text title="Output"
   column            raw    log1p     sqrt  Yeo-Johnson  Quantile
   MedInc           1.65     0.23     0.69        -0.00      0.18
   AveRooms        20.70     1.39     4.85        -0.17     -0.00
   AveOccup        97.63     3.88    43.34        -0.11      0.03
   Population       4.94    -1.04     1.22         0.11      0.03
```

Three things to read from that table.

**Log transforms are powerful.** `AveOccup` went from skew `97.63` to `3.88` — a column so
right-tailed as to be unusable for a linear model became merely awkward. `AveRooms` went from `20.70`
to `1.39`.

**Square root is a weaker version of the same idea.** `AveOccup` only reached `43.34`. Both compress
large values more than small ones; log just compresses far harder.

**Log is not automatically correct — it can overshoot.** Look at `Population`: skew `+4.94` became
**`−1.04`**. The transform overcorrected, converting a right tail into a left one. Applying `log`
reflexively to anything skewed is how that happens.

### `log` versus `log1p`

```text title="Output"
    np.log1p([0.0, 1.0, 10.0]) = [0.0, 0.693, 2.398]
    np.log([0.0, 1.0, 10.0])   = [-inf, 0.0, 2.303]   <- -inf
```

`log(0)` is `−inf`, and one `−inf` propagates through every downstream computation. `log1p(x)`
computes `log(1 + x)`, so zero maps to zero. **If a column can contain zeros, use `log1p`.**

Negative values break logarithms entirely — no shifting trick makes that principled.

### Let the data choose the transform

`PowerTransformer` fits the transformation strength to the column rather than assuming it:

```python
PowerTransformer(method="yeo-johnson")   # default; accepts negatives and zeros
PowerTransformer(method="box-cox")       # strictly positive input only
```

It got every column in that table to a skew between `−0.17` and `+0.11` — including `Population`,
which log overcorrected, and including columns with negative values that log cannot touch:

```text title="Output"
PowerTransformer(yeo-johnson) on [-5.0, 0.0, 5.0] -> [-1.225, -0.0, 1.225]
```

`QuantileTransformer(output_distribution="normal")` is the blunter instrument — it maps values to
their ranks and then onto a normal distribution, forcing near-perfect symmetry (`−0.00`, `0.03`)
regardless of input shape. It's effective and it discards the actual spacing between values, keeping
only their order.

| Transform | Handles 0 | Handles negatives | Strength |
|---|---|---|---|
| `np.log` | **No** | **No** | Fixed, strong |
| `np.log1p` | Yes | No | Fixed, strong |
| `np.sqrt` | Yes | No | Fixed, mild |
| `PowerTransformer` (Yeo-Johnson) | Yes | **Yes** | **Fitted per column** |
| `PowerTransformer` (Box-Cox) | No | No | Fitted per column |
| `QuantileTransformer` | Yes | Yes | Forced — rank-based |

:::note Transforming the target changes what you are optimising

Everything above concerns features. Log-transforming the **target** is a different decision: minimising
squared error on `log(y)` minimises *relative* error on `y`, not absolute error.

For a house-price model that means treating a £20k miss on a £100k house as equivalent to a £200k
miss on a £1M house. Sometimes exactly right, sometimes badly wrong — but it is a modelling choice,
not a preprocessing step. And remember predictions come back in log space and need `np.expm1` to be
interpretable.

:::

---

## Sparse data

The [previous page](./03-encoding-categorical-data.md#what-cardinality-costs) established that
one-hot output should stay sparse — 1,000 categories cost `0.8 MB` sparse against `400 MB` dense.
Centering breaks that:

```text title="Output"
  sparse one-hot: (5000, 50), stored non-zeros = 5,000 (2.0% of cells)
  StandardScaler() on sparse -> ValueError
    Cannot center sparse matrices: pass `with_mean=False` instead.
  StandardScaler(with_mean=False): OK, still sparse = True, nnz = 5,000
```

Subtracting the mean would turn every one of those zeros into a non-zero, converting a 2%-full matrix
into a 100%-full one. scikit-learn refuses rather than silently exhausting your memory — a good error.

For sparse input use `StandardScaler(with_mean=False)` or `MaxAbsScaler`, which never centres and so
preserves sparsity by design.

---

## How much does scaling before the split really leak?

The rule is to `fit` on training data only. It's worth knowing the size of the effect, measured over
30 different splits:

```text title="Output"
   StandardScaler  honest 0.9643   leaked 0.9645   inflation +0.0002
   MinMaxScaler    honest 0.9663   leaked 0.9657   inflation -0.0006
```

**`+0.0002` and `−0.0006`.** Both are noise. `MinMaxScaler` actually scored marginally *worse* when
leaked.

That's an honest result and it deserves stating plainly: **scaling leakage is real in principle and
usually negligible in magnitude.** It is nothing like the target-encoding leak on the previous page,
which manufactured **21 accuracy points** out of pure noise.

The reason is what gets leaked. Target encoding leaks **the target itself, per row**. Scaling leaks
one mean and one standard deviation aggregated over hundreds of rows — a vanishing amount of
information about any individual row.

:::tip Keep the discipline anyway — for reasons other than fear

Fit on train only, but not because the numbers above are alarming. Because:

- On a **small** dataset, or with `MinMaxScaler` where one test outlier can define the range, the
  effect is larger and less predictable
- A `Pipeline` gives you correctness for free, and you want one regardless once you reach the
  train/test split
- At predict time there *is* no test set to compute statistics from, so training-set statistics are
  what you must ship

Be accurate about which leaks matter. Overstating this one makes it harder to take the genuinely
dangerous ones seriously.

:::

---

## Common Mistakes

| # | Mistake | Wrong | Right |
|---|---|---|---|
| 1 | Scaling a tree ensemble for accuracy | "it should help" | **`+0.0000`** — trees are scale-free |
| 2 | Not scaling kNN / SVM | Raw features | Cost **3.7** and **6.2** points |
| 3 | `MinMaxScaler` with outliers | Bounded is tidier | Real values got **1%** of the range |
| 4 | Assuming `StandardScaler` is outlier-proof | mean/std are robust | Span fell to `0.1417`; use `RobustScaler` |
| 5 | Using `Normalizer` to scale features | It's a scaler | It scales **rows**, not columns |
| 6 | Expecting scaling to fix skew | Standardise and move on | Linear rescaling can't change **shape** |
| 7 | `np.log` on a column with zeros | `log(0)` | `−inf`; use `log1p` |
| 8 | Applying `log` reflexively | Skew means log | It flipped `+4.94` to **`−1.04`** |
| 9 | Centering sparse data | `StandardScaler()` | `ValueError`; `with_mean=False` |
| 10 | Log-transforming the target casually | Just another transform | Changes the **error you minimise** |
| 11 | Forgetting to invert a target transform | Report predictions directly | `np.expm1` |
| 12 | `fit` on the full dataset | Convenience | Fit on train — cheap discipline |
| 13 | Scaling before imputing | Order doesn't matter | `NaN` breaks statistics; impute first |

---

## Summary

| Task | Code |
|---|---|
| Mean 0, std 1 | `StandardScaler()` |
| Bounded `[0, 1]` | `MinMaxScaler()` |
| Outlier-resistant | `RobustScaler()` |
| Sparse-safe | `StandardScaler(with_mean=False)`, `MaxAbsScaler()` |
| Unit-length **rows** | `Normalizer()` |
| Reduce skew, fixed | `np.log1p(x)`, `np.sqrt(x)` |
| Reduce skew, fitted | `PowerTransformer()` |
| Force symmetry | `QuantileTransformer(output_distribution="normal")` |
| Measure skew | `scipy.stats.skew(x)` |

**Key takeaways**

- The measured spread ratio between two columns of one dataset was **215,171×** — distance models read
  that as importance
- Standardisation gives **mean 0, std 1**, unbounded; min–max gives **`[0, 1]`**, bounded
- Neither changes a distribution's **shape**
- Measured gains from scaling: **SVC +6.2**, **kNN +3.7**, **logistic +2.8**, **RandomForest +0.0000**
- Trees split on **thresholds**, so any **monotonic** transform leaves every split available — they are
  structurally immune
- PCA and regularised linear models need scaling too, for different reasons (variance; equal penalties)
- Scaling costs nothing when unnecessary, so **scale when unsure**
- One outlier gave the 200 real values a span of **`0.0099`** under `MinMaxScaler` and **`3.2516`**
  under `RobustScaler`
- `MinMaxScaler` is worst with outliers because `min` and `max` are each set by a **single point**
- `RobustScaler` uses **median and IQR**, which one extreme value cannot move
- **`Normalizer` scales rows, not columns** — it made `[1,2,3]` and `[100,200,300]` identical
- Log transforms cut `AveOccup`'s skew from **97.63 → 3.88**; `sqrt` is a milder version
- **Log can overcorrect** — `Population` went from `+4.94` to **`−1.04`**
- `log(0) = −inf`; use **`log1p`**. Negatives break logs entirely
- `PowerTransformer` **fits** the transform per column, reaching skew `−0.17`..`+0.11` on all four, and
  Yeo-Johnson accepts negatives
- Centering sparse data raises `ValueError` — it would destroy sparsity; use `with_mean=False`
- **Scaling leakage measured `+0.0002`** — real but negligible, unlike target encoding's `+21` points
- Impute **before** scaling; `NaN` breaks the statistics

**Next in this section:** [Outliers and Feature Engineering](./05-outliers-and-feature-engineering.md)
— the extreme values that just broke two of these four scalers

**See also:** [Encoding Categorical Data](./03-encoding-categorical-data.md#what-cardinality-costs) for
the sparsity this must preserve · [Missing Values](./02-missing-values.md) for why imputation comes
first · [The Toolkit and the Pipeline](../01-foundations/05-toolkit-and-pipeline.md#the-contract-that-makes-it-work)
for `fit` versus `transform`

---

## Run It Yourself

```python title="scaling.py"
"""Feature scaling and transformation — who needs it, which scaler, and what log really fixes."""

import warnings
import numpy as np
import pandas as pd
from scipy import stats
from sklearn.datasets import fetch_california_housing, load_breast_cancer
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import cross_val_score, train_test_split
from sklearn.neighbors import KNeighborsClassifier
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import (MaxAbsScaler, MinMaxScaler, Normalizer,
                                   PowerTransformer, QuantileTransformer,
                                   RobustScaler, StandardScaler)
from sklearn.svm import SVC

warnings.filterwarnings("ignore")

# ---------- 1. the scale problem, and who cares ----------
d = load_breast_cancer(as_frame=True)
X, y = d.data, d.target
print("1. THE SCALE PROBLEM — same dataset, different columns")
print(pd.DataFrame({"min": X.min(), "max": X.max(), "std": X.std()}).loc[
    ["mean area", "worst area", "mean radius", "mean smoothness"]].round(4).to_string())
print(f"   largest std {X.std().max():.2f} ({X.std().idxmax()}), "
      f"smallest {X.std().min():.6f} ({X.std().idxmin()})")
print(f"   ratio: {X.std().max() / X.std().min():,.0f}x")

print(f"\n   {'model':<24}{'unscaled':>10}{'scaled':>9}{'gain':>9}")
for name, mk in [("KNeighbors(5)", lambda: KNeighborsClassifier()),
                 ("SVC(rbf)", lambda: SVC()),
                 ("LogisticRegression", lambda: LogisticRegression(max_iter=200)),
                 ("RandomForest", lambda: RandomForestClassifier(random_state=0))]:
    raw = cross_val_score(mk(), X, y, cv=5).mean()
    sc = cross_val_score(make_pipeline(StandardScaler(), mk()), X, y, cv=5).mean()
    print(f"   {name:<24}{raw:>10.4f}{sc:>9.4f}{sc - raw:>+9.4f}")

# ---------- 2. one outlier, four scalers ----------
rng = np.random.RandomState(0)
data = np.append(rng.normal(50, 10, 200), 5000.0).reshape(-1, 1)
print("\n2. ONE OUTLIER — 200 values around 50, plus a single 5000")
print(f"   {'scaler':<18}{'uses':<16}{'range of the 200':>20}{'span':>9}")
for name, sc, uses in [("StandardScaler", StandardScaler(), "mean / std"),
                       ("MinMaxScaler", MinMaxScaler(), "min / max"),
                       ("RobustScaler", RobustScaler(), "median / IQR"),
                       ("MaxAbsScaler", MaxAbsScaler(), "max absolute")]:
    body = sc.fit_transform(data).ravel()[:200]
    print(f"   {name:<18}{uses:<16}"
          f"{f'{body.min():.4f} .. {body.max():.4f}':>20}{body.max() - body.min():>9.4f}")

# ---------- 3. Normalizer works on rows ----------
print("\n3. Normalizer SCALES ROWS, NOT COLUMNS")
m = np.array([[1.0, 2.0, 3.0], [100.0, 200.0, 300.0]])
print(f"   input rows      {m[0].tolist()} and {m[1].tolist()}")
print(f"   StandardScaler  {StandardScaler().fit_transform(m).round(3).tolist()}")
print(f"   Normalizer      {Normalizer().fit_transform(m).round(3).tolist()}")
print("   -> the two rows became IDENTICAL; magnitude was discarded")

# ---------- 4. transformations against skew ----------
ca = fetch_california_housing(as_frame=True).frame
print("\n4. SKEW (0 = symmetric)")
print(f"   {'column':<12}{'raw':>9}{'log1p':>9}{'sqrt':>9}{'Yeo-Johnson':>13}{'Quantile':>10}")
for c in ["MedInc", "AveRooms", "AveOccup", "Population"]:
    v = ca[c].values.reshape(-1, 1)
    yj = PowerTransformer().fit_transform(v).ravel()
    qt = QuantileTransformer(output_distribution="normal", n_quantiles=1000,
                             random_state=0).fit_transform(v).ravel()
    print(f"   {c:<12}{stats.skew(v.ravel()):>9.2f}{stats.skew(np.log1p(v.ravel())):>9.2f}"
          f"{stats.skew(np.sqrt(v.ravel())):>9.2f}{stats.skew(yj):>13.2f}{stats.skew(qt):>10.2f}")
print("   log1p handles zeros; plain log(0) is -inf. Yeo-Johnson accepts negatives.")

# ---------- 5. how big is the scaling leak, really? ----------
print("\n5. SCALING BEFORE THE SPLIT — measured over 30 splits")
Xb, yb = load_breast_cancer(return_X_y=True)
for label, Scaler in [("StandardScaler", StandardScaler), ("MinMaxScaler", MinMaxScaler)]:
    honest, leaked = [], []
    for seed in range(30):
        Xtr, Xte, ytr, yte = train_test_split(Xb, yb, test_size=0.3,
                                              random_state=seed, stratify=yb)
        sc = Scaler().fit(Xtr)                                   # honest
        honest.append(KNeighborsClassifier().fit(sc.transform(Xtr), ytr)
                      .score(sc.transform(Xte), yte))
        Xall = Scaler().fit_transform(Xb)                        # leaked
        Atr, Ate, btr, bte = train_test_split(Xall, yb, test_size=0.3,
                                              random_state=seed, stratify=yb)
        leaked.append(KNeighborsClassifier().fit(Atr, btr).score(Ate, bte))
    print(f"   {label:<16}honest {np.mean(honest):.4f}   leaked {np.mean(leaked):.4f}"
          f"   inflation {np.mean(leaked) - np.mean(honest):+.4f}")
```

```text title="Output"
1. THE SCALE PROBLEM — same dataset, different columns
                      min        max       std
mean area        143.5000  2501.0000  351.9141
worst area       185.2000  4254.0000  569.3570
mean radius        6.9810    28.1100    3.5240
mean smoothness    0.0526     0.1634    0.0141
   largest std 569.36 (worst area), smallest 0.002646 (fractal dimension error)
   ratio: 215,171x

   model                     unscaled   scaled     gain
   KNeighbors(5)               0.9279   0.9649  +0.0369
   SVC(rbf)                    0.9122   0.9736  +0.0615
   LogisticRegression          0.9526   0.9807  +0.0281
   RandomForest                0.9631   0.9631  +0.0000

2. ONE OUTLIER — 200 values around 50, plus a single 5000
   scaler            uses                range of the 200     span
   StandardScaler    mean / std        -0.1460 .. -0.0043   0.1417
   MinMaxScaler      min / max           0.0000 .. 0.0099   0.0099
   RobustScaler      median / IQR       -1.7187 .. 1.5329   3.2516
   MaxAbsScaler      max absolute        0.0049 .. 0.0148   0.0099

3. Normalizer SCALES ROWS, NOT COLUMNS
   input rows      [1.0, 2.0, 3.0] and [100.0, 200.0, 300.0]
   StandardScaler  [[-1.0, -1.0, -1.0], [1.0, 1.0, 1.0]]
   Normalizer      [[0.267, 0.535, 0.802], [0.267, 0.535, 0.802]]
   -> the two rows became IDENTICAL; magnitude was discarded

4. SKEW (0 = symmetric)
   column            raw    log1p     sqrt  Yeo-Johnson  Quantile
   MedInc           1.65     0.23     0.69        -0.00      0.18
   AveRooms        20.70     1.39     4.85        -0.17     -0.00
   AveOccup        97.63     3.88    43.34        -0.11      0.03
   Population       4.94    -1.04     1.22         0.11      0.03
   log1p handles zeros; plain log(0) is -inf. Yeo-Johnson accepts negatives.

5. SCALING BEFORE THE SPLIT — measured over 30 splits
   StandardScaler  honest 0.9643   leaked 0.9645   inflation +0.0002
   MinMaxScaler    honest 0.9663   leaked 0.9657   inflation -0.0006
```

### What to notice in that output

- **`RandomForest` scored `0.9631` both times — an exact tie to four decimal places.** Not "roughly
  the same": identical. That is what structural invariance looks like, and it's the cleanest possible
  evidence that scaling is about the *algorithm*, not about tidiness.
- **`SVC` was the biggest loser from raw features**, `0.9122 → 0.9736`. An RBF kernel is a distance
  computation, so a 215,171× spread ratio translates directly into a 215,171× importance ratio.
- **`MinMaxScaler` and `MaxAbsScaler` produced the identical span `0.0099`.** Both are anchored to an
  extreme value, so both fail the same way — the shared weakness is depending on a single point.
- **`RobustScaler`'s span was 328× wider than `MinMaxScaler`'s** on exactly the same input. Same data,
  same goal, and only the choice of centre and scale statistic differs.
- **`Normalizer` mapped two rows 100× apart onto the same point.** If you reached for it expecting
  column scaling, this is silent, total information loss.
- **`log1p` overcorrected `Population` from `+4.94` to `−1.04`** while `PowerTransformer` reached
  `+0.11`. The fitted transform beat the fixed one precisely where the fixed one was too strong.
- **`QuantileTransformer` hit `−0.00` and `0.03`** — near-perfect symmetry on every column, including
  one with skew `97.63`. It always succeeds because it discards spacing and keeps only rank.
- **The leak was `+0.0002`, and negative for `MinMaxScaler`.** Both within noise. Compare the previous
  page's target-encoding leak of `+0.21` — three orders of magnitude apart, and worth calibrating on.

**Things worth trying:**

1. Replace `StandardScaler` with `RobustScaler` in the model comparison. On this data the difference
   is small — which tells you the columns are reasonably well behaved.
2. Add a single extreme row to `X` and rerun the model comparison with `MinMaxScaler`. Watch kNN
   degrade as the real variation is crushed.
3. Apply `np.log1p` to `AveOccup` and refit a `LinearRegression` on the housing target. Compare R²
   against untransformed — this is the transform paying off.
4. Run `PowerTransformer().fit(v).lambdas_` for each column to see the exponent it chose. Values near
   `0` mean it selected something close to a log; near `1` means barely any transform.
5. Scale a matrix that still contains `NaN` and observe what `StandardScaler` does — this is why
   imputation comes first.

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

### The problem and the formulas

**S1. [THEORY]** Write the formula for standardisation and for min–max normalisation, and state the
output range of each.

**S2. [ANALYZE]** Two columns have standard deviations of `569` and `0.0026`. Explain, using Euclidean
distance, why this makes one column dominate.

**S3. [THEORY]** Does either scaling formula change the *shape* of a distribution? What does change it?

**S4. [THEORY]** When is `MinMaxScaler` the right choice despite its outlier sensitivity?

### Who needs scaling

**W1. [OUT]** From the measured table, which model gained most from scaling and which gained exactly
nothing? Give both figures.

**W2. [THEORY]** Explain mechanically why a decision tree is unaffected by feature scaling.

**W3. [THEORY]** What property must a transformation have for a tree to be invariant to it?

**W4. [THEORY]** Give the reason PCA needs scaled input, and the reason a regularised linear model
does. They are not the same reason.

**W5. [ANALYZE]** Argue for "scale when unsure" using the asymmetry in the measured results.

**W6. [THEORY]** Name three model families that require scaling and two that do not.

### Scalers and outliers

**O1. [OUT]** With one outlier present, the 200 real values spanned `0.0099` under `MinMaxScaler` and
`3.2516` under `RobustScaler`. Explain both numbers from the formulas.

**O2. [THEORY]** Why is `MinMaxScaler` the *most* outlier-sensitive of the four?

**O3. [ANALYZE]** `MinMaxScaler` and `MaxAbsScaler` produced the same span. What do they have in
common that explains this?

**O4. [THEORY]** Which statistics does `RobustScaler` use, and why is each resistant to outliers?

**O5. [ANALYZE]** `StandardScaler` still compressed the real values to `0.1417`. Explain how a single
value affects *both* of its statistics.

### `Normalizer`

**N1. [OUT]** `Normalizer` mapped `[1,2,3]` and `[100,200,300]` to the same output. Explain why.

**N2. [THEORY]** State the axis `Normalizer` operates on versus `StandardScaler`.

**N3. [THEORY]** Give one application where discarding row magnitude is correct.

### Transformations

**T1. [OUT]** `AveOccup` had skew `97.63`, becoming `3.88` under `log1p` and `43.34` under `sqrt`.
Explain the ordering of those three numbers.

**T2. [OUT]** `Population` went from skew `+4.94` to `−1.04` under `log1p`. Name what happened and what
it implies about applying log by default.

**T3. [THEORY]** Why does `np.log` fail on a column containing zeros, and what should be used instead?

**T4. [THEORY]** What does `PowerTransformer` do that `np.log1p` does not?

**T5. [THEORY]** Which `PowerTransformer` method accepts negative values, and which does not?

**T6. [ANALYZE]** `QuantileTransformer` achieved near-zero skew on every column. Why does it always
succeed, and what is the cost?

**T7. [ANALYZE]** Explain what changes when you log-transform the **target** rather than a feature,
and give a concrete example of the trade-off.

### Sparse data and leakage

**P1. [OUT]** `StandardScaler()` on a sparse matrix raises `ValueError`. Explain the reason and give
the fix.

**P2. [ANALYZE]** A one-hot matrix is 2% non-zero. Describe what centering would do to its memory
footprint.

**P3. [OUT]** Scaling leakage measured `+0.0002` and `−0.0006`. What should you conclude, and what
should you *not* conclude?

**P4. [ANALYZE]** Target encoding leaked `+0.21` while scaling leaked `+0.0002`. Explain the difference
in terms of what information each leaks.

**P5. [ANALYZE]** Given the measured leak is negligible, give three reasons still to fit scalers on
training data only.

### Applying it

**A1. [PROG]** Compare `KNeighborsClassifier` accuracy with no scaler, `StandardScaler`, and
`RobustScaler`, using a `Pipeline` and `cross_val_score`.

**A2. [PROG]** Print the skew of every numeric column in a DataFrame, sorted worst first.

**A3. [PROG]** For one skewed column, print skew after `log1p`, `sqrt`, and `PowerTransformer`, and
report which wins.

**A4. [PROG]** Build a `ColumnTransformer` that applies `StandardScaler` to numeric columns and
`OneHotEncoder` to categorical ones, keeping the output sparse.

**A5. [PROG]** Fit `PowerTransformer` on a column and print `lambdas_`. Explain what the value means.

**A6. [ANALYZE]** You have 30 numeric features, one with extreme outliers, and you plan to use both
kNN and gradient boosting. State your scaling plan for each model and justify it.

### Quick self-check

1. Write both scaling formulas and their output ranges.
2. Which measured model gained `+0.0000` from scaling, and why?
3. Why are trees invariant to monotonic transforms?
4. Which scaler is worst with outliers, and why?
5. Which statistics does `RobustScaler` use?
6. What axis does `Normalizer` operate on?
7. Can scaling fix skew?
8. What is `log(0)`, and what should you use instead?
9. What did `log1p` do to `Population`'s skew?
10. Which `PowerTransformer` method handles negatives?
11. Why can't you centre a sparse matrix?
12. How large was the measured scaling leak, and how does it compare to target encoding?
13. Should you impute before or after scaling?
