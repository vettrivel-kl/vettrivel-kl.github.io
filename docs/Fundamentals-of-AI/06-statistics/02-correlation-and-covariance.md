---
sidebar_position: 2
title: Correlation and Covariance
description: Measuring whether two variables move together — the correlation scale, why covariance can't be compared, and what correlation misses.
tags: [python, pandas, statistics]
toc_max_heading_level: 3
---

# Correlation and Covariance

> **Topic —** Descriptive statistics describe **one** column. These describe the *relationship*
> between **two**.

```python
import pandas as pd

data = {
    "Student": ["Arun", "Bala", "Charan", "Divya", "Esha",
                "Farah", "Gokul", "Hari", "Indhu", "Jaya"],
    "Study_Hours": [2, 3, 5, 1, 4, 3, 4, 6, 2, 5],
    "Attendance": [70, 75, 90, 60, 85, 78, 88, 95, 72, 92],
    "Marks": [55, 62, 85, 45, 78, 68, 80, 95, 58, 88],
}
df = pd.DataFrame(data)
print(df)
```

```text title="Output"
  Student  Study_Hours  Attendance  Marks
0    Arun            2          70     55
1    Bala            3          75     62
2  Charan            5          90     85
3   Divya            1          60     45
4    Esha            4          85     78
5   Farah            3          78     68
6   Gokul            4          88     80
7    Hari            6          95     95
8   Indhu            2          72     58
9    Jaya            5          92     88
```

You can already see the pattern by eye: more study hours, higher marks. These functions put a
number on it.

---

## Select the numeric columns first

```python
numeric_data = df[["Study_Hours", "Attendance", "Marks"]]
```

`Student` is text, and there's no correlation between names and numbers. Either select the
numeric columns explicitly, or pass `numeric_only=True`:

```python
print(df.corr(numeric_only=True))
```

Both give the same result. Without either, older pandas versions error on the text column.

---

## Correlation

```python
print(numeric_data.corr())
```

```text title="Output"
             Study_Hours  Attendance     Marks
Study_Hours     1.000000    0.979769  0.989508
Attendance      0.979769    1.000000  0.994286
Marks           0.989508    0.994286  1.000000
```

A **correlation matrix** — every column against every other.

Three things to read from it:

- **The diagonal is always `1.0`.** Every variable correlates perfectly with itself.
- **It's symmetric.** `corr(A, B)` equals `corr(B, A)`, so the top-right triangle mirrors the
  bottom-left. Only half the matrix carries information.
- **All three values are above 0.97** — study hours, attendance and marks all move together very
  strongly in this data.

For a single pair:

```python
print(df["Study_Hours"].corr(df["Marks"]))
```

```text title="Output"
0.9895078695279798
```

`0.99` — an almost perfectly straight-line relationship.

### The correlation scale

Correlation always falls between **−1 and +1**:

| Value | Meaning |
|---|---|
| `+1.0` | perfect positive — one goes up, the other goes up, exactly |
| `+0.8` | strong positive |
| `+0.5` | moderate positive |
| `+0.2` | weak positive |
| `0` | **no linear relationship** |
| `−0.2` | weak negative |
| `−0.8` | strong negative |
| `−1.0` | perfect negative — one goes up, the other goes down, exactly |

The **sign** gives the direction, the **magnitude** gives the strength. `−0.9` is a *stronger*
relationship than `+0.3`, despite being a smaller number.

A negative example:

```python
neg = pd.DataFrame({"Study": [2, 4, 6], "Marks": [90, 75, 50]})
print(neg.corr())
```

```text title="Output"
          Study     Marks
Study  1.000000 -0.989743
Marks -0.989743  1.000000
```

As study hours rise, marks fall — `−0.99`. Just as strong a relationship as `+0.99`, pointing
the other way.

---

## Covariance

```python
print(numeric_data.cov())
```

```text title="Output"
             Study_Hours  Attendance       Marks
Study_Hours     2.500000   17.500000   25.444444
Attendance     17.500000  127.611111  182.666667
Marks          25.444444  182.666667  264.488889
```

```python
print(df["Study_Hours"].cov(df["Marks"]))
```

```text title="Output"
25.444444444444443
```

Covariance measures the same idea — do these move together? — but **without normalising**.

### The diagonal is the variance

```python
print(df["Study_Hours"].var())   # → 2.5
print(df["Marks"].var())         # → 264.4888888888889
```

```text title="Output"
2.5
264.4888888888889
```

Those are exactly the diagonal entries. A variable's covariance *with itself* **is** its
[variance](./01-descriptive-statistics.md#variance-and-standard-deviation) — which makes
covariance the natural generalisation of variance to two variables.

### Covariance numbers can't be compared

Look at the matrix again. `cov(Study_Hours, Marks)` is `25.4` and
`cov(Attendance, Marks)` is `182.7`. Is attendance seven times more related to marks?

**No.** Check the correlations: `0.9895` and `0.9943` — nearly identical. The covariances differ
because **the variables are on different scales**. Study hours run 1–6; attendance runs 60–95.

Prove it by rescaling one column:

```python
df["Marks_scaled"] = df["Marks"] * 100

print(df["Study_Hours"].corr(df["Marks"]))          # → 0.9895078695279798
print(df["Study_Hours"].corr(df["Marks_scaled"]))   # → 0.98950786952798
print(df["Study_Hours"].cov(df["Marks"]))           # → 25.444444444444443
print(df["Study_Hours"].cov(df["Marks_scaled"]))    # → 2544.4444444444443
```

```text title="Output"
0.9895078695279798
0.98950786952798
25.444444444444443
2544.4444444444443
```

Multiplying marks by 100 left the **correlation unchanged** and multiplied the **covariance by
100**. The relationship didn't change — only the units did.

:::warning Covariance has units; correlation doesn't

`cov(Study_Hours, Marks)` is measured in *hour-marks*. That isn't a thing anyone can interpret.
`cov(Study_Hours, Attendance)` is `17.5` **hour-percent**. Different units, so the two numbers
aren't comparable even in principle.

Correlation is covariance divided by both standard deviations, which **cancels the units**. That
one division is what makes correlation comparable across any pair of variables in any dataset.

:::

| | Correlation | Covariance |
|---|---|---|
| Range | −1 to +1 | any real number |
| Units | none | product of both units |
| Comparable across pairs | ✅ | ❌ |
| Affected by rescaling | ❌ | ✅ |
| Diagonal | `1` | the variance |
| Use for | interpreting strength | intermediate maths, PCA |

**In practice: read correlation, compute covariance only when something downstream needs it.**

---

## What correlation misses

### It only sees straight lines

```python
nl = pd.DataFrame({"x": [-3, -2, -1, 0, 1, 2, 3]})
nl["y"] = nl["x"] ** 2
print(nl["x"].corr(nl["y"]))
```

```text title="Output"
0.0
```

**Correlation exactly zero** — for `y = x²`, where `y` is *perfectly determined* by `x`. There
is no stronger relationship possible, and Pearson correlation reports nothing.

The reason: as `x` goes from −3 to 0, `y` falls; from 0 to 3, `y` rises. The two halves cancel.
Pearson correlation measures **linear** association only.

:::danger `corr() == 0` does not mean "unrelated"

It means "no *linear* relationship". Always plot the data — a scatter plot would show the
parabola instantly, and no summary statistic ever will.

:::

### It's sensitive to outliers

```python
m = pd.DataFrame({"x": [1, 2, 3, 4, 100], "y": [1, 2, 3, 4, 5]})
print(m["x"].corr(m["y"]))                       # → 0.725
print(m["x"].corr(m["y"], method="spearman"))    # → 1.0
```

```text title="Output"
0.725
1.0
```

`x` and `y` increase together at every single step — a perfect *ranking* match. But one extreme
value drops Pearson correlation to `0.725`.

**Spearman** correlation correlates the *ranks* rather than the values, giving the `1.0` that
matches what's actually happening. Same robustness trade as
[median versus mean](./01-descriptive-statistics.md#mean-vs-median--why-both-exist).

| `method=` | Measures | Use when |
|---|---|---|
| `"pearson"` | linear association (**default**) | roughly linear, no wild outliers |
| `"spearman"` | monotonic association, via ranks | outliers present, or curved-but-consistent |
| `"kendall"` | concordant pairs | small samples, many ties |

### A middling number is hard to read

```python
z = pd.DataFrame({"x": [1, 2, 3, 4, 5], "y": [3, 1, 4, 1, 5]})
print(z["x"].corr(z["y"]))
```

```text title="Output"
0.3536
```

`0.35` — weak positive. With only five points that could easily be noise. Correlation says
nothing about **statistical significance**; `0.35` from five points and `0.35` from five
thousand are very different claims.

### Correlation is not causation

The `0.99` between study hours and marks is a genuinely strong relationship. It still doesn't
prove that studying *causes* higher marks in this data. Alternatives that fit equally well:

- Motivated students both study more **and** attend more — a third factor drives both
- Able students find the material easy, so they enjoy it and study more — the arrow runs backward
- Ten students is a very small sample

Note `corr(Study_Hours, Attendance)` is `0.98`. Study hours and attendance are almost
interchangeable here, so the data **cannot** tell you which one matters. That's a real limitation
of the dataset, not something a bigger correlation would fix.

---

## A near-zero correlation in the real data

From the EDA dataset on the [next page](./03-exploratory-data-analysis.md):

```text title="Output"
                 Age     Marks  Attendance
Age         1.000000 -0.008896    0.029099
Marks      -0.008896  1.000000    0.979949
Attendance  0.029099  0.979949    1.000000
```

`corr(Age, Marks)` is `−0.0089` — **essentially zero**. Age tells you nothing about marks, which
is exactly what you'd expect among students in the same year.

That's a useful finding, not a failure. Knowing which variables *don't* relate is how you decide
what to leave out of a model.

---

## Common Mistakes

| # | Mistake | Wrong | Right |
|---|---|---|---|
| 1 | Comparing covariances | scale-dependent | compare correlations |
| 2 | Reading `corr = 0` as "unrelated" | only *linear* is ruled out | plot it |
| 3 | Concluding causation | `0.99` is still not cause | consider confounders |
| 4 | Pearson with outliers | one point distorted it to `0.725` | `method="spearman"` |
| 5 | Ignoring sample size | `0.35` from 5 points is noise | more data, or a significance test |
| 6 | `corr()` with text columns | may error | `numeric_only=True` |
| 7 | Reading the whole matrix | it's symmetric | half of it is redundant |
| 8 | Interpreting covariance units | *hour-marks* is meaningless | use correlation |

---

## Summary

| Task | Call |
|---|---|
| Correlation matrix | `df.corr(numeric_only=True)` |
| One pair | `df["a"].corr(df["b"])` |
| Rank-based | `df["a"].corr(df["b"], method="spearman")` |
| Covariance matrix | `df.cov()` |
| One pair | `df["a"].cov(df["b"])` |

**Key takeaways**

- Correlation runs **−1 to +1**; sign is direction, magnitude is strength
- `−0.9` is a stronger relationship than `+0.3`
- The correlation diagonal is `1`; the **covariance diagonal is the variance**
- Covariance carries units and changes with scale — ×100 on one column multiplied it by 100
- Correlation is unitless and unchanged by rescaling, which is why it's comparable
- Pearson sees **straight lines only** — `y = x²` gave correlation exactly `0.0`
- One outlier dropped a perfect rank relationship from `1.0` to `0.725`; Spearman recovered it
- Correlation ignores sample size and never establishes causation
- `corr(Study_Hours, Attendance) = 0.98` means the data can't separate their effects

**See also:** [Descriptive Statistics](./01-descriptive-statistics.md) for single-column
measures · [Exploratory Data Analysis](./03-exploratory-data-analysis.md) for where this fits ·
[Selecting and Transforming](../05-pandas/05-selecting-and-transforming.md) for `groupby`

---

## Run It Yourself

```python title="correlation.py"
import pandas as pd

df = pd.DataFrame({
    "Student": ["Arun", "Bala", "Charan", "Divya", "Esha",
                "Farah", "Gokul", "Hari", "Indhu", "Jaya"],
    "Study_Hours": [2, 3, 5, 1, 4, 3, 4, 6, 2, 5],
    "Attendance": [70, 75, 90, 60, 85, 78, 88, 95, 72, 92],
    "Marks": [55, 62, 85, 45, 78, 68, 80, 95, 58, 88],
})

numeric = df[["Study_Hours", "Attendance", "Marks"]]

print("CORRELATION — comparable, unitless, -1 to +1")
print(numeric.corr().round(4))

print("\nCOVARIANCE — diagonal is the variance, units are meaningless")
print(numeric.cov().round(4))

print("\nsingle pair")
print(f"  corr(Study_Hours, Marks) {df['Study_Hours'].corr(df['Marks']):.4f}")
print(f"  cov (Study_Hours, Marks) {df['Study_Hours'].cov(df['Marks']):.4f}")

print("\nrescaling Marks x100 — correlation holds, covariance doesn't")
scaled = df["Marks"] * 100
print(f"  corr before / after  {df['Study_Hours'].corr(df['Marks']):.4f} / "
      f"{df['Study_Hours'].corr(scaled):.4f}")
print(f"  cov  before / after  {df['Study_Hours'].cov(df['Marks']):.4f} / "
      f"{df['Study_Hours'].cov(scaled):.4f}")

print("\nwhat Pearson misses: y = x squared")
nl = pd.DataFrame({"x": [-3, -2, -1, 0, 1, 2, 3]})
nl["y"] = nl["x"] ** 2
print(f"  pearson  {nl['x'].corr(nl['y']):.4f}  — zero, yet perfectly determined")

print("\noutlier sensitivity")
m = pd.DataFrame({"x": [1, 2, 3, 4, 100], "y": [1, 2, 3, 4, 5]})
print(f"  pearson  {m['x'].corr(m['y']):.4f}")
print(f"  spearman {m['x'].corr(m['y'], method='spearman'):.4f}  — ranks match perfectly")
```

```text title="Output"
CORRELATION — comparable, unitless, -1 to +1
             Study_Hours  Attendance   Marks
Study_Hours       1.0000      0.9798  0.9895
Attendance        0.9798      1.0000  0.9943
Marks             0.9895      0.9943  1.0000

COVARIANCE — diagonal is the variance, units are meaningless
             Study_Hours  Attendance     Marks
Study_Hours       2.5000     17.5000   25.4444
Attendance       17.5000    127.6111  182.6667
Marks            25.4444    182.6667  264.4889

single pair
  corr(Study_Hours, Marks) 0.9895
  cov (Study_Hours, Marks) 25.4444

rescaling Marks x100 — correlation holds, covariance doesn't
  corr before / after  0.9895 / 0.9895
  cov  before / after  25.4444 / 2544.4444

what Pearson misses: y = x squared
  pearson  0.0000  — zero, yet perfectly determined

outlier sensitivity
  pearson  0.7250
  spearman 1.0000  — ranks match perfectly
```

---

## Practice Questions

*From the Unit 2 question bank. Tags and marks are explained on the
[Python index](../index.md#practice-questions).*

### Unit 2 § J — Correlation & Covariance

**J1. [PROG]** For `df_viz`, select the numeric columns and print the **correlation
matrix**. `[3]`

**J2. [PROG]** Print the correlation between `Study_Hours` and `Marks` alone, as a single
number. `[2]`

**J3. [OUT]** For `df_viz`, `df["Study_Hours"].corr(df["Marks"])` returns `0.9895`. `[4]`

- What is the possible **range** of a correlation?
- What do the **sign** and the **magnitude** each tell you?
- In words, what does `0.9895` say about study hours and marks?

**J4. [OUT]** Every value on the **diagonal** of a correlation matrix is `1.0`, and the matrix is
symmetric about that diagonal. Explain both facts. `[3]`

**J5. [PROG]** Print the **covariance matrix** for the numeric columns of `df_viz`. `[3]`

**J6. [OUT]** For `df_viz`, `corr` between Study_Hours and Marks is `0.9895`, but `cov` is
`25.44`. `[4]`

*Both measure the same relationship. Why is one a neat number between −1 and 1 while the other is
25.44? Which can you compare across different pairs of variables, and why?*

**J7. [THEORY]** Study Hours `2, 4, 6` against Marks `90, 75, 50`. Is the covariance positive,
negative, or near zero? Explain without calculating. `[3]`

**J8. [THEORY]** Fill in the interpretation for each value: `+1`, `+0.8`, `+0.2`, `0`, `−0.2`,
`−0.8`, `−1`. `[4]`

**J9. [THEORY]** Ice-cream sales correlate strongly with drowning deaths. Does ice cream cause
drowning? Name the principle, and name the hidden variable. `[3]`

**J10. [THEORY]** `df.corr()` fails, or silently drops columns, if the DataFrame has text columns.
Why, and how do your `EDA.py` and `Correlation and covariance.py` handle it? `[3]`

**J11. [PROG]** Find and print the **pair of columns with the strongest correlation** in `df_viz`,
excluding the diagonal. `[5]`

### Viva

1. What is the range of a correlation coefficient?
2. What does a correlation of `0` mean — and what does it *not* rule out?
3. Why is covariance harder to interpret than correlation?
4. Does correlation prove causation?
