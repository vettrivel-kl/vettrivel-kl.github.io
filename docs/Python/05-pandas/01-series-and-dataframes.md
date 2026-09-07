---
sidebar_position: 1
title: Series and DataFrames
description: The two pandas structures — a labelled 1-D Series and a 2-D DataFrame — and how the index changes everything.
tags: [python, pandas]
toc_max_heading_level: 3
---

# Series and DataFrames

> **Topic —** Pandas has two data structures. A `Series` is one labelled column; a
> `DataFrame` is a table of them.

```python
import pandas as pd
```

`pd` is the universal alias, as `np` is for NumPy. Pandas is built **on top of** NumPy — a
Series wraps an ndarray and adds an **index**.

| | Dimensions | Analogy |
|---|---|---|
| `Series` | 1 | one column of a spreadsheet |
| `DataFrame` | 2 | the whole spreadsheet |

---

## Creating a Series

### From a list

```python
data = pd.Series([10, 20, 30, 40])
print(data)
```

```text title="Output"
0    10
1    20
2    30
3    40
dtype: int64
```

Two things to read here. The left column is the **index** — pandas supplied `0, 1, 2, 3`
automatically because you didn't give one. And the last line, `dtype: int64`, is **not a
data row** — it's pandas telling you the element type, exactly like a NumPy
[dtype](../04-numpy/01-arrays-and-attributes.md#dtypes).

### With a custom index

```python
data = pd.Series([10, 20, 30, 40], index=["a", "b", "c", "d"])
print(data)
```

```text title="Output"
a    10
b    20
c    30
d    40
dtype: int64
```

The index is now labels instead of positions. This is the whole point of pandas over NumPy:
your data carries its own labels around with it.

### From a NumPy array

```python
import numpy as np

arr = np.array(["g", "e", "e", "k", "s"])
series = pd.Series(arr)
print(series)
```

```text title="Output"
0    g
1    e
2    e
3    k
4    s
dtype: object
```

`dtype: object` is how pandas stores strings. Since pandas sits on NumPy, converting between
the two is direct — see
[NumPy and pandas together](../04-numpy/04-aggregations-and-statistics.md#numpy-and-pandas-together).

### From a dictionary

```python
population_dict = {
    "Kerala": 395,
    "Goa": 291,
    "Assam": 2153,
    "Delhi": 2020,
}
population = pd.Series(population_dict)
print(population)
```

```text title="Output"
Kerala     395
Goa        291
Assam     2153
Delhi     2020
dtype: int64
```

**The dictionary keys become the index**, and the values become the data. Insertion order is
preserved — the same
[dict ordering guarantee](../03-collections/04-dicts-and-sets.md#dictionaries) from Python 3.7.

This is often the most natural way to build a Series, because a dict already pairs labels
with values.

---

## Accessing Series data

```python
data = pd.Series([100, 200, 300], index=["A", "B", "C"])
print(data["B"])      # → 200   by label
print(data.iloc[1])   # → 200   by position
```

```text title="Output"
200
200
```

Both give `200` here, but they're asking different questions — one by **label**, one by
**position**.

:::danger `[]` on a Series looks up the label, not the position

With a default index the two coincide, which hides the difference. Give the Series an
integer index that isn't in order and it bites:

```python
rev = pd.Series([10, 20, 30], index=[2, 1, 0])
print(rev)
print(rev[2])        # → 10   the item LABELLED 2, which is first
print(rev.iloc[2])   # → 30   the item at POSITION 2
```

```text title="Output"
2    10
1    20
0    30
dtype: int64
10
30
```

`rev[2]` returns `10`, not `30`. Use `.loc[]` when you mean labels and `.iloc[]` when you mean
positions — never bare `[]` for a single element. More on this in
[Selecting and Transforming](./05-selecting-and-transforming.md#loc-vs-iloc).

:::

---

## Series attributes

```python
s = pd.Series([10, 20, 30, 40], index=["a", "b", "c", "d"])
print("values:", s.values)
print("index:", list(s.index))
print("dtype:", s.dtype)
print("shape:", s.shape, "size:", s.size, "ndim:", s.ndim)
print("name:", s.name)
```

```text title="Output"
values: [10 20 30 40]
index: ['a', 'b', 'c', 'd']
dtype: int64
shape: (4,) size: 4 ndim: 1
name: None
```

| Attribute | Gives |
|---|---|
| `.values` | the underlying NumPy array |
| `.index` | the labels |
| `.dtype` | element type |
| `.shape` | `(n,)` — always 1-D |
| `.size` | number of elements |
| `.ndim` | always `1` |
| `.name` | the Series' own name, if any |

`.shape` and `.ndim` are the same attributes as on a NumPy array, and `.values` gets you
straight back to one.

`.name` matters more than it looks: when a Series becomes a DataFrame column, its `name`
becomes the column heading.

---

## Dtype follows the data

Same promotion rules as NumPy — one float makes it all float, anything non-numeric makes it
`object`:

```python
print(pd.Series([1, 2.5]).dtype)     # → float64
print(pd.Series([1, "x"]).dtype)     # → object
print(pd.Series(["a", "b"]).dtype)   # → object
```

```text title="Output"
float64
object
object
```

---

## A Series is vectorised

Everything from NumPy's
[element-wise operations](../04-numpy/03-operations-and-broadcasting.md) carries over — and
the index comes along for the ride:

```python
s = pd.Series([10, 20, 30, 40], index=["a", "b", "c", "d"])
print(s * 2)
print(s[s > 20])
```

```text title="Output"
a    20
b    40
c    60
d    80
dtype: int64
c    30
d    40
dtype: int64
```

`s * 2` doubles every value and keeps the labels. `s[s > 20]` is
[boolean masking](../04-numpy/02-indexing-slicing-reshaping.md#boolean-masking) — and note it
returns the matching rows *with their original labels* `c` and `d`, not renumbered. Labels
surviving every operation is what makes pandas useful.

---

## DataFrames

A DataFrame is a dict of Series sharing one index. The usual way to build one is from a dict
of lists, where **keys become column names**:

```python
df = pd.DataFrame({"Name": ["Arun", "Bala"], "Marks": [85, 72]})
print(df)
print("ndim:", df.ndim, "shape:", df.shape)
```

```text title="Output"
   Name  Marks
0  Arun     85
1  Bala     72
ndim: 2 shape: (2, 2)
```

`.shape` is `(rows, columns)`.

### Every column is a Series

```python
print(type(df["Name"]).__name__)   # → Series
```

```text title="Output"
Series
```

This is the connection worth holding on to: **selecting one column from a DataFrame gives you
a Series.** Everything on this page then applies to it — `.values`, `.dtype`, masking,
arithmetic. And the Series' `name` is the column name.

---

## Series vs DataFrame

| | `Series` | `DataFrame` |
|---|---|---|
| Dimensions | 1 | 2 |
| `.ndim` | `1` | `2` |
| `.shape` | `(n,)` | `(rows, cols)` |
| Has | one index | an index **and** columns |
| Holds | one dtype | one dtype **per column** |
| Built from | list, dict, ndarray | dict of lists, list of dicts, ndarray, CSV |
| You get one by | `df["col"]` | `pd.read_csv(...)` |

The dtype row is the important difference. A Series, like an ndarray, is homogeneous. A
DataFrame lets each column have its own type — which is why it can hold a real table with
names, ages and marks side by side, and why NumPy can't.

---

## Common Mistakes

| # | Mistake | Wrong | Right |
|---|---|---|---|
| 1 | Reading `dtype:` as a data row | it's metadata | the row count is `.size` |
| 2 | `s[2]` on a non-default index | looks up the **label** | `s.iloc[2]` for position |
| 3 | Expecting a dict's values to become the index | keys become the index | that's the design |
| 4 | `pd.Series(10, 20, 30)` | `TypeError` | `pd.Series([10, 20, 30])` |
| 5 | Confusing `.values` with `.index` | `.values` is the data | `.index` is the labels |
| 6 | Expecting `df["col"]` to be a DataFrame | it's a Series | `df[["col"]]` for a DataFrame |
| 7 | Assuming a filter renumbers | labels are preserved | `.reset_index(drop=True)` |

---

## Summary

| Task | Call |
|---|---|
| Series from a list | `pd.Series([...])` |
| Series with labels | `pd.Series([...], index=[...])` |
| Series from a dict | `pd.Series({...})` — keys become the index |
| Series from an array | `pd.Series(arr)` |
| Read by label / position | `s.loc[k]` / `s.iloc[i]` |
| Underlying array | `s.values` |
| DataFrame from a dict | `pd.DataFrame({"col": [...]})` |
| One column | `df["col"]` → Series |

**Key takeaways**

- A `Series` is 1-D with an index; a `DataFrame` is 2-D with an index *and* columns
- The trailing `dtype:` line when you print a Series is metadata, not data
- Dictionary **keys become the index** (Series) or the **column names** (DataFrame)
- `s["x"]` looks up a **label** — use `.iloc[]` when you mean a position
- Labels survive every operation, including filtering
- A Series holds one dtype; a DataFrame holds one **per column** — that's why tables need it
- `df["col"]` is a Series, so everything here applies to columns too

**See also:** [Loading and Saving Data](./02-loading-and-saving.md) ·
[Selecting and Transforming](./05-selecting-and-transforming.md) for `.loc` and `.iloc` in
depth · [Arrays and Attributes](../04-numpy/01-arrays-and-attributes.md) for the NumPy layer
underneath

---

## Run It Yourself

```python title="pandas_series.py"
import pandas as pd
import numpy as np

print("default index")
print(pd.Series([10, 20, 30, 40]))

print("\ncustom index")
s = pd.Series([10, 20, 30, 40], index=["a", "b", "c", "d"])
print(s)

print("\nfrom a dict — keys become the index")
print(pd.Series({"Kerala": 395, "Goa": 291, "Assam": 2153}))

print("\nfrom a numpy array")
print(pd.Series(np.array(["g", "e", "e", "k", "s"])))

print("\nattributes")
print(f"  {'values':<8} {s.values}")
print(f"  {'index':<8} {list(s.index)}")
print(f"  {'dtype':<8} {s.dtype}")
print(f"  {'shape':<8} {s.shape}")

print("\nvectorised, labels preserved")
print(s * 2)
print(s[s > 20])

print("\na DataFrame column is a Series")
df = pd.DataFrame({"Name": ["Arun", "Bala"], "Marks": [85, 72]})
print(df)
print(f"  df.shape        {df.shape}")
print(f"  type(df['Name']) {type(df['Name']).__name__}")
```

```text title="Output"
default index
0    10
1    20
2    30
3    40
dtype: int64

custom index
a    10
b    20
c    30
d    40
dtype: int64

from a dict — keys become the index
Kerala     395
Goa        291
Assam     2153
dtype: int64

from a numpy array
0    g
1    e
2    e
3    k
4    s
dtype: object

attributes
  values   [10 20 30 40]
  index    ['a', 'b', 'c', 'd']
  dtype    int64
  shape    (4,)

vectorised, labels preserved
a    20
b    40
c    60
d    80
dtype: int64
c    30
d    40
dtype: int64

a DataFrame column is a Series
   Name  Marks
0  Arun     85
1  Bala     72
  df.shape        (2, 2)
  type(df['Name']) Series
```

---

## Practice Questions

*From the Unit 1 question bank. Tags and marks are explained on the
[Python index](../index.md#practice-questions).*

### Unit 1 § K — Pandas

**K1. [PROG]** Create a pandas **Series** from `[10, 20, 30, 40]`. Then create the same Series
with a custom index `["a", "b", "c", "d"]`. Print both. `[3]`

**K2. [OUT]** What does printing a Series look like — and what is that extra last line? `[3]`

```python
import pandas as pd
s = pd.Series([10, 20, 30])
print(s)
```

**K3. [PROG]** Create a Series from the dictionary `{"Kerala": 395, "Goa": 291, "Assam": 2153}`.
What becomes the index? `[3]`

**K11. [THEORY]** What is the difference between a **Series** and a **DataFrame**? How many
dimensions does each have? `[3]`

### Viva

1. What does `df.shape` return, and in what order?
2. What is the difference between `df["A"]` and `df[["A"]]`?
