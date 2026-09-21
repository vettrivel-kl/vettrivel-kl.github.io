---
sidebar_position: 1
title: Strings and Slicing
description: Indexing, the three-part slice, immutability, and the string methods worth knowing.
tags: [python, collections, strings]
toc_max_heading_level: 3
---

# Strings and Slicing

> **Topic —** A string is a sequence of characters. Everything in this page — indexing,
> slicing, `in`, `len()` — works the same way on lists and tuples.

---

## Indexing

Every character has two indexes: one counting forward from `0`, one counting backward
from `-1`.

```python
s = "programiz"
for i, ch in enumerate(s):
    print(i, ch, i - len(s))
```

```text title="Output"
0 p -9
1 r -8
2 o -7
3 g -6
4 r -5
5 a -4
6 m -3
7 i -2
8 z -1
```

```text
 p   r   o   g   r   a   m   i   z
 0   1   2   3   4   5   6   7   8
-9  -8  -7  -6  -5  -4  -3  -2  -1
```

```python
print(s[0])    # → p    first
print(s[-1])   # → z    last
print(s[-9])   # → p    same as s[0]
```

The highest valid index is `len(s) - 1`. Going past it is an error:

```python
h = "Hi"
h[5]
```

```text title="Error"
IndexError: string index out of range
```

---

## Slicing

`s[start:stop:step]` — takes a **section** of the string. `start` is included, `stop` is
**excluded**.

```python
s = "programiz"
print(s[0])       # → p           index, not a slice
print(s[-1])      # → z
print(s[2:7])     # → ogram       index 2 up to (not including) 7
print(s[:-7])     # → pr          from the start to index -7
print(s[7:])      # → iz          from index 7 to the end
print(s[2:7:2])   # → orm         every 2nd character in that range
print(s[::-1])    # → zimargorp   reversed
```

```text title="Output"
p
z
ogram
pr
iz
orm
zimargorp
```

All three parts are optional:

| Slice | Means |
|---|---|
| `s[2:5]` | index 2, 3, 4 |
| `s[:5]` | from the start to index 4 |
| `s[2:]` | index 2 to the end |
| `s[:]` | the whole thing — a copy |
| `s[::2]` | every 2nd character |
| `s[::-1]` | **reversed** — the standard idiom |

```python
w = "programiz"
print(w[::2])    # → pormz
print(w[1::2])   # → rgai
print(w[::-2])   # → zmrop
```

```text title="Output"
pormz
rgai
zmrop
```

### Slicing out of range is safe — indexing isn't

This asymmetry surprises people, and it's worth knowing deliberately.

```python
h = "Hi"
print(repr(h[0:99]))   # → 'Hi'   clipped to what exists
print(repr(h[5:]))     # → ''     empty string, no error
h[5]                   # → IndexError
```

```text title="Output"
'Hi'
''
```

A slice asks "give me whatever is in this range", so an empty answer is a valid answer.
An index asks "give me *the* character at this position" — if it doesn't exist, there's
nothing to return.

:::tip

This is why `s[:3]` is safe on a string shorter than three characters, but `s[2]` is not.

:::

---

## Strings are immutable

You cannot change a character in place.

```python
s = "python"
s[0] = "P"
```

```text title="Error"
TypeError: 'str' object does not support item assignment
```

### So how does `.upper()` "change" the string?

It doesn't. Every string method **returns a new string** and leaves the original alone:

```python
w = "python"
print(w.upper())   # → PYTHON   the new string
print(w)           # → python   unchanged!
```

```text title="Output"
PYTHON
python
```

To keep the result, assign it:

```python
w = "python"
w2 = w.upper()
print(w2, w)   # → PYTHON python
```

Or rebind the same name — `w = w.upper()`. Note that this doesn't mutate the string; it
points `w` at a different one.

To "change" a character, build a new string with slicing:

```python
s = "python"
s = "P" + s[1:]
print(s)   # → Python
```

---

## Common string methods

```python
t = "Hello World"
print(t.lower(), t.upper(), t.title(), sep=" | ")
print(t.count("o"), t.find("World"), t.find("zzz"))
print(t.startswith("Hello"), t.endswith("!"))
```

```text title="Output"
hello world | HELLO WORLD | Hello World
2 6 -1
True False
```

`.find()` returns `-1` when the substring isn't there, rather than raising.

### Whitespace, splitting and joining

```python
s = "  Hello World  "
print(len(s))                        # → 15
print(repr(s.strip()))               # → 'Hello World'
print(len(s.strip()))                # → 11
print(s.replace("World", "Python"))  # → '  Hello Python  '
print("Hello World".split())         # → ['Hello', 'World']
print("-".join(["a", "b", "c"]))     # → a-b-c
```

```text title="Output"
15
'Hello World'
11
  Hello Python  
['Hello', 'World']
a-b-c
```

`.split()` with no argument splits on any whitespace and discards empties. With an explicit
separator it keeps them:

```python
print("a,b,,c".split(","))   # → ['a', 'b', '', 'c']
```

`.join()` is the reverse of `.split()`, and the separator is the string you call it on —
`"-".join(parts)`, not `parts.join("-")`.

### Reference table

| Method | Does | Example | Result |
|---|---|---|---|
| `len(s)` | length (a function, not a method) | `len("Python")` | `6` |
| `.upper()` / `.lower()` | change case | `"Hi".upper()` | `"HI"` |
| `.title()` | capitalise each word | `"hello world".title()` | `"Hello World"` |
| `.capitalize()` | first letter only | `"delhi".capitalize()` | `"Delhi"` |
| `.strip()` | remove surrounding whitespace | `"  hi  ".strip()` | `"hi"` |
| `.replace(a, b)` | swap substrings | `"cat".replace("c", "b")` | `"bat"` |
| `.split(sep)` | string → list | `"a b".split()` | `["a", "b"]` |
| `sep.join(list)` | list → string | `"-".join(["a","b"])` | `"a-b"` |
| `.find(sub)` | index, or `-1` | `"abc".find("z")` | `-1` |
| `.count(sub)` | occurrences | `"aaa".count("a")` | `3` |
| `.startswith()` / `.endswith()` | prefix / suffix test | `"a.py".endswith(".py")` | `True` |
| `.center(w, c)` | pad both sides | `"Hello".center(11, "*")` | `"***Hello***"` |
| `.zfill(w)` | pad with leading zeros | `"42".zfill(5)` | `"00042"` |
| `.isalpha()` / `.isdigit()` / `.isalnum()` | content tests | `"123".isdigit()` | `True` |

---

## Membership and iteration

```python
print("gram" in "programiz")      # → True
print("xyz" not in "programiz")   # → True

for letter in "CAT":
    print(letter)
```

```text title="Output"
True
True
C
A
T
```

`in` works on the whole substring, not just single characters — `"gram" in s` is a substring
test, not a character test.

---

## Worked examples

### Count the vowels

```python
sentence = "Python is awesome"
count = 0
for ch in sentence.lower():
    if ch in "aeiou":
        count += 1
print(f"{count} vowels")
```

```text title="Output"
6 vowels
```

`.lower()` first, so `"A"` is counted as well as `"a"`.

### Palindrome check

`s[::-1]` makes this a one-liner:

```python
for word in ["madam", "python"]:
    clean = word.lower()
    print(f"{word}: {'Palindrome' if clean == clean[::-1] else 'Not a Palindrome'}")
```

```text title="Output"
madam: Palindrome
python: Not a Palindrome
```

---

## Common Mistakes

| # | Mistake | Wrong | Right |
|---|---|---|---|
| 1 | Assigning to an index | `s[0] = "P"` → `TypeError` | `s = "P" + s[1:]` |
| 2 | Expecting a method to mutate | `s.upper()` then printing `s` | `s = s.upper()` |
| 3 | Off-by-one in a slice | `s[0:3]` gives 3 chars, not 4 | `stop` is excluded |
| 4 | Index out of range | `"Hi"[5]` → `IndexError` | slice instead: `"Hi"[5:]` → `""` |
| 5 | `.join()` called on the list | `["a","b"].join("-")` → `AttributeError` | `"-".join(["a","b"])` |
| 6 | `.find()` vs `.index()` | `.index("z")` raises `ValueError` | `.find("z")` returns `-1` |
| 7 | Reversing with a loop | building a string character by character | `s[::-1]` |
| 8 | Forgetting `.lower()` before comparing | `"Madam" == "madaM"[::-1]` → `False` | normalise case first |

---

## Summary

| Operation | Syntax | Note |
|---|---|---|
| Index | `s[i]` | `0` first, `-1` last; `IndexError` if out of range |
| Slice | `s[start:stop:step]` | `stop` excluded; out of range is safe |
| Reverse | `s[::-1]` | the idiom |
| Copy | `s[:]` | whole thing |
| Length | `len(s)` | function, not method |
| Membership | `sub in s` | substring test |
| Concatenate | `a + b` | both must be `str` |
| Repeat | `s * 3` | |

**Key takeaways**

- Two index systems: `0` forward, `-1` backward; max forward index is `len(s) - 1`
- In a slice, `stop` is always excluded — `s[2:7]` gives five characters
- Out-of-range **slicing** returns what exists (or `""`); out-of-range **indexing** raises
- Strings are immutable — every method returns a *new* string and leaves the original alone
- `s[::-1]` reverses; `"-".join(parts)` joins with the separator on the left
- `.find()` returns `-1` for "not found"; `.index()` raises instead

**See also:** [Lists](./02-lists.md) — the same indexing and slicing, but mutable ·
[F-Strings](../01-basics/05-f-strings.md) for formatting strings ·
[Data Types](../01-basics/03-data-types.md) for `str` in context

---

## Run It Yourself

```python title="strings.py"
word = "programiz"

print(f"{'word':<18} {word}")
print(f"{'length':<18} {len(word)}")
print(f"{'first char':<18} {word[0]}")
print(f"{'last char':<18} {word[-1]}")
print(f"{'uppercase':<18} {word.upper()}")
print(f"{'first three':<18} {word[:3]}")
print(f"{'last three':<18} {word[-3:]}")
print(f"{'reversed':<18} {word[::-1]}")
print(f"{'every 2nd':<18} {word[::2]}")
print(f"{'original, still':<18} {word}")
```

```text title="Output"
word               programiz
length             9
first char         p
last char          z
uppercase          PROGRAMIZ
first three        pro
last three         miz
reversed           zimargorp
every 2nd          pormz
original, still    programiz
```

---

## Practice Questions

*From the Unit 1 question bank. Tags and marks are explained on the
[Python index](../index.md#practice-questions).*

### Unit 1 § D — Strings & Slicing

**D1. [PROG]** Accept a word and display: its length, first character, last character, uppercase
form, first three characters, last three characters, and the word reversed. `[7]`

**D2. [OUT]** `[5]`

```python
s = "programiz"
print(s[0])
print(s[-1])
print(s[2:7])
print(s[:-7])
print(s[7:])
print(s[2:7:2])
print(s[::-1])
```

**D3. [OUT]** Name the error. `[2]`

```python
s = "python"
s[0] = "P"
print(s)
```

**D4. [THEORY]** Strings are immutable — so how does `s.upper()` "change" the string? What does
it actually return, and what happens to `s`? Demonstrate with two lines of code. `[3]`

**D5. [PROG]** Accept a sentence and count how many **vowels** it contains, using a `for`
loop. `[4]`

**D6. [PROG]** Accept a word and check whether it is a **palindrome** (reads the same backwards).
Print `Palindrome` or `Not a Palindrome`. `[4]`

**D7. [OUT]** `[3]`

```python
s = "  Hello World  "
print(len(s))
print(s.strip())
print(len(s.strip()))
print(s.replace("World", "Python"))
print("Hello World".split())
print("-".join(["a", "b", "c"]))
```

**D8. [THEORY]** Explain why slicing out of range is safe but indexing out of range is not. Give
an example of each using the string `"Hi"`. `[3]`
