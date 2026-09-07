---
sidebar_position: 3
title: Tuples
description: The immutable sequence — the trailing-comma rule, shallow immutability, unpacking, and when a tuple beats a list.
tags: [python, collections]
toc_max_heading_level: 3
---

# Tuples

> **Topic —** An ordered, **immutable** sequence. Everything you can *read* from a list you
> can read from a tuple; nothing can be changed.

---

## Creating a tuple

```python
print(())                                 # → ()
print((1, 2, 3))                          # → (1, 2, 3)
print((1, "Hello", 3.4))                  # → (1, 'Hello', 3.4)
print(("mouse", [8, 4, 6], (1, 2, 3)))    # → nested
```

```text title="Output"
()
(1, 2, 3)
(1, 'Hello', 3.4)
('mouse', [8, 4, 6], (1, 2, 3))
```

Types can mix freely, and tuples can nest — including a list inside a tuple, which matters
later.

### The comma is what makes a tuple, not the parentheses

```python
x = (5)
y = (5,)
print(type(x))   # → <class 'int'>
print(type(y))   # → <class 'tuple'>
print(len(y))    # → 1
```

```text title="Output"
<class 'int'>
<class 'tuple'>
1
```

:::danger

`(5)` is just `5` in parentheses — the parentheses are grouping, exactly as in `(2 + 3) * 4`.
The **trailing comma** is what creates a one-element tuple.

:::

Parentheses are in fact optional:

```python
z = 1, 2, 3
print(z, type(z).__name__)   # → (1, 2, 3) tuple
```

This is why `return a, b` returns a tuple, and why `a, b = b, a` works.

---

## Indexing

Same two index systems as [strings](./01-strings-and-slicing.md) and lists:

```python
mt = ('p', 'e', 'r', 'm', 'i', 't')
print(mt[0])    # → p
print(mt[-1])   # → t
print(mt[-6])   # → p    same as mt[0]
```

```text title="Output"
p
t
p
```

The maximum index is `len(t) - 1`. Two different errors are possible:

```python
mt[10]    # IndexError: tuple index out of range
mt[1.0]   # TypeError: tuple indices must be integers or slices, not float
```

An index must be an `int` — even `1.0`, which *is* a whole number, is rejected.

### Nested indexing

Chain the brackets, working outside in:

```python
n = ("mouse", [8, 4, 6], (1, 2, 3))
print(n[0][3])   # → s    4th character of "mouse"
print(n[1][1])   # → 4    2nd item of the list
print(n[2][0])   # → 1    1st item of the inner tuple
```

```text title="Output"
s
4
1
```

`n[0]` is a string, so `n[0][3]` indexes *into the string*.

---

## Slicing

Identical to strings and lists — `stop` excluded, all three parts optional:

```python
t = (10, 20, 30, 40, 50, 60)
print(t[:4])      # → (10, 20, 30, 40)
print(t[-3:])     # → (40, 50, 60)
print(t[:])       # → the whole tuple
print(t[1:5:2])   # → (20, 40)
print(t[::-1])    # → (60, 50, 40, 30, 20, 10)
```

```text title="Output"
(10, 20, 30, 40)
(40, 50, 60)
(10, 20, 30, 40, 50, 60)
(20, 40)
(60, 50, 40, 30, 20, 10)
```

```python
mt = ('p', 'r', 'o', 'g', 'r', 'a', 'm', 'i', 'z')
print(mt[:-7])   # → ('p', 'r')
print(mt[7:])    # → ('i', 'z')
print(mt[:])     # → the whole tuple
```

```text title="Output"
('p', 'r')
('i', 'z')
('p', 'r', 'o', 'g', 'r', 'a', 'm', 'i', 'z')
```

A slice of a tuple is a **tuple**, just as a slice of a list is a list.

---

## Tuples are immutable

```python
t = (1, 2, 3)
t[0] = 99
```

```text title="Error"
TypeError: 'tuple' object does not support item assignment
```

There are no `.append()`, `.remove()`, `.insert()` or `.sort()` methods either — a tuple has
only `.count()` and `.index()`:

```python
tc = (1, 2, 2, 3)
print(tc.count(2), tc.index(3))   # → 2 3
```

```text title="Output"
2 3
```

### Immutability is shallow

This is the trap. A tuple freezes **which objects** it holds, not the objects themselves. If
one of them is a list, that list is still mutable:

```python
t = ("mouse", [8, 4, 6], (1, 2, 3))
t[1][0] = 100
print(t)          # → ('mouse', [100, 4, 6], (1, 2, 3))

t[0] = "cat"      # TypeError: 'tuple' object does not support item assignment
```

```text title="Output"
('mouse', [100, 4, 6], (1, 2, 3))
```

`t[1][0] = 100` succeeds because it doesn't touch the tuple — it mutates the *list* the tuple
points at. `t[0] = "cat"` fails because it tries to change a slot of the tuple itself.

:::note

Read it as: the tuple's slots are fixed, but a slot can hold something changeable. So a tuple
is only fully immutable if everything inside it is.

:::

---

## Operators

### `+` concatenation and `*` repetition

Both build a **new** tuple; neither modifies the originals.

```python
T1 = (1, 2, 3)
T2 = (4, 5, 6)
print(T1 * 2)                        # → (1, 2, 3, 1, 2, 3)
print(("Red", "Blue") * 3)           # → ('Red', 'Blue', 'Red', 'Blue', 'Red', 'Blue')
print(T1 + T2)                       # → (1, 2, 3, 4, 5, 6)
```

```text title="Output"
(1, 2, 3, 1, 2, 3)
('Red', 'Blue', 'Red', 'Blue', 'Red', 'Blue')
(1, 2, 3, 4, 5, 6)
```

```python
a = (1, 2)
b = (3, 4)
c = a + b
print(a)   # → (1, 2)         a is unchanged
print(c)   # → (1, 2, 3, 4)
```

```text title="Output"
(1, 2)
(1, 2, 3, 4)
```

```python
t = (1, 2, 3)
print(t + (4, 5))   # → (1, 2, 3, 4, 5)
print(t * 2)        # → (1, 2, 3, 1, 2, 3)
print(t)            # → (1, 2, 3)   still the original
```

```text title="Output"
(1, 2, 3, 4, 5)
(1, 2, 3, 1, 2, 3)
(1, 2, 3)
```

`t` is unchanged on the last line because `+` and `*` are **expressions that produce a new
tuple** — they can't modify an immutable object. To keep a result, assign it: `t = t + (4, 5)`.
That rebinds the name; it doesn't mutate the old tuple.

### `in`, `len()` and iteration

```python
numbers = (10, 20, 30, 40)
print(20 in numbers)              # → True
print(100 not in (10, 20, 30))    # → True

for item in ("Apple", "Orange", "Mango"):
    print(item)

print(len(("Rahul", 22, "CSE", 8.9)))   # → 4
```

```text title="Output"
True
True
Apple
Orange
Mango
4
```

---

## Deleting a tuple

You can't delete an *element*, but you can delete the whole **name**:

```python
t = (5, 10)
print(t)   # → (5, 10)
del t
print(t)
```

```text title="Error"
NameError: name 't' is not defined
```

It's a `NameError`, not a `TypeError`, because `del t` removed the name from the namespace
entirely. By the time the last `print` runs, `t` doesn't exist — this isn't about tuples at
all. Compare `del t[0]`, which *would* be a `TypeError`.

---

## Unpacking

Assign every element to its own name in one line:

```python
student = ("Vettri", 28, "CSE")
name, age, dept = student
print(name, age, dept)   # → Vettri 28 CSE
```

```text title="Output"
Vettri 28 CSE
```

The number of names must match exactly:

```python
p, q = (1, 2, 3)
```

```text title="Error"
ValueError: too many values to unpack (expected 2, got 3)
```

### Swapping

No temporary variable needed — the right side builds a tuple, then it's unpacked:

```python
a, b = 10, 20
a, b = b, a
print(a, b)   # → 20 10
```

```text title="Output"
20 10
```

### Starred unpacking

`*name` collects whatever's left, **as a list**:

```python
first, *rest = (1, 2, 3, 4, 5)
print(first)   # → 1
print(rest)    # → [2, 3, 4, 5]
```

```text title="Output"
1
[2, 3, 4, 5]
```

---

## Why choose a tuple over a list?

Three concrete reasons:

1. **It can be a dictionary key.** Lists cannot — they're unhashable, because their contents
   can change.

   ```python
   locations = {(0, 0): "origin", (1, 2): "point A"}
   print(locations[(1, 2)])   # → point A

   {[1, 2]: "x"}
   # TypeError: cannot use 'list' as a dict key (unhashable type: 'list')
   ```

2. **It protects data from accidental change.** If a value shouldn't be modified, a tuple
   makes that a guarantee rather than a convention.

3. **It's slightly smaller and faster** than the equivalent list — immutability lets Python
   skip bookkeeping. Marginal, but real in hot loops.

A fourth, practical reason: tuples signal *record* and lists signal *collection*. `(name, age,
dept)` is one thing with several fields; `[name1, name2, name3]` is many of the same thing.

### Converting

```python
print(tuple([1, 2, 3]))   # → (1, 2, 3)
print(list((1, 2, 3)))    # → [1, 2, 3]
```

```text title="Output"
(1, 2, 3)
[1, 2, 3]
```

To "modify" a tuple: convert to a list, change it, convert back.

---

## Common Mistakes

| # | Mistake | Wrong | Right |
|---|---|---|---|
| 1 | One-element tuple without the comma | `(5)` is an `int` | `(5,)` |
| 2 | Assigning to an element | `t[0] = 1` → `TypeError` | rebuild: `t = (1,) + t[1:]` |
| 3 | Expecting `t + (4,)` to change `t` | it returns a new tuple | `t = t + (4,)` |
| 4 | Thinking immutable means deeply frozen | `t[1][0] = 100` works | only if nothing inside is mutable |
| 5 | Looking for `.append()` | tuples have no such method | use a list |
| 6 | Float index | `t[1.0]` → `TypeError` | `t[1]` |
| 7 | Unpacking count mismatch | `a, b = (1,2,3)` → `ValueError` | match the count, or `a, *b` |
| 8 | Using a list as a dict key | `TypeError: unhashable` | use a tuple |

---

## Summary

| | List | Tuple |
|---|---|---|
| Syntax | `[1, 2, 3]` | `(1, 2, 3)` |
| Mutable | ✅ | ❌ |
| Ordered | ✅ | ✅ |
| Duplicates | ✅ | ✅ |
| Indexing / slicing | ✅ | ✅ |
| `.append()` / `.sort()` | ✅ | ❌ |
| `.count()` / `.index()` | ✅ | ✅ |
| Valid as a dict key | ❌ | ✅ |

**Key takeaways**

- The **comma** makes a tuple, not the parentheses — `(5,)` not `(5)`
- Reading works exactly as with lists; nothing can be written
- Immutability is **shallow** — a list inside a tuple is still mutable
- `+` and `*` return new tuples; the originals are untouched
- `del t` removes the *name* — hence `NameError`, not `TypeError`
- Unpacking must match the element count; `*rest` collects the remainder as a **list**
- Use a tuple for fixed records and dict keys; a list for collections that grow

**See also:** [Lists](./02-lists.md) for the mutable version ·
[Dictionaries and Sets](./04-dicts-and-sets.md) for where tuple keys get used ·
[Data Types](../01-basics/03-data-types.md) for `tuple` in context

---

## Run It Yourself

```python title="tuples.py"
student = (119, "Vettri", "CSE", 8.9)

print(f"{'full tuple':<16} {student}")
print(f"{'roll no':<16} {student[0]}")
print(f"{'name':<16} {student[1]}")
print(f"{'department':<16} {student[2]}")
print(f"{'cgpa':<16} {student[3]}")
print(f"{'last item':<16} {student[-1]}")
print(f"{'length':<16} {len(student)}")
print(f"{'first two':<16} {student[:2]}")
print(f"{'reversed':<16} {student[::-1]}")

# unpacking
roll, name, dept, cgpa = student
print(f"{'unpacked':<16} {roll} / {name} / {dept} / {cgpa}")

# operators build new tuples
print(f"{'+ (concat)':<16} {student[:2] + ('extra',)}")
print(f"{'* (repeat)':<16} {(1, 2) * 3}")
print(f"{'in':<16} {'Vettri' in student}")
print(f"{'unchanged':<16} {student}")
```

```text title="Output"
full tuple       (119, 'Vettri', 'CSE', 8.9)
roll no          119
name             Vettri
department       CSE
cgpa             8.9
last item        8.9
length           4
first two        (119, 'Vettri')
reversed         (8.9, 'CSE', 'Vettri', 119)
unpacked         119 / Vettri / CSE / 8.9
+ (concat)       (119, 'Vettri', 'extra')
* (repeat)       (1, 2, 1, 2, 1, 2)
in               True
unchanged        (119, 'Vettri', 'CSE', 8.9)
```

---

## Practice Questions

*From the Unit 1 question bank. Tags and marks are explained on the
[Python index](../index.md#practice-questions).*

### Unit 1 § F — Tuples

**F1. [OUT]** `[4]`

```python
t = ("mouse", [8, 4, 6], (1, 2, 3))
t[1][0] = 100
print(t)
t[0] = "cat"
print(t)
```

**F2. [OUT]** `[3]`

```python
x = (5)
y = (5,)
print(type(x))
print(type(y))
print(len(y))
```

**F3. [PROG]** Create a tuple holding your **roll number, name, department, and CGPA**. Print
every element using indexing. `[4]`

**F4. [OUT]** Given `t = (10, 20, 30, 40, 50, 60)` `[5]`

```python
t = (10, 20, 30, 40, 50, 60)
print(t[:4])
print(t[-3:])
print(t[:])
print(t[1:5:2])
print(t[::-1])
```

**F5. [PROG]** Create two tuples and perform: **concatenation**, **repetition**, a **membership
test** (both `in` and `not in`), and **length**. `[5]`

**F6. [OUT]** Name the error and say why it is *this* error and not a `TypeError`. `[3]`

```python
t = (5, 10)
print(t)
del t
print(t)
```

**F7. [OUT]** Tuple unpacking. `[4]`

```python
student = ("Vettri", 28, "CSE")
name, age, dept = student
print(name, age, dept)

a, b = 10, 20
a, b = b, a
print(a, b)

first, *rest = (1, 2, 3, 4, 5)
print(first)
print(rest)
```

**F8. [THEORY]** Give three concrete reasons to choose a **tuple** over a **list**. `[3]`

**F9. [OUT]** `[2]`

```python
t = (1, 2, 3)
print(t + (4, 5))
print(t * 2)
print(t)
```

*Why is `t` unchanged on the last line?*

### Viva

1. What makes a tuple a tuple — the parentheses or the comma?
2. Why can a list be modified inside a tuple?
