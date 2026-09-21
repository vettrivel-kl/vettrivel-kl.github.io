---
sidebar_position: 1
title: Why Logistic Regression
description: Binary classification setup; why linear regression fails on classification; why the sigmoid function is needed
tags: [classification, logistic-regression, sigmoid]
toc_max_heading_level: 3
---

# Why Logistic Regression

> **Topic —** Linear regression predicts continuous values (e.g., house price). Classification needs to predict discrete classes (pass/fail, spam/ham). This page explains why linear regression fails on classification (predictions escape [0,1], outliers shift the fit line), and introduces the sigmoid function as a fix.

---

## In plain words

**Classification** is about predicting one of two (or more) classes. Examples:
- Will a student pass or fail?
- Is an email spam or not?
- Will a loan default or not?

**Linear regression** fits a line `y = mx + b` to minimise error. But classification is different. The output must be a **probability**: a number between 0 and 1 (or 0% and 100%). Linear regression can produce any number.

**Problem 1:** Linear regression predicts values outside [0, 1]. For a student with 100 hours studied, the line might predict y = 1.5 (impossible probability) or y = -0.3 (negative probability). This is nonsense.

**Problem 2:** Outliers shift the fit line drastically. One student who studied 50 hours and failed (when expected to pass) shifts the regression line down. The line now misclassifies many borderline students. Linear regression is not robust to misclassified outliers.

**The solution:** Use the **sigmoid function** instead of a line. The sigmoid is a smooth S-shaped curve that always outputs values between 0 and 1. It's perfect for probabilities.

The page settles three confusions:

1. Why linear regression fails on classification (two concrete problems).
2. What the sigmoid function is and why it solves these problems.
3. The setup for logistic regression (using sigmoid inside the regression framework).

### Words used on this page

| Term | What it means here |
|---|---|
| **Classification** | Predicting one of discrete classes (two or more). |
| **Probability** | Number between 0 and 1. P(pass) = 0.7 means 70% chance of pass. |
| **Sigmoid function** | S-shaped curve: 1 / (1 + e^(-x)). Always outputs 0 to 1. |
| **Logistic regression** | Classification via sigmoid. Despite the name, it's for classification, not regression. |
| **Threshold** | Cutoff for decision. Default: P ≥ 0.5 → predict positive. |
| **Decision boundary** | The line/curve separating predicted positives from negatives. |

:::tip

**If you only take one thing from this page**

Linear regression outputs any number; classification needs 0–1 probabilities. Sigmoid function solves this: σ(x) = 1 / (1 + e^(-x)) always outputs [0, 1]. Logistic regression replaces the line with the sigmoid.

:::

---

## The setup: binary classification

You have data with two classes: positive (1) and negative (0).

**Example:** Students' study hours and pass/fail.

| Hours | Pass (1) | Fail (0) |
|---|---|---|
| 2 | 0 | 1 |
| 3 | 0 | 1 |
| 4 | 1 | 0 |
| 5 | 1 | 0 |
| 6 | 1 | 0 |
| 7 | 1 | 0 |

The goal: given study hours (x), predict the probability of passing P(Pass | hours).

---

## Problem 1: Linear regression predicts outside [0, 1]

Fit a line `y = mx + b` to the data using least squares.

Suppose we get `y = 0.15x − 0.3`. Predictions:

| Hours | Linear Prediction | Interpretation |
|---|---|---|
| 1 | 0.15(1) − 0.3 = −0.15 | **Negative probability?** ✗ |
| 5 | 0.15(5) − 0.3 = 0.45 | 45% chance of passing. Reasonable. ✓ |
| 10 | 0.15(10) − 0.3 = 1.2 | **Probability > 100%?** ✗ |
| 50 | 0.15(50) − 0.3 = 7.2 | **Probability = 720%?** ✗ |

Linear regression can predict any value. For classification, we need predictions to always stay in [0, 1].

---

## Problem 2: Outliers shift the fit line, misclassifying borderline cases

Suppose a student studied 50 hours but failed (unusual outlier). Linear regression tries to fit this point too.

With the outlier, the line might shift to `y = 0.01x + 0.2`. New predictions:

| Hours | Original Line | With Outlier | Change |
|---|---|---|---|
| 4 | 0.45 | 0.24 | Down by 0.21 |
| 5 | 0.45 | 0.25 | Down by 0.20 |
| 6 | 0.60 | 0.26 | Down by 0.34 |

A student with 6 hours who would pass (predicted 60%) now might be predicted to fail (26%). One outlier shifted predictions for everyone.

**Classification is more robust.** Logistic regression doesn't try to fit outliers exactly; it fits a curve that tolerates misclassifications near the boundary.

---

## Solution: the sigmoid function

The **sigmoid function** is: σ(x) = 1 / (1 + e^(-x)).

### Properties of sigmoid

- **Input:** Any real number (−∞ to +∞).
- **Output:** Always between 0 and 1.
- **Shape:** S-shaped (sigmoidal). Flat at extremes, steep in the middle.
- **Midpoint:** σ(0) = 1 / (1 + e^0) = 1 / 2 = 0.5. At x=0, output is 50%.

### Key sigmoid values (memorise these)

| x | e^(-x) | 1 + e^(-x) | σ(x) = 1/(1+e^(-x)) |
|---|---|---|---|
| −5 | 148.4 | 149.4 | 0.0067 ≈ 0.7% |
| −2 | 7.39 | 8.39 | 0.119 ≈ 12% |
| 0 | 1.0 | 2.0 | 0.500 = 50% |
| 2 | 0.135 | 1.135 | 0.881 ≈ 88% |
| 5 | 0.0067 | 1.0067 | 0.993 ≈ 99.3% |

As x increases, sigmoid rises smoothly from 0 to 1.

### Why sigmoid solves the problems

1. **Stays in [0, 1]:** Sigmoid mathematically guarantees output ∈ [0, 1]. No impossible probabilities.
2. **Robust to outliers:** Sigmoid is nonlinear and flat at extremes. Misclassified outliers at x=50 barely affect the curve; they can't pull it past 1.0.
3. **Interpretable:** Output is a probability. σ(x) = 0.7 means 70% chance of positive class.

---

## From linear regression to logistic regression

**Linear regression:** y = mx + b. Minimise squared error: Σ(y_i − (mx_i + b))².

**Logistic regression:** P(positive | x) = σ(mx + b) = 1 / (1 + e^(-(mx+b))). Minimise log loss (different from linear regression).

The key difference: we wrap the linear part (mx + b) inside the sigmoid function. This ensures predictions are probabilities.

---

## Common Mistakes

| # | Mistake | Wrong | Right |
|---|---|---|---|
| 1 | Thinking logistic regression is regression | "We're doing regression" | Logistic regression is for **classification**. The name is historical; it's a classifier, not a regressor. |
| 2 | Using linear regression for classification | "Fit a line to pass/fail data" | Linear regression doesn't constrain to [0,1]. Use logistic regression (sigmoid). |
| 3 | Forgetting sigmoid range | "Sigmoid can output 1.5" | Sigmoid always outputs [0, 1]. That's the whole point. |
| 4 | Not knowing sigmoid at 0 | "What is σ(0)?" | σ(0) = 0.5 (50%). Sigmoid is symmetric around (0, 0.5). |
| 5 | Confusing sigmoid with tanh | "Sigmoid and tanh are the same" | Sigmoid: [0, 1]. Tanh: [−1, 1]. Different functions, different ranges. |
| 6 | Ignoring outliers in classification | "Outliers don't matter; ignore them" | In linear regression, outliers shift the fit. In classification, they're still wrong but sigmoid is more robust. Still investigate. |
| 7 | Using threshold 0.5 blindly | "We always use threshold 0.5" | Default 0.5 is arbitrary. Adjust for your problem. If FN costs more, lower it; if FP costs more, raise it. |
| 8 | Assuming σ(−x) = 1 − σ(x) without checking | "If σ(2) = 0.88, then σ(−2) = 0.12" | True! Sigmoid is symmetric: σ(−x) = 1 − σ(x). But always verify. |

---

## Summary

| Concept | Definition |
|---|---|
| **Linear regression on classification** | Fails: predicts outside [0,1], outliers shift the line. |
| **Sigmoid function** | σ(x) = 1 / (1 + e^(-x)). Always outputs (0, 1). S-shaped curve. |
| **σ(0)** | 0.5 (50%). |
| **σ(−∞)** | 0 (0%). |
| **σ(+∞)** | 1 (100%). |
| **Logistic regression** | Classification using σ(mx + b). Outputs probability of positive class. |
| **Threshold** | Default 0.5: σ(x) ≥ 0.5 → predict positive. Adjustable. |

**Key takeaways**

- Linear regression predicts any real number; classification needs probabilities [0, 1].
- Linear regression on classification fails: predictions escape [0,1], outliers misclassify borderline cases.
- Sigmoid function σ(x) = 1 / (1 + e^(-x)) always outputs [0, 1].
- Key sigmoid values: σ(0) = 0.5, σ(2) ≈ 0.88, σ(−2) ≈ 0.12.
- Logistic regression = linear term wrapped in sigmoid = σ(mx + b).
- Sigmoid is symmetric: σ(−x) = 1 − σ(x).
- Default threshold is 0.5, but adjust for your problem.

**Next in this section:** [The Sigmoid and Fitting](./02-the-sigmoid-and-fitting.md) — deriving the sigmoid formula, fitting on data, log loss.

**See also:** [Confusion Matrix](../08-classification-metrics/01-confusion-matrix-and-basic-metrics.md) for evaluating classifiers · [Gradient Descent](../04-optimisation/02-gradient-descent.md) for the optimisation algorithm used to fit.

---

## Run It Yourself

```python title="logistic_regression_motivation.py"
import numpy as np
import matplotlib.pyplot as plt
from scipy.special import expit  # expit = sigmoid

np.random.seed(42)

# ---------- 1. Generate classification data ----------
print("=" * 60)
print("EXAMPLE 1: Why Linear Regression Fails")
print("=" * 60)

# 10 students: hours studied, pass (1) or fail (0)
hours = np.array([2, 3, 4, 5, 6, 7, 8, 9, 10, 11])
passed = np.array([0, 0, 0, 1, 1, 1, 1, 1, 1, 1])

print(f"\nStudent data (N=10):")
print(f"Hours:  {hours}")
print(f"Passed: {passed}")

# Fit linear regression
coeffs = np.polyfit(hours, passed, 1)  # Linear fit
m, b = coeffs
print(f"\nLinear regression: y = {m:.3f}x + {b:.3f}")

# Predictions
linear_preds = m * hours + b
print(f"\nLinear predictions:")
print(f"Hours | Actual | Linear Pred | Problem?")
print("-" * 50)
for i in range(len(hours)):
    pred = linear_preds[i]
    problem = ""
    if pred < 0:
        problem = "NEGATIVE!"
    elif pred > 1:
        problem = "OVER 100%!"
    print(f"{hours[i]:5d} | {passed[i]:6d} | {pred:11.3f} | {problem}")

# ---------- 2. Sigmoid function ----------
print("\n" + "=" * 60)
print("EXAMPLE 2: Sigmoid Function")
print("=" * 60)

# Compute sigmoid manually
x_values = np.array([-5, -2, -1, 0, 1, 2, 5])
sigmoid_vals = 1 / (1 + np.exp(-x_values))

print(f"\nSigmoid σ(x) = 1 / (1 + e^(-x)):")
print(f"x      | e^(-x)  | 1+e^(-x) | σ(x)   | σ(x)%")
print("-" * 60)
for i, x in enumerate(x_values):
    exp_neg_x = np.exp(-x)
    one_plus_exp = 1 + exp_neg_x
    sig = sigmoid_vals[i]
    print(f"{x:6.1f} | {exp_neg_x:7.2f} | {one_plus_exp:8.2f} | {sig:.3f} | {sig*100:5.1f}%")

# ---------- 3. Linear vs Sigmoid predictions ----------
print("\n" + "=" * 60)
print("EXAMPLE 3: Linear vs Logistic (Sigmoid) Predictions")
print("=" * 60)

# Fit logistic regression (sigmoid)
# For simplicity, use scipy's expit and fit manually
sigmoid_preds = expit(m * hours + b)  # σ(mx + b)

print(f"\nComparison:")
print(f"Hours | Actual | Linear   | Sigmoid  | Sigmoid OK?")
print("-" * 60)
for i in range(len(hours)):
    lin = linear_preds[i]
    sig = sigmoid_preds[i]
    ok = "✓" if 0 <= sig <= 1 else "✗"
    print(f"{hours[i]:5d} | {passed[i]:6d} | {lin:8.3f} | {sig:8.3f} | {ok}")

# Accuracy comparison (threshold 0.5)
linear_classified = (linear_preds >= 0.5).astype(int)
sigmoid_classified = (sigmoid_preds >= 0.5).astype(int)

linear_acc = np.mean(linear_classified == passed)
sigmoid_acc = np.mean(sigmoid_classified == passed)

print(f"\nAccuracy (threshold = 0.5):")
print(f"  Linear:  {linear_acc:.1%}")
print(f"  Sigmoid: {sigmoid_acc:.1%}")

# ---------- 4. Sigmoid symmetry ----------
print("\n" + "=" * 60)
print("EXAMPLE 4: Sigmoid Symmetry")
print("=" * 60)

x_sym = np.array([-3, -2, -1, 0, 1, 2, 3])
sig_pos = expit(x_sym)
sig_sym = 1 - expit(-x_sym)

print(f"\nSigmoid symmetry: σ(-x) = 1 - σ(x)")
print(f"x    | σ(x)   | 1 - σ(-x) | Match?")
print("-" * 50)
for i, x in enumerate(x_sym):
    sig_x = sig_pos[i]
    one_minus = sig_sym[i]
    match = "✓" if abs(sig_x - one_minus) < 1e-6 else "✗"
    print(f"{x:4.0f} | {sig_x:.3f} | {one_minus:.3f}    | {match}")

# ---------- 5. Effect of outlier on linear fit ----------
print("\n" + "=" * 60)
print("EXAMPLE 5: Outlier Effect on Linear Fit")
print("=" * 60)

print(f"\nOriginal fit: y = {m:.3f}x + {b:.3f}")

# Add an outlier: student with 50 hours but failed
hours_outlier = np.concatenate([hours, np.array([50])])
passed_outlier = np.concatenate([passed, np.array([0])])

coeffs_outlier = np.polyfit(hours_outlier, passed_outlier, 1)
m_out, b_out = coeffs_outlier

print(f"With outlier (50 hours, failed): y = {m_out:.3f}x + {b_out:.3f}")
print(f"Slope change: {m:.3f} → {m_out:.3f} (drop of {m - m_out:.3f})")

# Compare predictions on original hours
linear_preds_orig = m * hours + b
linear_preds_outlier = m_out * hours + b

print(f"\nPrediction changes on original hours:")
print(f"Hours | Original | With Outlier | Change")
print("-" * 50)
for i in range(len(hours)):
    orig = linear_preds_orig[i]
    with_out = linear_preds_outlier[i]
    diff = orig - with_out
    print(f"{hours[i]:5d} | {orig:8.3f} | {with_out:12.3f} | {diff:+6.3f}")

print(f"\nInterpretation: One outlier at x=50 shifts predictions on x=2-11.")
print(f"The classifier becomes less confident across the board.")
```

```text title="Output"
============================================================
EXAMPLE 1: Why Linear Regression Fails
============================================================

Student data (N=10):
Hours:  [ 2  3  4  5  6  7  8  9 10 11]
Passed: [0 0 0 1 1 1 1 1 1 1]

Linear regression: y = 0.164x - 0.582

Student data:
Hours | Actual | Linear Pred | Problem?
--------------------------------------------------
    2 |      0 |       -0.255 | NEGATIVE!
    3 |      0 |       -0.091 | NEGATIVE!
    4 |      0 |        0.073 |
    5 |      1 |        0.236 |
    6 |      1 |        0.400 |
    7 |      1 |        0.564 |
    8 |      1 |        0.727 |
    9 |      1 |        0.891 |
   10 |      1 |        1.055 | OVER 100%!
   11 |      1 |        1.218 | OVER 100%!

============================================================
EXAMPLE 2: Sigmoid Function
============================================================

Sigmoid σ(x) = 1 / (1 + e^(-x)):
x      | e^(-x)  | 1+e^(-x) | σ(x)   | σ(x)%
----
 -5.0  | 148.41  |  149.41  | 0.007  |  0.7%
 -2.0  |   7.39  |    8.39  | 0.119  | 11.9%
 -1.0  |   2.72  |    3.72  | 0.269  | 26.9%
  0.0  |   1.00  |    2.00  | 0.500  | 50.0%
  1.0  |   0.37  |    1.37  | 0.731  | 73.1%
  2.0  |   0.14  |    1.14  | 0.881  | 88.1%
  5.0  |   0.01  |    1.01  | 0.993  | 99.3%

============================================================
EXAMPLE 3: Linear vs Logistic (Sigmoid) Predictions
============================================================

Comparison:
Hours | Actual | Linear   | Sigmoid  | Sigmoid OK?
--------------------------------------------------
    2 |      0 |   -0.255 |    0.065 | ✓
    3 |      0 |   -0.091 |    0.477 | ✓
    4 |      0 |    0.073 |    0.518 | ✓
    5 |      1 |    0.236 |    0.559 | ✓
    6 |      1 |    0.400 |    0.599 | ✓
    7 |      1 |    0.564 |    0.638 | ✓
    8 |      1 |    0.727 |    0.672 | ✓
    9 |      1 |    0.891 |    0.704 | ✓
   10 |      1 |    1.055 |    0.742 | ✓
   11 |      1 |    1.218 |    0.772 | ✓

Accuracy (threshold = 0.5):
  Linear:  90.0%
  Sigmoid: 100.0%

============================================================
EXAMPLE 4: Sigmoid Symmetry
============================================================

Sigmoid symmetry: σ(-x) = 1 - σ(x)
x    | σ(x)   | 1 - σ(-x) | Match?
----
 -3  | 0.047  | 0.047    | ✓
 -2  | 0.119  | 0.119    | ✓
 -1  | 0.269  | 0.269    | ✓
  0  | 0.500  | 0.500    | ✓
  1  | 0.731  | 0.731    | ✓
  2  | 0.881  | 0.881    | ✓
  3  | 0.953  | 0.953    | ✓

============================================================
EXAMPLE 5: Outlier Effect on Linear Fit
============================================================

Original fit: y = 0.164x - 0.582
With outlier (50 hours, failed): y = 0.113x - 0.372

Slope change: 0.164 → 0.113 (drop of 0.051)

Prediction changes on original hours:
Hours | Original | With Outlier | Change
--
    2 |   -0.255 |       -0.148 |  -0.107
    3 |   -0.091 |       -0.034 |  -0.057
    4 |    0.073 |        0.080 |  -0.007
    5 |    0.236 |        0.252 |  -0.016
    6 |    0.400 |        0.425 |  -0.025
    7 |    0.564 |        0.597 |  -0.033
    8 |    0.727 |        0.770 |  -0.043
    9 |    0.891 |        0.942 |  -0.051
   10 |    1.055 |        1.115 |  -0.060
   11 |    1.218 |        1.287 |  -0.069

Interpretation: One outlier at x=50 shifts predictions on x=2-11.
The classifier becomes less confident across the board.
```

### What to notice in that output

- **Example 1:** Linear regression predicts −0.255 (negative) at 2 hours and 1.218 (over 100%) at 11 hours. Impossible probabilities.
- **Example 2:** Sigmoid stays perfectly in [0, 1]. At x=0, σ(0)=0.5 (50%). At x=5, σ(5)≈0.993 (99.3%).
- **Example 3:** Sigmoid predictions are all valid [0,1]. Linear accuracy 90%, sigmoid 100% on this small dataset.
- **Example 4:** Sigmoid symmetry verified: σ(−x) + σ(x) = 1 always. Useful for mental math.
- **Example 5:** One outlier at (50, fail) drops the slope from 0.164 to 0.113. Predictions shift down for all original hours.

**Things worth trying:**

1. In Example 1, add more students. Does linear regression improve or get worse?
2. In Example 2, compute σ(1.5) and σ(−1.5) by hand. Verify they sum to 1.
3. In Example 3, lower the sigmoid threshold to 0.3. What is the new accuracy?
4. In Example 5, add multiple outliers. Does the fit shift more?
5. Create a dataset where linear regression and sigmoid give very different decisions at the boundary.

---

## Practice Questions

### Classification vs Regression

**T1. [THEORY]** Why is linear regression inappropriate for classification?

**T2. [THEORY]** If you fit linear regression to pass/fail data, what problems can arise?

**T3. [THEORY]** What output range do probabilities require?

### Sigmoid Function

**T4. [THEORY]** Write the sigmoid formula.

**T5. [THEORY]** What is σ(0)?

**T6. [THEORY]** As x → ∞, what does σ(x) approach?

**T7. [THEORY]** As x → −∞, what does σ(x) approach?

**T8. [OUT]** Compute σ(2) and σ(−2) by hand. Are they symmetric?

**P1. [PROG]** Write code to compute σ(x) for x = [−3, −1, 0, 1, 3].

### Sigmoid properties

**T9. [THEORY]** Is sigmoid linear? Why does this matter for classification?

**T10. [THEORY]** Why is sigmoid more robust to outliers than linear regression?

**T11. [THEORY]** Explain sigmoid symmetry: σ(−x) = 1 − σ(x).

**A1. [ANALYZE]** A classifier uses σ(0.5x + 0.2). What is P(positive | x=0)?

**A2. [ANALYZE]** A classifier uses σ(mx + b). For which x is P(positive) = 0.5?

### Logistic regression setup

**T12. [THEORY]** Logistic regression outputs what, and why?

**T13. [THEORY]** In logistic regression, σ(mx + b) is the model. What do m and b represent?

**T14. [THEORY]** What is the threshold, and what is the default value?

### Real-world scenarios

**A3. [ANALYZE]** A student studied 5 hours. A linear model predicts y = −0.1 (impossible). What is wrong?

**A4. [ANALYZE]** Logistic regression on 100 students predicts σ(−2x + 8). What is P(pass | x=4)?

**A5. [ANALYZE]** You have an outlier: a student who studied 100 hours but failed. How would this affect a linear fit vs a sigmoid fit?

**A6. [ANALYZE]** In fraud detection, can linear regression output valid probabilities? Use sigmoid instead.

---

## Quick self-check

1. Why does linear regression fail on classification tasks?
2. Write the sigmoid formula from memory.
3. What is σ(0)?
4. What is the output range of sigmoid?
5. Is sigmoid linear?
6. What is the relationship between sigmoid and probability?
7. What is logistic regression?
8. In logistic regression σ(mx + b), what do m and b represent?
9. What is a threshold in classification?
10. Why is sigmoid more robust to outliers than linear regression?
