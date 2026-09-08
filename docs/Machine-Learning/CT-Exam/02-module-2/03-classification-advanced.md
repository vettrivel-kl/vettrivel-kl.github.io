---
sidebar_position: 3
title: Classification Advanced - Metrics & ROC Curves
description: ROC curves, AUC, Precision-Recall curves, threshold tuning, and multi-class metrics with worked examples for CT exam
tags: [roc-curve, auc, precision-recall, threshold-tuning, classification-metrics, multi-class]
---

# Classification Advanced: Metrics & ROC Curves

## Overview

Beyond accuracy and basic metrics, advanced classification evaluation uses curves and thresholds to understand true model performance.

```
Core Concepts:
  • Decision threshold: Where to draw the line (0.5 is default)
  • ROC Curve: Shows all possible threshold tradeoffs
  • AUC: Area under ROC curve (single number summary)
  • Precision-Recall: Better for imbalanced datasets
  • Multi-class extension: Per-class and averaged metrics
```

---

## Part 1: Decision Threshold

### What is a Decision Threshold?

```
Logistic Regression outputs: P(y=1) between 0 and 1

Default rule:
  If P(y=1) ≥ 0.5 → Predict class 1 (positive)
  If P(y=1) < 0.5  → Predict class 0 (negative)

But 0.5 is arbitrary!
We can adjust the threshold for different tradeoffs.
```

### Example: Email Spam Detection

```
Logistic model outputs probabilities:

Email 1: P(spam) = 0.92 → Predict SPAM (if threshold = 0.5)
Email 2: P(spam) = 0.48 → Predict HAM (if threshold = 0.5)
Email 3: P(spam) = 0.55 → Predict SPAM (if threshold = 0.5)

With threshold = 0.5:
  All three predictions clear-cut

What if threshold = 0.6?
Email 1: P(spam) = 0.92 ≥ 0.6 → Still SPAM
Email 2: P(spam) = 0.48 < 0.6  → Still HAM
Email 3: P(spam) = 0.55 < 0.6  → Now HAM! (changed!)

What if threshold = 0.3?
Email 1: P(spam) = 0.92 ≥ 0.3 → Still SPAM
Email 2: P(spam) = 0.48 ≥ 0.3 → Now SPAM! (changed!)
Email 3: P(spam) = 0.55 ≥ 0.3 → Still SPAM
```

### Impact on Metrics

```
Threshold = 0.3 (Low - catch more spam):
  ✓ Higher recall (fewer false negatives)
  ✗ Lower precision (more false positives)

Threshold = 0.5 (Default):
  ✓ Balanced between precision and recall
  
Threshold = 0.7 (High - be strict):
  ✗ Lower recall (miss more spam)
  ✓ Higher precision (fewer false alarms)
```

---

## Part 2: ROC Curve (Receiver Operating Characteristic)

### What is ROC Curve?

```
ROC Curve plots model performance at ALL possible thresholds.

X-axis: False Positive Rate (FPR)
Y-axis: True Positive Rate (TPR / Recall)

Formula:
  TPR = TP / (TP + FN)   = Recall
  FPR = FP / (FP + TN)   = Specificity complement
```

### Building a ROC Curve: Step by Step

```
Data: 10 emails (5 spam, 5 ham)

Model outputs probabilities:
Email  Actual  P(spam)
1      Spam    0.95
2      Ham     0.1
3      Spam    0.85
4      Spam    0.7
5      Ham     0.3
6      Spam    0.65
7      Ham     0.15
8      Spam    0.55
9      Ham     0.4
10     Ham     0.05

Sort by probability (descending):
Rank  Email  Actual  P(spam)  TP  FN  FP  TN   TPR   FPR
─────────────────────────────────────────────────────────
     Start                    0   5   0   5   0.0   0.0
1     1      Spam    0.95    1   4   0   5   0.20  0.0
2     3      Spam    0.85    2   3   0   5   0.40  0.0
3     4      Spam    0.7     3   2   0   5   0.60  0.0
4     6      Spam    0.65    4   1   0   5   0.80  0.0
5     8      Spam    0.55    5   0   0   5   1.00  0.0
6     9      Ham     0.4     5   0   1   4   1.00  0.20
7     5      Ham     0.3     5   0   2   3   1.00  0.40
8     7      Ham     0.15    5   0   3   2   1.00  0.60
9     2      Ham     0.1     5   0   4   1   1.00  0.80
10    10     Ham     0.05    5   0   5   0   1.00  1.00
```

### ROC Curve Points

```
Plot points (FPR, TPR):

Threshold     Point
─────────────────────
∞ (none)     (0.0, 0.0)    - Predict all as 0
0.95         (0.0, 0.2)
0.85         (0.0, 0.4)
0.70         (0.0, 0.6)
0.65         (0.0, 0.8)
0.55         (0.0, 1.0)    - All spam caught
0.40         (0.2, 1.0)    - 1 false positive
0.30         (0.4, 1.0)    - 2 false positives
0.15         (0.6, 1.0)    - 3 false positives
0.10         (0.8, 1.0)    - 4 false positives
0.05         (1.0, 1.0)    - Predict all as 1
-∞ (all)     (1.0, 1.0)    - All predicted as 1

ROC Curve visual:
    TPR
    1.0├─────────────●
       │           ╱│
    0.8├────────●  │ ●
       │      ╱    │╱
    0.6├──────● ─ ─ ─ Random classifier
       │    ╱      │   (diagonal line)
    0.4├────●      │
       │  ╱        │
    0.2├─●─────────●
       │            │
    0.0├────────────┴─→ FPR
       0.0  0.2 0.4 0.6 0.8 1.0
       
Good model: Curve bends to top-left
Random model: Diagonal line
```

### ROC-AUC (Area Under Curve)

```
AUC = Area under ROC curve

Interpretation:

AUC = 1.0:  Perfect classification
  Curve reaches top-left corner
  All positives ranked before negatives

AUC = 0.5:  Random guessing
  Diagonal line
  Model has no discriminative power

AUC = 0.0:  Worst possible
  Curve reaches bottom-right corner
  Predictions inverted

Scale:
  0.9-1.0: Excellent
  0.8-0.9: Good
  0.7-0.8: Fair
  0.6-0.7: Poor
  0.5-0.6: Very Poor
  0.5:     Random
```

### Calculating AUC

```
Method 1: Trapezoid rule
  Approximate area under curve by summing trapezoids

Method 2: Mann-Whitney U statistic
  AUC = P(positive_score > negative_score)
  
For our example:
  Positive scores: [0.95, 0.85, 0.7, 0.65, 0.55]
  Negative scores: [0.1, 0.3, 0.15, 0.4, 0.05]
  
  Compare every positive vs every negative
  Positive > Negative: 5×5 = 25 comparisons
  Positive > Negative count: 25 (all positive scores > all negative)
  
  AUC = 25 / 25 = 1.0 (perfect!)
```

---

## Part 3: Worked Example - ROC Curve with Real Data

### Problem: Medical Diagnosis

```
Dataset: 50 patients (20 diseased, 30 healthy)

ML model outputs disease probability for each patient:

Patient  Actual_Disease  P(Disease)
1        Yes             0.95
2        No              0.05
3        Yes             0.92
4        No              0.08
5        Yes             0.88
...
(simplified - showing key points)
```

### Step 1: Sort by Probability

```
Rank by P(Disease) descending:

Threshold  Actual   P(Disease)  TP  FN  FP  TN   TPR    FPR
────────────────────────────────────────────────────────────
∞          -        -           0   20  0   30   0.00   0.00
0.95       Yes      0.95        1   19  0   30   0.05   0.00
0.92       Yes      0.92        2   18  0   30   0.10   0.00
0.88       Yes      0.88        3   17  0   30   0.15   0.00
...
0.40       No       0.40        15  5   2   28   0.75   0.07
...
0.05       No       0.05        19  1   8   22   0.95   0.27
-∞         -        -           20  0   30  0    1.00   1.00
```

### Step 2: Plot ROC Curve

```
Plot all (FPR, TPR) points:

        TPR
    1.0 ├─────────────●
        │           ╱│
    0.75├────────●   │
        │      ╱  ╲  │
    0.50├───●      ╲ │ Good model
        │ ╱         ╲│ (area substantial)
    0.25├●───────────●
        │            │
    0.0 ├────────────┴─→ FPR
        0.0   0.25   0.5  0.75  1.0

Key points:
  (0.0, 0.05):   Very high threshold (catch very few)
  (0.0, 0.50):   High threshold (moderate catch)
  (0.27, 0.95):   Low threshold (catch most, many false alarms)
  (1.0, 1.0):    No threshold (predict all diseased)
```

### Step 3: Calculate AUC

```
Method: Trapezoid Rule

Area ≈ Sum of trapezoid areas:

A₁ = (0.00 + 0.05) / 2 × (0.00 - 0.00) = 0
A₂ = (0.05 + 0.15) / 2 × (0.01 - 0.00) = 0.001
A₃ = (0.15 + 0.50) / 2 × (0.10 - 0.01) = 0.0293
...
(many more trapezoids)

Total AUC ≈ 0.92

Interpretation:
  AUC = 0.92 → Excellent (0.9-1.0 range)
  Model correctly ranks diseased > healthy 92% of the time
```

### Step 4: Compare with Baseline

```
Random classifier:
  AUC = 0.5 (diagonal line)
  
Our model:
  AUC = 0.92
  
Improvement:
  0.92 - 0.5 = 0.42 (significant!)
  Our model is 84% better than random
  (0.42 / 0.5 = 0.84)
```

---

## Part 4: Precision-Recall Curve

### When to Use PR Curve vs ROC?

```
ROC Curve:
  ✓ Good for balanced datasets
  ✓ Shows all threshold tradeoffs
  ✓ AUC is standard metric
  ✗ Can be misleading with imbalanced data

Precision-Recall Curve:
  ✓ Better for imbalanced datasets
  ✓ Focuses on positive class performance
  ✓ More relevant to most problems
  ✗ AUC less standardized

Example: Email dataset (99% ham, 1% spam)
  ROC: Can appear good even with poor spam detection
  PR: Better reflects actual performance on spam
```

### Building Precision-Recall Curve

```
Same data as before, but plot:
  X-axis: Recall = TP / (TP + FN)
  Y-axis: Precision = TP / (TP + FP)

Example points:

Threshold  TP  FN  FP  TN   Recall  Precision
──────────────────────────────────────────────
0.95       1   19  0   30   0.05    1.00
0.92       2   18  0   30   0.10    1.00
0.88       3   17  0   30   0.15    1.00
0.70       10  10  1   29   0.50    0.91
0.40       15  5   2   28   0.75    0.88
0.10       19  1   5   25   0.95    0.79

PR Curve visual:
        Precision
    1.0 ├─────────●
        │        ╱│
    0.8 ├───────● │
        │      ╱  │
    0.6 ├─────●   │
        │   ╱     │
    0.4 ├──●──────● Random baseline
        │         │ (horizontal at P = TP/total)
    0.2 ├─────────┴─→ Recall
        0.0  0.25  0.5  0.75  1.0

Good model: Curve stays high
Random model: Drops quickly
```

### AP (Average Precision)

```
Average Precision = Area under Precision-Recall curve

Similar to AUC but for PR space

Advantages:
  ✓ Better for imbalanced datasets
  ✓ Reflects business impact
  ✓ Accounts for positive class difficulty

Example:
  AP = 0.87 (on imbalanced medical dataset)
  Means: 87% average precision across all recalls
```

---

## Part 5: Threshold Tuning

### Cost-Based Threshold Selection

```
Different applications have different costs:

Medical Diagnosis:
  Cost(False Negative) = ₹100,000 (patient dies)
  Cost(False Positive) = ₹5,000 (unnecessary treatment)
  Ratio: 100,000 / 5,000 = 20
  
  Optimal threshold: Lower (0.3 instead of 0.5)
  Maximize recall, accept lower precision

Credit Card Fraud:
  Cost(False Negative) = ₹50,000 (fraud processed)
  Cost(False Positive) = ₹100 (customer inconvenience)
  Ratio: 50,000 / 100 = 500
  
  Optimal threshold: Very low (0.1)
  Catch almost all fraud

Spam Detection:
  Cost(False Negative) = Mild (user inconvenience)
  Cost(False Positive) = Severe (delete important email)
  Ratio: 1 / 10 = 0.1
  
  Optimal threshold: High (0.8)
  Minimize false positives
```

### Finding Optimal Threshold

```
Method 1: Youden's Index

J = Sensitivity + Specificity - 1
  = TPR + (1 - FPR) - 1
  = TPR - FPR

Find threshold that maximizes J

Example:
Threshold  TPR   FPR   J = TPR - FPR
──────────────────────────────────────
0.9        0.85  0.05  0.80
0.7        0.92  0.08  0.84  ← Maximum
0.5        0.95  0.15  0.80
0.3        0.98  0.25  0.73

Optimal threshold: 0.7
```

### Complete Worked Example: Fraud Detection

```
Data: 1000 transactions (50 fraud, 950 legitimate)

Fraud costs ₹10,000 per missed fraud
False alarm costs ₹100 per false positive

Calculate expected cost at different thresholds:

Threshold  TP  FN  FP  TN   
───────────────────────────────
0.3        45  5   45  905
  Cost = 5×10,000 + 45×100 = ₹54,500

0.5        48  2   20  930
  Cost = 2×10,000 + 20×100 = ₹22,000  ← Minimum

0.7        50  0   5   945
  Cost = 0×10,000 + 5×100 = ₹500     ← Even better!

0.9        48  2   2   948
  Cost = 2×10,000 + 2×100 = ₹20,200

Optimal: 0.7 (lowest cost)
```

---

## Part 6: Multi-Class Metrics

### Per-Class Metrics

```
Multi-class example: Email classification
Classes: Work (0), Personal (1), Spam (2)

Confusion Matrix (3x3):
            Predicted
        W   P   S
Actual W [80  15  5]
       P [10  75  15]
       S [2   3   95]

Calculate metrics for each class:

CLASS 0 (Work):
  TP₀ = 80, FN₀ = 15+5 = 20, FP₀ = 10+2 = 12
  Precision₀ = 80 / (80+10+2) = 0.84
  Recall₀ = 80 / (80+15+5) = 0.80

CLASS 1 (Personal):
  TP₁ = 75, FN₁ = 15+15 = 30, FP₁ = 15+3 = 18
  Precision₁ = 75 / (75+15+3) = 0.81
  Recall₁ = 75 / (75+15+15) = 0.71

CLASS 2 (Spam):
  TP₂ = 95, FN₂ = 5+15 = 20, FP₂ = 5+3 = 8
  Precision₂ = 95 / (95+5+3) = 0.90
  Recall₂ = 95 / (95+5+15) = 0.86
```

### Averaging Strategies

#### Macro Averaging

```
Average across classes equally (regardless of support)

Macro Precision = (0.84 + 0.81 + 0.90) / 3 = 0.85
Macro Recall = (0.80 + 0.71 + 0.86) / 3 = 0.79
Macro F1 = (2×0.85×0.79) / (0.85+0.79) = 0.82

When to use:
  ✓ All classes equally important
  ✓ Small classes shouldn't be ignored
  ✓ You want balanced treatment
```

#### Micro Averaging

```
Pool all TP, FP, FN across classes

Total TP = 80 + 75 + 95 = 250
Total FP = 12 + 18 + 8 = 38
Total FN = 20 + 30 + 20 = 70

Micro Precision = 250 / (250 + 38) = 0.87
Micro Recall = 250 / (250 + 70) = 0.78
Micro F1 = (2×0.87×0.78) / (0.87+0.78) = 0.82

When to use:
  ✓ Class distribution reflects real-world importance
  ✓ Large classes should have more influence
  ✓ Overall accuracy is what matters
```

#### Weighted Averaging

```
Average per-class metrics weighted by class size

Class sizes:
  Class 0: 100 samples (33.3%)
  Class 1: 100 samples (33.3%)
  Class 2: 100 samples (33.3%)

Weighted Precision = 0.84×0.333 + 0.81×0.333 + 0.90×0.333 = 0.85
Weighted Recall = 0.80×0.333 + 0.71×0.333 + 0.86×0.333 = 0.79

When to use:
  ✓ Unequal class sizes matter
  ✓ Want to reflect class distribution
  ✓ Most realistic metric
```

---

## Part 7: Complete Worked Example - Banking Loan Classification

### Problem Setup

```
Dataset: 500 loan applications
Classes:
  • Approved (0): 350 applications
  • Rejected (1): 100 applications  
  • Pending (2): 50 applications

Task: Evaluate classifier performance on test set
```

### Step 1: Predictions

```
Confusion Matrix:

            Predicted
        App Rej Pend
Actual App [320  25   5]
       Rej [ 15  80   5]
       Pend[ 3   2   45]

(Test set: 350 approved, 100 rejected, 50 pending)
```

### Step 2: Per-Class Metrics

```
CLASS 0 (APPROVED):
  TP₀ = 320, FN₀ = 25+5 = 30, FP₀ = 15+3 = 18
  Accuracy₀ = (320+400)/(500) = 0.92 (overall)
  Precision₀ = 320/(320+15+3) = 0.95
  Recall₀ = 320/(320+25+5) = 0.91
  F1₀ = 2×(0.95×0.91)/(0.95+0.91) = 0.93

CLASS 1 (REJECTED):
  TP₁ = 80, FN₁ = 25+5 = 30, FP₁ = 25+2 = 27
  Precision₁ = 80/(80+25+2) = 0.74
  Recall₁ = 80/(80+25+5) = 0.67
  F1₁ = 2×(0.74×0.67)/(0.74+0.67) = 0.70

CLASS 2 (PENDING):
  TP₂ = 45, FN₂ = 5+5 = 10, FP₂ = 5+2 = 7
  Precision₂ = 45/(45+5+2) = 0.82
  Recall₂ = 45/(45+5+5) = 0.82
  F1₂ = 2×(0.82×0.82)/(0.82+0.82) = 0.82
```

### Step 3: Averaged Metrics

```
MACRO AVERAGE (equal weight):
  Precision = (0.95 + 0.74 + 0.82) / 3 = 0.84
  Recall = (0.91 + 0.67 + 0.82) / 3 = 0.80
  F1 = (0.93 + 0.70 + 0.82) / 3 = 0.82

WEIGHTED AVERAGE (by class size):
  Weights: [350/500, 100/500, 50/500] = [0.7, 0.2, 0.1]
  
  Precision = 0.95×0.7 + 0.74×0.2 + 0.82×0.1 = 0.895
  Recall = 0.91×0.7 + 0.67×0.2 + 0.82×0.1 = 0.833
  F1 = 0.93×0.7 + 0.70×0.2 + 0.82×0.1 = 0.864

MICRO AVERAGE (pool all):
  Total TP = 320 + 80 + 45 = 445
  Total FP = 18 + 27 + 7 = 52
  Total FN = 30 + 30 + 10 = 70
  
  Precision = 445 / (445+52) = 0.895
  Recall = 445 / (445+70) = 0.864
  F1 = 0.879
```

### Step 4: Interpretation & Inference

```
Model Performance Summary:

STRENGTHS:
  ✓ Approved class: 95% precision, 91% recall (excellent)
  ✓ Pending class: 82% on both metrics (good balance)
  ✓ Overall weighted F1 = 0.864 (strong)

WEAKNESSES:
  ✗ Rejected class: 74% precision, 67% recall (poor)
  ✗ Confuses rejected with approved in 25 cases
  ✗ Only catches 67% of actual rejections

BUSINESS IMPLICATION:
  The model is BIASED toward approving loans!
  
  Cost analysis:
    False approval (Actual Rej → Pred App): 15 cases
    → Risk: ₹15M (assuming ₹1M loss per false approval)
    
    False rejection (Actual App → Pred Rej): 25 cases
    → Loss: ₹2.5M (assuming ₹100K lost opportunity per denial)
    
    Total risk: ₹17.5M per 500 applications

RECOMMENDATION:
  ✓ Use Pending class as intermediate approval check
  ✓ Retrain model to balance classes
  ✓ Adjust decision threshold to reduce false approvals
  ✓ Consider cost-weighted loss function
```

---

## Part 8: Exam Questions & Solutions

### Q1: ROC vs Precision-Recall

**Q:** "When would you use ROC-AUC instead of Precision-Recall curve?"

**A:**
```
ROC-AUC is better when:
  ✓ Dataset is balanced
  ✓ Both FP and FN are equally important
  ✓ You want a standard benchmark metric
  ✓ Comparing multiple models needed

Example: Customer satisfaction classification
  Classes: Happy (70%), Neutral (20%), Sad (10%)
  ROC-AUC still useful (not too imbalanced)

Precision-Recall is better when:
  ✓ Dataset is imbalanced (1% positive class)
  ✓ Positive class is more important
  ✓ You care about precision specifically
  
Example: Disease diagnosis (0.5% disease prevalence)
  PR curve more informative than ROC
```

---

### Q2: Calculate AUC Interpretation

**Q:** 
```
Model 1 AUC = 0.92
Model 2 AUC = 0.58
Random classifier AUC = 0.50

Interpret these results.
```

**A:**
```
Model 1 (AUC = 0.92):
  ✓ Excellent performance (0.9-1.0 range)
  ✓ 92% chance it ranks random positive > random negative
  ✓ Much better than random (0.92 vs 0.50)
  ✓ Ready for production

Model 2 (AUC = 0.58):
  ✗ Only slightly better than random (0.58 vs 0.50)
  ✗ 58% chance it ranks positive > negative (barely)
  ✗ Not reliable for decisions
  ✗ Needs significant improvement

Recommendation: Use Model 1, discard Model 2
```

---

### Q3: Threshold Optimization

**Q:**
```
Current threshold: 0.5
Metrics: Precision=0.9, Recall=0.7

If medical diagnosis where missing disease = ₹100,000
and false alarm = ₹1,000:

Should you adjust threshold? To what?
```

**A:**
```
Cost Ratio = 100,000 / 1,000 = 100

Current (threshold 0.5):
  Expected cost per prediction:
  = P(FN)×100,000 + P(FP)×1,000
  = 0.3×100,000 + 0.1×1,000  (roughly)
  = ₹31,000

Recommendation: LOWER threshold (e.g., 0.3)

Why:
  ✓ Cost of missing disease (₹100K) >> false alarm (₹1K)
  ✓ Lower threshold → Higher recall (catch more)
  ✓ Trade-off: Higher false positives acceptable

With threshold = 0.3:
  Expected recall: ~0.95 (catch most diseases)
  Expected precision: ~0.7 (more false alarms)
  Expected cost: 0.05×100,000 + 0.3×1,000 = ₹5,300 (much better!)
```

---

### Q4: Multi-Class Averaging

**Q:**
```
3-class problem (50 test samples):
  Class A (30 samples): Precision=0.9, Recall=0.8
  Class B (15 samples): Precision=0.8, Recall=0.9
  Class C (5 samples):  Precision=0.6, Recall=0.6

Calculate macro and weighted F1-scores.
```

**A:**
```
MACRO F1 (equal weight):
  F1_A = 2×(0.9×0.8)/(0.9+0.8) = 1.44/1.7 = 0.847
  F1_B = 2×(0.8×0.9)/(0.8+0.9) = 1.44/1.7 = 0.842
  F1_C = 2×(0.6×0.6)/(0.6+0.6) = 0.72/1.2 = 0.600
  
  Macro F1 = (0.847 + 0.842 + 0.600) / 3 = 0.763

WEIGHTED F1 (by class size):
  Weights: [30/50, 15/50, 5/50] = [0.6, 0.3, 0.1]
  
  Weighted F1 = 0.847×0.6 + 0.842×0.3 + 0.600×0.1
              = 0.508 + 0.253 + 0.060
              = 0.821

Interpretation:
  Macro F1 (0.763): Treats all classes equally (Class C dragging score)
  Weighted F1 (0.821): Class A dominates (higher weight)
  Use weighted for realistic performance
```

---

### Q5: Confusion Matrix to Metrics

**Q:**
```
Medical test confusion matrix (100 test cases):
            Predicted
        Disease  Healthy
Actual D  [85      15]
       H  [10      90]

Calculate: Sensitivity, Specificity, Precision, Recall, F1
```

**A:**
```
TP = 85 (correctly identified disease)
FN = 15 (missed disease)
FP = 10 (false positive)
TN = 90 (correctly identified healthy)

Sensitivity = TP / (TP+FN) = 85/100 = 0.85
  (Recall: Of actual disease cases, 85% detected)

Specificity = TN / (FP+TN) = 90/100 = 0.90
  (Of actual healthy, 90% correctly identified)

Precision = TP / (TP+FP) = 85/95 = 0.895
  (Of predicted disease, 89.5% actually have disease)

Recall = TP / (TP+FN) = 85/100 = 0.85
  (Same as Sensitivity in binary case)

F1 = 2×(Precision×Recall) / (Precision+Recall)
   = 2×(0.895×0.85) / (0.895+0.85)
   = 1.521 / 1.745
   = 0.872

All metrics: Sensitivity 85%, Specificity 90%, F1 87%
Evaluation: Very good test (high on all measures)
```

---

## Part 9: Practice Problems

### Problem 1: ROC Curve Construction

```
Build ROC curve from predictions:

Patient  Actual  P(Disease)
1        Yes     0.9
2        No      0.1
3        Yes     0.8
4        No      0.2
5        Yes     0.7
6        No      0.3
7        Yes     0.6
8        No      0.4
9        Yes     0.5
10       No      0.05

Tasks:
a) Sort by probability
b) Calculate TPR and FPR at each threshold
c) Plot rough ROC curve
d) Estimate AUC
```

### Problem 2: Threshold Selection

```
Cost-benefit analysis:

Fraud detection model outputs probabilities
Cost(False Negative) = ₹50,000 per fraud
Cost(False Positive) = ₹200 per false alarm

Current threshold = 0.5:
  At this point: 5% miss rate, 2% false alarm rate

Lower to 0.3:
  Miss rate drops to 1%, false alarm rate rises to 8%

Lower to 0.1:
  Miss rate drops to 0.5%, false alarm rate rises to 15%

Questions:
a) Calculate expected cost at each threshold
b) Which threshold is optimal?
c) What if you lower cost of false alarm to ₹50?
```

### Problem 3: Multi-Class Metrics

```
4-class sentiment analysis:
Classes: Positive (400), Neutral (300), Negative (200), Spam (100)

Confusion Matrix:
            Pos  Neu  Neg  Spam
Pos        [380  15   5    0]
Neu        [20   270  8    2]
Neg        [5    15   180  0]
Spam       [0    2    0    98]

Calculate:
a) Per-class F1 scores
b) Macro F1
c) Weighted F1
d) Which metric best represents performance?
```

---

## Part 10: Key Takeaways

### When to Use Each Metric

| Scenario | Best Metric | Why |
|----------|------------|-----|
| **Balanced data** | Accuracy, F1 | All classes equally important |
| **Imbalanced data** | Precision, Recall, F1 | Accuracy misleading |
| **Medical diagnosis** | Recall (Sensitivity) | Missing disease is costly |
| **Spam detection** | Precision | False positives unacceptable |
| **Model comparison** | ROC-AUC (balanced) / PR-AUC (imbalanced) | Single number summary |
| **Threshold-sensitive** | ROC/PR curves | See all tradeoffs |

### Red Flags

```
🚩 High accuracy on imbalanced data
   → Check precision, recall, F1 instead

🚩 ROC-AUC excellent but PR-AUC poor
   → Likely imbalanced dataset
   → Use PR-AUC for decisions

🚩 Macro and weighted metrics differ greatly
   → Class sizes matter
   → Use weighted for realistic performance

🚩 Specificity high but recall low
   → Threshold too high
   → Too many false negatives
```

---

## Summary Table

| Metric | Formula | When Use | Range |
|--------|---------|----------|-------|
| **Sensitivity (Recall)** | TP/(TP+FN) | Minimize FN cost | 0-1 |
| **Specificity** | TN/(FP+TN) | Minimize FP cost | 0-1 |
| **Precision** | TP/(TP+FP) | Reduce false alarms | 0-1 |
| **F1-Score** | 2PR/(P+R) | Balance both | 0-1 |
| **AUC-ROC** | Area under ROC | Model comparison | 0-1 |
| **AUC-PR** | Area under PR | Imbalanced data | 0-1 |

---

## Tips for CT Exam

### ✅ DO

- **Calculate both precision and recall** (different purposes)
- **Plot ROC/PR curves** when asked about thresholds
- **Use appropriate averaging** (macro vs weighted)
- **Interpret AUC in context** (what does 0.92 mean practically?)
- **Consider costs** when selecting threshold

### ❌ DON'T

- Don't use accuracy alone for imbalanced data
- Don't confuse sensitivity and specificity
- Don't ignore multi-class considerations
- Don't forget to average properly
- Don't choose threshold without cost analysis

---

## Next Topics

→ [Model Comparison](./04-model-comparison.md)  
→ [Cross-Validation](./01-cross-validation.md) (Review for evaluation)  
→ [Logistic Regression](./02-logistic-regression.md) (Review for classification)

