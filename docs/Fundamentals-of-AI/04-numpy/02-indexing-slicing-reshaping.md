---
sidebar_position: 2
title: Indexing, Slicing and Reshaping
description: 1-D and 2-D access, why NumPy slices are views rather than copies, boolean masking, and reshape.
tags: [python, numpy]
toc_max_heading_level: 3
---

# Indexing, Slicing and Reshaping

> **Topic —** Getting at parts of an array, and changing its shape. The one thing that
> genuinely differs from Python lists is in the middle of this page: **slices are views**.

---

## 1-D indexing and slicing

Identical to [strings and lists](../03-collections/01-strings-and-slicing.md) — `0` first,
`-1` last, `stop` excluded.

```python
arr = np.array([10, 20, 30, 40, 50])
print(arr[0])       # → 10
print(arr[2])       # → 30
print(arr[-1])      # → 50
print(arr[1:4])     # → [20 30 40]
print(arr[:3])      # → [10 20 30]
print(arr[2:])      # → [30 40 50]
print(arr[::2])     # → [10 30 50]
print(arr[::-1])    # → [50 40 30 20 10]
```

```text title="Output"
10
30
50
[20 30 40]
[10 20 30]
[30 40 50]
[10 30 50]
[50 40 30 20 10]
```

Nothing new so far. That's the point — the syntax carries over.

---

## 2-D indexing

Here NumPy adds something lists don't have: **one bracket, comma-separated per dimension**.

```python
a = np.array([[1, 2, 3],
              [4, 5, 6],
              [7, 8, 9]])

print(a[1, 2])    # → 6    row 1, column 2
print(a[1][2])    # → 6    same answer, worse way
```

```text title="Output"
6
6
```

`a[1, 2]` reads "row 1, column 2" in one operation. `a[1][2]` builds an intermediate array
for row 1, then indexes into it — same answer, more work. Prefer the comma form.

The mental model:

```text
        col 0  col 1  col 2
row 0 [   1      2      3  ]
row 1 [   4      5      6  ]
row 2 [   7      8      9  ]
```

### Rows and columns

```python
print(a[0])        # → [1 2 3]   whole row
print(a[:, 0])     # → [1 4 7]   whole column
```

```text title="Output"
[1 2 3]
[1 4 7]
```

`a[0]` is row 0. For a column you need `a[:, 0]` — "all rows, column 0". Extracting a column
from a list of lists takes a comprehension; here it's punctuation.

### 2-D slicing

Slice each dimension independently:

```python
print(a[1, 2])        # → 6                single element
print(a[:2, :2])      # first 2 rows, first 2 columns
print(a[1:, :2])      # from row 1, first 2 columns
print(a[:, 1])        # → [2 5 8]          column 1
print(a[::2, ::2])    # every other row and column
```

```text title="Output"
6
[[1 2]
 [4 5]]
[[4 5]
 [7 8]]
[2 5 8]
[[1 3]
 [7 9]]
```

:::note Indexing a dimension drops it; slicing keeps it

```python
print(a[:, 1].shape)      # → (3,)    1-D — the column dimension is gone
print(a[:, 1:2].shape)    # → (3, 1)  still 2-D — a one-column matrix
```

`a[:, 1]` uses an *index* for the column, so that dimension collapses. `a[:, 1:2]` uses a
*slice*, so it survives with length 1. This bites when a function insists on 2-D input.

:::

---

## Slices are views, not copies

This is the most important difference between NumPy and everything else you've seen.

```python
s = np.array([1, 2, 3, 4, 5])
sl = s[1:3]
sl[0] = 99
print(s)   # → [ 1 99  3  4  5]
```

```text title="Output"
[ 1 99  3  4  5]
```

Writing to the slice changed the **original**. Compare a Python list, which copies:

```python
L = [1, 2, 3, 4, 5]
Ls = L[1:3]
Ls[0] = 99
print(L)   # → [1, 2, 3, 4, 5]   untouched
```

```text title="Output"
[1, 2, 3, 4, 5]
```

:::danger This is the reverse of list behaviour

On the [Lists page](../03-collections/02-lists.md#the-reference-trap), `lst[:]` is the
idiomatic way to *copy* a list. On a NumPy array, `arr[:]` is a **view into the same
memory** — the opposite. Carrying the list habit over to NumPy produces silent data
corruption.

:::

A slice is deliberately a view: NumPy arrays are often large, and copying a million-row
slice just to read it would be wasteful. The trade is that writes propagate.

### Checking, and opting out

```python
sl = s[1:3]
print(sl.base is not None)   # → True   this array borrows someone else's memory

c = s[1:3].copy()
c[0] = 777
print(s)   # → unchanged by the write to c
```

```text title="Output"
True
```

`.base` is `None` for an array that owns its data, and points at the original for a view.
Call `.copy()` whenever you intend to modify a slice independently.

| Operation | Returns |
|---|---|
| `arr[1:3]` | **view** |
| `arr[:, 0]` | **view** |
| `arr.reshape(...)` | **view** |
| `arr.ravel()` | **view** (usually) |
| `arr.T` | **view** |
| `arr.copy()` | copy |
| `arr.flatten()` | copy |
| `arr[[0, 2]]` (fancy) | copy |
| `arr[arr > 5]` (boolean) | copy |

The pattern: **slicing and reshaping give views; selecting arbitrary elements gives copies.**
A view has to be describable as "start here, step by this much", and an arbitrary selection
isn't.

---

## Boolean masking

Comparing an array gives an array of booleans, which you can then use as an index.

```python
a = np.array([10, 20, 30, 40])
print(a > 20)        # → [False False  True  True]   the mask
print(a[a > 20])     # → [30 40]                     the selection
```

```text title="Output"
[False False  True  True]
[30 40]
```

Read `a[a > 20]` as "the elements of `a` where `a > 20`". This replaces a filtering loop
entirely.

### Combining conditions

```python
print(a[(a > 15) & (a < 40)])   # → [20 30]
print(a[~(a > 20)])             # → [10 20]
print((a > 20).sum())           # → 2
```

```text title="Output"
[20 30]
[10 20]
2
```

| | Use | Not |
|---|---|---|
| and | `&` | `and` |
| or | `\|` | `or` |
| not | `~` | `not` |

:::warning `and` / `or` / `not` don't work on arrays

They ask for one `True`/`False`, and an array of many values can't answer. You get
`ValueError: The truth value of an array with more than one element is ambiguous`. Use
`&`, `|`, `~` — and **parenthesise each condition**, because `&` binds tighter than `>`.

:::

`(a > 20).sum()` counts matches, because `True` is `1` — the same
[boolean-as-int](../01-basics/01-values-and-types.md#bool-is-a-subclass-of-int) fact from the
basics.

### `np.where`

Two jobs, depending on argument count.

```python
a = np.array([10, 20, 30, 40])
print(np.where(a > 20, a, 0))   # → [ 0  0 30 40]   choose per element
print(np.where(a > 20))         # → (array([2, 3]),)  the indices
print(a[np.where(a > 20)])      # → [30 40]
```

```text title="Output"
[ 0  0 30 40]
(array([2, 3]),)
[30 40]
```

Three arguments is a vectorised if/else — "where the condition holds take `a`, otherwise
take `0`". One argument returns the *positions* where it holds, as a tuple of index arrays
(one per dimension, hence the trailing comma).

### Fancy indexing

Index with a **list of positions**, in any order, with repeats:

```python
a = np.array([10, 20, 30, 40, 50])
print(a[[0, 2, 4]])    # → [10 30 50]
print(a[[4, 4, 0]])    # → [50 50 10]
```

```text title="Output"
[10 30 50]
[50 50 10]
```

The result is a **copy**, and its length is the length of your index list — not the array's.

---

## Reshaping

`reshape` reorganises the same elements into a new shape.

```python
b = np.arange(1, 7)
print(b)               # → [1 2 3 4 5 6]
print(b.reshape(2, 3))
print(b.reshape(3, 2))
print(b.reshape(6, 1))
```

```text title="Output"
[1 2 3 4 5 6]
[[1 2 3]
 [4 5 6]]
[[1 2]
 [3 4]
 [5 6]]
[[1]
 [2]
 [3]
 [4]
 [5]
 [6]]
```

Elements fill row by row.

### The legality rule

```python
b.reshape(4, 2)
```

```text title="Error"
ValueError: cannot reshape array of size 6 into shape (4,2)
```

**The product of the new shape must equal `.size`.** Six elements reshape to `(2,3)`,
`(3,2)`, `(6,1)`, `(1,6)` — because each multiplies to 6. `(4,2)` needs 8 elements, so
there's nothing to put in the last two slots and NumPy refuses rather than inventing values.

Check with `arr.size` before reshaping, or let NumPy do the arithmetic:

```python
print(b.reshape(-1, 2))
```

```text title="Output"
[[1 2]
 [3 4]
 [5 6]]
```

`-1` means "work this dimension out from the others". Only one `-1` is allowed.

### Reshape returns a view

```python
r = b.reshape(2, 3)
r[0, 0] = 99
print(b)   # → [99  2  3  4  5  6]
```

```text title="Output"
[99  2  3  4  5  6]
```

Same trap as slicing — `reshape` doesn't copy. If you need an independent result, chain
`.copy()`.

### Flattening

Both collapse to 1-D; the difference is the view/copy question again.

```python
m = np.array([[1, 2], [3, 4]])

f = m.flatten()
f[0] = 99
print(m.tolist())   # → [[1, 2], [3, 4]]     flatten COPIES

rv = m.ravel()
rv[0] = 99
print(m.tolist())   # → [[99, 2], [3, 4]]    ravel VIEWS
```

```text title="Output"
[[1, 2], [3, 4]]
[[99, 2], [3, 4]]
```

`flatten()` is the safe one. `ravel()` is faster because it avoids the copy when it can.

### Transpose

`.T` swaps the axes — rows become columns.

```python
m = np.array([[1, 2, 3],
              [4, 5, 6]])
print(m.shape, "->", m.T.shape)   # → (2, 3) -> (3, 2)
print(m.T)
```

```text title="Output"
(2, 3) -> (3, 2)
[[1 4]
 [2 5]
 [3 6]]
```

Also a view — and note it's `.T`, an attribute, with no parentheses.

---

## Common Mistakes

| # | Mistake | Wrong | Right |
|---|---|---|---|
| 1 | Assuming a slice copies | `arr[1:3]` shares memory | `arr[1:3].copy()` |
| 2 | `arr[:]` to copy | it's a view | `arr.copy()` |
| 3 | Assuming `reshape` copies | it's a view | `arr.reshape(2,3).copy()` |
| 4 | Chained 2-D indexing | `a[1][2]` | `a[1, 2]` |
| 5 | `and` in a mask | `ValueError: truth value ... ambiguous` | `&` |
| 6 | Unparenthesised mask | `a > 15 & a < 40` | `(a > 15) & (a < 40)` |
| 7 | Reshape to a wrong size | `size 6 into shape (4,2)` | product must equal `.size` |
| 8 | `.T()` with parentheses | `TypeError` | `.T` |

---

## Summary

| Task | Syntax |
|---|---|
| Element (2-D) | `a[row, col]` |
| Whole row / column | `a[i]` / `a[:, j]` |
| Sub-block | `a[r1:r2, c1:c2]` |
| Filter by condition | `a[a > x]` |
| Vectorised if/else | `np.where(cond, x, y)` |
| Positions matching | `np.where(cond)` |
| Pick specific indices | `a[[i, j, k]]` |
| Change shape | `.reshape(r, c)` or `.reshape(-1, c)` |
| Collapse to 1-D | `.flatten()` (copy) / `.ravel()` (view) |
| Swap axes | `.T` |
| Force a copy | `.copy()` |

**Key takeaways**

- 1-D indexing and slicing match lists and strings exactly
- 2-D uses one bracket with a comma: `a[1, 2]`, and `a[:, 0]` for a column
- Indexing a dimension drops it; slicing keeps it — `(3,)` vs `(3, 1)`
- **Slices, reshapes, `ravel` and `.T` are views** — writing to them writes to the original
- Boolean masks and fancy indexing return **copies**
- Use `&`, `|`, `~` in masks, never `and`/`or`/`not`, and parenthesise each condition
- `reshape` is legal only when the new shape's product equals `.size`; `-1` infers one dimension
- `.copy()` is the escape hatch whenever you plan to modify

**See also:** [Arrays and Attributes](./01-arrays-and-attributes.md) ·
[Operations and Broadcasting](./03-operations-and-broadcasting.md) ·
[Strings and Slicing](../03-collections/01-strings-and-slicing.md) for the syntax this builds on

---

## Run It Yourself

```python title="numpy_indexing.py"
import numpy as np

a = np.array([[1, 2, 3],
              [4, 5, 6],
              [7, 8, 9]])

print(a)
print(f"{'a[1, 2]':<14} {a[1, 2]}")
print(f"{'row a[0]':<14} {a[0]}")
print(f"{'col a[:, 0]':<14} {a[:, 0]}")
print(f"{'a[:2, :2]':<14} {a[:2, :2].tolist()}")
print(f"{'a[::2, ::2]':<14} {a[::2, ::2].tolist()}")

# masking
flat = a.ravel()
print(f"{'flat':<14} {flat}")
print(f"{'mask > 5':<14} {flat > 5}")
print(f"{'flat[> 5]':<14} {flat[flat > 5]}")
print(f"{'count > 5':<14} {(flat > 5).sum()}")
print(f"{'where':<14} {np.where(flat > 5, flat, 0)}")

# the view trap, demonstrated
original = np.array([1, 2, 3, 4, 5])
view = original[1:3]
view[0] = 99
print(f"{'after view':<14} {original}")

original = np.array([1, 2, 3, 4, 5])
copy = original[1:3].copy()
copy[0] = 99
print(f"{'after copy':<14} {original}")
```

```text title="Output"
[[1 2 3]
 [4 5 6]
 [7 8 9]]
a[1, 2]        6
row a[0]       [1 2 3]
col a[:, 0]    [1 4 7]
a[:2, :2]      [[1, 2], [4, 5]]
a[::2, ::2]    [[1, 3], [7, 9]]
flat           [1 2 3 4 5 6 7 8 9]
mask > 5       [False False False False False  True  True  True  True]
flat[> 5]      [6 7 8 9]
count > 5      4
where          [0 0 0 0 0 6 7 8 9]
after view     [ 1 99  3  4  5]
after copy     [1 2 3 4 5]
```

---

## Practice Questions

*From the Unit 1 question bank. Tags and marks are explained on the
[Python index](../index.md#practice-questions).*

### Unit 1 § J — NumPy

**J5. [OUT]** 2-D slicing. `[5]`

```python
import numpy as np
a = np.array([[1, 2, 3],
              [4, 5, 6],
              [7, 8, 9]])

print(a[1, 2])
print(a[:2, :2])
print(a[1:, :2])
print(a[:, 1])
print(a[::2, ::2])
```

**J7. [OUT]** One of these raises an error. Which, and what is the error message? `[3]`

```python
import numpy as np
a = np.array([1, 2, 3, 4, 5, 6])
print(a.reshape(2, 3))
print(a.reshape(3, 2))
print(a.reshape(6, 1))
print(a.reshape(4, 2))
```

*State the rule that decides whether a reshape is legal.*
