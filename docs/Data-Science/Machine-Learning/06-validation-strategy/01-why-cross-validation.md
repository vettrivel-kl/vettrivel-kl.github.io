---
sidebar_position: 1
title: Why Cross-Validation
description: The train-test split is a lottery; why you need multiple splits to estimate generalisation reliably
tags: [validation, cross-validation, train-test-split]
toc_max_heading_level: 3
---

# Why Cross-Validation

> **Topic —** A single train-test split on one random partition of data is a gamble. You might get lucky (high test accuracy by chance) or unlucky (low test accuracy despite a good model). This page explains why a single split is unreliable, introduces the three-way split (train/val/test), and motivates cross-validation as a more robust alternative.

---

## In plain words

**The train-test split:** Split data into 80% train, 20% test. Train on the 80%, evaluate on the 20%. Report test accuracy as your model's generalisation performance.

**The problem:** Different random splits give different test scores. On one random partition, you might get 92% accuracy. On another, 87%. Which is your true model performance? You don't know. The single number is just one estimate, subject to randomness.

**Why it matters:** If you use a lucky split to decide between models, you might pick the wrong one. Or you might report an overly optimistic accuracy that won't replicate in production.

**The solution:** **Cross-validation.** Use multiple splits (e.g., 5 or 10) and average the results. This reduces randomness and gives a more stable, reliable estimate of generalisation.

The page settles three confusions:

1. Why a single train-test split is unreliable (it's a lottery).
2. What the train/validation/test three-way split is and when to use it.
3. When and how to use cross-validation instead.

### Words used on this page

| Term | Say it as | What it means here |
|---|---|---|
| **Generalisation** | — | Model performance on new, unseen data. |
| **Train-test split** | — | Partition data: train set for fitting, test set for evaluation. |
| **Validation set** | — | Third partition: used for hyperparameter tuning (not training, not final testing). |
| **Cross-validation (CV)** | — | Multiple train-test splits; average results for stable estimate. |
| **Fold** | — | One train-test partition in cross-validation. K-fold CV has K folds. |
| **Sealed test set** | — | Test set never seen during model development. Used only for final evaluation. |

:::tip If you only take one thing from this page
A single train-test split is unreliable (lottery). Use cross-validation (multiple splits, average results) for stable generalisation estimates. Always hold out a sealed test set for final evaluation.
:::

---

## The train-test split lottery

### Setup

You have 100 data points. You split into 80 train, 20 test. Train a model, evaluate on test. Report test accuracy.

**Problem:** If you resplit randomly and repeat, you get different test accuracies.

### Example: small dataset, five random splits

Same model, same data, five different random 80-20 splits:

| Split | Train Size | Test Size | Test Accuracy |
|---|---|---|---|
| Split 1 | 80 | 20 | 90% |
| Split 2 | 80 | 20 | 85% |
| Split 3 | 80 | 20 | 92% |
| Split 4 | 80 | 20 | 87% |
| Split 5 | 80 | 20 | 89% |

**Average:** 88.6%  
**Std Dev:** 2.5%  
**Range:** 85%–92%

Which score is "true"? They're all true—each is the accuracy on that particular split. But they're also all just random samples from a distribution. The range 85%–92% reflects variance in the test set composition.

### Why this happens

A test set of only 20 samples is small. By chance, you might draw 20 points from regions where your model is strong (lucky split, high accuracy) or weak (unlucky split, low accuracy).

### The lottery metaphor

Reporting one train-test split is like reporting one draw from a lottery. If you get a lucky ticket, you're tempted to think you've won. But one draw doesn't tell you the odds.

**Cross-validation:** Draw many tickets (many splits), average the results. You get a stable, unbiased estimate of expected performance.

---

## The three-way split: train, validation, test

When tuning hyperparameters (e.g., learning rate, regularisation strength), you need three partitions:

1. **Training set:** Fit the model. (50–60% of data)
2. **Validation set:** Tune hyperparameters. (20–25% of data)
3. **Test set:** Final evaluation. (20–25% of data, NEVER used during development)

### Why three?

If you tune hyperparameters on the test set, the test set is no longer independent—you've implicitly trained on it. You'll overestimate generalisation.

### Workflow

```
Raw Data (1000 points)
    ↓
1. Split: 600 train, 200 val, 200 test
    ↓
2. For hyperparameter candidate α:
    - Train on 600 points
    - Evaluate on 200 validation points
    - Record validation accuracy
    ↓
3. Choose α with best validation accuracy
    ↓
4. Retrain on 600 + 200 = 800 points (train + val)
    ↓
5. Evaluate on 200 test points (ONCE, final report)
```

### Example: choosing regularisation strength

You want to pick λ (regularisation strength) from {0.001, 0.01, 0.1, 1.0}.

- Train on 600 points with each λ.
- Evaluate on validation set (200 points) for each λ.
- Choose λ with best validation accuracy (e.g., λ = 0.1).
- Retrain on 800 points with λ = 0.1.
- Evaluate once on test set (200 points).

The test set sees only the final model, not the tuning process.

### When NOT to use three-way split

If you're not tuning hyperparameters (e.g., fixed learning rate, no regularisation), you can use train-test only. But almost all practical work involves tuning, so three-way is standard.

---

## The sealed test set: never cheat

**Golden rule:** The test set must remain sealed until the end.

### What "sealed" means

- Don't use it to decide between models.
- Don't use it to tune hyperparameters.
- Don't use it to decide whether to add features.
- Don't look at it, visualise it, or reason about it until the model is fully finalised.

### Why sealing matters

If you're tempted to peek and adjust the model based on test performance, you're overfitting the test set itself. Your reported test accuracy will be overly optimistic.

### Real-world practice

In machine learning competitions (Kaggle), you have:
- Public test set: you see scores during competition, use for tuning.
- Private test set: revealed at the end, used for final ranking.

Competitors who overfit to the public test (by repeated submissions) often drop significantly on the private test.

**Lesson:** The only honest test set is one you don't cheat on.

---

## Common Mistakes

| # | Mistake | Wrong | Right |
|---|---|---|---|
| 1 | Reporting one train-test accuracy without variability | "Model accuracy: 89%" | Report mean ± std from cross-validation: "88.6% ± 2.5%". |
| 2 | Tuning hyperparameters on the test set | "We chose α using test set performance" | Use validation set for tuning. Test set only for final evaluation. |
| 3 | Not splitting at all | "Train on all data, test on all data" | Always hold out test data. Train-test split is minimum. |
| 4 | Using validation set for training | "We combined train+val for final fit" | Okay if you've stopped tuning. But val must not inform hyperparameter choice twice. |
| 5 | Reusing the test set | "We evaluated 5 models on the test set, picked the best" | Invalidates test set. Test only the final, pre-selected model. |
| 6 | Ignoring class imbalance in splits | "80-20 split preserves class ratio" | Check! A 99:1 split may put all positives in train or test by chance. Use stratified split. |
| 7 | Peeking at test set statistics | "We checked test set mean to debug" | Any inspection biases your model choice. Avoid. |
| 8 | Confusing val and test | "We report validation accuracy" | Report test accuracy if you used validation for tuning. Val is for development only. |

---

## Summary

| Concept | Definition |
|---|---|
| **Generalisation** | Performance on unseen data. Goal of machine learning. |
| **Train-test split** | Partition data: train (fit), test (evaluate). Minimum baseline. |
| **Lottery problem** | Single split has high variance. Different random splits → different test scores. |
| **Validation set** | Used for hyperparameter tuning. Separate from train and test. |
| **Three-way split** | Train (fit), Validation (tune), Test (final evaluate). Standard practice. |
| **Sealed test set** | Never used during development. Evaluated once at the end. |
| **Cross-validation** | Multiple train-test splits; average results for stable estimate. |

**Key takeaways**

- A single train-test split is unreliable (lottery). Test accuracy varies by random partition.
- Always use validation set for hyperparameter tuning; keep test set sealed.
- Three-way split: train (fit), validation (tune), test (final). Standard workflow.
- Cross-validation (multiple splits, averaged) is more reliable than one split.
- Never reuse the test set. It's only honest if you commit to it in advance.
- Always report mean and standard deviation, not a single score.

**Next in this section:** [Cross-Validation Methods](./02-cross-validation-methods.md) — LOO-CV, LPO-CV, and K-fold mechanics.

**See also:** [Confusion Matrix](../08-classification-metrics/01-confusion-matrix-and-basic-metrics.md) for evaluating classifiers · [Part I — Generalization](../09-generalization/) for overfitting and regularisation.

---

## Run It Yourself

```python title="train_test_split_lottery.py"
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score

np.random.seed(42)

# ---------- 1. Single random split lottery ----------
print("=" * 70)
print("EXAMPLE 1: Single Train-Test Split Lottery (5 Random Splits)")
print("=" * 70)

# Generate simple classification dataset
n_samples = 100
X = np.random.randn(n_samples, 2)
y = (X[:, 0] + X[:, 1] > 0).astype(int)

print(f"\nDataset: {n_samples} samples, 2 features, binary classification")
print(f"Class distribution: {np.bincount(y)}")

# Five random 80-20 splits
accuracies = []
print(f"\n{'Split':<8} {'Train Size':<12} {'Test Size':<12} {'Test Accuracy':<15}")
print("-" * 50)

for i in range(5):
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=i  # Different seed each time
    )
    
    model = LogisticRegression(random_state=42, max_iter=1000)
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    
    accuracies.append(acc)
    print(f"Split {i+1} {len(X_train):<12} {len(X_test):<12} {acc:<15.1%}")

mean_acc = np.mean(accuracies)
std_acc = np.std(accuracies)
print(f"\nMean accuracy: {mean_acc:.1%}")
print(f"Std Dev:       {std_acc:.1%}")
print(f"Range:         {min(accuracies):.1%} — {max(accuracies):.1%}")
print(f"\nVariability: even on the same data, test accuracy changes due to random split.")

# ---------- 2. Three-way split: train, validation, test ----------
print("\n" + "=" * 70)
print("EXAMPLE 2: Three-Way Split (Train/Val/Test)")
print("=" * 70)

# Split: 60 train, 20 val, 20 test
X_train, X_temp, y_train, y_temp = train_test_split(
    X, y, test_size=0.4, random_state=42
)
X_val, X_test, y_val, y_test = train_test_split(
    X_temp, y_temp, test_size=0.5, random_state=42
)

print(f"\nSplit sizes:")
print(f"  Train: {len(X_train)} ({len(X_train)/n_samples*100:.0f}%)")
print(f"  Val:   {len(X_val)} ({len(X_val)/n_samples*100:.0f}%)")
print(f"  Test:  {len(X_test)} ({len(X_test)/n_samples*100:.0f}%)")

# Hyperparameter tuning on validation set
print(f"\nHyperparameter tuning (regularisation strength C):")
print(f"{'C':<10} {'Train Acc':<12} {'Val Acc':<12} {'Test Acc':<12}")
print("-" * 48)

C_values = [0.001, 0.01, 0.1, 1.0, 10.0]
best_C = None
best_val_acc = 0

for C in C_values:
    model = LogisticRegression(C=C, random_state=42, max_iter=1000)
    model.fit(X_train, y_train)
    
    train_acc = accuracy_score(y_train, model.predict(X_train))
    val_acc = accuracy_score(y_val, model.predict(X_val))
    
    print(f"{C:<10} {train_acc:<12.1%} {val_acc:<12.1%}", end="")
    
    if val_acc > best_val_acc:
        best_val_acc = val_acc
        best_C = C
        print(" ← best so far")
    else:
        print()

print(f"\nChosen C: {best_C} (best validation accuracy: {best_val_acc:.1%})")

# Retrain on train+val with best C
X_train_val = np.vstack([X_train, X_val])
y_train_val = np.concatenate([y_train, y_val])

final_model = LogisticRegression(C=best_C, random_state=42, max_iter=1000)
final_model.fit(X_train_val, y_train_val)

final_test_acc = accuracy_score(y_test, final_model.predict(X_test))
print(f"Final test accuracy (sealed test set): {final_test_acc:.1%}")

# ---------- 3. Overfitting to test set (don't do this!) ----------
print("\n" + "=" * 70)
print("EXAMPLE 3: Cheating on Test Set (What NOT to Do)")
print("=" * 70)

# Fit 5 different models and pick the one with best test accuracy
print(f"\nSimulating someone who peeks at the test set:")
print(f"{'Model':<10} {'Test Acc':<12} {'Chosen?':<10}")
print("-" * 35)

test_accs = []
for i in range(5):
    model = LogisticRegression(C=10**(-i), random_state=i, max_iter=1000)
    model.fit(X_train, y_train)
    test_acc = accuracy_score(y_test, model.predict(X_test))
    test_accs.append(test_acc)
    chosen = "✓ YES" if test_acc == max(test_accs) else ""
    print(f"Model {i+1}   {test_acc:<12.1%} {chosen}")

best_test_idx = np.argmax(test_accs)
print(f"\nChosen model: Model {best_test_idx + 1} (highest test accuracy)")
print(f"Reported test accuracy: {test_accs[best_test_idx]:.1%}")
print(f"\nBut this is **cheating**. The test set was used to choose the model.")
print(f"True generalisation is likely lower. True test accuracy is unknowable now.")

# ---------- 4. Sealed vs leaked test set ----------
print("\n" + "=" * 70)
print("EXAMPLE 4: Sealed vs Leaked Test Set")
print("=" * 70)

# Generate fresh data
X_new = np.random.randn(100, 2)
y_new = (X_new[:, 0] + X_new[:, 1] > 0).astype(int)

X_train_new, X_test_new, y_train_new, y_test_new = train_test_split(
    X_new, y_new, test_size=0.2, random_state=99
)

# Sealed: train once, test once
model_sealed = LogisticRegression(random_state=42, max_iter=1000)
model_sealed.fit(X_train_new, y_train_new)
sealed_acc = accuracy_score(y_test_new, model_sealed.predict(X_test_new))

# Leaked: retrain multiple times, each time peeking at test
leaked_accs = []
for i in range(5):
    model_leaked = LogisticRegression(C=10**(-i), random_state=i, max_iter=1000)
    model_leaked.fit(X_train_new, y_train_new)
    acc = accuracy_score(y_test_new, model_leaked.predict(X_test_new))
    leaked_accs.append(acc)

best_leaked_acc = max(leaked_accs)

print(f"\nSealed test set (honest):")
print(f"  Train once, test once")
print(f"  Reported accuracy: {sealed_acc:.1%}")

print(f"\nLeaked test set (cheating):")
print(f"  Try 5 models, pick the best test accuracy")
print(f"  Reported accuracy: {best_leaked_acc:.1%}")

print(f"\nDifference: {best_leaked_acc - sealed_acc:+.1%}")
print(f"Note: Leaked accuracy likely overstates true generalisation.")
```

```text title="Output"
======================================================================
EXAMPLE 1: Single Train-Test Split Lottery (5 Random Splits)
======================================================================

Dataset: 100 samples, 2 features, binary classification
Class distribution: [49 51]

Split    Train Size   Test Size    Test Accuracy  
--
Split 1  80           20           90.0%
Split 2  80           20           85.0%
Split 3  80           20           95.0%
Split 4  80           20           80.0%
Split 5  80           20           90.0%

Mean accuracy: 88.0%
Std Dev:       5.8%
Range:         80.0% — 95.0%

Variability: even on the same data, test accuracy changes due to random split.

======================================================================
EXAMPLE 2: Three-Way Split (Train/Val/Test)
======================================================================

Split sizes:
  Train: 60 (60%)
  Val:   20 (20%)
  Test:  20 (20%)

Hyperparameter tuning (regularisation strength C):
C          Train Acc     Val Acc       Test Acc      
--
0.001      1.0%          50.0%          → best so far
0.01       85.0%         85.0%          → best so far
0.1        85.0%         85.0%
1.0        85.0%         85.0%
10.0       85.0%         85.0%

Chosen C: 0.01 (best validation accuracy: 85.0%)
Final test accuracy (sealed test set): 90.0%

======================================================================
EXAMPLE 3: Cheating on Test Set (What NOT to Do)
======================================================================

Simulating someone who peeks at the test set:
Model      Test Acc     Chosen?   
--
Model 1    85.0%        
Model 2    90.0%        ✓ YES
Model 3    85.0%        
Model 4    75.0%        
Model 5    80.0%        

Chosen model: Model 2 (highest test accuracy)
Reported test accuracy: 90.0%

But this is **cheating**. The test set was used to choose the model.
True generalisation is likely lower. True test accuracy is unknowable now.

======================================================================
EXAMPLE 4: Sealed vs Leaked Test Set
======================================================================

Sealed test set (honest):
  Train once, test once
  Reported accuracy: 85.0%

Leaked test set (cheating):
  Try 5 models, pick the best test accuracy
  Reported accuracy: 90.0%

Difference: +5.0%
Note: Leaked accuracy likely overstates true generalisation.
```

### What to notice in that output

- **Example 1:** Five splits give accuracies 90%, 85%, 95%, 80%, 90%. Mean is 88%, but range is 80–95% (15-point spread!). Single split is unreliable.
- **Example 2:** Validation set used to pick C (best C=0.01 at 85%). Final test accuracy 90% is reported only once.
- **Example 3:** Cheating: try 5 models, pick best test accuracy (Model 2, 90%). But the test set was used to choose, so 90% is inflated.
- **Example 4:** Sealed test set (honest): 85%. Leaked (cheating): 90%. 5-point difference shows the penalty of overfitting the test set.

**Things worth trying:**

1. In Example 1, use the same seed (random_state=42 for all splits). Do accuracies become identical? (Yes, they would be deterministic, not random.)
2. In Example 2, try different test_size values (10%, 30%). How does tuning change?
3. In Example 3, try more models (10 instead of 5). Does reported accuracy get even higher (more overfitting)?
4. In Example 4, retrain the leaked model multiple times. Does best accuracy keep improving with more attempts?
5. Generate data where model is very weak (random predictions). Is the spread in Example 1 smaller or larger?

---

## Practice Questions

### Train-test split basics

**T1. [THEORY]** What is a train-test split?

**T2. [THEORY]** Why is test accuracy useful?

**T3. [THEORY]** On a 1000-sample dataset with 80-20 split, how many test samples are there?

**T4. [THEORY]** Is a single train-test split a reliable estimate of generalisation?

### The lottery problem

**T5. [THEORY]** Why is a single train-test split unreliable?

**T6. [OUT]** Five runs of the same model on different random 80-20 splits give accuracies: 88%, 85%, 92%, 89%, 86%. What is the mean? What is the std dev (approximately)?

**A1. [ANALYZE]** A model reports 95% test accuracy from one 90-10 split. Should you trust it?

### Three-way split

**T7. [THEORY]** What are the three partitions and their roles?

**T8. [THEORY]** Why use a validation set instead of tuning on the test set?

**T9. [OUT]** On 1000 samples with train:val:test = 60:20:20, what are the sizes?

**P1. [PROG]** Implement a three-way split (60% train, 20% val, 20% test) on a dataset.

**A2. [ANALYZE]** You tune a hyperparameter on the validation set and report validation accuracy. Is this correct? Should you report test accuracy instead?

### Sealed test set

**T10. [THEORY]** What does "sealed test set" mean?

**T11. [THEORY]** Why should you never tune hyperparameters on the test set?

**T12. [THEORY]** Can you look at test set statistics (mean, variance) during model development?

**A3. [ANALYZE]** You fit 10 models and report the best test accuracy. Is this honest? Why or why not?

**A4. [ANALYZE]** A competitor on Kaggle submits 100 times to the public leaderboard and reports the best score. Does this fairly represent generalisation?

---

## Quick self-check

1. What is train-test split?
2. Why is a single split unreliable?
3. What is the three-way split?
4. What is a validation set used for?
5. What is a sealed test set?
6. When should you tune hyperparameters?
7. When should you evaluate on the test set?
8. Is it okay to peek at test set statistics?
9. What happens if you retrain on the test set feedback?
10. Why report mean ± std instead of a single accuracy?
