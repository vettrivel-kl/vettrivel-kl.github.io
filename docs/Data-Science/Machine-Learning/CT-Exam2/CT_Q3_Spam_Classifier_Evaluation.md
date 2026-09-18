# Continuous Training (CT) Exam: Binary & Per-Class Classification Performance Evaluation

## Question 3

### Question Prompt

A machine learning model has been developed by an organization to classify incoming emails into two categories: Legitimate (Not Spam) and Spam. The model is evaluated using 500 test emails, and the following results are obtained:

| Actual \ Predicted | Not Spam | Spam |
| :--- | :---: | :---: |
| **Not Spam** | 350 | 20 |
| **Spam** | 30 | 100 |

The total number of observations is $N = 500$.

*   **a)** Determine the classification accuracy of the email filtering system based on the given results. **[5 Marks]**
*   **b)** Using the confusion matrix, compute the Precision, Recall, and F1-Score for **both** Not Spam and Spam classes. Show the calculations clearly. **[10 Marks]**
*   **c)** Interpret the obtained evaluation metrics and assess the effectiveness of the classifier. Identify the class for which the classifier shows relatively poorer performance and justify your answer using the calculated metrics. **[5 Marks]**

---

## Academic Definition of a Confusion Matrix

A **Confusion Matrix** is a specific $C \times C$ cross-tabulation table (where $C$ is the number of classes) used to evaluate the performance of a supervised learning classifier on a set of test data for which the true values are known. It tabulates the frequency of actual class instances (rows) against predicted class instances (columns). 

To conduct a rigorous mathematical evaluation of this system, we first compute the **marginal sums (totals)** of our given confusion matrix to verify structural consistency:

$$N = \sum_{row=1}^{C} \sum_{col=1}^{C} M_{row, col}$$

### Marginalized Confusion Matrix Table

| Actual \ Predicted | Not Spam (Legitimate) | Spam | Actual Row Totals (Class Support) |
| :--- | :---: | :---: | :---: |
| **Not Spam** | $M_{1,1} = 350$ (True Not Spam) | $M_{1,2} = 20$ (False Spam) | $350 + 20 = \mathbf{370}$ |
| **Spam** | $M_{2,1} = 30$ (False Not Spam) | $M_{2,2} = 100$ (True Spam) | $30 + 100 = \mathbf{130}$ |
| **Predicted Column Totals** | $350 + 30 = \mathbf{380}$ | $20 + 100 = \mathbf{120}$ | **Total Sample Size ($N$)** $= \mathbf{500}$ |

#### Verification of Marginal Consistency:
*   **Row-wise Sum**: $\text{Total Legitimate} + \text{Total Spam} = 370 + 130 = \mathbf{500}$
*   **Column-wise Sum**: $\text{Predicted Legitimate} + \text{Predicted Spam} = 380 + 120 = \mathbf{500}$
The matrix is structurally sound, and the total sample size matches $N = 500$.

---

### a) Overall Classification Accuracy (5 Marks)

**Formal Academic Definition**: **Accuracy** is a global metric representing the probability that the classifier makes a correct prediction over the joint probability distribution of the classes. It is mathematically defined as the ratio of correct predictions (the sum of the diagonal elements of the confusion matrix) to the total number of evaluation instances ($N$).

#### Mathematical Formula:
$$Accuracy = \frac{\sum_{i=1}^{C} M_{i,i}}{N} = \frac{TP + TN}{TP + TN + FP + FN}$$

#### Step-by-Step Mathematical Derivation:
1.  **Identify Diagonal Correct Classifications**:
    *   True Legitimate ($M_{1,1}$): $350$
    *   True Spam ($M_{2,2}$): $100$
    $$\text{Sum of Correct Predictions} = 350 + 100 = 450$$

2.  **Substitute into Global Accuracy Formula**:
    $$Accuracy = \frac{450}{500}$$

3.  **Perform Fractional Simplification**:
    To express the ratio in its irreducible form, divide both the numerator and the denominator by their Greatest Common Divisor ($\text{GCD} = 50$):
    $$Accuracy = \frac{450 \div 50}{500 \div 50} = \frac{9}{10}$$

4.  **Decimal Form**:
    $$Accuracy = 0.9000$$

5.  **Percentage Representation**:
    $$Accuracy = 0.9000 \times 100\% = \mathbf{90.00\%}$$

*   **Inference & Interpretation**: The global classification accuracy of the email filtering system is **90.00%**. This indicates that if an email is drawn at random from the test distribution, the probability that the model classifies it correctly is exactly $0.90$. While $90\%$ accuracy appears robust at first glance, global accuracy is highly susceptible to **majority class dominance bias** in imbalanced datasets. Because legitimate emails make up **74.00%** of the dataset ($\frac{370}{500}$), a naive "majority-class classifier" that marks every email as "Not Spam" would automatically achieve a baseline accuracy of $74.00\%$. Therefore, per-class metrics must be analyzed to evaluate the filter's practical effectiveness.

---

### b) Precision, Recall, and F1-Score for Both Classes (10 Marks)

To compute per-class evaluation metrics, we mathematically treat each class in turn as the "Positive Target Class" ($1$), while treating the other class as the "Negative Class" ($0$).

---

#### 1. Performance Evaluation for Class: **Spam**
Treating **Spam** as the positive class ($1$) and **Not Spam** as the negative class ($0$), we map the cells of our marginalized matrix to binary classification parameters:
*   **True Positive ($TP_{\text{Spam}}$)**: Actual Spam predicted as Spam = **100**
*   **True Negative ($TN_{\text{Spam}}$)**: Actual Not Spam predicted as Not Spam = **350**
*   **False Positive ($FP_{\text{Spam}}$)**: Actual Not Spam predicted as Spam = **20** *(Type I Error: Legitimate email incorrectly flagged as spam and filtered out of the inbox)*
*   **False Negative ($FN_{\text{Spam}}$)**: Actual Spam predicted as Not Spam = **30** *(Type II Error: Spam email incorrectly flagged as legitimate, slipping into the inbox)*

##### Metric 1.1: Precision (Spam)
*   **Academic Definition**: Precision measures the fidelity of positive predictions. It is the conditional probability that an instance is actually positive given that the model predicted it as positive: $P(\text{Actual} = \text{Spam} \mid \text{Predicted} = \text{Spam})$.
*   **Formula**:
    $$Precision_{\text{Spam}} = \frac{TP_{\text{Spam}}}{TP_{\text{Spam}} + FP_{\text{Spam}}}$$
*   **Substitution & Step-by-Step Arithmetic**:
    $$Precision_{\text{Spam}} = \frac{100}{100 + 20}$$
    $$Precision_{\text{Spam}} = \frac{100}{120}$$
    Divide the numerator and denominator by their GCD of $20$:
    $$Precision_{\text{Spam}} = \frac{100 \div 20}{120 \div 20} = \frac{5}{6}$$
    Perform long division ($5 \div 6$):
    $$Precision_{\text{Spam}} = 0.83333333... \rightarrow \mathbf{83.33\%}$$

##### Metric 1.2: Recall (Spam) / Sensitivity
*   **Academic Definition**: Recall measures the coverage of the target class. It is the conditional probability that an instance is predicted positive given that it is actually positive: $P(\text{Predicted} = \text{Spam} \mid \text{Actual} = \text{Spam})$.
*   **Formula**:
    $$Recall_{\text{Spam}} = \frac{TP_{\text{Spam}}}{TP_{\text{Spam}} + FN_{\text{Spam}}}$$
*   **Substitution & Step-by-Step Arithmetic**:
    $$Recall_{\text{Spam}} = \frac{100}{100 + 30}$$
    $$Recall_{\text{Spam}} = \frac{100}{130}$$
    Divide by their GCD of $10$:
    $$Recall_{\text{Spam}} = \frac{100 \div 10}{130 \div 10} = \frac{10}{13}$$
    Perform long division ($10 \div 13$):
    $$Recall_{\text{Spam}} = 0.76923076... \rightarrow \mathbf{76.92\%}$$

##### Metric 1.3: F1-Score (Spam)
*   **Academic Definition**: The **F1-Score** is the **harmonic mean** of Precision and Recall. In machine learning, we use the harmonic mean instead of the arithmetic mean because the harmonic mean is highly sensitive to extreme imbalances. If either precision or recall drops to 0, the harmonic mean drops to 0, whereas the arithmetic mean would remain at 50%.
*   **Method A (Direct Structural Formula)**:
    $$F1_{\text{Spam}} = \frac{2 \cdot TP_{\text{Spam}}}{2 \cdot TP_{\text{Spam}} + FP_{\text{Spam}} + FN_{\text{Spam}}}$$
    $$F1_{\text{Spam}} = \frac{2 \cdot 100}{2 \cdot 100 + 20 + 30}$$
    $$F1_{\text{Spam}} = \frac{200}{200 + 50} = \frac{200}{250}$$
    Divide numerator and denominator by their GCD of $50$:
    $$F1_{\text{Spam}} = \frac{200 \div 50}{250 \div 50} = \frac{4}{5} = 0.8000 \rightarrow \mathbf{80.00\%}$$

*   **Method B (Harmonic Substitution Verification)**:
    $$F1_{\text{Spam}} = 2 \cdot \frac{Precision_{\text{Spam}} \cdot Recall_{\text{Spam}}}{Precision_{\text{Spam}} + Recall_{\text{Spam}}} = 2 \cdot \frac{\left(\frac{5}{6}\right) \cdot \left(\frac{10}{13}\right)}{\left(\frac{5}{6}\right) + \left(\frac{10}{13}\right)}$$
    $$F1_{\text{Spam}} = 2 \cdot \frac{\frac{50}{78}}{\frac{5 \cdot 13 + 10 \cdot 6}{78}} = 2 \cdot \frac{\frac{50}{78}}{\frac{65 + 60}{78}} = 2 \cdot \frac{50}{125} = 2 \cdot \frac{2}{5} = \frac{4}{5} = \mathbf{80.00\%}$$
    Both independent mathematical derivations yield the exact same score, verifying calculations.

---

#### 2. Performance Evaluation for Class: **Not Spam (Legitimate)**
Treating **Not Spam** as the positive class ($1$) and **Spam** as the negative class ($0$), we map our binary parameters accordingly:
*   **True Positive ($TP_{\text{Not Spam}}$)**: Actual Not Spam predicted as Not Spam = **350**
*   **True Negative ($TN_{\text{Not Spam}}$)**: Actual Spam predicted as Spam = **100**
*   **False Positive ($FP_{\text{Not Spam}}$)**: Actual Spam predicted as Not Spam = **30** *(Type I Error relative to Legitimate classification)*
*   **False Negative ($FN_{\text{Not Spam}}$)**: Actual Not Spam predicted as Spam = **20** *(Type II Error relative to Legitimate classification)*

##### Metric 2.1: Precision (Not Spam)
*   **Academic Definition**: The probability that a predicted legitimate email is actually legitimate: $P(\text{Actual} = \text{Not Spam} \mid \text{Predicted} = \text{Not Spam})$.
*   **Formula**:
    $$Precision_{\text{Not Spam}} = \frac{TP_{\text{Not Spam}}}{TP_{\text{Not Spam}} + FP_{\text{Not Spam}}}$$
*   **Substitution & Step-by-Step Arithmetic**:
    $$Precision_{\text{Not Spam}} = \frac{350}{350 + 30}$$
    $$Precision_{\text{Not Spam}} = \frac{350}{380}$$
    Divide by their GCD of $10$:
    $$Precision_{\text{Not Spam}} = \frac{350 \div 10}{380 \div 10} = \frac{35}{38}$$
    Perform long division ($35 \div 38$):
    $$Precision_{\text{Not Spam}} = 0.92105263... \rightarrow \mathbf{92.11\%}$$

##### Metric 2.2: Recall (Not Spam)
*   **Academic Definition**: The probability that an actual legitimate email is successfully identified by the system: $P(\text{Predicted} = \text{Not Spam} \mid \text{Actual} = \text{Not Spam})$.
*   **Formula**:
    $$Recall_{\text{Not Spam}} = \frac{TP_{\text{Not Spam}}}{TP_{\text{Not Spam}} + FN_{\text{Not Spam}}}$$
*   **Substitution & Step-by-Step Arithmetic**:
    $$Recall_{\text{Not Spam}} = \frac{350}{350 + 20}$$
    $$Recall_{\text{Not Spam}} = \frac{350}{370}$$
    Divide by their GCD of $10$:
    $$Recall_{\text{Not Spam}} = \frac{350 \div 10}{370 \div 10} = \frac{35}{37}$$
    Perform long division ($35 \div 37$):
    $$Recall_{\text{Not Spam}} = 0.94594594... \rightarrow \mathbf{94.59\%}$$

##### Metric 2.3: F1-Score (Not Spam)
*   **Method A (Direct Structural Formula)**:
    $$F1_{\text{Not Spam}} = \frac{2 \cdot TP_{\text{Not Spam}}}{2 \cdot TP_{\text{Not Spam}} + FP_{\text{Not Spam}} + FN_{\text{Not Spam}}}$$
    $$F1_{\text{Not Spam}} = \frac{2 \cdot 350}{2 \cdot 350 + 30 + 20} = \frac{700}{700 + 50} = \frac{700}{750}$$
    Divide numerator and denominator by their GCD of $50$:
    $$F1_{\text{Not Spam}} = \frac{700 \div 50}{750 \div 50} = \frac{14}{15}$$
    Perform long division ($14 \div 15$):
    $$F1_{\text{Not Spam}} = 0.93333333... \rightarrow \mathbf{93.33\%}$$

*   **Method B (Harmonic Substitution Verification)**:
    $$F1_{\text{Not Spam}} = 2 \cdot \frac{Precision_{\text{Not Spam}} \cdot Recall_{\text{Not Spam}}}{Precision_{\text{Not Spam}} + Recall_{\text{Not Spam}}} = 2 \cdot \frac{\left(\frac{35}{38}\right) \cdot \left(\frac{35}{37}\right)}{\left(\frac{35}{38}\right) + \left(\frac{35}{37}\right)}$$
    $$F1_{\text{Not Spam}} = 2 \cdot \frac{\frac{1225}{1406}}{\frac{35 \cdot 37 + 35 \cdot 38}{1406}} = 2 \cdot \frac{\frac{1225}{1406}}{\frac{1295 + 1330}{1406}} = 2 \cdot \frac{1225}{2625}$$
    Divide numerator and denominator by their GCD of $175$:
    $$F1_{\text{Not Spam}} = 2 \cdot \frac{1225 \div 175}{2625 \div 175} = 2 \cdot \frac{7}{15} = \frac{14}{15} \approx \mathbf{93.33\%}$$
    Both independent mathematical derivations yield the exact same score, verifying calculations.

---

### c) Interpretation, Assessment, and Justification (5 Marks)

#### 1. Metric Interpretation Summary Table

| Class Target | Support (Actual) | Precision | Recall | F1-Score | Overall Assessment |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **Not Spam (Legitimate)** | 370 (74.00%) | 92.11% | 94.59% | 93.33% | **Excellent / Highly Robust** |
| **Spam** | 130 (26.00%) | 83.33% | 76.92% | 80.00% | **Sub-optimal / Poor Performance** |

---

#### 2. Class-wise Performance Assessment
The classification model exhibits **relatively poorer performance on the Spam class** compared to the **Not Spam (Legitimate)** class across all three metric areas.

#### 3. Mathematical & Structural Justification:
*   **F1-Score Gap**: The F1-Score of the **Spam** class is **80.00%**, which is **13.33 percentage points lower** than the F1-Score of the **Not Spam** class (**93.33%**). F1-score represents the overall quality of class predictions, showing that the model is significantly weaker at classifying spam.
*   **Recall as the Primary Weakness**: The **Recall for Spam (76.92%)** is the lowest metric in the system. Out of 130 actual Spam emails, the model successfully caught only 100 ($TP = 100$), failing to identify 30 spam messages ($FN = 30$). This means **23.08%** (almost a quarter) of spam emails slip past the filter directly into users' primary inboxes.
*   **Precision Deficit**: The **Precision for Spam is 83.33%**, indicating that out of 120 emails predicted to be spam, 20 were actually Legitimate ($FP = 20$). This corresponds to an error rate of **16.67%** where important legitimate correspondence is routed to the spam folder.

---

#### 4. Scientific Explanation of the Poorer Class Performance
The disparity in class performance is driven by **Class Imbalance** in the training/test distributions:
1.  **Imbalance Ratio**: Legitimate emails represent **74.00%** of the dataset (370 out of 500), while Spam emails represent only **26.00%** (130 out of 500).
2.  **Loss Function Bias**: Standard machine learning models minimize global empirical risk (total error). In an imbalanced setup, the model can maximize overall accuracy (achieving 90%) by aligning its decision boundary to fit the majority class extremely well, even if it performs poorly on the minority class. 
3.  **Consequently**: The model achieves high metrics on the majority class (**Not Spam**: 92.11% Precision, 94.59% Recall) but performs poorly on the minority class (**Spam**: 83.33% Precision, 76.92% Recall).

---

#### 5. Domain-Specific Operational Analysis & Recommendations
In industrial email classification, there is a fundamental trade-off between Type I and Type II errors:
*   **Type I Error (False Spam Flag - FP)**: A legitimate email is filtered as spam. The cost is **extremely high** because users may miss critical business emails (e.g., job offers, bank notifications, security alerts).
*   **Type II Error (Missed Spam - FN)**: A spam email slips into the inbox. The cost is **low**—it is simply a minor user inconvenience.
*   **Model Assessment**: By achieving a Legitimate Recall of **94.59%**, the model ensures that only 5.41% ($20$ out of 370) of legitimate emails are lost to the spam folder. While this shows a design that prioritizes email safety, the Spam Precision of 83.33% means that 1 in 6 emails in the spam folder is actually legitimate, which is still too high for reliable business deployment.

#### Technical Recommendations for Full Optimization:
To optimize this classifier for real-world enterprise deployment:
1.  **Apply Cost-Sensitive Learning**: Modify the model's loss function to penalize False Positives (legitimate emails marked as spam) much more heavily than False Negatives.
2.  **Adjust the Decision Threshold (Threshold Moving)**: Currently, the decision threshold is likely set at the standard $\tau = 0.5$. By plotting a **Receiver Operating Characteristic (ROC)** or **Precision-Recall Curve**, the threshold can be adjusted (e.g., $\tau = 0.7$) to raise the precision of spam flagging, protecting legitimate emails even if it slightly decreases spam recall.
3.  **Use SMOTE (Synthetic Minority Over-sampling Technique)**: Over-sample the minority class (Spam) synthetically during model training to eliminate the majority class bias, prompting the model to learn more distinct boundaries for spam patterns.
