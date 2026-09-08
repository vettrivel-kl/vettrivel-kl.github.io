---
sidebar_position: 0
title: Module 2 Overview
description: Quick navigation hub for Classification & Evaluation topics covering CV, Logistic Regression, Classification Metrics, Model Comparison, and Decision Boundaries
tags: [module-overview, classification, evaluation]
---

# Module 2: Classification & Evaluation

## Quick Navigation

**Module 2 covers the complete classification pipeline: how to evaluate models reliably, implement logistic regression, interpret predictions, and select the best algorithm.**

| Topic | Page | Key Concepts | Est. Study Time |
|-------|------|--------------|-----------------|
| **[Cross-Validation](./01-cross-validation.md)** | 1️⃣ | K-Fold, LOOCV, Stratified CV, Hyperparameter selection | 45 min |
| **[Logistic Regression](./02-logistic-regression.md)** | 2️⃣ | Sigmoid, Binary classification, Multi-class (OvR/OvO/Softmax), Coefficient interpretation | 60 min |
| **[Classification Advanced](./03-classification-advanced.md)** | 3️⃣ | ROC curves, AUC, Precision-Recall, Decision thresholds, Multi-class metrics | 60 min |
| **[Model Comparison](./04-model-comparison.md)** | 4️⃣ | Algorithm selection framework, Bias-variance across models, Cost-benefit analysis | 60 min |
| **[Decision Boundaries](./05-decision-boundaries.md)** | 5️⃣ | 2D boundary visualization, Overfitting vs underfitting, Model interpretability | 45 min |

---

## Learning Objectives

By the end of Module 2, you should understand:

### ✅ Evaluation & Validation
- Why single train/test splits are unreliable
- How K-fold CV provides stable error estimates
- When to use LOOCV, stratified CV, or time-series CV
- Hyperparameter selection using cross-validation

### ✅ Logistic Regression
- How logistic regression differs from linear regression
- The sigmoid function and its properties
- Binary classification and multi-class approaches
- Coefficient interpretation and odds/log-odds
- When logistic regression is the right choice

### ✅ Classification Metrics
- Confusion matrix and its components
- Precision, Recall, F1, Accuracy trade-offs
- ROC curves and AUC calculation
- Precision-Recall curves
- When each metric matters (medical vs banking vs recommenders)
- Decision threshold tuning with cost analysis

### ✅ Model Comparison
- Decision framework for algorithm selection
- Bias-variance characteristics across algorithms
- Performance vs interpretability tradeoff
- Data size impact on model choice
- Real-world constraints (speed, cost, explainability)
- Cost-benefit analysis for production models

### ✅ Decision Boundaries
- How classification models create decision boundaries
- Boundary shape for different algorithms
- Overfitting through boundary perspective
- Underfitting through boundary perspective

---

## Study Roadmap

### 🎯 For Quick Review (30 minutes)
1. Read this overview
2. Skim the key takeaways section of each page
3. Review exam question titles (not full solutions)

### 📚 For Thorough Preparation (4-5 hours)
1. **Cross-Validation (45 min):**
   - Understand why CV is necessary
   - Work through the house price example
   - Learn when to use each CV variant

2. **Logistic Regression (60 min):**
   - Learn sigmoid function and probability interpretation
   - Work through email spam classification example
   - Understand multi-class approaches

3. **Classification Advanced (60 min):**
   - Learn to construct ROC curves from scratch
   - Understand AUC as probability metric
   - Practice threshold tuning with costs
   - Learn multi-class metric averaging

4. **Model Comparison (60 min):**
   - Study algorithm selection framework
   - Compare models on different dimensions
   - Work through churn prediction example
   - Understand bias-variance for each algorithm

5. **Decision Boundaries (45 min):**
   - Visualize how different models create boundaries
   - See how overfitting looks graphically
   - Understand underfitting from boundary perspective

### 🧪 For Exam Preparation (6-7 hours)
- Do all of the above (4-5 hours)
- Solve all practice problems (2 hours)
- Answer exam questions without solutions (30 min)
- Review solutions and identify weak areas (30 min)

---

## Key Formulas

### Cross-Validation
```
CV Error = (e₁ + e₂ + ... + eₖ) / k

CV Std Dev = √[ Σ(eᵢ - CV Error)² / k ]
```

### Logistic Regression
```
Sigmoid: σ(z) = 1 / (1 + e^(-z))

Probability: P(y=1|x) = σ(b₀ + b₁x₁ + b₂x₂ + ... + bₙxₙ)

Odds: odds = P(y=1) / P(y=0)

Log-odds: ln(odds) = b₀ + b₁x₁ + b₂x₂ + ... + bₙxₙ
```

### Classification Metrics
```
Accuracy = (TP + TN) / (TP + TN + FP + FN)

Precision = TP / (TP + FP)

Recall = TP / (TP + FN)

F1 = 2 × (Precision × Recall) / (Precision + Recall)

AUC = Area under ROC curve (0 to 1)
```

### Algorithm Selection
```
Trade-off: Performance ↔ Interpretability

Complexity: Low ← Logistic, Tree → High ← Neural Network

Speed: Slow ← Gradient Boost → Fast ← Logistic
```

---

## Exam Question Types

### Type 1: Concept Understanding
"Why use K-fold CV instead of single train/test split?"  
"What does high standard deviation in CV results indicate?"

### Type 2: Calculation
"Calculate CV error and std dev from fold results."  
"Calculate precision, recall, F1 from confusion matrix."  
"Calculate AUC from threshold probabilities."

### Type 3: Interpretation
"Model A has low training error but high CV error. Diagnose the issue."  
"Compare two models using CV results. Which generalizes better?"

### Type 4: Application
"Choose the best algorithm for a given problem. Justify."  
"Given a cost matrix, find the optimal decision threshold."  
"Explain why a model has this decision boundary shape."

### Type 5: End-to-End Analysis
"Given data and problem constraints, propose a complete classification solution."  
"Compare multiple models on multiple metrics and recommend for production."

---

## Common Mistakes to Avoid

### ❌ Evaluation Mistakes
- Using single train/test split for model selection
- Not reporting CV standard deviation
- Ignoring class imbalance in cross-validation
- Using test data to tune hyperparameters

### ❌ Logistic Regression Mistakes
- Treating logistic regression output as continuous instead of probability
- Misinterpreting coefficients (e.g., b₁ = 0.5 means +0.5 change in probability, which is WRONG)
- Confusing binary classification with multi-class extension

### ❌ Classification Metric Mistakes
- Optimizing only for accuracy in imbalanced problems
- Using the same threshold for all problems
- Not considering business costs when choosing threshold
- Averaging metrics incorrectly (macro vs micro vs weighted)

### ❌ Model Selection Mistakes
- Choosing highest accuracy without considering complexity
- Ignoring training time or interpretability requirements
- Not stratifying folds for imbalanced classification
- Assuming more complex models are always better

---

## Tips for Success

### 📌 Study Tips
1. **Work through examples:** Don't just read—calculate by hand
2. **Use visualizations:** Draw confusion matrices, ROC curves, boundaries
3. **Connect concepts:** Understand how CV → Logistic → Metrics → Comparison → Boundaries form a pipeline
4. **Solve practice problems:** Do both guided examples and independent problems

### 💡 Exam Tips
1. **Show all steps:** Partial credit for method even if answer is slightly off
2. **Define terms:** When asked to interpret, define what metrics mean
3. **Use tables:** For comparisons (algorithms, models, metrics), use tables for clarity
4. **Justify choices:** When recommending an algorithm, explain the tradeoff
5. **Check reasonableness:** If a probability is > 1 or < 0, you made an error

### ⚡ Time Management
- **Calculator tip:** Know how to compute log, sqrt, division by hand
- **Rough calculations:** OK to round for intermediate steps (e.g., 0.9842 ≈ 0.98)
- **Standard formulas:** Memorize CV, Logistic sigmoid, Precision/Recall/F1
- **Boundary shapes:** Memorize 2-3 example boundary shapes (linear, nonlinear, overfitted)

---

## Connection to Module 1

### Module 1 (Regression Foundations)
- Bias-variance tradeoff: Now apply to classification algorithms
- Feature scaling: Important for logistic regression
- Cross-validation: Introduced there, applied heavily in Module 2
- Model evaluation: Extended from regression error metrics to classification metrics

### Progression
```
Module 1: Simple → Multiple Regression
         ↓ (Understand: features, training, evaluation)
         
Module 2: Logistic Regression (Extend to classification)
         ↓ (Add: probability, multiple classes)
         
         Evaluate Classification (Metrics beyond accuracy)
         ↓ (Add: precision, recall, ROC, cost)
         
         Select Best Model (For classification problems)
         ↓ (Apply: all concepts + constraints)
         
         Visualize Decisions (Understand what model learned)
```

---

## Next Steps After Module 2

With Module 2 mastered, you're ready for:

### 🚀 Advanced Topics (Not in CT)
- Tree-based models (Decision Trees, Random Forests, Gradient Boosting)
- Unsupervised learning (Clustering, PCA, Dimensionality reduction)
- Neural networks and deep learning
- Model interpretability and explainability (SHAP, LIME)

### 📊 Real-World Application
- Build end-to-end classification pipelines
- Handle imbalanced data with proper techniques
- Deploy models with production safeguards
- Monitor model performance over time

---

## Quick Reference

### When to Use Each Algorithm
| Problem | Algorithm | Why |
|---------|-----------|-----|
| Linearly separable | Logistic Regression | Fast, interpretable |
| Many features | Ridge/Lasso Logistic | Regularization prevents overfitting |
| Non-linear boundary | Decision Tree | Captures interactions |
| Complex patterns | Random Forest | Ensemble reduces overfitting |
| Real-time predictions | Logistic / KNN | Fast inference |
| Explainability critical | Logistic / Tree | Easy to interpret coefficients |
| Big data (1M+ samples) | Logistic / SGD | Scales well |
| Small data (< 100) | Logistic / SVM | Low complexity, generalizes |

### When Each Metric Matters
| Metric | Best For | Example |
|--------|----------|---------|
| **Accuracy** | Balanced data | General classification |
| **Precision** | False positives costly | Spam filtering, legal |
| **Recall** | False negatives costly | Medical diagnosis, security |
| **F1** | Balance precision & recall | Product search ranking |
| **ROC/AUC** | Comparing models | Model selection |
| **PR-AUC** | Imbalanced data | Rare disease detection |

---

## Resources in Module 2

Each page includes:
- ✅ **Conceptual explanation** (why it matters)
- ✅ **Worked examples** (step-by-step calculation)
- ✅ **Complete inference** (interpretation of results)
- ✅ **Exam questions** (5-6 questions with full solutions)
- ✅ **Practice problems** (2-3 problems to try yourself)
- ✅ **Key takeaways** (summary for review)

---

## How to Use This Module

### 🎯 If You Have 1 Hour
→ Read pages 1-2 (Cross-Validation, Logistic Regression)  
→ Look at key takeaways on all pages

### 🎯 If You Have 3 Hours
→ Read all pages completely  
→ Work through all worked examples  
→ Attempt 1-2 practice problems

### 🎯 If You Have 5+ Hours
→ Complete full study roadmap above  
→ Solve all exam questions (without looking at solutions)  
→ Compare your answers to solutions  
→ Review weak areas

### 🎯 Right Before Exam
→ Review key formulas  
→ Review algorithm selection framework  
→ Review exam question titles (quick memory refresh)

---

**Ready to dive in? Start with [Cross-Validation](./01-cross-validation.md)** →

