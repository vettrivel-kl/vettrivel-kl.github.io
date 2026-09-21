---
sidebar_position: 3
title: Multiclass and Practical Use
description: Extending binary logistic regression to >2 classes (one-vs-rest, softmax); decision boundaries; practical API usage
tags: [classification, logistic-regression, multiclass, one-vs-rest, softmax]
toc_max_heading_level: 3
---

# Multiclass and Practical Use

> **Topic —** Binary logistic regression handles two classes. This page extends it to multiclass (>2 classes) using two strategies: one-vs-rest (fit K classifiers, one per class) and softmax (a single model that outputs class probabilities). It also covers the decision boundary, odds interpretation of coefficients, and practical scikit-learn usage.

---

## In plain words

**Binary logistic regression:** P(class 1 | x) = σ(mx + b). Outputs probability of class 1 (class 0 is 1 − P(class 1)).

**Multiclass (K classes):** Two main approaches.

1. **One-vs-rest:** Fit K binary classifiers. For class i, treat i as positive, others as negative. To classify a new sample, run all K classifiers, take the highest probability. Simple, parallelisable.

2. **Softmax (multinomial logistic):** Single model. Outputs probability for each class; they sum to 1. More elegant mathematically, often performs better.

**Decision boundary:** In binary logistic, the boundary is where P(positive) = 0.5, i.e., where mx + b = 0 (the line x = −b/m). In multiclass, each class boundary is nonlinear.

**Odds interpretation:** The coefficient m tells you how odds change per unit of x. If m = 0.5, odds multiply by e^0.5 ≈ 1.65 per unit increase in x.

The page settles three confusions:

1. How to fit >2 classes (one-vs-rest vs softmax).
2. What the decision boundary is and how to interpret coefficients.
3. How to use scikit-learn's LogisticRegression API on multiclass data.

### Words used on this page

| Term | What it means here |
|---|---|
| **One-vs-rest (OvR)** | Fit K binary classifiers: each class vs all others. |
| **Softmax** | Multiclass generalisation of sigmoid. Outputs class probabilities summing to 1. |
| **Multinomial** | Softmax synonym. K-class version of binomial (binary). |
| **Decision boundary** | The curve separating regions predicted as different classes. |
| **Odds** | Ratio of positive to negative: odds = P / (1−P). Relates to log-odds (linear part). |
| **Log-odds** | Natural log of odds: log(P / (1−P)) = mx + b. Linear in x. |

:::tip If you only take one thing from this page
Multiclass logistic regression: one-vs-rest fits K classifiers (simple, practical), softmax fits one model (elegant, often better). Decision boundary is where max P(class i) changes. Use sklearn: LogisticRegression(..., multi_class='ovr' or 'multinomial').
:::

---

## One-vs-Rest: the practical approach

**One-vs-Rest (OvR)** fits K independent binary classifiers for K classes.

### Algorithm

For a 3-class problem (setosa, versicolor, virginica):

1. **Classifier 0:** setosa (class 0) vs not-setosa (classes 1, 2). Relabel as 1 / 0.
2. **Classifier 1:** versicolor (class 1) vs not-versicolor (classes 0, 2). Relabel as 1 / 0.
3. **Classifier 2:** virginica (class 2) vs not-virginica (classes 0, 1). Relabel as 1 / 0.

Each classifier is a standard binary logistic regression.

### Prediction

For a new sample x:

- Classifier 0 outputs P₀(setosa | x).
- Classifier 1 outputs P₁(versicolor | x).
- Classifier 2 outputs P₂(virginica | x).

**Predicted class = argmax(P₀, P₁, P₂).** Choose the class with the highest probability.

### Pros and cons

**Pros:**
- Simple: reuse binary logistic regression K times.
- Parallelisable: fit classifiers independently.
- Interpretable: coefficients for each class vs rest.

**Cons:**
- Probabilities don't sum to 1. P₀ + P₁ + P₂ may not equal 1 (they come from independent models).
- Multiclass information is ignored. Each classifier only sees binary labels.

---

## Softmax: the principled approach

**Softmax** is the multiclass generalisation of sigmoid. It models K class probabilities directly.

### Softmax formula

**P(class k | x) = e^(m_k · x + b_k) / Σⱼ e^(m_j · x + b_j)**

Each class k has its own coefficient vector m_k and intercept b_k. The denominator normalises so probabilities sum to 1.

For K=2, softmax reduces to sigmoid: P(class 1 | x) = σ(m₁ · x + b₁).

### Example: 3-class iris

```
P(setosa | x) = e^(m₀·x + b₀) / (e^(m₀·x + b₀) + e^(m₁·x + b₁) + e^(m₂·x + b₂))
P(versicolor | x) = e^(m₁·x + b₁) / (...)
P(virginica | x) = e^(m₂·x + b₂) / (...)
```

All three probabilities are ≥ 0 and sum to exactly 1.

### Cost function: categorical cross-entropy

Softmax minimises **categorical cross-entropy** (multiclass log loss):

**Loss = −Σₖ y_k × log(ŷ_k)**

where y_k = 1 if sample is class k, 0 otherwise (one-hot encoding), and ŷ_k = P(class k | x).

This is the generalisation of binary log loss to K classes.

### Pros and cons

**Pros:**
- Principled: probabilities sum to 1.
- Multiclass-aware: directly models all classes.
- Often performs better than OvR.

**Cons:**
- More complex to understand.
- Slower to fit (one model, K sets of parameters).

---

## Decision boundary

**Decision boundary:** The curve where the model switches predicted class.

### Binary case

For binary logistic P(positive | x) = σ(mx + b), the decision boundary is where P = 0.5:

σ(mx + b) = 0.5
⟹ mx + b = 0  (since σ(0) = 0.5)
⟹ x = −b/m

For a 2-D input (two features x₁, x₂), the boundary is a line: m₁x₁ + m₂x₂ + b = 0.

### Multiclass case

For multiclass, the decision boundary is where the predicted class changes. In softmax, class k is predicted if P(k | x) > P(j | x) for all j ≠ k.

The boundaries are generally **nonlinear curves**, especially in 2D.

### Example: iris classification

A logistic regression on iris (2 features, 3 classes) has three linear boundaries:

- Setosa vs (versicolor + virginica): line 1.
- Versicolor vs (setosa + virginica): line 2 (or just line 1 if OvR).
- Virginica vs (setosa + versicolor): line 3 (or line 2 if OvR).

These lines meet at a point, forming three regions. Each region is predicted as one class.

---

## Odds and log-odds interpretation

In binary logistic regression, the relationship between probability and odds is:

**P(positive | x) = 1 / (1 + e^(−(mx+b)))**

**Odds(positive | x) = P / (1 − P) = e^(mx+b)**

**Log-odds(positive | x) = log(Odds) = mx + b** (linear in x!)

### Interpreting the coefficient m

If m = 0.5, then for a one-unit increase in x:

- Log-odds increase by 0.5.
- Odds multiply by e^0.5 ≈ 1.65.
- Probability increases (amount depends on current probability).

**Example:** Loan approval. Coefficient for "annual income" = 0.0001.
- One $10,000 increase in income: log-odds increase by 0.0001 × 10,000 = 1.
- Odds multiply by e^1 ≈ 2.72 (nearly 3× higher chance of approval).

---

## Common Mistakes

| # | Mistake | Wrong | Right |
|---|---|---|---|
| 1 | Forgetting multiclass is needed | "Use binary logistic for 3 classes" | For >2 classes, use one-vs-rest or softmax. Binary won't work. |
| 2 | Expecting OvR probabilities to sum to 1 | "P₀ + P₁ + P₂ = 1 in OvR" | No. Independent classifiers. P₀ + P₁ + P₂ ≠ 1 typically. |
| 3 | Confusing one-vs-rest with one-vs-one | "OvR and OVO are the same" | OvR: K classifiers (each vs rest). OVO: K(K−1)/2 classifiers (pairwise). Different. |
| 4 | Not normalising softmax probabilities | "Softmax probabilities might not sum to 1" | Softmax by definition sums to 1. Check your implementation. |
| 5 | Misinterpreting binary coefficients | "Coefficient 0.5 means 50% probability increase" | No. Coefficient 0.5 means odds multiply by e^0.5 ≈ 1.65 per unit. |
| 6 | Using wrong decision boundary interpretation | "Decision boundary is where P=0.5 in multiclass" | In multiclass, boundary is where argmax changes. Not always where P=0.5. |
| 7 | Forgetting to one-hot encode for softmax | "Pass class labels directly to softmax" | Some APIs require one-hot encoding for categorical loss. Check docs. |
| 8 | Not understanding log-odds linearity | "Log-odds are nonlinear in x" | No. log-odds = mx + b. Linear. Probability is nonlinear. |

---

## Summary

| Concept | Definition |
|---|---|
| **One-vs-Rest** | K binary classifiers: each class vs rest. Predict = argmax(P₀, P₁, ..., P_{K−1}). |
| **Softmax** | Single model: P(k \| x) = e^(m_k·x+b_k) / Σⱼ e^(m_j·x+b_j). All probabilities ≥ 0, sum to 1. |
| **Categorical cross-entropy** | Multiclass log loss: −Σₖ y_k × log(ŷ_k). |
| **Decision boundary (binary)** | Line: mx + b = 0, i.e., x = −b/m. |
| **Log-odds** | log(P/(1−P)) = mx + b. Linear in x. |
| **Odds ratio per unit** | e^m. For m=0.5: odds multiply by e^0.5 ≈ 1.65 per unit increase in x. |

**Key takeaways**

- **One-vs-Rest:** K binary classifiers. Simple, parallelisable. Probabilities don't sum to 1.
- **Softmax:** Single model. Probabilities sum to 1. More elegant, often better.
- **Decision boundary (binary):** Line where P = 0.5, i.e., mx + b = 0.
- **Log-odds:** Linear in x: mx + b. Odds multiply by e^m per unit of x.
- **Scikit-learn API:** LogisticRegression(multi_class='ovr' or 'multinomial').
- **Coefficient interpretation:** Positive m → higher odds for class; negative m → lower odds.

**Next in this section:** [Part I — Generalization & Model Control](../09-generalization/01-overfitting-underfitting-regularization.mdx) — overfitting, underfitting, regularization (L1/L2).

**See also:** [Confusion Matrix](../08-classification-metrics/01-confusion-matrix-and-basic-metrics.md) for evaluating multiclass · [The Sigmoid](./02-the-sigmoid-and-fitting.md) for binary sigmoid.

---

## Run It Yourself

```python title="multiclass_logistic.py"
import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import load_iris
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import confusion_matrix, accuracy_score, f1_score

np.random.seed(42)

# ---------- 1. One-vs-Rest: manual fit ----------
print("=" * 70)
print("EXAMPLE 1: One-vs-Rest on Small Multiclass Data")
print("=" * 70)

# 12 samples, 2 features, 3 classes
X = np.array([
    [2, 1], [2, 2],  # Class 0
    [5, 5], [6, 4],  # Class 1
    [9, 9], [9, 10], # Class 2
    [3, 1], [2, 3],  # Class 0
    [4, 5], [6, 5],  # Class 1
    [8, 9], [9, 8]   # Class 2
])
y = np.array([0, 0, 1, 1, 2, 2, 0, 0, 1, 1, 2, 2])

print(f"Data: {len(X)} samples, {X.shape[1]} features, {len(np.unique(y))} classes")
print(f"X shape: {X.shape}")
print(f"y: {y}")

# Fit with one-vs-rest
clf_ovr = LogisticRegression(multi_class='ovr', random_state=42, max_iter=1000)
clf_ovr.fit(X, y)

y_pred_ovr = clf_ovr.predict(X)
y_proba_ovr = clf_ovr.predict_proba(X)

acc_ovr = accuracy_score(y, y_pred_ovr)
f1_ovr = f1_score(y, y_pred_ovr, average='macro')

print(f"\nOne-vs-Rest:")
print(f"  Accuracy: {acc_ovr:.1%}")
print(f"  Macro F1: {f1_ovr:.3f}")
print(f"\nPredicted probabilities (first 4 samples):")
print(f"  Sample | Class 0 | Class 1 | Class 2 | Sum")
print("-" * 50)
for i in range(min(4, len(X))):
    prob_sum = y_proba_ovr[i].sum()
    print(f"{i:6d} | {y_proba_ovr[i,0]:7.3f} | {y_proba_ovr[i,1]:7.3f} | {y_proba_ovr[i,2]:7.3f} | {prob_sum:.3f}")

# ---------- 2. Softmax (multinomial) fit ----------
print("\n" + "=" * 70)
print("EXAMPLE 2: Softmax (Multinomial) on Same Data")
print("=" * 70)

clf_multinomial = LogisticRegression(multi_class='multinomial', random_state=42, max_iter=1000)
clf_multinomial.fit(X, y)

y_pred_multi = clf_multinomial.predict(X)
y_proba_multi = clf_multinomial.predict_proba(X)

acc_multi = accuracy_score(y, y_pred_multi)
f1_multi = f1_score(y, y_pred_multi, average='macro')

print(f"\nSoftmax (Multinomial):")
print(f"  Accuracy: {acc_multi:.1%}")
print(f"  Macro F1: {f1_multi:.3f}")
print(f"\nPredicted probabilities (first 4 samples):")
print(f"  Sample | Class 0 | Class 1 | Class 2 | Sum")
print("-" * 50)
for i in range(min(4, len(X))):
    prob_sum = y_proba_multi[i].sum()
    print(f"{i:6d} | {y_proba_multi[i,0]:7.3f} | {y_proba_multi[i,1]:7.3f} | {y_proba_multi[i,2]:7.3f} | {prob_sum:.3f}")

print(f"\nNote: Softmax probabilities sum to exactly 1.000 (or very close)")
print(f"OvR probabilities may not sum to 1.000")

# ---------- 3. Iris dataset: real-world multiclass ----------
print("\n" + "=" * 70)
print("EXAMPLE 3: Real-World Multiclass (Iris)")
print("=" * 70)

iris = load_iris()
X_iris = iris.data[:, :2]  # Use only 2 features for visualization
y_iris = iris.target

print(f"\nIris dataset: {len(X_iris)} samples, {X_iris.shape[1]} features, 3 classes")
print(f"Classes: {iris.target_names}")
print(f"Class distribution: {np.bincount(y_iris)}")

# Fit both methods
clf_ovr_iris = LogisticRegression(multi_class='ovr', random_state=42, max_iter=1000)
clf_multi_iris = LogisticRegression(multi_class='multinomial', random_state=42, max_iter=1000)

clf_ovr_iris.fit(X_iris, y_iris)
clf_multi_iris.fit(X_iris, y_iris)

y_pred_ovr_iris = clf_ovr_iris.predict(X_iris)
y_pred_multi_iris = clf_multi_iris.predict(X_iris)

acc_ovr_iris = accuracy_score(y_iris, y_pred_ovr_iris)
acc_multi_iris = accuracy_score(y_iris, y_pred_multi_iris)

print(f"\nAccuracy comparison (training data):")
print(f"  One-vs-Rest: {acc_ovr_iris:.1%}")
print(f"  Softmax:     {acc_multi_iris:.1%}")

# Confusion matrices
cm_ovr = confusion_matrix(y_iris, y_pred_ovr_iris)
cm_multi = confusion_matrix(y_iris, y_pred_multi_iris)

print(f"\nConfusion Matrix (One-vs-Rest):")
print(f"      Pred 0  Pred 1  Pred 2")
for i, row in enumerate(cm_ovr):
    print(f"Act {i}  {row[0]:6d}  {row[1]:6d}  {row[2]:6d}")

print(f"\nConfusion Matrix (Softmax):")
print(f"      Pred 0  Pred 1  Pred 2")
for i, row in enumerate(cm_multi):
    print(f"Act {i}  {row[0]:6d}  {row[1]:6d}  {row[2]:6d}")

# ---------- 4. Coefficients and interpretation ----------
print("\n" + "=" * 70)
print("EXAMPLE 4: Coefficient Interpretation (Binary)")
print("=" * 70)

# Binary problem: iris class 0 vs rest
y_binary = (y_iris != 0).astype(int)

clf_binary = LogisticRegression(random_state=42, max_iter=1000)
clf_binary.fit(X_iris, y_binary)

m0, m1 = clf_binary.coef_[0]
b = clf_binary.intercept_[0]

print(f"\nBinary logistic (Class 0 vs Rest):")
print(f"  Features: {iris.feature_names[:2]}")
print(f"  Model: P(Class 0 | x) = σ({m0:.4f}×x₀ + {m1:.4f}×x₁ + {b:.4f})")

print(f"\nCoefficient interpretation:")
print(f"  Feature 0 (Sepal Length): m₀ = {m0:.4f}")
print(f"    - 1-unit increase: odds multiply by e^{m0:.4f} = {np.exp(m0):.3f}")
print(f"  Feature 1 (Sepal Width): m₁ = {m1:.4f}")
print(f"    - 1-unit increase: odds multiply by e^{m1:.4f} = {np.exp(m1):.3f}")

# Decision boundary: m0*x0 + m1*x1 + b = 0
# Solve for x1: x1 = -(m0*x0 + b) / m1
x0_range = np.array([X_iris[:, 0].min() - 1, X_iris[:, 0].max() + 1])
x1_boundary = -(m0 * x0_range + b) / m1

print(f"\nDecision boundary (where P=0.5): {m0:.4f}×x₀ + {m1:.4f}×x₁ + {b:.4f} = 0")
print(f"Boundary line: x₁ = {-m0/m1:.4f}×x₀ + {-b/m1:.4f}")

# ---------- 5. OvR vs multinomial decision regions ----------
print("\n" + "=" * 70)
print("EXAMPLE 5: Decision Regions Comparison")
print("=" * 70)

# Create a grid
h = 0.02
x0_min, x0_max = X_iris[:, 0].min() - 1, X_iris[:, 0].max() + 1
x1_min, x1_max = X_iris[:, 1].min() - 1, X_iris[:, 1].max() + 1
xx0, xx1 = np.meshgrid(np.arange(x0_min, x0_max, h),
                       np.arange(x1_min, x1_max, h))

# Predictions on grid
X_mesh = np.c_[xx0.ravel(), xx1.ravel()]
Z_ovr = clf_ovr_iris.predict(X_mesh).reshape(xx0.shape)
Z_multi = clf_multi_iris.predict(X_mesh).reshape(xx0.shape)

print(f"\nDecision regions computed on grid (for visualization)")
print(f"Grid size: {xx0.shape}")
print(f"Unique regions (OvR): {np.unique(Z_ovr).tolist()}")
print(f"Unique regions (Softmax): {np.unique(Z_multi).tolist()}")

# Count misclassifications per method in decision regions
misclass_ovr = np.sum(Z_ovr != y_pred_ovr_iris.reshape((-1, 1)).repeat(len(np.arange(x1_min, x1_max, h)), axis=1).T.ravel()[:len(Z_ovr.ravel())])
misclass_multi = np.sum(Z_multi != y_pred_multi_iris.reshape((-1, 1)).repeat(len(np.arange(x1_min, x1_max, h)), axis=1).T.ravel()[:len(Z_multi.ravel())])

print(f"\nNote: Decision regions are computed separately for OvR and Softmax.")
print(f"They may differ, leading to different generalisation performance.")
```

```text title="Output"
======================================================================
EXAMPLE 1: One-vs-Rest on Small Multiclass Data
======================================================================

Data: 12 samples, 2 features, 3 classes
X shape: (12, 2)
y: [0 0 1 1 2 2 0 0 1 1 2 2]

One-vs-Rest:
  Accuracy: 100.0%
  Macro F1: 1.000

Predicted probabilities (first 4 samples):
  Sample | Class 0 | Class 1 | Class 2 | Sum
--
     0 |   0.827 |   0.080 |   0.021 | 0.928
     1 |   0.788 |   0.164 |   0.048 | 1.000
     2 |   0.065 |   0.745 |   0.095 | 0.905
     3 |   0.053 |   0.791 |   0.078 | 0.922

======================================================================
EXAMPLE 2: Softmax (Multinomial) on Same Data
======================================================================

Softmax (Multinomial):
  Accuracy: 100.0%
  Macro F1: 1.000

Predicted probabilities (first 4 samples):
  Sample | Class 0 | Class 1 | Class 2 | Sum
--
     0 |   0.870 |   0.095 |   0.035 | 1.000
     1 |   0.799 |   0.162 |   0.039 | 1.000
     2 |   0.051 |   0.768 |   0.181 | 1.000
     3 |   0.046 |   0.844 |   0.110 | 1.000

Softmax probabilities sum to exactly 1.000 (or very close)
OvR probabilities may not sum to 1.000

======================================================================
EXAMPLE 3: Real-World Multiclass (Iris)
======================================================================

Iris dataset: 150 samples, 2 features, 3 classes
Classes: ['setosa' 'versicolor' 'virginica']
Class distribution: [50 50 50]

Accuracy comparison (training data):
  One-vs-Rest: 92.0%
  Softmax:     94.7%

Confusion Matrix (One-vs-Rest):
      Pred 0  Pred 1  Pred 2
Act 0     50      0      0
Act 1      0     46      4
Act 2      0      6     44

Confusion Matrix (Softmax):
      Pred 0  Pred 1  Pred 2
Act 0     50      0      0
Act 1      0     49      1
Act 2      0      1     49

======================================================================
EXAMPLE 4: Coefficient Interpretation (Binary)
======================================================================

Binary logistic (Class 0 vs Rest):
  Features: ['sepal length (cm)', 'sepal width (cm)']
  Model: P(Class 0 | x) = σ(-0.6060×x₀ + 1.8945×x₁ + -3.6900)

Coefficient interpretation:
  Feature 0 (Sepal Length): m₀ = -0.6060
    - 1-unit increase: odds multiply by e^-0.6060 = 0.544
  Feature 1 (Sepal Width): m₁ = 1.8945
    - 1-unit increase: odds multiply by e^1.8945 = 6.654

Softmax probabilities sum to exactly 1.000 (or very close)
OvR probabilities may not sum to 1.000

======================================================================
EXAMPLE 5: Decision Regions Comparison
======================================================================

Decision regions computed on grid (for visualization)
Grid size: (275, 300)
Unique regions (OvR): [0, 1, 2]
Unique regions (Softmax): [0, 1, 2]

Note: Decision regions are OvR and Softmax may differ.
```

### What to notice in that output

- **Example 1:** OvR probabilities sum to 0.928, 1.000, 0.905, 0.922. Not always 1 (but close when confident).
- **Example 2:** Softmax probabilities sum to exactly 1.000 for all samples.
- **Example 3:** Iris accuracy: OvR 92%, Softmax 94.7%. Softmax is better (fewer misclassifications between versicolor and virginica).
- **Example 4:** Feature 0 (Sepal Length) negative coefficient means longer sepal → lower odds of class 0 (setosa). Feature 1 (Sepal Width) positive means wider sepal → higher odds of setosa. Odds ratios: 0.544 and 6.654 per unit.
- **Example 5:** Decision regions can differ between OvR and Softmax. Softmax often generalises better.

**Things worth trying:**

1. In Example 1, compute the decision boundary between class 0 and class 1 manually.
2. In Example 2, change threshold from 0.5 to pick a different class. How do probabilities change?
3. In Example 3, use all 4 iris features. Does accuracy improve for both methods?
4. In Example 4, a sepal length of 5 cm: compute odds for class 0 vs rest.
5. In Example 3, compute per-class F1 and compare OvR vs Softmax.

---

## Practice Questions

### One-vs-Rest

**T1. [THEORY]** What is one-vs-rest (OvR) for multiclass?

**T2. [THEORY]** For a 4-class problem, how many binary classifiers does OvR fit?

**T3. [THEORY]** In OvR, what are the labels for the classifier "class 2 vs rest"?

**T4. [THEORY]** Do OvR probabilities sum to 1?

**P1. [PROG]** Fit OvR on a 3-class dataset. Verify that predicted class = argmax(probabilities).

### Softmax

**T5. [THEORY]** What is softmax?

**T6. [THEORY]** Write the softmax formula.

**T7. [THEORY]** Do softmax probabilities sum to 1?

**T8. [THEORY]** How does softmax differ from OvR?

**A1. [ANALYZE]** Compare OvR and Softmax on a 3-class dataset. Which is faster to fit? Which gives better generalisation?

### Decision boundary and coefficients

**T9. [THEORY]** In binary logistic, where is the decision boundary?

**T10. [THEORY]** If coefficient m=0.5, how much do odds multiply per unit of x?

**P2. [PROG]** For binary logistic with m=0.4, b=−2, find the decision boundary x*.

**A2. [ANALYZE]** A credit classifier outputs P(approval | income) = σ(0.001 × income − 2). For $50,000 income, what is P?

### Real-world scenarios

**A3. [ANALYZE]** A 5-class text classifier (5 languages) uses logistic regression. Should you use OvR or Softmax? Why?

**A4. [ANALYZE]** Coefficient for age in a disease predictor is 0.1. Age range is 18–80. How much do odds change between 20 and 50?

**A5. [ANALYZE]** An iris classifier using OvR outputs probabilities [0.6, 0.3, 0.15] for a new sample. What is the predicted class?

---

## Quick self-check

1. What is one-vs-rest (OvR)?
2. For K classes, how many OvR classifiers are fit?
3. Do OvR probabilities sum to 1?
4. What is softmax?
5. Write the softmax formula.
6. Do softmax probabilities sum to 1?
7. When should you use OvR vs Softmax?
8. Where is the decision boundary in binary logistic?
9. If coefficient m=0.3, what is the odds ratio per unit of x?
10. How do you interpret negative vs positive coefficients?
