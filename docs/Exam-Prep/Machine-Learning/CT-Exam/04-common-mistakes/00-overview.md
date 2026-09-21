---
sidebar_position: 0
title: Common Mistakes Reference
description: Comprehensive guide to common errors, misconceptions, and pitfalls in ML with solutions and prevention strategies
tags: [common-mistakes, debugging, pitfalls, reference]
---

# Common Mistakes Reference

Learn what NOT to do by studying the most common errors students (and professionals!) make.

:::tip Use This Guide

1. **Before exam** - Review mistakes in weak areas
2. **When stuck** - Check if you made a common error
3. **When debugging** - Find similar problems and solutions
4. **While coding** - Reference to avoid pitfalls

:::

---

## Linear Regression Mistakes

### ❌ Mistake 1.1: Forgetting to Square Residuals in SSE

**The Error:**
```
SSE = |e₁| + |e₂| + |e₃| + |e₄|  ← WRONG!
```

**Why It's Wrong:**
- SSE means **Sum of Squared Errors**
- Should be: SSE = e₁² + e₂² + e₃² + e₄²
- Not squaring changes the metric (becomes MAE instead)

**Correct Way:**
```
Residuals: [2, -1, 3, -2]
SSE = 2² + (-1)² + 3² + (-2)²
    = 4 + 1 + 9 + 4 = 18

Wrong way: |2| + |-1| + |3| + |-2| = 8 (MAE, not SSE)
```

**Prevention:**
- Remember: **S** in SSE = **S**quared
- Always write out: Σ(eᵢ)², not Σ|eᵢ|

---

### ❌ Mistake 1.2: Using n vs (n-1) Inconsistently

**The Error:**
```
MSE = SSE / n           ← Sometimes right, sometimes wrong!
Std Dev = √[Σ(xᵢ-x̄)² / n-1]  ← Inconsistent with above
```

**Why It's Confusing:**
- **For sample statistics:** Use (n-1) (unbiased estimator)
- **For population parameters:** Use n
- **In this course:** Usually use n (unless specified otherwise)

**Correct Way:**
```
For exam problems:
  MSE = SSE / n
  Variance = Σ(xᵢ-x̄)² / n
  
Exception: If problem says "sample" or asks for "unbiased estimate"
  Then use (n-1)
```

**Prevention:**
- Check problem statement for context
- Be consistent within a problem
- In doubt, use n for calculation but note assumption

---

### ❌ Mistake 1.3: Misinterpreting Logistic Coefficients

**The Error:**
```
Logistic model: P(y=1) = σ(-2 + 0.5×Age)

"The coefficient is 0.5, so each year of age increases 
probability of success by 0.5" ← WRONG!
```

**Why It's Wrong:**
- In logistic regression, coefficient doesn't directly translate to probability change
- The relationship is **nonlinear** (sigmoid function)
- 0.5 increase in log-odds ≠ 0.5 increase in probability

**Correct Interpretation:**
```
Coefficient b₁ = 0.5:
- Increasing X by 1 unit increases odds by factor of e^0.5 ≈ 1.65
- Odds increase by 65%
- Probability change depends on current probability
  (At P=0.5: change ≈ 0.122, not 0.5!)
```

**Prevention:**
- Don't confuse logistic with linear regression
- Use odds ratio interpretation: e^coefficient
- Understand nonlinearity of sigmoid

---

### ❌ Mistake 1.4: Ignoring Feature Scaling Impact

**The Error:**
```
Features in very different scales:
  Income: 0 to $200,000
  Age: 0 to 100

Fit model without scaling
→ Large coefficients for Income, small for Age
→ Mistake: Conclude Income is "more important"!
```

**Why It's Wrong:**
- Unscaled features have different units
- Large coefficients ≠ more important
- Gradient descent slower with unscaled features

**Correct Approach:**
```python
from sklearn.preprocessing import StandardScaler

scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)
model.fit(X_scaled, y)

# Now coefficients are comparable!
```

**Prevention:**
- Always check feature scales
- Scale features before fitting (especially for tree models)
- After scaling: |coefficient| can indicate importance

---

### ❌ Mistake 1.5: Using R² on Test Set Without Context

**The Error:**
```
Model A (on test set): R² = 0.92
Model B (on test set): R² = 0.87

Conclusion: "Model A is clearly better!" ← Not necessarily!
```

**Why It's Wrong:**
- R² alone doesn't tell full story
- Need to know:
  - How many features each model has?
  - Is R² overfitting?
  - What's the adjusted R²?
  - How much data?

**Correct Analysis:**
```
Model A: R² = 0.92, Adjusted R² = 0.85, 50 features
Model B: R² = 0.87, Adjusted R² = 0.85, 5 features

Model B is actually better! (simpler, less overfitting)
```

**Prevention:**
- Always use adjusted R² when comparing models
- Consider model complexity
- Check train vs test gap

---

## Classification Mistakes

### ❌ Mistake 2.1: Using Accuracy on Imbalanced Data

**The Error:**
```
Dataset: 95% negative, 5% positive
Model: Always predicts "negative"
Accuracy: 95% ← Looks great, but USELESS!
```

**Why It's Wrong:**
- On imbalanced data, high accuracy is misleading
- Model achieves 95% just by ignoring positive class
- Better metrics: Precision, Recall, F1, ROC-AUC

**Correct Approach:**
```
# Wrong
accuracy = (TP + TN) / Total = 95%

# Right - check individual classes
precision = TP / (TP + FP) = 0/5 = 0% ← Model fails!
recall = TP / (TP + FN) = 0/5 = 0% ← Can't detect minority

# Use balanced metrics
f1_score or roc_auc_score
```

**Prevention:**
- Always check class distribution
- For imbalanced data: Use Precision, Recall, F1, or AUC
- Never trust accuracy alone

---

### ❌ Mistake 2.2: Confusing Precision and Recall

**The Error:**
```
Medical test (disease detection):
"Precision = 0.80 means 80% of actual patients tested positive" ← WRONG!

Correct: Precision = 0.80 means "Of positive predictions, 80% are correct"
```

**Why Confusion Happens:**
- Both measure "correctness" but different angles
- **Precision:** Of predicted positives, how many are correct?
- **Recall:** Of actual positives, how many did we find?

**Correct Definitions:**
```
Precision = TP / (TP + FP)
  "Of people we said are sick, 80% actually are"
  Cares about: False positives (wrong alarms)

Recall = TP / (TP + FN)
  "Of people who are actually sick, 80% we caught"
  Cares about: False negatives (missed cases)
```

**When Each Matters:**
```
Spam filter: Precision matters
  (False positive = lose email, bad!)

Medical diagnosis: Recall matters
  (False negative = miss disease, dangerous!)
```

**Prevention:**
- Memorize: Precision = Of what we predicted positive, how many right?
- Memorize: Recall = Of actual positives, how many did we find?
- Think: Which error is worse?

---

### ❌ Mistake 2.3: Wrong Threshold Direction

**The Error:**
```
Problem: Fraud detection, want high recall (catch fraud)

Action: Increase threshold to 0.8
Result: Recall DECREASES! ← Wrong direction!
```

**Why It's Wrong:**
- Threshold controls prediction strictness
- **Higher threshold** = more strict = fewer positive predictions
  → Lower recall, higher precision
- **Lower threshold** = more lenient = more positive predictions
  → Higher recall, lower precision

**Correct Logic:**
```
Want higher Recall? → Lower threshold (catch more fraud)
Want higher Precision? → Raise threshold (reduce false alarms)

Example:
  Threshold 0.1: TP=90, FP=100 → Recall=90%, Precision=47%
  Threshold 0.5: TP=70, FP=10  → Recall=70%, Precision=88%
  Threshold 0.9: TP=40, FP=2   → Recall=40%, Precision=95%
```

**Prevention:**
- Test different thresholds and observe
- Remember: Lower threshold → catch more (higher recall)
- Use visualization: plot recall/precision vs threshold

---

### ❌ Mistake 2.4: Not Using Stratified CV for Imbalanced Data

**The Error:**
```
Imbalanced dataset: 90% negative, 10% positive

Regular K-Fold might split as:
  Fold 1: 92% negative, 8% positive ← Different ratio!
  Fold 2: 88% negative, 12% positive ← Different ratio!

CV results unreliable
```

**Why It's Wrong:**
- Random splitting changes class distribution
- Different folds test on different distributions
- Results vary more than necessary

**Correct Approach:**
```python
# Wrong
kfold = KFold(n_splits=5, shuffle=True)

# Right
kfold = StratifiedKFold(n_splits=5, shuffle=True)
# Ensures each fold has same class ratio as original
```

**Prevention:**
- Always check class distribution
- For classification: Use StratifiedKFold
- For imbalanced data: Essential!

---

## Cross-Validation Mistakes

### ❌ Mistake 3.1: Not Fixing Random Seed

**The Error:**
```python
# Run 1
cv_scores1 = cross_val_score(model, X, y, cv=5)

# Run 2 (same data, same model)
cv_scores2 = cross_val_score(model, X, y, cv=5)

# Results are different! → Hard to reproduce
```

**Why It's Wrong:**
- Without fixed seed, CV splits differ each run
- Hard to compare models fairly
- Results not reproducible

**Correct Approach:**
```python
# Fix random seed
cv_scores1 = cross_val_score(
    model, X, y, cv=KFold(n_splits=5, random_state=42)
)

# Run again with same seed → Same results
cv_scores2 = cross_val_score(
    model, X, y, cv=KFold(n_splits=5, random_state=42)
)

# cv_scores1 == cv_scores2
```

**Prevention:**
- Always set `random_state=42` (or any consistent number)
- Makes work reproducible
- Essential for comparing models

---

### ❌ Mistake 3.2: Tuning Hyperparameters on Test Set

**The Error:**
```python
# WRONG: Data leakage!
best_lambda = None
best_score = -np.inf

for lambda in [0.001, 0.01, 0.1, 1.0]:
    model = Ridge(alpha=lambda)
    model.fit(X_train, y_train)
    
    # Evaluating on TEST set to tune parameter!
    score = model.score(X_test, y_test)
    if score > best_score:
        best_score = score
        best_lambda = lambda

# Chosen lambda is overfitted to test set!
```

**Why It's Wrong:**
- Test set should be completely untouched until final evaluation
- Tuning on test set causes overfitting to test set
- Final performance estimate is too optimistic

**Correct Approach:**
```python
# Right: Use validation set or CV
from sklearn.model_selection import GridSearchCV

param_grid = {'alpha': [0.001, 0.01, 0.1, 1.0]}

grid = GridSearchCV(Ridge(), param_grid, cv=5)
grid.fit(X_train, y_train)

best_lambda = grid.best_params_['alpha']
best_model = grid.best_estimator_

# Final evaluation
final_score = best_model.score(X_test, y_test)
```

**Prevention:**
- Never touch test set for tuning
- Use CV or validation set for hyperparameter selection
- Only use test set for final evaluation once

---

## Bias-Variance Mistakes

### ❌ Mistake 4.1: Confusing High Training Error with High Variance

**The Error:**
```
Model A: Train error 0.05, Test error 0.90
Conclusion: "High variance (overfitting)" ← WRONG!

Correct: This is actually HIGH BIAS (underfitting)!
```

**Why It's Wrong:**
- High training error itself indicates bias
- High variance means: low train, high test gap
- This has both high train AND high test → Bias

**Correct Diagnosis:**
```
High train error + high test error = HIGH BIAS (too simple)
Low train error + high test error = HIGH VARIANCE (overfitting)
Low train error + low test error = GOOD FIT
```

**Prevention:**
- Look at TRAINING error first
  - If high: Bias problem
  - If low: Check test error (if high → Variance problem)
- Make diagnosis table

---

### ❌ Mistake 4.2: Adding Data Won't Help Everything

**The Error:**
```
Problem: High training error (underfitting)
Action: Collect more data
Result: No improvement! ← Wasted effort!
```

**Why It's Wrong:**
- More data helps **high variance** (overfitting)
- More data doesn't help **high bias** (underfitting)
- Solution depends on problem type

**Correct Solutions:**
```
High Bias (underfitting):
  → Increase model complexity
  → Add features
  → Train longer
  → More data won't help much!

High Variance (overfitting):
  → Get more data ✓
  → Reduce features
  → Regularization
  → Simpler model
```

**Prevention:**
- Diagnose before choosing solution
- Understand what each fix targets
- Learning curves: Diagnose problem type

---

## Evaluation Metrics Mistakes

### ❌ Mistake 5.1: Averaging Metrics Incorrectly

**The Error:**
```
3-class problem:
  Class A: Precision 0.90
  Class B: Precision 0.80
  Class C: Precision 0.70

"Average precision = 0.80" ← Usually wrong!

Should be: Weighted by class frequency
  If each class: 0.80
  If A=50%, B=30%, C=20%: 0.90×0.5 + 0.80×0.3 + 0.70×0.2 = 0.82
```

**Why It's Wrong:**
- Macro average (unweighted) treats all classes equal
- Weighted average (by frequency) more realistic
- Choice depends on problem

**Correct Approaches:**
```
Macro Average: (P_A + P_B + P_C) / 3 = 0.80
  Each class weighted equally
  Use if: All classes equally important

Weighted Average: (P_A×n_A + P_B×n_B + P_C×n_C) / Total
  Classes weighted by frequency
  Use if: Population distribution matters
  
Micro Average: Calculate globally first
  (All TP, FP, FN combined) then compute
  Use if: Focus on overall performance
```

**Prevention:**
- Always specify which averaging method
- Check documentation
- Default often is wrong choice for your problem

---

### ❌ Mistake 5.2: Ignoring Class Imbalance in Multi-Class

**The Error:**
```
Multi-class with severe imbalance:
  Class A: 70% of data
  Class B: 20% of data
  Class C: 10% of data

Macro F1 = 0.70 (treating all equal)
Weighted F1 = 0.68 (realistic performance)

Reporting only macro F1 is misleading!
```

**Why It's Wrong:**
- Imbalanced data means model might ignore rare classes
- Macro average hides this
- Weighted average more honest

**Prevention:**
- Always check class distribution
- Report both macro and weighted metrics
- Visualize per-class performance

---

## Decision Threshold Mistakes

### ❌ Mistake 6.1: Not Tuning Threshold for Business Cost

**The Error:**
```
Binary classification: Default threshold = 0.5

"Good enough" → Use default threshold
Cost analysis: Cost of FN = $10,000, Cost of FP = $100

Optimal threshold ≠ 0.5 (should be much lower!)
→ Missing potential savings
```

**Why It's Wrong:**
- Default threshold (0.5) is rarely optimal
- Business costs should drive threshold choice
- Often needs lower threshold to catch expensive mistakes

**Correct Approach:**
```
For each threshold:
  Calculate: Cost = (FN × Cost_FN) + (FP × Cost_FP)
  
Choose threshold that minimizes cost

Example:
  Threshold 0.3: Cost = 50×$10k + 200×$100 = $520k
  Threshold 0.5: Cost = 100×$10k + 50×$100 = $1.005M ← More expensive!
  Threshold 0.7: Cost = 150×$10k + 10×$100 = $1.501M

Choose threshold 0.3
```

**Prevention:**
- Always do cost-benefit analysis
- Don't assume 0.5 is optimal
- Consider business impact

---

## Real-World Application Mistakes

### ❌ Mistake 7.1: Training on Biased Historical Data

**The Error:**
```
Loan approval model trained on historical data:
- Historical data: Past discrimination in lending
- Model learns: "Group X is higher risk" (due to past bias, not actual risk)
- Model perpetuates and amplifies historical discrimination

Model accuracy looks good, but systematically unfair!
```

**Why It's Wrong:**
- Historical data contains human biases
- Model learns biases as patterns
- "Good accuracy" ≠ "Fair model"

**Prevention:**
- Audit data for biases
- Consider fairness metrics
- Be aware of feedback loops
- Evaluate per-group performance

---

### ❌ Mistake 7.2: Not Monitoring Model Performance in Production

**The Error:**
```
Deploy model with 92% accuracy
After 3 months: Accuracy drops to 78%

Never noticed! → Poor decisions made for months
```

**Why It's Wrong:**
- Data distribution can shift over time
- Model performance degrades naturally
- Need continuous monitoring

**Correct Approach:**
```
1. Set up monitoring dashboard
2. Track metrics daily/weekly
3. Alert if metric drops below threshold
4. Retrain when needed
5. Version control models
```

**Prevention:**
- Monitor in production
- Set performance thresholds
- Plan retraining schedule
- Track data quality

---

## Summary by Topic

### Linear Regression
- ❌ Not squaring residuals in SSE
- ❌ Inconsistent use of n vs n-1
- ❌ Forgetting feature scaling
- ❌ R² without context

### Classification
- ❌ Accuracy on imbalanced data
- ❌ Confusing precision and recall
- ❌ Wrong threshold direction
- ❌ Not stratifying CV

### Cross-Validation
- ❌ Not fixing random seed
- ❌ Tuning on test set (data leakage)

### Bias-Variance
- ❌ Misdiagnosing bias vs variance
- ❌ Wrong fix for problem type

### Metrics
- ❌ Averaging metrics incorrectly
- ❌ Ignoring class imbalance

### Business
- ❌ Using default threshold
- ❌ Not monitoring production

---

## Debugging Checklist

When your model isn't working:

- [ ] Did I check data quality?
- [ ] Are features scaled appropriately?
- [ ] Did I use stratified CV?
- [ ] Is train-test gap reasonable?
- [ ] Am I using right metric for problem?
- [ ] Did I fix random seed?
- [ ] Am I overfitting or underfitting?
- [ ] Is data leaking between sets?
- [ ] Did I consider class imbalance?
- [ ] Am I comparing models fairly?

---

## Quick Reference: Right vs Wrong

| Aspect | ❌ Wrong | ✓ Right |
|--------|---------|---------|
| SSE | Σ\|eᵢ\| | Σeᵢ² |
| CV | Random splits | Fixed seed |
| Imbalanced | Accuracy | F1, AUC |
| Threshold | Always 0.5 | Based on cost |
| Hyperparameters | Tune on test | Use CV |
| Metrics | Macro average | Check per-class |
| Production | Deploy and forget | Monitor |

---

**Next: Review [Practice Problems](../02-practice-problems/00-overview.md) to reinforce correct approaches!**

