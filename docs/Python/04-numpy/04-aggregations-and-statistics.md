---
sidebar_position: 4
title: Aggregations and Statistics
description: sum, mean, median, std and var; the axis argument; why NumPy and pandas disagree on std; and handling nan.
tags: [python, numpy, statistics]
toc_max_heading_level: 3
---

# Aggregations and Statistics

> **Topic —** Reducing an array to a summary — one number, or one number per row or column.

```python
import numpy as np
import pandas as pd
```

The pandas import is only needed for the two comparison sections near the end.

---

## The seven aggregations

```python
arr = np.array([10, 20, 30, 40, 50])

print("sum   :", np.sum(arr))
print("max   :", np.max(arr))
print("min   :", np.min(arr))
print("mean  :", np.mean(arr))
print("median:", np.median(arr))
print("std   :", np.std(arr))
print("var   :", np.var(arr))
```

```text title="Output"
sum   : 150
max   : 50
min   : 10
mean  : 30.0
median: 30.0
std   : 14.142135623730951
var   : 200.0
```

| Function | Gives | Note |
|---|---|---|
| `np.sum` | total | |
| `np.max` / `np.min` | largest / smallest | |
| `np.mean` | arithmetic average | always a float |
| `np.median` | middle value when sorted | resistant to outliers |
| `np.std` | standard deviation | spread, in the data's units |
| `np.var` | variance | `std ** 2` |

`var` is `std` squared — `14.142² = 200`. Variance is easier to compute with; standard
deviation is easier to interpret, because it's in the same units as the data.

### Mean vs median

`median` sorts and takes the middle. With an even count it averages the two middle values:

```python
print(np.median(np.array([10, 20, 30])))       # → 20.0   the middle one
print(np.median(np.array([10, 20, 30, 40])))   # → 25.0   average of 20 and 30
```

```text title="Output"
20.0
25.0
```

Both are `30.0` for the array above, which happens because the data is evenly spaced. Add one
outlier and they separate — the mean chases it, the median barely moves. That's why median
income is reported rather than mean income.

### Method form

Most of these also exist as array methods:

```python
print(arr.sum(), arr.max(), arr.min(), arr.mean())
```

```text title="Output"
150 50 10 30.0
```

:::warning `median` has no method form

```python
print(hasattr(arr, "median"))   # → False
```

`arr.median()` raises `AttributeError`. It's `np.median(arr)` only. Same for `np.percentile`
and the `nan*` family. `sum`, `mean`, `min`, `max`, `std` and `var` work both ways.

:::

### Others worth knowing

```python
arr = np.array([10, 20, 30, 40, 50])
print(np.percentile(arr, [25, 50, 75]))   # → [20. 30. 40.]
print(np.cumsum(arr))                     # → [ 10  30  60 100 150]
print(np.ptp(arr))                        # → 40
```

```text title="Output"
[20. 30. 40.]
[ 10  30  60 100 150]
40
```

`percentile` at 50 is the median. `cumsum` is a running total — useful for cumulative charts.
`ptp` is "peak to peak", `max - min`, i.e. the range.

---

## The `axis` argument

On a 2-D array, aggregating everything is usually **not** what you want.

```python
m = np.array([[1, 2, 3],
              [4, 5, 6]])

print("sum()       :", m.sum())          # → 21
print("sum(axis=0) :", m.sum(axis=0))    # → [5 7 9]
print("sum(axis=1) :", m.sum(axis=1))    # → [ 6 15]
```

```text title="Output"
sum()       : 21
sum(axis=0) : [5 7 9]
sum(axis=1) : [ 6 15]
```

```text
                col 0  col 1  col 2
        row 0 [   1      2      3  ]  → 6    axis=1 sums ACROSS a row
        row 1 [   4      5      6  ]  → 15
                  ↓      ↓      ↓
                  5      7      9         axis=0 sums DOWN a column
```

**`axis` is the dimension that gets collapsed**, not the one you keep.

- `axis=0` collapses rows → one value **per column**
- `axis=1` collapses columns → one value **per row**
- no `axis` → everything collapses to one number

```python
print("mean(axis=0):", m.mean(axis=0))   # → [2.5 3.5 4.5]
print("mean(axis=1):", m.mean(axis=1))   # → [2. 5.]
print("max(axis=0) :", m.max(axis=0))    # → [4 5 6]
```

```text title="Output"
mean(axis=0): [2.5 3.5 4.5]
mean(axis=1): [2. 5.]
max(axis=0) : [4 5 6]
```

The shapes confirm which dimension went:

```python
print(m.sum(axis=0).shape, m.sum(axis=1).shape)   # → (3,) (2,)
```

```text title="Output"
(3,) (2,)
```

`(2, 3)` with `axis=0` removed leaves `(3,)`. Reading the shape is the reliable way to check
you picked the right axis.

:::tip

In table terms — rows are records, columns are fields — you almost always want **`axis=0`**:
the mean of each column is the mean of each field across all records. `axis=1` averages
across *different fields of one record*, which is rarely meaningful.

This carries straight into pandas, where `axis=0` is the default for exactly this reason.

:::

---

## NumPy and pandas disagree on `std`

Same data, two different answers. This is not a bug and it will catch you.

```python
a = np.array([10, 20, 30, 40])

print("np.std  (ddof=0):", np.std(a))
print("np.std  (ddof=1):", np.std(a, ddof=1))
print("pd .std (default):", pd.Series(a).std())
```

```text title="Output"
np.std  (ddof=0): 11.180339887498949
np.std  (ddof=1): 12.909944487358056
pd .std (default): 12.909944487358056
```

```python
print("np.var  (ddof=0):", np.var(a))
print("np.var  (ddof=1):", np.var(a, ddof=1))
print("pd .var (default):", pd.Series(a).var())
```

```text title="Output"
np.var  (ddof=0): 125.0
np.var  (ddof=1): 166.66666666666666
pd .var (default): 166.66666666666666
```

| | Divides by | Called | Default in |
|---|---|---|---|
| `ddof=0` | *n* | **population** std | **NumPy** |
| `ddof=1` | *n − 1* | **sample** std | **pandas** |

`ddof` is "delta degrees of freedom" — how much to subtract from *n* in the divisor.

**Which is right?** It depends what your data is:

- The data is the **entire population** you care about — all four values, full stop → `ddof=0`
- The data is a **sample** used to estimate a wider population's spread → `ddof=1`

Statistics courses teach *n − 1* for samples, because dividing by *n* systematically
underestimates the true spread. So pandas' default matches what you were taught; NumPy's
doesn't.

:::danger

If you compute a standard deviation with NumPy and again with pandas and get different
numbers, neither is wrong — you've used different `ddof`. Pass `ddof` explicitly whenever the
value matters, and note which convention you used.

:::

`mean`, `median`, `sum`, `min` and `max` have no such ambiguity — only `std` and `var`.

---

## Handling `nan`

`nan` is "not a number" — the marker for missing data. It **poisons** ordinary aggregations.

```python
d = np.array([10, 20, np.nan, 40])
print(d)
print("mean   :", np.mean(d))
print("nanmean:", np.nanmean(d))
```

```text title="Output"
[10. 20. nan 40.]
mean   : nan
nanmean: 23.333333333333332
```

One `nan` makes the whole mean `nan`, which is arguably correct — the true mean is unknown.
The `nan*` functions skip it instead:

```python
print("nansum :", np.nansum(d))    # → 70.0
print("nanstd :", np.nanstd(d))    # → 12.472191289246473
```

```text title="Output"
nansum : 70.0
nanstd : 12.472191289246473
```

`nanmean` divided by **3**, not 4 — it ignores the missing value rather than treating it as
zero.

Note the array is `float64` even though the numbers look like ints. `nan` is a float concept,
so its presence forces the whole array to float.

### Finding and removing

```python
print(np.isnan(d))            # → [False False  True False]
print(np.isnan(d).sum())      # → 1
print(d[~np.isnan(d)])        # → [10. 20. 40.]
```

```text title="Output"
[False False  True False]
1
[10. 20. 40.]
```

`d[~np.isnan(d)]` is the standard "drop the missing values" idiom — a
[boolean mask](./02-indexing-slicing-reshaping.md#boolean-masking) with `~` negating it.

:::warning `nan == nan` is `False`

```python
print(np.nan == np.nan)   # → False
```

`nan` is not equal to itself, by design — it means "unknown", and two unknowns aren't known to
match. So `d == np.nan` finds nothing. **Always** use `np.isnan()`.

:::

---

## NumPy and pandas together

An `ndarray` and a `DataFrame` convert both ways. This is the seam where these notes hand
over to pandas.

### Array → DataFrame

```python
arr = np.array([[10, 20],
                [30, 40]])
df = pd.DataFrame(arr)
print(df)
```

```text title="Output"
    0   1
0  10  20
1  30  40
```

Without names, pandas numbers the columns `0` and `1`. Usually you want real names:

```python
df = pd.DataFrame(arr, columns=["A", "B"])
print(df)
```

```text title="Output"
    A   B
0  10  20
1  30  40
```

### DataFrame → array

```python
df = pd.DataFrame({'A': [10, 20], 'B': [30, 40]})
arr = df.to_numpy()
print(arr)
print(type(arr).__name__, arr.dtype)
```

```text title="Output"
[[10 30]
 [20 40]]
ndarray int64
```

The column names and the index are **dropped** — `to_numpy()` gives you the raw values only.

:::warning Mixed columns collapse to `object`

```python
df = pd.DataFrame({'A': [1, 2], 'B': ['x', 'y']})
print(df.to_numpy(), df.to_numpy().dtype)
```

```text title="Output"
[[1 'x']
 [2 'y']] object
```

An array is homogeneous, but a DataFrame's columns each have their own dtype. Converting a
mixed DataFrame gives an `object` array — which loses NumPy's speed entirely. Select the
numeric columns first: `df[['A']].to_numpy()`.

:::

**The division of labour:** NumPy is one type, no labels, fast maths. Pandas is labelled
columns of differing types, built *on top of* NumPy. Use pandas to load and organise, NumPy
for the numerical core.

---

## Common Mistakes

| # | Mistake | Wrong | Right |
|---|---|---|---|
| 1 | `arr.median()` | `AttributeError` | `np.median(arr)` |
| 2 | Forgetting `axis` on 2-D | one number, not per-column | `m.mean(axis=0)` |
| 3 | Confusing the axes | `axis=0` collapses rows | check with `.shape` |
| 4 | Comparing NumPy std to pandas std | different `ddof` | pass `ddof` explicitly |
| 5 | `mean()` on data with `nan` | returns `nan` | `np.nanmean()` |
| 6 | `d == np.nan` | always `False` | `np.isnan(d)` |
| 7 | Treating `nan` as `0` | `nansum` skips, doesn't zero | know which you want |
| 8 | `to_numpy()` on mixed columns | `object` dtype, slow | select numeric columns first |

---

## Summary

| Task | Call |
|---|---|
| Total / extremes | `np.sum`, `np.max`, `np.min` |
| Centre | `np.mean`, `np.median` |
| Spread | `np.std`, `np.var` (+ `ddof=`) |
| Quartiles | `np.percentile(a, [25, 50, 75])` |
| Running total | `np.cumsum` |
| Range | `np.ptp` |
| Per column | `m.f(axis=0)` |
| Per row | `m.f(axis=1)` |
| Skip missing | `np.nanmean`, `np.nansum`, `np.nanstd` |
| Find missing | `np.isnan(a)` |
| Drop missing | `a[~np.isnan(a)]` |
| To / from pandas | `pd.DataFrame(arr)` / `df.to_numpy()` |

**Key takeaways**

- `var` is `std` squared; `std` is interpretable because it's in the data's units
- `axis` names the dimension that **disappears** — `axis=0` gives one value per column
- For table-shaped data you almost always want `axis=0`
- **NumPy `std` defaults to `ddof=0`, pandas to `ddof=1`** — same data, different answer
- One `nan` makes any ordinary aggregation `nan`; the `nan*` functions skip it
- `nan != nan`, so test with `np.isnan()` and drop with `a[~np.isnan(a)]`
- `to_numpy()` discards column names and the index, and collapses mixed types to `object`

**See also:** [Operations and Broadcasting](./03-operations-and-broadcasting.md) ·
[Indexing, Slicing and Reshaping](./02-indexing-slicing-reshaping.md) for the masks used here ·
[Data Types](../01-basics/03-data-types.md) for Python's own numeric types

---

## Run It Yourself

```python title="numpy_stats.py"
import numpy as np

arr = np.array([10, 20, 30, 40, 50])

print("1-D summary")
print(f"  {'sum':<10} {np.sum(arr)}")
print(f"  {'mean':<10} {np.mean(arr)}")
print(f"  {'median':<10} {np.median(arr)}")
print(f"  {'min / max':<10} {np.min(arr)} / {np.max(arr)}")
print(f"  {'range':<10} {np.ptp(arr)}")
print(f"  {'std ddof=0':<10} {np.std(arr):.4f}")
print(f"  {'std ddof=1':<10} {np.std(arr, ddof=1):.4f}")

print()
m = np.array([[1, 2, 3],
              [4, 5, 6]])
print("2-D, axis matters")
print(f"  {'whole':<14} {m.sum()}")
print(f"  {'axis=0 (cols)':<14} {m.sum(axis=0)}   shape {m.sum(axis=0).shape}")
print(f"  {'axis=1 (rows)':<14} {m.sum(axis=1)}   shape {m.sum(axis=1).shape}")

print()
d = np.array([10, 20, np.nan, 40])
print("with a missing value")
print(f"  {'data':<14} {d}")
print(f"  {'mean':<14} {np.mean(d)}")
print(f"  {'nanmean':<14} {np.nanmean(d):.4f}")
print(f"  {'nan count':<14} {np.isnan(d).sum()}")
print(f"  {'dropped':<14} {d[~np.isnan(d)]}")
```

```text title="Output"
1-D summary
  sum        150
  mean       30.0
  median     30.0
  min / max  10 / 50
  range      40
  std ddof=0 14.1421
  std ddof=1 15.8114

2-D, axis matters
  whole          21
  axis=0 (cols)  [5 7 9]   shape (3,)
  axis=1 (rows)  [ 6 15]   shape (2,)

with a missing value
  data           [10. 20. nan 40.]
  mean           nan
  nanmean        23.3333
  nan count      1
  dropped        [10. 20. 40.]
```

---

## Practice Questions

*Tags and marks are explained on the [Python index](../index.md#practice-questions).*

### Unit 1 § J — NumPy

**J6. [PROG]** For `arr = np.array([10, 20, 30, 40, 50])`, display the sum, maximum, minimum,
mean, median, standard deviation, and variance. `[7]`

### Unit 1 § L — Mini Challenges

**L4. [PROG]** Load `students.csv`, then use **NumPy** on the Marks column to print the mean,
median, standard deviation, and the count of students scoring above the mean. `[6]`

### Unit 2 § H — NumPy ↔ Pandas Conversion

**H1. [OUT]** `[3]`

```python
import numpy as np, pandas as pd
arr = np.array([[10, 20], [30, 40]])
df = pd.DataFrame(arr)
print(df)
```

*What are the column names, and why those?*

**H2. [PROG]** Redo H1 so the columns are named `A` and `B` and the index is `["r1", "r2"]`. `[3]`

**H3. [OUT]** `[3]`

```python
df = pd.DataFrame({"A": [10, 20], "B": [30, 40]})
arr = df.to_numpy()
print(arr)
print(arr.dtype)
print(type(arr))
```

**H4. [OUT]** This is the interesting case. `[4]`

```python
mixed = pd.DataFrame({"A": [1, 2], "B": ["x", "y"]})
print(mixed.to_numpy())
print(mixed.to_numpy().dtype)
```

*Why is the dtype not `int64`? What does that cost you?*

**H5. [THEORY]** A DataFrame can hold a different dtype **per column**; a NumPy array holds **one
dtype for everything**. Explain why, and what it means for converting between them. `[4]`

**H6. [PROG]** Extract the Marks column of `df_eda` as a NumPy array, then use **NumPy** functions
to print its mean and standard deviation. `[3]`

### Viva

1. Why does `pandas.var()` differ from `numpy.var()` on the same numbers?
