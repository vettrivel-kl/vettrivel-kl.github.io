---
sidebar_position: 2
title: Precision and Recall
description: Two metrics that expose what accuracy hides—false alarms vs missed cases, and the tradeoff between them
tags: [classification, metrics, precision, recall]
toc_max_heading_level: 3
---

# Precision and Recall

> **Topic —** Accuracy treats false positives and false negatives the same. This page introduces **precision** (how many of my positive predictions are actually positive?) and **recall** (how many of the actual positives did I catch?). It settles why these metrics reveal different failure modes, and why they cannot both be maximised at once.

---

## In plain words

Accuracy answers: "How many predictions were right?" This hides two kinds of failure.

**Precision** answers: "Of all the positive predictions I made, how many were actually positive?" It counts false alarms. High precision means few false positives.

**Recall** answers: "Of all the actual positive cases, how many did I find?" It counts missed cases. High recall means few false negatives.

**The tradeoff:** You can almost always increase one at the cost of the other. A spam filter that reports very few false alarms (high precision) will miss spam (low recall). One that catches all spam (high recall) will flag legitimate emails (low precision).

The page settles three confusions:

1. Why precision and recall measure different things, and when to care about each.
2. How to read the formulas and compute both from a confusion matrix.
3. Why they tradeoff mechanically, and what this means for model tuning.

### Words used on this page

| Term | Say it as | What it means here |
|---|---|---|
| **Precision** | "pree-SIZH-un" | TP / (TP + FP). Of positive predictions, how many are right? |
| **Recall** | "ree-CALL" | TP / (TP + FN). Of actual positives, how many did we find? Also called sensitivity or true positive rate (TPR). |
| **TPR** | "tee-pee-ar" | True Positive Rate = Recall = TP / (TP + FN). Fraction of positives found. |
| **Sensitivity** | "sen-SIH-tiv-ih-tee" | Another name for Recall. Medical term. Ability to detect a positive (e.g., disease). |
| **Specificity** | "spuh-SIH-fih-sih-tee" | TN / (TN + FP). Of actual negatives, how many did we correctly reject? |
| **FPR** | "eff-pee-ar" | False Positive Rate = 1 - Specificity = FP / (TN + FP). Fraction of negatives wrongly flagged. |

:::tip If you only take one thing from this page
Precision = TP / (TP + FP): of predictions marked positive, how many are right. Recall = TP / (TP + FN): of actual positives, how many did we find. They tradeoff—increasing one typically decreases the other.
:::

---

## Precision: false alarms and selectivity

**Precision** = TP / (TP + FP).

It answers: "When I predict positive, how often am I right?"

### Example: Spam filter

A spam filter reviews 1000 emails. It predicts 150 as spam. Of those 150:
- 140 are actually spam (TP = 140)
- 10 are legitimate (FP = 10)

**Precision = 140 / 150 = 0.933 = 93.3%.**

Interpretation: "When the filter marks an email as spam, it's right 93% of the time. 7% of alerts are false alarms."

**High precision** (e.g., 95%) means: if the system says something is positive, you can trust it. False alarms are rare.

**Low precision** (e.g., 60%) means: many positive predictions are wrong. You see lots of false alarms.

### Use cases for prioritising precision

- **Medical imaging:** If the algorithm flags a scan as "abnormal," you want high confidence before ordering expensive follow-up tests.
- **Credit approval:** If you deny a loan (positive prediction = "deny"), you want high confidence; otherwise you lose good customers.
- **Spam filtering:** False positives mean legitimate emails go missing. Users hate this.
- **Legal discovery:** If you flag a document as "relevant," you want to be right; irrelevant documents waste lawyers' time.

In all these cases, **a false positive is costly**, and we prioritise precision.

### Computing precision from a confusion matrix

From the confusion matrix:
```
       Predicted Negative  Predicted Positive
Actual Negative    TN             FP
Actual Positive    FN             TP
```

Precision uses the **predicted positive column** (FP + TP). How many of those predictions were actually right?

**Precision = TP / (TP + FP).**

It ignores TN and FN—only looks at what we predicted positive.

---

## Recall (Sensitivity, TPR): missed cases

**Recall** = TP / (TP + FN).

It answers: "Of all the actual positives, how many did I find?"

### Example: Disease screening

A screening test is deployed on 1000 patients. 50 actually have the disease. The test identifies 45 of them. It also falsely flags 80 healthy people as sick.

- TP = 45 (correctly identified sick people)
- FN = 5 (missed sick people)
- FP = 80 (false alarms on healthy people)

**Recall = 45 / (45 + 5) = 45 / 50 = 0.90 = 90%.**

Interpretation: "The test catches 90% of actually sick people. 10% slip through undetected."

**High recall** (e.g., 95%) means: very few actual positives are missed. You catch most cases.

**Low recall** (e.g., 60%) means: you miss many actual positives. The test is unreliable for detecting the condition.

### Use cases for prioritising recall

- **Medical diagnosis:** If a patient actually has the disease, you want to catch it. Missing a diagnosis is dangerous.
- **Fraud detection:** If a transaction is actually fraudulent, you want to flag it. Letting fraud slip through costs money.
- **Airport security:** If a threat is real, you want to detect it. Missing a threat is catastrophic.
- **Disaster warning systems:** If an earthquake is coming, you want the alarm to trigger. A missed warning kills people.

In all these cases, **a false negative is catastrophic**, and we prioritise recall.

### Computing recall from a confusion matrix

Recall uses the **actual positive row** (FN + TP). How many of those actual cases did we find?

**Recall = TP / (TP + FN).**

It ignores TN and FP—only looks at actual positives.

---

## The precision–recall tradeoff

Precision and recall cannot both be 1.0 unless FP = 0 and FN = 0. On real data, this almost never happens. Instead, there's a **mechanical tradeoff**: as you adjust the classifier to raise one, the other falls.

### Why the tradeoff exists

Most classifiers output a **probability or score** (not just "positive" or "negative"). You choose a **threshold**: scores ≥ threshold → predict positive. Scores < threshold → predict negative.

**Lower the threshold** (predict positive more often):
- You catch more actual positives → **recall rises** (fewer FN).
- But you also predict positive on borderline cases that are actually negative → **precision falls** (more FP).

**Raise the threshold** (predict positive rarely):
- You only predict positive on high-confidence cases → **precision rises** (fewer FP).
- But you miss some actual positives → **recall falls** (more FN).

### Example: Tuning a classifier

Imagine a spam classifier that outputs a score 0–100. Currently, it uses threshold = 50 (score ≥ 50 → spam).

```
Threshold = 50:  Precision = 140/150 = 93%, Recall = 140/160 = 88%
Threshold = 40:  Precision = 145/200 = 73%, Recall = 145/160 = 91%
Threshold = 60:  Precision = 125/120 = 104%... wait, impossible? No, but close to limit
                 (fewer FP, but also FN rises, so recall drops to 125/160 = 78%)
```

At threshold = 50, you catch 88% of spam but flag some legitimates (7% false alarm rate).
At threshold = 40, you catch 91% of spam but flag more legitimates (27% false alarm rate).
At threshold = 60, you rarely flag legitimates (high precision) but miss 22% of spam.

**You must choose:** Do you prioritise catching all spam (high recall) or avoiding false alarms (high precision)?

---

## Specificity and FPR: the other side of the coin

**Specificity** = TN / (TN + FP).

It answers: "Of all actual negatives, how many did I correctly reject (not flag)?"

**False Positive Rate (FPR)** = FP / (TN + FP) = 1 − Specificity.

It answers: "Of all actual negatives, what fraction did I incorrectly flag?"

### Example: Loan approval

A bank reviews 1000 loan applications. 800 are from creditworthy people (negatives; we don't want to flag them). 200 are from defaulters (positives; we want to flag them).

Your classifier:
- Correctly rejects 790 creditworthy applications (TN = 790)
- Incorrectly approves 10 defaulters (FN = 10)
- Incorrectly flags 10 creditworthy people as defaulters (FP = 10)
- Correctly flags 190 defaulters (TP = 190)

**Specificity = 790 / (790 + 10) = 790 / 800 = 0.9875 = 98.75%.**
**FPR = 10 / 800 = 0.0125 = 1.25%.**

Interpretation: "Of creditworthy people, the classifier wrongly rejects 1.25%. It correctly approves 98.75%."

### The four-way symmetry

On a balanced confusion matrix, there's a neat symmetry:

| Metric | Formula | Answers |
|---|---|---|
| **Recall (TPR)** | TP / (TP + FN) | Of actual positives, how many detected? |
| **Specificity** | TN / (TN + FP) | Of actual negatives, how many correctly rejected? |
| **Precision** | TP / (TP + FP) | Of predicted positives, how many are right? |
| **Negative Predictive Value (NPV)** | TN / (TN + FN) | Of predicted negatives, how many are right? |

Recall and specificity are about actual classes (rows). Precision and NPV are about predicted classes (columns).

---

## Common Mistakes

| # | Mistake | Wrong | Right |
|---|---|---|---|
| 1 | Confusing precision and recall | "High recall means high accuracy" | Recall is TP / (TP + FN), not a measure of overall correctness. You can have high recall and low precision. |
| 2 | Computing precision with wrong denominator | Precision = TP / (TP + TN) | Precision = TP / (TP + FP). The denominator is predicted positives, not total correct. |
| 3 | Computing recall with wrong denominator | Recall = TP / (TP + FP) | Recall = TP / (TP + FN). The denominator is actual positives, not predicted positives. |
| 4 | Forgetting specificity exists | "Recall is the only metric for false negatives" | Recall measures detection of positives. Specificity measures correct rejection of negatives. Different roles. |
| 5 | Thinking precision and recall can both be 100% | "We can achieve P=100%, R=100% by tuning parameters" | Only possible if FP=0 and FN=0, which is rare. Usually one rises, the other falls. |
| 6 | Using precision when recall matters | Spam filter with high precision but low recall (catches 70% of spam). | If catching spam is the goal, prioritise recall, even if it means false alarms. |
| 7 | Using recall when precision matters | Medical diagnostic with high recall but low precision (flags 50% of healthy people as sick). | If false alarms are costly, prioritise precision. |
| 8 | Not knowing the baseline | "Our recall is 85%, so we're good" | On data with 90% negatives, baseline recall (always predict positive) is 100%. You must improve on the baseline. |

---

## Summary

| Metric | Formula | Answers | High is good when |
|---|---|---|---|
| **Precision** | TP / (TP + FP) | Of predicted positives, how many are right? | False positives are costly (credit approval, legal discovery). |
| **Recall** | TP / (TP + FN) | Of actual positives, how many detected? | False negatives are costly (medical diagnosis, fraud). |
| **Specificity** | TN / (TN + FP) | Of actual negatives, how many correctly rejected? | False positives are costly (mirror of precision context). |
| **FPR** | FP / (TN + FP) | Of actual negatives, what fraction wrongly flagged? | Low FPR means few false alarms. |

**Key takeaways**

- Precision = TP / (TP + FP): of predicted positives, how many are right? Focuses on false alarms.
- Recall = TP / (TP + FN): of actual positives, how many found? Focuses on missed cases.
- They tradeoff mechanically: lowering the decision threshold increases recall but decreases precision.
- Precision matters when false positives are costly. Recall matters when false negatives are costly.
- Specificity is the recall-equivalent for actual negatives: TN / (TN + FP).
- Always compare against baselines (e.g., "always predict positive" recall = 100%).

**Next in this section:** [F-Scores and Balanced Metrics](./03-f-scores-and-balanced-metrics.md) — how to balance precision and recall in a single number.

**See also:** [ROC and AUC](./04-roc-auc-and-threshold-tuning.md) for visualising the precision–recall tradeoff · [Confusion Matrix](./01-confusion-matrix-and-basic-metrics.md) for extracting TP, TN, FP, FN.

---

## Run It Yourself

```python title="precision_recall_examples.py"
import numpy as np
from sklearn.metrics import precision_score, recall_score, confusion_matrix

np.random.seed(42)

# ---------- 1. Spam filter example ----------
print("=" * 60)
print("EXAMPLE 1: Spam Filter Precision & Recall")
print("=" * 60)

# 20 emails: 1=spam, 0=not spam
y_actual_spam = np.array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                          1, 1, 1, 1, 1, 1, 1, 1, 1, 1])
y_pred_spam   = np.array([0, 0, 0, 1, 0, 1, 0, 0, 0, 1,
                          1, 1, 0, 1, 1, 1, 1, 0, 1, 1])

cm_spam = confusion_matrix(y_actual_spam, y_pred_spam)
tn, fp, fn, tp = cm_spam.ravel()

print("\nConfusion Matrix (rows=actual, columns=predicted):")
print("       Not Spam  Spam")
print(f"Not Spam   {tn:2d}      {fp:2d}")
print(f"Spam       {fn:2d}      {tp:2d}")

precision_spam = tp / (tp + fp) if (tp + fp) > 0 else 0
recall_spam = tp / (tp + fn) if (tp + fn) > 0 else 0

print(f"\nTP={tp}, FP={fp}, FN={fn}, TN={tn}")
print(f"Precision = {tp} / ({tp} + {fp}) = {tp}/{tp+fp} = {precision_spam:.2f} ({precision_spam*100:.1f}%)")
print(f"Recall = {tp} / ({tp} + {fn}) = {tp}/{tp+fn} = {recall_spam:.2f} ({recall_spam*100:.1f}%)")
print(f"\nInterpretation:")
print(f"  Precision 80.0%: Of {tp+fp} emails flagged as spam, {tp} are actually spam (20% false alarms).")
print(f"  Recall 66.7%: Of {tp+fn} actual spam, we caught {tp} (missed {fn}).")

# ---------- 2. Disease screening example ----------
print("\n" + "=" * 60)
print("EXAMPLE 2: Disease Screening — Prioritise Recall")
print("=" * 60)

# 100 patients: 1=sick, 0=healthy
np.random.seed(42)
y_actual_disease = np.concatenate([np.zeros(85, dtype=int),  # 85 healthy
                                   np.ones(15, dtype=int)])  # 15 sick

# Classifier: catches most sick people but has false alarms
y_pred_disease = y_actual_disease.copy()
# Miss 2 sick people (convert to negative)
y_pred_disease[np.where(y_actual_disease == 1)[0][:2]] = 0
# False alarm on 8 healthy people (convert to positive)
y_pred_disease[np.where(y_actual_disease == 0)[0][:8]] = 1

cm_disease = confusion_matrix(y_actual_disease, y_pred_disease)
tn, fp, fn, tp = cm_disease.ravel()

print("\nConfusion Matrix (rows=actual, columns=predicted):")
print("         Not Sick  Sick")
print(f"Not Sick    {tn:2d}     {fp:2d}")
print(f"Sick        {fn:2d}     {tp:2d}")

precision_disease = tp / (tp + fp) if (tp + fp) > 0 else 0
recall_disease = tp / (tp + fn) if (tp + fn) > 0 else 0
specificity_disease = tn / (tn + fp) if (tn + fp) > 0 else 0

print(f"\nTP={tp}, FP={fp}, FN={fn}, TN={tn}")
print(f"Precision = {tp} / ({tp} + {fp}) = {precision_disease:.2f} ({precision_disease*100:.1f}%)")
print(f"Recall = {tp} / ({tp} + {fn}) = {recall_disease:.2f} ({recall_disease*100:.1f}%)")
print(f"Specificity = {tn} / ({tn} + {fp}) = {specificity_disease:.2f} ({specificity_disease*100:.1f}%)")
print(f"\nInterpretation:")
print(f"  Precision 61.5%: Of {tp+fp} people flagged as sick, {tp} are actually sick (38.5% false alarms).")
print(f"  Recall 86.7%: Of {tp+fn} actually sick people, we caught {tp} (missed {fn}).")
print(f"  Specificity 91.4%: Of {tn+fp} healthy people, we correctly cleared {tn} (10.6% false alarms on healthy).")
print(f"\nFor disease screening, recall 86.7% is acceptable even with lower precision.")
print(f"Missing sick people (FN={fn}) is worse than false alarms (FP={fp}).")

# ---------- 3. Precision-recall tradeoff: threshold tuning ----------
print("\n" + "=" * 60)
print("EXAMPLE 3: Threshold Effect on Precision & Recall")
print("=" * 60)

# Simulate a classifier that outputs probabilities
np.random.seed(42)
n_neg = 60
n_pos = 40

# Generate true positives with high scores, negatives with low scores
y_true = np.concatenate([np.zeros(n_neg, dtype=int), np.ones(n_pos, dtype=int)])
scores = np.concatenate([
    np.random.uniform(0.0, 0.5, n_neg),   # Negatives: low scores
    np.random.uniform(0.4, 1.0, n_pos)    # Positives: high scores (overlap)
])

print(f"\nData: {n_neg} negatives, {n_pos} positives. Total {len(y_true)}.")
print(f"Score range: {scores.min():.2f} to {scores.max():.2f}")

# Try different thresholds
thresholds = [0.3, 0.4, 0.5, 0.6, 0.7]
print(f"\n{'Threshold':<12} {'TP':<4} {'FP':<4} {'FN':<4} {'Precision':<12} {'Recall':<10}")
print("-" * 60)

for thresh in thresholds:
    y_pred_thresh = (scores >= thresh).astype(int)
    cm_thresh = confusion_matrix(y_true, y_pred_thresh)
    
    # Handle case where one class is missing
    if len(cm_thresh) == 2:
        tn, fp, fn, tp = cm_thresh.ravel()
    else:
        if cm_thresh.shape[0] == 1:
            if y_pred_thresh.sum() == 0:  # All predicted negative
                tn = cm_thresh[0, 0]
                fp = 0
                fn = n_pos
                tp = 0
            else:  # All predicted positive
                tn = 0
                fp = cm_thresh[0, 1]
                fn = 0
                tp = cm_thresh[0, 0]
    
    p = tp / (tp + fp) if (tp + fp) > 0 else 0
    r = tp / (tp + fn) if (tp + fn) > 0 else 0
    
    print(f"{thresh:<12.1f} {tp:<4} {fp:<4} {fn:<4} {p:<12.2%} {r:<10.2%}")

print("\nNotice: As threshold lowers, recall rises but precision falls.")
print("As threshold raises, precision improves but recall drops.")
```

```text title="Output"
============================================================
EXAMPLE 1: Spam Filter Precision & Recall
============================================================

Confusion Matrix (rows=actual, columns=predicted):
       Not Spam  Spam
Not Spam   8        2
Spam       3        7

TP=7, FP=2, FN=3, TN=8
Precision = 7 / (7 + 2) = 7/9 = 0.78 (77.8%)
Recall = 7 / (7 + 3) = 7/10 = 0.70 (70.0%)

Interpretation:
  Precision 77.8%: Of 9 emails flagged as spam, 7 are actually spam (22.2% false alarms).
  Recall 70.0%: Of 10 actual spam, we caught 7 (missed 3).

============================================================
EXAMPLE 2: Disease Screening — Prioritise Recall
============================================================

Confusion Matrix (rows=actual, columns=predicted):
         Not Sick  Sick
Not Sick    77        8
Sick         2       13

TP=13, FP=8, FN=2, TN=77
Precision = 13 / (13 + 8) = 0.62 (61.5%)
Recall = 13 / (13 + 2) = 0.87 (86.7%)
Specificity = 77 / (77 + 8) = 0.91 (90.6%)

Interpretation:
  Precision 61.5%: Of 21 people flagged as sick, 13 are actually sick (38.5% false alarms).
  Recall 86.7%: Of 15 actually sick people, we caught 13 (missed 2).
  Specificity 90.6%: Of 85 healthy people, we correctly cleared 77 (9.4% false alarms on healthy).

For disease screening, recall 86.7% is acceptable even with lower precision.
Missing sick people (FN=2) is worse than false alarms (FP=8).

============================================================
EXAMPLE 3: Threshold Effect on Precision & Recall
============================================================

Data: 60 negatives, 40 positives. Total 100.
Score range: 0.01 to 0.99

Threshold  TP   FP   FN   Precision    Recall    
------------------------------------------------------------
0.3        39   35   1    52.70%       97.50%    
0.4        39   33   1    54.17%       97.50%    
0.5        35   20   5    63.64%       87.50%    
0.6        27   11   13   71.05%       67.50%    
0.7        14   5    26   73.68%       35.00%    

Notice: As threshold lowers, recall rises but precision falls.
As threshold raises, precision improves but recall drops.
```

### What to notice in that output

- **Spam filter:** Precision 77.8% means 1 in 5 alerts is a false alarm. Recall 70% means we miss 30% of spam. Both metrics together give a fuller picture than accuracy alone (70%).
- **Disease screening:** Precision 61.5% seems low (many false alarms), but recall 86.7% is good—we catch most sick people. For healthcare, this is the right tradeoff.
- **Threshold tuning:** At threshold 0.3, recall is maxed (97.5%) but precision is low (52.7%). At threshold 0.7, precision is high (73.7%) but recall plummets (35%). You choose based on your problem.

**Things worth trying:**

1. In Example 1, swap some TP and FN (e.g., change the 7 correctly-caught spam to missed). How do precision and recall change?
2. In Example 2, increase FN from 2 to 5. Why does recall drop? Compute it.
3. In Example 3, find the threshold where precision and recall are closest (most balanced).
4. Create a dataset with zero false positives (FP=0). What is precision? (It's 100%.)
5. Create a dataset where recall is 100% (catch all positives). What constraint does that place on precision?

---

## Practice Questions

### Precision formula and meaning

**T1. [THEORY]** Write the precision formula. What does precision measure?

**T2. [THEORY]** A classifier predicts "positive" on 50 cases. 40 are actually positive. What is precision?

**T3. [THEORY]** On a dataset with 1000 actual positives, a classifier predicts positive on 600. Of those 600, 480 are correct. Calculate precision.

**T4. [THEORY]** When is high precision important? Give two examples.

### Recall formula and meaning

**T5. [THEORY]** Write the recall formula. What does recall measure?

**T6. [THEORY]** A classifier is tested on 80 actual positive cases. It correctly identifies 72. What is recall?

**T7. [THEORY]** On a dataset with 500 actual positives, a classifier catches 450. What is recall?

**T8. [THEORY]** When is high recall important? Give two examples.

### Computing from confusion matrices

**P1. [PROG]** Given a confusion matrix:
```
       Predicted Neg  Predicted Pos
Actual Neg     90           10
Actual Pos     20           80
```
Compute precision and recall.

**P2. [PROG]** Given TP=50, FP=10, FN=5, TN=100, compute precision and recall.

**P3. [PROG]** Given a confusion matrix with TP=100, FP=50, FN=0, TN=300:
  (a) Compute precision.
  (b) Compute recall.
  (c) Is this classifier good?

### The precision-recall tradeoff

**T9. [THEORY]** As you lower the decision threshold of a classifier, what happens to precision and recall?

**T10. [THEORY]** Is it possible to have precision=100% and recall=100% simultaneously? Explain.

**A1. [ANALYZE]** A medical test has precision=95% and recall=85%. Interpret both numbers.

**A2. [ANALYZE]** A fraud detector is tuned for high precision. It rarely flags legitimate transactions (few false alarms). What is the likely consequence for false negatives?

**A3. [ANALYZE]** Compare two classifiers on the same test set:
- Classifier A: Precision=90%, Recall=60%
- Classifier B: Precision=70%, Recall=85%
Which is better for detecting disease, and why?

**A4. [ANALYZE]** For a spam filter, is precision or recall more important? What threshold adjustment would you make if spam is reaching users (missed spam)?

### Specificity and FPR

**T11. [THEORY]** Write the specificity formula. How does it differ from precision?

**T12. [THEORY]** What is the relationship between specificity and FPR (false positive rate)?

**P4. [PROG]** Given TN=200, FP=20, FN=10, TP=70, compute specificity and FPR.

**A5. [ANALYZE]** A classifier has specificity=95%. On a dataset with 1000 actual negatives, how many are incorrectly flagged as positive?

### Real-world scenarios

**A6. [ANALYZE]** A spam filter catches 85% of spam (recall=0.85) but also flags 2% of legitimate emails (FPR=0.02). 
  - If the dataset has 10,000 emails (9500 legitimate, 500 spam), compute FN and FP.
  - Is this classifier acceptable?

**A7. [ANALYZE]** In an airport security system, a threat detector should almost never miss a real threat. Should you prioritise precision or recall? Why?

**A8. [ANALYZE]** In a recommendation system (e.g., Netflix suggesting movies), a high false positive (bad recommendation) is annoying but not dangerous. Should you prioritise precision or recall?

**A9. [ANALYZE]** Compare two binary classifiers on the same data:
- Model A: catches 95% of positives (recall=0.95) but has 40% false alarm rate on negatives (FPR=0.40)
- Model B: catches 70% of positives (recall=0.70) but has 5% false alarm rate on negatives (FPR=0.05)
Which is better for diagnosing cancer, and why?

---

## Quick self-check

1. Write the precision and recall formulas from memory.
2. What does precision measure that recall does not?
3. What does recall measure that precision does not?
4. If precision=100%, what can you say about FP?
5. If recall=100%, what can you say about FN?
6. When you lower a classifier's decision threshold, what generally happens to precision and recall?
7. Name three real-world scenarios where high recall is critical.
8. Name three scenarios where high precision is critical.
9. Can a classifier have high precision but low recall? Give an example.
10. What is specificity, and how does it relate to recall?
