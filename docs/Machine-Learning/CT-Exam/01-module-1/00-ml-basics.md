---
sidebar_position: 0
title: Machine Learning Basics
description: Introduction to machine learning, types of learning, and fundamental concepts
tags: [machine-learning, fundamentals, supervised-learning]
---

# Machine Learning Basics

## What is Machine Learning?

**Machine Learning = Learning patterns from data WITHOUT explicit programming**

Instead of writing rules by hand, the computer learns rules from examples.

### Simple Comparison

```
Traditional Programming:
  Rules → Computer → Output
  (You write the rules)

Machine Learning:
  Data + Examples → Computer learns → Rules → Output
  (Computer finds the rules)
```

---

## Three Types of Learning

### 1️⃣ Supervised Learning
**Labeled data provided (X, y)**

```
Training Data:
  Input (X) → Output (y)
  Size=1000 → Price=50L
  Size=2000 → Price=80L
  
Model learns: price = f(size)
```

**Examples:**
- Predicting house prices (regression)
- Classifying emails as spam (classification)
- Disease diagnosis from symptoms

**Algorithms:** Linear Regression, Logistic Regression, Decision Trees

---

### 2️⃣ Unsupervised Learning
**No labels provided (X only)**

```
Training Data:
  Input (X) only
  Customer A: {purchase_history, browsing_patterns}
  Customer B: {purchase_history, browsing_patterns}
  
Model learns: Find similar customers
```

**Examples:**
- Grouping customers by behavior
- Finding similar products
- Document clustering

**Algorithms:** K-Means, Hierarchical Clustering, PCA

---

### 3️⃣ Semi-Supervised Learning
**Mix of labeled and unlabeled data**

```
Training Data:
  100 labeled emails: {content} → {spam/not spam}
  900 unlabeled emails: {content} → unknown
  
Model learns: Find patterns from labeled, apply to unlabeled
```

**Examples:**
- Spam detection with partial labels
- Image classification with few labeled images
- Text classification with limited labeled data

---

## Exam Question Format

**Q: Classify these as supervised/unsupervised/semi-supervised**

| Task | Answer | Reason |
|------|--------|--------|
| Predict house price from features | Supervised | Have labeled (price) examples |
| Group customers by behavior | Unsupervised | No labels, discover groups |
| Label some emails, find patterns | Semi-supervised | Mix of labeled + unlabeled |
| Classify iris flowers | Supervised | Have labeled flower types |
| Find document topics | Unsupervised | No predefined labels |

---

## Training vs Testing Data

### The Split

```
Raw Data (100 samples)
    ↓
    ├─ Training Set (80%) → Used to LEARN
    │
    └─ Test Set (20%) → Used to EVALUATE
```

### Why This Matters

```
Training Error ≠ Test Error

If training error = 0.05 and test error = 0.40
→ OVERFITTING (model memorized training data)
```

---

## Key Concepts for Your Exam

| Term | Meaning |
|------|---------|
| **Features (X)** | Input variables |
| **Target (y)** | Output we predict |
| **Model** | Learned rules/patterns |
| **Prediction** | What model outputs |
| **Residual** | Actual - Predicted |
| **Error** | How wrong the prediction is |
| **Accuracy** | % of correct predictions |

---

## Common Exam Questions

**Q: Why split data into training and testing?**

A: 
- Training data: Teach the model
- Testing data: Evaluate how well it generalizes
- Prevents measuring on data the model already saw

**Q: What's the relationship between training and test error?**

A:
- Good model: Both low and similar
- Overfitting: Train low, test high (gap is large)
- Underfitting: Both high (model too simple)

---

## Next Steps

- Move to [Linear Regression](./01-linear-regression) to learn the main Module 1 topic
- Or review [Machine Learning Types](.) here first
- See [Practice Problem 6.1](../02-practice-problems/06-set-6-comprehensive#problem-61-full-regression-analysis) for a complete example

---

## Key Takeaways

✅ ML learns patterns from data, not hand-coded rules  
✅ Three types: Supervised (labeled), Unsupervised (unlabeled), Semi-supervised (both)  
✅ Always split data: Training (learn) + Testing (evaluate)  
✅ Good model generalizes: training error ≈ test error  
✅ Bad model overfits: train error << test error  

