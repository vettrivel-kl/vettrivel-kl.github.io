---
sidebar_position: 3
title: CT Exam Questions & Marking Key
description: Comprehensive SRM CT-format examination questions for Module 4, complete with detailed model answers and marking breakdowns.
tags: [research-methodology, exam-prep, anova, rsm, taguchi, metaheuristics]
toc_max_heading_level: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# SRM CT Examination: Module 4

**Test Module:** Module 4 (Design of Experiments & Optimization)  
**Max. Marks:** 40 (Answer any two questions. Each question carries 20 marks, divided into four 5-mark subparts.)

---

## Question 1: Standard Experimental Designs & ANOVA (20 Marks)

*   **A.** Differentiate between the physical assumptions of a Completely Randomized Design (CRD) and a Randomized Block Design (RBD). Formulate the linear statistical models ($y_{ij}$) for both designs. **(5 Marks)**
*   **B.** Derive the degrees of freedom ($\text{df}$) and construct the standard Analysis of Variance (ANOVA) table layout for a CRD comprising $t$ treatments and $r$ replications. Include the formulas for Mean Squares ($\text{MS}$) and the $F$-ratio. **(5 Marks)**
*   **C.** An engineer tests 3 fertilizer compounds across 4 homogeneous plots ($t=3, r=4, N=12$). Given the Total Sum of Squares ($\text{SST} = 110.92$) and Treatment Sum of Squares ($\text{SSTreat} = 92.17$), mathematically calculate the Error Sum of Squares ($\text{SSE}$), the Mean Squares, and the calculated $F_{\text{cal}}$ value. **(5 Marks)**
*   **D.** Explain the architectural constraints of a Latin Square Design (LSD). Why are the error degrees of freedom mathematically defined as $(p-1)(p-2)$? Based on this derivation, explain the statistical limitation of conducting a $2 \times 2$ Latin Square. **(5 Marks)**

<details>
  <summary><b>View Model Answer & Marking Scheme</b></summary>
  <div className="answer-content">
    <br/>
    
    ### Part A (5 Marks)
    *   **CRD Assumption (1.5 Marks):** Assumes all experimental units are completely homogeneous. No localized gradients exist.
    *   **CRD Model (1 Mark):** $y_{ij} = \mu + \tau_i + \epsilon_{ij}$
    *   **RBD Assumption (1.5 Marks):** Assumes units contain a known, one-directional nuisance gradient. Units are grouped into homogeneous blocks to control for this variance.
    *   **RBD Model (1 Mark):** $y_{ij} = \mu + \tau_i + \beta_j + \epsilon_{ij}$

    ### Part B (5 Marks)
    *   **Degrees of Freedom (2 Marks):** $\text{df}_{\text{Treat}} = t - 1$, $\text{df}_{\text{Error}} = N - t = t(r - 1)$, $\text{df}_{\text{Total}} = N - 1$.
    *   **ANOVA Table Structure (3 Marks):**
        *   $\text{MS}_{\text{Treat}} = \text{SSTreat} / (t - 1)$
        *   $\text{MS}_{\text{Error}} = \text{SSE} / (N - t)$
        *   $F_{\text{cal}} = \text{MS}_{\text{Treat}} / \text{MS}_{\text{Error}}$

    ### Part C (5 Marks)
    *   **Calculate SSE (1 Mark):** $\text{SSE} = \text{SST} - \text{SSTreat} = 110.92 - 92.17 = 18.75$
    *   **Degrees of Freedom (1 Mark):** $\text{df}_{\text{Treat}} = 3 - 1 = 2$; $\text{df}_{\text{Error}} = 12 - 3 = 9$.
    *   **Mean Squares (2 Marks):** $\text{MS}_{\text{Treat}} = 92.17 / 2 = 46.085$; $\text{MS}_{\text{Error}} = 18.75 / 9 = 2.083$.
    *   **F-Ratio (1 Mark):** $F_{\text{cal}} = 46.085 / 2.083 = \mathbf{22.12}$

    ### Part D (5 Marks)
    *   **LSD Architecture (2 Marks):** Controls two independent nuisance gradients. Number of treatments must equal rows and columns ($t = \text{row} = \text{col} = p$). Forms a $p \times p$ matrix.
    *   **Error df Derivation (1 Mark):** $\text{df}_{\text{Total}} - \text{df}_{\text{Treat}} - \text{df}_{\text{Row}} - \text{df}_{\text{Col}} = (p^2 - 1) - (p - 1) - (p - 1) - (p - 1) = (p - 1)(p - 2)$.
    *   **The 2x2 Limitation (2 Marks):** If $p = 2$, $\text{df}_{\text{Error}} = (2-1)(2-2) = (1)(0) = 0$. Since $\text{MSE} = \text{SSE} / 0$, the $F$-test denominator is undefined, making statistical inference impossible.
  </div>
</details>

---

## Question 2: Fractional Factorials & Taguchi Robust Design (20 Marks)

*   **A.** Define Dr. Genichi Taguchi’s concept of Quality. Formulate the Taguchi Quality Loss Function (QLF) mathematically and contrast its behavior with traditional "goalpost" engineering tolerances. **(5 Marks)**
*   **B.** Write the exact mathematical formulations for the Taguchi Signal-to-Noise ($S/N$) ratios for **Larger-the-Better (LTB)** and **Smaller-the-Better (STB)** responses. Explain the significance of the negative logarithmic transformation ($-10 \log_{10}$). **(5 Marks)**
*   **C.** In a Taguchi $L_9$ robust parameter design, the calculated average $S/N$ ratios for the optimal factor levels are $A_3 = 35.84\,\text{dB}$, $B_2 = 35.01\,\text{dB}$, and $C_3 = 35.27\,\text{dB}$. If the overall experimental mean $\overline{S/N}$ is $34.80\,\text{dB}$, compute the predicted optimum performance ($\overline{S/N}_{\text{pred}}$) using Taguchi's additive prediction model. **(5 Marks)**
*   **D.** Contrast $2^k$ Full Factorial Designs with $2^{k-p}$ Fractional Factorial Designs using the "Sparsity of Effects" principle. Define an Orthogonal Array (OA) and explain its mathematical necessity in industrial screening. **(5 Marks)**

<details>
  <summary><b>View Model Answer & Marking Scheme</b></summary>
  <div className="answer-content">
    <br/>
    
    ### Part A (5 Marks)
    *   **Taguchi Quality Concept (1.5 Marks):** Quality is defined inversely as the "minimal loss imparted to society from the time the product is shipped."
    *   **QLF Formula (1.5 Marks):** $L(y) = k(y - m)^2$, where $k$ is the cost constant and $m$ is the target.
    *   **Contrast with Goalpost (2 Marks):** Traditional goalposts assume zero loss inside USL/LSL and 100% loss outside. Taguchi asserts loss grows quadratically as soon as the part deviates from the exact target $m$.

    ### Part B (5 Marks)
    *   **LTB Formula (1.5 Marks):** $\eta_{\text{LTB}} = -10 \log_{10} \left( \frac{1}{n} \sum \frac{1}{y_i^2} \right)$
    *   **STB Formula (1.5 Marks):** $\eta_{\text{STB}} = -10 \log_{10} \left( \frac{1}{n} \sum y_i^2 \right)$
    *   **Negative Log Significance (2 Marks):** The negative sign mathematically inverts the ratio, ensuring that the golden rule of Taguchi Analysis—**always maximize the S/N ratio**—applies universally, whether minimizing defects or maximizing yield.

    ### Part C (5 Marks)
    *   **Additive Formula (2 Marks):** $\overline{S/N}_{\text{pred}} = \overline{S/N}_{\text{overall}} + \sum (\text{Optimum Level} - \overline{S/N}_{\text{overall}})$
    *   **Factor Deviations (2 Marks):**
        *   $A_3: 35.84 - 34.80 = +1.04$
        *   $B_2: 35.01 - 34.80 = +0.21$
        *   $C_3: 35.27 - 34.80 = +0.47$
    *   **Final Prediction (1 Mark):** $34.80 + 1.04 + 0.21 + 0.47 = \mathbf{36.52\,\text{dB}}$

    ### Part D (5 Marks)
    *   **Full vs. Fractional & Sparsity (3 Marks):** Full factorials require $2^k$ runs, which explodes exponentially. The Sparsity of Effects principle states that most system variation is driven by main effects and 2-way interactions, allowing us to run a $1/2^p$ fraction ($2^{k-p}$) and safely ignore negligible 3-way+ interactions.
    *   **Orthogonal Array (2 Marks):** A balanced matrix (e.g., $L_9$) where every factor level appears an equal number of times across all columns. It is mathematically necessary to ensure factor effects are independently evaluated without confounding.
  </div>
</details>

---

## Question 3: Response Surface Methodology (RSM) (20 Marks)

*   **A.** Outline the canonical 10-step sequential framework for executing Response Surface Methodology, detailing the transition from first-order screening to second-order quadratic modeling. **(5 Marks)**
*   **B.** Formulate the complete second-order polynomial model for a 2-factor system ($X_1, X_2$). Explain the physical/geometric significance of the pure quadratic coefficients ($\beta_{11}, \beta_{22}$) versus the cross-product interaction coefficient ($\beta_{12}$). **(5 Marks)**
*   **C.** Derive the formula for the total number of experimental runs ($N$) in a Central Composite Design (CCD). If an engineer evaluates $k=3$ factors with $n_c=3$ center points, calculate the required number of runs. How is the rotatability distance ($\alpha$) mathematically derived for $k$ factors? **(5 Marks)**
*   **D.** Contrast the geometric architecture of a Box-Behnken Design (BBD) with a CCD. State the BBD run count formula ($N = 2k(k-1) + n_c$) and explain why BBD is mathematically preferred for hazardous chemical processes. **(5 Marks)**

<details>
  <summary><b>View Model Answer & Marking Scheme</b></summary>
  <div className="answer-content">
    <br/>
    
    ### Part A (5 Marks)
    *   **Methodological Flow (5 Marks for defining at least 7 key steps logically):** 1) Define objective, 2) Select response, 3) Identify coded factors, 4) Select design (CCD/BBD), 5) Conduct experiments, 6) Fit regression model (1st or 2nd order), 7) ANOVA diagnostics, 8) Study 3D surface/contours, 9) Determine optimum (stationary point), 10) Physical confirmation.

    ### Part B (5 Marks)
    *   **2nd Order Equation (2 Marks):** $Y = \beta_0 + \beta_1 X_1 + \beta_2 X_2 + \beta_{12} X_1 X_2 + \beta_{11} X_1^2 + \beta_{22} X_2^2 + \epsilon$
    *   **Pure Quadratic Significance (1.5 Marks):** $\beta_{11}, \beta_{22}$ dictate the non-linear curvature (peaks, valleys, mounds) along the principal factor axes.
    *   **Interaction Significance (1.5 Marks):** $\beta_{12}$ captures synergistic or antagonistic twisting of the surface, establishing saddle points where the optimal setting of $X_1$ depends on the level of $X_2$.

    ### Part C (5 Marks)
    *   **CCD Run Formula (1.5 Marks):** $N = (\text{Factorial } 2^k) + (\text{Axial } 2k) + (\text{Center } n_c)$
    *   **Calculation (2 Marks):** For $k=3, n_c=3 \implies N = 2^3 + 2(3) + 3 = 8 + 6 + 3 = \mathbf{17 \text{ runs}}$.
    *   **Rotatability Derivation (1.5 Marks):** $\alpha = (2^k)^{1/4}$. Ensures prediction variance depends only on radial distance from the design center.

    ### Part D (5 Marks)
    *   **BBD Architecture (1.5 Marks):** Places points exclusively at the midpoints of the edges of the factor domain and the center. Uses 3 exact levels ($-1, 0, +1$).
    *   **BBD Formula (1.5 Marks):** $N = 2k(k-1) + n_c$
    *   **Hazardous Process Justification (2 Marks):** Unlike CCD, BBD deliberately excludes all extreme boundary corner points (e.g., $+1, +1, +1$) and out-of-bounds star points ($+\alpha$), making it physically safer for volatile systems where combined factor extremes cause thermal runaway or equipment failure.
  </div>
</details>

---

## Question 4: Multi-Response Optimization & Metaheuristics (20 Marks)

*   **A.** Formulate the Derringer-Suich individual linear desirability function ($d_i$) for a **Smaller-the-Better** response constraint. If target $T = 1.0\,\mu\text{m}$, upper limit $U = 3.5\,\mu\text{m}$, and observed roughness $\hat{y} = 2.0\,\mu\text{m}$, compute the individual desirability score. **(5 Marks)**
*   **B.** Given individual desirability scores $d_1 = 0.90$ (Yield) and $d_2 = 0.85$ (Roughness), calculate the Overall Composite Desirability ($D$). State the mathematical formula and explain the operational importance of the "Zero-Product Rule". **(5 Marks)**
*   **C.** Formulate the **Metropolis Acceptance Criterion** probability equation used in Simulated Annealing (SA). If the change in system energy $\Delta E \gt 0$ (an uphill move), under what mathematical condition will the algorithm accept the inferior solution? **(5 Marks)**
*   **D.** Write the velocity vector ($\mathbf{V}_i^{t+1}$) and position ($\mathbf{X}_i^{t+1}$) update equations for Particle Swarm Optimization (PSO). Deconstruct the equation to define the mathematical roles of the Inertia ($w$), Cognitive ($c_1$), and Social ($c_2$) components. **(5 Marks)**

<details>
  <summary><b>View Model Answer & Marking Scheme</b></summary>
  <div className="answer-content">
    <br/>
    
    ### Part A (5 Marks)
    *   **STB Formula (2 Marks):** $d_i = \frac{U - \hat{y}}{U - T}$ (for $T \le \hat{y} \le U$)
    *   **Calculation (3 Marks):**
        $$d_i = \frac{3.5 - 2.0}{3.5 - 1.0} = \frac{1.5}{2.5} = \mathbf{0.60}$$

    ### Part B (5 Marks)
    *   **Composite Formula (1.5 Marks):** Geometric Mean $D = (d_1 \times d_2 \times \dots \times d_k)^{1/k}$
    *   **Calculation (1.5 Marks):** $D = (0.90 \times 0.85)^{1/2} = \sqrt{0.765} \approx \mathbf{0.875}$
    *   **Zero-Product Rule (2 Marks):** If any individual response fails specs ($d_k = 0$), the geometric mean forces overall $D = 0$. This guarantees an optimizer will not accept a system with catastrophic failure in one metric just because another metric is perfect.

    ### Part C (5 Marks)
    *   **Metropolis Formula (2.5 Marks):** $P = \exp\left(-\frac{\Delta E}{T}\right)$
    *   **Acceptance Condition (2.5 Marks):** A random number $r \sim \mathcal{U}(0, 1)$ is drawn. The algorithm accepts the inferior uphill move strictly if $r \lt P$. As Temperature $T$ drops over time, $P \to 0$, and uphill moves are systematically rejected.

    ### Part D (5 Marks)
    *   **Update Equations (2 Marks):**
        *   $\mathbf{V}_i^{t+1} = w\mathbf{V}_i^t + c_1 r_1 (\mathbf{pbest}_i - \mathbf{X}_i^t) + c_2 r_2 (\mathbf{gbest} - \mathbf{X}_i^t)$
        *   $\mathbf{X}_i^{t+1} = \mathbf{X}_i^t + \mathbf{V}_i^{t+1}$
    *   **Inertia ($w$) (1 Mark):** Preserves current flight momentum, dynamically decayed to transition from broad global exploration to focused local exploitation.
    *   **Cognitive ($c_1$) (1 Mark):** Personal memory; pulls the particle toward its own historical best coordinate ($\mathbf{pbest}$).
    *   **Social ($c_2$) (1 Mark):** Swarm consensus; pulls the particle toward the global highest fitness coordinate found by any member of the flock ($\mathbf{gbest}$).
  </div>
</details>
