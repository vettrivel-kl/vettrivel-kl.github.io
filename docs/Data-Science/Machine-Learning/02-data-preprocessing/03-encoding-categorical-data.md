---
sidebar_position: 3
title: Encoding Categorical Data
description: Turning categories into numbers without inventing an order — how much label encoding really costs, why it depends on the model, what cardinality does to memory, and the leak hiding inside target encoding.
tags: [machine-learning, data-preprocessing, scikit-learn]
toc_max_heading_level: 3
---

# Encoding Categorical Data

> **Topic —** Two pages ago `X` came out with `dtype('O')` because `Country` sits beside two numeric
> columns. This page fixes that. The easy part is making the text numeric; the hard part is doing it
> **without telling the model something false**.

Every encoding scheme is a trade between three things: how many columns it creates, whether it
invents an ordering, and whether it leaks. There is no scheme that wins all three.

---

## Why encoding is needed at all

Many machine learning algorithms — especially those built on mathematical operations, like linear
regression or neural networks — can only handle **numerical input**. `'France'` is not a number, and
there is no arithmetic that makes it one.

There is a second, weaker reason: numerical data is processed **more efficiently** than text, with
less memory. The previous page measured this — an `object` array summed **28× slower** than a
`float64` one, and a text column cost **98.4% more memory** than the same column as `category`.

So encoding is not optional. The question is only which scheme, and what each one costs.

---

## Label encoding — and what it actually claims

**Label encoding assigns a unique integer to each category.** A feature `Color` with
`["Red", "Green", "Blue"]` might become `[0, 1, 2]`.

```python
le = LabelEncoder()
y = le.fit_transform(["No", "Yes", "No", "Yes"])     # -> [0, 1, 0, 1]
```

One column in, one column out. It is the cheapest possible encoding, and for a **binary target** like
`Purchased` it is exactly right.

The problem is what those integers assert. Writing `Red=0, Green=1, Blue=2` tells any model that
consumes it three things that are not true:

- Blue **is greater than** Red
- Green sits **exactly between** Red and Blue
- Blue is **twice** Green

For genuinely **ordinal** data — `low < medium < high` — those claims are fine, because the order is
real. For **nominal** data — cities, colours, countries — they are fabrications. This is the
nominal/ordinal distinction from [Types of Learning](../01-foundations/03-types-of-learning.md#numeric-and-categorical-data),
and this is where it starts costing you accuracy.

### How much does it cost? It depends entirely on the model

Here is the measurement. Six cities each shift the outcome, and the effects **alternate** along
alphabetical order — the order every encoder numbers by — so no single threshold on the integer code
can separate them:

```text title="Output"
     0 = Chennai     2.5
     1 = Delhi      -2.0
     2 = Jaipur      2.4
     3 = Kolkata    -1.8
     4 = Mumbai      2.2
     5 = Pune       -2.1
     -> the sign flips at every step: no single cut separates them

   model                       label/ordinal   one-hot     gain
   LogisticRegression                 0.6737    0.9837  +0.3100
   Forest(max_depth=1)                0.6637    0.9837  +0.3200
   Forest(unrestricted)               0.9837    0.9837  +0.0000
   majority-class baseline: 0.5063
```

Three very different answers to "does label encoding hurt?":

**Logistic regression: it cost 31 accuracy points.** A linear model fits one coefficient per feature,
so it can only express "higher code → higher probability". Against alternating effects, that is
useless — `0.6737` against a `0.5063` baseline is barely better than guessing.

**A depth-1 forest: 32 points.** Same reason. One split on the integer axis cannot carve out three
separate positive regions.

**An unrestricted forest: no difference whatsoever.** `0.9837` either way. Given enough depth a tree
can split the integer axis repeatedly — `code ≤ 0.5`, then `1.5 < code ≤ 2.5`, and so on — and
reconstruct exactly the grouping one-hot would have handed it directly. The false ordering is still
there; the model just has the capacity to work around it.

:::tip The rule, stated properly

Label encoding nominal data is **safe for unrestricted tree ensembles** and **damaging for linear
models, distance-based models (kNN, SVM), and neural networks**.

"Always one-hot encode" is not quite right, and "trees don't care" is only true when they're deep
enough to undo the damage. If you don't want to reason about it every time, one-hot is the safe
default — it never invents an order for any model.

:::

### `LabelEncoder` is for targets, not features

A genuine API point that trips people up: scikit-learn's `LabelEncoder` is documented for encoding
**target values `y`**, and its signature reflects that — it takes a 1-D array, not a 2-D matrix.

| Encoding | Use | Shape |
|---|---|---|
| `LabelEncoder` | The **target** `y` | 1-D |
| `OrdinalEncoder` | **Features** `X` | 2-D |

They do the same arithmetic. Using `LabelEncoder` in a loop over feature columns works but fights the
API, can't live in a `ColumnTransformer`, and won't participate in a `Pipeline`. Use `OrdinalEncoder`
for features.

### For real ordinal data, state the order

If the order *is* real, don't let the encoder guess it:

```python
OrdinalEncoder().fit(sizes)                                       # alphabetical
OrdinalEncoder(categories=[["low", "medium", "high"]]).fit(sizes) # yours
```

```text title="Output"
default (alphabetical): ['high', 'low', 'medium']
   -> [2.0, 1.0, 0.0, 1.0]   'high'=0, 'low'=1: meaningless
explicit order:         ['low', 'medium', 'high']
   -> [1.0, 0.0, 2.0, 0.0]   'low'=0 < 'medium'=1 < 'high'=2
```

By default it sorts alphabetically, which puts `high` before `low` and destroys the very ordering that
made ordinal encoding appropriate. **If a column is ordinal, always pass `categories=` explicitly.**

---

## One-hot encoding

**One-hot encoding creates a binary column for each category** — `1` marking the presence of that
category, `0` its absence.

For a `Neighborhood` feature with `"Downtown"`, `"Suburb"` and `"Countryside"`:

1. **Identify the categories** — three distinct values
2. **Create a binary column for each** — `Neighborhood_Downtown`, `Neighborhood_Suburb`,
   `Neighborhood_Countryside`
3. **Convert to binary values** — put `1` in the column matching each row, `0` in the others

```text
France  ->  1  0  0
Germany ->  0  1  0
Spain   ->  0  0  1
```

Every category is now **equidistant** from every other. No ordering is implied, which is exactly the
property label encoding lacked.

### Applying it to some columns only

Real data mixes types, so you rarely want to transform everything. `ColumnTransformer` applies
different transformations to different columns:

```python
ct = ColumnTransformer(
    transformers=[("encoder", OneHotEncoder(), [0])],
    remainder="passthrough")
X = ct.fit_transform(X)
```

| Piece | Meaning |
|---|---|
| `"encoder"` | An arbitrary name for this transformation |
| `OneHotEncoder()` | The transformation to apply |
| `[0]` | Apply it to the column at index `0` |
| `remainder="passthrough"` | Leave every unlisted column **unchanged** |

The default is `remainder="drop"`, which silently discards every column you didn't name — a common
and confusing loss. `"passthrough"` is almost always what you want.

:::note Prefer column names over positions

`[0]` breaks the moment a column is inserted upstream. `make_column_transformer` with names, or
`make_column_selector(dtype_include=object)`, expresses the intent instead of the position:

```python
ct = make_column_transformer(
    (OneHotEncoder(handle_unknown="ignore"), make_column_selector(dtype_include=object)),
    remainder="passthrough")
```

This also survives adding a new categorical column later, which the index form does not.

:::

### The dummy variable trap

One-hot columns carry a built-in redundancy:

```text title="Output"
full one-hot  ['city_Chennai', 'city_Delhi', 'city_Mumbai']
[[1. 0. 0.]
 [0. 0. 1.]
 [0. 1. 0.]
 [1. 0. 0.]]
every row sums to: [1.0, 1.0, 1.0, 1.0]  <- always exactly 1
```

Because the columns always sum to `1`, **any one of them is exactly `1` minus the sum of the others**.
That is perfect multicollinearity, and for linear models fitted by ordinary least squares it makes the
coefficients unidentifiable — infinitely many combinations give the same predictions.

The fix is to drop one, keeping `N−1` columns:

```text title="Output"
drop='first'  ['city_Delhi', 'city_Mumbai']
[[0. 0.]
 [0. 1.]
 [1. 0.]
 [0. 0.]]
Chennai is now encoded as all-zeros — the 'reference' category
```

The dropped category becomes the **reference**, encoded as all zeros, and every remaining coefficient
reads as "relative to Chennai". No information is lost.

| Situation | Drop a column? |
|---|---|
| Linear regression, statistical inference on coefficients | **Yes** — `drop="first"` |
| Regularised models (ridge, lasso, logistic with a penalty) | Not required — the penalty resolves it |
| Trees, forests, boosting | **No** — dropping just hides a category |
| You want interpretable per-category coefficients | Yes, and choose the reference deliberately |

---

## What cardinality costs

One-hot's weakness is the column count. With `k` categories you get `k` columns:

```text title="Output"
2. COST OF CARDINALITY — one column, 50,000 rows
    categories  one-hot cols   dense MB  sparse MB  binary cols
             3             3        1.2        0.8            2
            10            10        4.0        0.8            4
            50            50       20.0        0.8            6
           256           256      102.4        0.8            8
          1000          1000      400.0        0.8           10
```

**1,000 categories became 1,000 columns and 400 MB.** From one column of 50,000 values.

But look at the sparse figure: **0.8 MB, flat, regardless of cardinality.** One-hot output is
overwhelmingly zeros — exactly one `1` per row — so a sparse matrix stores only the non-zeros. At
1,000 categories that's a **500× reduction**, and the memory doesn't grow with the number of
categories at all.

:::tip `sparse_output=True` is the default, and worth keeping

`OneHotEncoder` returns a sparse matrix unless you ask otherwise. The `sparse_output=False` in these
examples is purely so the arrays print readably.

Most scikit-learn estimators accept sparse input directly. If you're calling `.toarray()` or
`sparse_output=False` on a high-cardinality column, you are converting `0.8 MB` into `400 MB` for no
benefit. The "one-hot explodes" warning is about **columns**, not memory — provided you stay sparse.

:::

### Binary encoding

**Binary encoding** compresses in two steps: assign each category an integer, then convert that
integer to binary and give **each bit its own column**.

Compared with one-hot, which needs a separate column per category, binary encoding uses far fewer:
**256 categories need 256 one-hot columns but only 8 binary columns**, since 256 requires 8 bits. The
measured `binary cols` figure above is exactly `ceil(log2(k))`.

The catch, and the reason it's less common than its arithmetic suggests: the bit columns are
**arbitrary**. Bit 3 groups together every category whose code has that bit set — a grouping with no
meaning. It's a compression trick, not a representation, and it's largely been displaced by target
encoding and by models that handle categories natively.

### Frequency encoding

Replace each category with **how often it occurs**. One column, any cardinality, no ordering
invented — though two genuinely different categories with similar frequencies collapse to nearly the
same value. Cheap, and often a surprisingly strong baseline for high-cardinality features.

---

## Target encoding, and the leak inside it

**Target encoding** replaces each category with the **mean of the target** for that category. One
column, any cardinality, and it directly encodes the relationship you care about. It is the standard
choice for high-cardinality features, and it is **dangerous**.

The problem: it uses `y`. If you compute category means from the whole dataset and then evaluate, each
row's encoded value was partly computed **from its own target**.

Here is how bad that is. A feature of 500 random categories, a **completely random target**, 2,000
rows — so about 4 rows per category. The feature carries **no information at all**; any honest method
must score around `0.50`:

```text title="Output"
4. TARGET ENCODING ON A PURE-NOISE FEATURE (a perfect method scores ~0.50)
   2000 rows, 500 categories (~4 rows each), target is RANDOM
   naive — category means from all the data           0.7095   <- LEAKED
   TargetEncoder in a Pipeline (cross-fitted)         0.4935
```

**Naive target encoding scored 0.7095 on pure noise.** It manufactured 21 points of accuracy from a
feature with nothing in it. With ~4 rows per category, each category's mean is essentially a copy of
those 4 targets — so the "feature" is a lightly blurred version of `y`, smuggled into `X`.

Cross-validation did not catch it, because the leak happened **before** the split.

:::danger This is the most dangerous encoding in common use

The failure mode is the worst kind: your validation score goes **up**, so it looks like success.
Production performance then collapses, because at predict time there is no target to leak from.

Use scikit-learn's `TargetEncoder`, which **cross-fits internally** — each row's encoding is computed
from *other* rows only — and put it inside a `Pipeline` so it refits within every fold. That scored
`0.4935`, correctly identifying the feature as worthless.

Never compute category means over your full dataset by hand.

:::

---

## A category the encoder has never seen

Training data has three cities; a request arrives for a fourth. This is a routine production event and
most encoders **crash**:

```text title="Output"
3. UNSEEN CATEGORY AT PREDICT TIME
   CRASH   LabelEncoder
              -> ValueError: y contains previously unseen labels: 'Kolkata'
   CRASH   OrdinalEncoder (default)
              -> ValueError: Found unknown categories ['Kolkata'] in column 0
   OK      OrdinalEncoder(handle_unknown='use_encoded_value')
              -> [[0.0], [-1.0]]
   CRASH   OneHotEncoder (default)
              -> ValueError: Found unknown categories ['Kolkata'] in column 0
   OK      OneHotEncoder(handle_unknown='ignore')
              -> [[1.0, 0.0, 0.0], [0.0, 0.0, 0.0]]
```

Three of five fail by default. The two that survive behave sensibly:

- `OneHotEncoder(handle_unknown="ignore")` emits **all zeros** — "none of the known categories",
  which is honest and keeps the column count stable
- `OrdinalEncoder(handle_unknown="use_encoded_value", unknown_value=-1)` emits `-1`, a code outside
  the training range

`LabelEncoder` has **no** `handle_unknown` parameter at all — another reason it belongs on targets,
where the label set is closed.

:::warning Set `handle_unknown="ignore"` unless you want the crash

Crashing is occasionally the right choice — if an unknown category means upstream corruption, failing
loudly beats predicting quietly. But it should be a decision, not a default you discover in
production. A rare category absent from your training split is enough to trigger it.

:::

---

## Choosing a scheme

| Scheme | Columns | Invents order? | Handles high cardinality | Leaks? | Use when |
|---|---|---|---|---|---|
| **Label / Ordinal** | 1 | **Yes** | Yes | No | Genuinely ordinal data; targets; deep tree ensembles |
| **One-hot** | `k` | No | Poorly (columns) | No | **The safe default** for nominal data |
| **One-hot, `drop="first"`** | `k−1` | No | Poorly | No | Linear models; coefficient interpretation |
| **Binary** | `ceil(log2 k)` | Arbitrary groupings | Well | No | Legacy compression |
| **Frequency** | 1 | No | Well | No | Cheap high-cardinality baseline |
| **Target** | 1 | No | **Well** | **Yes, without care** | High cardinality — via `TargetEncoder` in a `Pipeline` |

A workable default policy:

1. **Ordinal data** → `OrdinalEncoder(categories=[...])` with the order stated
2. **Nominal, few categories** → `OneHotEncoder(handle_unknown="ignore")`, sparse
3. **Nominal, many categories** → `TargetEncoder` in a `Pipeline`, or frequency encoding
4. **Binary target** → `LabelEncoder`
5. **Unsure** → one-hot; it is the only scheme that asserts nothing false

---

## Common Mistakes

| # | Mistake | Wrong | Right |
|---|---|---|---|
| 1 | Label encoding nominal data for a linear model | `Red=0, Green=1, Blue=2` | **Cost 31 points**; one-hot |
| 2 | Believing trees never care | "trees handle it" | Only **unrestricted** ones; depth-1 lost 32 points |
| 3 | `LabelEncoder` on features | Loop over columns | `OrdinalEncoder` — features are 2-D |
| 4 | Letting the encoder order ordinal data | Alphabetical `high < low` | Pass `categories=` |
| 5 | `remainder` left at default | Other columns silently dropped | `remainder="passthrough"` |
| 6 | Column indices in `ColumnTransformer` | `[0]` | Names or `make_column_selector` |
| 7 | Densifying high-cardinality one-hot | `0.8 MB` → **`400 MB`** | Stay sparse |
| 8 | Keeping all `k` columns for OLS | Perfect multicollinearity | `drop="first"` |
| 9 | Dropping a column for a tree model | Symmetry with linear models | Unnecessary; hides a category |
| 10 | Hand-computing target means | Scores **0.7095 on noise** | `TargetEncoder` in a `Pipeline` |
| 11 | Trusting CV to catch leakage | It didn't | Leak happened before the split |
| 12 | Leaving `handle_unknown` at default | Crashes on a new category | `"ignore"`, deliberately |
| 13 | Encoding before splitting | Categories learned from test | Fit on train only |

---

## Summary

| Task | Code |
|---|---|
| Encode a target | `LabelEncoder()` |
| Encode ordinal features | `OrdinalEncoder(categories=[[...]])` |
| Encode nominal features | `OneHotEncoder(handle_unknown="ignore")` |
| Avoid the dummy trap | `OneHotEncoder(drop="first")` |
| Some columns only | `ColumnTransformer(..., remainder="passthrough")` |
| Pick columns by type | `make_column_selector(dtype_include=object)` |
| High cardinality | `TargetEncoder()` inside a `Pipeline` |
| Inspect resulting names | `enc.get_feature_names_out()` |

**Key takeaways**

- Algorithms built on arithmetic need **numeric input**; `object` arrays are also **28× slower**
- Label encoding asserts an **order and a spacing** — fine for ordinal data, false for nominal
- Measured cost of that falsehood: **−31 points** for logistic regression, **−32** for a depth-1
  forest, and **exactly zero** for an unrestricted forest
- Deep trees can split the integer axis repeatedly and undo the damage; linear, distance-based and
  neural models cannot
- `LabelEncoder` is for **targets** (1-D); `OrdinalEncoder` is for **features** (2-D)
- `OrdinalEncoder` defaults to **alphabetical** order, which put `high` before `low` — always pass
  `categories=` for ordinal data
- One-hot makes every category **equidistant**, asserting nothing false — the safe default
- `remainder="drop"` is the default and silently discards untransformed columns
- One-hot columns always sum to `1`, so they are perfectly collinear — `drop="first"` fixes it for
  OLS, and is unnecessary for trees and regularised models
- Cardinality hits **columns**, not memory: 1,000 categories cost **400 MB dense** but **0.8 MB
  sparse**, flat regardless of `k`
- Binary encoding needs `ceil(log2 k)` columns — **8 instead of 256** — at the cost of meaningless
  groupings
- **Naive target encoding scored `0.7095` on a pure-noise feature**, inventing 21 points of accuracy;
  cross-fitted `TargetEncoder` correctly scored `0.4935`
- Cross-validation **did not catch** that leak, because it happened before the split
- Three of five encoders **crash** on an unseen category; `handle_unknown="ignore"` returns all zeros

**Next in this section:** [Feature Scaling and Transformation](./04-feature-scaling-and-transformation.md)
— now that everything is numeric, the columns are on wildly different scales

**See also:** [Types of Learning](../01-foundations/03-types-of-learning.md#numeric-and-categorical-data)
for nominal versus ordinal · [Loading and Preparing Data](./01-loading-and-preparing-data.md#should-you-convert-to-numpy-at-all)
for why `X` was `object` · [Missing Values](./02-missing-values.md) for handling gaps before this step

---

## Run It Yourself

```python title="encoding.py"
"""Encoding categorical data — what each scheme costs, and where each one breaks."""

import warnings
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import cross_val_score
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import (LabelEncoder, OneHotEncoder,
                                   OrdinalEncoder, TargetEncoder)

warnings.filterwarnings("ignore")
rng = np.random.RandomState(0)

# ---------- 1. does label encoding actually hurt? ----------
# alphabetical order is Chennai, Delhi, Jaipur, Kolkata, Mumbai, Pune.
# effects ALTERNATE along that order, so no single threshold separates them.
effect = {"Chennai": 2.5, "Delhi": -2.0, "Jaipur": 2.4,
          "Kolkata": -1.8, "Mumbai": 2.2, "Pune": -2.1}
cities = list(effect)
city = rng.choice(cities, 3000)
y = (np.array([effect[c] for c in city]) + rng.normal(0, 1, 3000) > 0).astype(int)
df = pd.DataFrame({"city": city})

print("1. LABEL vs ONE-HOT — effect of each city, in the order encoders number them")
for i, c in enumerate(sorted(cities)):
    print(f"     {i} = {c:<9}{effect[c]:>6.1f}")
print("     -> the sign flips at every step: no single cut separates them")

ord_X = OrdinalEncoder().fit_transform(df[["city"]])
ohe_X = OneHotEncoder(sparse_output=False).fit_transform(df[["city"]])
print(f"\n   {'model':<26}{'label/ordinal':>15}{'one-hot':>10}{'gain':>9}")
for name, mk in [
        ("LogisticRegression", lambda: LogisticRegression(max_iter=2000)),
        ("Forest(max_depth=1)", lambda: RandomForestClassifier(max_depth=1, n_estimators=50, random_state=0)),
        ("Forest(unrestricted)", lambda: RandomForestClassifier(random_state=0))]:
    a = cross_val_score(mk(), ord_X, y, cv=5).mean()
    b = cross_val_score(mk(), ohe_X, y, cv=5).mean()
    print(f"   {name:<26}{a:>15.4f}{b:>10.4f}{b - a:>+9.4f}")
print(f"   majority-class baseline: {max(y.mean(), 1 - y.mean()):.4f}")

# ---------- 2. what cardinality costs ----------
n = 50_000
print(f"\n2. COST OF CARDINALITY — one column, {n:,} rows")
print(f"   {'categories':>11}{'one-hot cols':>14}{'dense MB':>11}{'sparse MB':>11}{'binary cols':>13}")
for k in [3, 10, 50, 256, 1000]:
    col = rng.randint(0, k, n).astype(str).reshape(-1, 1)
    dense = OneHotEncoder(sparse_output=False).fit_transform(col)
    sp = OneHotEncoder(sparse_output=True).fit_transform(col)
    sp_mb = (sp.data.nbytes + sp.indices.nbytes + sp.indptr.nbytes) / 1e6
    print(f"   {k:>11}{dense.shape[1]:>14}{dense.nbytes / 1e6:>11.1f}"
          f"{sp_mb:>11.1f}{int(np.ceil(np.log2(k))):>13}")
print("   binary cols = ceil(log2(categories));  frequency encoding = always 1")

# ---------- 3. a category the encoder has never seen ----------
print("\n3. UNSEEN CATEGORY AT PREDICT TIME")
tr = pd.DataFrame({"city": ["Chennai", "Mumbai", "Delhi"] * 4})
te = pd.DataFrame({"city": ["Chennai", "Kolkata"]})      # Kolkata is new
for label, enc in [
        ("LabelEncoder", LabelEncoder()),
        ("OrdinalEncoder (default)", OrdinalEncoder()),
        ("OrdinalEncoder(handle_unknown='use_encoded_value')",
            OrdinalEncoder(handle_unknown="use_encoded_value", unknown_value=-1)),
        ("OneHotEncoder (default)", OneHotEncoder(sparse_output=False)),
        ("OneHotEncoder(handle_unknown='ignore')",
            OneHotEncoder(sparse_output=False, handle_unknown="ignore"))]:
    try:
        if isinstance(enc, LabelEncoder):
            out = enc.fit(tr["city"]).transform(te["city"])
        else:
            out = enc.fit(tr[["city"]]).transform(te[["city"]])
        print(f"   OK      {label}\n              -> {np.asarray(out).tolist()}")
    except Exception as e:
        print(f"   CRASH   {label}\n              -> {type(e).__name__}: "
              f"{str(e).splitlines()[0][:60]}")

# ---------- 4. target encoding leaks unless it is cross-fitted ----------
print("\n4. TARGET ENCODING ON A PURE-NOISE FEATURE (a perfect method scores ~0.50)")
n2, k2 = 2000, 500
cat = rng.randint(0, k2, n2).astype(str).reshape(-1, 1)
y2 = rng.randint(0, 2, n2)
means = pd.DataFrame({"c": cat.ravel(), "y": y2}).groupby("c")["y"].mean()
leaked = pd.Series(cat.ravel()).map(means).values.reshape(-1, 1)
naive = cross_val_score(LogisticRegression(), leaked, y2, cv=5).mean()
proper = cross_val_score(
    make_pipeline(TargetEncoder(target_type="binary"), LogisticRegression()),
    cat, y2, cv=5).mean()
print(f"   {n2} rows, {k2} categories (~{n2 // k2} rows each), target is RANDOM")
print(f"   {'naive — category means from all the data':<48}{naive:>9.4f}   <- LEAKED")
print(f"   {'TargetEncoder in a Pipeline (cross-fitted)':<48}{proper:>9.4f}")
```

```text title="Output"
1. LABEL vs ONE-HOT — effect of each city, in the order encoders number them
     0 = Chennai     2.5
     1 = Delhi      -2.0
     2 = Jaipur      2.4
     3 = Kolkata    -1.8
     4 = Mumbai      2.2
     5 = Pune       -2.1
     -> the sign flips at every step: no single cut separates them

   model                       label/ordinal   one-hot     gain
   LogisticRegression                 0.6737    0.9837  +0.3100
   Forest(max_depth=1)                0.6637    0.9837  +0.3200
   Forest(unrestricted)               0.9837    0.9837  +0.0000
   majority-class baseline: 0.5063

2. COST OF CARDINALITY — one column, 50,000 rows
    categories  one-hot cols   dense MB  sparse MB  binary cols
             3             3        1.2        0.8            2
            10            10        4.0        0.8            4
            50            50       20.0        0.8            6
           256           256      102.4        0.8            8
          1000          1000      400.0        0.8           10
   binary cols = ceil(log2(categories));  frequency encoding = always 1

3. UNSEEN CATEGORY AT PREDICT TIME
   CRASH   LabelEncoder
              -> ValueError: y contains previously unseen labels: 'Kolkata'
   CRASH   OrdinalEncoder (default)
              -> ValueError: Found unknown categories ['Kolkata'] in column 0 during tran
   OK      OrdinalEncoder(handle_unknown='use_encoded_value')
              -> [[0.0], [-1.0]]
   CRASH   OneHotEncoder (default)
              -> ValueError: Found unknown categories ['Kolkata'] in column 0 during tran
   OK      OneHotEncoder(handle_unknown='ignore')
              -> [[1.0, 0.0, 0.0], [0.0, 0.0, 0.0]]

4. TARGET ENCODING ON A PURE-NOISE FEATURE (a perfect method scores ~0.50)
   2000 rows, 500 categories (~4 rows each), target is RANDOM
   naive — category means from all the data           0.7095   <- LEAKED
   TargetEncoder in a Pipeline (cross-fitted)         0.4935
```

### What to notice in that output

- **The same encoding choice was worth 31 points to one model and 0 to another.** That is the single
  most useful fact on this page. "Label encoding is bad" is too crude — it is bad *for models that
  cannot undo it*.
- **The depth-1 forest lost slightly more than logistic regression** (`0.6637` vs `0.6737`). Capacity,
  not model family, is what matters: a tree restricted to one split is no better placed than a linear
  model to handle an alternating pattern.
- **The unrestricted forest scored identically either way**, `0.9837`. Worth sitting with — the false
  ordering was still present in the input; the model simply had enough splits to route around it.
- **Dense one-hot memory grows linearly with cardinality while sparse stays flat** at `0.8 MB`. At
  1,000 categories that's `400 MB` versus `0.8 MB` for identical information — a 500× difference from
  one keyword argument.
- **Binary columns track `ceil(log2 k)` exactly** — 8 columns for 256 categories, confirming the
  compression claim arithmetically.
- **Three of five encoders raised `ValueError` on one unseen city.** Note `LabelEncoder`'s message
  says *"y contains previously unseen labels"* — the library calling the input `y` is itself the hint
  that it was built for targets.
- **The naive target encoder scored `0.7095` where the truth is `0.50`.** The target was generated by
  `rng.randint(0, 2, n2)` — there is *nothing* to learn. Every one of those 21 points came from
  reading the answer.

**Things worth trying:**

1. Reorder `effect` so the values *ascend* alphabetically. Label encoding's penalty vanishes, because
   the invented order now happens to be true — which is exactly why ordinal data is safe.
2. Add `max_depth=3` to the forest and re-run. Find the depth at which it stops needing one-hot.
3. Change `k2` from `500` to `20` in the leakage demo, giving ~100 rows per category. The leak shrinks
   as category means become stable — high cardinality is what makes target encoding dangerous.
4. Swap `LogisticRegression` for `Ridge` on full one-hot without `drop="first"` and inspect
   `.coef_`. Regularisation resolves the collinearity the dummy trap describes.
5. Call `get_feature_names_out()` on a `ColumnTransformer` to see the generated column names — the
   fastest way to check an encoder did what you meant.

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

### Why encode

**W1. [THEORY]** Give two distinct reasons categorical data must be encoded before modelling.

**W2. [THEORY]** Label encoding `Red=0, Green=1, Blue=2` asserts three false statements. Name them.

**W3. [THEORY]** Which kind of categorical data makes label encoding legitimate, and why?

### Label encoding's real cost

**L1. [OUT]** Interpret this table. Why does the same encoding choice matter enormously to one model
and not at all to another?

```text
   LogisticRegression                 0.6737    0.9837  +0.3100
   Forest(max_depth=1)                0.6637    0.9837  +0.3200
   Forest(unrestricted)               0.9837    0.9837  +0.0000
```

**L2. [ANALYZE]** Explain *mechanically* how an unrestricted tree recovers from a false ordering that
a linear model cannot.

**L3. [ANALYZE]** The depth-1 forest did marginally worse than logistic regression. What does that
suggest about whether "model family" is the right way to think about this?

**L4. [THEORY]** For which model types is label encoding of nominal data actively damaging?

**L5. [THEORY]** State the difference between `LabelEncoder` and `OrdinalEncoder`, including input
shape and intended use.

**L6. [OUT]** `OrdinalEncoder()` on `low`/`medium`/`high` produced categories `['high','low','medium']`.
Explain the problem and the fix.

### One-hot

**O1. [THEORY]** Describe the three steps of one-hot encoding a feature with three categories.

**O2. [THEORY]** What property does one-hot have that label encoding lacks?

**O3. [THEORY]** In `ColumnTransformer`, what does `remainder="passthrough"` do, and what is the
default?

**O4. [ANALYZE]** Why is `make_column_selector(dtype_include=object)` preferable to `[0]`?

**O5. [OUT]** Every row of a one-hot matrix sums to `1`. State the consequence for a linear model and
name the parameter that addresses it.

**O6. [THEORY]** After `drop="first"`, how is the dropped category represented, and how do the
remaining coefficients read?

**O7. [ANALYZE]** For which model types is `drop="first"` unnecessary, and why?

### Cardinality

**C1. [OUT]** At 1,000 categories, one-hot cost `400.0 MB` dense and `0.8 MB` sparse. Explain both
numbers.

**C2. [ANALYZE]** Why does sparse memory stay flat at `0.8 MB` as cardinality rises from 3 to 1,000?

**C3. [THEORY]** How many columns does binary encoding need for 256 categories, and what is the
formula?

**C4. [ANALYZE]** Binary encoding is more compact than one-hot. Give the reason it is nonetheless
rarely used.

**C5. [THEORY]** Describe frequency encoding and name one weakness.

### Target encoding

**T1. [THEORY]** Describe how target encoding assigns a value to each category.

**T2. [OUT]** A pure-noise feature scored `0.7095` under naive target encoding and `0.4935` under
`TargetEncoder`. The true value is `0.50`. Explain where those 21 extra points came from.

**T3. [ANALYZE]** Why did 5-fold cross-validation fail to detect the leak?

**T4. [THEORY]** What does `TargetEncoder` do differently, and why must it sit inside a `Pipeline`?

**T5. [ANALYZE]** Why is this described as the most dangerous encoding in common use, given the leak
makes scores *better*?

**T6. [ANALYZE]** With ~4 rows per category the leak was severe. Explain how it changes with ~100 rows
per category.

### Unseen categories

**U1. [OUT]** Of the five encoder configurations tested, which three crashed and what exception did
they raise?

**U2. [THEORY]** What does `handle_unknown="ignore"` output for an unknown category, and why is that
reasonable?

**U3. [THEORY]** What does `OrdinalEncoder(handle_unknown="use_encoded_value", unknown_value=-1)`
output?

**U4. [ANALYZE]** `LabelEncoder` has no `handle_unknown` parameter. Explain why that is consistent
with its intended purpose.

**U5. [ANALYZE]** Give one situation where crashing on an unknown category is the *correct* behaviour.

### Applying it

**P1. [PROG]** Build a `ColumnTransformer` that one-hot encodes every `object` column with
`handle_unknown="ignore"` and passes numeric columns through unchanged.

**P2. [PROG]** Encode a `size` column ordered `low < medium < high` so the integers respect that
order, and print the mapping.

**P3. [PROG]** For a column of 500 categories, print the memory used by dense versus sparse one-hot
output.

**P4. [PROG]** Fit a `OneHotEncoder` on training data, transform test data containing a new category
without raising, and print the resulting row.

**P5. [PROG]** Build a `Pipeline` with `TargetEncoder` and a classifier, and score it with
`cross_val_score`. Add a comment explaining why the ordering prevents leakage.

**P6. [ANALYZE]** A `user_id` column has 40,000 distinct values in 60,000 rows. Evaluate one-hot,
target and frequency encoding for it, and state your choice with reasons.

### Quick self-check

1. Why must categorical data be encoded?
2. What three false claims does label encoding make about nominal data?
3. How many accuracy points did label encoding cost logistic regression?
4. How many did it cost an unrestricted random forest?
5. Which encoder is for targets, and which for features?
6. What order does `OrdinalEncoder` use by default?
7. What does `remainder="passthrough"` prevent?
8. Why are one-hot columns perfectly collinear?
9. When is `drop="first"` unnecessary?
10. How much memory did 1,000 categories cost dense versus sparse?
11. How many columns does binary encoding need for 256 categories?
12. What score did naive target encoding achieve on a pure-noise feature?
13. Why didn't cross-validation catch that?
14. What happens by default when an encoder meets an unseen category?
