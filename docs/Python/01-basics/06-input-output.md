---
sidebar_position: 6
title: Input and Output
description: input() always returns a string, and print() has three parameters worth knowing — sep, end, and the values themselves.
tags: [python, basics, io]
toc_max_heading_level: 3
---

# Input and Output

> **Topic —** Reading data from the user with `input()`, and controlling what `print()`
> puts on screen.

---

## `input()` — reading from the user

`input()` accepts data from the user **during program execution** (at runtime). It pauses
the program, waits for a line to be typed, and hands it back as a value.

```python
age = input("Enter age: ")
print(type(age))
```

```text title="Output (typing 25)"
Enter age: 25
<class 'str'>
```

The string passed to `input()` is the **prompt** — the message displayed before the cursor.
It's optional:

```python
city = input()             # no prompt — just waits
print("I am from", city)
```

```text title="Output (typing Chennai)"
Chennai
I am from Chennai
```

With a prompt, it's clearer what's expected:

```python
city = input("Enter Your City: ")
print("I am from", city)
```

```text title="Output"
Enter Your City: Chennai
I am from Chennai
```

### `input()` ALWAYS returns a string

This is the single most important thing on this page. Even when the user types digits,
you get a `str`:

```python
age = input("Enter age: ")   # user types 25
print(type(age))             # → <class 'str'>
# age + 5  →  TypeError: can only concatenate str (not "int") to str
```

Wrap it in `int()` (or `float()`) to do arithmetic:

```python
age = int(input("Enter age: "))
print(type(age))     # → <class 'int'>
print(age + 5)       # → 30
```

```text title="Output"
Enter age: 25
<class 'int'>
30
```

:::warning

`int(input())` raises `ValueError` if the user types something that isn't a whole number:

```python
try:
    age = int(input("Enter age: "))
except ValueError as error:
    print("ValueError:", error)
```

```text title="Output (typing abc)"
Enter age: ValueError: invalid literal for int() with base 10: 'abc'
```

Also note `int("25.5")` fails too — go through `float` first. See
[Values and Types](./01-values-and-types.md#type-conversion-casting).

:::

| What you want | Write |
|---|---|
| Text | `name = input("Name: ")` |
| Whole number | `age = int(input("Age: "))` |
| Decimal | `price = float(input("Price: "))` |
| Yes/no flag | `flag = input("Continue? ").lower() == "y"` |

---

## `print()` — writing to the screen

`print()` takes any number of values, plus two parameters that control how they're joined
and how the line ends:

```text
print(value1, value2, ..., sep=' ', end='\n')
```

### Multiple values

Pass as many as you like, separated by commas. `print()` converts each to text for you —
no `str()` needed:

```python
name = "Rahul"
age = 20
print(name, age)
```

```text title="Output"
Rahul 20
```

Note the space between them. That's `sep` doing its default job.

### Parameter `sep` — what goes *between* values

Default is a single space.

```python
print("Python", "Java", "C")
print("Python", "Java", "C", sep=", ")
print("Python", "Java", "C", sep=" | ")
print("A", "B", sep="")
```

```text title="Output"
Python Java C
Python, Java, C
Python | Java | C
AB
```

### Parameter `end` — what goes *after* the last value

Default is `"\n"`, a newline — which is why every `print()` normally starts a fresh line.

```python
print("Hello")
print("World")
```

```text title="Output"
Hello
World
```

Change `end` and the next `print()` continues on the same line:

```python
print("Hello", end=" ")
print("World")
```

```text title="Output"
Hello World
```

```python
print("Python", end="---")
print("Programming")
```

```text title="Output"
Python---Programming
```

:::tip

`end=" "` is how you print a loop's results on one line:

```python
for i in range(1, 6):
    print(i, end=" ")
print()          # a bare print() ends the line
```

```text title="Output"
1 2 3 4 5
```

The final bare `print()` matters — without it, the next output would run on from `5`.

:::

`sep` and `end` combine freely:

```python
print(1, 2, 3, sep="-", end="!\n")
```

```text title="Output"
1-2-3!
```

---

## Printing expressions

`print()` prints the **result**, not the expression. The maths happens first:

```python
a = 10
b = 20
print(a + b)          # → 30
print("Sum:", a + b)  # → Sum: 30
```

---

## Printing different data types together

Unlike string concatenation with `+`, comma-separated `print()` arguments don't need
converting:

```python
student = "Rahul"
marks = 90
print("Student:", student, "Marks:", marks)
```

```text title="Output"
Student: Rahul Marks: 90
```

Compare the three ways to write that same line:

```python
print("Student:", student, "Marks:", marks)              # commas — no str() needed
print("Student: " + student + " Marks: " + str(marks))   # + — str() required on marks
print(f"Student: {student} Marks: {marks}")              # f-string — clearest
```

All three print the same thing. The f-string is what you'd actually write — see
[F-Strings](./05-f-strings.md).

One value per line is often the readable choice:

```python
print("Name:", "John")
print("Age:", 30)
```

```text title="Output"
Name: John
Age: 30
```

---

## Common Mistakes

| # | Mistake | Wrong | Right |
|---|---|---|---|
| 1 | Doing maths on `input()` | `age = input(); age + 5` → `TypeError` | `age = int(input()); age + 5` |
| 2 | `int()` on a decimal string | `int(input())` with `25.5` → `ValueError` | `float(input())`, or `int(float(...))` |
| 3 | Concatenating a number with `+` | `"Age: " + 30` → `TypeError` | `"Age:", 30` or `f"Age: {30}"` |
| 4 | Expecting `sep` between `print()` calls | `sep` only applies *within* one call | use `end` to join separate calls |
| 5 | Forgetting the bare `print()` after an `end=" "` loop | next output runs on from the last value | add `print()` to close the line |
| 6 | Assuming `input()` strips nothing | trailing spaces are kept | `input().strip()` |

---

## Summary

| Function | Purpose | Key point |
|---|---|---|
| `input(prompt)` | Read one line from the user | **Always returns `str`** |
| `int(input())` | Read a whole number | `ValueError` on bad input |
| `float(input())` | Read a decimal | Handles `25.5` |
| `print(*values)` | Write to screen | Converts each value automatically |
| `print(..., sep=)` | Text between values | Default `' '` |
| `print(..., end=)` | Text after the last value | Default `'\n'` |

**Key takeaways**

- `input()` returns a `str` every single time — convert before doing arithmetic
- The prompt is just the first argument to `input()`; it's optional
- `sep` controls what goes *between* values, `end` what goes *after* the line
- `sep` and `end` apply to a single `print()` call, not across calls
- `print("a", 30)` needs no `str()`; `"a" + 30` does
- `end=" "` plus a closing bare `print()` is the loop-on-one-line pattern

**See also:** [F-Strings](./05-f-strings.md) for formatting the values you print ·
[Values and Types](./01-values-and-types.md) for why the conversion is needed

---

## Run It Yourself

This version uses fixed values instead of `input()` so it runs unattended:

```python title="input_output.py"
# --- print() parameters ---
print("default sep:", "Python", "Java", "C")
print("comma sep:  ", end="")
print("Python", "Java", "C", sep=", ")
print("no newline: ", end="")
print("Hello", end=" ")
print("World")

# --- looping on one line ---
print("loop:       ", end="")
for i in range(1, 6):
    print(i, end=" ")
print()

# --- input() would give you a str; simulate it ---
simulated_input = "25"
print("type:       ", type(simulated_input).__name__)
print("converted:  ", int(simulated_input) + 5)
```

```text title="Output"
default sep: Python Java C
comma sep:  Python, Java, C
no newline: Hello World
loop:       1 2 3 4 5 
type:        str
converted:   30
```

---

## Practice Questions

*From the Unit 1 question bank. Tags and marks are explained on the
[Python index](../index.md#practice-questions).*

### Unit 1 § C — Input & Output

**C1. [OUT]** Assume the user types `25` at both prompts. `[3]`

```python
a = input("Enter a number: ")
print(type(a))
print(a + a)

b = int(input("Enter a number: "))
print(type(b))
print(b + b)
```

**C2. [THEORY]** `input()` always returns one specific type, no matter what the user types.
Which type, and what must you do if you need to do arithmetic on it? `[2]`

**C3. [OUT]** `[4]`

```python
print("Python", "Java", "C")
print("Python", "Java", "C", sep=", ")
print("Python", "Java", "C", sep="")
print("Hello", end=" ")
print("World")
print("A", end="---")
print("B")
```

**C4. [PROG]** Accept a **name**, **age**, and **city** from the user. Display them exactly in
this layout: `[5]`

```text
Student Details
---------------
Name : Vettri
Age  : 28
City : Chennai
```

**C5. [OUT]** `[3]`

```python
print("A\tB\tC")
print("Line1\nLine2")
print("She said \"Hi\"")
print('It\'s fine')
print("C:\\Users\\new")
```
