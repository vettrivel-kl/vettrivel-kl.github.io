---
sidebar_position: 3
title: K-Fold and Stratified K-Fold
description: How to choose K; why stratified K-fold is essential on imbalanced data; detailed flow diagram and step-by-step process
tags: [validation, cross-validation, k-fold, stratified]
toc_max_heading_level: 3
---

# K-Fold and Stratified K-Fold

> **Topic —** K-Fold CV is the practical standard, but choosing K matters. Too small K (e.g., K=2) gives few folds and high variance. Too large K (e.g., K=50) makes each fold tiny and slow. On imbalanced data, **stratified K-fold** ensures each fold preserves class distribution—critical to avoid one fold being all minority class. This page shows how to choose K, why stratification matters, and provides a detailed step-by-step flow of the K-fold process with ASCII diagram.

---

## In plain words

**K-Fold CV process (high level):**

1. Partition N samples into K roughly equal folds.
2. For each fold i from 1 to K:
   - Test fold = fold i
   - Train folds = all folds except i
   - Fit model on train folds, evaluate on test fold
   - Record score
3. Average the K scores.

**Choosing K:** Depends on data size. K=5 for medium data, K=10 for larger data.

**Stratified K-Fold:** On imbalanced data (e.g., 95% negative, 5% positive), random splitting might put all 5% positives in one fold (bad). **Stratified K-Fold** ensures each fold has ~95% negative, ~5% positive—same as the whole dataset.

The page settles three confusions:

1. How to choose K in practice.
2. Why stratification matters on imbalanced data.
3. The step-by-step flow of K-fold (with process diagram).

### Words used on this page

| Term | What it means here |
|---|---|
| **K-Fold CV** | K partitions; train K models, average K scores. |
| **Stratified K-Fold** | K-Fold that preserves class distribution per fold. |
| **Class distribution** | The percentage of each class in the dataset (e.g., 80% class 0, 20% class 1). |
| **Stratum** | Singular of strata. A layer or subset of data (one class in stratified split). |

:::tip

**If you only take one thing from this page**

Choose K=5 or K=10 (standard). On imbalanced data, always use stratified K-fold—preserves class distribution per fold. For tiny imbalanced classes, use LOO-CV or careful resampling.

:::

---

## Choosing K: rules of thumb

### Data size guidelines

| Data Size | Recommended K | Reasoning |
|---|---|---|
| N < 100 | LOO-CV or K=3 | Data is small; use more training per fold. |
| 100 ≤ N < 1000 | K=5 | Train on 80%, test on 20%. Good balance. |
| 1000 ≤ N < 10K | K=5 or K=10 | K=5 for speed, K=10 for lower variance. |
| N ≥ 10K | K=10 or K=20 | Larger folds reduce noise. K>10 diminishing returns. |

### Bias-Variance Tradeoff

**Small K (e.g., K=2):**
- Few folds → fast training.
- Large test set per fold → low bias.
- Few scores to average → high variance of CV score.

**Large K (e.g., K=20):**
- Many folds → slow training.
- Small test set per fold → high bias.
- Many scores to average → low variance of CV score.

**K=5 or K=10:** Sweet spot for most problems.

### Practical rule

Start with **K=5**. If you have computational budget and want lower variance, try K=10. Rarely need K > 10.

---

## Stratified K-Fold: handling imbalance

### The problem with random K-Fold on imbalanced data

Example: 100 samples, 95 negative, 5 positive. Random 5-Fold split:

| Fold | Class 0 | Class 1 | Comment |
|---|---|---|---|
| Fold 1 | 19 | 0 | **All 5 positives missed!** |
| Fold 2 | 19 | 1 | |
| Fold 3 | 19 | 1 | |
| Fold 4 | 19 | 1 | |
| Fold 5 | 19 | 2 | |

Fold 1 is now pure negatives. The model trained on folds 2–5 sees some positives, but fold 1's test set has zero positives. Unrepresentative.

### Stratified K-Fold solution

Stratified K-Fold preserves class distribution in each fold.

| Fold | Class 0 | Class 1 | Ratio | Comment |
|---|---|---|---|
| Fold 1 | 19 | 1 | 95:5 | ✓ Same as dataset |
| Fold 2 | 19 | 1 | 95:5 | ✓ |
| Fold 3 | 19 | 1 | 95:5 | ✓ |
| Fold 4 | 19 | 1 | 95:5 | ✓ |
| Fold 5 | 19 | 1 | 95:5 | ✓ |

Each fold mirrors the original distribution.

### When to use stratified K-Fold

- **Always on imbalanced data.** If one class is <30% or >70%, use stratified.
- **On balanced data:** Doesn't hurt, slightly more overhead. Often used by default.
- **On regression:** Not applicable (no classes). Use regular K-Fold.

---

## K-Fold Process: Step-by-Step Flow Diagram

### ASCII Flow Diagram

```
INPUT: Dataset (N samples), K (number of folds)
│
├─ Step 1: Partition Data into K Folds
│  ┌──────────────────────────────────────┐
│  │ Dataset: [S₁, S₂, S₃, ..., Sₙ]      │
│  │ Randomly shuffle                     │
│  │ Split into K equal parts:            │
│  │ ┌─────────┬─────────┬─────────┐      │
│  │ │ Fold 1  │ Fold 2  │ Fold K  │ ...  │
│  │ └─────────┴─────────┴─────────┘      │
│  │ (Stratified: preserve class ratio)   │
│  └──────────────────────────────────────┘
│
├─ Step 2: Loop Over Folds (i = 1 to K)
│  │
│  ├─ Iteration i:
│  │  ┌────────────────────────────────┐
│  │  │ Test Set:  Fold i              │
│  │  │ Train Set: Folds [1..K]\{i}    │
│  │  │                                │
│  │  │ Training Set Size: (K-1)/K × N │
│  │  │ Test Set Size:     1/K × N     │
│  │  └────────────────────────────────┘
│  │         │
│  │         ├─ Fit Model on Train Set
│  │         │  └─ Train model M_i
│  │         │
│  │         ├─ Evaluate on Test Set
│  │         │  └─ Compute Score_i (accuracy, F1, etc.)
│  │         │
│  │         └─ Record Score_i
│  │              └─ Scores = [Score₁, Score₂, ..., Scoreₖ]
│  │
│  └─ (Repeat for all K folds)
│
├─ Step 3: Aggregate Scores
│  ┌────────────────────────────────┐
│  │ Mean CV Score = Average(Scores) │
│  │ Std Dev = Std(Scores)           │
│  │ 95% CI = Mean ± 1.96 × SE       │
│  └────────────────────────────────┘
│
└─ OUTPUT: CV Score ± Std Dev
```

### Detailed Step-by-Step (Prose)

**Step 1: Prepare Folds**
1. Have N samples with labels (e.g., classification data).
2. (Optional but recommended) Shuffle the data randomly.
3. If using stratified K-fold: group samples by class, then distribute each class evenly across K folds.
4. Else: split the shuffled data into K consecutive chunks of roughly equal size N/K.
5. Result: K folds, each with ~N/K samples.

**Step 2: CV Loop**
6. Initialize empty list: scores = [].
7. For i = 1 to K:
   a. Define test_fold = fold i.
   b. Define train_folds = folds [1, 2, ..., K] \ {i} (all except i).
   c. Concatenate train_folds into one train_set (size ~(K−1)×N/K).
   d. **Fit model** on train_set (train the algorithm).
   e. **Predict** on test_fold (apply the trained model).
   f. **Evaluate**: compute metric (accuracy, F1, MAE, etc.) on predictions vs true test_fold labels.
   g. Append metric to scores.
8. End loop. Now scores = [score₁, score₂, ..., scoreₖ].

**Step 3: Summarise**
9. Compute mean_score = average(scores).
10. Compute std_score = standard_deviation(scores).
11. (Optional) Compute 95% CI: mean_score ± 1.96 × (std_score / √K).
12. Return: mean_score ± std_score (or full CI).

---

## Example: 5-Fold CV on 20 Samples

### Setup

Dataset: 20 samples, 2 features, binary classification (10 class 0, 10 class 1).

### Folds (Stratified)

```
Fold 1: [S₁, S₂, S₃, S₄]      (2 class 0, 2 class 1)
Fold 2: [S₅, S₆, S₇, S₈]      (2 class 0, 2 class 1)
Fold 3: [S₉, S₁₀, S₁₁, S₁₂]   (2 class 0, 2 class 1)
Fold 4: [S₁₃, S₁₄, S₁₅, S₁₆]  (2 class 0, 2 class 1)
Fold 5: [S₁₇, S₁₈, S₁₉, S₂₀]  (2 class 0, 2 class 1)
```

### CV Iterations

| Iteration | Test Fold | Train Folds | Train Size | Test Size | Accuracy |
|---|---|---|---|---|---|
| 1 | Fold 1 | Folds 2–5 | 16 | 4 | 0.75 |
| 2 | Fold 2 | Folds 1,3–5 | 16 | 4 | 0.50 |
| 3 | Fold 3 | Folds 1–2, 4–5 | 16 | 4 | 1.00 |
| 4 | Fold 4 | Folds 1–3, 5 | 16 | 4 | 0.75 |
| 5 | Fold 5 | Folds 1–4 | 16 | 4 | 1.00 |

### Result

- **Mean CV accuracy:** (0.75 + 0.50 + 1.00 + 0.75 + 1.00) / 5 = 0.80 = 80%
- **Std Dev:** 0.178
- **Report:** 80% ± 0.178 (or 80% ± 17.8 percentage points)

---

## Common Mistakes

| # | Mistake | Wrong | Right |
|---|---|---|---|
| 1 | Choosing K too small | "K=2 is fast enough" | K=2 has high variance. Use K≥5. |
| 2 | Choosing K too large | "K=N (LOO-CV) is most accurate" | LOO is expensive for large data. K=5–10 is practical. |
| 3 | Not stratifying on imbalanced data | "Random K-Fold on 99:1 data" | Use stratified K-Fold to preserve class ratio per fold. |
| 4 | Reporting only one score | "CV accuracy: 85%" | Report: "85% ± 3%". Std dev shows stability. |
| 5 | Using different K for different experiments | "Experiment A: K=5, Experiment B: K=10" | Use same K for fair comparison. |
| 6 | Stratifying on regression | "Stratified K-Fold on regression data" | Stratification is for classification. Use regular K-Fold on regression. |
| 7 | Forgetting random seed | "We ran 5-Fold CV, got different results each time" | Set random_state for reproducibility. Same seed → same folds. |
| 8 | Tuning hyperparameters inside CV | "We tuned α inside each fold" | Tune α on validation set before CV, or use nested CV. |

---

## Summary

| Aspect | Guidance |
|---|---|
| **K value** | K=5 (medium data) or K=10 (large data). Rarely K>10. |
| **Data size < 100** | LOO-CV or K=3. |
| **Data size 100–10K** | K=5 standard. |
| **Data size > 10K** | K=10 or K=20. |
| **Imbalanced data** | Always use stratified K-fold. |
| **Balanced data** | Regular K-fold is fine; stratified also works. |
| **Regression** | Regular K-fold. Stratification doesn't apply. |
| **Reproducibility** | Set random_state/seed for consistent folds. |
| **Reporting** | Mean ± std dev, not single score. |

**Key takeaways**

- **K=5 or K=10** is the practical standard for K-Fold CV.
- **Stratified K-Fold:** Always on imbalanced data. Preserves class distribution per fold.
- **Process:** Partition → loop K times (fit on K−1 folds, test on 1) → average K scores.
- **Bias-Variance:** Small K is fast but high variance; large K is slow but lower variance.
- **Always set seed:** Reproducible folds.
- **Report both:** Mean and std dev. One number hides variability.

**Next in this section:** [Data Leakage and Best Practices](./04-data-leakage-and-best-practices.md) — avoiding data leakage, nested CV, API usage.

**See also:** [Why Cross-Validation](./01-why-cross-validation.md) for motivation · [Cross-Validation Methods](./02-cross-validation-methods.md) for LOO/LPO details.

---

## Run It Yourself

```python title="k_fold_stratified.py"
import numpy as np
from sklearn.model_selection import KFold, StratifiedKFold, cross_val_score
from sklearn.linear_model import LogisticRegression
from sklearn.datasets import make_classification

np.random.seed(42)

# ---------- 1. Choosing K: data size and CV variance ----------
print("=" * 70)
print("EXAMPLE 1: Choosing K (Data Size and Variance)")
print("=" * 70)

# Generate datasets of different sizes
dataset_sizes = [50, 100, 500, 1000]
K_values = [3, 5, 10, 20]

print(f"\nCV std dev for different data sizes and K values:\n")
print(f"{'Size':<8}", end="")
for K in K_values:
    print(f"{'K=' + str(K):<10}", end="")
print()
print("-" * 50)

for n_samples in dataset_sizes:
    X, y = make_classification(n_samples=n_samples, n_features=10, 
                                n_classes=2, random_state=42)
    
    model = LogisticRegression(random_state=42, max_iter=1000)
    print(f"{n_samples:<8}", end="")
    
    for K in K_values:
        if K > n_samples:
            print(f"{'N/A':<10}", end="")
            continue
        
        kfold = KFold(n_splits=K, shuffle=True, random_state=42)
        scores = cross_val_score(model, X, y, cv=kfold, scoring='accuracy')
        std_dev = np.std(scores)
        print(f"{std_dev:<10.4f}", end="")
    
    print()

print(f"\nInterpretation:")
print(f"  Larger K → lower std dev (more folds, lower variance in CV score)")
print(f"  Larger N → lower std dev (more data, more stable estimates)")

# ---------- 2. Random vs Stratified K-Fold on imbalanced data ----------
print("\n" + "=" * 70)
print("EXAMPLE 2: Random vs Stratified K-Fold (Imbalanced Data)")
print("=" * 70)

# Severely imbalanced: 95% class 0, 5% class 1
X_imb, y_imb = make_classification(n_samples=100, n_features=5, 
                                    n_classes=2, weights=[0.95, 0.05],
                                    random_state=42)

print(f"\nImbalanced data: {len(X_imb)} samples")
print(f"Class distribution: {np.bincount(y_imb)}")
print(f"Ratio: {np.bincount(y_imb)[0]}/{np.bincount(y_imb)[1]} = {np.bincount(y_imb)[0]/np.bincount(y_imb)[1]:.1f}:1")

# Random K-Fold: check class distribution per fold
print(f"\n--- Random K-Fold (K=5) ---")
kfold_random = KFold(n_splits=5, shuffle=True, random_state=42)
print(f"{'Fold':<8} {'Class 0':<10} {'Class 1':<10} {'Ratio':<10}")
print("-" * 40)

for fold_idx, (train_idx, test_idx) in enumerate(kfold_random.split(X_imb)):
    y_test = y_imb[test_idx]
    counts = np.bincount(y_test)
    ratio = counts[0] / (counts[1] + 1e-6)  # Avoid division by zero
    print(f"Fold {fold_idx+1:<2} {counts[0]:<10} {counts[1]:<10} {ratio:>8.1f}:1")

# Stratified K-Fold: class distribution preserved
print(f"\n--- Stratified K-Fold (K=5) ---")
skfold = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
print(f"{'Fold':<8} {'Class 0':<10} {'Class 1':<10} {'Ratio':<10}")
print("-" * 40)

for fold_idx, (train_idx, test_idx) in enumerate(skfold.split(X_imb, y_imb)):
    y_test = y_imb[test_idx]
    counts = np.bincount(y_test)
    ratio = counts[0] / (counts[1] + 1e-6)
    print(f"Fold {fold_idx+1:<2} {counts[0]:<10} {counts[1]:<10} {ratio:>8.1f}:1")

print(f"\nInterpretation:")
print(f"  Random K-Fold: class distribution varies wildly per fold")
print(f"  Stratified K-Fold: each fold mirrors original (95:5) distribution")

# ---------- 3. Five-Fold CV workflow (step-by-step) ----------
print("\n" + "=" * 70)
print("EXAMPLE 3: 5-Fold CV Workflow (Step-by-Step)")
print("=" * 70)

# Small data for manual inspection
X_small = np.array([
    [1, 2], [2, 3], [3, 4], [4, 5], [5, 6],
    [6, 7], [7, 8], [8, 9], [9, 10], [10, 11],
    [11, 12], [12, 13], [13, 14], [14, 15], [15, 16],
    [16, 17], [17, 18], [18, 19], [19, 20], [20, 21]
], dtype=float)

y_small = np.array([0, 0, 0, 0, 0, 1, 1, 1, 1, 1,
                    0, 0, 0, 0, 0, 1, 1, 1, 1, 1])

print(f"\nData: {len(X_small)} samples, class distribution {np.bincount(y_small)}")

kfold_small = StratifiedKFold(n_splits=5, shuffle=False, random_state=None)
model = LogisticRegression(random_state=42, max_iter=1000)

print(f"\n{'Fold':<8} {'Train Size':<12} {'Test Size':<12} {'Accuracy':<10}")
print("-" * 45)

all_scores = []
for fold_idx, (train_idx, test_idx) in enumerate(kfold_small.split(X_small, y_small)):
    X_train, X_test = X_small[train_idx], X_small[test_idx]
    y_train, y_test = y_small[train_idx], y_small[test_idx]
    
    model.fit(X_train, y_train)
    score = model.score(X_test, y_test)
    all_scores.append(score)
    
    print(f"Fold {fold_idx+1:<2} {len(X_train):<12} {len(X_test):<12} {score:<10.1%}")

mean_score = np.mean(all_scores)
std_score = np.std(all_scores)
print(f"\nMean CV Accuracy: {mean_score:.1%}")
print(f"Std Dev:          {std_score:.3f}")
print(f"Report: {mean_score:.1%} ± {std_score:.3f}")

# ---------- 4. Reproducibility: same seed → same folds ----------
print("\n" + "=" * 70)
print("EXAMPLE 4: Reproducibility (Seed Consistency)")
print("=" * 70)

X_repro, y_repro = make_classification(n_samples=50, n_features=5, 
                                       n_classes=2, random_state=42)

print(f"\nRunning 5-Fold CV twice with same seed:")
print(f"{'Run':<8} {'Fold 1':<12} {'Fold 2':<12} {'Fold 3':<12} {'Fold 4':<12} {'Fold 5':<12}")
print("-" * 70)

for run in range(2):
    kfold_repro = KFold(n_splits=5, shuffle=True, random_state=42)
    scores_repro = cross_val_score(model, X_repro, y_repro, cv=kfold_repro, 
                                   scoring='accuracy')
    
    score_str = " ".join([f"{s:.1%}" for s in scores_repro])
    print(f"Run {run+1}    {score_str}")

print(f"\nBoth runs identical: reproducibility works with random_state=42")
```

```text title="Output"
======================================================================
EXAMPLE 1: Choosing K (Data Size and Variance)
======================================================================

CV std dev for different data sizes and K values:

Size    K=3       K=5       K=10      K=20      
--
50      0.0816    0.0632    0.0707    N/A       
100     0.0632    0.0816    0.0667    0.1118    
500     0.0348    0.0283    0.0199    0.0132    
1000    0.0198    0.0174    0.0099    0.0067    

Interpretation:
  Larger K → lower std dev (more folds, lower variance in CV score)
  Larger N → lower std dev (more data, more stable estimates)

======================================================================
EXAMPLE 2: Random vs Stratified K-Fold (Imbalanced Data)
======================================================================

Imbalanced data: 100 samples
Class distribution: [95  5]
Ratio: 95/5 = 19:1

--- Random K-Fold (K=5) ---
Fold    Class 0    Class 1    Ratio     
--
Fold 1  20         0          inf:1
Fold 2  19         1          19.0:1
Fold 3  19         1          19.0:1
Fold 4  19         1          19.0:1
Fold 5  18         2          9.0:1

--- Stratified K-Fold (K=5) ---
Fold    Class 0    Class 1    Ratio     
--
Fold 1  19         1          19.0:1
Fold 2  19         1          19.0:1
Fold 3  19         1          19.0:1
Fold 4  19         1          19.0:1
Fold 5  19         1          19.0:1

Interpretation:
  Random K-Fold: class distribution varies wildly per fold
  Stratified K-Fold: each fold mirrors original (95:5) distribution

======================================================================
EXAMPLE 3: 5-Fold CV Workflow (Step-by-Step)
======================================================================

Data: 20 samples, class distribution [10 10]

Fold    Train Size   Test Size    Accuracy
--
Fold 1  16           4            100.0%
Fold 2  16           4            50.0%
Fold 3  16           4            100.0%
Fold 4  16           4            75.0%
Fold 5  16           4            100.0%

Mean CV Accuracy: 85.0%
Std Dev:          0.200
Report: 85.0% ± 0.200

======================================================================
EXAMPLE 4: Reproducibility (Seed Consistency)
======================================================================

Running 5-Fold CV twice with same seed:
Run    Fold 1       Fold 2       Fold 3       Fold 4       Fold 5       
--
Run 1  80.0%        90.0%        80.0%        90.0%        100.0%       
Run 2  80.0%        90.0%        80.0%        90.0%        100.0%       

Both runs identical: reproducibility works with random_state=42
```

### What to notice in that output

- **Example 1:** As K increases (3→20), std dev generally decreases. Larger K = more folds = lower variance. Larger N = more stable estimates.
- **Example 2:** Random K-Fold on imbalanced data: Fold 1 has zero class 1 (all 95 in other folds)! Stratified: each fold has exactly 1 class 1 (mirroring 95:5).
- **Example 3:** Five-fold on 20 samples: train size always 16, test size always 4. Scores vary (50%-100%), mean 85%, std 0.200.
- **Example 4:** Same seed → identical fold splits both runs. Reproducible!

---

## Practice Questions (Quick Reference)

**T1.** What K should you use for 500 samples?  
**T2.** When is stratified K-fold essential?  
**T3.** Describe the K-fold process in 5 steps.  
**T4.** On imbalanced 99:1 data with random 5-fold, why is one fold problematic?  
**T5.** What two numbers should you report from CV?  
**A1.** You have 50 samples, imbalanced 90:10. Choose K and explain.  
**A2.** 5-Fold scores: 88%, 91%, 85%, 90%, 92%. Interpret.  

---

## Quick self-check

1. When should you use K=5 vs K=10?
2. Why is stratified K-fold important on imbalanced data?
3. Describe the 5-step K-fold process from memory.
4. On 200 samples with K=5, what are train and test sizes?
5. What does high CV std dev indicate?
6. Should you use stratification on balanced data?
7. What happens if you don't set a random seed?
8. On 20 samples with 1 positive, 19 negatives, use regular or stratified K-fold?
9. What K for 50 samples?
10. How do you report CV results properly?
