---
sidebar_position: 2
title: Lists
description: The mutable sequence — methods that change it in place, sort vs sorted, the reference trap, and comprehensions.
tags: [python, collections]
toc_max_heading_level: 3
---

# Lists

> **Topic —** An ordered, mutable sequence. The default collection in Python — reach for a
> list unless you have a reason not to.

Indexing and slicing work exactly as they do on
[strings](./01-strings-and-slicing.md). What's new here is that a list can be **changed in
place**.

---

## Indexing and slicing

```python
marks = [85, 90, 75, 88, 95]
print(marks[0])     # → 85
print(marks[2])     # → 75
print(marks[-1])    # → 95
print(marks[:3])    # → [85, 90, 75]
print(marks[-2:])   # → [88, 95]
print(marks[:])     # → [85, 90, 75, 88, 95]
print(len(marks))   # → 5
```

```text title="Output"
85
75
95
[85, 90, 75]
[88, 95]
[85, 90, 75, 88, 95]
5
```

Note the difference in what comes back: **`marks[0]` gives an item**, `marks[:3]` gives a
**list** — even a one-element slice like `marks[0:1]` is a list.

---

## Methods that change the list

These mutate in place and return `None` — so never write `marks = marks.append(x)`.

```python
items = []
print("start             ", items)
items.append("apple")
print("append('apple')   ", items)
items.append("banana")
print("append('banana')  ", items)
items.insert(1, "cherry")
print("insert(1,'cherry')", items)
items.extend(["date", "fig"])
print("extend([...])     ", items)
items.remove("banana")
print("remove('banana')  ", items)
last = items.pop()
print("pop() ->", last, "     ", items)
first = items.pop(0)
print("pop(0) ->", first, " ", items)
```

```text title="Output"
start              []
append('apple')    ['apple']
append('banana')   ['apple', 'banana']
insert(1,'cherry') ['apple', 'cherry', 'banana']
extend([...])      ['apple', 'cherry', 'banana', 'date', 'fig']
remove('banana')   ['apple', 'cherry', 'date', 'fig']
pop() -> fig       ['apple', 'cherry', 'date']
pop(0) -> apple   ['cherry', 'date']
```

| Method | Does | Returns |
|---|---|---|
| `.append(x)` | add one item to the end | `None` |
| `.insert(i, x)` | add at position `i` | `None` |
| `.extend(seq)` | add **every item** of `seq` | `None` |
| `.remove(x)` | delete the first `x` by **value** | `None` |
| `.pop()` | remove and **return** the last item | the item |
| `.pop(i)` | remove and return item at `i` | the item |
| `.clear()` | empty the list | `None` |
| `.sort()` | sort in place | `None` |
| `.reverse()` | reverse in place | `None` |
| `.count(x)` | how many times `x` appears | `int` |
| `.index(x)` | position of first `x` | `int`, or `ValueError` |
| `.copy()` | shallow copy | a new list |

`.remove()` takes a **value**, `.pop()` takes an **index** — mixing them up is a common slip.

### `append()` vs `extend()`

The difference matters and it's easy to get wrong:

```python
a = [1, 2, 3]
a.append([4, 5])
print(a)        # → [1, 2, 3, [4, 5]]
print(len(a))   # → 4

b = [1, 2, 3]
b.extend([4, 5])
print(b)        # → [1, 2, 3, 4, 5]
print(len(b))   # → 5
```

```text title="Output"
[1, 2, 3, [4, 5]]
4
[1, 2, 3, 4, 5]
5
```

`append()` adds **one** item — here, a list — giving a nested list of length 4. `extend()`
adds each item **separately**, giving a flat list of length 5.

### `del` and slice assignment

```python
p = [1, 2, 3, 4, 5]
del p[0]
print(p)          # → [2, 3, 4, 5]

p[0:2] = [9, 9, 9]
print(p)          # → [9, 9, 9, 4, 5]
```

```text title="Output"
[2, 3, 4, 5]
[9, 9, 9, 4, 5]
```

Assigning to a slice can change the list's length — two items replaced by three.

---

## The reference trap

This is the single most important thing on this page.

```python
a = [1, 2, 3]
b = a
b.append(4)
print(a)   # → [1, 2, 3, 4]
print(b)   # → [1, 2, 3, 4]

c = [1, 2, 3]
d = c.copy()
d.append(4)
print(c)   # → [1, 2, 3]
print(d)   # → [1, 2, 3, 4]
```

```text title="Output"
[1, 2, 3, 4]
[1, 2, 3, 4]
[1, 2, 3]
[1, 2, 3, 4]
```

:::danger `b = a` does not copy the list

A variable holds a **reference** to an object, not the object itself. `b = a` copies the
reference, so both names point at the **same list**. Mutating through either name is visible
through both.

```python
x = [1]
y = x
z = x.copy()
print(x is y)   # → True    same object
print(x is z)   # → False   different object, equal contents
```

:::

Three ways to make a genuine copy:

```python
d = c.copy()      # clearest
d = c[:]          # slice of everything
d = list(c)       # constructor
```

All three are **shallow** — a copy of a list of lists still shares the inner lists. For that
you need `copy.deepcopy()`.

Note this only bites with **mutable** objects. `x = 5; y = x; y += 1` leaves `x` at `5`,
because `int` is immutable — there's no in-place change to observe. Same reason
[strings](./01-strings-and-slicing.md#strings-are-immutable) never surprise you this way.

---

## `sort()` vs `sorted()`

```python
n = [4, 1, 8, 3]
print(sorted(n))   # → [1, 3, 4, 8]   new list
print(n)           # → [4, 1, 8, 3]   original untouched
n.sort()
print(n)           # → [1, 3, 4, 8]   now changed in place
n.reverse()
print(n)           # → [8, 4, 3, 1]
print(sum(n), max(n), min(n), len(n))
```

```text title="Output"
[1, 3, 4, 8]
[4, 1, 8, 3]
[1, 3, 4, 8]
[8, 4, 3, 1]
16 8 1 4
```

| | Mutates? | Returns |
|---|---|---|
| `list.sort()` | ✅ in place | `None` |
| `sorted(list)` | ❌ | a new sorted list |

`sorted()` also works on strings, tuples and sets — anything iterable. `.sort()` is a list
method only.

### `reverse=` and `key=`

```python
words = ["banana", "Fig", "apple"]
print(sorted(words))                  # → ['Fig', 'apple', 'banana']
print(sorted(words, key=str.lower))   # → ['apple', 'banana', 'Fig']
print(sorted([4, 1, 8, 3], reverse=True))
```

```text title="Output"
['Fig', 'apple', 'banana']
['apple', 'banana', 'Fig']
[8, 4, 3, 1]
```

Plain `sorted()` puts `"Fig"` first because uppercase letters sort before lowercase ones in
Unicode. `key=str.lower` sorts case-insensitively without changing the values.

---

## List comprehensions

A compact way to build a list from another sequence. These two are equivalent:

```python
nums = list(range(1, 11))

evens = []
for v in nums:
    if v % 2 == 0:
        evens.append(v)
print(evens)

print([v for v in nums if v % 2 == 0])
```

```text title="Output"
[2, 4, 6, 8, 10]
[2, 4, 6, 8, 10]
```

The shape is `[expression for item in sequence if condition]` — the `if` is optional.

```python
print([v * v for v in range(1, 6)])          # → [1, 4, 9, 16, 25]
print([w.upper() for w in ["a", "b"]])       # → ['A', 'B']
```

```text title="Output"
[1, 4, 9, 16, 25]
['A', 'B']
```

:::tip

Use a comprehension when you're **building a list**. If the loop body does anything else —
printing, several statements, updating a counter — write a normal `for` loop. Comprehensions
stop being readable fast.

:::

---

## Other operations

```python
lst = [3, 1, 3, 7]
print(lst.count(3), lst.index(7))   # → 2 3
print(lst + [9])                    # → [3, 1, 3, 7, 9]   concatenation
print(lst * 2)                      # → [3, 1, 3, 7, 3, 1, 3, 7]
print(3 in lst, 5 not in lst)        # → True True
```

```text title="Output"
2 3
[3, 1, 3, 7, 9]
[3, 1, 3, 7, 3, 1, 3, 7]
True True
```

`+` and `*` build **new** lists, unlike the mutating methods.

### Never mutate a list you're looping over

Removing items shifts the remaining ones, so the loop skips some:

```python
q = [1, 2, 3, 4]
for v in q[:]:          # loop over a COPY
    if v % 2 == 0:
        q.remove(v)
print(q)   # → [1, 3]
```

```text title="Output"
[1, 3]
```

Without the `[:]` this misses items. A comprehension avoids the problem entirely:
`q = [v for v in q if v % 2 != 0]`.

---

## Worked example — largest without `max()`

```python
nums = [45, 12, 89, 33, 67]
largest = nums[0]
for v in nums:
    if v > largest:
        largest = v
print(largest)   # → 89
```

```text title="Output"
89
```

Start with the first element, not `0` — starting at `0` breaks for all-negative lists.

---

## Common Mistakes

| # | Mistake | Wrong | Right |
|---|---|---|---|
| 1 | Assigning the result of a mutator | `lst = lst.append(x)` → `None` | `lst.append(x)` |
| 2 | `b = a` to copy | both names share one list | `b = a.copy()` |
| 3 | `append` where `extend` was meant | `[1,2,3,[4,5]]` | `.extend([4, 5])` |
| 4 | `.remove(0)` to drop the first item | removes the **value** `0` | `.pop(0)` or `del lst[0]` |
| 5 | Expecting `.sort()` to return a list | it returns `None` | `sorted(lst)` |
| 6 | `.index(x)` on a missing value | raises `ValueError` | check `if x in lst:` first |
| 7 | Removing while looping | items get skipped | loop over `lst[:]`, or comprehend |
| 8 | Comprehension for side effects | `[print(x) for x in lst]` | a plain `for` loop |

---

## Summary

| Operation | Syntax | Mutates? |
|---|---|---|
| Add one item | `.append(x)` | ✅ |
| Add many items | `.extend(seq)` | ✅ |
| Insert at position | `.insert(i, x)` | ✅ |
| Remove by value | `.remove(x)` | ✅ |
| Remove by index | `.pop(i)` / `del lst[i]` | ✅ |
| Sort in place | `.sort()` | ✅ |
| Sorted copy | `sorted(lst)` | ❌ |
| Copy | `.copy()` / `lst[:]` / `list(lst)` | ❌ |
| Join | `lst + other` | ❌ |
| Build from a sequence | `[f(x) for x in seq]` | ❌ |

**Key takeaways**

- Mutating methods return `None` — `lst.sort()` sorts, `sorted(lst)` returns
- `b = a` shares one list; use `.copy()`, `[:]` or `list()` for an independent one
- `append()` adds one item, `extend()` adds each item of a sequence
- `.remove()` takes a value, `.pop()` takes an index
- `sorted()` works on any iterable; `.sort()` is list-only
- Don't remove from a list you're iterating — loop over a copy or use a comprehension
- Comprehensions are for building lists, not for side effects

**See also:** [Strings and Slicing](./01-strings-and-slicing.md) for indexing and slicing ·
[Tuples](./03-tuples.md) for the immutable version ·
[Loops](../02-control-flow/02-loops.md) for iterating

---

## Run It Yourself

```python title="lists.py"
languages = ["Python", "Java", "C", "Go", "Rust"]

print(f"{'full list':<14} {languages}")
print(f"{'first':<14} {languages[0]}")
print(f"{'last':<14} {languages[-1]}")
print(f"{'first three':<14} {languages[:3]}")
print(f"{'length':<14} {len(languages)}")

# mutation
languages.append("Ruby")
languages.insert(0, "Lisp")
languages.remove("C")
dropped = languages.pop()
print(f"{'after edits':<14} {languages}")
print(f"{'dropped':<14} {dropped}")

# sorted copy leaves the original alone
print(f"{'sorted copy':<14} {sorted(languages)}")
print(f"{'still original':<14} {languages}")

# comprehension
print(f"{'short names':<14} {[w for w in languages if len(w) <= 4]}")
```

```text title="Output"
full list      ['Python', 'Java', 'C', 'Go', 'Rust']
first          Python
last           Rust
first three    ['Python', 'Java', 'C']
length         5
after edits    ['Lisp', 'Python', 'Java', 'Go', 'Rust']
dropped        Ruby
sorted copy    ['Go', 'Java', 'Lisp', 'Python', 'Rust']
still original ['Lisp', 'Python', 'Java', 'Go', 'Rust']
short names    ['Lisp', 'Java', 'Go', 'Rust']
```

---

## Practice Questions

*From the Unit 1 question bank. Tags and marks are explained on the
[Python index](../index.md#practice-questions).*

### Unit 1 § E — Lists

**E1. [PROG]** Create a list of five favourite programming languages. Display the first, the last,
and the complete list. `[3]`

**E2. [OUT]** Given `marks = [85, 90, 75, 88, 95]` `[5]`

```python
marks = [85, 90, 75, 88, 95]
print(marks[0])
print(marks[2])
print(marks[-1])
print(marks[:3])
print(marks[-2:])
print(marks[:])
print(len(marks))
```

**E3. [PROG]** Start with an **empty list**. Perform `append()`, `insert()`, `extend()`,
`remove()`, and `pop()` — printing the list **after every single operation**. `[6]`

**E4. [OUT]** `append` vs `extend`. `[3]`

```python
a = [1, 2, 3]
a.append([4, 5])
print(a)
print(len(a))

b = [1, 2, 3]
b.extend([4, 5])
print(b)
print(len(b))
```

**E5. [OUT]** This one catches almost everybody. `[4]`

```python
a = [1, 2, 3]
b = a
b.append(4)
print(a)
print(b)

c = [1, 2, 3]
d = c.copy()
d.append(4)
print(c)
print(d)
```

**E6. [THEORY]** Explain the result of E5 using the words **reference** and **object**. How do you
make a genuinely independent copy of a list? `[3]`

**E7. [OUT]** `[4]`

```python
n = [4, 1, 8, 3]
print(sorted(n))
print(n)
n.sort()
print(n)
n.reverse()
print(n)
print(sum(n), max(n), min(n), len(n))
```

**E8. [PROG]** Find the largest number in `[45, 12, 89, 33, 67]` **without** using `max()`. Use a
loop. `[4]`

**E9. [PROG]** Given `nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]`, build a new list containing only
the **even** numbers. Do it twice — once with a `for` loop, once with a **list
comprehension**. `[4]`

### Unit 1 § L — Mini Challenges

**L2. [PROG]** Write a program that accepts 5 numbers from the user into a **list**, then displays
the largest, the smallest, the sum, and the average — **without** using `max()`, `min()`, or
`sum()`. `[6]`

### Viva

1. What is the difference between `append()` and `extend()`?
