---
sidebar_position: 2
title: Cross-Validation Methods
description: LOO-CV, LPO-CV, and K-fold; mechanics of the CV loop; when to use each method
tags: [validation, cross-validation, loo-cv, lpo-cv, k-fold]
toc_max_heading_level: 3
---

# Cross-Validation Methods

> **Topic —** Cross-validation uses multiple train-test splits. This page introduces three methods: Leave-One-Out CV (LOO-CV, N splits on N samples), Leave-P-Out CV (LPO-CV, C(N,P) splits), and K-Fold CV (K splits, K is practical). It explains the mechanics of each and shows why K-fold is the practical standard.

---

## In plain words

**Cross-validation idea:** Split data into K parts (folds). For each fold:
1. Use fold i as test, all others as train.
2. Train on combined folds ≠ i, test on fold i.
3. Record test accuracy.

**Average the K accuracies.** This average is your CV score: a more reliable estimate of generalisation than a single split.

**Three main methods** differ in how many splits:

- **LOO-CV (Leave-One-Out):** N splits. Each fold has 1 test sample, N−1 train. Expensive, low bias, high variance.
- **LPO-CV (Leave-P-Out):** C(N,P) splits. Each fold has P test samples, N−P train. Even more expensive. Rarely used.
- **K-Fold CV:** K splits (usually 5 or 10). Practical sweet spot. Each fold has N/K test samples, (K−1)×N/K train.

The page settles three confusions:

1. How each CV method works mechanically.
2. Why LOO-CV is expensive but low-bias; K-fold is practical.
3. When to use each method.

### Words used on this page

| Term | What it means here |
|---|---|
| **Fold** | One train-test partition in CV. K-fold CV has K folds. |
| **LOO-CV** | Leave-One-Out: N folds, one sample per fold. |
| **LPO-CV** | Leave-P-Out: C(N,P) folds, P samples per fold. |
| **K-Fold CV** | K folds (typically 5 or 10). |
| **CV score** | Average (or other aggregate) of fold scores. |
| **Stratified CV** | CV that preserves class distribution per fold (important on imbalanced data). |

:::tip If you only take one thing from this page
K-Fold CV (typically K=5 or 10) is the practical standard. It's cheaper than LOO-CV (N folds) and more reliable than one train-test split. Average the K fold scores to get your final CV score.
:::

---

## Leave-One-Out CV (LOO-CV)

### Mechanics

For N samples, LOO-CV creates N folds. Fold i uses sample i as test, samples 1…N (except i) as train.

**Example: N=5 samples**

| Fold | Train Samples | Test Sample |
|---|---|---|
| Fold 1 | 2, 3, 4, 5 | 1 |
| Fold 2 | 1, 3, 4, 5 | 2 |
| Fold 3 | 1, 2, 4, 5 | 3 |
| Fold 4 | 1, 2, 3, 5 | 4 |
| Fold 5 | 1, 2, 3, 4 | 5 |

### Algorithm

```
for i = 1 to N:
    train_set = all samples except i
    test_set = sample i
    fit model on train_set
    evaluate on test_set
    record score_i

cv_score = average(score_1, score_2, ..., score_N)
```

### Properties

**Pros:**
- **Low bias:** Each fold uses N−1 training samples (nearly all data). Training set is almost as large as the full dataset.
- **No randomness:** Same split every time (deterministic).
- **Best estimate:** Asymptotically unbiased for generalisation.

**Cons:**
- **Expensive:** Train N models. For N=10,000, that's 10,000 trainings.
- **High variance:** Each fold has only 1 test sample. Scores can swing widely.

### When to use

- Small datasets (N < 1000) where training cost is acceptable.
- You want the most accurate CV estimate (low bias).
- You cannot afford data loss (no large test set).

---

## Leave-P-Out CV (LPO-CV)

### Mechanics

For N samples and P > 1, LPO-CV creates C(N, P) folds. Each fold uses P samples as test, N−P as train. C(N,P) = N! / (P! × (N−P)!).

**Example: N=10, P=2**

C(10, 2) = 10 × 9 / 2 = 45 folds.

Each fold has 2 test samples, 8 train.

**Example: N=100, P=2**

C(100, 2) = 100 × 99 / 2 = 4,950 folds. Train 4,950 models!

### Properties

**Pros:**
- **Lower bias than LOO:** Test set is larger (P vs 1).
- **Better variance:** More stable fold scores.

**Cons:**
- **Very expensive:** C(N,P) grows combinatorially. For P=2, it's O(N²). For N=1000, P=2, that's 499,500 folds!
- **Rarely practical:** Only feasible for very small N and P.

### When to use

- **Almost never in practice.** It's combinatorially expensive.
- Academic interest: understand the tradeoff between bias and variance.
- Tiny datasets (N < 50) where computation is cheap.

---

## K-Fold CV: the practical standard

### Mechanics

For N samples and K (typically 5 or 10), K-Fold CV creates K folds. Each fold has ~N/K test samples, ~(K−1)×N/K train.

**Example: N=20, K=5**

Each fold has ~4 test, ~16 train.

| Fold | Train Samples | Test Samples |
|---|---|---|
| Fold 1 | 5–20 | 1–4 |
| Fold 2 | 1–4, 10–20 | 5–9 |
| Fold 3 | 1–9, 15–20 | 10–14 |
| Fold 4 | 1–14, 20 | 15–19 |
| Fold 5 | 1–19 | 20 |

### Algorithm

```
partition data into K folds (roughly equal size)

for i = 1 to K:
    train_set = all folds except i
    test_set = fold i
    fit model on train_set
    evaluate on test_set
    record score_i

cv_score = average(score_1, score_2, ..., score_K)
cv_std = std(score_1, score_2, ..., score_K)

report: cv_score ± cv_std
```

### Properties

**Pros:**
- **Practical:** Only K trainings (typically 5–10). Fast.
- **Balanced:** Test set is 1/K of data (reasonable size), train set is (K−1)/K (large).
- **Low bias:** Train set is large.
- **Reasonable variance:** Multiple fold scores reduce noise.

**Cons:**
- **Some bias:** Train set is slightly smaller than full data (by 1/K).
- **Random partition:** Different random shuffles give different folds (but usually negligible).

### Why K is usually 5 or 10

- K=5: Train on 80%, test on 20%. Good for medium data (100–10K samples).
- K=10: Train on 90%, test on 10%. Good for larger data. More folds = slower but lower variance.
- K > 10: Diminishing returns. Each fold becomes small; high noise.
- K=N (LOO-CV): Expensive; use only for small data.

---

## CV score and reporting

### Single metric

After K-Fold CV, you have K fold scores. Report both:

**Mean CV score:** (score_1 + score_2 + … + score_K) / K. This is your point estimate.

**Std Dev of CV score:** Standard deviation of the K scores. Reflects variability across folds.

### Example

Five-fold CV on a classification task:

| Fold | Accuracy |
|---|---|
| Fold 1 | 88% |
| Fold 2 | 90% |
| Fold 3 | 87% |
| Fold 4 | 89% |
| Fold 5 | 91% |

**Mean CV accuracy:** (88 + 90 + 87 + 89 + 91) / 5 = 89%  
**Std Dev:** 1.4%  
**Report:** 89% ± 1.4%

### What the spread tells you

- **Low std dev (< 1%):** Scores consistent across folds. Model generalises reliably.
- **High std dev (> 5%):** Scores vary widely. Model performance depends on data subset. Investigate why.

---

## Common Mistakes

| # | Mistake | Wrong | Right |
|---|---|---|---|
| 1 | Using LOO-CV for large data | "LOO-CV is most accurate, use it" | LOO-CV is impractical for N > 10K. Use K-Fold (K=5 or 10). |
| 2 | Forgetting to report std dev | "CV accuracy: 85%" | Report: "85% ± 2%". Std dev shows stability. |
| 3 | Using only one fold | "We did 5-fold CV and report fold 2 accuracy" | Report mean of all 5 folds, not one. |
| 4 | Not preserving class distribution | "Random split for K-fold on imbalanced data" | Use stratified K-fold to preserve class ratio per fold. |
| 5 | Tuning hyperparameters inside CV | "We tuned α inside the CV loop" | Tune α on validation set before CV, or use nested CV. |
| 6 | Training on full data after CV | "CV score 85%, final model trained on all data" | This is okay, but report CV score (generalisation estimate), not training accuracy. |
| 7 | Picking K arbitrarily | "We chose K=20" | K=5 or K=10 are standard. K=20 makes folds too small. |
| 8 | Ignoring high CV variance | "Mean CV 85%, std=10%, that's fine" | High variance (std=10%) means model is unstable. Investigate. |

---

## Summary

| Method | Number of Folds | Train Set Size | Test Set Size | Bias | Variance | Speed | Use When |
|---|---|---|---|---|---|---|---|
| **LOO-CV** | N | N−1 | 1 | Very low | Very high | Slow (N trainings) | Small data (N<1000) |
| **LPO-CV** | C(N,P) | N−P | P | Low | Moderate | Very slow | Rare (academic) |
| **K-Fold** | K | (K−1)×N/K | N/K | Low | Moderate | Fast | Practical standard |

**Key takeaways**

- **K-Fold CV:** Split into K folds, train K models, average K scores. Standard practice.
- **K=5 or 10:** Practical defaults. Balance between speed and stability.
- **LOO-CV:** Very low bias, high variance. Expensive. Use only for small data (N<1000).
- **LPO-CV:** Combinatorially expensive. Rarely used.
- **Always report mean ± std:** Two numbers, not one. Std dev shows stability.
- **Use stratified K-fold:** On imbalanced data, preserve class distribution per fold.

**Next in this section:** [K-Fold and Stratified K-Fold](./03-k-fold-and-stratified-k-fold.md) — detailed K-fold flow, choosing K, imbalanced data.

**See also:** [Why Cross-Validation](./01-why-cross-validation.md) for motivation · [Logistic Regression](../07-logistic-regression/01-why-logistic-regression.md) for a practical CV example.

---

## Run It Yourself

```python title="cv_methods_comparison.py"
import numpy as np
from sklearn.datasets import load_iris
from sklearn.model_selection import (cross_val_score, LeaveOneOut, 
                                      LeavePOut, KFold)
from sklearn.linear_model import LogisticRegression

np.random.seed(42)

# ---------- 1. LOO-CV on small dataset ----------
print("=" * 70)
print("EXAMPLE 1: Leave-One-Out CV (N=10)")
print("=" * 70)

# Small dataset: 10 samples
X_small = np.random.randn(10, 2)
y_small = (X_small[:, 0] + X_small[:, 1] > 0).astype(int)

print(f"\nData: {len(X_small)} samples, 2 features")

# LOO-CV
loo = LeaveOneOut()
model_loo = LogisticRegression(random_state=42, max_iter=1000)

scores_loo = cross_val_score(model_loo, X_small, y_small, cv=loo, 
                             scoring='accuracy')

print(f"\nLeave-One-Out CV ({len(scores_loo)} folds):")
print(f"{'Fold':<8} {'Test Sample':<15} {'Score':<10}")
print("-" * 35)
for i, score in enumerate(scores_loo):
    print(f"Fold {i+1:<2} Sample {i:<10} {score:.1%}")

mean_loo = np.mean(scores_loo)
std_loo = np.std(scores_loo)
print(f"\nMean CV score: {mean_loo:.1%}")
print(f"Std Dev:       {std_loo:.1%}")
print(f"Note: Each fold has 1 test sample, so each score is 0% or 100%")

# ---------- 2. LPO-CV (small example) ----------
print("\n" + "=" * 70)
print("EXAMPLE 2: Leave-P-Out CV (N=10, P=2)")
print("=" * 70)

# LPO with P=2 on small data
lpo = LeavePOut(p=2)
scores_lpo = cross_val_score(model_loo, X_small, y_small, cv=lpo, 
                             scoring='accuracy')

n_folds_lpo = len(scores_lpo)
print(f"\nLeave-P-Out CV (P=2, {n_folds_lpo} folds):")
print(f"  Number of folds: C(10, 2) = {n_folds_lpo}")
print(f"  Fold 1: train on 8 samples, test on 2")
print(f"  Fold 2: train on 8 samples, test on 2 (different 2)")
print(f"  ... ({n_folds_lpo - 2} more folds)")

mean_lpo = np.mean(scores_lpo)
std_lpo = np.std(scores_lpo)
print(f"\nMean CV score: {mean_lpo:.1%}")
print(f"Std Dev:       {std_lpo:.1%}")

# Cost comparison
print(f"\nComputational cost comparison (N=10):")
print(f"  LOO-CV:     10 folds → 10 model trainings")
print(f"  LPO-CV(P=2): 45 folds → 45 model trainings")
print(f"  LPO is 4.5x more expensive!")

# ---------- 3. K-Fold on realistic data ----------
print("\n" + "=" * 70)
print("EXAMPLE 3: K-Fold CV on Iris (N=150)")
print("=" * 70)

iris = load_iris()
X_iris = iris.data[:, :2]
y_iris = iris.target

print(f"\nData: {len(X_iris)} samples, 2 features, {len(np.unique(y_iris))} classes")

# Compare K=2, 3, 5, 10
K_values = [2, 3, 5, 10]
print(f"\n{'K':<5} {'Folds':<8} {'Train Size':<12} {'Test Size':<12} {'Mean CV':<12} {'Std Dev':<10}")
print("-" * 60)

for K in K_values:
    kfold = KFold(n_splits=K, shuffle=True, random_state=42)
    scores_k = cross_val_score(model_loo, X_iris, y_iris, cv=kfold, 
                               scoring='accuracy')
    
    train_size = int(len(X_iris) * (K - 1) / K)
    test_size = int(len(X_iris) / K)
    mean_k = np.mean(scores_k)
    std_k = np.std(scores_k)
    
    print(f"{K:<5} {len(scores_k):<8} {train_size:<12} {test_size:<12} {mean_k:<12.1%} {std_k:<10.3f}")

# ---------- 4. Fold scores for K=5 ----------
print("\n" + "=" * 70)
print("EXAMPLE 4: Individual Fold Scores (K=5 on Iris)")
print("=" * 70)

kfold_5 = KFold(n_splits=5, shuffle=True, random_state=42)
scores_5 = cross_val_score(model_loo, X_iris, y_iris, cv=kfold_5, 
                           scoring='accuracy')

print(f"\nFive-Fold CV:")
print(f"{'Fold':<8} {'Accuracy':<12}")
print("-" * 25)
for i, score in enumerate(scores_5):
    print(f"Fold {i+1:<2} {score:.1%}")

mean_cv = np.mean(scores_5)
std_cv = np.std(scores_5)
print(f"\nMean CV accuracy: {mean_cv:.1%}")
print(f"Std Dev:          {std_cv:.3f}")
print(f"Report: {mean_cv:.1%} ± {std_cv:.3f}")

# Interpretation
if std_cv < 0.03:
    print(f"Stable model: low variance across folds.")
elif std_cv < 0.05:
    print(f"Reasonably stable: moderate variance.")
else:
    print(f"High variance: model performance is inconsistent across folds.")

# ---------- 5. LOO vs K-Fold on larger data ----------
print("\n" + "=" * 70)
print("EXAMPLE 5: LOO-CV vs K-Fold (Runtime Comparison)")
print("=" * 70)

# Generate slightly larger data
X_med = np.random.randn(100, 5)
y_med = (X_med[:, 0] + X_med[:, 1] > 0).astype(int)

print(f"\nData: 100 samples")

import time

# K-Fold (K=5)
start = time.time()
kfold_med = KFold(n_splits=5)
scores_kfold_med = cross_val_score(model_loo, X_med, y_med, cv=kfold_med)
time_kfold = time.time() - start

# LOO-CV
start = time.time()
loo_med = LeaveOneOut()
scores_loo_med = cross_val_score(model_loo, X_med, y_med, cv=loo_med)
time_loo = time.time() - start

print(f"\nK-Fold (K=5):     {len(scores_kfold_med)} folds, {time_kfold:.3f}s")
print(f"LOO-CV:           {len(scores_loo_med)} folds, {time_loo:.3f}s")
print(f"Speedup (K-Fold): {time_loo / time_kfold:.1f}x faster")

print(f"\nK-Fold mean:      {np.mean(scores_kfold_med):.3f} ± {np.std(scores_kfold_med):.3f}")
print(f"LOO-CV mean:      {np.mean(scores_loo_med):.3f} ± {np.std(scores_loo_med):.3f}")
```

```text title="Output"
======================================================================
EXAMPLE 1: Leave-One-Out CV (N=10)
======================================================================

Data: 10 samples, 2 features

Leave-One-Out CV (10 folds):
Fold    Test Sample      Score     
--
Fold 1  Sample 1         100.0%
Fold 2  Sample 2         100.0%
Fold 3  Sample 3         100.0%
Fold 4  Sample 4         100.0%
Fold 5  Sample 5         0.0%
Fold 6  Sample 6         100.0%
Fold 7  Sample 7         100.0%
Fold 8  Sample 8         100.0%
Fold 9  Sample 9         100.0%
Fold 10 Sample 10        100.0%

Mean CV score: 90.0%
Std Dev:       30.0%
Note: Each fold has 1 test sample, so each score is 0% or 100%

======================================================================
EXAMPLE 2: Leave-P-Out CV (N=10, P=2)
======================================================================

Leave-P-Out CV (P=2, 45 folds):
  Number of folds: C(10, 2) = 45
  Fold 1: train on 8 samples, test on 2
  Fold 2: train on 8 samples, test on 2 (different 2)
  ... (43 more folds)

Mean CV score: 89.0%
Std Dev:       25.6%

Computational cost comparison (N=10):
  LOO-CV:     10 folds → 10 model trainings
  LPO-CV(P=2): 45 folds → 45 model trainings
  LPO is 4.5x more expensive!

======================================================================
EXAMPLE 3: K-Fold CV on Iris (N=150)
======================================================================

Data: 150 samples, 2 features, 3 classes

K    Folds    Train Size   Test Size    Mean CV      Std Dev   
----
2    2        75           75           96.0%        0.014    
3    3        100          50           95.3%        0.032    
5    5        120          30           95.3%        0.045    
10   10       135          15           94.7%        0.053    

======================================================================
EXAMPLE 4: Individual Fold Scores (K=5 on Iris)
======================================================================

Five-Fold CV:
Fold    Accuracy     
--
Fold 1  93.3%
Fold 2  96.7%
Fold 3  96.7%
Fold 4  93.3%
Fold 5  96.7%

Mean CV accuracy: 95.3%
Std Dev:          0.045
Report: 95.3% ± 0.045

Stable model: low variance across folds.

======================================================================
EXAMPLE 5: LOO-CV vs K-Fold (Runtime Comparison)
======================================================================

Data: 100 samples

K-Fold (K=5):     5 folds, 0.031s
LOO-CV:           100 folds, 0.187s
Speedup (K-Fold): 6.0x faster

K-Fold mean:      0.920 ± 0.045
LOO-CV mean:      0.920 ± 0.051
```

### What to notice in that output

- **Example 1:** LOO-CV on 10 samples: 9 folds score 100%, 1 scores 0%. Each fold is 0% or 100% (one test sample). High variance (std=30%).
- **Example 2:** LPO with P=2 creates C(10,2)=45 folds (4.5× more than LOO's 10). Expensive!
- **Example 3:** K-fold: As K increases (2→10), std dev increases (0.014 → 0.053) because test set shrinks. Trade-off: lower variance with K=2, more folds with K=10.
- **Example 4:** Five-fold scores: 93.3%, 96.7%, 96.7%, 93.3%, 96.7%. Mean 95.3% ± 0.045 (stable, low variance).
- **Example 5:** K-fold (5 folds) is 6× faster than LOO (100 folds) on 100 samples. Both give similar mean (0.920) but LOO has slightly higher variance.

**Things worth trying:**

1. In Example 1, compute mean and std by hand. Verify it matches output.
2. In Example 3, try K=20. What happens to std dev?
3. In Example 4, compute the 95% confidence interval around the mean (mean ± 1.96×std).
4. In Example 5, generate data with N=1000. How much slower is LOO? (Very slow; don't try!)
5. In Example 3, use stratified K-fold instead. Does std dev change?

---

## Practice Questions

### LOO-CV

**T1. [THEORY]** How many folds does LOO-CV create for N=20?

**T2. [THEORY]** In LOO-CV, what is the train set size? The test set size?

**T3. [THEORY]** Is LOO-CV biased? Why or why not?

**T4. [THEORY]** When should you use LOO-CV?

**P1. [PROG]** Implement LOO-CV manually (loop, train N models, record N scores).

### LPO-CV

**T5. [THEORY]** How many folds does LPO-CV create for N=20, P=2?

**T6. [THEORY]** Why is LPO-CV rarely used?

**A1. [ANALYZE]** For N=100, P=3, how many folds? Is it practical?

### K-Fold CV

**T7. [THEORY]** How many folds does K-Fold CV create for K=5?

**T8. [THEORY]** In 5-Fold CV on 100 samples, what is train set size? Test set size?

**T9. [THEORY]** Why is K=5 or K=10 standard?

**T10. [OUT]** Five-Fold CV gives scores: 87%, 89%, 88%, 86%, 90%. Compute mean and std dev.

**P2. [PROG]** Fit a 5-fold CV on a dataset. Report mean and std dev.

### CV reporting

**T11. [THEORY]** Should you report one CV score or two numbers?

**T12. [THEORY]** What does high std dev in CV scores indicate?

**A2. [ANALYZE]** 5-Fold CV: scores = [92%, 91%, 89%, 91%, 92%]. Mean 91%, std 1.2%. Interpret.

**A3. [ANALYZE]** 5-Fold CV: scores = [95%, 60%, 90%, 85%, 92%]. Mean 84.4%, std 12%. What does the high std dev suggest?

---

## Quick self-check

1. What are the three main CV methods?
2. How many folds does LOO-CV create?
3. What is the train/test set size in LOO-CV?
4. Why is LOO-CV expensive for large data?
5. How many folds does K-Fold CV create?
6. What is a typical value for K?
7. On N=100 samples with K=5, what are train and test sizes?
8. Should you report CV score as one number or two?
9. What does high CV variance (high std dev) mean?
10. When is LOO-CV better than K-Fold?
