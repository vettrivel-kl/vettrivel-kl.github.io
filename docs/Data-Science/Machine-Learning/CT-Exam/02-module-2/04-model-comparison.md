---
sidebar_position: 4
title: Model Comparison & Selection
description: Algorithm comparison framework, performance vs interpretability tradeoffs, and model selection guide for CT exam
tags: [model-selection, algorithm-comparison, interpretability, trade-offs, regression-vs-classification]
---

# Model Comparison & Selection

## Overview

Choosing the right algorithm is **as important as choosing the right features**. This section teaches you how to compare and select models systematically.

```
Core Question:
  "When should I use Linear vs Logistic vs Decision Tree vs KNN?"
  
Core Answer:
  "Depends on: problem type, data size, interpretability needs, performance requirements"
```

---

## Part 1: Model Selection Framework

### Decision Tree: Algorithm Selection

```
Step 1: Problem Type?
  ├─ REGRESSION (continuous output)
  │  └─ Go to Regression Algorithms
  └─ CLASSIFICATION (discrete output)
     └─ Go to Classification Algorithms

Step 2 (Regression): Feature Relationships?
  ├─ LINEAR → Linear Regression
  ├─ NON-LINEAR → Polynomial/Spline
  └─ VERY COMPLEX → Neural Networks

Step 3 (Regression): Interpretability Needed?
  ├─ YES → Linear Regression (simple)
  ├─ SOMEWHAT → Polynomial (moderate)
  └─ NO → Neural Networks (black box)

Step 4 (Classification): Decision Boundary?
  ├─ LINEAR → Logistic Regression
  ├─ NON-LINEAR → Decision Trees/SVM
  └─ COMPLEX → Random Forest/Neural Networks

Step 5 (Classification): Speed Needed?
  ├─ REAL-TIME → Logistic/Linear SVM
  ├─ MODERATE → Decision Trees
  └─ BATCH → Gradient Boosting
```

### Key Questions to Ask

```
Before choosing an algorithm:

1. DATA CHARACTERISTICS
   ✓ How many samples? (100 vs 1M changes everything)
   ✓ How many features? (5 vs 5000)
   ✓ Class balance? (50-50 vs 1-99)
   ✓ Missing values? (0% vs 30%)
   ✓ Outliers? (None vs several)

2. PERFORMANCE REQUIREMENTS
   ✓ How accurate must it be? (70% vs 99%)
   ✓ What's the cost of errors? (Low vs critical)
   ✓ False positive vs false negative costs?
   ✓ Speed requirement? (Real-time vs overnight)

3. INTERPRETABILITY REQUIREMENTS
   ✓ Do stakeholders need explanations?
   ✓ Is it a regulated domain? (Finance, medical)
   ✓ How detailed must explanations be?
   ✓ Can we use black-box models?

4. DEPLOYMENT CONSTRAINTS
   ✓ Memory available? (Phone vs server)
   ✓ CPU/GPU available? (Mobile vs cloud)
   ✓ Training time acceptable? (Minutes vs hours)
   ✓ Retraining frequency? (Daily vs yearly)
```

---

## Part 2: Algorithm Comparison Table

### Regression Algorithms

```
Algorithm      Complexity  Speed  Accuracy  Interpretability  Data Needed
────────────────────────────────────────────────────────────────────────
Linear Reg     Very Low    Very Fast  Low       Excellent        Any
Polynomial     Low         Fast       Moderate  Good              Moderate
Ridge/Lasso    Low         Fast       Moderate  Good              Moderate
SVM            Medium      Moderate   High      Poor              Moderate
Decision Tree  Medium      Fast       Moderate  Excellent         Small-Med
Random Forest  High        Slow       High      Poor              Large
Gradient Boost High        Slow       Very High Poor              Large
Neural Network Very High   Very Slow  Very High Very Poor         Very Large

Decision Matrix:
                     Use When
────────────────────────────────────────────────────────────
Linear Regression    • Quick baseline
                     • Interpretability critical
                     • Linear relationships
                     
Polynomial           • Non-linear relationships
                     • Need interpretability
                     • Small-medium datasets
                     
Ridge/Lasso          • Multicollinearity present
                     • Feature selection needed
                     • Regularization beneficial
                     
SVM                  • Non-linear relationships
                     • Small-medium datasets
                     • Robust to outliers
                     
Decision Tree        • Interpretability critical
                     • Non-linear patterns
                     • Fast predictions needed
                     
Random Forest        • High accuracy needed
                     • Large datasets
                     • Can tolerate black-box
                     
Gradient Boost       • Maximum accuracy required
                     • Kaggle competitions
                     • Time/resources available
                     
Neural Network       • Massive datasets (100k+)
                     • Complex non-linear patterns
                     • Sufficient compute available
```

### Classification Algorithms

```
Algorithm           Complexity  Speed  Accuracy  Interpretability  Imbalanced Data
─────────────────────────────────────────────────────────────────────────────────
Logistic Regr       Very Low    Very Fast  Moderate  Excellent        Poor (adjust)
Decision Tree       Low         Fast       Good      Excellent        Needs pruning
Random Forest       Medium      Moderate   Very Good Poor              Good
SVM                 Medium      Moderate   Very Good Poor              Needs weights
Gradient Boost      High        Slow       Excellent Poor              Good
K-Nearest Neighbor  Low         Slow       Good      Excellent        Poor
Naive Bayes         Very Low    Very Fast  Moderate  Excellent        Good
Neural Network      Very High   Very Slow  Excellent Very Poor        Moderate

Decision Matrix:
                        Use When
──────────────────────────────────────────────────────
Logistic Regression    • Interpretability required
                       • Baseline needed
                       • Real-time predictions
                       
Decision Tree          • Clear decision rules
                       • Interpretability critical
                       • Non-linear relationships
                       
Random Forest          • Accuracy important
                       • Feature importance needed
                       • Can tolerate complexity
                       
SVM                    • Binary classification
                       • Well-separated classes
                       • Medium datasets
                       
Gradient Boost         • Maximum accuracy required
                       • Imbalanced data
                       • Enough resources
                       
K-Nearest Neighbor     • Interpretability required
                       • Non-parametric needed
                       • Memory not constrained
                       
Naive Bayes            • Fast training needed
                       • Probabilistic output
                       • Text classification
                       
Neural Network         • Massive datasets
                       • Complex patterns
                       • Compute available
```

---

## Part 3: Bias-Variance Across Algorithms

### Bias-Variance Characteristics

```
Algorithm           Bias    Variance  Comments
──────────────────────────────────────────────────────────
Linear Regression   HIGH    LOW       Simple assumptions
Polynomial Degree 2 MOD     MOD       Balanced
Polynomial Degree 10 LOW    HIGH      Likely overfitting
Decision Tree (deep) LOW    HIGH      Memorizes training
Decision Tree (shallow) HIGH  LOW     Underfitting
Random Forest       LOW     MODERATE  Ensemble reduces variance
Gradient Boosting   LOW     LOW       Often best overall
K-NN (k=1)          LOW     HIGH      Memorizes everything
K-NN (k=100)        HIGH    LOW       Over-smoothing
SVM (RBF kernel)    LOW     HIGH      Flexible boundary
SVM (linear kernel) HIGH    LOW       Simple boundary
Neural Network      LOW     HIGH      Depends on regularization

Overfitting Risk (high to low):
  High:   Deep DT, KNN(k=1), SVM(RBF), Neural Nets
  Medium: Polynomial, Shallow DT
  Low:    Linear Reg, Ridge, Lasso, Random Forest
```

### When Each Dominates

```
Scenario 1: SMALL DATASET (n=50)
  Best: Linear Regression, Logistic Regression
  Why: Low variance models needed (few examples)
  Avoid: Neural Networks, Gradient Boosting (overfit)
  
Scenario 2: MEDIUM DATASET (n=1000)
  Best: Decision Trees, Random Forest, SVM
  Why: Can use moderate complexity
  Good: Ridge/Lasso, Shallow Neural Nets
  Avoid: Very deep models
  
Scenario 3: LARGE DATASET (n=100k+)
  Best: Gradient Boosting, Neural Networks
  Why: Can afford complexity (data prevents overfitting)
  Good: Random Forest, Deep DT
  Reasonable: Logistic Regression (always works)
  
Scenario 4: IMBALANCED DATA (99% negative, 1% positive)
  Best: Gradient Boosting, SVM with class_weight
  Medium: Logistic Regression (adjust threshold)
  Avoid: KNN, Decision Trees (biased toward majority)
  
Scenario 5: NEED INTERPRETABILITY
  Best: Linear Regression, Logistic Regression
  Medium: Decision Trees, Naive Bayes
  Avoid: Neural Networks, SVM (hard to explain)
  
Scenario 6: REAL-TIME PREDICTIONS
  Best: Linear Regression, Decision Trees, KNN
  Medium: Logistic Regression, SVM
  Avoid: Gradient Boosting, Neural Networks (slow)
```

---

## Part 4: Performance vs Interpretability Tradeoff

### The Fundamental Tension

```
Interpretability (Can we explain predictions?)
        ↑
        │   Linear Regression/Logistic
        │        ↑
        │   Decision Trees
        │        ↑
        │   Random Forest
        │        ↑
        │   Gradient Boosting
        │        ↑
        │   Neural Networks
        │
        └─────────────────────→ Performance (Accuracy)

As we move down (better accuracy), interpretability drops!
```

### Real-World Tradeoff Examples

```
MEDICAL DIAGNOSIS:
  Requirements: Interpretability > Accuracy
  Choice: Logistic Regression or Decision Tree
  Why: Doctor needs to understand why recommendation given
  
  NOT: Neural Network (can't explain to patient)

LOAN APPROVAL (regulated):
  Requirements: Interpretability > Accuracy
  Choice: Logistic Regression
  Why: Regulatory requirement (explain rejections)
  
  NOT: Gradient Boosting (regulators won't accept it)

KAGGLE COMPETITION:
  Requirements: Accuracy >> Interpretability
  Choice: Gradient Boosting or Stacking
  Why: Only accuracy matters, no deployment needed
  
  NOT: Linear Regression (too simple)

RECOMMENDATION SYSTEM:
  Requirements: Accuracy ≥ Interpretability
  Choice: Gradient Boosting or Neural Network
  Why: Users tolerate black-box if recommendations good
  
  Trade-off: Some explanation possible (feature importance)
```

### Quantifying the Tradeoff

```
Interpretability Score (0-10, 10 = most interpretable):
  Linear Regression      9-10
  Logistic Regression    9-10
  Decision Trees         7-8
  Naive Bayes           8-9
  K-Nearest Neighbor    6-7
  Random Forest         4-5
  SVM                   3-4
  Gradient Boosting     2-3
  Neural Networks       1-2

Performance Score (0-10, 10 = best accuracy):
  Linear Regression      4-5   (simple patterns)
  Logistic Regression    5-6   (simple boundaries)
  Decision Trees         6-7   (non-linear)
  Naive Bayes           5-6   (limited)
  K-Nearest Neighbor    6-7   (depends on k)
  Random Forest         8-9   (strong ensemble)
  SVM                   7-8   (flexible kernel)
  Gradient Boosting     9-10  (state-of-art)
  Neural Networks       9-10  (with enough data)

Recommendation:
  If Interpretability Score must be > 7: Use Tree/Linear
  If Performance Score must be > 8: Use Boosting/Neural
  If both needed: Use Random Forest (6-7 interpretability, 8-9 performance)
```

---

## Part 5: Worked Example - Customer Churn Prediction

### Problem Setup

```
Dataset: 5000 customers
Features: 20 (age, tenure, monthly charges, etc.)
Target: Churn (1) or Retain (0)
Class balance: 20% churn, 80% retain
Business requirement: Retain customers (minimize false negatives)

Question: Which algorithm should we use?
```

### Comparison: Train Multiple Models

```
CANDIDATE MODELS:

Model 1: Logistic Regression
  Training: 0.1 seconds
  Accuracy: 85%
  Precision: 0.70
  Recall: 0.65
  Interpretability: Excellent
  Prediction time: 0.001s per sample

Model 2: Decision Tree (depth=10)
  Training: 0.5 seconds
  Accuracy: 87%
  Precision: 0.72
  Recall: 0.70
  Interpretability: Excellent (can draw tree)
  Prediction time: 0.01s per sample

Model 3: Random Forest (100 trees)
  Training: 2 seconds
  Accuracy: 90%
  Precision: 0.78
  Recall: 0.75
  Interpretability: Moderate (feature importance)
  Prediction time: 0.05s per sample

Model 4: Gradient Boosting (XGBoost)
  Training: 5 seconds
  Accuracy: 92%
  Precision: 0.80
  Recall: 0.78
  Interpretability: Poor (very complex)
  Prediction time: 0.1s per sample

Model 5: Neural Network (3 layers)
  Training: 30 seconds
  Accuracy: 91%
  Precision: 0.79
  Recall: 0.77
  Interpretability: Very Poor
  Prediction time: 0.02s per sample
```

### Model Selection Decision

```
ANALYSIS:

Business Goal: Retain customers
  → Minimize False Negatives (false rejections cost us customers)
  → Recall is more important than Precision

Performance Comparison:
  Model 1 (Logistic):     Recall 65% ✗ Too low
  Model 2 (Tree):         Recall 70% ✗ Still low
  Model 3 (RF):           Recall 75% ✓ Good
  Model 4 (XGBoost):      Recall 78% ✓✓ Best
  Model 5 (Neural):       Recall 77% ✓✓ Almost as good

Cost Analysis:
  
  Model 3 (Random Forest):
    ✓ Recall 75% → catches 3750/5000 churn cases
    ✓ False negatives: 1250 lost customers
    ✓ Estimated loss: 1250 × ₹5000 = ₹62.5M
    ✓ Training time: 2 sec (acceptable)
    ✓ Prediction speed: 0.05s (OK)
    ✓ Interpretability: Moderate (can explain features)
    
  Model 4 (XGBoost):
    ✓ Recall 78% → catches 3900/5000 churn cases
    ✓ False negatives: 1100 lost customers
    ✓ Estimated loss: 1100 × ₹5000 = ₹55M
    ✓ Training time: 5 sec (still acceptable)
    ✓ Prediction speed: 0.1s (slightly slow)
    ✗ Interpretability: Poor (business won't like black-box)

DECISION:
  Use: Random Forest
  
  Why:
    1. Recall 75% balances accuracy and recall
    2. Moderate interpretability (can explain feature importance)
    3. Fast training (2 sec)
    4. Good prediction speed (0.05s)
    5. Business will accept it (not pure black-box)
    6. Sufficient improvement over Logistic (65% → 75%)
    
  Not XGBoost because:
    • Only 3% recall improvement (78% vs 75%)
    • 2.5x more training time (5s vs 2s)
    • Poor interpretability (business concern)
    • Slower predictions (0.1s vs 0.05s)
    • Not worth added complexity
```

### Inference & Recommendation

```
FINAL RECOMMENDATION:

Model: Random Forest (100 trees, max_depth=15)

Expected Performance:
  • Accuracy: 90% (generally correct)
  • Recall: 75% (catch 3750 of 5000 churners)
  • Precision: 78% (78% of flagged customers actually churn)
  • F1-Score: 0.76

Implementation Plan:
  1. Deploy Random Forest to production
  2. Use feature importance to understand drivers
     (e.g., "high monthly charges" = top churn indicator)
  3. Create targeting strategy:
     • Identify high-churn-risk customers (top 25%)
     • Offer retention discount/upgrade
     • Expected: Reduce 75% churn rate → 60% (save 750 customers)
     
Cost Benefit:
  • Implementation cost: ₹10L
  • Benefit: 750 × ₹5000 = ₹37.5M saved
  • ROI: 3,750% (excellent)

Ongoing Improvements:
  • After 3 months, measure actual churn reduction
  • If successful (>30% reduction), consider XGBoost
  • Retrain model quarterly with new data
  • Monitor for model drift
```

---

## Part 6: Practical Considerations

### Data Size Matters

```
n < 100 samples:
  ✓ Use: Linear/Logistic, KNN, Simple Tree
  ✗ Avoid: Neural Networks, Gradient Boosting
  Reason: Not enough data to train complex models

100 ≤ n < 10,000:
  ✓ Use: Most algorithms work
  ✓ Prefer: Decision Trees, Random Forest
  ⚠️ Caution: Monitor for overfitting
  
10,000 ≤ n < 100,000:
  ✓ Use: Any algorithm including Neural Networks
  ✓ Prefer: Gradient Boosting for best accuracy
  ⚠️ Need: Cross-validation to avoid overfitting
  
n ≥ 100,000:
  ✓ Use: Gradient Boosting, Neural Networks
  ✓ Advantage: Can handle very complex models
  ⚠️ Cost: Training time becomes significant
```

### Feature Count Impact

```
m < 10 features:
  ✓ Use: Any algorithm
  ✓ Linear models often sufficient
  ✓ Multicollinearity not major concern
  
10 ≤ m < 100:
  ✓ Use: Most algorithms
  ⚠️ Watch: Multicollinearity (use Ridge/Lasso)
  ⚠️ Feature selection may help
  
100 ≤ m < 10,000:
  ✓ Use: Algorithms with built-in feature selection
  ✓ Prefer: Decision Trees, Lasso, Neural Networks
  ✗ Avoid: KNN (curse of dimensionality)
  Reason: Distances become meaningless
  
m ≥ 10,000:
  ✓ Use: L1 regularization (Lasso), PCA, Neural Networks
  ✓ Must: Dimensionality reduction first
  ✗ Avoid: Most traditional algorithms
```

### Training Time vs Accuracy

```
Real-time Constraint (< 100ms for prediction):
  ✓ Best: Linear Regression, Logistic, Shallow Tree
  ⚠️ OK: KNN, SVM
  ✗ Slow: Random Forest, XGBoost, Neural Networks

Hourly Retraining (model trains hourly):
  ✓ Best: Linear, Logistic, Single Tree
  ⚠️ OK: Random Forest, Shallow Neural
  ✗ Slow: XGBoost, Deep Neural

Daily Retraining (model trains once per day):
  ✓ Use: Gradient Boosting, Neural Networks
  ⚠️ OK: Random Forest, SVM
  ✓ Training time < 1 hour acceptable

Batch Processing (train once per week/month):
  ✓ Use: Any algorithm, even expensive ones
  ⚠️ Training time < 1 day acceptable
```

---

## Part 7: Exam Questions & Solutions

### Q1: Algorithm Choice - Interpretability Required

**Q:** "You must build a model to predict loan approval. Regulators require you to explain every rejection. Accuracy must be > 80%. What algorithm would you choose and why?"

**A:**
```
Choose: Logistic Regression (if achieves >80%)
Fallback: Decision Tree (if Logistic < 80%)

Reasoning:

PRIMARY: Logistic Regression
  ✓ Interpretability: Excellent (coefficient values explain impact)
  ✓ Regulatory acceptable: Easy to document decisions
  ✓ Explainability: "Customer score 0.35; threshold 0.5; rejected"
  ✓ Usually achieves: 75-85% accuracy
  
IF accuracy insufficient:

FALLBACK: Decision Tree
  ✓ Still interpretable: "If income < 30k AND credit_score < 600: reject"
  ✓ Regulatory acceptable: Can draw decision path
  ✓ Usually achieves: 80-85% accuracy
  
NOT: Gradient Boosting, Neural Networks
  ✗ Cannot explain rejections
  ✗ Regulators won't accept
  ✗ Lawsuit risk if someone sues

Trade-off Acceptance:
  Accept 1-2% accuracy loss for interpretability
  (80% vs 82%) because regulatory requirement overrides
```

---

### Q2: Small Dataset Selection

**Q:** "You have 80 customer records and need to predict churn. What's your best algorithm?"

**A:**
```
Best: Logistic Regression or Single Decision Tree

Why:
  Data size (80) is too small for complex models
  High variance risk with flexible algorithms
  
Avoided algorithms:

Neural Networks:
  ✗ Only 80 examples (need hundreds minimum)
  ✗ Will severely overfit
  ✗ Cannot validate model (too few examples for train/test split)

Random Forest:
  ✗ Ensemble with 100 trees on 80 samples
  ✗ Each tree overfits
  ✗ No diversity = no variance reduction benefit

Gradient Boosting:
  ✗ Sequential overfitting on small data
  ✗ Each boosting round overfits more

Best choice: Logistic Regression
  ✓ Simple model, few parameters
  ✓ Hard to overfit with 80 examples
  ✓ Interpretable for small dataset
  ✓ Can validate: 60 train, 20 test
```

---

### Q3: Big Data + Speed Constraint

**Q:** "1 million customer records, need predictions in < 50ms each, maximum training time 1 hour. Which algorithm?"

**A:**
```
Choose: Gradient Boosting (XGBoost or LightGBM)

Why:
  Data size (1M): Large enough for complex model
  Speed constraint: < 50ms per prediction
  Training time: < 1 hour budget
  
Analysis:

Neural Networks:
  ✗ Training time > 1 hour (likely 5-10 hours)
  ✗ Prediction speed often > 50ms
  ✗ Overkill for this data size

Decision Trees/Random Forest:
  ✓ Training time: 5-10 minutes ✓
  ✓ Prediction speed: 10-20ms ✓
  ✗ Accuracy: Only ~90% (not best)

XGBoost/LightGBM:
  ✓ Training time: 20-30 minutes ✓
  ✓ Prediction speed: 20-30ms ✓
  ✓ Accuracy: 93-95% (best) ✓

Winner: XGBoost/LightGBM
  • Best accuracy within constraints
  • Meets all speed requirements
  • Reasonable training time
```

---

### Q4: Imbalanced Data Handling

**Q:** "Class distribution: 98% negative, 2% positive. Which algorithm without rebalancing?"

**A:**
```
Best: Gradient Boosting with scale_pos_weight parameter
Fallback: Logistic Regression with class_weight

Why:

Simple Algorithms (Logistic, Decision Tree):
  ✗ Default: Biased toward majority class
  ✓ Fix: Use class_weight parameter
    Logistic: class_weight='balanced'
    Tree: class_weight='balanced'
  ✓ Helps but doesn't fully solve
  ✗ Performance still limited

Ensemble Methods (Random Forest):
  ✗ Multiple trees, all biased same way
  ✗ class_weight helps less
  
Gradient Boosting:
  ✓ Parameter: scale_pos_weight (XGBoost)
  ✓ Explicitly tells algorithm: positive class is rare
  ✓ Boosting naturally handles imbalance better
  ✓ Best performance without resampling

Recommended Approach:

```python
from xgboost import XGBClassifier

# Calculate imbalance ratio
pos_weight = neg_count / pos_count  # 98 / 2 = 49

model = XGBClassifier(
    scale_pos_weight=pos_weight,
    learning_rate=0.05,
    max_depth=7
)
```
```

---

### Q5: Performance vs Deployment Cost

**Q:** "Model 1: 92% accuracy, trains in 2 hours. Model 2: 90% accuracy, trains in 5 minutes. Which for production?"

**A:**
```
Choose: Model 2 (unless accuracy-critical)

Analysis:

Model 1 (High Accuracy):
  ✓ 92% accuracy (2% better)
  ✗ 2-hour training (retraining every day costs server time)
  ✗ Deployment cost: High compute for 2% gain

Model 2 (Fast Training):
  ✓ 90% accuracy (sufficient for most uses)
  ✓ 5-minute training (can retrain hourly)
  ✓ Deployment cost: Low compute, easy to update

Decision Framework:

If accuracy difference matters:
  • 0.1% difference (91% vs 91.1%) → Choose faster
  • 1% difference (91% vs 92%) → Depends on cost
  • 5% difference (85% vs 90%) → Choose accurate

Recommendation for 92% vs 90%:

Cost analysis:
  Model 1: 2 hours training = ₹500/training
           Daily retraining = ₹500 × 365 = ₹1.825L/year
  
  Model 2: 5 min training = ₹50/training
           Daily retraining = ₹50 × 365 = ₹18.25K/year
  
  Cost difference: ₹1.8L/year for 2% accuracy

Recommendation:
  ✓ Use Model 2
  ✓ 2% accuracy improvement not worth ₹1.8L/year
  ✓ UNLESS accuracy difference translates to revenue
    (Example: each % accuracy = ₹100L revenue → choose Model 1)
```

---

### Q6: Model Combination Decision

**Q:** "You have 3 models: Tree (87% acc), RF (89% acc), XGBoost (91% acc). Use one or ensemble?"

**A:**
```
Choose: XGBoost alone (unless you have 1 hour for ensembling)

Why:

Individual Performances:
  Tree: 87%
  RF: 89% (2% better than Tree)
  XGBoost: 91% (2% better than RF)

Ensemble Options:

Voting (Train all three):
  ✓ Typical improvement: 91% → 92% (+1% at best)
  ✗ 3x training time
  ✗ 3x prediction time
  ✗ More complex to deploy/maintain

Recommendation:

Time Available?
  < 1 hour: Use XGBoost alone (91%)
    Trade-off: 1% accuracy for simplicity
  
  ≥ 1 hour: Use Voting Ensemble
    Benefit: Possible 92% from ensemble
    Cost: 3x complexity

For CT Exam:

Simple rule:
  "Use the best single model
   unless specifically told to ensemble"
  
  XGBoost at 91% > Risk of ensemble complexity
```

---

## Part 8: Quick Reference Guide

### "Which Algorithm?" Decision Tree

```
Q: Problem type?
├─ REGRESSION
│  ├─ Linear relationship? → Linear Regression
│  ├─ Non-linear? → Polynomial or Tree
│  └─ Very complex? → Neural Networks
│
└─ CLASSIFICATION
   ├─ Need interpretability?
   │  ├─ YES → Logistic/Decision Tree
   │  └─ NO → Go to next question
   │
   ├─ Dataset size?
   │  ├─ n < 100 → Logistic/Tree
   │  ├─ 100 ≤ n < 10k → Any algorithm
   │  ├─ 10k ≤ n < 100k → Gradient Boosting
   │  └─ n ≥ 100k → Gradient Boosting/Neural
   │
   └─ Speed critical?
      ├─ < 1 sec per prediction → Linear/Tree
      ├─ < 100ms per prediction → Linear only
      └─ NOT critical → Gradient Boosting
```

---

## Part 9: Practice Problems

### Problem 1: Choose Best Algorithm

```
Scenario: Medical image classification
- Dataset: 500,000 chest X-ray images
- Task: Detect pneumonia (binary)
- Requirement: 99%+ accuracy needed
- Constraint: Training time < 3 hours

Options:
a) Logistic Regression
b) Random Forest
c) Convolutional Neural Network
d) XGBoost

Questions:
1. Which single algorithm? Why?
2. Would ensemble help?
3. What's the key tradeoff?
```

### Problem 2: Cost-Benefit Analysis

```
Scenario: Email spam classification
- Model A: 85% accuracy, 0.1s training
- Model B: 92% accuracy, 10s training
- Deploy: 100M emails daily
- Cost: ₹0.01 per prediction

Calculate total annual cost per model including training time.
Which is better for production?
```

### Problem 3: Constraints Navigation

```
Scenario: Real-estate price prediction
- Data: 50,000 properties
- Features: 150 variables
- Requirement: Predictions in < 50ms
- Must explain predictions to customers

Which algorithm and why?
What would you NOT choose?
```

---

## Part 10: Key Takeaways

### The Golden Rules

```
Rule 1: Simpler is better until proven wrong
  Start with Linear/Logistic
  Only add complexity if performance insufficient

Rule 2: Match algorithm to data size
  Small (n<100): Linear/Logistic
  Medium (100-10k): Anything works
  Large (10k+): Gradient Boosting/Neural

Rule 3: Interpretability has business value
  If needed: Use simple algorithms
  Trade-off: Typically 1-5% accuracy loss
  Worth it for regulatory/trust reasons

Rule 4: Prediction speed often ignored
  But deployment costs compound
  1s training × 365 days × servers = ₹millions
  5-min training × 365 days × servers = ₹hundreds

Rule 5: Ensemble only if time permits
  Typical gain: 1-2% accuracy
  Cost: 2-3x complexity
  Worth it only for critical applications
```

### When Each Wins

```
ACCURACY WINS:
  • Kaggle competition
  • Life-or-death decision
  • When error cost is very high

INTERPRETABILITY WINS:
  • Regulatory environment
  • When trust matters
  • Business stakeholder decisions

SPEED WINS:
  • Real-time systems
  • Mobile/edge devices
  • High-volume predictions

SIMPLICITY WINS:
  • When accuracy similar
  • Fewer bugs to maintain
  • Faster development
```

---

## Summary Table

| Need | Best Algorithm | Why |
|------|-----------------|-----|
| **Quick Baseline** | Linear/Logistic | Fast, interpretable |
| **Interpretability** | Decision Tree | Draws tree, explains rules |
| **Balanced** | Random Forest | 8/10 accuracy, 5/10 interpretability |
| **Maximum Accuracy** | Gradient Boosting | State-of-art performance |
| **Real-time** | Linear/Tree | Fast predictions |
| **Big Data** | Neural Networks | Scales well |
| **Small Data** | Linear/Logistic | Won't overfit |
| **Imbalanced** | Gradient Boost | Handles naturally |

---

## Tips for CT Exam

### ✅ DO

- **Consider data size first** - dictates algorithm choice
- **Discuss tradeoffs explicitly** - accuracy vs interpretability/speed
- **Justify your choice** - "Best for X because Y"
- **Mention alternatives** - "Could use Z but better because W"
- **Reference performance metrics** - compare actual numbers

### ❌ DON'T

- Don't always choose the most complex algorithm
- Don't ignore deployment constraints
- Don't assume ensemble always wins
- Don't forget regulatory/business requirements
- Don't pick by accuracy alone

---

## Next Topics

→ [00-overview.md](./00-overview.md) - Module 2 navigation  
→ [05-decision-boundaries.md](./05-decision-boundaries.md) - Visual interpretation  
→ [Build & Deploy](../DOCUSAURUS_SETUP.md) - Go live on GitHub Pages

