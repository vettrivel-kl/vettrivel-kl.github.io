---
sidebar_position: 2
title: Applications and Major Techniques
description: The eight major machine learning techniques, the question each one answers, and how to read a real problem statement and work out which technique it is.
tags: [machine-learning, foundations]
toc_max_heading_level: 3
---

# Applications and Major Techniques

> **Topic —** There are only about **eight** things machine learning does. Every application you've
> heard of is one of them, or a few of them stacked. This page names all eight, and — more usefully
> — teaches you to look at a sentence like *"we want to know which customers will leave"* and
> immediately say **classification**.

That translation step is the actual skill. Choosing an algorithm is easy once the technique is
named; naming it wrong means every later decision is wrong.

---

## The eight techniques at a glance

The fastest way to identify a technique is to ask **what shape the answer is**.

| # | Technique | The question it answers | Output shape | Canonical example |
|---|---|---|---|---|
| 1 | **Regression / Estimation** | *How much? How many?* | A **continuous number** | Predicting a house's price |
| 2 | **Classification** | *Which category?* | A **label** from a fixed set | Churn — yes or no |
| 3 | **Clustering** | *What natural groups exist?* | A **group id** per row | Grouping customers with similar buying habits |
| 4 | **Association** | *What co-occurs?* | **Rules** — if A then B | Market basket analysis |
| 5 | **Anomaly detection** | *What doesn't belong?* | **Normal / outlier** | Credit-card fraud detection |
| 6 | **Sequence mining** | *What comes next?* | The **next item** in an order | Click-stream — the next page a user visits |
| 7 | **Dimensionality reduction** | *Can I say this with fewer columns?* | **Fewer features**, same information | PCA |
| 8 | **Recommendation systems** | *What else would this person like?* | A **ranked list** of items | Suggesting books or movies |

:::tip The two-question shortcut

**Q1 — Do you have the answers already (labels)?** If yes, you're in 1, 2 or 6. If no, you're in
3, 4, 5, 7 or 8.

**Q2 — Is the answer a number or a name?** Number → **regression**. Name → **classification**.

Those two questions resolve the majority of real problems. The rest of this page is the detail
behind them.

:::

---

## 1. Regression / Estimation

**Predicting continuous values.**

The defining property is that the output is a *number on a scale*, where being close counts.
Predicting ₹52 lakh for a ₹50 lakh house is a good answer; predicting "cat" when the truth is
"dog" is not partially right.

| | |
|---|---|
| **Application** | Predicting a house's price from size, location, number of bedrooms |
| **Also** | Share-market analysis and prediction; forecasting revenue; estimating delivery time |
| **Needs labels?** | Yes — you need past houses *with* their prices |

How to recognise it: the question starts with **how much**, **how many**, **how long**, or **what
value**.

## 2. Classification

**Predicting the item or category of a case.**

The output is one of a fixed, known set of labels. Two labels is **binary** classification; more is
**multiclass**.

| | |
|---|---|
| **Application** | Churn prediction — will this customer leave, yes or no |
| **Also** | Predicting a disease from symptoms; spam or not spam; approving or refusing a loan |
| **Needs labels?** | Yes — you need past cases *with* their correct category |

How to recognise it: the answer is a **noun or a yes/no**, and you could write out the complete list
of possible answers in advance.

:::note Same data, different technique

A bank predicting **the probability** a loan defaults (`0.83`) looks like regression, but it's
classification — the *decision* is approve/refuse. Probability is how classifiers express
confidence, not evidence that the task is regression. The giveaway is that the truth in your data is
a category (`defaulted` / `did not`), never a number.

:::

## 3. Clustering

**Finding the structure of data; summarisation.**

Clustering groups data points that are somehow similar. Crucially, **nobody says what the groups
should be** — this is unsupervised, and the algorithm proposes the groups itself.

Three distinct uses:

- **Discovering structure** — what kinds of customer do we actually have?
- **Summarisation** — describing 100,000 rows as six representative groups
- **Anomaly detection** — points that fit no cluster well are suspicious

| | |
|---|---|
| **Application** | Grouping customers with similar buying habits |
| **Also** | A bank segmenting customers by characteristics; organising documents by subject |
| **Needs labels?** | **No** |

How to recognise it: you want groups but **cannot name them in advance**. If you could name them,
it's classification.

## 4. Association

**Associating frequently co-occurring items or events.**

The output is a *rule*: **if** a basket contains bread and butter, **then** it likely contains jam.
Notice this predicts nothing about a person — it describes a relationship between items.

| | |
|---|---|
| **Application** | Market basket analysis |
| **Also** | "Frequently bought together"; which symptoms appear jointly; page pairs visited in one session |
| **Needs labels?** | **No** |

How to recognise it: the question is about **items appearing together**, not about predicting an
outcome for a row.

## 5. Anomaly detection

**Discovering abnormal and unusual cases.**

You are looking for the rare thing. This matters because the interesting class is often a fraction
of a percent of the data, which breaks the usual approach — a model that says "not fraud" every time
is 99.9% accurate and completely useless.

| | |
|---|---|
| **Application** | Credit-card fraud detection |
| **Also** | Network intrusion; manufacturing defects; a sensor reading that can't be physically real |
| **Needs labels?** | Often **no** — that's the point |

How to recognise it: you want the **rare, unexpected** cases, and you may have few or no examples
of them.

:::warning Anomaly detection or classification?

If you have a good number of confirmed fraud examples, treat it as **classification** — supervised
learning is more accurate when labels exist. Use anomaly detection when fraud is unlabelled, or
when tomorrow's fraud won't look like yesterday's. The choice is about **your labels**, not about
the word "fraud".

:::

## 6. Sequence mining

**Predicting the next item in an ordered sequence.**

What makes this its own technique is that **order carries the information**. Shuffle the rows and
you destroy the signal — which is not true of the techniques above.

| | |
|---|---|
| **Application** | Click-stream analysis — predicting the next page a user will visit from previous clicks |
| **Also** | Predicting the next word (autocomplete); next likely purchase; genome sequences |
| **Needs labels?** | Implicitly — the next item *is* the label |

How to recognise it: the words **next**, **after**, or **then**, and reordering the data would break
the problem.

## 7. Dimensionality reduction

**Reducing the size of the data.**

Techniques like **PCA** (Principal Component Analysis) reduce the number of features or variables
while **retaining as much relevant information as possible**.

Note this is usually not the goal in itself — it's a step that makes another technique work better,
faster, or possible at all. It also enables plotting: you cannot look at 50 dimensions, but you can
look at 2.

| | |
|---|---|
| **Application** | PCA on a wide dataset before clustering or classification |
| **Also** | Compressing images; visualising high-dimensional data in 2-D |
| **Needs labels?** | **No** |

How to recognise it: you have **too many columns**, and you suspect they overlap.

## 8. Recommendation systems

**Associating people's preferences with others who have similar tastes, and recommending new items
to them** — such as books or movies.

The output is a *ranked list personalised per user*, which is what separates it from classification.

| | |
|---|---|
| **Application** | Netflix and Amazon recommending videos, movies and TV shows |
| **Also** | Suggested products; "people you may know"; a music discovery playlist |
| **Needs labels?** | No labels, but it needs **interaction history** |

How to recognise it: the answer differs **per person**, and it's a list rather than one value.

---

## Reading a problem statement

Given a sentence, work down this path:

```
What shape is the answer?
│
├─ a number on a scale ─────────────────► REGRESSION
│
├─ one of a fixed set of names
│   ├─ do you have labelled examples? ──► CLASSIFICATION
│   └─ no labels, rare cases ───────────► ANOMALY DETECTION
│
├─ a group id, groups not named up front ► CLUSTERING
│
├─ the next thing in an order ───────────► SEQUENCE MINING
│
├─ "if A then B" about items ────────────► ASSOCIATION
│
├─ a ranked list, different per person ──► RECOMMENDATION
│
└─ the same rows with fewer columns ─────► DIMENSIONALITY REDUCTION
```

Worked examples:

| Problem statement | Answer shape | Technique |
|---|---|---|
| "How many units will we sell next month?" | a number | Regression |
| "Which of these transactions should we block?" | yes/no, labelled history | Classification |
| "Which transactions look nothing like normal?" | rare/unusual, no labels | Anomaly detection |
| "What types of user does our app have?" | unnamed groups | Clustering |
| "What do people buy alongside coffee?" | item rules | Association |
| "What will they search for next?" | next in order | Sequence mining |
| "We have 200 columns and a slow model" | fewer columns | Dimensionality reduction |
| "What should we put on their home page?" | ranked, per person | Recommendation |

---

## Applications you use every day

Real systems are rarely one technique. These are the standard examples, with the techniques each
one actually leans on.

### Recommendation — Netflix and Amazon

How do Netflix and Amazon recommend videos, movies and TV shows? They use machine learning to
produce **suggestions you might enjoy** — associating your preferences with people of similar taste.
→ *Recommendation systems*, usually with *clustering* behind it.

### Banking — loan approval

How does a bank decide when approving a loan application? It uses machine learning to **predict the
probability of default** for each applicant, then approves or refuses based on that probability.
→ *Classification*.

### Telecommunications — segmentation and churn

Telecom companies analyse customers' demographic data to:

- categorise them into **distinct groups** → *clustering* (segmentation)
- forecast which customers are likely to **cancel their service** → *classification* (churn)

Two different techniques on one dataset, answering two different questions. This pairing is worth
remembering — it's the clearest illustration that the *question*, not the data, picks the technique.

### Healthcare diagnostics

Models analyse medical images — **X-rays** and **MRIs** — to assist in diagnosing diseases, roughly
a thousand times faster than a human. Also personalising treatment, drug discovery, and clinical
trial research.
→ *Classification* on images, with *deep learning* doing the feature extraction.

### Financial trading

Machine learning analyses market data and trends to inform trading strategies, detect **market
shifts**, assess **risk**, and **predict stock prices**.
→ *Regression* for prices, *classification* for risk bands, *anomaly detection* for unusual activity.

### Autonomous vehicles

Self-driving cars use machine learning to **interpret sensor data**, **recognise objects**, make
**real-time decisions**, and navigate safely.
→ *Classification* for object recognition, plus *reinforcement learning* for the driving policy.

### And the rest

Chatbots; unlocking your phone; computer games using **face recognition**. Each uses different
machine learning techniques and algorithms — there is no single "the" ML method behind everyday
software.

---

## Where the techniques overlap

This is the part that trips people up, and it's worth being precise about.

| Situation | It looks like | It's actually | Why |
|---|---|---|---|
| Predicting default **probability** | Regression (output `0.83`) | **Classification** | Truth in the data is a category |
| Fraud **with** labelled examples | Anomaly detection | **Classification** | Use labels when you have them |
| Fraud **without** labels | Classification | **Anomaly detection** | Nothing to learn from |
| Customer segmentation | Classification | **Clustering** | Groups aren't named in advance |
| Churn prediction | Clustering | **Classification** | The label already exists |
| "Frequently bought together" | Recommendation | **Association** | About items, not people |
| Personalised home page | Association | **Recommendation** | About a person, ranked |
| Predicting the next page | Classification | **Sequence mining** | Order carries the signal |

:::danger The distinction that actually matters

Notice how often the answer turns on **whether you have labels** — not on the subject matter. "Fraud
detection" is two different techniques depending on your data. Before naming a technique, check what
you actually have. This is the same divide as
[supervised versus unsupervised learning](./03-types-of-learning.md).

:::

---

## Common Mistakes

| # | Mistake | Wrong | Right |
|---|---|---|---|
| 1 | Picking the technique from the subject | "fraud → anomaly detection" | Check whether labels exist |
| 2 | Treating probability output as regression | `0.83` means a number | Truth is a category → classification |
| 3 | Confusing clustering and classification | Both "make groups" | Named groups → classification |
| 4 | Confusing association and recommendation | Both "suggest things" | Items → association; people → recommendation |
| 5 | Shuffling rows in a sequence problem | Order is just row order | Order **is** the signal |
| 6 | Treating dimensionality reduction as the goal | "we did PCA" | It's a step that serves another technique |
| 7 | Using accuracy on rare events | 99.9% "not fraud" | Rare classes need other measures |
| 8 | Assuming one application = one technique | "Netflix = recommendation" | Real systems stack several |
| 9 | Naming the algorithm before the technique | "let's use a random forest" | Name the technique, then choose |

---

## Summary

| Ask | Technique |
|---|---|
| How much / how many? | **Regression** |
| Which category? (labels exist) | **Classification** |
| What groups exist? (no labels) | **Clustering** |
| What co-occurs with what? | **Association** |
| What doesn't belong? | **Anomaly detection** |
| What comes next? | **Sequence mining** |
| Can this be fewer columns? | **Dimensionality reduction** |
| What else would they like? | **Recommendation systems** |

**Key takeaways**

- Identify the technique by the **shape of the answer**, not the subject matter
- Two questions resolve most cases: *do I have labels?* and *is the answer a number or a name?*
- Regression outputs a number where **closeness counts**; classification outputs one of a fixed set
- A predicted **probability** does not make a task regression — check what the truth values are
- Clustering vs classification is decided by whether you can **name the groups in advance**
- "Fraud detection" is classification **with** labels and anomaly detection **without** them
- Association describes **items**; recommendation ranks for **a person**
- Sequence mining is the technique where **shuffling the rows destroys the problem**
- Dimensionality reduction is almost always a **means**, not an end
- Telecom does segmentation (*clustering*) and churn (*classification*) on the same data — the
  question picks the technique
- Real applications stack several techniques; autonomous driving uses classification *and*
  reinforcement learning

**Next in this section:** [Types of Learning](./03-types-of-learning.md) — the labels-or-not divide
these techniques keep turning on · [Reinforcement Learning](./04-reinforcement-learning.md) ·
[The Toolkit and the Pipeline](./05-toolkit-and-pipeline.md)

**See also:** [What is Machine Learning?](./01-what-is-machine-learning.md) for why any of this
beats hand-written rules

---

## Run It Yourself

Five techniques, **one dataset**. Nothing about the data changes between them — only the question.

```python title="one_dataset_five_techniques.py"
"""One dataset, five techniques — the question you ask decides the technique."""

import numpy as np
import pandas as pd
from sklearn.cluster import KMeans
from sklearn.decomposition import PCA
from sklearn.ensemble import IsolationForest
from sklearn.linear_model import LinearRegression, LogisticRegression
from sklearn.preprocessing import StandardScaler

df = pd.DataFrame({
    "tenure_months":  [2, 3, 4, 5, 8, 10, 12, 15, 18, 20, 24, 30,  6, 36],
    "monthly_spend":  [20, 25, 22, 30, 40, 45, 50, 55, 62, 65, 70, 80, 95, 140],
    "support_tickets": [5, 4, 6, 3, 2, 1, 2, 1, 0, 1, 0, 1,  8,  0],
    "churned":        [1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0,  1,  0],
})
X = df[["tenure_months", "monthly_spend", "support_tickets"]]

print("THE DATA — 14 customers, 3 features, 1 label")
print(df.to_string(index=False))

print("\n" + "=" * 62)
print('1. REGRESSION  — "how much will this customer spend?"  -> a number')
reg = LinearRegression().fit(df[["tenure_months"]], df["monthly_spend"])
print(f"   spend = {reg.coef_[0]:.2f} x tenure + {reg.intercept_:.2f}")
print(f"   R^2 on training data          {reg.score(df[['tenure_months']], df['monthly_spend']):.3f}")
at_14 = pd.DataFrame({"tenure_months": [14]})
print(f"   predicted spend at 14 months  {reg.predict(at_14)[0]:.2f}")

print("\n" + "=" * 62)
print('2. CLASSIFICATION — "will this customer churn?"  -> a category')
clf = LogisticRegression(max_iter=1000).fit(X, df["churned"])
print(f"   training accuracy             {clf.score(X, df['churned']):.3f}")
new = pd.DataFrame([[3, 24, 5]], columns=X.columns)
print(f"   new customer (3mo, $24, 5 tickets) -> "
      f"{'CHURN' if clf.predict(new)[0] else 'STAY'} "
      f"(p={clf.predict_proba(new)[0][1]:.2f})")

print("\n" + "=" * 62)
print('3. CLUSTERING — "what kinds of customer do we have?"  -> groups, no labels used')
Xs = StandardScaler().fit_transform(X)
km = KMeans(n_clusters=3, random_state=0, n_init=10).fit(Xs)
df["segment"] = km.labels_
print(df.groupby("segment")[["tenure_months", "monthly_spend", "support_tickets"]]
        .mean().round(1).to_string())
print("   note: 'churned' was never shown to KMeans")

print("\n" + "=" * 62)
print('4. ANOMALY DETECTION — "who does not belong?"  -> normal / outlier')
iso = IsolationForest(contamination=0.15, random_state=0).fit(X)
flags = iso.predict(X)
out = df.loc[flags == -1, ["tenure_months", "monthly_spend", "support_tickets"]]
print(f"   flagged {len(out)} of {len(df)} as unusual:")
print(out.to_string(index=False))

print("\n" + "=" * 62)
print('5. DIMENSIONALITY REDUCTION — "can 3 features become 2?"  -> fewer columns')
pca = PCA(n_components=2).fit(Xs)
ratios = pca.explained_variance_ratio_
print(f"   variance kept by component 1  {ratios[0]:.1%}")
print(f"   variance kept by component 2  {ratios[1]:.1%}")
print(f"   two components retain         {ratios.sum():.1%} of the original information")
```

```text title="Output"
THE DATA — 14 customers, 3 features, 1 label
 tenure_months  monthly_spend  support_tickets  churned
             2             20                5        1
             3             25                4        1
             4             22                6        1
             5             30                3        1
             8             40                2        0
            10             45                1        0
            12             50                2        0
            15             55                1        0
            18             62                0        0
            20             65                1        0
            24             70                0        0
            30             80                1        0
             6             95                8        1
            36            140                0        0

==============================================================
1. REGRESSION  — "how much will this customer spend?"  -> a number
   spend = 2.50 x tenure + 22.67
   R^2 on training data          0.651
   predicted spend at 14 months  57.61

==============================================================
2. CLASSIFICATION — "will this customer churn?"  -> a category
   training accuracy             1.000
   new customer (3mo, $24, 5 tickets) -> CHURN (p=0.99)

==============================================================
3. CLUSTERING — "what kinds of customer do we have?"  -> groups, no labels used
         tenure_months  monthly_spend  support_tickets
segment
0                  4.0           38.4              5.2
1                 15.3           55.3              1.0
2                 33.0          110.0              0.5
   note: 'churned' was never shown to KMeans

==============================================================
4. ANOMALY DETECTION — "who does not belong?"  -> normal / outlier
   flagged 2 of 14 as unusual:
 tenure_months  monthly_spend  support_tickets
             6             95                8
            36            140                0

==============================================================
5. DIMENSIONALITY REDUCTION — "can 3 features become 2?"  -> fewer columns
   variance kept by component 1  75.0%
   variance kept by component 2  22.9%
   two components retain         97.9% of the original information
```

### What to notice in that output

- **The `churned` column was used by exactly one of the five.** Classification consumed it;
  regression used a different column as its target; clustering, anomaly detection and PCA never saw
  a label at all. That single fact is the supervised/unsupervised divide.
- **Clustering rediscovered the churners without being told.** Segment `0` averages 4 months tenure
  and 5.2 support tickets — every churner in the data. Nobody handed KMeans the answer; the
  structure was already in the features.
- **Regression scored `R² = 0.651`, which is mediocre**, and that's honest. The two unusual
  customers — the 6-month/$95 spender and the 36-month/$140 whale — pull the line off. The same two
  rows are what anomaly detection flagged. **One technique's noise is another technique's answer.**
- **Classification hit 100%**, which you should distrust immediately. That's accuracy on the same 14
  rows it learned from, and it means nothing about new customers — the problem that
  train/test splitting and cross-validation exist to solve.
- **Three features compressed to two kept 97.9%** of the variation, because tenure and spend
  largely say the same thing.

**Things worth trying:**

1. Change `n_clusters` to 2 and then 4. There is no "correct" answer — which is precisely why
   clustering is harder to evaluate than classification.
2. Drop the last two rows (the anomalies) and refit the regression. Watch `R²` jump.
3. Swap `LogisticRegression` for `DecisionTreeClassifier`. The technique is unchanged — only the
   algorithm. Naming the technique first is what makes that swap trivial.

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

### Naming the technique

**T1. [THEORY]** List the eight major machine learning techniques, and for each give the question it
answers in one phrase.

**T2. [THEORY]** For each of the following, name the technique and justify it in one sentence:
predicting a house's price · churn yes/no · grouping customers with similar buying habits · market
basket analysis · credit-card fraud · the next page a user visits · reducing 200 columns to 10 ·
suggesting a film.

**T3. [THEORY]** State the two questions that resolve most technique choices, and explain what each
one rules out.

**T4. [THEORY]** Which technique becomes impossible if you shuffle the order of your rows? Why?

### The tricky distinctions

**D1. [ANALYZE]** A bank's model outputs `0.83` for a loan applicant. A colleague says this is
regression because the output is a number. Explain why they are wrong, and state what you'd inspect
to settle it.

**D2. [ANALYZE]** "Fraud detection is anomaly detection." Under what circumstances is this correct,
and under what circumstances should you use classification instead? What does the choice depend on?

**D3. [THEORY]** Distinguish clustering from classification using a single test question.

**D4. [THEORY]** Distinguish association from recommendation. Which is about items and which is
about people?

**D5. [ANALYZE]** A telecom company runs both segmentation and churn prediction on one customer
dataset. Name the technique for each, and explain what this shows about the relationship between
data and technique.

### Reading the output

**O1. [OUT]** In the worked demo, the `churned` column was used by only one of the five techniques.
Which one, and what does that fact illustrate?

**O2. [OUT]** KMeans produced this summary, having never seen the `churned` column:

```text
         tenure_months  monthly_spend  support_tickets
segment
0                  4.0           38.4              5.2
1                 15.3           55.3              1.0
2                 33.0          110.0              0.5
```

Describe each segment in business terms, and explain what it means that segment `0` corresponds to
the churners.

**O3. [ANALYZE]** Regression scored `R² = 0.651` while anomaly detection flagged exactly two rows.
Explain the connection between those two results.

**O4. [ANALYZE]** The classifier reported **100%** training accuracy. Give two reasons this number
should not reassure you.

**O5. [OUT]** PCA reported `75.0%` and `22.9%` for its two components. What does the sum mean, and
what has been given up in exchange?

### Applying it

**P1. [PROG]** Using the demo dataset, fit a `KMeans` model with `n_clusters=2` and print the mean
of each feature per cluster.

**P2. [PROG]** Write code that fits a regression predicting `monthly_spend` from **both**
`tenure_months` and `support_tickets`, and print the two coefficients.

**P3. [PROG]** Use `IsolationForest` with `contamination=0.3` and print how many rows are flagged.
Explain what `contamination` controls.

**P4. [ANALYZE]** You're asked: *"Which of our 50,000 products should we show on the home page?"*
The data is a log of every purchase, with no labels. Name the technique, say what you'd need, and
name one other technique that could support it.

### Quick self-check

1. Name the eight major techniques.
2. What shape is a regression output? A classification output?
3. Which two questions identify most techniques?
4. What separates clustering from classification?
5. When is fraud detection *not* anomaly detection?
6. Which technique depends on the order of the data?
7. Is dimensionality reduction usually a goal or a step?
8. What does association describe that recommendation doesn't?
9. Why did clustering find the churners without being given labels?
10. Why is 100% training accuracy not good news?
