# SAMPLE EXAM ANSWER: Classification Model Evaluation & Cross-Validation

**Question:** 
(i) Explain how K-Fold Cross-Validation can be used to evaluate the reliability of the classification model. Describe the steps involved in K-Fold Cross-Validation and explain why it generally provides a more reliable estimate of model performance than a single train-test split. Give one suitable real-world situation where K-Fold Cross-Validation would be beneficial. **[5 Marks]**

(ii) The following confusion matrix represents the prediction results of the customer renewal model:

| Actual \ Predicted | No | Yes |
| :--- | :---: | :---: |
| **No** | 65 | 43 |
| **Yes** | 32 | 55 |

The total number of observations is $N = 195$.

Using the above confusion matrix:
* **a)** Define a confusion matrix and explain the significance of True Positive (TP), True Negative (TN), False Positive (FP), and False Negative (FN). **[3 Marks]**
* **b)** Identify the values of TP, TN, FP, and FN from the given matrix and calculate the following classification performance measures: **[8 Marks]**
  * Accuracy
  * Precision
  * Recall
  * F1-Score

**Marks:** 16 marks | **Time:** 25 minutes

---

## COMPLETE EXAM ANSWER

---

## **PART 1: K-FOLD CROSS-VALIDATION (5 marks)**

### **1.1 Theoretical Framework & How it Works (1 mark)**

**K-Fold Cross-Validation** is a non-parametric statistical resampling procedure used to estimate the generalization performance of a machine learning model on unseen data. Its primary goal is to evaluate the model's reliability by ensuring that the performance metric is not biased by a single, arbitrary partition of training and test sets.

The final performance estimator is computed as the arithmetic mean of the metric evaluated across all $K$ validation slices:

$$\boxed{\hat{\theta}_{\text{CV}} = \frac{1}{K} \sum_{i=1}^{K} \theta_i}$$

*(Where $\theta_i$ represents the evaluation metric, such as accuracy, calculated on the validation set during fold $i$).*

---

### **1.2 Detailed Algorithmic Steps (2 marks)**

1.  **Shuffle**: Randomly permute the indices of the entire dataset to eliminate any systematic ordering patterns (e.g., temporal or alphabetical order).
2.  **Partition**: Segment the dataset into $K$ mutually exclusive and approximately equal-sized sub-samples (called "folds"), denoted as $\{D_1, D_2, \dots, D_K\}$.
3.  **Train & Validate Loop**: Iterate $K$ times. For each fold $i \in \{1, 2, \dots, K\}$:
    *   Designate fold $D_i$ as the **validation/testing set** ($D_{\text{val}} = D_i$).
    *   Combine the remaining $K-1$ folds to form the **training set** ($D_{\text{train}} = \bigcup_{j \neq i} D_j$).
    *   Fit the model parameters on $D_{\text{train}}$.
    *   Evaluate the trained model on $D_{\text{val}}$ and record the resulting performance metric $\theta_i$.
    *   Discard the trained model parameters to prevent data leakage across folds.
4.  **Aggregate**: Compute the final cross-validation score $\hat{\theta}_{\text{CV}}$.

*   **Academic Extension (Stratified K-Fold)**: In classification problems with imbalanced labels, standard K-Fold may yield folds with highly unrepresentative class distributions. Thus, **Stratified K-Fold** is preferred, which guarantees that each fold preserves the exact overall class ratio (e.g., the proportion of "Yes" vs. "No" labels remains constant across all validation runs).

---

### **1.3 Why K-Fold Outperforms a Single Train-Test Split (1 mark)**

A single train-test split (holdout method) is highly susceptible to **sampling variance** and **pessimistic bias**:
*   **High Sampling Variance**: The performance score is heavily dependent on the specific random seed used for the split. By chance, the test set may contain disproportionately easy or difficult samples, resulting in an overly optimistic or pessimistic estimate.
*   **Pessimistic Bias**: Reserving $20\% - 30\%$ of the data permanently for testing reduces the size of the training partition. Because machine learning models perform better with more data, the model trained on the smaller split will underperform compared to a model trained on the full dataset, leading to an underestimated estimate of generalization capability.
*   **K-Fold Solution**: K-Fold mitigates these issues by ensuring that **every data point is used for training exactly $K-1$ times and for validation exactly once**. This utilizes $(1 - 1/K)$ of the data (typically $90\%$ for $K=10$) for training in each fold, significantly reducing pessimistic bias. Averaging the results over $K$ folds effectively averages out the sampling noise, providing a stable, low-variance estimate.

---

### **1.4 Real-World Situation (1 mark)**

K-Fold is highly beneficial when developing predictive models on **small datasets**, such as a **clinical trial dataset for rare disease diagnosis** (e.g., only 200 patient records). With such limited data:
1.  Using a single holdout split of 70/30 would leave only 60 patients for testing, leading to high variance in test metrics (a change in prediction for just 3 patients shifts accuracy by $5\%$).
2.  It would also reduce the training pool to 140 patients, preventing the model from learning scarce disease patterns.
3.  K-Fold (specifically $K=10$) allows 180 records to be used for training in each fold, maximizing learning potential, while evaluating predictions on all 200 patients across the folds, providing a reliable and unbiased performance measure.

---

## **PART 2: CONFUSION MATRIX ANALYSIS (11 marks)**

### **2.1 Formal Definition & Marginal Verification (1 mark)**

An **$N \times N$ Confusion Matrix** is a cross-tabulation of actual versus predicted class frequencies for a classifier. It maps out where predictions "confuse" one class for another.

To establish marginal consistency for this dataset, we construct the marginalized confusion matrix:

$$N = \sum_{row=1}^{2} \sum_{col=1}^{2} M_{row, col}$$

##### Marginalized Customer Renewal Confusion Matrix ($N=195$)

| Actual \ Predicted | No (Predicted Non-Renewal) | Yes (Predicted Renewal) | Actual Row Totals (Class Support) |
| :--- | :---: | :---: | :---: |
| **No** | $M_{1,1} = 65$ (True Negatives) | $M_{1,2} = 43$ (False Positives) | $65 + 43 = \mathbf{108}$ |
| **Yes** | $M_{2,1} = 32$ (False Negatives) | $M_{2,2} = 55$ (True Positives) | $32 + 55 = \mathbf{87}$ |
| **Predicted Column Totals** | $65 + 32 = \mathbf{97}$ | $43 + 55 = \mathbf{98}$ | **Total Sample Size ($N$)** $= \mathbf{195}$ |

---

### **2.2 Significance of Parameters (2 marks)**

Assuming **"Yes" (Renewal)** is our Positive Class and **"No" (Non-Renewal)** is our Negative Class:

| Parameter | Value | Definition & Significance |
| :--- | :---: | :--- |
| **True Positive (TP)** | **55** | Actual positives correctly classified as positive ($M_{2,2} = 55$). *Significance*: Represents the customer base correctly flagged as loyal/renewing, confirming successful retention predictions. |
| **True Negative (TN)** | **65** | Actual negatives correctly classified as negative ($M_{1,1} = 65$). *Significance*: Represents customers who will not renew and are correctly predicted as such, allowing the business to anticipate voluntary churn accurately. |
| **False Positive (FP)** | **43** | Type I Error. Actual negatives incorrectly classified as positive ($M_{1,2} = 43$). *Significance*: Represents customers predicted to renew who actually churn. These are "sleeping churners" whom the business neglects to target with retention outreach, leading to unpredicted revenue loss. |
| **False Negative (FN)** | **32** | Type II Error. Actual positives incorrectly classified as negative ($M_{2,1} = 32$). *Significance*: Represents customers predicted to churn who actually would have renewed. This leads to wasted retention spend by offering unnecessary discounts or loyalty rewards to customers who were already planning to renew. |

---

### **2.3 Metric Calculations (8 marks)**

---

#### **Metric 1: Accuracy (2 marks)**
**Definition**: The proportion of correct predictions across both classes out of all observed customer records.

##### Mathematical Steps:
1. **Formula**:
   $$\boxed{Accuracy = \frac{TP + TN}{TP + TN + FP + FN}}$$
2. **Value Substitution**:
   $$Accuracy = \frac{55 + 65}{55 + 65 + 43 + 32}$$
3. **Perform Additions (Numerator and Denominator)**:
   * $\text{Numerator} = 55 + 65 = 120$
   * $\text{Denominator} = 195$
   $$Accuracy = \frac{120}{195}$$
4. **Fractional Simplification (Divide by GCD = 15)**:
   $$Accuracy = \frac{120 \div 15}{195 \div 15} = \frac{8}{13}$$
5. **Decimal Division**:
   $$8 \div 13 = 0.6153846... \rightarrow \mathbf{61.54\%}$$

*   **Inference**: Out of 195 total customers, the model correctly predicted whether they would renew or not renew approximately 61.54% of the time. While this is slightly better than a baseline random guess (50%), it means **38.46%** of predictions are wrong.

---

#### **Metric 2: Precision (2 marks)**
**Definition**: The proportion of positive predictions (predicted to renew) that were actually correct.

##### Mathematical Steps:
1. **Formula**:
   $$\boxed{Precision = \frac{TP}{TP + FP}}$$
2. **Value Substitution**:
   $$Precision = \frac{55}{55 + 43}$$
3. **Perform Addition in Denominator**:
   $$Precision = \frac{55}{98}$$
4. **Decimal Division**:
   $$55 \div 98 = 0.561224... \rightarrow \mathbf{56.12\%}$$

*   **Inference**: When the model predicts that a customer *will* renew their subscription, it is correct only **56.12%** of the time. There is a high False Positive Rate (43 False Positives out of 98 positive predictions).
*   **Business Impact**: If the company plans to target customers who are predicted *not* to renew with expensive win-back discounts or marketing campaigns, a low precision means that many customers predicted to renew (who actually didn't) are completely missed, while others might be targeted inefficiently.

---

#### **Metric 3: Recall (Sensitivity / True Positive Rate) (2 marks)**
**Definition**: The proportion of actual positive cases (customers who actually renewed) that were successfully identified.

##### Mathematical Steps:
1. **Formula**:
   $$\boxed{Recall = \frac{TP}{TP + FN}}$$
2. **Value Substitution**:
   $$Recall = \frac{55}{55 + 32}$$
3. **Perform Addition in Denominator**:
   $$Recall = \frac{55}{87}$$
4. **Decimal Division**:
   $$55 \div 87 = 0.632183... \rightarrow \mathbf{63.22\%}$$

*   **Inference**: Out of all the customers who *actually* renewed their subscription (87 customers), the model correctly identified **63.22%** of them. This leaves **36.78%** (32 customers) as False Negatives—customers who actually renewed but were falsely predicted as "No".
*   **Business Impact**: If the business relies heavily on knowing who will renew to plan capacity/revenue, a recall of 63.22% means the model fails to detect over a third of the renewing customer base.

---

#### **Metric 4: F1-Score (2 marks)**
**Definition**: The harmonic mean of Precision and Recall. It provides a single balanced metric that penalizes extreme imbalances between the two.

##### Method A: Direct Parameter Formula (Most Accurate)
1. **Formula**:
   $$\boxed{F1\text{-}Score = \frac{2 \cdot TP}{2 \cdot TP + FP + FN}}$$
2. **Value Substitution**:
   $$F1\text{-}Score = \frac{2 \cdot 55}{2 \cdot 55 + 43 + 32}$$
3. **Perform Arithmetic**:
   $$F1\text{-}Score = \frac{110}{185}$$
4. **Fractional Simplification (Divide by GCD = 5)**:
   $$F1\text{-}Score = \frac{22}{37} \approx \mathbf{59.46\%}$$

##### Method B: Precision & Recall Formula (Cross-Verification)
1. **Formula**:
   $$F1\text{-}Score = 2 \cdot \frac{Precision \cdot Recall}{Precision + Recall}$$
2. **Value Substitution** (using exact decimals $\frac{55}{98}$ and $\frac{55}{87}$):
   $$F1\text{-}Score = 2 \cdot \frac{\left(\frac{55}{98}\right) \cdot \left(\frac{55}{87}\right)}{\left(\frac{55}{98}\right) + \left(\frac{55}{87}\right)} = 2 \cdot \frac{\frac{3025}{8526}}{\frac{10175}{8526}} = \frac{22}{37} \approx \mathbf{59.46\%}$$

*   **Inference**: The F1-Score of **59.46%** is a balanced metric summarizing the trade-off. Since both precision and recall are moderately low, the F1-Score remains below 60%. This indicates a model with sub-optimal performance that needs refinement.

---

## **SUMMARY TABLE OF CLASSIFICATION METRICS**

| Metric | Formula | Value | Range | Interpretation Focus |
| :--- | :--- | :---: | :---: | :--- |
| **Accuracy** | $\frac{TP + TN}{N}$ | **61.54%** | $0$ to $1$ | Overall global prediction correctness |
| **Precision** | $\frac{TP}{TP + FP}$ | **56.12%** | $0$ to $1$ | Accuracy of positive forecasts (penalizes False Positives) |
| **Recall** | $\frac{TP}{TP + FN}$ | **63.22%** | $0$ to $1$ | Coverage of actual positive targets (penalizes False Negatives) |
| **F1-Score** | $\frac{2 \cdot TP}{2 \cdot TP + FP + FN}$ | **59.46%** | $0$ to $1$ | Harmonized quality score under asymmetric thresholds |

---

## **KEY TAKEAWAYS (Quick Review)**

**K-Fold Cross-Validation:**
1. Fits a model over $K$ distinct folds, estimating generalization score via: $\hat{\theta}_{\text{CV}} = \frac{1}{K} \sum \theta_i$.
2. Reduces Sampling Variance and Pessimistic Bias compared to a single holdout.
3. Stratified K-Fold preserves exact class support ratios.

**Performance Metrics:**
1. **FP (Type I Error) - Churn Trap**: Predicting a customer will renew when they won't, leaving them out of retention efforts (directly losing Customer Lifetime Value).
2. **FN (Type II Error) - Budget Leak**: Predicting a customer will churn when they would have renewed, resulting in wasted budget on redundant retention discounts.

---

## **ANSWER CHECKLIST**

- Define K-Fold CV theoretically
- State algorithmic steps sequentially
- Compare K-Fold reliability vs. single holdout splits
- Provide a real-world clinical dataset example
- Construct marginalized confusion matrix table
- Define TP, TN, FP, FN with actual customer business significance
- Compute Accuracy step-by-step with GCD simplification
- Compute Precision step-by-step
- Compute Recall step-by-step
- Compute F1-Score using dual verification formulas
- Detail business takeaways and strategic optimization recommendations
- Include metric summary table and mark breakdowns

---

## **MARK BREAKDOWN**

| Component | Marks |
| :--- | :---: |
| K-Fold Theoretical Framework | 1.0 |
| Detailed Algorithmic Steps | 2.0 |
| Variance/Bias Holdout Comparison | 1.0 |
| Real-World Use Case | 1.0 |
| **PART 1 SUBTOTAL** | **5.0** |
| Confusion Matrix Definition & Marginal Table | 1.0 |
| Parameter Significations (TP, TN, FP, FN) | 2.0 |
| Accuracy Calculation & Step-by-Step Simplification | 2.0 |
| Precision Calculation & Business Impact | 2.0 |
| Recall Calculation & Business Impact | 2.0 |
| F1-Score Dual-Method Verification | 2.0 |
| **PART 2 SUBTOTAL** | **11.0** |
| **TOTAL** | **16.0** |

---

**This answer scores FULL 16 marks** 
