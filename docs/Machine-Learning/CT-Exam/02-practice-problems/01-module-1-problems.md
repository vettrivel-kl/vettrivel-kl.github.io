---
sidebar_position: 1
title: Module 1 Practice Problems
description: 30 practice problems covering linear regression, multiple regression, bias-variance, and error metrics
tags: [practice-problems, linear-regression, bias-variance, metrics]
---

# Module 1 Practice Problems

Complete these 30 problems to master regression fundamentals. Solutions available in the [Solutions Guide](./04-solutions-guide.md).

---

## Linear Regression (8 Problems)

### Problem 1.1: Calculate Regression Line 
**Difficulty:** Easy | **Time:** 10 min | **Topics:** Linear Regression, Coefficient Calculation

**Problem Statement:**
```
Dataset: 4 observations of house size (X) vs price (Y)

X (sq ft):  [500,  800,  1200, 1500]
Y (price):  [50k, 70k, 100k, 130k]

Fit a linear regression model: ŷ = b₀ + b₁×X
```

**Questions:**
a) Calculate the mean of X and Y  
b) Calculate the slope (b₁)  
c) Calculate the intercept (b₀)  
d) Write the fitted equation  
e) Predict the price for a 1000 sq ft house  

---

### Problem 1.2: Calculate SSE, MSE, RMSE
**Difficulty:** Easy | **Time:** 12 min | **Topics:** Error Metrics

**Problem Statement:**
```
Fitted model: ŷ = 10 + 0.08×X

Predictions vs Actual:
  X=500:   ŷ=50k,   Actual=48k   (Error: -2k)
  X=800:   ŷ=74k,   Actual=75k   (Error: +1k)
  X=1200:  ŷ=106k,  Actual=105k  (Error: -1k)
  X=1500:  ŷ=130k,  Actual=132k  (Error: +2k)
```

**Questions:**
a) Calculate residuals (errors)  
b) Calculate SSE (Sum of Squared Errors)  
c) Calculate MSE (Mean Squared Error)  
d) Calculate RMSE (Root Mean Squared Error)  
e) Interpret the RMSE value  

---

### Problem 1.3: Interpret Regression Coefficients
**Difficulty:** Easy | **Time:** 8 min | **Topics:** Coefficient Interpretation

**Problem Statement:**
```
Model: Salary (k) = 30 + 2.5×(Years of Experience)

Fitted on 50 employees
```

**Questions:**
a) What does 30 represent? Interpret it.  
b) What does 2.5 represent? Interpret it.  
c) Predict salary for someone with 10 years experience  
d) Predict salary for someone with 0 years experience  
e) Is 0 years experience realistic? Why/why not?  

---

### Problem 1.4: R² Calculation
**Difficulty:** Medium | **Time:** 15 min | **Topics:** R-squared, Model Fit

**Problem Statement:**
```
Simple regression: Y = Test Score, X = Hours Studied

Summary statistics (n=30):
  ȳ = 75
  Σ(yᵢ - ȳ)² = 2000 (Total Sum of Squares)
  Σ(ŷᵢ - ȳ)² = 1600 (Explained Sum of Squares)
  Σ(eᵢ)² = 400 (Residual Sum of Squares)
```

**Questions:**
a) Calculate R² using the formula  
b) What does R² = 0.80 mean?  
c) Is this a good fit? Why?  
d) What would R² = 0.25 mean?  
e) Can R² be negative? Explain.  

---

### Problem 1.5: Prediction vs Explanation
**Difficulty:** Medium | **Time:** 12 min | **Topics:** Model Purpose

**Problem Statement:**
```
Model 1: Sales ~ Ad Spending        R² = 0.72
Model 2: Sales ~ Ad Spending + Season  R² = 0.85
Model 3: Sales ~ Ad Spending + Season + Weather  R² = 0.86

Question: For prediction vs explanation, which matters more?
```

**Questions:**
a) Which model best explains sales? Why?  
b) Which model would you use for prediction? Why?  
c) Why does adding weather only marginally help?  
d) What's the risk of adding too many variables?  
e) How would you decide between Models 2 and 3?  

---

### Problem 1.6: Residuals and Assumptions
**Difficulty:** Medium | **Time:** 15 min | **Topics:** Residual Analysis

**Problem Statement:**
```
After fitting a regression model, residuals (errors) show:
  
Scenario A: Residuals = [2, 1, -1, -2]
Scenario B: Residuals = [5, -10, 8, -3, 10, -9]
Scenario C: Residuals = [0.5, 0.3, -0.4, -0.2, -0.1, 0.2]

(Assume each has same sample size)
```

**Questions:**
a) Which scenario suggests best model fit? Why?  
b) Which scenario suggests potential outliers?  
c) Do residuals need to sum to zero? Why/why not?  
d) What would mean of residuals = 5 indicate?  
e) What do residuals tell us about model assumptions?  

---

### Problem 1.7: Prediction Interval
**Difficulty:** Hard | **Time:** 20 min | **Topics:** Uncertainty Quantification

**Problem Statement:**
```
Model: House Price = 50k + 0.1×(Square Feet)

For a 1000 sq ft house:
  Point prediction: 150k
  Standard error: 8k
  95% confidence level (z ≈ 2)
```

**Questions:**
a) Calculate 95% prediction interval  
b) Interpret the interval (what does it mean?)  
c) Why is prediction interval wider than confidence interval?  
d) How would SE change with more data? Less data?  
e) When should you report interval vs point estimate?  

---

### Problem 1.8: Compare Two Models
**Difficulty:** Hard | **Time:** 20 min | **Topics:** Model Selection

**Problem Statement:**
```
Dataset: 100 students, predicting GPA from study hours

Model A: GPA = 2.0 + 0.3×Hours
  R² = 0.60, RMSE = 0.35, Easy to interpret

Model B: GPA = 2.1 + 0.25×Hours + 0.05×Hours²
  R² = 0.62, RMSE = 0.34, Nonlinear relationship

Model C: GPA = 2.0 + 0.3×Hours + 0.2×HighSchoolGPA
  R² = 0.75, RMSE = 0.25, More complex
```

**Questions:**
a) Which model has best fit to data? How do you know?  
b) Which would you choose for simple explanation?  
c) Which would you choose for prediction?  
d) Why does Model C have better fit?  
e) What are the tradeoffs between simplicity and accuracy?  

---

## Multiple Regression (7 Problems)

### Problem 2.1: Compare Simple vs Multiple
**Difficulty:** Easy | **Time:** 10 min | **Topics:** Multiple Regression Basics

**Problem Statement:**
```
Predicting House Price:

Simple Model:  Price = 50 + 0.15×SquareFeet
               R² = 0.65

Multiple Model: Price = 40 + 0.12×SquareFeet + 5×(Beds)
                R² = 0.72
```

**Questions:**
a) Why does multiple model have higher R²?  
b) Can R² ever decrease when adding variables?  
c) Interpret the coefficient for Beds (5)  
d) Which model would you choose? Why?  
e) What else might predict house price?  

---

### Problem 2.2: Interpret Partial Coefficients
**Difficulty:** Medium | **Time:** 12 min | **Topics:** Partial Correlation

**Problem Statement:**
```
Model: Salary = 20 + 3×(Experience) + 0.5×(Education)

Where:
  Experience = years
  Education = years of formal education
```

**Questions:**
a) Interpret the coefficient 3  
b) Interpret the coefficient 0.5  
c) Which has more impact: experience or education?  
d) Would you expect education coefficient to change if experience wasn't included? Why?  
e) Predict salary for: 10 years experience, 16 years education  

---

### Problem 2.3: Multicollinearity Detection
**Difficulty:** Medium | **Time:** 15 min | **Topics:** Multicollinearity

**Problem Statement:**
```
Predicting Student Performance:

Feature correlations:
  Age vs YearsInSchool: 0.95 (very high!)
  
Simple model: Score = 50 + 2×Age        R² = 0.60
Multiple model: Score = 50 + 1.5×Age + 2×YearsInSchool
                                         R² = 0.61
```

**Questions:**
a) Why is correlation 0.95 a problem?  
b) Why doesn't R² improve much in multiple model?  
c) What are symptoms of multicollinearity?  
d) How would you fix this problem?  
e) Should you include both variables? Why/why not?  

---

### Problem 2.4: Feature Scaling Impact
**Difficulty:** Medium | **Time:** 15 min | **Topics:** Feature Scaling

**Problem Statement:**
```
Model predicting Salary:

Unscaled features:
  Price = 20 + 0.0001×(Revenue) + 2×(Employees)

Model quality: R² = 0.75, interpretable coefficients

Scaled features (standardized):
  Price = 0 + 0.50×(Revenue_scaled) + 0.60×(Employees_scaled)
  
Model quality: R² = 0.75, harder to interpret
```

**Questions:**
a) Why do scaled coefficients differ so much?  
b) Does scaling change model fit (R²)? Why?  
c) When is scaling important for interpretation?  
d) Should you scale for tree-based models? Why?  
e) How does scaling affect prediction for new data?  

---

### Problem 2.5: Adjusted R²
**Difficulty:** Hard | **Time:** 18 min | **Topics:** Model Complexity Penalty

**Problem Statement:**
```
Model with different numbers of features:

1 feature:   R² = 0.50, Adj R² = 0.48
3 features:  R² = 0.52, Adj R² = 0.50
5 features:  R² = 0.53, Adj R² = 0.49
10 features: R² = 0.54, Adj R² = 0.47

(n = 50 observations)
```

**Questions:**
a) Why does adjusted R² sometimes decrease?  
b) What does "penalizing for complexity" mean?  
c) How many features would you choose? Why?  
d) Formula: Adj R² = 1 - [(1-R²)(n-1)/(n-p-1)]. Calculate for 3 features.  
e) When should you use R² vs Adj R²?  

---

### Problem 2.6: Categorical Variables (Dummy Coding)
**Difficulty:** Medium | **Time:** 15 min | **Topics:** Categorical Features

**Problem Statement:**
```
Predicting Salary with:
  - Experience (numeric): 5, 10, 15 years
  - Department (categorical): Sales, Marketing, IT

Encoded as:
  IsSales = 1 if Sales, 0 otherwise
  IsMarketing = 1 if Marketing, 0 otherwise
  (IT is reference category)

Model: Salary = 50 + 2×Experience + 8×IsSales + 5×IsMarketing
```

**Questions:**
a) Why don't we include all 3 dummy variables?  
b) What's the salary for 10yr IT employee?  
c) What's the salary for 10yr Sales employee?  
d) What's the salary difference between Sales and Marketing?  
e) What's the salary difference between Sales and IT?  

---

### Problem 2.7: Interaction Terms
**Difficulty:** Hard | **Time:** 20 min | **Topics:** Feature Interactions

**Problem Statement:**
```
Predicting House Price:

Model 1 (No interaction):
  Price = 50 + 0.1×SqFt + 5×Bedrooms
  
Model 2 (With interaction):
  Price = 50 + 0.1×SqFt + 5×Bedrooms + 0.01×(SqFt×Bedrooms)

Example prediction (1000 sq ft, 3 bedrooms):
  Model 1: 50 + 100 + 15 = 165k
  Model 2: 50 + 100 + 15 + 30 = 195k
```

**Questions:**
a) What does the interaction term capture?  
b) Why is the 3-bedroom house valued differently in Model 2?  
c) When would interaction terms be necessary?  
d) Are interactions always helpful?  
e) How many interaction terms should you include?  

---

## Bias-Variance (8 Problems)

### Problem 3.1: Bias-Variance Decomposition
**Difficulty:** Medium | **Time:** 15 min | **Topics:** Bias-Variance Tradeoff

**Problem Statement:**
```
Model A: 
  Training error = 0.1
  Test error = 0.11
  
Model B:
  Training error = 0.05
  Test error = 0.30
  
Model C:
  Training error = 0.3
  Test error = 0.32
```

**Questions:**
a) Which model likely has high bias?  
b) Which model likely has high variance?  
c) Which model has good bias-variance tradeoff?  
d) Define bias and variance in own words  
e) What causes high bias? High variance?  

---

### Problem 3.2: Learning Curves
**Difficulty:** Medium | **Time:** 18 min | **Topics:** Learning Curves, Sample Size

**Problem Statement:**
```
Training set size vs error:

Training error:   0.20 (100 samples) → 0.15 (500) → 0.12 (1000)
Validation error: 0.40 (100 samples) → 0.20 (500) → 0.18 (1000)

Gap: 0.20 (100) → 0.05 (500) → 0.06 (1000)
```

**Questions:**
a) Does this model have high bias or high variance?  
b) What would more data help with?  
c) What's the learning curve trend telling us?  
d) What's the gap between train and validation?  
e) Would getting even more data help? Why?  

---

### Problem 3.3: Cross-Validation Diagnosis
**Difficulty:** Medium | **Time:** 15 min | **Topics:** CV and Model Diagnosis

**Problem Statement:**
```
5-fold CV results for two models:

Model A: CV RMSE = 0.50 ± 0.02
Model B: CV RMSE = 0.50 ± 0.20

(Same average error, different std dev)
```

**Questions:**
a) Which model is more stable?  
b) What does high std dev indicate?  
c) Which model would you deploy?  
d) What causes high std dev in CV results?  
e) How would you improve Model B?  

---

### Problem 3.4: Regularization Parameter Tuning
**Difficulty:** Hard | **Time:** 20 min | **Topics:** Ridge/Lasso Regression

**Problem Statement:**
```
Ridge regression with different λ values (5-fold CV):

λ = 0.001:   CV RMSE = 0.42 ± 0.10
λ = 0.01:    CV RMSE = 0.40 ± 0.08
λ = 0.1:     CV RMSE = 0.38 ± 0.06 ← Best?
λ = 1.0:     CV RMSE = 0.45 ± 0.09
λ = 10.0:    CV RMSE = 0.60 ± 0.12
```

**Questions:**
a) Which λ should you choose? Why?  
b) What happens as λ increases?  
c) Low λ vs High λ: which causes overfitting?  
d) Why does CV error decrease then increase?  
e) What would λ = 0 represent? λ = ∞?  

---

### Problem 3.5: Polynomial Degree Selection
**Difficulty:** Medium | **Time:** 15 min | **Topics:** Model Complexity

**Problem Statement:**
```
Fitting polynomials of different degrees:

Degree 1 (Linear):       Train R² = 0.60, Test R² = 0.58
Degree 2 (Quadratic):    Train R² = 0.75, Test R² = 0.73
Degree 3 (Cubic):        Train R² = 0.82, Test R² = 0.79
Degree 5 (Quintic):      Train R² = 0.95, Test R² = 0.72
Degree 10:               Train R² = 0.99, Test R² = 0.55
```

**Questions:**
a) Which degree shows overfitting?  
b) Which would you choose?  
c) Why does test R² decrease at high degrees?  
d) Can training error always improve? Why?  
e) What does this tell us about model complexity?  

---

### Problem 3.6: Underfitting vs Overfitting
**Difficulty:** Easy | **Time:** 10 min | **Topics:** Model Fit Quality

**Problem Statement:**
```
Scenario A: 85% train accuracy, 84% test accuracy
Scenario B: 99% train accuracy, 65% test accuracy
Scenario C: 50% train accuracy, 48% test accuracy
```

**Questions:**
a) Which scenario shows underfitting?  
b) Which shows overfitting?  
c) Which shows good fit?  
d) How would you fix underfitting?  
e) How would you fix overfitting?  

---

### Problem 3.7: Bias-Variance Across Dataset Sizes
**Difficulty:** Hard | **Time:** 18 min | **Topics:** Data Requirements

**Problem Statement:**
```
Small dataset (n=50):
  Simple model (high bias):    Train=0.8, Test=0.78
  Complex model (low bias):    Train=0.95, Test=0.60

Large dataset (n=5000):
  Simple model (high bias):    Train=0.82, Test=0.81
  Complex model (low bias):    Train=0.90, Test=0.89
```

**Questions:**
a) Why does complex model fail on small data?  
b) Why does complex model do well on large data?  
c) What's the "sweet spot" for model complexity?  
d) How does dataset size affect bias-variance tradeoff?  
e) Should you always use simplest possible model?  

---

### Problem 3.8: Early Stopping in Neural Networks
**Difficulty:** Hard | **Time:** 15 min | **Topics:** Training Dynamics

**Problem Statement:**
```
Training a neural network:

Epoch:    1     5     10    20    50    100   200
Train:   0.40  0.15  0.10  0.08  0.05  0.03  0.02
Valid:   0.42  0.16  0.11  0.10  0.12  0.18  0.35
```

**Questions:**
a) When does overfitting start?  
b) At what epoch should you stop training?  
c) Why does validation error increase after ~50 epochs?  
d) What's the bias-variance interpretation?  
e) How does early stopping help?  

---

## Error Metrics & Evaluation (7 Problems)

### Problem 4.1: MAE vs MSE vs RMSE
**Difficulty:** Easy | **Time:** 12 min | **Topics:** Error Metrics

**Problem Statement:**
```
Model predictions with 5 test samples:

Residuals: [-2, -1, 0, 1, 4]
(In units of $thousands for house price)
```

**Questions:**
a) Calculate MAE (Mean Absolute Error)  
b) Calculate MSE (Mean Squared Error)  
c) Calculate RMSE (Root Mean Squared Error)  
d) Why is RMSE larger than MAE here?  
e) When would you use MSE vs MAE?  

---

### Problem 4.2: Understanding RMSE Magnitude
**Difficulty:** Medium | **Time:** 12 min | **Topics:** Metric Interpretation

**Problem Statement:**
```
Two models predicting student test scores (0-100):

Model A: RMSE = 15 points
Model B: RMSE = 5 points

Average test score in dataset: 75
```

**Questions:**
a) Interpret Model A's RMSE in context  
b) Interpret Model B's RMSE in context  
c) Is RMSE=15 "good" for this problem?  
d) How would you decide acceptable RMSE?  
e) Would you report RMSE or % error? Why?  

---

### Problem 4.3: Cross-Validation Error vs Test Error
**Difficulty:** Medium | **Time:** 15 min | **Topics:** Evaluation Strategy

**Problem Statement:**
```
Same model, different evaluation:

Approach 1 - Train/Test Split:
  Test RMSE = 0.85 (on held-out 20%)

Approach 2 - 5-Fold Cross-Validation:
  CV RMSE = 0.92 ± 0.15
  
Approach 3 - Single Validation Set:
  Validation RMSE = 0.78
```

**Questions:**
a) Why are these estimates different?  
b) Which is most reliable? Why?  
c) Which would you trust most?  
d) What can high std dev (±0.15) indicate?  
e) How would you report final performance?  

---

### Problem 4.4: R² Limitations
**Difficulty:** Medium | **Time:** 15 min | **Topics:** R-squared Interpretation

**Problem Statement:**
```
Two models with same R² = 0.80:

Model A: RMSE = 5,  on data ranging 0-100
Model B: RMSE = 50, on data ranging 0-1000

Both have R² = 0.80
```

**Questions:**
a) Do both models perform equally well?  
b) Why is RMSE different despite same R²?  
c) Which model is better for prediction?  
d) When is R² misleading?  
e) What additional metrics would you report?  

---

### Problem 4.5: Model Evaluation on Imbalanced Data
**Difficulty:** Hard | **Time:** 18 min | **Topics:** Imbalanced Classes

**Problem Statement:**
```
Disease prediction (imbalanced: 5% positive, 95% negative):

Model A: 95% accuracy (predicts everything as negative!)
Model B: 80% accuracy (actually tries to identify disease)

Confusion matrices:
Model A: TP=0, FN=50, FP=0, TN=950
Model B: TP=40, FN=10, FP=100, TN=850
```

**Questions:**
a) Which accuracy is misleading?  
b) Calculate precision and recall for both  
c) Which metric matters more for disease diagnosis?  
d) Why is accuracy bad for imbalanced data?  
e) What metrics would you use instead?  

---

### Problem 4.6: Regression Metrics Summary
**Difficulty:** Medium | **Time:** 15 min | **Topics:** Metric Selection

**Problem Statement:**
```
Choosing regression metrics for:

A) Stock price prediction
B) Medical dosage calculation
C) Customer satisfaction rating

All have residuals with outliers
```

**Questions:**
a) Which metric best for stock prediction? Why?  
b) Which metric best for medical dosage? Why?  
c) Which metric best for satisfaction? Why?  
d) How do outliers affect MAE vs RMSE?  
e) When would you use MAE?  

---

### Problem 4.7: Comprehensive Evaluation
**Difficulty:** Hard | **Time:** 20 min | **Topics:** Holistic Model Assessment

**Problem Statement:**
```
Model performance:

Training:
  R² = 0.88, RMSE = 0.12, MAE = 0.08

Testing:
  R² = 0.82, RMSE = 0.18, MAE = 0.14

CV (5-fold):
  R² = 0.81 ± 0.03, RMSE = 0.19 ± 0.04
```

**Questions:**
a) Is this model ready for production?  
b) What does train-test gap tell you?  
c) Is the model stable (check CV std dev)?  
d) What concerns do you have?  
e) What would you recommend doing next?  

---

## Summary & Next Steps

**Completed Module 1 (30 problems)?**

✓ If mostly Easy: Move to Medium and review concept pages for weak areas  
✓ If mostly Medium: Try Hard problems and reference solutions  
✓ If all problems complete: Move to [Module 2 Problems](./02-module-2-problems.md)  

**Need solutions?** See [Solutions Guide](./04-solutions-guide.md)

**Ready for Module 2?** → [Module 2 Practice Problems](./02-module-2-problems.md)

