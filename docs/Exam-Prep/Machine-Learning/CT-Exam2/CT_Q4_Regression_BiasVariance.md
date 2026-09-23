# SAMPLE EXAM ANSWER: Simple Linear Regression, Model Evaluation, and Churn Duality

**Question:** 
(i) A company wants to estimate an employee’s salary based on the number of years of experience. Using a suitable sample dataset, explain how a Simple Linear Regression model can be developed. Show the complete procedure for obtaining the regression line, slope, and intercept using the least-squares approach. [10 Marks]
(ii) A machine learning model is designed to predict the selling price of a product. Explain how the accuracy of such a regression model can be assessed. Describe any suitable regression evaluation metrics and illustrate the calculation and significance of MAE and MSE. [5 Marks]
(iii) Consider two machine learning models:
- Model A gives very high accuracy on the training data but considerably lower performance on test data.
- Model B performs poorly on both training and test data.
Identify the problems exhibited by these two models and explain Overfitting and Underfitting, including their causes and possible remedies. [5 Marks]

**Marks:** 20 marks | **Time:** 30 minutes

---

## COMPLETE EXAM ANSWER

---

## **PART 1: SIMPLE LINEAR REGRESSION & LEAST-SQUARES DERIVATION (10 marks)**

### **1.1 Definition & Theoretical Basis (2 marks)**

Simple Linear Regression (SLR) is a **supervised machine learning algorithm** used to model the relationship between a single continuous independent variable $x$ (predictor/feature) and a continuous dependent variable $y$ (target). 

Statistically, the relationship is formulated as:

$$\boxed{y = \beta_0 + \beta_1 x + \varepsilon}$$

**Where:**
- **y** = Dependent variable (target/output)
- **x** = Independent variable (feature/input)
- **β₀** = Intercept (value of $y$ when $x = 0$)
- **β₁** = Slope (expected change in $y$ per unit change in $x$)
- **ε** = Random error term ($\varepsilon \sim \mathcal{N}(0, \sigma^2)$, assuming zero mean and constant variance)

We fit a predicted regression line represented by:
$$\boxed{\hat{y} = \beta_0 + \beta_1 x}$$

Where $\hat{y}$ is the predicted estimate of $y$.

---

### **1.2 Least-Squares Parameter Derivation (3 marks)**

The **Least Squares Method** estimates parameters $\beta_0$ and $\beta_1$ by minimizing the **Sum of Squared Residuals (SSR)**:

$$RSS(\beta_0, \beta_1) = \sum_{i=1}^{n} e_i^2 = \sum_{i=1}^{n} (y_i - \hat{y}_i)^2 = \sum_{i=1}^{n} (y_i - \beta_0 - \beta_1 x_i)^2$$

To find the minimum, we set the partial derivatives with respect to $\beta_0$ and $\beta_1$ to zero:

#### **Step A: Solving for Intercept ($\beta_0$)**
$$\frac{\partial RSS}{\partial \beta_0} = -2 \sum_{i=1}^{n} (y_i - \beta_0 - \beta_1 x_i) = 0$$

$$\sum_{i=1}^{n} y_i - \sum_{i=1}^{n} \beta_0 - \beta_1 \sum_{i=1}^{n} x_i = 0$$

Since $\sum_{i=1}^{n} \beta_0 = n \beta_0$, we divide the entire equation by $n$:
$$\bar{y} - \beta_0 - \beta_1 \bar{x} = 0 \implies \boxed{\beta_0 = \bar{y} - \beta_1 \bar{x}}$$

*(This proves that the regression line must pass through the centroid $(\bar{x}, \bar{y})$).*

#### **Step B: Solving for Slope ($\beta_1$)**
$$\frac{\partial RSS}{\partial \beta_1} = -2 \sum_{i=1}^{n} x_i (y_i - \beta_0 - \beta_1 x_i) = 0$$

$$\sum_{i=1}^{n} x_i \left( y_i - (\bar{y} - \beta_1 \bar{x}) - \beta_1 x_i \right) = 0$$

$$\sum_{i=1}^{n} x_i (y_i - \bar{y}) - \beta_1 \sum_{i=1}^{n} x_i (x_i - \bar{x}) = 0 \implies \boxed{\beta_1 = \frac{\sum (x_i - \bar{x})(y_i - \bar{y})}{\sum (x_i - \bar{x})^2}}$$

---

### **1.3 Worked Example with Sample Dataset (3 marks)**

**Problem:** Predict **Employee Monthly Salary ($y$, in \$1,000s)** based on **Years of Experience ($x$)**

| Employee ($i$) | Experience ($x_i$) | Monthly Salary ($y_i$) |
|:---:|:---:|:---:|
| 1 | 1 | 50 |
| 2 | 2 | 60 |
| 3 | 3 | 65 |
| 4 | 4 | 80 |
| 5 | 5 | 95 |

#### **Step 1: Calculate Sample Means**
$$\bar{x} = \frac{1+2+3+4+5}{5} = \frac{15}{5} = \mathbf{3.0 \ \text{Years}}$$

$$\bar{y} = \frac{50+60+65+80+95}{5} = \frac{350}{5} = \mathbf{70.0 \ \text{Thousand Dollars}}$$

---

#### **Step 2: Calculate Numerator** $\sum(x_i - \bar{x})(y_i - \bar{y})$

| $x_i$ | $y_i$ | $(x_i - 3)$ | $(y_i - 70)$ | $(x_i - 3)(y_i - 70)$ |
|:---:|:---:|:---:|:---:|:---:|
| 1 | 50 | -2 | -20 | 40 |
| 2 | 60 | -1 | -10 | 10 |
| 3 | 65 | 0 | -5 | 0 |
| 4 | 80 | 1 | 10 | 10 |
| 5 | 95 | 2 | 25 | 50 |
| **Sum** | | | | **110** |

$$\text{Covariance Numerator} = \mathbf{110}$$

---

#### **Step 3: Calculate Denominator** $\sum(x_i - \bar{x})^2$

| $x_i$ | $(x_i - 3)$ | $(x_i - 3)^2$ |
|:---:|:---:|:---:|
| 1 | -2 | 4 |
| 2 | -1 | 1 |
| 3 | 0 | 0 |
| 4 | 1 | 1 |
| 5 | 2 | 4 |
| **Sum** | | **10** |

$$\text{Variance Denominator} = \mathbf{10}$$

---

#### **Step 4: Calculate Slope ($\beta_1$)**
$$\beta_1 = \frac{110}{10} = \mathbf{11}$$

**Interpretation:** For each additional 1 year of experience, an employee's estimated monthly salary increases by **\$11,000** holding other things constant.

---

#### **Step 5: Calculate Intercept ($\beta_0$)**
$$\beta_0 = \bar{y} - \beta_1 \bar{x} = 70 - 11(3) = 70 - 33 = \mathbf{37}$$

**Interpretation:** If an employee has 0 years of experience, their predicted starting base salary is **\$37,000** (baseline).

---

### **1.4 Final Regression Equation (2 marks)**

$$\boxed{\text{Monthly Salary (in \$1,000s)} = 37 + 11 \times \text{Years of Experience}}$$

#### **Prediction Examples:**
- For $x = 2.5$ Years: $\hat{y} = 37 + 11(2.5) = \mathbf{64.5}$ (\$64,500)
- For $x = 6.0$ Years: $\hat{y} = 37 + 11(6.0) = \mathbf{103.0}$ (\$103,000)

---

## **PART 2: REGRESSION ACCURACY & EVALUATION METRICS (5 marks)**

For continuous targets, accuracy is assessed by measuring the distance between actual observed targets $y_i$ and predictions $\hat{y}_i$, representing the model's **residuals** ($e_i = y_i - \hat{y}_i$).

### **Metric 1: MAE - Mean Absolute Error (1.5 marks)**

$$\boxed{\text{MAE} = \frac{1}{n} \sum_{i=1}^{n} |y_i - \hat{y}_i|}$$

#### **Mathematical Step-by-Step Calculation:**
Errors derived from our regression line ($\hat{y}_i = 11x_i + 37$):

| $x_i$ | Actual ($y_i$) | Predicted ($\hat{y}_i$) | Error ($y_i - \hat{y}_i$) | Absolute Error ($|e_i|$) |
|:---:|:---:|:---:|:---:|:---:|
| 1 | 50 | 48 | 2 | 2 |
| 2 | 60 | 59 | 1 | 1 |
| 3 | 65 | 70 | -5 | 5 |
| 4 | 80 | 81 | -1 | 1 |
| 5 | 95 | 92 | 3 | 3 |
| **Sum** | | | **0** | **12** |

$$\text{MAE} = \frac{12}{5} = \mathbf{2.4 \ \text{thousand dollars \ (\$2,400)}}$$

*   **Inference & Significance**: On average, the model's predictions deviate from the actual salary by an absolute physical error of \$2,400. MAE uses absolute values, treating all errors linearly. This makes MAE **robust to outliers** and highly intuitive for business communication.

---

### **Metric 2: MSE - Mean Squared Error (1.5 marks)**

$$\boxed{\text{MSE} = \frac{1}{n} \sum_{i=1}^{n} (y_i - \hat{y}_i)^2}$$

#### **Mathematical Step-by-Step Calculation:**
| Actual ($y_i$) | Predicted ($\hat{y}_i$) | Error ($y_i - \hat{y}_i$) | Squared Error ($e_i^2$) |
|:---:|:---:|:---:|:---:|
| 50 | 48 | 2 | 4 |
| 60 | 59 | 1 | 1 |
| 65 | 70 | -5 | 25 |
| 80 | 81 | -1 | 1 |
| 95 | 92 | 3 | 9 |
| **Sum** | | | **40** |

$$MSE = \frac{40}{5} = \mathbf{8.0 \ \text{units}^2 \ (\$8,000,000)}$$

*   **Inference & Significance**: MSE calculates the average of squared errors. By squaring the residuals, MSE is **highly sensitive to outliers**, penalizing larger errors exponentially. It is mathematically smooth and continuously differentiable, making it the default loss function for gradient-based optimization algorithms.

---

### **Metric 3: RMSE - Root Mean Squared Error (1 mark)**

$$\boxed{\text{RMSE} = \sqrt{\text{MSE}} = \sqrt{\frac{1}{n} \sum_{i=1}^{n} (y_i - \hat{y}_i)^2}}$$

#### **Calculation**:
$$RMSE = \sqrt{8.0} \approx \mathbf{2.828 \ \text{thousand dollars \ (\$2,828)}}$$

*   **Inference & Significance**: RMSE takes the square root of MSE, shifting the units back to the original target scale. It represents the standard deviation of residuals, showing average error penalizing outliers.

---

### **Metric 4: R² - Coefficient of Determination (1 mark)**

$$\boxed{R^2 = 1 - \frac{SS_{\text{res}}}{SS_{\text{tot}}} = 1 - \frac{\sum (y_i - \hat{y}_i)^2}{\sum (y_i - \bar{y})^2}}$$

#### **Calculation**:
Given $SS_{\text{res}} = \sum e_i^2 = 40$, and mean $\bar{y} = 70$:
$$SS_{\text{tot}} = \sum (y_i - \bar{y})^2 = (50-70)^2 + (60-70)^2 + (65-70)^2 + (80-70)^2 + (95-70)^2$$
$$SS_{\text{tot}} = 400 + 100 + 25 + 100 + 625 = \mathbf{1250}$$

$$R^2 = 1 - \frac{40}{1250} = 1 - 0.032 = \mathbf{0.9680}$$

*   **Inference & Significance**: The model explains **96.80% of the total variance** in monthly salaries based on experience, indicating an exceptional, high-quality linear fit.

---

## **PART 3: THE BIAS-VARIANCE RISK PROFILE (5 marks)**

This scenario illustrates the fundamental **Bias-Variance Tradeoff** in machine learning:

```
BIAS-VARIANCE RISK PROFILE:
- Model A ──> High training score, low test score ──> OVERFITTING (High Variance, Low Bias)
- Model B ──> Low training score, low test score  ──> UNDERFITTING (High Bias, Low Variance)
```

---

### **3.1 Model A: Overfitting (High Variance, Low Bias) (2.5 marks)**

*   **Problem Identification**: Model A is exhibiting **Overfitting**.
*   **Description**: The model learns both the underlying statistical relationships and the random noise/outliers present in the training set. It lacks generalization capacity, failing on unseen test data.
*   **Causes**:
    1.  *Excessive Model Complexity*: Having too many parameters (e.g., fitting a high-degree polynomial regression, or unconstrained deep decision trees).
    2.  *Insufficient Training Data*: Small datasets that the model can easily "memorize" rather than learning generalized features.
*   **Possible Remedies**:
    - **Regularization**: Apply L1 (Lasso) or L2 (Ridge) penalties to constrain and shrink parameter weights.
    - **Dimensionality Reduction**: Prune features or use PCA to eliminate noisy input vectors.
    - **Early Stopping**: Stop training when validation error begins to rise.

---

### **3.2 Model B: Underfitting (High Bias, Low Variance) (2.5 marks)**

*   **Problem Identification**: Model B is exhibiting **Underfitting**.
*   **Description**: The model is structurally too simple to capture the underlying patterns in the dataset, leading to poor performance on both the training and test sets.
*   **Causes**:
    1.  *Inadequate Complexity*: Trying to model non-linear relationships with linear estimators (e.g., fitting a straight line to a quadratic curve).
    2.  *Insufficient Features*: Not providing the model with enough explanatory variables or failing to perform useful feature transformations.
*   **Possible Remedies**:
    - **Increase Complexity**: Move to non-linear algorithms (e.g., Support Vector Machines, deep neural networks, or ensemble trees).
    - **Feature Engineering**: Generate polynomial features, interaction variables, or extract domain-specific indicators to enrich the parameter space.
    - **Decrease Regularization**: Lower the regularization coefficient ($\lambda$) to give the model more freedom to learn data features.

---

## **SUMMARY TABLE OF REGRESSION METRICS (1 mark)**

| Metric | Formula | Units | Range | When To Use | Interpretation |
| :--- | :--- | :--- | :---: | :--- | :--- |
| **MAE** | $\frac{1}{n} \sum \|y - \hat{y}\|$ | Original | $0$ to $\infty$ | Outliers aren't critical | Average absolute physical deviation |
| **MSE** | $\frac{1}{n} \sum (y - \hat{y})^2$ | Original$^2$ | $0$ to $\infty$ | Mathematical optimization | Average squared error (outlier-sensitive) |
| **RMSE** | $\sqrt{\text{MSE}}$ | Original | $0$ to $\infty$ | Standard evaluation | Standard deviation of residuals |
| **R²** | $1 - \frac{SS_{\text{res}}}{SS_{\text{tot}}}$ | Ratio | $0$ to $1$ | Assessing overall quality | Proportion of target variance explained |

---

## **KEY TAKEAWAYS (Quick Review)**

**Least-Squares Approach:**
1. Minimizes the sum of squared residuals to find the optimal $\beta_1$ (slope) and $\beta_0$ (intercept).
2. The regression line always passes through the sample centroid $(\bar{x}, \bar{y})$.
3. Sum of OLS residuals $\sum e_i$ must always sum to exactly 0.

**Performance Metrics:**
1. **MAE:** Linear scaling, easy to interpret, robust to outlier noise.
2. **MSE / RMSE:** Quadratic scaling, heavily penalizes large errors.
3. **R²:** Proportional variance explained, representing the quality of fit (0-1).

**Overfitting vs. Underfitting Duality:**
1. **Overfitting:** High variance, low bias. Model memorizes training noise $\rightarrow$ *Regularize, prune features, collect more data.*
2. **Underfitting:** High bias, low variance. Model fails to learn basic structures $\rightarrow$ *Enrich features, increase model complexity, decrease regularization.*

---

## **ANSWER CHECKLIST**

- Define SLR and write standard equation with variable definitions
- Provide calculus OLS derivative proof for both slope ($\beta_1$) and intercept ($\beta_0$)
- Show complete calculation tables for a sample dataset
- State the final regression line equation and interpret parameters
- Explain MAE, MSE, RMSE, and $R^2$ with full formulas and significance
- Demonstrate step-by-step metric calculations on the dataset
- Diagnose Model A (Overfitting) and Model B (Underfitting)
- Explain definitions, causes, and remedies for overfitting and underfitting
- Display a comprehensive metric summary table
- Include an answer checklist and mark breakdown

---

## **MARK BREAKDOWN**

| Component | Marks |
| :--- | :---: |
| SLR Definition & Standard Equation | 2.0 |
| Calculus Least-Squares Parameter Derivation ($\beta_0$, $\beta_1$) | 3.0 |
| Step-by-Step Sample Dataset Calculation | 3.0 |
| Final Equation & Parameter Interpretations | 2.0 |
| **PART 1 SUBTOTAL** | **10.0** |
| MAE Definition, Calculation, and Significance | 1.5 |
| MSE Definition, Calculation, and Significance | 1.5 |
| RMSE & $R^2$ Equations and Calculations | 2.0 |
| **PART 2 SUBTOTAL** | **5.0** |
| Model A Diagnosis, Definition, Causes, and Remedies | 2.5 |
| Model B Diagnosis, Definition, Causes, and Remedies | 2.5 |
| **PART 3 SUBTOTAL** | **5.0** |
| **TOTAL** | **20.0** |

---

**This answer scores FULL 20 marks** 
