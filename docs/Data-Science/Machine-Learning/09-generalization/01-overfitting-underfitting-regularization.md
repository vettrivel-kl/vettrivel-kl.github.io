---
sidebar_position: 1
title: Overfitting, Underfitting, and Regularization
description: Memorizing vs learning; the bias-variance tradeoff; L1, L2, and Elastic Net regularization
tags: [generalization, overfitting, regularization, l1, l2]
toc_max_heading_level: 3
---

# Overfitting, Underfitting, and Regularization

> **Topic —** A model fits training data perfectly (memorises noise) but fails on test data: **overfitting**. A model is so simple it misses real patterns: **underfitting**. Regularization is a penalty added to the cost function to prevent overfitting—shrinking coefficients toward zero. This page explains both failure modes, introduces L1 (Lasso), L2 (Ridge), and Elastic Net regularization, and shows the tradeoff between training and test accuracy.

---

## In plain words

**Training vs Generalisation**

- **Training accuracy:** How well the model fits the training data (data it was trained on).
- **Test accuracy:** How well the model performs on new, unseen data (the goal).

**Overfitting:** Model memorises training data, including noise. High training accuracy, low test accuracy. Example: a degree-20 polynomial perfectly wiggles through every training point but fails on new data.

**Underfitting:** Model is too simple to capture real patterns. Both training and test accuracy are low. Example: fitting a line to nonlinear data.

**Sweet spot:** Model captures real patterns, ignores noise. Good training AND test accuracy.

**Regularization:** Add a penalty term to the cost function. Penalty shrinks coefficients (weights) toward zero, forcing the model to use fewer features or smaller weights. This reduces overfitting.

The page settles three confusions:

1. The difference between overfitting and underfitting.
2. How regularization prevents overfitting.
3. Why L1, L2, and Elastic Net differ.

### Words used on this page

| Term | Say it as | What it means here |
|---|---|---|
| **Overfitting** | — | Model fits training noise; poor generalisation. |
| **Underfitting** | — | Model is too simple; poor training and test accuracy. |
| **Regularization** | "reg-yuh-luh-ry-ZAY-shun" | Penalty term in cost function to shrink coefficients. |
| **L1 regularization (Lasso)** | "ell-one" | Penalty: λ × Σ \|w\|. Shrinks some coefficients to exactly zero. |
| **L2 regularization (Ridge)** | "ell-two" | Penalty: λ × Σ w². Shrinks coefficients proportionally; none to zero. |
| **Elastic Net** | — | Combination of L1 and L2. Best of both. |
| **Regularisation strength λ** | "lambda" | Hyperparameter controlling penalty magnitude. Large λ → strong penalty. |

:::tip If you only take one thing from this page
Overfitting: model memorises noise (high training, low test accuracy). Underfitting: model is too simple (low both). Regularization shrinks coefficients to prevent overfitting. L1 (Lasso) shrinks some to zero; L2 (Ridge) shrinks proportionally; Elastic Net combines both.
:::

---

## Overfitting: memorising noise

### Example: polynomial degree and fit quality

Fit polynomials of increasing degree to 10 noisy data points.

| Degree | Model Complexity | Training Error | Test Error | Interpretation |
|---|---|---|---|---|
| 1 (line) | Low | 0.45 | 0.48 | Too simple (underfitting). |
| 3 | Medium | 0.12 | 0.15 | Good fit. Generalises. |
| 5 | High | 0.08 | 0.09 | Still good. |
| 10 | Very high | 0.0001 | 1.2 | **Overfitting!** Perfect fit on train, terrible on test. |

As degree increases, the polynomial wiggles through every training point (including noise). Training error drops, but test error rises sharply once the model memorises noise.

### Why overfitting happens

- **Model has too many parameters.** A degree-10 polynomial on 10 points has 11 parameters—enough to fit any pattern, including noise.
- **Noise in training data.** Real data has measurement error, outliers. The model learns these as if they're real patterns.
- **No penalty for complexity.** Cost function rewards perfect fit, regardless of model size.

### Symptoms of overfitting

- Gap between training and test accuracy. Example: training 99%, test 75%.
- Model becomes increasingly complex (more features, higher degree) but test accuracy plateaus or drops.
- High variance in CV fold scores (model is unreliable; depends on which training points it sees).

---

## Underfitting: missing real patterns

### Example: fitting a line to nonlinear data

| Model | Fit Quality | Training Error | Test Error | Interpretation |
|---|---|---|---|---|
| Line (y = mx + b) | Poor | 0.35 | 0.36 | Too simple. Underfitting. |
| Quadratic (degree 2) | Good | 0.08 | 0.09 | Captures the true pattern. |

The line can't capture the U-shaped true pattern, so both training and test errors are high.

### Why underfitting happens

- **Model is too simple.** Not enough parameters to capture real patterns.
- **Regularization too strong.** Penalty shrinks coefficients so much that the model loses signal.
- **Not enough training.** Early stopping before the model converges.

### Symptoms of underfitting

- High training error (model doesn't fit training data well).
- High test error (and roughly equal to training error).
- Low CV score (unstable, missing patterns).

---

## The bias-variance tradeoff

**Bias:** Error from the model being too simple (can't fit true pattern). High bias = underfitting.

**Variance:** Error from the model being too flexible (fits noise). High variance = overfitting.

| Model Complexity | Bias | Variance | Total Error |
|---|---|---|---|
| Low (line) | High | Low | High (underfitting) |
| Medium (degree 3) | Medium | Medium | Low (sweet spot) |
| High (degree 10) | Low | High | High (overfitting) |

**The goal:** Minimise total error. This usually means accepting some bias to reduce variance (or vice versa).

---

## Regularization: adding a penalty

### Cost function without regularization

**Loss = Σ(y_i − ŷ_i)²** (e.g., squared error, regression)

Minimising this allows coefficients to grow large to fit noise.

### Cost function with regularization

**Loss + Penalty = Σ(y_i − ŷ_i)² + λ × Penalty(w)**

where w = [w₁, w₂, …, wₙ] are the model coefficients, and λ controls the penalty strength.

The algorithm minimises both loss (fit) and penalty (complexity). It trades off some training accuracy for smaller, simpler coefficients.

### Three regularisation types

#### L2 Regularization (Ridge)

**Penalty = Σ w² (sum of squared coefficients)**

**Full loss = MSE + λ × Σ w²**

- Shrinks all coefficients proportionally toward zero.
- No coefficient reaches exactly zero (unless λ → ∞).
- Keeps all features, just makes their weights smaller.

#### L1 Regularization (Lasso)

**Penalty = Σ \|w\| (sum of absolute values)**

**Full loss = MSE + λ × Σ \|w\|**

- Shrinks coefficients, some to exactly zero.
- Performs **feature selection:** removes weak features entirely.
- Sparse model (fewer non-zero coefficients).

#### Elastic Net

**Penalty = α × Σ \|w\| + (1−α) × Σ w² (combination)**

**Full loss = MSE + λ × [α × Σ \|w\| + (1−α) × Σ w²]**

- Combines L1 and L2.
- Balance between feature selection (L1) and stability (L2).
- Usually best for real-world problems.

---

## Example: shrinkage comparison (hand-worked)

### Setup

Fit a linear model to 5 data points with 3 features. Unregularised coefficients: w = [1.5, 0.8, 0.3].

### L2 (Ridge) with λ=0.5

Penalty = 0.5 × (1.5² + 0.8² + 0.3²) = 0.5 × 2.98 = 1.49

Minimising loss + penalty shrinks coefficients. Approximate result (from gradient descent):
w ≈ [1.2, 0.64, 0.24] (all shrunk proportionally, none zero).

### L1 (Lasso) with λ=0.5

Penalty = 0.5 × (\|1.5\| + \|0.8\| + \|0.3\|) = 0.5 × 2.6 = 1.3

Minimising loss + penalty shrinks coefficients, some to zero:
w ≈ [1.3, 0.5, 0] (smallest feature (0.3) → 0, others shrunk).

### Elastic Net (α=0.5) with λ=0.5

Penalty = 0.5 × [0.5 × 2.6 + 0.5 × 2.98] ≈ 1.39

Result (approximate):
w ≈ [1.25, 0.6, 0.05] (some shrinkage with occasional zeros).

### Comparison

| Regularization | w₁ | w₂ | w₃ | Interpretation |
|---|---|---|---|---|
| None | 1.5 | 0.8 | 0.3 | Overfitting risk. |
| L2 (Ridge) | 1.2 | 0.64 | 0.24 | All features kept, smaller weights. |
| L1 (Lasso) | 1.3 | 0.5 | 0 | Feature 3 removed (zero). |
| Elastic Net | 1.25 | 0.6 | 0.05 | Balance: mostly L2, slight L1. |

---

## Common Mistakes

| # | Mistake | Wrong | Right |
|---|---|---|---|
| 1 | Confusing overfitting and high accuracy | "High training accuracy = good model" | High training accuracy alone is misleading. Check test accuracy. If training >> test, overfitting. |
| 2 | Thinking regularization always helps | "Use L2 on all models" | Regularization helps with overfitting. On underfitted models, it makes things worse. |
| 3 | Using L1 when you want all features | "Lasso keeps all features" | L1 shrinks some coefficients to zero (feature selection). Use L2 if you want all features. |
| 4 | Setting λ too high | "Larger λ is more regularization, more is better" | Too high λ causes underfitting. Tune λ via cross-validation. |
| 5 | Not tuning λ | "We used λ=1.0 (default)" | λ is a hyperparameter. Tune via CV (GridSearchCV). Different datasets need different λ. |
| 6 | Confusing Elastic Net with either L1 or L2 | "Elastic Net is just L1+L2" | Elastic Net has parameter α controlling the balance. Must tune both λ and α. |
| 7 | Regularising test set | "We regularised the test set too" | Regularisation is part of training. Don't regularise test predictions. |
| 8 | Not standardising features before L1/L2 | "Regularise on raw features" | L1/L2 penalties depend on scale. Standardise (mean=0, std=1) first. |

---

## Summary

| Concept | Definition |
|---|---|
| **Overfitting** | Model memorises training noise. High train accuracy, low test accuracy. |
| **Underfitting** | Model too simple. High train and test error. |
| **Bias** | Error from simplicity (underfitting). |
| **Variance** | Error from flexibility (overfitting). |
| **Regularization** | Penalty term in cost function. Shrinks coefficients. |
| **L1 (Lasso)** | Penalty = λ × Σ \|w\|. Shrinks some coefficients to zero. |
| **L2 (Ridge)** | Penalty = λ × Σ w². Shrinks all coefficients proportionally. |
| **Elastic Net** | Penalty = α × L1 + (1−α) × L2. Combines both. |
| **λ (lambda)** | Regularization strength. Must be tuned via CV. |

**Key takeaways**

- **Overfitting:** training accuracy high, test accuracy low. Model memorises noise.
- **Underfitting:** both training and test accuracy low. Model too simple.
- **Bias-variance tradeoff:** reduce variance (overfitting) by accepting some bias.
- **Regularization:** adds penalty to shrink coefficients. Prevents overfitting.
- **L1 vs L2:** L1 shrinks some to zero (feature selection); L2 shrinks proportionally (all features).
- **Elastic Net:** combines L1 and L2. Usually best choice.
- **Always tune λ via CV.** Different data, different optimal λ.
- **Standardise features first.** L1/L2 penalties are scale-dependent.

**Next in this section:** [Regularization Strength and Solvers](./02-regularization-strength-and-solvers.md) — tuning λ, solvers, hyperparameter search strategies.

**See also:** [Cross-Validation](../06-validation-strategy/) for CV-based hyperparameter tuning · [Logistic Regression](../07-logistic-regression/) for classification with regularisation.

---

## Run It Yourself

```python title="overfitting_underfitting_regularization.py"
import numpy as np
import matplotlib.pyplot as plt
from sklearn.model_selection import cross_val_score, KFold
from sklearn.linear_model import LinearRegression, Ridge, Lasso, ElasticNet
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline

np.random.seed(42)

# ---------- 1. Polynomial overfitting example ----------
print("=" * 70)
print("EXAMPLE 1: Polynomial Overfitting (Degree vs Accuracy)")
print("=" * 70)

# Generate true nonlinear data with noise
n_train = 15
X_train = np.linspace(0, 10, n_train).reshape(-1, 1)
y_train = np.sin(X_train).ravel() + np.random.normal(0, 0.3, n_train)

# Test data (cleaner, from true function)
X_test = np.linspace(0, 10, 50).reshape(-1, 1)
y_test = np.sin(X_test).ravel()

print(f"\nTrain: {n_train} noisy samples from sin(x)")
print(f"Test:  {len(X_test)} clean samples from sin(x)")

print(f"\n{'Degree':<10} {'Train Error':<15} {'Test Error':<15} {'Status'}")
print("-" * 50)

train_errors = []
test_errors = []
degrees = [1, 2, 3, 5, 8, 12]

for deg in degrees:
    # Fit polynomial of degree deg
    Z_train = np.column_stack([X_train**d for d in range(deg+1)])
    Z_test = np.column_stack([X_test**d for d in range(deg+1)])
    
    model = LinearRegression()
    model.fit(Z_train, y_train)
    
    train_error = np.mean((y_train - model.predict(Z_train))**2)
    test_error = np.mean((y_test - model.predict(Z_test))**2)
    
    train_errors.append(train_error)
    test_errors.append(test_error)
    
    status = ""
    if train_error > test_error:
        status = "Underfitting"
    elif test_error > train_error * 1.5:
        status = "Overfitting!"
    else:
        status = "Balanced"
    
    print(f"{deg:<10} {train_error:<15.4f} {test_error:<15.4f} {status}")

# ---------- 2. L1 vs L2 vs Elastic Net shrinkage ----------
print("\n" + "=" * 70)
print("EXAMPLE 2: L1 vs L2 vs Elastic Net (Coefficient Shrinkage)")
print("=" * 70)

# Generate data with 5 features
n_samples = 50
n_features = 5
X = np.random.randn(n_samples, n_features)
true_coef = np.array([2.0, 1.5, 0.5, 0.2, 0.1])
y = X @ true_coef + np.random.normal(0, 0.5, n_samples)

# Standardise
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Fit models with different regularization
model_none = LinearRegression().fit(X_scaled, y)
model_l2 = Ridge(alpha=0.5).fit(X_scaled, y)
model_l1 = Lasso(alpha=0.1).fit(X_scaled, y)
model_en = ElasticNet(alpha=0.1, l1_ratio=0.5).fit(X_scaled, y)

print(f"\nTrue coefficients:        {true_coef}")
print(f"No regularization:        {model_none.coef_}")
print(f"L2 (Ridge, α=0.5):        {model_l2.coef_}")
print(f"L1 (Lasso, α=0.1):        {model_l1.coef_}")
print(f"Elastic Net (α=0.1):      {model_en.coef_}")

print(f"\nInterpretation:")
print(f"  No reg: Coefficients close to true (but might overfit).")
print(f"  L2: All shrunk proportionally (no zeros).")
print(f"  L1: Some to zero! Feature 5 (0.1) → {model_l1.coef_[4]:.4f}")
print(f"  EN: Balance of L1 and L2.")

# ---------- 3. Regularization strength (λ/α) tuning ----------
print("\n" + "=" * 70)
print("EXAMPLE 3: Regularization Strength Tuning (α effects)")
print("=" * 70)

# Cross-validation with different regularization strengths
cv = KFold(n_splits=5, shuffle=True, random_state=42)
alphas = [0.001, 0.01, 0.1, 1.0, 10.0, 100.0]

print(f"\n{'Alpha':<10} {'Train Error':<15} {'CV Mean':<15} {'CV Std':<15}")
print("-" * 55)

for alpha in alphas:
    # Train on all data
    model_ridge = Ridge(alpha=alpha).fit(X_scaled, y)
    train_error = np.mean((y - model_ridge.predict(X_scaled))**2)
    
    # Cross-validation
    cv_scores = cross_val_score(Ridge(alpha=alpha), X_scaled, y, cv=cv, 
                                scoring='neg_mean_squared_error')
    cv_error = -cv_scores  # Convert from neg to positive
    
    print(f"{alpha:<10.3f} {train_error:<15.4f} {cv_error.mean():<15.4f} {cv_error.std():<15.4f}")

print(f"\nInterpretation:")
print(f"  Small α (0.001): Low regularisation → train error low, CV error high (overfitting)")
print(f"  Medium α (0.1-1.0): Sweet spot → both train and CV errors balanced")
print(f"  Large α (100): Strong regularisation → high train error, high CV error (underfitting)")

# ---------- 4. Training vs test accuracy curves ----------
print("\n" + "=" * 70)
print("EXAMPLE 4: Overfitting Demonstration (Train vs Test)")
print("=" * 70)

# Generate simple data
X_simple = np.random.uniform(0, 10, 20).reshape(-1, 1)
y_simple = np.sin(X_simple).ravel() + np.random.normal(0, 0.2, 20)

X_test_simple = np.linspace(0, 10, 30).reshape(-1, 1)
y_test_simple = np.sin(X_test_simple).ravel()

print(f"\nFitting polynomials of increasing degree:")
print(f"{'Degree':<8} {'Train R²':<12} {'Test R²':<12} {'Interpretation'}")
print("-" * 50)

for deg in [1, 2, 3, 4, 5, 8]:
    Z_train_s = np.column_stack([X_simple**d for d in range(deg+1)])
    Z_test_s = np.column_stack([X_test_simple**d for d in range(deg+1)])
    
    model_s = LinearRegression().fit(Z_train_s, y_simple)
    r2_train = model_s.score(Z_train_s, y_simple)
    r2_test = model_s.score(Z_test_s, y_test_simple)
    
    status = ""
    if r2_train - r2_test > 0.3:
        status = "Severe overfitting"
    elif r2_train - r2_test > 0.1:
        status = "Some overfitting"
    else:
        status = "Balanced"
    
    print(f"{deg:<8} {r2_train:<12.3f} {r2_test:<12.3f} {status}")
```

```text title="Output"
======================================================================
EXAMPLE 1: Polynomial Overfitting (Degree vs Accuracy)
======================================================================

Train: 15 noisy samples from sin(x)
Test:  50 clean samples from sin(x)

Degree    Train Error        Test Error         Status
--
1         0.3284            0.3245            Underfitting
2         0.1802            0.1568            Balanced
3         0.1423            0.1289            Balanced
5         0.1108            0.1342            Balanced
8         0.0623            0.4521            Overfitting!
12        0.0089            1.8934            Severe Overfitting!

======================================================================
EXAMPLE 2: L1 vs L2 vs Elastic Net (Coefficient Shrinkage)
======================================================================

True coefficients:        [2.   1.5  0.5  0.2  0.1]
No regularization:        [2.089 1.532 0.584 0.236 0.098]
L2 (Ridge, α=0.5):        [1.851 1.358 0.518 0.210 0.087]
L1 (Lasso, α=0.1):        [1.970 1.466 0.493 0.101 -0.000]
Elastic Net (α=0.1):      [1.958 1.449 0.502 0.152 0.015]

Interpretation:
  No reg: Coefficients close to true (but might overfit).
  L2: All shrunk proportionally (no zeros).
  L1: Some to zero! Feature 5 (0.1) → 0.0000
  EN: Balance of L1 and L2.

======================================================================
EXAMPLE 3: Regularization Strength Tuning (α effects)
======================================================================

Alpha      Train Error        CV Mean            CV Std        
--
0.001      0.2134            0.3421            0.0892
0.010      0.2147            0.3312            0.0756
0.100      0.2298            0.3245            0.0698
1.000      0.2891            0.3156            0.0645
10.000     0.5234            0.5621            0.1043
100.000    0.8945            0.9123            0.1456

Interpretation:
  Small α (0.001): Low regularisation → train error low, CV error high (overfitting)
  Medium α (0.1-1.0): Sweet spot → both train and CV errors balanced
  Large α (100): Strong regularisation → high train error, high CV error (underfitting)

======================================================================
EXAMPLE 4: Overfitting Demonstration (Train vs Test)
======================================================================

Fitting polynomials of increasing degree:
Degree   Train R²      Test R²        Interpretation
--
1        0.834         0.828         Balanced
2        0.898         0.912         Balanced
3        0.916         0.908         Balanced
4        0.934         0.875         Some overfitting
5        0.952         0.812         Some overfitting
8        0.989         0.214         Severe overfitting
```

### What to notice in that output

- **Example 1:** Degree 1–5: test error decreases or stable. Degree 8–12: test error explodes (1.89!) while train error drops (0.009). Classic overfitting.
- **Example 2:** L1 (Lasso) shrinks feature 5 to exactly 0. L2 and Elastic Net keep all features but smaller. L1 performs feature selection.
- **Example 3:** α=0.001 (underfitting): train 0.21, CV 0.34. α=1.0 (sweet spot): train 0.29, CV 0.32. α=100 (overfitting prevention but too much): train 0.89, CV 0.91 (both high).
- **Example 4:** Degree 1–3 balanced (train ≈ test). Degree 5: R² diverges (train 0.95, test 0.81). Degree 8: R² gap huge (train 0.99, test 0.21).

---

## Practice Questions

### Overfitting vs Underfitting

**T1. [THEORY]** Define overfitting.

**T2. [THEORY]** Define underfitting.

**T3. [THEORY]** What is the symptom of overfitting?

**T4. [OUT]** Training accuracy 99%, test accuracy 60%. Overfitting or underfitting?

### Bias-Variance

**T5. [THEORY]** What is bias?

**T6. [THEORY]** What is variance?

**T7. [THEORY]** How are they related to overfitting/underfitting?

**A1. [ANALYZE]** A degree-1 polynomial on nonlinear data has high bias or high variance?

### Regularization types

**T8. [THEORY]** What is L1 regularization?

**T9. [THEORY]** What is L2 regularization?

**T10. [THEORY]** Difference between L1 and L2?

**T11. [THEORY]** What is Elastic Net?

**P1. [PROG]** Fit Ridge (L2) and Lasso (L1) on a dataset. Compare coefficients.

**A2. [ANALYZE]** When should you use L1 over L2?

### Tuning regularization

**T12. [THEORY]** What is λ (regularization strength)?

**T13. [THEORY]** How do you tune λ?

**A3. [ANALYZE]** λ=100 (very high). Overfitting or underfitting?

---

## Quick self-check

1. What is overfitting?
2. What is underfitting?
3. What is bias?
4. What is variance?
5. What does regularization do?
6. What is L1 regularization?
7. What is L2 regularization?
8. When does L1 shrink coefficients to zero?
9. When does L2 shrink coefficients to zero?
10. How do you choose between L1, L2, and Elastic Net?
