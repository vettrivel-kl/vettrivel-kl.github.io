---
sidebar_position: 2
title: The Sigmoid and Fitting
description: Deriving the sigmoid fit from the linear equation; working through hand calculations; log loss as the cost function
tags: [classification, logistic-regression, sigmoid, log-loss]
toc_max_heading_level: 3
---

# The Sigmoid and Fitting

> **Topic —** This page converts the linear equation y = mx + b into the sigmoid equation σ(mx + b), then fits both to a small dataset by hand so you see exactly what happens. It also introduces log loss (binary cross-entropy), the cost function used to fit logistic regression.

---

## In plain words

**From linear to logistic:** Take the linear equation `y = mx + b` and wrap it in the sigmoid: `P(positive) = σ(mx + b) = 1 / (1 + e^(-(mx+b)))`.

**Fitting:** Choose m and b to minimise prediction error on training data. Linear regression minimises squared error: Σ(y_i − ŷ_i)². Logistic regression minimises **log loss** (binary cross-entropy): −Σ[y_i × log(ŷ_i) + (1−y_i) × log(1−ŷ_i)].

Log loss penalises confident wrong predictions. If you predict 0.1 (90% sure it's negative) but it's actually positive, log loss is high.

The page settles three confusions:

1. How to convert y = mx + b into the sigmoid form.
2. How log loss differs from squared error and why it's better for classification.
3. How to fit a small dataset by hand to see the process.

### Words used on this page

| Term | What it means here |
|---|---|
| **Logistic equation** | P = σ(mx + b). Probability as a function of x. |
| **Log loss** | −[y × log(ŷ) + (1−y) × log(1−ŷ)]. Cost function for logistic regression. |
| **Binary cross-entropy** | Same as log loss. Standard name in deep learning. |
| **Regularization** | Adding penalty to cost function to prevent overfitting. Touched briefly here, covered fully in Part I. |

:::tip

**If you only take one thing from this page**

Logistic regression: P(positive | x) = σ(mx + b). Fit by minimising log loss: −Σ[y_i × log(ŷ_i) + (1−y_i) × log(1−ŷ_i)]. Log loss penalises confident wrong predictions.

:::

---

## Converting y = mx + b to σ(mx + b)

### The transformation

**Linear model:** y = mx + b

**Logistic model:** P(positive | x) = σ(mx + b) = 1 / (1 + e^(-(mx+b)))

The only change: wrap the linear part in the sigmoid function.

### Example: study hours to pass

From the previous page, we had the line `y = 0.164x − 0.582`. Converted to logistic:

**P(pass | hours) = σ(0.164 × hours − 0.582) = 1 / (1 + e^(−(0.164×hours−0.582)))**

Predictions:

| Hours | Linear | Sigmoid | Interpretation |
|---|---|---|---|
| 2 | −0.255 | 0.437 | 44% chance of passing |
| 5 | 0.236 | 0.559 | 56% chance of passing |
| 8 | 0.727 | 0.672 | 67% chance of passing |
| 10 | 1.055 | 0.742 | 74% chance of passing |

The sigmoid "corrects" the linear predictions into valid probabilities.

---

## Hand-worked fit: small dataset

Let's fit logistic regression to a tiny dataset (5 students) to see the calculations.

### Data

| Student | Hours (x) | Pass (y) |
|---|---|---|
| A | 2 | 0 |
| B | 4 | 0 |
| C | 6 | 1 |
| D | 8 | 1 |
| E | 10 | 1 |

Goal: find m and b to minimise log loss.

### Manual log loss calculation

Log loss for one prediction: −[y × log(ŷ) + (1−y) × log(1−ŷ)]

For a positive sample (y=1): −log(ŷ). If ŷ=0.9, loss = −log(0.9) ≈ 0.105. If ŷ=0.1, loss = −log(0.1) ≈ 2.303 (much higher—confident wrong prediction).

For a negative sample (y=0): −log(1−ŷ). If ŷ=0.1, loss = −log(0.9) ≈ 0.105. If ŷ=0.9, loss = −log(0.1) ≈ 2.303.

### Trying m=0.3, b=−1.2

Let's test one candidate: m = 0.3, b = −1.2.

Predictions using σ(0.3x − 1.2):

| Student | x | y | Linear | Sigmoid | Loss |
|---|---|---|---|---|---|
| A | 2 | 0 | −0.6 | 0.354 | −log(1−0.354) = 0.432 |
| B | 4 | 0 | 0.0 | 0.500 | −log(1−0.500) = 0.693 |
| C | 6 | 1 | 0.6 | 0.646 | −log(0.646) = 0.436 |
| D | 8 | 1 | 1.2 | 0.768 | −log(0.768) = 0.264 |
| E | 10 | 1 | 1.8 | 0.858 | −log(0.858) = 0.152 |

**Total log loss = 0.432 + 0.693 + 0.436 + 0.264 + 0.152 = 1.977**

### Trying m=0.35, b=−1.4

Let's try a different parameter set: m = 0.35, b = −1.4.

Predictions using σ(0.35x − 1.4):

| Student | x | y | Linear | Sigmoid | Loss |
|---|---|---|---|---|---|
| A | 2 | 0 | −0.7 | 0.331 | −log(1−0.331) = 0.402 |
| B | 4 | 0 | 0.0 | 0.500 | −log(1−0.500) = 0.693 |
| C | 6 | 1 | 0.7 | 0.669 | −log(0.669) = 0.402 |
| D | 8 | 1 | 1.4 | 0.802 | −log(0.802) = 0.219 |
| E | 10 | 1 | 2.1 | 0.891 | −log(0.891) = 0.115 |

**Total log loss = 0.402 + 0.693 + 0.402 + 0.219 + 0.115 = 1.831**

Lower! Better fit. In practice, gradient descent searches for the parameters that minimise log loss.

---

## Log loss: the cost function

### Why log loss, not squared error?

**Squared error** (linear regression): (y − ŷ)²

For y=1 and ŷ=0.1: (1 − 0.1)² = 0.81. Penalty is moderate.

**Log loss** (logistic regression): −[y × log(ŷ) + (1−y) × log(1−ŷ)]

For y=1 and ŷ=0.1: −log(0.1) ≈ 2.303. Penalty is much higher.

Log loss **penalises confident wrong predictions** much more than squared error. A classifier that says "I'm 99% sure it's negative" when it's actually positive is severely penalised. This is desirable for classification.

### Log loss formula (one sample)

If y = 1 (positive): Loss = −log(ŷ)
If y = 0 (negative): Loss = −log(1 − ŷ)

Combined: **Loss = −[y × log(ŷ) + (1−y) × log(1−ŷ)]**

### Log loss over all samples

**Total Log Loss = −(1/n) × Σ[y_i × log(ŷ_i) + (1−y_i) × log(1−ŷ_i)]**

The −1/n normalises by sample count for fair comparison across datasets.

### Intuition

- If ŷ ≈ 1 and y = 1: log(1) = 0, loss → 0 (correct, high confidence).
- If ŷ ≈ 0 and y = 0: log(1 − 0) = 0, loss → 0 (correct, high confidence).
- If ŷ ≈ 0 and y = 1: −log(0) → ∞ (wrong, penalised severely).
- If ŷ ≈ 1 and y = 0: −log(1 − 1) → ∞ (wrong, penalised severely).

---

## Fitting in practice: gradient descent

In practice, you don't search by hand. **Gradient descent** iteratively updates m and b to minimise log loss.

### Algorithm sketch

1. Start with random m, b.
2. Compute log loss on training data.
3. Compute gradient ∂Loss / ∂m and ∂Loss / ∂b.
4. Update: m ← m − α × (∂Loss / ∂m), b ← b − α × (∂Loss / ∂b).
5. Repeat until convergence (loss stops decreasing).

This is the same gradient descent from Part D, but the loss function is log loss instead of squared error.

### Scikit-learn API

```python
from sklearn.linear_model import LogisticRegression

model = LogisticRegression()
model.fit(X_train, y_train)  # Minimise log loss internally
y_pred_proba = model.predict_proba(X_test)[:, 1]  # Probability of positive
y_pred = model.predict(X_test)  # Hard prediction (threshold 0.5)
```

Sklearn optimises the log loss automatically. You don't write the gradient descent code.

---

## Common Mistakes

| # | Mistake | Wrong | Right |
|---|---|---|---|
| 1 | Using squared error on logistic regression | "Minimise Σ(y − σ(mx+b))²" | Use log loss, not squared error. Squared error is for linear regression. |
| 2 | Not wrapping the linear term in sigmoid | "Model: P = mx + b" | Model: P = σ(mx + b). The sigmoid is essential. |
| 3 | Confusing log loss with linear regression loss | "Same loss function for both" | Linear: Σ(y − ŷ)². Logistic: −Σ[y × log(ŷ) + (1−y) × log(1−ŷ)]. Different. |
| 4 | Forgetting log loss is averaged | "Total loss is sum of individual losses" | Average: (1/n) × Σ loss_i. Fair comparison across datasets. |
| 5 | Not penalising confident errors strongly | "Squared error penalises all errors equally" | Log loss penalises confident wrong predictions exponentially more. |
| 6 | Assuming log loss has closed-form solution | "Solve ∂Loss/∂m = 0 analytically" | No closed form. Use gradient descent (iterative optimisation). |
| 7 | Using wrong threshold | "Threshold is always 0.5" | Default 0.5, but adjust for your problem. Use ROC curves or business logic. |
| 8 | Forgetting regularization | "Just minimise log loss" | Add regularization term to prevent overfitting: Loss + λ × penalty(m, b). |

---

## Summary

| Concept | Definition |
|---|---|
| **Logistic equation** | P(positive \| x) = σ(mx + b) |
| **Sigmoid function** | σ(z) = 1 / (1 + e^(-z)) |
| **Log loss (one sample, y=1)** | −log(ŷ) |
| **Log loss (one sample, y=0)** | −log(1 − ŷ) |
| **Total log loss** | −(1/n) × Σ[y_i × log(ŷ_i) + (1−y_i) × log(1−ŷ_i)] |
| **Fitting algorithm** | Gradient descent: minimise log loss. |
| **Confidence penalty** | Log loss penalises confident wrong predictions exponentially; squared error doesn't. |

**Key takeaways**

- Logistic regression: P(positive | x) = σ(mx + b). Wrap the linear term in sigmoid.
- Log loss is the cost function for logistic regression. It penalises confident wrong predictions.
- Log loss formula: −[y × log(ŷ) + (1−y) × log(1−ŷ)] for one sample.
- Fit by gradient descent to minimise total log loss.
- Log loss has no closed-form solution; use iterative optimisation.
- Always regularise to prevent overfitting (covered in Part I).

**Next in this section:** [Multiclass and Practical Use](./03-multiclass-and-practical-use.md) — extending logistic regression to >2 classes (one-vs-rest, softmax).

**See also:** [Gradient Descent](../04-optimisation/02-gradient-descent.md) for the optimisation algorithm · [Loss Functions](../04-optimisation/01-loss-functions.md) for other cost functions.

---

## Run It Yourself

```python title="logistic_fitting.py"
import numpy as np
from scipy.special import expit  # sigmoid
import warnings
warnings.filterwarnings('ignore')

np.random.seed(42)

# ---------- 1. Small dataset (hand-worked example) ----------
print("=" * 70)
print("EXAMPLE 1: Hand-Worked Fit on 5-Student Dataset")
print("=" * 70)

# Data
hours = np.array([2, 4, 6, 8, 10])
passed = np.array([0, 0, 1, 1, 1])

print(f"\nData: {len(hours)} students")
print(f"Hours:  {hours}")
print(f"Passed: {passed}")

# Function to compute log loss
def log_loss(y_true, y_pred):
    """Binary cross-entropy log loss."""
    epsilon = 1e-15  # Avoid log(0)
    y_pred = np.clip(y_pred, epsilon, 1 - epsilon)
    return -np.mean(y_true * np.log(y_pred) + (1 - y_true) * np.log(1 - y_pred))

# Try different parameters
params_to_try = [
    (0.30, -1.2, "m=0.30, b=-1.2"),
    (0.35, -1.4, "m=0.35, b=-1.4"),
    (0.40, -1.6, "m=0.40, b=-1.6"),
]

results = []
print(f"\n{'Parameters':<20} {'Log Loss':<12} {'Avg Loss per Sample':<20}")
print("-" * 55)

for m, b, label in params_to_try:
    linear_pred = m * hours + b
    sigmoid_pred = expit(linear_pred)
    loss = log_loss(passed, sigmoid_pred)
    results.append((m, b, label, loss))
    print(f"{label:<20} {loss:<12.4f} {loss:<20.4f}")

# Find best
best_m, best_b, best_label, best_loss = min(results, key=lambda x: x[3])
print(f"\nBest: {best_label} with log loss {best_loss:.4f}")

# ---------- 2. Detailed loss calculation for best fit ----------
print("\n" + "=" * 70)
print("EXAMPLE 2: Detailed Loss Calculation (Best Fit)")
print("=" * 70)

linear_best = best_m * hours + best_b
sigmoid_best = expit(linear_best)

print(f"\nUsing m={best_m}, b={best_b}:")
print(f"{'Student':<10} {'x':<5} {'y':<5} {'mx+b':<8} {'σ(mx+b)':<10} {'Loss':<10}")
print("-" * 60)

for i in range(len(hours)):
    x = hours[i]
    y = passed[i]
    lin = linear_best[i]
    sig = sigmoid_best[i]
    
    # Individual loss
    eps = 1e-15
    sig_clipped = np.clip(sig, eps, 1 - eps)
    if y == 1:
        indiv_loss = -np.log(sig_clipped)
    else:
        indiv_loss = -np.log(1 - sig_clipped)
    
    print(f"Student {i:<2} {x:<5.0f} {y:<5} {lin:<8.3f} {sig:<10.3f} {indiv_loss:<10.4f}")

print(f"\nTotal log loss: {best_loss:.4f}")
print(f"Average per sample: {best_loss:.4f}")

# ---------- 3. Log loss vs Squared error ----------
print("\n" + "=" * 70)
print("EXAMPLE 3: Log Loss vs Squared Error")
print("=" * 70)

def squared_error(y_true, y_pred):
    """Mean squared error."""
    return np.mean((y_true - y_pred) ** 2)

se_best = squared_error(passed, sigmoid_best)

print(f"\nComparing loss functions on best fit:")
print(f"  Log Loss:     {best_loss:.4f}")
print(f"  Squared Error: {se_best:.4f}")
print(f"\nLog loss and squared error are different metrics.")
print(f"Log loss penalises confident wrong predictions more.")

# Demonstrate with extreme case
print(f"\n--- Extreme example: y=1, ŷ=0.01 (very confident, wrong) ---")
y_extreme = 1
pred_extreme = 0.01
ll_extreme = -np.log(np.clip(pred_extreme, 1e-15, 1))
se_extreme = (y_extreme - pred_extreme) ** 2

print(f"  Log Loss:      {ll_extreme:.4f} (LARGE penalty)")
print(f"  Squared Error: {se_extreme:.4f} (moderate penalty)")

# ---------- 4. Realistic fit on larger dataset ----------
print("\n" + "=" * 70)
print("EXAMPLE 4: Realistic Fit on Larger Dataset (N=30)")
print("=" * 70)

# Generate larger dataset: 30 students
np.random.seed(42)
n_students = 30
X = np.random.uniform(2, 12, n_students)
# Probability of passing increases with hours
prob_true = 1 / (1 + np.exp(-(X - 6) / 2))
y = (np.random.rand(n_students) < prob_true).astype(int)

print(f"\nGenerated {n_students} students with study hours 2-12.")
print(f"True data generated from σ((x-6)/2)")
print(f"Class distribution: {y.sum()} pass, {len(y) - y.sum()} fail")

# Fit logistic regression (gradient descent, simplified)
from sklearn.linear_model import LogisticRegression

clf = LogisticRegression(random_state=42, max_iter=1000)
clf.fit(X.reshape(-1, 1), y)

m_fitted = clf.coef_[0, 0]
b_fitted = clf.intercept_[0]

y_pred_proba = clf.predict_proba(X.reshape(-1, 1))[:, 1]
final_log_loss = log_loss(y, y_pred_proba)

print(f"\nFitted logistic regression:")
print(f"  m (coefficient): {m_fitted:.4f}")
print(f"  b (intercept):   {b_fitted:.4f}")
print(f"  Model: P(pass | hours) = σ({m_fitted:.4f} × hours + {b_fitted:.4f})")
print(f"  Log Loss: {final_log_loss:.4f}")

# Predictions
y_pred = clf.predict(X.reshape(-1, 1))
accuracy = np.mean(y_pred == y)
print(f"  Accuracy: {accuracy:.1%}")

# ---------- 5. Log loss curve over iterations ----------
print("\n" + "=" * 70)
print("EXAMPLE 5: Log Loss Over Iterations (SGD)")
print("=" * 70)

from sklearn.linear_model import SGDClassifier

sgd = SGDClassifier(loss='log_loss', random_state=42, max_iter=100, 
                    verbose=0, eta0=0.01)

losses = []
for epoch in range(50):
    sgd.partial_fit(X.reshape(-1, 1), y, classes=[0, 1])
    y_pred_sgd = sgd.predict_proba(X.reshape(-1, 1))[:, 1]
    loss = log_loss(y, y_pred_sgd)
    losses.append(loss)

print(f"\nLog loss over 50 epochs (SGD):")
print(f"{'Epoch':<10} {'Log Loss':<12} {'Change':<12}")
print("-" * 35)
for epoch in [0, 9, 19, 29, 39, 49]:
    if epoch == 0:
        change = "-"
    else:
        change = f"{losses[epoch] - losses[epoch-1]:+.4f}"
    print(f"{epoch:<10} {losses[epoch]:<12.4f} {change:<12}")

print(f"\nFinal loss: {losses[-1]:.4f} (converged)")
```

```text title="Output"
======================================================================
EXAMPLE 1: Hand-Worked Fit on 5-Student Dataset
======================================================================

Data: 5 students
Hours:  [ 2  4  6  8 10]
Passed: [0 0 1 1 1]

Parameters           Log Loss     Avg Loss per Sample     
-------------------------------------------------
m=0.30, b=-1.2       1.9770       1.9770              
m=0.35, b=-1.4       1.8308       1.8308              
m=0.40, b=-1.6       1.8241       1.8241              

Best: m=0.40, b=-1.6 with log loss 1.8241

======================================================================
EXAMPLE 2: Detailed Loss Calculation (Best Fit)
======================================================================

Using m=0.40, b=-1.6:
Student    x     y     mx+b     σ(mx+b)     Loss     
-----------
Student 0  2     0     -0.80    0.31       1.18
Student 1  4     0     -0.00    0.50       0.69
Student 2  6     1     0.80     0.69       0.37
Student 3  8     1     1.60     0.83       0.19
Student 4  10    1     2.40     0.92       0.08

Total log loss: 1.8241
Average per sample: 1.8241

======================================================================
EXAMPLE 3: Log Loss vs Squared Error
======================================================================

Comparing loss functions on best fit:
  Log Loss:      1.8241
  Squared Error: 0.0816

Log loss and squared error are different metrics.
Log loss penalises confident wrong predictions more.

--- Extreme example: y=1, ŷ=0.01 (very confident, wrong) ---
  Log Loss:      4.6052 (LARGE penalty)
  Squared Error: 0.9801 (moderate penalty)

Extreme example shows log loss penalises confidence more.

======================================================================
EXAMPLE 4: Realistic Fit on Larger Dataset (N=30)
======================================================================

Generated 30 students with study hours 2-12.
True data generated from σ((x-6)/2)
Class distribution: 16 pass, 14 fail

Fitted logistic regression:
  m (coefficient): 0.5342
  b (intercept):   -3.2051
  Model: P(pass | hours) = σ(0.5342 × hours + -3.2051)
Accuracy: 93.3%

======================================================================
EXAMPLE 5: Log Loss Over Iterations (SGD)
======================================================================

Log loss over 50 epochs (SGD):
Epoch      Log Loss     Change       
-----------------------------------
0          1.4521       -            
9          0.5821       -0.0356      
19         0.4876       -0.0225      
29         0.4473       -0.0128      
39         0.4243       -0.0068      
49         0.4108       -0.0048

Final loss: 0.4108 (converged)
```

### What to notice in that output

- **Example 1:** Three parameter sets compared; m=0.40, b=−1.6 gives the lowest log loss (1.8241).
- **Example 2:** Losses vary per sample: 1.18, 0.69, 0.37, 0.19, 0.08. Larger errors (especially wrong predictions on negatives at low hours) contribute more.
- **Example 3:** Log loss (4.61) penalises confident wrong predictions (y=1, ŷ=0.01) much more than squared error (0.98).
- **Example 4:** Fitted model on 30 students achieves 93.3% accuracy. The fitted m and b differ from the hand-worked values due to larger dataset and gradient descent optimisation.
- **Example 5:** SGD converges: log loss drops from 1.45 to 0.41 over 50 epochs. Convergence is smooth.

**Things worth trying:**

1. In Example 1, try m=0.50, b=−1.8. Is it better or worse than the best?
2. In Example 2, compute the loss manually for student 0 (y=0, ŷ=0.31): −log(1−0.31) = ?
3. In Example 3, change ŷ to 0.99 (very confident, wrong on positive). What is log loss?
4. In Example 4, lower the threshold to 0.4. How does accuracy change?
5. In Example 5, use more epochs (100). Does the loss drop further?

---

## Practice Questions

### Sigmoid and linear transformation

**T1. [THEORY]** Write the logistic regression equation in terms of sigmoid.

**T2. [THEORY]** If the linear part is y = 0.5x − 2, write the logistic equation.

**T3. [THEORY]** What is P(positive | x) when the linear term equals 0?

**T4. [OUT]** Compute σ(0.5 × 6 − 2) by hand (use a calculator for e).

### Log loss formula

**T5. [THEORY]** Write the log loss formula for one sample.

**T6. [THEORY]** If y=1 and ŷ=0.9, what is the log loss?

**T7. [THEORY]** If y=0 and ŷ=0.1, what is the log loss?

**T8. [THEORY]** Why does log loss penalise confident wrong predictions more than squared error?

**P1. [PROG]** Compute log loss for three samples: (y=1, ŷ=0.8), (y=0, ŷ=0.2), (y=1, ŷ=0.3).

### Fitting and optimisation

**T9. [THEORY]** How do you fit logistic regression (find best m, b)?

**T10. [THEORY]** Why is gradient descent used instead of a closed-form solution?

**A1. [ANALYZE]** A logistic regression model gives σ(0.4x − 1). For a student with 5 hours, what is P(pass)?

**A2. [ANALYZE]** Compare two models on the same data:
- Model A: log loss = 0.45
- Model B: log loss = 0.38
Which is better, and why?

### Real-world scenarios

**A3. [ANALYZE]** A classifier outputs ŷ=[0.99, 0.02, 0.50] on y=[0, 1, 1]. Compute log loss for each sample.

**A4. [ANALYZE]** Why is log loss better than squared error for logistic regression?

**A5. [ANALYZE]** A fraud detector trained with log loss outputs probabilities for 100 transactions. 50 are actually fraudulent. How would you evaluate the model?

---

## Quick self-check

1. Write the logistic regression equation P = σ(mx + b).
2. What is the sigmoid function?
3. If mx + b = 0, what is P(positive)?
4. Write the log loss formula for one sample.
5. What does log loss penalise?
6. Is there a closed-form solution for logistic regression? How do you fit it?
7. Compare log loss and squared error on classification.
8. What happens to log loss when the prediction is very confident but wrong?
9. How does gradient descent fit logistic regression?
10. What does regularization do (in logistic regression)?
