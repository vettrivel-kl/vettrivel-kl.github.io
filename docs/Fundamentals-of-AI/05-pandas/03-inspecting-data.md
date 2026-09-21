---
sidebar_position: 3
title: Inspecting Data
description: head, tail, shape, dtypes, info and describe — the first six things to run on any new DataFrame.
tags: [python, pandas]
toc_max_heading_level: 3
---

# Inspecting Data

> **Topic —** What to run the moment data is loaded, before you touch it. Every one of these
> is read-only.

```python
import pandas as pd

data = {
    "Name": ["Arun", "Bala", "Charan", "Divya", "Esha", "Farah"],
    "Age": [20, 21, 22, 20, 21, 23],
    "Department": ["CSE", "IT", "CSE", "ECE", "CSE", "IT"],
    "Marks": [85, 72, 91, 65, 88, 76],
}
df = pd.DataFrame(data)
print(df)
```

```text title="Output"
     Name  Age Department  Marks
0    Arun   20        CSE     85
1    Bala   21         IT     72
2  Charan   22        CSE     91
3   Divya   20        ECE     65
4    Esha   21        CSE     88
5   Farah   23         IT     76
```

---

## `head()` and `tail()`

Real datasets have thousands of rows. `head()` shows the first **5** by default:

```python
print(df.head())
```

```text title="Output"
     Name  Age Department  Marks
0    Arun   20        CSE     85
1    Bala   21         IT     72
2  Charan   22        CSE     91
3   Divya   20        ECE     65
4    Esha   21        CSE     88
```

Pass a number for a different count:

```python
print(df.head(3))
```

```text title="Output"
     Name  Age Department  Marks
0    Arun   20        CSE     85
1    Bala   21         IT     72
2  Charan   22        CSE     91
```

`tail()` does the same from the bottom:

```python
print(df.tail())
```

```text title="Output"
     Name  Age Department  Marks
1    Bala   21         IT     72
2  Charan   22        CSE     91
3   Divya   20        ECE     65
4    Esha   21        CSE     88
5   Farah   23         IT     76
```

```python
print(df.tail(2))
```

```text title="Output"
    Name  Age Department  Marks
4   Esha   21        CSE     88
5  Farah   23         IT     76
```

Notice `tail()` keeps the **original index labels** — `1` to `5`, not renumbered `0` to `4`.
Labels always travel with their rows.

:::tip

`tail()` is the one people skip, and it's often where the problems are: trailing blank rows,
a stray total row, or a footer that a CSV export tacked on.

:::

---

## Shape, columns, index

```python
print(df.shape)     # → (6, 4)
print(df.columns)
print(df.index)
```

```text title="Output"
(6, 4)
Index(['Name', 'Age', 'Department', 'Marks'], dtype='object')
RangeIndex(start=0, stop=6, step=1)
```

`.shape` is `(rows, columns)` — the first number you want to know about any dataset.

`.columns` and `.index` are `Index` objects, not plain lists. Wrap them in `list()` for
something readable, or use `.tolist()`.

`RangeIndex(start=0, stop=6, step=1)` is pandas' compact way of saying "a default `0`–`5`
index". If you'd loaded with `index_col=`, you'd see the actual labels here instead.

```python
print(df.size, len(df))   # → 24 6
```

| Call | Gives | Here |
|---|---|---|
| `.shape` | `(rows, cols)` | `(6, 4)` |
| `len(df)` | rows only | `6` |
| `.size` | total cells | `24` |
| `.columns` | column names | an `Index` |
| `.index` | row labels | a `RangeIndex` |

---

## `dtypes`

```python
print(df.dtypes)
```

```text title="Output"
Name          object
Age            int64
Department    object
Marks          int64
dtype: object
```

`object` means text. `int64` and `float64` are the numeric types from
[NumPy](../04-numpy/01-arrays-and-attributes.md#dtypes).

Check this early. A column you *expect* to be numeric showing up as `object` means something
non-numeric got in — a stray `"N/A"`, a currency symbol, a thousands comma — and arithmetic on
it will fail or silently do the wrong thing.

---

## `info()`

The single most useful command on a new DataFrame — it combines shape, dtypes, missing-value
counts and memory in one view.

```python
df.info()
```

```text title="Output"
<class 'pandas.core.frame.DataFrame'>
RangeIndex: 6 entries, 0 to 5
Data columns (total 4 columns):
 #   Column      Non-Null Count  Dtype 
---  ------      --------------  ----- 
 0   Name        6 non-null      object
 1   Age         6 non-null      int64 
 2   Department  6 non-null      object
 3   Marks       6 non-null      int64 
dtypes: int64(2), object(2)
memory usage: 324.0+ bytes
```

**Read the `Non-Null Count` column against the row count.** `RangeIndex: 6 entries` and every
column saying `6 non-null` means nothing is missing. Any column showing fewer than 6 has gaps.

:::note `info()` prints — it doesn't return

`df.info()`, not `print(df.info())`. Wrapping it in `print()` shows the output *and then*
`None`, because the method's return value is `None`. It's the one inspection call that breaks
the pattern.

:::

The `+` in `324.0+ bytes` means the estimate excludes the actual string contents — `object`
columns hold pointers, and the text lives elsewhere. Use `df.info(memory_usage="deep")` for
the true figure.

---

## `describe()`

Statistical summary of the **numeric** columns:

```python
print(df.describe())
```

```text title="Output"
             Age      Marks
count   6.000000   6.000000
mean   21.166667  79.500000
std     1.169045  10.134101
min    20.000000  65.000000
25%    20.250000  73.000000
50%    21.000000  80.500000
75%    21.750000  87.250000
max    23.000000  91.000000
```

| Row | Means |
|---|---|
| `count` | **non-missing** values — not the row count |
| `mean` | average |
| `std` | standard deviation (sample, `ddof=1`) |
| `min` / `max` | extremes |
| `25%` / `50%` / `75%` | quartiles — `50%` is the median |

Two things worth stating plainly:

- **`std` here is the sample standard deviation.** Pandas defaults to `ddof=1`; NumPy defaults
  to `ddof=0` and would give a different number for the same data. See
  [the ddof section](../04-numpy/04-aggregations-and-statistics.md#numpy-and-pandas-disagree-on-std).
- **Comparing `count` to `len(df)` is a missing-data check.** If `count` is lower, that column
  has gaps.

### Why `describe()` skips columns

Run it on `students.csv`, which has text columns and missing values:

```python
c = pd.read_csv("students.csv")
print(c)
print(c.describe())
```

```text title="Output"
     Name Department   Age  Marks
0    Arun        CSE  20.0   85.0
1    Bala         IT  21.0   72.0
2  Charan        CSE   NaN   91.0
3   Divya        ECE  22.0   65.0
4    Esha        CSE  21.0    NaN
5    Bala         IT  21.0   72.0
             Age      Marks
count   5.000000   5.000000
mean   21.000000  77.000000
std     0.707107  10.653638
min    20.000000  65.000000
25%    21.000000  72.000000
50%    21.000000  72.000000
75%    21.000000  85.000000
max    22.000000  91.000000
```

**`Name` and `Department` are absent entirely.** They're `object` (text) columns, and a mean
or a standard deviation of names is meaningless — so `describe()` leaves them out by default.

And **`count` is 5, not 6**, for both numeric columns. Six rows, one missing value in each, so
five values were actually summarised. Every statistic here is computed on those five —
`Marks` averages 77.0 from five numbers, not six.

:::warning `count` is your missing-data alarm

`len(c)` is 6 but `count` is 5. That gap is the fastest way to spot missing data without
running anything else.

:::

### Including everything

```python
print(c.describe(include="all"))
```

```text title="Output"
        Name Department        Age      Marks
count      6          6   5.000000   5.000000
unique     5          3        NaN        NaN
top     Bala        CSE        NaN        NaN
freq       2          3        NaN        NaN
mean     NaN        NaN  21.000000  77.000000
std      NaN        NaN   0.707107  10.653638
min      NaN        NaN  20.000000  65.000000
25%      NaN        NaN  21.000000  72.000000
50%      NaN        NaN  21.000000  72.000000
75%      NaN        NaN  21.000000  85.000000
max      NaN        NaN  22.000000  91.000000
```

Text columns get their own statistics: `unique` (distinct values), `top` (most frequent) and
`freq` (how often). The `NaN`s are where a statistic doesn't apply to that kind of column.

This one view already tells you the data is dirty: **`Name` has 6 values but only 5 unique**,
with `Bala` appearing twice. That's the duplicate row, found without looking for it.

`describe().T` transposes the table, which reads better when you have many columns:

```python
print(df.describe().T)
```

```text title="Output"
       count       mean        std   min    25%   50%    75%   max
Age      6.0  21.166667   1.169045  20.0  20.25  21.0  21.75  23.0
Marks    6.0  79.500000  10.134101  65.0  73.00  80.5  87.25  91.0
```

---

## Counting missing values

```python
print(df.isnull().sum())
```

```text title="Output"
Name          0
Age           0
Department    0
Marks         0
dtype: int64
```

Nothing missing in this DataFrame. On `students.csv`:

```python
print(c.isnull().sum())
```

```text title="Output"
Name          0
Department    0
Age           1
Marks         1
dtype: int64
```

One missing `Age`, one missing `Marks`.

How it works: `isnull()` gives a DataFrame of `True`/`False` the same shape as the original,
then `.sum()` adds up each column — and `True` counts as `1`, the same
[boolean-as-int](../01-basics/01-values-and-types.md#bool-is-a-subclass-of-int) trick as in
NumPy. `.sum()` defaults to `axis=0`, which is why you get one number per column.

`isna()` is an exact alias for `isnull()`. Use whichever you prefer, consistently.

---

## Counting categories

```python
print(df["Department"].value_counts())
print(df["Department"].nunique(), df["Department"].unique())
```

```text title="Output"
Department
CSE    3
IT     2
ECE    1
Name: count, dtype: int64
3 ['CSE' 'IT' 'ECE']
```

`value_counts()` is the workhorse for categorical columns — a frequency table, sorted
descending. `nunique()` counts distinct values, `unique()` lists them (in order of first
appearance, not sorted).

---

## The standard opening sequence

Six lines, every time, before you change anything:

```python
df = pd.read_csv("file.csv")
print(df.shape)        # how big?
print(df.head())       # what does it look like?
print(df.tail())       # anything odd at the end?
df.info()              # types and missing values
print(df.describe())   # ranges — any impossible numbers?
print(df.isnull().sum())   # exactly what's missing
```

`describe()` earns its place here by catching impossible values: a negative age, marks above
100, a `max` in the millions where you expected tens. Those are data-entry errors that no
amount of `head()` will show you.

---

## Common Mistakes

| # | Mistake | Wrong | Right |
|---|---|---|---|
| 1 | `print(df.info())` | prints, then `None` | `df.info()` |
| 2 | Reading `count` as the row count | it's **non-null** count | compare to `len(df)` |
| 3 | Expecting text columns in `describe()` | numeric only | `describe(include="all")` |
| 4 | Assuming pandas `std` matches NumPy | pandas uses `ddof=1` | pass `ddof` explicitly |
| 5 | `df.shape()` | it's an attribute | `df.shape` |
| 6 | Only looking at `head()` | misses trailing junk | check `tail()` too |
| 7 | `df.isnull()` without `.sum()` | a whole boolean table | `.isnull().sum()` |
| 8 | Ignoring `object` on a numeric column | arithmetic will misbehave | investigate the stray values |

---

## Summary

| Question | Call |
|---|---|
| How big? | `df.shape`, `len(df)` |
| First / last rows? | `df.head(n)` / `df.tail(n)` |
| What columns? | `df.columns` |
| What types? | `df.dtypes` |
| Everything at once? | `df.info()` |
| Numeric ranges? | `df.describe()` |
| Including text? | `df.describe(include="all")` |
| What's missing? | `df.isnull().sum()` |
| Category frequencies? | `df["col"].value_counts()` |
| Distinct values? | `df["col"].nunique()` / `.unique()` |

**Key takeaways**

- `head()` and `tail()` default to 5 rows and keep the original index labels
- `.shape` is `(rows, columns)`; `.size` is total cells
- `df.info()` **prints** and returns `None` — don't wrap it in `print()`
- In `describe()`, `count` is the **non-null** count — compare it to `len(df)` to find gaps
- `describe()` skips text columns; `include="all"` adds `unique`, `top` and `freq`
- `describe(include="all")` found the duplicate row via `count` 6 vs `unique` 5
- Pandas `std` is the sample deviation (`ddof=1`), unlike NumPy's default
- `isnull().sum()` works because `True` is `1` and `.sum()` defaults to per-column

**See also:** [Cleaning Data](./04-cleaning-data.md) for fixing what you find here ·
[Loading and Saving Data](./02-loading-and-saving.md) ·
[Aggregations and Statistics](../04-numpy/04-aggregations-and-statistics.md) for the `ddof`
detail

---

## Run It Yourself

```python title="pandas_inspect.py"
import pandas as pd

df = pd.DataFrame({
    "Name": ["Arun", "Bala", "Charan", "Divya", "Esha", "Farah"],
    "Age": [20, 21, 22, 20, 21, 23],
    "Department": ["CSE", "IT", "CSE", "ECE", "CSE", "IT"],
    "Marks": [85, 72, 91, 65, 88, 76],
})

print("shape      ", df.shape)
print("columns    ", df.columns.tolist())
print("size / len ", df.size, "/", len(df))

print("\nhead(3)")
print(df.head(3))

print("\ntail(2) — note the index labels")
print(df.tail(2))

print("\ndtypes")
print(df.dtypes)

print("\ninfo()")
df.info()

print("\ndescribe()")
print(df.describe())

print("\nmissing per column")
print(df.isnull().sum())

print("\nvalue_counts on Department")
print(df["Department"].value_counts())
```

```text title="Output"
shape       (6, 4)
columns     ['Name', 'Age', 'Department', 'Marks']
size / len  24 / 6

head(3)
     Name  Age Department  Marks
0    Arun   20        CSE     85
1    Bala   21         IT     72
2  Charan   22        CSE     91

tail(2) — note the index labels
    Name  Age Department  Marks
4   Esha   21        CSE     88
5  Farah   23         IT     76

dtypes
Name          object
Age            int64
Department    object
Marks          int64
dtype: object

info()
<class 'pandas.core.frame.DataFrame'>
RangeIndex: 6 entries, 0 to 5
Data columns (total 4 columns):
 #   Column      Non-Null Count  Dtype 
---  ------      --------------  ----- 
 0   Name        6 non-null      object
 1   Age         6 non-null      int64 
 2   Department  6 non-null      object
 3   Marks       6 non-null      int64 
dtypes: int64(2), object(2)
memory usage: 324.0+ bytes

describe()
             Age      Marks
count   6.000000   6.000000
mean   21.166667  79.500000
std     1.169045  10.134101
min    20.000000  65.000000
25%    20.250000  73.000000
50%    21.000000  80.500000
75%    21.750000  87.250000
max    23.000000  91.000000

missing per column
Name          0
Age           0
Department    0
Marks         0
dtype: int64

value_counts on Department
Department
CSE    3
IT     2
ECE    1
Name: count, dtype: int64
```

---

## Practice Questions

*Tags and marks are explained on the [Python index](../index.md#practice-questions).*

### Unit 1 § K — Pandas

**K5. [PROG]** For that DataFrame, display the **shape**, the **column names**, and the
**statistical summary**. `[4]`

**K6. [THEORY]** `df.describe()` ignores some columns of `students.csv` entirely. Which ones, and
why? `[3]`

### Unit 2 § B — Data Inspection

**B1. [PROG]** For `df_eda`, display: the first 5 rows, the first 3 rows, the last 5 rows, the
shape, the column names, and the dtype of each column. `[6]`

**B2. [OUT]** Using the **raw** `students.csv`: `[4]`

```python
df = pd.read_csv("students.csv")
print(df.shape)
print(df.dtypes)
```

*Age was written as whole numbers in the file. Why is its dtype `float64`?*

**B3. [OUT]** `[4]`

```python
df = pd.read_csv("students.csv")
print(df.isnull().sum())
```

*Write the full output, footer line included.*

**B4. [THEORY]** What is the difference between `df.isnull().sum()` and `df.isnull().sum().sum()`?
What does each return? `[3]`

**B5. [OUT]** Sketch the output of `df.info()` for the raw `students.csv` — the header lines, the
per-column table, and the `dtypes:` summary. `[5]`

**B6. [THEORY]** Give three pieces of information `df.info()` gives you that `df.describe()` does
not. `[3]`

**B7. [OUT]** `[5]`

```python
df = pd.read_csv("students.csv")
print(df.describe())
```

*`students.csv` has 6 rows. Explain the `count` row.*

**B8. [THEORY]** `describe()` shows only 2 of the 4 columns of `students.csv`. Which are left out,
why, and what argument makes it include them? `[3]`

**B9. [OUT]** `[3]`

```python
print(df_eda["Department"].value_counts())
```

*What order are the results in, and what decides that order?*

**B10. [THEORY]** What is the difference between `df.head()` and `df.head(3)`? What is the
default? `[2]`

### Viva

1. Which columns does `describe()` skip, and why?
