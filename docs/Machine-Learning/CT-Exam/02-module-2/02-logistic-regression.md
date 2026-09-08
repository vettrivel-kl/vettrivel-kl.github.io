---
sidebar_position: 2
title: Logistic Regression
description: Complete guide to binary and multi-class logistic regression with sigmoid function, probability interpretation, and worked classification examples for CT exam
tags: [logistic-regression, classification, sigmoid, binary-classification, multi-class]
---

# Logistic Regression

## Overview

Logistic regression is the **most important classification algorithm** and bridges regression and classification.

```
Core Idea:
  Take linear regression output (any number)
  Transform it through sigmoid function (bounds to 0-1)
  Output = probability of class 1
  
Key Insight:
  "Regression" in name is misleading
  It's actually classification (predicts class probabilities)
```

---

## Part 1: Linear vs Logistic Regression

### Side-by-Side Comparison

```
LINEAR REGRESSION               LOGISTIC REGRESSION
──────────────────────────────────────────────────────
Predicts: Continuous value     Predicts: Probability (0-1)
Equation: ŷ = b₀ + b₁x        Equation: P(y=1) = 1/(1+e^(-(b₀+b₁x)))
Output: Any number             Output: Between 0 and 1
Range: -∞ to +∞                Range: 0 to 1
Use case: Regression           Use case: Classification
Error metric: MSE, RMSE, MAE   Error metric: Accuracy, Precision, Recall, F1
Example: House price           Example: Email spam detection
```

### Why Linear Regression Fails for Classification

```
Problem: House classification (big=1, small=0)

Linear model: P̂(big house) = -0.5 + 0.2×size

Issues:
  Size = 1 → P̂ = -0.3 (negative probability! ✗)
  Size = 10 → P̂ = 1.5 (>1 probability! ✗)
  Size = 100 → P̂ = 19.5 (way beyond 1! ✗)

Solution: Use sigmoid function
  Curves output to stay between 0 and 1
  P(big) = 1 / (1 + e^(0.5 - 0.2×size))
  
  Size = 1 → P = 0.38 (valid! ✓)
  Size = 10 → P = 0.73 (valid! ✓)
  Size = 100 → P = 1.00 (valid! ✓)
```

---

## Part 2: The Sigmoid Function (S-Curve)

### Formula

```
σ(z) = 1 / (1 + e^(-z))

where:
  z = b₀ + b₁x (linear combination)
  e = 2.71828 (Euler's number)
  σ(z) = sigmoid of z, ranges 0 to 1
```

### Sigmoid Properties

```
Key Properties:

1. S-shaped curve (sigmoid = "S-shaped")
2. Symmetric around z=0
3. σ(0) = 1/(1+1) = 0.5 (midpoint)
4. σ(∞) = 0 (approaches 0)
5. σ(-∞) = 1 (approaches 1)
6. Monotonic increasing (always goes up)

Interpretation:
  z = 0   → P = 0.5 (no clear preference)
  z > 0   → P > 0.5 (leans toward class 1)
  z < 0   → P < 0.5 (leans toward class 0)
```

### Visual: Sigmoid Curve

```
Probability
    1.0 ├─────────────────────────
        │                    ╱─────
        │               ╱─────
        │           ╱─────
    0.75├──────╱─────────────────────
        │     ╱
    0.50├────●─────────────────────
        │   ╱
    0.25├──────────────────────────
        │ ╱
    0.0 ├─────────────────────────
        └─────────────────────────→ z
       -5   -2   0   2   5

Key Points:
  z = -5  → P ≈ 0.007 (almost class 0)
  z = 0   → P = 0.5 (boundary)
  z = 5   → P ≈ 0.993 (almost class 1)
```

### Sigmoid Calculation Example

```
Example: Email classification

Model: z = -2 + 0.5×word_count

Email 1: word_count = 10
  z = -2 + 0.5(10) = -2 + 5 = 3
  P(spam) = 1 / (1 + e^(-3))
          = 1 / (1 + 0.0498)
          = 1 / 1.0498
          = 0.953 (95.3% spam)
  Prediction: SPAM ✓

Email 2: word_count = 2
  z = -2 + 0.5(2) = -2 + 1 = -1
  P(spam) = 1 / (1 + e^(1))
          = 1 / (1 + 2.718)
          = 1 / 3.718
          = 0.269 (26.9% spam)
  Prediction: HAM ✓
```

---

## Part 3: Logistic Regression Formula

### Full Model

```
Logistic Regression Model:

P(y=1 | x) = 1 / (1 + e^(-(b₀ + b₁x)))

where:
  P(y=1 | x) = Probability of class 1 given x
  b₀ = intercept
  b₁ = slope (coefficient)
  x = feature value

Abbreviated:
  P(y=1) = σ(b₀ + b₁x)
  where σ is sigmoid function
```

### Multiple Features

```
With k features:

P(y=1 | x₁, x₂, ..., xₖ) = 1 / (1 + e^(-(b₀ + b₁x₁ + b₂x₂ + ... + bₖxₖ)))

Example (3 features):
P(spam | words, caps, links) = 1 / (1 + e^(-(-2 + 0.3×words + 0.5×caps + 0.8×links)))

For new email: words=50, caps=10, links=3
z = -2 + 0.3(50) + 0.5(10) + 0.8(3)
  = -2 + 15 + 5 + 2.4
  = 20.4

P(spam) = 1 / (1 + e^(-20.4))
        ≈ 1 / (1 + 0.00000016)
        ≈ 0.9999+ (virtually certain spam)
```

---

## Part 4: Binary Classification Worked Example

### Problem: Email Classification

```
Dataset: 100 emails (50 spam, 50 legitimate)

Features (normalized 0-1):
  • word_count: Number of suspicious words
  • sender_reputation: Sender's trustworthiness
  • has_links: Whether email contains links

Target: spam (1=spam, 0=legitimate)

Data sample:
Email    word_count  reputation  links  spam
1        0.8         0.2         1      1    (spam)
2        0.2         0.9         0      0    (ham)
3        0.9         0.1         1      1    (spam)
...
```

### Step 1: Fit Model

```
After training (using maximum likelihood):

Fitted Coefficients:
  b₀ = -1.5
  b₁ = 3.2 (word_count coefficient)
  b₂ = -2.1 (reputation coefficient)
  b₃ = 1.8 (has_links coefficient)

Model Equation:
P(spam) = 1 / (1 + e^(-(-1.5 + 3.2×word_count - 2.1×reputation + 1.8×has_links)))
```

### Step 2: Interpret Coefficients

```
b₁ = 3.2 (word_count):
  ✓ Positive → More suspicious words → Higher spam probability
  ✓ For each 0.1 increase in word_count:
    Log-odds increase by 0.32 (odds increase by ~38%)

b₂ = -2.1 (sender_reputation):
  ✓ Negative → Higher reputation → Lower spam probability
  ✓ Makes sense: trusted senders rarely send spam

b₃ = 1.8 (has_links):
  ✓ Positive → Having links increases spam probability
  ✓ Spam emails often contain malicious links

b₀ = -1.5 (intercept):
  ✓ Baseline log-odds when all features = 0
  ✓ When word_count=reputation=links=0:
    P(spam) = 1/(1+e^(1.5)) = 0.18 (18% likely spam)
```

### Step 3: Make Predictions

#### Email A: Legitimate

```
Features: word_count=0.1, reputation=0.9, links=0

z = -1.5 + 3.2(0.1) - 2.1(0.9) + 1.8(0)
  = -1.5 + 0.32 - 1.89 + 0
  = -3.07

P(spam) = 1 / (1 + e^(-(-3.07)))
        = 1 / (1 + e^(3.07))
        = 1 / (1 + 21.43)
        = 1 / 22.43
        = 0.0446 ≈ 4.5%

Prediction: LEGITIMATE ✓ (since P < 0.5)
Confidence: 95.5% confident it's legitimate
```

#### Email B: Spam

```
Features: word_count=0.8, reputation=0.2, links=1

z = -1.5 + 3.2(0.8) - 2.1(0.2) + 1.8(1)
  = -1.5 + 2.56 - 0.42 + 1.8
  = 2.44

P(spam) = 1 / (1 + e^(-2.44))
        = 1 / (1 + 0.087)
        = 1 / 1.087
        = 0.920 ≈ 92%

Prediction: SPAM ✓ (since P ≥ 0.5)
Confidence: 92% confident it's spam
```

#### Email C: Borderline

```
Features: word_count=0.5, reputation=0.5, links=0

z = -1.5 + 3.2(0.5) - 2.1(0.5) + 1.8(0)
  = -1.5 + 1.6 - 1.05 + 0
  = -0.95

P(spam) = 1 / (1 + e^(0.95))
        = 1 / (1 + 2.586)
        = 1 / 3.586
        = 0.279 ≈ 28%

Prediction: LEGITIMATE (since P < 0.5)
Confidence: 72% confident it's legitimate (low confidence)
```

### Step 4: Calculate Classification Metrics

#### Build Predictions for All 100 Emails

```
Predictions on test set (20 emails):

Actual:    [1, 0, 1, 0, 1, 1, 0, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0]
Predicted: [1, 0, 1, 0, 1, 1, 0, 0, 1, 0, 1, 0, 1, 1, 0, 0, 0, 0, 1, 0]
           (predictions based on P(spam) threshold 0.5)

Matches: 18/20 correct
Mismatches: Email 16 (actual=1, pred=0), Email 17 (both 0)
```

#### Build Confusion Matrix

```
                Predicted
            Spam    Legit
Actual
Spam       | 9   |  1  |  = 10 actual spam
Legit      | 1   |  9  |  = 10 actual legit
             10     10

TP = 9 (correctly identified spam)
FN = 1 (spam missed as legit)
FP = 1 (legit incorrectly marked spam)
TN = 9 (correctly identified legit)
```

#### Calculate Metrics

```
Accuracy = (TP + TN) / Total
         = (9 + 9) / 20
         = 18 / 20
         = 0.90 = 90%

Precision = TP / (TP + FP)
          = 9 / (9 + 1)
          = 9 / 10
          = 0.90 = 90%
  Interpretation: Of predicted spam, 90% are actually spam

Recall = TP / (TP + FN)
       = 9 / (9 + 1)
       = 9 / 10
       = 0.90 = 90%
  Interpretation: We catch 90% of actual spam

F1 = 2 × (Precision × Recall) / (Precision + Recall)
   = 2 × (0.90 × 0.90) / (0.90 + 0.90)
   = 2 × 0.81 / 1.80
   = 1.62 / 1.80
   = 0.90 = 90%
```

---

## Part 5: Complete Inference & Interpretation

### What the Model Tells Us

```
Fitted Logistic Regression Model:
P(spam) = 1 / (1 + e^(-(-1.5 + 3.2×word_count - 2.1×reputation + 1.8×links)))

Business Interpretation:

1. Suspicious Words (coefficient = 3.2):
   ✓ Strongest predictor of spam
   ✓ Each 0.1 increase → odds increase ~38%
   ✓ Action: Flag emails with many suspicious words

2. Sender Reputation (coefficient = -2.1):
   ✓ Strong negative relationship
   ✓ Trusted senders rarely spam
   ✓ Action: Whitelist trusted senders

3. Links in Email (coefficient = 1.8):
   ✓ Emails with links more likely spam
   ✓ But not as strong as words
   ✓ Action: Scrutinize emails with links

4. Overall Performance:
   ✓ 90% accuracy (catch most spam)
   ✓ 90% recall (only miss 10% of spam)
   ✓ 90% precision (few false alarms)
   ✓ Balanced model: good all around

Limitations:
   ✗ 1 spam missed (false negative)
   ✗ 1 legitimate marked as spam (false positive)
   ✗ 90% perfect but could be better
   ✗ May need more features
```

### Decision Threshold Adjustment

```
Current threshold: P(spam) ≥ 0.5 → Predict spam

Default gives: Precision = Recall = 90%

What if we adjust threshold?

Threshold = 0.3 (More lenient, catch more spam):
  ✓ Higher recall (catch 95% of spam)
  ✗ Lower precision (more false positives)
  Use case: Security > user inconvenience

Threshold = 0.7 (More strict, avoid false alarms):
  ✓ Higher precision (fewer false positives)
  ✗ Lower recall (miss more spam)
  Use case: User experience > security

Business decision: Choose based on costs
  Cost of missing spam (user frustrated): ₹10
  Cost of false alarm (user annoyed): ₹1
  → Optimize threshold to minimize total cost
```

---

## Part 6: Odds and Log-Odds

### Understanding Odds

```
Probability vs Odds:

Probability: Number between 0 and 1
  P(spam) = 0.9 = 90%

Odds: Ratio of probability to complement
  Odds(spam) = P(spam) / (1 - P(spam))
             = 0.9 / 0.1
             = 9 (9 to 1 odds)
  
  Interpretation: 9 spam emails for every 1 legitimate

Conversion formulas:
  Odds = P / (1-P)
  P = Odds / (1 + Odds)

Example:
  P = 0.75
  Odds = 0.75/0.25 = 3 (3 to 1)
  
  Odds = 5
  P = 5/6 ≈ 0.833
```

### Log-Odds (Logit)

```
Log-Odds = ln(Odds) = ln(P/(1-P))

This is linear in logistic regression!

Logistic model can be rewritten:
  log-odds = b₀ + b₁x

For our email example:
  log-odds = -1.5 + 3.2×word_count

Email with word_count = 0.8:
  log-odds = -1.5 + 3.2(0.8) = 1.06
  odds = e^1.06 ≈ 2.89
  P = 2.89 / (1 + 2.89) ≈ 0.74

Key insight:
  ✓ Logistic regression models log-odds linearly
  ✓ Coefficient b₁ = change in log-odds per unit x
  ✓ e^b₁ = ratio of odds for unit increase in x
```

---

## Part 7: Multi-Class Classification

### Problem: Multiple Classes

```
Binary Classification:
  Class 0 or Class 1 (spam or not spam)
  
Multi-class Classification:
  Class 0, Class 1, or Class 2+ (many options)
  
Examples:
  • Iris flower: Setosa, Versicolor, Virginica (3 classes)
  • Email: Work, Personal, Spam, Promotions (4 classes)
  • Grade prediction: A, B, C, D, F (5 classes)
```

### Approach 1: One-vs-Rest (OvR)

```
For k classes, train k binary classifiers

Iris example (3 classes):

Classifier 1: "Setosa vs Rest"
  ✓ Train model to predict: Setosa or (Versicolor + Virginica)
  
Classifier 2: "Versicolor vs Rest"
  ✓ Train model to predict: Versicolor or (Setosa + Virginica)
  
Classifier 3: "Virginica vs Rest"
  ✓ Train model to predict: Virginica or (Setosa + Versicolor)

Prediction for new flower:
  Classifier 1: P(Setosa) = 0.7
  Classifier 2: P(Versicolor) = 0.2
  Classifier 3: P(Virginica) = 0.1
  
  → Predict: SETOSA (highest probability)

Advantages:
  ✓ Simple to understand
  ✓ Can use any binary classifier
  
Disadvantages:
  ✗ Probabilities don't necessarily sum to 1
  ✗ k models to train (computationally expensive)
```

### Approach 2: Softmax Regression

```
Generalization of logistic regression to k classes

For k classes:

P(y = j | x) = e^(z_j) / Σ e^(z_i)  (for i = 1 to k)

where z_j = b₀ⱼ + b₁ⱼx₁ + b₂ⱼx₂ + ...

Property: Probabilities sum to 1!
  Σ P(y=j | x) = 1 for all j

Example (3 classes):
  z₁ = -0.5 + 0.3×x
  z₂ = 0.2 + 0.5×x
  z₃ = 0.1 + 0.2×x
  
  For x = 2:
    z₁ = -0.5 + 0.6 = 0.1 → e^0.1 = 1.105
    z₂ = 0.2 + 1.0 = 1.2 → e^1.2 = 3.320
    z₃ = 0.1 + 0.4 = 0.5 → e^0.5 = 1.649
    
  Sum = 1.105 + 3.320 + 1.649 = 6.074
  
  P(y=1 | x=2) = 1.105 / 6.074 ≈ 0.182
  P(y=2 | x=2) = 3.320 / 6.074 ≈ 0.547
  P(y=3 | x=2) = 1.649 / 6.074 ≈ 0.271
  
  Sum = 0.182 + 0.547 + 0.271 = 1.00 ✓

Advantages:
  ✓ Probabilities sum to 1 (proper probability distribution)
  ✓ Single model (not k separate models)
  ✓ More principled approach
  
Disadvantages:
  ✗ More complex (requires specialized solver)
```

### Approach 3: One-vs-One (OvO)

```
For k classes, train k(k-1)/2 binary classifiers

Iris example (3 classes):
  Classifiers needed: 3×2/2 = 3

Classifier 1: Setosa vs Versicolor
Classifier 2: Setosa vs Virginica
Classifier 3: Versicolor vs Virginica

Prediction: Majority vote or probability averaging

Advantages:
  ✓ Works well for imbalanced datasets
  
Disadvantages:
  ✗ Many models (expensive)
  ✗ Complex voting scheme
```

---

## Part 8: Maximum Likelihood Estimation (Conceptual)

### Why Maximum Likelihood?

```
Question: How are logistic regression coefficients estimated?
Answer: Maximum Likelihood Estimation (MLE)

Intuition:
  Choose coefficients that make the data MOST LIKELY
  
Example:
  Data: [Spam, Spam, Legit, Spam, Legit]
  True labels: [1, 1, 0, 1, 0]
  
  Model 1: P(spam) = 0.8
    Likelihood = 0.8 × 0.8 × 0.2 × 0.8 × 0.2
               = 0.02048 (low)
  
  Model 2: P(spam) = 0.6
    Likelihood = 0.6 × 0.6 × 0.4 × 0.6 × 0.4
               = 0.03456 (higher)
  
  → Choose model with HIGHER likelihood
```

### Loss Function

```
For logistic regression:

Log-Loss (Cross-Entropy Loss):
  L = -1/n × Σ[y·ln(ŷ) + (1-y)·ln(1-ŷ)]
  
Interpretation:
  • When y=1 (actually spam):
    Loss = -ln(ŷ)
    If ŷ=0.95 (confident spam): Loss = -ln(0.95) ≈ 0.05 (small penalty)
    If ŷ=0.1 (wrong!): Loss = -ln(0.1) ≈ 2.3 (large penalty)
    
  • When y=0 (actually legit):
    Loss = -ln(1-ŷ)
    If ŷ=0.05 (confident legit): Loss = -ln(0.95) ≈ 0.05 (small penalty)
    If ŷ=0.9 (wrong!): Loss = -ln(0.1) ≈ 2.3 (large penalty)

Key property:
  ✓ Penalizes confident mistakes more
  ✓ Always positive
  ✓ Lower is better
  
Goal in training:
  Minimize this loss function
  → Find coefficients with maximum likelihood
```

---

## Part 9: Exam Questions & Solutions

### Q1: Linear vs Logistic - Conceptual

**Q:** "Why can't we use linear regression for classification?"

**A:**
```
Linear regression predicts continuous values without bounds.

Example problem:
  Task: Classify email as spam (1) or legit (0)
  
  Linear model: ŷ = -0.5 + 0.2×word_count
  
  Results:
    word_count = 1 → ŷ = -0.3 (negative! But probability must be 0-1)
    word_count = 10 → ŷ = 1.5 (>1! Invalid probability)
    word_count = 100 → ŷ = 19.5 (meaningless!)

Solutions that Logistic Regression provides:
  1. Bounds output to [0, 1] using sigmoid
  2. Outputs are valid probabilities
  3. Natural interpretation: P(spam)
  4. Appropriate loss function (log-loss)
  
Alternative answer could mention:
  • Least squares doesn't work (heteroscedasticity)
  • Assumes normal residuals (violates classification)
  • No probabilistic interpretation
```

---

### Q2: Sigmoid Function Calculation

**Q:**
```
Given logistic model: P(spam) = 1 / (1 + e^(-(−2 + 0.5×words)))

Email has 8 suspicious words. What's P(spam)?
```

**A:**
```
Step 1: Calculate linear combination (z)
z = -2 + 0.5×8
  = -2 + 4
  = 2

Step 2: Calculate e^(-z)
e^(-2) = 1/e^2 = 1/7.389 ≈ 0.135

Step 3: Calculate 1 + e^(-z)
1 + 0.135 = 1.135

Step 4: Calculate sigmoid
P(spam) = 1 / 1.135 ≈ 0.881

Answer: P(spam) ≈ 0.881 (88.1%)
Prediction: SPAM (since 0.881 > 0.5)
```

---

### Q3: Coefficient Interpretation

**Q:**
```
Fitted model: P(spam) = 1 / (1 + e^(-(-1.2 + 2.5×links - 1.8×reputation)))

Interpret coefficients:
```

**A:**
```
b₀ = -1.2 (intercept):
  When links=0, reputation=0:
  P = 1/(1+e^1.2) = 1/4.32 ≈ 0.23
  Baseline: 23% spam when all features neutral

b₁ = 2.5 (links coefficient):
  ✓ Positive → Having links increases spam probability
  ✓ Each link increases log-odds by 2.5
  ✓ e^2.5 ≈ 12.2 → Odds multiply by 12.2 per link!
  ✓ Strongest predictor

b₂ = -1.8 (reputation coefficient):
  ✓ Negative → Higher reputation decreases spam probability
  ✓ Each 0.1 increase in reputation decreases log-odds by 0.18
  ✓ Makes sense: trusted senders don't spam

Business insight:
  Focus on: Links (high impact) > Reputation (medium impact)
```

---

### Q4: Multi-class OvR Logic

**Q:**
```
Using One-vs-Rest for 3-class email classification (Work, Personal, Spam):

If classifiers output:
  P(Work) = 0.6
  P(Personal) = 0.3
  P(Spam) = 0.1

What's the final prediction?
```

**A:**
```
Final prediction: WORK

Reasoning:
  Choose class with highest probability
  max(0.6, 0.3, 0.1) = 0.6 = Work
  
  → Predict: Work

Note: Sum ≠ 1.0
  (0.6 + 0.3 + 0.1 = 1.0 in this case, but not guaranteed)
  This is why One-vs-One or Softmax is sometimes preferred
  (they ensure probabilities sum to 1)
```

---

### Q5: Confusion Matrix with Logistic Regression

**Q:**
```
Logistic regression on 100 emails:

Predictions:  [1, 0, 1, 1, 0, 0, 1, 0, 1, 0, ...]
Actual:       [1, 0, 0, 1, 0, 1, 1, 0, 1, 0, ...]
                TP TN FP TP TN FN TP TN TP TN

Across all 100:
  TP = 35 (correctly classified spam)
  FN = 5  (missed spam)
  FP = 8  (false positives)
  TN = 52 (correctly classified legit)

Calculate: Accuracy, Precision, Recall, F1
```

**A:**
```
Accuracy = (TP + TN) / (TP + TN + FP + FN)
         = (35 + 52) / (35 + 52 + 8 + 5)
         = 87 / 100
         = 0.87 = 87%

Precision = TP / (TP + FP)
          = 35 / (35 + 8)
          = 35 / 43
          = 0.814 ≈ 81.4%
  (Of predicted spam, 81.4% are actually spam)

Recall = TP / (TP + FN)
       = 35 / (35 + 5)
       = 35 / 40
       = 0.875 = 87.5%
  (We catch 87.5% of actual spam)

F1 = 2 × (Precision × Recall) / (Precision + Recall)
   = 2 × (0.814 × 0.875) / (0.814 + 0.875)
   = 2 × 0.712 / 1.689
   = 1.425 / 1.689
   = 0.844 ≈ 84.4%
```

---

### Q6: Threshold Adjustment Impact

**Q:**
```
Current threshold: 0.5
Current: Precision=0.9, Recall=0.7

If we lower threshold to 0.3:
a) What happens to precision?
b) What happens to recall?
c) Business implication?
```

**A:**
```
a) Precision will DECREASE:
   Reasoning: Lowering threshold means more positive predictions
             Some will be wrong → More false positives
             More FP → Lower precision

b) Recall will INCREASE:
   Reasoning: Lowering threshold means catch more positives
             Some true positives now above threshold
             Fewer false negatives → Higher recall

c) Business implication:
   Trade-off depends on cost:
   
   If cost(false negative) >> cost(false positive):
     → Lower threshold (catch more positives)
     → Accept lower precision
     Example: Medical diagnosis (missing disease > false alarms)
   
   If cost(false positive) >> cost(false negative):
     → Raise threshold (fewer false alarms)
     → Accept lower recall
     Example: Loan approval (false positive = financial loss)
```

---

### Q7: Model Comparison - Logistic vs Linear

**Q:**
```
Building spam detector:

Model A: Linear Regression
  Test RMSE = 0.35
  Output: Any number (not bounded)

Model B: Logistic Regression
  Test Accuracy = 87%
  Precision = 81%
  Recall = 88%

Which should you use for production?
```

**A:**
```
Use: Model B (Logistic Regression)

Reasons:

1. Appropriate for problem:
   Logistic = classification (binary output)
   Linear = regression (continuous output)
   
2. RMSE not comparable to Accuracy:
   Model A output: [−0.2, 0.8, 1.5, 0.2]
   Meaningless without threshold
   
3. Model B proper metrics:
   Accuracy = 87% (high)
   Precision = 81% (few false alarms)
   Recall = 88% (catch most spam)
   
4. Interpretability:
   Model B: "88% of spam gets caught"
   Model A: "RMSE is 0.35" (What does this mean for email?)

Lesson: Choose appropriate algorithm for problem type
        Classification → Classification algorithm
        Regression → Regression algorithm
```

---

## Part 10: Practice Problems

### Problem 1: Calculate Probabilities

```
Email model: P(spam) = 1 / (1 + e^(-(-0.5 + 0.8×suspicious_words)))

Calculate P(spam) for:
a) suspicious_words = 0
b) suspicious_words = 5
c) suspicious_words = 10

Make predictions (threshold 0.5)
```

### Problem 2: Interpret Multi-class

```
One-vs-Rest classification on 4-class problem:

Classes: Urgent, Important, Routine, Low Priority

Classifier outputs:
  P(Urgent) = 0.7
  P(Important) = 0.2
  P(Routine) = 0.05
  P(Low) = 0.05

Questions:
a) What's the prediction?
b) Would you use Softmax instead? Why?
c) Calculate probabilities if they should sum to 1
```

### Problem 3: Threshold Optimization

```
Current email classifier (threshold 0.5):
  TP=80, FN=20, FP=10, TN=90
  (on 200 emails)

If you lower threshold to 0.3:
  TP=92, FN=8, FP=18, TN=82

Questions:
a) Calculate metrics for both thresholds
b) Which is better? Why?
c) Business context: Is speed or safety more important?
```

---

## Part 11: Key Takeaways

### When to Use Logistic Regression

```
✓ Binary classification (yes/no, spam/ham, buy/not buy)
✓ Need probability outputs
✓ Want interpretable coefficients
✓ Linear decision boundary sufficient
✓ Baseline for comparison

✗ Multi-class (use Softmax instead)
✗ Non-linear boundaries (use SVM, Neural Networks)
✗ Very imbalanced data (needs adjustments)
✗ Many features (may overfit, use regularization)
```

### Common Mistakes

```
Mistake 1: Using accuracy alone for imbalanced data
  Fix: Use precision, recall, F1, ROC-AUC

Mistake 2: Not adjusting threshold for business needs
  Fix: Evaluate at multiple thresholds

Mistake 3: Ignoring coefficients' signs/magnitude
  Fix: Always interpret what they mean

Mistake 4: Comparing regression and classification metrics
  Fix: Use appropriate metrics for each type

Mistake 5: Assuming probabilities sum to 1 in OvR
  Fix: Use Softmax for guaranteed probability distribution
```

---

## Summary Table

| Concept | Formula/Definition |
|---------|-------------------|
| **Sigmoid** | σ(z) = 1/(1+e^(-z)) |
| **Logistic Model** | P(y=1) = 1/(1+e^(-(b₀+b₁x))) |
| **Log-Odds** | ln(P/(1-P)) = b₀ + b₁x |
| **Decision Rule** | P ≥ 0.5 → Predict 1 |
| **OvR Classes** | k classifiers for k classes |
| **Softmax** | P(y=j) = e^(z_j)/Σe^(z_i) |
| **Loss** | Log-loss penalizes confident mistakes |

---

## Tips for CT Exam

### ✅ DO

- **Always interpret coefficients** (positive/negative, magnitude)
- **Discuss threshold tradeoffs** (precision vs recall)
- **Calculate probabilities step-by-step** showing all work
- **Use confusion matrix** for classification problems
- **Compare OvR vs Softmax** for multi-class
- **Mention assumptions** (linear decision boundary, etc.)

### ❌ DON'T

- Don't use linear regression for classification
- Don't forget sigmoid function bounds output to [0,1]
- Don't mix up probability and odds
- Don't use accuracy alone for imbalanced data
- Don't assume OvR probabilities sum to 1
- Don't ignore threshold impacts on metrics

---

## Next Topics

→ [Classification Advanced](./03-classification-advanced.md)  
→ [Model Comparison](./04-model-comparison.md)  
→ [Cross-Validation](./01-cross-validation.md) (review for evaluation)

