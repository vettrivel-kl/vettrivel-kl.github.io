---
sidebar_position: 2
title: Variables and Naming
description: What makes a Python identifier legal, the 35 reserved keywords, and the PEP 8 conventions on top.
tags: [python, basics, pep8]
toc_max_heading_level: 3
---

# Variables and Naming

> **Exercise —** Give five valid and five invalid variable names, with the reason for each.

---

## The Rules

| | Rule |
|---|---|
| ✅ | Can **start with** a letter (`a-z`, `A-Z`) or an underscore (`_`) |
| ✅ | Can **contain** letters, digits (`0-9`), and underscores |
| ✅ | **Case-sensitive** — `age`, `Age`, `AGE` are three different variables |
| ❌ | Cannot start with a digit |
| ❌ | Cannot contain spaces |
| ❌ | Cannot use special characters (`!`, `@`, `#`, `$`, `%`, `-`, …) |
| ❌ | Cannot be a Python keyword (`if`, `for`, `while`, `return`, …) |

Case-sensitivity in action:

```python
age = 1
Age = 2
AGE = 3
print(age, Age, AGE)   # → 1 2 3   three separate variables
```

---

## 5 Valid Names

### 1. `student_name` — snake_case

```python
student_name = "Vettri"
```

✅ Starts with a letter, uses an underscore to separate words. **This is the Python standard.**

### 2. `_age` — leading underscore

```python
_age = 28
```

✅ An underscore is a legal first character. By convention it signals
"internal / private — don't touch from outside".

### 3. `studentAge` — camelCase

```python
studentAge = 25
```

✅ Legal — letters only. But camelCase is the Java/JavaScript convention; Python prefers
`student_age`.

### 4. `total_annual_salary` — multiple underscores

```python
total_annual_salary = 500000
```

✅ All letters and underscores. Long but self-documenting, which is better than a cryptic `tas`.

### 5. `department1` — digits after the first character

```python
department1 = "Engineering"
```

✅ Digits are allowed **anywhere except the first character**.

---

## 5 Invalid Names

### ❌ 1. Starts with a digit

```python
1student_name = "Vettri"
```

```text title="Error"
SyntaxError: invalid decimal literal
```

**Why:** names must begin with a letter or underscore. Python starts reading `1` as a
number literal and then hits letters, which makes no sense.

**Fix:** `student_name1` or `_1student_name`

### ❌ 2. Contains a space

```python
student name = "Vettri"
```

```text title="Error"
SyntaxError: invalid syntax
```

**Why:** Python uses whitespace to separate tokens, so it sees two separate names.

**Fix:** `student_name` or `studentName`

### ❌ 3. Contains a special character

```python
student@name = "Vettri"
```

```text title="Error"
SyntaxError: cannot assign to expression here. Maybe you meant '==' instead of '='?
```

**Why:** `@`, `#`, `$`, `%`, `&` etc. all have their own meanings. `@` in particular is
the **matrix-multiplication operator**, so Python reads `student@name` as
*student matmul name* — an expression, and you cannot assign to an expression.

Different special characters fail in genuinely different ways, which is worth seeing:

| You write | Actual error | Why |
|---|---|---|
| `student@name = "V"` | `SyntaxError: cannot assign to expression here` | `@` is the matmul operator |
| `student%name = "V"` | `SyntaxError: cannot assign to expression here` | `%` is the modulo operator |
| `student$name = "V"` | `SyntaxError: invalid syntax` | `$` isn't an operator at all |
| `student#name = "V"` | `NameError: name 'student' is not defined` | `#` starts a **comment** — the line becomes just `student` |

That last one is the sneakiest: it isn't a syntax error at all. Python silently discards
everything after `#`, leaving a line that merely evaluates `student`.

**Fix:** `student_name`

### ❌ 4. Uses a Python keyword

```python
if = 5
```

```text title="Error"
SyntaxError: invalid syntax
```

**Why:** keywords are **reserved** — they're part of the language grammar.

**Fix:** pick a different word — `condition = 5`, `loop_var = "Hello"`

### ❌ 5. Contains a hyphen

```python
student-name = "Vettri"
```

```text title="Error"
SyntaxError: cannot assign to expression here. Maybe you meant '==' instead of '='?
```

**Why:** `-` is the subtraction operator. Python reads `student-name` as
*student minus name*, which is an expression, and you can't assign to an expression.

**Fix:** `student_name`

:::tip

This is the single most common slip for people coming from CSS, HTML, or shell scripting,
where `kebab-case` is normal. In Python, `-` is **always** arithmetic.

:::

---

## Python Keywords

Python 3.11 has **35** reserved keywords. None can be used as a variable name.

```python
import keyword
print(len(keyword.kwlist))   # → 35
print(keyword.kwlist)
```

Grouped by purpose:

| Group | Keywords |
|---|---|
| Control flow | `if`, `elif`, `else`, `for`, `while`, `break`, `continue`, `pass` |
| Functions | `def`, `return`, `lambda`, `yield` |
| Classes | `class` |
| Imports | `import`, `from`, `as` |
| Exceptions | `try`, `except`, `finally`, `raise`, `assert` |
| Logic & membership | `and`, `or`, `not`, `in`, `is` |
| Constants | `True`, `False`, `None` |
| Scope | `global`, `nonlocal` |
| Context & async | `with`, `async`, `await` |
| Other | `del` |

Check any name yourself:

```python
import keyword
print(keyword.iskeyword("class"))   # → True
print(keyword.iskeyword("klass"))   # → False
```

:::note Soft keywords

`match`, `case`, `type` and `_` are contextual. They're legal variable names, but avoid
them — using `match` as a variable will confuse anyone reading your code.

:::

:::danger Built-ins are not keywords, but don't shadow them either

`list = [1,2,3]` is *legal* — no error — but now `list()` is broken for the rest of your
program. Same for `str`, `dict`, `sum`, `type`, `id`, `input`. This is worse than a
`SyntaxError` because it fails silently, much later.

```python
list = [1, 2, 3]
list((4, 5))     # TypeError: 'list' object is not callable
```

:::

---

## Naming Conventions

Legal is not the same as good. These are conventions from **PEP 8**, Python's style guide.

| Style | Use for | Example |
|---|---|---|
| `snake_case` | **variables, functions** | `student_name`, `total_amount`, `is_valid` |
| `camelCase` | *avoid in Python* | `studentName` — works, but non-standard |
| `PascalCase` | **classes** | `StudentProfile`, `PersonRecord` |
| `UPPER_CASE` | **constants** | `MAX_SIZE = 100`, `PI = 3.14159` |
| `_leading` | internal use | `_internal_value` |
| `__dunder__` | special methods — don't invent your own | `__init__`, `__str__` |

```python
# Variables — snake_case
user_age = 25
is_student = True
total_price = 100.50
student_list = ["Alice", "Bob", "Charlie"]

# Class — PascalCase
class StudentProfile:
    pass

# Constants — UPPER_CASE
MAX_STUDENTS = 100
DATABASE_URL = "localhost:5432"
```

:::note

Python has **no real constants** — `MAX_STUDENTS = 100` can be reassigned. `UPPER_CASE`
is a message to other programmers, not a guarantee to the interpreter.

:::

**Naming well matters more than naming legally:**

| Poor | Better | Why |
|---|---|---|
| `x` | `student_count` | says what it holds |
| `data` | `exam_scores` | says what kind of data |
| `flag` | `is_enrolled` | `is_`/`has_` prefix reads as a question |
| `l`, `O`, `I` | anything else | look like `1` and `0` in most fonts |
| `temp2` | `celsius_reading` | numbered names hide meaning |

---

## Quick Test

Are these valid?

| # | Name | Verdict | Reason |
|---|---|---|---|
| 1 | `myVariable` | ✅ valid | starts with a letter, alphanumeric |
| 2 | `_private` | ✅ valid | starts with an underscore |
| 3 | `2fast` | ❌ invalid | starts with a digit |
| 4 | `user-name` | ❌ invalid | contains a hyphen |
| 5 | `user_name_123` | ✅ valid | letters, underscores, digits (not first) |
| 6 | `class` | ❌ invalid | reserved keyword |
| 7 | `first-name` | ❌ invalid | contains a hyphen |
| 8 | `__init__` | ✅ valid | double underscores are legal (Python uses them) |
| 9 | `MAX SIZE` | ❌ invalid | contains a space |
| 10 | `firstName` | ✅ valid | camelCase works, but isn't Python standard |

You can check any of these programmatically — see [Run It Yourself](#run-it-yourself) below.

---

## Summary

| Rule | Status |
|---|---|
| Starts with a letter | ✅ allowed |
| Starts with an underscore | ✅ allowed |
| Starts with a digit | ❌ not allowed |
| Contains letters, digits, underscores | ✅ allowed |
| Contains spaces | ❌ not allowed |
| Contains special chars (`@`, `#`, `$`, `%`) | ❌ not allowed |
| Contains a hyphen `-` | ❌ not allowed |
| Is a Python keyword | ❌ not allowed |
| Shadows a built-in (`list`, `str`, `sum`) | ⚠️ legal but harmful |
| Case-sensitive | ✅ `age` ≠ `Age` ≠ `AGE` |

**Key takeaways**

- Letter or underscore to start; letters, digits, underscores thereafter
- `-` is subtraction — never use it in a name
- 35 keywords are reserved; `keyword.iskeyword()` will tell you
- Shadowing built-ins compiles fine and breaks things silently — the dangerous case
- `snake_case` for variables, `PascalCase` for classes, `UPPER_CASE` for constants
- Descriptive beats short: `student_count` over `x`

**See also:** [Values and Types](./01-values-and-types.md) for what the variables can hold ·
[Data Types](./03-data-types.md) for the full type list

---

## Run It Yourself

Python's own checker for whether a name is legal:

```python title="check_names.py"
import keyword

candidates = [
    "myVariable", "_private", "2fast", "user-name", "user_name_123",
    "class", "first-name", "__init__", "MAX SIZE", "firstName",
]

print(f"{'Name':<16} {'Valid':<7} Reason")
print("-" * 50)
for name in candidates:
    if keyword.iskeyword(name):
        valid, reason = False, "reserved keyword"
    elif not name.isidentifier():
        valid, reason = False, "not a legal identifier"
    else:
        valid, reason = True, "OK"
    print(f"{name:<16} {'✅' if valid else '❌':<7} {reason}")
```

```text title="Output"
Name             Valid   Reason
--------------------------------------------------
myVariable       ✅       OK
_private         ✅       OK
2fast            ❌       not a legal identifier
user-name        ❌       not a legal identifier
user_name_123    ✅       OK
class            ❌       reserved keyword
first-name       ❌       not a legal identifier
__init__         ✅       OK
MAX SIZE         ❌       not a legal identifier
firstName        ✅       OK
```

`str.isidentifier()` and `keyword.iskeyword()` together are the exact test Python itself
applies — no need to guess.

---

## Practice Questions

*From the Unit 1 question bank. Tags and marks are explained on the
[Python index](../index.md#practice-questions).*

### Unit 1 § A — Variables, Naming & Data Types

**A1. [THEORY]** State all the rules for a valid Python variable name. Then give **5 valid** and
**5 invalid** names, explaining why each invalid one is rejected. `[5]`

**A2. [OUT]** `[2]`

```python
age = 20
Age = 30
AGE = 40
print(age, Age, AGE)
print(age + Age + AGE)
```

**A3. [THEORY]** For each name below, say **valid** or **invalid**. If invalid, give the reason. `[5]`

```text
2nd_place    _total    class    my-var    Total$
firstName    for       data 1   __init__   Σ
```

*(One of these looks invalid but is actually legal. Find it.)*
