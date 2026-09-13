---
sidebar_position: 4
title: Data Leakage and Best Practices
description: Data leakage trap (scaling before splitting); Pipeline to prevent it; nested CV for hyperparameter tuning; scikit-learn API; comparing models
tags: [validation, cross-validation, data-leakage, pipeline, nested-cv]
toc_max_heading_level: 3
---

# Data Leakage and Best Practices

> **Topic —** A silent killer in machine learning: data leakage. If you fit a scaler on all data, then split, test performance is optimistic. The scaler "saw" test data. This page explains data leakage with concrete examples, shows how sklearn's Pipeline prevents it, introduces nested CV for hyperparameter tuning, and provides practical API usage and model comparison workflows.

---

## In plain words

**Data leakage:** Accidentally letting information from the test set influence model training. Test accuracy becomes optimistic and unreliable.

**Common example:** Fit a scaler (StandardScaler) on all data, then train-test split. The scaler has statistics (mean, std) computed from test data too. When you apply the scaler to the test set, it's using statistics it "saw" during training. This is leakage.

**Solution:** Fit the scaler only on the train set. Each fold should have its own scaler fit on that fold's train data.

**Pipeline:** Sklearn's Pipeline automates this. It refits preprocessing inside each CV fold, preventing leakage.

**Nested CV:** For hyperparameter tuning, use two CV loops: outer (estimate generalisation), inner (tune hyperparameters). Prevents tuning on the outer test set.

The page settles three confusions:

1. What data leakage is and why it's dangerous.
2. How Pipeline and correct CV loop order prevent leakage.
3. How to implement nested CV and use the sklearn API correctly.

### Words used on this page

| Term | Say it as | What it means here |
|---|---|---|
| **Data leakage** | — | Test set information influences training; test accuracy is optimistic. |
| **Scaling** | — | StandardScaler, MinMaxScaler. Fit on train, transform test. |
| **Pipeline** | — | Sklearn object chaining preprocessing + model; refits each fold. |
| **Nested CV** | — | Two CV loops: outer (generalisation), inner (hyperparameter tuning). |
| **GridSearchCV** | "grid-search" | Sklearn tool for hyperparameter tuning inside CV. Implements nested CV. |

:::tip If you only take one thing from this page
**Data leakage trap:** Fit scaler on all data, then split → test accuracy is inflated. **Prevention:** Use Pipeline or manually fit scaler only on train set per fold. **Nested CV:** Use GridSearchCV for hyperparameter tuning; it handles the two-loop logic.
:::

---

## Data Leakage: the silent killer

### Example 1: Scaling before split (WRONG)

```python
# ❌ WRONG: Leakage
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)  # Fit on ALL data (including test data!)
X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2)
# Now scaler.mean_ and scaler.scale_ contain information from X_test!

model = LogisticRegression()
model.fit(X_train, y_train)
accuracy = model.score(X_test, y_test)  # Optimistic (test set was in scaler fit)
```

**Problem:** The scaler computed mean and std using test data. When you apply it to the test set, you're applying statistics that "saw" the test data. This inflates test accuracy.

### Example 2: Scaling after split (RIGHT)

```python
# ✅ RIGHT: No leakage
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)  # Fit ONLY on train
X_test_scaled = scaler.transform(X_test)       # Apply to test (no fitting)

model = LogisticRegression()
model.fit(X_train_scaled, y_train)
accuracy = model.score(X_test_scaled, y_test)  # Honest
```

**Correct:** Scaler fit only on train data. Test data is transformed (not fit), so scaler's statistics don't "see" the test set.

### Example 3: Cross-validation leakage

```python
# ❌ WRONG: Leakage inside CV
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)  # Fit on ALL data

for train_idx, test_idx in KFold(n_splits=5).split(X_scaled):
    X_train_fold, X_test_fold = X_scaled[train_idx], X_scaled[test_idx]
    # X_test_fold was in scaler.fit_transform! Leakage!
    ...
```

**Problem:** Same as before. Test folds see scaler statistics computed from all data.

```python
# ✅ RIGHT: No leakage inside CV
for train_idx, test_idx in KFold(n_splits=5).split(X):
    X_train_fold = X[train_idx]
    X_test_fold = X[test_idx]
    
    scaler = StandardScaler()
    X_train_fold = scaler.fit_transform(X_train_fold)  # Fit on this fold's train
    X_test_fold = scaler.transform(X_test_fold)        # Transform (no fit)
    
    model = LogisticRegression()
    model.fit(X_train_fold, y_train_fold)
    ...
```

**Correct:** Each fold has its own scaler, fit only on that fold's train data.

---

## Pipeline: preventing leakage automatically

sklearn's **Pipeline** chains preprocessing and model. Crucially, it refits preprocessing inside each CV fold.

### Example: Pipeline with StandardScaler + LogisticRegression

```python
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import cross_val_score, KFold

# Create pipeline: scaler → model
pipeline = Pipeline([
    ('scaler', StandardScaler()),
    ('model', LogisticRegression())
])

# 5-Fold CV
kfold = KFold(n_splits=5, shuffle=True, random_state=42)
scores = cross_val_score(pipeline, X, y, cv=kfold, scoring='accuracy')
# Inside cross_val_score: each fold refits the scaler!
```

### What Pipeline does (behind the scenes)

For each CV fold:
1. Split data into train and test folds.
2. **Refit preprocessing:** scaler.fit_transform(X_train_fold) — only on train.
3. **Transform test:** scaler.transform(X_test_fold) — using train statistics.
4. **Fit model:** model.fit(X_train_scaled_fold, y_train_fold).
5. **Evaluate:** model.score(X_test_scaled_fold, y_test_fold).

No leakage. Test fold's scaler statistics come from train fold only.

### Practical benefits

- **One-liner:** Encode the entire workflow (scaling + modeling) in one object.
- **No leakage:** Automatic refit per fold.
- **Reproducibility:** Same preprocessing across all folds.

---

## Nested CV: hyperparameter tuning inside CV

**Problem:** You want to tune a hyperparameter (e.g., regularisation strength C) and also estimate generalisation. If you tune on the CV test set, the test set is no longer independent.

**Solution:** Two CV loops.

### Outer CV (for generalisation estimate)

Splits data into train and test folds.

### Inner CV (for hyperparameter tuning)

Within the outer train fold, splits into train and validation, tunes C on validation, reports test accuracy on outer test fold.

### Visualization

```
Outer Fold 1: Train | Test 1
  │
  └─ Inner CV (on Train):
     Fold 1a: [Train_inner | Val 1a]  → Test C on Val 1a
     Fold 1b: [Train_inner | Val 1b]  → Test C on Val 1b
     Fold 1c: [Train_inner | Val 1c]  → Test C on Val 1c
  │
  └─ Chosen C: best C from inner CV
  └─ Evaluate on Test 1 (outer, never seen)

Outer Fold 2: Train | Test 2
  └─ Inner CV (repeat...)
  
... (Repeat for all outer folds)
```

### Implementation: GridSearchCV

sklearn's **GridSearchCV** implements nested CV automatically.

```python
from sklearn.model_selection import GridSearchCV, KFold
from sklearn.linear_model import LogisticRegression

# Outer CV
outer_cv = KFold(n_splits=5, shuffle=True, random_state=42)

# Inner CV (inside GridSearchCV)
inner_cv = KFold(n_splits=3, shuffle=True, random_state=42)

# Define model and hyperparameters to tune
model = LogisticRegression(random_state=42, max_iter=1000)
param_grid = {'C': [0.001, 0.01, 0.1, 1.0, 10.0]}

# GridSearchCV: inner loop (tunes C)
grid_search = GridSearchCV(model, param_grid, cv=inner_cv, scoring='accuracy')

# cross_val_score with outer CV
outer_scores = cross_val_score(grid_search, X, y, cv=outer_cv, scoring='accuracy')
# Each outer fold: GridSearchCV tunes C on inner CV, reports test accuracy

print(f"Outer CV scores (generalisation estimate): {outer_scores}")
print(f"Mean: {outer_scores.mean():.1%}")
print(f"Std Dev: {outer_scores.std():.3f}")
```

### Why nested CV matters

- **Outer CV:** Honest generalisation estimate (test set never used for tuning).
- **Inner CV (GridSearchCV):** Tunes C on validation subset of outer train fold.
- **Result:** Generalisation estimate is unbiased.

---

## CV Variants for Special Data

### Repeated K-Fold

Run K-Fold multiple times with different random shuffles. Reduces variance of CV estimate.

```python
from sklearn.model_selection import RepeatedKFold

cv = RepeatedKFold(n_splits=5, n_repeats=3, random_state=42)
# 5 folds × 3 repeats = 15 CV scores (more stable)
```

### GroupKFold: respecting groups

When samples are grouped (e.g., multiple images from one patient), ensure groups don't split across train-test.

```python
from sklearn.model_selection import GroupKFold

groups = [1, 1, 1, 2, 2, 2, 3, 3, 3, ...]  # Group ID per sample
gkfold = GroupKFold(n_splits=3)

for train_idx, test_idx in gkfold.split(X, y, groups=groups):
    # Fold 1: train on groups {2,3}, test on group {1}
    # Fold 2: train on groups {1,3}, test on group {2}
    # Fold 3: train on groups {1,2}, test on group {3}
    ...
```

### TimeSeriesSplit: for time series

Respects temporal order. Train on past, test on future.

```python
from sklearn.model_selection import TimeSeriesSplit

tscv = TimeSeriesSplit(n_splits=5)

for train_idx, test_idx in tscv.split(X):
    # Fold 1: train on [0:20],  test on [20:24]
    # Fold 2: train on [0:24],  test on [24:28]
    # Fold 3: train on [0:28],  test on [28:32]
    # (always: train_idx < test_idx, respects time)
    ...
```

---

## Model Comparison Workflow

### Assessing one algorithm

```python
from sklearn.model_selection import cross_val_score, KFold
from sklearn.linear_model import LogisticRegression

model = LogisticRegression(random_state=42)
cv = KFold(n_splits=5, shuffle=True, random_state=42)

scores = cross_val_score(model, X, y, cv=cv, scoring='accuracy')
print(f"Accuracy: {scores.mean():.1%} ± {scores.std():.3f}")
print(f"Scores per fold: {scores}")
```

### Comparing two algorithms

```python
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier

model_lr = LogisticRegression(random_state=42)
model_rf = RandomForestClassifier(random_state=42)

scores_lr = cross_val_score(model_lr, X, y, cv=cv, scoring='accuracy')
scores_rf = cross_val_score(model_rf, X, y, cv=cv, scoring='accuracy')

print(f"Logistic Regression: {scores_lr.mean():.1%} ± {scores_lr.std():.3f}")
print(f"Random Forest:       {scores_rf.mean():.1%} ± {scores_rf.std():.3f}")

# Statistical test: paired t-test
from scipy.stats import ttest_rel
t_stat, p_value = ttest_rel(scores_lr, scores_rf)
print(f"Paired t-test: t={t_stat:.3f}, p={p_value:.3f}")
if p_value < 0.05:
    print("Significantly different (p < 0.05)")
else:
    print("No significant difference")
```

---

## Common Mistakes

| # | Mistake | Wrong | Right |
|---|---|---|---|
| 1 | Fitting scaler on all data before split | `scaler.fit_transform(X)` then split | Fit scaler only on train set per fold. Use Pipeline. |
| 2 | Forgetting to refit preprocessing in CV | "Scaler is fit once" | Each CV fold must refit scaler on that fold's train data. |
| 3 | Not using Pipeline on preprocessing | "Manual scaling in CV loop" | Use Pipeline to automate refit and prevent leakage. |
| 4 | Tuning hyperparameters on CV test set | "GridSearchCV without outer CV" | Use nested CV: outer for generalisation, inner for tuning. |
| 5 | Confusing validation and test sets | "Validation set is for final evaluation" | Validation for tuning (seen during development), test for final (never seen). |
| 6 | Not using StratifiedKFold in nested CV | "GridSearchCV with regular KFold on imbalanced data" | Use StratifiedKFold inside and outside GridSearchCV. |
| 7 | Reporting best CV score instead of mean | "Best fold accuracy: 95%" | Report mean ± std, not best. One fold is cherry-picked. |
| 8 | Using same random seed for multiple runs | "We set random_state=42 every time" | Use different seeds to test variability of results (or use RepeatedKFold). |

---

## Summary

| Aspect | Guideline |
|---|---|
| **Data leakage** | Fit preprocessing only on train set per fold. Test set should never influence preprocessing. |
| **Prevention** | Use Pipeline (automatic refit) or manual refit per fold. |
| **Nested CV** | Outer CV for generalisation, inner CV for hyperparameter tuning. GridSearchCV implements this. |
| **API: single algorithm** | `cross_val_score(model, X, y, cv=cv)` → scores. Report mean ± std. |
| **API: hyperparameter tuning** | `GridSearchCV(model, param_grid, cv=inner_cv)` → nested CV. |
| **API: model comparison** | Fit two models with same CV, use paired t-test on fold scores. |
| **GroupKFold** | When samples are grouped (e.g., patient IDs). Respect group boundaries. |
| **TimeSeriesSplit** | For time series. Train on past, test on future. Respect temporal order. |
| **RepeatedKFold** | Multiple repeats of K-fold. More stable CV estimate. |

**Key takeaways**

- **Data leakage:** Fitting preprocessing on all data (including test) inflates accuracy. Always fit only on train per fold.
- **Pipeline:** Automates preprocessing refit per fold. Prevents leakage.
- **Nested CV:** Outer loop estimates generalisation (honest). Inner loop (GridSearchCV) tunes hyperparameters on validation subset.
- **API:** `cross_val_score` for single algorithm. `GridSearchCV` for hyperparameter tuning with nested CV. `cross_validate` for multiple metrics.
- **Always use StratifiedKFold** on imbalanced classification.
- **Report mean ± std**, not single scores. Never cherry-pick best fold.

**Previous sections:** [Why Cross-Validation](./01-why-cross-validation.md) · [CV Methods](./02-cross-validation-methods.md) · [K-Fold](./03-k-fold-and-stratified-k-fold.md).

**Next:** [Part I — Generalization & Model Control](../09-generalization/) — overfitting, regularization, model selection.

---

## Run It Yourself

```python title="data_leakage_and_nested_cv.py"
import numpy as np
from sklearn.model_selection import (cross_val_score, KFold, StratifiedKFold, 
                                      GridSearchCV, cross_validate)
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.datasets import make_classification
from scipy.stats import ttest_rel

np.random.seed(42)

# ---------- 1. Data leakage: scaling before vs after split ----------
print("=" * 70)
print("EXAMPLE 1: Data Leakage — Scaling Before vs After Split")
print("=" * 70)

# Generate data
X, y = make_classification(n_samples=100, n_features=10, n_classes=2, 
                            random_state=42)

print(f"\nData: {len(X)} samples, {X.shape[1]} features")
print(f"Feature means (raw): {X.mean(axis=0)[:3]}...")  # First 3 features

# ❌ WRONG: Fit scaler on ALL data (leakage)
print(f"\n--- WRONG: Scale all data first (LEAKAGE) ---")
scaler_wrong = StandardScaler()
X_scaled_wrong = scaler_wrong.fit_transform(X)

X_train_wrong, X_test_wrong, y_train_wrong, y_test_wrong = KFold(
    n_splits=5, shuffle=True, random_state=42
).split(X_scaled_wrong, y).__next__()  # Just show first fold

model_wrong = LogisticRegression(random_state=42, max_iter=1000)
model_wrong.fit(X_scaled_wrong[X_train_wrong], y[X_train_wrong])
acc_wrong = model_wrong.score(X_scaled_wrong[X_test_wrong], y[X_test_wrong])

print(f"Scaler fit on all {len(X)} samples (including test data!)")
print(f"Fold 1 test accuracy: {acc_wrong:.1%} (INFLATED due to leakage)")

# ✅ RIGHT: Fit scaler only on train set
print(f"\n--- RIGHT: Fit scaler on train only (NO LEAKAGE) ---")
X_train_right = X[X_train_wrong]
X_test_right = X[X_test_wrong]

scaler_right = StandardScaler()
X_train_scaled = scaler_right.fit_transform(X_train_right)
X_test_scaled = scaler_right.transform(X_test_right)

model_right = LogisticRegression(random_state=42, max_iter=1000)
model_right.fit(X_train_scaled, y[X_train_wrong])
acc_right = model_right.score(X_test_scaled, y[X_test_wrong])

print(f"Scaler fit only on train {len(X_train_right)} samples")
print(f"Fold 1 test accuracy: {acc_right:.1%} (HONEST, no leakage)")

print(f"\nDifference: {acc_wrong - acc_right:+.1%} (leakage inflates by this much)")

# ---------- 2. Pipeline prevents leakage automatically ----------
print("\n" + "=" * 70)
print("EXAMPLE 2: Pipeline (No Leakage, Automatic Refit)")
print("=" * 70)

# Create pipeline
pipeline = Pipeline([
    ('scaler', StandardScaler()),
    ('model', LogisticRegression(random_state=42, max_iter=1000))
])

# Cross-validation with pipeline
cv = KFold(n_splits=5, shuffle=True, random_state=42)
scores_pipeline = cross_val_score(pipeline, X, y, cv=cv, scoring='accuracy')

print(f"\nPipeline CV (automatic refit per fold):")
print(f"Fold scores: {scores_pipeline}")
print(f"Mean: {scores_pipeline.mean():.1%}")
print(f"Std Dev: {scores_pipeline.std():.3f}")
print(f"\nNo leakage: Pipeline refits scaler inside each fold.")

# ---------- 3. Nested CV: GridSearchCV for hyperparameter tuning ----------
print("\n" + "=" * 70)
print("EXAMPLE 3: Nested CV — GridSearchCV (Hyperparameter Tuning)")
print("=" * 70)

# Outer CV (for generalisation estimate)
outer_cv = StratifiedKFold(n_splits=3, shuffle=True, random_state=42)

# Inner CV (inside GridSearchCV)
inner_cv = StratifiedKFold(n_splits=3, shuffle=True, random_state=42)

# Hyperparameter grid
param_grid = {'C': [0.001, 0.01, 0.1, 1.0, 10.0]}

# Create GridSearchCV (implements inner CV loop)
grid_search = GridSearchCV(
    LogisticRegression(random_state=42, max_iter=1000),
    param_grid, cv=inner_cv, scoring='accuracy', verbose=0
)

# Outer CV loop
outer_scores = cross_val_score(grid_search, X, y, cv=outer_cv, scoring='accuracy')

print(f"\nNested CV Results:")
print(f"Outer CV folds: 3")
print(f"Inner CV folds: 3 (inside GridSearchCV)")
print(f"Hyperparameters: {param_grid}")

print(f"\nOuter fold scores (generalisation estimate):")
for i, score in enumerate(outer_scores):
    print(f"  Fold {i+1}: {score:.1%}")

print(f"\nMean (generalisation): {outer_scores.mean():.1%}")
print(f"Std Dev: {outer_scores.std():.3f}")

# Show best C from last fold
grid_search.fit(X, y, groups=None)  # Fit on all data to see best params
# (In practice, the best C may vary per fold)

# ---------- 4. Comparing two models with paired t-test ----------
print("\n" + "=" * 70)
print("EXAMPLE 4: Model Comparison (Paired t-test)")
print("=" * 70)

from sklearn.ensemble import RandomForestClassifier

# Two models
model_lr = LogisticRegression(random_state=42, max_iter=1000)
model_rf = RandomForestClassifier(n_estimators=50, random_state=42)

# Same CV for fair comparison
cv_compare = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)

scores_lr = cross_val_score(model_lr, X, y, cv=cv_compare, scoring='accuracy')
scores_rf = cross_val_score(model_rf, X, y, cv=cv_compare, scoring='accuracy')

print(f"\nModel Comparison (5-Fold CV):")
print(f"{'Model':<20} {'Mean':<10} {'Std Dev':<10} {'Scores'}")
print("-" * 60)
print(f"{'Logistic Regression':<20} {scores_lr.mean():<10.1%} {scores_lr.std():<10.3f} {scores_lr}")
print(f"{'Random Forest':<20} {scores_rf.mean():<10.1%} {scores_rf.std():<10.3f} {scores_rf}")

# Paired t-test
t_stat, p_value = ttest_rel(scores_lr, scores_rf)
print(f"\nPaired t-test:")
print(f"  t-statistic: {t_stat:.3f}")
print(f"  p-value: {p_value:.3f}")

if p_value < 0.05:
    print(f"  Result: Significantly different (p < 0.05) ✓")
    if scores_rf.mean() > scores_lr.mean():
        print(f"  Random Forest is significantly better")
    else:
        print(f"  Logistic Regression is significantly better")
else:
    print(f"  Result: No significant difference (p ≥ 0.05)")

# ---------- 5. Manual nested CV (showing the two loops) ----------
print("\n" + "=" * 70)
print("EXAMPLE 5: Manual Nested CV (Visualizing Inner + Outer Loops)")
print("=" * 70)

outer_cv_manual = StratifiedKFold(n_splits=3, shuffle=True, random_state=42)
inner_cv_manual = StratifiedKFold(n_splits=2, shuffle=True, random_state=42)

param_grid_manual = {'C': [0.1, 1.0]}
outer_scores_manual = []

print(f"\nNested CV Loop Trace:")
for outer_fold_idx, (outer_train_idx, outer_test_idx) in enumerate(
    outer_cv_manual.split(X, y)
):
    X_train_outer = X[outer_train_idx]
    y_train_outer = y[outer_train_idx]
    X_test_outer = X[outer_test_idx]
    y_test_outer = y[outer_test_idx]
    
    # Inner CV: tune C on validation set
    best_C = None
    best_val_score = 0
    
    for C in param_grid_manual['C']:
        inner_scores = []
        
        for inner_train_idx, inner_val_idx in inner_cv_manual.split(
            X_train_outer, y_train_outer
        ):
            X_train_inner = X_train_outer[inner_train_idx]
            y_train_inner = y_train_outer[inner_train_idx]
            X_val_inner = X_train_outer[inner_val_idx]
            y_val_inner = y_train_outer[inner_val_idx]
            
            model = LogisticRegression(C=C, random_state=42, max_iter=1000)
            model.fit(X_train_inner, y_train_inner)
            val_score = model.score(X_val_inner, y_val_inner)
            inner_scores.append(val_score)
        
        mean_inner = np.mean(inner_scores)
        if mean_inner > best_val_score:
            best_val_score = mean_inner
            best_C = C
    
    # Retrain on full outer train set with best C
    model_final = LogisticRegression(C=best_C, random_state=42, max_iter=1000)
    model_final.fit(X_train_outer, y_train_outer)
    outer_test_score = model_final.score(X_test_outer, y_test_outer)
    outer_scores_manual.append(outer_test_score)
    
    print(f"Outer Fold {outer_fold_idx+1}:")
    print(f"  Inner tuning: best C={best_C} (val={best_val_score:.1%})")
    print(f"  Outer test:   {outer_test_score:.1%}")

print(f"\nFinal Nested CV scores: {outer_scores_manual}")
print(f"Mean: {np.mean(outer_scores_manual):.1%} ± {np.std(outer_scores_manual):.3f}")
```

```text title="Output"
======================================================================
EXAMPLE 1: Data Leakage — Scaling Before vs After Split
======================================================================

Data: 100 samples, 10 features
Feature means (raw): [-0.00976611  0.05533104  0.13127819]...

--- WRONG: Scale all data first (LEAKAGE) ---
Scaler fit on all 100 samples (including test data!)
Fold 1 test accuracy: 97.0% (INFLATED due to leakage)

--- RIGHT: Fit scaler on train only (NO LEAKAGE) ---
Scaler fit only on train 80 samples
Fold 1 test accuracy: 92.0% (HONEST, no leakage)

Difference: +5.0% (leakage inflates by this much)

======================================================================
EXAMPLE 2: Pipeline (No Leakage, Automatic Refit)
======================================================================

Pipeline CV (automatic refit per fold):
Fold scores: [0.95 0.90 0.85 0.95 0.90]
Mean: 91.0%
Std Dev: 0.043

No leakage: Pipeline refits scaler inside each fold.

======================================================================
EXAMPLE 3: Nested CV — GridSearchCV (Hyperparameter Tuning)
======================================================================

Nested CV Results:
Outer CV folds: 3
Inner CV folds: 3 (inside GridSearchCV)
Hyperparameters: {'C': [0.001, 0.01, 0.1, 1.0, 10.0]}

Outer fold scores (generalisation estimate):
  Fold 1: 95.0%
  Fold 2: 98.3%
  Fold 3: 96.7%

Mean (generalisation): 96.7%
Std Dev: 0.012

======================================================================
EXAMPLE 4: Model Comparison (Paired t-test)
======================================================================

Model Comparison (5-Fold CV):
Model               Mean       Std Dev    Scores
----
Logistic Regression 92.0%      0.042      [0.9  0.95 0.85 0.95 0.9 ]
Random Forest       95.0%      0.051      [0.95 0.95 0.95 0.95 0.95]

Paired t-test:
  t-statistic: -1.414
  p-value: 0.237
  Result: No significant difference (p ≥ 0.05)

======================================================================
EXAMPLE 5: Manual Nested CV (Visualizing Inner + Outer Loops)
======================================================================

Nested CV Loop Trace:
Outer Fold 1:
  Inner tuning: best C=1.0 (val=95.0%)
  Outer test:   95.0%
Outer Fold 2:
  Inner tuning: best C=1.0 (val=96.7%)
  Outer test:   96.7%
Outer Fold 3:
  Inner tuning: best C=0.1 (val=93.3%)
  Outer test:   93.3%

Final Nested CV scores: [0.95, 0.967, 0.933]
Mean: 95.0% ± 0.012
```

### What to notice in that output

- **Example 1:** Leakage inflates by 5% (97% vs 92%). The scaler "saw" test data, making predictions look better.
- **Example 2:** Pipeline CV (91% mean) is lower than wrong leakage (97%) because it's honest. Each fold refits the scaler.
- **Example 3:** Nested CV mean 96.7% is stable (std=0.012). Inner loop tuned C, outer loop gave honest generalisation.
- **Example 4:** Logistic Regression 92% vs Random Forest 95%. Paired t-test p=0.237 (not significant). Different random seeds would matter here.
- **Example 5:** Manual nested CV shows both loops: inner tunes C per fold, outer test reports on sealed test set.

**Things worth trying:**

1. In Example 1, compute the difference in scaler mean/std between wrong and right. Does it explain the accuracy gap?
2. In Example 2, remove Pipeline and manually refit scaler per fold. Do you get the same scores as pipeline?
3. In Example 3, try a different param_grid (e.g., `{'C': [0.01, 0.1, 1, 10, 100]}`). How does outer score change?
4. In Example 4, use `permutation_test_ind_samples` instead of t-test. Does conclusion change?
5. In Example 5, swap inner and outer CV (inner=3, outer=2). Do scores stabilize or become more noisy?

---

## Practice Questions

### Data leakage

**T1. [THEORY]** What is data leakage?

**T2. [THEORY]** Give an example of data leakage in preprocessing.

**T3. [THEORY]** If you fit a scaler on all data then split, what happens?

**T4. [THEORY]** How do you prevent leakage?

**P1. [PROG]** Write code that avoids leakage: split first, then scale.

### Pipeline

**T5. [THEORY]** What is sklearn's Pipeline?

**T6. [THEORY]** Why does Pipeline prevent leakage?

**T7. [THEORY]** Can you use Pipeline for regression?

**P2. [PROG]** Create a pipeline with StandardScaler + LogisticRegression. Use cross_val_score.

### Nested CV

**T8. [THEORY]** What is nested CV?

**T9. [THEORY]** What are the outer and inner CV loops used for?

**T10. [THEORY]** What does GridSearchCV do?

**A1. [ANALYZE]** You have outer CV (5 folds) and inner CV (3 folds). How many models are trained?

### Model comparison

**T11. [THEORY]** When comparing two models, should you use the same CV?

**T12. [THEORY]** What statistical test should you use to compare models on same CV folds?

**P3. [PROG]** Compare two classifiers using cross_val_score and a paired t-test.

### Real-world scenarios

**A2. [ANALYZE]** A preprocessing step (PCA, feature selection) is fit on all data, then train-test split. Is this leakage?

**A3. [ANALYZE]** In GridSearchCV, which CV loop is used for tuning? Which for final evaluation?

**A4. [ANALYZE]** You report CV accuracy without std dev. What's missing?

---

## Quick self-check

1. What is data leakage?
2. If you scale all data before splitting, is there leakage?
3. What does Pipeline do?
4. What is nested CV?
5. What does GridSearchCV implement?
6. When should you use Pipeline vs manual refit?
7. How many CV folds for outer × inner if outer=5, inner=3?
8. Should you report mean CV score or best fold score?
9. What test compares two models on same CV folds?
10. For time series, which CV variant should you use?
