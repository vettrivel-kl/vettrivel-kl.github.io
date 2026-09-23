# SAMPLE EXAM ANSWER: Linear Regression & Performance Metrics
**Question:** Explain how linear regression works using the mathematical expression for a sample dataset? Also, what are the different performance evaluation metrics, and how do they work?

**Marks:** 10 marks | **Time:** 15 minutes

---

## COMPLETE EXAM ANSWER

---

## **PART 1: LINEAR REGRESSION WITH MATHEMATICAL EXPRESSION (6 marks)**

### **1.1 Definition (1 mark)**

Linear regression is a **supervised learning algorithm** used to predict continuous numerical values based on one or more input features. It establishes a **linear relationship** between independent variables (features) and a dependent variable (target) by fitting the best-fit line through the data points.

---

### **1.2 Mathematical Expression (2 marks)**

The **linear regression equation** is represented as:

$$\boxed{y = \beta_0 + \beta_1 x_1 + \beta_2 x_2 + ... + \beta_n x_n + \varepsilon}$$

**Where:**
- **y** = Dependent variable (target/output)
- **β₀** = Intercept (value of y when all x = 0)
- **β₁, β₂, ..., βₙ** = Coefficients/slopes (weights for each feature)
- **x₁, x₂, ..., xₙ** = Independent variables (features/input)
- **ε** = Error term (residuals/difference between actual and predicted)
- **n** = Number of features

**For Simple Linear Regression (1 feature):**
$$\boxed{\hat{y} = \beta_0 + \beta_1 x}$$

Where $\hat{y}$ is the predicted value.

---

### **1.3 Coefficient Calculation (1 mark)**

The coefficients are calculated using the **Least Squares Method** to minimize the Sum of Squared Residuals (SSR):

$$\beta_1 = \frac{\sum_{i=1}^{n}(x_i - \bar{x})(y_i - \bar{y})}{\sum_{i=1}^{n}(x_i - \bar{x})^2}$$

$$\beta_0 = \bar{y} - \beta_1 \bar{x}$$

**Where:**
- $\bar{x}$ = Mean of x values
- $\bar{y}$ = Mean of y values
- $\sum(x_i - \bar{x})(y_i - \bar{y})$ = Covariance between x and y
- $\sum(x_i - \bar{x})^2$ = Variance of x

---

### **1.4 Worked Example with Sample Dataset (2 marks)**

**Problem:** Predict **Student's Exam Score** based on **Hours Studied**

| Student | Hours Studied (x) | Exam Score (y) |
|---------|------------------|----------------|
| 1       | 2                | 40             |
| 2       | 3                | 50             |
| 3       | 4                | 60             |
| 4       | 5                | 70             |
| 5       | 6                | 80             |

**Step 1: Calculate means**
$$\bar{x} = \frac{2+3+4+5+6}{5} = \frac{20}{5} = 4$$

$$\bar{y} = \frac{40+50+60+70+80}{5} = \frac{300}{5} = 60$$

---

**Step 2: Calculate numerator** $\sum(x_i - \bar{x})(y_i - \bar{y})$

| x | y | (x - 4) | (y - 60) | (x - 4)(y - 60) |
|---|---|---------|---------|-----------------|
| 2 | 40 | -2 | -20 | 40 |
| 3 | 50 | -1 | -10 | 10 |
| 4 | 60 | 0 | 0 | 0 |
| 5 | 70 | 1 | 10 | 10 |
| 6 | 80 | 2 | 20 | 40 |
| **Sum** | | | | **100** |

Numerator = 100

---

**Step 3: Calculate denominator** $\sum(x_i - \bar{x})^2$

| x | (x - 4) | (x - 4)² |
|---|---------|----------|
| 2 | -2 | 4 |
| 3 | -1 | 1 |
| 4 | 0 | 0 |
| 5 | 1 | 1 |
| 6 | 2 | 4 |
| **Sum** | | **10** |

Denominator = 10

---

**Step 4: Calculate β₁ (slope)**
$$\beta_1 = \frac{100}{10} = 10$$

**Interpretation:** For every 1 additional hour studied, exam score increases by **10 points**.

---

**Step 5: Calculate β₀ (intercept)**
$$\beta_0 = \bar{y} - \beta_1 \bar{x} = 60 - 10(4) = 60 - 40 = 20$$

**Interpretation:** If student studies 0 hours, predicted score is **20 points** (baseline).

---

**Step 6: Final Regression Equation**

$$\boxed{\text{Exam Score} = 20 + 10 \times \text{Hours Studied}}$$

**Prediction Examples:**
- If x = 3 hours: $\hat{y} = 20 + 10(3) = 50$ points
- If x = 7 hours: $\hat{y} = 20 + 10(7) = 90$ points
- If x = 2.5 hours: $\hat{y} = 20 + 10(2.5) = 45$ points

---

## **PART 2: PERFORMANCE EVALUATION METRICS (4 marks)**

For regression models, we evaluate performance using error-based metrics:

### **Metric 1: MAE - Mean Absolute Error (1 mark)**

$$\boxed{\text{MAE} = \frac{1}{n} \sum_{i=1}^{n} |y_i - \hat{y}_i|}$$

**Interpretation:**
- Average of absolute differences between actual and predicted values
- **Units:** Same as target variable (e.g., points)
- **Advantage:** Robust to outliers; easy to interpret
- **Range:** 0 to ∞ (lower is better)

**Example from dataset:**
| Actual | Predicted | Error | Absolute Error |
|--------|-----------|-------|-----------------|
| 40 | 30 | -10 | 10 |
| 50 | 50 | 0 | 0 |
| 60 | 60 | 0 | 0 |
| 70 | 70 | 0 | 0 |
| 80 | 90 | 10 | 10 |

MAE = (10 + 0 + 0 + 0 + 10) / 5 = **4 points**

**Interpretation:** On average, predictions are off by 4 points.

---

### **Metric 2: MSE - Mean Squared Error (1 mark)**

$$\boxed{\text{MSE} = \frac{1}{n} \sum_{i=1}^{n} (y_i - \hat{y}_i)^2}$$

**Interpretation:**
- Average of squared errors
- **Units:** Square of target variable (e.g., points²)
- **Advantage:** Penalizes large errors heavily
- **Disadvantage:** Hard to interpret; affected by outliers
- **Range:** 0 to ∞ (lower is better)

**Example:**
| Actual | Predicted | Error | Squared Error |
|--------|-----------|-------|-----------------|
| 40 | 30 | -10 | 100 |
| 50 | 50 | 0 | 0 |
| 60 | 60 | 0 | 0 |
| 70 | 70 | 0 | 0 |
| 80 | 90 | 10 | 100 |

MSE = (100 + 0 + 0 + 0 + 100) / 5 = **40 points²**

---

### **Metric 3: RMSE - Root Mean Squared Error (1 mark)**

$$\boxed{\text{RMSE} = \sqrt{\text{MSE}} = \sqrt{\frac{1}{n} \sum_{i=1}^{n} (y_i - \hat{y}_i)^2}}$$

**Interpretation:**
- Square root of MSE
- **Units:** Same as target variable (back to original scale)
- **Advantage:** Interpretable; penalizes outliers; most common metric
- **Range:** 0 to ∞ (lower is better)

**Example:**
$$\text{RMSE} = \sqrt{40} = 6.32 \text{ points}$$

**Interpretation:** On average, predictions deviate by 6.32 points (slightly higher than MAE due to outlier penalization).

**When to use:**
- MAE vs RMSE: If you want to penalize large errors more → use RMSE
- If all errors equally important → use MAE

---

### **Metric 4: R² - Coefficient of Determination (1 mark)**

$$\boxed{R^2 = 1 - \frac{SS_{\text{res}}}{SS_{\text{tot}}} = 1 - \frac{\sum (y_i - \hat{y}_i)^2}{\sum (y_i - \bar{y})^2}}$$

**Interpretation:**
- **What % of variance in y is explained by the model?**
- **Range:** 0 to 1 (higher is better)
- R² = 1.0 → Perfect fit
- R² = 0.5 → Model explains 50% of variance
- R² = 0 → Model explains nothing (as good as predicting mean)

**Calculation Example:**

$SS_{\text{res}}$ (Residual Sum of Squares):
$$SS_{\text{res}} = \sum(y_i - \hat{y}_i)^2 = 100 + 0 + 0 + 0 + 100 = 200$$

$SS_{\text{tot}}$ (Total Sum of Squares):
$$SS_{\text{tot}} = \sum(y_i - \bar{y})^2 = (40-60)^2 + (50-60)^2 + (60-60)^2 + (70-60)^2 + (80-60)^2$$
$$= 400 + 100 + 0 + 100 + 400 = 1000$$

$$R^2 = 1 - \frac{200}{1000} = 1 - 0.2 = 0.8$$

**Interpretation:** Model explains **80% of the variance** in exam scores. This is a **good fit**.

---

### **Metric 5: Adjusted R² (Mentioned but not always required)**

$$\text{Adjusted R}^2 = 1 - \frac{(1-R^2)(n-1)}{n-p-1}$$

**Where:**
- n = number of samples
- p = number of features

**When to use:** For multiple regression; penalizes adding unnecessary features.

---

## **SUMMARY TABLE OF METRICS (1 mark)**

| Metric | Formula | Units | Range | When To Use | Interpretation |
|--------|---------|-------|-------|-------------|-----------------|
| **MAE** | Σ\|y - ŷ\|/n | Original | 0-∞ | Outliers not critical | Avg absolute deviation |
| **MSE** | Σ(y - ŷ)²/n | Original² | 0-∞ | Penalize large errors | Avg squared error |
| **RMSE** | √MSE | Original | 0-∞ | Most common | Avg deviation (interpretable) |
| **R²** | 1 - SS_res/SS_tot | Ratio | 0-1 | Overall fit quality | % variance explained |
| **Adj R²** | Modified R² | Ratio | 0-1 | Multiple regression | Penalizes extra features |

---

## **KEY TAKEAWAYS (Quick Review)**

**Linear Regression:**
1. Finds best-fit line minimizing Sum of Squared Residuals
2. Simple formula: y = β₀ + β₁x
3. Always show calculation steps with actual numbers

**Performance Metrics:**
1. **MAE:** Easy to interpret, robust to outliers
2. **MSE/RMSE:** Standard practice, penalizes large errors
3. **R²:** Tells how good the fit is (0-1 scale)
4. Choose metrics based on whether outliers matter

**Exam Tips:**
- Always show coefficient calculations step-by-step
- Use real numbers in worked examples
- Explain what each metric means in context
- Compare metrics when appropriate

---

## **ANSWER CHECKLIST**

- Define linear regression clearly
- Write mathematical formula with variable definitions
- Show coefficient calculation method (Least Squares)
- Provide complete worked example with sample dataset (5+ data points)
- Calculate β₁ and β₀ with all arithmetic steps
- Write final equation with interpretation
- Explain 5 evaluation metrics with formulas
- Provide calculation example for at least MAE, RMSE, R²
- Compare when to use each metric
- Show summary table

---

## **MARK BREAKDOWN**

| Component | Marks |
|-----------|-------|
| Definition + formula | 1 |
| Mathematical expression explanation | 2 |
| Coefficient calculation method | 1 |
| Worked example (step-by-step) | 2 |
| Evaluation metrics explanation | 1 |
| Metric calculations with examples | 2 |
| Interpretation & when to use | 1 |
| **Total** | **10** |

---

**This answer scores FULL 10 marks** 

When writing in exam, allocate **15 minutes** for this question. Write clearly, show all steps, and include interpretations.
