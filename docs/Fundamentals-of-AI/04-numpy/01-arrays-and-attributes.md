---
sidebar_position: 1
title: Arrays and Attributes
description: Creating ndarrays, the six shape attributes, dtypes, and why an array is not a list.
tags: [python, numpy]
toc_max_heading_level: 3
---

# Arrays and Attributes

> **Topic —** The `ndarray` — NumPy's single data structure. Everything else in NumPy is a
> function that takes one or returns one.

```python
import numpy as np
```

`np` is the universal alias. Every example on these pages assumes that import.

---

## An array is not a list

This is the thing to understand first, because every operator behaves differently.

```python
a = [1, 2]
print(a * 2)     # → [1, 2, 1, 2]
print(a + a)     # → [1, 2, 1, 2]

b = np.array([1, 2])
print(b * 2)     # → [2 4]
print(b + b)     # → [2 4]
```

```text title="Output"
[1, 2, 1, 2]
[1, 2, 1, 2]
[2 4]
[2 4]
```

| Operator | On a `list` | On an `ndarray` |
|---|---|---|
| `*` | **repeats** the sequence | multiplies **each element** |
| `+` | **concatenates** | adds **element-wise** |

A list is a *container* — `+` and `*` rearrange the container. An array is a *vector of
numbers* — `+` and `*` do arithmetic. Same symbols, different meaning.

:::note

Notice the printed form too: a list shows commas, `[1, 2, 1, 2]`. An array doesn't,
`[2 4]`. That's a quick way to tell which one you're holding.

:::

### Why use an array?

1. **Element-wise maths without a loop.** `a * 2` instead of `[x * 2 for x in a]`.
2. **Speed.** The work happens in compiled C over a contiguous block of memory, not in
   Python bytecode. Measured on a million elements:

   ```text
   list comprehension: 27 ms
   numpy vectorised  : 1.4 ms
   ```

   Roughly 17–19× here, and the gap widens with size.
3. **Memory.** A list of a million ints stores a million separate Python objects, each with
   its own header. An array stores a million raw 8-byte integers.

The cost: an array is **homogeneous** and **fixed-size**. All elements share one type, and
you can't `.append()`.

---

## Creating arrays

### From a Python list

```python
print(np.array([10, 20, 30, 40]))
print(np.array([[10, 20, 30],
                [40, 50, 60]]))
```

```text title="Output"
[10 20 30 40]
[[10 20 30]
 [40 50 60]]
```

A list of lists becomes a 2-D array. The nesting depth becomes the number of dimensions.

### Filled arrays

Pass a **tuple** for the shape when you want more than one dimension.

```python
print(np.zeros(4))
print(np.zeros((2, 3)))
print(np.ones((2, 2)))
print(np.full((2, 3), 7))
print(np.eye(3))
```

```text title="Output"
[0. 0. 0. 0.]
[[0. 0. 0.]
 [0. 0. 0.]]
[[1. 1.]
 [1. 1.]]
[[7 7 7]
 [7 7 7]]
[[1. 0. 0.]
 [0. 1. 0.]
 [0. 0. 1.]]
```

Note the decimal points — `zeros` and `ones` produce `float64` by default, while `full`
takes its type from the fill value. `np.eye(n)` is the identity matrix.

`np.empty(shape)` allocates without initialising — faster, but the contents are whatever
was in that memory. Only use it when you're about to overwrite everything.

### Ranges

```python
print(np.arange(5))            # like range()
print(np.arange(2, 10, 3))     # start, stop, step
print(np.linspace(0, 1, 5))    # 5 evenly spaced values
```

```text title="Output"
[0 1 2 3 4]
[2 5 8]
[0.   0.25 0.5  0.75 1.  ]
```

| | Third argument is | `stop` included? |
|---|---|---|
| `np.arange(a, b, step)` | the **step size** | ❌ excluded |
| `np.linspace(a, b, n)` | **how many values** | ✅ included |

`arange` is `range()` for arrays. `linspace` is what you want for plot axes — "give me 100
points from 0 to 1" — and it *does* include the endpoint, unlike everything else in Python.

### Random arrays

The modern interface is a generator. Seed it to get reproducible numbers:

```python
rng = np.random.default_rng(42)
print(rng.integers(1, 100, 5))
print(np.round(rng.random(3), 4))
```

```text title="Output"
[ 9 77 65 44 43]
[0.6974 0.0942 0.9756]
```

Without the seed, `default_rng()` gives different values every run. With `42`, you get those
exact numbers every time — which is what makes examples and tests reproducible.

---

## The six attributes

These describe an array's shape and memory. They're **attributes, not methods** — no
parentheses.

```python
arr = np.array([[10, 20, 30],
                [40, 50, 60]])

print(arr)
print("ndim:", arr.ndim)
print("shape:", arr.shape)
print("size:", arr.size)
print("dtype:", arr.dtype)
print("itemsize:", arr.itemsize, "bytes")
print("nbytes:", arr.nbytes)
```

```text title="Output"
[[10 20 30]
 [40 50 60]]
ndim: 2
shape: (2, 3)
size: 6
dtype: int64
itemsize: 8 bytes
nbytes: 48
```

| Attribute | Means | Here |
|---|---|---|
| `.ndim` | number of dimensions | `2` |
| `.shape` | size along each dimension, as a tuple | `(2, 3)` — 2 rows, 3 columns |
| `.size` | total elements | `6` |
| `.dtype` | type of every element | `int64` |
| `.itemsize` | bytes per element | `8` |
| `.nbytes` | total bytes of data | `48` |

### How `size`, `itemsize` and `nbytes` relate

```python
print(arr.size * arr.itemsize)   # → 48
```

```text title="Output"
48
```

**`nbytes == size × itemsize`.** Six elements at 8 bytes each is 48 bytes. This is only
true because an array is homogeneous — every element is the same size, so total memory is
just multiplication. A Python list can't offer this.

`.shape` is also how you read dimensions off an array without printing it: `len(arr.shape)`
is `arr.ndim`, and `arr.shape[0]` is the number of rows.

### `ndim` by example

```python
print(np.array(5).ndim)         # → 0   a scalar
print(np.array([1, 2]).ndim)    # → 1   a vector
print(np.array([[1, 2]]).ndim)  # → 2   a matrix
print(np.array([[[1]]]).ndim)   # → 3
```

```text title="Output"
0
1
2
3
```

`ndim` is just how many levels of `[` you opened.

---

## Dtypes

Every array has exactly one element type, chosen when the array is built.

```python
print(np.array([1, 2, 3]).dtype)         # → int64
print(np.array([1.0, 2, 3]).dtype)       # → float64
print(np.array([True, False]).dtype)     # → bool
print(np.array([1, 2, "x"]).dtype)       # → <U21
```

```text title="Output"
int64
float64
bool
<U21
```

### Mixed input gets promoted

One `float` among the ints makes the whole array `float64`:

```python
mixed = np.array([1, 2.5, 3])
print(mixed, mixed.dtype)
```

```text title="Output"
[1.  2.5 3. ] float64
```

`1` became `1.`. NumPy picks the narrowest type that holds everything, and `float` is wider
than `int`.

:::warning A string in the list turns everything into strings

`np.array([1, 2, "x"]).dtype` is `<U21` — a 21-character Unicode string. The numbers are now
text, and arithmetic on the array will fail. Anything that isn't numeric drags the whole
array to a string or `object` dtype, silently.

:::

Read `<U21` as: little-endian (`<`), Unicode (`U`), up to 21 characters.

### Setting and converting

```python
print(np.array([1, 2, 3], dtype=np.float64))
print(np.array([1.9, 2.1]).astype(int))
print(np.array([1, 0, 2]).astype(bool))
```

```text title="Output"
[1. 2. 3.]
[1 2]
[ True False  True]
```

`.astype()` returns a **new** array — it never converts in place.

:::danger `.astype(int)` truncates

`1.9` becomes `1`, not `2`. Same behaviour as the built-in `int()` — see
[Values and Types](../01-basics/01-values-and-types.md#type-conversion-casting). Use
`np.round()` first if you want rounding.

:::

`.astype(bool)` follows Python's truthiness: `0` is `False`, everything else is `True`.

### Common dtypes

| Dtype | Bytes | Use for |
|---|---|---|
| `int32` / `int64` | 4 / 8 | whole numbers (`int64` is the default) |
| `float32` / `float64` | 4 / 8 | decimals (`float64` is the default) |
| `bool` | 1 | masks |
| `<U*n*` | varies | fixed-width strings |
| `object` | pointer | anything else — slow, avoid |

Specifying `float32` instead of `float64` halves the memory at the cost of precision. That
trade-off matters for large datasets and machine-learning models.

---

## Common Mistakes

| # | Mistake | Wrong | Right |
|---|---|---|---|
| 1 | Expecting `+` to concatenate | `np.array([1,2]) + np.array([3,4])` is `[4 6]` | `np.concatenate([a, b])` |
| 2 | Expecting `*` to repeat | `np.array([1,2]) * 2` is `[2 4]` | `np.tile(a, 2)` |
| 3 | Attributes with parentheses | `arr.shape()` → `TypeError` | `arr.shape` |
| 4 | Shape as separate arguments | `np.zeros(2, 3)` → `TypeError` | `np.zeros((2, 3))` |
| 5 | Mixing a string into numbers | dtype silently becomes `<U21` | keep arrays numeric |
| 6 | Expecting `.astype()` to mutate | original unchanged | `arr = arr.astype(int)` |
| 7 | Expecting `.astype(int)` to round | `1.9` → `1` | `np.round(x).astype(int)` |
| 8 | `.append()` on an array | `AttributeError` | `np.append(arr, x)` — builds a new array |

That last one is worth internalising: arrays are fixed-size, so `np.append` **copies the
whole array** every call. Building an array in a loop that way is quadratic — collect into a
list and call `np.array()` once at the end.

---

## Summary

| Task | Call |
|---|---|
| From a list | `np.array([...])` |
| Zeros / ones / constant | `np.zeros(s)` / `np.ones(s)` / `np.full(s, v)` |
| Identity matrix | `np.eye(n)` |
| Range by step | `np.arange(a, b, step)` |
| Range by count | `np.linspace(a, b, n)` |
| Random, reproducible | `np.random.default_rng(seed)` |
| Change type | `.astype(dtype)` |

**Key takeaways**

- On arrays `+` and `*` do element-wise **arithmetic**; on lists they concatenate and repeat
- Arrays are homogeneous and fixed-size — that's what buys the speed and the memory saving
- The six attributes are attributes, not methods: no parentheses
- `nbytes == size × itemsize`, which only holds because every element is the same width
- Shapes are **tuples**: `np.zeros((2, 3))`, not `np.zeros(2, 3)`
- One float promotes the array to `float64`; one string drags it to `<U21` and breaks maths
- `linspace` includes its endpoint; `arange` doesn't
- `.astype(int)` truncates, and returns a new array

**See also:** [Indexing, Slicing and Reshaping](./02-indexing-slicing-reshaping.md) ·
[Lists](../03-collections/02-lists.md) for the container being contrasted ·
[Data Types](../01-basics/03-data-types.md) for Python's own types

---

## Run It Yourself

```python title="numpy_arrays.py"
import numpy as np

arr = np.array([[10, 20, 30],
                [40, 50, 60]])

print(arr)
print(f"{'ndim':<10} {arr.ndim}")
print(f"{'shape':<10} {arr.shape}")
print(f"{'size':<10} {arr.size}")
print(f"{'dtype':<10} {arr.dtype}")
print(f"{'itemsize':<10} {arr.itemsize} bytes")
print(f"{'nbytes':<10} {arr.nbytes} bytes  (= {arr.size} x {arr.itemsize})")

print()
print(f"{'arange':<10} {np.arange(2, 10, 3)}")
print(f"{'linspace':<10} {np.linspace(0, 1, 5)}")
print(f"{'zeros':<10} {np.zeros(3)}")
print(f"{'full':<10} {np.full(3, 7)}")

print()
print(f"{'as float':<10} {arr.astype(float).dtype}")
print(f"{'still':<10} {arr.dtype}")
```

```text title="Output"
[[10 20 30]
 [40 50 60]]
ndim       2
shape      (2, 3)
size       6
dtype      int64
itemsize   8 bytes
nbytes     48 bytes  (= 6 x 8)

arange     [2 5 8]
linspace   [0.   0.25 0.5  0.75 1.  ]
zeros      [0. 0. 0.]
full       [7 7 7]

as float   float64
still      int64
```

---

## Practice Questions

*From the Unit 1 question bank. Tags and marks are explained on the
[Python index](../index.md#practice-questions).*

### Unit 1 § J — NumPy

**J1. [PROG]** Import NumPy, create a 1-D array `[10, 20, 30, 40, 50]`, and display it. `[2]`

**J2. [OUT]** For `arr = np.array([[10, 20, 30], [40, 50, 60]])`, give the value of each
attribute. `[6]`

```python
print(arr.ndim)
print(arr.shape)
print(arr.size)
print(arr.dtype)
print(arr.itemsize)
print(arr.nbytes)
```

*Also explain the relationship between `size`, `itemsize`, and `nbytes`.*

**J4. [OUT]** **This is the most important NumPy question on the paper.** `[4]`

```python
a = [1, 2]
print(a * 2)
print(a + a)

import numpy as np
b = np.array([1, 2])
print(b * 2)
print(b + b)
```

*Explain why `*` and `+` mean completely different things for a list and for an array.*

**J9. [THEORY]** Give three reasons a NumPy array is preferred over a Python list for numerical
work. `[3]`

### Viva

1. What does `arr.shape` return for a 1-D array of 5 elements — `(5,)` or `(5)`? Why?
2. Which is faster for arithmetic on 10,000 numbers — a list or a NumPy array? Why?
