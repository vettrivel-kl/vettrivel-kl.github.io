---
sidebar_position: 3
title: Operations and Broadcasting
description: Element-wise arithmetic, the broadcasting rules, universal functions, matrix multiplication, sorting and stacking.
tags: [python, numpy, operators]
toc_max_heading_level: 3
---

# Operations and Broadcasting

> **Topic —** Doing maths on whole arrays at once, without writing a loop. This is what
> NumPy is *for*.

---

## Element-wise arithmetic

Every arithmetic operator works position by position on two arrays of the same shape.

```python
a = np.array([10, 20, 30])
b = np.array([1, 2, 3])

print(a + b)     # → [11 22 33]
print(a - b)     # → [ 9 18 27]
print(a * b)     # → [10 40 90]
print(a / b)     # → [10. 10. 10.]
print(a // b)    # → [10 10 10]
print(a % b)     # → [0 0 0]
print(a ** 2)    # → [100 400 900]
```

```text title="Output"
[11 22 33]
[ 9 18 27]
[10 40 90]
[10. 10. 10.]
[10 10 10]
[0 0 0]
[100 400 900]
```

Two things carried over from plain Python: `/` always produces floats (note `[10. 10. 10.]`),
while `//` keeps integers — exactly as in
[Expressions and Operators](../01-basics/04-expressions-and-operators.mdx).

`a * b` here is **not** matrix multiplication. It multiplies element 0 by element 0, element
1 by element 1, and so on. Matrix multiplication is `@`, further down.

### Shapes must be compatible

```python
np.array([1, 2, 3]) + np.array([1, 2])
```

```text title="Error"
ValueError: operands could not be broadcast together with shapes (3,) (2,)
```

Three elements and two elements have no sensible pairing, so NumPy refuses. Compare a list,
where `+` would happily concatenate them into five items.

---

## Scalar operations

A single number applies to every element:

```python
a = np.array([10, 20, 30])
print(a + 5)     # → [15 25 35]
print(a * 2)     # → [20 40 60]
print(a / 10)    # → [1. 2. 3.]
print(a ** 2)    # → [100 400 900]
```

```text title="Output"
[15 25 35]
[20 40 60]
[1. 2. 3.]
[100 400 900]
```

This is the simplest case of broadcasting: the scalar is treated as if it were stretched to
match the array's shape. No copy actually happens — NumPy just reuses the one value.

---

## Broadcasting

Broadcasting lets arrays of *different but compatible* shapes work together.

### The rule

Compare shapes from the **right**, one dimension at a time. Two dimensions are compatible if
they are **equal**, or **one of them is 1**. A missing dimension counts as 1.

```text
(2, 3)  and  (3,)        →  (3,) is read as (1, 3)
         3 vs 3  ✅ equal
         2 vs 1  ✅ one is 1
result: (2, 3)
```

### A row applied to every row

```python
m = np.array([[1, 2, 3],
              [4, 5, 6]])
row = np.array([10, 20, 30])
print(m + row)
```

```text title="Output"
[[11 22 33]
 [14 25 36]]
```

Shape `(3,)` stretched down both rows of `(2, 3)`.

### A column applied to every column

```python
col = np.array([[100],
                [200]])
print(m + col)
```

```text title="Output"
[[101 102 103]
 [204 205 206]]
```

Shape `(2, 1)` stretched across all three columns. `100` went to the whole first row, `200`
to the whole second.

### Both stretched at once

A column and a row combine into a grid:

```python
print(np.array([[1], [2], [3]]) + np.array([[10, 20, 30]]))
```

```text title="Output"
[[11 21 31]
 [12 22 32]
 [13 23 33]]
```

`(3, 1)` with `(1, 3)` gives `(3, 3)` — every combination. This is how you build
multiplication tables and distance matrices without loops.

### When it fails

```python
m + np.array([1, 2])
```

```text title="Error"
ValueError: operands could not be broadcast together with shapes (2,3) (2,)
```

Rightmost dimensions are `3` and `2` — not equal, neither is 1. The fact that `m` has two
rows and the other array has two elements is irrelevant; alignment is from the right. To add
one value per **row** you need shape `(2, 1)`, which is what `np.array([[1],[2]])` or
`np.array([1,2]).reshape(-1, 1)` gives you.

:::tip

Most broadcasting errors are a `(n,)` where a `(n, 1)` was needed. `arr.reshape(-1, 1)` turns
a row into a column.

:::

---

## Comparisons

Comparison operators are element-wise too, giving a boolean array:

```python
a = np.array([10, 20, 30, 40])
print(a > 20)     # → [False False  True  True]
print(a == 20)    # → [False  True False False]
print(a != 20)    # → [ True False  True  True]
```

```text title="Output"
[False False  True  True]
[False  True False False]
[ True False  True  True]
```

To collapse a boolean array to a single answer:

```python
print((a > 35).any())   # → True    at least one
print((a > 5).all())    # → True    every one
```

```text title="Output"
True
True
```

`.any()` and `.all()` are what you use in an `if`, since the array itself can't be a
condition. Boolean arrays are mainly used as
[masks](./02-indexing-slicing-reshaping.md#boolean-masking).

---

## Universal functions (ufuncs)

A ufunc applies a mathematical operation to every element. They're written in C, so they're
fast, and they always return a new array.

```python
a = np.array([1, 4, 9, 16])
print(np.sqrt(a))                                    # → [1. 2. 3. 4.]
print(np.round(np.exp(np.array([0, 1, 2])), 4))
print(np.round(np.log(np.array([1, np.e, 10])), 4))
print(np.round(np.sin(np.array([0, np.pi/2, np.pi])), 4))
print(np.abs(np.array([-1, -2, 3])))                 # → [1 2 3]
print(np.round(np.array([1.234, 5.678]), 1))         # → [1.2 5.7]
```

```text title="Output"
[1. 2. 3. 4.]
[1.     2.7183 7.3891]
[0.     1.     2.3026]
[0. 1. 0.]
[1 2 3]
[1.2 5.7]
```

| Function | Does |
|---|---|
| `np.sqrt` | square root |
| `np.exp` | e to the power of |
| `np.log` / `np.log10` / `np.log2` | natural / base-10 / base-2 log |
| `np.sin` / `np.cos` / `np.tan` | trig, in **radians** |
| `np.abs` | absolute value |
| `np.round` / `np.floor` / `np.ceil` | rounding |
| `np.power(a, b)` | same as `a ** b` |

:::note `np.sin(np.pi)` isn't exactly zero

Unrounded, it's `1.2246467991473532e-16`. `np.pi` is a `float64` approximation of π, so the
sine of it is approximately-but-not-exactly 0. The same float imprecision as
[`0.1 + 0.2`](../01-basics/01-values-and-types.md#float) — compare with a tolerance, never
`== 0`.

:::

Note these are `np.sqrt(a)`, **not** `a.sqrt()`. Most maths lives on the `np` module, not on
the array. Your course notes list `np.sin()`, `np.cos()`, `np.log()` and friends as bare
names — they all need an array argument.

### Why this beats a loop

```text
list comprehension: 27 ms
numpy vectorised  : 1.4 ms
```

Doubling a million elements. The loop pays Python's interpreter overhead once per element;
the vectorised version hands the whole block to C. Anywhere you're tempted to write
`for i in range(len(arr))`, there's usually a ufunc or an operator that does it faster and
reads better.

---

## Matrix multiplication

`*` and `@` are genuinely different operations.

```python
A = np.array([[1, 2], [3, 4]])
B = np.array([[5, 6], [7, 8]])

print(A * B)   # element-wise
print(A @ B)   # matrix product
```

```text title="Output"
[[ 5 12]
 [21 32]]
[[19 22]
 [43 50]]
```

`A * B` multiplies matching positions: `1×5=5`, `2×6=12`. `A @ B` does rows-times-columns:
the top-left `19` is `1×5 + 2×7`.

`np.dot(A, B)` is the older spelling of `@`. For 2-D arrays they agree; `@` is clearer and
is the one to use.

:::warning

In many other languages and in mathematical notation, `*` on matrices *means* the matrix
product. In NumPy it does not. Getting these two confused produces plausible-looking numbers
that are wrong.

:::

---

## Sorting

```python
u = np.array([4, 1, 8, 3])
print(np.sort(u))      # → [1 3 4 8]   new array
print(u)               # → [4 1 8 3]   original untouched
print(np.argsort(u))   # → [1 3 0 2]   indices that would sort it
print(u.argmin(), u.argmax())   # → 1 2
print(np.sort(u)[::-1])         # → [8 4 3 1]   descending
```

```text title="Output"
[1 3 4 8]
[4 1 8 3]
[1 3 0 2]
1 2
[8 4 3 1]
```

`np.sort(u)` returns a sorted copy; `u.sort()` sorts in place — the same split as
[`sorted()` vs `.sort()`](../03-collections/02-lists.md#sort-vs-sorted) on lists.

`argsort` gives *positions* rather than values: `[1, 3, 0, 2]` means "the smallest is at
index 1, next at index 3…". `argmin`/`argmax` give the position of the extreme value, which
is what you want when you need to know *which* row had the maximum.

There's no `reverse=True` — sort ascending and reverse with `[::-1]`.

### Unique values

```python
d = np.array([3, 1, 2, 3, 1])
print(np.unique(d))                              # → [1 2 3]
vals, counts = np.unique(d, return_counts=True)
print(vals, counts)                              # → [1 2 3] [2 1 2]
```

```text title="Output"
[1 2 3]
[1 2 3] [2 1 2]
```

`np.unique` returns sorted distinct values — like `set()` on a list, but ordered and still an
array. `return_counts=True` gives a frequency table in one call.

---

## Joining arrays

Arrays are fixed-size, so joining always builds a new one.

```python
x = np.array([1, 2])
y = np.array([3, 4])
print(np.concatenate([x, y]))   # → [1 2 3 4]
print(np.vstack([x, y]))        # stack as rows
print(np.hstack([x, y]))        # → [1 2 3 4]
```

```text title="Output"
[1 2 3 4]
[[1 2]
 [3 4]]
[1 2 3 4]
```

For 2-D input, `axis` picks the direction:

```python
m1 = np.array([[1, 2]])
m2 = np.array([[3, 4]])
print(np.concatenate([m1, m2], axis=0))   # stack rows
print(np.concatenate([m1, m2], axis=1))   # extend columns
```

```text title="Output"
[[1 2]
 [3 4]]
[[1 2 3 4]]
```

| Call | Joins along |
|---|---|
| `np.vstack` | rows (vertically) — `axis=0` |
| `np.hstack` | columns (horizontally) — `axis=1` |
| `np.concatenate([...], axis=n)` | whichever axis you name |

:::warning Don't build arrays in a loop

`np.append(arr, x)` copies the entire array every call, so appending *n* times costs *n²*
work. Collect into a Python list and call `np.array(lst)` once at the end.

:::

---

## Common Mistakes

| # | Mistake | Wrong | Right |
|---|---|---|---|
| 1 | `*` for matrix product | `A * B` is element-wise | `A @ B` |
| 2 | Expecting `+` to concatenate | `[1,2] + [3,4]` as arrays is `[4 6]` | `np.concatenate([a, b])` |
| 3 | `(n,)` where `(n, 1)` is needed | broadcast `ValueError` | `arr.reshape(-1, 1)` |
| 4 | Array in an `if` | `truth value ... ambiguous` | `.any()` or `.all()` |
| 5 | `a.sqrt()` | `AttributeError` | `np.sqrt(a)` |
| 6 | `np.sort(reverse=True)` | no such argument | `np.sort(a)[::-1]` |
| 7 | Comparing a float ufunc to `0` | `np.sin(np.pi) == 0` is `False` | `abs(x) < 1e-9` |
| 8 | `np.append` in a loop | quadratic | build a list, convert once |

---

## Summary

| Operation | Syntax |
|---|---|
| Element-wise maths | `a + b`, `a * b`, `a ** 2` |
| Scalar to every element | `a + 5` |
| Element-wise comparison | `a > 20` |
| Collapse booleans | `.any()` / `.all()` |
| Maths function | `np.sqrt(a)`, `np.log(a)` |
| Matrix product | `a @ b` |
| Sorted copy / in place | `np.sort(a)` / `a.sort()` |
| Positions, not values | `np.argsort`, `argmin`, `argmax` |
| Distinct values + counts | `np.unique(a, return_counts=True)` |
| Join | `np.concatenate`, `np.vstack`, `np.hstack` |

**Key takeaways**

- Arithmetic and comparison are element-wise; shapes must match or broadcast
- Broadcasting aligns shapes **from the right**; dimensions must be equal or 1
- Most broadcast errors are a `(n,)` that should have been `(n, 1)`
- `*` is element-wise, `@` is the matrix product — never interchangeable
- Ufuncs live on `np`, not on the array: `np.sqrt(a)`
- Vectorised operations were ~17× faster than the equivalent comprehension here
- `arg*` functions return **positions**, which is what you need to find *which* element
- Never grow an array in a loop — collect in a list, convert once

**See also:** [Indexing, Slicing and Reshaping](./02-indexing-slicing-reshaping.md) for masks
and `reshape(-1, 1)` · [Aggregations and Statistics](./04-aggregations-and-statistics.md) ·
[Expressions and Operators](../01-basics/04-expressions-and-operators.mdx) for the operators
themselves

---

## Run It Yourself

```python title="numpy_operations.py"
import numpy as np

a = np.array([10, 20, 30])
b = np.array([1, 2, 3])

print(f"{'a':<16} {a}")
print(f"{'b':<16} {b}")
print(f"{'a + b':<16} {a + b}")
print(f"{'a * b':<16} {a * b}")
print(f"{'a / b':<16} {a / b}")
print(f"{'a + 5 (scalar)':<16} {a + 5}")
print(f"{'a > 15':<16} {a > 15}")
print(f"{'np.sqrt':<16} {np.sqrt(np.array([1, 4, 9, 16]))}")

print()
m = np.array([[1, 2, 3],
              [4, 5, 6]])
print("m =", m.tolist())
print(f"{'m + [10,20,30]':<16} {(m + np.array([10, 20, 30])).tolist()}")
print(f"{'m + [[100],[200]]':<16} {(m + np.array([[100], [200]])).tolist()}")

print()
A = np.array([[1, 2], [3, 4]])
B = np.array([[5, 6], [7, 8]])
print(f"{'A * B':<16} {(A * B).tolist()}   element-wise")
print(f"{'A @ B':<16} {(A @ B).tolist()}   matrix product")

print()
u = np.array([4, 1, 8, 3])
print(f"{'u':<16} {u}")
print(f"{'np.sort':<16} {np.sort(u)}")
print(f"{'descending':<16} {np.sort(u)[::-1]}")
print(f"{'argmax':<16} {u.argmax()}  (value {u.max()})")
print(f"{'unique':<16} {np.unique(np.array([3, 1, 2, 3, 1]))}")
```

```text title="Output"
a                [10 20 30]
b                [1 2 3]
a + b            [11 22 33]
a * b            [10 40 90]
a / b            [10. 10. 10.]
a + 5 (scalar)   [15 25 35]
a > 15           [False  True  True]
np.sqrt          [1. 2. 3. 4.]

m = [[1, 2, 3], [4, 5, 6]]
m + [10,20,30]   [[11, 22, 33], [14, 25, 36]]
m + [[100],[200]] [[101, 102, 103], [204, 205, 206]]

A * B            [[5, 12], [21, 32]]   element-wise
A @ B            [[19, 22], [43, 50]]   matrix product

u                [4 1 8 3]
np.sort          [1 3 4 8]
descending       [8 4 3 1]
argmax           2  (value 8)
unique           [1 2 3]
```

---

## Practice Questions

*From the Unit 1 question bank. Tags and marks are explained on the
[Python index](../index.md#practice-questions).*

### Unit 1 § J — NumPy

**J3. [PROG]** Create two arrays and perform addition, subtraction, multiplication, and division
element-wise. `[4]`

**J8. [OUT]** Scalar broadcasting and boolean masking. `[4]`

```python
import numpy as np
a = np.array([10, 20, 30, 40])
print(a + 5)
print(a * 2)
print(a > 20)
print(a[a > 20])
print(np.sqrt(np.array([1, 4, 9, 16])))
```
