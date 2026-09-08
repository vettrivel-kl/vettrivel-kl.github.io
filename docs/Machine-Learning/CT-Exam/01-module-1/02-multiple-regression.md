---
sidebar_position: 2
title: Multiple Linear Regression
description: Multiple linear regression with matrix notation, multicollinearity, and worked examples for CT exam
tags: [multiple-regression, module-1, regression, features]
---

# Multiple Linear Regression

## Overview

Multiple linear regression extends simple regression to **predict a target using multiple features**.

```
Simple:    ŷ = b₀ + b₁x
Multiple:  ŷ = b₀ + b₁x₁ + b₂x₂ + ... + bₖxₖ

With k features instead of 1
```

### When to Use

```
✓ When multiple factors affect the target
✓ Real-world problems almost always have multiple features
✓ Better R² than simple regression (usually)
✓ But watch out for overfitting!

Examples:
  • House price: size + age + location + bedrooms
  • Salary: experience + education + performance + department
  • Stock return: momentum + volatility + sector + market_cap
```

---

## Part 1: The Multiple Regression Equation

### General Form

```
ŷ = b₀ + b₁x₁ + b₂x₂ + b₃x₃ + ... + bₖxₖ

where:
  ŷ       = predicted value
  b₀      = intercept
  b₁, b₂, ..., bₖ = coefficients for each feature
  x₁, x₂, ..., xₖ = feature values
  k       = number of features
```

### Real Example: House Price Prediction

```
House Price Model:

price = 20 + 0.5×size + (-0.8)×age + 1.2×location_score + 5×bedrooms

where:
  price           = predicted price (in $100k)
  size            = house size (in 100 sq ft)
  age             = house age (in years)
  location_score  = neighborhood score (1-10)
  bedrooms        = number of bedrooms
```

**Sample predictions:**

```
House A: size=25, age=10, location=8, bedrooms=3
price = 20 + 0.5(25) + (-0.8)(10) + 1.2(8) + 5(3)
      = 20 + 12.5 - 8 + 9.6 + 15
      = 49.1 ($4.91 million)

House B: size=30, age=5, location=9, bedrooms=4
price = 20 + 0.5(30) + (-0.8)(5) + 1.2(9) + 5(4)
      = 20 + 15 - 4 + 10.8 + 20
      = 61.8 ($6.18 million)
```

---

## Part 2: Matrix Notation

### Why Matrix Form?

```
Simple regression with formulas: ✓ Easy (Sxy/Sxx)
Multiple regression with formulas: ✗ Nightmare (too many calculations)
Multiple regression with matrices: ✓ Elegant and efficient
```

### Matrix Form

```
y = Xβ + ε

where:
  y   = n×1 target vector
  X   = n×(k+1) feature matrix (includes column of 1s for intercept)
  β   = (k+1)×1 coefficient vector
  ε   = n×1 error vector
```

### Example with 3 Features

```
Suppose we have 4 observations with 3 features:

Observation  x₁  x₂  x₃  y
1            2   3   1   10
2            4   1   2   15
3            3   2   3   12
4            5   4   2   18

Matrix notation:

        [1  2  3  1]        [b₀]
X =     [1  4  1  2]    β = [b₁]    y = [10]
        [1  3  2  3]        [b₂]        [15]
        [1  5  4  2]        [b₃]        [12]
                                        [18]

First column of 1s = for intercept term
```

---

## Part 3: Normal Equation (For Multiple Regression)

### The Solution

```
β = (X^T X)^(-1) X^T y

where:
  X^T  = transpose of X
  (X^T X)^(-1) = inverse of (X^T X) matrix
  
This gives us all coefficients [b₀, b₁, b₂, ..., bₖ] at once!
```

### What This Means

```
Why X^T X?
  • (X^T X) is a square matrix (k+1)×(k+1)
  • Can be inverted (if not singular)
  
Why X^T y?
  • Projection of y onto column space of X
  • Direction of best fit

Result: β minimizes SSE = Σ(y - Xβ)²
```

### Important: When Does It Fail?

```
Normal equation fails if:

1. Perfect multicollinearity
   Example: x₂ = 2×x₁ (exact linear relationship)
   → (X^T X) is singular, cannot invert
   → No unique solution

2. More features than observations
   k > n → Underdetermined system
   → Multiple solutions possible
   → Overfitting likely

Solution: Use regularization (Ridge/Lasso)
```

---

## Part 4: Coefficient Interpretation

### Key Concept: Partial Effects

```
In multiple regression, each coefficient represents
the MARGINAL effect of that feature,
HOLDING ALL OTHER FEATURES CONSTANT.

β₁ = change in ŷ per unit change in x₁,
     when x₂, x₃, ..., xₖ are fixed
```

### House Price Example

```
Model: price = 20 + 0.5×size + (-0.8)×age + 1.2×location + 5×bedrooms

Interpretation of each coefficient:

b₀ = 20
  → Base price when size=age=location=bedrooms=0
  → Usually not practically meaningful

b₁ = 0.5
  → Each additional 100 sq ft increases price by $0.5M
  → Holding age, location, bedrooms constant

b₂ = -0.8
  → Each additional year of age decreases price by $0.8M
  → Older houses are worth less (all else equal)
  → Holding size, location, bedrooms constant

b₃ = 1.2
  → Each 1-point increase in location score increases price by $1.2M
  → Better neighborhoods are worth more (all else equal)

b₄ = 5
  → Each additional bedroom increases price by $5M
  → More bedrooms = higher price (all else equal)
```

### Why "All Else Equal"?

```
Without multiple regression (just x₁ vs price):
  - Older houses might appear more valuable
  - Why? They're in better locations (confounding)
  
With multiple regression:
  - We isolate size effect, location effect, age effect
  - True partial effect of each feature
  - Controls for confounders
```

---

## Part 5: Worked Example (For Exam)

### Problem: Salary Prediction

```
Dataset: 5 employees

Employee  Experience (x₁)  Education (x₂)  Salary (y)
1         1                12              25
2         3                14              35
3         5                16              45
4         7                18              55
5         9                20              65

Task: Build regression model, interpret coefficients, make predictions
```

### Step 1: Set Up Matrix

```
        [1  1  12]
X =     [1  3  14]
        [1  5  16]
        [1  7  18]
        [1  9  20]

y = [25]
    [35]
    [45]
    [55]
    [65]
```

### Step 2: Calculate X^T (Transpose)

```
X^T = [1  1  1  1  1 ]
      [1  3  5  7  9 ]
      [12 14 16 18 20]
```

### Step 3: Calculate X^T X

```
X^T X = [1  1  1  1  1 ] [1  1  12]
        [1  3  5  7  9 ] [1  3  14]
        [12 14 16 18 20] [1  5  16]
                         [1  7  18]
                         [1  9  20]

Calculation:
(1,1): 1² + 1² + 1² + 1² + 1² = 5
(1,2): 1×1 + 1×3 + 1×5 + 1×7 + 1×9 = 25
(1,3): 1×12 + 1×14 + 1×16 + 1×18 + 1×20 = 80
(2,2): 1² + 3² + 5² + 7² + 9² = 165
(2,3): 1×12 + 3×14 + 5×16 + 7×18 + 9×20 = 580
(3,3): 12² + 14² + 16² + 18² + 20² = 1700

X^T X = [5    25   80  ]
        [25   165  580 ]
        [80   580  1700]
```

### Step 4: Calculate X^T y

```
X^T y = [1  1  1  1  1 ] [25]
        [1  3  5  7  9 ] [35]
        [12 14 16 18 20] [45]
                         [55]
                         [65]

(1,1): 25 + 35 + 45 + 55 + 65 = 225
(2,1): 1×25 + 3×35 + 5×45 + 7×55 + 9×65 = 1575
(3,1): 12×25 + 14×35 + 16×45 + 18×55 + 20×65 = 4800

X^T y = [225 ]
        [1575]
        [4800]
```

### Step 5: Solve β = (X^T X)^(-1) X^T y

**Note:** For CT exam, you likely won't calculate matrix inverse by hand. 
You'd either:
- Use given inverse
- Use software (Python/R)
- Show the setup and explain method

**Assuming software solution:**

```
β = [b₀ ]   = [5   ]
    [b₁ ]     [5   ]
    [b₂ ]     [0.5 ]
```

### Step 6: Write the Regression Equation

```
Salary = 5 + 5×Experience + 0.5×Education

or in readable form:
ŷ = 5 + 5x₁ + 0.5x₂
```

### Step 7: Interpret Coefficients

```
b₀ = 5
  → Baseline salary is $5,000 (entry level, no experience/education)
  → Not realistic but mathematically meaningful

b₁ = 5
  → Each year of experience increases salary by $5,000
  → Holding education constant

b₂ = 0.5
  → Each additional year of education increases salary by $500
  → Holding experience constant
  → Education effect is smaller than experience effect
```

### Step 8: Make Predictions

```
Employee 1: Experience=1, Education=12
ŷ = 5 + 5(1) + 0.5(12) = 5 + 5 + 6 = 16

Actual: 25, Prediction: 16, Residual: 9

Employee 3: Experience=5, Education=16
ŷ = 5 + 5(5) + 0.5(16) = 5 + 25 + 8 = 38

Actual: 45, Prediction: 38, Residual: 7

Employee 5: Experience=9, Education=20
ŷ = 5 + 5(9) + 0.5(20) = 5 + 45 + 10 = 60

Actual: 65, Prediction: 60, Residual: 5
```

### Step 9: Calculate All Error Metrics

**Predictions and Residuals Table:**

| Employee | Actual | Predicted | Residual (e) | e² | \|e\| |
|----------|--------|-----------|---------------|----|-------|
| 1        | 25     | 16        | 9             | 81 | 9     |
| 2        | 35     | 26        | 9             | 81 | 9     |
| 3        | 45     | 38        | 7             | 49 | 7     |
| 4        | 55     | 50        | 5             | 25 | 5     |
| 5        | 65     | 60        | 5             | 25 | 5     |
| **SUM**  | 225    | 190       | 35            | **261** | **35** |

#### Calculate SSE (Sum of Squared Errors)

```
SSE = Σ(y - ŷ)²
    = 9² + 9² + 7² + 5² + 5²
    = 81 + 81 + 49 + 25 + 25
    = 261
```

#### Calculate MSE (Mean Squared Error)

```
MSE = SSE / n
    = 261 / 5
    = 52.2

Average squared error per observation: 52.2
```

#### Calculate RMSE (Root Mean Squared Error)

```
RMSE = √MSE
     = √52.2
     = 7.22

Average error in original units: ±7.22 (in thousands of ₹)
Interpretation: Typical prediction error is ₹7,220
```

#### Calculate MAE (Mean Absolute Error)

```
MAE = Σ|y - ŷ| / n
    = (9 + 9 + 7 + 5 + 5) / 5
    = 35 / 5
    = 7.0

Average absolute error: ₹7,000
```

#### Calculate SST (Total Sum of Squares)

```
Mean of y = (25+35+45+55+65)/5 = 45

SST = Σ(y - ȳ)²
    = (25-45)² + (35-45)² + (45-45)² + (55-45)² + (65-45)²
    = 400 + 100 + 0 + 100 + 400
    = 1000
```

#### Calculate R² (Coefficient of Determination)

```
R² = 1 - SSE/SST
   = 1 - 261/1000
   = 1 - 0.261
   = 0.739

Model explains 73.9% of salary variance!
```

#### Calculate Adjusted R²

```
Formula: Adj R² = 1 - (1 - R²) × (n-1)/(n-k-1)

Where: n = 5 observations, k = 2 features

Adj R² = 1 - (1 - 0.739) × (5-1)/(5-2-1)
       = 1 - 0.261 × 4/2
       = 1 - 0.261 × 2
       = 1 - 0.522
       = 0.478

Adjusted R² drops from 0.739 to 0.478
This penalizes for small sample size
```

### Step 10: Comprehensive Inference & Interpretation

#### Understanding the Errors

```
SSE = 261:
  • Total squared prediction error across all employees
  • Depends on scale (salary in thousands)
  • Meaningless in isolation

MSE = 52.2:
  • Average squared error per employee
  • Still in squared units (not interpretable)

RMSE = 7.22:
  • Error in original units (PRACTICAL!)
  • Typical prediction is off by ~₹7,220
  • Can explain to business stakeholder
  • "We predict salary within ±₹7K on average"

MAE = 7.0:
  • Also in original units
  • Similar to RMSE (7.0 vs 7.22)
  • If RMSE ≈ MAE, then no extreme outliers
  • If RMSE >> MAE, then some large errors exist

Comparison:
  RMSE (7.22) vs MAE (7.0) → very close
  Interpretation: Errors fairly consistent
                  No single huge outlier
                  Predictions are balanced
```

#### R² = 0.739 Interpretation

```
What R² means (CORRECT):

R² = 0.739 means:
  ✓ Model explains 73.9% of salary variation
  ✓ Experience + education account for 73.9% of why salaries differ
  ✓ Remaining 26.1% due to other factors:
    - Performance/productivity
    - Seniority level
    - Department
    - Negotiation skills
    - Market conditions

What R² does NOT mean (WRONG):
  ✗ Predictions are "73.9% accurate"
  ✗ Model works "73.9% of the time"
  ✗ We can predict salaries "73.9% correctly"

Why is this good?
  • Baseline (just using mean): R² = 0
  • Our model: R² = 0.739
  • Improvement over baseline: 73.9%!

Is it good enough?
  • For hiring decisions: YES (explains most variation)
  • For precise individual salary: MAYBE (26% unexplained)
  • For policy decisions: PROBABLY (need more features)
```

#### Adjusted R² = 0.478 Interpretation (IMPORTANT!)

```
Why did Adjusted R² drop so much?

R² = 0.739 vs Adjusted R² = 0.478

This is a RED FLAG!

Reason:
  Small sample size (n=5)
  vs. number of features (k=2)
  
  Penalty factor: (n-1)/(n-k-1) = 4/2 = 2
  
  This penalty doubles the (1-R²) term

What this means:
  ✗ With only 5 observations and 2 features
  ✓ Risk of overfitting is HIGH
  ✓ The model might be fitting noise, not signal
  ✓ True performance is likely 47.8%, not 73.9%

Practical implication:
  • Predictions on NEW employees might be worse
  • R² = 0.739 is probably too optimistic
  • Need more data to trust the 0.739 value
  • Current model: OK for exploration, risky for production
```

#### Coefficient Interpretation with Context

```
Model: Salary = 5 + 5×Experience + 0.5×Education

b₀ = 5:
  Baseline salary (when experience=education=0)
  ✓ Mathematical: intercept for the equation
  ✗ Practical: unrealistic (no job with 0 experience/education)
  • Value mainly for fitting purposes

b₁ = 5 (Experience):
  For each additional year of experience,
  salary increases by ₹5,000 (holding education constant)
  
  Examples:
    • 1 year → 5 + 5(1) + 0.5(12) = ₹16K
    • 2 years → 5 + 5(2) + 0.5(12) = ₹21K
    • 5 years → 5 + 5(5) + 0.5(16) = ₹38K
  
  Magnitude: Experience is 10x more important than education!

b₂ = 0.5 (Education):
  For each additional year of education,
  salary increases by ₹500 (holding experience constant)
  
  Examples:
    • 1 additional year: +₹500
    • 4 additional years: +₹2,000
  
  Interpretation: 
    Education matters, but less than experience
    Each extra year of work beats 10 years of school!

Practical insight:
  → Hiring teams should prioritize experience
  → Education bonus is minimal compared to experience
```

#### Model Quality Assessment

```
Quantitative measures:
  ✓ R² = 73.9%: Strong explanatory power
  ✓ RMSE = ₹7.22K: Reasonable prediction error
  ✓ All features positive: Sensible directions

Concerns:
  ✗ Adjusted R² = 47.8%: Overfitting risk
  ✗ Sample size = 5: Very small
  ✗ 26% variance unexplained: Missing factors

Likelihood Diagnosis:
  DIAGNOSIS: HIGH VARIANCE (OVERFITTING)
  
  Evidence:
    • R² >> Adjusted R²
    • Small sample relative to features
    • Learning with so few examples = memorizing
  
  Implication:
    On new employees not in training set,
    predictions likely worse than ₹7.22K error

Recommendation:
  • Collect more data (100+ employees)
  • Then re-fit model
  • Add more features (department, job level)
  • Consider regularization (Ridge/Lasso)

Current use case:
  ✓ Exploration and hypothesis testing
  ✗ Production deployment without more data
```

#### Residuals Pattern Analysis

```
Residuals: [9, 9, 7, 5, 5]

Pattern:
  Employee 1-2: Larger errors (9 each)
  Employee 3-5: Smaller errors (7, 5, 5)
  
  Trend: Errors decrease as we move through data

What this suggests:
  ✗ Residuals not random → potential pattern
  ✗ Might indicate missing feature
  ✗ Example: First two employees might be in different
              department/level not captured by our features

If residuals were truly random:
  ✓ Would expect mix of positive and negative
  ✓ No clear pattern or trend
  ✓ Current pattern hints at underfitting
  
  Possible missing factors:
    • Job level/seniority
    • Performance ratings
    • Department (tech pays more than HR)
    • Degree type (BS vs MS vs PhD)
```

#### Predictive Confidence

```
For a NEW employee prediction:

Suppose: Experience = 6 years, Education = 18 years
Prediction: Salary = 5 + 5(6) + 0.5(18) = 49

Confidence interval (rough):
  Point estimate: ₹49K
  ±1 RMSE (68% confidence): ₹49 ± ₹7.22 = ₹41.78-56.22K
  ±2 RMSE (95% confidence): ₹49 ± ₹14.44 = ₹34.56-63.44K

What this means:
  ✓ Best guess: ₹49K
  ✓ 68% chance salary is ₹41.78K - ₹56.22K
  ✓ 95% chance salary is ₹34.56K - ₹63.44K
  
  Warning: These intervals assume:
    • Model is correct (which it might not be)
    • New employee from same population
    • No systematic differences in training data
```

---

## Part 6: Multicollinearity

### What is It?

```
Multicollinearity = High correlation between features

Examples:
  • Height and weight (both measure body size)
  • Income and house price (both measure wealth)
  • GDP and total trade (one drives the other)
```

### Why It's a Problem

```
When x₁ and x₂ are correlated:
  • Coefficients become unstable
  • Small data change → large coefficient change
  • Cannot separately identify effects
  • Standard errors increase
  • Statistical significance misleading
```

### Detection

```
Method 1: Correlation matrix
  If |correlation| > 0.7 or 0.8 → multicollinearity concern

Example:
              Experience  Education
Experience    1.00        0.92         ← HIGH correlation!
Education     0.92        1.00

Problem: Experience and education are highly correlated
         (older employees tend to be more educated)
```

**Method 2: VIF (Variance Inflation Factor)**

```
VIF = 1 / (1 - R²ⱼ)

where R²ⱼ = R² from regressing xⱼ on all other x's

Rule of thumb:
  VIF < 5   → OK
  VIF 5-10  → Concerning
  VIF > 10  → Serious multicollinearity

Interpretation:
  VIF = 1   → No multicollinearity
  VIF = 5   → Coefficient variance is 5x larger
  VIF = 10  → Coefficient variance is 10x larger
```

### Solutions

```
1. Remove redundant features
   - If x₁ and x₂ are highly correlated
   - Keep one, remove the other
   - Choose the one more interpretable/available

2. Combine features
   - Average them: x_new = (x₁ + x₂)/2
   - PCA: Convert to uncorrelated principal components

3. Use regularization (Ridge/Lasso)
   - Ridge: Shrinks coefficients, reduces variance
   - Lasso: Performs feature selection

4. Collect more data
   - More observations → more information
   → More stable coefficient estimates
```

### Example: House Price with Multicollinearity

```
Features: size, rooms, bedrooms

Problem: rooms ≈ 3×bedrooms (strong correlation)

Correlation matrix:
          size  rooms  bedrooms
size      1.00  0.45   0.40
rooms     0.45  1.00   0.95        ← TOO HIGH!
bedrooms  0.40  0.95   1.00

Solution: Use either rooms OR bedrooms, not both
          Recommend: bedrooms (more interpretable)
```

---

## Part 7: Multiple Regression vs Simple Regression

### Comparison

| Aspect | Simple | Multiple |
|--------|--------|----------|
| **Equation** | ŷ = b₀ + b₁x | ŷ = b₀ + b₁x₁ + b₂x₂ + ... |
| **Features** | 1 | k features |
| **Coefficients** | 2 (b₀, b₁) | k+1 |
| **Matrix form** | Simple formula | Normal equation |
| **R² typically** | Lower | Higher (more features) |
| **Interpretation** | Clear (one effect) | More complex (partial effects) |
| **Overfitting risk** | Low | High if k large |

### When Simple Regression is Better

```
✓ When only 1 important feature
✓ When interpretability is critical
✓ When data is limited (small n)
✓ When other features are noise
✗ When R² is much lower than multiple model
```

### When Multiple Regression is Better

```
✓ When multiple features affect target
✓ When R² improves significantly
✓ When adjusted R² also improves
✓ When all features are statistically significant
✗ When adding features decreases adjusted R²
```

---

## Part 8: Feature Selection

### Why Feature Selection Matters

```
Problem: Too many features
  ✗ Increases overfitting risk
  ✗ Increases computational cost
  ✗ Decreases interpretability
  ✗ Decreases coefficient stability

Goal: Find optimal subset of features
```

### Methods

#### 1. Forward Selection

```
Start: Model with no features

Step 1: Add feature with highest R²
        Example: R² = 0.60 with x₁

Step 2: Add feature that increases R² most
        Example: R² = 0.75 with x₁, x₂

Step 3: Keep adding until R² stops improving
        Example: Adding x₃ only increases R² by 0.01

Result: Keep x₁, x₂ (x₃ not worth adding)
```

#### 2. Backward Elimination

```
Start: Model with all features

Step 1: Remove feature with lowest statistical significance
        (highest p-value)

Step 2: Refit model, check significance

Step 3: Keep removing until all remaining features
        are statistically significant

Result: Minimal set of important features
```

#### 3. Stepwise Selection (Forward + Backward)

```
Combination of both methods
More flexible but computationally expensive
```

#### 4. Regularization-Based Selection

```
Lasso regression (L1):
  • Drives unimportant coefficient to exactly zero
  • Automatic feature selection
  
Ridge regression (L2):
  • Shrinks coefficients but keeps all features
  • Manual feature selection needed
```

### Example: Job Performance Prediction

```
Initial features: experience, education, age, gender, 
                 prior_salary, department, years_at_company

Forward selection:

Step 1: Best single feature = experience
        R² = 0.68

Step 2: Best pair = experience + education
        R² = 0.82 (improvement: 0.14)

Step 3: Best triple = experience + education + department
        R² = 0.87 (improvement: 0.05)

Step 4: Best quad = experience + education + department + years
        R² = 0.88 (improvement: 0.01) ← minimal

Stop here. Final model uses: experience, education, department
```

---

## Part 9: Assumptions (Extended)

### Multiple Regression Assumptions

All assumptions from simple regression, PLUS:

1. **No Perfect Multicollinearity**
   - Features should not be perfectly linearly dependent
   - Check: Correlation matrix, VIF

2. **Correct Model Specification**
   - Should include all relevant features
   - Functional form should be correct (linear if using linear model)

### Checking Residuals

```
For multiple regression:

Plot residuals vs:
  ✓ Each feature (should be random scatter)
  ✓ Fitted values (should be random scatter)
  ✓ Order of observation (detect autocorrelation)

Q-Q plot:
  ✓ Check normality assumption
```

---

## Part 10: Exam Questions & Solutions

### Q1: Coefficient Interpretation

**Q:** In salary model: salary = 10 + 4×experience - 0.5×age + 2×education

Interpret b₂ = -0.5

**A:**
```
Each additional year of age decreases salary by 0.5 (in units),
holding experience and education constant.

Older workers earn less (all else equal).
This could indicate:
  • Technology skills depreciation with age
  • Labor market discrimination (concerning!)
  • Cohort effects (different generations)
```

---

### Q2: Identify Multicollinearity

**Q:** Given correlation matrix:

|            | Marketing | Sales | Revenue |
|------------|-----------|-------|---------|
| Marketing  | 1.00      | 0.92  | 0.78    |
| Sales      | 0.92      | 1.00  | 0.85    |
| Revenue    | 0.78      | 0.85  | 1.00    |

Does multicollinearity exist? If yes, which feature to remove?

**A:**
```
YES, multicollinearity exists!

Marketing and Sales correlation = 0.92 (very high)

Why they're correlated:
  • More marketing → more sales (logical)
  • Should only use one to avoid redundancy

Recommendation: Remove Marketing or Sales
  • Keep Sales (more directly linked to revenue)
  • Or keep Marketing if budget planning is priority
```

---

### Q3: Model Comparison

**Q:** 
Model A: Price = 20 + 0.5×size + (-0.8)×age
         R² = 0.85, Adjusted R² = 0.83, n=100, k=2

Model B: Price = 22 + 0.6×size + (-0.9)×age + 1.2×location + 0.1×distance
         R² = 0.88, Adjusted R² = 0.85, n=100, k=4

Which model is better?

**A:**
```
Compare Adjusted R²:
  Model A: Adj R² = 0.83
  Model B: Adj R² = 0.85
  
Model B is better!

Why:
  • Higher Adjusted R² (penalizes extra features)
  • R² improvement (0.85 vs 0.88) justifies 2 extra features
  • More features, but not overfitting
```

---

### Q4: Feature Selection

**Q:** You have 10 candidate features. What's the first step in feature selection?

**A:**
```
First step: Check correlation matrix

Why:
  1. Identify multicollinearity
  2. Remove highly correlated pairs
  3. Reduce number of candidates
  4. Speed up model fitting

Example:
  If feature A and B have |corr| > 0.8
  → Remove one before model building
```

---

### Q5: Matrix Interpretation

**Q:** What does the Normal Equation β = (X^T X)^(-1) X^T y solve for?

**A:**
```
Solves for the coefficient vector β that minimizes SSE.

β contains all coefficients: [b₀, b₁, b₂, ..., bₖ]

Why this form:
  • X^T X is invertible (usually)
  • Gives unique solution in one step
  • Efficient for computation
  • Generalizes to any k features
```

---

## Part 11: Key Formulas

### Core Multiple Regression Formulas

```
Prediction:       ŷ = b₀ + b₁x₁ + b₂x₂ + ... + bₖxₖ

Matrix form:      y = Xβ + ε

Normal equation:  β = (X^T X)^(-1) X^T y

SSE:              SSE = Σ(y - ŷ)²

SST:              SST = Σ(y - ȳ)²

R²:               R² = 1 - SSE/SST

Adj R²:           Adj R² = 1 - (1-R²) × (n-1)/(n-k-1)

VIF:              VIF = 1 / (1 - R²ⱼ)

MSE:              MSE = SSE / (n - k - 1)

RMSE:             RMSE = √MSE
```

---

## Part 12: Practice Problems

### Problem 1: Calculate Regression Model

```
Data (4 observations, 2 features):

  x₁  x₂   y
  1   2    5
  2   3    8
  3   5    14
  4   6    17

Tasks:
a) Set up X and y matrices
b) Calculate X^T X and X^T y
c) (Assume you solved for β = [2, 1, 2]^T)
   Write the regression equation
d) Predict y for x₁=2.5, x₂=4
e) Interpret each coefficient
```

### Problem 2: Multicollinearity Analysis

```
Features for predicting house price:
  • Square footage
  • Number of rooms
  • Floor area (= square footage)

Problem:
  a) What multicollinearity issue exists?
  b) Why is it a problem?
  c) How would you fix it?
  d) Which feature to keep/remove?
```

### Problem 3: Model Selection

```
Model A (Simple):    price = 30 + 0.4×size
                     R² = 0.72, Adj R² = 0.71

Model B (Multiple):  price = 25 + 0.45×size - 0.5×age
                     R² = 0.78, Adj R² = 0.76

Model C (Complex):   price = 20 + 0.5×size - 0.6×age + 0.3×location
                     R² = 0.81, Adj R² = 0.78

Data: n = 50 houses

Questions:
  a) Which model is best for prediction?
  b) Which model is best for interpretation?
  c) Would you add more features? Why/why not?
```

---

## Part 13: Real-World Applications

### Example 1: Customer Lifetime Value

```
LTV = 5000 + 100×tenure + 50×purchase_frequency 
           + 200×avg_order_value - 10×churn_rate

Interpretation:
  • Every year of tenure: +$100
  • Each purchase per year: +$50
  • Per $1 increase in avg order: +$200
  • Each 1% churn increase: -$10

Application: Prioritize customers with high LTV
```

### Example 2: Medical Outcome Prediction

```
Severity = 2 + 0.8×age + 0.5×BMI + 3×comorbidities - 0.1×exercise_hrs

Interpretation:
  • Each year of age: +0.8 severity points
  • High BMI: worse outcome
  • Multiple diseases: much worse
  • Exercise helps: reduces severity

Application: Allocate resources to high-risk patients
```

### Example 3: ML Model Performance

```
Accuracy = 0.5 + 0.02×n_features + (-0.01)×model_complexity 
                + 0.003×data_size

Interpretation:
  • More features: higher accuracy (up to a point)
  • More complex models: lower accuracy (overfitting)
  • More data: always helps

Application: Balance features, complexity, and data
```

---

## Summary Table

| Concept | Formula/Description |
|---------|-------------------|
| **Equation** | ŷ = b₀ + b₁x₁ + b₂x₂ + ... + bₖxₖ |
| **Coefficients** | β = (X^T X)^(-1) X^T y |
| **Interpretation** | b₁ = change in y per unit x₁, holding others constant |
| **R²** | 1 - SSE/SST (explains variance) |
| **Adjusted R²** | Penalizes extra features (prevents overfitting) |
| **Multicollinearity** | High correlation between features (causes instability) |
| **VIF** | 1/(1-R²ⱼ) - values > 5 indicate multicollinearity |
| **Forward selection** | Add features one by one that improve R² most |
| **Backward elimination** | Remove features one by one that hurt R² least |
| **Normal equation** | Solves for all coefficients simultaneously |

---

## Tips for CT Exam

### ✅ DO

- **Show matrix setup clearly** - examiners want to see understanding
- **Interpret coefficients as partial/marginal effects** - key distinction
- **Check adjusted R² when comparing models** - not just R²
- **Mention multicollinearity risks** - shows deeper understanding
- **Explain why features were selected/removed** - demonstrate reasoning

### ❌ DON'T

- Don't confuse simple and multiple regression interpretation
- Don't forget "holding other variables constant" in coefficient interpretation
- Don't use R² alone for model comparison (use Adjusted R²)
- Don't ignore multicollinearity - it's a critical assumption violation
- Don't add features without checking if they improve adjusted R²

---

## Next Topics

→ [Bias-Variance Tradeoff](./02-bias-variance.md)  
→ [Performance Metrics](./03-metrics.md)

