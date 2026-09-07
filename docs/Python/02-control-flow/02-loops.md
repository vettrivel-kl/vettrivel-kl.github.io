---
sidebar_position: 2
title: Loops
description: for and while loops, range(), break and continue, the loop else clause, and nested loops.
tags: [python, control-flow, loops]
toc_max_heading_level: 3
---

# Loops

> **Topic —** Repeating a block of code — a fixed number of times with `for`, or until a
> condition changes with `while`.

| Loop | Use when |
|---|---|
| `for` | you know **what to iterate over** — a range, string, list, tuple, dict |
| `while` | you know **when to stop**, but not how many steps that takes |

---

## `for` — iterating over a sequence

A `for` loop takes each item of a sequence in turn and runs the block with it.

```python
for i in range(5):
    print(i)
```

```text title="Output"
0
1
2
3
4
```

### `range()` — three forms

`range()` generates numbers on demand. The `stop` value is **always excluded**.

| Form | Means | `list(...)` |
|---|---|---|
| `range(5)` | `0` up to but not including `5` | `[0, 1, 2, 3, 4]` |
| `range(1, 6)` | `start` to `stop-1` | `[1, 2, 3, 4, 5]` |
| `range(2, 10, 3)` | with a **step** | `[2, 5, 8]` |
| `range(10, 0, -2)` | negative step counts down | `[10, 8, 6, 4, 2]` |
| `range(5, 1)` | start past stop, no step | `[]` — empty, no error |

```python
print(list(range(5)))
print(list(range(1, 6)))
print(list(range(2, 10, 3)))
print(list(range(10, 0, -2)))
print(list(range(5, 1)))
```

```text title="Output"
[0, 1, 2, 3, 4]
[1, 2, 3, 4, 5]
[2, 5, 8]
[10, 8, 6, 4, 2]
[]
```

:::warning

`range(5, 1)` produces nothing rather than raising an error — a loop over it silently does
zero iterations. If a loop mysteriously never runs, check the direction of your range.

:::

To count 1 to 5, write `range(1, 6)`. Off-by-one here is the most common `range()` slip.

### Iterating a string

Each character, in order:

```python
word = "CAT"
for letter in word:
    print(letter)
```

```text title="Output"
C
A
T
```

### Iterating a tuple or list

```python
numbers = (10, 20, 30)
for n in numbers:
    print(n)
```

```text title="Output"
10
20
30
```

### Iterating a dictionary

Looping a dict directly gives you the **keys**. Use `.items()` for both.

```python
student = {"name": "Vettri", "age": 28}

for key in student:
    print(key)

for key, value in student.items():
    print(f"{key} = {value}")
```

```text title="Output"
name
age
name = Vettri
age = 28
```

### `enumerate()` and `zip()`

You rarely need `range(len(...))`. `enumerate()` gives you the index alongside the item:

```python
for i, fruit in enumerate(["apple", "banana", "cherry"], start=1):
    print(i, fruit)
```

```text title="Output"
1 apple
2 banana
3 cherry
```

`zip()` walks two sequences together:

```python
for name, score in zip(["Alice", "Bob"], [95, 87]):
    print(name, score)
```

```text title="Output"
Alice 95
Bob 87
```

---

## `while` — looping until a condition changes

```python
i = 1
while i <= 5:
    print(i)
    i += 1
```

```text title="Output"
1
2
3
4
5
```

Three parts, and all three are your responsibility:

1. **initialise** — `i = 1` before the loop
2. **test** — `while i <= 5:`
3. **update** — `i += 1` inside the loop

:::danger Forget the update and the loop never ends

```python
i = 1
while i <= 5:
    print(i)
    # no i += 1  →  i stays 1 forever
```

`i` never reaches `6`, so the condition never turns false. Press `Ctrl+C` to stop a runaway
loop. Whenever you write a `while`, check that something inside the body moves the
condition toward false.

:::

---

## `break` — leave the loop early

```python
for i in range(5):
    if i == 3:
        break
    print(i)
```

```text title="Output"
0
1
2
```

`break` abandons the whole loop the moment it runs — `3` and `4` are never printed.

## `continue` — skip to the next iteration

```python
for i in range(5):
    if i == 2:
        continue
    print(i)
```

```text title="Output"
0
1
3
4
```

`2` is skipped, but the loop carries on. That's the difference: `break` exits, `continue`
skips.

---

## The loop `else` clause

Python lets a loop have an `else`. It's unusual, and the rule is easy to state:

:::note

A loop's `else` runs **only if the loop finished without `break`**.

:::

No `break`, so `else` runs:

```python
for x in range(3):
    print(x)
else:
    print("Loop completed")
```

```text title="Output"
0
1
2
Loop completed
```

### `break` vs `continue` against `else`

This pair is worth tracing carefully — it's the classic exam question.

```python
# Block A — break
for i in range(1, 6):
    if i == 3:
        break
    print(i)
else:
    print("Completed")
print("Done")
```

```text title="Output"
1
2
Done
```

```python
# Block B — continue
for i in range(1, 6):
    if i == 3:
        continue
    print(i)
else:
    print("Completed")
print("Done")
```

```text title="Output"
1
2
4
5
Completed
Done
```

Block A never prints `Completed` — the `break` cancelled the `else`. Block B does, because
`continue` isn't `break`: the loop still ran to the end.

`while` loops take an `else` too, with the same rule:

```python
i = 1
while i < 6:
    print(i)
    i += 1
else:
    print("Loop completed")
```

```text title="Output"
1
2
3
4
5
Loop completed
```

### Where the loop `else` earns its keep

Searching. "I looked at everything and never found it" is exactly what `for...else` says:

```python
for number in [29, 21]:
    for divisor in range(2, int(number ** 0.5) + 1):
        if number % divisor == 0:
            print(f"{number} is not prime (divisible by {divisor})")
            break
    else:
        print(f"{number} is prime")
```

```text title="Output"
29 is prime
21 is not prime (divisible by 3)
```

Without `else` you'd need a `found = False` flag and a check after the loop.

---

## Where the update sits changes everything

In a `while` loop, moving `i += 1` above or below the `if` changes the output. Trace both:

```python
i = 1
while i < 6:
    print(i)        # print BEFORE the check
    if i == 3:
        break
    i += 1          # update LAST

print("---")

i = 0
while i < 6:
    i += 1          # update FIRST
    if i == 3:
        continue
    print(i)        # print AFTER the check
```

```text title="Output"
1
2
3
---
1
2
4
5
6
```

The first loop prints `3` and *then* breaks, because the `print` comes before the test. The
second starts at `0` but increments first, so it prints `1` through `6` — skipping `3`.

---

## Nested loops

A loop inside a loop. The inner loop runs completely for **each** iteration of the outer one.

```python
adj = ["red", "big", "tasty"]
fruits = ["apple", "banana", "cherry"]

for x in adj:
    for y in fruits:
        print(x, y)
```

```text title="Output"
red apple
red banana
red cherry
big apple
big banana
big cherry
tasty apple
tasty banana
tasty cherry
```

Three outer × three inner = nine lines. Nesting multiplies the work, so two nested loops
over 1,000 items each is a million iterations.

:::note

`break` only exits the **innermost** loop it sits in. To leave both, you need a flag, or to
move the inner loop into a function and `return`.

:::

### Pattern printing

Nested loops with a range that depends on the outer variable:

```python
for row in range(1, 6):
    print("* " * row)
```

```text title="Output"
* 
* * 
* * * 
* * * * 
* * * * * 
```

---

## Worked examples

### Even numbers, two ways

Either filter with `if`, or step by 2 and skip the test entirely:

```python
for i in range(1, 21):
    if i % 2 == 0:
        print(i, end=" ")
print()

for i in range(2, 21, 2):
    print(i, end=" ")
print()
```

```text title="Output"
2 4 6 8 10 12 14 16 18 20 
2 4 6 8 10 12 14 16 18 20 
```

Same result; the second does half the iterations. See
[Input and Output](../01-basics/06-input-output.md) for what `end=" "` is doing.

### Multiplication table

```python
n = 5
for i in range(1, 11):
    print(f"{n} x {i} = {n * i}")
```

```text title="Output"
5 x 1 = 5
5 x 2 = 10
5 x 3 = 15
5 x 4 = 20
5 x 5 = 25
5 x 6 = 30
5 x 7 = 35
5 x 8 = 40
5 x 9 = 45
5 x 10 = 50
```

### Factorial

An accumulator starting at `1`, multiplied each pass:

```python
n = 5
factorial = 1
for i in range(1, n + 1):
    factorial *= i
print(f"{n}! = {factorial}")
```

```text title="Output"
5! = 120
```

`range(1, n + 1)` — the `+ 1` is what includes `n` itself.

### Sum of digits

`% 10` peels off the last digit, `// 10` removes it. A `while` loop, because you don't know
how many digits there are:

```python
number = 1234
total = 0
temp = number
while temp > 0:
    total += temp % 10
    temp //= 10
print(f"digits of {number} sum to {total}")
```

```text title="Output"
digits of 1234 sum to 10
```

Note `temp` — the original `number` is kept intact for the message.

### Stop at 6, skip 5

```python
for i in range(1, 11):
    if i == 6:
        break
    print(i, end=" ")
print()

for i in range(1, 11):
    if i == 5:
        continue
    print(i, end=" ")
print()
```

```text title="Output"
1 2 3 4 5 
1 2 3 4 6 7 8 9 10 
```

---

## Common Mistakes

| # | Mistake | Wrong | Right |
|---|---|---|---|
| 1 | Forgetting the update in a `while` | loop never ends | `i += 1` inside the body |
| 2 | Off-by-one in `range()` | `range(1, 5)` for 1–5 | `range(1, 6)` |
| 3 | Expecting `range(5, 1)` to count down | gives `[]`, loop never runs | `range(5, 0, -1)` |
| 4 | `break` where `continue` was meant | exits the whole loop | `continue` skips one pass |
| 5 | Expecting `else` to run after a `break` | it doesn't | that's the whole point of loop `else` |
| 6 | `break` inside nested loops | only exits the inner one | use a flag, or a function with `return` |
| 7 | `for i in range(len(items))` | verbose | `for item in items:` or `enumerate()` |
| 8 | Modifying a list while looping over it | items get skipped | loop over a copy: `for x in items[:]` |

---

## Summary

| Statement | Effect |
|---|---|
| `for x in seq:` | run the block once per item |
| `range(a, b, c)` | numbers from `a` to `b-1`, stepping `c` |
| `while cond:` | repeat while the condition stays true |
| `break` | exit the loop immediately |
| `continue` | skip the rest of this pass, carry on |
| `else` on a loop | runs only if the loop ended **without** `break` |
| `enumerate(seq)` | index and item together |
| `zip(a, b)` | walk two sequences in step |

**Key takeaways**

- `for` when you know what to iterate; `while` when you only know the stop condition
- `range()` excludes its `stop` — `range(1, 6)` gives 1 to 5
- Every `while` needs something in the body that moves the condition toward false
- `break` exits the loop, `continue` skips one iteration
- A loop's `else` runs only if no `break` fired — perfect for "searched and found nothing"
- In a `while`, whether the update sits before or after the test changes the output
- `break` escapes only the innermost loop
- Prefer `for item in items:` and `enumerate()` over `range(len(items))`

**See also:** [Conditional Statements](./01-conditional-statements.md) for the conditions
loops test · [Data Types](../01-basics/03-data-types.md) for the sequences you iterate

---

## Run It Yourself

```python title="loops.py"
# 1. for + range
print("1 to 5:      ", end="")
for i in range(1, 6):
    print(i, end=" ")
print()

# 2. while, same result
print("while 1 to 5:", end="")
i = 1
while i <= 5:
    print(i, end=" ")
    i += 1
print()

# 3. break and continue
print("break at 4:  ", end="")
for i in range(1, 8):
    if i == 4:
        break
    print(i, end=" ")
print()

print("skip 4:      ", end="")
for i in range(1, 8):
    if i == 4:
        continue
    print(i, end=" ")
print()

# 4. loop else — searching
target = 7
for n in [2, 5, 7, 9]:
    if n == target:
        print(f"found {target}")
        break
else:
    print(f"{target} not in the list")

# 5. nested loop pattern
for row in range(1, 5):
    print("* " * row)
```

```text title="Output"
1 to 5:      1 2 3 4 5 
while 1 to 5:1 2 3 4 5 
break at 4:  1 2 3 
skip 4:      1 2 3 5 6 7 
found 7
* 
* * 
* * * 
* * * * 
```

---

## Practice Questions

*From the Unit 1 question bank. Tags and marks are explained on the
[Python index](../index.md#practice-questions).*

### Unit 1 § I — Looping Statements

**I1. [OUT]** `[4]`

```python
# Block A
for i in range(1, 6):
    if i == 3:
        break
    print(i)
else:
    print("Completed")
print("Done")

# Block B
for i in range(1, 6):
    if i == 3:
        continue
    print(i)
else:
    print("Completed")
print("Done")
```

**I2. [OUT]** The three-argument form of `range()`. `[4]`

```python
print(list(range(5)))
print(list(range(1, 6)))
print(list(range(2, 10, 3)))
print(list(range(10, 0, -2)))
print(list(range(5, 1)))
```

**I3. [PROG]** Print the numbers **1 to 20** using a `while` loop. `[3]`

**I4. [PROG]** Print all **even** numbers between 1 and 20 using a `for` loop. Do it **twice** —
once with `if`, once using `range()`'s step. `[4]`

**I5. [PROG]** Print 1 to 10, but **stop** the loop when the number becomes 6. `[2]`

**I6. [PROG]** Print 1 to 10, but **skip** the number 5. `[2]`

**I7. [OUT]** `[4]`

```python
for x in ["red", "big"]:
    for y in ["apple", "banana"]:
        print(x, y)
```

**I8. [PROG]** Accept a number `n` and print its **multiplication table** from 1 to 10, formatted
as `5 x 3 = 15`. `[3]`

**I9. [PROG]** Accept a number and compute its **factorial** using a loop. `[3]`

**I10. [PROG]** Accept a number and compute the **sum of its digits**. *(e.g. 1234 → 10)* `[4]`

**I11. [PROG]** Print this pattern using nested loops: `[4]`

```text
*
* *
* * *
* * * *
* * * * *
```

**I12. [THEORY]** This program never stops. Find the bug and fix it. `[2]`

```python
i = 1
while i <= 5:
    print(i)
```

**I13. [OUT]** Trace carefully — note *where* the increment sits in each loop. `[5]`

```python
i = 1
while i < 6:
    print(i)
    if i == 3:
        break
    i += 1

print("---")

i = 0
while i < 6:
    i += 1
    if i == 3:
        continue
    print(i)
```

**I14. [PROG]** Accept a number and print whether it is **prime**, using a loop with `break` and
the loop's `else`. `[4]`

### Unit 1 § L — Mini Challenges

**L3. [PROG]** Build a small **menu-driven** program using a `while True` loop that offers: `[8]`

```text
1. Add a student
2. Show all students
3. Show the topper
4. Exit
```

Store the students as a list of tuples `(name, marks)`. Keep looping until the user chooses 4.

### Viva

1. When does a loop's `else` block *not* run?
2. What is the difference between `break` and `continue`?
