---
sidebar_position: 1
title: Choosing a Chart
description: Every chart type answers one specific question — pick the chart by starting from the question.
tags: [python, visualization]
toc_max_heading_level: 3
---

# Choosing a Chart

> **Topic —** Which plot to draw. Start from the **question**, not from the chart you feel like
> making.

Every chart type answers one kind of question well and everything else badly. Get this
backwards — pick a chart first, then look for something to say — and you end up with a
technically correct plot that communicates nothing.

---

## The cheat sheet

| Plot | Ask this question |
|---|---|
| **Line** | How does something change? |
| **Multiple line** | How do multiple things change compared with each other? |
| **Scatter** | Are two numerical variables related? |
| **Multiple scatter** | How do multiple numerical relationships compare? |
| **Bar** | Which category has more or less? |
| **Horizontal bar** | Same as bar, but for long category labels |
| **Multiple bar** | How do multiple values compare for each category? |
| **Stacked bar** | What parts make up each total? |
| **Pie** | What percentage of the whole does each category represent? |
| **Exploded pie** | Which slice do I want to highlight? |
| **Donut** | Same as pie, different appearance |
| **Histogram** | How are numerical values distributed? |
| **Multiple histogram** | How do multiple distributions compare? |
| **Box plot** | What is the centre, spread and possible outliers? |
| **Box plot with labels** | What are the five-number summary values? |
| **Multiple box plot** | How do several numerical distributions compare? |

---

## Grouped by what you're asking

### "How does it change?" → line

A line implies a **connection** between consecutive points, so the x-axis needs a natural
order — time, most often. Days, months, epochs, trial numbers.

:::warning A line over unordered categories is misleading

Plotting marks against student names with a line, as
[the matplotlib page does](./02-matplotlib.md#line-plot), draws a line between Arun and Bala —
implying Arun *becomes* Bala. There's no such relationship. Alphabetical order is not an axis.

It's a fine first exercise for learning the syntax. Just don't ship it.

:::

### "Which is bigger?" → bar

Bars compare magnitudes across categories. The comparison is by **length**, which the eye reads
accurately.

Bars must start at **zero**. Truncating the axis makes a 5% difference look like a 5× one, and
it's the most common way charts mislead.

Use horizontal bars when labels are long — rotated text is hard to read.

### "Are these two related?" → scatter

One point per observation, two numeric axes. This is the chart that shows the *shape* of a
relationship, and it's why
[correlation alone isn't enough](../06-statistics/02-correlation-and-covariance.md#it-only-sees-straight-lines) —
a scatter plot would show the `y = x²` parabola that correlation reports as `0.0`.

Add a third variable through **colour**, a fourth through **size** (a bubble chart). Beyond that
it stops being readable.

### "How is this spread out?" → histogram

Bins one numeric column and counts how many values fall in each. This shows the *distribution* —
where values cluster, whether it's symmetric, whether there are two peaks.

A histogram is not a bar chart. Bars compare **categories**; a histogram shows the shape of
**one numeric column**, and its x-axis is a continuous number line with no gaps between bars.

:::note Bin count changes the story

Too few bins hides structure; too many turns it into noise. With ten values, `bins=5` is about
right. Always try a couple of values before believing what you see.

:::

### "What's the centre, spread and outliers?" → box plot

The densest summary available. One box encodes five numbers plus outliers:

```text
      ┌─────┬───────┐
  ├───┤     │       ├───┤        ○
      └─────┴───────┘
  │   │     │       │   │        │
 min  Q1  median   Q3  max    outlier
      └── IQR ─────┘
      whisker = 1.5 x IQR
```

Exactly the [quartiles and IQR fence](../06-statistics/01-descriptive-statistics.md#quartiles)
from the statistics notes, drawn. Side by side, box plots compare several distributions at once —
which is what makes them the best chart for "do these groups differ?".

A **violin plot** is a box plot with the distribution's shape drawn as width. It shows things a
box hides, like two separate clusters.

### "What share of the total?" → pie

Pie charts answer exactly one question: what fraction of the whole is each part?

:::danger Pie charts are usually the wrong choice

The eye compares **angles** badly and **lengths** well, so a bar chart is easier to read for
almost any comparison. Pies also need parts that sum to a meaningful whole — percentages of a
single total.

Use one when there are 2–5 categories, they sum to 100%, and "share of total" is genuinely the
point. Otherwise use bars.

:::

---

## Chart by data shape

Work from what you have, not what looks good:

| You have | Ask | Chart |
|---|---|---|
| 1 numeric column | how is it distributed? | histogram, box plot |
| 1 categorical column | how many of each? | bar (count plot) |
| 1 categorical + 1 numeric | which category is higher? | bar |
| 1 categorical + 1 numeric | how does each group's spread compare? | box, violin |
| 2 numeric columns | are they related? | scatter |
| 2 numeric, one ordered | how does it change? | line |
| 3+ numeric columns | what correlates with what? | heatmap, pair plot |
| categories summing to a whole | what share is each? | pie (or bars) |

---

## Which library?

| | Matplotlib | Seaborn | Plotly |
|---|---|---|---|
| Level | low — you draw it | high — you describe it | high, interactive |
| Statistical charts | manual | **built in** | built in |
| Works with DataFrames | column by column | `data=df, x=, y=` | `df, x=, y=` |
| Interactive | ❌ | ❌ | ✅ hover, zoom, pan |
| Output | image | image | HTML |
| Default appearance | plain | good | polished |
| Control | total | good, escapes to matplotlib | good |

**Seaborn is built on Matplotlib** — `sns.boxplot()` returns matplotlib axes, and you style it
with `plt.title()`. They're one system, not two. Learn matplotlib's vocabulary and seaborn's
shortcuts.

**Plotly is separate**, and produces HTML rather than an image. That's the point — hover, zoom
and pan — and also the catch, since it can't be pasted into a document as-is.

**In practice:** Seaborn for statistical charts, Matplotlib underneath for control, Plotly when
someone needs to explore rather than just read.

---

## Common Mistakes

| # | Mistake | Why it's wrong |
|---|---|---|
| 1 | Line plot over unordered categories | implies a progression that doesn't exist |
| 2 | Bar chart not starting at zero | exaggerates small differences |
| 3 | Pie chart with many slices | angles are hard to compare |
| 4 | Pie chart of parts that don't sum to a whole | the fractions mean nothing |
| 5 | Histogram where a bar chart belongs | histograms are for one numeric column |
| 6 | Ignoring bin count | changes the apparent shape |
| 7 | No axis labels or title | the reader can't know what they're seeing |
| 8 | 3-D charts for 2-D data | perspective distorts the values |
| 9 | Colour as the only distinction | fails for colour-blind readers and in print |
| 10 | Plotting before EDA | you don't yet know what's worth showing |

---

## Summary

**The question → the chart**

- change over an ordered axis → **line**
- compare categories → **bar**
- relationship between two numbers → **scatter**
- distribution of one number → **histogram**
- centre, spread, outliers → **box** (or **violin**)
- share of a whole → **pie**, reluctantly
- what correlates with what → **heatmap**

**Key takeaways**

- Start from the question; the chart follows
- A line needs an ordered x-axis — names in alphabetical order aren't one
- Bars start at zero, always
- Histograms are for one numeric column; bars are for categories
- A box plot draws the five-number summary and the `1.5 × IQR` fence
- Pie charts answer only "what share of the total", and bars usually answer it better
- Seaborn sits on top of Matplotlib — same system, shorter syntax
- Plotly gives interactivity at the cost of being HTML rather than an image

**See also:** [Matplotlib](./02-matplotlib.md) · [Seaborn](./03-seaborn.md) ·
[Plotly](./04-plotly.md) ·
[Exploratory Data Analysis](../06-statistics/03-exploratory-data-analysis.md) for what to look
at before plotting

---

## Practice Questions

*From the Unit 2 question bank. Tags and marks are explained on the
[Python index](../index.md#practice-questions).*

### Unit 2 § N — Choosing the Right Chart

For each question, name the **single best** plot. One mark each — `[14]` total.

1. How did our sales change over the last 12 months?
2. How do the sales of four different companies compare over the same 12 months?
3. Are study hours related to marks?
4. Which department has the most students?
5. What percentage of our students is in each department?
6. How are marks distributed across the class?
7. What is the median, spread and are there any outliers in the marks?
8. How do the marks distributions of CSE, IT and ECE compare?
9. Which pairs of numeric columns in my dataset are correlated?
10. What parts make up each department's total headcount?
11. I want the same comparison as a bar chart, but the category names are long.
12. Every possible pairwise relationship between all my numeric columns at once.
13. The distribution of marks per department, showing each individual student as a point.
14. I want to highlight one specific slice of a proportional breakdown.

**N15. [THEORY]** You have one **categorical** column and one **numerical** column. Name three
plots that suit this pair, and say what each emphasises. `[3]`

**N16. [THEORY]** Why is a pie chart a poor choice when there are 12 categories? Name a better
alternative. `[3]`

### Viva

1. What is the difference between a histogram and a bar chart?
2. Which plot answers "are these two numerical variables related?"
