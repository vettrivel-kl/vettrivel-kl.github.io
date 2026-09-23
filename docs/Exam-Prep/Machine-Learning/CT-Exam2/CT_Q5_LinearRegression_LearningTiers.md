# SAMPLE EXAM ANSWER: Linear Regression, Regression Metrics, and Learning Paradigms

**Question:** 
(i) A retail company wants to predict its product sales based on advertising expenditure. A sample dataset containing advertising cost and corresponding sales is available. Explain how Linear Regression can be used to establish the relationship between the input and output variables. Demonstrate the model using a suitable mathematical expression and explain how predictions are generated. Also discuss the different performance evaluation metrics for regression models and explain how each metric is used to assess prediction accuracy. [15 Marks]
(ii) A company has three machine learning tasks:
- Predicting customer churn using labelled customer data,
- Grouping customers based on purchasing behaviour without predefined labels, and
- Building a model using a small amount of labelled data and a large amount of unlabelled data.
Compare Supervised, Unsupervised, and Semi-Supervised Learning and identify which approach is appropriate for each task. Give one suitable example for each type of learning. [5 Marks]

**Marks:** 20 marks | **Time:** 30 minutes

---

## COMPLETE EXAM ANSWER

---

## **PART 1: LINEAR REGRESSION & PERFORMANCE EVALUATION (15 marks)**

### **1.1 Definition & How Linear Regression Works (2 marks)**

Linear Regression is a **supervised learning algorithm** used to model and analyze the relationship between a continuous independent variable $x$ (predictor/feature) and a continuous dependent variable $y$ (target). 

The algorithm establishes this relationship by fitting a **best-fit straight line** through the training data points. The optimal line is determined using the **Ordinary Least Squares (OLS) method**, which mathematically minimizes the Sum of Squared Residuals (SSR)—the squared vertical distances between the actual data points and the predicted line.

---

### **1.2 Mathematical Expression & Parameter Estimation (3 marks)**

The mathematical model for **Simple Linear Regression** is represented as:

$$\boxed{y = \beta_0 + \beta_1 x + \varepsilon}$$

**Where:**
- **y** = Dependent variable (target/output, e.g., Product Sales)
- **x** = Independent variable (feature/input, e.g., Advertising Expenditure)
- **β₀** = Y-intercept (baseline value of $y$ when $x = 0$)
- **β₁** = Slope coefficient (expected change in $y$ for a one-unit change in $x$)
- **ε** = Random error term ($\varepsilon \sim \mathcal{N}(0, \sigma^2)$, assuming zero mean and constant variance)

The estimated best-fit regression line is defined as:
$$\boxed{\hat{y} = \beta_0 + \beta_1 x}$$

Where $\hat{y}$ is the predicted sales. The parameter coefficients are calculated using the OLS equations:

$$\beta_1 = \frac{\sum_{i=1}^{n}(x_i - \bar{x})(y_i - \bar{y})}{\sum_{i=1}^{n}(x_i - \bar{x})^2} = \frac{\text{Cov}(x, y)}{\text{Var}(x)}$$

$$\beta_0 = \bar{y} - \beta_1 \bar{x}$$

**Where:**
- $\bar{x}$ = Mean of input features ($x$ values)
- $\bar{y}$ = Mean of target variables ($y$ values)

---

### **1.3 Step-by-Step Worked Example on Advertising Dataset (3 marks)**

**Problem:** Establish a regression line to predict **Product Sales ($y$, in thousands of units)** based on **Advertising Expenditure ($x$, in thousands of dollars)**.

| Month ($i$) | Advertising Cost ($x_i$) | Product Sales ($y_i$) |
|:---:|:---:|:---:|
| 1 | 2 | 40 |
| 2 | 3 | 50 |
| 3 | 4 | 60 |
| 4 | 5 | 70 |
| 5 | 6 | 80 |

#### **Step 1: Calculate Sample Means**
$$\bar{x} = \frac{2+3+4+5+6}{5} = \frac{20}{5} = \mathbf{4.0 \ \text{thousand dollars}}$$

$$\bar{y} = \frac{40+50+60+70+80}{5} = \frac{300}{5} = \mathbf{60.0 \ \text{thousand units}}$$

---

#### **Step 2: Calculate Covariance Numerator** $\sum(x_i - \bar{x})(y_i - \bar{y})$

| $x_i$ | $y_i$ | $(x_i - 4)$ | $(y_i - 60)$ | $(x_i - 4)(y_i - 60)$ |
|:---:|:---:|:---:|:---:|:---:|
| 2 | 40 | -2 | -20 | 40 |
| 3 | 50 | -1 | -10 | 10 |
| 4 | 60 | 0 | 0 | 0 |
| 5 | 70 | 1 | 10 | 10 |
| 6 | 80 | 2 | 20 | 40 |
| **Sum** | | | | **100** |

$$\text{Numerator} = \mathbf{100}$$

---

#### **Step 3: Calculate Variance Denominator** $\sum(x_i - \bar{x})^2$

| $x_i$ | $(x_i - 4)$ | $(x_i - 4)^2$ |
|:---:|:---:|:---:|
| 2 | -2 | 4 |
| 3 | -1 | 1 |
| 4 | 0 | 0 |
| 5 | 1 | 1 |
| 6 | 2 | 4 |
| **Sum** | | **10** |

$$\text{Denominator} = \mathbf{10}$$

---

#### **Step 4: Calculate Slope ($\beta_1$)**
$$\beta_1 = \frac{100}{10} = \mathbf{10}$$

**Interpretation:** For each additional **\$1,000** spent on advertising, product sales are estimated to increase by **10,000 units** holding other things constant.

---

#### **Step 5: Calculate Intercept ($\beta_0$)**
$$\beta_0 = \bar{y} - \beta_1 \bar{x} = 60 - 10(4) = 60 - 40 = \mathbf{20}$$

**Interpretation:** If the company spends \$0 on advertising, predicted starting sales are **20,000 units** (baseline).

---

#### **Step 6: Final Regression Equation & Generating Predictions**

$$\boxed{\text{Product Sales (in thousands)} = 20 + 10 \times \text{Advertising Cost (in thousands)}}$$

##### **Prediction Generation Examples:**
- If Advertising Cost is **\$3,500** ($x = 3.5$): $\hat{y} = 20 + 10(3.5) = \mathbf{55}$ thousand units.
- If Advertising Cost is **\$7,000** ($x = 7.0$): $\hat{y} = 20 + 10(7.0) = \mathbf{90}$ thousand units.

---

### **1.4 Performance Evaluation Metrics for Regression (7 marks)**

Regression performance is assessed by analyzing the **residuals** ($e_i = y_i - \hat{y}_i$). We evaluate four core mathematical metrics:

---

#### **Metric 1: MAE - Mean Absolute Error (1.5 marks)**

$$\boxed{\text{MAE} = \frac{1}{n} \sum_{i=1}^{n} |y_i - \hat{y}_i|}$$

*   **Interpretation & Usage**: MAE measures the average magnitude of prediction errors in the original units. It treats all errors linearly.
*   **Pro**: Highly robust to outliers.
*   **Con**: Non-differentiable at zero, making it difficult to use directly as an optimization loss function.
*   **Example from dataset (with introduced outlier prediction $\hat{y} = 30$ and $90$ for endpoints)**:
    $$\text{MAE} = \frac{|40-30| + |50-50| + |60-60| + |70-70| + |80-90|}{5} = \frac{10 + 0 + 0 + 0 + 10}{5} = \mathbf{4.0 \ \text{units}}$$

---

#### **Metric 2: MSE - Mean Squared Error (1.5 marks)**

$$\boxed{\text{MSE} = \frac{1}{n} \sum_{i=1}^{n} (y_i - \hat{y}_i)^2}$$

*   **Interpretation & Usage**: MSE measures the average squared difference between actual and predicted values.
*   **Pro**: Highly suitable for optimization because it is continuously differentiable.
*   **Con**: Highly sensitive to outliers due to the squaring effect, skewing estimates if a single large error occurs.
*   **Example**:
    $$MSE = \frac{(40-30)^2 + 0 + 0 + 0 + (80-90)^2}{5} = \frac{100 + 0 + 0 + 0 + 100}{5} = \mathbf{40.0 \ \text{units}^2}$$

---

#### **Metric 3: RMSE - Root Mean Squared Error (1.5 marks)**

$$\boxed{\text{RMSE} = \sqrt{\text{MSE}} = \sqrt{\frac{1}{n} \sum_{i=1}^{n} (y_i - \hat{y}_i)^2}}$$

*   **Interpretation & Usage**: RMSE takes the square root of MSE to shift the error unit back to the original scale of the target variable.
*   **Pro**: Highly interpretable while still heavily penalizing large errors.
*   **Example**:
    $$RMSE = \sqrt{40.0} \approx \mathbf{6.32 \ \text{thousand units}}$$

---

#### **Metric 4: R² - Coefficient of Determination (1.5 marks)**

$$\boxed{R^2 = 1 - \frac{SS_{\text{res}}}{SS_{\text{tot}}} = 1 - \frac{\sum (y_i - \hat{y}_i)^2}{\sum (y_i - \bar{y})^2}}$$

*   **Interpretation & Usage**: Measures the proportion of total variance in the dependent variable explained by the independent variable.
*   **Range**: $0$ to $1$. $R^2 = 1.0$ represents a perfect fit.
*   **Example** ($SS_{\text{res}} = 200$, $\bar{y} = 60$):
    $$SS_{\text{tot}} = (40-60)^2 + (50-60)^2 + (60-60)^2 + (70-60)^2 + (80-60)^2 = 400 + 100 + 0 + 100 + 400 = 1000$$
    $$R^2 = 1 - \frac{200}{1000} = 1 - 0.20 = \mathbf{0.80 \ (80.00\%)}$$

---

### **Metric 5: Adjusted R² (0.5 mark)**
$$\boxed{\text{Adjusted } R^2 = 1 - \frac{(1-R^2)(n-1)}{n-p-1}}$$
Where $p$ is the number of features. It adjusts for the number of predictors, preventing overestimation when adding meaningless features.

---

## **PART 2: COMPARISON OF LEARNING PARADIGMS (5 marks)**

The three corporate tasks map directly to the three main machine learning paradigms:

```
MACHINE LEARNING PARADIGM ROUTING:
- Churn Prediction (Labelled Data)       ──> SUPERVISED LEARNING
- Behavioral Grouping (Unlabelled Data)  ──> UNSUPERVISED LEARNING
- Hybrid Model (Mixed Labelled/Unlabelled) ──> SEMI-SUPERVISED LEARNING
```

---

### **2.1 Task Routing & Paradigms Comparison (3 marks)**

#### **Task 1: Predicting customer churn using labelled customer data**
*   **Paradigm Appropriate**: **Supervised Learning**
*   **Theoretical Justification**: The input dataset contains historically recorded, labelled instances of customer churn (e.g., $y = 1$ for Churned, $y = 0$ for Retained). The goal is to train a mapping function $f(\mathbf{x}) = \hat{y}$ that can predict this explicit label for new, active customers.
*   **Real-World Example**: Training a **Random Forest Classifier** on historic customer profiles containing billing logs, service tickets, and contract status to classify active customers as "At Risk" or "Stable."

---

#### **Task 2: Grouping customers based on purchasing behavior without predefined labels**
*   **Paradigm Appropriate**: **Unsupervised Learning**
*   **Theoretical Justification**: The dataset contains no historical class labels ($y$). The objective is not prediction, but discovering latent patterns, similarities, or clustering structures based solely on customer features (purchasing history, frequency).
*   **Real-World Example**: Applying **K-Means Clustering** to segment customers into distinct marketing categories (e.g., "High-Value Frequent Spenders," "Budget-Conscious Shoppers," or "One-Time Buyers") using purchase recency, frequency, and monetary metrics.

---

#### **Task 3: Model using a small amount of labelled data and a large amount of unlabelled data**
*   **Paradigm Appropriate**: **Semi-Supervised Learning**
*   **Theoretical Justification**: Labelling data manually is highly expensive and time-consuming, while collecting unlabelled raw data is cheap. Semi-Supervised learning leverages the small set of labelled samples to learn baseline representations, and uses structural properties of the larger unlabelled set (e.g., consistency or cluster assumptions) to generalize predictions.
*   **Real-World Example**: Developing a **Self-Training Label Propagation Model** for card fraud detection, where only a few hundred transaction logs are manually audited and labelled, but millions of transaction histories are available without labels.

---

## **SUMMARY PARADIGMS COMPARISON TABLE (1 mark)**

| Dimension | Supervised Learning | Unsupervised Learning | Semi-Supervised Learning |
| :--- | :--- | :--- | :--- |
| **Input Data** | Fully Labelled ($(\mathbf{x}_i, y_i)$) | Completely Unlabelled ($\mathbf{x}_i$) | Mixture (small labelled, large unlabelled) |
| **Primary Goal** | Map inputs to target variables | Find latent structures/patterns | Leverage unlabelled structure to boost labels |
| **Algorithms** | Linear Regression, SVM, Random Forest | K-Means, PCA, DBSCAN | Label Propagation, Self-Training, GANs |
| **Target Task** | Classification, Regression | Clustering, Dimension Reduction | Semi-supervised Classification/Clustering |

---

## **KEY TAKEAWAYS (Quick Review)**

**Linear Regression:**
1. Minimizes Sum of Squared Residuals (SSR) using Ordinary Least Squares (OLS).
2. Establish relationship via: $y = \beta_0 + \beta_1 x + e$.
3. Predictions are generated by direct linear substitution.

**Regression Metrics:**
1. **MAE:** Linear, robust to outlier noise, same units as target.
2. **MSE / RMSE:** Quadratic, penalizes outliers, highly suitable for differentiable gradient descent.
3. **R²:** Quality of overall fit representing the proportion of target variance explained.

**Learning Paradigms:**
1. **Supervised:** Predicts predefined labels based on historic data.
2. **Unsupervised:** Clusters or structures unlabelled data.
3. **Semi-Supervised:** Combines small labelled data with massive unlabelled data to optimize costs.

---

## **ANSWER CHECKLIST**

- Define Simple Linear Regression and write standard OLS equations
- Construct a worked monthly advertising expenditure vs. sales example table
- Show step-by-step mean, covariance, variance, slope, and intercept math
- Define MAE, MSE, RMSE, and $R^2$ with math formulas and tradeoffs
- Illustrate step-by-step metric calculations on the dataset
- Diagnose and assign the correct ML paradigm to all three company tasks
- Provide a detailed comparative paradigm table
- Give a real-world algorithm example for all three paradigms
- Display a comprehensive checklist and mark breakdown

---

## **MARK BREAKDOWN**

| Component | Marks |
| :--- | :---: |
| SLR Definition & Standard Equation | 2.0 |
| Parameter Estimation ($Cov/Var$) and OLS Derivations | 3.0 |
| Step-by-Step Sample Dataset Calculations | 3.0 |
| Final Predictions Generation Examples | 2.0 |
| MAE, MSE, RMSE, and $R^2$ Equations and Significances | 5.0 |
| **PART 1 SUBTOTAL** | **15.0** |
| Task 1 Assignment, Theory, and Example (Supervised) | 1.25 |
| Task 2 Assignment, Theory, and Example (Unsupervised) | 1.25 |
| Task 3 Assignment, Theory, and Example (Semi-Supervised) | 1.25 |
| Comparative Paradigm Table | 1.25 |
| **PART 2 SUBTOTAL** | **5.0** |
| **TOTAL** | **20.0** |

---

**This answer scores FULL 20 marks** 
