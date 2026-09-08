---
sidebar_position: 2
title: Module 2 Practice Problems
description: 40 practice problems covering cross-validation, logistic regression, classification metrics, model comparison, and decision boundaries
tags: [practice-problems, classification, cross-validation, logistic-regression, metrics]
---

# Module 2 Practice Problems

Complete these 40 problems to master classification and evaluation. Solutions available in the [Solutions Guide](./04-solutions-guide.md).

---

## Cross-Validation (8 Problems)

### Problem 1.1: 5-Fold CV Calculation
**Difficulty:** Easy | **Time:** 12 min | **Topics:** K-Fold CV

**Problem Statement:**
```
5-fold cross-validation results (MSE for each fold):

Fold 1: 0.25
Fold 2: 0.28
Fold 3: 0.22
Fold 4: 0.26
Fold 5: 0.29
```

**Questions:**
a) Calculate CV error (mean MSE)  
b) Calculate CV standard deviation  
c) What does the std dev tell you?  
d) Report as: CV MSE ± std dev  
e) Is this model stable? How do you know?  

---

### Problem 1.2: CV vs Single Split
**Difficulty:** Medium | **Time:** 15 min | **Topics:** CV Benefits

**Problem Statement:**
```
Same dataset, two evaluation approaches:

Approach A - Single 80-20 Split:
  Test MSE = 0.18

Approach B - 5-Fold CV:
  CV MSE = 0.26 ± 0.08
  Individual folds: [0.20, 0.32, 0.18, 0.28, 0.24]
```

**Questions:**
a) Why is CV error higher than single split?  
b) Which estimate is more trustworthy? Why?  
c) What does std dev ±0.08 indicate?  
d) What could the single split have gotten "lucky"?  
e) When would single split be sufficient?  

---

### Problem 1.3: LOOCV vs K-Fold
**Difficulty:** Medium | **Time:** 15 min | **Topics:** CV Variants

**Problem Statement:**
```
Dataset: 50 observations
Time to evaluate each CV method:

5-Fold CV:  5 model trainings, 15 seconds total
10-Fold CV: 10 model trainings, 30 seconds total
LOOCV:      50 model trainings, 150 seconds total
```

**Questions:**
a) Why does LOOCV take so much longer?  
b) When would you choose LOOCV over K-fold?  
c) What's the data usage difference?  
d) Is more CV always better? Why/why not?  
e) For 10,000 samples, which would you use?  

---

### Problem 1.4: Stratified K-Fold
**Difficulty:** Medium | **Time:** 15 min | **Topics:** Stratified CV for Imbalanced Data

**Problem Statement:**
```
Classification dataset: 100 observations
Class distribution: 90% negative, 10% positive (10 positives total)

Regular 5-Fold Split might give:
  Fold 1: 8 neg, 2 pos
  Fold 2: 10 neg, 0 pos (bad!)
  Fold 3: 9 neg, 1 pos
  Fold 4: 8 neg, 2 pos
  Fold 5: 9 neg, 1 pos (total: 44 neg, 6 pos = 12%)

Stratified 5-Fold Split:
  Each fold: 18 neg, 2 pos (consistent)
```

**Questions:**
a) Why is Fold 2 problematic?  
b) What does stratified mean?  
c) Why is stratified better for imbalanced data?  
d) Would stratification matter for 50-50 data?  
e) How does stratification affect CV results?  

---

### Problem 1.5: Hyperparameter Tuning with CV
**Difficulty:** Hard | **Time:** 20 min | **Topics:** Grid Search with CV

**Problem Statement:**
```
Ridge regression with different λ (5-fold CV):

λ = 0.001:   CV Error = 0.40 ± 0.05
λ = 0.01:    CV Error = 0.38 ± 0.04
λ = 0.1:     CV Error = 0.36 ± 0.03 ← Best
λ = 1.0:     CV Error = 0.42 ± 0.06
λ = 10.0:    CV Error = 0.55 ± 0.10

Max depth for tree (5-fold CV):
depth = 3:   CV Error = 0.35 ± 0.04 ← Best
depth = 5:   CV Error = 0.34 ± 0.05
depth = 10:  CV Error = 0.40 ± 0.08
```

**Questions:**
a) Which λ should you choose for Ridge? Why?  
b) Which depth should you choose for Tree? Why?  
c) Why might depth=5 look better but isn't chosen?  
d) Why is std dev important in comparison?  
e) How would you choose between Ridge and Tree?  

---

### Problem 1.6: Time Series CV
**Difficulty:** Hard | **Time:** 18 min | **Topics:** Time Series Evaluation

**Problem Statement:**
```
Stock price prediction (100 days of data):

Regular 5-Fold might train on: Days [5, 15, 25, 75] and test on [30, 60, 90]
This violates temporal order!

Time Series CV should use:
  Fold 1: Train [1-60], Test [61-70]
  Fold 2: Train [1-70], Test [71-80]
  Fold 3: Train [1-80], Test [81-90]
  Fold 4: Train [1-90], Test [91-100]
```

**Questions:**
a) Why does regular CV violate temporal order?  
b) What's the problem with that?  
c) Why is Time Series CV better?  
d) Can you use regular CV for time series?  
e) When else might order matter?  

---

### Problem 1.7: CV for Model Selection
**Difficulty:** Medium | **Time:** 15 min | **Topics:** CV for Comparison

**Problem Statement:**
```
Comparing 3 models (5-fold CV on same data):

Logistic Regression:  CV Accuracy = 0.82 ± 0.04
Decision Tree:        CV Accuracy = 0.80 ± 0.08
Random Forest:        CV Accuracy = 0.85 ± 0.03
```

**Questions:**
a) Which model would you choose? Why?  
b) What does std dev tell you about stability?  
c) Is Logistic better than Tree? How sure are you?  
d) Why is lower std dev preferable?  
e) Could a different random seed change results?  

---

### Problem 1.8: Nested CV for Hyperparameter Tuning
**Difficulty:** Hard | **Time:** 20 min | **Topics:** Advanced CV

**Problem Statement:**
```
Goal: Tune hyperparameter AND estimate generalization error

Outer loop (5-fold, for final error estimate)
  └─ Inner loop (5-fold, for hyperparameter tuning)

This gives:
- Unbiased error estimate (outer loop)
- Properly tuned hyperparameters (inner loop)
- No data leakage
```

**Questions:**
a) Why use nested CV instead of single CV?  
b) What's the risk of single CV?  
c) How many models are trained in nested CV?  
d) What does outer loop measure?  
e) What does inner loop measure?  

---

## Logistic Regression (10 Problems)

### Problem 2.1: Sigmoid Function
**Difficulty:** Easy | **Time:** 10 min | **Topics:** Sigmoid Function

**Problem Statement:**
```
Sigmoid function: σ(z) = 1 / (1 + e^(-z))

Calculate σ for:
a) z = 0
b) z = 1
c) z = -1
d) z = 2
e) z = -2
```

**Questions:**
a) Calculate each value (show work)  
b) What's the range of sigmoid?  
c) What value of z gives σ(z) = 0.5?  
d) As z → ∞, what does σ approach?  
e) As z → -∞, what does σ approach?  

---

### Problem 2.2: Probability Calculation
**Difficulty:** Easy | **Time:** 12 min | **Topics:** Logistic Probability

**Problem Statement:**
```
Logistic regression: P(y=1|x) = σ(-2 + 3x)

For x = [0, 1, 2, 3]:
  Calculate P(y=1) for each value
```

**Questions:**
a) Calculate P(y=1) for x=0  
b) Calculate P(y=1) for x=1  
c) Calculate P(y=1) for x=2  
d) Calculate P(y=1) for x=3  
e) At what x does P = 0.5?  

---

### Problem 2.3: Binary Classification
**Difficulty:** Easy | **Time:** 12 min | **Topics:** Classification from Probabilities

**Problem Statement:**
```
Using threshold = 0.5:

If P(y=1|x) > 0.5 → Predict 1
If P(y=1|x) ≤ 0.5 → Predict 0

Test cases:
a) P = 0.3
b) P = 0.5
c) P = 0.7
d) P = 0.9
e) P = 0.1
```

**Questions:**
a-e) Predict class for each  
f) What's the effect of threshold choice?  
g) Would threshold=0.7 change predictions?  
h) When should you use threshold ≠ 0.5?  

---

### Problem 2.4: Logit Function
**Difficulty:** Medium | **Time:** 15 min | **Topics:** Log-Odds

**Problem Statement:**
```
Logit function: log(p/(1-p)) = log-odds

Logistic model: log-odds = b₀ + b₁x

If b₀ = -1, b₁ = 0.5, and x = 2:
  log-odds = -1 + 0.5(2) = 0
  odds = e^0 = 1
  p = 1/2 = 0.5
```

**Questions:**
a) For x = 0, calculate log-odds, odds, and p  
b) For x = 4, calculate log-odds, odds, and p  
c) What does b₁ = 0.5 mean in terms of odds?  
d) How much do odds change when x increases by 1?  
e) Interpret: "odds increase by factor of e^b₁"  

---

### Problem 2.5: Coefficient Interpretation
**Difficulty:** Medium | **Time:** 15 min | **Topics:** Interpretation

**Problem Statement:**
```
Email spam classifier:

P(spam) = σ(-3 + 0.02×word_count - 0.05×reputation)

Coefficients:
  b₀ = -3 (intercept)
  b₁ = 0.02 (word_count)
  b₂ = -0.05 (reputation)
```

**Questions:**
a) What does b₀ = -3 mean?  
b) What does b₁ = 0.02 mean? (Be careful: it's not +0.02 probability!)  
c) What does b₂ = -0.05 mean?  
d) Which feature is more important?  
e) If word_count increases by 10, how much do odds change?  

---

### Problem 2.6: Multi-Class: One-vs-Rest (OvR)
**Difficulty:** Medium | **Time:** 15 min | **Topics:** Multi-Class Classification

**Problem Statement:**
```
Iris classification (3 classes: Setosa, Versicolor, Virginica)

OvR approach: Train 3 binary classifiers

Classifier 1 (Setosa vs Rest):      P₁ = 0.7
Classifier 2 (Versicolor vs Rest):  P₂ = 0.3
Classifier 3 (Virginica vs Rest):   P₃ = 0.2
```

**Questions:**
a) Which class would you predict?  
b) How do you choose when probabilities don't sum to 1?  
c) What's the problem with probabilities not summing to 1?  
d) When do you use OvR?  
e) When would you use Softmax instead?  

---

### Problem 2.7: Multi-Class: Softmax
**Difficulty:** Hard | **Time:** 18 min | **Topics:** Softmax Regression

**Problem Statement:**
```
Softmax gives probability for each class:

Raw scores: z₁ = 2.0, z₂ = 1.0, z₃ = 0.1

Softmax: P(class k) = e^(z_k) / Σe^(z_j)

Calculate:
a) e^2.0, e^1.0, e^0.1
b) Sum = e^2.0 + e^1.0 + e^0.1
c) P(class 1), P(class 2), P(class 3)
```

**Questions:**
a-c) Calculate as shown  
d) Verify probabilities sum to 1  
e) Which class would you predict?  
f) Why is Softmax better than OvR?  

---

### Problem 2.8: Threshold Impact
**Difficulty:** Medium | **Time:** 15 min | **Topics:** Decision Threshold

**Problem Statement:**
```
Fraud detection (binary classification):

Predicted probabilities for 5 transactions:
[0.1, 0.3, 0.6, 0.8, 0.9]

Actual class:
[0,   0,   0,   1,   1]

Using different thresholds:
  Threshold = 0.3: Predict [0, 1, 1, 1, 1]
  Threshold = 0.5: Predict [0, 0, 1, 1, 1]
  Threshold = 0.7: Predict [0, 0, 0, 1, 1]
```

**Questions:**
a) Calculate confusion matrix for each threshold  
b) Calculate precision for each threshold  
c) Calculate recall for each threshold  
d) Which threshold minimizes false positives?  
e) Which threshold minimizes false negatives?  

---

### Problem 2.9: Class Weights
**Difficulty:** Hard | **Time:** 18 min | **Topics:** Handling Imbalanced Data

**Problem Statement:**
```
Medical diagnosis (disease is rare):
  90% negative (healthy)
  10% positive (diseased)

Standard model: Ignores class imbalance, achieves 95% accuracy
  But fails to detect most diseased patients!

Weighted model: Assigns higher weight to positive class
  More balanced precision and recall
```

**Questions:**
a) Why does standard model achieve high accuracy?  
b) What metric matters more than accuracy here?  
c) How do class weights help?  
d) What weight ratio would you use (pos:neg)?  
e) Is equal weight always appropriate?  

---

### Problem 2.10: Logistic vs Linear Regression
**Difficulty:** Hard | **Time:** 15 min | **Topics:** Model Choice

**Problem Statement:**
```
Problem: Predict "Will student pass exam?" (0 or 1)

Option A: Linear regression: ŷ = 0.1 + 0.5×(study_hours)
Option B: Logistic regression: P(pass) = σ(−2 + 1×study_hours)

Linear predictions for study_hours = -5, 0, 5, 10, 15:
  ŷ = [-1.4, 0.1, 2.6, 5.1, 7.6]

Logistic predictions:
  P = [0.007, 0.119, 0.881, 0.995, 0.999]
```

**Questions:**
a) Why is linear regression problematic here?  
b) Which model ensures 0 ≤ prediction ≤ 1?  
c) For study_hours = -5, which makes sense?  
d) When would linear regression be acceptable?  
e) Should you always use logistic for binary?  

---

## Classification Metrics (10 Problems)

### Problem 3.1: Confusion Matrix
**Difficulty:** Easy | **Time:** 10 min | **Topics:** Confusion Matrix

**Problem Statement:**
```
Binary classification predictions vs actual:

Predicted:  [1, 1, 0, 1, 0, 0, 1, 1, 0, 0]
Actual:     [1, 0, 0, 1, 0, 1, 1, 1, 0, 0]

Build confusion matrix:
        Predicted
        Pos  Neg
Actual  Pos  TP   FN
        Neg  FP   TN
```

**Questions:**
a) Count TP, TN, FP, FN  
b) What does each represent?  
c) Which cell represents correct predictions?  
d) Which cell represents false alarms?  
e) Which cell represents missed cases?  

---

### Problem 3.2: Precision & Recall
**Difficulty:** Easy | **Time:** 12 min | **Topics:** Precision, Recall

**Problem Statement:**
```
Medical test (disease detection):

Confusion matrix:
        Predicted Disease
        Yes  No
Actual  Yes  45  5    (50 actual positive)
        No   10  440  (450 actual negative)
```

**Questions:**
a) Calculate TP, TN, FP, FN  
b) Calculate Precision = TP / (TP + FP)  
c) Calculate Recall = TP / (TP + FN)  
d) Interpret precision: "Of positive predictions, __% correct"  
e) Interpret recall: "Of actual positives, __% detected"  

---

### Problem 3.3: F1 Score
**Difficulty:** Easy | **Time:** 12 min | **Topics:** F1 Score

**Problem Statement:**
```
Two models on spam detection:

Model A: Precision = 0.8, Recall = 0.5
Model B: Precision = 0.6, Recall = 0.9

F1 = 2 × (Precision × Recall) / (Precision + Recall)
```

**Questions:**
a) Calculate F1 for Model A  
b) Calculate F1 for Model B  
c) Which model has higher F1?  
d) When should you use F1 vs accuracy?  
e) Can high precision with low recall be problematic?  

---

### Problem 3.4: Accuracy & Other Metrics
**Difficulty:** Medium | **Time:** 12 min | **Topics:** Overall Performance

**Problem Statement:**
```
Binary classification results:

TP = 70, FP = 10, TN = 100, FN = 20

Calculate:
a) Accuracy = (TP+TN) / (Total)
b) True Positive Rate (TPR/Recall) = TP / (TP+FN)
c) True Negative Rate (TNR/Specificity) = TN / (TN+FP)
d) False Positive Rate (FPR) = FP / (FP+TN)
```

**Questions:**
a-d) Calculate each metric  
e) What's relationship between TPR and FPR?  
f) Which metric is most important? Why?  

---

### Problem 3.5: ROC Curve Construction
**Difficulty:** Hard | **Time:** 25 min | **Topics:** ROC Curves

**Problem Statement:**
```
Classification with probability scores:

Sample  Prob(class=1)  Actual
1       0.9            1
2       0.8            1
3       0.7            0
4       0.6            1
5       0.5            0
6       0.4            0
7       0.3            1
8       0.2            0

Build ROC curve using different thresholds
```

**Questions:**
a) Sort by probability (descending)  
b) For threshold = 0.95: Calculate TPR, FPR  
c) For threshold = 0.65: Calculate TPR, FPR  
d) For threshold = 0.05: Calculate TPR, FPR  
e) Plot points and sketch ROC curve  

---

### Problem 3.6: AUC (Area Under Curve)
**Difficulty:** Hard | **Time:** 20 min | **Topics:** AUC

**Problem Statement:**
```
ROC curve with points:

Threshold    FPR    TPR
1.0         0.00   0.00
0.9         0.00   0.25
0.7         0.17   0.50
0.5         0.33   0.75
0.3         0.50   0.75
0.1         1.00   1.00
```

**Questions:**
a) Plot these points  
b) Estimate AUC (area under curve)  
c) What does AUC = 0.8 mean?  
d) What would AUC = 0.5 mean?  
e) What would AUC = 1.0 mean?  

---

### Problem 3.7: Precision-Recall Curve
**Difficulty:** Medium | **Time:** 15 min | **Topics:** PR Curves

**Problem Statement:**
```
Same predictions as ROC problem, but now:

Threshold    Precision  Recall
0.9         1.00       0.25
0.7         0.67       0.50
0.5         0.60       0.75
0.3         0.50       0.75
0.1         0.50       1.00
```

**Questions:**
a) How does PR curve differ from ROC?  
b) When should you use PR curve vs ROC?  
c) Which metrics does PR curve show?  
d) Why is PR curve useful for imbalanced data?  
e) Can PR curve show all possible points?  

---

### Problem 3.8: Threshold Tuning for Business
**Difficulty:** Hard | **Time:** 20 min | **Topics:** Cost-Based Threshold

**Problem Statement:**
```
Fraud detection with costs:

False Positive: Miss opportunity to block fraud → Cost: $1000 (fraud loss)
True Positive:  Correctly block fraud → Benefit: $1000 saved
False Negative: Block legitimate transaction → Cost: $10 (customer frustration)
True Negative:  Correctly allow legitimate → Benefit: $0

Current confusion matrix (threshold=0.5):
  TP=80, FP=20, TN=900, FN=10
  
If we lower threshold to 0.3:
  TP=85, FP=40, TN=880, FN=5
```

**Questions:**
a) Calculate cost for threshold=0.5  
b) Calculate cost for threshold=0.3  
c) Which threshold is better?  
d) How would you find optimal threshold?  
e) Why does business context matter?  

---

### Problem 3.9: Multi-Class Metrics
**Difficulty:** Medium | **Time:** 15 min | **Topics:** Multi-Class Metrics

**Problem Statement:**
```
3-class classification results:

       Predicted
       A  B  C
Actual A  40 5  5  (50 total)
       B  2  45 3  (50 total)
       C  3  2  45 (50 total)
```

**Questions:**
a) Calculate precision for each class  
b) Calculate recall for each class  
c) Calculate F1 for each class  
d) Calculate macro-averaged F1 (average across classes)  
e) Calculate weighted F1 (weights by class frequency)  

---

### Problem 3.10: Metric Selection by Problem
**Difficulty:** Hard | **Time:** 15 min | **Topics:** Metric Choice

**Problem Statement:**
```
Choose best metric(s) for:

A) Medical diagnosis (false negatives very costly)
B) Email spam filtering (false positives annoying)
C) Loan approval (both errors costly)
D) Product recommendation (slightly wrong OK, missing bad)
E) Malware detection (missing = breach = disaster)
```

**Questions:**
a) For A: Recall or Precision?  
b) For B: Recall or Precision?  
c) For C: Which single metric? Or multiple?  
d) For D: Which metric?  
e) For E: Which metric?  

---

## Model Comparison (8 Problems)

### Problem 4.1: Algorithm Selection Framework
**Difficulty:** Medium | **Time:** 15 min | **Topics:** Model Selection

**Problem Statement:**
```
Available algorithms:
- Logistic Regression (fast, interpretable, linear boundary)
- Decision Tree (moderate speed, easy rules, nonlinear)
- Random Forest (slow, complex, best accuracy)
- Neural Network (very slow, black box, needs big data)

Scenarios:
A) Need results in real-time (<1ms), 1000 samples
B) Need explanations to business team, 5000 samples
C) Have 100k samples, accuracy paramount
D) Small dataset (50 samples), must avoid overfitting
```

**Questions:**
a) Choose algorithm for A. Why?  
b) Choose algorithm for B. Why?  
c) Choose algorithm for C. Why?  
d) Choose algorithm for D. Why?  
e) List 3 factors in algorithm selection  

---

### Problem 4.2: Bias-Variance Across Models
**Difficulty:** Medium | **Time:** 15 min | **Topics:** Bias-Variance Trade-Off

**Problem Statement:**
```
Train/Test Performance:

Linear Model:        Train 0.75, Test 0.73 (gap: 0.02)
Tree (depth=5):      Train 0.85, Test 0.82 (gap: 0.03)
Tree (depth=20):     Train 0.98, Test 0.70 (gap: 0.28)
Random Forest:       Train 0.92, Test 0.88 (gap: 0.04)
```

**Questions:**
a) Which has highest bias?  
b) Which has highest variance?  
c) Which would you choose?  
d) Why does deep tree fail?  
e) What does RF do well?  

---

### Problem 4.3: Performance vs Interpretability
**Difficulty:** Hard | **Time:** 18 min | **Topics:** Trade-Offs

**Problem Statement:**
```
Competing models:

Model A (Logistic):     Accuracy 85%, explain: "0.5×Age + 0.3×Income"
Model B (Neural Net):   Accuracy 92%, explain: "???"

Context: Bank loan approval (must explain why loans rejected)
```

**Questions:**
a) Which model achieves better accuracy?  
b) Which is more interpretable?  
c) Which would you choose for bank? Why?  
d) Could you use both? How?  
e) When is accuracy more important than interpretability?  

---

### Problem 4.4: Data Size Impact
**Difficulty:** Medium | **Time:** 15 min | **Topics:** Sample Size Considerations

**Problem Statement:**
```
Different dataset sizes:

Small (n=50):
  Logistic: 80% acc | Tree: 82% acc | NN: 75% acc
  
Medium (n=500):
  Logistic: 82% acc | Tree: 85% acc | NN: 87% acc
  
Large (n=50k):
  Logistic: 83% acc | Tree: 86% acc | NN: 92% acc
```

**Questions:**
a) Why does NN perform poorly on small data?  
b) Why does NN improve with more data?  
c) Why is logistic stable across sizes?  
d) What's the minimum n for neural network?  
e) For small data, which model would you use?  

---

### Problem 4.5: Cost-Benefit Analysis
**Difficulty:** Hard | **Time:** 20 min | **Topics:** Business Impact

**Problem Statement:**
```
Customer churn prediction:

Model A (Logistic):
  Accuracy 85%, Training time 2 sec
  Precision 0.75, Recall 0.70
  
Model B (Gradient Boost):
  Accuracy 88%, Training time 120 sec
  Precision 0.80, Recall 0.75

Costs:
  False negative (missed churner): $500 (lose customer)
  False positive (unnecessary intervention): $50 (call center cost)
  Training cost: $100/hour (0.027/sec)

Population: 1000 customers, 100 expected churners
```

**Questions:**
a) For each model, calculate expected costs  
b) Calculate benefit of 3% accuracy improvement  
c) Should you use Model B? Why?  
d) What if training cost doubled?  
e) What would break-even accuracy difference be?  

---

### Problem 4.6: Model Ensemble
**Difficulty:** Hard | **Time:** 15 min | **Topics:** Ensemble Methods

**Problem Statement:**
```
Three models on same problem:

Model 1 (Logistic):      Accuracy 0.82
Model 2 (Decision Tree): Accuracy 0.81
Model 3 (SVM):           Accuracy 0.80

Ensemble (voting):
  If 2+ predict class 1 → Predict 1
  Else → Predict 0
```

**Questions:**
a) When might ensemble outperform single models?  
b) When might ensemble underperform?  
c) Why not always use ensembles?  
d) What's the trade-off?  
e) Compare to just using best single model  

---

### Problem 4.7: Production Deployment
**Difficulty:** Hard | **Time:** 15 min | **Topics:** Deployment Considerations

**Problem Statement:**
```
Choosing between models for production:

Model A:
  - Accuracy: 94%
  - Size: 2 MB
  - Inference time: 5 ms
  - Retraining: Monthly
  
Model B:
  - Accuracy: 96%
  - Size: 800 MB
  - Inference time: 500 ms
  - Retraining: Weekly
```

**Questions:**
a) For real-time mobile app (must respond <100ms), which?  
b) For batch processing (accuracy critical), which?  
c) For resource-constrained device (memory <50MB), which?  
d) What other factors affect deployment choice?  
e) Would you use both models? How?  

---

### Problem 4.8: When to Retrain
**Difficulty:** Medium | **Time:** 12 min | **Topics:** Model Maintenance

**Problem Statement:**
```
Monitoring model performance over time:

Month 1-3: Accuracy 0.90
Month 4-6: Accuracy 0.87
Month 7-9: Accuracy 0.82
Month 10-12: Accuracy 0.76

Pattern: Data distribution shifting (data drift)
```

**Questions:**
a) Why is accuracy declining?  
b) When should you retrain?  
c) What monitoring would you put in place?  
d) How often should you retrain?  
e) What else might cause performance decay?  

---

## Decision Boundaries (4 Problems)

### Problem 5.1: Boundary Shape Identification
**Difficulty:** Medium | **Time:** 15 min | **Topics:** Decision Boundaries

**Problem Statement:**
```
Visualize decision boundaries (text representation):

Model A (Linear):
    X₂
    │  ●●●
    │ ●  /  ●
    │●   / ●
    │   /
    │  ○○○
    └────── X₁

Model B (Tree):
    X₂
    │  ┌─●●●─┐
    │  │● ○ ●│
    │  ├─ ○ ─┤
    │  │ ○ ○ │
    │  └─────┘
    └────── X₁
```

**Questions:**
a) Describe boundary shape for Model A  
b) Describe boundary shape for Model B  
c) Which is more flexible?  
d) Which can Model A fit perfectly?  
e) Which would overfit on small data?  

---

### Problem 5.2: Overfitting vs Underfitting
**Difficulty:** Medium | **Time:** 15 min | **Topics:** Model Complexity Diagnosis

**Problem Statement:**
```
Train/test performance with different boundary complexities:

Simple boundary:       Train 0.75, Test 0.74
Medium boundary:       Train 0.85, Test 0.83
Complex boundary:      Train 0.98, Test 0.65
Very complex boundary: Train 1.00, Test 0.50
```

**Questions:**
a) Which boundary shows underfitting?  
b) Which shows good fit?  
c) Which shows overfitting?  
d) What does very complex boundary's perfect training accuracy mean?  
e) How would you fix overfitting?  

---

### Problem 5.3: Boundary Shape Indicates Model
**Difficulty:** Hard | **Time:** 15 min | **Topics:** Model Interpretation

**Problem Statement:**
```
You observe these decision boundaries in 2D space:

Boundary A: Straight line dividing space
Boundary B: Axis-aligned rectangular regions
Boundary C: Curved, irregular boundary
Boundary D: Circular/radial pattern
```

**Questions:**
a) Which boundary likely comes from logistic regression?  
b) Which from a decision tree?  
c) Which might be from a deep tree (overfitted)?  
d) Which from RBF SVM?  
e) Can a linear model create Boundary D?  

---

### Problem 5.4: Practical Boundary Scenario
**Difficulty:** Hard | **Time:** 18 min | **Topics:** Real-World Interpretation

**Problem Statement:**
```
Fraud detection with 2 features:
  X₁ = Transaction amount ($)
  X₂ = Time since last transaction (hours)

Actual fraud patterns (spiral shape):
  - Small transactions, frequent (legitimate)
  - Medium transactions, irregular (some fraud)
  - Large transactions, rare (high risk)

Model's decision boundary is straight line (logistic regression)
```

**Questions:**
a) Would logistic capture the spiral pattern?  
b) What type of model would be better?  
c) Would boundary shape indicate underfitting?  
d) Could you fix with feature engineering?  
e) What boundary shape would you expect from random forest?  

---

## Summary & Next Steps

**Completed Module 2 (40 problems)?**

✓ If mostly Easy: Review Medium problems and revisit concept pages  
✓ If mostly Medium: Challenge yourself with Hard problems  
✓ If all problems done: Try [Mixed & Real-World Problems](./03-mixed-problems.md)  

**Need solutions?** See [Solutions Guide](./04-solutions-guide.md)

**Ready for integrated problems?** → [Mixed & Real-World Problems](./03-mixed-problems.md)

