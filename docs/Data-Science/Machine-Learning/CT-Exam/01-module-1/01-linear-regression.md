---
sidebar_position: 1
title: Linear Regression
description: Complete guide to simple and multiple linear regression for CT exam with formulas, derivations, and worked examples
tags: [linear-regression, module-1, regression, least-squares]
---

# Linear Regression

## Overview

Linear regression is the **foundational ML algorithm** and a critical exam topic. You must understand:
- How to calculate regression coefficients
- Interpretation of coefficients and metrics
- Derivation of key formulas
- Worked examples from raw data to predictions

---

## Part 1: Simple Linear Regression

### What is Linear Regression?

Linear regression finds the **best-fit line** through data points that minimizes prediction error.

```
Purpose: Predict continuous values (y) from features (x)

Examples:
  • House price based on size
  • Stock price based on historical returns
  • Salary based on years of experience
```

### The Regression Equation

```
ŷ = b₀ + b₁x

where:
  ŷ   = predicted value
  b₀  = intercept (y when x=0)
  b₁  = slope (change per unit x)
  x   = feature/input variable
```

**Visual:**

```
        ŷ = b₀ + b₁x
      /
    /   (slope = b₁)
  /____
   ↑ (intercept = b₀)
```

---

## Part 2: Finding Coefficients (Least Squares)

### The Problem

Given n data points (x₁, y₁), (x₂, y₂), ..., (xₙ, yₙ), find b₀ and b₁ that **minimize the sum of squared errors**.

### Objective Function

```
Minimize SSE = Σ(yᵢ - ŷᵢ)²
            = Σ(yᵢ - (b₀ + b₁xᵢ))²

SSE = Sum of Squared Errors (total prediction error)
```

### Derivation (Know the Logic)

To minimize SSE, we take derivatives and set to zero:

```
∂SSE/∂b₀ = -2Σ(yᵢ - (b₀ + b₁xᵢ)) = 0
∂SSE/∂b₁ = -2Σxᵢ(yᵢ - (b₀ + b₁xᵢ)) = 0

This gives us two equations (Normal Equations):
  Σyᵢ = nb₀ + b₁Σxᵢ
  Σxᵢyᵢ = b₀Σxᵢ + b₁Σxᵢ²
```

### Solution Formulas (MUST MEMORIZE)

```
b₁ = Σ(xᵢ - x̄)(yᵢ - ȳ) / Σ(xᵢ - x̄)²
   = Sxy / Sxx

b₀ = ȳ - b₁x̄

where:
  x̄  = mean of x values
  ȳ  = mean of y values
  Sxy = covariance of x and y (numerator)
  Sxx = variance of x (denominator)
```

**Simplified formulas:**

```
Sxy = Σ(xᵢ - x̄)(yᵢ - ȳ) = ΣxᵢYᵢ - nx̄ȳ

Sxx = Σ(xᵢ - x̄)² = Σxᵢ² - nx̄²
```

---

## Part 3: Worked Example (FOR EXAM)

### Problem

Given 5 data points, find the regression line:

```
x = [1, 2, 3, 4, 5]
y = [2, 4, 5, 4, 5]
```

### Solution: Step-by-Step

**Step 1: Calculate means**

```
x̄ = (1+2+3+4+5)/5 = 15/5 = 3

ȳ = (2+4+5+4+5)/5 = 20/5 = 4
```

**Step 2: Create deviation table**

| x | y | x-x̄ | y-ȳ | (x-x̄)(y-ȳ) | (x-x̄)² |
|---|---|------|------|-----------|--------|
| 1 | 2 | -2   | -2   | 4         | 4      |
| 2 | 4 | -1   | 0    | 0         | 1      |
| 3 | 5 | 0    | 1    | 0         | 0      |
| 4 | 4 | 1    | 0    | 0         | 1      |
| 5 | 5 | 2    | 1    | 2         | 4      |
|   |   |      |      | **Sxy=6** | **Sxx=10** |

**Step 3: Calculate slope (b₁)**

```
b₁ = Sxy / Sxx = 6 / 10 = 0.6
```

**Step 4: Calculate intercept (b₀)**

```
b₀ = ȳ - b₁x̄
   = 4 - 0.6(3)
   = 4 - 1.8
   = 2.2
```

**Step 5: Write the equation**

```
ŷ = 2.2 + 0.6x
```

---

## Part 4: Predictions & Residuals

### Making Predictions

Using ŷ = 2.2 + 0.6x:

| x | Actual (y) | Predicted (ŷ) | Residual (e) | e² |
|---|-----------|----------------|--------------|-----|
| 1 | 2         | 2.8            | -0.8         | 0.64 |
| 2 | 4         | 3.4            | 0.6          | 0.36 |
| 3 | 5         | 4.0            | 1.0          | 1.00 |
| 4 | 4         | 4.6            | -0.6         | 0.36 |
| 5 | 5         | 5.2            | -0.2         | 0.04 |

### Understanding Residuals

```
Residual = Actual - Predicted
eᵢ = yᵢ - ŷᵢ

Properties:
  • Σeᵢ = 0 (residuals sum to zero)
  • Negative e = underprediction
  • Positive e = overprediction
  • Large |e| = bad prediction for that point
  
Residuals from our model: [-0.8, 0.6, 1.0, -0.6, -0.2]
Verification: -0.8 + 0.6 + 1.0 - 0.6 - 0.2 = 0 ✓
```

---

## Part 5: Error Metrics

### Sum of Squared Errors (SSE)

```
SSE = Σ(yᵢ - ŷᵢ)²
    = (-0.8)² + (0.6)² + (1.0)² + (-0.6)² + (-0.2)²
    = 0.64 + 0.36 + 1.00 + 0.36 + 0.04
    = 2.40
```

**What it means:**
- Total squared prediction error
- Smaller is better
- Depends on scale and number of samples
- Not directly interpretable on its own

### Mean Squared Error (MSE)

```
MSE = SSE / n = 2.40 / 5 = 0.48

Interpretation: Average squared error per sample
Units: y²
```

### Root Mean Squared Error (RMSE)

```
RMSE = √MSE = √0.48 = 0.693

Interpretation: Error in original units
Units: Same as y
Use: Compare across different datasets
```

### Mean Absolute Error (MAE)

```
MAE = Σ|yᵢ - ŷᵢ| / n
    = (0.8 + 0.6 + 1.0 + 0.6 + 0.2) / 5
    = 0.64

Interpretation: Average absolute error
Less sensitive to outliers than RMSE
```

---

## Part 6: Model Fit (R²)

### What is R²?

```
R² = 1 - SSE/SST

where:
  SSE = Σ(yᵢ - ŷᵢ)²     (model error)
  SST = Σ(yᵢ - ȳ)²       (total error from mean)
```

### Calculating R²

**Total Sum of Squares (SST):**

```
SST = Σ(yᵢ - ȳ)²
    = (2-4)² + (4-4)² + (5-4)² + (4-4)² + (5-4)²
    = 4 + 0 + 1 + 0 + 1
    = 6.0
```

**R² value:**

```
R² = 1 - SSE/SST
   = 1 - 2.40/6.0
   = 1 - 0.40
   = 0.60
```

**Interpretation:**

```
R² = 0.60 means:
  ✓ Model explains 60% of variance in y
  ✓ 40% of variance unexplained
  ✓ Model beats mean baseline significantly
  ✗ Not "60% accurate" (common misconception!)
```

### R² vs Correlation

```
For simple linear regression ONLY:
R² = r²

where r = Pearson correlation coefficient

Example:
  r = 0.775 → r² = 0.60 = R² ✓

This relationship breaks with multiple features!
```

### Adjusted R²

```
Adjusted R² = 1 - (1 - R²) × (n-1)/(n-k-1)

where:
  n = number of observations
  k = number of features
```

**In our example:**

```
Adjusted R² = 1 - (1 - 0.60) × (5-1)/(5-1-1)
            = 1 - 0.40 × (4/3)
            = 1 - 0.533
            = 0.467
```

**Why penalize?**
- Small sample (n=5) with fewer samples than features ratio
- Risk of overfitting
- Adjusted R² > R² = overfitting concern

---

## Part 7: Complete Inference & Interpretation

### What Each Metric Tells Us

#### SSE = 2.40 Interpretation

```
SSE measures: Total squared prediction error

SSE = 2.40 means:
  ✓ Model's total squared mistakes: 2.40
  ✓ But this depends on sample size and scale
  ✓ Need to compare with SST to judge quality

Context:
  SSE alone is NOT interpretable
  Compare to SST (baseline) for meaning
```

#### MSE = 0.48 Interpretation

```
MSE measures: Average squared error per sample

MSE = 0.48 = 2.40 / 5 means:
  ✓ On average, squared error is 0.48 per observation
  ✓ Still in squared units (not practical)
  ✓ Use RMSE for practical interpretation
```

#### RMSE = 0.693 Interpretation

```
RMSE measures: Error in original units (practical)

RMSE = 0.693 = √0.48 means:
  ✓ Typical prediction error is 0.693 units
  ✓ In original context (house price in tens of lakhs):
    "Model is typically off by ₹6.93 lakh"
  ✓ Comparable across different datasets
  ✓ More sensitive to large errors than MAE
  
Why RMSE > MAE (0.693 > 0.64)?
  Because one error (1.0) is much larger
  RMSE penalizes large errors more
```

#### MAE = 0.64 Interpretation

```
MAE measures: Average absolute error (practical)

MAE = 0.64 = (0.8 + 0.6 + 1.0 + 0.6 + 0.2) / 5 means:
  ✓ Average prediction error is 0.64 units
  ✓ In original context:
    "Model is typically off by ₹6.4 lakh"
  ✓ Easier to explain to non-technical audience
  ✓ Less sensitive to outlier errors
  
Comparison:
  MAE = 0.64
  RMSE = 0.693
  Gap = 0.053
  
  Interpretation: Most errors are small,
                  but one large error (1.0)
                  pulls RMSE higher
```

#### R² = 0.60 Interpretation (CRITICAL!)

```
R² measures: What percentage of variance is explained

R² = 0.60 calculation:
  R² = 1 - SSE/SST
     = 1 - 2.40/6.00
     = 1 - 0.40
     = 0.60

Interpretation (CORRECT):
  ✓ Model explains 60% of the variation in price
  ✓ 40% remains unexplained (likely other factors)
  ✓ Size alone accounts for 60% of price differences
  
NOT (WRONG):
  ✗ Model is "60% accurate"
  ✗ Predictions are "60% correct"
  ✗ Model explains 60% of the data

Why the distinction?
  • Accuracy = classification metric
  • R² = regression metric (different scale)
  • R² measures variance explained, not accuracy

Practical meaning:
  Person A: 100 m², Person B: 200 m²
  Price difference in data: varies a lot (due to other factors)
  Our model explains 60% of this difference (good!)
  Other 40% due to location, age, condition, etc.
```

### Residuals Pattern Analysis

```
Residuals: [-0.8, 0.6, 1.0, -0.6, -0.2]

Pattern Analysis:
  Position 1: -0.8 (underpredicted, prediction too low)
  Position 2: +0.6 (overpredicted, prediction too high)
  Position 3: +1.0 (large overprediction - outlier error)
  Position 4: -0.6 (underpredicted)
  Position 5: -0.2 (slight underprediction)

What this tells us:
  ✓ Errors roughly balanced (roughly zero mean)
  ✓ Positions 2,3 both overpredicted (mid-range)
  ✓ Suggests slight non-linearity
  ✓ One outlier (position 3) worth investigating

If residuals showed pattern:
  ✗ U-shape → non-linear relationship
  ✗ Increasing spread → heteroscedasticity
  ✗ Autocorrelation → time series issue
```

### Model Quality Assessment

```
How good is this model?

Quantitative assessment (R² = 0.60):
  • Explains 60% of variance
  • Typical prediction error ≈ 0.69 units (≈ ₹6.9L)
  • Better than just using mean (0% explained)
  • Room for improvement (40% unexplained)

Qualitative assessment:
  ✓ STRENGTHS:
    • Clear positive relationship (b₁ = 0.6)
    • Relationship makes sense (bigger house → higher price)
    • Model explains meaningful variance (60%)
  
  ✗ WEAKNESSES:
    • Sample size too small (n=5)
    • Adjusted R² = 0.47 (suggests overfitting risk)
    • 40% variance unexplained (missing factors)
    • One outlier error (1.0) worth investigating

Recommendation:
  • Good for rough estimates
  • NOT reliable for precise valuations
  • Collect more data to stabilize estimates
  • Add features (location, age, amenities)
```

### Coefficient Interpretation with Context

```
Equation: ŷ = 2.2 + 0.6x

b₀ = 2.2 interpretation:
  Theoretical: Base price when size = 0
  Practical: NOT meaningful (no house with 0 size)
  Purpose: Just needed to fit the line

b₁ = 0.6 interpretation:
  Mathematical: For each 1 unit increase in x,
               predicted y increases by 0.6
  
  In context: For each 100 m² increase in house size,
             predicted price increases by ₹6 lakh
  
  Practical examples:
    • 100 m² house: ŷ = 2.2 + 0.6(1) = 2.8 (₹28L)
    • 200 m² house: ŷ = 2.2 + 0.6(2) = 3.4 (₹34L)
    • 300 m² house: ŷ = 2.2 + 0.6(3) = 4.0 (₹40L)
    
  Implied relationship:
    Each additional 100 m² adds ₹6L
    Or: Each 1 m² adds ₹60k (more precise)
```

---

## Part 8: Multiple Linear Regression

### The Equation

```
ŷ = b₀ + b₁x₁ + b₂x₂ + ... + bₖxₖ

Example (House Price):
price = 2.2 + 0.6×size + (-0.1)×age + 0.05×location_score
```

### Matrix Form (Normal Equation)

```
B = (X^T · X)^(-1) · X^T · y

where:
  B = [b₀, b₁, b₂, ..., bₖ]ᵀ
  X = n×(k+1) feature matrix (column of 1s for intercept)
  y = n×1 target vector
```

**This solves for all coefficients simultaneously**

### Coefficient Interpretation

```
In model: salary = 20000 + 100×experience - 50×education + 0.5×performance

b₁ = 100 means:
  "For every additional year of experience,
   salary increases by $100,
   HOLDING education and performance constant"

Key: "Holding other variables constant"
     (this is partial/marginal effect)
```

### Important Concepts

**Multicollinearity:**
```
When features are highly correlated
Problem: Coefficients become unstable
Solution: Ridge or Lasso regression
```

**Feature Selection:**
```
With many features, use:
  • Lasso regression (drives insignificant coefficients to zero)
  • Forward/backward selection
  • Regularization (L1/L2)
```

---

## Part 8: Assumptions of Linear Regression

### Critical Assumptions (For Exam)

1. **Linearity**
   - True relationship between X and y is linear
   - Check: Scatter plot should show linear trend

2. **Independence**
   - Observations are independent
   - Check: Time series? Grouped data? If yes, model is violated

3. **Homoscedasticity**
   - Error variance is constant across all X values
   - Check: Residual plot should have equal spread

4. **Normality of Residuals**
   - Residuals should be normally distributed
   - Check: Q-Q plot or histogram

5. **No Multicollinearity** (Multiple regression only)
   - Features should not be highly correlated
   - Check: Correlation matrix

### Violation Consequences

```
Violated          Consequence                Solution
──────────────────────────────────────────────────────
Linearity         Poor predictions           Add polynomial terms
Independence      Biased std errors          Use appropriate model
Homoscedasticity  Invalid confidence         Weighted regression
Normality         Invalid inference          Log transform y
Multicollinearity Unstable coefficients      Ridge/Lasso regression
```

---

## Part 9: Common Exam Questions

### Q1: Calculate Regression Coefficients

**Q:** Given x = [1, 2, 3], y = [3, 5, 7], find the regression line.

**A:** 
```
x̄ = 2, ȳ = 5

Deviation table:
x  y  x-x̄  y-ȳ  (x-x̄)(y-ȳ)  (x-x̄)²
1  3  -1   -2    2           1
2  5   0    0    0           0
3  7   1    2    2           1
              Sxy=4  Sxx=2

b₁ = 4/2 = 2
b₀ = 5 - 2(2) = 1

Answer: ŷ = 1 + 2x
```

---

### Q2: Interpret Coefficients

**Q:** In model ŷ = 50 + 3x, what does b₁ = 3 mean?

**A:**
```
For every 1 unit increase in x,
predicted y increases by 3 units.

Example:
  x = 10 → ŷ = 50 + 30 = 80
  x = 11 → ŷ = 50 + 33 = 83
  (increase of 3)
```

---

### Q3: Calculate R²

**Q:** Given SSE = 15, SST = 50, calculate R².

**A:**
```
R² = 1 - SSE/SST
   = 1 - 15/50
   = 1 - 0.30
   = 0.70

Interpretation:
Model explains 70% of variance in y.
30% unexplained.
```

---

### Q4: Compare Models

**Q:** Model A: R² = 0.85, Adjusted R² = 0.83
      Model B: R² = 0.87, Adjusted R² = 0.81
      Which is better?

**A:**
```
Look at Adjusted R²!

Model A: Adj R² = 0.83 > Model B: Adj R² = 0.81

Model A is better.
Model B likely overfitting (R² > Adj R² gap is larger).
```

---

### Q5: Residual Analysis

**Q:** Residuals show a U-shaped pattern. What does this mean?

**A:**
```
U-shaped pattern indicates:
✗ Linearity assumption violated
✗ True relationship is likely non-linear
→ Solution: Try x² term or polynomial regression
```

---

## Part 10: Key Formulas Recap

### Core Formulas

```
Slope:          b₁ = Sxy / Sxx

Intercept:      b₀ = ȳ - b₁x̄

Prediction:     ŷ = b₀ + b₁x

Residual:       e = y - ŷ

SSE:            SSE = Σ(y - ŷ)²

SST:            SST = Σ(y - ȳ)²

MSE:            MSE = SSE / n

RMSE:           RMSE = √MSE

MAE:            MAE = Σ|y - ŷ| / n

R²:             R² = 1 - SSE/SST = (SST-SSE)/SST

Adj R²:         Adj R² = 1 - (1-R²) × (n-1)/(n-k-1)

Correlation:    r = Sxy / (√Sxx × √Syy)
```

---

## Part 11: Practice Problems

### Problem 1: Simple Regression
```
Data: x = [2, 4, 6, 8]
      y = [3, 7, 11, 15]

Calculate:
a) Regression line
b) Predictions for x = 5, 7, 9
c) R² value
d) Interpret each coefficient
```

### Problem 2: Error Metrics
```
Predictions: [2.1, 3.9, 5.2, 4.1, 5.0]
Actual:      [2.0, 4.0, 5.0, 4.0, 5.0]

Calculate:
a) MAE
b) MSE
c) RMSE
d) Comment on predictions
```

### Problem 3: Model Comparison
```
Model 1: R² = 0.92, Adj R² = 0.88, n = 50, k = 5
Model 2: R² = 0.91, Adj R² = 0.89, n = 50, k = 3

Which is better? Why?
```

---

## Tips for CT Exam

### ✅ DO

- **Memorize the deviation table approach** - fastest calculation method
- **Show all steps** - partial credit awarded
- **Label your axes** when interpreting coefficients
- **State assumptions** before using linear regression
- **Check R² reasonableness** (0 to 1 range)

### ❌ DON'T

- Don't confuse R² with accuracy percentage
- Don't forget to include intercept in equation
- Don't use Σxy directly; use deviations
- Don't claim causation from correlation
- Don't apply linear regression to non-linear data without checking

---

## Summary

| Concept | Must Know |
|---------|-----------|
| **Equation** | ŷ = b₀ + b₁x |
| **b₁ formula** | Sxy / Sxx |
| **b₀ formula** | ȳ - b₁x̄ |
| **SSE** | Σ(y - ŷ)² |
| **R²** | 1 - SSE/SST |
| **Interpretation** | R² = 0.60 → explains 60% of variance |
| **Assumption check** | Linearity, Independence, Homoscedasticity, Normality |

**Next Topic:** → [Bias-Variance Tradeoff](./02-bias-variance.md)
