---
title: Python
description: Python notes from Fundamentals of AI — basics through NumPy, Pandas, and visualisation.
tags: [python]
---

# Python

## What's here

### 1 · Basics

| Page | Covers |
|---|---|
| [Values and Types](./01-basics/01-values-and-types.md) | `type()` vs `isinstance()`, dynamic typing, casting, truthiness |
| [Variables and Naming](./01-basics/02-variables-and-naming.md) | Identifier rules, the 35 keywords, PEP 8 conventions |
| [Data Types](./01-basics/03-data-types.md) | All eight built-ins — `int` `float` `str` `bool` `list` `tuple` `dict` `set` |
| [Expressions and Operators](./01-basics/04-expressions-and-operators.mdx) | Arithmetic, precedence, and five ways to structure the same answer |
| [F-Strings](./01-basics/05-f-strings.md) | Format specs, alignment, padding, debug mode |
| [Input and Output](./01-basics/06-input-output.md) | `input()`, `print()` with `sep` and `end` |

### 2 · Control Flow

| Page | Covers |
|---|---|
| [Conditional Statements](./02-control-flow/01-conditional-statements.md) | `if` / `elif` / `else`, nesting, `and` `or` `not`, ternary, `match` |
| [Loops](./02-control-flow/02-loops.md) | `for`, `range()`, `while`, `break`, `continue`, the loop `else`, nesting |

### 3 · Collections

| Page | Covers |
|---|---|
| [Strings and Slicing](./03-collections/01-strings-and-slicing.md) | Indexing, the three-part slice, immutability, string methods |
| [Lists](./03-collections/02-lists.md) | Mutating methods, `sort` vs `sorted`, the reference trap, comprehensions |
| [Tuples](./03-collections/03-tuples.md) | The trailing comma, shallow immutability, unpacking, tuple vs list |
| [Dictionaries and Sets](./03-collections/04-dicts-and-sets.md) | Key lookup, `.get()`, hashable keys, set algebra |

### 4 · NumPy

| Page | Covers |
|---|---|
| [Arrays and Attributes](./04-numpy/01-arrays-and-attributes.md) | Creating arrays, the six attributes, dtypes, array vs list |
| [Indexing, Slicing and Reshaping](./04-numpy/02-indexing-slicing-reshaping.md) | 2-D access, **views vs copies**, boolean masks, `reshape` |
| [Operations and Broadcasting](./04-numpy/03-operations-and-broadcasting.md) | Element-wise maths, broadcasting rules, ufuncs, `@`, sorting |
| [Aggregations and Statistics](./04-numpy/04-aggregations-and-statistics.md) | `mean`/`median`/`std`, the `axis` argument, `ddof`, `nan` |

### 5 · Pandas

| Page | Covers |
|---|---|
| [Series and DataFrames](./05-pandas/01-series-and-dataframes.md) | The two structures, the index, label vs position |
| [Loading and Saving Data](./05-pandas/02-loading-and-saving.md) | `read_csv`/`excel`/`json`, writing out, `index=False` |
| [Inspecting Data](./05-pandas/03-inspecting-data.md) | `head`, `shape`, `dtypes`, `info()`, `describe()` |
| [Cleaning Data](./05-pandas/04-cleaning-data.md) | `fillna` vs `dropna`, duplicates, type conversion |
| [Selecting and Transforming](./05-pandas/05-selecting-and-transforming.md) | `loc` vs `iloc`, filtering, sorting, `groupby`, `merge` |

### 6 · Statistics & EDA

| Page | Covers |
|---|---|
| [Descriptive Statistics](./06-statistics/01-descriptive-statistics.md) | Mean/median/mode, range, variance, std, quartiles, IQR outliers |
| [Correlation and Covariance](./06-statistics/02-correlation-and-covariance.md) | The −1 to +1 scale, why covariance can't be compared, what Pearson misses |
| [Exploratory Data Analysis](./06-statistics/03-exploratory-data-analysis.md) | The six-step EDA workflow, `crosstab`, binning |

### 7 · Visualization

| Page | Covers |
|---|---|
| [Choosing a Chart](./07-visualization/01-choosing-a-chart.md) | Which chart answers which question, and which library to use |
| [Matplotlib](./07-visualization/02-matplotlib.md) | Line, bar, histogram, scatter, pie, subplots, `savefig` |
| [Seaborn](./07-visualization/03-seaborn.md) | `data=`/`x=`/`y=`, box, violin, heatmap, pair plot |
| [Plotly](./07-visualization/04-plotly.md) | Interactive charts, `hover_data`, bubble charts, exporting |

## Practice questions {#practice-questions}

Most pages end with a **Practice Questions** section, drawn from the Unit 1 and Unit 2
question banks and grouped by their original section so you can cross-reference the paper.

| Tag | Means |
|---|---|
| **[OUT]** | *Predict the output.* Exact text — brackets, quotes, spacing, `NaN`, and the `dtype:` footer all count. |
| **[PROG]** | *Write the program.* Complete, runnable code. |
| **[THEORY]** | *Explain in words.* |
| **[PLOT]** | *Write the plotting code.* Include the title, axis labels and `plt.show()`. |

The number in `[ ]` is the mark allocation.

**No answers are included, deliberately.** Work each one out on paper first, then check it by
running the code — the page above it has everything you need.

Notes on `[OUT]` questions:

- `type(x)` prints `<class 'int'>`, not `int`
- Python prints strings with **single quotes**: `'mouse'`, not `"mouse"`
- Tuples print with `( )`, lists with `[ ]` — don't swap them
- A `Series` prints its index on the left **and** a `dtype:` line at the bottom; both are output
- Missing values print as `NaN`, never as `None` or blank
- One `NaN` makes the whole column `float64`, so `85` prints as `85.0`
- If a line raises, name the **exception type** and note that execution stops there

Notes get published a topic at a time, once the material is actually worked through
rather than just collected.
