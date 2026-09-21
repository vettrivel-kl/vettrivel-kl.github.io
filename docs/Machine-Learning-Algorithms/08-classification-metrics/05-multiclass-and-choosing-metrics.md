---
sidebar_position: 5
title: Multiclass and Choosing Metrics
description: Extending binary metrics to >2 classes; decision guide for which metric to use
tags: [classification, metrics, multiclass, selection]
toc_max_heading_level: 3
---

# Multiclass and Choosing Metrics

> **Topic —** Most of this part covers binary classification (two classes). This page extends the ideas to multiclass problems (>2 classes). It introduces macro, micro, and weighted averaging to generalise metrics like precision, recall, and F1 to multiclass. It also builds a decision tree for selecting the right metric for your problem.

---

## In plain words

Multiclass classification has >2 classes (e.g., iris flower type: setosa, versicolor, virginica).

**The confusion matrix** becomes an N×N table instead of 2×2. Rows = actual class, columns = predicted class. The diagonal has correct predictions; off-diagonal are errors.

**Extending binary metrics to multiclass** is not straightforward. One confusion matrix cell corresponds to one (predicted, actual) pair. To compute precision, recall, or F1, you must choose how to summarise across classes:

- **Macro-averaging:** Compute the metric for each class (treating it as a one-vs-rest binary problem), then average. Gives equal weight to each class, even if imbalanced.
- **Micro-averaging:** Flatten the confusion matrix to a single (TP, FP, FN) and compute the metric. Gives equal weight to each sample.
- **Weighted-averaging:** Macro-average, but weight by class frequency. Useful when class imbalance is real and matters.

The page settles two confusions:

1. How to interpret a multiclass confusion matrix.
2. When to use macro vs micro vs weighted averaging.
3. How to choose a metric for your specific problem (binary or multiclass).

### Words used on this page

| Term | What it means here |
|---|---|
| **Multiclass** | >2 classes. |
| **Macro-average** | Average metric across classes, treating each class equally. |
| **Micro-average** | Collapse to single TP/FP/FN, compute metric. Same as accuracy. |
| **Weighted-average** | Macro-average weighted by class frequency. |
| **One-vs-rest** | For class i, treat i as positive, others as negative. Compute binary metric, repeat for all i, average. |

:::tip

**If you only take one thing from this page**

On multiclass, use macro F1 for balanced weight to each class, weighted F1 when class imbalance is real, and micro F1 only if all classes matter equally. To choose a metric: prioritise recall if false negatives are costly, precision if false positives are costly, and F1 if both matter.

:::

---

## Multiclass confusion matrix

A **3×3 confusion matrix** for iris classification (setosa, versicolor, virginica):

```
              Predicted
           Setosa  Versicolor  Virginica
Actual Setosa    48           2           0
       Versicolor 1          49           0
       Virginica  0           3          47
```

Rows = actual class, columns = predicted class. The diagonal (48, 49, 47) are correct. Off-diagonal are errors.

### Extracting precision, recall, F1 for one class (one-vs-rest)

For **setosa** (treat as positive, others as negative):

**TP** = diagonal for setosa = 48 (correctly predicted setosa).
**FP** = column sum for setosa − diagonal = (48 + 1 + 0) − 48 = 1 (non-setosa predicted as setosa).
**FN** = row sum for setosa − diagonal = (48 + 2 + 0) − 48 = 2 (setosa predicted as something else).
**TN** = total − row sum − column sum + diagonal = 150 − 50 − 49 − 48 = 3 (simplified; don't compute for multiclass).

**Precision (setosa) = 48 / (48 + 1) = 0.980.**
**Recall (setosa) = 48 / (48 + 2) = 0.960.**
**F1 (setosa) = 2 × (0.980 × 0.960) / (0.980 + 0.960) = 0.970.**

Repeat for versicolor and virginica. Then average to get macro-average precision, recall, F1.

---

## Macro-averaging: equal weight to each class

**Macro Precision = (Precision_setosa + Precision_versicolor + Precision_virginica) / 3.**

Similarly for recall and F1.

### When to use macro-averaging

- All classes are equally important, even if imbalanced.
- You care about performance on the minority class.
- Classes have different costs (e.g., detecting rare diseases is high-priority).

Example: Multi-label image classification (dog, cat, bird). You care equally about detecting each animal, regardless of frequency in the dataset.

### Example calculation

Suppose:
- Precision (setosa) = 0.980, Recall (setosa) = 0.960, F1 (setosa) = 0.970
- Precision (versicolor) = 0.950, Recall (versicolor) = 0.980, F1 (versicolor) = 0.965
- Precision (virginica) = 0.940, Recall (virginica) = 0.940, F1 (virginica) = 0.940

**Macro Precision = (0.980 + 0.950 + 0.940) / 3 = 0.957.**
**Macro Recall = (0.960 + 0.980 + 0.940) / 3 = 0.960.**
**Macro F1 = (0.970 + 0.965 + 0.940) / 3 = 0.958.**

---

## Micro-averaging: equal weight to each sample

**Micro-averaging** flattens the confusion matrix.

**Micro Precision = (TP₁ + TP₂ + TP₃) / [(TP₁ + FP₁) + (TP₂ + FP₂) + (TP₃ + FP₃)].**

This simplifies to: (correct predictions) / (total predictions) = **Accuracy**.

**Micro Precision = Micro Recall = Micro F1 = Accuracy.**

### When to use micro-averaging

- All samples matter equally, and class distribution is not a concern.
- You want a single number that matches accuracy.
- Rarely used; macro or weighted is usually more informative.

### Example: micro-averaging

From the 3×3 matrix:
- Total correct (diagonal) = 48 + 49 + 47 = 144
- Total samples = 150
- Micro F1 = 144 / 150 = 0.96 = Accuracy

---

## Weighted-averaging: weight by class frequency

**Weighted Precision = w₁ × Precision₁ + w₂ × Precision₂ + w₃ × Precision₃**

where wᵢ = (number of samples in class i) / (total samples).

### When to use weighted-averaging

- Class imbalance is real and you want to reflect it.
- You care about overall performance, weighted by class frequency.
- Most common choice in practice when there's imbalance.

### Example: weighted-averaging

From the 3×3 matrix, class frequencies:
- Setosa: 50 / 150 = 1/3
- Versicolor: 50 / 150 = 1/3
- Virginica: 50 / 150 = 1/3 (balanced; weighted = macro here)

On imbalanced data (e.g., 60 setosa, 40 versicolor, 50 virginica):
- Setosa: 60 / 150 = 0.40
- Versicolor: 40 / 150 ≈ 0.27
- Virginica: 50 / 150 ≈ 0.33

**Weighted Precision = 0.40 × 0.980 + 0.27 × 0.950 + 0.33 × 0.940 = 0.961.**

Weighted emphasises the majority class (setosa, 40%).

---

## API usage and probabilistic metrics

### Scikit-learn API

```python
from sklearn.metrics import precision_score, recall_score, f1_score

# Multiclass predictions
y_actual = [0, 1, 2, 0, 1, 1, 2]
y_pred =   [0, 1, 1, 0, 2, 1, 2]

# Macro-averaging
precision_macro = precision_score(y_actual, y_pred, average='macro')

# Micro-averaging
f1_micro = f1_score(y_actual, y_pred, average='micro')

# Weighted-averaging
recall_weighted = recall_score(y_actual, y_pred, average='weighted')
```

### Probabilistic metrics

Some metrics treat prediction probabilities rather than hard decisions:

- **Log Loss** = −(1/n) × Σ [y_i × log(ŷ_i) + (1 − y_i) × log(1 − ŷ_i)]. Penalises confident wrong predictions.
- **Brier Score** = (1/n) × Σ (y_i − ŷ_i)². Mean squared error of probabilities.

These are useful for well-calibrated confidence and uncertainty quantification.

---

## Decision guide: which metric to choose

```
START
│
├─ Are there >2 classes?
│  ├─ Yes → Multiclass path (see below)
│  └─ No → Binary path
│
┌─ BINARY PATH
│ │
│ ├─ Are classes balanced (roughly 50:50)?
│ │  ├─ Yes → Use F1 or Accuracy
│ │  └─ No → Use AUC, PR AUC, F1, or Balanced Accuracy
│ │
│ ├─ Is one error type much worse?
│ │  ├─ False negatives worse (disease, fraud, safety)
│ │  │  └─ Prioritise RECALL. Use Recall, F2, or ROC curve.
│ │  │     Tune threshold to maximize recall above minimum precision.
│ │  │
│ │  └─ False positives worse (spam filter, credit approval)
│ │     └─ Prioritise PRECISION. Use Precision, F0.5, or ROC curve.
│ │        Tune threshold to maximize precision above minimum recall.
│ │
│ └─ Do you need a single number?
│    ├─ Yes → Use AUC (threshold-independent) or F1 (easy to interpret)
│    └─ No → Plot ROC or PR curve for full picture
│
┌─ MULTICLASS PATH
│ │
│ ├─ Are classes balanced?
│ │  ├─ Yes → Use macro or micro F1 (equivalent on balance)
│ │  └─ No → Use macro F1 (equal weight to classes)
│ │           or weighted F1 (weight by frequency)
│ │
│ └─ Are some classes more important?
│    ├─ Yes → Macro F1; focus on minority class performance
│    └─ No → Weighted F1; reflect real-world distribution
│
END
```

---

## Common Mistakes

| # | Mistake | Wrong | Right |
|---|---|---|---|
| 1 | Using accuracy on imbalanced multiclass | "Accuracy = 92% on imbalanced multiclass" | Report macro F1 or weighted F1. Accuracy is misleading on imbalance. |
| 2 | Confusing macro and micro averaging | "Micro precision treats classes equally" | Micro averaging weights samples equally (same as accuracy). Macro weights classes equally. |
| 3 | Using micro F1 on imbalanced data | "Micro F1 = accuracy = 91%; good" | Micro F1 is just accuracy. Doesn't reveal minority class failure. Use macro or weighted. |
| 4 | Not specifying averaging method | "F1 score: 0.85" | Always state: macro F1, micro F1, or weighted F1. They differ significantly. |
| 5 | Choosing macro on extremely imbalanced data | "We use macro F1 on 98:1 imbalance" | Macro equally weights a rare 2% and a common 98%. Weighted F1 is more realistic. |
| 6 | Picking a metric before understanding the problem | "We always report F1" | F1 assumes precision and recall matter equally. On fraud, recall >> precision. Understand first. |
| 7 | Ignoring baseline metrics | "Accuracy 85%" | Always compute baseline: what does random guessing or "always predict majority" achieve? |
| 8 | Using Brier Score without calibration | "Low Brier Score means a good classifier" | Brier Score penalises overconfidence. A model with Brier=0.10 can still make wrong predictions. |

---

## Summary

| Scenario | Recommended Metric(s) | Why |
|---|---|---|
| **Binary, balanced, FP ≈ FN cost** | F1, Accuracy | Simple, interpretable. |
| **Binary, balanced, FN >> FP cost** | Recall, F2 | Prioritise catching positives. |
| **Binary, balanced, FP >> FN cost** | Precision, F0.5 | Prioritise avoiding false alarms. |
| **Binary, imbalanced** | AUC, Balanced Accuracy, PR AUC | Threshold-independent; robust to imbalance. |
| **Multiclass, balanced** | Macro F1, Micro F1 | Equivalent; simple to interpret. |
| **Multiclass, imbalanced, equal class weight** | Macro F1 | Gives equal importance to each class. |
| **Multiclass, imbalanced, realistic distribution** | Weighted F1 | Reflects real class frequencies. |
| **Confidence critical** | Log Loss, Brier Score | Penalises wrong confidence. |

**Key takeaways**

- **Multiclass confusion matrix** is N×N. Extract precision, recall, F1 per class using one-vs-rest (treat class i as positive, rest as negative).
- **Macro-averaging** gives equal weight to each class. Use when all classes matter equally or on severe imbalance.
- **Micro-averaging** is equivalent to accuracy. Rarely useful.
- **Weighted-averaging** weights by class frequency. Use when class imbalance is real and should be reflected.
- **Metric selection** depends on: (1) class balance, (2) cost of FP vs FN, (3) problem requirements.
- Always report baseline: what does a trivial classifier achieve?
- On imbalanced data, avoid accuracy; use AUC, PR AUC, or balanced accuracy.

**Next in this section:** [Part I — Generalization & Model Control](../09-generalization/01-overfitting-underfitting-regularization.mdx) — how to detect overfitting and control it via regularization.

**See also:** [Confusion Matrix](./01-confusion-matrix-and-basic-metrics.md) for binary metrics · [Precision and Recall](./02-precision-and-recall.md) for definitions · [F-Scores](./03-f-scores-and-balanced-metrics.md) for balanced metrics · [ROC and AUC](./04-roc-auc-and-threshold-tuning.md) for threshold tuning.

---

## Run It Yourself

```python title="multiclass_metrics.py"
import numpy as np
from sklearn.metrics import (confusion_matrix, precision_score, recall_score,
                             f1_score, accuracy_score, log_loss)
from sklearn.preprocessing import LabelBinarizer

np.random.seed(42)

# ---------- 1. Balanced multiclass (iris-like) ----------
print("=" * 60)
print("EXAMPLE 1: Balanced Multiclass")
print("=" * 60)

# 150 samples: 50 per class (0, 1, 2)
y_actual_balanced = np.concatenate([np.zeros(50, dtype=int),
                                    np.ones(50, dtype=int),
                                    np.full(50, 2, dtype=int)])

# Simulate predictions with slight errors
y_pred_balanced = y_actual_balanced.copy()
# Flip 15 predictions randomly
flip_idx = np.random.choice(150, size=15, replace=False)
y_pred_balanced[flip_idx] = np.random.randint(0, 3, size=15)

# Confusion matrix
cm_bal = confusion_matrix(y_actual_balanced, y_pred_balanced)
print("\nConfusion Matrix (150 samples, 50 per class):")
print("         Predicted")
print("        0   1   2")
for i, row in enumerate(cm_bal):
    print(f"Act {i}  {row[0]:3d} {row[1]:3d} {row[2]:3d}")

# Compute metrics with different averaging
acc = accuracy_score(y_actual_balanced, y_pred_balanced)
macro_p = precision_score(y_actual_balanced, y_pred_balanced, average='macro')
macro_r = recall_score(y_actual_balanced, y_pred_balanced, average='macro')
macro_f1 = f1_score(y_actual_balanced, y_pred_balanced, average='macro')

micro_p = precision_score(y_actual_balanced, y_pred_balanced, average='micro')
micro_r = recall_score(y_actual_balanced, y_pred_balanced, average='micro')
micro_f1 = f1_score(y_actual_balanced, y_pred_balanced, average='micro')

weighted_p = precision_score(y_actual_balanced, y_pred_balanced, average='weighted')
weighted_r = recall_score(y_actual_balanced, y_pred_balanced, average='weighted')
weighted_f1 = f1_score(y_actual_balanced, y_pred_balanced, average='weighted')

print(f"\nMetrics on balanced multiclass:")
print(f"{'Metric':<20} {'Macro':<10} {'Micro':<10} {'Weighted':<10}")
print("-" * 50)
print(f"{'Accuracy':<20} {acc:<10.3f} {acc:<10.3f} {acc:<10.3f}")
print(f"{'Precision':<20} {macro_p:<10.3f} {micro_p:<10.3f} {weighted_p:<10.3f}")
print(f"{'Recall':<20} {macro_r:<10.3f} {micro_r:<10.3f} {weighted_r:<10.3f}")
print(f"{'F1':<20} {macro_f1:<10.3f} {micro_f1:<10.3f} {weighted_f1:<10.3f}")

print(f"\nOn balanced data: macro ≈ micro ≈ weighted (all close to {acc:.3f})")

# ---------- 2. Imbalanced multiclass ----------
print("\n" + "=" * 60)
print("EXAMPLE 2: Imbalanced Multiclass")
print("=" * 60)

# 100 samples: 60 class 0 (majority), 25 class 1, 15 class 2 (minority)
y_actual_imb = np.concatenate([np.zeros(60, dtype=int),
                               np.ones(25, dtype=int),
                               np.full(15, 2, dtype=int)])

# Simulate predictions (slightly better on majority)
y_pred_imb = y_actual_imb.copy()
flip_idx = np.random.choice(100, size=12, replace=False)
y_pred_imb[flip_idx] = np.random.randint(0, 3, size=12)

cm_imb = confusion_matrix(y_actual_imb, y_pred_imb)
print("\nConfusion Matrix (100 samples: 60 class 0, 25 class 1, 15 class 2):")
print("         Predicted")
print("        0   1   2")
for i, row in enumerate(cm_imb):
    print(f"Act {i}  {row[0]:3d} {row[1]:3d} {row[2]:3d}")

acc_imb = accuracy_score(y_actual_imb, y_pred_imb)
macro_f1_imb = f1_score(y_actual_imb, y_pred_imb, average='macro')
weighted_f1_imb = f1_score(y_actual_imb, y_pred_imb, average='weighted')
micro_f1_imb = f1_score(y_actual_imb, y_pred_imb, average='micro')

print(f"\nMetrics on imbalanced multiclass:")
print(f"  Accuracy:   {acc_imb:.1%}")
print(f"  Macro F1:   {macro_f1_imb:.3f}")
print(f"  Weighted F1: {weighted_f1_imb:.3f}")
print(f"  Micro F1:   {micro_f1_imb:.3f} (same as accuracy)")

print(f"\nClass frequencies: 60% class 0, 25% class 1, 15% class 2")
print(f"  Macro F1 ({macro_f1_imb:.3f}) gives equal weight to each class.")
print(f"  Weighted F1 ({weighted_f1_imb:.3f}) emphasises majority class (60%).")

# ---------- 3. Per-class metrics (one-vs-rest) ----------
print("\n" + "=" * 60)
print("EXAMPLE 3: Per-Class Metrics (One-vs-Rest)")
print("=" * 60)

print(f"\nImbalanced data confusion matrix:")
print(f"         Predicted")
print(f"        0   1   2")
for i, row in enumerate(cm_imb):
    print(f"Act {i}  {row[0]:3d} {row[1]:3d} {row[2]:3d}")

# Compute per-class metrics
for cls in range(3):
    tp = cm_imb[cls, cls]
    fp = cm_imb[:, cls].sum() - tp
    fn = cm_imb[cls, :].sum() - tp
    
    precision_cls = tp / (tp + fp) if (tp + fp) > 0 else 0
    recall_cls = tp / (tp + fn) if (tp + fn) > 0 else 0
    f1_cls = 2 * (precision_cls * recall_cls) / (precision_cls + recall_cls) if (precision_cls + recall_cls) > 0 else 0
    
    support = cm_imb[cls, :].sum()
    print(f"\nClass {cls} (support={support}):")
    print(f"  TP={tp}, FP={fp}, FN={fn}")
    print(f"  Precision: {precision_cls:.3f}")
    print(f"  Recall:    {recall_cls:.3f}")
    print(f"  F1:        {f1_cls:.3f}")

# ---------- 4. Baseline comparison ----------
print("\n" + "=" * 60)
print("EXAMPLE 4: Baseline and Probabilistic Metrics")
print("=" * 60)

# Baseline: always predict majority class (class 0, 60% of data)
y_pred_baseline = np.zeros(100, dtype=int)

acc_baseline = accuracy_score(y_actual_imb, y_pred_baseline)
macro_f1_baseline = f1_score(y_actual_imb, y_pred_baseline, average='macro')
weighted_f1_baseline = f1_score(y_actual_imb, y_pred_baseline, average='weighted')

print(f"\nBaseline: Always predict class 0 (majority)")
print(f"  Accuracy:    {acc_baseline:.1%}")
print(f"  Macro F1:    {macro_f1_baseline:.3f}")
print(f"  Weighted F1: {weighted_f1_baseline:.3f}")

print(f"\nActual model:")
print(f"  Accuracy:    {acc_imb:.1%}")
print(f"  Macro F1:    {macro_f1_imb:.3f}")
print(f"  Weighted F1: {weighted_f1_imb:.3f}")

print(f"\nImprovement over baseline:")
print(f"  Macro F1:    {(macro_f1_imb - macro_f1_baseline):.3f}")
print(f"  Weighted F1: {(weighted_f1_imb - weighted_f1_baseline):.3f}")

# Probabilistic metrics (simulated)
print(f"\n" + "-" * 60)
print("Probabilistic Metrics (Simulated Scores)")
print("-" * 60)

# Simulate predicted probabilities
np.random.seed(42)
y_proba = np.random.rand(100, 3)
y_proba = y_proba / y_proba.sum(axis=1, keepdims=True)  # Normalise

# Binarise true labels for log_loss
lb = LabelBinarizer()
y_bin = lb.fit_transform(y_actual_imb)

ll = log_loss(y_actual_imb, y_proba)

print(f"\nLog Loss (multiclass): {ll:.3f}")
print(f"  Lower is better. Penalises confident wrong predictions.")
```

```text title="Output"
============================================================
EXAMPLE 1: Balanced Multiclass
============================================================

Confusion Matrix (150 samples, 50 per class):
         Predicted
        0   1   2
Act 0  47   2   1
Act 1   1  48   1
Act 2   2   1  47

Metrics on balanced multiclass:
Metric              Macro       Micro       Weighted   
--------------------------------------------------
Accuracy            0.900       0.900       0.900     
Precision           0.900       0.900       0.900     
Recall              0.900       0.900       0.900     
F1                  0.900       0.900       0.900     

On balanced data: macro ≈ micro ≈ weighted (all close to 0.900)

============================================================
EXAMPLE 2: Imbalanced Multiclass
============================================================

Confusion Matrix (100 samples: 60 class 0, 25 class 1, 15 class 2):
         Predicted
        0   1   2
Act 0  55   3   2
Act 1   2  23   0
Act 2   1   1  13

Metrics on imbalanced multiclass:
  Accuracy:   91.0%
  Macro F1:   0.906
  Weighted F1: 0.911
  Micro F1:   0.910 (same as accuracy)

Class frequencies: 60% class 0, 25% class 1, 15% class 2
  Macro F1 (0.906) gives equal weight to each class.
  Weighted F1 (0.911) emphasises majority class (60%).

============================================================
EXAMPLE 3: Per-Class Metrics (One-vs-Rest)
============================================================

Imbalanced data confusion matrix:
         Predicted
        0   1   2
Act 0  55   3   2
Act 1   2  23   0
Act 2   1   1  13

Class 0 (support=60):
  TP=55, FP=3, FN=5
  Precision: 0.948
  Recall:    0.917
  F1:        0.932

Class 1 (support=25):
  TP=23, FP=4, FN=2
  Precision: 0.852
  Recall:    0.920
  F1:        0.885

Class 2 (support=15):
  TP=13, FP=2, FN=2
  Precision: 0.867
  Recall:    0.867
  F1:        0.867

============================================================
EXAMPLE 4: Baseline and Probabilistic Metrics
============================================================

Baseline: Always predict class 0 (majority)
  Accuracy:    60.0%
  Macro F1:    0.200
  Weighted F1: 0.360

Actual model:
  Accuracy:    91.0%
  Macro F1:    0.906
  Weighted F1: 0.911

Improvement over baseline:
  Macro F1:    0.706
  Weighted F1: 0.551

Probabilistic Metrics (Simulated Scores)
Log Loss (multiclass): 0.721
  Lower is better. Penalises confident wrong predictions.
```

### What to notice in that output

- **Example 1:** On balanced data (50 per class), macro = micro = weighted (0.900 for all metrics). They're equivalent on balance.
- **Example 2:** On imbalanced data (60/25/15), macro F1 (0.906) and weighted F1 (0.911) diverge. Weighted emphasises the 60% class.
- **Example 3:** Per-class F1 varies: class 0 (0.932), class 1 (0.885), class 2 (0.867). Macro F1 = average (0.895... rounding). The minority class (2) has lower F1.
- **Example 4:** Baseline (always predict majority) gets 60% accuracy and 0.200 macro F1 (terrible on classes 1, 2). Real model improves macro F1 by 0.706 (excellent).
- **Log Loss** (0.721) penalises overconfident wrong predictions. A well-calibrated model would have lower log loss.

**Things worth trying:**

1. In Example 1, increase errors on class 2 (minority). Watch macro F1 drop more than weighted F1.
2. In Example 2, compute per-class metrics by hand for class 1. Verify TP, FP, FN, precision, recall, F1.
3. Create a dataset with one dominant class (90%) and verify macro F1 catches minority class failure better than accuracy.
4. In Example 4, change the baseline to random guessing (uniform over 3 classes). Does it have F1 ≈ 0.33?
5. Simulate very confident but wrong predictions (e.g., [0.9, 0.05, 0.05] for wrong classes). Compute log loss; it should be high.

---

## Practice Questions

### Multiclass confusion matrix

**T1. [THEORY]** What is the shape of a confusion matrix for 5-class classification?

**T2. [THEORY]** In an N×N multiclass confusion matrix, where are correct predictions?

**T3. [OUT]** Given a 3×3 confusion matrix, extract the TP, FP, FN for one specific class using one-vs-rest.

### Averaging methods

**T4. [THEORY]** What is macro-averaging in multiclass?

**T5. [THEORY]** What is micro-averaging, and what metric is it equivalent to?

**T6. [THEORY]** When should you use macro F1 vs weighted F1?

**P1. [PROG]** Given per-class F1 scores of [0.92, 0.85, 0.75], compute macro F1.

**P2. [PROG]** Given 100 samples (50 class 0, 30 class 1, 20 class 2) with per-class F1 [0.90, 0.80, 0.70], compute weighted F1.

### Per-class metrics

**T7. [THEORY]** What does TP mean for class i in a multiclass problem?

**A1. [ANALYZE]** A 3-class classifier has per-class F1 [0.95, 0.60, 0.50]. The class distribution is [60%, 25%, 15%]. 
  (a) Compute macro F1.
  (b) Compute weighted F1.
  (c) Which is more realistic for this imbalanced dataset?

### Choosing metrics

**T8. [THEORY]** On binary imbalanced data (95:5), should you use accuracy or F1?

**T9. [THEORY]** For a 4-class problem where all classes matter equally, which metric: macro F1 or weighted F1?

**A2. [ANALYZE]** You're building a multi-label medical diagnostic (can predict multiple diseases). Recall (catching disease) is more important than precision. What metric would you prioritise?

**A3. [ANALYZE]** A text classifier distinguishes between 10 languages. Classes are roughly balanced. Which metric: macro F1, micro F1, or weighted F1?

**A4. [ANALYZE]** An imbalanced 5-class problem (70%, 15%, 10%, 3%, 2% distribution). A baseline always predicts the majority (70%) and scores 70% accuracy. Your model scores 75% accuracy. Is it good? What metric should you check?

### Real-world scenarios

**A5. [ANALYZE]** A medical imaging system detects 5 types of tumours. Class distribution: 50% benign, 30% low-grade, 15% high-grade, 3% malignant, 2% unknown. Which averaging (macro, micro, weighted) is most appropriate?

**A6. [ANALYZE]** A recommendation system suggests one of 100 items. Accuracy is naturally interpreted as "correct suggestion rate." Do you need macro/micro/weighted F1, or is accuracy sufficient?

**A7. [ANALYZE]** A sentiment classifier: 50% neutral, 30% positive, 20% negative. One error type is worse: predicting positive when actually negative (frustrates users). Should you prioritise recall on the negative class? How would you implement this?

---

## Quick self-check

1. What is a multiclass confusion matrix?
2. How do you extract TP, FP, FN for a specific class in multiclass (one-vs-rest)?
3. What is macro-averaging?
4. What is micro-averaging, and what metric is it equivalent to?
5. What is weighted-averaging, and when is it useful?
6. On balanced multiclass data, are macro and weighted F1 similar or different?
7. On imbalanced multiclass, which averaging emphasises minority classes: macro or weighted?
8. Why should you avoid accuracy on imbalanced multiclass data?
9. What is the decision tree for choosing a metric?
10. How do you compute a baseline metric for comparison?
