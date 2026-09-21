---
sidebar_position: 4
title: Solutions Guide
description: Complete solutions with step-by-step explanations for all 95+ practice problems
tags: [solutions, answers, explanations, reference]
---

# Complete Solutions Guide

This guide contains detailed solutions for all practice problems. Use this to check your work and understand problem-solving approaches.

:::tip How to Use This Guide

1. **Attempt problem first** - Don't peek at solutions
2. **Self-grade** - Compare your answer
3. **Review explanation** - Understand the methodology
4. **Read "Common Mistakes"** - Learn what NOT to do
5. **Try similar problem** - Reinforce learning

:::

---

## Module 1 Solutions

### Linear Regression Solutions

#### Solution 1.1: Calculate Regression Line

**Given Data:**
```
X: [500, 800, 1200, 1500]
Y: [50, 70, 100, 130] (in thousands)
```

**Step-by-step Solution:**

**Part a) Calculate means:**
```
X̄ = (500 + 800 + 1200 + 1500) / 4 = 4000 / 4 = 1000
Ȳ = (50 + 70 + 100 + 130) / 4 = 350 / 4 = 87.5
```

**Part b) Calculate slope (b₁):**
```
b₁ = Σ(xᵢ - X̄)(yᵢ - Ȳ) / Σ(xᵢ - X̄)²

Numerator calculation:
  (500-1000)(50-87.5) = (-500)(-37.5) = 18,750
  (800-1000)(70-87.5) = (-200)(-17.5) = 3,500
  (1200-1000)(100-87.5) = (200)(12.5) = 2,500
  (1500-1000)(130-87.5) = (500)(42.5) = 21,250
  
  Sum: 18,750 + 3,500 + 2,500 + 21,250 = 46,000

Denominator calculation:
  (500-1000)² = 250,000
  (800-1000)² = 40,000
  (1200-1000)² = 40,000
  (1500-1000)² = 250,000
  
  Sum: 580,000

b₁ = 46,000 / 580,000 ≈ 0.0793 ≈ 0.08
```

**Part c) Calculate intercept (b₀):**
```
b₀ = Ȳ - b₁×X̄
b₀ = 87.5 - 0.0793×1000
b₀ = 87.5 - 79.3
b₀ ≈ 8.2
```

**Part d) Fitted equation:**
```
ŷ = 8.2 + 0.08×X
```

**Part e) Prediction for 1000 sq ft:**
```
ŷ = 8.2 + 0.08×1000 = 8.2 + 80 = 88.2 thousand = $88,200
```

**Common Mistakes:**
- ❌ Forgetting to square differences in denominator
- ❌ Arithmetic errors when summing
- ❌ Rounding too early (keep more decimal places)
- ❌ Confusing which variable is X vs Y

---

#### Solution 1.2: Calculate SSE, MSE, RMSE

**Given:**
```
Model: ŷ = 10 + 0.08×X

Actual vs Predicted:
X=500:   ŷ=50k,   Actual=48k   (Residual: -2k)
X=800:   ŷ=74k,   Actual=75k   (Residual: +1k)
X=1200:  ŷ=106k,  Actual=105k  (Residual: -1k)
X=1500:  ŷ=130k,  Actual=132k  (Residual: +2k)
```

**Part a) Residuals:**
```
e₁ = 48 - 50 = -2
e₂ = 75 - 74 = +1
e₃ = 105 - 106 = -1
e₄ = 132 - 130 = +2
```

**Part b) SSE:**
```
SSE = Σeᵢ² = (-2)² + (1)² + (-1)² + (2)²
    = 4 + 1 + 1 + 4
    = 10
```

**Part c) MSE:**
```
MSE = SSE / n = 10 / 4 = 2.5
```

**Part d) RMSE:**
```
RMSE = √MSE = √2.5 ≈ 1.58 thousand = $1,580
```

**Part e) Interpretation:**
```
On average, predictions are off by about $1,580.
For house prices in $50-130k range, this is ~1.2-3.2% error.
Reasonable for a simple model, but room for improvement.
```

**Common Mistakes:**
- ❌ Forgetting to square residuals (SSE is "squared" error)
- ❌ Using n vs (n-1) in denominator (depends on context)
- ❌ Not taking square root for RMSE
- ❌ Confusing error sign (residual can be ± but SSE always ≥ 0)

---

### Bias-Variance Solutions

#### Solution 3.1: Bias-Variance Decomposition

**Given:**
```
Model A: Train 0.1, Test 0.11 (Gap: 0.01)
Model B: Train 0.05, Test 0.30 (Gap: 0.25)
Model C: Train 0.3, Test 0.32 (Gap: 0.02)
```

**Part a) Which has high bias?**
```
Answer: Model C

Reasoning:
- Training error = 0.30 (high!)
- Test error = 0.32 (also high, similar)
- Both train and test are bad → Model too simple
- Can't fit even training data well → HIGH BIAS
```

**Part b) Which has high variance?**
```
Answer: Model B

Reasoning:
- Training error = 0.05 (excellent!)
- Test error = 0.30 (terrible!)
- Huge gap (0.25) → Model fits train perfectly but fails on test
- Memorized training data → HIGH VARIANCE
```

**Part c) Which has good tradeoff?**
```
Answer: Model A

Reasoning:
- Training error: 0.1 (not perfect, acceptable)
- Test error: 0.11 (slightly higher, expected)
- Gap: 0.01 (tiny! Generalizes well)
- Balanced performance → GOOD BIAS-VARIANCE TRADEOFF
```

**Definitions:**
```
Bias: Error from oversimplifying (underfitting)
  - Model too simple to capture patterns
  - High training AND test error
  
Variance: Error from overfitting
  - Model too complex, captures noise
  - Low training, high test error
```

**Common Mistakes:**
- ❌ Thinking high training error means high variance (it's high BIAS)
- ❌ Confusing gap with variance (gap ≠ variance exactly)
- ❌ Saying Model A has overfitting (gap is too small)

---

## Module 2 Solutions

### Cross-Validation Solutions

#### Solution 1.1: 5-Fold CV Calculation

**Given:**
```
Fold 1: 0.25
Fold 2: 0.28
Fold 3: 0.22
Fold 4: 0.26
Fold 5: 0.29
```

**Part a) CV error (mean):**
```
CV Error = (0.25 + 0.28 + 0.22 + 0.26 + 0.29) / 5
         = 1.30 / 5
         = 0.26
```

**Part b) CV standard deviation:**
```
Mean = 0.26

Deviations from mean:
  0.25 - 0.26 = -0.01 → (-0.01)² = 0.0001
  0.28 - 0.26 = +0.02 → (+0.02)² = 0.0004
  0.22 - 0.26 = -0.04 → (-0.04)² = 0.0016
  0.26 - 0.26 = 0.00  → (0.00)² = 0.0000
  0.29 - 0.26 = +0.03 → (+0.03)² = 0.0009

Sum of squared deviations: 0.0030

Variance = 0.0030 / 5 = 0.0006
Std Dev = √0.0006 ≈ 0.024

(Note: Could use n-1 for sample std dev = 0.027)
```

**Part c) What does std dev tell you?**
```
Low std dev (0.024) means:
- Fold errors are consistent
- Each fold gives similar estimate
- Model generalizes consistently
- Results are reproducible
```

**Part d) Report result:**
```
CV MSE = 0.26 ± 0.024
```

**Part e) Is model stable?**
```
Answer: YES

Reasoning:
- Low std dev relative to mean (0.024 / 0.26 ≈ 9%)
- Small variation across folds
- Reliable error estimate
```

**Common Mistakes:**
- ❌ Dividing by (n-1) when shouldn't
- ❌ Forgetting to square deviations
- ❌ Calculating standard error instead of standard deviation
- ❌ Misinterpreting what std dev means

---

### Logistic Regression Solutions

#### Solution 2.1: Sigmoid Function

**Sigmoid: σ(z) = 1 / (1 + e^(-z))**

**Part a) σ(z=0):**
```
σ(0) = 1 / (1 + e^0) = 1 / (1 + 1) = 1/2 = 0.5
```

**Part b) σ(z=1):**
```
σ(1) = 1 / (1 + e^(-1))
     = 1 / (1 + 0.368)
     = 1 / 1.368
     ≈ 0.73
```

**Part c) σ(z=-1):**
```
σ(-1) = 1 / (1 + e^1)
      = 1 / (1 + 2.718)
      = 1 / 3.718
      ≈ 0.27
```

**Part d) σ(z=2):**
```
σ(2) = 1 / (1 + e^(-2))
     = 1 / (1 + 0.135)
     = 1 / 1.135
     ≈ 0.88
```

**Part e) σ(z=-2):**
```
σ(-2) = 1 / (1 + e^2)
      = 1 / (1 + 7.389)
      = 1 / 8.389
      ≈ 0.12
```

**Part b) Range of sigmoid:**
```
Answer: [0, 1]

As z → ∞: e^(-z) → 0, so σ(z) → 1/(1+0) = 1
As z → -∞: e^(-z) → ∞, so σ(z) → 1/∞ = 0
```

**Part c) When σ(z) = 0.5:**
```
0.5 = 1 / (1 + e^(-z))
1 + e^(-z) = 2
e^(-z) = 1
-z = 0
z = 0
```

**Part d & e) Limits:**
```
As z → ∞: σ → 1.0
As z → -∞: σ → 0.0
```

**Common Mistakes:**
- ❌ Computing e^z instead of e^(-z)
- ❌ Forgetting order of operations
- ❌ Rounding too early in intermediate steps
- ❌ Thinking sigmoid can go outside [0,1]

---

### Classification Metrics Solutions

#### Solution 3.2: Precision & Recall

**Given:**
```
Confusion matrix:
        Predicted Disease
        Yes  No
Actual  Yes  45  5
        No   10  440

Total positives: 50, Total negatives: 450
```

**Part a) Count TP, TN, FP, FN:**
```
TP = 45 (correctly predicted disease)
TN = 440 (correctly predicted no disease)
FP = 10 (predicted disease but didn't have)
FN = 5 (predicted no disease but had)
```

**Part b) Precision:**
```
Precision = TP / (TP + FP)
          = 45 / (45 + 10)
          = 45 / 55
          ≈ 0.82 = 82%

Interpretation: "Of positive predictions, 82% correct"
```

**Part c) Recall:**
```
Recall = TP / (TP + FN)
       = 45 / (45 + 5)
       = 45 / 50
       = 0.90 = 90%

Interpretation: "Of actual positives, 90% detected"
```

**Part d) Precision interpretation:**
```
"Of all people we predicted as having disease,
 82% actually had it (18% false alarms)"
```

**Part e) Recall interpretation:**
```
"Of all people who actually had disease,
 we detected 90% (missed 10%)"
```

**Common Mistakes:**
- ❌ Swapping numerator and denominator
- ❌ Confusing recall with specificity
- ❌ Not understanding what each measures
- ❌ Saying precision = TP/all predictions (should be TP/(TP+FP))

---

## Real-World Solutions

### Solution 1.1: Customer Churn Prediction

**Setup:**
```
100,000 customers, 5% churn (5,000 churners)
Intervention cost: $50/customer
Retained value: $5,000
Net benefit if saved: $5,000 - $50 = $4,950
```

**Model A:**
```
Precision: 0.60, Recall: 0.80

Predicted positives: 0.80 × 5,000 = 4,000 churners
Expected TP: 0.60 × 4,000 = 2,400 correct
Expected FP: 0.40 × 4,000 = 1,600 false alarms
Expected FN: 0.20 × 5,000 = 1,000 missed

Cost calculation:
  Interventions: 4,000 × $50 = $200,000
  Benefit (saved): 2,400 × $4,950 = $11,880,000
  Cost of missed: 1,000 × $5,000 = $5,000,000 loss
  
  Net: $11,880,000 - $200,000 - $5,000,000 = $6,680,000
```

**Model B:**
```
Precision: 0.75, Recall: 0.85

Predicted positives: 0.85 × 5,000 = 4,250 churners
Expected TP: 0.75 × 4,250 = 3,187 correct
Expected FP: 0.25 × 4,250 = 1,063 false alarms
Expected FN: 0.15 × 5,000 = 750 missed

Cost calculation:
  Interventions: 4,250 × $50 = $212,500
  Benefit (saved): 3,187 × $4,950 = $15,776,150
  Cost of missed: 750 × $5,000 = $3,750,000 loss
  
  Net: $15,776,150 - $212,500 - $3,750,000 = $11,813,650
```

**Comparison:**
```
Model A: $6,680,000 net benefit
Model B: $11,813,650 net benefit

Model B is better by $5.1M despite higher deployment cost!

ROI for Model B: ($11,813,650 - $50,000) / $50,000 = 23,527%
```

**Common Mistakes:**
- ❌ Using accuracy instead of precision/recall
- ❌ Forgetting deployment costs
- ❌ Not accounting for false negatives
- ❌ Calculating ROI wrong

---

## Quick Reference Index

### Formula Sheet

**Linear Regression:**
```
b₁ = Σ(xᵢ - X̄)(yᵢ - Ȳ) / Σ(xᵢ - X̄)²
b₀ = Ȳ - b₁×X̄
SSE = Σ(yᵢ - ŷᵢ)²
MSE = SSE / n
RMSE = √MSE
R² = 1 - (SSE / TSS)
```

**Cross-Validation:**
```
CV Error = mean of fold errors
CV Std Dev = std dev of fold errors
```

**Logistic Regression:**
```
σ(z) = 1 / (1 + e^(-z))
P(y=1|x) = σ(b₀ + b₁×x)
log-odds = b₀ + b₁×x
odds = e^(log-odds) = e^(b₀ + b₁×x)
```

**Classification Metrics:**
```
Accuracy = (TP + TN) / Total
Precision = TP / (TP + FP)
Recall = TP / (TP + FN)
F1 = 2 × (Precision × Recall) / (Precision + Recall)
Specificity = TN / (TN + FP)
```

---

## Common Mistakes by Topic

### Regression Mistakes
1. Forgetting absolute value in residuals
2. Using n vs n-1 inconsistently
3. Rounding too early
4. Misinterpreting R²

### Classification Mistakes
1. Confusing precision with recall
2. Using accuracy on imbalanced data
3. Picking wrong threshold
4. Misreading confusion matrix

### CV Mistakes
1. Not using stratified CV for imbalanced data
2. Ignoring standard deviation
3. Using wrong number of folds
4. Not fixing random seed

---

## Study Tips for Solutions

✓ **Work backwards:** Given answer, trace back to understand methodology  
✓ **Variation practice:** Change numbers, redo calculation  
✓ **Teach someone:** Explain solution to peer  
✓ **Time yourself:** Practice speed calculation  
✓ **Check reasonableness:** Does answer make sense?  

---

## When to Use This Guide

**✓ After attempting problem**  
**✓ When you're stuck** (but try first!)  
**✓ To verify your answer**  
**✓ To learn alternative approaches**  
**✓ Right before exam** (quick reference)  

**✗ Don't:** Use before attempting problem (defeats learning)

---

## Next Steps

1. Review solutions for problems you got wrong
2. Identify patterns in your mistakes
3. Return to concept pages for weak areas
4. Try similar problems with different numbers
5. Time yourself to build speed

**Ready for exam?** → Good luck! 🚀

