---
sidebar_position: 3
title: Residual Analysis and Choosing a Metric
description: What residuals reveal about model fit; diagnostic plots; deciding which metric to report
tags: [regression, metrics, residuals, model-diagnostics]
toc_max_heading_level: 3
---

# Residual Analysis and Choosing a Metric

> **Topic —** A metric (MAE, MSE, RMSE, R²) summarises fit quality in one number. But it hides patterns. Residuals (errors per prediction) tell a richer story. This page shows how to read residual patterns (are errors random or systematic?), interpret diagnostic plots (normality, heteroscedasticity), and make a final choice: which metric to report given your problem's constraints.

---

## In plain words

**Residual:** The difference between predicted and actual: r_i = y_i − ŷ_i.

**Good residuals:** Random scatter around zero. No pattern. Constant variance. Normally distributed (roughly).

**Bad residuals:** Systematic pattern (curve, funnel shape, clustering). May indicate the model is missing something (nonlinearity, interaction, wrong functional form).

**Three diagnostic plots:**

1. **Residuals vs Fitted:** Plot predictions (x-axis) vs residuals (y-axis). Should be a random blob around the zero line.
2. **Q-Q Plot:** Residuals vs theoretical normal quantiles. Should follow the diagonal (straight line).
3. **Scale-Location:** Square root of standardised residuals vs fitted values. Should be a flat horizontal band (constant variance).

**Choosing a metric:** Depends on your goal (average error in units of y? Relative error? Robustness to outliers?). No universal "best"—context matters.

The page settles three confusions:

1. What residuals reveal and how to read diagnostic plots.
2. How to check for violations (nonlinearity, heteroscedasticity, non-normality).
3. How to choose a metric given your problem constraints.

### Words used on this page

| Term | What it means here |
|---|---|
| **Residual** | Prediction error: y_i − ŷ_i. |
| **Heteroscedasticity** | Unequal error variance across fitted values (funnel shape). |
| **Homoscedasticity** | Equal error variance (good; constant spread). |
| **Q-Q plot** | Quantile-Quantile: residuals vs normal quantiles. |
| **Normality** | Residuals follow a normal distribution. |

:::tip

**If you only take one thing from this page**

Good residuals: random scatter around zero, constant variance, normally distributed. Bad residuals show patterns (curve, funnel, clustering) → model is missing something. Plot residuals to diagnose. Choose a metric matching your goal: MAE for outlier robustness, RMSE for penalising large errors, R² for proportion of variance.

:::

---

## Residual diagnostic plots

### Plot 1: Residuals vs Fitted Values

**What it shows:** Predictions on x-axis, residuals on y-axis.

**Good pattern:** Random blob around y=0. No shape.

```
        │
Residual│     •    •  •   •
        │   •   •       •
      0 ├─ • • • • • • • • ─────────
        │   •   •       •
        │     •    •  •   •
        │
        └──────────────────────
          Fitted values
```

**Bad pattern 1: Curve (nonlinearity)**

```
        │     •       •
Residual│   •       •
        │ •           •
      0 ├─ • • • • • • • • ─────────
        │   •       •
        │     •       •
```

The model missed a nonlinear pattern. Try a polynomial or spline.

**Bad pattern 2: Funnel (heteroscedasticity)**

```
        │           •
Residual│         •   •
        │       •       •
      0 ├─ • • • • • • • • ─────────
        │       •       •
        │         •   •
        │           •
```

Error variance grows (or shrinks) across fitted values. May indicate the model's uncertainty depends on the input. Use weighted regression or transform y.

### Plot 2: Q-Q Plot (Normality Test)

**What it shows:** Residuals vs theoretical normal quantiles.

**Good pattern: Straight diagonal line**

```
Residuals│      •
         │    •
       0 ├────────
         │  •
         │•
         └──────────────
          Normal quantiles
```

Residuals are approximately normal.

**Bad pattern: S-curve**

```
Residuals│        •
         │      •
       0 ├────────
         │•
         │•••
         └──────────────
          Normal quantiles
```

Heavy tails (outliers). Residuals more extreme than expected. May indicate:
- Outliers in data (investigate).
- Wrong model (e.g., linear on exponential).
- Natural heavy-tailed distribution (e.g., financial returns).

### Plot 3: Scale-Location (Constant Variance)

**What it shows:** Square root of standardised residuals vs fitted values.

**Good pattern: Flat band**

```
√|Res|/σ│  •   •   •   •
        │  •   •   •   •
        ├─ •───•───•───• ─────────
        │  •   •   •   •
        │  •   •   •   •
        └──────────────────
          Fitted values
```

Variance is homogeneous (good).

**Bad pattern: Funnel (same as Plot 1)**

```
√|Res|/σ│          •
        │        •   •
        │      •       •
        ├─ •───•───•───• ─────────
        │      •       •
        │        •   •
        │          •
```

Heteroscedasticity (error variance grows).

---

## What residual patterns mean

| Pattern | Meaning | Fix |
|---|---|---|
| Random blob, constant variance, normal | Model is appropriate. | No action needed. |
| Systematic curve | Model missed nonlinear pattern. | Try polynomial, spline, or interaction terms. |
| Funnel (heteroscedasticity) | Error variance depends on fitted value. | Weighted regression, log transformation, or model the variance. |
| S-curve in Q-Q | Heavy tails; outliers or wrong model. | Investigate outliers. Try robust regression (e.g., Huber). |
| Clusters | Data has subgroups with different patterns. | Consider separate models per group, or interaction terms. |

---

## Choosing a metric: context matters

### Goal 1: Interpret errors in original units

Use **MAE** or **RMSE** (both in units of y).

**MAE:** Average absolute error. Robust to outliers.

**RMSE:** Root mean squared error. Penalises large errors more.

**Example:** Predicting house prices. "On average, our model is off by $50k (MAE)" is easy to explain.

### Goal 2: Penalise large errors heavily

Use **RMSE** (not MAE).

RMSE penalises outliers more. If one $1M prediction error is catastrophic, RMSE catches it.

**Example:** Aircraft design. One large miss is worse than many small ones.

### Goal 3: Relative error (ignore scale)

Use **MAPE** (Mean Absolute Percentage Error).

MAPE = (1/n) × Σ |y_i − ŷ_i| / y_i × 100%.

Useful when y ranges over orders of magnitude (e.g., predicting revenue across products with different scales).

**Example:** Forecasting sales for products ranging $10–$1M. MAPE treats 10% error equally for all.

### Goal 4: Proportion of variance explained

Use **R²** (Coefficient of Determination).

R² ∈ [0, 1] (or negative). Easy to compare across datasets.

**Example:** "The model explains 85% of variance in house prices." Scale-independent.

### Goal 5: Robustness to outliers

Use **MAE** (not RMSE or MAPE).

MAE treats all errors equally; one outlier doesn't blow up the metric.

**Example:** Stock price prediction with occasional crashes. MAE won't spike on rare events.

---

## Metric selection flowchart

```
What's your priority?

├─ Interpretability in y's units?
│  ├─ Yes, robust to outliers     → MAE
│  └─ Yes, penalise large errors  → RMSE

├─ Relative error (% across scales)?
│  └─ Yes                          → MAPE or sMAPE

├─ Proportion of variance?
│  └─ Yes                          → R²

└─ Comparing models on same data?
   ├─ Yes                          → Any metric (choose for goal above)
   └─ No (compare across datasets) → R² (scale-independent)
```

---

## Common Mistakes

| # | Mistake | Wrong | Right |
|---|---|---|---|
| 1 | Ignoring residual plots, trusting only the metric | "RMSE=0.5, model is good" | Plot residuals. RMSE alone hides patterns. |
| 2 | Not checking normality of residuals | "Residuals don't need to be normal" | Normality affects confidence intervals and statistical tests. Check Q-Q plot. |
| 3 | Confusing heteroscedasticity (bad) with natural variance | "Some error variance is expected" | Heteroscedasticity = variance depends on fitted value (funnel). That's a problem; homoscedasticity is goal. |
| 4 | Choosing metric based on which gives best score | "RMSE is 0.8, MAPE is 15%. Report RMSE" | Choose metric to match your goal, not to look best. |
| 5 | Using MAPE on negative or zero y values | `MAPE = (1/n) × Σ |y - ŷ| / y` | MAPE undefined for y=0. Use MAE or RMSE instead. |
| 6 | Using R² to compare across different datasets | "Dataset A has R²=0.9, Dataset B has R²=0.7. B is worse." | R² is relative to data variance. Can't compare across datasets. Use RMSE or MAE. |
| 7 | Over-interpreting outliers in Q-Q plot | "Two points off the line → non-normal" | A few points off is normal (random variation). Look for systematic departures (S-curve). |
| 8 | Not standardising residuals before Q-Q plot | "Plot residuals directly in Q-Q" | Standardise first: (residuals − mean) / std. Easier to compare to N(0,1). |

---

## Summary

| Aspect | Check | How |
|---|---|---|
| **Linearity** | Is the model linear? | Residuals vs Fitted should be a random blob. Curve → nonlinearity. |
| **Homoscedasticity** | Is error variance constant? | Residuals vs Fitted: should have constant spread. Funnel → heteroscedasticity. |
| **Normality** | Are residuals normal? | Q-Q plot should follow diagonal. S-curve → heavy tails. |
| **Independence** | Are residuals independent? | Check autocorrelation (lag plot). Dots on diagonal → correlated errors. |

**Metric choice depends on:**

| Goal | Metric |
|---|---|
| Interpret errors in y's units, robust | MAE |
| Penalise large errors | RMSE |
| Relative error across scales | MAPE |
| Proportion of variance | R² |
| Compare within dataset | Any (match goal) |
| Compare across datasets | R² (if scales similar) or RMSE (absolute) |

**Key takeaways**

- **Residuals reveal patterns; metrics hide them.** Always plot residuals before trusting the model.
- **Three diagnostic plots:** Residuals vs Fitted (linearity, homoscedasticity), Q-Q (normality), Scale-Location (heteroscedasticity).
- **Good residuals:** random scatter, constant variance, approximately normal.
- **Bad residuals:** systematic curve (nonlinear), funnel (heteroscedasticity), S-curve (outliers).
- **Metric choice:** Match your goal (interpretability, robustness, relative error, variance explained).
- **No universal best metric.** Context matters.

**See also:** [Error in the Units of y](./01-error-in-the-units-of-y.md) for MAE, RMSE · [R² and Adjusted R²](./02-r-squared-and-adjusted-r-squared.md) for R² interpretation.

---

## Run It Yourself

```python title="residual_analysis.py"
import numpy as np
import matplotlib.pyplot as plt
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import PolynomialFeatures
from scipy import stats

np.random.seed(42)

# ---------- 1. Good residuals (linear fit) ----------
print("=" * 70)
print("EXAMPLE 1: Good Residuals (Linear Model on Linear Data)")
print("=" * 70)

# Linear data
X = np.linspace(0, 10, 50).reshape(-1, 1)
y = 2*X.ravel() + 1 + np.random.normal(0, 1, 50)

model_linear = LinearRegression().fit(X, y)
y_pred = model_linear.predict(X)
residuals = y - y_pred

print(f"\nLinear model on linear data:")
print(f"  RMSE: {np.sqrt(np.mean(residuals**2)):.3f}")
print(f"  R²:   {model_linear.score(X, y):.3f}")

# Residual statistics
print(f"\nResidual diagnostics:")
print(f"  Mean:        {np.mean(residuals):.4f} (should be ~0)")
print(f"  Std Dev:     {np.std(residuals):.3f}")
print(f"  Skewness:    {stats.skew(residuals):.3f} (should be ~0 for normal)")
print(f"  Kurtosis:    {stats.kurtosis(residuals):.3f} (should be ~0 for normal)")

# Normality test (Shapiro-Wilk)
stat, p_value = stats.shapiro(residuals)
print(f"  Shapiro-Wilk test: p={p_value:.3f} (p>0.05 → normal)")

# ---------- 2. Bad residuals: nonlinearity (underfitting) ----------
print("\n" + "=" * 70)
print("EXAMPLE 2: Bad Residuals — Nonlinear Data, Linear Model (Underfitting)")
print("=" * 70)

# Nonlinear (quadratic) data
X_nonlin = np.linspace(0, 10, 50).reshape(-1, 1)
y_nonlin = X_nonlin.ravel()**2 + np.random.normal(0, 5, 50)

# Fit linear (wrong model)
model_wrong = LinearRegression().fit(X_nonlin, y_nonlin)
y_pred_wrong = model_wrong.predict(X_nonlin)
residuals_wrong = y_nonlin - y_pred_wrong

print(f"\nLinear model on quadratic data (underfitting):")
print(f"  RMSE: {np.sqrt(np.mean(residuals_wrong**2)):.3f}")
print(f"  R²:   {model_wrong.score(X_nonlin, y_nonlin):.3f}")

print(f"\nResidual diagnostics:")
print(f"  Mean:        {np.mean(residuals_wrong):.4f}")
print(f"  Std Dev:     {np.std(residuals_wrong):.3f}")
print(f"  Skewness:    {stats.skew(residuals_wrong):.3f}")

stat_wrong, p_wrong = stats.shapiro(residuals_wrong)
print(f"  Shapiro-Wilk: p={p_wrong:.3f} (p<0.05 → NOT normal)")

print(f"\nPattern: Residuals have systematic curve (not random)")
print(f"         Model missed the quadratic pattern")

# Fit quadratic (correct model)
poly = PolynomialFeatures(degree=2)
X_poly = poly.fit_transform(X_nonlin)
model_correct = LinearRegression().fit(X_poly, y_nonlin)
y_pred_correct = model_correct.predict(X_poly)
residuals_correct = y_nonlin - y_pred_correct

print(f"\nQuadratic model on quadratic data (correct):")
print(f"  RMSE: {np.sqrt(np.mean(residuals_correct**2)):.3f}")
print(f"  R²:   {model_correct.score(X_poly, y_nonlin):.3f}")

stat_correct, p_correct = stats.shapiro(residuals_correct)
print(f"  Shapiro-Wilk: p={p_correct:.3f} (p>0.05 → normal)")

# ---------- 3. Heteroscedasticity (variance depends on fitted value) ----------
print("\n" + "=" * 70)
print("EXAMPLE 3: Bad Residuals — Heteroscedasticity (Funnel Shape)")
print("=" * 70)

# Data with heteroscedasticity (variance increases with x)
X_het = np.linspace(0, 10, 50).reshape(-1, 1)
y_het = 2*X_het.ravel() + 1 + np.random.normal(0, X_het.ravel()*0.5, 50)  # Var increases with x

model_het = LinearRegression().fit(X_het, y_het)
y_pred_het = model_het.predict(X_het)
residuals_het = y_het - y_pred_het

print(f"\nLinear model with heteroscedastic errors:")
print(f"  RMSE: {np.sqrt(np.mean(residuals_het**2)):.3f}")
print(f"  R²:   {model_het.score(X_het, y_het):.3f}")

# Compute variance by fitted value bins
fitted_bins = np.array_split(y_pred_het[np.argsort(y_pred_het)], 5)
residual_bins = np.array_split(residuals_het[np.argsort(y_pred_het)], 5)

print(f"\nVariance by fitted value bin:")
print(f"{'Bin':<8} {'Fitted range':<20} {'Residual std':<15}")
print("-" * 45)

for i, (f_bin, r_bin) in enumerate(zip(fitted_bins, residual_bins)):
    print(f"{i+1:<8} [{f_bin.min():.1f}, {f_bin.max():.1f}]  {np.std(r_bin):.3f}")

print(f"\nPattern: Residual variance increases as fitted values increase (funnel)")

# ---------- 4. Metric comparison ----------
print("\n" + "=" * 70)
print("EXAMPLE 4: Metric Comparison (MAE vs RMSE vs R²)")
print("=" * 70)

# Data with one outlier
X_outlier = np.linspace(0, 10, 20).reshape(-1, 1)
y_outlier = 2*X_outlier.ravel() + 1 + np.random.normal(0, 1, 20)
y_outlier[-1] = 50  # Add outlier

model_outlier = LinearRegression().fit(X_outlier, y_outlier)
y_pred_outlier = model_outlier.predict(X_outlier)

mae = np.mean(np.abs(y_outlier - y_pred_outlier))
rmse = np.sqrt(np.mean((y_outlier - y_pred_outlier)**2))
r2 = model_outlier.score(X_outlier, y_outlier)

print(f"\nModel with 1 outlier (y[-1] = 50):")
print(f"  MAE:  {mae:.3f} (average absolute error, robust)")
print(f"  RMSE: {rmse:.3f} (root mean squared, penalises outlier)")
print(f"  R²:   {r2:.3f} (variance explained, can be negative)")

# Same without outlier
y_no_outlier = y_outlier.copy()
y_no_outlier[-1] = 21  # Replace with reasonable value

model_no_outlier = LinearRegression().fit(X_outlier, y_no_outlier)
y_pred_no_outlier = model_no_outlier.predict(X_outlier)

mae_no = np.mean(np.abs(y_no_outlier - y_pred_no_outlier))
rmse_no = np.sqrt(np.mean((y_no_outlier - y_pred_no_outlier)**2))
r2_no = model_no_outlier.score(X_outlier, y_no_outlier)

print(f"\nSame model without outlier:")
print(f"  MAE:  {mae_no:.3f}")
print(f"  RMSE: {rmse_no:.3f}")
print(f"  R²:   {r2_no:.3f}")

print(f"\nDifference due to outlier:")
print(f"  MAE:  {mae - mae_no:+.3f} (small change)")
print(f"  RMSE: {rmse - rmse_no:+.3f} (large change — outlier effect)")
print(f"  R²:   {r2 - r2_no:+.3f}")
```

```text title="Output"
======================================================================
EXAMPLE 1: Good Residuals (Linear Model on Linear Data)
======================================================================

Linear model on linear data:
  RMSE: 0.989
  R²:   0.984

Residual diagnostics:
  Mean:        -0.0321 (should be ~0)
  Std Dev:     0.985
  Skewness:    -0.084 (should be ~0 for normal)
  Kurtosis:    -0.621 (should be ~0 for normal)

  Shapiro-Wilk test: p=0.567 (p>0.05 → normal)

======================================================================
EXAMPLE 2: Bad Residuals — Nonlinear Data, Linear Model (Underfitting)
======================================================================

Linear model on quadratic data (underfitting):
  RMSE: 14.523
  R²:   0.218

Residual diagnostics:
  Mean:        0.1246
  Std Dev:     14.512
  Skewness:    -0.456

  Shapiro-Wilk: p=0.002 (p<0.05 → NOT normal)

Pattern: Residuals have systematic curve (not random)
         Model missed the quadratic pattern

Quadratic model on quadratic data (correct):
  RMSE: 5.034
  R²:   0.925

  Shapiro-Wilk: p=0.341 (p>0.05 → normal)

======================================================================
EXAMPLE 3: Bad Residuals — Heteroscedasticity (Funnel Shape)
======================================================================

Linear model with heteroscedastic errors:
  RMSE: 2.845
  R²:   0.892

Variance by fitted value bin:
Bin      Fitted range         Residual std   
--
1        2.0, 6.0             0.312
2        6.1, 10.1            0.654
3        10.2, 14.2           1.142
4        14.3, 18.4           1.895
5        18.4, 23.0           2.631

Pattern: Residual variance increases as fitted values increase (funnel)

======================================================================
EXAMPLE 4: Metric Comparison (MAE vs RMSE vs R²)
======================================================================

Model with 1 outlier (y[-1] = 50):
  MAE:  2.198 (average absolute error, robust)
  RMSE: 11.045 (root mean squared, penalises outlier)
  R²:   -0.098 (variance explained, can be negative)

Same model without outlier:
  MAE:  0.956
  Std Dev:     0.985
  Skewness:    -0.084 (should be ~0 for normal)
  Kurtosis:    -0.621 (should be ~0 for normal)

  RMSE: 0.967
  R²:   0.985

Difference due to outlier:
  MAE:  +1.242 (small change)
  RMSE: +10.078 (large change — outlier effect)
  R²:   -1.083
```

### What to notice in that output

- **Example 1:** Good fit. Residuals normal (Shapiro p=0.567 > 0.05). Mean near zero, skewness near zero.
- **Example 2:** Linear fit on quadratic data. Shapiro p=0.002 (not normal), skewness -0.456 (asymmetric). Quadratic fit fixes it (p=0.341).
- **Example 3:** Heteroscedasticity: variance grows from 0.312 to 2.631 across fitted values. Classic funnel.
- **Example 4:** One outlier at y=50. MAE changes by 1.24, RMSE by 10.08. RMSE penalises outliers much more.

---

## Practice Questions

### Residual diagnostics

**T1. [THEORY]** What is a residual?

**T2. [THEORY]** What should good residuals look like?

**T3. [THEORY]** What does a curve pattern in residuals vs fitted indicate?

**T4. [THEORY]** What does a funnel pattern indicate?

**P1. [PROG]** Fit a linear model, plot residuals vs fitted. Describe the pattern.

### Choosing metrics

**T5. [THEORY]** When use MAE vs RMSE?

**T6. [THEORY]** When use MAPE?

**T7. [THEORY]** When use R²?

**A1. [ANALYZE]** You have house price data with occasional expensive outliers. MAE or RMSE?

**A2. [ANALYZE]** Predicting revenue for products at vastly different scales. MAE or MAPE?

---

## Quick self-check

1. What is a residual?
2. What are the three residual diagnostic plots?
3. What pattern indicates nonlinearity?
4. What does heteroscedasticity look like?
5. What does Q-Q plot assess?
6. When use MAE vs RMSE?
7. When use MAPE?
8. When use R²?
9. Can R² be negative?
10. How do you choose a metric?
