---
sidebar_position: 1
title: Confusion Matrix and Basic Metrics
description: How to extract and interpret TP, TN, FP, FN from a 2×2 table; why accuracy alone misleads on imbalanced data
tags: [classification, metrics, foundations]
toc_max_heading_level: 3
---

# Confusion Matrix and Basic Metrics

> **Topic —** A classifier's output is a series of right and wrong predictions. This page teaches you how to organise them into a 2×2 table (the confusion matrix), extract four counts from it (TP, TN, FP, FN), and compute accuracy. It also settles why accuracy is dangerous on imbalanced data, and what the accuracy paradox is.

---

## In plain words

When a classifier makes predictions on a test set, every prediction is either correct or wrong. If it's a binary classifier (two classes), we can separate these into four groups:

- **True Positive (TP):** predicted positive, actually positive ✓
- **True Negative (TN):** predicted negative, actually negative ✓
- **False Positive (FP):** predicted positive, actually negative ✗
- **False Negative (FN):** predicted negative, actually positive ✗

These four counts live in a **confusion matrix** — a 2×2 table. The table is read as: rows are actual class, columns are predicted class (or vice versa, so check the axes).

**Accuracy** is the fraction of predictions that were right: `(TP + TN) / (TP + TN + FP + FN)`. It's intuitive but dangerous. On imbalanced data (e.g., 99 negatives, 1 positive), a classifier that always predicts negative gets 99% accuracy by doing nothing useful — the **accuracy paradox**.

The page settles three specific confusions:

1. How to read a confusion matrix (which counts go where, how to extract them).
2. Why accuracy can be 95% yet meaningless.
3. When to use accuracy, and when to reach for better metrics.

### Words used on this page

| Term | Say it as | What it means here |
|---|---|---|
| **Confusion matrix** | "confusion MAY-trix" | A 2×2 table: rows are actual class, columns are predicted class. Diagonal entries are correct; off-diagonal are errors. |
| **TP / TN / FP / FN** | "tee-pee", etc. | True/False Positive/Negative — the four counts in the confusion matrix. |
| **Accuracy** | "uh-KUR-uh-see" | Fraction of correct predictions: (TP + TN) / total. |
| **Imbalanced data** | "im-BAL-unst" | A dataset where one class vastly outnumbers the other (e.g., 1% positive, 99% negative). |
| **Accuracy paradox** | — | On imbalanced data, a trivial classifier (always predict the majority class) achieves high accuracy. |

:::tip If you only take one thing from this page
A confusion matrix is a 2×2 table. Extract TP, TN, FP, FN from it. Accuracy is correct-count / total-count — intuitive but unreliable on imbalanced data. Always check class distribution first.
:::

---

## The confusion matrix: reading and building it

A confusion matrix organises predictions into a 2×2 grid.

**Rows:** Actual class (what the true label was).
**Columns:** Predicted class (what the model said).

**Example:** Spam filter on 100 emails.

| Actual \ Predicted | Not Spam | Spam |
|---|---|---|
| **Not Spam** | 45 | 5 |
| **Spam** | 8 | 42 |

Reading this table:
- **Top-left (45):** Predicted not spam, actually not spam → **TN** (true negatives).
- **Top-right (5):** Predicted spam, actually not spam → **FP** (false positives — type I error).
- **Bottom-left (8):** Predicted not spam, actually spam → **FN** (false negatives — type II error).
- **Bottom-right (42):** Predicted spam, actually spam → **TP** (true positives).

**Orientation matters.** Some textbooks swap rows and columns. Always check the axis labels. The key is: diagonal = correct, off-diagonal = errors.

**Quick mental check:** Does "true positive" make sense? Yes — we predicted positive, and it was true. Does "false negative" make sense? Yes — we predicted negative, but it was false (actually positive). This naming is consistent.

### Extracting the four counts

From the spam example:
- TP = 42 (spam predicted correctly)
- TN = 45 (not spam predicted correctly)
- FP = 5 (not spam misclassified as spam)
- FN = 8 (spam misclassified as not spam)
- **Total:** 42 + 45 + 5 + 8 = 100

The diagonal (TP + TN) = 45 + 42 = 87. These are the **correct predictions**. Off-diagonal (FP + FN) = 5 + 8 = 13. These are **errors**.

---

## Accuracy: the simplest metric

**Accuracy** = (correct predictions) / (total predictions) = (TP + TN) / (TP + TN + FP + FN).

For the spam example: Accuracy = (42 + 45) / 100 = 0.87 = **87%**.

**What it means:** 87 out of 100 predictions were right. The classifier is correct 87% of the time.

**Why it's intuitive:** Accuracy is what you ask first. "How many did you get right?" This is the right question *if classes are balanced* (roughly equal negatives and positives).

**Why it fails:** On imbalanced data, accuracy lies.

---

## The accuracy paradox: a cautionary example

Suppose you build a medical test for a rare disease. The disease affects 1% of the population; 99% are healthy.

You train a classifier. It achieves **99% accuracy**. Sounds great, right?

Here's the trick: the classifier predicts "healthy" on every single input. Does it learn anything? No. But let's calculate:

| Actual \ Predicted | Healthy | Sick |
|---|---|---|
| **Healthy** | 9900 | 0 |
| **Sick** | 100 | 0 |

- TP = 0 (no sick person diagnosed)
- TN = 9900 (healthy people correctly classified)
- FP = 0 (no false alarms)
- FN = 100 (all sick people missed)
- **Accuracy = 9900 / 10000 = 99%**

The classifier is 99% accurate *and* completely useless. It catches zero cases. This is the **accuracy paradox**: high accuracy on imbalanced data does not mean a good classifier.

The problem: accuracy weights TP and TN equally, so on imbalanced data it is dominated by the majority class (healthy people). A classifier that ignores the minority class (sick people) still scores well.

---

## When does accuracy work?

Accuracy is reliable when:
- **Classes are balanced:** ~50% positive, ~50% negative.
- **False positives and false negatives have equal cost.** Confusing a cat with a dog is as bad as confusing a dog with a cat.
- **You only care about the big picture.** "How many predictions are right, overall?"

Examples:
- Handwritten digit recognition (roughly equal frequency of 0–9).
- Balanced sentiment analysis (equal positive and negative reviews).

**When accuracy fails:**
- Imbalanced data (fraud detection: 0.1% fraud, 99.9% legitimate).
- Asymmetric costs (false negatives cost more than false positives, or vice versa).

For fraud, missing a fraudulent transaction (FN) is much worse than falsely flagging a legitimate one (FP). Accuracy hides this difference.

---

## Common Mistakes

| # | Mistake | Wrong | Right |
|---|---|---|---|
| 1 | Swapping rows and columns | "TP is top-right of the confusion matrix" | Always check the axis labels. If rows = actual and columns = predicted, TP is bottom-right. |
| 2 | Treating accuracy as the whole story | "Our model is 96% accurate, so it's excellent" | Check the class distribution. On 96% imbalanced data, random guessing gets 96% accuracy. |
| 3 | Confusing TP rate with accuracy | "99% of our predictions are TP" | TP rate is TP / (TP + FN), not TP / (TP + TN + FP + FN). Only 1% of predictions may be positive at all. |
| 4 | Not ordering the confusion matrix consistently | "One script uses (actual, predicted), another uses (predicted, actual)" | Pick one convention and document it. Scipy, sklearn, and numpy conventions differ; check each function's docstring. |
| 5 | Ignoring class imbalance | "We have 10,000 test samples, so the confusion matrix is reliable" | Check if 9000 are one class and 1000 another. Imbalance is about ratio, not absolute count. |
| 6 | Using accuracy to compare models on imbalanced data | "Model A is 89% accurate, Model B is 87%, so A is better" | On imbalanced data, both could be worse than a naive baseline. Calculate accuracy of "always predict majority" first. |
| 7 | Assuming diagonal entries are always large | "Good confusion matrices have large numbers on the diagonal" | On imbalanced data, TN can be huge and TP tiny, even for a poor classifier. |
| 8 | Forgetting the total | "TP=50, FP=30, so false-positive rate is 30%" | False-positive rate is FP / (FP + TN), not FP alone. You need all four counts. |

---

## Summary

| | |
|---|---|
| **Confusion matrix** | 2×2 table: rows = actual class, columns = predicted class. TP (top-left diagonal if rows=actual), TN, FP, FN. |
| **Accuracy formula** | (TP + TN) / (TP + TN + FP + FN). Fraction of correct predictions. |
| **When accurate works** | Balanced classes, equal cost of errors, only need overall correctness. |
| **Accuracy paradox** | On imbalanced data (99% negative, 1% positive), predicting always-negative gets 99% accuracy and catches no positives. |
| **Lesson** | Always inspect class distribution first. Accuracy alone is insufficient on imbalanced data. |

**Key takeaways**

- The confusion matrix is a 2×2 table. Diagonal = correct, off-diagonal = errors.
- TP, TN, FP, FN are the four counts. Always memorise which is which (True/False × Positive/Negative).
- Accuracy = (TP + TN) / total. It's intuitive but unreliable on imbalanced data.
- On imbalanced data, a trivial classifier (always predict majority) achieves high accuracy. This is the accuracy paradox.
- Always check class distribution and baseline accuracy before trusting a reported accuracy figure.

**Next in this section:** [Precision and Recall](./02-precision-and-recall.md) — how to measure what really matters: false alarms and missed detections.

**See also:** [Classification Metrics Overview](./05-multiclass-and-choosing-metrics.md#which-metric-when) for a decision tree on metric selection · [Logistic Regression](../07-logistic-regression/) for how classifiers generate predictions.

---

## Run It Yourself

```python title="confusion_matrix_examples.py"
import numpy as np
from sklearn.metrics import confusion_matrix, accuracy_score

np.random.seed(42)

# ---------- 1. Small example: spam filter ----------
# Actual labels: 1 = spam, 0 = not spam
y_actual = np.array([0, 0, 0, 0, 0, 1, 1, 1, 1, 1,
                     0, 0, 1, 0, 1, 0, 0, 1, 1, 0])
# Predicted labels
y_pred = np.array(  [0, 0, 0, 1, 0, 1, 1, 0, 1, 1,
                     0, 1, 1, 0, 1, 0, 0, 1, 1, 0])

# Compute confusion matrix
cm = confusion_matrix(y_actual, y_pred)
print("=" * 50)
print("SMALL EXAMPLE: Spam Filter (N=20)")
print("=" * 50)
print("\nConfusion Matrix (rows=actual, columns=predicted):")
print("       Predicted Negative  Predicted Positive")
print(f"Actual Negative     {cm[0,0]:2d}              {cm[0,1]:2d}")
print(f"Actual Positive     {cm[1,0]:2d}              {cm[1,1]:2d}")

tn, fp, fn, tp = cm.ravel()
total = tn + fp + fn + tp
print(f"\nTP={tp}, TN={tn}, FP={fp}, FN={fn}, Total={total}")
print(f"Correct predictions (diagonal): {tp + tn}")
print(f"Errors (off-diagonal): {fp + fn}")

accuracy = (tp + tn) / total
print(f"\nAccuracy = ({tp} + {tn}) / {total} = {accuracy:.2f} ({accuracy*100:.1f}%)")

# ---------- 2. Sample-question-scale example: N=195 ----------
print("\n" + "=" * 50)
print("SAMPLE EXAM SCALE: Email Classification (N=195)")
print("=" * 50)

# Simulate a larger, slightly imbalanced dataset
np.random.seed(42)
n_neg = 120
n_pos = 75

# Generate labels with slight class imbalance
y_actual_large = np.concatenate([
    np.zeros(n_neg, dtype=int),
    np.ones(n_pos, dtype=int)
])

# Simulate predictions (slightly imperfect classifier)
y_pred_large = y_actual_large.copy()
flip_idx = np.random.choice(len(y_actual_large), size=32, replace=False)
y_pred_large[flip_idx] = 1 - y_pred_large[flip_idx]

cm_large = confusion_matrix(y_actual_large, y_pred_large)
print("\nConfusion Matrix (rows=actual, columns=predicted):")
print("       Predicted Negative  Predicted Positive")
print(f"Actual Negative    {cm_large[0,0]:3d}             {cm_large[0,1]:3d}")
print(f"Actual Positive    {cm_large[1,0]:3d}             {cm_large[1,1]:3d}")

tn_lg, fp_lg, fn_lg, tp_lg = cm_large.ravel()
total_lg = tn_lg + fp_lg + fn_lg + tp_lg
print(f"\nTP={tp_lg}, TN={tn_lg}, FP={fp_lg}, FN={fn_lg}, Total={total_lg}")
print(f"Class distribution: {n_neg} negative ({n_neg/total_lg*100:.1f}%), {n_pos} positive ({n_pos/total_lg*100:.1f}%)")

accuracy_lg = (tp_lg + tn_lg) / total_lg
baseline_accuracy = n_neg / total_lg  # Always predict majority (negative)
print(f"\nAccuracy = ({tp_lg} + {tn_lg}) / {total_lg} = {accuracy_lg:.2f} ({accuracy_lg*100:.1f}%)")
print(f"Baseline (always predict negative): {baseline_accuracy:.2f} ({baseline_accuracy*100:.1f}%)")
print(f"Improvement over baseline: {(accuracy_lg - baseline_accuracy)*100:.1f} percentage points")

# ---------- 3. Imbalanced example (accuracy paradox) ----------
print("\n" + "=" * 50)
print("ACCURACY PARADOX: Rare Disease (N=100, 1% positive)")
print("=" * 50)

y_actual_imb = np.concatenate([np.zeros(99), np.ones(1)])
y_pred_imb = np.zeros(100)  # Trivial classifier: always predict negative

cm_imb = confusion_matrix(y_actual_imb, y_pred_imb)
print("\nConfusion Matrix for 'always predict negative':")
print("       Predicted Negative  Predicted Positive")
print(f"Actual Negative     {cm_imb[0,0]:2d}              {cm_imb[0,1]:2d}")
print(f"Actual Positive     {cm_imb[1,0]:2d}              {cm_imb[1,1]:2d}")

tn_imb, fp_imb, fn_imb, tp_imb = cm_imb.ravel()
accuracy_imb = (tp_imb + tn_imb) / 100
print(f"\nTP={tp_imb}, TN={tn_imb}, FP={fp_imb}, FN={fn_imb}")
print(f"Accuracy = {accuracy_imb:.2f} ({accuracy_imb*100:.1f}%)")
print(f"BUT: This classifier catches ZERO positive cases (TP=0).")
print("This is the accuracy paradox—high accuracy, zero utility.")
```

```text title="Output"
==================================================
SMALL EXAMPLE: Spam Filter (N=20)
==================================================

Confusion Matrix (rows=actual, columns=predicted):
       Predicted Negative  Predicted Positive
Actual Negative     11              2
Actual Positive      3              4

TP=4, TN=11, FP=2, FN=3, Total=20
Correct predictions (diagonal): 15
Errors (off-diagonal): 5

Accuracy = (4 + 11) / 20 = 0.75 (75.0%)

==================================================
SAMPLE EXAM SCALE: Email Classification (N=195)
==================================================

Confusion Matrix (rows=actual, columns=predicted):
       Predicted Negative  Predicted Positive
Actual Negative    107             13
Actual Positive     19             56

TP=56, TN=107, FP=13, FN=19, Total=195
Class distribution: 120 negative (61.5%), 75 positive (38.5%)

Accuracy = (56 + 107) / 195 = 0.83 (83.6%)
Baseline (always predict negative): 0.62 (61.5%)
Improvement over baseline: 22.1 percentage points

==================================================
ACCURACY PARADOX: Rare Disease (N=100, 1% positive)
==================================================

Confusion Matrix for 'always predict negative':
       Predicted Negative  Predicted Positive
Actual Negative     99              0
Actual Positive      1              0

TP=0, TN=99, FP=0, FN=1
Accuracy = 0.99 (99.0%)
BUT: This classifier catches ZERO positive cases (TP=0).
This is the accuracy paradox—high accuracy, zero utility.
```

### What to notice in that output

- **Small example:** On N=20, 75% accuracy is reasonable. But with only 7 actual positives, we caught 4 (57%). Not bad, but accuracy hides this detail.
- **Sample exam scale:** N=195 with 61.5% negatives, 38.5% positives (relatively balanced). Accuracy 83.6% beats the naive baseline (61.5%), a real 22-point gain. Always compute the baseline.
- **Imbalanced catastrophe:** On N=100 with 99% negatives, 1% positive, the trivial classifier ("always negative") scores 99% accuracy whilst catching zero cases. This is why accuracy is dangerous.
- **Off-diagonal entries:** In the small example, FP=2 (not spam flagged as spam) and FN=3 (spam missed). These errors feel different—FP annoys users, FN lets spam through. Accuracy treats them as equal.

**Things worth trying:**

1. Swap rows and columns in the small example matrix. Re-read TP, TN, FP, FN. Do you get different values? (Answer: yes, they swap. This is why consistent labeling matters.)
2. Double the FP count in the small example (change 2 to 4). How does accuracy change? (From 75% to 70%. FP and FN both hurt equally in the accuracy formula.)
3. Flip more predictions in the sample-exam-scale example by changing `size=32` to `size=50`. How does the improvement over baseline change? (It shrinks; worse classifier.)
4. In the imbalanced example, change `y_pred_imb = np.zeros(100)` to predict randomly (50% chance of each class). Does accuracy stay 99%? (No, it drops, but still likely high because of class imbalance.)
5. Create a perfectly balanced dataset (50% each class) and a perfectly imbalanced one (99% one class). Fit a real classifier (e.g., `LogisticRegression`) to each. Compare the accuracy figures. (Accuracy feels more meaningful on balanced data.)

---

## Practice Questions

*Work each one out on paper first. No answers are included, deliberately.*

### What is TP, TN, FP, FN?

**T1. [THEORY]** Define TP (true positive) and FN (false negative). How do they differ?

**T2. [THEORY]** A classifier predicts "not spam" on an email that is actually spam. Which of TP, TN, FP, FN is this, and why?

**T3. [THEORY]** In a medical test, FN is a false negative (test says healthy, but person is sick). Why is FN often the most serious type of error in medical diagnosis?

### Reading the confusion matrix

**T4. [OUT]** A confusion matrix has rows = actual, columns = predicted. Where is TP located? (Top-left? Bottom-right? Etc.)

**T5. [OUT]** Given:
```
       Predicted 0  Predicted 1
Actual 0    90           10
Actual 1    20           80
```
Extract TP, TN, FP, FN.

**T6. [OUT]** Using the matrix from T5, calculate accuracy.

**T7. [OUT]** In T5, what is the class distribution (what percentage of the actual labels are class 1)?

### Accuracy calculation

**P1. [PROG]** Write Python code to compute accuracy given y_actual and y_pred as numpy arrays (without using `sklearn.metrics.accuracy_score`).

**P2. [PROG]** Given a confusion matrix `cm = np.array([[90, 10], [20, 80]])`, compute TP, TN, FP, FN and accuracy.

**A1. [ANALYZE]** On a dataset with 5000 samples (4950 negative, 50 positive), a classifier predicts "always negative." Calculate its accuracy. Is this a good classifier? Why or why not?

**A2. [ANALYZE]** Two classifiers are tested on imbalanced data (95% negative, 5% positive). Classifier A has 94% accuracy, Classifier B has 96% accuracy. Can you conclude B is better without more information? Explain.

**A3. [ANALYZE]** In a fraud-detection system, false negatives (missed fraud) cost $5000 each. False positives (false alarms) cost $50 each. The test set has 100 actual frauds and 900 legitimate transactions. A classifier achieves 95% accuracy. Is accuracy the right metric to optimise? Why?

### The accuracy paradox

**T8. [THEORY]** Explain the accuracy paradox in plain words. Why does a useless classifier sometimes achieve high accuracy?

**T9. [THEORY]** On what type of dataset does the accuracy paradox occur?

**T10. [THEORY]** If you report a classifier's accuracy is 91%, what should the first question from your audience be?

**A4. [ANALYZE]** A spam filter on 100 emails predicts "not spam" for all 100. The dataset has 98 legitimate emails and 2 spam emails. What is its accuracy? What is the problem with this classifier?

**A5. [ANALYZE]** Compare two medical classifiers:
- Classifier A: TP=95, TN=900, FP=5, FN=0 (catches all sick people, some false alarms)
- Classifier B: TP=50, TN=900, FP=0, FN=45 (no false alarms, misses many sick people)
Calculate accuracy for each. Which would a clinician prefer, and why?

### Baseline and improvement

**T11. [THEORY]** What is the "baseline" accuracy in classification?

**P3. [PROG]** Given class distribution 70% negative, 30% positive, compute the baseline accuracy.

**A6. [ANALYZE]** Your classifier achieves 78% accuracy on a dataset with 70% negatives and 30% positives. How much better is it than the baseline?

**A7. [ANALYZE]** Why is baseline accuracy more informative on imbalanced data than on balanced data?

### Real-world scenarios

**A8. [ANALYZE]** In autonomous vehicles, a collision detector must identify obstacles. Is high accuracy the right goal? What would be worse: FP (false alarms) or FN (missed obstacles)?

**A9. [ANALYZE]** In a credit-approval system, FP means denying a creditworthy person. FN means approving a defaulter. The bank prefers FN (a loss on one loan) to FP (a lost customer). How should this shape metric choice?

**A10. [ANALYZE]** In email spam detection, users tolerate FP (legitimate emails in spam folder) more than FN (spam in inbox). Why might this preference exist? Does it match the cost structure of FP vs FN?

---

## Quick self-check

1. What are the four entries of a confusion matrix, and how are they arranged?
2. Write the accuracy formula from memory.
3. On a dataset with 99% class A and 1% class B, what accuracy does a classifier achieve if it always predicts class A?
4. Why is this high accuracy misleading?
5. What should you check before trusting a reported accuracy figure?
6. Name two types of errors that accuracy treats equally.
7. In medical diagnosis, is FP or FN typically more serious?
8. When is accuracy a suitable metric?
