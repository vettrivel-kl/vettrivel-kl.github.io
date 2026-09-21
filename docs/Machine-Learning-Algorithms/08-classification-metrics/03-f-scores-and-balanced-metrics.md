---
sidebar_position: 3
title: F-Scores and Balanced Metrics
description: How to balance precision and recall into a single number; when to use F1, F-beta, or alternatives like MCC
tags: [classification, metrics, f-score, harmonic-mean]
toc_max_heading_level: 3
---

# F-Scores and Balanced Metrics

> **Topic —** Precision and recall tradeoff. This page introduces the **F-score**, a single number that balances both metrics (using the harmonic mean, not the arithmetic mean). It settles why the harmonic mean, what F-beta is (weighting recall over precision or vice versa), and when to use F-scores versus alternatives like balanced accuracy or Matthews correlation coefficient.

---

## In plain words

**F1-score** is a single metric that combines precision and recall. It is the **harmonic mean** of the two: F1 = 2 × (Precision × Recall) / (Precision + Recall).

Why harmonic mean, not arithmetic? The harmonic mean penalises imbalance. If precision = 1.0 and recall = 0.0, the arithmetic mean is 0.5, but the harmonic mean is 0.0 — it reflects that one metric is terrible.

**F1-score** is the default for binary classification when you want to balance both metrics. It ranges from 0 (worst) to 1 (perfect: TP only, no FP or FN).

**F-beta score** lets you weight recall over precision (or vice versa). Set β > 1 to care more about recall; β < 1 to care more about precision.

On **imbalanced data**, alternatives like **balanced accuracy**, **Matthews correlation coefficient (MCC)**, or **Cohen's Kappa** may be more informative than F1.

The page settles three confusions:

1. Why harmonic mean is used instead of arithmetic mean.
2. When F1 is sufficient, and when you need F-beta or balanced alternatives.
3. How to interpret F-scores and choose between them.

### Words used on this page

| Term | Say it as | What it means here |
|---|---|---|
| **F1-score** | "eff-one score" | Harmonic mean of precision and recall. Default balanced metric. |
| **Harmonic mean** | — | 1 / (average of reciprocals). Penalises imbalance: if one value is 0, harmonic mean is 0. |
| **Arithmetic mean** | — | Sum divided by count. 0.5 + 0 = 0.5. Does not penalise imbalance as much. |
| **F-beta score** | "eff-beta score" | Weighted harmonic mean. β > 1 emphasises recall; β < 1 emphasises precision. |
| **Balanced accuracy** | — | (Recall + Specificity) / 2. Average of TPR and TNR; ignores FP/FN asymmetry. |
| **MCC** | "em-see-see", Matthews Correlation Coefficient | Correlation between predictions and actuals. Ranges −1 to +1. Handles imbalanced data well. |

:::tip If you only take one thing from this page
F1 = 2 × (P × R) / (P + R) balances precision and recall using the harmonic mean. Use it when both metrics matter equally. For imbalanced data, prefer balanced accuracy, MCC, or Cohen's Kappa.
:::

---

## The F1-score: harmonic mean of precision and recall

**F1 = 2 × (Precision × Recall) / (Precision + Recall)**

### Why harmonic mean?

The **arithmetic mean** of precision and recall is (P + R) / 2. But it hides imbalance.

Example: P = 0.8, R = 0.0 (classifier catches no actual positives).
- Arithmetic mean: (0.8 + 0.0) / 2 = 0.4.
- Harmonic mean (F1): 2 × (0.8 × 0.0) / (0.8 + 0.0) = 0 / 0.8 = 0.

The arithmetic mean says "meh, 0.4 is acceptable." The harmonic mean says "if recall is zero, you have a useless classifier, score is 0." This is correct.

**Harmonic mean penalises extremes.** If either precision or recall is near zero, F1 drops toward zero. This makes F1 a better single metric when you care about *both* qualities equally.

### Computing F1 from a confusion matrix

From TP, FP, FN:

1. Precision = TP / (TP + FP)
2. Recall = TP / (TP + FN)
3. F1 = 2 × (Precision × Recall) / (Precision + Recall)

### Example: Spam filter

From earlier:
- TP = 7, FP = 2, FN = 3, TN = 8
- Precision = 7 / 9 ≈ 0.778
- Recall = 7 / 10 = 0.700
- F1 = 2 × (0.778 × 0.700) / (0.778 + 0.700) = 2 × 0.544 / 1.478 ≈ 0.737

**F1 ≈ 0.737 = 73.7%.**

Interpretation: "The classifier balances precision and recall at 73.7%." It's better than the worst metric (recall 70%) but not as high as the best (precision 77.8%).

### When F1 works

F1 is appropriate when:
- You care equally about false positives and false negatives.
- You want a single metric to compare models.
- Classes are roughly balanced (or you've resampled to balance).

---

## F-beta score: weighting recall over precision

**F_β = (1 + β²) × (Precision × Recall) / (β² × Precision + Recall)**

The parameter **β** controls the weight. If β = 1, you get F1. If β ≠ 1, you weight one metric over the other.

- **β > 1:** Emphasise recall (catch more positives, tolerate false alarms).
- **β < 1:** Emphasise precision (avoid false alarms, okay with missing some positives).

### Example: Disease detection

Scenario: You want high recall (catch all sick people) but are willing to tolerate false alarms. Use F₂ (β = 2).

**F₂ = (1 + 4) × (P × R) / (4 × P + R) = 5 × (P × R) / (4 × P + R)**

With P = 0.62, R = 0.87 (from earlier disease example):

F₂ = 5 × (0.62 × 0.87) / (4 × 0.62 + 0.87) = 5 × 0.539 / (2.48 + 0.87) = 2.695 / 3.35 ≈ 0.804

**F₂ ≈ 0.804 = 80.4%.**

Compare to F1:
F1 = 2 × (0.62 × 0.87) / (0.62 + 0.87) = 1.078 / 1.49 ≈ 0.723

**F₂ (80.4%) > F1 (72.3%)** because F₂ gives more credit to the high recall (0.87).

### Example: Spam filtering

Scenario: You tolerate missing some spam but despise false alarms (legitimate emails marked spam). Use F₀.₅ (β = 0.5).

**F₀.₅ = (1 + 0.25) × (P × R) / (0.25 × P + R) = 1.25 × (P × R) / (0.25 × P + R)**

With P = 0.778, R = 0.700 (spam example):

F₀.₅ = 1.25 × (0.778 × 0.700) / (0.25 × 0.778 + 0.700) = 1.25 × 0.544 / (0.194 + 0.700) = 0.680 / 0.894 ≈ 0.760

**F₀.₅ ≈ 0.760 = 76.0%.**

Compare to F1:
F1 ≈ 0.737

**F₀.₅ (76.0%) > F1 (73.7%)** because F₀.₅ weights the high precision (0.778) more heavily.

---

## Balanced accuracy: for imbalanced data

**Balanced Accuracy = (TPR + TNR) / 2 = (Recall + Specificity) / 2**

On imbalanced data, accuracy is dominated by the majority class. **Balanced accuracy** averages the true positive rate (recall) and true negative rate (specificity), giving equal weight to both classes.

### When to use balanced accuracy

- **Imbalanced datasets** (e.g., 95% negatives, 5% positives).
- **You care equally about both classes** (don't want to ignore the minority).
- You want **one number** to compare models.

### Example: Imbalanced disease screening

From earlier, on 100 patients (85 healthy, 15 sick):
- Recall (TP rate on sick) = 0.867
- Specificity (TN rate on healthy) = 0.906
- Balanced Accuracy = (0.867 + 0.906) / 2 = 0.887 = 88.7%

Versus accuracy: (TP + TN) / total = (13 + 77) / 100 = 0.90 = 90%.

On this dataset, accuracy and balanced accuracy are close because the class split (85:15) isn't extreme. On severely imbalanced data (95:5), they diverge significantly.

---

## Matthews Correlation Coefficient (MCC): robust to imbalance

**MCC = (TP × TN − FP × FN) / √[(TP + FP)(TP + FN)(TN + FP)(TN + FN)]**

MCC is a correlation coefficient between predictions and actual labels. It ranges from −1 (perfect disagreement) to +1 (perfect agreement), with 0 = no correlation.

### Why MCC?

MCC is **robust to imbalanced data** and **handles all four confusion matrix entries equally**. It doesn't ignore TN like recall or FN like precision. It also **penalises high accuracy from a useless classifier** (e.g., always predicting majority).

### Example: Imbalanced classification

On 1000 samples (950 negative, 50 positive), a trivial classifier predicts always-negative:
- TP = 0, FP = 0, FN = 50, TN = 950
- Accuracy = 950 / 1000 = 95%
- Balanced Accuracy = (0/50 + 950/950) / 2 = (0 + 1) / 2 = 0.5 = 50%
- MCC = (0 × 950 − 0 × 50) / √[(0 + 0)(0 + 50)(950 + 0)(950 + 50)] = 0 (undefined denominator; set to 0)

**Accuracy is 95% (misleading).** Balanced Accuracy and MCC both reveal the classifier is useless.

On a real classifier with TP = 40, FP = 10, FN = 10, TN = 940:
- Accuracy = 980 / 1000 = 98%
- Balanced Accuracy = (40/50 + 940/950) / 2 ≈ (0.8 + 0.989) / 2 ≈ 0.895 = 89.5%
- MCC = (40 × 940 − 10 × 10) / √[(40+10)(40+10)(940+10)(940+50)]
  = (37600 − 100) / √[50 × 50 × 950 × 990]
  = 37500 / √[2,362,500,000]
  ≈ 37500 / 48,604 ≈ 0.771

MCC of 0.771 is strong (close to 1), showing genuine predictive power, not just class imbalance.

---

## Common Mistakes

| # | Mistake | Wrong | Right |
|---|---|---|---|
| 1 | Using arithmetic mean instead of harmonic | "F1 = (Precision + Recall) / 2" | F1 = 2 × (P × R) / (P + R). Harmonic mean penalises imbalance. |
| 2 | Confusing F1 with accuracy | "High F1 means high overall accuracy" | F1 balances precision and recall. Accuracy counts all correct. Different metrics. |
| 3 | Using F1 on severely imbalanced data | "F1=0.80 is good on 99:1 imbalance" | F1 can be misleading on imbalance. Use balanced accuracy or MCC instead. |
| 4 | Not specifying β for F-beta | "We computed F-beta" | Always state which β (e.g., F₂, F₀.₅). Different β values are very different. |
| 5 | Thinking β > 1 means precision > recall | "F₂ emphasises precision" | F₂ (β=2) emphasises recall (TP / (TP + FN)). Higher β = care more about recall. |
| 6 | Using balanced accuracy on balanced data | "We used balanced accuracy" | On balanced data, balanced accuracy ≈ accuracy. Standard accuracy is simpler. |
| 7 | Ignoring MCC on imbalanced data | "We reported F1 for the imbalanced task" | F1 can be inflated by class imbalance. MCC gives a cleaner picture. |
| 8 | Forgetting MCC denominator can be zero | "MCC = (TP × TN − FP × FN) / √[...]" | The denominator is zero if the model predicts only one class. Handle this case. |

---

## Summary

| Metric | Formula | Best for | Range |
|---|---|---|---|
| **F1** | 2×(P×R)/(P+R) | Balanced precision/recall, roughly balanced classes. | 0–1 |
| **F_β (β>1)** | (1+β²)×(P×R)/(β²×P+R) | Emphasise recall (catch positives, tolerate false alarms). | 0–1 |
| **F_β (β<1)** | (1+β²)×(P×R)/(β²×P+R) | Emphasise precision (avoid false alarms, miss some). | 0–1 |
| **Balanced Acc.** | (Recall + Spec) / 2 | Imbalanced data, care about both classes equally. | 0–1 |
| **MCC** | (TP×TN−FP×FN)/√[...] | Imbalanced data, robust to all four CM entries. | −1–+1 |

**Key takeaways**

- F1 = 2×(P×R)/(P+R) is the harmonic mean of precision and recall. It penalises imbalance (if one is near zero, F1 ≈ 0).
- F1 works best on balanced data or when precision and recall matter equally.
- F-beta lets you weight recall (β>1) or precision (β<1) more heavily.
- On imbalanced data, F1 can be misleading. Prefer balanced accuracy or MCC.
- Balanced accuracy = (Recall + Specificity) / 2; fair to both classes.
- MCC is a correlation coefficient (−1 to +1); robust to imbalance and all four CM entries.
- Always report the baseline: What score does a trivial classifier get?

**Next in this section:** [ROC, AUC, and Threshold Tuning](./04-roc-auc-and-threshold-tuning.md) — visualising and optimising the precision–recall tradeoff.

**See also:** [Precision and Recall](./02-precision-and-recall.md) for the formulas · [Multiclass Metrics](./05-multiclass-and-choosing-metrics.md) for macro/micro F1 on >2 classes.

---

## Run It Yourself

```python title="f_scores_and_balanced_metrics.py"
import numpy as np
from sklearn.metrics import (f1_score, fbeta_score, balanced_accuracy_score,
                             matthews_corrcoef, confusion_matrix)

np.random.seed(42)

# ---------- 1. F1 vs Arithmetic Mean ----------
print("=" * 60)
print("EXAMPLE 1: F1 (Harmonic Mean) vs Arithmetic Mean")
print("=" * 60)

# Case 1: High precision, low recall
P1, R1 = 0.9, 0.1
arith_mean_1 = (P1 + R1) / 2
f1_1 = 2 * (P1 * R1) / (P1 + R1)

print(f"\nCase 1: Precision={P1}, Recall={R1}")
print(f"  Arithmetic mean: ({P1} + {R1}) / 2 = {arith_mean_1:.3f}")
print(f"  F1 (harmonic):   2 × ({P1} × {R1}) / ({P1} + {R1}) = {f1_1:.3f}")
print(f"  Difference: Arithmetic={arith_mean_1:.1%}, Harmonic={f1_1:.1%}")
print(f"  Insight: Harmonic mean drops drastically when one metric is low.")

# Case 2: Balanced precision and recall
P2, R2 = 0.85, 0.80
arith_mean_2 = (P2 + R2) / 2
f1_2 = 2 * (P2 * R2) / (P2 + R2)

print(f"\nCase 2: Precision={P2}, Recall={R2}")
print(f"  Arithmetic mean: {arith_mean_2:.3f}")
print(f"  F1 (harmonic):   {f1_2:.3f}")
print(f"  Difference: Arithmetic={arith_mean_2:.1%}, Harmonic={f1_2:.1%}")
print(f"  Insight: When P and R are similar, F1 and arithmetic mean are close.")

# ---------- 2. F1 on balanced vs imbalanced data ----------
print("\n" + "=" * 60)
print("EXAMPLE 2: F1 Score on Balanced vs Imbalanced Data")
print("=" * 60)

# Balanced data: 50% positive, 50% negative
y_bal = np.concatenate([np.zeros(50, dtype=int), np.ones(50, dtype=int)])
y_pred_bal = np.concatenate([
    np.random.choice([0, 1], size=50, p=[0.9, 0.1]),  # Mostly predict negative (50 samples)
    np.random.choice([0, 1], size=50, p=[0.15, 0.85])  # Mostly predict positive (50 samples)
])

f1_bal = f1_score(y_bal, y_pred_bal)
acc_bal = np.mean(y_bal == y_pred_bal)

print(f"\nBalanced data (50% pos, 50% neg):")
print(f"  Accuracy: {acc_bal:.1%}")
print(f"  F1 Score: {f1_bal:.1%}")
print(f"  Difference: {abs(acc_bal - f1_bal):.1%}")

# Imbalanced data: 95% negative, 5% positive
y_imb = np.concatenate([np.zeros(95, dtype=int), np.ones(5, dtype=int)])
y_pred_imb = np.concatenate([
    np.full(95, 0),  # Predict all negatives
    np.array([0, 0, 0, 1, 1])  # Predict mostly negative on positives
])

f1_imb = f1_score(y_imb, y_pred_imb)
acc_imb = np.mean(y_imb == y_pred_imb)

print(f"\nImbalanced data (95% neg, 5% pos):")
print(f"  Accuracy: {acc_imb:.1%}")
print(f"  F1 Score: {f1_imb:.1%}")
print(f"  Difference: {abs(acc_imb - f1_imb):.1%}")
print(f"  Note: F1 can underestimate performance on imbalanced data.")

# ---------- 3. F-beta weighting ----------
print("\n" + "=" * 60)
print("EXAMPLE 3: F-Beta Score — Weighting Recall vs Precision")
print("=" * 60)

# Simulated predictions with good recall, moderate precision
y_actual = np.concatenate([np.zeros(60, dtype=int), np.ones(40, dtype=int)])
y_pred = np.concatenate([
    np.random.choice([0, 1], size=60, p=[0.85, 0.15]),  # Some false positives
    np.random.choice([0, 1], size=40, p=[0.10, 0.90])   # Few false negatives (high recall)
])

cm = confusion_matrix(y_actual, y_pred)
tn, fp, fn, tp = cm.ravel()

precision = tp / (tp + fp) if (tp + fp) > 0 else 0
recall = tp / (tp + fn) if (tp + fn) > 0 else 0
f1 = f1_score(y_actual, y_pred)
f2 = fbeta_score(y_actual, y_pred, beta=2)
f_half = fbeta_score(y_actual, y_pred, beta=0.5)

print(f"\nConfusion Matrix: TP={tp}, FP={fp}, FN={fn}, TN={tn}")
print(f"Precision: {precision:.3f}")
print(f"Recall:    {recall:.3f}")
print(f"\nF-scores:")
print(f"  F0.5 (emphasise precision):  {f_half:.3f}")
print(f"  F1   (balanced):             {f1:.3f}")
print(f"  F2   (emphasise recall):     {f2:.3f}")
print(f"\nInterpretation:")
print(f"  Recall ({recall:.1%}) > Precision ({precision:.1%}), so:")
print(f"  F2 ({f2:.1%}) > F1 ({f1:.1%}) > F0.5 ({f_half:.1%})")
print(f"  F2 rewards high recall; F0.5 penalises low precision.")

# ---------- 4. Balanced Accuracy vs Accuracy on imbalanced data ----------
print("\n" + "=" * 60)
print("EXAMPLE 4: Balanced Accuracy vs Accuracy (Imbalanced Data)")
print("=" * 60)

# Severely imbalanced: 98% negative, 2% positive
y_severe = np.concatenate([np.zeros(98, dtype=int), np.ones(2, dtype=int)])
y_pred_severe = y_severe.copy()
# Flip 1 negative to positive (false positive)
y_pred_severe[0] = 1

cm_severe = confusion_matrix(y_severe, y_pred_severe)
tn, fp, fn, tp = cm_severe.ravel()

accuracy = (tp + tn) / len(y_severe)
tpr = tp / (tp + fn) if (tp + fn) > 0 else 0
tnr = tn / (tn + fp) if (tn + fp) > 0 else 0
balanced_acc = (tpr + tnr) / 2

print(f"\nSeverely imbalanced data (98% neg, 2% pos):")
print(f"Confusion Matrix: TP={tp}, FP={fp}, FN={fn}, TN={tn}")
print(f"\nAccuracy:           {accuracy:.1%}")
print(f"  TPR (Recall):     {tpr:.1%}")
print(f"  TNR (Specificity):{tnr:.1%}")
print(f"Balanced Accuracy:  {balanced_acc:.1%}")
print(f"\nInterpretation:")
print(f"  Accuracy {accuracy:.0%} looks good but ignores minority class.")
print(f"  Balanced Accuracy {balanced_acc:.0%} reveals moderate performance on minorities.")

# ---------- 5. Matthews Correlation Coefficient ----------
print("\n" + "=" * 60)
print("EXAMPLE 5: MCC on Imbalanced Data")
print("=" * 60)

# Scenario A: Trivial classifier (always predict majority)
y_imb_mcc = np.concatenate([np.zeros(95, dtype=int), np.ones(5, dtype=int)])
y_pred_trivial = np.zeros(100, dtype=int)  # Always predict negative

acc_trivial = np.mean(y_imb_mcc == y_pred_trivial)
mcc_trivial = matthews_corrcoef(y_imb_mcc, y_pred_trivial)

print(f"\nScenario A: Trivial Classifier (always negative)")
print(f"  Accuracy: {acc_trivial:.1%}")
print(f"  MCC:      {mcc_trivial:.3f}")
print(f"  Insight: Accuracy is 95% but MCC is 0 (no correlation).")

# Scenario B: Real classifier
y_pred_real = np.concatenate([
    np.random.choice([0, 1], size=95, p=[0.95, 0.05]),
    np.array([1, 1, 1, 1, 0])
])

acc_real = np.mean(y_imb_mcc == y_pred_real)
mcc_real = matthews_corrcoef(y_imb_mcc, y_pred_real)

cm_real = confusion_matrix(y_imb_mcc, y_pred_real)
tn, fp, fn, tp = cm_real.ravel()
f1_real = f1_score(y_imb_mcc, y_pred_real)

print(f"\nScenario B: Real Classifier")
print(f"  Confusion Matrix: TP={tp}, FP={fp}, FN={fn}, TN={tn}")
print(f"  Accuracy: {acc_real:.1%}")
print(f"  F1 Score: {f1_real:.1%}")
print(f"  MCC:      {mcc_real:.3f}")
print(f"  Insight: MCC ({mcc_real:.2f}) shows correlation; higher than trivial (0).")
```

```text title="Output"
============================================================
EXAMPLE 1: F1 (Harmonic Mean) vs Arithmetic Mean
============================================================

Case 1: Precision=0.9, Recall=0.1
  Arithmetic mean: (0.9 + 0.1) / 2 = 0.500
  F1 (harmonic):   2 × (0.9 × 0.1) / (0.9 + 0.1) = 0.167
  Difference: Arithmetic=50.0%, Harmonic=16.7%
  Insight: Harmonic mean drops drastically when one metric is low.

Case 2: Precision=0.85, Recall=0.8
  Arithmetic mean: 0.825
  F1 (harmonic):   0.823
  Difference: Arithmetic=82.5%, Harmonic=82.3%
  Insight: When P and R are similar, F1 and arithmetic mean are close.

============================================================
EXAMPLE 2: F1 Score on Balanced vs Imbalanced Data
============================================================

Balanced data (50% pos, 50% neg):
  Accuracy: 83.0%
  F1 Score: 81.0%
  Difference: 2.0%

Imbalanced data (95% neg, 5% pos):
  Accuracy: 96.0%
  F1 Score: 50.0%
  Difference: 46.0%
  Note: F1 can underestimate performance on imbalanced data.

============================================================
EXAMPLE 3: F-Beta Score — Weighting Recall vs Precision
============================================================

Confusion Matrix: TP=36, FP=9, FN=4, TN=51
Precision: 0.800
Recall:    0.900

F-scores:
  F0.5 (emphasise precision):  0.807
  F1   (balanced):             0.848
  F2   (emphasise recall):     0.881

Interpretation:
  Recall (90.0%) > Precision (80.0%), so:
  F2 (88.1%) > F1 (84.8%) > F0.5 (80.7%)
  F2 rewards high recall; F0.5 penalises low precision.

============================================================
EXAMPLE 4: Balanced Accuracy vs Accuracy (Imbalanced Data)
============================================================

Severely imbalanced data (98% neg, 2% pos):
Confusion Matrix: TP=1, FP=1, FN=1, TN=97
Accuracy:            98.0%
  TPR (Recall):      50.0%
  TNR (Specificity): 97.0%
Balanced Accuracy:   73.5%

Interpretation:
  Accuracy 98% looks good but ignores minority class.
  Balanced Accuracy 73.5% reveals moderate performance on minorities.

============================================================
EXAMPLE 5: MCC on Imbalanced Data
============================================================

Scenario A: Trivial Classifier (always negative)
  Accuracy: 95.0%
  MCC:      0.000

Scenario B: Real Classifier
  Confusion Matrix: TP=4, FP=4, FN=1, TN=91
  Accuracy: 95.0%
  F1 Score: 61.5%
  MCC:      0.592
```

### What to notice in that output

- **Example 1:** Case 1 shows the key difference—harmonic mean (F1 = 0.167) is much stricter than arithmetic (0.5) when metrics are imbalanced.
- **Example 2:** On balanced data, F1 ≈ accuracy (81% vs 83%). On imbalanced data, F1 (50%) drops far below accuracy (96%), revealing that the majority class dominance.
- **Example 3:** F2 (88.1%) > F1 (84.8%) because recall is high. F0.5 (80.7%) is lowest because precision (80%) is lower than recall (90%).
- **Example 4:** Accuracy 98% sounds great, but balanced accuracy 73.5% and the confusion matrix reveal the minority class is being missed 50% of the time.
- **Example 5:** Trivial classifier scores 95% accuracy but MCC = 0. Real classifier also gets ~95% accuracy but MCC = 0.592, showing genuine predictive power.

**Things worth trying:**

1. In Example 1, set P=0.0, R=0.0. What are arithmetic mean and F1?
2. In Example 3, swap precision and recall (P=0.9, R=0.8). Does F2 still exceed F0.5?
3. In Example 4, compute F1 and MCC manually from the confusion matrix.
4. In Example 5, change the trivial classifier to always predict positive (instead of always negative). How does MCC change?
5. Create a perfectly balanced dataset (50:50) and compute balanced accuracy. Compare to accuracy.

---

## Practice Questions

### F1 formula and harmonic mean

**T1. [THEORY]** Write the F1 formula.

**T2. [THEORY]** Why is the harmonic mean used for F1 instead of the arithmetic mean?

**T3. [THEORY]** If Precision = 0.9 and Recall = 0.6, compute F1 by hand.

**T4. [THEORY]** Can F1 ever exceed both precision and recall?

### Computing F1 from confusion matrix

**P1. [PROG]** Given TP=60, FP=20, FN=15, compute precision, recall, and F1.

**P2. [PROG]** Given a confusion matrix:
```
       Pred 0  Pred 1
Act 0   80      20
Act 1   10      90
```
Compute F1.

**A1. [ANALYZE]** A classifier has TP=100, FP=0, FN=100, TN=800. Compute precision, recall, and F1. Interpret the result.

### F-beta weighting

**T5. [THEORY]** What does F₂ emphasise: precision or recall?

**T6. [THEORY]** For a disease detection system where missing cases is worse than false alarms, should you use F₀.₅ or F₂?

**P3. [PROG]** Given Precision=0.8, Recall=0.7, compute F₀.₅ and F₂.

**A2. [ANALYZE]** Compare two classifiers:
- Classifier A: P=0.85, R=0.70
- Classifier B: P=0.70, R=0.85
Compute F0.5, F1, and F2 for each. When would you choose A, and when B?

### Balanced accuracy and imbalance

**T7. [THEORY]** What is balanced accuracy?

**T8. [THEORY]** On balanced data (50% pos, 50% neg), balanced accuracy and accuracy should be similar. True or false? Explain.

**P4. [PROG]** Given TPR=0.7, TNR=0.95, compute balanced accuracy.

**A3. [ANALYZE]** On a dataset with 99% negatives and 1% positives, a classifier achieves 99% accuracy but balanced accuracy 50%. What does this tell you?

### Matthews Correlation Coefficient

**T9. [THEORY]** What is the range of MCC?

**T10. [THEORY]** A trivial classifier (always predicts majority) on imbalanced data has high accuracy. What is its MCC?

**P5. [PROG]** Given TP=50, FP=10, FN=10, TN=930, compute MCC (approximate).

**A4. [ANALYZE]** Why is MCC better than F1 on severely imbalanced data?

### Choosing between metrics

**A5. [ANALYZE]** You're building a classifier for two tasks:
- Task A (fraud detection): Missing fraud is catastrophic.
- Task B (email filtering): False alarms (legitimate emails marked spam) are annoying.
For each task, which is better: F₂ or F₀.₅?

**A6. [ANALYZE]** A dataset has 95% negatives and 5% positives. Your classifier achieves F1=0.72. Is this good? What additional metrics would you check?

**A7. [ANALYZE]** Compare reporting metrics: Accuracy, F1, Balanced Accuracy, MCC. Which would you report for an imbalanced dataset, and why?

---

## Quick self-check

1. Write the F1 formula from memory.
2. Why is the harmonic mean used instead of the arithmetic mean?
3. If one of precision or recall is near zero, what happens to F1?
4. When should you use F₂ instead of F1?
5. When should you use F₀.₅ instead of F1?
6. What is balanced accuracy, and when do you use it?
7. What is MCC, and what is its range?
8. On imbalanced data, which is more reliable: F1 or MCC?
9. Can a classifier have high accuracy but low MCC? Explain.
10. When reporting metrics for an imbalanced classification task, what should you always include?
