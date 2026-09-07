---
sidebar_position: 5
title: F-Strings
description: Formatted string literals — format specs, alignment, padding, conversion flags, and debug mode.
tags: [python, basics, strings]
toc_max_heading_level: 3
---

# F-Strings

> **Topic —** Formatted string literals (`f"..."`), the modern way to build strings in Python.

---

## What Are F-Strings?

F-strings embed expressions directly inside string literals. Introduced in
**Python 3.6**, they're now the preferred formatting method because they are:

- **Fast** — faster than `%` and `.format()`
- **Readable** — the value appears where it will be printed
- **Concise** — less code

---

## Basic Syntax

```python
name = "Alice"
age = 25

result = f"My name is {name} and I am {age} years old"
print(result)
```

```text title="Output"
My name is Alice and I am 25 years old
```

The `f` prefix is **mandatory**. It tells Python "this is a formatted string":

```python
print(f"Hello {name}")    # → Hello Alice     ✅
print("Hello {name}")     # → Hello {name}    ❌ prints the braces literally
```

---

## Comparison With Older Methods

All four produce identical output. Only the last is worth writing today.

```python
name = "Bob"
age = 30

result1 = "My name is " + name + " and I am " + str(age) + " years old"  # concatenation
result2 = "My name is %s and I am %d years old" % (name, age)            # % formatting
result3 = "My name is {} and I am {} years old".format(name, age)        # .format()
result4 = f"My name is {name} and I am {age} years old"                  # f-string
```

```text title="Output"
1. Concatenation: My name is Bob and I am 30 years old
2. % formatting: My name is Bob and I am 30 years old
3. .format():    My name is Bob and I am 30 years old
4. F-strings:    My name is Bob and I am 30 years old
```

| Method | Since | Problem |
|---|---|---|
| Concatenation | always | needs `str()` on every number; unreadable |
| `%` formatting | Python 2 | must match `%s`/`%d` to types by hand |
| `.format()` | 2.7 | arguments sit far from where they appear |
| **f-string** | **3.6** | **— use this** |

---

## Expressions Inside F-Strings

Anything that evaluates to a value can go inside the braces — not just variable names.

**Maths:**

```python
x, y = 10, 5
print(f"Addition: {x} + {y} = {x + y}")            # → Addition: 10 + 5 = 15
print(f"Multiplication: {x} * {y} = {x * y}")      # → Multiplication: 10 * 5 = 50
print(f"Power: {x} ** 2 = {x ** 2}")               # → Power: 10 ** 2 = 100
```

**Method calls:**

```python
city = "delhi"
print(f"Uppercase: {city.upper()}")            # → Uppercase: DELHI
print(f"Capitalized: {city.capitalize()}")     # → Capitalized: Delhi
```

**Function calls:**

```python
def greet(name):
    return f"Hello, {name}!"

print(f"Function result: {greet('Charlie')}")   # → Function result: Hello, Charlie!
```

**Conditionals (ternary):**

```python
age = 17
print(f"Age {age}: {'Adult' if age >= 18 else 'Minor'}")   # → Age 17: Minor
```

:::warning Watch your quotes

In Python 3.11 and earlier you cannot reuse the same quote character inside the braces.
`f"{greet("Bob")}"` is a `SyntaxError` — use `f"{greet('Bob')}"`. Python 3.12+ relaxed this.

:::

---

## Formatting Numbers

The format spec goes after a colon: `{value:spec}`.

```python
price = 19.999
percentage = 0.8567
large_number = 1234567

print(f"Price: ${price:.2f}")                 # → Price: $20.00
print(f"Percentage: {percentage:.1%}")        # → Percentage: 85.7%
print(f"Rounded to 1 decimal: {price:.1f}")   # → Rounded to 1 decimal: 20.0
print(f"With commas: {large_number:,}")       # → With commas: 1,234,567
print(f"Scientific: {large_number:.2e}")      # → Scientific: 1.23e+06
```

:::note

`${price:.2f}` gives `$20.00`, not `$19.99` — `.2f` **rounds**, and `19.999` rounds up to
`20.00`. It does not truncate.

:::

| Spec | Meaning | Example | Output |
|---|---|---|---|
| `.2f` | 2 decimal places | `f"{3.14159:.2f}"` | `3.14` |
| `.0f` | no decimals | `f"{3.7:.0f}"` | `4` |
| `.1%` | percentage, 1 decimal | `f"{0.8567:.1%}"` | `85.7%` |
| `,` | thousands separator | `f"{1234567:,}"` | `1,234,567` |
| `.2e` | scientific notation | `f"{1234567:.2e}"` | `1.23e+06` |
| `+` | always show sign | `f"{42:+}"` | `+42` |
| `08.2f` | zero-pad to width 8 | `f"{3.14:08.2f}"` | `00003.14` |
| `b` / `o` / `x` | binary / octal / hex | `f"{255:x}"` | `ff` |

---

## Alignment and Padding

```python
text = "Python"
width = 15

print(f"Left aligned:    |{text:<{width}}|")
print(f"Right aligned:   |{text:>{width}}|")
print(f"Center aligned:  |{text:^{width}}|")
print(f"Pad with dots:   |{text:.>15}|")
print(f"Pad with dashes: |{text:->15}|")
```

```text title="Output"
Left aligned:    |Python         |
Right aligned:   |         Python|
Center aligned:  |    Python     |
Pad with dots:   |.........Python|
Pad with dashes: |---------Python|
```

| Symbol | Alignment |
|---|---|
| `<` | left (default for text) |
| `>` | right (default for numbers) |
| `^` | centre |

The fill character goes **before** the alignment symbol: `{text:.>15}` means "pad with `.`,
align right, width 15".

:::tip

Note the nested braces in `{text:<{width}}` — the width itself can be a variable. That's
how you build tables whose column widths are computed at runtime.

:::

---

## Real-World Examples

### Receipt

```python
item = "Laptop"
price = 999.99
quantity = 2
total = price * quantity

print(f"""
{'Item':<15} {'Price':>10} {'Qty':>5} {'Total':>12}
{'-'*42}
{item:<15} ${price:>9.2f} {quantity:>5} ${total:>11.2f}
""")
```

```text title="Output"
Item                 Price   Qty        Total
------------------------------------------
Laptop          $   999.99     2 $    1999.98
```

### User profile

```python
name, location, score = "Vettri", "Chennai", 95.5

print(f"""
Name:     {name}
Location: {location}
Score:    {score:.1f}%
Status:   {'Active' if score >= 80 else 'Inactive'}
""")
```

```text title="Output"
Name:     Vettri
Location: Chennai
Score:    95.5%
Status:   Active
```

### Data table

```python
students = [("Alice", 95), ("Bob", 87), ("Charlie", 92)]

print(f"{'Name':<15} {'Score':>8}")
print("-" * 25)
for name, score in students:
    print(f"{name:<15} {score:>8}")
```

```text title="Output"
Name               Score
-------------------------
Alice                 95
Bob                   87
Charlie               92
```

---

## Special Cases

**Literal braces** — double them:

```python
print(f"To print braces: {{Hello}}")     # → To print braces: {Hello}
```

**Dictionary access** — mind the quote nesting:

```python
data = {"name": "Raj", "city": "Mumbai"}
print(f"Data: {data['name']} lives in {data['city']}")
# → Data: Raj lives in Mumbai
```

**Multi-line f-strings** — use triple quotes:

```python
info = f"""
First Name: Alice
Last Name: Smith
Age: 28
"""
```

**Conversion flags** — applied before formatting:

| Flag | Does | Example | Output |
|---|---|---|---|
| `!s` | `str()` first | `f"{'hi'!s}"` | `hi` |
| `!r` | `repr()` — adds quotes | `f"{'hi'!r}"` | `'hi'` |

:::warning Booleans under a width spec become `1` and `0`

`bool` is a subclass of `int`, so a numeric format spec formats it *as a number* — no
error, just a value you didn't expect:

```python
flag = True
print(f"|{flag}|")          # → |True|        no spec — fine
print(f"|{flag:<10}|")      # → |1         |  formatted as the int 1
print(f"|{str(flag):<10}|") # → |True      |  convert first
```

If you need `True` in an aligned column, call `str()` on it yourself. See
[Values and Types](./01-values-and-types.md#bool-is-a-subclass-of-int).

:::

---

## Debug Mode with `=`

Python 3.8+ — put `=` after an expression to print both the expression *and* its value:

```python
x, y = 42, 10

print(f"{x=}")        # → x=42
print(f"{y=}")        # → y=10
print(f"{x + y=}")    # → x + y=52
```

Extremely useful for debugging — no more typing `print("x =", x)`.

---

## Format Spec Reference

Full grammar, in order:

```text
{value !conversion : fill align sign # 0 width , .precision type}
```

Everything is optional. Reading a complex one left to right:

```python
print(f"{3.14159:*^12.2f}")   # → ****3.14****
#         value  │││ │ └── type:  f = fixed-point
#                │││ └──── precision: 2 decimals
#                ││└────── width: 12 characters
#                │└─────── align: ^ = centre
#                └──────── fill: * character
```

---

## Common Mistakes

| # | Mistake | Wrong | Right |
|---|---|---|---|
| 1 | Forgetting the `f` prefix | `"Hello {name}"` prints braces | `f"Hello {name}"` |
| 2 | Same quotes nested (≤3.11) | `f"{d["k"]}"` → `SyntaxError` | `f"{d['k']}"` |
| 3 | Aligning a bool | `f"{True:<10}"` → `1`, not `True` | `f"{str(True):<10}"` |
| 4 | Expecting `.2f` to truncate | `f"{19.999:.2f}"` → `20.00` | use `int(x*100)/100` to truncate |
| 5 | Literal braces | `f"{Hello}"` → `NameError` | `f"{{Hello}}"` |
| 6 | Backslash inside braces (≤3.11) | `f"{'a\nb'}"` → `SyntaxError` | build the string outside first |

---

## Summary

**Syntax:** `f"text {expression:format_spec} more text"`

**Key takeaways**

- The `f` prefix is what activates substitution — without it you get literal braces
- Any expression works inside the braces: maths, method calls, ternaries, function calls
- `:` starts the format spec — `.2f`, `,`, `%`, `<`, `>`, `^`
- `{value:<{width}}` lets the width itself be a variable — this is how tables get built
- A width spec on a `bool` prints `1`/`0` — wrap it in `str()` to keep `True`/`False`
- `f"{x=}"` prints `x=42` — the fastest debugging tool in Python

**See also:** [Values and Types](./01-values-and-types.md) for why a `bool` formats as a
number · [Input and Output](./06-input-output.md) for `print()` beyond f-strings

---

## Practice Questions

*From the Unit 1 question bank. Tags and marks are explained on the
[Python index](../index.md#practice-questions).*

### Unit 1 § C — Input & Output

**C6. [PROG]** Given `name = "Vettri"` and `marks = 91.5678`, use **f-strings** to print: `[4]`

- the marks rounded to 2 decimal places
- the name left-aligned in a 15-character field, followed by a `|`
- the marks right-aligned in a 10-character field
- the name in uppercase, using an expression *inside* the f-string
