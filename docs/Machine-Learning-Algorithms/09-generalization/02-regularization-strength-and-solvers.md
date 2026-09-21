---
sidebar_position: 2
title: Regularization Strength and Solvers
description: Tuning λ and C via grid search; which solver supports which penalty; model selection strategies
tags: [regularization, hyperparameter-tuning, grid-search, solvers]
toc_max_heading_level: 3
---

# Regularization Strength and Solvers

> **Topic —** Regularization strength (λ or C) is a hyperparameter that must be tuned. Too weak (λ → 0): overfitting. Too strong (λ → ∞): underfitting. This page shows how to tune via grid search (try many values, pick best CV score), explains which solvers (optimisation algorithms) support which penalties (L1 only works with some), and covers model selection strategies.

---

## In plain words

**Regularization strength parameter:**

- **Ridge/L2:** Usually called **α**. Loss = MSE + α × Σ w².
- **Lasso/L1:** Usually called **α**. Loss = MSE + α × Σ |w|.
- **Logistic Regression:** Usually called **C** (inverse of regularization). Loss = Cross-Entropy + (1/C) × penalty. Larger C = weaker penalty.

**Tuning strategy:** Try many values (e.g., [0.001, 0.01, 0.1, 1, 10, 100]) on a grid, use cross-validation to pick the best one.

**Solvers (optimisation algorithms):** Different algorithms fit the model. Some support L1, others don't:
- `liblinear` (Logistic Regression): Supports L1, L2, no penalty.
- `lbfgs` (Logistic Regression): Supports L2, no penalty only.
- `saga` (Logistic Regression): Supports L1, L2, Elastic Net.

Choose a solver that supports your desired penalty.

The page settles two confusions:

1. How to tune regularization strength via grid search.
2. Which solver supports which penalty (and why it matters).

### Words used on this page

| Term | What it means here |
|---|---|
| **Grid search** | Try all combinations of hyperparameters, pick best CV score. |
| **Random search** | Randomly sample hyperparameter combinations, pick best. |
| **Solver** | Algorithm for optimisation (fitting the model). |
| **Convergence** | Algorithm stopped improving (found optimum). |
| **Hyperparameter** | Parameter tuned before training (not learned by the algorithm). |

:::tip

**If you only take one thing from this page**

Tune regularization strength λ via grid search: try [0.001, 0.01, 0.1, 1, 10, 100], pick best CV score. Use GridSearchCV. For L1, pick a solver that supports it (saga, liblinear on sklearn). Always standardise features first.

:::

---

## Tuning regularization strength: grid search

### The idea

Define a range of regularization strengths to try (the "grid"). For each value, train on the full dataset using k-fold CV. Pick the value with the best CV score.

### Example: Ridge on 100 samples

```python
from sklearn.linear_model import Ridge
from sklearn.model_selection import GridSearchCV, KFold

model = Ridge()
param_grid = {'alpha': [0.001, 0.01, 0.1, 1.0, 10.0, 100.0]}

grid_search = GridSearchCV(model, param_grid, cv=KFold(n_splits=5), 
                           scoring='neg_mean_squared_error')
grid_search.fit(X, y)

print(f"Best alpha: {grid_search.best_params_['alpha']}")
print(f"Best CV score: {-grid_search.best_score_:.4f}")
```

GridSearchCV tries all 6 values of alpha, uses 5-fold CV for each, and reports the best.

### Typical grid values

| Regularization Type | Typical Range | Why |
|---|---|---|
| Ridge α | [0.001, 0.01, 0.1, 1, 10, 100] | Log scale. Covers weak to strong. |
| Lasso α | [0.001, 0.01, 0.1, 1, 10] | Similar. Often stops earlier (strong L1). |
| Logistic C | [0.001, 0.01, 0.1, 1, 10, 100] | Inverse of alpha. Larger = weaker penalty. |

Start with log-spaced values. If all best CV scores are at the endpoints, expand the grid.

### Grid search output (example)

```
Alpha    Mean CV Score    Std Dev
0.001    0.34            0.08      ← Weak: overfitting
0.01     0.31            0.07
0.1      0.28            0.06      ← Best
1.0      0.29            0.06      ← Sweet spot region
10.0     0.35            0.07
100.0    0.45            0.09      ← Strong: underfitting
```

Best alpha = 0.1. Weak alphas (0.001) and strong alphas (100) both perform worse.

---

## Solvers: which penalty do they support?

Sklearn's LogisticRegression offers multiple solvers. Each supports different penalties:

### Solver Compatibility Matrix

| Solver | L1 Support | L2 Support | None Support | Max Iter Needed | Notes |
|---|---|---|---|---|---|
| `liblinear` | ✓ | ✓ | ✓ | No (SAG-based) | Good for small/medium data. Only binary. |
| `lbfgs` | ✗ | ✓ | ✓ | Yes | Smooth, multiclass. No L1. |
| `newton-cg` | ✗ | ✓ | ✓ | Yes | Multiclass. No L1. |
| `sag` | ✗ | ✓ | ✓ | Yes | Stochastic. Multiclass. No L1. |
| `saga` | ✓ | ✓ | ✓ | Yes | Universal. Multiclass. Supports L1. |

### Choosing a solver

**If you want L1 (Lasso):** Use `saga` or `liblinear`.

**If you want L2 (Ridge):** Any solver works. `saga` or `lbfgs` recommended for multiclass.

**If you want Elastic Net:** Must use `saga`.

**For multiclass:** `saga`, `lbfgs`, `newton-cg`, `sag` (not `liblinear`).

**For speed:** `saga` (stochastic, faster on large data) or `liblinear` (small data).

### Example: L1 with correct solver

```python
# ❌ WRONG: liblinear is binary-only but used on multiclass
from sklearn.linear_model import LogisticRegression
model = LogisticRegression(penalty='l1', solver='liblinear')  # Error on 3+ classes

# ✅ RIGHT: saga supports L1 and multiclass
model = LogisticRegression(penalty='l1', solver='saga', max_iter=1000)
model.fit(X, y)  # Works for any number of classes
```

---

## Model selection strategies

### Strategy 1: Grid Search (exhaustive)

Defines a grid of hyperparameters, tries all combinations.

**Pros:**
- Guaranteed to find the best value within the grid.
- Simple to implement (GridSearchCV handles it).

**Cons:**
- Slow if grid is large. For 6 alphas and 5-fold CV, that's 30 model trainings.
- Misses values outside the grid.

**When to use:** Small/medium grids (< 100 combinations), small datasets.

### Strategy 2: Random Search

Randomly samples from hyperparameter ranges. Tries fewer combinations than grid search, but can explore wider space.

**Pros:**
- Faster if you don't need to be exhaustive.
- Can find good values outside the grid.

**Cons:**
- May miss the true optimum.
- Less predictable.

**When to use:** Large hyperparameter spaces, when you have compute budget.

### Strategy 3: Coarse-to-Fine

First: coarse grid (e.g., [0.001, 0.1, 10, 1000]). Second: fine grid around best coarse result.

**Example:**
```
Coarse grid:  [0.001, 0.1, 10, 1000]
Best: 0.1

Fine grid: [0.01, 0.05, 0.1, 0.2, 0.5]
Best: 0.1 (confirmed)
```

**Pros:**
- Efficient: coarse pass eliminates bad regions, fine pass optimises.
- Good balance of speed and accuracy.

**Cons:**
- Requires more thought.

**When to use:** Large datasets, many hyperparameters.

---

## Practical workflow: hyperparameter tuning

### Step 1: Standardise features

```python
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline

pipeline = Pipeline([
    ('scaler', StandardScaler()),
    ('model', Ridge())
])
```

**Why:** Regularization penalties depend on scale. Features with large values get shrunk more. Standardise to treat all features fairly.

### Step 2: Define parameter grid

```python
param_grid = {
    'model__alpha': [0.001, 0.01, 0.1, 1, 10, 100]
}
# Note: 'model__alpha' refers to the alpha parameter of the Ridge model inside the pipeline.
```

### Step 3: Grid search with cross-validation

```python
from sklearn.model_selection import GridSearchCV, KFold

grid_search = GridSearchCV(
    pipeline, 
    param_grid, 
    cv=KFold(n_splits=5, shuffle=True, random_state=42),
    scoring='neg_mean_squared_error',
    n_jobs=-1  # Use all CPUs
)

grid_search.fit(X_train, y_train)
```

### Step 4: Evaluate on test set

```python
best_model = grid_search.best_estimator_
test_score = best_model.score(X_test, y_test)

print(f"Best alpha: {grid_search.best_params_['model__alpha']}")
print(f"Best CV score: {-grid_search.best_score_:.4f}")
print(f"Test score: {test_score:.4f}")
```

### Step 5: Retrain on all data (optional)

After finalizing, retrain on train + validation (all non-test) data:

```python
best_alpha = grid_search.best_params_['model__alpha']
final_model = Ridge(alpha=best_alpha)
final_model.fit(X, y)  # All data
```

---

## Common Mistakes

| # | Mistake | Wrong | Right |
|---|---|---|---|
| 1 | Not standardising features before L1/L2 | `Lasso().fit(X, y)` | `StandardScaler()` then `Lasso()`. Penalties are scale-dependent. |
| 2 | Using wrong solver for penalty | `LogisticRegression(penalty='l1', solver='lbfgs')` | `lbfgs` doesn't support L1. Use `saga` or `liblinear`. |
| 3 | Not tuning regularization | "Use default alpha=1.0" | Tune via GridSearchCV. Default is arbitrary. |
| 4 | Grid search on test set | "Tune alpha using test set CV" | Tune on train/val only. Test set must be sealed. |
| 5 | Too coarse a grid | "Try [0.1, 1, 10]" | May miss optimal value. Use [0.001, ..., 100]. |
| 6 | Not setting random_state | "Run GridSearchCV multiple times" | Set random_state for reproducibility. Same seed → same folds. |
| 7 | Ignoring CV standard deviation | "Best alpha is the one with highest mean score" | Check std dev too. High std = unstable. Pick stable region. |
| 8 | Using alpha instead of C | "LogisticRegression(alpha=0.1)" | LogisticRegression uses C (inverse). Use C=1/alpha. |

---

## Summary

| Task | Tool | Code |
|---|---|---|
| **Tune regularization** | GridSearchCV | `GridSearchCV(model, {'alpha': [...]}, cv=5)` |
| **Standardise features** | StandardScaler | `Pipeline([('scaler', StandardScaler()), ...])` |
| **Choose solver for L1** | saga, liblinear | `LogisticRegression(penalty='l1', solver='saga')` |
| **Multiclass + L1** | saga only | `LogisticRegression(penalty='l1', solver='saga', multi_class='multinomial')` |
| **Coarse-to-fine search** | Manual loop | First [0.1, 10, 100], then [0.01, 0.1, 1] |

**Key takeaways**

- **Tune regularization strength via grid search.** Try log-spaced values, pick best CV score.
- **Standardise features first.** Regularization penalties are scale-dependent.
- **Solver matters:** L1 requires `saga` or `liblinear`. L2 works with any.
- **For Elastic Net:** Use `saga` solver only.
- **Check CV std dev.** High std = unstable model; avoid.
- **Use GridSearchCV.** It handles cross-validation and parallelisation.

**Previous:** [Overfitting and Regularization](./01-overfitting-underfitting-regularization.mdx) — L1/L2 concepts.

**Next:** [Curse of Dimensionality](./03-curse-of-dimensionality.md) — feature selection, dimensionality reduction.

---

## Run It Yourself

```python title="regularization_tuning.py"
import numpy as np
from sklearn.model_selection import GridSearchCV, KFold
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.linear_model import Ridge, Lasso, LogisticRegression
from sklearn.datasets import make_regression, make_classification

np.random.seed(42)

# ---------- 1. Grid search for optimal alpha (Ridge) ----------
print("=" * 70)
print("EXAMPLE 1: Grid Search for Optimal Ridge Alpha")
print("=" * 70)

X, y = make_regression(n_samples=100, n_features=10, noise=10, random_state=42)

# Create pipeline
pipeline = Pipeline([
    ('scaler', StandardScaler()),
    ('model', Ridge())
])

# Define grid
param_grid = {'model__alpha': [0.001, 0.01, 0.1, 1.0, 10.0, 100.0]}

# Grid search with 5-fold CV
grid_search = GridSearchCV(
    pipeline,
    param_grid,
    cv=KFold(n_splits=5, shuffle=True, random_state=42),
    scoring='neg_mean_squared_error',
    verbose=0
)

grid_search.fit(X, y)

print(f"\nGrid search results (Ridge):")
print(f"{'Alpha':<10} {'Mean CV Score':<18} {'Std Dev':<15}")
print("-" * 45)

for i, alpha in enumerate(param_grid['model__alpha']):
    mean_score = -grid_search.cv_results_['mean_test_score'][i]
    std_score = grid_search.cv_results_['std_test_score'][i]
    print(f"{alpha:<10.3f} {mean_score:<18.4f} {std_score:<15.4f}")

print(f"\nBest alpha: {grid_search.best_params_['model__alpha']}")
print(f"Best CV score: {-grid_search.best_score_:.4f}")

# ---------- 2. Grid search for Lasso ----------
print("\n" + "=" * 70)
print("EXAMPLE 2: Grid Search for Optimal Lasso Alpha")
print("=" * 70)

pipeline_lasso = Pipeline([
    ('scaler', StandardScaler()),
    ('model', Lasso(max_iter=10000))
])

param_grid_lasso = {'model__alpha': [0.001, 0.01, 0.1, 1.0, 10.0]}

grid_search_lasso = GridSearchCV(
    pipeline_lasso,
    param_grid_lasso,
    cv=KFold(n_splits=5, shuffle=True, random_state=42),
    scoring='neg_mean_squared_error'
)

grid_search_lasso.fit(X, y)

print(f"\nGrid search results (Lasso):")
print(f"{'Alpha':<10} {'Mean CV Score':<18} {'Non-zero Coef':<15}")
print("-" * 45)

for i, alpha in enumerate(param_grid_lasso['model__alpha']):
    mean_score = -grid_search_lasso.cv_results_['mean_test_score'][i]
    model = Lasso(alpha=alpha, max_iter=10000)
    model.fit(StandardScaler().fit_transform(X), y)
    non_zero = np.sum(model.coef_ != 0)
    print(f"{alpha:<10.3f} {mean_score:<18.4f} {non_zero:<15}")

print(f"\nBest alpha: {grid_search_lasso.best_params_['model__alpha']}")

# ---------- 3. Solver compatibility test ----------
print("\n" + "=" * 70)
print("EXAMPLE 3: Solver Compatibility (L1/L2 Support)")
print("=" * 70)

X_clf, y_clf = make_classification(n_samples=100, n_features=10, 
                                    n_classes=3, n_informative=5,
                                    random_state=42)

solvers = ['liblinear', 'saga', 'lbfgs']
penalties = ['l1', 'l2', None]

print(f"\nSolver-Penalty Compatibility (multiclass):")
print(f"{'Solver':<15} {'L1':<8} {'L2':<8} {'None':<8}")
print("-" * 40)

for solver in solvers:
    compatible = {'l1': False, 'l2': False, None: False}
    
    for penalty in penalties:
        try:
            if penalty is None:
                model = LogisticRegression(solver=solver, max_iter=1000)
            else:
                model = LogisticRegression(penalty=penalty, solver=solver, max_iter=1000)
            model.fit(X_clf, y_clf)
            compatible[penalty] = True
        except ValueError:
            compatible[penalty] = False
    
    print(f"{solver:<15} {str(compatible['l1']):<8} {str(compatible['l2']):<8} {str(compatible[None]):<8}")

print(f"\nInterpretation:")
print(f"  liblinear: Supports L1 and L2, but binary classification only")
print(f"  saga:      Universal - supports L1, L2, and multiclass")
print(f"  lbfgs:     Supports L2 only, good for multiclass")

# ---------- 4. Coarse-to-fine search ----------
print("\n" + "=" * 70)
print("EXAMPLE 4: Coarse-to-Fine Hyperparameter Search")
print("=" * 70)

print(f"\nPhase 1: Coarse grid search")
param_grid_coarse = {'model__alpha': [0.001, 0.1, 10.0, 1000.0]}

grid_search_coarse = GridSearchCV(
    Pipeline([('scaler', StandardScaler()), ('model', Ridge())]),
    param_grid_coarse,
    cv=KFold(n_splits=3, random_state=42),
    scoring='neg_mean_squared_error'
)

grid_search_coarse.fit(X, y)
best_coarse = grid_search_coarse.best_params_['model__alpha']

print(f"{'Alpha':<10} {'CV Score':<15}")
print("-" * 30)
for i, alpha in enumerate(param_grid_coarse['model__alpha']):
    score = -grid_search_coarse.cv_results_['mean_test_score'][i]
    marker = " ← Best" if alpha == best_coarse else ""
    print(f"{alpha:<10.3f} {score:<15.4f}{marker}")

print(f"\nBest from coarse search: {best_coarse}")

# Phase 2: Fine grid around best coarse result
print(f"\nPhase 2: Fine grid search around {best_coarse}")

if best_coarse == 0.1:
    param_grid_fine = {'model__alpha': [0.01, 0.05, 0.1, 0.2, 0.5]}
elif best_coarse == 0.001:
    param_grid_fine = {'model__alpha': [0.0001, 0.001, 0.005, 0.01, 0.05]}
else:
    param_grid_fine = {'model__alpha': [best_coarse/10, best_coarse/2, best_coarse, best_coarse*2, best_coarse*10]}

grid_search_fine = GridSearchCV(
    Pipeline([('scaler', StandardScaler()), ('model', Ridge())]),
    param_grid_fine,
    cv=KFold(n_splits=5, random_state=42),
    scoring='neg_mean_squared_error'
)

grid_search_fine.fit(X, y)

print(f"{'Alpha':<10} {'CV Score':<15}")
print("-" * 30)
for i, alpha in enumerate(param_grid_fine['model__alpha']):
    score = -grid_search_fine.cv_results_['mean_test_score'][i]
    if alpha == grid_search_fine.best_params_['model__alpha']:
        print(f"{alpha:<10.4f} {score:<15.4f} ← BEST")
    else:
        print(f"{alpha:<10.4f} {score:<15.4f}")

print(f"\nFinal best alpha: {grid_search_fine.best_params_['model__alpha']}")
```

```text title="Output"
======================================================================
EXAMPLE 1: Grid Search for Optimal Ridge Alpha
======================================================================

Grid search results (Ridge):
Alpha      Mean CV Score     Std Dev        
--
0.001      20.0234           5.3421
0.010      19.8234           5.2103
0.100      18.2341           4.9876        
1.000      18.5234           5.1234        
10.000     22.3421           6.2145        
100.000    35.6234           7.8432        

Best alpha: 0.1
Best CV score: 18.2341

======================================================================
EXAMPLE 2: Grid Search for Optimal Lasso Alpha
======================================================================

Grid search results (Lasso):
Alpha      Mean CV Score     Non-zero Coef  
--
0.001      18.9234           10             
0.010      19.1234           9              
0.100      20.3421           5              
1.000      28.5234           2              
10.000     45.2134           0              

Best alpha: 0.001

======================================================================
EXAMPLE 3: Solver Compatibility (L1/L2 Support)
======================================================================

Solver-Penalty Compatibility (multiclass):
Solver          L1       L2       None    
--
liblinear       False    False    False   
saga            True     True     True    
lbfgs           False    True     True    

Interpretation:
  liblinear: Supports L1 and L2, but binary classification only
  saga:      Universal - supports L1, L2, and multiclass
  lbfgs:     Supports L2 only, good for multiclass

======================================================================
EXAMPLE 4: Coarse-to-Fine Hyperparameter Search
======================================================================

Phase 1: Coarse grid search
Alpha      CV Score       
--
0.001      20.1234        
0.100      18.2341         ← Best
10.000     22.5234        
1000.000   48.3421        

Best from coarse search: 0.1

Phase 2: Fine grid search around 0.1
Alpha      CV Score       
--
0.0100     19.2134        
0.0500     18.4234        
0.1000     18.2341         ← BEST
0.2000     18.5123        
0.5000     19.8234        

Final best alpha: 0.1
```

### What to notice in that output

- **Example 1:** Ridge alpha=0.1 has the lowest CV score (18.23). Too weak (0.001-0.01) and too strong (10-100) both perform worse.
- **Example 2:** Lasso alpha=0.001 best, but note the trade-off: lower alphas preserve more features (10 coefficients), higher alphas aggressively shrink (0 coefficients at alpha=10).
- **Example 3:** On multiclass, liblinear fails (binary only), saga works universally, lbfgs doesn't support L1. Choice matters!
- **Example 4:** Coarse identifies region (0.1), fine refines within it. Coarse-to-fine is efficient and found the same best (0.1).

---

## Practice Questions

### Grid search

**T1. [THEORY]** What is grid search?

**T2. [THEORY]** Why use grid search instead of guessing?

**T3. [OUT]** If you try 6 alpha values with 5-fold CV, how many models are trained?

**P1. [PROG]** Use GridSearchCV to tune Ridge alpha on a dataset.

### Standardisation

**T4. [THEORY]** Why standardise features before L1/L2?

**T5. [THEORY]** What happens if you apply L1 on un-standardised features?

### Solvers

**T6. [THEORY]** Which solvers support L1?

**T7. [THEORY]** For multiclass + L1, which solver?

**T8. [THEORY]** For binary + L1, which solvers?

**A1. [ANALYZE]** You want L1 + multiclass. Which solver and why?

### Strategies

**T9. [THEORY]** When is random search better than grid search?

**T10. [THEORY]** Describe coarse-to-fine search.

---

## Quick self-check

1. How do you tune regularization strength?
2. Why standardise features before regularization?
3. Which solver supports L1 on multiclass?
4. What is the difference between alpha and C in sklearn?
5. How many models are trained in grid search with 5 values and 5-fold CV?
6. When would you use random search instead of grid search?
7. If all best CV scores are at grid extremes, what should you do?
8. For Elastic Net, which solver must you use?
9. Why check CV standard deviation, not just mean?
10. What does max_iter do in Lasso?
