---
sidebar_position: 1
title: Loading and Preparing Data
description: Why read_csv is not a neutral loader, the missingness it silently fails to catch, a pre-flight audit that catches it, and whether to convert to NumPy at all.
tags: [machine-learning, data-preprocessing, pandas, numpy]
toc_max_heading_level: 3
---

# Loading and Preparing Data

> **Topic —** Loading a CSV looks like the one step that can't go wrong. It is in fact where the most
> damaging errors enter, because they enter **silently** — no exception, no warning, just columns
> that are quietly the wrong type and missing values that were never counted as missing.

This page is a defensive routine: what `pd.read_csv` decides on your behalf, how to find out what it
decided, and how to get `X` and `y` out the other side in a state you can trust.

---

## The imports

```python
import numpy as np
import matplotlib.pyplot as plt
import pandas as pd
```

| Alias | Library | Role here |
|---|---|---|
| `np` | NumPy | Arrays — what the data becomes underneath |
| `plt` | Matplotlib's **Pyplot** module | Plotting |
| `pd` | Pandas | Loading and holding the data as a table |

As close to universal as Python conventions get. Deviating makes your code harder for anyone else —
including future you — to skim.

---

## `read_csv` is not a neutral loader

A CSV file is text. Every value in it is a string until something decides otherwise, and that
something is `pd.read_csv`, making a series of **inferences per column** that it does not report.

Here is a deliberately realistic file — the kind you actually receive:

```text title="messy.csv"
id,Country,Age,Salary,Region,Purchased
1,France,44,72000,EU,No
2,Spain,27,48000,EU,Yes
3,Germany,30,54000,EU,No
4,Spain,38,"61,000",EU,No
5,Germany,40,,EU,Yes
6,France,35,58000,EU,Yes
7,Spain,N/A,52000,EU,No
8,France,48,79000,EU,Yes
9,Germany,-1,83000,EU,No
10,France,37,67000,EU,Yes
11,France,?,999999,EU,No
10,France,37,67000,EU,Yes
```

Load it the obvious way and inspect what you got:

```python
naive = pd.read_csv("messy.csv")
print(naive.dtypes)
print(naive.isna().sum().sum())
```

```text title="Output"
id            int64
Country      object
Age          object
Salary       object
Region       object
Purchased    object
dtype: object

2
```

Two things just happened, both bad, neither announced.

**`Age` and `Salary` are `object`, not numbers.** They contain digits in every row you care about,
but one `?` in `Age` and one `"61,000"` in `Salary` were enough for pandas to give up on a numeric
type and store the whole column as Python strings. Any arithmetic downstream either raises something
confusing or — worse — succeeds and concatenates strings.

**It reported 2 missing values.** There are more than that, as the next section shows.

:::danger Print `.dtypes` immediately after every load

This is a one-line habit that catches a whole class of silent failure:

```python
df = pd.read_csv("data.csv")
print(df.dtypes)          # ← do this every single time
```

A column you believe is numeric showing as `object` means something non-numeric is hiding in it. You
want to discover that now, not three steps later when a model reports a nonsensical score.

:::

---

## The missingness pandas cannot see

Pandas recognises a fixed list of strings as missing. It is worth knowing exactly what's on it:

```python
print(len(pd._libs.parsers.STR_NA_VALUES))
print(sorted(pd._libs.parsers.STR_NA_VALUES))
```

```text title="Output"
19

'', '#N/A', '#N/A N/A', '#NA', '-1.#IND', '-1.#QNAN', '-NaN', '-nan',
'1.#IND', '1.#QNAN', '<NA>', 'N/A', 'NA', 'NULL', 'NaN', 'None', 'n/a',
'nan', 'null'
```

That's why the `N/A` in row 7 became `NaN` automatically. Now note what is **not** on the list:

| Encoding of "missing" | Caught by default? |
|---|---|
| Empty cell, `NA`, `N/A`, `null`, `None`, `NaN` | ✅ Yes |
| `?` | ❌ No |
| `-`, `--`, `.` | ❌ No |
| `unknown`, `missing`, `not recorded`, `TBD` | ❌ No |
| `-1` as "no value" | ❌ No |
| `999`, `9999`, `999999` as "no value" | ❌ No |
| `0` meaning "not measured" | ❌ No |

The last three are **sentinel values**, and they are the dangerous category. A `-1` in an age column
is a perfectly valid number as far as any library is concerned. It will be averaged, scaled, and fed
to a model as though someone were minus one year old.

:::warning No library can find sentinels for you

Whether `-1` in `Age` means "missing" or is a genuine data error, and whether `999999` in `Salary`
is a real high earner or a placeholder, is **not inferable from the data**. It requires knowing how
the data was collected.

This is the part of preprocessing that cannot be automated, and it's the reason a data dictionary or
a conversation with whoever produced the file is worth more than any technique on this page.

:::

Once you know, you declare them:

```python
df = pd.read_csv("messy.csv",
                 na_values=["?", "-1", "999999"],   # domain knowledge, not automatic
                 thousands=",")
print(df.dtypes)
print(df.isna().sum().sum())
```

```text title="Output"
id             int64
Country       object
Age          float64
Salary       float64
Region        object
Purchased     object
dtype: object

5
```

`Age` and `Salary` are numeric now, and the missing count went from **2 to 5**. Same file, same rows
— the three extra were always missing, and were previously being treated as data.

### The `read_csv` parameters worth knowing

| Parameter | What it does | When you need it |
|---|---|---|
| `na_values=` | Extra strings/values to treat as missing | Sentinels, `?`, `unknown` |
| `thousands=","` | Strip digit-group separators | `"61,000"` staying numeric |
| `dtype={...}` | Force a column's type instead of inferring | IDs with leading zeros, codes |
| `usecols=[...]` | Read only these columns | Wide files; less memory |
| `parse_dates=[...]` | Parse to real datetimes | Any date column |
| `index_col=` | Use a column as the index | Natural keys |
| `encoding=` | File's text encoding | `UnicodeDecodeError` on load |
| `skiprows=`, `nrows=` | Skip preamble; read a sample | Reports with header junk |
| `chunksize=` | Iterate in chunks | Files larger than memory |

:::note `dtype={"zip": str}` — the leading-zero trap

A postcode column containing `01234` will be inferred as `int64` and become `1234`. The leading zero
is gone and cannot be recovered. Anything that is an **identifier rather than a quantity** — postcodes,
phone numbers, account numbers, product codes — should be read as `str`, even though it looks numeric.

Ask of each column: *would arithmetic on this mean anything?* If not, it isn't a number.

:::

---

## A pre-flight audit

Rather than remembering to check five things, check them all at once. This function is small, and
running it after every load costs nothing:

```python
def audit(df, name):
    print(f"AUDIT — {name}: {df.shape[0]} rows x {df.shape[1]} columns")

    dups = int(df.duplicated().sum())
    print(f"   duplicate rows:   {dups}")

    const = [c for c in df.columns if df[c].nunique(dropna=False) <= 1]
    print(f"   constant columns: {const if const else 'none'}")

    for c in df.columns:
        note = ""
        if df[c].dtype == object:
            coerced = pd.to_numeric(df[c], errors="coerce")
            if coerced.notna().sum() > 0.5 * df[c].notna().sum():
                note = "LOOKS NUMERIC but is object"
        elif int((df[c] < 0).sum()):
            note = f"{int((df[c] < 0).sum())} negative value(s)"
        print(f"   {c:<12}{str(df[c].dtype):>9}"
              f"{int(df[c].isna().sum()):>9}{df[c].nunique():>8}   {note}")
```

Run on the naive load:

```text title="Output"
AUDIT — naive read: 12 rows x 6 columns
   duplicate rows:   1   <- investigate
   constant columns: ['Region']   <- no predictive value

   column          dtype  missing  unique   note
   id              int64        0      11
   Country        object        0       3
   Age            object        1      10   LOOKS NUMERIC but is object
   Salary         object        1      10   LOOKS NUMERIC but is object
   Region         object        0       1
   Purchased      object        0       2
```

Four findings from one call:

| Finding | Why it matters |
|---|---|
| **1 duplicate row** | Row `10` appears twice. Duplicates inflate whatever they contain, and if they straddle a train/test split the same record is in both |
| **`Region` is constant** | Every value is `EU`. It cannot possibly help a model — it carries zero information |
| **`Age` looks numeric but isn't** | The `pd.to_numeric(..., errors="coerce")` trick: if most values convert cleanly, the column was meant to be numeric |
| **`id` has 11 unique values in 12 rows** | Consistent with the duplicate; also a column to **drop**, since a row identifier is never a feature |

The `id` column deserves a note of its own. An identifier is often *correlated* with the target
purely because of how the data was ordered or collected, so a model will happily use it and score
well — on data that includes those exact ids, and never again. Drop identifiers before modelling.

### What the audit does not tell you

It flags `Region` as constant, but it cannot tell you that a column is constant *only in this
sample*. It flags negatives, but not that `999999` is a placeholder. It counts duplicates, but not
whether they're a genuine repeat measurement or a join gone wrong. The audit narrows what you have to
think about; it doesn't replace the thinking.

---

## Separating features from target

With a trustworthy table, split it into `X` (the features) and `y` (the target) — the vocabulary from
[Types of Learning](../01-foundations/03-types-of-learning.md#features-and-attributes).

```python
clean = df.drop(columns=["id", "Region"]).drop_duplicates()

X_df = clean.iloc[:, :-1]     # all rows, all columns except the last
y_df = clean.iloc[:, -1]      # all rows, only the last column
```

```text title="Output"
X (11, 3) (2-D)    y (11,) (1-D)
X columns: ['Country', 'Age', 'Salary']
```

Note the order: **audit and clean first, then split.** Dropping the identifier, the constant column
and the duplicate row before splitting means those problems never reach a model.

`iloc[row_selector, column_selector]` selects by **position**. `:` means everything along that axis;
`-1` is the last element as in any Python sequence, so `:-1` is "everything up to but excluding the
last".

| Expression | Selects |
|---|---|
| `iloc[:, :-1]` | all rows, every column but the last — the features |
| `iloc[:, -1]` | all rows, the last column only — the target |
| `iloc[2, 1]` | one cell, by position |

---

## `loc` and `iloc` — two differences, not one

Everyone learns that `iloc` is positional and `loc` is label-based. The **second** difference is the
one that causes bugs:

```python
s = pd.Series([10, 20, 30, 40, 50])
print(list(s.iloc[1:3]))
print(list(s.loc[1:3]))
```

```text title="Output"
[20, 30]
[20, 30, 40]
```

**`iloc` excludes its stop; `loc` includes it.** Same-looking slice, different number of elements.

| | `iloc` | `loc` |
|---|---|---|
| Indexes by | Integer **position** | **Label** |
| Stop value | **Excluded** (like a Python list) | **Included** |
| `[1:3]` gives | 2 items | 3 items |
| Survives sorting/filtering | No — position changes | Yes — label follows the row |

`loc` includes the stop because a label isn't necessarily part of an ordered sequence — pandas can't
know what comes "before" the label `"Salary"`, so excluding it would be meaningless. The
inconsistency is a consequence of the two indexers answering genuinely different questions.

Both agree on `df.iloc[2, 1]` and `df.loc[2, "Age"]` in a freshly loaded DataFrame **only because**
the index is still the default `0, 1, 2, …`. Sort or filter the frame and they diverge immediately:
`loc[0]` still finds the row labelled `0`, wherever it now sits, while `iloc[0]` finds whatever is
now first.

**Rule of thumb:** `iloc` when you mean *the Nth row*; `loc` when you mean *the row named N*. After
any filtering, prefer `loc`, or call `.reset_index(drop=True)` to make position and label agree
again.

---

## NumPy slicing

Once you're in arrays rather than DataFrames, slicing follows NumPy's rules — which come up
constantly in the encoding and scaling steps ahead, where you operate on specific column ranges.

```python
sample = np.array([[10, 20, 30, 40],
                    [50, 60, 70, 80],
                    [90, 100, 110, 120]])
print(sample[:, 1:3])
```

```text title="Output"
[[ 20  30]
 [ 60  70]
 [100 110]]
```

Read `sample[:, 1:3]` in two halves: `:` selects **all rows**; `1:3` selects **columns 1 and 2** —
the stop is excluded, exactly as in a Python list. That expression, *all rows and the numeric feature
columns only*, is precisely the slice the next page hands to `SimpleImputer` so it touches `Age` and
`Salary` without touching `Country`.

One asymmetry worth knowing: an out-of-range **slice** is silently clipped, while an out-of-range
**index** raises.

```python
sample[:, 1:99]     # fine — returns columns 1 to 3
sample[:, 99]       # IndexError
```

---

## Should you convert to NumPy at all?

The conventional line is `X = df.iloc[:, :-1].values`. It works, and it costs you things worth
keeping.

### `.values` versus `.to_numpy()`

Both convert. `.to_numpy()` is the current recommendation — `.values` predates it, has fuzzier
behaviour around extension dtypes, and is effectively legacy. Prefer `.to_numpy()` in new code.

The shape rule is the same either way, and it's where `X` being 2-D and `y` being 1-D originates:

| Converting | Gives | Shape |
|---|---|---|
| A DataFrame (many columns) | 2-D array | `(rows, columns)` |
| A Series (one column) | 1-D array | `(rows,)` |

So `X`, sliced from all-but-one column, is a DataFrame → 2-D. And `y`, sliced from one column, is a
Series → 1-D. **The shape convention every model expects is a consequence of this, decided before
you ever call `.fit`.**

### What conversion costs, measured

**Mixed types collapse to `object`.**

```python
print(X_df.to_numpy().dtype)      # object
```

A single array can hold only one type. `X` mixes `'France'` with `44.0`, so NumPy falls back to
storing generic Python object pointers. That is not just inelegant:

```python
n = 300_000
num = np.arange(n, dtype=float)
obj = num.astype(object)
# time num.sum() vs obj.sum()
```

```text title="Output"
sum of 300,000 floats — float64 array:    0.10 ms
sum of 300,000 floats — object  array:    2.91 ms
object is 28x slower
```

**28× slower** on identical numbers. A `float64` array is one contiguous block that compiled code
walks directly; an `object` array is a block of pointers, each chased to a separate Python object.

**Column names are thrown away.**

```python
kept = StandardScaler().fit(num_df)             # a DataFrame
lost = StandardScaler().fit(num_df.to_numpy())  # an array
```

```text title="Output"
fitted on DataFrame  -> feature_names_in_ = ['Age', 'Salary']
fitted on .to_numpy() -> has feature_names_in_? False
```

Fitted on a DataFrame, scikit-learn records `feature_names_in_`. It then **validates** that anything
you later pass has the same columns in the same order — catching a whole category of bug where
columns get reordered between training and prediction. Convert to NumPy and you lose that check, plus
every error message that would have named the offending column.

### Where `category` dtype wins

For a text column with few distinct values, staying in pandas and using `category` is dramatically
cheaper than either `object` or one array:

```text title="Output"
200,000 rows, 3 distinct values
object   dtype: 12,600,353 bytes
category dtype:    200,429 bytes
reduction:           98.4%
```

**98.4% less memory.** `category` stores each distinct string once and keeps a compact array of
integer codes — which is, not coincidentally, exactly what label encoding does by hand on the next
page but one.

### The recommendation

**Keep DataFrames as long as you can.** Modern scikit-learn accepts them throughout, preserves
feature names, and gives better errors. Convert with `.to_numpy()` only where something genuinely
requires an array, and convert **after** encoding, when the frame is all-numeric and the result won't
be `object`.

The `.values` idiom you'll see in most tutorials isn't wrong — it predates good DataFrame support and
has simply been overtaken.

---

## Common Mistakes

| # | Mistake | Wrong | Right |
|---|---|---|---|
| 1 | Trusting inferred dtypes | Load and proceed | `print(df.dtypes)` every time |
| 2 | Assuming pandas caught all missingness | `isna().sum()` is the truth | `?`, `-1`, `999999` need `na_values=` |
| 3 | Leaving sentinels as data | `-1` averaged into an age | Declare them missing |
| 4 | Reading identifiers as numbers | Postcode `01234` → `1234` | `dtype={"zip": str}` |
| 5 | Keeping an `id` column as a feature | It correlates, so it must help | Drop identifiers |
| 6 | Ignoring duplicate rows | 12 rows means 12 records | `df.duplicated().sum()` |
| 7 | Keeping constant columns | Harmless | Zero information; drop them |
| 8 | Expecting `loc` to exclude its stop | `loc[1:3]` gives 2 items | It gives **3** |
| 9 | Using `iloc` after filtering | Positions shifted | `loc`, or `reset_index(drop=True)` |
| 10 | Converting to NumPy immediately | `.values` on the raw frame | Stay in pandas; convert after encoding |
| 11 | Using `.values` in new code | Legacy | `.to_numpy()` |
| 12 | Reshaping `y` to 2-D | `y.reshape(-1, 1)` | `y` stays 1-D |

---

## Summary

| Task | Code |
|---|---|
| Load a CSV | `pd.read_csv("data.csv")` |
| **Check what you got** | `df.dtypes`, `df.isna().sum()` |
| Declare extra missing markers | `na_values=["?", "-1"]` |
| Keep `"61,000"` numeric | `thousands=","` |
| Force a type | `dtype={"zip": str}` |
| Find duplicates | `df.duplicated().sum()` |
| Find constant columns | `df[c].nunique(dropna=False) <= 1` |
| Features / target | `df.iloc[:, :-1]` / `df.iloc[:, -1]` |
| Convert to array | `.to_numpy()` |

**Key takeaways**

- `read_csv` **infers a type per column and tells you nothing** — print `.dtypes` after every load
- One `?` or one `"61,000"` silently turns a numeric column into `object`, which will not do
  arithmetic
- Pandas treats **19** strings as missing by default; `?`, `-`, `unknown`, `-1` and `999999` are not
  among them
- **Sentinel values are the dangerous case** — `-1` is a valid number to every library, and only
  domain knowledge identifies it as missing
- Declaring `na_values` took the missing count on the sample file from **2 to 5**
- Identifiers that look numeric (postcodes, account numbers) must be read as `str` or lose leading
  zeros irrecoverably
- Audit for **duplicates, constant columns, and columns that look numeric but aren't**, then clean,
  **then** split
- Drop identifier columns — they correlate for reasons that won't generalise
- `iloc` **excludes** its stop; `loc` **includes** it — `[1:3]` gives 2 items versus 3
- `iloc` and `loc` agree only while the index matches row order; after sorting or filtering they
  don't
- `.to_numpy()` supersedes `.values`; many columns → 2-D, one column → 1-D, which is where the
  `X`/`y` shape convention comes from
- Mixed types collapse to `object`, measured **28× slower** than `float64` on identical numbers
- Converting discards column names, and with them scikit-learn's `feature_names_in_` validation
- `category` dtype cut a 200,000-row text column by **98.4%** — and is what label encoding does
  manually
- **Stay in DataFrames**; convert only when required, and only after encoding

**Next in this section:** [Missing Values](./02-missing-values.md) — imputing the `NaN`s this page
has now correctly counted

**See also:** [Types of Learning](../01-foundations/03-types-of-learning.md#features-and-attributes)
for the `X`/`y` vocabulary · [The Toolkit and the Pipeline](../01-foundations/05-toolkit-and-pipeline.md)
for where loading sits in the seven-step pipeline

---

## Run It Yourself

```python title="load_defensively.py"
"""Loading data defensively — what read_csv does silently, and how to catch it."""

import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler

# ---------------- 1. the naive read ----------------
naive = pd.read_csv("messy.csv")
print("1. NAIVE read_csv — dtypes it inferred")
print(naive.dtypes.to_string())
print(f"\n   missing values reported: {int(naive.isna().sum().sum())}")
print("   Age and Salary are 'object' — they will not do arithmetic")

# ---------------- 2. what pandas catches ----------------
print(f"\n2. pandas treats {len(pd._libs.parsers.STR_NA_VALUES)} strings as missing by default")
print("   " + ", ".join(sorted(repr(s) for s in pd._libs.parsers.STR_NA_VALUES)))
print("   note what is NOT in that list: '?', '-', 'missing', 'unknown', -1, 999999")

# ---------------- 3. the audit ----------------
def audit(df, name):
    print(f"\n3. AUDIT — {name}: {df.shape[0]} rows x {df.shape[1]} columns")
    dups = int(df.duplicated().sum())
    print(f"   duplicate rows:   {dups}" + ("   <- investigate" if dups else ""))
    const = [c for c in df.columns if df[c].nunique(dropna=False) <= 1]
    print(f"   constant columns: {const if const else 'none'}"
          + ("   <- no predictive value" if const else ""))
    print(f"\n   {'column':<12}{'dtype':>9}{'missing':>9}{'unique':>8}   {'note':<28}")
    for c in df.columns:
        note = ""
        if df[c].dtype == object:
            coerced = pd.to_numeric(df[c], errors="coerce")
            if coerced.notna().sum() > 0.5 * df[c].notna().sum():
                note = "LOOKS NUMERIC but is object"
        elif int((df[c] < 0).sum()):
            note = f"{int((df[c] < 0).sum())} negative value(s)"
        print(f"   {c:<12}{str(df[c].dtype):>9}{int(df[c].isna().sum()):>9}"
              f"{df[c].nunique():>8}   {note:<28}")

audit(naive, "naive read")

# ---------------- 4. the corrected read ----------------
df = pd.read_csv("messy.csv",
                 na_values=["?", "-1", "999999"],   # domain knowledge, not automatic
                 thousands=",")
audit(df, "corrected read")

# ---------------- 5. loc vs iloc ----------------
print("\n5. loc IS INCLUSIVE, iloc IS EXCLUSIVE — the asymmetry that bites")
s = pd.Series([10, 20, 30, 40, 50])
print(f"   s.iloc[1:3] -> {list(s.iloc[1:3])}      2 items, stop EXCLUDED")
print(f"   s.loc[1:3]  -> {list(s.loc[1:3])}  3 items, stop INCLUDED")

# ---------------- 6. splitting X and y ----------------
clean = df.drop(columns=["id", "Region"]).drop_duplicates()
X_df = clean.iloc[:, :-1]
y_df = clean.iloc[:, -1]
print(f"\n6. SPLIT — after dropping id, constant column, and the duplicate row")
print(f"   X {X_df.shape} (2-D)    y {y_df.shape} (1-D)")
print(f"   X columns: {list(X_df.columns)}")

# ---------------- 7. should you convert to NumPy at all? ----------------
num = X_df[["Age", "Salary"]].fillna(0)
kept = StandardScaler().fit(num)
lost = StandardScaler().fit(num.to_numpy())
print("\n7. CONVERTING TO NumPy THROWS AWAY THE COLUMN NAMES")
print(f"   fitted on DataFrame -> feature_names_in_ = {list(kept.feature_names_in_)}")
print(f"   fitted on .to_numpy() -> has feature_names_in_? {hasattr(lost, 'feature_names_in_')}")
print(f"   X_df.to_numpy().dtype = {X_df.to_numpy().dtype}  <- mixed types collapse to object")
```

```text title="messy.csv"
id,Country,Age,Salary,Region,Purchased
1,France,44,72000,EU,No
2,Spain,27,48000,EU,Yes
3,Germany,30,54000,EU,No
4,Spain,38,"61,000",EU,No
5,Germany,40,,EU,Yes
6,France,35,58000,EU,Yes
7,Spain,N/A,52000,EU,No
8,France,48,79000,EU,Yes
9,Germany,-1,83000,EU,No
10,France,37,67000,EU,Yes
11,France,?,999999,EU,No
10,France,37,67000,EU,Yes
```

```text title="Output"
1. NAIVE read_csv — dtypes it inferred
id            int64
Country      object
Age          object
Salary       object
Region       object
Purchased    object

   missing values reported: 2
   Age and Salary are 'object' — they will not do arithmetic

2. pandas treats 19 strings as missing by default
   '#N/A N/A', '#N/A', '#NA', '', '-1.#IND', '-1.#QNAN', '-NaN', '-nan', '1.#IND', '1.#QNAN', '<NA>', 'N/A', 'NA', 'NULL', 'NaN', 'None', 'n/a', 'nan', 'null'
   note what is NOT in that list: '?', '-', 'missing', 'unknown', -1, 999999

3. AUDIT — naive read: 12 rows x 6 columns
   duplicate rows:   1   <- investigate
   constant columns: ['Region']   <- no predictive value

   column          dtype  missing  unique   note
   id              int64        0      11
   Country        object        0       3
   Age            object        1      10   LOOKS NUMERIC but is object
   Salary         object        1      10   LOOKS NUMERIC but is object
   Region         object        0       1
   Purchased      object        0       2

3. AUDIT — corrected read: 12 rows x 6 columns
   duplicate rows:   1   <- investigate
   constant columns: ['Region']   <- no predictive value

   column          dtype  missing  unique   note
   id              int64        0      11
   Country        object        0       3
   Age           float64        3       8
   Salary        float64        2       9
   Region         object        0       1
   Purchased      object        0       2

5. loc IS INCLUSIVE, iloc IS EXCLUSIVE — the asymmetry that bites
   s.iloc[1:3] -> [20, 30]      2 items, stop EXCLUDED
   s.loc[1:3]  -> [20, 30, 40]  3 items, stop INCLUDED

6. SPLIT — after dropping id, constant column, and the duplicate row
   X (11, 3) (2-D)    y (11,) (1-D)
   X columns: ['Country', 'Age', 'Salary']

7. CONVERTING TO NumPy THROWS AWAY THE COLUMN NAMES
   fitted on DataFrame -> feature_names_in_ = ['Age', 'Salary']
   fitted on .to_numpy() -> has feature_names_in_? False
   X_df.to_numpy().dtype = object  <- mixed types collapse to object
```

### What to notice in that output

- **The naive read produced two `object` columns that look numeric.** `Age` and `Salary` contain
  digits in almost every row. One `?` and one `"61,000"` were enough. Nothing warned.
- **Missing went from 2 to 5** between the two audits — a 150% increase from declaring three sentinel
  values. The file never changed; the first reading was simply wrong about what counted as absent.
- **The audit flagged `Region` as constant and found the duplicate row**, neither of which any dtype
  check would reveal. Row `10` is present twice; `id` accordingly has 11 unique values in 12 rows.
- **`Age` shows 3 missing after correction, not 1.** The extra two are the `?` (row 11) and the `-1`
  (row 9). That `-1` would otherwise have been averaged into the mean age.
- **`loc[1:3]` returned three elements where `iloc[1:3]` returned two.** Same-looking slice on the
  same data.
- **`X_df.to_numpy().dtype` is `object`** because `Country` sits beside two numeric columns —
  measured at 28× slower than `float64`, and the reason to postpone conversion until after encoding.
- **`feature_names_in_` exists on the DataFrame-fitted scaler and not the array-fitted one.** That
  attribute is what lets scikit-learn detect reordered columns at prediction time.

**Things worth trying:**

1. Remove `thousands=","` and re-run. `Salary` reverts to `object` on the strength of one row.
2. Add `dtype={"id": str}` and check `df["id"].dtype`. Now imagine `id` had leading zeros.
3. Replace `na_values=["?", "-1", "999999"]` with only `["?"]` and re-run the audit. `Age` shows one
   negative value — the audit catches the sentinel you failed to declare.
4. Run `df.duplicated(keep=False)` to see **both** copies of the duplicate rather than just the
   second.
5. Compare `pd.to_numeric(naive["Age"], errors="raise")` against `errors="coerce"` to see the two
   ways of handling a column that won't fully convert.

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

### What loading decides for you

**L1. [THEORY]** Every value in a CSV file is text. Explain what `pd.read_csv` does about that, and
what it tells you about the decisions it made.

**L2. [ANALYZE]** A column of 10,000 ages contains one `?`. State the resulting dtype, and explain
what happens when you later try to compute the mean.

**L3. [THEORY]** Pandas recognises 19 strings as missing by default. Name five, and name four common
representations of missingness that are **not** on the list.

**L4. [THEORY]** What is a sentinel value? Give two examples, and explain why no library can detect
them automatically.

**L5. [ANALYZE]** A postcode column contains `01234`. Explain what `read_csv` will do to it by
default, why the damage is irreversible, and the test you should apply to decide a column's type.

### Auditing

**A1. [THEORY]** Name four things a pre-flight audit should check, and say what each would catch.

**A2. [THEORY]** Explain the `pd.to_numeric(col, errors="coerce")` trick for detecting columns that
should be numeric but aren't.

**A3. [ANALYZE]** Why should an `id` column be dropped before modelling, even when it correlates
strongly with the target?

**A4. [ANALYZE]** A constant column is described as having "no predictive value". Explain why, and
say whether it is harmful or merely useless.

**A5. [ANALYZE]** Give two reasons duplicate rows matter, one of which concerns the train/test split.

### `loc`, `iloc` and slicing

**I1. [OUT]** For `s = pd.Series([10, 20, 30, 40, 50])`, give the output of `s.iloc[1:3]` and
`s.loc[1:3]`, and explain why they differ.

**I2. [THEORY]** State the **two** differences between `loc` and `iloc`.

**I3. [ANALYZE]** Explain why it is reasonable for `loc` to include its stop value while `iloc`
excludes it.

**I4. [THEORY]** After `df = df.sort_values("Age")`, which of `loc` and `iloc` still refers to the
same row as before? What would make them agree again?

**I5. [OUT]** For a 4-column array, what do `sample[:, 1:99]` and `sample[:, 99]` each do?

### Converting to NumPy

**N1. [THEORY]** Explain why `X` comes out 2-D and `y` comes out 1-D, in terms of DataFrames and
Series.

**N2. [THEORY]** Why should `.to_numpy()` be preferred over `.values` in new code?

**N3. [OUT]** Summing 300,000 floats took `0.10 ms` as `float64` and `2.91 ms` as `object`. Explain
the ratio in terms of how each is stored in memory.

**N4. [OUT]** A `StandardScaler` fitted on a DataFrame has `feature_names_in_`; one fitted on an
array does not. Name a concrete bug the first can catch and the second cannot.

**N5. [OUT]** A 200,000-row text column with 3 distinct values took `12,600,353` bytes as `object`
and `200,429` as `category`. Explain the 98.4% reduction, and name the encoding technique this
resembles.

**N6. [ANALYZE]** Most tutorials write `X = df.iloc[:, :-1].values` as the very next line after
loading. Give three things this costs, and state when conversion *should* happen.

### Applying it

**P1. [PROG]** Load `messy.csv` so that `?`, `-1` and `999999` are missing and `"61,000"` parses as a
number. Print dtypes and the total missing count.

**P2. [PROG]** Write a function that returns the list of columns whose dtype is `object` but where
more than half the non-null values convert cleanly with `pd.to_numeric`.

**P3. [PROG]** Print every duplicated row in `messy.csv`, including the first occurrence.

**P4. [PROG]** Load `messy.csv` reading only `Country`, `Age` and `Purchased`, with `Country` as a
`category` dtype. Print the memory used by each column.

**P5. [ANALYZE]** You receive a 2 GB CSV that will not fit in memory. Name three `read_csv`
parameters that help and explain what each does.

### Quick self-check

1. What should you print immediately after every `read_csv`?
2. How many strings does pandas treat as missing by default? Is `?` one of them?
3. What is a sentinel value, and why can't a library find them for you?
4. Why must a postcode column be read as `str`?
5. Name three things a pre-flight audit checks.
6. Why drop an `id` column even when it predicts well?
7. What are the two differences between `loc` and `iloc`?
8. How many elements does `loc[1:3]` return? `iloc[1:3]`?
9. Why does `X` end up 2-D and `y` 1-D?
10. Why is an `object` array so much slower than a `float64` one?
11. What does converting to NumPy cost you that staying in pandas doesn't?
12. When is the right moment to convert to an array?
