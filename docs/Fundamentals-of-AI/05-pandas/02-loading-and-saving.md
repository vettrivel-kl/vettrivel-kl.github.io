---
sidebar_position: 2
title: Loading and Saving Data
description: read_csv, read_excel and read_json; writing back out; and why index=False matters.
tags: [python, pandas, io]
toc_max_heading_level: 3
---

# Loading and Saving Data

> **Topic —** Getting real data into a DataFrame, and back out to a file. In practice this is
> the first line of almost every pandas script.

The examples use `students.csv`:

```text title="students.csv"
Name,Department,Age,Marks
Arun,CSE,20.0,85.0
Bala,IT,21.0,72.0
Charan,CSE,,91.0
Divya,ECE,22.0,65.0
Esha,CSE,21.0,
Bala,IT,21.0,72.0
```

Six rows with three deliberate problems: **Charan has no Age**, **Esha has no Marks**, and
**Bala's row appears twice**. Those get dealt with in
[Cleaning Data](./04-cleaning-data.md).

---

## Reading a CSV

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

One line and you have a table. Note what pandas did for you:

- Took the **first row as column names** automatically
- Added a `0`–`5` integer index
- Turned the two empty CSV fields into **`NaN`**
- Inferred a type for each column

### `NaN` forces a float column

```python
print(df.dtypes)
```

```text title="Output"
Name           object
Department     object
Age           float64
Marks         float64
dtype: object
```

`Age` and `Marks` are `float64`, not `int64` — even though every actual value is a whole
number. That's because `NaN` is a float, so a column containing one **cannot** be an integer
column.

:::warning This is why `Age` prints as `20.0` rather than `20`

Nothing is wrong with your data. Fill or drop the missing values and you can convert back
with `.astype(int)` — see [Cleaning Data](./04-cleaning-data.md). Until then, the `.0` is
unavoidable. The same [`nan` mechanics](../04-numpy/04-aggregations-and-statistics.md#handling-nan)
as in NumPy.

:::

### Useful `read_csv` arguments

```python
print(pd.read_csv("students.csv", usecols=["Name", "Marks"]))
print(pd.read_csv("students.csv", nrows=2))
print(pd.read_csv("students.csv", index_col="Name").head(3))
```

```text title="Output"
     Name  Marks
0    Arun   85.0
1    Bala   72.0
2  Charan   91.0
3   Divya   65.0
4    Esha    NaN
5    Bala   72.0
   Name Department   Age  Marks
0  Arun        CSE  20.0   85.0
1  Bala         IT  21.0   72.0
       Department   Age  Marks
Name                          
Arun          CSE  20.0   85.0
Bala           IT  21.0   72.0
Charan        CSE   NaN   91.0
```

| Argument | Does |
|---|---|
| `usecols=[...]` | read only these columns |
| `nrows=n` | read only the first *n* rows |
| `index_col="Name"` | use a column as the index instead of `0,1,2…` |
| `sep=";"` | for semicolon- or tab-separated files |
| `header=None` | the file has no header row |
| `names=[...]` | supply your own column names |
| `na_values=["-", "NA"]` | treat these strings as missing too |
| `skiprows=n` | skip leading junk lines |

`usecols` and `nrows` are what you reach for with a large file — read a slice first to see
what you're dealing with before loading gigabytes.

Note in the `index_col` output that `Name` sits on a lower line than the other headings. That's
pandas showing that `Name` is now the **index**, not a column.

### When the file isn't there

```python
pd.read_csv("nope.csv")
```

```text title="Error"
FileNotFoundError: [Errno 2] No such file or directory: 'nope.csv'
```

The path is relative to where you **ran** the script, not where the script lives. This is the
most common cause of a `FileNotFoundError` that "should" work.

---

## Reading Excel and JSON

### Excel

```python
df = pd.read_excel("students.xlsx")
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

Identical result to the CSV. Excel support needs an extra package:

```bash
pip install openpyxl
```

:::warning That's a shell command, not Python

`pip install openpyxl` belongs in your terminal. Putting it in a `.py` file is a
`SyntaxError` — pandas can't install its own dependencies. In a Jupyter notebook you'd write
`!pip install openpyxl` with the `!` prefix.

:::

`read_excel` also takes `sheet_name=` — by name, by number, or `sheet_name=None` to get a
dict of every sheet.

### JSON

```python
print(pd.read_json("students.json"))
```

```text title="Output"
   Name  Age
0  Arun   20
1  Bala   21
```

```text title="students.json"
[
    {"Name": "Arun", "Age": 20},
    {"Name": "Bala", "Age": 21}
]
```

A JSON **array of objects** maps directly onto rows — each key becomes a column. Other JSON
shapes need the `orient=` argument to tell pandas how it's laid out.

| Function | Reads | Needs |
|---|---|---|
| `pd.read_csv` | `.csv`, `.txt` | — |
| `pd.read_excel` | `.xlsx`, `.xls` | `openpyxl` |
| `pd.read_json` | `.json` | — |
| `pd.read_sql` | a database query | a DB driver |
| `pd.read_html` | tables in a web page | `lxml` |

---

## Writing data out

Build a DataFrame from a dict, then save it:

```python
data = {
    "Name": ["Arun", "Bala", "Charan"],
    "Age": [20, 21, 22],
    "Department": ["CSE", "IT", "ECE"],
    "Marks": [85, 72, 91],
}
df = pd.DataFrame(data)
print(df)
```

```text title="Output"
     Name  Age Department  Marks
0    Arun   20        CSE     85
1    Bala   21         IT     72
2  Charan   22        ECE     91
```

### CSV — and why `index=False`

```python
df.to_csv("students_output.csv", index=False)
```

```text title="students_output.csv"
Name,Age,Department,Marks
Arun,20,CSE,85
Bala,21,IT,72
Charan,22,ECE,91
```

Leave `index=False` off and pandas writes the index as an unnamed first column:

```python
df.to_csv("students_with_index.csv")
```

```text title="students_with_index.csv"
,Name,Age,Department,Marks
0,Arun,20,CSE,85
1,Bala,21,IT,72
2,Charan,22,ECE,91
```

:::danger Almost always pass `index=False`

Note the leading comma on the header line — a column with **no name**. Read that file back
and you get a junk `Unnamed: 0` column. Do it a few times and you accumulate `Unnamed: 0`,
`Unnamed: 0.1`, and so on.

The exception: when the index is real data (a date, or an ID you set with `index_col`), you
*do* want to keep it.

:::

### Round trip

```python
print(pd.read_csv("students_output.csv"))
```

```text title="Output"
     Name  Age Department  Marks
0    Arun   20        CSE     85
1    Bala   21         IT     72
2  Charan   22        ECE     91
```

Same table back, and `Age` is `int64` this time — no `NaN` in this data, so no float
promotion.

### Excel

```python
df.to_excel("students_output.xlsx", index=False)
```

Also needs `openpyxl`. Use `sheet_name=` to name the tab.

### JSON — `orient` decides the shape

```python
df.to_json("students_output.json", orient="records", indent=4)
```

```text title="students_output.json"
[
    {
        "Name":"Arun",
        "Age":20,
        "Department":"CSE",
        "Marks":85
    },
    {
        "Name":"Bala",
        "Age":21,
        "Department":"IT",
        "Marks":72
    },
    {
        "Name":"Charan",
        "Age":22,
        "Department":"ECE",
        "Marks":91
    }
]
```

`orient="records"` gives one object per row — the shape most APIs and other tools expect, and
the shape `read_json` reads back without extra arguments.

The default is `orient="columns"`, which nests by column instead:

```text title="orient=&quot;columns&quot;"
{
  "Name":{
    "0":"Arun",
    "1":"Bala",
    "2":"Charan"
  },
  "Age":{
    "0":20,
    ...
```

Same data, quite different file. `indent=4` just makes it readable — without it everything
lands on one line.

| Method | Writes | Key argument |
|---|---|---|
| `.to_csv(path)` | CSV | `index=False` |
| `.to_excel(path)` | Excel | `index=False`, `sheet_name=` |
| `.to_json(path)` | JSON | `orient="records"`, `indent=` |
| `.to_numpy()` | an ndarray | — |
| `.to_dict()` | a dict | `orient=` |

---

## Common Mistakes

| # | Mistake | Wrong | Right |
|---|---|---|---|
| 1 | Forgetting `index=False` | an unnamed column in the file | `.to_csv(p, index=False)` |
| 2 | `pip install` inside a `.py` | `SyntaxError` | run it in the terminal |
| 3 | Expecting int columns with `NaN` present | they're `float64` | fill first, then `.astype(int)` |
| 4 | Relative path from the wrong directory | `FileNotFoundError` | path is relative to where you ran it |
| 5 | `read_excel` without `openpyxl` | `ImportError` | `pip install openpyxl` |
| 6 | Default `to_json` orient | nested by column | `orient="records"` |
| 7 | Assuming `to_csv` returns something | it returns `None` | it writes a file |
| 8 | Header row treated as data | it isn't, by default | `header=None` if there genuinely isn't one |

---

## Summary

| Task | Call |
|---|---|
| Read CSV | `pd.read_csv("f.csv")` |
| Read some columns | `pd.read_csv(f, usecols=[...])` |
| Read first *n* rows | `pd.read_csv(f, nrows=n)` |
| Set the index from a column | `pd.read_csv(f, index_col="Name")` |
| Read Excel / JSON | `pd.read_excel(f)` / `pd.read_json(f)` |
| Write CSV | `df.to_csv(f, index=False)` |
| Write Excel / JSON | `df.to_excel(f, index=False)` / `df.to_json(f, orient="records")` |

**Key takeaways**

- `read_csv` infers the header, the index, the dtypes, and turns blanks into `NaN`
- A column with any `NaN` becomes `float64` — that's why ages print as `20.0`
- `usecols` and `nrows` let you peek at a big file cheaply
- Paths are relative to where you **ran** the script
- Pass `index=False` when writing, unless the index is real data
- `openpyxl` is needed for Excel, and `pip install` goes in the terminal
- `to_json(orient="records")` is the interoperable shape; the default nests by column

**See also:** [Inspecting Data](./03-inspecting-data.md) for what to do the moment it's
loaded · [Cleaning Data](./04-cleaning-data.md) for the `NaN`s and the duplicate row ·
[Series and DataFrames](./01-series-and-dataframes.md)

---

## Run It Yourself

```python title="pandas_io.py"
import pandas as pd

# --- read ---
df = pd.read_csv("students.csv")
print("loaded from CSV")
print(df)
print(f"\nshape {df.shape}")
print("\ndtypes — note the floats, caused by NaN")
print(df.dtypes)

# --- build and write ---
out = pd.DataFrame({
    "Name": ["Arun", "Bala", "Charan"],
    "Age": [20, 21, 22],
    "Department": ["CSE", "IT", "ECE"],
    "Marks": [85, 72, 91],
})
out.to_csv("students_output.csv", index=False)
print("\nwritten to students_output.csv:")
print(open("students_output.csv").read())

# --- read it back ---
print("round-tripped — Age is int64 now, no NaN:")
back = pd.read_csv("students_output.csv")
print(back)
print(back.dtypes)
```

```text title="Output"
loaded from CSV
     Name Department   Age  Marks
0    Arun        CSE  20.0   85.0
1    Bala         IT  21.0   72.0
2  Charan        CSE   NaN   91.0
3   Divya        ECE  22.0   65.0
4    Esha        CSE  21.0    NaN
5    Bala         IT  21.0   72.0

shape (6, 4)

dtypes — note the floats, caused by NaN
Name           object
Department     object
Age           float64
Marks         float64
dtype: object

written to students_output.csv:
Name,Age,Department,Marks
Arun,20,CSE,85
Bala,21,IT,72
Charan,22,ECE,91

round-tripped — Age is int64 now, no NaN:
     Name  Age Department  Marks
0    Arun   20        CSE     85
1    Bala   21         IT     72
2  Charan   22        ECE     91
Name          object
Age            int64
Department    object
Marks          int64
dtype: object
```

---

## Practice Questions

*Tags and marks are explained on the [Python index](../index.md#practice-questions).*

### Unit 1 § K — Pandas

**K4. [PROG]** Load `students.csv` with `read_csv()` and display the **first 10 rows**. `[3]`

### Unit 2 § A — Data Loading & Saving

**A1. [PROG]** Load `students.csv` into a DataFrame and display it. `[2]`

**A2. [PROG]** Write the code to read a dataset from an **Excel** file and from a **JSON** file.
Name the extra package Excel support needs. `[3]`

**A3. [THEORY]** Your `data_loading.py` has the line `pip install openpyxl` sitting in the middle
of the Python file. What happens when you run that script, and where does that line actually
belong? `[3]`

**A4. [PROG]** Create a DataFrame from a dictionary of three students, then write it out to
**CSV**, **Excel** and **JSON**. `[5]`

**A5. [THEORY]** In `df.to_csv("out.csv", index=False)`, what does `index=False` do? What appears
in the file if you leave it out? `[3]`

**A6. [THEORY]** In `df.to_json("out.json", orient="records", indent=4)`, explain
`orient="records"`. What shape does the resulting JSON take? `[3]`

**A7. [OUT]** `students.json` contains only `Name` and `Age`. What are the shape and columns of
`pd.read_json("students.json")`? `[2]`

### Viva

1. How do missing values appear when you print a DataFrame?
2. Why does an integer column become `float64` once it has one missing value?
