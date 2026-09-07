---
sidebar_position: 3
title: Exploratory Data Analysis
description: The EDA workflow — inspect, check for gaps, describe, count categories, group, and correlate.
tags: [python, pandas, statistics]
toc_max_heading_level: 3
---

# Exploratory Data Analysis

> **Topic —** EDA is the stage between loading data and doing anything with it: finding out what
> you actually have, before you assume anything.

Nothing here is new — it's [inspecting](../05-pandas/03-inspecting-data.md),
[describing](./01-descriptive-statistics.md), [grouping](../05-pandas/05-selecting-and-transforming.md#groupby)
and [correlating](./02-correlation-and-covariance.md) applied in a deliberate order. The value
is in the sequence.

---

## The dataset

```python
import pandas as pd

data = {
    "Name": ["Arun", "Bala", "Charan", "Divya", "Esha",
             "Farah", "Gokul", "Hari", "Indhu", "Jaya"],
    "Age": [20, 21, 22, 20, 21, 23, 22, 20, 21, 22],
    "Department": ["CSE", "IT", "CSE", "ECE", "CSE", "IT", "ECE", "CSE", "IT", "ECE"],
    "Marks": [85, 72, 91, 65, 88, 76, 80, 95, 70, 82],
    "Attendance": [90, 75, 95, 70, 88, 80, 85, 98, 72, 89],
}
df = pd.DataFrame(data)
print(df)
```

```text title="Output"
     Name  Age Department  Marks  Attendance
0    Arun   20        CSE     85          90
1    Bala   21         IT     72          75
2  Charan   22        CSE     91          95
3   Divya   20        ECE     65          70
4    Esha   21        CSE     88          88
5   Farah   23         IT     76          80
6   Gokul   22        ECE     80          85
7    Hari   20        CSE     95          98
8   Indhu   21         IT     70          72
9    Jaya   22        ECE     82          89
```

Ten students, one categorical column and three numeric ones.

---

## Step 1 — structure

```python
print(df.shape)
print(df.dtypes)
```

```text title="Output"
(10, 5)
Name          object
Age            int64
Department    object
Marks          int64
Attendance     int64
dtype: object
```

Ten rows, five columns. Two `object` (text) columns, three `int64`. That already tells you which
columns can be described statistically and which need counting instead.

`df.head()` and `df.tail()` come next — see
[Inspecting Data](../05-pandas/03-inspecting-data.md#head-and-tail).

```python
df.info()
```

```text title="Output"
<class 'pandas.core.frame.DataFrame'>
RangeIndex: 10 entries, 0 to 9
Data columns (total 5 columns):
 #   Column      Non-Null Count  Dtype 
---  ------      --------------  ----- 
 0   Name        10 non-null     object
 1   Age         10 non-null     int64 
 2   Department  10 non-null     object
 3   Marks       10 non-null     int64 
 4   Attendance  10 non-null     int64 
dtypes: int64(3), object(2)
memory usage: 532.0+ bytes
```

`10 entries` and every column `10 non-null` — nothing is missing.

---

## Step 2 — missing values

```python
print(df.isnull().sum())
```

```text title="Output"
Name          0
Age           0
Department    0
Marks         0
Attendance    0
dtype: int64
```

All zeros. Worth running explicitly even after `info()`, because on a wide DataFrame `info()`
truncates and this doesn't.

This dataset is clean. Real ones usually aren't — see
[Cleaning Data](../05-pandas/04-cleaning-data.md).

---

## Step 3 — describe the numbers

```python
print(df.describe())
```

```text title="Output"
             Age      Marks  Attendance
count  10.000000  10.000000   10.000000
mean   21.200000  80.400000   84.200000
std     1.032796   9.674709    9.612492
min    20.000000  65.000000   70.000000
25%    20.250000  73.000000   76.250000
50%    21.000000  81.000000   86.500000
75%    22.000000  87.250000   89.750000
max    23.000000  95.000000   98.000000
```

Read this for **plausibility** before anything else:

- Ages 20–23 — sensible for one year group
- Marks 65–95, attendance 70–98 — both inside 0–100, so no impossible values
- `count` is 10 everywhere, matching `len(df)` — confirms nothing missing
- `Age` has `std` of `1.03` against `Marks` at `9.67` — age barely varies, marks do

That last observation is a prediction: **a variable that doesn't vary can't explain one that
does.** Step 6 confirms it.

Mean and median (`50%`) are close for all three columns — `80.4` vs `81.0` for marks — so no
strong skew. See [Descriptive Statistics](./01-descriptive-statistics.md#mean-vs-median--why-both-exist).

---

## Step 4 — count the categories

`describe()` skipped `Department` because it's text. Categorical columns need frequencies:

```python
print(df["Department"].value_counts())
```

```text title="Output"
Department
CSE    4
IT     3
ECE    3
Name: count, dtype: int64
```

Four CSE, three each for IT and ECE. Reasonably balanced — which matters, because a group of
one or two makes any per-group statistic unreliable.

---

## Step 5 — group and compare

```python
print(df.groupby("Department")["Marks"].mean())
```

```text title="Output"
Department
CSE    89.750000
ECE    75.666667
IT     72.666667
Name: Marks, dtype: float64
```

A real difference: CSE averages `89.75`, IT `72.67` — a 17-mark gap.

Always pull the supporting numbers before believing a group mean:

```python
print(df.groupby("Department")["Marks"].agg(["mean", "min", "max", "count"]))
```

```text title="Output"
                 mean  min  max  count
Department                            
CSE         89.750000   85   95      4
ECE         75.666667   65   82      3
IT          72.666667   70   76      3
```

Now it's interpretable. **CSE's range (85–95) doesn't overlap IT's (70–76) at all** — every CSE
student outscored every IT student. That's a much stronger statement than the means alone, and
it's only visible with `min` and `max`.

The `count` column is the honesty check: these are groups of 4, 3 and 3. A 17-mark gap between
groups this small could still be chance.

Several columns at once:

```python
print(df.groupby("Department")[["Marks", "Attendance", "Age"]].mean())
```

```text title="Output"
                Marks  Attendance        Age
Department                                  
CSE         89.750000   92.750000  20.750000
ECE         75.666667   81.333333  21.333333
IT          72.666667   75.666667  21.666667
```

The Marks and Attendance columns move together across all three departments — CSE highest in
both, IT lowest in both. Age runs the other way and barely moves.

---

## Step 6 — correlate

```python
numeric_data = df[["Age", "Marks", "Attendance"]]
print(numeric_data.corr())
```

```text title="Output"
                 Age     Marks  Attendance
Age         1.000000 -0.008896    0.029099
Marks      -0.008896  1.000000    0.979949
Attendance  0.029099  0.979949    1.000000
```

Two findings, and both are useful:

- **`Marks` and `Attendance`: `0.98`** — very strong positive. Students who attend score higher.
- **`Age` and `Marks`: `−0.0089`** — essentially **zero**. Age tells you nothing about marks.

The near-zero was predictable from step 3: `Age` has a standard deviation of `1.03` across a
20–23 range. There isn't enough variation for it to explain anything.

:::note A zero correlation is a finding

Knowing `Age` is irrelevant means you can drop it from a model and stop wondering about it.
Ruling variables out is as valuable as ruling them in.

:::

And the usual caution: `0.98` between marks and attendance does **not** establish that
attending causes higher marks. Motivation could drive both. See
[Correlation and Covariance](./02-correlation-and-covariance.md#correlation-is-not-causation).

```python
print(numeric_data.cov())
```

```text title="Output"
                 Age      Marks  Attendance
Age         1.066667  -0.088889    0.288889
Marks      -0.088889  93.600000   91.133333
Attendance  0.288889  91.133333   92.400000
```

The covariance matrix, for completeness. Note the diagonal — `1.07`, `93.6`, `92.4` — is the
variance of each column, and confirms numerically that `Age` barely varies while the other two
vary about 90× more.

---

## Going further

Three techniques worth knowing that your source scripts don't cover.

### Binning a continuous column

`pd.cut` turns numbers into categories, which makes distributions countable:

```python
df["Band"] = pd.cut(df["Marks"], bins=[0, 70, 80, 90, 100],
                    labels=["<=70", "71-80", "81-90", "91+"])
print(df[["Name", "Marks", "Band"]])
print(df["Band"].value_counts().sort_index())
```

```text title="Output"
     Name  Marks   Band
0    Arun     85  81-90
1    Bala     72  71-80
2  Charan     91    91+
3   Divya     65   <=70
4    Esha     88  81-90
5   Farah     76  71-80
6   Gokul     80  71-80
7    Hari     95    91+
8   Indhu     70   <=70
9    Jaya     82  81-90
Band
<=70     2
71-80    3
81-90    3
91+      2
Name: count, dtype: int64
```

A fairly even spread across bands. `.sort_index()` matters — `value_counts()` sorts by frequency
by default, which scrambles ordered bands.

### Cross-tabulation

Two categorical columns against each other:

```python
print(pd.crosstab(df["Department"], df["Band"]))
```

```text title="Output"
Band        <=70  71-80  81-90  91+
Department                         
CSE            0      0      2    2
ECE            1      1      1    0
IT             1      2      0    0
```

This is the clearest view of the department difference yet. **CSE appears only in the top two
bands; IT only in the bottom two.** No overlap at all — the same finding as the min/max ranges,
laid out as a grid.

### Top and bottom

```python
print(df.nlargest(3, "Marks")[["Name", "Marks"]])
print(df.nsmallest(3, "Marks")[["Name", "Marks"]])
```

```text title="Output"
     Name  Marks
7    Hari     95
2  Charan     91
4    Esha     88
    Name  Marks
3  Divya     65
8  Indhu     70
1   Bala     72
```

`nlargest`/`nsmallest` are shorter than `sort_values().head()` and say what you mean.

---

## The EDA checklist

```python
# 1. structure
df.shape
df.head()
df.tail()
df.dtypes
df.info()

# 2. completeness
df.isnull().sum()

# 3. numeric distributions
df.describe()

# 4. categorical frequencies
df["cat"].value_counts()

# 5. group comparisons
df.groupby("cat")["num"].agg(["mean", "min", "max", "count"])

# 6. relationships
df.corr(numeric_only=True)
```

What each step is really asking:

| Step | Question | Red flag |
|---|---|---|
| 1 | What have I got? | numeric column typed `object` |
| 2 | What's missing? | `count` below `len(df)` |
| 3 | Are the values plausible? | impossible min/max, mean far from median |
| 4 | Are categories balanced? | a group of 1 or 2 |
| 5 | Do groups differ? | difference smaller than within-group spread |
| 6 | What moves together? | `0.98` between two predictors |

EDA is where you find the problems. Doing it after modelling means discovering that a column was
`object`, or that a group had two members, only once the results are already wrong.

:::warning EDA doesn't replace plotting

Every statistic on this page is a summary, and summaries discard information. The
`y = x²` example on the [previous page](./02-correlation-and-covariance.md#it-only-sees-straight-lines)
has correlation exactly `0.0` despite a perfect relationship — a scatter plot shows it
immediately. Numbers narrow down where to look; plots show you what's there.

:::

---

## Common Mistakes

| # | Mistake | Wrong | Right |
|---|---|---|---|
| 1 | Skipping EDA | problems surface after modelling | run the checklist first |
| 2 | Group mean without `count` | 1-row groups look meaningful | `.agg([..., "count"])` |
| 3 | Group mean without spread | hides overlap | include `min`/`max` |
| 4 | Expecting `describe()` to cover text | numeric only | `value_counts()` |
| 5 | Reading `corr ≈ 0` as "no relationship" | only linear | plot it |
| 6 | Ignoring low-variance columns | can't explain anything | check `std` in `describe()` |
| 7 | `value_counts()` on ordered bands | sorts by frequency | `.sort_index()` |
| 8 | Concluding causation from EDA | it's descriptive only | needs an experiment |

---

## Summary

| Step | Call |
|---|---|
| Size and types | `df.shape`, `df.dtypes`, `df.info()` |
| Preview | `df.head()`, `df.tail()` |
| Missing | `df.isnull().sum()` |
| Numeric summary | `df.describe()` |
| Category counts | `df["c"].value_counts()` |
| Group comparison | `df.groupby("c")["n"].agg([...])` |
| Relationships | `df.corr(numeric_only=True)` |
| Bin a column | `pd.cut(df["n"], bins=[...], labels=[...])` |
| Two categories | `pd.crosstab(df["a"], df["b"])` |
| Extremes | `df.nlargest(n, "col")` |

**Key takeaways**

- EDA has an order: structure → completeness → distributions → categories → groups → relationships
- Read `describe()` for **plausibility** first: impossible values, mean vs median, low `std`
- A low standard deviation predicted `Age`'s near-zero correlation before computing it
- Never report a group mean without its `count`, and rarely without its range
- CSE's marks range (85–95) doesn't overlap IT's (70–76) — stronger than any mean comparison
- `corr(Age, Marks) = −0.0089` is a **finding**: it rules the variable out
- `pd.crosstab` showed the department split more clearly than either means or correlation
- `value_counts().sort_index()` for ordered bands, not the default frequency order
- Summaries discard information — plot as well

**See also:** [Descriptive Statistics](./01-descriptive-statistics.md) ·
[Correlation and Covariance](./02-correlation-and-covariance.md) ·
[Inspecting Data](../05-pandas/03-inspecting-data.md) ·
[Cleaning Data](../05-pandas/04-cleaning-data.md)

---

## Run It Yourself

```python title="eda.py"
import pandas as pd

df = pd.DataFrame({
    "Name": ["Arun", "Bala", "Charan", "Divya", "Esha",
             "Farah", "Gokul", "Hari", "Indhu", "Jaya"],
    "Age": [20, 21, 22, 20, 21, 23, 22, 20, 21, 22],
    "Department": ["CSE", "IT", "CSE", "ECE", "CSE", "IT", "ECE", "CSE", "IT", "ECE"],
    "Marks": [85, 72, 91, 65, 88, 76, 80, 95, 70, 82],
    "Attendance": [90, 75, 95, 70, 88, 80, 85, 98, 72, 89],
})

print("1. STRUCTURE")
print(f"   shape {df.shape}   missing {df.isnull().sum().sum()}")

print("\n2. NUMERIC SUMMARY")
print(df.describe().round(2))

print("\n3. CATEGORY COUNTS")
print(df["Department"].value_counts())

print("\n4. GROUP COMPARISON — with count and range")
print(df.groupby("Department")["Marks"].agg(["mean", "min", "max", "count"]).round(2))

print("\n5. CORRELATION")
print(df[["Age", "Marks", "Attendance"]].corr().round(4))

print("\n6. CROSS-TAB OF DEPARTMENT vs MARK BAND")
df["Band"] = pd.cut(df["Marks"], bins=[0, 70, 80, 90, 100],
                    labels=["<=70", "71-80", "81-90", "91+"])
print(pd.crosstab(df["Department"], df["Band"]))

print("\nFINDINGS")
print("   Marks vs Attendance  0.98  — strong, but not proof of cause")
print("   Marks vs Age        -0.01  — nothing; Age barely varies (std 1.03)")
print("   CSE 85-95 vs IT 70-76      — ranges do not overlap")
print("   groups of 4, 3, 3          — too small to be conclusive")
```

```text title="Output"
1. STRUCTURE
   shape (10, 5)   missing 0

2. NUMERIC SUMMARY
         Age  Marks  Attendance
count  10.00  10.00       10.00
mean   21.20  80.40       84.20
std     1.03   9.67        9.61
min    20.00  65.00       70.00
25%    20.25  73.00       76.25
50%    21.00  81.00       86.50
75%    22.00  87.25       89.75
max    23.00  95.00       98.00

3. CATEGORY COUNTS
Department
CSE    4
IT     3
ECE    3
Name: count, dtype: int64

4. GROUP COMPARISON — with count and range
             mean  min  max  count
Department                        
CSE         89.75   85   95      4
ECE         75.67   65   82      3
IT          72.67   70   76      3

5. CORRELATION
               Age   Marks  Attendance
Age         1.0000 -0.0089      0.0291
Marks      -0.0089  1.0000      0.9799
Attendance  0.0291  0.9799      1.0000

6. CROSS-TAB OF DEPARTMENT vs MARK BAND
Band        <=70  71-80  81-90  91+
Department                         
CSE            0      0      2    2
ECE            1      1      1    0
IT             1      2      0    0

FINDINGS
   Marks vs Attendance  0.98  — strong, but not proof of cause
   Marks vs Age        -0.01  — nothing; Age barely varies (std 1.03)
   CSE 85-95 vs IT 70-76      — ranges do not overlap
   groups of 4, 3, 3          — too small to be conclusive
```

---

## Practice Questions

*From the Unit 2 question bank. Tags and marks are explained on the
[Python index](../index.md#practice-questions).*

### Unit 2 § O — EDA Mini Challenges

**O1. [PROG]** Write a complete EDA script for `df_eda` that performs, in order: `[10]`

1. display the dataset
2. inspect it — head, tail, shape, columns, dtypes, info
3. check for missing values
4. print the statistical summary
5. print individual measures for Marks — mean, median, mode, max, min, std, var
6. count the students per department
7. show the average Marks per department
8. print the correlation matrix
9. print the covariance matrix

**O2. [PROG]** *(Lab 4.)* Build the 10-student dataset with a missing Age, a missing Marks and an
`Email` column. Then: report the missing values, fill both gaps with the column mean, drop
`Email`, and show count/mean/min/max of Marks per Department. `[8]`

**O4. [PROG]** Load `students.csv`, clean it fully, then write a short report printing: the number
of rows before and after cleaning, how many values were filled, the department with the highest
average marks, and the top scorer's name. `[8]`
