---
sidebar_position: 3
title: Types of Learning
description: Features and the numeric/categorical divide, the positive class, and the three learning paradigms — supervised, unsupervised and semi-supervised — separated by what your data actually contains.
tags: [machine-learning, foundations, supervised, unsupervised]
toc_max_heading_level: 3
---

# Types of Learning

> **Topic —** The previous page kept reaching the same fork: *do you have labels?* This page is that
> fork, in full. It is the single most consequential fact about a dataset, because it decides which
> paradigm you're in — and therefore which techniques are even available to you.

Before the paradigms, two pieces of vocabulary that everything else is stated in.

---

## Features and attributes

Take a cancer dataset. The column names across the top — **Clump thickness**, **Uniformity of cell
size**, **Uniformity of cell shape**, **Marginal adhesion**, and so on — are called **attributes**
or **features**. The two words mean the same thing.

The standard layout, which almost every dataset you meet will follow:

```
              ┌──────────── features (X) ────────────┐   ┌─ target (y) ─┐
              Clump      Uniformity   Marginal            Class
              thickness  of cell size adhesion
    sample 1      5            1          1               benign
    sample 2      5            4          5               benign
    sample 3      3            1          1               malignant
       ...
```

| Term | Also called | Meaning |
|---|---|---|
| **Sample** | row, instance, observation, record | One thing you're making a prediction about |
| **Feature** | attribute, column, variable, predictor, input | One measured property of that thing |
| **Target** | label, class, output, response, ground truth | The answer you want to predict |
| **`X`** | feature matrix | All features — 2-D, samples × features |
| **`y`** | target vector | The answers — 1-D, one per sample |

The `X` / `y` naming is a near-universal convention in code, capital `X` because it's a matrix and
lowercase `y` because it's a vector.

:::tip The whole paradigm question in one sentence

**Do you have a `y` column?** If yes → supervised. If no → unsupervised. If you have one for only
some rows → semi-supervised. Everything below is elaboration on that.

:::

---

## Numeric and categorical data

When dealing with machine learning, the two most commonly used kinds of data are **numeric** and
**categorical**.

| | Numeric | Categorical |
|---|---|---|
| Values | Numbers on a scale | Names from a set |
| Example | `5.1`, `23`, `98.6` | `benign`, `red`, `Tamil Nadu` |
| Arithmetic meaningful? | Yes — averages, differences | No |
| Ordering meaningful? | Yes | Only sometimes |

Each splits further, and these four sub-types are what later decisions actually turn on:

| Type | Sub-type | Meaning | Example |
|---|---|---|---|
| Numeric | **Continuous** | Any value in a range | Height `170.4 cm` |
| Numeric | **Discrete** | Countable whole numbers | `3` bedrooms |
| Categorical | **Nominal** | No natural order | `red`, `green`, `blue` |
| Categorical | **Ordinal** | Has an order, but no fixed spacing | `low` &lt; `medium` &lt; `high` |

The nominal/ordinal distinction matters more than it looks. `low`/`medium`/`high` can sensibly
become `0`/`1`/`2` because the order is real. Doing the same to `red`/`green`/`blue` invents a claim
that green sits between red and blue and that blue is "three times" red — which is why encoding
choices are a topic of their own later.

### The rule worth memorising

When dealing with **classification** problems:

> The data used to make predictions — the **features** — can be **either numeric or categorical**.
> But the output, the **class**, is **always categorical**.

This gives a clean two-way grid. Look only at the **target** to name the technique:

| Target is... | Technique | Example |
|---|---|---|
| **Numeric** | **Regression** | Predicting a house price |
| **Categorical** | **Classification** | Predicting benign vs malignant |

Features can be a mixture of both in either case. The target alone decides.

---

## Positive and negative class

In binary classification the two classes are not treated symmetrically. One is designated the
**positive class** and the other the **negative class**.

- **Positive class** — the outcome you are *looking for*, or trying to detect
- **Negative class** — the ordinary, default, "nothing to report" outcome

| Task | Positive class | Negative class |
|---|---|---|
| Disease detection | Has the disease | Healthy |
| Spam filtering | Spam | Legitimate mail |
| Fraud detection | Fraudulent | Legitimate |
| Churn prediction | Will leave | Will stay |

Two things about this that surprise people:

**"Positive" has nothing to do with good.** Having cancer is the positive class. It's positive in
the sense of *a positive test result* — the thing was found.

**It is a choice, not a property of the data.** Nothing stops you designating "healthy" as positive.
The convention is to pick the **rare and consequential** class, because everything downstream —
precision, recall, and the whole confusion matrix — is defined *relative to* the positive class. Flip
the choice and every one of those numbers changes meaning.

:::danger The default is frequently wrong

Tools pick a positive class for you, and their guess follows label order, not your intent. In
scikit-learn's built-in breast cancer data, label `1` is **`benign`** — so out of the box, the
"positive class" is *not having cancer*. Every recall figure you compute is then answering "how well
do we find healthy people?", which is almost never the question.

Always check which class is `1`, and set `pos_label` explicitly when it isn't the one you mean.

:::

---

## The three paradigms

| | **Supervised** | **Unsupervised** | **Semi-supervised** |
|---|---|---|---|
| Labels | Every row | None | **A few** rows |
| You are asking | "Predict this answer" | "What's in here?" | "Predict, cheaply" |
| Feedback available | Yes — right or wrong | No | Partial |
| Techniques | Classification, regression | Clustering, dimensionality reduction, density estimation | Both, combined |
| Easy to evaluate? | **Yes** | **No** | Partly |
| Main cost | Labelling | — | Labelling a little |

---

## Supervised learning

**If you have labels in your data, it's supervised learning.**

The flow is:

```
   labelled data  ──►  model training  ──►  prediction
```

You **teach the model with pre-defined data** — you already know the right answers, and you show
them to the model so it can learn the relationship between features and answer. The name is literal:
there is a supervisor, and the supervisor is your label column.

Using the cancer data: you give the model Clump thickness, Uniformity of cell size and the rest,
*together with* whether each sample turned out benign or malignant. It learns the mapping. Then you
hand it a new sample with no answer attached, and it predicts.

The defining advantage: **you can tell whether it worked.** Compare predictions against known
answers and you get a number. This sounds obvious, and it's the thing unsupervised learning cannot
do.

### The two types of supervised learning

| | **Classification** | **Regression** |
|---|---|---|
| Predicts | A **category** | A **continuous value** |
| Target type | Categorical | Numeric |
| Output example | `malignant` | `52.4` |
| "Close" counts? | No | Yes |
| Example | Which disease is this? | What will this house sell for? |

That's the entire taxonomy of supervised learning. Every supervised algorithm is doing one of these
two things.

---

## Unsupervised learning

**The model works on its own to discover information.**

We do **not** supervise the model — we let it work on its own to discover insights that **may not be
visible to the human eye**. There is no label column, so there is no notion of a right answer to
check against. The model reports structure it finds; whether that structure is *useful* is a judgement
you make.

Three families of task:

### Clustering

**Grouping data points or objects that are somehow similar.**

Clustering uncovers patterns and structures within data by grouping similar items together. It does
three distinct jobs:

| Job | What it gives you |
|---|---|
| **Discovering structure** | What kinds of thing are in here? |
| **Summarisation** | Describing a huge dataset as a handful of representative groups |
| **Anomaly detection** | Points fitting no cluster well are outliers |

**Example:** a bank's desire to **segment its customers** based on certain characteristics. Nobody
defines the segments in advance — the algorithm proposes them, and the bank interprets them
afterwards.

That last job is worth noticing: clustering *doubles as* anomaly detection by highlighting data
points that don't fit well into any cluster.

### Dimensionality reduction

**Reducing the number of features or variables in a dataset while retaining its essential
information.**

Fewer columns, same meaning. Makes models faster, sometimes more accurate, and makes plotting
possible.

### Density estimation

**Figuring out how the data is spread out or distributed**, which lets you identify patterns and
anomalies.

Once you know what "normal" looks like as a distribution, anything improbable under it is by
definition unusual — which is another route to anomaly detection.

---

## Supervised vs unsupervised

| | Supervised | Unsupervised |
|---|---|---|
| Label column | Required | Absent |
| Goal | **Predict** a known quantity | **Discover** unknown structure |
| Supervision | A supervisor exists | None |
| Evaluation | Straightforward — compare to truth | Hard, often subjective |
| Guidance | You state what to learn | The model decides what's interesting |
| Risk | Needs expensive labels | May find structure you don't care about |
| Output | A prediction per new sample | A description of the data |
| Techniques | Classification, regression | Clustering, dimensionality reduction, density estimation |

:::note Why unsupervised learning is genuinely harder

Not harder to *run* — harder to **know if you succeeded**. A classifier is 94% accurate or it isn't.
A clustering has no accuracy; you get groups, and deciding whether they're the right groups is a
judgement call. This is why unsupervised results usually need a domain expert to sign off, and why
"we clustered the data" is a weaker claim than it sounds.

:::

---

## Semi-supervised learning

**Semi-supervised learning falls between supervised and unsupervised learning.**

The training data is a **combination of both labelled and unlabelled data** — it uses a **large
amount of unlabelled data along with a small amount of labelled data** to improve learning accuracy.

### Why it exists

The main goal is to make the most out of the available data when **labelling is expensive or
time-consuming**.

That constraint is the whole motivation, and it is extremely common:

- A radiologist must examine each scan — hours of specialist time per hundred images
- Unlabelled scans, meanwhile, accumulate for free

So it is commonly used where **unlabelled data is abundant**, such as **image classification** or
**text classification** tasks. Scraping a million unlabelled images is easy; paying for a million
labels is not.

**Example algorithm:** Semi-Supervised Support Vector Machines.

### How it actually works

The common mechanism is **self-training**, and it's simple enough to state in four steps:

1. Train a model on the few labelled rows
2. Predict on the unlabelled rows
3. Take the predictions it's **most confident** about and treat them as if they were real labels
4. Retrain on the enlarged set, and repeat

The bet being made is the **cluster assumption**: points close together in feature space probably
share a label. When that holds, unlabelled data reveals the shape of the classes and helps. When it
doesn't, step 3 injects confident mistakes and compounds them.

:::warning Semi-supervised learning is not free accuracy

In the worked demo below, 30 labels plus 396 unlabelled rows scored **0.921** against **0.918** for
the same 30 labels alone — a gain of 0.003, essentially nothing.

That is a real and typical result. Semi-supervised methods help when the unlabelled data reveals
structure the labelled points miss; when the classes are already well separated, there is nothing
left to reveal. In poorly configured cases it is actively **worse** than discarding the unlabelled
data, because self-training amplifies its own early errors.

Treat it as something to try and measure, never as a default.

:::

---

## Choosing between them

```
Do you have a target column?
│
├─ Yes, for every row ──────────────► SUPERVISED
│                                     │
│                                     ├─ target numeric ─────► regression
│                                     └─ target categorical ─► classification
│
├─ Yes, but only for a few rows ────► SEMI-SUPERVISED
│    (and labelling more is expensive; measure against
│     plain supervised on the few you have)
│
└─ No ──────────────────────────────► UNSUPERVISED
                                      │
                                      ├─ want groups ──────► clustering
                                      ├─ too many columns ► dimensionality reduction
                                      └─ want the shape ──► density estimation
```

One practical note: if you have no labels but *need* predictions, the answer is usually not
unsupervised learning — it's **go and get some labels**. Unsupervised learning answers a different
question, not a cheaper version of the same one.

---

## Common Mistakes

| # | Mistake | Wrong | Right |
|---|---|---|---|
| 1 | Thinking "positive" means good | Positive = healthy | Positive = the thing you're detecting |
| 2 | Accepting the default positive class | Whatever label is `1` | Check it; set `pos_label` |
| 3 | Choosing technique by feature type | "features are numeric → regression" | The **target** decides |
| 4 | Expecting a categorical regression output | Class from a regressor | Classification output is always categorical |
| 5 | Encoding nominal data as `0,1,2` | `red=0, green=1, blue=2` | Invents an order; ordinal only |
| 6 | Confusing clustering with classification | Both "group things" | Named groups → classification |
| 7 | Evaluating clustering with accuracy | "our clustering is 85% accurate" | There's no ground truth to compare to |
| 8 | Assuming semi-supervised always helps | More data must be better | Measure it — often it's a wash |
| 9 | Using unsupervised as a labels substitute | "no labels, so we'll cluster" | Different question entirely |
| 10 | Forgetting `X` is 2-D and `y` is 1-D | `y` as a column matrix | Shape errors come from exactly this |

---

## Summary

| Question | Answer |
|---|---|
| Features are also called | Attributes |
| `X` is | The feature matrix, samples × features |
| `y` is | The target vector, one answer per sample |
| Two common data kinds | Numeric and categorical |
| In classification, features may be | Numeric **or** categorical |
| In classification, the output is | **Always** categorical |
| The positive class is | The outcome you're detecting — your choice |
| Supervised means | You have labels |
| Unsupervised means | You don't |
| Semi-supervised means | A few labels, many unlabelled |

**Key takeaways**

- **Attributes** and **features** are the same thing; the target is the column you're predicting
- One question sorts the paradigms: **do you have a `y` column, for all rows, some rows, or none?**
- Numeric splits into continuous/discrete; categorical splits into **nominal/ordinal**, and that
  distinction governs how you may encode it
- In classification, features can be either type but the **class is always categorical**
- Look at the **target** to choose between regression and classification — never the features
- "Positive class" means *detected*, not *good*; cancer is the positive class
- The positive class is a **choice**, and library defaults are often the wrong way round — in
  scikit-learn's breast cancer data, label `1` is `benign`
- Supervised = teach with pre-defined data; **its real advantage is that you can measure success**
- Unsupervised = let the model work alone to find insights not visible to the human eye
- Clustering does three jobs: structure, summarisation, and **anomaly detection**
- Unsupervised learning is harder to *evaluate*, not to run
- Semi-supervised exists because **labelling is expensive**, and it bets on the cluster assumption
- Measured: 0.958 with all labels · 0.918 with 30 · 0.921 semi-supervised · **0.908 with none**

**Next in this section:** [Reinforcement Learning](./04-reinforcement-learning.md) — the paradigm
that has no dataset at all · [The Toolkit and the Pipeline](./05-toolkit-and-pipeline.md)

**See also:** [Applications and Major Techniques](./02-applications-and-techniques.md) for the eight
techniques these paradigms unlock · [What is Machine Learning?](./01-what-is-machine-learning.md) for
why labels beat hand-written rules

---

## Run It Yourself

The same 426 patients, four times. The **only** thing changing is how many labels the model is
allowed to see.

```python title="three_paradigms.py"
"""Three learning types on one dataset — the difference is how many labels you use."""

import warnings
import numpy as np
from sklearn.cluster import KMeans
from sklearn.datasets import load_breast_cancer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, adjusted_rand_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.semi_supervised import SelfTrainingClassifier

warnings.filterwarnings("ignore")

data = load_breast_cancer()
X, y = data.data, data.target

print("THE DATA")
print(f"  samples (rows)       {X.shape[0]}")
print(f"  features (columns)   {X.shape[1]} — all numeric")
print(f"  first four features  {', '.join(data.feature_names[:4])}")
print(f"  classes              {data.target_names[0]}={np.sum(y == 0)}, "
      f"{data.target_names[1]}={np.sum(y == 1)}")
print(f"  label 1 means        '{data.target_names[1]}'  <- sklearn's positive class")

X_tr, X_te, y_tr, y_te = train_test_split(
    X, y, test_size=0.25, random_state=0, stratify=y)
print(f"  train {X_tr.shape[0]} rows, test {X_te.shape[0]} rows")


def pipe():
    return make_pipeline(StandardScaler(), LogisticRegression(max_iter=5000))


N_LAB, SEEDS = 30, 15

# 1. SUPERVISED — all labels
full = accuracy_score(y_te, pipe().fit(X_tr, y_tr).predict(X_te))

# 2 & 3. Starved supervised vs semi-supervised, averaged over seeds
starved, semi = [], []
for seed in range(SEEDS):
    idx = np.random.RandomState(seed).permutation(len(y_tr))
    lab, unlab = idx[:N_LAB], idx[N_LAB:]
    if len(np.unique(y_tr[lab])) < 2:
        continue
    starved.append(accuracy_score(y_te, pipe().fit(X_tr[lab], y_tr[lab]).predict(X_te)))
    y_semi = np.copy(y_tr)
    y_semi[unlab] = -1                      # -1 marks "label unknown"
    semi.append(accuracy_score(y_te, SelfTrainingClassifier(pipe())
                               .fit(X_tr, y_semi).predict(X_te)))

# 4. UNSUPERVISED — no labels at all
Xs = StandardScaler().fit_transform(X_tr)
km = KMeans(n_clusters=2, random_state=0, n_init=10).fit(Xs)
clust = max(accuracy_score(y_tr, km.labels_), accuracy_score(y_tr, 1 - km.labels_))

print(f"\n{'paradigm':<24}{'labels used':>12}{'unlabelled':>12}{'accuracy':>10}")
print("-" * 58)
print(f"{'supervised':<24}{len(y_tr):>12}{0:>12}{full:>10.3f}")
print(f"{'supervised (starved)':<24}{N_LAB:>12}{'discarded':>12}{np.mean(starved):>10.3f}")
print(f"{'semi-supervised':<24}{N_LAB:>12}{len(y_tr) - N_LAB:>12}{np.mean(semi):>10.3f}")
print(f"{'unsupervised (KMeans)':<24}{0:>12}{len(y_tr):>12}{clust:>10.3f}")
print(f"\n  starved / semi rows are the mean of {len(starved)} random label draws")
print(f"  KMeans adjusted Rand index vs truth: {adjusted_rand_score(y_tr, km.labels_):.3f}")
print("  KMeans was never told the class names, or even that there are two")
```

```text title="Output"
THE DATA
  samples (rows)       569
  features (columns)   30 — all numeric
  first four features  mean radius, mean texture, mean perimeter, mean area
  classes              malignant=212, benign=357
  label 1 means        'benign'  <- sklearn's positive class
  train 426 rows, test 143 rows

paradigm                 labels used  unlabelled  accuracy
----------------------------------------------------------
supervised                       426           0     0.958
supervised (starved)              30   discarded     0.918
semi-supervised                   30         396     0.921
unsupervised (KMeans)              0         426     0.908

  starved / semi rows are the mean of 15 random label draws
  KMeans adjusted Rand index vs truth: 0.664
  KMeans was never told the class names, or even that there are two
```

### What to notice in that output

- **Zero labels got 0.908; all 426 labels got 0.958.** Fifty points of accuracy for the entire
  labelling effort. That is not an argument against supervision — it says these two classes are so
  well separated in feature space that the *structure alone* nearly recovers them. On a harder
  problem the gap would be enormous.
- **Semi-supervised gained 0.003.** Honest and unremarkable. With classes this separable, 30 labels
  already pin the boundary and the unlabelled rows have nothing left to add.
- **The 30-label and semi rows are averages over 15 random draws**, not one lucky split. A single
  draw of 30 from 426 varies by several points, and reporting one would have been meaningless.
- **`label 1` is `benign`.** Left alone, every precision and recall figure would describe how well
  the model finds *healthy* patients — the opposite of the clinical need.
- **The adjusted Rand index is 0.664 while agreement is 0.908.** Both describe the same clustering.
  ARI corrects for agreement achievable by chance, which is why it's the more honest number and why
  "accuracy" is the wrong instrument for unsupervised results.

**Things worth trying:**

1. Change `N_LAB` to `5`, `10`, `50`, `100`. Plot accuracy against label count — the curve rises
   steeply then flattens, which tells you where more labelling stops paying.
2. Set `n_clusters=3` on the KMeans. It will happily produce three groups from two-class data,
   reporting no error whatsoever. That is the evaluation problem in one line.
3. Swap `accuracy_score` for `precision_score` and `recall_score`, then rerun with
   `pos_label=0` to make *malignant* the positive class. Watch which number you'd actually report
   to a clinician change.

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

### Features and data types

**F1. [THEORY]** In a cancer dataset with columns *Clump thickness*, *Uniformity of cell size*,
*Marginal adhesion* and *Class*, identify the features and the target. What is the other name for
"feature"?

**F2. [THEORY]** Distinguish nominal from ordinal categorical data, and give an example of each.
Why can only one of them be sensibly encoded as `0, 1, 2`?

**F3. [THEORY]** State the rule about feature and output types in classification problems.

**F4. [THEORY]** A dataset's features are all numeric and its target is the text `pass`/`fail`. Which
technique is this, and which column determined your answer?

**F5. [THEORY]** Why is `X` written with a capital letter and `y` with a lowercase one?

### The positive class

**C1. [THEORY]** Define the positive and negative class. For disease detection, spam filtering and
churn prediction, state the positive class in each.

**C2. [ANALYZE]** "Positive class" sounds like it means the good outcome, but in disease detection
the positive class is having the disease. Explain the sense in which it is "positive", and why the
convention picks the rare class.

**C3. [ANALYZE]** In scikit-learn's breast cancer data, label `1` is `benign`. Explain precisely what
goes wrong if you compute recall without noticing this, and what you would change.

### The three paradigms

**P1. [THEORY]** Name the three learning categories and state, for each, what the training data
contains.

**P2. [THEORY]** Draw the supervised learning flow in three stages, and explain what "teach the
model with pre-defined data" means.

**P3. [THEORY]** Name the two types of supervised learning and give the target type and an output
example for each.

**P4. [THEORY]** Name the three families of unsupervised task, with a one-line description of each.

**P5. [THEORY]** Clustering does three distinct jobs. Name all three, and explain how one of them
makes clustering usable for anomaly detection.

**P6. [ANALYZE]** Explain why unsupervised learning is harder to evaluate than supervised learning.
Is it harder to *run*?

**P7. [THEORY]** Why does semi-supervised learning exist? Name the constraint that motivates it and
two task areas where it is commonly used.

**P8. [THEORY]** Describe the four steps of self-training, and name the assumption it depends on.

### Reading the output

**O1. [OUT]** From the demo:

```text
supervised                       426           0     0.958
supervised (starved)              30   discarded     0.918
semi-supervised                   30         396     0.921
unsupervised (KMeans)              0         426     0.908
```

- How much accuracy did 396 extra labels buy, going from row 2 to row 1?
- What did semi-supervised gain over starved supervised?
- What does row 4 achieving `0.908` with **zero** labels tell you about this dataset?

**O2. [ANALYZE]** A colleague concludes from row 4 that labelling was a waste of effort. Give two
reasons this conclusion is unsafe.

**O3. [ANALYZE]** The starved and semi-supervised rows are averaged over 15 random label draws.
Explain why reporting a single draw would have been misleading.

**O4. [OUT]** KMeans reported agreement `0.908` but an adjusted Rand index of `0.664`. Both describe
the same clustering. Why do they differ, and which is the more honest figure?

### Applying it

**A1. [PROG]** Load `load_breast_cancer` and print the number of samples, the number of features,
and how many rows belong to each class.

**A2. [PROG]** Fit a `KMeans` with `n_clusters=2` on the standardised features **without** using
`y`, then print its agreement with the true labels under both possible cluster-to-class mappings.

**A3. [PROG]** Build a semi-supervised setup: keep 20 labels, set the rest to `-1`, fit a
`SelfTrainingClassifier`, and print test accuracy.

**A4. [ANALYZE]** You have 500,000 unlabelled product reviews and budget to label 500. Name the
paradigm, describe your plan, and state how you would tell whether the unlabelled reviews helped
at all.

### Quick self-check

1. What is another word for "feature"?
2. What do `X` and `y` conventionally hold, and what shape is each?
3. What are the two most common kinds of data?
4. In classification, can features be categorical? Can the output be numeric?
5. Which column decides whether a task is regression or classification?
6. Does "positive class" mean the good outcome?
7. What single question separates supervised from unsupervised learning?
8. Name the two types of supervised learning.
9. Name the three families of unsupervised task.
10. What are the three jobs clustering performs?
11. Why does semi-supervised learning exist?
12. Which paradigm is hardest to evaluate, and why?
