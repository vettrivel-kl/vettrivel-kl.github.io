---
sidebar_position: 4
title: Dictionaries and Sets
description: Key/value lookup with dict, uniqueness and set algebra with set, and why keys must be immutable.
tags: [python, collections]
toc_max_heading_level: 3
---

# Dictionaries and Sets

> **Topic —** Two collections that aren't accessed by position. A `dict` looks things up by
> **key**; a `set` only answers "is this in here?".

| | Access by | Ordered | Duplicates |
|---|---|---|---|
| `dict` | key | insertion order | keys ❌, values ✅ |
| `set` | membership only | ❌ | ❌ |

---

## Dictionaries

A `dict` stores **key: value** pairs.

```python
student = {"Name": "Vettri", "Age": 28, "Department": "CSE", "CGPA": 8.9}
print(list(student.values()))
```

```text title="Output"
['Vettri', 28, 'CSE', 8.9]
```

### Reading values

```python
d = {"a": 1, "b": 2, "c": 3}
print(d["b"])              # → 2
print(d.get("z"))          # → None
print(d.get("z", 0))       # → 0
print(list(d.keys()))      # → ['a', 'b', 'c']
print(list(d.values()))    # → [1, 2, 3]
print(list(d.items()))     # → [('a', 1), ('b', 2), ('c', 3)]
print(len(d))              # → 3
```

```text title="Output"
2
None
0
['a', 'b', 'c']
[1, 2, 3]
[('a', 1), ('b', 2), ('c', 3)]
3
```

Note `.items()` gives you a list of **tuples** — which is why `for k, v in d.items():`
unpacks cleanly.

### `[]` vs `.get()`

A missing key with `[]` is an error:

```python
d = {"a": 1}
print(d["z"])
```

```text title="Error"
KeyError: 'z'
```

```python
print(d.get("z"))      # → None    no error
print(d.get("z", 0))   # → 0       your chosen default
print("z" in d)        # → False   just checking
```

| Form | Missing key |
|---|---|
| `d["z"]` | raises `KeyError` |
| `d.get("z")` | returns `None` |
| `d.get("z", 0)` | returns `0` |
| `"z" in d` | returns `False` |

:::tip

Use `[]` when the key *must* exist — you want the error if it doesn't. Use `.get()` when
absence is normal and you have a sensible default.

:::

### Adding, changing, removing

Dicts are mutable. There's no separate "add" and "update" — assigning to a key does both,
depending on whether it already exists.

```python
student = {"Name": "Vettri", "Age": 28, "Department": "CSE", "CGPA": 8.9}

student["College"] = "SRM"      # new key → added
print(student)

student["CGPA"] = 9.1           # existing key → updated
print(student)

del student["College"]
print(student)

popped = student.pop("Age")
print("popped", popped, student)
```

```text title="Output"
{'Name': 'Vettri', 'Age': 28, 'Department': 'CSE', 'CGPA': 8.9, 'College': 'SRM'}
{'Name': 'Vettri', 'Age': 28, 'Department': 'CSE', 'CGPA': 9.1, 'College': 'SRM'}
{'Name': 'Vettri', 'Age': 28, 'Department': 'CSE', 'CGPA': 9.1}
popped 28 {'Name': 'Vettri', 'Department': 'CSE', 'CGPA': 9.1}
```

`.update()` merges another dict in, overwriting on collision. `.setdefault()` reads a key,
inserting a default only if it's absent:

```python
e = {"a": 1}
e.update({"b": 2, "a": 99})
print(e)                        # → {'a': 99, 'b': 2}   'a' overwritten
print(e.setdefault("c", 3), e)  # → 3  — 'c' was missing, so inserted
print(e.setdefault("a", 100), e) # → 99 — 'a' existed, default ignored
```

```text title="Output"
{'a': 99, 'b': 2}
3 {'a': 99, 'b': 2, 'c': 3}
99 {'a': 99, 'b': 2, 'c': 3}
```

### Iterating

Looping a dict directly gives **keys**:

```python
d = {"name": "Vettri", "age": 28}

for k in d:
    print(k)

for v in d.values():
    print(v)

for k, v in d.items():
    print(f"{k}: {v}")
```

```text title="Output"
name
age
Vettri
28
name: Vettri
age: 28
```

### Nesting and comprehensions

```python
nd = {"person": {"name": "Alice", "age": 30}}
print(nd["person"]["name"])   # → Alice
```

```text title="Output"
Alice
```

```python
print({x: x * x for x in range(1, 5)})
print({k: v for k, v in {"a": 1, "b": 2, "c": 3}.items() if v > 1})
```

```text title="Output"
{1: 1, 2: 4, 3: 9, 4: 16}
{'b': 2, 'c': 3}
```

### Keys must be immutable

```python
for key in ["name", 10, (1, 2), 3.14]:
    print(f"  {key!r:<10} legal")

{[1, 2]: "x"}
```

```text title="Output"
  'name'     legal
  10         legal
  (1, 2)     legal
  3.14       legal
```

```text title="Error"
TypeError: cannot use 'list' as a dict key (unhashable type: 'list')
```

| Candidate | Legal key? | Why |
|---|---|---|
| `"name"` | ✅ | `str` is immutable |
| `10` | ✅ | `int` is immutable |
| `(1, 2)` | ✅ | `tuple` is immutable |
| `3.14` | ✅ | `float` is immutable |
| `[1, 2]` | ❌ | `list` is mutable → unhashable |

:::note Why the rule exists

A dict finds a value by computing a **hash** of the key and using it to pick a storage slot.
If the key could change after insertion, its hash would change, and the value would be
stranded in a slot nobody looks in again. Python forbids the situation instead of letting it
happen.

`(1, 2)` is fine — but a tuple containing a list is **not**, for the same reason
[tuple immutability is shallow](./03-tuples.md#immutability-is-shallow).

:::

---

## Sets

A `set` holds **unique, unordered** values.

### Duplicates vanish on creation

```python
s = {1, 2, 2, 3, 3, 3, 4}
print(s)        # → {1, 2, 3, 4}
print(len(s))   # → 4
```

```text title="Output"
{1, 2, 3, 4}
4
```

Seven values in, four out. A set stores each value by its hash, so a repeat lands in a slot
that's already occupied and is simply not stored again.

```python
print(sorted(set([3, 1, 2, 1])))   # → [1, 2, 3]
```

This is the standard way to deduplicate a list — though it loses the original order.

:::warning Set order is not something you can rely on

Sets of small integers often print in ascending order, which makes it *look* ordered. It
isn't — that's a side effect of how ints hash. Sets of strings print in a different order on
every run, because Python randomises string hashing per process. Use `sorted()` when order
matters.

:::

### No indexing

```python
{1, 2, 3}[0]
```

```text title="Error"
TypeError: 'set' object is not subscriptable
```

There is no "first" element, so there's nothing for `[0]` to mean. Convert to a list first if
you need positions.

### The empty-set trap

```python
print(type({}).__name__)       # → dict
print(type(set()).__name__)    # → set
```

```text title="Output"
dict
set
```

`{}` is an empty **dict**. The only way to write an empty set is `set()`.

### Set algebra

This is what sets are really for.

```python
a = {1, 2, 3, 4}
b = {3, 4, 5, 6}

print(a | b)   # → {1, 2, 3, 4, 5, 6}   union — everything
print(a & b)   # → {3, 4}               intersection — in both
print(a - b)   # → {1, 2}               difference — in a only
print(a ^ b)   # → {1, 2, 5, 6}         symmetric difference — not in both
```

```text title="Output"
{1, 2, 3, 4, 5, 6}
{3, 4}
{1, 2}
{1, 2, 5, 6}
```

Each operator has a method form — `a.union(b)`, `a.intersection(b)`, `a.difference(b)`,
`a.symmetric_difference(b)` — which read better when the other side isn't already a set.

Comparison operators test containment:

```python
print({1, 2} <= {1, 2, 3})           # → True    subset
print({1, 2, 3} >= {1, 2})           # → True    superset
print({1, 5}.isdisjoint({2, 3}))     # → True    nothing in common
```

```text title="Output"
True
True
True
```

### Changing a set

```python
c = {"red", "green"}
c.add("blue")
print(sorted(c))        # → ['blue', 'green', 'red']

c.discard("nope")       # not there — no error
print(sorted(c))

c.remove("nope")        # KeyError: 'nope'
```

```text title="Output"
['blue', 'green', 'red']
['blue', 'green', 'red']
```

`.discard()` is silent on a missing value; `.remove()` raises `KeyError`. Pick whichever
matches your intent.

### Membership is the point

Checking `x in some_set` is dramatically faster than `x in some_list` for large collections —
a hash lookup instead of scanning every element. If your code does a lot of "have I seen this
already?", a set is the right container.

---

## Booleans in conditions

Comparisons produce `bool`, which is what `if` consumes:

```python
x, y = 10, 10
print(x == y)   # → True
print(x != y)   # → False
```

```text title="Output"
True
False
```

Any value can act as a condition — `0`, `""`, `[]`, `{}`, `None` and `False` are falsy,
everything else is truthy. Some of those results surprise people (`bool(" ")` and
`bool("False")` are both `True`); the full table is in
[Values and Types](../01-basics/01-values-and-types.md#truthy-and-falsy).

---

## Common Mistakes

| # | Mistake | Wrong | Right |
|---|---|---|---|
| 1 | `{}` for an empty set | it's a `dict` | `set()` |
| 2 | Indexing a set | `s[0]` → `TypeError` | convert: `list(s)[0]` |
| 3 | Relying on set order | varies per run for strings | `sorted(s)` |
| 4 | `d["missing"]` when absence is normal | `KeyError` | `d.get("missing", default)` |
| 5 | List as a dict key | `TypeError: unhashable` | use a tuple |
| 6 | `.remove()` on a maybe-absent value | `KeyError` | `.discard()` |
| 7 | Expecting a set to keep duplicates | `{1, 1, 2}` has 2 items | use a list |
| 8 | `True` and `1` as separate set items | `{1, True}` has 1 item | `True == 1`, so they collide |

That last one follows from `bool` being a subclass of `int` — see
[the boolean surprise](../01-basics/01-values-and-types.md#bool-is-a-subclass-of-int).

---

## Summary

### `dict`

| Operation | Syntax |
|---|---|
| Create | `{"k": v}` or `dict(k=v)` |
| Read | `d["k"]` / `d.get("k", default)` |
| Add or update | `d["k"] = v` |
| Remove | `del d["k"]` / `d.pop("k")` |
| Merge | `d.update(other)` |
| Keys / values / pairs | `.keys()` / `.values()` / `.items()` |
| Test a key | `"k" in d` |
| Build | `{k: v for ... in ...}` |

### `set`

| Operation | Syntax |
|---|---|
| Create | `{1, 2, 3}` — empty is `set()` |
| Add / remove | `.add(x)` / `.discard(x)` / `.remove(x)` |
| Union / intersection | `a \| b` / `a & b` |
| Difference / symmetric | `a - b` / `a ^ b` |
| Subset / superset | `a <= b` / `a >= b` |
| Deduplicate a list | `set(lst)` |

**Key takeaways**

- `d["k"]` raises on a missing key; `.get("k", default)` doesn't
- Assigning to a key adds it or updates it — there's no separate operation
- `.items()` yields tuples, which is what makes `for k, v in d.items():` work
- Keys must be **immutable** (hashable) — `str`, `int`, `float`, `tuple`; never `list`
- `{}` is an empty dict; `set()` is the only way to write an empty set
- Sets drop duplicates and have no order or indexing — `sorted()` when you need order
- `|`, `&`, `-`, `^` are union, intersection, difference, symmetric difference
- `x in some_set` is far faster than `x in some_list` at scale

**See also:** [Tuples](./03-tuples.md) for why tuples make valid keys ·
[Lists](./02-lists.md) for the ordered mutable alternative ·
[Data Types](../01-basics/03-data-types.md) for `dict` and `set` in context

---

## Run It Yourself

```python title="dicts_and_sets.py"
# --- dict ---
student = {"Name": "Vettri", "Age": 28, "Department": "CSE", "CGPA": 8.9}
print(f"{'dict':<14} {student}")
print(f"{'values':<14} {list(student.values())}")
print(f"{'get Name':<14} {student.get('Name')}")
print(f"{'get missing':<14} {student.get('College', 'not set')}")

student["College"] = "SRM"
student["CGPA"] = 9.1
print(f"{'after edits':<14} {student}")

for key, value in student.items():
    print(f"  {key:<12} {value}")

# --- set ---
marks = [85, 90, 75, 90, 85, 95]
unique = set(marks)
print(f"{'raw list':<14} {marks}")
print(f"{'deduplicated':<14} {sorted(unique)}")
print(f"{'count':<14} {len(marks)} -> {len(unique)}")

a = {1, 2, 3, 4}
b = {3, 4, 5, 6}
print(f"{'union':<14} {sorted(a | b)}")
print(f"{'intersection':<14} {sorted(a & b)}")
print(f"{'difference':<14} {sorted(a - b)}")
print(f"{'symmetric':<14} {sorted(a ^ b)}")
```

```text title="Output"
dict           {'Name': 'Vettri', 'Age': 28, 'Department': 'CSE', 'CGPA': 8.9}
values         ['Vettri', 28, 'CSE', 8.9]
get Name       Vettri
get missing    not set
after edits    {'Name': 'Vettri', 'Age': 28, 'Department': 'CSE', 'CGPA': 9.1, 'College': 'SRM'}
  Name         Vettri
  Age          28
  Department   CSE
  CGPA         9.1
  College      SRM
raw list       [85, 90, 75, 90, 85, 95]
deduplicated   [75, 85, 90, 95]
count          6 -> 4
union          [1, 2, 3, 4, 5, 6]
intersection   [3, 4]
difference     [1, 2]
symmetric      [1, 2, 5, 6]
```

---

## Practice Questions

*From the Unit 1 question bank. Tags and marks are explained on the
[Python index](../index.md#practice-questions).*

### Unit 1 § G — Dictionaries, Sets & Booleans

**G1. [PROG]** Create a dictionary holding **Name, Age, Department, CGPA**. Print all the
**values**. `[3]`

**G2. [PROG]** Using that dictionary: add a new key `"College"`, then update the CGPA, then
display the final dictionary. `[3]`

**G3. [OUT]** `[5]`

```python
d = {"a": 1, "b": 2, "c": 3}
print(d["b"])
print(d.get("z"))
print(d.get("z", 0))
print(list(d.keys()))
print(list(d.values()))
print(list(d.items()))
print(len(d))
```

**G4. [OUT]** Name the error, and say which line of G3 would have avoided it. `[2]`

```python
d = {"a": 1}
print(d["z"])
```

**G5. [OUT]** `[3]`

```python
s = {1, 2, 2, 3, 3, 3, 4}
print(s)
print(len(s))
```

*Explain in one sentence why the duplicates disappeared.*

**G6. [OUT]** `[4]`

```python
a = {1, 2, 3, 4}
b = {3, 4, 5, 6}
print(a | b)
print(a & b)
print(a - b)
print(a ^ b)
```

**G7. [PROG]** Accept two numbers from the user and print whether they are equal, using a
**Boolean expression**. `[3]`

**G8. [OUT]** Truthiness. Two of these are `True` and will surprise you. `[5]`

```python
print(bool(0))
print(bool(1))
print(bool(-1))
print(bool(""))
print(bool(" "))
print(bool([]))
print(bool([0]))
print(bool("False"))
print(bool(None))
```

**G9. [THEORY]** A dictionary key must be of an immutable type. Explain why, and say which of
these are legal as keys: `"name"`, `10`, `(1, 2)`, `[1, 2]`, `3.14`. `[3]`

### Viva

1. Why do duplicates vanish from a set?
