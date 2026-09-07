---
sidebar_position: 4
title: Cleaning Data
description: Filling and dropping missing values, removing duplicates, and converting types back after the fix.
tags: [python, pandas]
toc_max_heading_level: 3
---

# Cleaning Data

> **Topic —** Fixing the three problems in `students.csv`: a missing Age, a missing Marks, and
> a duplicated row.

Real data is dirty. This page works through one small file end to end, so you can see each
step's effect.

---

## The raw data

```python
import pandas as pd

df = pd.read_csv("students.csv")
print(df)
```

```text title="Output"
     Name Department   Age  Marks
0    Arun        CSE  20.0   85.0
1    Bala         IT  21.0   72.0
2  Charan        CSE   NaN   91.0
3   Divya        ECE  22.0   65.0
4    Esha        CSE  21.0    NaN
5    Bala         IT  21.0   72.0
```

Three problems:

1. Row 2 — **Charan has no Age** (`NaN`)
2. Row 4 — **Esha has no Marks** (`NaN`)
3. Row 5 — **an exact duplicate of row 1** (Bala)

---

## Step 1 — find the missing values

```python
print(df.isnull().sum())
```

```text title="Output"
Name          0
Department    0
Age           1
Marks         1
dtype: int64
```

One gap in `Age`, one in `Marks`. Text columns are complete. See
[Inspecting Data](./03-inspecting-data.md#counting-missing-values) for how this works.

---

## Step 2 — decide what to do about them

There are only two options — **fill** or **drop** — and the choice is a judgement call, not a
technicality.

### Filling

```python
df["Age"] = df["Age"].fillna(df["Age"].mean())
df["Marks"] = df["Marks"].fillna(df["Marks"].median())
print(df)
```

```text title="Output"
     Name Department   Age  Marks
0    Arun        CSE  20.0   85.0
1    Bala         IT  21.0   72.0
2  Charan        CSE  21.0   91.0
3   Divya        ECE  22.0   65.0
4    Esha        CSE  21.0   72.0
5    Bala         IT  21.0   72.0
```

Charan's Age became `21.0` and Esha's Marks became `72.0`. The values used:

```python
print(df["Age"].mean())      # → 21.0
print(df["Marks"].median())  # → 72.0
print(df["Marks"].mean())    # → 77.0
```

```text title="Output"
21.0
72.0
77.0
```

:::note Why mean for Age but median for Marks?

Both are valid; the difference is **outlier sensitivity**. The mean is pulled by extreme
values, the median isn't. Ages cluster tightly, so the mean is safe. Marks spread from 65 to
91, so the median is the more conservative guess.

Note the numbers differ: median `72.0` vs mean `77.0` — a 5-mark difference for the same
column. The choice changes your data.

:::

:::warning `fillna` computes from the values that are present

`df["Age"].mean()` is the mean of the **five** non-missing ages, and `.mean()` skips `NaN`
automatically — unlike NumPy, where you'd need
[`nanmean`](../04-numpy/04-aggregations-and-statistics.md#handling-nan). Convenient, but it
means you're filling a gap using data that has a gap in it. With a lot of missing values, this
flattens the variance and makes the column look more consistent than it is.

:::

### Other fill strategies

```python
print(df.fillna(0))       # a constant
print(df.ffill())         # carry the previous value forward
```

Using the raw data again:

```text title="fillna(0)"
     Name Department   Age  Marks
0    Arun        CSE  20.0   85.0
1    Bala         IT  21.0   72.0
2  Charan        CSE   0.0   91.0
3   Divya        ECE  22.0   65.0
4    Esha        CSE  21.0    0.0
5    Bala         IT  21.0   72.0
```

```text title="ffill()"
     Name Department   Age  Marks
0    Arun        CSE  20.0   85.0
1    Bala         IT  21.0   72.0
2  Charan        CSE  21.0   91.0
3   Divya        ECE  22.0   65.0
4    Esha        CSE  21.0   65.0
5    Bala         IT  21.0   72.0
```

:::danger `fillna(0)` is usually wrong for measurements

An Age of `0` and Marks of `0` are not "missing" — they're **false data**, and they'll drag
every average down. Charan didn't score zero; we don't know what he scored. Only use `0` when
zero is genuinely the right value (a count of events that didn't happen, say).

`ffill()` gave Esha `65.0` — Divya's marks. That makes sense for time series, where the last
known reading is a reasonable estimate. It makes no sense here: Esha's marks have nothing to do
with the student listed above her.

:::

### Dropping instead

```python
print(df.dropna())
```

```text title="Output"
    Name Department   Age  Marks
0   Arun        CSE  20.0   85.0
1   Bala         IT  21.0   72.0
3  Divya        ECE  22.0   65.0
5   Bala         IT  21.0   72.0
```

`dropna()` removes **any row with any missing value** — both Charan and Esha are gone, taking
their perfectly good other columns with them. Six rows became four; a third of the data lost
to two missing cells.

Target one column instead:

```python
print(df.dropna(subset=["Marks"]))
```

```text title="Output"
     Name Department   Age  Marks
0    Arun        CSE  20.0   85.0
1    Bala         IT  21.0   72.0
2  Charan        CSE   NaN   91.0
3   Divya        ECE  22.0   65.0
5    Bala         IT  21.0   72.0
```

Charan survives — his `Age` is still `NaN`, but his `Marks` are known, which is all this
analysis needed.

| Approach | Use when |
|---|---|
| `fillna(mean/median)` | few gaps, and you need every row |
| `fillna(0)` | zero is the genuinely correct value |
| `ffill()` | ordered data where the previous value is a fair estimate |
| `dropna()` | plenty of data, and gaps are rare |
| `dropna(subset=[...])` | only one column actually matters |

**Rule of thumb:** dropping loses information; filling invents it. Neither is free. Pick
deliberately and write down which you chose.

---

## Step 3 — remove duplicates

Find them first:

```python
print(df.duplicated())
print(df.duplicated().sum())
```

```text title="Output"
0    False
1    False
2    False
3    False
4    False
5     True
dtype: bool
1
```

`duplicated()` marks a row `True` if an **identical row appeared earlier**. Row 5 matches row 1,
so row 5 is flagged and row 1 isn't — the first occurrence is kept.

```python
df = df.drop_duplicates()
print(df)
```

```text title="Output"
     Name Department   Age  Marks
0    Arun        CSE  20.0   85.0
1    Bala         IT  21.0   72.0
2  Charan        CSE  21.0   91.0
3   Divya        ECE  22.0   65.0
4    Esha        CSE  21.0   72.0
```

Five rows. Note the index is still `0`–`4` here only by luck — the dropped row happened to be
last. With `keep="last"` you see what usually happens:

```python
print(pd.read_csv("students.csv").drop_duplicates(keep="last"))
```

```text title="Output"
     Name Department   Age  Marks
0    Arun        CSE  20.0   85.0
2  Charan        CSE   NaN   91.0
3   Divya        ECE  22.0   65.0
4    Esha        CSE  21.0    NaN
5    Bala         IT  21.0   72.0
```

Index `1` is **gone** — the labels have a hole in them.

:::tip Add `.reset_index(drop=True)` after dropping rows

```python
df = pd.read_csv("students.csv").drop_duplicates().reset_index(drop=True)
```

Otherwise `.iloc[1]` and `.loc[1]` stop agreeing, which is a confusing bug to chase. The
`drop=True` discards the old labels instead of keeping them as a new column.

:::

### Duplicates on a subset

An exact-match duplicate is rare in real data. More often one *key* repeats:

```python
print(pd.read_csv("students.csv").drop_duplicates(subset=["Name"]))
```

```text title="Output"
     Name Department   Age  Marks
0    Arun        CSE  20.0   85.0
1    Bala         IT  21.0   72.0
2  Charan        CSE   NaN   91.0
3   Divya        ECE  22.0   65.0
4    Esha        CSE  21.0    NaN
```

"One row per student name", regardless of whether the other columns match.

| Argument | Effect |
|---|---|
| `subset=["Name"]` | consider only these columns when comparing |
| `keep="first"` | keep the first occurrence (**default**) |
| `keep="last"` | keep the last |
| `keep=False` | drop **every** copy, including the first |

---

## Step 4 — fix the types

`Age` is still `float64`, because `NaN` forced it there when the file was read:

```python
df["Age"] = df["Age"].astype(int)
print(df)
print(df.dtypes)
```

```text title="Output"
     Name Department  Age  Marks
0    Arun        CSE   20   85.0
1    Bala         IT   21   72.0
2  Charan        CSE   21   91.0
3   Divya        ECE   22   65.0
4    Esha        CSE   21   72.0
Name           object
Department     object
Age             int64
Marks         float64
dtype: object
```

`20.0` reads as `20` now. `Marks` was left as `float64` — marks can legitimately be fractional,
so there's no reason to force it.

:::danger Order matters — this only works after filling

Try converting before the `NaN` is dealt with:

```python
pd.read_csv("students.csv")["Age"].astype(int)
```

```text title="Error"
IntCastingNaNError: Cannot convert non-finite values (NA or inf) to integer
```

There's no integer that represents "missing", so the conversion is impossible. **Fill or drop
first, convert second** — that's why `astype` is the last step of the pipeline, not the first.

:::

Also remember `.astype(int)` **truncates** rather than rounds, as it does in
[NumPy](../04-numpy/01-arrays-and-attributes.md#setting-and-converting) and plain
[Python](../01-basics/01-values-and-types.md#type-conversion-casting). Here every value is
already whole, so it's safe — but a mean-filled age of `21.4` would silently become `21`. Use
`.round().astype(int)` when that matters.

---

## The whole pipeline

```python
import pandas as pd

df = pd.read_csv("students.csv")

print("Missing Values:")
print(df.isnull().sum())

df["Age"] = df["Age"].fillna(df["Age"].mean())
df["Marks"] = df["Marks"].fillna(df["Marks"].median())
df = df.drop_duplicates()
df["Age"] = df["Age"].astype(int)

print("\nCleaned Data:")
print(df)
```

```text title="Output"
Missing Values:
Name          0
Department    0
Age           1
Marks         1
dtype: int64

Cleaned Data:
     Name Department  Age  Marks
0    Arun        CSE   20   85.0
1    Bala         IT   21   72.0
2  Charan        CSE   21   91.0
3   Divya        ECE   22   65.0
4    Esha        CSE   21   72.0
```

The order is deliberate: **inspect → fill → deduplicate → convert**. Each step depends on the
one before.

:::note One consequence worth noticing

The duplicate Bala row was still present when the mean and median were computed, so it got a
vote — twice. Deduplicating *before* filling would give slightly different fill values. Neither
order is wrong, but they don't produce identical results, and it's worth knowing which you did.

:::

### Assign the result back

Most cleaning methods **return a new DataFrame** and leave the original alone:

```python
df.drop_duplicates()        # computes and throws away the result
df = df.drop_duplicates()   # keeps it
```

This catches everybody once. `dropna`, `fillna`, `drop_duplicates`, `rename`, `astype`,
`reset_index` and `sort_values` all behave this way — the same
[`sorted()` vs `.sort()`](../03-collections/02-lists.md#sort-vs-sorted) distinction from lists.

---

## Other cleaning operations

```python
df = df.rename(columns={"Marks": "Score"})
print(df.columns.tolist())   # → ['Name', 'Department', 'Age', 'Score']
```

```text title="Output"
['Name', 'Department', 'Age', 'Score']
```

| Task | Call |
|---|---|
| Rename columns | `df.rename(columns={"old": "new"})` |
| Strip whitespace from text | `df["c"] = df["c"].str.strip()` |
| Normalise case | `df["c"].str.lower()` |
| Replace values | `df["c"].replace("N/A", pd.NA)` |
| Drop a column | `df.drop(columns=["c"])` |
| Clip to a range | `df["c"].clip(0, 100)` |

`.str` is the accessor for string methods on a column — `df["Name"].str.upper()` applies
[`upper()`](../03-collections/01-strings-and-slicing.md#common-string-methods) to every value.
Leading and trailing spaces in text columns are a classic hidden problem: `"CSE "` and `"CSE"`
group separately and look identical when printed.

---

## Common Mistakes

| # | Mistake | Wrong | Right |
|---|---|---|---|
| 1 | Not assigning the result | `df.dropna()` alone | `df = df.dropna()` |
| 2 | `astype(int)` before filling | `IntCastingNaNError` | fill first |
| 3 | `fillna(0)` on measurements | invents false data | mean, median, or drop |
| 4 | `dropna()` for one bad column | loses whole rows | `dropna(subset=["col"])` |
| 5 | Forgetting `reset_index` | `.loc` and `.iloc` diverge | `.reset_index(drop=True)` |
| 6 | `reset_index()` without `drop=True` | old index becomes a column | pass `drop=True` |
| 7 | Assuming `drop_duplicates` needs exact matches | it does, by default | `subset=[...]` for key columns |
| 8 | Not checking for stray whitespace | `"CSE "` ≠ `"CSE"` | `.str.strip()` |

---

## Summary

| Task | Call |
|---|---|
| Count missing | `df.isnull().sum()` |
| Fill with a statistic | `df["c"].fillna(df["c"].mean())` |
| Fill with a constant | `df.fillna(0)` |
| Carry forward | `df.ffill()` |
| Drop rows with gaps | `df.dropna()` |
| Drop on one column | `df.dropna(subset=["c"])` |
| Flag duplicates | `df.duplicated()` |
| Remove duplicates | `df.drop_duplicates()` |
| Duplicates by key | `df.drop_duplicates(subset=["c"])` |
| Renumber the index | `df.reset_index(drop=True)` |
| Convert a type | `df["c"].astype(int)` |
| Rename | `df.rename(columns={...})` |

**Key takeaways**

- Order matters: **inspect → fill → deduplicate → convert**
- Every one of these returns a new DataFrame — **assign the result back**
- Filling invents data; dropping loses it. Neither is free — choose deliberately
- `fillna(0)` on a measurement creates false zeros that skew every average
- Mean vs median gave a 5-mark difference on the same column
- `dropna()` drops the whole row; `subset=` limits it to the column you care about
- `drop_duplicates` keeps the first occurrence and leaves **gaps in the index** — reset it
- `.astype(int)` fails on `NaN` (`IntCastingNaNError`) and truncates rather than rounds

**See also:** [Inspecting Data](./03-inspecting-data.md) for finding these problems ·
[Selecting and Transforming](./05-selecting-and-transforming.md) for working with clean data ·
[Loading and Saving Data](./02-loading-and-saving.md) for why `Age` arrived as a float

---

## Run It Yourself

```python title="pandas_clean.py"
import pandas as pd

df = pd.read_csv("students.csv")

print("=== BEFORE ===")
print(df)
print(f"\nrows: {len(df)}")
print(f"missing:\n{df.isnull().sum()}")
print(f"duplicates: {df.duplicated().sum()}")
print(f"Age dtype: {df['Age'].dtype}")

# fill -> deduplicate -> convert
df["Age"] = df["Age"].fillna(df["Age"].mean())
df["Marks"] = df["Marks"].fillna(df["Marks"].median())
df = df.drop_duplicates().reset_index(drop=True)
df["Age"] = df["Age"].astype(int)

print("\n=== AFTER ===")
print(df)
print(f"\nrows: {len(df)}")
print(f"missing: {df.isnull().sum().sum()}")
print(f"duplicates: {df.duplicated().sum()}")
print(f"Age dtype: {df['Age'].dtype}")
```

```text title="Output"
=== BEFORE ===
     Name Department   Age  Marks
0    Arun        CSE  20.0   85.0
1    Bala         IT  21.0   72.0
2  Charan        CSE   NaN   91.0
3   Divya        ECE  22.0   65.0
4    Esha        CSE  21.0    NaN
5    Bala         IT  21.0   72.0

rows: 6
missing:
Name          0
Department    0
Age           1
Marks         1
dtype: int64
duplicates: 1
Age dtype: float64

=== AFTER ===
     Name Department  Age  Marks
0    Arun        CSE   20   85.0
1    Bala         IT   21   72.0
2  Charan        CSE   21   91.0
3   Divya        ECE   22   65.0
4    Esha        CSE   21   72.0

rows: 5
missing: 0
duplicates: 0
Age dtype: int64
```

---

## Practice Questions

*From the Unit 2 question bank. Tags and marks are explained on the
[Python index](../index.md#practice-questions).*

### Unit 2 § C — Data Cleaning

**C1. [PROG]** For `students.csv`: fill the missing **Age** with the column **mean**, fill the
missing **Marks** with the column **median**, remove duplicate rows, and convert **Age** to
integer. Print the result. `[6]`

**C2. [OUT]** Give the exact cleaned DataFrame produced by C1 — all rows, all values. `[6]`

*Hint: the Age mean is `21.0` and the Marks median is `72.0`. Say which row Bala's duplicate
removal deletes, and what the final shape is.*

**C3. [THEORY]** Why fill Age with the **mean** but Marks with the **median**? When is the median
the safer choice? `[3]`

**C4. [OUT]** One of these two blocks changes `df`. Which, and why? `[4]`

```python
# Block A
df["Age"].fillna(df["Age"].mean())
print(df["Age"].isnull().sum())

# Block B
df["Age"] = df["Age"].fillna(df["Age"].mean())
print(df["Age"].isnull().sum())
```

**C5. [THEORY]** What is the difference between `dropna()` and `fillna()`? When would dropping
rows be the wrong choice? `[3]`

**C6. [PROG]** Write three ways to drop the `Email` column from a DataFrame. `[3]`

**C7. [OUT]** `[3]`

```python
df = pd.read_csv("students.csv")
print(df.shape)
df = df.drop_duplicates()
print(df.shape)
```

*Which row was removed, and how did pandas decide it was a duplicate?*

**C8. [THEORY]** `df["Age"].astype(int)` fails if Age still contains `NaN`. What is the error, and
what must you do first? `[3]`

**C9. [PROG]** Write a program that reports, for every column: the count of missing values **and**
the percentage of the column that is missing. `[4]`

**C10. [THEORY]** Name four distinct data-cleaning tasks and say why each matters before
analysis. `[4]`

### Viva

1. What does `fillna()` return — and why must you assign it back?
