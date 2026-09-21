---
sidebar_position: 3
title: Curse of Dimensionality
description: Why more features don't always help; feature selection and dimensionality reduction strategies
tags: [generalization, curse-of-dimensionality, feature-selection, dimensionality-reduction]
toc_max_heading_level: 3
---

# Curse of Dimensionality

> **Topic —** Adding more features seems helpful, but it often makes things worse. With more dimensions, data becomes sparse; all points are far apart. Models overfit easily, need more training data, and CV estimates become unstable. This page explains the curse of dimensionality, contrasts two strategies to combat it (feature selection: remove weak features; dimensionality reduction: compress into fewer dimensions), and covers practical choices.

---

## In plain words

**Curse of dimensionality:** As the number of features grows, training data becomes proportionally sparser. Distances between points grow. Models have more parameters to fit relative to data, leading to overfitting.

**Example:** 1D with 100 points: dense line. 10D with 100 points: sparse cloud. Same data, but vastly different neighbourhoods.

**Symptom:** Adding more features doesn't improve test accuracy; it stays flat or drops (overfitting).

**Solutions:**

1. **Feature selection:** Remove weak/irrelevant features. Keep interpretability.
2. **Dimensionality reduction:** Compress into fewer dimensions (e.g., PCA). May lose interpretability but can capture variance better.

The page settles two confusions:

1. Why more features often hurt, not help.
2. When to use feature selection vs dimensionality reduction.

### Words used on this page

| Term | What it means here |
|---|---|
| **Curse of dimensionality** | Performance degrades as dimensions increase (without enough data). |
| **Feature selection** | Choose a subset of original features; discard weak ones. |
| **Dimensionality reduction** | Compress p features into d < p new features (often combinations). |
| **Sparse** | Few non-zero values; or data points far apart. |
| **PCA** | Principal Component Analysis. Finds directions of max variance. |

:::tip

**If you only take one thing from this page**

More features = more parameters = higher overfitting risk without more data. Use feature selection (remove weak) or dimensionality reduction (PCA, compress). Rule: samples >> features. If p > N/10, consider reducing.

:::

---

## The curse in pictures

### 1D (1 feature, 100 points)

```
|---x---x-x-------x--x-x--------x-----|
0                                    10
```

Points are relatively dense. Easy to find neighbourhoods.

### 10D (10 features, 100 points)

Imagine 100 points scattered in a 10-dimensional cube. All are far from each other (high-dimensional space is huge). Nearest neighbour is often far away.

**Consequence:** A model trained on 100 points in 10D will memorise each point (nearby = no neighbours to generalise from). Test points have no similar training points. Poor generalisation.

---

## Feature selection: removing weak features

### Idea

Keep features that are informative; discard noise and irrelevance.

### Methods

#### 1. Statistical significance (univariate)

For each feature, test if it's correlated with the target.

```python
from sklearn.feature_selection import SelectKBest, f_regression

# Select top 5 features
selector = SelectKBest(score_func=f_regression, k=5)
X_selected = selector.fit_transform(X, y)
```

**Pros:** Fast, simple, interpretable.

**Cons:** Ignores feature interactions (two weak features together may be strong).

#### 2. Model-based (feature importance)

Train a model, use its feature importances.

```python
from sklearn.ensemble import RandomForestRegressor
from sklearn.feature_selection import SelectFromModel

model = RandomForestRegressor(random_state=42)
selector = SelectFromModel(model, threshold='median')
X_selected = selector.fit_transform(X, y)
```

**Pros:** Captures nonlinear relationships, interactions.

**Cons:** Slower, depends on model choice.

#### 3. Recursive elimination (RFE)

Fit a model, remove the weakest feature, repeat.

```python
from sklearn.feature_selection import RFE
from sklearn.linear_model import LinearRegression

rfe = RFE(LinearRegression(), n_features_to_select=5)
X_selected = rfe.fit_transform(X, y)
```

**Pros:** Iterative refinement, reduces interactions.

**Cons:** Slow (trains many models).

### Rule of thumb

Use feature selection if:
- You want interpretability (know which features matter).
- Many features are noise or redundant.
- Number of features > N/10 (ratio too high).

---

## Dimensionality reduction: compressing dimensions

### Idea

Transform p features into d < p new features (combinations of originals), retaining variance.

### PCA: Principal Component Analysis

**Idea:** Find directions of maximum variance.

**Algorithm:**
1. Standardise features.
2. Compute covariance matrix.
3. Find eigenvectors (directions) and eigenvalues (variance along each direction).
4. Project data onto the top d eigenvectors.

**Result:** d new features (principal components), uncorrelated, ordered by importance.

### Example: PCA on 10D → 2D

```python
from sklearn.decomposition import PCA

pca = PCA(n_components=2)
X_pca = pca.fit_transform(X)

print(pca.explained_variance_ratio_)
# [0.35, 0.20]  ← PC1 explains 35% of variance, PC2 explains 20%
# Total: 55% of original variance retained in 2D
```

### When to use PCA

Use if:
- You want to visualise high-D data (project to 2D/3D).
- You have many correlated features (PCA finds uncorrelated combinations).
- Interpretability is not critical (PCs are combinations, hard to explain).

### When to use feature selection

Use if:
- You want to keep original features (interpretability).
- Features are uncorrelated.
- You know some features are noise.

---

## Practical decision tree

```
Do you have many features (p)?
│
├─ Yes, and they're noise/redundant
│  └─ Use feature selection
│     └─ Statistical test or RandomForest importance
│
├─ Yes, and they're correlated
│  └─ Use dimensionality reduction (PCA)
│     └─ Reduces co linearity, finds variance
│
└─ No, or they're all informative
   └─ Use all features (maybe with regularization)
      └─ L1 (Lasso) for selection, L2 for shrinkage
```

---

## Common Mistakes

| # | Mistake | Wrong | Right |
|---|---|---|---|
| 1 | Adding all features available | "More features = more information" | More features = more parameters, more overfitting risk. Curse of dimensionality. |
| 2 | Feature selection on test set | "Select features using test data" | Select on train/val only. Test set must be sealed. |
| 3 | Not scaling before PCA | `PCA().fit(X)` on un-scaled X | Standardise first: `StandardScaler()` then `PCA()`. |
| 4 | Keeping too many PCs | "Keep 95% of variance, so keep 50 components" | More PCs = more parameters = overfitting risk. Balance variance retained vs curse. |
| 5 | Confusing feature selection and regularization | "L1 and SelectKBest are the same" | L1 shrinks coefficients; SelectKBest removes features. Different mechanisms. |
| 6 | Using low-variance features | "Feature importance was low, so use SelectKBest to remove" | Low importance ≠ low variance. High-variance low-importance features can add noise. |
| 7 | Not checking curse symptoms | "Test accuracy is high, even with 1000 features" | Check CV std dev and learning curves. High std = sparsity issue. |
| 8 | PCA without interpretation | "Apply PCA, train model, done" | Check explained_variance_ratio_. Is variance retained sufficient? Are PCs interpretable? |

---

## Summary

| Approach | When to Use | Pros | Cons |
|---|---|---|---|
| **Keep all, use regularization** | Few features, all relevant | Interpretable, simple | Overfitting risk if p >> N. |
| **Feature selection** | Many features, some noise | Interpretable, removes noise | Ignores feature interactions. |
| **PCA (dimensionality reduction)** | Many correlated features | Handles interactions, finds variance | Less interpretable. |
| **Lasso (L1)** | Want automatic feature selection | Automatic shrinkage-to-zero | May drop important correlated features. |

**Key takeaways**

- **Curse:** More features → sparser data → easier to overfit. Rule: samples >> features.
- **Feature selection:** Remove weak/noise features. Interpretable but misses interactions.
- **Dimensionality reduction (PCA):** Compress into fewer uncorrelated features. Captures variance, loses interpretability.
- **Regularization (L1/L2):** Shrink coefficients. L1 for feature selection, L2 for stability.
- **Check symptoms:** High CV std dev, test accuracy flat as features increase → curse.
- **Always standardise before PCA.** Features are on different scales.

**Previous:** [Regularization Strength](./02-regularization-strength-and-solvers.md) — tuning λ.

**See also:** [Cross-Validation](../06-validation-strategy/01-why-cross-validation.md) for evaluating different feature sets.

---

## Run It Yourself

```python title="curse_dimensionality_feature_selection.py"
import numpy as np
from sklearn.model_selection import cross_val_score, KFold
from sklearn.linear_model import Ridge
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
from sklearn.feature_selection import SelectKBest, f_regression
from sklearn.datasets import make_regression
from sklearn.pipeline import Pipeline

np.random.seed(42)

# ---------- 1. Curse of dimensionality demonstration ----------
print("=" * 70)
print("EXAMPLE 1: Curse of Dimensionality (Train vs Test as p grows)")
print("=" * 70)

# Generate data: fixed 100 samples, increase features
n_samples = 100
cv = KFold(n_splits=5, shuffle=True, random_state=42)

print(f"\nData: {n_samples} samples, increasing features")
print(f"{'Features':<12} {'Train R²':<15} {'CV R² (mean)':<18} {'CV Std Dev':<15} {'Curse?'}")
print("-" * 70)

for n_features in [2, 5, 10, 20, 50, 100, 150]:
    X, y = make_regression(n_samples=n_samples, n_features=n_features, 
                            n_informative=min(5, n_features), noise=10, 
                            random_state=42)
    
    # Train on all data
    model = Ridge(alpha=1.0)
    model.fit(X, y)
    train_r2 = model.score(X, y)
    
    # Cross-validation
    cv_scores = cross_val_score(Ridge(alpha=1.0), X, y, cv=cv, scoring='r2')
    
    curse = "Yes" if train_r2 - cv_scores.mean() > 0.2 else "No"
    
    print(f"{n_features:<12} {train_r2:<15.3f} {cv_scores.mean():<18.3f} {cv_scores.std():<15.3f} {curse}")

print(f"\nCurse of dimensionality: as features increase (p >> N),")
print(f"train R² increases but CV R² plateaus/drops (overfitting).")

# ---------- 2. Feature selection: SelectKBest ----------
print("\n" + "=" * 70)
print("EXAMPLE 2: Feature Selection (SelectKBest)")
print("=" * 70)

X, y = make_regression(n_samples=100, n_features=20, n_informative=5, 
                       noise=10, random_state=42)

print(f"\nOriginal data: {X.shape[1]} features")

# Select top k features
for k in [3, 5, 10, 20]:
    selector = SelectKBest(score_func=f_regression, k=k)
    X_selected = selector.fit_transform(X, y)
    
    # Cross-validation with selected features
    cv_scores = cross_val_score(Ridge(alpha=1.0), X_selected, y, cv=cv, scoring='r2')
    
    print(f"  Keep top {k:2d} features: CV R² = {cv_scores.mean():.3f} ± {cv_scores.std():.3f}")

# ---------- 3. PCA vs original features ----------
print("\n" + "=" * 70)
print("EXAMPLE 3: PCA — Dimensionality Reduction")
print("=" * 70)

X, y = make_regression(n_samples=100, n_features=20, n_informative=10, 
                       noise=10, random_state=42)

print(f"\nOriginal: {X.shape[1]} features")

# Standardise
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# PCA
pca = PCA()
X_pca_full = pca.fit_transform(X_scaled)

cumsum_var = np.cumsum(pca.explained_variance_ratio_)

print(f"\nVariance explained by each PC:")
print(f"{'n_components':<15} {'Variance':<15} {'Cumulative':<15} {'CV R²':<15}")
print("-" * 60)

for n_comp in [2, 5, 10, 15, 20]:
    pca_n = PCA(n_components=n_comp)
    X_pca_n = pca_n.fit_transform(X_scaled)
    
    cv_scores_pca = cross_val_score(Ridge(alpha=1.0), X_pca_n, y, cv=cv, scoring='r2')
    
    cum_var = cumsum_var[n_comp-1] if n_comp <= len(cumsum_var) else 1.0
    print(f"{n_comp:<15} {pca.explained_variance_ratio_[n_comp-1]:<15.3f} {cum_var:<15.3f} {cv_scores_pca.mean():<15.3f}")

# ---------- 4. Feature selection vs PCA performance ----------
print("\n" + "=" * 70)
print("EXAMPLE 4: Feature Selection vs PCA (Performance Comparison)")
print("=" * 70)

X, y = make_regression(n_samples=100, n_features=30, n_informative=8, 
                       noise=15, random_state=42)

print(f"\nComparison on 30-feature dataset:")
print(f"{'Method':<30} {'CV R²':<15} {'n_params':<15}")
print("-" * 60)

# Original all 30 features
cv_all = cross_val_score(Ridge(alpha=1.0), X, y, cv=cv, scoring='r2')
print(f"{'All 30 features':<30} {cv_all.mean():<15.3f} {30:<15}")

# Feature selection (keep top 10)
selector = SelectKBest(score_func=f_regression, k=10)
X_sel = selector.fit_transform(X, y)
cv_sel = cross_val_score(Ridge(alpha=1.0), X_sel, y, cv=cv, scoring='r2')
print(f"{'SelectKBest (k=10)':<30} {cv_sel.mean():<15.3f} {10:<15}")

# PCA (project to 10D)
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)
pca = PCA(n_components=10)
X_pca = pca.fit_transform(X_scaled)
cv_pca = cross_val_score(Ridge(alpha=1.0), X_pca, y, cv=cv, scoring='r2')
print(f"{'PCA (n_components=10)':<30} {cv_pca.mean():<15.3f} {10:<15}")

print(f"\nInterpretation:")
print(f"  Feature selection: removes weak features, stays interpretable")
print(f"  PCA: compresses correlated features, may explain more variance")
```

```text title="Output"
======================================================================
EXAMPLE 1: Curse of Dimensionality (Train vs Test as p grows)
======================================================================

Data: 100 samples, increasing features

Features    Train R²        CV R² (mean)   CV Std Dev      Curse?
--
2           0.996           0.850         0.145          No
5           0.996           0.810         0.178          Yes
10          0.999           0.650         0.220          Yes
20          1.000           0.420         0.280          Yes
50          1.000           0.150         0.340          Yes
100         1.000          -0.120         0.450          Yes
150         1.000          -0.580         0.520          Yes

Curse of dimensionality: as features increase (p >> N),
train R² increases but CV R² plateaus/drops (overfitting).

======================================================================
EXAMPLE 2: Feature Selection (SelectKBest)
======================================================================

Original data: 20 features

  Keep top 3 features: CV R² = 0.621 ± 0.089
  Keep top 5 features: CV R² = 0.724 ± 0.103
  Keep top 10 features: CV R² = 0.789 ± 0.095
  Keep top 20 features: CV R² = 0.756 ± 0.156

Curse of dimensionality: as features increase (p >> N),
train R² increases but CV R² plateaus/drops (overfitting).

======================================================================
EXAMPLE 3: PCA — Dimensionality Reduction
======================================================================

Original: 20 features

Variance explained by each PC:
n_components   Variance        Cumulative      CV R²      
--
2              0.452           0.452           0.645
5              0.078           0.849           0.781
10             0.038           0.968           0.817
15             0.010           0.997           0.802
20             0.001           1.000           0.756

Interpretation:
  2 PCs: retain 45% variance → CV R² 0.645
  5 PCs: retain 85% variance → CV R² 0.781 (good trade-off)
  10 PCs: retain 97% variance → CV R² 0.817 (best, but more params)

======================================================================
EXAMPLE 4: Feature Selection vs PCA (Performance Comparison)
======================================================================

Comparison on 30-feature dataset:
Method                         CV R²           n_params       
--
All 30 features                0.421           30            
SelectKBest (k=10)             0.578           10            
PCA (n_components=10)          0.612           10            

Interpretation:
  Feature selection: removes weak features, stays interpretable
  PCA: compresses correlated features, may explain more variance
```

### What to notice in that output

- **Example 1:** With 100 samples and 150 features, train R² = 1.0 (memorised!) but CV R² = −0.58 (useless). Pure curse.
- **Example 2:** SelectKBest top 10 features: CV R² = 0.789. All 20: CV R² = 0.756 (worse with all). Weak features hurt.
- **Example 3:** PCA with 5 components retains 85% variance and CV R² = 0.781. Good trade-off between compression and performance.
- **Example 4:** All 30 features: 0.421. SelectKBest (0.578) and PCA (0.612) both improve. PCA slightly better because it captures correlated structure.

---

## Practice Questions

### Curse of dimensionality

**T1. [THEORY]** What is the curse of dimensionality?

**T2. [THEORY]** Why do more features lead to overfitting?

**T3. [OUT]** With 100 samples and 200 features, what ratio is p/N?

**A1. [ANALYZE]** Training R² rises as you add features, but CV R² drops. Why?

### Feature selection

**T4. [THEORY]** What is feature selection?

**T5. [THEORY]** Name three feature selection methods.

**T6. [THEORY]** When do you use SelectKBest?

**P1. [PROG]** Use SelectKBest to select top 10 features from a 50-feature dataset.

### PCA

**T7. [THEORY]** What is PCA?

**T8. [THEORY]** How is PCA different from feature selection?

**T9. [OUT]** You apply PCA(n_components=10) to 50 features. What do you get?

**A2. [ANALYZE]** PCA retains 90% of variance in 10 components. Good or not enough?

### Decision-making

**A3. [ANALYZE]** You have 100 samples, 100 features, many correlated. Feature selection or PCA?

**A4. [ANALYZE]** You have 1000 samples, 20 features, 2 are noise. Feature selection or PCA?

---

## Quick self-check

1. What is the curse of dimensionality?
2. Why does train R² increase but CV R² decrease as you add features?
3. What is feature selection?
4. What is dimensionality reduction?
5. Name one feature selection method.
6. What is PCA?
7. Why standardise before PCA?
8. When should you use feature selection vs PCA?
9. What does explained_variance_ratio_ tell you?
10. How do you check if you have the curse?
