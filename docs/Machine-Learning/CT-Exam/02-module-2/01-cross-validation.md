---
sidebar_position: 1
title: Cross-Validation
description: Complete guide to K-Fold cross-validation, LOOCV, and stratified CV with worked examples and interpretations for CT exam
tags: [cross-validation, k-fold, model-evaluation, hyperparameter-selection]
---

# Cross-Validation

## Overview

Cross-validation (CV) is the gold standard for **reliable model evaluation**. It solves the problem of lucky/unlucky train-test splits.

```
Core Problem:
  Single train/test split depends on luck
  Different split → Different error estimate
  
Core Solution:
  Use multiple train/test splits
  Average the results → More reliable estimate
```

---

## Part 1: Why Cross-Validation Matters

### The Problem: Single Split is Unreliable

```
Scenario: 100 data points, 80-20 train/test split

Split 1 (lucky):
  Train on points 1-80
  Test on points 81-100
  → Test error = 0.08 (good!)

Split 2 (unlucky):
  Train on points 1, 3, 5, ... (alternating)
  Test on points 2, 4, 6, ... (alternating)
  → Test error = 0.25 (bad!)

Same data, different splits → Different error estimates!
Which one is true? We don't know!

Implication:
  ✗ Single test error is misleading
  ✗ Model selection based on one split is risky
  ✗ Might choose wrong model by accident
```

### Visual Example: Lucky vs Unlucky Split

```
Data distribution:
  Points 1-50:   Easy to predict (clustered)
  Points 51-100: Hard to predict (scattered)

Lucky Split:
  Train: [easy section] → Low training error
  Test:  [easy section] → Low test error
  Reported error: 0.10 (looks good)
  
Unlucky Split:
  Train: [hard section] → High training error
  Test:  [easy section] → Low test error
  Reported error: 0.08 (misleading!)

Solution: Use CV to average across all possible splits
```

---

## Part 2: K-Fold Cross-Validation

### How K-Fold Works

```
Basic Idea:
  1. Split data into k equal parts (folds)
  2. For each fold i:
     - Train on folds EXCEPT i
     - Test on fold i
  3. Average the k test errors
  4. Report CV error ± standard deviation
```

### K-Fold Process (k=5)

```
100 observations → 5 folds of 20 each

Fold 1: [XXXXX TRAIN TRAIN TRAIN TRAIN]
        Train: 80, Test: 20, Error: e₁

Fold 2: [TRAIN XXXXX TRAIN TRAIN TRAIN]
        Train: 80, Test: 20, Error: e₂

Fold 3: [TRAIN TRAIN XXXXX TRAIN TRAIN]
        Train: 80, Test: 20, Error: e₃

Fold 4: [TRAIN TRAIN TRAIN XXXXX TRAIN]
        Train: 80, Test: 20, Error: e₄

Fold 5: [TRAIN TRAIN TRAIN TRAIN XXXXX]
        Train: 80, Test: 20, Error: e₅

CV Error = (e₁ + e₂ + e₃ + e₄ + e₅) / 5
CV Std   = Standard deviation of [e₁, e₂, e₃, e₄, e₅]
```

### Visual: 5-Fold CV

```
Data:
[1][2][3][4][5]  (5 folds)

Iteration 1: Train [2,3,4,5], Test [1] → Error: e₁
Iteration 2: Train [1,3,4,5], Test [2] → Error: e₂
Iteration 3: Train [1,2,4,5], Test [3] → Error: e₃
Iteration 4: Train [1,2,3,5], Test [4] → Error: e₄
Iteration 5: Train [1,2,3,4], Test [5] → Error: e₅

Result:
  Each point tested exactly once
  Each point trained on 4 times
  Uses all data efficiently
```

---

## Part 3: Worked Example - K-Fold CV

### Problem: House Price Prediction

```
Dataset: 100 house price observations
Task: Evaluate linear regression model
Method: 5-fold cross-validation
Metric: RMSE (Root Mean Squared Error)
```

### Step 1: Split Data into 5 Folds

```
Fold 1: Observations 1-20   (test set)
Fold 2: Observations 21-40  (test set)
Fold 3: Observations 41-60  (test set)
Fold 4: Observations 61-80  (test set)
Fold 5: Observations 81-100 (test set)
```

### Step 2: Iteration 1 - Test on Fold 1

```
Training Data:  Observations 21-100 (80 observations)
Test Data:      Observations 1-20 (20 observations)

Fit model on training data:
  ŷ = 2.2 + 0.6×size

Predict on test data (Fold 1):
  Actual prices:    [22, 34, 45, 38, 50, 28, 41, 36, 42, 31,
                     38, 44, 25, 39, 46, 33, 40, 37, 43, 29]
  
  Predictions:      [23, 35, 44, 39, 51, 29, 42, 36, 43, 32,
                     39, 45, 26, 40, 47, 34, 41, 38, 44, 30]
  
  Residuals:        [-1, -1, 1, -1, -1, -1, -1, 0, -1, -1,
                     -1, -1, -1, -1, -1, -1, -1, -1, -1, -1]

Calculate RMSE for Fold 1:
  SSE = 1 + 1 + 1 + 1 + 1 + 1 + 1 + 0 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1
      = 19
  
  MSE = 19 / 20 = 0.95
  RMSE₁ = √0.95 = 0.975
```

### Step 3: Iterations 2-5 (Similar Process)

```
Fold 2: RMSE₂ = 0.88
Fold 3: RMSE₃ = 1.05
Fold 4: RMSE₄ = 0.92
Fold 5: RMSE₅ = 1.10
```

### Step 4: Calculate CV Metrics

#### CV Error (Mean)

```
CV Error = (RMSE₁ + RMSE₂ + RMSE₃ + RMSE₄ + RMSE₅) / 5
         = (0.975 + 0.88 + 1.05 + 0.92 + 1.10) / 5
         = 4.925 / 5
         = 0.985
```

#### CV Standard Deviation

```
Individual errors: [0.975, 0.88, 1.05, 0.92, 1.10]
Mean: 0.985

Deviations from mean:
  0.975 - 0.985 = -0.01   → (-0.01)² = 0.0001
  0.88 - 0.985 = -0.105   → (-0.105)² = 0.01103
  1.05 - 0.985 = 0.065    → (0.065)² = 0.00423
  0.92 - 0.985 = -0.065   → (-0.065)² = 0.00423
  1.10 - 0.985 = 0.115    → (0.115)² = 0.01323

Variance = (0.0001 + 0.01103 + 0.00423 + 0.00423 + 0.01323) / 5
         = 0.03272 / 5
         = 0.006544

Std Dev = √0.006544 = 0.0809 ≈ 0.081
```

### Step 5: Report Results

```
5-Fold CV Results:
  CV RMSE: 0.985 ± 0.081
  
  Interpretation:
    Point estimate: 0.985 (average error across folds)
    Uncertainty: ±0.081 (variability between folds)
    Range: 0.904 to 1.066 (one standard deviation)
```

---

## Part 4: Interpreting CV Results

### What the Numbers Mean

```
CV RMSE = 0.985 ± 0.081

CV RMSE (0.985):
  ✓ Average test error across 5 folds
  ✓ Expected error on NEW unseen data
  ✓ More reliable than single split error
  ✓ Use this for model comparison

CV Std Dev (0.081):
  ✓ How much errors vary across folds
  ✓ Low std → Model is stable
  ✓ High std → Model is unstable

Confidence interval (one std):
  ✓ 0.904 to 1.066 (likely range of true error)
```

### Low vs High Standard Deviation

```
Scenario A: Stable Model
  CV RMSE: 0.50 ± 0.02 (std = 0.02)
  Fold errors: [0.50, 0.51, 0.49, 0.50, 0.51]
  
  Interpretation:
    ✓ Model performs consistently across folds
    ✓ Reliable estimate
    ✓ Likely to generalize well

Scenario B: Unstable Model
  CV RMSE: 0.50 ± 0.15 (std = 0.15)
  Fold errors: [0.40, 0.55, 0.60, 0.45, 0.50]
  
  Interpretation:
    ✗ Model performance varies wildly
    ✗ Some folds are easy, others hard
    ✗ Might indicate:
      - Data is not uniform
      - Model is overfitting
      - Need more data
```

---

## Part 5: Complete Inference & Interpretation

### Comparing Single Split vs K-Fold CV

```
Single 80-20 Split:
  Test RMSE = 0.92
  
  Conclusion: "Model error is 0.92"
  
  Problem: Just one number
           Could be luck or bad luck
           Don't know true error

5-Fold Cross-Validation:
  CV RMSE = 0.985 ± 0.081
  
  Conclusion: "Model error is approximately 0.985"
             "95% confident true error is between 0.823-1.147"
  
  Advantage: Multiple estimates
            Can quantify uncertainty
            More trustworthy
```

### Diagnosing Model Issues from CV

```
Scenario 1: High Training Error, High CV Error
  Example: Training RMSE = 1.2, CV RMSE = 1.15 ± 0.1
  
  Diagnosis: HIGH BIAS (underfitting)
    ✓ Model too simple
    ✓ Cannot fit training data well
    ✓ Also fails on test data
  
  Action: Increase model complexity

Scenario 2: Low Training Error, High CV Error
  Example: Training RMSE = 0.1, CV RMSE = 0.8 ± 0.2
  
  Diagnosis: HIGH VARIANCE (overfitting)
    ✗ Model fits training perfectly
    ✗ But fails on test data
    ✗ Large gap is red flag
    ✗ High std dev shows instability
  
  Action: Reduce complexity, get more data, regularization

Scenario 3: Low Training Error, Low CV Error
  Example: Training RMSE = 0.3, CV RMSE = 0.32 ± 0.05
  
  Diagnosis: GOOD FIT
    ✓ Model generalizes well
    ✓ Low gap between train and CV
    ✓ Low std dev shows stability
  
  Action: Keep this model
```

### Using CV for Hyperparameter Selection

```
Problem: Choose regularization parameter λ

Try different λ values with 5-fold CV:

λ = 0.001:   CV RMSE = 0.25 ± 0.08
λ = 0.01:    CV RMSE = 0.23 ± 0.07
λ = 0.1:     CV RMSE = 0.22 ± 0.06 ← Best
λ = 1.0:     CV RMSE = 0.30 ± 0.10
λ = 10.0:    CV RMSE = 0.45 ± 0.15

Best Choice: λ = 0.1
  ✓ Lowest CV error (0.22)
  ✓ Lowest std dev (0.06)
  ✓ Most stable and accurate
```

---

## Part 6: CV Variants

### Leave-One-Out Cross-Validation (LOOCV)

```
Definition:
  k = n (number of observations)
  Train on n-1 samples, test on 1
  Repeat n times

Comparison with 5-fold CV:

5-Fold CV (100 observations):
  Train size: 80, Test size: 20
  Iterations: 5
  Computation: Moderate

LOOCV (100 observations):
  Train size: 99, Test size: 1
  Iterations: 100
  Computation: Expensive!

When to use LOOCV:
  ✓ Very small datasets (n < 50)
  ✓ When you need maximum data for training
  ✗ Large datasets (computational cost)
  ✗ When 5-fold or 10-fold sufficient

Example:
  Dataset: 20 houses
  LOOCV: Train on 19, test on 1 (repeat 20 times)
  5-Fold CV: Train on 16, test on 4 (repeat 5 times)
  LOOCV uses more training data per iteration
```

### Stratified K-Fold (For Classification)

```
Problem with regular K-Fold for imbalanced data:

Dataset: 100 observations
  90% class 0 (negative)
  10% class 1 (positive)

Random 5-Fold split might give:
  Fold 1: 18 negatives, 2 positives (bad for testing positive)
  Fold 2: 17 negatives, 3 positives (worse)
  ...
  
Different folds have different class distributions
CV results less reliable

Solution: Stratified K-Fold

Ensures each fold has same class proportion:
  Fold 1: 9 negatives, 1 positive
  Fold 2: 9 negatives, 1 positive
  Fold 3: 9 negatives, 1 positive
  ...
  
Each fold representative of overall distribution
CV results more stable
```

### Time Series Cross-Validation

```
Problem: For time-series data, random CV violates temporal order

Data: Daily stock prices for 100 days

Regular K-Fold might train on:
  Days [5, 15, 25, 50, 75] and test on [30, 60, 90]
  ✗ Testing on past data (leakage!)

Time Series CV:
  Fold 1: Train [1-60], Test [61-70]
  Fold 2: Train [1-70], Test [71-80]
  Fold 3: Train [1-80], Test [81-90]
  Fold 4: Train [1-90], Test [91-100]
  
  ✓ Always train on past, test on future
  ✓ No leakage
  ✓ Realistic evaluation
```

---

## Part 7: Practical Considerations

### Choosing k (Number of Folds)

```
k = 5:
  ✓ Standard choice
  ✓ Balance between bias and computation
  ✓ Use for most cases

k = 10:
  ✓ More folds, better estimate
  ✓ Computation ~2x more
  ✓ Use for medium datasets (1000+ samples)

k = n (LOOCV):
  ✓ Best estimate (each point tests individually)
  ✗ Very expensive computationally
  ✓ Use only for small datasets (n < 100)

Rule of thumb:
  Small n (< 100):    Use LOOCV or 5-10 fold
  Medium n (100-10k): Use 5-fold
  Large n (> 10k):    Use 5-fold (or even 3-fold)
```

### Reproducibility

```
Problem: Random splits might differ

Solution: Set random seed

Python:
  from sklearn.model_selection import KFold
  kf = KFold(n_splits=5, shuffle=True, random_state=42)
  
Same random_state = Same split across runs
Important for:
  ✓ Comparing models fairly
  ✓ Reproducible research
  ✓ Communication with team
```

---

## Part 8: Exam Questions & Solutions

### Q1: Concept - Why Use CV?

**Q:** "Why use K-fold cross-validation instead of a single 80-20 train/test split?"

**A:**
```
K-fold CV is superior because:

1. Removes luck factor:
   • Single split depends on which 20% becomes test
   • Different split → Different error estimate
   • CV averages across multiple splits

2. More reliable estimate:
   • Single split: One error estimate
   • 5-fold CV: Average of 5 error estimates
   • Less likely to be coincidentally good/bad

3. Efficient data usage:
   • Single split: 20% data wasted for testing (in each iteration)
   • 5-fold CV: Every point is both train and test
   • Maximum information from data

4. Quantifies uncertainty:
   • Single split: Report error (no uncertainty)
   • CV: Report error ± std dev
   • Know how stable the estimate is

Example:
  Single split might say "error = 0.10"
  But true error could be 0.08-0.12
  
  5-fold CV says "error = 0.095 ± 0.04"
  More honest about uncertainty
```

---

### Q2: Calculation - Calculate CV RMSE

**Q:** 
```
5-fold CV results (RMSE for each fold):
  Fold 1: 0.85
  Fold 2: 0.92
  Fold 3: 0.78
  Fold 4: 0.88
  Fold 5: 0.95

Calculate: CV RMSE and CV std deviation
```

**A:**
```
CV RMSE (Mean):
  = (0.85 + 0.92 + 0.78 + 0.88 + 0.95) / 5
  = 4.38 / 5
  = 0.876

CV Standard Deviation:
  Individual values: [0.85, 0.92, 0.78, 0.88, 0.95]
  Mean: 0.876
  
  Deviations:
    0.85 - 0.876 = -0.026 → (-0.026)² = 0.000676
    0.92 - 0.876 = 0.044  → (0.044)² = 0.001936
    0.78 - 0.876 = -0.096 → (-0.096)² = 0.009216
    0.88 - 0.876 = 0.004  → (0.004)² = 0.000016
    0.95 - 0.876 = 0.074  → (0.074)² = 0.005476
  
  Variance = (0.000676 + 0.001936 + 0.009216 + 0.000016 + 0.005476) / 5
           = 0.01732 / 5
           = 0.003464
  
  Std Dev = √0.003464 = 0.0589 ≈ 0.059

Result:
  CV RMSE = 0.876 ± 0.059
```

---

### Q3: Interpretation - Diagnosis

**Q:**
```
Model A:
  Training RMSE: 0.15
  CV RMSE: 0.85 ± 0.12

Model B:
  Training RMSE: 0.5
  CV RMSE: 0.52 ± 0.03

Which model has better generalization? Why?
```

**A:**
```
Model B has better generalization!

Analysis of Model A:
  • Large gap: 0.15 (train) vs 0.85 (CV)
  • High std dev: 0.12 (unstable)
  • Diagnosis: OVERFITTING
    - Fits training perfectly
    - Fails badly on test
    - Unstable across folds

Analysis of Model B:
  • Small gap: 0.5 (train) vs 0.52 (CV)
  • Low std dev: 0.03 (stable)
  • Diagnosis: GOOD FIT
    - Consistent performance
    - Generalizes well
    - Stable across folds

Conclusion:
  Model B is production-ready
  Model A needs fixing (reduce complexity, regularize)
```

---

### Q4: Hyperparameter Selection with CV

**Q:**
```
Ridge regression with different λ values (5-fold CV):

λ = 0.001:   CV RMSE = 0.45 ± 0.10
λ = 0.01:    CV RMSE = 0.42 ± 0.08
λ = 0.1:     CV RMSE = 0.40 ± 0.06
λ = 1.0:     CV RMSE = 0.44 ± 0.07
λ = 10.0:    CV RMSE = 0.52 ± 0.09

Which λ should you choose? Why?
```

**A:**
```
Choose λ = 0.1

Reasons:
  1. Lowest CV RMSE: 0.40
     • Best average performance
  
  2. Lowest std deviation: 0.06
     • Most stable across folds
     • Least sensitive to data splitting
  
  3. Sweet spot:
     λ = 0.01 is close (0.42) but slightly worse
     λ = 1.0 is worse (0.44)
     λ = 10.0 much worse (0.52, likely underfitting)
  
  4. Not too extreme:
     λ = 0.001 might overfit (higher CV error)
     λ = 10.0 definitely underfits (highest CV error)
     λ = 0.1 balances bias-variance

Lesson: Use CV to find optimal hyperparameters
        Choose lowest CV error with lowest std dev
```

---

### Q5: Fold Interpretation

**Q:** 
```
You run 10-fold CV. Fold 3 has RMSE = 2.5 while others average 0.8.

What does this indicate? How would you investigate?
```

**A:**
```
Observation: Fold 3 is an outlier (2.5 vs ~0.8)

Possible causes:

1. Data Quality Issue:
   • Fold 3 test set might have outliers
   • Or Fold 3 train set is missing important data
   • Check for anomalies in fold 3 data

2. Non-uniform Data:
   • Fold 3 might contain harder examples
   • Different cluster of data
   • Model not robust to all data types

3. Stratification Problem:
   • If classification: use Stratified K-Fold
   • Ensures balanced folds

Investigation Steps:
  1. Examine fold 3 test data visually
  2. Check if it has different characteristics
  3. Rerun CV with different random seed
  4. Use Stratified K-Fold if classification
  5. Consider removing outliers if justified

Interpretation:
  CV std dev would be large (high variability)
  Indicates model stability issue
  Should investigate before deployment
```

---

## Part 9: Practice Problems

### Problem 1: Calculate Complete CV

```
Dataset: 20 observations
5-Fold CV on Linear Regression

Fold 1 (test: obs 1-4):    MAE = 5.2, RMSE = 6.1
Fold 2 (test: obs 5-8):    MAE = 4.8, RMSE = 5.9
Fold 3 (test: obs 9-12):   MAE = 5.5, RMSE = 6.4
Fold 4 (test: obs 13-16):  MAE = 5.1, RMSE = 6.0
Fold 5 (test: obs 17-20):  MAE = 5.4, RMSE = 6.3

Calculate:
a) CV MAE and std deviation
b) CV RMSE and std deviation
c) Interpret results
```

### Problem 2: CV vs Single Split

```
Model evaluation on 100 observations:

Option A: Single 80-20 split
  Test RMSE = 0.75

Option B: 5-fold CV
  CV RMSE = 0.82 ± 0.15
  Individual folds: [0.72, 0.95, 0.78, 0.81, 0.89]

Questions:
a) Why is Option B's estimate higher?
b) Why is std dev (0.15) important?
c) Which should you trust more?
```

### Problem 3: Choose Best Model with CV

```
Compare two models using 5-fold CV:

Linear Regression:
  CV RMSE = 0.50 ± 0.08
  
Polynomial Regression (degree 3):
  CV RMSE = 0.45 ± 0.18

Questions:
a) Which has lower average error?
b) Which is more stable?
c) Which would you choose for production?
d) What do you recommend?
```

---

## Part 10: Key Takeaways

### When to Use Each Method

| Method | Dataset Size | Use Case | Time Cost |
|--------|--------------|----------|-----------|
| **Single Split** | Any | Quick initial check | Very fast |
| **5-Fold CV** | Any | Standard evaluation | Moderate |
| **10-Fold CV** | 1000+ | More reliable | Slow |
| **LOOCV** | < 100 | Maximum data usage | Very slow |
| **Stratified K-Fold** | Classification | Imbalanced data | Moderate |
| **Time Series CV** | Time series | Sequential data | Moderate |

### Red Flags from CV Results

```
🚩 High std deviation (> 0.2 × mean):
   Model unstable, investigate data quality

🚩 Large train-CV gap:
   Overfitting, reduce complexity

🚩 One fold much worse than others:
   Check that fold for anomalies

🚩 CV RMSE much higher than single split:
   Single split was lucky, CV is more honest
```

---

## Summary Table

| Concept | Definition | Use |
|---------|-----------|-----|
| **K-Fold CV** | Split into k folds, train k-1, test 1 | Default choice |
| **CV Error** | Average test error across folds | Model performance estimate |
| **CV Std Dev** | Variability across folds | Estimate stability |
| **LOOCV** | k = n, very thorough | Small datasets |
| **Stratified CV** | Balanced class distribution | Imbalanced classification |
| **Time Series CV** | Temporal order preserved | Sequence data |

---

## Tips for CT Exam

### ✅ DO

- **Always report CV error ± std dev** (not just mean)
- **Use CV for hyperparameter selection** (show grid search)
- **Interpret std deviation** (high = unstable)
- **Compare models using CV** (fair comparison)
- **Stratify for classification** (if imbalanced)

### ❌ DON'T

- Don't use single train/test split for model evaluation
- Don't ignore the standard deviation
- Don't compare single split error to CV error directly
- Don't use random k-fold without fixing random seed
- Don't use regular k-fold for imbalanced data

---

## Next Topics

→ [Logistic Regression](./02-logistic-regression.md)  
→ [Classification Advanced](./03-classification-advanced.md)  
→ [Model Comparison](./04-model-comparison.md)

