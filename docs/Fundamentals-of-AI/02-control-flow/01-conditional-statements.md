---
sidebar_position: 1
title: Conditional Statements
description: if, if/else, if/elif/else, nested conditions, and the logical operators that combine them.
tags: [python, control-flow, conditionals]
toc_max_heading_level: 3
---

# Conditional Statements

> **Topic —** Running different code depending on whether a condition is true.

Conditional statements let a program take a decision. Python evaluates the condition, gets
`True` or `False`, and runs the matching block.

---

## Indentation is the block

Python has no braces. **Indentation is what makes a line part of the `if` block** — four
spaces by convention.

```python
age = 20
if age >= 18:
    print("Eligible to vote")   # indented → inside the if
print("Done")                   # not indented → always runs
```

```text title="Output"
Eligible to vote
Done
```

The colon at the end of the `if` line is mandatory. Both of these are errors:

```python
if age >= 18      # SyntaxError: expected ':'
if age >= 18:
print("Eligible") # IndentationError: expected an indented block
```

---

## Plain `if`

Runs the block only when the condition is true. When it's false, nothing happens.

```python
age = 20
if age >= 18:
    print("Eligible to vote")
```

```text title="Output"
Eligible to vote
```

With `age = 16` this program prints nothing at all — there's no alternative branch.

### Comparison operators

These are what produce the `True`/`False` a condition needs:

| Operator | Means | Example | Result |
|---|---|---|---|
| `==` | equal to | `20 == 20` | `True` |
| `!=` | not equal to | `20 != 18` | `True` |
| `>` | greater than | `20 > 18` | `True` |
| `<` | less than | `20 < 18` | `False` |
| `>=` | greater than or equal | `18 >= 18` | `True` |
| `<=` | less than or equal | `16 <= 18` | `True` |

:::danger `=` is assignment, `==` is comparison

`if age = 18:` is a `SyntaxError`. This is the most common beginner mistake, and Python
deliberately refuses to guess what you meant.

:::

---

## `if...else`

Gives the false case somewhere to go. Exactly one of the two blocks runs.

```python
age = 16
if age >= 18:
    print("Eligible")
else:
    print("Not Eligible")
```

```text title="Output"
Not Eligible
```

---

## `if...elif...else`

For more than two outcomes. `elif` is short for "else if", and you can chain as many as
you need.

```python
marks = 75
if marks >= 90:
    print("A")
elif marks >= 75:
    print("B")
else:
    print("C")
```

```text title="Output"
B
```

A full grade scale:

```python
for mk in [95, 80, 60, 30]:
    if mk >= 90:
        grade = "A"
    elif mk >= 75:
        grade = "B"
    elif mk >= 50:
        grade = "C"
    else:
        grade = "Fail"
    print(f"{mk:>3} -> {grade}")
```

```text title="Output"
 95 -> A
 80 -> B
 60 -> C
 30 -> Fail
```

### Order matters — the first true branch wins

This is the single biggest trap in an `elif` chain. Python checks conditions **top to
bottom and stops at the first match**. It does not look for the best match.

```python
marks = 95

if marks >= 50:
    print("Pass")
elif marks >= 75:
    print("Good")
elif marks >= 90:
    print("Excellent")
else:
    print("Fail")
```

```text title="Output"
Pass
```

`95` satisfies all three conditions, but `marks >= 50` is checked first, so the other two
are never reached. The fix is to order the conditions from **most restrictive to least**:

```python
marks = 95

if marks >= 90:
    print("Excellent")
elif marks >= 75:
    print("Good")
elif marks >= 50:
    print("Pass")
else:
    print("Fail")
```

```text title="Output"
Excellent
```

### `elif` chain vs separate `if` statements

They are not the same thing. An `elif` chain runs **at most one** block; separate `if`
statements each get tested independently, so several can run.

```python
marks = 95

if marks >= 50:
    print("Pass")
if marks >= 75:
    print("Good")
if marks >= 90:
    print("Excellent")
```

```text title="Output"
Pass
Good
Excellent
```

Three lines instead of one. Use `elif` when the cases are mutually exclusive, separate
`if`s when they're independent checks.

---

## Nested `if`

An `if` inside another `if`. The inner condition is only tested when the outer one passed.

```python
age = 22
if age >= 18:
    if age >= 21:
        print("Can drive and vote")
```

```text title="Output"
Can drive and vote
```

Each level adds four more spaces of indentation. A more useful version covers the inner
false case too:

```python
age, has_license = 22, True

if age >= 18:
    if has_license:
        print("May drive")
    else:
        print("Old enough, but no licence")
else:
    print("Too young")
```

```text title="Output"
May drive
```

:::tip

Nesting more than two deep usually means the conditions should be combined with `and`
instead. `if age >= 18 and has_license:` says the same thing as the nested version, flatter.

:::

---

## Logical operators

| Operator | True when | Example |
|---|---|---|
| `and` | **both** sides are true | `age >= 18 and has_license` |
| `or` | **either** side is true | `marks >= 90 or sports` |
| `not` | flips the value | `not has_license` |

```python
age = 20
has_license = True
if age >= 18 and has_license:
    print("Can drive")

marks = 95
sports = False
if marks >= 90 or sports:
    print("Scholarship")

if age >= 18 and not has_license:
    print("Get a licence")
```

```text title="Output"
Can drive
Scholarship
```

The third `if` prints nothing: `age >= 18` is `True`, but `not has_license` is `False`, and
`and` needs both.

### Short-circuit evaluation

`and` stops at the first false value; `or` stops at the first true one. The rest is never
evaluated:

```python
def loud():
    print("  (evaluated)")
    return True

print("A:", False and loud())   # loud() never runs
print("B:", True or loud())     # loud() never runs
print("C:", True and loud())    # loud() does run
```

```text title="Output"
A: False
B: True
  (evaluated)
C: True
```

This is what makes `if items and items[0] == "x":` safe — if `items` is empty, the second
half is skipped rather than raising `IndexError`.

### Chained comparisons

Python lets you write range checks the way maths does — no `and` needed:

```python
age = 35
print(18 <= age < 60)      # → True
print(0 < 5 < 10 < 20)     # → True
```

`18 <= age < 60` means exactly `18 <= age and age < 60`, but reads better and evaluates
`age` only once.

---

## Truthiness in conditions

A condition doesn't have to be a comparison. Any value works — Python asks whether it's
truthy.

```python
name = ""
if name:
    print("has name")
else:
    print("empty")

items = [1, 2]
if items:
    print("list has", len(items), "items")
```

```text title="Output"
empty
list has 2 items
```

`0`, `0.0`, `""`, `[]`, `{}`, `None` and `False` are falsy; everything else is truthy. So
`if items:` is the idiomatic way to say "if the list isn't empty" — you don't need
`if len(items) > 0:`. See
[Values and Types](../01-basics/01-values-and-types.md#truthy-and-falsy).

---

## The ternary (conditional expression)

For picking between two *values*, a one-liner is often clearer than four lines:

```python
n = 25
print("EVEN" if n % 2 == 0 else "ODD")
```

```text title="Output"
ODD
```

The shape is `value_if_true if condition else value_if_false`. It's an **expression**, so
it can go inside an f-string — which is how the
[f-strings page](../01-basics/05-f-strings.md) builds status columns.

---

## Worked example — leap year

Three rules at once: divisible by 4, except centuries, unless divisible by 400.

```python
for year in [2000, 1900, 2024, 2023]:
    leap = year % 4 == 0 and (year % 100 != 0 or year % 400 == 0)
    print(f"{year}: {leap}")
```

```text title="Output"
2000: True
1900: False
2024: True
2023: False
```

The parentheses are doing real work — `and` binds tighter than `or`, so without them
`1900` would come out `True`.

---

## `match` — Python 3.10+

For comparing one value against many fixed options, `match` reads better than a long
`elif` chain. `case _` is the catch-all.

```python
command = "start"
match command:
    case "start":
        print("Starting")
    case "stop":
        print("Stopping")
    case _:
        print("Unknown")
```

```text title="Output"
Starting
```

`match` and `case` are **soft keywords** — still legal as variable names, but don't use
them as such. See
[Variables and Naming](../01-basics/02-variables-and-naming.md#python-keywords).

---

## Common Mistakes

| # | Mistake | Wrong | Right |
|---|---|---|---|
| 1 | `=` instead of `==` | `if age = 18:` → `SyntaxError` | `if age == 18:` |
| 2 | Missing colon | `if age >= 18` → `SyntaxError` | `if age >= 18:` |
| 3 | Body not indented | `IndentationError: expected an indented block` | indent by 4 spaces |
| 4 | `elif` chain in the wrong order | `>= 50` before `>= 90` prints `Pass` for 95 | most restrictive condition first |
| 5 | Separate `if`s where `elif` was meant | all matching branches run | use `elif` for mutually exclusive cases |
| 6 | `and`/`or` precedence | `a % 4 == 0 and b or c` | parenthesise: `... and (b or c)` |
| 7 | Comparing to `True` | `if flag == True:` | `if flag:` |
| 8 | `if len(items) > 0:` | verbose | `if items:` |

---

## Summary

| Form | Runs when | Blocks that can run |
|---|---|---|
| `if` | condition true | 0 or 1 |
| `if...else` | always one branch | exactly 1 |
| `if...elif...else` | first true condition | exactly 1 |
| separate `if`s | each tested independently | 0 to all |
| `x if c else y` | expression, not statement | produces a value |
| `match/case` | value matches a case | exactly 1 |

**Key takeaways**

- Indentation defines the block; the colon is mandatory
- `elif` stops at the **first** true condition — order from most restrictive down
- Separate `if`s can all fire; an `elif` chain fires at most once
- `and` needs both sides, `or` needs either, `not` flips
- `and`/`or` short-circuit, which makes guard conditions like `if items and items[0]` safe
- `18 <= age < 60` is legal and clearer than joining two comparisons with `and`
- Any value can be a condition — `if items:` beats `if len(items) > 0:`

**See also:** [Loops](./02-loops.md) for repeating a block ·
[Values and Types](../01-basics/01-values-and-types.md) for truthiness

---

## Run It Yourself

```python title="conditionals.py"
# 1. Positive / negative / zero
for number in [7, -3, 0]:
    if number > 0:
        print(f"{number:>3}: Positive Number")
    elif number < 0:
        print(f"{number:>3}: Negative Number")
    else:
        print(f"{number:>3}: Zero")

# 2. Even or odd, as a ternary
for number in [10, 7]:
    print(f"{number} is {'EVEN' if number % 2 == 0 else 'ODD'}")

# 3. Largest of three
a, b, c = 12, 45, 30
if a >= b and a >= c:
    largest = a
elif b >= a and b >= c:
    largest = b
else:
    largest = c
print(f"largest of {a}, {b}, {c} is {largest}")

# 4. Driving eligibility — combined instead of nested
age, has_license = 22, True
if age >= 18 and has_license:
    print("May drive")
elif age >= 18:
    print("Old enough, but no licence")
else:
    print("Too young")
```

```text title="Output"
  7: Positive Number
 -3: Negative Number
  0: Zero
10 is EVEN
7 is ODD
largest of 12, 45, 30 is 45
May drive
```

---

## Practice Questions

*From the Unit 1 question bank. Tags and marks are explained on the
[Python index](../index.md#practice-questions).*

### Unit 1 § H — Conditional Statements

**H1. [PROG]** Accept a number and print `"Positive Number"` if it is greater than zero. Use a
plain `if`. `[2]`

**H2. [PROG]** Accept a number and check whether it is **even or odd** using `if...else`. `[3]`

**H3. [PROG]** Accept **three** numbers and display the largest, using `if...elif...else`. `[4]`

**H4. [PROG]** Accept marks and display the grade: **A** (90+), **B** (75–89), **C** (50–74),
**Fail** (below 50). `[4]`

**H5. [PROG]** Accept a person's **age** and whether they hold a **driving licence**. Using a
**nested if**, display whether they may legally drive. `[4]`

**H6. [OUT]** More than one condition is true here. Which branch wins, and why? `[3]`

```python
marks = 95

if marks >= 50:
    print("Pass")
elif marks >= 75:
    print("Good")
elif marks >= 90:
    print("Excellent")
else:
    print("Fail")
```

*Then rewrite it so it prints `Excellent`.*

**H7. [OUT]** `[3]`

```python
age = 20
license = True

if age >= 18 and license:
    print("Can drive")

marks = 95
sports = False

if marks >= 90 or sports:
    print("Scholarship")

if age >= 18 and not license:
    print("Get a licence")
```

**H8. [PROG]** Accept a year and determine whether it is a **leap year**. *(Divisible by 4,
except centuries, unless divisible by 400.)* `[4]`

**H9. [THEORY]** What is the difference between using several separate `if` statements and one
`if...elif...else` chain? When does it change the output? `[3]`

### Unit 1 § L — Mini Challenges

**L1. [PROG]** Write one program that: `[8]`

- accepts a student's name
- accepts marks in three subjects
- calculates the average
- displays the grade using `if...elif...else`
- prints the name, average (to 2 decimal places), and grade in a neat, aligned layout
