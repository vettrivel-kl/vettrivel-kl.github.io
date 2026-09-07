---
sidebar_position: 5
title: Outliers and Feature Engineering
description: What the IQR rule really flags, why outliers hide each other, the extreme point no single column can see, which treatment actually works, and the features a model cannot invent for itself.
tags: [machine-learning, data-preprocessing, scikit-learn]
toc_max_heading_level: 3
---

# Outliers and Feature Engineering

> **Topic —** The previous page ended with one extreme value crushing two of four scalers into
> uselessness. This page deals with those values directly — and then with the opposite problem: not
> removing bad information, but **adding** information the model cannot derive on its own.

---

## First: three different things called "outlier"

Lumping these together is the root of most bad outlier decisions, because the correct treatment
differs completely.

| Kind | What it is | Example | What to do |
|---|---|---|---|
| **Error** | The value is wrong | A weight recorded in grams among kilograms; a decimal slip | **Fix or remove** — it is not data |
| **Genuine extreme** | Real, rare, from the same process | A genuinely enormous house in a housing dataset | **Keep** — usually the most informative rows you have |
| **Novelty** | Real, but from a *different* process | A fraudulent transaction among legitimate ones | **Keep and study** — often the entire point |

Only the first is a data-quality problem. The second and third are signal.

:::danger "Outlier" is a statistical verdict, not a factual one

Every method below identifies values that are **statistically unusual**. None can tell you *why*.
Deleting rows because a formula flagged them means deleting genuine extremes and novelties along with
errors — and in fraud detection or fault prediction, those are precisely the rows you were hired to
find.

Detection narrows what to look at. **You** decide what it means.

:::

---

## The IQR rule

The standard method uses quartiles. **Q1** is the 25th percentile, **Q3** the 75th, and the
**interquartile range** is `IQR = Q3 − Q1` — the span of the middle 50% of the data.

```
lower bound = Q1 − 1.5 × IQR
upper bound = Q3 + 1.5 × IQR
```

Anything outside those bounds is flagged.

### Reading a box plot

A box plot is this rule drawn:

```
                    ┌─────┬─────┐
        ├───────────┤     │     ├───────────┤        ●        ●
                    └─────┴─────┘
        │           │     │     │           │        │
      lower        Q1  median  Q3         upper   flagged points
      whisker                            whisker
      (Q1−1.5·IQR)                       (Q3+1.5·IQR)
        └──────────────── the box = middle 50% ────┘
```

| Element | Meaning |
|---|---|
| The box | Q1 to Q3 — the middle 50% |
| Line in the box | The **median**, not the mean |
| Whiskers | Reach to the furthest point **within** 1.5 × IQR |
| Individual dots | Points beyond the whiskers |

Whiskers stop at the last *real* data point inside the bound, not at the bound itself — so whisker
length varies. The box uses the **median**, which is why a box plot is readable even when the mean
has been dragged away by extremes.

### Where does 1.5 come from, and what does it cost?

`1.5` is a convention, chosen so that for **roughly normal** data it flags about 0.7% of values.
Here is what it actually flags on 100,000 values from various distributions, **none of which contain
a single error**:

```text title="Output"
   distribution             skew   IQR 1.5x    |z|>3
   normal                  -0.01     0.75%    0.29%
   uniform                 -0.01     0.00%    0.00%
   exponential              2.02     4.86%    1.87%
   lognormal (mild)         1.78     3.81%    1.53%
   lognormal (heavy)       16.74    10.96%    1.34%
```

**On normal data the rule behaves exactly as advertised** — `0.75%`, against a theoretical `0.70%`.

**On skewed data it falls apart.** The heavy log-normal column had **10.96% of its values flagged** —
roughly one in nine — and every one of them is a perfectly ordinary value for that distribution. On
uniform data it flags **nothing**, because there are no tails at all.

The rule is not measuring "wrongness". It is measuring "distance from the middle in IQR units", and
that only corresponds to unusualness when the distribution is roughly symmetric.

:::tip Fix the shape before hunting outliers

This is where the [previous page](./04-feature-scaling-and-transformation.md#transformations-changing-the-shape)
pays off. `AveOccup` had skew `97.63`; the IQR rule on a column like that would condemn a large
fraction of legitimate data.

Apply `log1p` or `PowerTransformer` **first**, then detect. A skewed column and a column full of
errors look identical to the IQR rule, and only one of them is a problem.

:::

---

## Z-scores, and why outliers hide each other

The other common rule flags `|z| > 3`, where `z = (x − mean) / std`. It has a structural flaw: **the
outliers are included in the mean and standard deviation they are being compared against.**

Take 200 clean values around 50 with a standard deviation of 5, and add `k` copies of `100`:

```text title="Output"
       k     std  |z|>3 finds  MAD-z>3.5 finds
       1     6.1            1                1
       5     9.1            5                5
      10    11.7           10               10
      20    15.1           20               20
      40    19.1            0               40
```

Read the last two rows. At `k = 20` the z-score rule finds **all twenty**. At `k = 40` it finds
**none at all** — while the robust alternative finds all forty.

This is **masking**, and note its shape: not a gradual decline but a **cliff**. Every outlier here has
almost the same z-score, so as the inflating standard deviation pushes that score below `3`, they all
disappear from view simultaneously. The rule goes from perfect to blind between two adjacent values
of `k`.

The standard deviation went from `5` (true) to `19.1` — the outliers manufactured the yardstick that
then declared them normal.

### The robust version

Replace mean with **median** and standard deviation with **MAD** (median absolute deviation):

```
MAD = median(|x − median(x)|)
modified z = 0.6745 × (x − median) / MAD
```

Flag `|modified z| > 3.5`. The `0.6745` makes MAD comparable to a standard deviation for normal data.

It found every outlier at every `k`, because 40 extreme values out of 240 cannot move a median. Same
logic as `RobustScaler` on the previous page — **medians and quartiles resist what means and standard
deviations absorb.**

| Method | Centre | Spread | Masking-prone |
|---|---|---|---|
| Z-score | mean | std | **Yes — badly** |
| IQR | median (implicitly) | IQR | Resistant |
| Modified z (MAD) | **median** | **MAD** | **No** |

---

## The outlier no single column can see

Everything so far examines **one column at a time**. That misses an entire category of outlier.

Here is a dataset of heights and weights, correlated at `0.92`, into which one point has been
inserted — **155 cm and 85 kg**:

```text title="Output"
   inserted: height 155.0 cm, weight 85.0 kg
   a 155 cm person here typically weighs 56.5 kg   (columns correlate 0.92)
   column     value            IQR bounds  flagged    |z|
   height     155.0        [148.3, 192.0]    False   1.77
   weight      85.0          [48.3, 92.4]    False   1.76
   IsolationForest flagged: False   EllipticEnvelope flagged: True
   Mahalanobis rank: 0 of 501  (0 = most extreme)
```

**Both values are entirely unremarkable on their own.** 155 cm is a short but ordinary height, well
inside the IQR bounds at `|z| = 1.77`. 85 kg is a heavy but ordinary weight, `|z| = 1.76`. Neither
rule flags either.

Together they are impossible — a 155 cm person in this data typically weighs 56.5 kg. And by
**Mahalanobis distance**, which accounts for the correlation between the columns, this point ranks
**0 of 501: the single most extreme point in the entire dataset.**

Every univariate method missed it completely.

:::note The two multivariate methods disagreed — and that's instructive

`EllipticEnvelope` caught it. `IsolationForest` **did not**.

`IsolationForest` isolates points using random **axis-parallel** cuts — effectively asking "how easily
can I fence this point off using vertical and horizontal lines?" Our point sits comfortably inside both
marginal ranges, so it is hard to fence off that way.

`EllipticEnvelope` fits a covariance matrix and measures Mahalanobis distance, so it knows the two
columns should move together and sees immediately that this point violates that.

The lesson: for outliers that break a **relationship** rather than a range, use a covariance-aware
method. `IsolationForest` is excellent at extremes in individual dimensions and can miss
correlation-breaking points entirely.

:::

| Method | Sees | Catches correlation breaks |
|---|---|---|
| IQR, z-score, MAD | One column | **No** |
| `IsolationForest` | All columns, axis-parallel | Partially |
| `EllipticEnvelope` / Mahalanobis | Covariance structure | **Yes** |
| `LocalOutlierFactor` | Local density | Yes |

---

## Treatment: what actually works

Detection is the easy half. Here is a measured comparison — 20 of 280 training rows corrupted by a
10× recording error, with a **clean** test set representing reality:

```text title="Output"
   treatment                                 test R2
   clean data (unreachable ideal)             0.9902
   do nothing                                 0.1310
   remove flagged rows (IQR)                  0.9867
   cap at IQR bounds (winsorise)              0.8083
   robust model (Huber), rows kept            0.1232
```

**Doing nothing was catastrophic** — `R² = 0.1310` against an achievable `0.9902`. Twenty bad rows out
of 280 destroyed the model.

**Removing the flagged rows very nearly recovered the ideal**, `0.9867` versus `0.9902`. When the
outliers are genuinely errors, deletion is hard to beat.

**Capping helped but noticeably less**, `0.8083`. Winsorising pulls extreme values back to the bounds
rather than discarding the row, so it keeps the row's other columns — at the cost of leaving a
distorted value in place.

**The robust model did not help at all** — `0.1232`, no better than doing nothing. That result is
worth a section of its own.

### Robust models fix `y`-outliers, not `X`-outliers

`HuberRegressor` is *supposed* to resist outliers. Why didn't it? Because it resists the wrong kind:

```text title="Output"
   corruption in             OLS    Huber
   X (the features)       0.1310   0.1232
   y (the target)        -2.3392   0.9901
```

**With corruption in `y`, Huber is transformative** — `R²` goes from `−2.3392` (worse than predicting
the mean) to `0.9901`, essentially full recovery.

**With corruption in `X`, it does nothing.** Robust regression down-weights points with large
*residuals*. A corrupted feature value creates a **high-leverage** point: it sits far out along the
x-axis and *drags the fitted line to itself*, so its residual stays small. Nothing about it looks
suspicious to a residual-based method.

This distinction is routinely glossed over. "Use a robust model" is good advice for noisy targets and
no help at all for corrupted features.

### The full menu

| Treatment | Keeps the row | Good for | Watch out |
|---|---|---|---|
| **Remove** | No | Confirmed errors | Loses the row's other columns; biases if not MCAR |
| **Cap / winsorise** | Yes | Genuine extremes you want to damp | Leaves a fabricated value |
| **Transform** (`log1p`) | Yes | Skew rather than errors | Doesn't fix true errors |
| **Impute** | Yes | Errors in one column of a good row | Same caveats as any imputation |
| **Keep + flag** | Yes | When extremeness is informative | Adds a column |
| **Robust model** | Yes | Outliers in **`y`** | Useless for outliers in `X` |

:::danger Never clean the test set

Removing outliers from training data is a legitimate choice about what the model learns from. Removing
them from the **test** set is not — it makes your evaluation a report on a world that doesn't exist.

Real inputs will contain extreme values. If your model can't handle them, that is a finding you want,
not one to hide. Clean the training data; leave the test set exactly as reality delivered it.

:::

---

## Feature engineering

The other direction: instead of removing bad information, **add** information that is present in the
data but not in a form the model can use.

The measured results below make the same point twice, and it is the same point as
[label encoding](./03-encoding-categorical-data.md#how-much-does-it-cost-it-depends-entirely-on-the-model)
and [scaling](./04-feature-scaling-and-transformation.md#which-models-actually-need-it): **linear
models need help that tree models generate for themselves.**

### Cyclical features — hour 23 and hour 0 are neighbours

Suppose an outcome depends on night-time — hours `22, 23, 0, 1, 2`. That range **wraps past
midnight**, and the raw integer `hour` cannot express it: `23` and `0` are adjacent in reality but
sit at opposite ends of a `0..23` scale.

```text title="Output"
   features                           LogReg   Forest
   raw hour (0..23)                   0.6933   0.8337
   sin/cos of hour                    0.8203   0.8337
   one-hot of hour (24 cols)          0.8337   0.8337
   majority-class baseline: 0.6933
```

**Logistic regression on raw hour scored `0.6933` — exactly the majority-class baseline.** It learned
literally nothing. A single coefficient on `hour` can only say "later is more likely", and the truth
is "both ends are more likely".

The standard fix maps the hour onto a circle, so that 23 and 0 land next to each other:

```python
df["hour_sin"] = np.sin(2 * np.pi * df["hour"] / 24)
df["hour_cos"] = np.cos(2 * np.pi * df["hour"] / 24)
```

Two columns instead of one, and the wrap-around is preserved by construction. That took logistic
regression from `0.6933` to `0.8203`. One-hot encoding the hour did slightly better again at `0.8337`
— it makes no assumption about smoothness at all, at the cost of 24 columns.

**The forest scored `0.8337` on all three.** It never needed the transformation: it can split the
integer axis at `hour ≤ 2.5` and again at `hour > 21.5`, recovering the wrap on its own.

Use `sin`/`cos` for any genuinely cyclical quantity — hour of day, day of week, month, wind direction,
angle.

### Interactions — the product a linear model cannot form

Price depends on **area**, which is `length × width`. The data contains length and width:

```text title="Output"
   LinearRegression on length, width                   R2 = 0.9023
   LinearRegression on length, width, length x width   R2 = 0.9997
```

`0.9023 → 0.9997` from one added column. A linear model computes a weighted **sum** of its inputs; it
has no mechanism to multiply two of them. Given `length × width` explicitly, it fits almost perfectly.

`PolynomialFeatures(degree=2, interaction_only=True)` generates all pairwise products automatically —
useful, but the column count grows as roughly `k²/2`, so it becomes unusable on wide data. A handful
of interactions you have a reason to expect will usually beat a blanket expansion.

### The families worth knowing

| Family | Example | Why it helps |
|---|---|---|
| **Interactions** | `length × width` | Linear models can't multiply |
| **Ratios** | `debt / income`, `price per m²` | Scale-free; often the real driver |
| **Cyclical** | `sin`/`cos` of hour, month | Preserves wrap-around |
| **Datetime parts** | day of week, is_weekend, hour | A timestamp is unusable raw |
| **Aggregates** | customer's mean past spend | Brings history into one row |
| **Counts** | number of previous claims | Summarises a one-to-many relationship |
| **Binning** | age → age bands | Lets a linear model fit a non-monotonic effect |
| **Domain formulas** | BMI from height and weight | Encodes knowledge no algorithm has |

Two cautions. **Binning discards information** — it converts a precise number into a coarse band, and
helps only when the relationship really is step-like or when you need interpretability. And
**aggregates computed over the whole dataset leak**, exactly as target encoding did: a customer's
"mean past spend" must be computed from data strictly before the row you're predicting.

:::tip Ratios are the highest-value, lowest-effort feature

`debt / income` beats `debt` and `income` as separate columns in almost every credit model, because
the *relationship* is what matters and a linear model can no more divide than multiply.

When you have two columns where one is naturally "per" the other, the ratio is usually worth more than
either.

:::

---

## Common Mistakes

| # | Mistake | Wrong | Right |
|---|---|---|---|
| 1 | Treating all outliers as errors | Delete what the rule flags | Errors, extremes and novelties differ |
| 2 | IQR on skewed data | `1.5 × IQR` always | Flagged **10.96%** of clean data |
| 3 | Detecting before transforming | Hunt outliers first | Fix skew first, then detect |
| 4 | Trusting `|z| > 3` | Standard rule | Found **0 of 40** outliers — masking |
| 5 | Using mean/std to find extremes | They're the obvious statistics | Outliers inflate both; use median/MAD |
| 6 | Checking columns one at a time | Univariate scan | Missed the **most extreme point in the data** |
| 7 | Assuming `IsolationForest` catches everything | It's multivariate | Missed a correlation break; use `EllipticEnvelope` |
| 8 | "Use a robust model" for corrupted features | Huber is robust | **No help** for `X`-outliers |
| 9 | Cleaning the test set | Consistency with train | Evaluate against reality |
| 10 | Deleting rows before understanding them | The rule flagged them | You may be deleting the signal |
| 11 | Feeding raw `hour` to a linear model | It's numeric | Scored **exactly the baseline** |
| 12 | Expecting a linear model to find interactions | It has the inputs | It cannot multiply — add the product |
| 13 | Blanket `PolynomialFeatures` on wide data | More features must help | Grows as `k²/2` |
| 14 | Aggregates computed over all rows | It's just a mean | Leaks the future; use only prior rows |

---

## Summary

| Task | Code |
|---|---|
| IQR bounds | `q1, q3 = np.percentile(v, [25, 75])` |
| Modified z (robust) | `0.6745 * (v - median) / MAD` |
| Multivariate, axis-parallel | `IsolationForest()` |
| Multivariate, covariance-aware | `EllipticEnvelope()` |
| Cap to bounds | `np.clip(v, lo, hi)` |
| Robust regression (`y`-outliers) | `HuberRegressor()` |
| Cyclical encoding | `np.sin(2*np.pi*h/24)`, `np.cos(...)` |
| All pairwise products | `PolynomialFeatures(interaction_only=True)` |
| Measure skew first | `scipy.stats.skew(v)` |

**Key takeaways**

- Three different things are called outliers — **errors**, **genuine extremes**, and **novelties**;
  only the first is a defect
- Detection is a **statistical verdict**, never a factual one; the rule cannot tell you why
- `IQR = Q3 − Q1`, bounds at `Q1 − 1.5·IQR` and `Q3 + 1.5·IQR`; a box plot is that rule drawn, using
  the **median**
- `1.5` is calibrated for normal data — it flagged `0.75%` there against a theoretical `0.70%`
- On clean heavy-tailed data it flagged **10.96%** — one in nine, all false positives
- **Transform for skew before detecting**, or you condemn legitimate data
- Z-scores suffer **masking**: at `k = 20` the rule found all 20 outliers, at `k = 40` it found
  **none**, because they inflated the std from `5` to `19.1`
- Masking is a **cliff, not a slope** — identical outliers share a z-score and vanish together
- **Median and MAD** are immune, finding all 40; same principle as `RobustScaler`
- A point at 155 cm and 85 kg was **unflagged in both columns** (`|z| = 1.77`, `1.76`) yet ranked
  **0 of 501** by Mahalanobis distance — the most extreme point in the data
- `EllipticEnvelope` caught it; **`IsolationForest` did not**, because it cuts axis-parallel and the
  point breaks a *relationship*, not a range
- Measured treatment: do nothing `0.1310`, **remove `0.9867`**, cap `0.8083`, against an ideal of
  `0.9902`
- **Robust models fix `y`-outliers, not `X`-outliers** — Huber took `y`-corruption from `−2.3392` to
  `0.9901`, and did nothing for `X`-corruption
- `X`-outliers are **high-leverage**: they pull the line toward themselves, so their residuals stay
  small and residual-based methods never notice
- **Never clean the test set** — it must represent reality
- Raw `hour` gave logistic regression **exactly the majority baseline** (`0.6933`); `sin`/`cos` lifted
  it to `0.8203`, one-hot to `0.8337`
- The forest scored `0.8337` on **all three** encodings — it derives what linear models must be given
- Adding `length × width` took `R²` from `0.9023` to **`0.9997`**; a linear model cannot multiply
- **Ratios** are the highest-value low-effort feature; **binning** discards information; **aggregates
  leak** unless restricted to prior rows

**Next in this section:** [Train / Test Split](./06-train-test-split.md) — the step that decides
whether any of these numbers mean anything

**See also:** [Feature Scaling and Transformation](./04-feature-scaling-and-transformation.md#transformations-changing-the-shape)
for fixing skew before detection · [Encoding Categorical Data](./03-encoding-categorical-data.md#how-much-does-it-cost-it-depends-entirely-on-the-model)
for the same linear-versus-tree divide · [Missing Values](./02-missing-values.md) for imputing what
you remove

---

## Run It Yourself

```python title="outliers_and_features.py"
"""Outliers and feature engineering — what the rules really flag, and features a model can't invent."""

import warnings
import numpy as np
import pandas as pd
from scipy import stats
from sklearn.covariance import EllipticEnvelope
from sklearn.ensemble import IsolationForest, RandomForestClassifier
from sklearn.linear_model import HuberRegressor, LinearRegression, LogisticRegression
from sklearn.metrics import r2_score
from sklearn.model_selection import cross_val_score, train_test_split
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler

warnings.filterwarnings("ignore")
rng = np.random.RandomState(0)


def iqr_flags(v):
    q1, q3 = np.percentile(v, [25, 75])
    return (v < q1 - 1.5 * (q3 - q1)) | (v > q3 + 1.5 * (q3 - q1))


# ---------- 1. what the rules flag on data with NO errors ----------
print("1. WHAT THE RULES FLAG ON 100,000 PERFECTLY CLEAN VALUES")
print(f"   {'distribution':<22}{'skew':>7}{'IQR 1.5x':>11}{'|z|>3':>9}")
for label, v in [("normal", rng.normal(50, 10, 100_000)),
                 ("uniform", rng.uniform(0, 100, 100_000)),
                 ("exponential", rng.exponential(10, 100_000)),
                 ("lognormal (mild)", rng.lognormal(0, 0.5, 100_000)),
                 ("lognormal (heavy)", rng.lognormal(0, 1.5, 100_000))]:
    z = np.abs((v - v.mean()) / v.std()) > 3
    print(f"   {label:<22}{stats.skew(v):>7.2f}{iqr_flags(v).mean():>10.2%}{z.mean():>9.2%}")
print("   nothing here is an error. Theoretical IQR rate for a true normal: 0.70%")

# ---------- 2. masking ----------
print("\n2. MASKING — outliers inflate the std they are measured against")
base = rng.normal(50, 5, 200)
print(f"   200 clean values around 50 (sd 5), plus k copies of 100")
print(f"   {'k':>5}{'std':>8}{'|z|>3 finds':>13}{'MAD-z>3.5 finds':>17}")
for k in [1, 5, 10, 20, 40]:
    v = np.append(base, [100.0] * k)
    z = np.abs((v - v.mean()) / v.std())
    med = np.median(v)
    mz = 0.6745 * np.abs(v - med) / np.median(np.abs(v - med))
    print(f"   {k:>5}{v.std():>8.1f}{int((z > 3).sum()):>13}{int((mz > 3.5).sum()):>17}")

# ---------- 3. the outlier no single column can see ----------
print("\n3. MULTIVARIATE — ordinary in every column, impossible in combination")
h = rng.normal(170, 8, 500)
w = 0.9 * (h - 170) + 70 + rng.normal(0, 3, 500)
h, w = np.append(h, 155.0), np.append(w, 85.0)
X = np.column_stack([h, w])
odd = len(X) - 1
print(f"   inserted: height 155.0 cm, weight 85.0 kg")
print(f"   a 155 cm person here typically weighs {0.9 * (155 - 170) + 70:.1f} kg"
      f"   (columns correlate {np.corrcoef(h, w)[0, 1]:.2f})")
print(f"   {'column':<8}{'value':>8}{'IQR bounds':>22}{'flagged':>9}{'|z|':>7}")
for c, v in [("height", h), ("weight", w)]:
    q1, q3 = np.percentile(v, [25, 75])
    lo, hi = q1 - 1.5 * (q3 - q1), q3 + 1.5 * (q3 - q1)
    print(f"   {c:<8}{v[odd]:>8.1f}{f'[{lo:.1f}, {hi:.1f}]':>22}"
          f"{str(not (lo <= v[odd] <= hi)):>9}{abs((v[odd]-v.mean())/v.std()):>7.2f}")
env = EllipticEnvelope(contamination=0.01, random_state=0).fit(X)
iso = IsolationForest(contamination=0.01, random_state=0).fit(X)
md = env.mahalanobis(X)
print(f"   IsolationForest flagged: {iso.predict(X)[odd] == -1}"
      f"   EllipticEnvelope flagged: {env.predict(X)[odd] == -1}")
print(f"   Mahalanobis rank: {int((md > md[odd]).sum())} of {len(X)}  (0 = most extreme)")

# ---------- 4. treatment, and where a robust model helps ----------
print("\n4. TREATMENT — 20 of 280 training rows corrupted by a 10x error")
x = rng.uniform(0, 10, 400)
y = 3 * x + 5 + rng.normal(0, 1, 400)
Xtr, Xte, ytr, yte = train_test_split(x.reshape(-1, 1), y, test_size=0.3, random_state=0)
bad = rng.choice(len(Xtr), 20, replace=False)
Xd = Xtr.copy(); Xd[bad] *= 10
yd = ytr.copy(); yd[bad] *= 10
q1, q3 = np.percentile(Xd, [25, 75])
lo, hi = q1 - 1.5 * (q3 - q1), q3 + 1.5 * (q3 - q1)
keep = ((Xd >= lo) & (Xd <= hi)).ravel()

def r2(Xa, ya, m=None):
    return r2_score(yte, (m or LinearRegression()).fit(Xa, ya).predict(Xte))

print(f"   the TEST set is clean — it represents reality")
print(f"   {'treatment':<40}{'test R2':>9}")
print(f"   {'clean data (unreachable ideal)':<40}{r2(Xtr, ytr):>9.4f}")
print(f"   {'do nothing':<40}{r2(Xd, ytr):>9.4f}")
print(f"   {'remove flagged rows (IQR)':<40}{r2(Xd[keep], ytr[keep]):>9.4f}")
print(f"   {'cap at IQR bounds (winsorise)':<40}{r2(np.clip(Xd, lo, hi), ytr):>9.4f}")
print(f"   {'robust model (Huber), rows kept':<40}{r2(Xd, ytr, HuberRegressor()):>9.4f}")
print(f"\n   where does a robust model actually help?")
print(f"   {'corruption in':<20}{'OLS':>9}{'Huber':>9}")
print(f"   {'X (the features)':<20}{r2(Xd, ytr):>9.4f}{r2(Xd, ytr, HuberRegressor()):>9.4f}")
print(f"   {'y (the target)':<20}{r2(Xtr, yd):>9.4f}{r2(Xtr, yd, HuberRegressor()):>9.4f}")

# ---------- 5. features a model cannot invent ----------
print("\n5. FEATURE ENGINEERING")
hour = rng.randint(0, 24, 3000)
yn = (np.isin(hour, [22, 23, 0, 1, 2]) * 2.0 - 1.0 + rng.normal(0, 1, 3000) > 0).astype(int)
print(f"   (a) target depends on NIGHT hours 22,23,0,1,2 — a range that wraps past midnight")
print(f"   {'features':<32}{'LogReg':>9}{'Forest':>9}")
for label, F in [("raw hour (0..23)", hour.reshape(-1, 1).astype(float)),
                 ("sin/cos of hour", np.column_stack([np.sin(2*np.pi*hour/24),
                                                      np.cos(2*np.pi*hour/24)])),
                 ("one-hot of hour (24 cols)", np.eye(24)[hour])]:
    a = cross_val_score(make_pipeline(StandardScaler(), LogisticRegression(max_iter=1000)),
                        F, yn, cv=5).mean()
    b = cross_val_score(RandomForestClassifier(random_state=0), F, yn, cv=5).mean()
    print(f"   {label:<32}{a:>9.4f}{b:>9.4f}")
print(f"   majority-class baseline: {max(yn.mean(), 1 - yn.mean()):.4f}")

L, W = rng.uniform(1, 10, 3000), rng.uniform(1, 10, 3000)
price = 500 * (L * W) + rng.normal(0, 200, 3000)
print(f"\n   (b) price depends on AREA = length x width")
for label, F in [("length, width", np.column_stack([L, W])),
                 ("length, width, length x width", np.column_stack([L, W, L * W]))]:
    print(f"   LinearRegression on {label:<32}"
          f"R2 = {cross_val_score(LinearRegression(), F, price, cv=5, scoring='r2').mean():.4f}")
```

```text title="Output"
1. WHAT THE RULES FLAG ON 100,000 PERFECTLY CLEAN VALUES
   distribution             skew   IQR 1.5x    |z|>3
   normal                  -0.01     0.75%    0.29%
   uniform                 -0.01     0.00%    0.00%
   exponential              2.02     4.86%    1.87%
   lognormal (mild)         1.78     3.81%    1.53%
   lognormal (heavy)       16.74    10.96%    1.34%
   nothing here is an error. Theoretical IQR rate for a true normal: 0.70%

2. MASKING — outliers inflate the std they are measured against
   200 clean values around 50 (sd 5), plus k copies of 100
       k     std  |z|>3 finds  MAD-z>3.5 finds
       1     6.1            1                1
       5     9.1            5                5
      10    11.7           10               10
      20    15.1           20               20
      40    19.1            0               40

3. MULTIVARIATE — ordinary in every column, impossible in combination
   inserted: height 155.0 cm, weight 85.0 kg
   a 155 cm person here typically weighs 56.5 kg   (columns correlate 0.92)
   column     value            IQR bounds  flagged    |z|
   height     155.0        [148.3, 192.0]    False   1.77
   weight      85.0          [48.3, 92.4]    False   1.76
   IsolationForest flagged: False   EllipticEnvelope flagged: True
   Mahalanobis rank: 0 of 501  (0 = most extreme)

4. TREATMENT — 20 of 280 training rows corrupted by a 10x error
   the TEST set is clean — it represents reality
   treatment                                 test R2
   clean data (unreachable ideal)             0.9902
   do nothing                                 0.1310
   remove flagged rows (IQR)                  0.9867
   cap at IQR bounds (winsorise)              0.8083
   robust model (Huber), rows kept            0.1232

   where does a robust model actually help?
   corruption in             OLS    Huber
   X (the features)       0.1310   0.1232
   y (the target)        -2.3392   0.9901

5. FEATURE ENGINEERING
   (a) target depends on NIGHT hours 22,23,0,1,2 — a range that wraps past midnight
   features                           LogReg   Forest
   raw hour (0..23)                   0.6933   0.8337
   sin/cos of hour                    0.8203   0.8337
   one-hot of hour (24 cols)          0.8337   0.8337
   majority-class baseline: 0.6933

   (b) price depends on AREA = length x width
   LinearRegression on length, width                   R2 = 0.9023
   LinearRegression on length, width, length x width   R2 = 0.9997
```

### What to notice in that output

- **The IQR rule flagged `0.00%` of uniform data and `10.96%` of heavy log-normal data.** Same rule,
  same threshold, no errors in either. It is measuring tail thickness, not correctness.
- **The masking cliff falls between `k = 20` and `k = 40`.** Twenty outliers: all found. Forty:
  none. Because they share nearly the same z-score, they cross below `3` together — the rule is
  all-or-nothing rather than degrading gracefully.
- **The std reads `19.1` where the truth is `5`.** The outliers built the yardstick that then measured
  them as normal.
- **Both flags in section 3 are `False`, and the Mahalanobis rank is `0`.** The most extreme point in
  501 rows passed every univariate test. If you only ever scan column by column, you will never find
  points like this.
- **`IsolationForest` returned `False` on that point.** Genuinely useful to know — "multivariate" is
  not one capability. Axis-parallel isolation and covariance distance detect different things.
- **`R² = −2.3392` for OLS on `y`-corrupted data.** Negative `R²` means worse than predicting the mean
  every time — and Huber recovers it to `0.9901`, one of the largest single-change effects anywhere in
  these notes.
- **Huber on `X`-corruption scored `0.1232`, below plain OLS's `0.1310`.** Not just unhelpful,
  marginally worse. High-leverage points have small residuals, so a residual-based defence is looking
  in the wrong place.
- **Raw `hour` gave logistic regression `0.6933` — identical to the majority baseline.** Not "poor
  performance": no performance. The information was fully present and completely unusable in that
  form.
- **The forest hit `0.8337` on all three feature sets**, matching the best a linear model achieved
  with help. Third page in a row where the linear/tree divide decides whether preprocessing matters.

**Things worth trying:**

1. Apply `np.log1p` to the heavy log-normal column, then rerun `iqr_flags`. The flag rate should drop
   toward the normal-data figure — that's the "transform first" advice, measured.
2. In section 2, change the outlier value from `100` to `70` and find where the masking cliff moves.
   Closer outliers mask at smaller `k`.
3. Set `contamination=0.05` on `IsolationForest` and see whether it now catches the 155 cm / 85 kg
   point. Compare how many legitimate rows it flags as the price.
4. Corrupt both `X` and `y` simultaneously and try removal, capping, and Huber. No single treatment
   handles both.
5. Add `hour_sin`/`hour_cos` **and** raw `hour` together. Does the redundancy hurt?
6. Replace the explicit `L * W` with `PolynomialFeatures(degree=2)` and print the generated column
   names to see what it adds beyond the product you wanted.

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

### Three kinds of outlier

**K1. [THEORY]** Name the three distinct things called "outliers" and give an example and a treatment
for each.

**K2. [ANALYZE]** Explain why "delete everything the rule flags" is dangerous in fraud detection
specifically.

**K3. [THEORY]** What can a detection method tell you, and what can it never tell you?

### IQR and box plots

**I1. [THEORY]** Define Q1, Q3 and IQR, and write both IQR bounds.

**I2. [THEORY]** In a box plot, what do the box, the centre line, the whiskers and the dots each
represent? Why do whisker lengths differ between plots?

**I3. [OUT]** The IQR rule flagged `0.75%` of normal data and `10.96%` of heavy log-normal data, with
no errors in either. Explain what the rule is actually measuring.

**I4. [OUT]** It flagged `0.00%` of uniform data. Why?

**I5. [ANALYZE]** Given a column with skew `97.63`, what should you do before applying the IQR rule,
and why?

**I6. [THEORY]** Where does the constant `1.5` come from?

### Z-scores and masking

**Z1. [THEORY]** Write the z-score formula and state the structural flaw in using it to find outliers.

**Z2. [OUT]** At `k = 20` the rule found all 20 outliers; at `k = 40` it found none. Explain the
mechanism and why the transition is abrupt rather than gradual.

**Z3. [OUT]** The reported std was `19.1` where the true value is `5`. Explain.

**Z4. [THEORY]** Write the modified z-score formula using MAD, and state its usual threshold.

**Z5. [ANALYZE]** Why is the median immune to 40 extreme values among 240?

**Z6. [THEORY]** Which of z-score, IQR and modified-z are masking-prone?

### Multivariate outliers

**M1. [OUT]** The inserted point had `|z| = 1.77` and `1.76` in its two columns and was unflagged by
both, yet ranked `0 of 501` by Mahalanobis distance. Explain how both facts can be true.

**M2. [THEORY]** What does Mahalanobis distance account for that a per-column z-score does not?

**M3. [ANALYZE]** `IsolationForest` did not flag the point but `EllipticEnvelope` did. Explain the
mechanism behind each and why they disagree.

**M4. [ANALYZE]** Give a real example, other than height and weight, of a record that is ordinary in
each field and impossible in combination.

### Treatment

**T1. [OUT]** Rank these by test `R²` and explain the ordering: do nothing, remove, cap, clean ideal.

**T2. [ANALYZE]** Removal scored `0.9867` against an ideal `0.9902`. When is removal the right choice,
and what does it cost?

**T3. [THEORY]** What does winsorising do, and what does it leave behind?

**T4. [OUT]** Huber scored `0.1232` on `X`-corruption and `0.9901` on `y`-corruption. Explain the
difference in terms of residuals and leverage.

**T5. [THEORY]** Define a high-leverage point and explain why its residual is small.

**T6. [ANALYZE]** `R²` was `−2.3392` for OLS on `y`-corrupted data. What does a negative `R²` mean?

**T7. [ANALYZE]** Why must you never remove outliers from the test set?

### Feature engineering

**F1. [OUT]** Logistic regression on raw `hour` scored `0.6933`, exactly the majority baseline. State
precisely what the model learned and why.

**F2. [THEORY]** Why can't a single coefficient on `hour` express "night-time"?

**F3. [PROG]** Write the two lines that encode an hour cyclically, and explain why two columns are
needed.

**F4. [OUT]** The forest scored `0.8337` on all three feature sets. What does that tell you about when
feature engineering is necessary?

**F5. [OUT]** Adding `length × width` moved `R²` from `0.9023` to `0.9997`. Explain why the model
could not achieve this from `length` and `width` alone.

**F6. [THEORY]** Name five families of engineered feature with an example of each.

**F7. [ANALYZE]** Why are ratios described as the highest-value low-effort feature?

**F8. [ANALYZE]** Give the two cautions attached to binning and to aggregate features.

**F9. [ANALYZE]** `PolynomialFeatures` generates interactions automatically. Why is this not always
preferable to adding a few by hand?

### Applying it

**P1. [PROG]** Write a function returning the IQR bounds and the flagged indices for a column.

**P2. [PROG]** Implement the modified z-score with MAD and compare its flag count against `|z| > 3` on
a column you have corrupted with 30 identical outliers.

**P3. [PROG]** Fit `EllipticEnvelope` on two correlated columns and print the five most extreme rows
by Mahalanobis distance.

**P4. [PROG]** Compare test `R²` for removal, capping and Huber on data you corrupt yourself in `X`,
then again in `y`.

**P5. [PROG]** Given a DataFrame with a `timestamp` column, engineer hour, day of week, is_weekend,
and cyclical hour features.

**P6. [ANALYZE]** A sensor column has 3% of readings at exactly `-999`, and its distribution is heavily
right-skewed. Describe your full plan, in order, and justify each step.

### Quick self-check

1. Name the three kinds of outlier.
2. Write both IQR bounds.
3. What does the line inside a box plot show?
4. What percentage of clean heavy-tailed data did the IQR rule flag?
5. What should you do about skew before detecting outliers?
6. What is masking, and which rule suffers from it?
7. Why is the masking transition a cliff?
8. What replaces mean and std in the modified z-score?
9. How can a point be unflagged in every column yet be the most extreme in the dataset?
10. Why did `IsolationForest` miss it?
11. Which treatment came closest to the clean ideal?
12. Does a robust model help with `X`-outliers or `y`-outliers?
13. Why is a high-leverage point's residual small?
14. May you remove outliers from the test set?
15. What did logistic regression learn from raw `hour`?
16. Why does adding `length × width` help a linear model?
