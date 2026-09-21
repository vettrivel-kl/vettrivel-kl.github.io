---
sidebar_position: 5
title: The Toolkit and the Pipeline
description: The five Python libraries that do the work, how they stack, scikit-learn's fit/predict/transform contract, and the seven-step pipeline every project follows.
tags: [machine-learning, foundations, scikit-learn, numpy, pandas]
toc_max_heading_level: 3
---

# The Toolkit and the Pipeline

> **Topic —** Four pages of concepts. This one is the code. It covers the five libraries that do the
> actual work, and the **seven-step pipeline** that every project in this section — and every project
> after it — follows in the same order.

Learn the pipeline once and the rest of machine learning becomes "which algorithm goes in step 3".

---

## Why Python

Python is a popular and powerful **general-purpose** programming language that emerged as the
**preferred language among data scientists**.

You *can* write a machine learning algorithm yourself in Python, and it works very well. But there
are a great many modules and libraries already implemented that make the work much easier — so in
practice you almost never do.

That's the honest reason Python won: not the language itself, but the libraries built on top of it.

---

## The five libraries

| Library | What it gives you | You use it for |
|---|---|---|
| **NumPy** | A math library for **n-dimensional arrays**, computing efficiently and effectively | Arrays and matrices — the numbers underneath everything |
| **SciPy** | **Numerical algorithms and tools** for domains like signal processing, optimisation and statistics | The maths algorithms models are built from |
| **Pandas** | Powerful data structures like **DataFrames** for handling structured data (tables) | Loading, cleaning, manipulating and analysing data |
| **Matplotlib** | Creating **interactive, animated visualisations**, 2-D and 3-D plots | Seeing your data and your results |
| **scikit-learn** | **Simple and efficient tools** for classification, regression, clustering and more | Building and evaluating the model |

### How they stack

These aren't five alternatives — they're layers, and each depends on the ones below it:

```
   ┌──────────────────────────────────────────────┐
   │  scikit-learn      models and evaluation     │
   ├───────────────────────┬──────────────────────┤
   │  SciPy                │  Pandas              │
   │  numerical algorithms │  DataFrames, tables  │
   ├───────────────────────┴──────────────────────┤
   │  NumPy                 n-dimensional arrays  │
   └──────────────────────────────────────────────┘
              Matplotlib plots any of it
```

**NumPy sits at the bottom of everything.** A pandas DataFrame holds NumPy arrays; scikit-learn
converts your DataFrame to a NumPy array on the way in and hands NumPy arrays back out. This is why
shape errors so often surface as NumPy messages even when you never imported NumPy yourself.

### NumPy

A math library to work with **n-dimensional arrays**, enabling computation **efficiently and
effectively**.

"Efficiently" is not marketing. NumPy stores numbers in one contiguous block of memory of a single
type and runs operations in compiled code, so an operation over a million values is a single call
rather than a million interpreted loop iterations.

### SciPy

**Numerical algorithms and tools** for various domains — **signal processing**, **optimisation**, and
**statistics**.

You will rarely call SciPy directly early on. It matters because it's what scikit-learn calls: when a
model is fitted, the optimisation routine finding the best parameters usually lives here.

### Pandas

For **data manipulation and analysis**, providing powerful data structures like **DataFrames** for
handling **structured data** — tables.

A DataFrame is the table you actually think in: named columns, mixed types, an index. It's where
steps 1 and 2 of the pipeline happen.

### Matplotlib

Creating **interactive, animated visualisations**, and **2-D and 3-D plots**. The plotting module is
**Pyplot**, conventionally imported as `plt`.

Its role in the pipeline is diagnostic. Summary numbers hide things that a single scatter plot makes
obvious.

### scikit-learn

**Simple and efficient tools for data analysis**, including **classification, regression, clustering**
and more. Specifically:

- **Free** software machine learning library
- Classification, regression **and clustering** algorithms
- Works with **NumPy and SciPy**
- **Great documentation**
- **Easy to implement**

> **Most of the tasks that need to be done in a machine learning pipeline are already implemented in
> scikit-learn.**

That sentence is the reason this page exists. The seven steps below are not seven programming
problems — they are seven library calls.

---

## The contract that makes it work

Every scikit-learn object follows the same tiny interface. Learn these four method names and you can
use a component you've never seen before.

| Method | Meaning | Who has it |
|---|---|---|
| `.fit(X, y)` | **Learn** from data | Everything |
| `.predict(X)` | **Produce answers** for new data | Models |
| `.transform(X)` | **Change** the data | Preprocessors |
| `.score(X, y)` | **Evaluate** against known answers | Models |

Two kinds of object, distinguished by which they have:

- **Transformers** — `fit` + `transform`. A scaler, an encoder, PCA.
- **Estimators** — `fit` + `predict`. A classifier, a regressor.

`fit_transform` is just `fit` then `transform` in one call.

:::danger `fit` on training data only — never on the test set

`fit` is where the object *learns* something: a scaler learns the mean and standard deviation of each
column. If you `fit` a scaler on the whole dataset before splitting, the training data has been scaled
using information from the test set — and your test score is no longer an honest estimate of
performance on unseen data.

The rule, without exception:

```python
scaler.fit(X_train)             # learn from train
X_train = scaler.transform(X_train)
X_test  = scaler.transform(X_test)   # apply to test — never fit on it
```

This mistake is called **data leakage**, it inflates your score, and it is invisible — nothing errors.
The `Pipeline` object in the demo below exists largely to make it impossible.

:::

---

## The seven-step pipeline

The whole workflow, in order:

```
   1. Data preprocessing
            ↓
   2. Train / test split
            ↓
   3. Algorithm setup
            ↓
   4. Model fitting          ── train with the training set
            ↓
   5. Prediction             ── test with the test set
            ↓
   6. Evaluation             ── measure accuracy, show the result
            ↓
   7. Model export           ── save the model
```

| Step | What happens | Typical call |
|---|---|---|
| **1. Preprocess** | Load the data; handle missing values, encode categories, scale features; split into `X` and `y` | `pd.read_csv`, `SimpleImputer`, `StandardScaler` |
| **2. Split** | Hold back part of the data, untouched, for honest testing | `train_test_split` |
| **3. Algorithm setup** | Create the model object and choose its settings. **Nothing is learned yet** | `LogisticRegression()` |
| **4. Fit** | Train on the training set — this is where learning happens | `model.fit(X_train, y_train)` |
| **5. Predict** | Ask for answers on the test set | `model.predict(X_test)` |
| **6. Evaluate** | Compare predictions against the known answers | `accuracy_score`, `classification_report` |
| **7. Export** | Save the fitted model so it can be reused without retraining | `joblib.dump` |

Three things about this sequence are worth stating plainly.

**Step 2 comes before step 4 for a reason.** The test set exists to answer one question: how will
this do on data it has never seen? The moment the model learns anything from the test set, that
question becomes unanswerable.

**Step 3 is the only step that changes when you change algorithm.** Swap `LogisticRegression()` for
`RandomForestClassifier()` and steps 1, 2, 4, 5, 6 and 7 are untouched. That's the payoff of the
shared contract, and the demo below shows it.

**Step 7 must save the preprocessing too.** A model expecting scaled input is useless without the
scaler that produced that scaling. Save them together, or save a `Pipeline` that contains both.

---

## Common Mistakes

| # | Mistake | Wrong | Right |
|---|---|---|---|
| 1 | Fitting the scaler before splitting | `scaler.fit(X)` | `scaler.fit(X_train)` |
| 2 | Calling `fit` on the test set | `scaler.fit(X_test)` | `scaler.transform(X_test)` |
| 3 | Evaluating on training data | `model.score(X_train, y_train)` | Use the test set |
| 4 | Expecting step 3 to train | "I created the model, so it's trained" | Nothing is learned until `.fit` |
| 5 | Saving the model without the preprocessing | `dump(model)` | Save the scaler too, or a `Pipeline` |
| 6 | Passing `y` as 2-D | `y.reshape(-1, 1)` | `y` is 1-D; `X` is 2-D |
| 7 | Reaching for a fancier algorithm first | "let's try boosting" | Fix data and evaluation first |
| 8 | Skipping the plot | The numbers look fine | A scatter plot shows what metrics hide |
| 9 | Writing algorithms by hand to start | Implement it yourself | It's already in scikit-learn |

---

## Summary

| | |
|---|---|
| **NumPy** | n-dimensional arrays; efficient computation |
| **SciPy** | Numerical algorithms — signal processing, optimisation, statistics |
| **Pandas** | DataFrames for structured, tabular data |
| **Matplotlib** | 2-D and 3-D plots; the Pyplot module |
| **scikit-learn** | Classification, regression, clustering; built on NumPy and SciPy |
| **The pipeline** | preprocess → split → algorithm → fit → predict → evaluate → export |

**Key takeaways**

- Python won on **libraries**, not language features — you could write the algorithms, but you don't
  need to
- The libraries are **layers**, with **NumPy underneath everything**
- scikit-learn is **free**, covers classification/regression/clustering, works with NumPy and SciPy,
  and is documented well
- **Most pipeline tasks are already implemented in scikit-learn** — the seven steps are seven calls
- Four method names carry the whole library: **`fit`**, **`predict`**, **`transform`**, **`score`**
- **Transformers** have `fit` + `transform`; **estimators** have `fit` + `predict`
- `fit` learns — so **fit on training data only**; fitting before the split is **data leakage**, and
  it fails silently
- **Nothing is trained until `.fit`** is called; step 3 only creates the object
- **Step 3 is the only step that changes** when you swap algorithms
- Step 7 must save the **preprocessing alongside the model**, or use a `Pipeline`
- Measured: three different algorithms all scored **0.967** on iris, while a deliberately crippled
  one-split tree scored **0.667** — the comparison works, the three genuinely tie

**See also:** [Types of Learning](./03-types-of-learning.md) for what goes in step 3 ·
[Applications and Major Techniques](./02-applications-and-techniques.md) for choosing the technique
before the algorithm · [What is Machine Learning?](./01-what-is-machine-learning.md) for why
`.fit` replaces hand-written rules

---

## Run It Yourself

All seven steps, one at a time, with everything printed — then the same thing as a three-line
`Pipeline`, then the one-line algorithm swap.

```python title="seven_step_pipeline.py"
"""The seven-step pipeline, end to end — then the same thing in three lines."""

import os
import numpy as np
import pandas as pd
import joblib
from sklearn.datasets import load_iris
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

# ---------- STEP 1: preprocess ----------
iris = load_iris(as_frame=True)
df = iris.frame
print("STEP 1  PREPROCESS")
print(f"   loaded {df.shape[0]} rows x {df.shape[1]} columns (pandas DataFrame)")
print(f"   missing values: {int(df.isna().sum().sum())}")
X = df[iris.feature_names]
y = df["target"]
print(f"   X {X.shape} (2-D)   y {y.shape} (1-D)")
print(f"   classes: {dict(zip(map(str, iris.target_names), map(int, np.bincount(y))))}")

# ---------- STEP 2: split ----------
X_tr, X_te, y_tr, y_te = train_test_split(
    X, y, test_size=0.2, random_state=1, stratify=y)
print("\nSTEP 2  TRAIN / TEST SPLIT")
print(f"   train {len(X_tr)} rows   test {len(X_te)} rows   (80/20)")

scaler = StandardScaler().fit(X_tr)          # fit on TRAIN only
X_tr_s, X_te_s = scaler.transform(X_tr), scaler.transform(X_te)
print(f"   scaler fitted on train only; train mean now "
      f"{X_tr_s.mean():.2e}, std {X_tr_s.std():.3f}")

# ---------- STEP 3: set up the algorithm ----------
print("\nSTEP 3  SET UP THE ALGORITHM")
model = LogisticRegression(max_iter=1000)
print(f"   {model.__class__.__name__} created — not trained yet")

# ---------- STEP 4: fit ----------
print("\nSTEP 4  TRAIN THE MODEL")
model.fit(X_tr_s, y_tr)
print(f"   fitted; learned {model.coef_.size} coefficients + {model.intercept_.size} intercepts")

# ---------- STEP 5: predict ----------
print("\nSTEP 5  PREDICT ON THE TEST SET")
y_pred = model.predict(X_te_s)
print(f"   first 10 predicted {[int(v) for v in y_pred[:10]]}")
print(f"   first 10 actual    {[int(v) for v in y_te[:10]]}")

# ---------- STEP 6: evaluate ----------
print("\nSTEP 6  EVALUATE")
print(f"   test accuracy  {accuracy_score(y_te, y_pred):.3f}")
print("   " + classification_report(y_te, y_pred,
      target_names=iris.target_names, digits=2).replace("\n", "\n   ").rstrip())

# ---------- STEP 7: export ----------
print("\nSTEP 7  SAVE THE MODEL")
path = "iris_model.joblib"
joblib.dump({"scaler": scaler, "model": model}, path)
print(f"   written to {path}  ({os.path.getsize(path)} bytes)")
loaded = joblib.load(path)
reloaded_pred = loaded["model"].predict(loaded["scaler"].transform(X_te))
print(f"   reloaded and re-predicted; identical to before: "
      f"{np.array_equal(y_pred, reloaded_pred)}")

# ---------- the same seven steps as one object ----------
print("\n" + "=" * 60)
print("THE SAME THING AS A Pipeline — preprocessing and model as one unit")
pipe = Pipeline([("scale", StandardScaler()),
                 ("clf", LogisticRegression(max_iter=1000))])
pipe.fit(X_tr, y_tr)
print(f"   accuracy {accuracy_score(y_te, pipe.predict(X_te)):.3f}"
      f"   — same result, and the scaler can no longer leak")

# ---------- swapping the algorithm is one line ----------
print("\n" + "=" * 60)
print("SWAPPING THE ALGORITHM — step 3 changes, nothing else does")
print(f"   {'algorithm':<24}{'accuracy':>10}")
for algo in [LogisticRegression(max_iter=1000),
             KNeighborsClassifier(n_neighbors=5),
             RandomForestClassifier(random_state=0),
             DecisionTreeClassifier(max_depth=1, random_state=0)]:
    p = Pipeline([("scale", StandardScaler()), ("clf", algo)]).fit(X_tr, y_tr)
    print(f"   {algo.__class__.__name__:<24}{accuracy_score(y_te, p.predict(X_te)):>10.3f}")
```

```text title="Output"
STEP 1  PREPROCESS
   loaded 150 rows x 5 columns (pandas DataFrame)
   missing values: 0
   X (150, 4) (2-D)   y (150,) (1-D)
   classes: {'setosa': 50, 'versicolor': 50, 'virginica': 50}

STEP 2  TRAIN / TEST SPLIT
   train 120 rows   test 30 rows   (80/20)
   scaler fitted on train only; train mean now 1.39e-17, std 1.000

STEP 3  SET UP THE ALGORITHM
   LogisticRegression created — not trained yet

STEP 4  TRAIN THE MODEL
   fitted; learned 12 coefficients + 3 intercepts

STEP 5  PREDICT ON THE TEST SET
   first 10 predicted [2, 0, 1, 0, 0, 0, 2, 2, 2, 1]
   first 10 actual    [2, 0, 1, 0, 0, 0, 2, 2, 2, 1]

STEP 6  EVALUATE
   test accuracy  0.967
                 precision    recall  f1-score   support

         setosa       1.00      1.00      1.00        10
     versicolor       0.91      1.00      0.95        10
      virginica       1.00      0.90      0.95        10

       accuracy                           0.97        30
      macro avg       0.97      0.97      0.97        30
   weighted avg       0.97      0.97      0.97        30

STEP 7  SAVE THE MODEL
   written to iris_model.joblib  (1785 bytes)
   reloaded and re-predicted; identical to before: True

============================================================
THE SAME THING AS A Pipeline — preprocessing and model as one unit
   accuracy 0.967   — same result, and the scaler can no longer leak

============================================================
SWAPPING THE ALGORITHM — step 3 changes, nothing else does
   algorithm                 accuracy
   LogisticRegression           0.967
   KNeighborsClassifier         0.967
   RandomForestClassifier       0.967
   DecisionTreeClassifier       0.667
```

### What to notice in that output

- **Step 3 printed "not trained yet".** Creating the object learns nothing. All the learning is in
  step 4, and forgetting this is the source of a lot of confusion about why a "model" gives nonsense.
- **The scaled training mean is `1.39e-17`, not exactly zero.** That's floating-point rounding —
  `0.0000000000000000139`. Standardisation worked; the number is a reminder that exact equality on
  floats is a trap.
- **12 coefficients and 3 intercepts** for 4 features and 3 classes. Multiclass logistic regression
  fits one set of coefficients per class: `4 × 3 = 12`.
- **The reloaded model predicted identically** — `True`. That's the point of step 7: no retraining, and
  the saved file is 1,785 bytes. Note it saved the **scaler alongside the model**, because the model
  only accepts scaled input.
- **The `Pipeline` gave exactly the same `0.967`** in three lines, with the scaler now structurally
  unable to see the test set. Same answer, one whole class of bug removed.
- **Three algorithms tied at `0.967`, and the crippled one scored `0.667`.** The tie is real, not a
  broken harness — the depth-1 tree can make a single split, which isolates *setosa* and leaves the
  other two classes mixed, giving almost exactly two thirds. So the comparison discriminates
  perfectly well; it's just that iris is easy, and on easy data **the algorithm barely matters**.
  Effort belongs in the data and the evaluation, which is where the next sections go.

**Things worth trying:**

1. Move `StandardScaler().fit(...)` to before `train_test_split` and fit it on all of `X`. The
   accuracy will shift slightly — that shift is leakage, and on a real dataset it can be large.
2. Delete the `"scaler"` entry from the `joblib.dump` dictionary and try to use the reloaded model on
   raw `X_te`. The predictions degrade, which is why step 7 saves both.
3. Print `pipe.named_steps["clf"].coef_` to confirm the `Pipeline` really did fit the same model.
4. Replace `DecisionTreeClassifier(max_depth=1)` with `max_depth=3` and watch it join the others.

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

### The libraries

**L1. [THEORY]** Name the five libraries and state, in one line each, what they provide.

**L2. [THEORY]** Which library sits at the bottom of the stack, and why do shape errors often mention
it even when you never imported it?

**L3. [THEORY]** Give five properties of scikit-learn.

**L4. [THEORY]** You will rarely call SciPy directly. Why does it still matter?

**L5. [ANALYZE]** Python is a general-purpose language, not a mathematical one. Explain why it became
the preferred language among data scientists anyway.

### The scikit-learn contract

**S1. [THEORY]** Name the four core method names and say what each does.

**S2. [THEORY]** Distinguish a transformer from an estimator by which methods each has. Give an
example of both.

**S3. [THEORY]** What does `fit_transform` do that `transform` alone does not?

**S4. [ANALYZE]** Explain precisely what a `StandardScaler` learns during `fit`, and why fitting it on
the whole dataset before splitting is an error. Would anything raise an exception?

**S5. [ANALYZE]** Name the one benefit of `Pipeline` that matters most, and explain the mechanism.

### The seven steps

**P1. [THEORY]** List the seven steps of the pipeline in order.

**P2. [THEORY]** Which step performs the learning? What has been learned after step 3?

**P3. [THEORY]** Which single step changes when you switch from logistic regression to a random
forest? What does this tell you about the design of the library?

**P4. [ANALYZE]** Why must step 2 come before step 4? State what becomes impossible if it doesn't.

**P5. [ANALYZE]** A colleague saves only the fitted model in step 7, not the scaler. Describe what
happens when the model is loaded and used, and why nothing errors.

### Reading the output

**O1. [OUT]** Step 4 reported `learned 12 coefficients + 3 intercepts`. The data has 4 features and 3
classes. Explain both numbers.

**O2. [OUT]** After scaling, the training mean printed as `1.39e-17` rather than `0`. Explain, and say
what this implies about testing floats for equality.

**O3. [OUT]** Step 7 printed `identical to before: True`. What exactly was compared, and why does it
matter?

**O4. [OUT]** The explicit seven steps and the three-line `Pipeline` both produced `0.967`. What has
been gained by using the `Pipeline`, given the accuracy is unchanged?

**O5. [ANALYZE]** Three algorithms scored `0.967` and a depth-1 decision tree scored `0.667`:

```text
   LogisticRegression           0.967
   KNeighborsClassifier         0.967
   RandomForestClassifier       0.967
   DecisionTreeClassifier       0.667
```

- Why do the first three tie?
- Explain the `0.667` from the structure of a depth-1 tree on three balanced classes.
- What does the presence of the fourth row prove about the first three?
- What does the whole table suggest about where to spend effort?

### Applying it

**A1. [PROG]** Write the seven steps for `load_wine` instead of `load_iris`, printing test accuracy.

**A2. [PROG]** Build a `Pipeline` of `StandardScaler` and `KNeighborsClassifier`, fit it, and print
both the training and test accuracy. Explain any gap.

**A3. [PROG]** Save a fitted `Pipeline` with `joblib.dump`, reload it in a fresh variable, and assert
the predictions are identical.

**A4. [PROG]** Deliberately introduce leakage: fit the scaler on all of `X` before splitting, and
compare the resulting test accuracy with the correct version. Report both.

**A5. [ANALYZE]** You are handed a dataset and asked for a model by tomorrow. Write the seven steps as
a checklist with the specific decision you must make at each one.

### Quick self-check

1. Name the five libraries and one use for each.
2. Which library is underneath all the others?
3. What is a DataFrame, and which library provides it?
4. Which module of Matplotlib do you plot with?
5. Name the four scikit-learn method names.
6. What is the difference between a transformer and an estimator?
7. On which data may you call `fit`?
8. What is data leakage, and does it raise an error?
9. List the seven pipeline steps in order.
10. Is anything trained after step 3?
11. Which step changes when you swap the algorithm?
12. What must be saved in step 7 besides the model?
