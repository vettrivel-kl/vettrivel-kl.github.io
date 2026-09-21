---
sidebar_position: 6
title: Train / Test Split
description: Why a held-out set is mandatory, how much the score depends purely on random_state, and the four situations where a random split reports a number that is simply false.
tags: [machine-learning, data-preprocessing, scikit-learn]
toc_max_heading_level: 3
---

# Train / Test Split

> **Topic —** Every number in the last five pages — every accuracy, every `R²` — came from a held-out
> test set. This page is about whether those numbers mean anything. It is two lines of code and the
> most consequential decision in the whole workflow.

The four failures at the end of this page all share a shape: `train_test_split` returns without
complaint, the model scores well, and the score is **wrong**.

---

## Why hold anything back

A model evaluated on the data it learned from is not being tested, it is being asked to recall.

```text title="Output"
   model                          train    test     gap
   KNeighbors(n=1)               1.0000  0.9123  0.0877
   DecisionTree (unrestricted)   1.0000  0.9386  0.0614
   RandomForest                  1.0000  0.9474  0.0526
   LogisticRegression            0.9626  0.9474  0.0153
```

**Three of four models score a perfect `1.0000` on training data.**

For 1-nearest-neighbour this is inevitable and instructive: asked to classify a training point, it
finds that the closest point is *itself*, distance zero, and returns its label. It has memorised the
data and scores 100% while having learned nothing generalisable — its real accuracy is `0.9123`.

An unrestricted decision tree does the same by growing until every leaf is pure. A random forest, too.

So a perfect training score is not evidence of a good model. It is barely evidence of anything. The
**gap** is the interesting quantity: `0.0877` for 1-NN versus `0.0153` for logistic regression tells
you which model is memorising and which is generalising.

```python
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=1)
```

| Variable | Contains |
|---|---|
| `X_train` | Feature rows used for **training** |
| `X_test` | Feature rows used for **testing** |
| `y_train` | Targets corresponding to `X_train` |
| `y_test` | Targets corresponding to `X_test` |

`test_size=0.2` puts **20%** in the test set and the remaining **80%** in training. Setting
`random_state` to a fixed integer makes the same split reproducible on every run.

---

## The split lottery

`random_state` looks like a housekeeping detail. It is not. Same data, same model, same everything —
only the seed changes, 200 times:

```text title="Output"
      rows  test_size     min     max   spread     std
        80        20%   0.812   1.000    0.188   0.046
        80        40%   0.875   1.000    0.125   0.027
       200        20%   0.850   1.000    0.150   0.028
       200        40%   0.887   1.000    0.113   0.019
       569        20%   0.939   1.000    0.061   0.013
       569        40%   0.952   0.996    0.044   0.009
```

**On 80 rows with a 20% test set, the identical model scored anywhere from `0.812` to `1.000`.**
An 18.8-point spread produced by nothing but the seed.

Three patterns, all worth internalising:

- **More data shrinks the spread** — `0.188` at 80 rows falls to `0.061` at 569
- **A larger test set shrinks it too** — `0.188` at 20% falls to `0.125` at 40%, because the estimate
  averages over more examples
- **The maximum is `1.000` in five of six rows.** A lucky seed always exists

:::danger This is why single-split scores should not be trusted

If you report `0.98` from one split, you have reported one draw from a distribution whose spread you
never measured. Someone re-running with a different seed gets a different answer and neither of you is
wrong.

Worse, the mechanism for self-deception is trivial: try a few seeds, keep the best. The maximum column
above shows `1.000` is reachable at every dataset size. Nothing in the code flags it.

The fix is **cross-validation** — average over several splits so that the seed stops mattering, and
report the spread alongside the mean. That is the subject of the validation notes.

:::

### Choosing `test_size`

The table shows the trade directly. A bigger test set gives a **more stable** estimate; a smaller one
leaves **more data to learn from**. The usual choices:

| `test_size` | When |
|---|---|
| `0.1` – `0.2` | Large datasets, where 10% is still thousands of rows |
| `0.2` – `0.3` | The common default |
| `0.3` – `0.4` | Small datasets, where estimate stability is the binding constraint |

On genuinely small data neither end is satisfying, which again points at cross-validation — it uses
**every** row for both training and testing across folds.

---

## `stratify` — keep the class balance

By default the split is random with respect to the target, so class proportions drift. On imbalanced
data that drift becomes a real problem:

```text title="Output"
3. STRATIFY — 300 rows, 14 positives (4.7%), 60-row test set
   without stratify     positives in test: min 0, max 9, mean 2.74;  zero-positive splits: 21/500
   with stratify=y      positives in test: min 3, max 3, mean 3.00;  zero-positive splits: 0/500
```

**Without `stratify`, 21 of 500 splits (4.2%) produced a test set with zero positive cases.** In those
splits recall is undefined, precision is undefined, and accuracy is trivially 100% for a model that
never predicts the positive class. The test-set positive rate ranged from **0% to 15%** against a true
rate of 4.7% — a threefold overrepresentation at the top end.

**With `stratify=y`, every split had exactly 3 positives.** The proportion is preserved by
construction.

```python
train_test_split(X, y, test_size=0.2, random_state=1, stratify=y)
```

:::tip Pass `stratify=y` on every classification split

It costs nothing, it removes a source of variance, and on imbalanced data it prevents a test set that
cannot measure the thing you care about.

The one caveat: every class needs at least 2 members, or it raises. And note `stratify` takes the
*array*, not `True` — `stratify=y` for a plain split.

:::

For regression there is no direct equivalent, though binning the target and stratifying on the bins is
a reasonable trick when the target is very skewed.

---

## Where to split, relative to preprocessing

Everything in the previous five pages happens somewhere relative to this line, and the rule is:

```
   load  →  audit  →  SPLIT  →  fit preprocessing on train  →  apply to both
```

Anything that **learns from the data** must be fitted after the split, on training data only:

| Step | Learns something? | Position |
|---|---|---|
| Dropping identifier columns | No | Either side |
| Removing duplicate rows | No | **Before** — see below |
| Type fixes, parsing | No | Either side |
| `SimpleImputer` | **Yes** — column means | After |
| `OneHotEncoder` | **Yes** — the category list | After |
| `TargetEncoder` | **Yes** — target means | After, inside a `Pipeline` |
| `StandardScaler` | **Yes** — mean and std | After |
| Outlier bounds from IQR | **Yes** — quartiles | After |

The measured sizes of these leaks vary enormously, and being accurate about that matters:

| Leak | Measured effect |
|---|---|
| Scaling fitted before the split | **`+0.0002`** — negligible |
| Naive target encoding | **`+0.21`** — manufactured from noise |
| Duplicate rows straddling the split | **`+0.24`** — see below |
| Grouped rows straddling the split | **`+0.42`** — see below |

The way to make all of this structural rather than remembered is a `Pipeline`, which refits every
step inside each fold and cannot see the test data by construction.

---

## Four ways a random split lies

The remaining failures are not about *where* you split but about **whether rows are independent**.
`train_test_split` assumes they are. When they aren't, it reports a number that is simply false.

### 1. Duplicate rows

Page one's audit found a duplicated row in a 12-row file. Here is why that mattered:

```text title="Output"
   dataset                                      test acc
   clean, 400 unique rows                         0.6575
   100 rows duplicated (25% of the data)          0.7440
   200 rows duplicated (50% of the data)          0.8093
   400 rows duplicated (100% of the data)         0.8992
```

**Duplicating every row lifted accuracy from `0.6575` to `0.8992` — 24 points from adding no new
information whatsoever.**

The mechanism: when a row appears twice, the split can put one copy in training and the other in test.
The model then "predicts" a row it has already seen. That is not generalisation, it is lookup — and it
scales smoothly with how much of the data is duplicated.

**Deduplicate before splitting.** This is the one cleaning step that genuinely belongs before the line,
because a duplicate is not a property of train or test but of the dataset.

### 2. Grouped rows — the worst case

Repeated measurements per patient, multiple sessions per user, several photographs of the same object.
Rows within a group are not independent.

Here 25 patients contribute 20 measurements each. Each patient has a recognisable feature signature,
and the label is a property of the **patient** — assigned at random with respect to that signature, so
**a model that genuinely generalises to new patients can do no better than chance**:

```text title="Output"
   random split (same patient both sides)           0.8957
   GroupShuffleSplit (patients kept whole)          0.4766
   true ceiling (chance)                            0.5000
```

**The random split reports `0.8957` for a task whose ceiling is `0.5000`.**

It looks like an excellent model. It is a model that identifies which patient a measurement came from
and recalls that patient's label — useless for any new patient, which is the only case that matters.
`GroupShuffleSplit` keeps each patient entirely on one side and correctly reports chance performance.

```python
from sklearn.model_selection import GroupShuffleSplit, GroupKFold
train_idx, test_idx = next(GroupShuffleSplit(test_size=0.3, random_state=0)
                           .split(X, y, groups=patient_id))
```

:::danger Ask "what is a row?" before every split

This is the most damaging failure on the page — a **42-point** overstatement — and the most common in
practice. Clinical data, user analytics, sensor deployments and image datasets are all grouped by
default.

If any entity contributes more than one row, a random split is invalid. Use `GroupShuffleSplit` or
`GroupKFold` with the entity id, and remember that the model's real job is to generalise to **new
entities**, not new rows from familiar ones.

:::

### 3. Time series

When rows are ordered in time, a random split trains the model on rows that occur **after** the rows
it is tested on:

```text title="Output"
   series            shuffled R2  chronological R2
   mild trend             0.9976            0.7107
   strong trend           0.9994           -2.4583
```

**With a strong trend: `0.9994` shuffled, `−2.4583` chronological.** A negative `R²` means worse than
always predicting the mean — so the honest evaluation says the model is useless, and the shuffled split
says it is essentially perfect.

Two things combine here. The shuffled split interleaves train and test across the same period, so the
model is always interpolating among values it has seen. The chronological split asks it to predict a
period whose values lie **outside the training range entirely** — and a tree cannot extrapolate, since
every prediction is an average of training targets.

Split by time: train on the past, test on the future, exactly as the deployed model will experience it.
`TimeSeriesSplit` does this across multiple folds.

### 4. The test set used more than once

The subtlest failure, and it needs no code to demonstrate. Each time you look at the test score and
change something in response — a hyperparameter, a feature, an algorithm — you leak a little
information from the test set into your decisions. After twenty such rounds, the test score is an
optimistic estimate of a model selected *to suit that particular test set*.

The remedy is a **three-way split**:

```
   ┌──────────────── all data ─────────────────┐
   │  train (60%)  │ validation (20%) │ test (20%) │
   └───────────────┴──────────────────┴────────────┘
        fit models      compare them,      touch ONCE,
                        tune settings      at the very end
```

| Set | Used for | How often |
|---|---|---|
| **Train** | Fitting parameters | Continuously |
| **Validation** | Choosing between models and settings | Continuously |
| **Test** | The final honest estimate | **Once** |

`train_test_split` has no three-way mode; call it twice, splitting the training portion again. In
practice cross-validation usually replaces the validation set, leaving a two-way split with the test
set sealed until the end.

---

## Common Mistakes

| # | Mistake | Wrong | Right |
|---|---|---|---|
| 1 | Reporting the training score | `model.score(X_train, y_train)` | Three models scored a perfect `1.0000` |
| 2 | Reading a perfect training score as success | "100% accurate" | 1-NN always does; it means memorisation |
| 3 | Trusting one split | A single `random_state` | Spread was **18.8 points** on 80 rows |
| 4 | Trying seeds until the score looks good | "tuning the split" | `1.000` is reachable at every size |
| 5 | Omitting `stratify` on classification | Random is fine | **4.2%** of splits had zero positives |
| 6 | `stratify=True` | Looks like a flag | It takes the array: `stratify=y` |
| 7 | Preprocessing before splitting | Convenient | Fit after; use a `Pipeline` |
| 8 | Treating all leaks as equally severe | "leakage is leakage" | `+0.0002` versus `+0.42` |
| 9 | Splitting before deduplicating | Order doesn't matter | Duplicates gave **+24 points** |
| 10 | Random split on grouped data | Rows are rows | **`0.8957` against a ceiling of `0.5000`** |
| 11 | Shuffling a time series | More random is better | `0.9994` versus **`−2.4583`** |
| 12 | Tuning against the test set | It's the score that counts | Use validation; touch test once |
| 13 | Cleaning outliers from the test set | Consistency | It must represent reality |

---

## Summary

| Task | Code |
|---|---|
| Basic split | `train_test_split(X, y, test_size=0.2, random_state=1)` |
| Preserve class balance | `..., stratify=y` |
| Keep entities together | `GroupShuffleSplit`, `GroupKFold` |
| Respect time order | `TimeSeriesSplit`, or slice by index |
| Prevent preprocessing leaks | `Pipeline` |
| Remove duplicates first | `df.drop_duplicates()` |

**Key takeaways**

- A model scored on its training data is recalling, not predicting — **three of four models hit a
  perfect `1.0000`**
- 1-NN reaches 100% on training data by construction: the nearest point to a training row is itself
- The **gap** between train and test is the informative quantity, not either number alone
- `test_size=0.2` holds back 20%; `random_state` makes the split reproducible
- **The seed alone moved the score from `0.812` to `1.000`** on 80 rows — an 18.8-point spread
- More data and a larger test set both shrink that spread; `1.000` was reachable in five of six
  configurations
- Single-split scores are one draw from a distribution you haven't measured — the argument for
  **cross-validation**
- Without `stratify`, **4.2% of splits had zero positives** and the test positive rate ranged 0%–15%
  against a true 4.7%
- `stratify=y` fixed the count exactly; pass it on every classification split
- Anything that **learns** — imputers, encoders, scalers, outlier bounds — is fitted **after** the split
- Leak magnitudes differ by orders of magnitude: scaling **`+0.0002`**, target encoding **`+0.21`**,
  duplicates **`+0.24`**, groups **`+0.42`**
- **Deduplicate before splitting** — duplicating the data lifted accuracy `0.6575 → 0.8992`
- **Grouped data is the worst case**: a random split reported `0.8957` where the true ceiling was
  `0.5000`, because the model recognised patients rather than learning anything
- Ask **"what is a row?"** — if one entity contributes several, use `GroupShuffleSplit`
- Shuffling a time series gave `0.9994` where the chronological truth was **`−2.4583`**; trees cannot
  extrapolate beyond their training range
- Every look at the test score leaks a little into your choices — use a **validation** set and touch
  the test set **once**

**See also:** [Missing Values](./02-missing-values.md#the-fit--transform-contract) for `fit` on train
only · [Encoding Categorical Data](./03-encoding-categorical-data.md#target-encoding-and-the-leak-inside-it)
for the leak this prevents · [Feature Scaling and Transformation](./04-feature-scaling-and-transformation.md#how-much-does-scaling-before-the-split-really-leak)
for the measured scaling leak · [Outliers and Feature Engineering](./05-outliers-and-feature-engineering.md)
for why the test set stays dirty · [The Toolkit and the Pipeline](../01-foundations/05-toolkit-and-pipeline.md)
for where this sits in the workflow

---

## Run It Yourself

```python title="train_test_split.py"
"""The train/test split — why it exists, how unstable it is, and four ways it silently lies."""

import warnings
import numpy as np
from sklearn.datasets import load_breast_cancer
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import r2_score
from sklearn.model_selection import GroupShuffleSplit, train_test_split
from sklearn.neighbors import KNeighborsClassifier
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.tree import DecisionTreeClassifier

warnings.filterwarnings("ignore")

# ---------- 1. why hold anything back ----------
X, y = load_breast_cancer(return_X_y=True)
Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.2, random_state=0, stratify=y)
print("1. TRAIN SCORE vs TEST SCORE")
print(f"   {'model':<28}{'train':>8}{'test':>8}{'gap':>8}")
for name, m in [("KNeighbors(n=1)", KNeighborsClassifier(1)),
                ("DecisionTree (unrestricted)", DecisionTreeClassifier(random_state=0)),
                ("RandomForest", RandomForestClassifier(random_state=0)),
                ("LogisticRegression", LogisticRegression(max_iter=5000))]:
    m.fit(Xtr, ytr)
    a, b = m.score(Xtr, ytr), m.score(Xte, yte)
    print(f"   {name:<28}{a:>8.4f}{b:>8.4f}{a - b:>8.4f}")

# ---------- 2. the split lottery ----------
print("\n2. THE SPLIT LOTTERY — 200 random_state values, nothing else changed")
print(f"   {'rows':>7}{'test_size':>11}{'min':>8}{'max':>8}{'spread':>9}{'std':>8}")
for n in [80, 200, 569]:
    for ts in [0.2, 0.4]:
        s = []
        for seed in range(200):
            a, b, c, d = train_test_split(X[:n], y[:n], test_size=ts,
                                          random_state=seed, stratify=y[:n])
            s.append(make_pipeline(StandardScaler(), LogisticRegression(max_iter=5000))
                     .fit(a, c).score(b, d))
        s = np.array(s)
        print(f"   {n:>7}{ts:>11.0%}{s.min():>8.3f}{s.max():>8.3f}"
              f"{s.max() - s.min():>9.3f}{s.std():>8.3f}")

# ---------- 3. stratify ----------
rng = np.random.RandomState(0)
yi = (rng.rand(300) < 0.05).astype(int)
Xi = rng.normal(size=(300, 4))
print(f"\n3. STRATIFY — 300 rows, {yi.sum()} positives ({yi.mean():.1%}), 60-row test set")
for label, kw in [("without stratify", {}), ("with stratify=y", {"stratify": yi})]:
    c = np.array([int(train_test_split(Xi, yi, test_size=0.2, random_state=k, **kw)[3].sum())
                  for k in range(500)])
    print(f"   {label:<20} positives in test: min {c.min()}, max {c.max()},"
          f" mean {c.mean():.2f};  zero-positive splits: {int((c == 0).sum())}/500")

# ---------- 4. duplicate rows straddling the split ----------
print("\n4. DUPLICATE ROWS ON BOTH SIDES")
n = 400
Xd0 = rng.normal(size=(n, 6))
yd0 = (Xd0[:, 0] + rng.normal(0, 1.5, n) > 0).astype(int)

def avg(Xa, ya):
    return np.mean([RandomForestClassifier(random_state=0)
                    .fit(*train_test_split(Xa, ya, test_size=0.3, random_state=k,
                                           stratify=ya)[::2])
                    .score(*train_test_split(Xa, ya, test_size=0.3, random_state=k,
                                             stratify=ya)[1::2]) for k in range(30)])

print(f"   {'dataset':<44}{'test acc':>9}")
print(f"   {'clean, 400 unique rows':<44}{avg(Xd0, yd0):>9.4f}")
for frac in [0.25, 0.5, 1.0]:
    k = int(n * frac)
    print(f"   {f'{k} rows duplicated ({frac:.0%} of the data)':<44}"
          f"{avg(np.vstack([Xd0, Xd0[:k]]), np.concatenate([yd0, yd0[:k]])):>9.4f}")

# ---------- 5. grouped data ----------
P, R = 25, 20
g = np.repeat(np.arange(P), R)
sig = rng.normal(0, 3, (P, 5))
Xg = sig[g] + rng.normal(0, 1.0, (P * R, 5))
yg = rng.randint(0, 2, P)[g]          # the label belongs to the PATIENT
print(f"\n5. GROUPED DATA — {P} patients x {R} measurements; label is per-patient")
print("   and unrelated to the signature, so generalising to NEW patients = chance")
rand = [RandomForestClassifier(random_state=0)
        .fit(*train_test_split(Xg, yg, test_size=0.3, random_state=k)[::2])
        .score(*train_test_split(Xg, yg, test_size=0.3, random_state=k)[1::2])
        for k in range(20)]
grp = []
for k in range(20):
    tr, te = next(GroupShuffleSplit(n_splits=1, test_size=0.3, random_state=k)
                  .split(Xg, yg, g))
    grp.append(RandomForestClassifier(random_state=0).fit(Xg[tr], yg[tr]).score(Xg[te], yg[te]))
print(f"   {'random split (same patient both sides)':<46}{np.mean(rand):>9.4f}")
print(f"   {'GroupShuffleSplit (patients kept whole)':<46}{np.mean(grp):>9.4f}")
print(f"   {'true ceiling (chance)':<46}{0.5:>9.4f}")

# ---------- 6. time series ----------
print("\n6. TIME SERIES — predict a value from its 5 most recent lags")
t = np.arange(600)
print(f"   {'series':<16}{'shuffled R2':>13}{'chronological R2':>18}")
for label, level in [
        ("mild trend", 0.05*t + 10*np.sin(2*np.pi*t/50) + rng.normal(0, 1, 600).cumsum()*0.3),
        ("strong trend", 1.0*t + 10*np.sin(2*np.pi*t/50) + rng.normal(0, 3, 600))]:
    lags = np.column_stack([np.roll(level, k) for k in range(1, 6)])
    Xs, ys = lags[10:], level[10:]
    a, b, c, d = train_test_split(Xs, ys, test_size=0.3, random_state=0)
    sh = r2_score(d, RandomForestRegressor(random_state=0).fit(a, c).predict(b))
    cut = int(len(Xs) * 0.7)
    ch = r2_score(ys[cut:], RandomForestRegressor(random_state=0)
                  .fit(Xs[:cut], ys[:cut]).predict(Xs[cut:]))
    print(f"   {label:<16}{sh:>13.4f}{ch:>18.4f}")
```

```text title="Output"
1. TRAIN SCORE vs TEST SCORE
   model                          train    test     gap
   KNeighbors(n=1)               1.0000  0.9123  0.0877
   DecisionTree (unrestricted)   1.0000  0.9386  0.0614
   RandomForest                  1.0000  0.9474  0.0526
   LogisticRegression            0.9626  0.9474  0.0153

2. THE SPLIT LOTTERY — 200 random_state values, nothing else changed
      rows  test_size     min     max   spread     std
        80        20%   0.812   1.000    0.188   0.046
        80        40%   0.875   1.000    0.125   0.027
       200        20%   0.850   1.000    0.150   0.028
       200        40%   0.887   1.000    0.113   0.019
       569        20%   0.939   1.000    0.061   0.013
       569        40%   0.952   0.996    0.044   0.009

3. STRATIFY — 300 rows, 14 positives (4.7%), 60-row test set
   without stratify     positives in test: min 0, max 9, mean 2.74;  zero-positive splits: 21/500
   with stratify=y      positives in test: min 3, max 3, mean 3.00;  zero-positive splits: 0/500

4. DUPLICATE ROWS ON BOTH SIDES
   dataset                                      test acc
   clean, 400 unique rows                         0.6575
   100 rows duplicated (25% of the data)          0.7440
   200 rows duplicated (50% of the data)          0.8093
   400 rows duplicated (100% of the data)         0.8992

5. GROUPED DATA — 25 patients x 20 measurements; label is per-patient
   and unrelated to the signature, so generalising to NEW patients = chance
   random split (same patient both sides)           0.8957
   GroupShuffleSplit (patients kept whole)          0.4766
   true ceiling (chance)                            0.5000

6. TIME SERIES — predict a value from its 5 most recent lags
   series            shuffled R2  chronological R2
   mild trend             0.9976            0.7107
   strong trend           0.9994           -2.4583
```

### What to notice in that output

- **`RandomForest` scored `1.0000` on training data too.** People expect that of 1-NN and are surprised
  by the forest. Any model with enough capacity reaches it, which is exactly why the training score
  cannot be used to compare models.
- **Logistic regression had the *worst* training score and tied for the best test score.** `0.9626`
  train, `0.9474` test — the smallest gap of the four. The model that memorised least generalised best.
- **The `max` column reads `1.000` five times out of six.** A perfect score is available at every
  dataset size if you are willing to try enough seeds — and nothing distinguishes that from a real
  result in a report.
- **The spread halved from `0.188` to `0.061` purely from having more rows.** Reporting variance is a
  property of your dataset size, not of your model.
- **Unstratified splits produced test sets with 0 to 9 positives** from the same 14. The `0` cases are
  the serious ones: recall cannot be computed at all, yet accuracy still returns a confident-looking
  number.
- **Duplicate inflation scales smoothly** — `0.6575`, `0.7440`, `0.8093`, `0.8992` as the duplicated
  fraction rises. There's no threshold to stay under; any duplication buys a proportional lie.
- **Grouped data: `0.8957` reported against a `0.5000` ceiling.** The group split returned `0.4766`,
  slightly *below* chance, which is the honest noise you would expect. The random split's 40-point
  advantage is entirely recall of patient identity.
- **A negative `R²` of `−2.4583` next to a shuffled `0.9994`.** These describe the same model on the
  same data. One of them is a report on a world where you can train on the future.

**Things worth trying:**

1. Remove `stratify` from section 2 and re-measure the spread. It grows, because class balance now
   varies on top of everything else.
2. In section 5, add the patient id as an explicit feature and rerun the group split. It should stay at
   chance — proof the problem is the split, not the features.
3. Change `TimeSeriesSplit` in for the manual chronological cut and compare across several folds. One
   chronological split is itself a single draw.
4. Deduplicate the inflated datasets in section 4 with `np.unique(..., axis=0)` before splitting, and
   confirm the score returns to the clean baseline.
5. Fit a `StandardScaler` on all of `X` before section 2's loop and see whether the spread changes. It
   barely will — the honest calibration from the scaling page.

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

### Why split

**W1. [THEORY]** Explain why a model evaluated on its training data is not being tested.

**W2. [OUT]** Three models scored exactly `1.0000` on training data. Explain how 1-NN achieves this
by construction.

**W3. [ANALYZE]** Logistic regression had the lowest training score and the smallest train–test gap.
What does that tell you, and why is the gap more informative than either score?

**W4. [THEORY]** Name the four variables `train_test_split` returns and what each holds.

**W5. [THEORY]** What does `test_size=0.2` do, and what does `random_state` do?

### The split lottery

**L1. [OUT]** On 80 rows the same model scored between `0.812` and `1.000`. State what varied and what
did not.

**L2. [OUT]** The spread fell from `0.188` to `0.061` between two rows of the table. What changed?

**L3. [OUT]** The `max` column shows `1.000` in five of six rows. Describe the self-deception this
enables.

**L4. [ANALYZE]** A colleague reports `0.98` accuracy from one split. What is your first question?

**L5. [THEORY]** State the trade-off in choosing `test_size`, referring to both directions.

**L6. [ANALYZE]** Why does cross-validation solve the problem this section describes?

### Stratification

**S1. [OUT]** 21 of 500 unstratified splits had zero positives in the test set. Name two metrics that
become impossible, and explain why accuracy still returns a number.

**S2. [OUT]** With `stratify=y`, every split had exactly 3 positives. Explain why the count is fixed.

**S3. [THEORY]** Write the call that splits with stratification. What is the common mistake in its
argument?

**S4. [ANALYZE]** What is the closest equivalent to stratification for a regression target?

### Order of operations

**O1. [THEORY]** State the rule for which preprocessing steps go before the split and which after.

**O2. [THEORY]** Classify each as before or after: dropping an id column, imputing means, removing
duplicates, one-hot encoding, computing IQR bounds.

**O3. [OUT]** Rank these leaks by measured size: scaling, target encoding, duplicates, groups.

**O4. [ANALYZE]** Explain why "leakage is leakage" is unhelpful advice, using two of those numbers.

**O5. [THEORY]** How does a `Pipeline` make the ordering structural rather than remembered?

### The four lies

**F1. [OUT]** Duplicating all 400 rows moved accuracy from `0.6575` to `0.8992`. Explain the mechanism.

**F2. [THEORY]** Why is deduplication the one cleaning step that belongs *before* the split?

**F3. [OUT]** A random split reported `0.8957` where the true ceiling was `0.5000`. Explain what the
model actually learned.

**F4. [THEORY]** What question should you ask about your rows before choosing a split strategy?

**F5. [PROG]** Write the code that splits while keeping all rows of each `patient_id` on one side.

**F6. [ANALYZE]** Give three real domains where data is grouped by default.

**F7. [OUT]** A time series scored `0.9994` shuffled and `−2.4583` chronologically. Explain both
numbers, including what a negative `R²` means.

**F8. [ANALYZE]** Why does a tree fail particularly badly on a trending series evaluated
chronologically?

**F9. [THEORY]** Describe the three-way split and state how many times each portion may be used.

**F10. [ANALYZE]** Explain how repeatedly consulting the test score leaks information, even though you
never train on it.

### Applying it

**P1. [PROG]** Measure the spread of test accuracy over 100 `random_state` values for a dataset of
your choice, and report min, max, mean and std.

**P2. [PROG]** Demonstrate that omitting `stratify` can produce a test set with no minority class, by
searching seeds until you find one.

**P3. [PROG]** Build a `Pipeline` of imputer, scaler and classifier, and split correctly. Add a comment
at each step saying what it learns.

**P4. [PROG]** Given a DataFrame with a `user_id` column, produce a grouped split and verify no user
appears on both sides.

**P5. [PROG]** Split a time-ordered array chronologically at 70%, and assert that every training index
precedes every test index.

**P6. [ANALYZE]** You have 5,000 rows of wearable-sensor data from 50 people, one row per hour, and you
must predict a health outcome. Name every split hazard present and describe your strategy.

### Quick self-check

1. Why can't you evaluate on training data?
2. Which model type scores `1.0000` on training data by construction?
3. What is the more informative quantity than either score alone?
4. How much did the score vary from `random_state` alone on 80 rows?
5. What two things shrink that variance?
6. What does `stratify=y` guarantee?
7. What fraction of unstratified splits had zero positives?
8. Which preprocessing steps must come after the split?
9. Which cleaning step must come before it?
10. Rank the four measured leaks by size.
11. What does a random split report on grouped data, versus the truth?
12. Why must a time series be split chronologically?
13. What does a negative `R²` mean?
14. How many times may the test set be used?
