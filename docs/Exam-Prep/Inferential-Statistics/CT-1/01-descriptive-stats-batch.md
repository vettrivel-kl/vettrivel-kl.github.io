---
sidebar_position: 1
title: Descriptive Statistics & Correlation
description: Complete step-by-step solutions for CT1 Descriptive Statistics questions
tags: [descriptive-statistics, correlation, covariance, ct-exam]
---
# CT1 Sample Questions — Batch 1: Descriptive Statistics & Correlation

This document provides rigorous, textbook-style solutions for the descriptive statistics and correlation questions (Q1, Q2, Q3, and Q14) from the **IFS UNIT - 1 & 2** sample questions sheet. All formulas are rendered in LaTeX, with step-by-step mathematical derivations and formal academic inferences.

---

## Question 1: Comprehensive Descriptive Statistics, Covariance & Correlation

### Given Data
Let $X$ denote **Sales** and $Y$ denote **Expenditure**.
$$X = \{15, 18, 25, 27, 30, 35\}, \quad n = 6$$
$$Y = \{50, 65, 82, 95, 110, 120\}, \quad n = 6$$

---

### Step-by-Step Preliminary Calculations

First, we construct the summation and deviation tables for both variables to compute all subsequent metrics.

#### Table 1: Sales ($X$) Deviations and Moments ($\bar{X} = 25$)
| $i$ | $x_i$ | $(x_i - \bar{X})$ | $(x_i - \bar{X})^2$ | $(x_i - \bar{X})^3$ | $(x_i - \bar{X})^4$ |
| :-: | :---: | :---------------: | :-----------------: | :-----------------: | :-----------------: |
| 1   | 15    | $-10$             | $100$               | $-1000$             | $10000$             |
| 2   | 18    | $-7$              | $49$                | $-343$              | $2401$              |
| 3   | 25    | $0$               | $0$                 | $0$                 | $0$                 |
| 4   | 27    | $2$               | $4$                 | $8$                 | $16$                |
| 5   | 30    | $5$               | $25$                | $125$               | $625$               |
| 6   | 35    | $10$              | $100$               | $1000$              | $10000$             |
| **$\sum$**| **$150$**| **$0$**          | **$278$**           | **$-210$**          | **$23042$**         |

#### Table 2: Expenditure ($Y$) Deviations and Moments ($\bar{Y} = 87$)
| $i$ | $y_i$ | $(y_i - \bar{Y})$ | $(y_i - \bar{Y})^2$ | $(y_i - \bar{Y})^3$ | $(y_i - \bar{Y})^4$ |
| :-: | :---: | :---------------: | :-----------------: | :-----------------: | :-----------------: |
| 1   | 50    | $-37$             | $1369$              | $-50653$            | $1874161$           |
| 2   | 65    | $-22$             | $484$               | $-10648$            | $234256$            |
| 3   | 82    | $-5$              | $25$                | $-125$              | $625$               |
| 4   | 95    | $8$               | $64$                | $512$               | $4096$              |
| 5   | 110   | $23$              | $529$               | $12167$             | $279841$            |
| 6   | 120   | $33$              | $1089$              | $35937$             | $1185921$           |
| **$\sum$**| **$522$**| **$0$**          | **$3560$**          | **$-12810$**        | **$3578900$**       |

#### Table 3: Cross-Product of Deviations
| $i$ | $(x_i - \bar{X})$ | $(y_i - \bar{Y})$ | $(x_i - \bar{X})(y_i - \bar{Y})$ |
| :-: | :---------------: | :---------------: | :------------------------------: |
| 1   | $-10$             | $-37$             | $370$                            |
| 2   | $-7$              | $-22$             | $154$                            |
| 3   | $0$               | $-5$              | $0$                              |
| 4   | $2$               | $8$               | $16$                             |
| 5   | $5$               | $23$              | $115$                            |
| 6   | $10$              | $33$              | $330$                            |
| **$\sum$**| **$0$**     | **$0$**           | **$985$**                        |

---

### Part A: Central Tendency

#### 1. Arithmetic Mean ($\bar{X}, \bar{Y}$)
**Definition:** The sum of all observations divided by the total number of observations.
$$\bar{X} = \frac{1}{n} \sum_{i=1}^n x_i = \frac{150}{6} = 25$$
$$\bar{Y} = \frac{1}{n} \sum_{i=1}^n y_i = \frac{522}{6} = 87$$

#### 2. Median ($M$)
**Definition:** The value splitting the sorted dataset into two equal halves. Let the ordered (sorted) observations be $x_{(1)}, x_{(2)}, \dots, x_{(n)}$ in ascending order.
- **If $n$ is odd:** The median is the single middle value located at the $\frac{n+1}{2}$-th position:
  $$M = x_{\left(\frac{n+1}{2}\right)}$$
- **If $n$ is even:** The median is the arithmetic mean of the two middle values located at the $\frac{n}{2}$-th and $\left(\frac{n}{2}+1\right)$-th positions:
  $$M = \frac{x_{\left(\frac{n}{2}\right)} + x_{\left(\frac{n}{2}+1\right)}}{2}$$

Since $n = 6$ is even in our datasets:
- **For $X$:** Sorted $X = \{15, 18, 25, 27, 30, 35\}$
  $$M_X = \frac{x_{(3)} + x_{(4)}}{2} = \frac{25 + 27}{2} = 26$$
- **For $Y$:** Sorted $Y = \{50, 65, 82, 95, 110, 120\}$
  $$M_Y = \frac{y_{(3)} + y_{(4)}}{2} = \frac{82 + 95}{2} = 88.5$$

#### 3. Mode
**Definition:** The value that occurs with the highest frequency. Since all observations in $X$ and $Y$ are unique, there is no unique mode.
Using the **empirical relationship** (Karl Pearson):
$$\text{Mode} \approx 3(\text{Median}) - 2(\text{Mean})$$
- **For $X$:** $\text{Mode}_X = 3(26) - 2(25) = 78 - 50 = 28$
- **For $Y$:** $\text{Mode}_Y = 3(88.5) - 2(87) = 265.5 - 174 = 91.5$

> **Academic Inference (Central Tendency):** Both Sales ($X$) and Expenditure ($Y$) exhibit stable, well-defined central locations. The average Sales is $\bar{X} = 25$ with a median of $26$, and the average Expenditure is $\bar{Y} = 87$ with a median of $88.5$. For both variables, the mean is slightly less than the median ($\bar{X} < M_X$ and $\bar{Y} < M_Y$). Under Karl Pearson's empirical approximation, the modes are located at $28$ and $91.5$, meaning that the mean, median, and mode satisfy the relation $\text{Mean} < \text{Median} < \text{Mode}$. This consistent ordering suggests that both distributions are mildly left-skewed.

---

### Part B: Measures of Dispersion

#### 1. Range ($R$)
**Definition:** The difference between the maximum and minimum values in the dataset.
$$R_X = X_{\text{max}} - X_{\text{min}} = 35 - 15 = 20$$
$$R_Y = Y_{\text{max}} - Y_{\text{min}} = 120 - 50 = 70$$

#### 2. Quartiles and Quartile Deviation (QD)
Using the standard interpolation formula for continuous position estimation, the $p$-th percentile position is $P = \frac{k(n+1)}{4}$:
- **First Quartile ($Q_1$):** Position $= 1.75$
  - **For $X$:** $Q_{1,X} = x_{(1)} + 0.75(x_{(2)} - x_{(1)}) = 15 + 0.75(18 - 15) = 17.25$
  - **For $Y$:** $Q_{1,Y} = y_{(1)} + 0.75(y_{(2)} - y_{(1)}) = 50 + 0.75(65 - 50) = 61.25$
- **Third Quartile ($Q_3$):** Position $= 3 \times 1.75 = 5.25$
  - **For $X$:** $Q_{3,X} = x_{(5)} + 0.25(x_{(6)} - x_{(5)}) = 30 + 0.25(35 - 30) = 31.25$
  - **For $Y$:** $Q_{3,Y} = y_{(5)} + 0.25(y_{(6)} - y_{(5)}) = 110 + 0.25(120 - 110) = 112.5$

**Quartile Deviation (Semi-Interquartile Range):**
$$QD = \frac{Q_3 - Q_1}{2}$$
- **For $X$:** $QD_X = \frac{31.25 - 17.25}{2} = \frac{14}{2} = 7$
- **For $Y$:** $QD_Y = \frac{112.5 - 61.25}{2} = \frac{51.25}{2} = 25.625$

#### 3. Variance ($\sigma^2$) & Standard Deviation ($\sigma$)
We compute the population parameters ($\sigma^2, \sigma$):

- **Population Variance ($\sigma^2$):**
  $$\sigma_X^2 = \frac{\sum (x_i - \bar{X})^2}{n} = \frac{278}{6} \approx 46.3333$$
  $$\sigma_Y^2 = \frac{\sum (y_i - \bar{Y})^2}{n} = \frac{3560}{6} \approx 593.3333$$
- **Population Standard Deviation ($\sigma$):**
  $$\sigma_X = \sqrt{46.3333} \approx 6.8069$$
  $$\sigma_Y = \sqrt{593.3333} \approx 24.3584$$

> **Academic Inference (Absolute Dispersion):** The absolute spread of Expenditure ($Y$) is significantly wider than that of Sales ($X$). The range of Expenditure ($R_Y = 70$) is $3.5$ times wider than Sales ($R_X = 20$). Similarly, the Quartile Deviation ($QD_Y = 25.625$ vs. $QD_X = 7$) and standard deviation ($\sigma_Y \approx 24.36$ vs. $\sigma_X \approx 6.81$) are multiple times larger. This reflects the scale differences of the raw data values; Expenditure values are much larger and naturally vary over a wider absolute numeric range, whereas Sales values are clustered tightly around a much lower center.

---

### Part C: Relative Dispersion & Coefficients

#### 1. Coefficient of Quartile Deviation
$$\text{Coeff of QD} = \frac{Q_3 - Q_1}{Q_3 + Q_1}$$
- **For $X$:** $\text{Coeff of QD}_X = \frac{14}{48.5} \approx 0.2887$
- **For $Y$:** $\text{Coeff of QD}_Y = \frac{51.25}{173.75} \approx 0.2950$

#### 2. Coefficient of Standard Deviation
$$\text{Coeff of SD} = \frac{\sigma}{\text{Mean}}$$
- **For $X$:** $\text{Coeff of SD}_X = \frac{6.8069}{25} \approx 0.2723$
- **For $Y$:** $\text{Coeff of SD}_Y = \frac{24.3584}{87} \approx 0.2800$

#### 3. Coefficient of Variation (CV)
$$\text{CV} = \left(\frac{\sigma}{\text{Mean}}\right) \times 100\%$$
- **For $X$:** $\text{CV}_X = 27.23\%$
- **For $Y$:** $\text{CV}_Y = 28.00\%$

> **Academic Inference (Relative Dispersion):** To eliminate the scale effect and compare the dispersion of the two variables on an equal, unitless basis, we analyze the **Coefficient of Variation (CV)** and other relative coefficients.
*   **Coefficient of QD:** $\text{Coeff of QD}_X \approx 0.2887$ vs. $\text{Coeff of QD}_Y \approx 0.2950$.
*   **Coefficient of SD:** $\text{Coeff of SD}_X \approx 0.2723$ vs. $\text{Coeff of SD}_Y \approx 0.2800$.
*   **Coefficient of Variation:** $CV_X = 27.23\%$ vs. $CV_Y = 28.00\%$.

Since all relative coefficients for Expenditure ($Y$) are slightly larger than those for Sales ($X$), the relative dispersion of Expenditure is slightly higher than that of Sales. This indicates that **Sales ($X$) represents a more stable and consistent dataset** relative to its mean, while **Expenditure ($Y$) shows slightly higher relative fluctuation and lower consistency**.

---

### Part D: Measures of Distribution (Skewness & Kurtosis)

#### 1. Central Moments ($\mu_k$)
$$\mu_k = \frac{1}{n} \sum_{i=1}^n (x_i - \bar{X})^k$$
- **For $X$:**
  $$\mu_2 = \frac{278}{6} \approx 46.3333, \quad \mu_3 = \frac{-210}{6} = -35, \quad \mu_4 = \frac{23042}{6} \approx 3840.3333$$
- **For $Y$:**
  $$\mu_2 = \frac{3560}{6} \approx 593.3333, \quad \mu_3 = \frac{-12810}{6} = -2135, \quad \mu_4 = \frac{3578900}{6} \approx 596483.3333$$

#### 2. Skewness
- **Karl Pearson's Coefficient of Skewness ($S_{k,P}$):**
  $$S_{k,P} = \frac{3(\text{Mean} - \text{Median})}{\sigma}$$
  - **For $X$:** $S_{k,P}^X = \frac{3(25 - 26)}{6.8069} = \frac{-3}{6.8069} \approx -0.4407$ (Left-skewed)
  - **For $Y$:** $S_{k,P}^Y = \frac{3(87 - 88.5)}{24.3584} = \frac{-4.5}{24.3584} \approx -0.1847$ (Left-skewed)
- **Moment-based Skewness ($\gamma_1$):**
  $$\gamma_1 = \frac{\mu_3}{\mu_2^{1.5}}$$
  - **For $X$:** $\gamma_{1,X} = \frac{-35}{(46.3333)^{1.5}} = \frac{-35}{315.534} \approx -0.1109$
  - **For $Y$:** $\gamma_{1,Y} = \frac{-2135}{(593.3333)^{1.5}} = \frac{-2135}{14452.793} \approx -0.1477$

#### 3. Kurtosis
- **Moment-based Kurtosis ($\beta_2$ & Excess Kurtosis $\gamma_2$):**
  $$\beta_2 = \frac{\mu_4}{\mu_2^2}, \quad \gamma_2 = \beta_2 - 3$$
  - **For $X$:**
    $$\beta_{2,X} = \frac{3840.3333}{2146.7778} \approx 1.7889 \implies \gamma_{2,X} = 1.7889 - 3 = -1.2111 \quad (\text{Platykurtic})$$
  - **For $Y$:**
    $$\beta_{2,Y} = \frac{596483.3333}{352044.4444} \approx 1.6943 \implies \gamma_{2,Y} = 1.6943 - 3 = -1.3057 \quad (\text{Platykurtic})$$

> **Academic Inference (Distribution Shape):**
> *   **Skewness:** Both Karl Pearson's coefficient ($S_{k,P}^X \approx -0.4407, S_{k,P}^Y \approx -0.1847$) and moment-based skewness ($\gamma_{1,X} \approx -0.1109, \gamma_{1,Y} \approx -0.1477$) are strictly negative. This confirms that both datasets are **left-skewed (negatively skewed)**. The left tail is slightly elongated, showing a small density of lower-value records dragging the mean slightly below the median.
> *   **Kurtosis:** Both datasets exhibit an excess kurtosis significantly below zero ($\gamma_{2,X} \approx -1.2111, \gamma_{2,Y} \approx -1.3057$). This classifies both distributions as **Platykurtic** (thin-tailed, flatter peak than a standard normal curve), representing stable, bounded variables with very low outlier probability.

---

### Part E: Covariance and Correlation Co-efficient

#### 1. Covariance ($\text{Cov}(X,Y)$)
**Definition:** A measure of the joint variability of two random variables.
- **Population Covariance ($\sigma_{XY}$):**
  $$\sigma_{XY} = \frac{1}{n} \sum_{i=1}^n (x_i - \bar{X})(y_i - \bar{Y}) = \frac{985}{6} \approx 164.1667$$

#### 2. Pearson Correlation Coefficient ($r$)
**Definition:** The normalized measure of linear relationship strength.
$$r = \frac{\sum (x_i - \bar{X})(y_i - \bar{Y})}{\sqrt{\sum (x_i - \bar{X})^2 \sum (y_i - \bar{Y})^2}} = \frac{985}{\sqrt{278 \times 3560}} = \frac{985}{\sqrt{989680}} \approx \frac{985}{994.8266} \approx 0.9901$$

> **Exam tip:** A value of $r \approx 0.9901$ indicates an extremely strong, almost perfect positive linear correlation. When sales increase, expenditure increases in a highly predictable linear fashion.

> **Academic Inference (Bivariate Relationship):** The large positive covariance ($\sigma_{XY} \approx 164.17$) and nearly perfect Pearson's correlation coefficient ($r \approx 0.9901$) reveal an extremely strong, positive linear association between Sales ($X$) and Expenditure ($Y$). This implies that $98.03\%$ of the variation in Expenditure can be linearly explained by Sales (coefficient of determination $r^2 \approx 0.9803$). In a corporate context, this signifies that as Sales scale up, company Expenditures rise in a highly systematic, predictable, and tightly coupled linear trajectory.

---

## Question 2: Five-Point Summary and IQR

### Given Data
The dataset contains paired variables $X$ and $Y$. Since they are univariate sequences, we compute the 5-point summaries separately.
$$X = \{1, 3, 5, 7, 8, 10\}, \quad n = 6$$
$$Y = \{8, 12, 15, 17, 18, 20\}, \quad n = 6$$

---

### Step-by-Step Calculation

#### 1. Five-Point Summary for $X$
- **Minimum:** $1$
- **$Q_1$ (First Quartile):** Position $= \frac{1(n+1)}{4} = 1.75$th item
  $$Q_1 = 1 + 0.75 \times (3 - 1) = 2.5$$
- **Median ($Q_2$):** Position $= \frac{2(n+1)}{4} = 3.5$th item
  $$\text{Median} = \frac{5 + 7}{2} = 6.0$$
- **$Q_3$ (Third Quartile):** Position $= \frac{3(n+1)}{4} = 5.25$th item
  $$Q_3 = 8 + 0.25 \times (10 - 8) = 8.5$$
- **Maximum:** $10$

**Five-Point Summary vector for $X$:**
$$\begin{bmatrix} \text{Min} & Q_1 & \text{Median} & Q_3 & \text{Max} \end{bmatrix} = \begin{bmatrix} 1.0 & 2.5 & 6.0 & 8.5 & 10.0 \end{bmatrix}$$

**Interquartile Range (IQR):**
$$IQR_X = Q_3 - Q_1 = 8.5 - 2.5 = 6.0$$

**Quartile Range:**
The interval span is $[Q_1, Q_3] = [2.5, 8.5]$.

---

#### 2. Five-Point Summary for $Y$
- **Minimum:** $8$
- **$Q_1$ (First Quartile):** Position $= 1.75$th item
  $$Q_1 = 8 + 0.75 \times (12 - 8) = 11.0$$
- **Median ($Q_2$):** Position $= 3.5$th item
  $$\text{Median} = \frac{15 + 17}{2} = 16.0$$
- **$Q_3$ (Third Quartile):** Position $= 5.25$th item
  $$Q_3 = 18 + 0.25 \times (20 - 18) = 18.5$$
- **Maximum:** $20$

**Five-Point Summary vector for $Y$:**
$$\begin{bmatrix} \text{Min} & Q_1 & \text{Median} & Q_3 & \text{Max} \end{bmatrix} = \begin{bmatrix} 8.0 & 11.0 & 16.0 & 18.5 & 20.0 \end{bmatrix}$$

**Interquartile Range (IQR):**
$$IQR_Y = Q_3 - Q_1 = 18.5 - 11.0 = 7.5$$

**Quartile Range:**
The interval span is $[Q_1, Q_3] = [11.0, 18.5]$.

> **Academic Inference (Five-Point Summary):** The five-point summary provides a complete, robust overview of the distribution boundaries and central half of the datasets. For $X$, the middle $50\%$ of the data lies in a narrow span between $2.5$ and $8.5$ ($IQR_X = 6.0$). For $Y$, the central $50\%$ of the observations span a slightly wider range from $11.0$ to $18.5$ ($IQR_Y = 7.5$). This demonstrates that the core density of the Expenditure ($Y$) dataset is slightly more spread out in absolute terms than the core density of the Sales ($X$) dataset.

---

## Question 3: Spearman's Rank Correlation for Three Judges

### Given Data
Three judges rank 10 competitors ($N = 10$).
- **$R_A$:** $\{6, 5, 3, 10, 2, 4, 9, 7, 8, 1\}$
- **$R_B$:** $\{5, 8, 4, 7, 10, 2, 1, 6, 9, 3\}$
- **$R_C$:** $\{4, 9, 8, 1, 2, 3, 10, 5, 7, 6\}$

Spearman's rank correlation coefficient is given by:
$$\rho = 1 - \frac{6 \sum_{i=1}^N d_i^2}{N(N^2 - 1)}$$

---

### Step-by-Step Derivation

Let us construct the table of difference-squared ($d_i^2$) for all pairs:

| Competitor $i$ | $R_A$ | $R_B$ | $R_C$ | $d^2_{AB} = (R_A - R_B)^2$ | $d^2_{BC} = (R_B - R_C)^2$ | $d^2_{AC} = (R_A - R_C)^2$ |
| :------------: | :---: | :---: | :---: | :-----------------------: | :-----------------------: | :-----------------------: |
| 1              | $6$   | $5$   | $4$   | $1$                       | $1$                       | $4$                       |
| 2              | $5$   | $8$   | $9$   | $9$                       | $1$                       | $16$                      |
| 3              | $3$   | $4$   | $8$   | $1$                       | $16$                      | $25$                      |
| 4              | $10$  | $7$   | $1$   | $9$                       | $36$                      | $81$                      |
| 5              | $2$   | $10$  | $2$   | $64$                      | $64$                      | $0$                       |
| 6              | $4$   | $2$   | $3$   | $4$                       | $1$                       | $1$                       |
| 7              | $9$   | $1$   | $10$  | $64$                      | $81$                      | $1$                       |
| 8              | $7$   | $6$   | $5$   | $1$                       | $1$                       | $4$                       |
| 9              | $8$   | $9$   | $7$   | $1$                       | $4$                       | $1$                       |
| 10             | $1$   | $3$   | $6$   | $4$                       | $9$                       | $25$                      |
| **$\sum$**     | | | | **$158$**                 | **$214$**                 | **$158$**                 |

---

### Calculating Coefficients

#### 1. Judges A and B ($\rho_{AB}$)
$$\rho_{AB} = 1 - \frac{6 \times 158}{10(10^2 - 1)} = 1 - \frac{948}{990} = 1 - 0.9576 = 0.0424$$

#### 2. Judges B and C ($\rho_{BC}$)
$$\rho_{BC} = 1 - \frac{6 \times 214}{10(10^2 - 1)} = 1 - \frac{1284}{990} = 1 - 1.2970 = -0.2970$$

#### 3. Judges A and C ($\rho_{AC}$)
$$\rho_{AC} = 1 - \frac{6 \times 158}{10(10^2 - 1)} = 1 - \frac{948}{990} = 1 - 0.9576 = 0.0424$$

---

### Academic Inference
- **Judges A and B / Judges A and C:** Show a very weak, positive rank correlation ($\rho \approx 0.0424$). This suggests practically independent ranking scales with virtually no common pattern.
- **Judges B and C:** Show a moderate negative rank correlation ($\rho \approx -0.2970$). This reveals a systematic divergence in their musical preferences.
- **Conclusion:** **Judges A and B (as well as A and C) have more or less the same taste in music** because their coefficient is positive (albeit very low), whereas Judges B and C have opposing rankings as indicated by their negative coefficient.

---

## Question 14: Stronger Relationship: Calorie Intake vs Exercise Hours

### Given Data
A nutritionist collects data for 4 individuals ($n = 4$):
- **Calorie Intake ($X_1$)**: $\{2500, 2200, 2000, 1800\}$
- **Exercise Hours ($X_2$)**: $\{2, 4, 6, 8\}$
- **Weight Loss Progress ($Y$)**: $\{1, 2, 4, 6\}$

We determine the strength of relationships by computing Pearson's correlation coefficient ($r$) for both independent variables.

---

### Step-by-Step Derivation

First, calculate the means:
$$\bar{X}_1 = \frac{2500+2200+2000+1800}{4} = 2125$$
$$\bar{X}_2 = \frac{2+4+6+8}{4} = 5$$
$$\bar{Y} = \frac{1+2+4+6}{4} = 3.25$$

#### Table 4: Deviation Products for Calorie Intake ($X_1$) vs Weight Loss ($Y$)
| $i$ | $(x_{1,i} - \bar{X}_1)$ | $(y_i - \bar{Y})$ | $(x_{1,i} - \bar{X}_1)^2$ | $(y_i - \bar{Y})^2$ | $(x_{1,i} - \bar{X}_1)(y_i - \bar{Y})$ |
| :-: | :---------------------: | :---------------: | :-----------------------: | :-----------------: | :------------------------------------: |
| 1   | $375$                   | $-2.25$           | $140625$                  | $5.0625$            | $-843.75$                              |
| 2   | $75$                    | $-1.25$           | $5625$                    | $1.5625$            | $-93.75$                               |
| 3   | $-125$                  | $0.75$            | $15625$                   | $0.5625$            | $-93.75$                               |
| 4   | $-325$                  | $2.75$            | $105625$                  | $7.5625$            | $-893.75$                              |
|**$\sum$**| **$0$**            | **$0$**           | **$267500$**              | **$14.75$**         | **$-1925.0$**                          |

#### Table 5: Deviation Products for Exercise Hours ($X_2$) vs Weight Loss ($Y$)
| $i$ | $(x_{2,i} - \bar{X}_2)$ | $(y_i - \bar{Y})$ | $(x_{2,i} - \bar{X}_2)^2$ | $(y_i - \bar{Y})^2$ | $(x_{2,i} - \bar{X}_2)(y_i - \bar{Y})$ |
| :-: | :---------------------: | :---------------: | :-----------------------: | :-----------------: | :------------------------------------: |
| 1   | $-3$                    | $-2.25$           | $9$                       | $5.0625$            | $6.75$                                 |
| 2   | $-1$                    | $-1.25$           | $1$                       | $1.5625$            | $1.25$                                 |
| 3   | $1$                     | $0.75$            | $1$                       | $0.5625$            | $0.75$                                 |
| 4   | $3$                     | $2.75$            | $9$                       | $7.5625$            | $8.25$                                 |
|**$\sum$**| **$0$**            | **$0$**           | **$20$**                  | **$14.75$**         | **$17.0$**                             |

---

### Computing Pearson's Correlation Coefficient

#### 1. Calorie Intake vs Weight Loss ($r_{X_1, Y}$)
$$r_{X_1, Y} = \frac{\sum (x_{1,i} - \bar{X}_1)(y_i - \bar{Y})}{\sqrt{\sum (x_{1,i} - \bar{X}_1)^2 \sum (y_i - \bar{Y})^2}} = \frac{-1925}{\sqrt{267500 \times 14.75}} = \frac{-1925}{\sqrt{3945625}} = \frac{-1925}{1986.3144} \approx -0.9691$$

#### 2. Exercise Hours vs Weight Loss ($r_{X_2, Y}$)
$$r_{X_2, Y} = \frac{\sum (x_{2,i} - \bar{X}_2)(y_i - \bar{Y})}{\sqrt{\sum (x_{2,i} - \bar{X}_2)^2 \sum (y_i - \bar{Y})^2}} = \frac{17.0}{\sqrt{20 \times 14.75}} = \frac{17.0}{\sqrt{295}} = \frac{17.0}{17.1756} \approx 0.9898$$

---

### Academic Inference
- **Calorie Intake ($X_1$) vs Weight Loss ($Y$):** Shows an exceptionally strong, negative linear correlation ($r \approx -0.9691$). This indicates that as calorie intake decreases, weight loss progress increases, which aligns perfectly with standard thermodynamic models of energy balance.
- **Exercise Hours ($X_2$) vs Weight Loss ($Y$):** Shows an exceptionally strong, positive linear correlation ($r \approx 0.9898$). This indicates that as exercise hours increase, weight loss progress increases.
- **Strength Comparison:** Comparing the magnitudes of the correlations:
  $$\left|r_{X_2, Y}\right| = 0.9898 > \left|r_{X_1, Y}\right| = 0.9691$$
- **Conclusion:** **Exercise Hours ($X_2$) has a stronger relationship with Weight Loss Progress** than Calorie Intake ($X_1$) for this cohort, although both are highly predictive factors.

---

## Quick-Facts & Formula Sheet (Descriptive Statistics & Correlation - Population Model)

| Metric / Parameter | Mathematical Formula |
| :--- | :--- |
| **Arithmetic Mean** | $$\mu = \frac{1}{N} \sum_{i=1}^N x_i$$ |
| **Median ($N$ is odd)** | $$M = x_{\left(\frac{N+1}{2}\right)}$$ |
| **Median ($N$ is even)** | $$M = \frac{x_{\left(\frac{N}{2}\right)} + x_{\left(\frac{N}{2}+1\right)}}{2}$$ |
| **Quartile Position** | $$P(Q_k) = \frac{k(N+1)}{4}$$ |
| **Quartile Deviation (QD)**| $$QD = \frac{Q_3 - Q_1}{2}$$ |
| **Coeff of QD** | $$\text{Coeff of QD} = \frac{Q_3 - Q_1}{Q_3 + Q_1}$$ |
| **Variance** | $$\sigma^2 = \frac{1}{N} \sum_{i=1}^N (x_i - \mu)^2$$ |
| **Standard Deviation** | $$\sigma = \sqrt{\sigma^2}$$ |
| **Coeff of SD** | $$\text{Coeff of SD} = \frac{\sigma}{\mu}$$ |
| **Coeff of Variation (CV)** | $$CV = \left( \frac{\sigma}{\mu} \right) \times 100\%$$ |
| **Pearson's Skewness ($S_{k,P}$)**| $$S_{k,P} = \frac{3(\mu - M_d)}{\sigma}$$ |
| **Moment-Based Skewness** | $$\mu_k = \frac{1}{N}\sum(x_i-\mu)^k \implies \gamma_1 = \frac{\mu_3}{\mu_2^{1.5}}$$ |
| **Pearson's Kurtosis ($\beta_2$)** | $$\beta_2 = \frac{\mu_4}{\mu_2^2}$$ |
| **Excess Kurtosis ($\gamma_2$)** | $$\gamma_2 = \beta_2 - 3$$ |
| **Covariance** | $$\sigma_{XY} = \frac{1}{N}\sum(x_i - \mu_X)(y_i - \mu_Y)$$ |
| **Pearson Correlation ($r$)** | $$r = \frac{\sigma_{XY}}{\sigma_X \sigma_Y} = \frac{\sum(x_i-\mu_X)(y_i-\mu_Y)}{\sqrt{\sum(x_i-\mu_X)^2 \sum(y_i-\mu_Y)^2}}$$ |
| **Spearman's Rank Correlation** | $$\rho = 1 - \frac{6 \sum d_i^2}{N(N^2 - 1)}$$ |