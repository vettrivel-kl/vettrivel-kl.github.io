---
sidebar_position: 5
title: Selecting and Transforming
description: Column selection, loc vs iloc, filtering, sorting, adding columns, groupby, merge and concat.
tags: [python, pandas]
toc_max_heading_level: 3
---

# Selecting and Transforming

> **Topic —** The working vocabulary of pandas — pick out what you need, filter it, sort it,
> add to it, group it, and join it.

```python
import pandas as pd

df = pd.DataFrame({
    "StudentID": [101, 102, 103, 104, 105],
    "Name": ["Arun", "Bala", "Charan", "Divya", "Esha"],
    "Department": ["CSE", "IT", "CSE", "ECE", "CSE"],
    "Age": [20, 21, 20, 22, 21],
    "Marks": [85, 72, 91, 65, 88],
})
print(df)
```

```text title="Output"
   StudentID    Name Department  Age  Marks
0        101    Arun        CSE   20     85
1        102    Bala         IT   21     72
2        103  Charan        CSE   20     91
3        104   Divya        ECE   22     65
4        105    Esha        CSE   21     88
```

---

## Selecting columns

### One column → a Series

```python
print(df["Name"])
```

```text title="Output"
0      Arun
1      Bala
2    Charan
3     Divya
4      Esha
Name: Name, dtype: object
```

The trailing `Name: Name, dtype: object` is metadata — the Series' own
[name](./01-series-and-dataframes.md#series-attributes) and dtype, not data.

### Double brackets → a DataFrame

```python
print(df[["Name"]])
```

```text title="Output"
     Name
0    Arun
1    Bala
2  Charan
3   Divya
4    Esha
```

:::note One bracket or two changes the type

`df["Name"]` is a **Series**; `df[["Name"]]` is a **DataFrame** with one column. The inner
brackets are a *list of columns*, so a one-item list still produces a table.

It matters when a function insists on a DataFrame, or when you're chaining `.shape` — `(5,)`
versus `(5, 1)`. Same distinction as
[indexing vs slicing a NumPy dimension](../04-numpy/02-indexing-slicing-reshaping.md#2-d-slicing).

:::

### Several columns

```python
print(df[["Name", "Marks"]])
```

```text title="Output"
     Name  Marks
0    Arun     85
1    Bala     72
2  Charan     91
3   Divya     65
4    Esha     88
```

Order follows your list, not the DataFrame's.

---

## `loc` vs `iloc`

Two accessors, and mixing them up is the most common pandas bug.

| | Uses | Slice endpoint |
|---|---|---|
| `.loc[]` | **labels** | **inclusive** |
| `.iloc[]` | **integer positions** | exclusive |

### `.loc` — by label

```python
print(df.loc[2])
```

```text title="Output"
StudentID        103
Name          Charan
Department       CSE
Age               20
Marks             91
Name: 2, dtype: object
```

A single row comes back as a Series, with the column names as its index. `dtype: object`
because the row mixes ints and strings.

```python
print(df.loc[2, "Marks"])   # → 91
```

Row label `2`, column `"Marks"` — the clearest way to read one cell.

### `.iloc` — by position

```python
print(df.iloc[2])
print(df.iloc[2, 4])   # → 91
```

```text title="Output"
StudentID        103
Name          Charan
Department       CSE
Age               20
Marks             91
Name: 2, dtype: object
```

Same result here, because this DataFrame has a default `0`–`4` index where label equals
position. `df.iloc[2, 4]` means row 2, **column 4** — you have to count columns
(`StudentID`=0, `Name`=1, `Department`=2, `Age`=3, `Marks`=4).

:::warning `iloc` with numbers is fragile

`df.iloc[2, 4]` breaks silently the moment someone inserts a column. `df.loc[2, "Marks"]` keeps
working. Prefer `.loc` with names unless you specifically want positional access.

And once the index isn't a plain `0..n` — after
[`drop_duplicates`](./04-cleaning-data.md#step-3--remove-duplicates), a filter, or a sort — the
two stop agreeing entirely.

:::

### The slice difference

```python
print(df.loc[1:3])    # rows labelled 1, 2 AND 3
print(df.iloc[1:3])   # positions 1, 2 — NOT 3
```

```text title="loc[1:3] — 3 rows"
   StudentID    Name Department  Age  Marks
1        102    Bala         IT   21     72
2        103  Charan        CSE   20     91
3        104   Divya        ECE   22     65
```

```text title="iloc[1:3] — 2 rows"
   StudentID    Name Department  Age  Marks
1        102    Bala         IT   21     72
2        103  Charan        CSE   20     91
```

:::danger `.loc` slices are inclusive

This is the exception to every other slice in Python. Lists, strings, tuples, NumPy arrays and
`.iloc` all **exclude** the endpoint. `.loc` **includes** it.

`df.loc[1:3]` gives three rows; `df.iloc[1:3]` gives two. It's inconsistent, it's deliberate
(labels aren't necessarily numbers, so "one past the end" is meaningless), and it will catch
you.

:::

Rows and columns together:

```python
print(df.loc[1:3, ["Name", "Marks"]])
```

```text title="Output"
     Name  Marks
1    Bala     72
2  Charan     91
3   Divya     65
```

---

## Filtering rows

Put a boolean condition inside the brackets:

```python
print(df[df["Marks"] > 80])
```

```text title="Output"
   StudentID    Name Department  Age  Marks
0        101    Arun        CSE   20     85
2        103  Charan        CSE   20     91
4        105    Esha        CSE   21     88
```

`df["Marks"] > 80` produces a boolean Series; indexing with it keeps the `True` rows. Exactly
[NumPy boolean masking](../04-numpy/02-indexing-slicing-reshaping.md#boolean-masking), with
labels preserved — note the index is `0, 2, 4`, not renumbered.

### Multiple conditions

```python
print(df[(df["Department"] == "CSE") & (df["Marks"] > 85)])
```

```text title="Output"
   StudentID    Name Department  Age  Marks
2        103  Charan        CSE   20     91
4        105    Esha        CSE   21     88
```

:::danger `&` not `and`, and parenthesise every condition

```python
df[(df["Department"] == "CSE") and (df["Marks"] > 85)]
```

```text title="Error"
ValueError: The truth value of a Series is ambiguous. Use a.empty, a.bool(), a.item(), a.any() or a.all().
```

**Why `and` fails:** `and` needs each side to be a single `True` or `False`. Each side here is a
Series of five booleans, and pandas refuses to guess whether "a Series is true" means *all* of
them or *any* of them. `&` is the element-wise operator, which is what you actually want.

**Why the parentheses are compulsory:** `&` binds **tighter than** `==` and `>`. Without them,
`df["Department"] == "CSE" & df["Marks"] > 85` is parsed as
`df["Department"] == ("CSE" & df["Marks"]) > 85` — nonsense that errors out or, worse, silently
gives the wrong rows.

:::

| Meaning | Use | Not |
|---|---|---|
| and | `&` | `and` |
| or | `\|` | `or` |
| not | `~` | `not` |

### `query()`

A string-based alternative that avoids the punctuation entirely:

```python
print(df.query("Marks > 80"))
print(df.query("Department == 'CSE' and Marks > 85"))
```

```text title="Output"
   StudentID    Name Department  Age  Marks
0        101    Arun        CSE   20     85
2        103  Charan        CSE   20     91
4        105    Esha        CSE   21     88
   StudentID    Name Department  Age  Marks
2        103  Charan        CSE   20     91
4        105    Esha        CSE   21     88
```

Inside `query()` you write `and`, `or` and `not` as words, column names bare, and no
parentheses are needed. Note the nested quotes: single inside double.

The trade-off is that it's a string, so your editor can't check the column names. Handy for
quick work and long conditions.

---

## Sorting

```python
print(df.sort_values(by="Marks"))
```

```text title="Output"
   StudentID    Name Department  Age  Marks
3        104   Divya        ECE   22     65
1        102    Bala         IT   21     72
0        101    Arun        CSE   20     85
4        105    Esha        CSE   21     88
2        103  Charan        CSE   20     91
```

```python
print(df.sort_values(by="Marks", ascending=False))
```

```text title="Output"
   StudentID    Name Department  Age  Marks
2        103  Charan        CSE   20     91
4        105    Esha        CSE   21     88
0        101    Arun        CSE   20     85
1        102    Bala         IT   21     72
3        104   Divya        ECE   22     65
```

The index travels with the rows — `3, 1, 0, 4, 2`. The rows moved; their labels didn't change.
This is why `.reset_index(drop=True)` matters after sorting if you then want to use `.iloc`.

Sort by several columns, each with its own direction:

```python
print(df.sort_values(by=["Department", "Marks"], ascending=[True, False]))
```

```text title="Output"
   StudentID    Name Department  Age  Marks
2        103  Charan        CSE   20     91
4        105    Esha        CSE   21     88
0        101    Arun        CSE   20     85
3        104   Divya        ECE   22     65
1        102    Bala         IT   21     72
```

Department ascending, then marks descending within each department.

`sort_index()` sorts by the index instead. Both return a new DataFrame.

---

## Adding and changing columns

### Add from a list

```python
df["Result"] = ["Pass", "Pass", "Pass", "Pass", "Pass"]
print(df)
```

```text title="Output"
   StudentID    Name Department  Age  Marks Result
0        101    Arun        CSE   20     85   Pass
1        102    Bala         IT   21     72   Pass
2        103  Charan        CSE   20     91   Pass
3        104   Divya        ECE   22     65   Pass
4        105    Esha        CSE   21     88   Pass
```

The list length must match the row count exactly, or you get a `ValueError`.

### Derive from another column

Better than a hand-written list — it can't fall out of sync:

```python
df["Grade"] = df["Marks"].apply(lambda m: "A" if m >= 85 else "B")
print(df)
```

```text title="Output"
   StudentID    Name Department  Age  Marks Result Grade
0        101    Arun        CSE   20     85   Pass     A
1        102    Bala         IT   21     72   Pass     B
2        103  Charan        CSE   20     91   Pass     A
3        104   Divya        ECE   22     65   Pass     B
4        105    Esha        CSE   21     88   Pass     A
```

`.apply()` runs a function on every value. For simple conditions `np.where(df["Marks"] >= 85,
"A", "B")` is faster, since `.apply` loops in Python.

### Update a whole column

```python
df["Marks"] = df["Marks"] + 5
print(df)
```

```text title="Output"
   StudentID    Name Department  Age  Marks Result Grade
0        101    Arun        CSE   20     90   Pass     A
1        102    Bala         IT   21     77   Pass     B
2        103  Charan        CSE   20     96   Pass     A
3        104   Divya        ECE   22     70   Pass     B
4        105    Esha        CSE   21     93   Pass     A
```

Five grace marks, vectorised — no loop. Note `Grade` is now **stale**: it was computed from the
old marks and wasn't recalculated. Derived columns don't update themselves.

### Delete a column

```python
temp_df = df.drop(columns=["Result"])
print(temp_df)
print("Result" in df.columns)   # → True
```

```text title="Output"
   StudentID    Name Department  Age  Marks Grade
0        101    Arun        CSE   20     90     A
1        102    Bala         IT   21     77     B
2        103  Charan        CSE   20     96     A
3        104   Divya        ECE   22     70     B
4        105    Esha        CSE   21     93     A
True
```

`drop()` returns a **new** DataFrame — the original still has `Result`. Assign the result back
if you want the change to stick.

`df.drop(index=[0, 1])` drops rows instead.

---

## `groupby()`

Split rows into groups, compute something per group, combine the answers.

```python
print(df.groupby("Department")["Marks"].mean())
```

```text title="Output"
Department
CSE    93.0
ECE    70.0
IT     77.0
Name: Marks, dtype: float64
```

Read it as three steps: **group by** `Department` → take the `Marks` **column** → apply
`mean()`. The grouping column becomes the index, sorted alphabetically.

### Several statistics at once

```python
print(df.groupby("Department")["Marks"].agg(["mean", "max", "min", "count"]))
```

```text title="Output"
            mean  max  min  count
Department                       
CSE         93.0   96   90      3
ECE         70.0   70   70      1
IT          77.0   77   77      1
```

`count` is doing real work here — `ECE`'s "average" of 70 comes from a **single student**. A
group mean without its count is easy to over-read.

### Variations

```python
print(df.groupby("Department").size())
print(df.groupby("Department")[["Marks", "Age"]].mean())
print(df.groupby("Department", as_index=False)["Marks"].mean())
```

```text title="Output"
Department
CSE    3
ECE    1
IT     1
dtype: int64
            Marks        Age
Department                  
CSE          93.0  20.333333
ECE          70.0  22.000000
IT           77.0  21.000000
   Department  Marks
0        CSE   93.0
1        ECE   70.0
2         IT   77.0
```

`.size()` counts rows per group. A list of columns aggregates several at once. `as_index=False`
keeps `Department` as a normal column instead of making it the index — useful when you're about
to save or merge the result.

---

## Joining DataFrames

### `merge()` — join on a key

```python
student_details = pd.DataFrame({
    "StudentID": [101, 102, 103],
    "Name": ["Arun", "Bala", "Charan"],
})
student_marks = pd.DataFrame({
    "StudentID": [101, 102, 103],
    "Marks": [90, 77, 96],
})
print(pd.merge(student_details, student_marks, on="StudentID"))
```

```text title="Output"
   StudentID    Name  Marks
0        101    Arun     90
1        102    Bala     77
2        103  Charan     96
```

This is a SQL join. `on="StudentID"` is the shared key; matching rows are combined
side by side.

### When keys don't match

```python
student_marks2 = pd.DataFrame({"StudentID": [101, 102], "Marks": [90, 77]})
print(pd.merge(student_details, student_marks2, on="StudentID", how="left"))
print(pd.merge(student_details, student_marks2, on="StudentID", how="inner"))
```

```text title="Output"
   StudentID    Name  Marks
0        101    Arun   90.0
1        102    Bala   77.0
2        103  Charan    NaN
   StudentID  Name  Marks
0        101  Arun     90
1        102  Bala     77
```

| `how=` | Keeps |
|---|---|
| `"inner"` | only keys in **both** (**default**) |
| `"left"` | all left rows; `NaN` where the right has no match |
| `"right"` | all right rows |
| `"outer"` | everything from both |

:::warning The default silently drops rows

`how="inner"` is the default, so Charan **disappears** from the inner join without warning. Check
`len()` before and after a merge — a row count that shrank unexpectedly means unmatched keys.

Note also that `how="left"` turned `Marks` into `float64`, because the `NaN` forced it — the
same [promotion](./02-loading-and-saving.md#nan-forces-a-float-column) as reading a CSV with
blanks.

:::

### `concat()` — stack rows

```python
df1 = pd.DataFrame({"Name": ["Arun", "Bala"], "Marks": [85, 72]})
df2 = pd.DataFrame({"Name": ["Charan", "Divya"], "Marks": [91, 65]})
print(pd.concat([df1, df2], ignore_index=True))
```

```text title="Output"
     Name  Marks
0    Arun     85
1    Bala     72
2  Charan     91
3   Divya     65
```

Without `ignore_index=True`:

```python
print(pd.concat([df1, df2]))
```

```text title="Output"
     Name  Marks
0    Arun     85
1    Bala     72
0  Charan     91
1   Divya     65
```

**The index reads `0, 1, 0, 1`** — both original indexes were kept, so labels are now duplicated.
`df.loc[0]` would return two rows. Pass `ignore_index=True` unless you have a reason not to.

**merge vs concat:** `merge` joins **side by side on a key** (adds columns); `concat` stacks
**one on top of another** (adds rows). Use `pd.concat([...], axis=1)` to concatenate by column
position instead, but merging on a key is almost always what you want.

---

## Common Mistakes

| # | Mistake | Wrong | Right |
|---|---|---|---|
| 1 | `and` in a filter | `ValueError: truth value ... ambiguous` | `&` |
| 2 | Missing parentheses | `&` binds tighter than `==` | `(a == x) & (b > y)` |
| 3 | Expecting `.loc[1:3]` to exclude 3 | it's **inclusive** | `.iloc[1:3]` excludes |
| 4 | `.iloc` after a filter or sort | positions no longer match labels | `.loc`, or `reset_index` |
| 5 | Not assigning `drop()`'s result | original unchanged | `df = df.drop(columns=[...])` |
| 6 | `df["col"]` where a DataFrame is needed | that's a Series | `df[["col"]]` |
| 7 | `concat` without `ignore_index` | duplicate index labels | `ignore_index=True` |
| 8 | Ignoring merge's default | `inner` drops unmatched rows | check `len()`, or use `how="left"` |
| 9 | Reading a group mean without its count | 1-row groups look meaningful | include `"count"` in `.agg` |
| 10 | Forgetting derived columns are static | `Grade` stale after `Marks` changed | recompute after updating |

---

## Summary

| Task | Call |
|---|---|
| One column (Series) | `df["col"]` |
| One column (DataFrame) | `df[["col"]]` |
| Several columns | `df[["a", "b"]]` |
| Row by label | `df.loc[2]` |
| Row by position | `df.iloc[2]` |
| One cell | `df.loc[2, "col"]` |
| Filter | `df[df["col"] > x]` |
| Multiple conditions | `df[(c1) & (c2)]` |
| String-based filter | `df.query("col > x")` |
| Sort | `df.sort_values(by="col", ascending=False)` |
| Add / update a column | `df["new"] = ...` |
| Derive a column | `df["new"] = df["c"].apply(f)` |
| Drop a column | `df.drop(columns=["c"])` |
| Group and aggregate | `df.groupby("c")["v"].mean()` |
| Several statistics | `.agg(["mean", "max", "count"])` |
| Join on a key | `pd.merge(a, b, on="k", how="left")` |
| Stack rows | `pd.concat([a, b], ignore_index=True)` |

**Key takeaways**

- `df["c"]` is a Series, `df[["c"]]` is a DataFrame
- `.loc` uses labels and its slices are **inclusive**; `.iloc` uses positions and excludes
- Prefer `.loc` with column names — `.iloc[2, 4]` breaks when columns move
- Filters need `&`, `|`, `~`, and **every condition parenthesised**
- Filtering and sorting **preserve index labels** — reset if you'll use `.iloc` afterwards
- `drop()`, `sort_values()` and friends return new DataFrames; assign the result back
- Derived columns don't recompute themselves when their source changes
- `groupby` puts the grouping column in the index unless you pass `as_index=False`
- Always report a group `count` alongside a group mean
- `merge` defaults to an **inner** join and drops unmatched rows silently
- `concat` without `ignore_index=True` leaves duplicate index labels

**See also:** [Cleaning Data](./04-cleaning-data.md) for getting data into this state ·
[Inspecting Data](./03-inspecting-data.md) ·
[Operations and Broadcasting](../04-numpy/03-operations-and-broadcasting.md) for the
vectorisation underneath

---

## Run It Yourself

```python title="pandas_transform.py"
import pandas as pd

df = pd.read_csv("students.csv")
df["Age"] = df["Age"].fillna(df["Age"].mean())
df["Marks"] = df["Marks"].fillna(df["Marks"].median())
df = df.drop_duplicates().reset_index(drop=True)

print("cleaned data")
print(df)

print("\ntwo columns")
print(df[["Name", "Marks"]])

print("\none cell — df.loc[2, 'Marks']:", df.loc[2, "Marks"])

print("\nMarks >= 80")
print(df[df["Marks"] >= 80])

print("\nCSE and Marks >= 80")
print(df[(df["Department"] == "CSE") & (df["Marks"] >= 80)])

print("\nsorted by Marks, descending")
print(df.sort_values(by="Marks", ascending=False))

print("\nderived Grade column")
df["Grade"] = df["Marks"].apply(lambda m: "A" if m >= 85 else "B")
print(df)

print("\naverage marks per department")
print(df.groupby("Department")["Marks"].mean())

print("\nwith counts — note ECE has one student")
print(df.groupby("Department")["Marks"].agg(["mean", "max", "count"]))
```

```text title="Output"
cleaned data
     Name Department   Age  Marks
0    Arun        CSE  20.0   85.0
1    Bala         IT  21.0   72.0
2  Charan        CSE  21.0   91.0
3   Divya        ECE  22.0   65.0
4    Esha        CSE  21.0   72.0

two columns
     Name  Marks
0    Arun   85.0
1    Bala   72.0
2  Charan   91.0
3   Divya   65.0
4    Esha   72.0

one cell — df.loc[2, 'Marks']: 91.0

Marks >= 80
     Name Department   Age  Marks
0    Arun        CSE  20.0   85.0
2  Charan        CSE  21.0   91.0

CSE and Marks >= 80
     Name Department   Age  Marks
0    Arun        CSE  20.0   85.0
2  Charan        CSE  21.0   91.0

sorted by Marks, descending
     Name Department   Age  Marks
2  Charan        CSE  21.0   91.0
0    Arun        CSE  20.0   85.0
1    Bala         IT  21.0   72.0
4    Esha        CSE  21.0   72.0
3   Divya        ECE  22.0   65.0

derived Grade column
     Name Department   Age  Marks Grade
0    Arun        CSE  20.0   85.0     A
1    Bala         IT  21.0   72.0     B
2  Charan        CSE  21.0   91.0     A
3   Divya        ECE  22.0   65.0     B
4    Esha        CSE  21.0   72.0     B

average marks per department
Department
CSE    82.666667
ECE    65.000000
IT     72.000000
Name: Marks, dtype: float64

with counts — note ECE has one student
                 mean   max  count
Department                        
CSE         82.666667  91.0      3
ECE         65.000000  65.0      1
IT          72.000000  72.0      1
```

---

## Practice Questions

*Tags and marks are explained on the [Python index](../index.md#practice-questions).*

### Unit 1 § K — Pandas

**K7. [PROG]** Sort the students by **Marks** — ascending, then descending. `[3]`

**K8. [PROG]** Display only the students who scored **80 or above**. `[3]`

**K9. [PROG]** Display students who are in **CSE** *and* scored **80 or above**. `[4]`

**K10. [THEORY]** In K9 you must write `&`, not `and`. Explain what goes wrong if you write
`and`, and why the parentheses around each condition are compulsory. `[4]`

**K12. [PROG]** Display the **average marks per department** from `students.csv`. `[4]`

### Unit 2 § D — Selection & Filtering

**D1. [OUT]** The types matter here. `[4]`

```python
print(type(df_eda["Name"]))
print(type(df_eda[["Name"]]))
print(df_eda["Name"].shape)
print(df_eda[["Name"]].shape)
```

**D2. [PROG]** From `df_eda`, select the `Name` column alone, then the `Name` and `Marks` columns
together. `[3]`

**D3. [OUT]** Using the `Data manipulation.py` DataFrame (`StudentID`, `Name`, `Department`, `Age`,
`Marks`; 5 rows starting at 101): `[5]`

```python
print(df.loc[2])
print(df.loc[2, "Marks"])
print(df.iloc[2])
print(df.iloc[2, 4])
```

*Write the full Series output for `df.loc[2]` — index labels, values, `Name:` line and `dtype:`
line.*

**D4. [THEORY]** Explain the difference between `loc[]` and `iloc[]`. Then explain why
`df.loc[1:3]` returns **three** rows but `df.iloc[1:3]` returns **two**. `[4]`

**D5. [PROG]** From `df_eda`, display all students with Marks greater than 80. `[3]`

**D6. [PROG]** From `df_eda`, display all **CSE** students with Marks above 85. `[4]`

**D7. [THEORY]** In D6 you must write `&` and wrap each condition in parentheses. Explain what
goes wrong with `and`, and what goes wrong without the parentheses. `[4]`

**D8. [PROG]** Rewrite D5 using `query()`. Give one advantage and one disadvantage of `query()`
over boolean indexing. `[4]`

**D9. [OUT]** `[3]`

```python
print(df_eda[df_eda["Marks"] > 80].shape)
print((df_eda["Marks"] > 80).sum())
print(df_eda["Marks"] > 80)
```

*What is the dtype of the third result, and why does `.sum()` work on it?*

**D10. [PROG]** Select students whose Department is either `CSE` **or** `IT`, using `isin()`. `[3]`

### Unit 2 § E — Data Manipulation

**E1. [PROG]** Sort `df_eda` by Marks ascending, then descending. `[3]`

**E2. [THEORY]** `df.sort_values(by="Marks")` doesn't change `df`. Why not, and what are the two
ways to make the change stick? `[3]`

**E3. [PROG]** Add a new column `Result` that holds `"Pass"` if Marks ≥ 75 and `"Fail"`
otherwise. `[4]`

**E4. [PROG]** Add 5 grace marks to every student's Marks, then display the DataFrame. `[3]`

**E5. [PROG]** Add a `Grade` column using `if...elif...else` logic: **A** (90+), **B** (75–89),
**C** (50–74), **Fail** (below 50). Do it with `apply()`. `[5]`

**E6. [PROG]** Delete the `Result` column — once making a copy, once modifying the original in
place. `[3]`

**E7. [OUT]** `[3]`

```python
df = pd.DataFrame({"A": [1, 2], "B": [3, 4]})
temp = df.drop(columns=["B"])
print(temp)
print(df)
```

*Why does `df` still have column `B`?*

**E8. [PROG]** Rename `Marks` to `Total_Marks` and `Age` to `Student_Age`. `[3]`

**E9. [PROG]** Sort by Department ascending **and** Marks descending at the same time. `[3]`

### Unit 2 § F — GroupBy & Aggregation

**F1. [PROG]** Display the average Marks per Department for `df_eda`. `[3]`

**F2. [OUT]** For `df_eda`: `[4]`

```python
print(df_eda.groupby("Department")["Marks"].mean())
```

*Work the three averages out by hand. CSE = Arun 85, Charan 91, Esha 88, Hari 95. IT = Bala 72,
Farah 76, Indhu 70. ECE = Divya 65, Gokul 80, Jaya 82.*

**F3. [PROG]** For each Department show the **count, mean, min and max** of Marks in one
table. `[4]`

**F4. [THEORY]** What does `groupby()` return on its own, before you aggregate? Why does printing
it not show a table? `[3]`

**F5. [PROG]** Group by Department and aggregate **different functions on different columns** —
mean of Marks, max of Attendance, count of Name. `[4]`

**F6. [THEORY]** In `df.groupby("Department")["Marks"].mean()`, what becomes the **index** of the
result? How do you turn it back into an ordinary column? `[3]`

**F7. [PROG]** Find the **topper of each department** — the full row, not just the mark. `[5]`

**F8. [OUT]** Explain the difference in shape between these two. `[3]`

```python
print(df_eda.groupby("Department")["Marks"].mean())
print(df_eda.groupby("Department")[["Marks"]].mean())
```

**F9. [PROG]** Sort the departments by their average Marks, highest first. `[3]`

### Unit 2 § G — Merge & Concatenate

**G1. [PROG]** Given `student_details` (`StudentID`, `Name`) and `student_marks` (`StudentID`,
`Marks`), merge them on `StudentID`. `[3]`

**G2. [THEORY]** Name the four values of `how=` in `pd.merge()` and say what each keeps. `[4]`

**G3. [PROG]** Concatenate two DataFrames of two students each into one of four. `[3]`

**G4. [OUT]** `[4]`

```python
a = pd.DataFrame({"Name": ["Arun", "Bala"], "Marks": [85, 72]})
b = pd.DataFrame({"Name": ["Charan", "Divya"], "Marks": [91, 65]})
print(pd.concat([a, b]))
print(pd.concat([a, b], ignore_index=True))
```

*Look hard at the index in the first result. What is wrong with it, and what does
`ignore_index=True` fix?*

**G5. [THEORY]** What is the difference between `merge()` and `concat()`? Which joins **columns**
and which stacks **rows**? `[3]`

**G6. [PROG]** Concatenate two DataFrames **side by side** (along the columns) instead of stacking
them. `[3]`

### Viva

1. What is the difference between `loc` and `iloc`?
2. Why must you write `&` and not `and` when combining two DataFrame conditions?
3. What is the difference between `df["A"]` and `df[["A"]]`?
