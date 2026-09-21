---
sidebar_position: 1
title: Values and Types
description: Every Python value carries its type. How to ask what that type is, and what happens when you convert between them.
tags: [python, basics, types]
toc_max_heading_level: 3
---

# Values and Types

> **Exercise —** Create variables with the values `100`, `15.75`, `"Python"`, `True`.
> Print the value and datatype of each.

---

## The Answer

```python
num_value  = 100
dec_value  = 15.75
text_value = "Python"
flag_value = True

print(f"Value: {num_value} Datatype: {type(num_value)}")
print(f"Value: {dec_value} Datatype: {type(dec_value)}")
print(f"Value: {text_value} Datatype: {type(text_value)}")
print(f"Value: {flag_value} Datatype: {type(flag_value)}")
```

```text title="Output"
Value: 100 Datatype: <class 'int'>
Value: 15.75 Datatype: <class 'float'>
Value: Python Datatype: <class 'str'>
Value: True Datatype: <class 'bool'>
```

| Variable | Value | Type | Full type | Meaning |
|---|---|---|---|---|
| `num_value` | `100` | `int` | `<class 'int'>` | Whole number |
| `dec_value` | `15.75` | `float` | `<class 'float'>` | Decimal number |
| `text_value` | `"Python"` | `str` | `<class 'str'>` | Text / characters |
| `flag_value` | `True` | `bool` | `<class 'bool'>` | `True` or `False` |

---

## Value vs Type

- A **value** is the actual data. → `100`
- A **type** is the *kind* of data that value is. → `int`

Every value in Python carries its type with it. You never declare the type yourself —
Python inspects the value and decides:

| You write | What Python sees | Type it picks |
|---|---|---|
| `100` | no decimal point | `int` |
| `15.75` | a decimal point | `float` |
| `"Python"` | quotes | `str` |
| `True` | the keyword `True` | `bool` |

The built-in `type()` function asks Python: *"what type is this value?"*

---

## Three ways to ask "what type is this?"

### `type(value)` — returns the type object

```python
print(type(100))      # → <class 'int'>
print(type(15.75))    # → <class 'float'>
```

### `type(value).__name__` — returns just the name, as clean text

```python
print(type(100).__name__)       # → int
print(type(15.75).__name__)     # → float
print(type("Python").__name__)  # → str
print(type(True).__name__)      # → bool
```

Use this when you want tidy output instead of `<class 'int'>`.

### `isinstance(value, type)` — returns `True` or `False`

```python
print(isinstance(100, int))       # → True
print(isinstance(100, float))     # → False
print(isinstance(15.75, float))   # → True
print(isinstance("Python", str))  # → True
```

Use this inside `if` statements — it answers a yes/no question.

**Which should you use?**

| Form | Returns | Best for |
|---|---|---|
| `type(x)` | the type object | printing / inspecting |
| `type(x).__name__` | a string | tidy display output |
| `type(x) == int` | `True`/`False` | exact type match only |
| `isinstance(x, int)` | `True`/`False` | **general checks — prefer this** |

`isinstance()` also accepts a tuple, which `type()` comparison cannot:
`isinstance(x, (int, float))` is true for either.

---

## Each type in detail

### `int` — `100`

Whole numbers only. No decimal point. Can be negative or zero.

```python
num_value = 100
print(num_value + 1)    # → 101
print(num_value * 2)    # → 200
print(num_value / 3)    # → 33.333333333333336   division ALWAYS gives float
print(num_value // 3)   # → 33                   // keeps it an int
```

Python `int` has **no size limit** — it grows as large as memory allows:

```python
print(2 ** 100)
# → 1267650600228229401496703205376
```

### `float` — `15.75` {#float}

Numbers with a decimal point. Stored in binary (base 2).

```python
dec_value = 15.75
print(dec_value + 1)      # → 16.75
print(dec_value * 2)      # → 31.5
print(round(dec_value))   # → 16   rounds to nearest whole
print(int(dec_value))     # → 15   CUTS OFF the decimal
```

**Why `15.75` is stored exactly.** `0.75 = 3/4`, and 4 is a power of 2, so binary
represents it perfectly. In binary, `15.75` is `1111.11`.

```python
print(15.75 == 15 + 0.75)   # → True
```

But **most decimals are not exact**:

```python
print(0.1 + 0.2)          # → 0.30000000000000004
print(0.1 + 0.2 == 0.3)   # → False   surprising, but correct
```

Your exercise value happens to be one of the well-behaved ones — don't generalise from it.

### `str` — `"Python"`

Text. Anything inside quotes — single, double, or triple.

```python
text_value = "Python"
print(len(text_value))       # → 6
print(text_value.upper())    # → PYTHON
print(text_value.lower())    # → python
print(text_value[0])         # → P    first character
print(text_value[-1])        # → n    last character
print(text_value * 2)        # → PythonPython
print(text_value + "!")      # → Python!
```

A number in quotes is a **string, not a number**:

```python
print(type(100))     # → <class 'int'>
print(type("100"))   # → <class 'str'>
print("100" * 2)     # → 100100   repeats the text!
print(100 * 2)       # → 200      does arithmetic
```

### `bool` — `True`

Only two possible values: `True` and `False`. **Capital first letter.**

```python
flag_value = True
print(not flag_value)            # → False
print(flag_value and False)      # → False
print(flag_value or False)       # → True
```

Booleans usually come from comparisons rather than being typed by hand:

```python
print(100 > 50)                  # → True
print(15.75 < 10)                # → False
print("Python" == "python")      # → False   case matters
print(type(100 > 50).__name__)   # → bool
```

---

## The Boolean Surprise: `bool` is a kind of `int` {#bool-is-a-subclass-of-int}

In Python, `bool` is built **on top of** `int`. `True` really is `1`; `False` really is
`0`. This catches almost everyone out.

```python
print(isinstance(True, int))    # → True    True IS an int!
print(isinstance(True, bool))   # → True
print(isinstance(100, bool))    # → False   but ints are NOT bools

print(True == 1)                # → True
print(False == 0)               # → True
print(True + True)              # → 2       arithmetic works
print(True + 100)               # → 101
```

The inheritance chain proves it:

```python
for cls in bool.__mro__:
    print(cls.__name__)
```

```text title="Output"
bool
int
object
```

### Why this is actually useful

Because `True` is `1`, `sum()` counts them for you:

```python
scores = [85, 42, 91, 67, 38]
passed = sum(score >= 60 for score in scores)
print(f"{passed} students passed")   # → 3 students passed
```

### Why this can bite you

If you check `int` before `bool`, booleans get misclassified — because a `bool` *is* an `int`:

```python
value = True

if isinstance(value, int):      # ← this matches True!
    print("number")
elif isinstance(value, bool):   # ← never reached
    print("flag")
# → number
```

:::warning

Always check `bool` **first**.

:::

---

## Dynamic Typing

In Java or C you declare a type up front:

```java
int x = 100;   // x can ONLY ever hold an int
```

Python doesn't work that way. A variable is just a **name pointing at a value**. Point it
at a different value and its type changes with it.

```python
box = 100
print(type(box).__name__)     # → int
box = 15.75
print(type(box).__name__)     # → float
box = "Python"
print(type(box).__name__)     # → str
box = True
print(type(box).__name__)     # → bool
```

Powerful, but risky — the type can change without warning, so check with `type()` or
`isinstance()` when unsure.

---

## Type Conversion (Casting)

Convert between types with `int()`, `float()`, `str()` and `bool()`. Some conversions
work, some silently lose data, and some fail outright.

| Expression | Result | Note |
|---|---|---|
| `int("100")` | `100` | String of digits → int |
| `int(15.75)` | `15` | **Truncates, does NOT round** |
| `int("15.75")` | `ValueError` | Cannot parse a decimal string |
| `float(100)` | `100.0` | int → float, adds `.0` |
| `float("15.75")` | `15.75` | String decimal → float works |
| `str(100)` | `"100"` | Any value → text |
| `str(15.75)` | `"15.75"` | Numbers become characters |
| `bool(100)` | `True` | Any non-zero number is `True` |
| `bool(0)` | `False` | Only `0` is `False` |
| `bool(15.75)` | `True` | Non-zero float is `True` |
| `bool("")` | `False` | Empty string is `False` |
| `bool("False")` | `True` | Non-empty string → **always** `True` |
| `int(True)` | `1` | `True` is `1` underneath |
| `int(False)` | `0` | `False` is `0` underneath |

Verified output for the ones that succeed:

```text
int("100")     = 100          type: int
int(15.75)     = 15           type: int
float(100)     = 100.0        type: float
float("15.75") = 15.75        type: float
str(100)       = '100'        type: str
bool(100)      = True         type: bool
bool(0)        = False        type: bool
int(True)      = 1            type: int
```

### The one that fails

```python
try:
    int("15.75")
except ValueError as error:
    print(error)
# → invalid literal for int() with base 10: '15.75'
```

Fix it by going through `float` first:

```python
print(int(float("15.75")))   # → 15
```

### Truthy and falsy

Only these seven convert to `False`:

```python
for item in [0, 0.0, "", [], {}, None, False]:
    print(f"bool({item!r}) = {bool(item)}")
```

```text title="Output"
bool(0)     = False
bool(0.0)   = False
bool('')    = False
bool([])    = False
bool({})    = False
bool(None)  = False
bool(False) = False
```

**Everything else is truthy** — including strings that look false:

```python
print(bool("False"))   # → True
print(bool("0"))       # → True
print(bool(-1))        # → True
```

---

## Real-World Uses

### Machine learning — each type has a job

```python
epochs        = 100            # int   — counts must be whole
learning_rate = 0.001          # float — needs decimal precision
model_name    = "RandomForest" # str   — labels are text
use_gpu       = True           # bool  — on/off switch
```

### User input — `input()` ALWAYS returns a string

```python
age = input("Enter age: ")   # age is a str, even if you type 25
```

```python
simulated_input = "25"
print(type(simulated_input).__name__)     # → str
# simulated_input + 5  →  TypeError! Cannot add str and int
print(int(simulated_input) + 5)           # → 30   ✅
```

See [Input and Output](./06-input-output.md) for more on this.

### Money — `int` paise vs `float` rupees

```python
price_paise  = 1575    # int   — exact, no rounding errors
price_rupees = 15.75   # float — readable, tiny rounding risk
```

Banks store money as `int` in the smallest unit (paise/cents) to avoid float drift.

### Validation — check the type before using it

```python
for item in [100, 15.75, "Python", True]:
    if isinstance(item, bool):                 # bool FIRST — see above
        print(f"{item} is a flag")
    elif isinstance(item, (int, float)):
        print(f"{item} is a number, doubled = {item * 2}")
    elif isinstance(item, str):
        print(f"{item} is text, upper = {item.upper()}")
```

```text title="Output"
100 is a number, doubled = 200
15.75 is a number, doubled = 31.5
Python is text, upper = PYTHON
True is a flag
```

---

## Common Mistakes

| # | Mistake | Wrong | Right |
|---|---|---|---|
| 1 | Lowercase boolean | `flag = true` → `NameError` | `flag = True` |
| 2 | Quoting a number by accident | `num = "100"` → `"100" * 2` is `"100100"` | `num = 100` → `100 * 2` is `200` |
| 3 | Forgetting `input()` returns `str` | `age = input(); age + 5` → `TypeError` | `age = int(input()); age + 5` |
| 4 | `int()` on a decimal string | `int("15.75")` → `ValueError` | `int(float("15.75"))` → `15` |
| 5 | Thinking `int()` rounds | `int(15.75)` is `15`, not `16` | `round(15.75)` is `16` |
| 6 | Comparing `type()` to a string | `if type(x) == "int":` → never `True` | `if isinstance(x, int):` |
| 7 | Assuming `bool("False")` is `False` | `bool("False")` is `True` | only `""` is a falsy string |
| 8 | Expecting exact float maths | `0.1 + 0.2 == 0.3` → `False` | `abs((0.1+0.2) - 0.3) < 1e-9` → `True` |

Verified proof:

```text
'100' * 2                     = 100100
100 * 2                       = 200
int(15.75)                    = 15   vs   round(15.75) = 16
type(100) == 'int'            = False   (a trap!)
type(100) == int              = True
bool('False')                 = True
0.1 + 0.2 == 0.3              = False
abs((0.1 + 0.2) - 0.3) < 1e-9 = True   ✅ the right way
```

---

## Summary

| # | Variable | Value | Type | Description |
|---|---|---|---|---|
| 1 | `num_value` | `100` | `int` | Whole number |
| 2 | `dec_value` | `15.75` | `float` | Decimal number |
| 3 | `text_value` | `"Python"` | `str` | Text in quotes |
| 4 | `flag_value` | `True` | `bool` | `True` or `False` only |

**Key takeaways**

- You never declare a type — Python reads the value and decides
- `type(x)` shows the type; `isinstance(x, T)` asks a yes/no question
- `int()` truncates, `round()` rounds — not the same function
- `bool` is a subclass of `int`, so `True == 1` and `True + True == 2`
- `input()` always hands you a `str` — convert before doing maths
- Floats are approximate; compare with a tolerance, not `==`

**See also:** [Data Types](./03-data-types.md) for all eight built-in types ·
[Variables and Naming](./02-variables-and-naming.md) for naming the variables ·
[F-Strings](./05-f-strings.md) for the `f"{...}"` syntax used throughout

---

## Run It Yourself

```python title="values_and_types.py"
num_value  = 100
dec_value  = 15.75
text_value = "Python"
flag_value = True

for name, value in [
    ("num_value", num_value),
    ("dec_value", dec_value),
    ("text_value", text_value),
    ("flag_value", flag_value),
]:
    print(f"{name:<12} value: {str(value):<10} type: {type(value).__name__}")
```

```text title="Output"
num_value    value: 100        type: int
dec_value    value: 15.75      type: float
text_value   value: Python     type: str
flag_value   value: True       type: bool
```

---

## Practice Questions

*From the Unit 1 question bank. Tags and marks are explained on the
[Python index](../index.md#practice-questions).*

### Unit 1 § A — Variables, Naming & Data Types

**A7. [OUT]** What does this print, and what is the name of the error on the last line? `[3]`

```python
x = 10
print(x)
x = "ten"
print(x)
print(x + 10)
```

### Viva

1. What does `input()` return, always?
2. Why does `print(type(7/2))` show `float` even though the numbers are integers?
