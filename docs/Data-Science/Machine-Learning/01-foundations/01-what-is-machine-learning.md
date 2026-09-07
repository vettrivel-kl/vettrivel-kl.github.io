---
sidebar_position: 1
title: What is Machine Learning?
description: Learning without being explicitly programmed — why the rule-based approach collapsed, what replaced it, why the idea only became practical recently, and how AI, ML and DL nest.
tags: [machine-learning, foundations]
toc_max_heading_level: 3
---

# What is Machine Learning?

> **Topic —** Every other page in this section is a *technique*. This page is the **argument** for
> why those techniques exist at all: there is a class of problem that ordinary programming
> genuinely cannot solve, and this is what it looks like.

## The one-sentence definition

> **Machine learning is the field of study that gives computers the ability to learn without being
> explicitly programmed.**
> — Arthur Samuel, 1959

The load-bearing phrase is **"without being explicitly programmed"**. Everything on this page is an
unpacking of those five words.

Tom Mitchell (1997) sharpened it into a definition you can actually test a system against:

> A computer program **learns** from experience `E` with respect to task `T` and performance
> measure `P`, if its performance at `T`, as measured by `P`, improves with `E`.

Three things must be nameable, or it isn't learning:

| Symbol | Name | In the cats-and-dogs task below |
|---|---|---|
| `T` | **Task** | Label an animal photo as cat, dog or bird |
| `E` | **Experience** | 10 already-labelled animals |
| `P` | **Performance measure** | Fraction of *new* animals labelled correctly |

:::tip Use this as a checklist

If you can't name `T`, `E` and `P` for something, it is not a machine learning problem yet — and
that is usually the real reason a project stalls. `P` is the one people skip, and it is the one
that decides whether you ever find out you succeeded.

:::

---

## What "explicitly programmed" means

In **traditional programming**, a developer writes code giving specific instructions that tell the
computer exactly what to do in every situation.

Take a calculator. You explicitly code how to handle addition, subtraction, multiplication and
division:

```python
def calculate(a, b, op):
    if op == "+":
        return a + b
    if op == "-":
        return a - b
    if op == "*":
        return a * b
    if op == "/":
        return a / b
```

This is a *complete* and *correct* program, and it will be correct forever. Note **why** that
works:

- The rules of arithmetic were known **before** the program was written
- There are **four** cases, and they are all listed
- A human could state each rule precisely in one line

Traditional programming is the right tool whenever those three conditions hold. Most software ever
written satisfies them. Machine learning is for the problems that don't.

---

## The task that breaks explicit programming

Here is the scenario that makes the problem concrete.

You have a dataset of images of animals — say **cats and dogs** — and you want to build an
application that can recognise and tell them apart.

The first thing you must do is interpret each image as a **set of features**:

- Does the image show the animal's eyes? If so, what size?
- Does it have ears?
- What about a tail?
- How many legs?
- Does it have wings?

So an image becomes a row of numbers. That step is unavoidable in either approach — it's the
subject of the **data preprocessing** notes later on. The question is what you do *next*.

### The rule-based attempt

Traditionally, we had to write down rules or methods to make the application "intelligent" enough
to detect the animals:

```python
def what_animal(has_wings, num_legs, weight_kg):
    if has_wings:
        return "bird"
    if num_legs == 4 and weight_kg < 10:
        return "cat"
    if num_legs == 4 and weight_kg >= 10:
        return "dog"
    return "unknown"
```

**It was a failure.** Not "inefficient" — it did not work. There are three separate reasons, and
they compound.

---

## Why the rule-based attempt failed

### 1. It needed too many rules

The features above give six questions. Suppose each has just **three** possible answers
(no / small / large). The number of distinct feature combinations you'd have to cover is:

```
3 × 3 × 3 × 3 × 3 × 3  =  3⁶  =  729
```

729 rules — for six coarse features and *three* animals. Add one more feature and it becomes
`3⁷ = 2187`. Add fur texture, ear shape, and tail length and you are past 19,000.

This is the **combinatorial explosion**, and it is not an engineering problem you can outwork. The
rules grow *exponentially* in the number of features while your ability to write them grows, at
best, linearly.

### 2. It was highly dependent on the current dataset

Look again at `weight_kg < 10` in the rule above. Where did `10` come from? **A human guessed
it.** It was chosen by looking at the cats and dogs that happened to be in the dataset at the time.

So the moment reality supplies:

- a **Chihuahua** at 2.5 kg — a dog, under the line → classified `cat`
- a **Maine Coon** at 11 kg — a cat, over the line → classified `dog`

...the rule is wrong, and no amount of care in writing it would have helped. The threshold encodes
an accident of the sample, not a fact about animals.

### 3. It did not generalise to new samples

Points 1 and 2 combine into the fatal one. A rule set is only ever correct on the cases its author
imagined. The world keeps producing cases nobody imagined. Since the program cannot revise itself,
**every new animal is a new bug report** — and each fix risks breaking an earlier rule.

:::danger The real cost isn't accuracy, it's maintenance

A rule-based system's error rate doesn't just start high — it *grows* over time as the world drifts
away from the dataset the rules were tuned on. The only repair is a human rewriting rules forever.

:::

---

## How machine learning does it instead

Machine learning lets us **build a model** that looks at all the feature sets and their
corresponding animal types, and **learns the pattern** of each animal.

Nothing is written down by hand. The model is produced by a **machine learning algorithm**, and it
detects the animal **without being explicitly programmed to do so**.

The shift is in what the human supplies:

| | Traditional programming | Machine learning |
|---|---|---|
| Human writes | **the rules** | **the examples** |
| Computer receives | rules + data | data + answers |
| Computer produces | answers | **the rules** (the model) |
| To handle new cases | rewrite the rules | add data, retrain |
| Thresholds like `10 kg` | guessed by a human | derived from the data |

Read the third row twice. It is the whole inversion: in machine learning, **the rules are the
output, not the input.**

### The four-year-old analogy

Machine learning follows the same process a **four-year-old child** uses to learn, understand and
differentiate animals. Nobody hands a child 729 rules. The child sees animals, is told what they
are, gets some wrong, and adjusts.

So machine learning algorithms, inspired by the human learning process, **iteratively learn from
data** and allow machines to find hidden insights.

"Iteratively" matters — it is the mechanism behind **gradient descent**, covered later.
Learning is not one calculation; it is a loop of *guess → measure the error → adjust*.

---

## Seeing the difference in code

Same task, same features, two approaches. The full script is in
[Run It Yourself](#run-it-yourself); this is the part that matters.

The hand-written rules use **weight**, because that is what looks obvious to a human:

```python
def rule_based(row):
    has_wings, legs, weight, snout, claws = row
    if has_wings:
        return "bird"
    if weight < 10:          # the human's guess: "small means cat"
        return "cat"
    return "dog"
```

The learned model is given no rules at all — only ten labelled animals:

```python
tree = DecisionTreeClassifier(random_state=0).fit(X_train, y_train)
```

Now ask what the model taught itself:

```text title="Output"
|--- retractable_claws <= 0.50
|   |--- has_wings <= 0.50
|   |   |--- class: dog
|   |--- has_wings >  0.50
|   |   |--- class: bird
|--- retractable_claws >  0.50
|   |--- class: cat
```

**It never used weight.** Given the same five features, the algorithm found that
`retractable_claws` separates cats from dogs perfectly, and discarded the feature the human built
their entire rule set around.

On four animals neither approach had seen:

```text title="Output"
  animal         truth   rules    tree
  cat   6.0 kg   cat     cat      cat
  dog   8.0 kg   dog     cat  X   dog
  cat  13.0 kg   cat     dog  X   cat
  bird  1.2 kg   bird    bird     bird

  hand-written rules  50%
  learned tree        100%
```

The two failures are exactly the Chihuahua and Maine Coon cases predicted above — the mid-size dog
under the 10 kg line, and the heavy cat over it.

:::note What this demo does and doesn't prove

It **does** show that an algorithm can identify a better feature than a human's first instinct, and
that hand-tuned thresholds fail on new data.

It **does not** show that ML always wins. The training set was deliberately built to contain a
heavy cat *and* a light dog, so weight genuinely couldn't separate them. Had it contained only
small cats and large dogs, the tree would have happily split on weight and failed the same way the
rules did — an early glimpse of why **representative data and honest validation** matter more than
the choice of algorithm.

:::

---

## Why now, if the idea is from the 1960s?

The core ideas are old — Samuel's self-improving checkers program was **1959**, Rosenblatt's
perceptron **1958**. So why did machine learning only become popular recently?

Three things changed, and all three were necessary:

| | What changed | Why it mattered |
|---|---|---|
| **1** | The rise of **big data** and the **internet** | Learning needs `E`. The internet made labelled examples abundant for the first time — text, images, clicks, transactions |
| **2** | **Improved computation power** | Training is an iterative loop over the whole dataset. GPUs made runs that would have taken months finish in hours |
| **3** | **New algorithms and techniques** to better handle and learn from data | Better optimisation, regularisation and architectures — the methods that let large models train *stably* |

The useful takeaway: the bottleneck was never the *idea*. It was `E` and the compute to consume it.
That is also why "get more/better data" so often beats "try a fancier algorithm" in practice.

---

## AI vs ML vs DL

These three get used interchangeably in conversation and they are **not** interchangeable. They
nest, strictly:

```
┌──────────────────────────────────────────────┐
│ Artificial Intelligence                      │
│  any system acting without human intervention│
│                                              │
│   ┌────────────────────────────────────────┐ │
│   │ Machine Learning                       │ │
│   │  learns from data, statistical tools   │ │
│   │                                        │ │
│   │   ┌──────────────────────────────────┐ │ │
│   │   │ Deep Learning                    │ │ │
│   │   │  multi-layer neural networks     │ │ │
│   │   └──────────────────────────────────┘ │ │
│   └────────────────────────────────────────┘ │
└──────────────────────────────────────────────┘
```

| | Artificial Intelligence | Machine Learning | Deep Learning |
|---|---|---|---|
| **Scope** | The whole field | **Subset of AI** | **Subset of ML** |
| **Defining idea** | A system does its own task **without human intervention** | Learns from data using **statistical tools** | **Mimics the human brain** via multi-layered neural networks |
| **Typical use** | End-to-end autonomous behaviour | Visualisation, prediction, forecasting | Perception — images, audio, language |
| **Needs hand-designed features?** | — | Usually yes | No, it learns features itself |
| **Data needed** | — | Works on modest datasets | Large datasets |
| **Example** | Self-driving car; Netflix recommending a title | Predicting loan default from applicant data | Recognising a face in a photo |
| **Covered in these notes** | As context | **The whole focus** | No |

Note that **AI does not require learning at all**. A rule-based chess engine is AI. That is why the
`what_animal` function above was a legitimate attempt at AI — a bad one, but AI.

### Why the job titles don't map to different fields

Whether you are an **ML developer**, a **DL developer**, a **CV** (computer vision) developer or an
**AI engineer** — at the end of the day, you are building an **AI application**. The labels
describe which layer of the diagram you spend your time in, not different professions.

Worked example of the layers cooperating: **Netflix → movie genre → recommendation.**
Deep learning may extract features from artwork and trailers; machine learning predicts what you'll
watch from your history; the AI application is the fact that a page of recommendations appears with
nobody at Netflix choosing it for you.

---

## Common Mistakes

| # | Mistake | Wrong | Right |
|---|---|---|---|
| 1 | "ML means the computer writes its own code" | It doesn't emit a program | It fits **parameters** of a model you chose |
| 2 | Treating AI, ML and DL as synonyms | Interchangeable | Strictly nested: DL ⊂ ML ⊂ AI |
| 3 | Thinking all AI learns | Rule-based chess isn't AI | AI needs no learning; ML does |
| 4 | Skipping `P` in Mitchell's definition | "The model works" | Name the metric, or you can't know |
| 5 | Hand-picking thresholds "from experience" | `weight < 10` | Let the algorithm derive the split |
| 6 | Assuming ML beats rules automatically | It won | Only with **representative** data |
| 7 | Using ML where rules suffice | ML calculator | Four known cases → just write the `if` |
| 8 | "More features always helps" | Add everything | Features multiply the space — `3⁶` → `3⁷` |
| 9 | Reading the child analogy literally | Models learn like brains | It's an analogy for *iterative* learning |

---

## Summary

| Question | Answer |
|---|---|
| Definition | Learning **without being explicitly programmed** (Samuel, 1959) |
| Testable version | Performance at `T`, measured by `P`, improves with experience `E` (Mitchell, 1997) |
| What breaks rules | Combinatorial explosion, dataset-tuned thresholds, no generalisation |
| The inversion | Rules are the **output** of ML, not the input |
| Why now | Big data + compute + better algorithms |
| The nesting | DL ⊂ ML ⊂ AI |

**Key takeaways**

- Traditional programming works when the rules are **known in advance**, **few**, and **statable**;
  ML is for when they aren't
- Interpreting an image as a **set of features** is required either way — it is not the ML part
- `3⁶ = 729` rules for six coarse features and three animals; the growth is **exponential**
- Every hand-written threshold encodes an accident of the current dataset
- The rule set failed on the Chihuahua and the Maine Coon — the *predictable* failures
- Given the same features, the tree chose `retractable_claws` and **ignored weight** entirely
- Rules scored 80% on their own data and **50%** on new data; the tree scored 100% and **100%**
- ML wins here because the training data contained a heavy cat *and* a light dog — with an
  unrepresentative sample it would have failed identically
- Learning is **iterative** — guess, measure error, adjust
- AI needs no learning; ML is the statistical subset; DL is the neural-network subset of that

**Next in this section:** [Applications and Major Techniques](./02-applications-and-techniques.md)
— the eight things ML actually does, and where each gets used ·
[Types of Learning](./03-types-of-learning.md) — how `E` differs by paradigm ·
[The Toolkit and the Pipeline](./05-toolkit-and-pipeline.md) — the code that implements it

---

## Run It Yourself

```python title="rules_vs_learning.py"
"""Explicit rules vs a learned model — the same task, two approaches."""

import numpy as np
from sklearn.tree import DecisionTreeClassifier, export_text

FEATURES = ["has_wings", "num_legs", "weight_kg", "snout_cm", "retractable_claws"]

# Deliberately representative: a big cat and a tiny dog are both in here,
# so body weight alone cannot separate cat from dog.
X_train = np.array([
    [0, 4,  3.5, 2.8, 1],   # cat   - small
    [0, 4,  4.0, 3.0, 1],   # cat
    [0, 4,  5.2, 3.2, 1],   # cat
    [0, 4, 11.0, 3.4, 1],   # cat   - maine coon, heavy
    [0, 4,  2.5, 7.5, 0],   # dog   - chihuahua, light
    [0, 4, 18.0, 8.0, 0],   # dog
    [0, 4, 25.0, 9.0, 0],   # dog
    [0, 4, 32.0, 11.5, 0],  # dog
    [1, 2,  0.4, 2.0, 0],   # bird
    [1, 2,  0.9, 2.4, 0],   # bird
])
y_train = np.array(["cat", "cat", "cat", "cat",
                    "dog", "dog", "dog", "dog", "bird", "bird"])


def rule_based(row):
    """Hand-written rules. A human chose every feature and threshold below."""
    has_wings, legs, weight, snout, claws = row
    if has_wings:
        return "bird"
    if weight < 10:          # the human's guess: "small means cat"
        return "cat"
    return "dog"


tree = DecisionTreeClassifier(random_state=0).fit(X_train, y_train)
predict_tree = lambda r: tree.predict([r])[0]


def accuracy(predict, X, y):
    return float(np.mean([predict(r) == t for r, t in zip(X, y)]))


print("STEP 1 — both approaches on the data they were built from")
print(f"  hand-written rules  {accuracy(rule_based, X_train, y_train):.0%}")
print(f"  learned tree        {accuracy(predict_tree, X_train, y_train):.0%}")

print("\nSTEP 2 — what the tree taught itself")
print(export_text(tree, feature_names=FEATURES).rstrip())

print("\nSTEP 3 — four animals neither approach has ever seen")
X_new = np.array([
    [0, 4,  6.0, 3.1, 1],   # cat
    [0, 4,  8.0, 8.5, 0],   # dog  - mid-size, under the human's 10 kg line
    [0, 4, 13.0, 3.5, 1],   # cat  - over the human's 10 kg line
    [1, 2,  1.2, 2.2, 0],   # bird
])
y_new = np.array(["cat", "dog", "cat", "bird"])
labels = ["cat   6.0 kg", "dog   8.0 kg", "cat  13.0 kg", "bird  1.2 kg"]

print(f"  {'animal':<15}{'truth':<8}{'rules':<9}{'tree':<8}")
for label, row, truth in zip(labels, X_new, y_new):
    r, t = rule_based(row), predict_tree(row)
    print(f"  {label:<15}{truth:<8}"
          f"{r + ('' if r == truth else '  X'):<9}"
          f"{t + ('' if t == truth else '  X'):<8}")

print(f"\n  hand-written rules  {accuracy(rule_based, X_new, y_new):.0%}")
print(f"  learned tree        {accuracy(predict_tree, X_new, y_new):.0%}")
```

```text title="Output"
STEP 1 — both approaches on the data they were built from
  hand-written rules  80%
  learned tree        100%

STEP 2 — what the tree taught itself
|--- retractable_claws <= 0.50
|   |--- has_wings <= 0.50
|   |   |--- class: dog
|   |--- has_wings >  0.50
|   |   |--- class: bird
|--- retractable_claws >  0.50
|   |--- class: cat

STEP 3 — four animals neither approach has ever seen
  animal         truth   rules    tree
  cat   6.0 kg   cat     cat      cat
  dog   8.0 kg   dog     cat  X   dog
  cat  13.0 kg   cat     dog  X   cat
  bird  1.2 kg   bird    bird     bird

  hand-written rules  50%
  learned tree        100%
```

**Things worth trying:**

1. Delete `retractable_claws` from the features and refit. The tree is forced back onto weight —
   watch it fail the same way the rules did.
2. Remove the Maine Coon and Chihuahua rows from training, then refit and rerun Step 3. This is the
   unrepresentative-sample failure, and it is the single most common real-world ML bug.
3. Print `tree.feature_importances_` alongside `FEATURES` to see the discarded features score `0.0`.

---

## Practice Questions

*Work each one out on paper first, then check it by running the code — everything you need is on
this page. **No answers are included, deliberately.***

| Tag | Means |
|---|---|
| **[THEORY]** | *Explain in words.* Definitions, reasons, comparisons. |
| **[PROG]** | *Write the program.* Complete, runnable code. |
| **[OUT]** | *Read the output.* Interpret given results exactly as printed. |
| **[ANALYZE]** | *Argue a position.* Weigh a claim, diagnose a failure, justify a trade-off. |

### Definitions

**A1. [THEORY]** State the definition of machine learning, and explain what the phrase *"without
being explicitly programmed"* rules out.

**A2. [THEORY]** Mitchell's definition names `T`, `E` and `P`. Identify all three for the task
*"predict whether a bank customer will default on a loan"*.

**A3. [THEORY]** Give two examples of software that should **not** be built with machine learning,
and justify each.

**A4. [THEORY]** Why is a rule-based chess engine still considered AI, despite containing no
learning?

### Why rules fail

**B1. [THEORY]** A feature set has 6 features, each taking 3 possible values. How many distinct
combinations exist? Show the calculation, then state what happens when a 7th feature is added.

**B2. [ANALYZE]** The rule `if weight_kg < 10: return "cat"` classified the training data
correctly. Explain precisely why it is nonetheless a defective rule, and name two real animals that
break it.

**B3. [THEORY]** List the three reasons the rule-based approach to animal recognition failed, and
explain which of the three is the direct consequence of the other two.

**B4. [ANALYZE]** "We can fix the rule-based system by hiring more developers to write more rules."
Argue against this using the growth rate of the rule count.

### The inversion

**C1. [THEORY]** Complete the table: for traditional programming and for machine learning, state
what the **human supplies**, what the **computer receives**, and what the **computer
produces**.

**C2. [OUT]** A decision tree trained on the five features `has_wings`, `num_legs`, `weight_kg`,
`snout_cm`, `retractable_claws` produces this structure:

```text
|--- retractable_claws <= 0.50
|   |--- has_wings <= 0.50
|   |   |--- class: dog
|   |--- has_wings >  0.50
|   |   |--- class: bird
|--- retractable_claws >  0.50
|   |--- class: cat
```

- Which features did the model actually use?
- Which feature did the human's hand-written rule depend on?
- What does the discrepancy tell you about hand-picked features?

**C3. [PROG]** Using scikit-learn, fit a `DecisionTreeClassifier` on a small feature matrix `X` and
label vector `y`, then print the learned rules with `export_text`.

**C4. [ANALYZE]** In the worked demo the hand-written rules scored **80%** on training data but
**50%** on unseen data, while the tree scored **100%** on both. Explain what the *gap between the
two columns* measures, and why the rules' gap is the more worrying result.

**C5. [ANALYZE]** The demo's training set deliberately included an 11 kg cat and a 2.5 kg dog.
Explain what would have happened had it contained only small cats and large dogs — and what
principle this illustrates.

### Context and scope

**D1. [THEORY]** Machine learning dates from the late 1950s but only became widely used recently.
Give the three reasons, and explain why **all three** were necessary.

**D2. [THEORY]** Draw the nesting of AI, ML and DL, and give one distinguishing property and one
example for each.

**D3. [THEORY]** Deep learning is described as aiming to *"mimic the human brain"*. What structure
does it use, and how does its treatment of features differ from classical ML?

**D4. [ANALYZE]** A colleague says: *"We have a huge dataset, so we should use deep learning."*
Give two reasons this does not follow.

### Quick self-check

1. Define machine learning in one sentence.
2. What does "explicitly programmed" mean?
3. In Mitchell's definition, what are `T`, `E` and `P`?
4. Why did the rule-based animal classifier fail?
5. In machine learning, are the rules an input or an output?
6. Name the three reasons ML became popular only recently.
7. Is every AI system a machine learning system?
8. Which is a subset of which — AI, ML, DL?
9. Why is it a problem that a human chose the `10 kg` threshold?
10. Does more data always mean a better model?
