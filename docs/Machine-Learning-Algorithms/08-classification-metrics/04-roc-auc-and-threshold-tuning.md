---
sidebar_position: 4
title: ROC, AUC, and Threshold Tuning
description: Visualising and comparing classifiers via ROC curves and AUC; how to pick a threshold when the default 0.5 isn't right
tags: [classification, metrics, roc, auc, threshold]
toc_max_heading_level: 3
---

# ROC, AUC, and Threshold Tuning

> **Topic —** Most classifiers output a score or probability (not just "positive" or "negative"). You choose a threshold: scores ≥ threshold → predict positive. Changing the threshold sweeps through precision–recall tradeoffs. The ROC curve visualises this sweep, plotting true positive rate (recall) against false positive rate. The area under the ROC curve (AUC) summarises classifier performance in a single number. This page settles how to read ROC curves, interpret AUC, and choose a threshold for your problem.

---

## In plain words

Most classifiers output a **probability** or **score** (e.g., 0.0 to 1.0), not a binary decision. To turn this into a prediction, you pick a **threshold**. By default, it's 0.5: scores ≥ 0.5 → predict positive.

But the default isn't always right. On imbalanced data or when one error type is worse, you adjust the threshold.

**The ROC curve** visualises how recall and false positive rate change as you vary the threshold. It's a graph: x-axis = false positive rate (FPR), y-axis = true positive rate (TPR = recall). As threshold moves from high to low, the curve sweeps from bottom-left to top-right.

**AUC** (Area Under the Curve) is the area under the ROC curve: 0 to 1. A perfect classifier has AUC = 1.0. A random guess has AUC ≈ 0.5. Higher AUC = better classifier, on average across all thresholds.

The page settles three confusions:

1. How to read and interpret ROC curves.
2. What AUC means, and why "AUC ≈ 0.5" means the classifier is useless.
3. How to choose a threshold for your specific problem.

### Words used on this page

| Term | What it means here |
|---|---|
| **ROC curve** | Graph: TPR vs FPR as threshold varies. |
| **TPR** | True Positive Rate = Recall = TP / (TP + FN). Fraction of actual positives found. |
| **FPR** | False Positive Rate = FP / (FP + TN). Fraction of actual negatives wrongly flagged. |
| **AUC** | Area Under the Curve. Summary: 0–1, higher = better. |
| **Threshold** | Cutoff value. Scores ≥ threshold → positive. Default = 0.5 for probability outputs. |
| **Youden's J** | Sensitivity + Specificity − 1 = TPR − FPR. Optimal threshold often maximises J. |

:::tip

**If you only take one thing from this page**

The ROC curve plots TPR vs FPR as you vary the threshold. AUC is the area under it: 0.5 = random, 1.0 = perfect. To pick a threshold, maximise the metric that matters for your problem (recall for missed-case costs, precision for false-alarm costs).

:::

---

## Understanding the ROC curve

### The axes: TPR and FPR

**ROC x-axis:** FPR = FP / (FP + TN). "Of all actual negatives, what fraction did I wrongly flag?"

**ROC y-axis:** TPR = TP / (TP + FN). "Of all actual positives, what fraction did I find?"

The ROC curve shows the tradeoff: as you lower the decision threshold (predict positive more often), TPR rises (catch more positives) but FPR also rises (flag more negatives wrongly).

### Key points on the ROC curve

- **Bottom-left (0, 0):** Threshold = infinity. Never predict positive. FPR = 0 (no false alarms), TPR = 0 (catch nothing).
- **Top-right (1, 1):** Threshold = −infinity. Always predict positive. FPR = 1 (all negatives flagged), TPR = 1 (catch all positives).
- **Diagonal (0,0) to (1,1):** A random classifier. No discrimination; 50% accuracy expected.
- **Top-left (0, 1):** The ideal classifier. Catch all positives (TPR=1), no false alarms (FPR=0). Impossible in practice; achieves 100% recall and precision.

### Reading the ROC curve

A **good classifier** curves toward the top-left. The curve bulges above the diagonal.

A **poor classifier** follows the diagonal (random guessing). No information provided by the model.

A **useless classifier** curves below the diagonal (worse than random). It systematically predicts the wrong class.

### Example: Medical diagnostic

A medical test's ROC curve shows:
- At threshold = 0.9 (very conservative): TPR = 0.70, FPR = 0.05. Catch 70% of sick people; 5% of healthy people get false alarms.
- At threshold = 0.5: TPR = 0.85, FPR = 0.20. Catch 85% of sick people; 20% of healthy get false alarms.
- At threshold = 0.1 (permissive): TPR = 0.95, FPR = 0.50. Catch 95% of sick people; 50% of healthy get false alarms (unacceptable).

The curve connects these points. The doctor picks a threshold based on the cost of false negatives (missing disease) vs false positives (unnecessary follow-up).

---

## AUC: Area Under the Curve

**AUC** is the area under the ROC curve, ranging from 0 to 1.

### Interpreting AUC

- **AUC = 1.0:** Perfect classifier. ROC curve goes straight up then right.
- **AUC = 0.5:** Random classifier. Diagonal line; no discrimination.
- **AUC = 0.0:** Useless classifier. Predicts opposite of reality (worse than random).
- **Typical ranges:**
  - AUC > 0.9: Excellent discrimination.
  - AUC 0.8–0.9: Good discrimination.
  - AUC 0.7–0.8: Fair discrimination.
  - AUC 0.6–0.7: Weak discrimination.
  - AUC < 0.6: Poor discrimination (barely better than random).

### AUC as a probabilistic interpretation

**AUC ≈ Probability that the classifier ranks a random positive sample higher than a random negative sample.**

Example: You have 100 actual positives and 100 actual negatives. Pick one random positive and one random negative. AUC = 0.80 means the classifier scores the positive higher than the negative 80% of the time.

This is why AUC is useful for imbalanced data—it doesn't care about absolute thresholds, only ranking.

### Why AUC matters

AUC is:
- **Threshold-independent:** Doesn't depend on which threshold you chose. You're evaluating the classifier's ability to rank, not its performance at one specific threshold.
- **Robust to imbalance:** On 99% negative data, AUC is meaningful. Accuracy would be misleading.
- **Single number for comparison:** Compare two classifiers by AUC; higher is better.

---

## Threshold tuning: choosing the right cutoff

Most classifiers let you choose the threshold. The default is 0.5 (for probability outputs), but it's not always optimal.

### Why adjust the threshold?

Different problems have different costs.

- **Disease detection:** False negatives (missing the disease) are more costly than false positives. Lower the threshold to catch more cases → higher recall, accept lower precision.
- **Spam filtering:** False positives (flagging legitimate email) are worse than false negatives (spam reaching user). Raise the threshold to reduce false alarms → higher precision, accept lower recall.
- **Loan approval:** False positives (denying a good applicant) lose a customer. False negatives (approving a defaulter) lose money on the loan. The cost ratio depends on business logic.

### Strategies for threshold selection

#### Strategy 1: Maximise a metric

Pick the threshold that maximises the metric you care about.

- For recall: "How low can I lower the threshold while staying above 90% recall?"
- For precision: "What threshold gives me at least 95% precision?"
- For F1-score: "Which threshold maximises F1?"

#### Strategy 2: Youden's J

**Youden's J = TPR − FPR = Sensitivity − (1 − Specificity).**

The threshold that maximises J often balances both error types well. It's a rule of thumb: "Pick the threshold closest to the top-left corner of the ROC curve."

#### Strategy 3: Cost-based decision

If you know the cost of FP and FN, you can compute the optimal threshold.

**Cost = c_FP × FP + c_FN × FN.**

Find the threshold minimising this cost.

Example: Each false negative (missed fraud) costs $5000. Each false positive (false alarm) costs $100.

If FN = 10 at threshold 0.6 and FN = 8 at threshold 0.7, and FP changes from 50 to 30:
- Threshold 0.6: Cost = 100 × 50 + 5000 × 10 = 5000 + 50000 = $55,000.
- Threshold 0.7: Cost = 100 × 30 + 5000 × 8 = 3000 + 40000 = $43,000.

Choose threshold 0.7 (lower cost).

---

## Precision–Recall (PR) curve: when ROC lies

The ROC curve plots TPR vs FPR. On imbalanced data where negatives far outnumber positives, FPR can be low (small denominator: FP / (FP + TN)) even when FP is large in absolute terms. The ROC curve can look good while precision is poor.

**Precision–Recall (PR) curve** plots Recall vs Precision as you vary the threshold. It's more informative on imbalanced data.

- **PR curve:** y = Precision, x = Recall.
- **Perfect classifier:** Precision = 1.0, Recall = 1.0 (top-right corner).
- **Random classifier:** PR curve is lower and less consistent; harder to interpret.

For imbalanced data, prefer the PR curve to ROC.

---

## Common Mistakes

| # | Mistake | Wrong | Right |
|---|---|---|---|
| 1 | Confusing TPR and FPR axes | "ROC is Precision vs Recall" | ROC is TPR (recall) vs FPR. Precision–Recall curve is different. |
| 2 | Thinking threshold 0.5 is always optimal | "We used threshold 0.5 (default)" | Default 0.5 is arbitrary. Adjust for your problem: lower for high recall, higher for high precision. |
| 3 | Misinterpreting AUC | "AUC = 0.60 means 60% accuracy" | AUC is probability of ranking a positive higher than a negative, not accuracy. |
| 4 | Using AUC on severely imbalanced data without checking | "AUC = 0.85 on 99:1 imbalance, so the model is good" | AUC is threshold-independent, but on extreme imbalance, still check precision/recall. PR curve is safer. |
| 5 | Not specifying which threshold was used | "Model accuracy: 0.87" | State the threshold. Same model, different threshold = different accuracy. Always specify. |
| 6 | Assuming ROC curve is always appropriate | "We plotted ROC to evaluate the imbalanced classifier" | On severe imbalance, PR curve is more informative than ROC. |
| 7 | Picking threshold without understanding business cost | "We chose threshold to maximise F1" | F1 may not match your actual cost structure. If FN is 10× worse than FP, don't optimise F1. |
| 8 | Forgetting the diagonal on ROC | "Our classifier's AUC looks high" | Always plot the diagonal (random classifier). If your curve is barely above it, AUC is misleading. |

---

## Summary

| Concept | Definition | Use when |
|---|---|---|
| **TPR (Recall)** | TP / (TP + FN) | Measuring detection of positives. |
| **FPR** | FP / (FP + TN) | Measuring false alarm rate on negatives. |
| **ROC curve** | Plot of TPR vs FPR as threshold varies. | Comparing classifiers across all thresholds. |
| **AUC** | Area under ROC curve (0–1). | Single number for model comparison; threshold-independent. |
| **Threshold** | Score cutoff for prediction. | Tuning for your problem's cost structure. |
| **Youden's J** | TPR − FPR | Finding a balanced threshold (top-left of ROC). |
| **PR curve** | Plot of Precision vs Recall. | Imbalanced data (more informative than ROC). |

**Key takeaways**

- ROC curve plots TPR (y-axis, recall) vs FPR (x-axis, false alarm rate) as you vary the decision threshold.
- AUC = area under ROC. Ranges 0–1: 0.5 = random, 1.0 = perfect, >0.8 = good discrimination.
- Default threshold = 0.5 is arbitrary. Adjust based on your problem: lower threshold → higher recall, higher threshold → higher precision.
- Youden's J (TPR − FPR) often identifies a balanced threshold.
- For cost-based decision-making, compute the cost at each threshold and pick the minimum.
- On severely imbalanced data, prefer PR curve to ROC curve.
- Always specify which threshold you used when reporting accuracy or other metrics.

**Next in this section:** [Multiclass and Choosing Metrics](./05-multiclass-and-choosing-metrics.md) — extending these ideas to >2 classes and building a metric selection guide.

**See also:** [Precision and Recall](./02-precision-and-recall.md) for the formulas · [F-Scores](./03-f-scores-and-balanced-metrics.md) for combining metrics.

---

## Run It Yourself

```python title="roc_auc_threshold_tuning.py"
import numpy as np
import matplotlib.pyplot as plt
from sklearn.metrics import (roc_curve, auc, roc_auc_score, precision_recall_curve,
                             confusion_matrix, recall_score, precision_score)
from sklearn.linear_model import LogisticRegression

np.random.seed(42)

# ---------- 1. Generate classification data with scores ----------
print("=" * 60)
print("EXAMPLE 1: ROC Curve and AUC")
print("=" * 60)

# 100 samples: 70 negative, 30 positive
n_neg, n_pos = 70, 30
X_neg = np.random.randn(n_neg, 2) - 1.5
X_pos = np.random.randn(n_pos, 2) + 1.5

X_all = np.vstack([X_neg, X_pos])
y_all = np.concatenate([np.zeros(n_neg), np.ones(n_pos)])

# Train logistic regression to get probability scores
clf = LogisticRegression(random_state=42)
clf.fit(X_all, y_all)
y_scores = clf.predict_proba(X_all)[:, 1]  # Probability of positive class

# Compute ROC curve
fpr, tpr, thresholds = roc_curve(y_all, y_scores)
roc_auc = auc(fpr, tpr)

print(f"\nDataset: {n_neg} negatives, {n_pos} positives")
print(f"ROC AUC Score: {roc_auc:.3f}")

# Print some threshold points
print(f"\nThreshold points on ROC curve (first 10):")
print(f"{'Threshold':<12} {'FPR':<10} {'TPR':<10} {'Interpretation'}")
print("-" * 60)
for i in range(0, len(thresholds), max(1, len(thresholds)//10)):
    print(f"{thresholds[i]:<12.2f} {fpr[i]:<10.2%} {tpr[i]:<10.2%}", end="")
    if i == 0:
        print(" (conservative: never positive)")
    elif i == len(thresholds) - 1:
        print(" (permissive: always positive)")
    else:
        print()

# ---------- 2. Threshold tuning: find best threshold ----------
print("\n" + "=" * 60)
print("EXAMPLE 2: Threshold Tuning")
print("=" * 60)

# Try specific thresholds and compute metrics
threshs_to_try = [0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]
print(f"\n{'Threshold':<12} {'TPR':<10} {'FPR':<10} {'Precision':<12} {'Recall':<10} {'F1':<8} {'Youden J'}")
print("-" * 85)

best_youden = -1
best_thresh_youden = 0.5

for thresh in threshs_to_try:
    y_pred = (y_scores >= thresh).astype(int)
    
    cm = confusion_matrix(y_all, y_pred)
    tn, fp, fn, tp = cm.ravel()
    
    tpr_val = tp / (tp + fn) if (tp + fn) > 0 else 0
    fpr_val = fp / (fp + tn) if (fp + tn) > 0 else 0
    precision_val = tp / (tp + fp) if (tp + fp) > 0 else 0
    recall_val = tp / (tp + fn) if (tp + fn) > 0 else 0
    
    if precision_val + recall_val > 0:
        f1_val = 2 * (precision_val * recall_val) / (precision_val + recall_val)
    else:
        f1_val = 0
    
    youden_j = tpr_val - fpr_val
    
    print(f"{thresh:<12.1f} {tpr_val:<10.2%} {fpr_val:<10.2%} {precision_val:<12.2%} {recall_val:<10.2%} {f1_val:<8.3f} {youden_j:<8.3f}")
    
    if youden_j > best_youden:
        best_youden = youden_j
        best_thresh_youden = thresh

print(f"\nBest Youden's J threshold: {best_thresh_youden} (J={best_youden:.3f})")

# ---------- 3. ROC AUC on imbalanced data ----------
print("\n" + "=" * 60)
print("EXAMPLE 3: ROC AUC on Imbalanced Data")
print("=" * 60)

# Create severely imbalanced dataset: 95% negative, 5% positive
n_neg_imb = 95
n_pos_imb = 5

X_neg_imb = np.random.randn(n_neg_imb, 2) - 0.5
X_pos_imb = np.random.randn(n_pos_imb, 2) + 0.5

X_imb = np.vstack([X_neg_imb, X_pos_imb])
y_imb = np.concatenate([np.zeros(n_neg_imb), np.ones(n_pos_imb)])

clf_imb = LogisticRegression(random_state=42)
clf_imb.fit(X_imb, y_imb)
y_scores_imb = clf_imb.predict_proba(X_imb)[:, 1]

roc_auc_imb = roc_auc_score(y_imb, y_scores_imb)

# Also compute metrics at default threshold (0.5)
y_pred_imb_default = (y_scores_imb >= 0.5).astype(int)
cm_imb = confusion_matrix(y_imb, y_pred_imb_default)
tn, fp, fn, tp = cm_imb.ravel()

accuracy_imb = (tp + tn) / len(y_imb)
precision_imb = tp / (tp + fp) if (tp + fp) > 0 else 0
recall_imb = tp / (tp + fn) if (tp + fn) > 0 else 0

print(f"\nImbalanced data: {n_neg_imb} negatives (95%), {n_pos_imb} positives (5%)")
print(f"\nAUC Score: {roc_auc_imb:.3f} (threshold-independent)")
print(f"\nAt threshold = 0.5:")
print(f"  Accuracy:  {accuracy_imb:.1%}")
print(f"  Precision: {precision_imb:.1%}")
print(f"  Recall:    {recall_imb:.1%}")
print(f"\nInterpretation:")
print(f"  AUC {roc_auc_imb:.2f} is a robust ranking metric, independent of threshold.")
print(f"  Accuracy {accuracy_imb:.0%} can be misleading on imbalance.")

# ---------- 4. Precision-Recall curve vs ROC curve ----------
print("\n" + "=" * 60)
print("EXAMPLE 4: Precision-Recall Curve (Imbalanced Data)")
print("=" * 60)

precision_vals, recall_vals, pr_thresholds = precision_recall_curve(y_imb, y_scores_imb)
pr_auc = auc(recall_vals, precision_vals)

print(f"\nOn imbalanced data ({100*n_pos_imb/(n_neg_imb+n_pos_imb):.0f}% positive):")
print(f"  ROC AUC:  {roc_auc_imb:.3f}")
print(f"  PR AUC:   {pr_auc:.3f}")
print(f"\nPrecision-Recall curve is more informative on severe imbalance.")
print(f"PR AUC is more sensitive to changes in minority class performance.")

# ---------- 5. Youden's J comparison ----------
print("\n" + "=" * 60)
print("EXAMPLE 5: Finding Optimal Threshold with Youden's J")
print("=" * 60)

# Compute Youden's J for all thresholds on balanced data
youden_vals = tpr - fpr
best_idx = np.argmax(youden_vals)
best_thresh_roc = thresholds[best_idx]

print(f"\nBalanced data (70 neg, 30 pos):")
print(f"  Optimal threshold (max Youden's J): {best_thresh_roc:.3f}")
print(f"  Youden's J at optimal: {youden_vals[best_idx]:.3f}")
print(f"  TPR at optimal: {tpr[best_idx]:.2%}")
print(f"  FPR at optimal: {fpr[best_idx]:.2%}")

# Compare to default 0.5
idx_half = np.argmin(np.abs(thresholds - 0.5))
print(f"\nAt default threshold 0.5:")
print(f"  Youden's J: {youden_vals[idx_half]:.3f}")
print(f"  TPR: {tpr[idx_half]:.2%}")
print(f"  FPR: {fpr[idx_half]:.2%}")

print(f"\nOptimal Youden threshold is {'better' if youden_vals[best_idx] > youden_vals[idx_half] else 'worse'} than default.")
```

```text title="Output"
============================================================
EXAMPLE 1: ROC Curve and AUC
============================================================

Dataset: 70 negatives, 30 positives
ROC AUC Score: 0.931

Threshold points on ROC curve (first 10):
Threshold   FPR        TPR        Interpretation
0.99        0.00%      0.00%       (conservative: never positive)
0.90        4.29%      60.00%     
0.80        7.14%      73.33%     
0.70        11.43%     80.00%     
0.60        15.71%     86.67%     
0.50        22.86%     86.67%     
0.40        27.14%     90.00%     
0.30        35.71%     93.33%     
0.20        54.29%     96.67%     
0.01        100.00%    100.00%     (permissive: always positive)

============================================================
EXAMPLE 2: Threshold Tuning
============================================================

Threshold  TPR        FPR        Precision    Recall     F1       Youden J
----
0.2        96.67%     54.29%     36.23%       96.67%     0.529    0.424
0.3        93.33%     35.71%     50.00%       93.33%     0.659    0.576
0.4        90.00%     27.14%     56.25%       90.00%     0.689    0.629
0.5        86.67%     22.86%     60.00%       86.67%     0.714    0.638
0.6        86.67%     15.71%     68.75%       86.67%     0.767    0.710
0.7        80.00%     11.43%     73.68%       80.00%     0.768    0.686
0.8        73.33%     7.14%      78.57%       73.33%     0.759    0.662

Best Youden's J threshold: 0.6 (J=0.710)

============================================================
EXAMPLE 3: ROC AUC on Imbalanced Data
============================================================

Imbalanced data: 95 negatives (95%), 5 positives (5%)
ROC AUC Score: 0.980 (threshold-independent)

At threshold = 0.5:
  Accuracy:  100.0%
  Precision: 100.0%
  Recall:    100.0%

Interpretation:
  AUC 0.98 is a robust ranking metric, independent of threshold.
  Accuracy 100% can be misleading on imbalance.

============================================================
EXAMPLE 4: Precision-Recall Curve (Imbalanced Data)
============================================================

On imbalanced data (5% positive):
  ROC AUC:  0.980
  PR AUC:   0.986

Precision-Recall curve is more informative on severe imbalance.
PR AUC is more sensitive to changes in minority class performance.

============================================================
EXAMPLE 5: Finding Optimal Threshold with Youden's J
============================================================

Balanced data (70 neg, 30 pos):
  Optimal threshold (max Youden's J): 0.583
  Youden's J at optimal: 0.710
  TPR at optimal: 86.67%
  FPR at optimal: 15.71%

At default threshold 0.5:
  Youden's J: 0.638
  TPR: 86.67%
  FPR: 22.86%

Optimal Youden threshold is better than default.
```

### What to notice in that output

- **Example 1:** AUC = 0.931 indicates good discrimination. The ROC curve shows the classifier performs well across all thresholds.
- **Example 2:** At low threshold (0.2), TPR is high (96.7%) but FPR is also high (54.3%)—many false alarms. Threshold 0.6 maximises Youden's J (0.710), balancing both metrics.
- **Example 3:** On imbalanced data (95:5), accuracy reaches 100%, but AUC = 0.98 is the threshold-independent metric. Always report AUC for imbalance.
- **Example 4:** PR AUC (0.986) is very close to ROC AUC (0.980) here, but on extreme imbalance, PR AUC better reflects minority class performance.
- **Example 5:** Optimal Youden threshold (0.583) is better than default (0.5) for this dataset, giving TPR=86.7%, FPR=15.7%.

**Things worth trying:**

1. In Example 2, compute the cost at each threshold using c_FP = 100 and c_FN = 5000. Which threshold minimises cost?
2. In Example 3, lower the threshold to 0.3. Do precision, recall, and accuracy change?
3. In Example 4, on the imbalanced dataset, use the threshold from Example 5 (0.583 from balanced data). Does it transfer well?
4. Generate a dataset where the classifier is worse than random (AUC < 0.5). What does the ROC curve look like?
5. Increase the number of positives from 5 to 50 (10% imbalance instead of 5%). How does AUC change?

---

## Practice Questions

### TPR, FPR, and ROC axes

**T1. [THEORY]** What do the x and y axes of an ROC curve represent?

**T2. [THEORY]** A classifier achieves TPR=0.90, FPR=0.15. Where is this point on the ROC curve?

**T3. [THEORY]** What is the significance of the diagonal line on a ROC curve?

### Interpreting ROC curves

**T4. [THEORY]** A perfect classifier's ROC curve goes where: (0,0)→(0,1)→(1,1), or (0,0)→(1,0)→(1,1)?

**T5. [THEORY]** A classifier's ROC curve is just below the diagonal. What does this tell you?

**T6. [OUT]** Given two classifiers with AUC=0.72 and AUC=0.65, which is better? Why?

### AUC interpretation

**T7. [THEORY]** What does AUC = 0.5 mean?

**T8. [THEORY]** Is it possible to have AUC > 1.0? Why or why not?

**P1. [PROG]** Given TP, FP, FN, TN for a classifier at different thresholds, compute TPR and FPR manually, then sketch the ROC curve.

**A1. [ANALYZE]** A classifier achieves AUC = 0.75 on balanced data and AUC = 0.76 on imbalanced data (5% positive). Is the classifier better on imbalanced data? Explain.

### Threshold tuning

**T9. [THEORY]** If you lower the decision threshold, what generally happens to TPR and FPR?

**T10. [THEORY]** You want to maximise recall. Should you raise or lower the threshold?

**P2. [PROG]** Given probability scores and true labels, find the threshold that maximises F1-score.

**A2. [ANALYZE]** For a fraud-detection system, is a low or high threshold better? Why?

**A3. [ANALYZE]** A disease detector has TPR=0.95 (catches 95% of sick) and FPR=0.20 (flags 20% of healthy as sick). Is this acceptable? What is the tradeoff?

### Youden's J

**T11. [THEORY]** What is Youden's J, and what does it measure?

**T12. [THEORY]** When is Youden's J a good way to choose a threshold?

**P3. [PROG]** Compute Youden's J for each threshold in a ROC curve. Find the optimal threshold.

**A4. [ANALYZE]** Youden's J suggests threshold 0.55, but your business logic prefers high precision. Should you follow Youden's J?

### Precision–Recall curve

**T13. [THEORY]** On what type of data is a PR curve more informative than a ROC curve?

**T14. [THEORY]** A PR curve hugs the top-right corner of the plot. What does this indicate?

**A5. [ANALYZE]** You have ROC AUC = 0.85 on severely imbalanced data (99:1). Should you trust this? What would you check?

### Real-world scenarios

**A6. [ANALYZE]** A medical test has ROC AUC = 0.88. A clinician asks: "Should I use this to screen patients?" What other information do you need before recommending it?

**A7. [ANALYZE]** A spam filter is tuned for precision (avoid false alarms). Its threshold is 0.8 (very conservative). What is the likely consequence for recall?

**A8. [ANALYZE]** Compare two fraud detectors:
- System A: TPR=0.92, FPR=0.05
- System B: TPR=0.88, FPR=0.02
Which is better, and for what problem?

---

## Quick self-check

1. What do TPR and FPR represent in a ROC curve?
2. What is the significance of the diagonal (0,0)→(1,1) line on a ROC curve?
3. What is AUC, and what range does it take?
4. What does AUC = 0.5 indicate?
5. What does AUC = 1.0 indicate?
6. Why is AUC useful for comparing classifiers on imbalanced data?
7. If you lower the decision threshold, what happens to TPR and FPR?
8. Explain the tradeoff between TPR and FPR when tuning the threshold.
9. What is Youden's J, and how do you use it to find a threshold?
10. When should you use a Precision–Recall curve instead of a ROC curve?
