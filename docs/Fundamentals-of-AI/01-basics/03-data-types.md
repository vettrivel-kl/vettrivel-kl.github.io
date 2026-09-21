---
sidebar_position: 3
title: Data Types
description: Python's four scalar and four collection types — int, float, str, bool, list, tuple, dict, set.
tags: [python, basics, types, collections]
toc_max_heading_level: 3
---

# Data Types

> **Exercise —** Create one variable of each major data type and display the value and
> type of each.

---

## Overview

Python has four **scalar** types (single values) and four **collection** types
(hold many values).

| Type | Name | Example | Description | Mutable? |
|---|---|---|---|---|
| Integer | `int` | `28` | Whole numbers | ❌ immutable\* |
| Float | `float` | `5.9` | Decimal numbers | ❌ immutable\* |
| String | `str` | `"Vettri"` | Text, characters | ❌ immutable\* |
| Boolean | `bool` | `True` / `False` | Logical values | ❌ immutable\* |
| List | `list` | `[1, 2, 3]` | Ordered, allows duplicates | ✅ mutable |
| Tuple | `tuple` | `(1, 2, 3)` | Ordered, allows duplicates | ❌ immutable |
| Dictionary | `dict` | `{"key": "value"}` | Key-value pairs | ✅ mutable |
| Set | `set` | `{1, 2, 3}` | Unordered, unique values only | ✅ mutable |

:::note On "immutable" for scalars

The *value* `28` cannot be changed in place, but you can always point the variable at a
new value: `age = 28` then `age = 29` is fine. What you cannot do is mutate `28` itself.
Compare with a list, where `fruits[0] = "pear"` changes the existing object.

:::

The three questions you can ask about any collection:

| | Ordered? | Duplicates? | Mutable? | Access by |
|---|---|---|---|---|
| `list` | ✅ | ✅ | ✅ | index |
| `tuple` | ✅ | ✅ | ❌ | index |
| `dict` | ✅ (insertion order) | keys ❌, values ✅ | ✅ | key |
| `set` | ❌ | ❌ | ✅ | membership only |

---

## 1. `int` — whole numbers

Positive, negative, or zero. No decimal point.

```python
age = 28
print(age)                    # → 28
print(type(age))              # → <class 'int'>
print(type(age).__name__)     # → int
```

```python
positive_number = 100
negative_number = -50
zero = 0
large_number = 1000000
```

Operations:

```python
print(10 + 5)    # → 15
print(10 - 5)    # → 5
print(10 * 5)    # → 50
print(10 // 3)   # → 3    integer division
print(10 % 3)    # → 1    modulo — remainder
print(2 ** 3)    # → 8    exponent / power
```

:::note

Python integers have **no size limit** — they grow to fit available memory. `2 ** 1000`
is a perfectly ordinary `int`.

:::

---

## 2. `float` — decimal numbers

```python
height = 5.9
print(height)                 # → 5.9
print(type(height))           # → <class 'float'>
```

```python
price = 99.99
temperature = -2.5
pi_value = 3.14159
scientific = 1.5e-3      # scientific notation → 0.0015
```

Operations:

```python
print(10.5 + 5.2)          # → 15.7
print(10.5 - 5.2)          # → 5.3
print(10.5 * 5.2)          # → 54.6
print(10.5 / 5.2)          # → 2.019230769230769
print(round(3.14159, 2))   # → 3.14
```

**Mixing `int` and `float` gives a `float`:**

```python
result = 10 + 5.5
print(result)         # → 15.5
print(type(result))   # → <class 'float'>
```

:::warning

Floats are **approximate**. `0.1 + 0.2` is `0.30000000000000004`, so `0.1 + 0.2 == 0.3`
is `False`. Compare with a tolerance instead: `abs(a - b) < 1e-9`. See
[Values and Types](./01-values-and-types.md#float) for why.

:::

---

## 3. `str` — text

```python
name = "Vettri"
print(name)                   # → Vettri
print(type(name))             # → <class 'str'>
```

```python
city = "Chennai"
sentence = "Python is awesome!"
empty_string = ""
number_as_string = "12345"    # ← a str, NOT a number
```

All three quote styles are valid:

```python
single_quote = 'Hello'
double_quote = "Hello"
triple_quote = """Hello
World"""                      # spans multiple lines
```

Operations:

```python
print("Hello" + " " + "World")       # → Hello World
print("Ha" * 3)                      # → HaHaHa
print(len("Python"))                 # → 6
print("python".upper())              # → PYTHON
print("PYTHON".lower())              # → python
print("hello world".title())         # → Hello World
print("python" in "I love python")   # → True
```

---

## 4. `bool` — `True` or `False`

```python
is_student = True
print(is_student)             # → True
print(type(is_student))       # → <class 'bool'>
```

Capital first letter is mandatory — `true` raises `NameError`.

Booleans usually come from **comparisons**:

```python
age = 25
print(age > 18)          # → True
print(age == 25)         # → True
print(age < 30)          # → True
print("a" in "apple")    # → True
print(type(age > 18))    # → <class 'bool'>
```

Logical operators:

```python
print(True and True)     # → True
print(True and False)    # → False
print(True or False)     # → True
print(not True)          # → False
```

:::note `bool` is a subclass of `int`

`True == 1` and `False == 0`, so `True + True` is `2`. This has real consequences — see
[Values and Types](./01-values-and-types.md#bool-is-a-subclass-of-int).

:::

---

## 5. `list` — ordered, mutable

```python
fruits = ["apple", "banana", "orange", "mango"]
print(fruits)          # → ['apple', 'banana', 'orange', 'mango']
print(type(fruits))    # → <class 'list'>
```

```python
numbers = [1, 2, 3, 4, 5]
mixed_list = [1, "hello", 3.14, True, None]   # types can mix freely
nested_list = [1, [2, 3], [4, [5, 6]]]
empty_list = []
```

**Indexing** — position `0` is the first element:

```python
print(fruits[0])     # → apple     first
print(fruits[1])     # → banana    second
print(fruits[-1])    # → mango     last
print(fruits[-2])    # → orange    second to last
```

**Slicing** — `[start:stop]`, where `stop` is *excluded*:

```python
print(fruits[0:2])   # → ['apple', 'banana']
print(fruits[1:3])   # → ['banana', 'orange']
print(fruits[:2])    # → ['apple', 'banana']            first 2
print(fruits[2:])    # → ['orange', 'mango']            index 2 to end
```

**Lists are mutable** — you can change them in place:

```python
fruits = ["apple", "banana", "orange", "mango"]
fruits.append("grape")
print(fruits)        # → ['apple', 'banana', 'orange', 'mango', 'grape']
fruits.remove("apple")
print(fruits)        # → ['banana', 'orange', 'mango', 'grape']
fruits[0] = "pear"
print(fruits)        # → ['pear', 'orange', 'mango', 'grape']
```

---

## 6. `tuple` — ordered, immutable

```python
coordinates = (10, 20)
print(coordinates)        # → (10, 20)
print(type(coordinates))  # → <class 'tuple'>
```

```python
rgb_color = (255, 128, 0)
single_element_tuple = (42,)      # ← the comma is REQUIRED
mixed_tuple = (1, "hello", 3.14, True)
nested_tuple = (1, (2, 3), (4, (5, 6)))
empty_tuple = ()
```

:::warning `(42)` is not a tuple

It's just the integer `42` in parentheses. The trailing comma in `(42,)` is what makes it
a tuple.

```python
print(type((42)))    # → <class 'int'>
print(type((42,)))   # → <class 'tuple'>
```

:::

Indexing and slicing work exactly as with lists:

```python
print(coordinates[0])    # → 10
print(coordinates[-1])   # → 20
print(rgb_color[1:])     # → (128, 0)
```

**Tuples are immutable** — these all fail:

```python
coordinates[0] = 30      # TypeError: 'tuple' object does not support item assignment
coordinates.append(30)   # AttributeError: 'tuple' object has no attribute 'append'
```

**Why use a tuple then?**

- Slightly faster and smaller than a list
- Can be used as a **dictionary key** (lists cannot — they're unhashable)
- Protects data from accidental modification

:::danger The gotcha

A tuple containing a mutable object is only *shallowly* immutable. You can't swap out the
list, but you can change what's inside it:

```python
t = ("mouse", [8, 4, 6])
t[1][0] = 100
print(t)   # → ('mouse', [100, 4, 6])
```

:::

---

## 7. `dict` — key/value pairs

```python
student = {"name": "Vettri", "age": 28, "city": "Chennai"}
print(student)         # → {'name': 'Vettri', 'age': 28, 'city': 'Chennai'}
print(type(student))   # → <class 'dict'>
```

```python
car = {"brand": "Tesla", "model": "Model 3", "year": 2023}
empty_dict = {}
nested_dict = {"person": {"name": "Alice", "age": 30}}
```

**Access by key**, not by index:

```python
print(student["name"])       # → Vettri
print(student["age"])        # → 28
print(car.get("brand"))      # → Tesla
```

| Form | Missing key behaviour |
|---|---|
| `student["salary"]` | raises `KeyError` |
| `student.get("salary")` | returns `None` |
| `student.get("salary", 0)` | returns `0` — your chosen default |

Check before you reach:

```python
print("name" in student)     # → True
print("salary" in student)   # → False
```

Inspecting:

```python
print(len(student))                  # → 3
print(list(student.keys()))          # → ['name', 'age', 'city']
print(list(student.values()))        # → ['Vettri', 28, 'Chennai']
print(list(student.items()))         # → [('name', 'Vettri'), ('age', 28), ('city', 'Chennai')]
```

**Dicts are mutable:**

```python
student["age"] = 29                       # change
student["email"] = "vettri@example.com"   # add
del student["city"]                       # delete
```

Iterating:

```python
student = {"name": "Vettri", "age": 28, "city": "Chennai"}
for key, value in student.items():
    print(f"{key}: {value}")
```

```text title="Output"
name: Vettri
age: 28
city: Chennai
```

:::note

Since Python 3.7, dicts **keep insertion order**. Don't rely on this in code meant for
older versions.

:::

---

## 8. `set` — unordered, unique

```python
colors = {"red", "green", "blue", "yellow"}
print(type(colors))   # → <class 'set'>
```

:::warning Set print order is not stable

Python randomises string hashing per process, so the same script prints sets in a
*different order on every run*. Two real runs of this file:

```text
Run 1:  {'yellow', 'green', 'blue', 'red'}
Run 2:  {'red', 'blue', 'green', 'yellow'}
```

Never depend on set order. If you need a stable order, use `sorted(colors)`.

:::

```python
numbers_set = {1, 2, 3, 4, 5}
empty_set = set()        # ← {} creates an empty DICT, not a set!
```

**Duplicates are removed automatically:**

```python
print(set([1, 1, 2, 2, 3, 3]))   # → {1, 2, 3}
print(len({1, 1, 2, 2, 3, 3}))   # → 3
```

:::danger A surprise worth understanding

Because `True == 1`, a set treats them as the *same element*:

```python
mixed_set = {1, "hello", 3.14, True}
print(mixed_set)        # → {1, 3.14, 'hello'}   (order varies)
print(len(mixed_set))   # → 3, not 4!
```

Four items went in, three came out — `True` was absorbed by `1`. Same reason
`{0, False}` has length 1.

:::

Key features:

- ✅ No duplicates, ever
- ❌ **Unordered** — `colors[0]` raises `TypeError`, there is no "first" element
- ✅ Extremely fast membership tests

```python
print(len(colors))            # → 4
print("red" in colors)        # → True
print("purple" in colors)     # → False
```

**Set algebra** — this is what sets are really for:

```python
set1 = {1, 2, 3, 4}
set2 = {3, 4, 5, 6}

print(set1 | set2)   # → {1, 2, 3, 4, 5, 6}   union — everything
print(set1 & set2)   # → {3, 4}               intersection — common
print(set1 - set2)   # → {1, 2}               difference — in set1 only
print(set1 ^ set2)   # → {1, 2, 5, 6}         symmetric difference — not both
```

**Sets are mutable:**

```python
colors.add("purple")
colors.remove("red")      # KeyError if absent
colors.discard("red")     # safe — no error if absent
```

---

## Summary

| Type | Name | Example | Ordered | Duplicates | Mutable |
|---|---|---|---|---|---|
| Integer | `int` | `28` | — | — | ❌ |
| Float | `float` | `5.9` | — | — | ❌ |
| String | `str` | `"Vettri"` | ✅ | ✅ | ❌ |
| Boolean | `bool` | `True` | — | — | ❌ |
| List | `list` | `[1, 2, 3]` | ✅ | ✅ | ✅ |
| Tuple | `tuple` | `(1, 2, 3)` | ✅ | ✅ | ❌ |
| Dictionary | `dict` | `{"k": "v"}` | ✅ | keys ❌ | ✅ |
| Set | `set` | `{1, 2, 3}` | ❌ | ❌ | ✅ |

**Choosing a collection**

- Need order and to change it → **`list`**
- Need order, must not change → **`tuple`**
- Looking things up by name → **`dict`**
- Need uniqueness or fast membership → **`set`**

---

## Cheat Sheet

```python
# Integer
age = 25
age = int("25")            # from a string

# Float
height = 5.9
price = float("99.99")     # from a string

# String
name = "Vettri"
name = str(123)            # from a number

# Boolean
is_student = True
is_student = (5 > 3)       # from a comparison

# List
fruits = [1, 2, 3]
fruits = list((1, 2, 3))   # from a tuple

# Tuple
coordinates = (10, 20)
coordinates = tuple([10, 20])          # from a list

# Dictionary
student = {"name": "Vettri", "age": 28}
student = dict(name="Vettri", age=28)  # keyword form

# Set
unique = {1, 2, 3}
unique = set([1, 1, 2, 2, 3])          # removes duplicates → {1, 2, 3}
```

**See also:** [Values and Types](./01-values-and-types.md) for `type()` vs `isinstance()`
and type conversion · [Variables and Naming](./02-variables-and-naming.md) for naming
variables

---

## Run It Yourself

```python title="data_types.py"
samples = [
    ("age",         28),
    ("height",      5.9),
    ("name",        "Vettri"),
    ("is_student",  True),
    ("fruits",      ["apple", "banana"]),
    ("coordinates", (10, 20)),
    ("student",     {"name": "Vettri", "age": 28}),
    ("colors",      {"red", "green"}),
]

print(f"{'Variable':<14} {'Type':<8} Value")
print("-" * 52)
for label, value in samples:
    print(f"{label:<14} {type(value).__name__:<8} {value}")
```

```text title="Output"
Variable       Type     Value
----------------------------------------------------
age            int      28
height         float    5.9
name           str      Vettri
is_student     bool     True
fruits         list     ['apple', 'banana']
coordinates    tuple    (10, 20)
student        dict     {'name': 'Vettri', 'age': 28}
colors         set      {'green', 'red'}
```

*(the `set` line's order will differ on your run — see the warning above)*

---

## Practice Questions

*From the Unit 1 question bank. Tags and marks are explained on the
[Python index](../index.md#practice-questions).*

### Unit 1 § A — Variables, Naming & Data Types

**A4. [PROG]** Create one variable of **each** of these eight datatypes, then print the value
**and** the type of each: integer, float, string, boolean, list, tuple, dictionary, set. `[8]`

**A5. [OUT]** `[3]`

```python
print(type(10))
print(type(10.0))
print(type("10"))
print(type(True))
print(type([1, 2]))
print(type((1, 2)))
print(type({1: 2}))
print(type({1, 2}))
```

**A6. [THEORY]** Classify each as **mutable** or **immutable**: `int`, `str`, `list`, `tuple`,
`dict`, `set`, `bool`, `float`. Then explain in two sentences what "immutable" actually means —
what is it that cannot change? `[4]`

### Viva

1. Name two mutable and two immutable built-in types.
