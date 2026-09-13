---
sidebar_position: 4
title: Performance Metrics & Evaluation
description: Complete guide to regression and classification metrics with worked examples and interpretations for CT exam
tags: [metrics, evaluation, performance, accuracy, precision, recall, f1]
---

# Performance Metrics & Evaluation

## Overview

Choosing the right metric determines whether your model actually solves the problem. Different problems need different metrics.

```
Common Mistake:
  ✗ Always use accuracy
  
Correct Approach:
  ✓ Choose metric based on business problem
  ✓ Consider costs of different errors
  ✓ Use multiple metrics together
```

---

## Part 1: Regression Metrics (Quick Review)

### For Continuous Predictions (price, temperature, etc.)

| Metric | Formula | Interpretation | When to Use |
|--------|---------|-----------------|------------|
| **MAE** | Σ\|y - ŷ\|/n | Average error in original units | Robust to outliers |
| **MSE** | Σ(y - ŷ)²/n | Average squared error | Standard use |
| **RMSE** | √MSE | Error in original units | Business communication |
| **R²** | 1 - SSE/SST | Variance explained (0-1) | Model fit comparison |
| **Adj R²** | 1 - (1-R²)×(n-1)/(n-k-1) | R² penalized for features | Feature selection |

### Quick Recap: When Each Matters

```
Choose RMSE when:
  ✓ Business needs error in original units
  ✓ Large errors are very bad (penalize them)
  Example: House price predictions

Choose MAE when:
  ✓ All errors equally important
  ✓ Outliers shouldn't dominate
  Example: Stock price forecasting

Choose R² when:
  ✓ Comparing multiple models
  ✓ Reporting variance explained
  Example: Research papers

Choose Adjusted R² when:
  ✓ Models have different numbers of features
  ✓ Preventing overfitting is important
  Example: Feature selection decisions
```

---

## Part 2: Classification Metrics (Core Topic)

### The Confusion Matrix

The foundation of all classification metrics.

```
                 Predicted
              Positive  Negative
Actual
Positive    |   TP   |   FN   |
Negative    |   FP   |   TN   |

Definitions:
  TP (True Positive)   = Correctly predicted positive
  TN (True Negative)   = Correctly predicted negative
  FP (False Positive)  = Predicted positive, actually negative (Type I error)
  FN (False Negative)  = Predicted negative, actually positive (Type II error)
```

### Worked Example: Email Spam Classification

```
Classification task: Detect spam emails

True labels:     [spam, spam, ham, spam, ham, ham, spam, spam, ham, ham]
Predictions:     [spam, ham,  ham, spam, ham, spam, spam, spam, ham, spam]

Comparing:
Observation 1: Actual=spam, Predicted=spam → TP
Observation 2: Actual=spam, Predicted=ham  → FN (missed spam!)
Observation 3: Actual=ham,  Predicted=ham  → TN
Observation 4: Actual=spam, Predicted=spam → TP
Observation 5: Actual=ham,  Predicted=ham  → TN
Observation 6: Actual=ham,  Predicted=spam → FP (falsely marked as spam)
Observation 7: Actual=spam, Predicted=spam → TP
Observation 8: Actual=spam, Predicted=spam → TP
Observation 9: Actual=ham,  Predicted=ham  → TN
Observation 10:Actual=ham,  Predicted=spam → FP

Summary:
  TP = 4 (emails correctly marked as spam)
  FN = 1 (spam emails missed)
  FP = 2 (ham emails wrongly marked as spam)
  TN = 3 (ham emails correctly not marked as spam)
```

### Confusion Matrix Visualization

```
                 Predicted
              Spam    Ham
Actual
Spam         |  4  |  1  |
Ham          |  2  |  3  |

                TP=4  FN=1
                FP=2  TN=3
```

---

## Part 3: Individual Classification Metrics

### Accuracy

```
Accuracy = (TP + TN) / (TP + TN + FP + FN)

Calculation:
  = (4 + 3) / (4 + 3 + 2 + 1)
  = 7 / 10
  = 0.70 = 70%

Interpretation:
  ✓ 70% of all predictions were correct
  ✓ Model gets 7 out of 10 right
  
When to use:
  ✓ Balanced datasets (equal positives and negatives)
  ✓ When all errors are equally costly
  
When NOT to use:
  ✗ Imbalanced datasets (e.g., 99% negatives, 1% positive)
  ✗ When different errors have different costs
  
Example where accuracy is misleading:
  Disease detection: 99.9% people don't have disease
  Dumb classifier: "Always predict no disease"
  → Accuracy = 99.9% (but useless!)
```

### Precision (Positive Predictive Value)

```
Precision = TP / (TP + FP)

Calculation:
  = 4 / (4 + 2)
  = 4 / 6
  = 0.667 ≈ 67%

Interpretation:
  ✓ Of emails we marked as spam, 67% were actually spam
  ✓ 33% of spam predictions were false alarms
  
Question it answers:
  "When the model says POSITIVE, how often is it RIGHT?"

When to use:
  ✓ When false positives are costly
  Example: Email spam filter
    (false positive = delete legitimate email, bad for user)
  Example: Loan approval
    (false positive = approve bad applicant, loss for bank)
  
When NOT to use:
  ✗ When missing positives is very bad
  Example: Disease diagnosis
    (false negative = patient dies, worse than false positive)

High Precision means:
  ✓ Few false alarms
  ✓ Can trust positive predictions
```

### Recall (Sensitivity, True Positive Rate)

```
Recall = TP / (TP + FN)

Calculation:
  = 4 / (4 + 1)
  = 4 / 5
  = 0.80 = 80%

Interpretation:
  ✓ Of all actual spam emails, we caught 80%
  ✓ We missed 20% of spam (false negatives)
  
Question it answers:
  "Of all actual POSITIVES, how many did we find?"

When to use:
  ✓ When false negatives are very costly
  Example: Cancer detection
    (false negative = patient not treated, dies)
  Example: Fraud detection
    (false negative = fraud goes undetected, financial loss)
  Example: Security threat detection
    (false negative = threat not detected, system compromised)
  
When NOT to use:
  ✗ When false positives are very costly
  Example: Criminal conviction
    (false positive = innocent person imprisoned)

High Recall means:
  ✓ We catch most positives
  ✓ Few things slip through
```

### Specificity (True Negative Rate)

```
Specificity = TN / (TN + FP)

Calculation:
  = 3 / (3 + 2)
  = 3 / 5
  = 0.60 = 60%

Interpretation:
  ✓ Of all actual ham emails, we correctly identified 60%
  ✓ 40% of ham emails were falsely marked as spam
  
Question it answers:
  "Of all actual NEGATIVES, how many did we correctly identify?"

Relationship to Precision:
  Precision: "How accurate are positive predictions?"
  Specificity: "How accurate are negative predictions?"
  
When to use:
  ✓ When false positives are costly
  Example: Email spam (don't delete real emails)
  Example: Loan approval (don't reject good applicants)
```

### F1-Score (Harmonic Mean)

```
F1 = 2 × (Precision × Recall) / (Precision + Recall)

Calculation:
  Precision = 0.667
  Recall = 0.80
  
  F1 = 2 × (0.667 × 0.80) / (0.667 + 0.80)
     = 2 × 0.533 / 1.467
     = 1.067 / 1.467
     = 0.728 ≈ 73%

Interpretation:
  ✓ Balanced score combining precision and recall
  ✓ Useful for imbalanced datasets
  
Properties:
  • Ranges from 0 to 1
  • Favors balanced precision-recall tradeoff
  • If either precision or recall is very low → F1 is low
  
When to use:
  ✓ When you need balance between precision and recall
  ✓ When dataset is imbalanced
  ✓ When you want ONE number to summarize performance
  
When NOT to use:
  ✗ When one metric (precision or recall) is clearly more important
  ✗ When business requires specific tradeoff
```

---

## Part 4: Metric Relationships & Tradeoffs

### Precision vs Recall Tradeoff

```
Fundamental Tradeoff:
  Usually cannot maximize both simultaneously!

Example: Spam Detection

High Precision, Low Recall:
  Model: "Only mark email as spam if 99% sure"
  Result: Few false alarms, but miss many actual spams
  ✓ User happy (no legitimate emails deleted)
  ✗ Spam gets through
  
Low Precision, High Recall:
  Model: "Mark email as spam if 10% chance it's spam"
  Result: Catch almost all spam, but many false alarms
  ✗ User unhappy (legitimate emails deleted)
  ✓ No spam gets through

Balanced (using threshold):
  Model: "Mark email as spam if 50% chance it's spam"
  Result: Good precision and recall balance

Visual Tradeoff:
  Precision
      ↑ 1.0  ╱╲        High Precision
      │     ╱  ╲       Low Recall
      │    ╱    ╲
    0.5├──╱──────╲──
      │ ╱        ╲
      │╱          ╲
      └────────────→ Recall
        0        1.0
        
        Low Recall    High Recall
        High Precision Low Precision
```

### Controlling the Tradeoff (Classification Threshold)

```
Default threshold: 0.5

P(y=1) ≥ 0.5 → Predict positive
P(y=1) < 0.5  → Predict negative

Adjusting threshold:

Threshold = 0.3:
  ✓ More predictions are positive
  ✓ Higher recall (catch more positives)
  ✗ Lower precision (more false positives)
  Use when: Missing positives is costly

Threshold = 0.7:
  ✗ Fewer predictions are positive
  ✗ Lower recall (miss some positives)
  ✓ Higher precision (fewer false positives)
  Use when: False positives are costly

Example: Disease detection
  
  Threshold 0.3: Catch 95% of diseases
    but 20% of healthy people flagged (false positives)
  
  Threshold 0.7: Only 10% false positives
    but miss 30% of actual diseases (false negatives)
  
  Best threshold depends on:
    Cost of false negative (patient dies)
    vs. Cost of false positive (unnecessary treatment)
```

---

## Part 5: Complete Worked Example

### Problem: Credit Card Fraud Detection

```
Dataset: 1000 credit card transactions

True labels:     Actual fraud status (fraud or not)
Model prediction: Model's prediction (fraud or not)
```

### Step 1: Build Confusion Matrix

```
Testing on 1000 transactions:

Actual Status    |  Predicted Fraud  |  Predicted Legit  |  Total
─────────────────┼───────────────────┼──────────────────┼────────
Fraud (50 total) |       40          |        10         |   50
Legit (950 total)|       25          |       925         |   950
─────────────────┼───────────────────┼──────────────────┼────────
Total Predicted  |       65          |       935         |   1000

Confusion Matrix:
                Predicted
            Fraud   Legit
Actual
Fraud      |  40  |  10  |
Legit      |  25  | 925  |

TP  = 40 (fraud correctly detected)
FN  = 10 (fraud missed)
FP  = 25 (legitimate flagged as fraud)
TN  = 925 (legitimate correctly passed)
```

### Step 2: Calculate All Metrics

#### Accuracy

```
Accuracy = (TP + TN) / (TP + TN + FP + FN)
         = (40 + 925) / (40 + 925 + 25 + 10)
         = 965 / 1000
         = 0.965 = 96.5%

Interpretation:
  ✓ Model gets 96.5% of predictions right
  ✓ BUT misleading! (50 fraud vs 950 legit - imbalanced)
```

#### Precision

```
Precision = TP / (TP + FP)
          = 40 / (40 + 25)
          = 40 / 65
          = 0.615 ≈ 62%

Interpretation:
  ✓ When model says "fraud", it's correct 62% of the time
  ✗ 38% of fraud alerts are false alarms
  ✗ Bad for customer experience (false accusations)
```

#### Recall

```
Recall = TP / (TP + FN)
       = 40 / (40 + 10)
       = 40 / 50
       = 0.80 = 80%

Interpretation:
  ✓ We catch 80% of actual fraudulent transactions
  ✗ We miss 20% of fraud (10 fraudulent transactions slip through)
  ✗ Bad for bank (financial loss)
```

#### Specificity

```
Specificity = TN / (TN + FP)
            = 925 / (925 + 25)
            = 925 / 950
            = 0.974 ≈ 97%

Interpretation:
  ✓ Of legitimate transactions, we correctly identify 97%
  ✓ Only 3% of legitimate transactions are falsely flagged
```

#### F1-Score

```
F1 = 2 × (Precision × Recall) / (Precision + Recall)
   = 2 × (0.615 × 0.80) / (0.615 + 0.80)
   = 2 × 0.492 / 1.415
   = 0.984 / 1.415
   = 0.696 ≈ 70%

Interpretation:
  ✓ Balanced metric: 70%
  ✓ Better than precision (62%) but lower than recall (80%)
  ✓ Captures precision-recall tradeoff
```

### Step 3: Create Metrics Summary Table

| Metric | Value | Interpretation |
|--------|-------|-----------------|
| **Accuracy** | 96.5% | Overall correctness (misleading here due to imbalance) |
| **Precision** | 62% | When we flag as fraud, 62% are actually fraud |
| **Recall** | 80% | We catch 80% of actual fraud |
| **Specificity** | 97% | We correctly pass 97% of legitimate transactions |
| **F1-Score** | 70% | Balanced precision-recall metric |

---

## Part 6: Complete Inference & Interpretation

### Business Decision Making

```
Model Performance Summary:
  Accuracy: 96.5% (but imbalanced, not representative)
  Precision: 62% (only 62% of fraud alerts are real)
  Recall: 80% (catch 80% of fraud)
  F1: 70% (balanced)
  Specificity: 97% (barely affect legitimate customers)

Key Concerns:
  1. Miss 20% of fraud → Financial loss to bank
  2. 38% false alarms → Customer frustration
  3. Tradeoff: Catch more fraud but frustrate more customers

Business Questions:

Q: How much money lost per missed fraud?
A: Typical fraud loss = ₹50,000
   20% miss rate = 10 frauds missed
   Loss = 10 × ₹50K = ₹5 lakhs per 1000 transactions

Q: How much frustration per false positive?
A: Customer calls = $5 handling cost
   25 false positives = ₹1.25 lakhs cost per 1000 transactions

Q: Which is more important?
A: Financial loss (₹5L) > Customer cost (₹1.25L)
   → Increase recall (catch more fraud)
   → Accept lower precision (more false alarms)
   → Lower detection threshold
```

### Metric Selection for Different Scenarios

```
Scenario 1: Email Spam Filter
Problem: Legitimate emails getting deleted is BAD
         Some spam slipping through is OK
Solution: Prioritize PRECISION
  High precision → Few false alarms
  Acceptable recall → Some spam gets through (OK)

Scenario 2: Cancer Detection
Problem: Missing a cancer is VERY BAD
         False positives lead to tests (acceptable)
Solution: Prioritize RECALL
  High recall → Catch most cancers
  Lower precision → Some false positives (acceptable, worth investigating)

Scenario 3: Hiring System
Problem: False positives waste HR time
         False negatives miss good candidates
Solution: BALANCE - Use F1-Score
  F1 = 70% means good balance
  Don't want to be too strict or too lenient

Scenario 4: Fraud Detection
Problem: Miss fraud = Financial loss (VERY BAD)
         False positives = Customer annoyance (BAD)
Solution: WEIGHTED - Higher priority to recall
  Target Recall: 95% (catch most fraud)
  Accept Precision: 50% (expect some false alarms)
  Accept customer frustration to prevent fraud
```

### Model Quality Assessment

```
This fraud detection model:

Strengths:
  ✓ Catches 80% of fraud (good recall)
  ✓ Only 3% legitimate transactions affected (good specificity)
  ✓ 96.5% accuracy (looks good at first glance)

Weaknesses:
  ✗ 38% of fraud alerts are false (poor precision)
  ✗ Miss 20% of fraud (financial risk)
  ✗ Imbalanced dataset (accuracy misleading)

Grade: B+ (Good for security, needs refinement for UX)

Recommendations to improve:
  1. Lower detection threshold → Increase recall (catch more fraud)
  2. Add more features (transaction history, location, etc.)
  3. Use ensemble methods (combine multiple models)
  4. Cost-sensitive learning (penalize FN more than FP)
  5. Collect more fraud examples (class imbalance problem)
```

---

## Part 7: Multi-Class Classification Metrics

### Beyond Binary (When there are 3+ classes)

```
Example: Email Classification
  Classes: Spam, Legitimate, Promotions (3 classes)

Confusion Matrix:
              Predicted
          Spam  Legit  Promo
Actual
Spam      | 80 |  10 |  10 |
Legit     |  5 | 900 |  15 |
Promo     |  5 |  20 | 475 |

For multi-class, metrics become complex.
Can calculate per-class or use averaging:
```

### Macro vs Micro Averaging

```
Macro Averaging:
  Calculate metric per class, then average
  Example Precision:
    Spam precision    = 80/(80+5+5) = 0.889
    Legit precision   = 900/(10+900+20) = 0.956
    Promo precision   = 475/(10+15+475) = 0.949
    Macro average     = (0.889 + 0.956 + 0.949)/3 = 0.931
  
  Use when: All classes equally important

Micro Averaging:
  Pool all TP, FP, FN across classes
  Example Precision:
    Total TP = 80 + 900 + 475 = 1455
    Total FP = 15 + 25 + 30 = 70
    Micro Precision = 1455/(1455+70) = 0.954
  
  Use when: Class distribution matters
```

---

## Part 8: Additional Classification Metrics

### ROC-AUC (Receiver Operating Characteristic)

```
ROC Curve:
  Plots True Positive Rate vs False Positive Rate
  at different decision thresholds

ROC-AUC:
  Area Under the ROC Curve
  Ranges from 0.5 (random) to 1.0 (perfect)

Interpretation:
  0.9-1.0:  Excellent
  0.8-0.9:  Good
  0.7-0.8:  Fair
  0.6-0.7:  Poor
  0.5-0.6:  Very Poor
  0.5:      Random (useless)

When to use:
  ✓ Imbalanced datasets
  ✓ When threshold varies
  ✓ Comparing models across thresholds
```

### Log Loss (Cross-Entropy)

```
Log Loss = -Σ[y×log(ŷ) + (1-y)×log(1-ŷ)] / n

Lower is better (0 is perfect)

Interpretation:
  Penalizes confident wrong predictions
  Example:
    True: 1, Prediction: 0.9 → Small penalty (confident correct)
    True: 1, Prediction: 0.1 → Large penalty (confident wrong)

When to use:
  ✓ When probability calibration matters
  ✓ When you want to penalize confident mistakes
```

---

## Part 9: Choosing the Right Metrics

### Decision Framework

```
Step 1: Understand the problem
  Q: Classification or regression?
  Q: Binary or multi-class?
  Q: What's the business goal?

Step 2: Understand the data
  Q: Balanced or imbalanced?
  Q: What are the class costs?
  Q: What's the baseline?

Step 3: Select appropriate metrics

For Regression:
  Always use: RMSE (or MAE)
  Also use: R² (for model comparison)
  Consider: Adjusted R² (for overfitting check)

For Balanced Binary Classification:
  Always use: Accuracy, Precision, Recall, F1
  Consider: ROC-AUC

For Imbalanced Binary Classification:
  Always use: Precision, Recall, F1, ROC-AUC
  Avoid: Accuracy (misleading)
  Consider: Log Loss

For Multi-class:
  Always use: Macro F1 (if classes unequal)
             Micro F1 (if classes equal)
  Consider: Per-class metrics
```

---

## Part 10: Exam Questions & Solutions

### Q1: Confusion Matrix Interpretation

**Q:** 
```
Confusion Matrix:
           Predicted Positive  Predicted Negative
Actual Pos |      95           |       5           |
Actual Neg |      10           |      890          |

Calculate: Accuracy, Precision, Recall, F1-Score
```

**A:**
```
From matrix:
  TP = 95, FN = 5, FP = 10, TN = 890

Accuracy = (TP + TN) / Total
         = (95 + 890) / (95 + 5 + 10 + 890)
         = 985 / 1000
         = 0.985 = 98.5%

Precision = TP / (TP + FP)
          = 95 / (95 + 10)
          = 95 / 105
          = 0.905 ≈ 91%

Recall = TP / (TP + FN)
       = 95 / (95 + 5)
       = 95 / 100
       = 0.95 = 95%

F1 = 2 × (Precision × Recall) / (Precision + Recall)
   = 2 × (0.905 × 0.95) / (0.905 + 0.95)
   = 2 × 0.860 / 1.855
   = 0.927 ≈ 93%
```

---

### Q2: Metric Selection

**Q:** You're building a model to detect fraudulent tax returns.
False positive = Innocent person audited
False negative = Fraud goes undetected

Which metric should you prioritize?

**A:**
```
Analysis:

False Positive Cost:
  • Person audited (embarrassing, time wasted)
  • Cost: ₹10,000 per person
  • Reputation risk: moderate

False Negative Cost:
  • Fraud not detected (government loses money)
  • Cost: ₹1,00,000 per fraud
  • Compliance risk: high

Decision:
  False Negative cost (₹1,00,000) >> False Positive cost (₹10,000)
  
Recommendation:
  → PRIORITIZE RECALL (catch most fraud)
  → Accept lower precision (some false audits)
  → Set detection threshold LOW
  
Acceptable metrics:
  Recall: ≥ 90% (catch most fraud)
  Precision: ≥ 70% (some false alarms acceptable)
  F1: Not ideal (balances equally, not the goal here)

Why:
  Better to audit 100 innocent people and catch 1 fraud
  Than audit 10 innocent people and miss 9 frauds
```

---

### Q3: Imbalanced Dataset Problem

**Q:** Dataset has 99% class 0, 1% class 1.
Model always predicts class 0.
Accuracy = 99%

Is this a good model?

**A:**
```
NO! This is a terrible model despite 99% accuracy!

Why accuracy is misleading:

Confusion Matrix:
           Predicted 0  Predicted 1
Actual 0   |    9900    |     0      |
Actual 1   |    100     |     0      |

Accuracy = (9900 + 0) / 10000 = 99%

BUT:
  Precision = 0 / (0 + 0) = undefined
  Recall = 0 / (0 + 100) = 0%
  F1 = 0%

The model catches ZERO instances of class 1!

Solution:
  ✓ Use F1-Score (0%)
  ✓ Use ROC-AUC
  ✓ Use Precision-Recall curve
  ✓ Use weighted accuracy
  ✗ Do NOT use accuracy alone

Lesson:
  For imbalanced data: ALWAYS use F1, ROC-AUC, or Precision-Recall
  Never trust accuracy alone
```

---

### Q4: Precision vs Recall Tradeoff

**Q:** 
Model A: Precision = 90%, Recall = 50%
Model B: Precision = 60%, Recall = 85%

Disease detection context. Which model?

**A:**
```
Disease Detection Analysis:

Model A (High Precision, Low Recall):
  ✓ When we say disease, 90% actually have it
  ✗ But we miss 50% of patients with disease
  ✗ Patients with disease go undetected and untreated
  ✗ People die from undetected disease
  VERDICT: NOT SUITABLE

Model B (Lower Precision, High Recall):
  ✓ We catch 85% of patients with disease
  ✓ Few cases slip through
  ✗ 40% of positive predictions are false alarms
  ✗ Some healthy people get further testing
  ✓ Better safe than sorry (further tests confirm)
  VERDICT: SUITABLE

Recommendation: Choose Model B

Reasoning:
  • Disease diagnosis: Missing cases is MUCH worse than false alarms
  • Further testing can rule out (low cost)
  • But missing disease = death (high cost)
  • F1 comparison:
    Model A: F1 = 2×(0.9×0.5)/(0.9+0.5) = 0.643
    Model B: F1 = 2×(0.6×0.85)/(0.6+0.85) = 0.706
  • Model B has better F1 too!
```

---

## Part 11: Practice Problems

### Problem 1: Calculate All Metrics

```
Sentiment Analysis (Positive vs Negative)

Confusion Matrix:
           Predicted Positive  Predicted Negative
Actual Pos |      150          |       50          |
Actual Neg |      40           |      760          |

Calculate:
a) Accuracy
b) Precision
c) Recall
d) Specificity
e) F1-Score
f) Interpret each metric
```

### Problem 2: Metric Selection

```
Scenario: Predictive maintenance (equipment failure prediction)

False Positive: Schedule unnecessary maintenance (cost: ₹50K)
False Negative: Miss failure, equipment breaks (cost: ₹5M)

Questions:
a) Which metric should be prioritized?
b) What acceptable precision/recall tradeoff?
c) Would you adjust decision threshold? How?
```

### Problem 3: Regression vs Classification Metrics

```
Problem: Predict customer churn (leave vs stay)

Dataset: 10,000 customers
  9,000 stay
  1,000 leave

Model predicts:
  Predicted stay: 8,800 (actually: 8,700 stay, 100 leave)
  Predicted leave: 1,200 (actually: 300 stay, 900 leave)

Questions:
a) Build confusion matrix
b) Calculate accuracy, precision, recall, F1
c) Which metric is most meaningful?
d) Why is accuracy misleading?
```

---

## Part 12: Key Takeaways

### When to Use Each Metric

```
REGRESSION:
  Always: RMSE (business communication)
  Always: R² (model comparison)
  Consider: MAE (outlier robustness)
  Consider: Adj R² (overfitting check)

BINARY CLASSIFICATION:
  Balanced data: Accuracy + Precision + Recall + F1
  Imbalanced data: Precision + Recall + F1 + ROC-AUC
  Never: Accuracy alone for imbalanced data

MULTI-CLASS:
  Always: Macro F1 (equal class importance)
  Consider: Per-class metrics
  Consider: Confusion matrix
```

### Red Flags to Watch

```
🚩 High accuracy on imbalanced data
   → Use F1, ROC-AUC instead

🚩 Precision = 100%, Recall = 50%
   → Model is too conservative
   → Adjust threshold

🚩 RMSE >> MAE
   → Large outlier errors exist
   → Investigate outliers

🚩 R² = 0.95 but Adjusted R² = 0.30
   → Serious overfitting
   → Too many features

🚩 F1 metric alone for imbalanced data
   → Still incomplete
   → Also check ROC-AUC
```

---

## Summary Table

| Metric | Type | Formula | When to Use |
|--------|------|---------|------------|
| **MAE** | Regression | Σ\|y-ŷ\|/n | Outlier robustness |
| **RMSE** | Regression | √(Σ(y-ŷ)²/n) | Business communication |
| **R²** | Regression | 1-SSE/SST | Model comparison |
| **Accuracy** | Classification | (TP+TN)/Total | Balanced data only |
| **Precision** | Classification | TP/(TP+FP) | FP cost is high |
| **Recall** | Classification | TP/(TP+FN) | FN cost is high |
| **F1** | Classification | 2PR/(P+R) | Balance needed |
| **Specificity** | Classification | TN/(TN+FP) | TN rate matters |
| **ROC-AUC** | Classification | Area under curve | Imbalanced/threshold |

---

## Tips for CT Exam

### ✅ DO

- **Calculate ALL metrics for classification problems**
- **Build confusion matrix first, then calculate**
- **Mention dataset balance when choosing metrics**
- **Explain WHY you chose a metric** (business context)
- **Compare metrics across models**

### ❌ DON'T

- Don't use accuracy for imbalanced datasets
- Don't choose precision without mentioning recall tradeoff
- Don't calculate F1 without explaining what it means
- Don't forget to build confusion matrix
- Don't ignore the business context

---

## Next Topics

→ [Regularization](./05-regularization.md)  
→ [Gradient Descent](./06-gradient-descent.md)  
→ [Cross-Validation](./07-cross-validation.md)

