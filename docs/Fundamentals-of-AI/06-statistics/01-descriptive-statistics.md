---
sidebar_position: 1
title: Descriptive Statistics
description: Mean, median, mode, range, variance, standard deviation and quartiles — what each one tells you and when it misleads.
tags: [python, pandas, statistics]
toc_max_heading_level: 3
---

# Descriptive Statistics

> **Topic —** Summarising a column of numbers. Two questions: where is the **centre**, and how
> **spread out** is it?

```python
import pandas as pd

data = {
    "Name": ["Arun", "Bala", "Charan", "Divya", "Esha",
             "Farah", "Gokul", "Hari", "Indhu", "Jaya"],
    "Age": [20, 21, 22, 20, 21, 23, 22, 20, 21, 22],
    "Marks": [85, 72, 91, 65, 88, 76, 80, 95, 70, 82],
    "Attendance": [90, 75, 95, 70, 88, 80, 85, 98, 72, 89],
}
df = pd.DataFrame(data)
print(df)
```

```text title="Output"
     Name  Age  Marks  Attendance
0    Arun   20     85          90
1    Bala   21     72          75
2  Charan   22     91          95
3   Divya   20     65          70
4    Esha   21     88          88
5   Farah   23     76          80
6   Gokul   22     80          85
7    Hari   20     95          98
8   Indhu   21     70          72
9    Jaya   22     82          89
```

---

## Everything at once — `describe()`

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

This one call covers `count`, `mean`, `std`, `min`, the three quartiles and `max` for every
numeric column. The rest of this page unpacks what each number means — and computes them
individually, which is what you do when you want just one.

See [Inspecting Data](../05-pandas/03-inspecting-data.md#describe) for the mechanics of
`describe()` itself.

---

## Measures of centre

### Mean

```python
print(df["Marks"].mean())   # → 80.4
```

```text title="Output"
80.4
```

The arithmetic average — add everything, divide by the count.

### Median

```python
print(df["Marks"].median())   # → 81.0
```

```text title="Output"
81.0
```

Sort the values and take the middle one. With ten values (an even count) it averages the 5th
and 6th.

### Mean vs median — why both exist

They're close here (`80.4` and `81.0`) because the data is well behaved. The difference shows
up with an outlier:

```python
base = pd.Series([70, 72, 75, 78, 80])
out  = pd.Series([70, 72, 75, 78, 800])   # one typo
print(base.mean(), base.median())
print(out.mean(), out.median())
```

```text title="Output"
75.0 75.0
219.0 75.0
```

One mistyped value — `800` instead of `80` — moved the mean from `75` to **`219`**, a number
no student scored. The median didn't budge.

:::tip

The mean uses every value's magnitude, so an extreme value drags it. The median only cares
about **order**, so it's *robust* to outliers.

When mean and median are far apart, that's a signal: either genuine skew, or bad data. This is
why median house prices and median salaries are reported rather than means.

:::

### Mode — and a surprise

```python
print(df["Marks"].mode())
```

```text title="Output"
0    65
1    70
2    72
3    76
4    80
5    82
6    85
7    88
8    91
9    95
Name: Marks, dtype: int64
```

**All ten values came back.** That isn't a bug — it's the correct answer. The mode is the most
frequent value, and here **every mark appears exactly once**, so all ten are tied for most
frequent.

:::warning `mode()` returns a Series, not a single number

Unlike `mean()` and `median()`, which return one number, `mode()` returns a **Series** —
because a dataset can have several modes, or none meaningfully.

```python
print(pd.Series([1, 2, 2, 3, 3]).mode())   # two modes
print(pd.Series([1, 2, 3]).mode())         # all tied
```

```text title="Output"
0    2
1    3
dtype: int64
0    1
1    2
2    3
dtype: int64
```

Use `.mode()[0]` if you want one value — but check `len()` first, because taking `[0]` of a
ten-way tie is meaningless.

:::

**Mode is for categories, not continuous measurements.** "Which department is most common" is a
good question for `mode()` (or better,
[`value_counts()`](../05-pandas/03-inspecting-data.md#counting-categories)). "Which exact mark
is most common" usually isn't, because continuous values rarely repeat.

| Measure | Best for | Weakness |
|---|---|---|
| **Mean** | symmetric data | dragged by outliers |
| **Median** | skewed data, outliers present | ignores magnitude |
| **Mode** | categories | may be absent or ambiguous |

---

## Measures of spread

A centre alone tells you very little. Two classes can both average 80 — one where everyone
scored 79–81, one where half scored 60 and half scored 100.

### Min, max and range

```python
print(df["Marks"].min())   # → 65
print(df["Marks"].max())   # → 95

range_marks = df["Marks"].max() - df["Marks"].min()
print(range_marks)         # → 30
```

```text title="Output"
65
95
30
```

Pandas has no `.range()` method — you compute it as `max - min`. (NumPy calls it
[`np.ptp`](../04-numpy/04-aggregations-and-statistics.md#others-worth-knowing), "peak to peak".)

Range is the crudest spread measure: it uses only two values and is entirely determined by the
two most extreme ones. A single outlier defines it.

### Variance and standard deviation

```python
print(df["Marks"].var())   # → 93.59999999999998
print(df["Marks"].std())   # → 9.674709297958259
```

```text title="Output"
93.59999999999998
9.674709297958259
```

Both measure average distance from the mean. **Standard deviation is the square root of
variance:**

```python
print(df["Marks"].std() ** 2)   # → 93.6
```

```text title="Output"
93.6
```

(`93.59999999999998` rather than `93.6` is ordinary
[float imprecision](../01-basics/01-values-and-types.md#float), not a pandas quirk.)

**Why two numbers for one idea?** Units. Variance is in *marks squared*, which means nothing
physically. Standard deviation is back in **marks**, so you can say "the typical student is
about 9.7 marks from the average" — a sentence that makes sense. Variance is easier to do
algebra with; standard deviation is easier to report.

:::danger Pandas and NumPy give different answers

```python
import numpy as np
print(np.var(df["Marks"]))   # → 84.23999999999998
print(df["Marks"].var())     # → 93.59999999999998
```

```text title="Output"
84.23999999999998
93.59999999999998
```

Same column, same data. Pandas divides by *n − 1* (`ddof=1`, **sample** variance); NumPy
divides by *n* (`ddof=0`, **population** variance). Neither is wrong — they answer different
questions. Full explanation in
[Aggregations and Statistics](../04-numpy/04-aggregations-and-statistics.md#numpy-and-pandas-disagree-on-std).

If you report a standard deviation, say which convention you used.

:::

---

## Quartiles

Quartiles cut the sorted data into four equal parts.

```python
print(df["Marks"].quantile(0.25))   # → 73.0
print(df["Marks"].quantile(0.50))   # → 81.0
print(df["Marks"].quantile(0.75))   # → 87.25
```

```text title="Output"
73.0
81.0
87.25
```

| Quartile | Meaning |
|---|---|
| **Q1** (25%) | 25% of values fall below this |
| **Q2** (50%) | the **median** |
| **Q3** (75%) | 75% of values fall below this |

Q2 and the median are the same thing:

```python
print(df["Marks"].median() == df["Marks"].quantile(0.50))   # → True
```

```text title="Output"
True
```

These are the `25%`, `50%` and `75%` rows of `describe()`.

### IQR and finding outliers

The **interquartile range** is `Q3 − Q1` — the spread of the middle half, ignoring the extremes
entirely:

```python
q1 = df["Marks"].quantile(0.25)
q3 = df["Marks"].quantile(0.75)
iqr = q3 - q1
print(iqr)   # → 14.25
```

```text title="Output"
14.25
```

The standard outlier rule flags anything more than `1.5 × IQR` beyond either quartile:

```python
lower = q1 - 1.5 * iqr
upper = q3 + 1.5 * iqr
print(lower, upper)
print(df[(df["Marks"] < lower) | (df["Marks"] > upper)])
```

```text title="Output"
51.625 108.625
Empty DataFrame
Columns: [Name, Age, Marks, Attendance]
Index: []
```

An empty DataFrame — **no outliers**, which is the right answer for this data. Every mark falls
between 51.6 and 108.6.

This is exactly what a box plot draws: the box spans Q1 to Q3, the line inside is the median,
and the whiskers reach to `1.5 × IQR`. Points beyond are plotted individually.

:::note An outlier is not automatically an error

The `1.5 × IQR` rule finds *unusual* values, not *wrong* ones. A genuinely brilliant student
is an outlier who belongs in the data. A mark of `800` is an outlier that doesn't. The rule
tells you where to look; you decide what it means.

:::

---

## Count

```python
print(df["Marks"].count())   # → 10
```

```text title="Output"
10
```

`count()` is the number of **non-missing** values, not the number of rows:

```python
n = pd.Series([1, 2, None, 4])
print(n.count())   # → 3
print(len(n))      # → 4
print(n.mean())    # → 2.3333333333333335
```

```text title="Output"
3
4
2.3333333333333335
```

Four rows, three values. And note the mean is `7/3`, not `7/4` — **pandas statistics skip `NaN`
automatically**, unlike NumPy where you'd need
[`nanmean`](../04-numpy/04-aggregations-and-statistics.md#handling-nan). Convenient, but it
means a mean can be computed from far fewer values than you think. Always compare `count()` to
`len()`.

---

## All columns at once

Every one of these works on a whole DataFrame, giving one value per column:

```python
print(df[["Age", "Marks", "Attendance"]].mean())
```

```text title="Output"
Age           21.2
Marks         80.4
Attendance    84.2
dtype: float64
```

That's `axis=0` — the default, collapsing rows to give a per-column answer. Same convention as
[NumPy's axis argument](../04-numpy/04-aggregations-and-statistics.md#the-axis-argument).

---

## Common Mistakes

| # | Mistake | Wrong | Right |
|---|---|---|---|
| 1 | Expecting `mode()` to return a number | it's a **Series** | `.mode()[0]`, after checking `len()` |
| 2 | Reading a mode from continuous data | every value tied | use `value_counts()` on categories |
| 3 | Looking for `.range()` | no such method | `df["c"].max() - df["c"].min()` |
| 4 | Comparing pandas `var` to NumPy's | different `ddof` | state which convention |
| 5 | Reporting variance as spread | wrong units (marks²) | report `std` |
| 6 | Mean on skewed data | dragged by outliers | median too |
| 7 | Reading `count()` as the row count | it's non-null | compare to `len()` |
| 8 | Treating every outlier as an error | it may be real | investigate before dropping |

---

## Summary

| Measure | Call | Tells you |
|---|---|---|
| Count | `.count()` | non-missing values |
| Mean | `.mean()` | average — outlier-sensitive |
| Median | `.median()` | middle — outlier-resistant |
| Mode | `.mode()` | most frequent (a Series) |
| Min / Max | `.min()` / `.max()` | extremes |
| Range | `max - min` | crudest spread |
| Variance | `.var()` | spread, squared units |
| Std deviation | `.std()` | spread, original units |
| Quartiles | `.quantile(q)` | position in the distribution |
| IQR | `Q3 - Q1` | spread of the middle half |
| Everything | `.describe()` | all of the above |

**Key takeaways**

- Always report a centre **and** a spread — either alone hides the shape of the data
- One typo moved a mean from 75 to 219; the median stayed at 75
- A large gap between mean and median means skew, or bad data
- `mode()` returns a **Series**, and returned all ten values here because none repeated
- `std` is `var` squared-rooted; report `std` because it's in the data's own units
- Pandas uses `ddof=1`, NumPy uses `ddof=0` — same data, different variance
- IQR (`Q3 − Q1`) ignores the extremes; `1.5 × IQR` is the standard outlier fence
- Pandas statistics silently skip `NaN`, so check `count()` against `len()`

**See also:** [Correlation and Covariance](./02-correlation-and-covariance.md) for
relationships *between* columns · [Inspecting Data](../05-pandas/03-inspecting-data.md) ·
[Aggregations and Statistics](../04-numpy/04-aggregations-and-statistics.md) for the NumPy
equivalents

---

## Run It Yourself

```python title="descriptive_stats.py"
import pandas as pd

df = pd.DataFrame({
    "Name": ["Arun", "Bala", "Charan", "Divya", "Esha",
             "Farah", "Gokul", "Hari", "Indhu", "Jaya"],
    "Age": [20, 21, 22, 20, 21, 23, 22, 20, 21, 22],
    "Marks": [85, 72, 91, 65, 88, 76, 80, 95, 70, 82],
    "Attendance": [90, 75, 95, 70, 88, 80, 85, 98, 72, 89],
})

marks = df["Marks"]

print("CENTRE")
print(f"  {'count':<10} {marks.count()}")
print(f"  {'mean':<10} {marks.mean()}")
print(f"  {'median':<10} {marks.median()}")
print(f"  {'modes':<10} {len(marks.mode())} values tied — no real mode")

print("\nSPREAD")
print(f"  {'min':<10} {marks.min()}")
print(f"  {'max':<10} {marks.max()}")
print(f"  {'range':<10} {marks.max() - marks.min()}")
print(f"  {'variance':<10} {marks.var():.4f}   (marks squared)")
print(f"  {'std dev':<10} {marks.std():.4f}   (marks)")

print("\nQUARTILES")
q1, q2, q3 = marks.quantile([0.25, 0.50, 0.75])
print(f"  {'Q1 (25%)':<10} {q1}")
print(f"  {'Q2 (50%)':<10} {q2}   == median")
print(f"  {'Q3 (75%)':<10} {q3}")
print(f"  {'IQR':<10} {q3 - q1}")

print("\nOUTLIER FENCE (1.5 x IQR)")
iqr = q3 - q1
print(f"  bounds     ({q1 - 1.5 * iqr}, {q3 + 1.5 * iqr})")
outliers = df[(marks < q1 - 1.5 * iqr) | (marks > q3 + 1.5 * iqr)]
print(f"  outliers   {len(outliers)}")
```

```text title="Output"
CENTRE
  count      10
  mean       80.4
  median     81.0
  modes      10 values tied — no real mode

SPREAD
  min        65
  max        95
  range      30
  variance   93.6000   (marks squared)
  std dev    9.6747   (marks)

QUARTILES
  Q1 (25%)   73.0
  Q2 (50%)   81.0   == median
  Q3 (75%)   87.25
  IQR        14.25

OUTLIER FENCE (1.5 x IQR)
  bounds     (51.625, 108.625)
  outliers   0
```

---

## Practice Questions

*From the Unit 2 question bank. Tags and marks are explained on the
[Python index](../index.md#practice-questions).*

### Unit 2 § I — Descriptive Statistics

**I1. [PROG]** For the Marks column of `df_eda`, print the mean, median, mode, min, max, range,
variance, standard deviation, and count. `[9]`

**I2. [OUT]** Marks are `[85, 72, 91, 65, 88, 76, 80, 95, 70, 82]`. Work these out by hand. `[5]`

```python
print(df_eda["Marks"].mean())
print(df_eda["Marks"].median())
print(df_eda["Marks"].min())
print(df_eda["Marks"].max())
print(df_eda["Marks"].max() - df_eda["Marks"].min())
```

**I3. [OUT]** Your `EDA.py` prints this. The result is **not** a single number — and it surprises
most students. `[4]`

```python
print(df_eda["Marks"].mode())
```

*How many values come back, and why? What type is the result?*

**I4. [OUT]** **The most important question in this section.** `[5]`

```python
import numpy as np
marks = [85, 72, 91, 65, 88, 76, 80, 95, 70, 82]
s = pd.Series(marks)

print(s.var())
print(np.var(marks))
print(s.std())
print(np.std(marks))
```

*`s.var()` is `93.6` but `np.var(marks)` is `84.24`. **Explain why pandas and NumPy disagree**,
and name the parameter that controls it.*

**I5. [THEORY]** Define **variance** and **standard deviation** in one sentence each. Why is
standard deviation usually reported instead of variance? `[3]`

**I6. [OUT]** `[4]`

```python
print(df_eda["Marks"].quantile(0.25))
print(df_eda["Marks"].quantile(0.50))
print(df_eda["Marks"].quantile(0.75))
```

*Which of these equals the median? Compute the **IQR**.*

**I7. [THEORY]** State the **five-number summary**. Which single plot displays all five at
once? `[3]`

**I8. [THEORY]** Give the standard rule for flagging an **outlier** from Q1, Q3 and the IQR. `[3]`

**I9. [THEORY]** Marks `[10, 20, 30, 40, 5000]`. Compute the mean and the median. Which better
represents this data, and what does that tell you about the mean? `[4]`

**I10. [OUT]** Name every row label `describe()` produces on a numeric column, in order, and say
what each one means. `[4]`

**I11. [PROG]** Without using `.describe()`, print your own summary table of Marks: count, mean,
std, min, Q1, median, Q3, max. `[5]`

### Unit 2 § O — EDA Mini Challenges

**O5. [PROG]** Write a function `summarise(df, column)` that prints the mean, median, mode, std,
IQR and any outliers for any numeric column you pass it. Test it on Marks and on
Attendance. `[8]`

### Viva

1. What five values does a box plot show?
