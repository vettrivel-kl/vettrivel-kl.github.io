---
sidebar_position: 5
title: Decision Boundaries
description: Visual interpretation of classification models, 2D decision boundaries, overfitting vs underfitting, and model-specific boundary shapes
tags: [decision-boundaries, classification, overfitting, visualization, interpretability]
---

# Decision Boundaries

## Overview

A **decision boundary** is the surface that separates the feature space into regions where the model predicts different classes. Understanding boundaries helps you:

```
Core Benefits:
  1. Visualize what the model learned
  2. Diagnose overfitting and underfitting
  3. Understand model complexity
  4. Make intuitive predictions
```

---

## Part 1: What Are Decision Boundaries?

### Simple Definition

```
Decision Boundary = The line (2D), surface (3D), or hyperplane (n-D)
                    that separates predictions of Class 0 from Class 1
```

### Example: 2D Classification

```
Feature space (2 features: X₁, X₂)

Class 0 (negative):  ○○ ○ ○ ○
Class 1 (positive):  ● ● ● ● ●

Decision Boundary: The line that best separates the two classes

    X₂
    │     ○ ○
    │   ○   │   ● ●
    │ ○     │ ● ●
    └─────────────────── X₁
            ↑
         Boundary
```

### How Boundaries Work

```
For any point (x₁, x₂):
  IF point is on Class 0 side of boundary → Predict 0
  IF point is on Class 1 side of boundary → Predict 1
```

---

## Part 2: Logistic Regression Boundary

### Linear Decision Boundary

**Logistic regression always creates a linear boundary** (straight line in 2D).

```
Formula: b₀ + b₁x₁ + b₂x₂ = 0
         (This is the boundary)

Region 1: b₀ + b₁x₁ + b₂x₂ > 0  → Predict Class 1
Region 2: b₀ + b₁x₁ + b₂x₂ < 0  → Predict Class 0
```

### Example: Email Spam Classifier

```
Features: word_count (X₁), reputation (X₂)
Model: P(spam) = σ(-1.5 + 0.3×word_count - 0.2×reputation)

Decision Boundary (P=0.5):
  -1.5 + 0.3×word_count - 0.2×reputation = 0
  0.3×word_count - 0.2×reputation = 1.5
  Rearrange: word_count = 5 + 0.67×reputation

Visual (2D):
    word_count
    │
    │    [spam region]
    │    (above line)
   5 ├─────────────
    │    /
    │  /
    │/
    │ [ham region]
    │ (below line)
    └──────────────── reputation

Interpretation:
  • High word_count → Likely spam
  • High reputation → Likely ham
  • Linear tradeoff between features
```

### Properties of Logistic Regression Boundary

```
✓ Always linear (straight line in 2D, plane in 3D)
✓ Determined by coefficients b₀, b₁, b₂, ...
✓ Probability increases smoothly from 0 to 1 on both sides
✓ Perpendicular to the direction of steepest increase

Limitation:
  ✗ Can't capture curved or complex relationships
  ✗ Fails for non-linearly separable data
```

---

## Part 3: Decision Tree Boundary

### Non-Linear Decision Boundary

**Decision trees create axis-aligned rectangular boundaries** (parallel to feature axes).

```
Tree splits:
  1. If X₁ < 5: Go left
  2. If X₂ < 3: Go left
  3. If X₁ > 8: Go right

Resulting Boundary (2D):
    X₂
    │
    3 ├─────┬─────┐
      │  0  │  1  │
      │     │     │
    ├─────┼─────┼─
    │  1  │  0  │  1
    │     │     │
    └──────┼─────┼─── X₁
         5    8

Interpretation:
  • Creates rectangular regions
  • Can capture different patterns in different areas
  • More flexible than logistic regression
```

### Example: Iris Dataset (2D)

```
Tree:
  If sepal_length < 5.9:
    If petal_width < 1.7:
      Predict "setosa"
    Else:
      Predict "versicolor"
  Else:
    If petal_width < 1.7:
      Predict "versicolor"
    Else:
      Predict "virginica"

Visual Boundary:
    petal_width
    │
  1.7├─────┬─────┐
    │ set  │vers │
    │      │     │
    ├──────┼─────┤
    │ vers │vir  │
    │      │     │
    └──────┼─────┴──── sepal_length
         5.9
         
  Rectangle for each class
```

### Properties of Decision Tree Boundary

```
✓ Can capture non-linear patterns
✓ Axis-aligned (parallel to axes)
✓ Creates rectangular regions
✓ Each region is homogeneous (same class)
✗ Can be jagged and complex
✗ Easy to overfit (see overfitting section)
```

---

## Part 4: Random Forest Boundary

### Ensemble Decision Boundary

**Random forests create irregular, non-linear boundaries** (combination of many trees).

```
Process:
  1. Grow many decision trees
  2. Each tree votes on class
  3. Majority vote = final prediction
  4. Boundary = where votes tie (0.5 probability)

Visual Boundary (Conceptual):
    X₂
    │    ╱─╲ 
    │   ╱ ● ╲    ◯
    │  ╱─────╲
    │         ╲
    │    ◯    ╱─╲
    │  ╱─────╱   ╲
    └────────────────── X₁

Characteristics:
  • Smoother than single tree
  • More complex than logistic regression
  • Better captures real-world patterns
  • Still captures non-linear relationships
```

---

## Part 5: Overfitting Through Boundaries

### High-Variance (Overfitting) Boundary

```
Overfitting manifests as:
  1. Boundary follows every data point
  2. Zigzags and irregular shapes
  3. Many small regions for each class
  4. Perfect training accuracy (usually)
  5. Poor test accuracy

Visual Example (Decision Tree with max_depth=20):

    X₂
    │  ○●○●○ ●○●●
    │ ○●  ●  ○ ●  ○
    │  ●○●○●●○
    │   (very jagged)
    │  ◯ ◯  ◯ ◯ ◯
    └──────────────── X₁

Problem:
  • Boundary memorizes training data noise
  • Doesn't generalize to new data
  • High complexity matches data too well
```

### Example: 2D Overfitting

```
Dataset:
  Class 0: Points roughly around origin (0,0)
  Class 1: Points roughly around (5,5)
  But some overlap and noise

Decision Boundary (overfitted):

    X₂
    5 ├─────────◎──────
      │    ◎  ╱ ╲  ◎
      │   ◎  ╱   ╲ 
      │ ◎  ╱───────╲  ◎
      │    ╱    ●   ╲
    0 ├──◎────────╱──◎────
      │   ●  ╱        ●
      │ ●   ╱  ●   ●
      │●    ╱    ●  ●
      └──────────────────── X₁
        0              5

Red squiggly line = Overfitted boundary
  • Wiggles around every point
  • Creates tiny regions
  • Will fail on new test data

Black line = Better boundary
  • Smooth sweep
  • Ignores local noise
  • Generalizes better
```

---

## Part 6: Underfitting Through Boundaries

### High-Bias (Underfitting) Boundary

```
Underfitting manifests as:
  1. Boundary is too simple
  2. Misses true pattern
  3. Both training AND test accuracy are poor
  4. Can't separate the classes well
  5. Same poor performance on both sets

Visual Example (Linear boundary for non-linear data):

    X₂
    │    ●●●●●  [Class 1]
    │   ●     ●
    │  ●       ●
    │ ───────────  ← Underfitting boundary
    │  ○   ○   ○   [Class 0]
    │   ○ ○ ○ ○
    └──────────────── X₁

Problem:
  • Straight line can't follow curved cluster
  • Misclassifies many training points
  • Also misclassifies test points
  • Model is too simple
```

### Example: Concentric Circles

```
True Pattern:
  • Inner circle: Class 0
  • Outer ring: Class 1

    X₂
    │  ●●●●●●●   [Class 1: outer ring]
    │ ●         ●
    │●    ◯◯◯    ● 
    │●   ◯◯◯◯◯   ● [Class 0: inner]
    │●   ◯◯◯◯◯   ●
    │ ●  ◯◯◯◯   ●
    │  ●●●●●●●
    └──────────────── X₁

Underfitting (Linear):
    X₂
    │  ●●●●●●●
    │ ●   ────────  [Wrong boundary]
    │●   ◯  /   ●
    │   ◯◯ /  ●
    │   ◯ /  ●
    │    ●   ●
    └──────────────── X₁
    Result: Many misclassifications both sides

Good Fit (Circular boundary):
    X₂
    │  ●●●●●●●
    │ ● (════════)  ← Correct circular boundary
    │● ◯◯◯◯◯◯ ●
    │ ● ◯◯◯◯◯ ●
    │  (══════════)
    └──────────────── X₁
    Result: Perfect separation
```

---

## Part 7: Comparing Boundaries Across Models

### Side-by-Side Comparison

```
DATASET: Two overlapping blobs

Original Data:
    X₂
    │   ●●●
    │  ●   ●  ○○○○
    │ ●     ●○○○○
    │  ●   ●  ○○○
    └──────────────── X₁

Model 1: Logistic Regression (Simple)
    X₂
    │  ●●●
    │ ●   ●╱   ○○○○  [LINEAR boundary]
    │●    ╱●  ○○○○
    │ ●  ╱    ○○○
    │  ╱╱
    └──────────────── X₁
    Characteristics:
    • Smooth, linear
    • Misses some overlapping points
    • Good generalization
    • Fast to compute

Model 2: Decision Tree (Medium)
    X₂
    │  ●●● ┌──────┐  [RECTANGULAR]
    │ ●   ●│ ○○○  │  boundary
    │●     ││○○○○ │
    │ ●   ●├──────┤
    │  ├───┤ ○
    │  │●  │○
    └──┴───┴──────── X₁
    Characteristics:
    • Axis-aligned
    • Captures more patterns
    • Some overfitting visible
    • Medium interpretability

Model 3: Deep Decision Tree (Overfitting)
    X₂
    │  ●●●  ╱╲╱╲
    │ ●   ●╱ ╲╱ ╲○○○  [VERY JAGGED]
    │●  ╱╲╱        ●╲○○
    │ ●╱ ╲╱      ○╲╱┐
    └──────────────── X₁
    Characteristics:
    • Wiggles everywhere
    • Follows training data exactly
    • Low training error, high test error
    • Overfitted!

Model 4: Random Forest (Good Balance)
    X₂
    │   ●●●
    │  ●   ● ╱════╲  [SMOOTH, CURVED]
    │ ●     ╱       ╲ 
    │  ●   ●          ○○○○
    │      ╱     ○○○╲  ○○
    └─────╱─────────╲──── X₁
    Characteristics:
    • Smooth curve
    • Captures patterns
    • Generalizes well
    • Often "sweet spot"
```

---

## Part 8: Diagnostics from Boundary Shape

### Reading the Boundary to Diagnose Issues

```
Boundary Shape → Diagnosis → Action

1. SMOOTH, LINEAR
   └─ Diagnosis: Simple model, might underfit
      └─ Check: Is training accuracy low?
         If yes: Increase complexity
         If no: Keep it (good generalization)

2. SMOOTH, CURVED
   └─ Diagnosis: Good complexity
      └─ Check: Train vs test accuracy gap
         If small: Good fit! ✓
         If large: Increase data or regularization

3. SLIGHTLY JAGGED
   └─ Diagnosis: Some overfitting
      └─ Check: Test accuracy still OK?
         If yes: Acceptable
         If no: Reduce complexity

4. VERY JAGGED, WIGGLES
   └─ Diagnosis: Severe overfitting
      └─ Check: Large gap between train and test accuracy
         If yes: Reduce complexity (prune tree, lower max_depth)
         If no: Might just be natural complexity needed
```

---

## Part 9: Worked Examples

### Example 1: Spiral Dataset

```
Problem:
  X1, X2 form a spiral pattern
  Class 0: Inner spiral
  Class 1: Outer spiral
  
Data Distribution (Top View):
    X₂
    │   ●●●●●  ← Class 1 (outer)
    │  ●   ○●  
    │ ●   ○○ ●
    │●   ○○   ●  ← Class 0 (inner)
    │●  ○        ●
    │ ●          ●
    │  ●●●●●●●●●
    └────────────── X₁
```

**Model 1: Logistic Regression**

```
Boundary: Linear line
    X₂
    │   ●●●●●
    │  ●  ─────  ○●  [LINEAR: Very wrong!]
    │ ●  /────  ○○ ●
    │● / ────o  ○○   ●
    │ ○────────      ●
    │  ●          ●
    │   ●●●●●●●●
    └───────────── X₁

Result:
  • Training accuracy: ~50% (random guessing)
  • Test accuracy: ~50%
  • Diagnosis: UNDERFITTING
  • Action: Use more complex model
```

**Model 2: Deep Decision Tree**

```
Boundary: Very jagged, follows spiral
    X₂
    │  ╱╲╱╲●●●╱
    │╱╱  ╲╱ ○●╱ [VERY JAGGED]
    │  ○╲╱  ○○╱
    │╱╱ ○○╱   ╱
    │╱ ○    ╱  ●
    │  ●    ●●●
    └──────────── X₁

Result:
  • Training accuracy: ~99%
  • Test accuracy: ~60%
  • Diagnosis: OVERFITTING
  • Action: Reduce tree depth, add regularization
```

**Model 3: Neural Network**

```
Boundary: Smooth spiral following
    X₂
    │  (════════)●●●
    │  (═════○══)●  [SMOOTH CURVE]
    │ (═══○○════)●
    │(═○○═══════)●
    │(═════════○══●
    │  (════════)●
    │
    └──────────── X₁

Result:
  • Training accuracy: ~95%
  • Test accuracy: ~93%
  • Diagnosis: GOOD FIT!
  • Action: Keep this model
```

---

### Example 2: Two Moons Dataset

```
Problem:
  Two crescent moon shapes
  Class 0: Lower moon
  Class 1: Upper moon
  
Original Data:
    X₂
    │      ●●●●●
    │    ●       ●
    │   ●  ○       ●
    │  ●    ○○      ●
    │       ○○○
    │    ○       ○
    │     ○○○○○○
    └────────────── X₁
```

**Model 1: Logistic Regression**

```
Boundary:
    X₂
    │      ●●●●●
    │    ●  ────  ●
    │   ●   ───  ●  [LINEAR: Cuts wrong]
    │  ●    ───  ●
    │      ───
    │    ○ ───  ○
    │     ○○────
    └────────────── X₁

Issues:
  • Can't follow moon shape
  • Misclassifies points inside crescent
  • Accuracy: ~70%
```

**Model 2: Decision Tree**

```
Boundary:
    X₂
    │    ┌──●●●●●──┐
    │    │●       ●│  [RECTANGULAR]
    │    │●  ○    ●│
    │    │  ○○     │
    │    │ ○○○    │
    │    │ ○      ○│
    │    │ ○○○○○ ○│
    │    └────────┘
    └────────────── X₁

Issues:
  • Rectangular, not crescent shaped
  • Includes white space that should be Class 0
  • Accuracy: ~80%
```

**Model 3: SVM (RBF Kernel)**

```
Boundary:
    X₂
    │      ╱────╲●●●●●
    │    ╱        ╲ ●  ●  [CURVED: Good!]
    │   ╱ ○        ╲ ●
    │  ╱   ○○      ╲●
    │     ○○○
    │    ○      ○
    │ ╱ ○○○○○ ○ ╲
    │╱            ╲
    └────────────── X₁

Result:
  • Follows moon shape perfectly
  • Separates crescents cleanly
  • Accuracy: ~96%
  • Diagnosis: Good fit!
```

---

## Part 10: Exam Questions & Solutions

### Q1: Concept - Boundary Shape

**Q:** "Why does logistic regression always create a linear decision boundary?"

**A:**
```
Logistic regression predicts:
  P(y=1|x) = σ(b₀ + b₁x₁ + b₂x₂ + ... + bₙxₙ)

The decision boundary is where P(y=1|x) = 0.5:
  σ(b₀ + b₁x₁ + b₂x₂ + ... + bₙxₙ) = 0.5

The sigmoid function equals 0.5 when its input is 0:
  b₀ + b₁x₁ + b₂x₂ + ... + bₙxₙ = 0

This is a LINEAR equation in the features!

For 2D:
  b₀ + b₁x₁ + b₂x₂ = 0
  x₂ = -(b₀ + b₁x₁) / b₂  ← Line equation

Therefore: Always a straight line in 2D, plane in 3D, hyperplane in n-D.
```

---

### Q2: Interpretation - Identify Overfitting

**Q:**
```
Model A: Training accuracy = 99%, Test accuracy = 60%
Model B: Training accuracy = 88%, Test accuracy = 85%

Which model is likely overfitting? Describe what its 
decision boundary would look like.
```

**A:**
```
Model A is CLEARLY overfitting.

Reasoning:
  • Large gap: 99% train vs 60% test
  • Near-perfect training suggests memorization
  • Poor test performance suggests doesn't generalize
  
Boundary Appearance:
  • Very jagged and wiggly
  • Follows every training point
  • Creates tiny, irregular regions
  • Probably has many small pockets for rare cases
  • Visual: Looks like it traced around all noise
  
Comparison with Model B:
  • Small gap: 88% train vs 85% test
  • Well-balanced performance
  • Boundary probably smooth and sensible
  • Generalizes well
  
Action for Model A:
  • Reduce complexity
  • Use regularization
  • Prune decision trees
  • Lower neural network depth
```

---

### Q3: Calculation - Boundary Equation

**Q:**
```
Logistic regression for email classification:
  b₀ = -2, b₁ = 1.5 (word_count), b₂ = -0.5 (links)

What is the equation of the decision boundary?
At what combination of features is the boundary?
```

**A:**
```
Decision Boundary Equation:
  b₀ + b₁×word_count + b₂×links = 0
  -2 + 1.5×word_count - 0.5×links = 0
  
Rearranging (solve for word_count):
  1.5×word_count = 2 + 0.5×links
  word_count = (2 + 0.5×links) / 1.5
  word_count = 1.33 + 0.33×links

Interpretation:
  • For links = 0: word_count = 1.33
    (emails with 1.33 words, 0 links → boundary)
  
  • For links = 3: word_count = 2.33
    (emails with 2.33 words, 3 links → boundary)
  
  • For links = 6: word_count = 3.33
    (emails with 3.33 words, 6 links → boundary)

Slope: 0.33
  • Each additional link requires 0.33 more words
  • Interpretation: More links = easier to be spam
                    More words = easier to be spam

Spam Region (P > 0.5):
  • Above the line: -2 + 1.5×w - 0.5×l > 0
                    1.5×w > 2 + 0.5×l
                    w > 1.33 + 0.33×l
```

---

### Q4: Application - Choose Model for Boundary Type

**Q:**
```
Your data shows concentric circles (inner circle = Class 0,
outer ring = Class 1). Which model would create the best boundary?

A) Logistic Regression
B) Decision Tree
C) RBF SVM
D) Neural Network

Justify.
```

**A:**
```
Answer: C) RBF SVM

Why NOT A (Logistic Regression):
  • Linear boundary can't capture concentric circles
  • Would create a line through the middle
  • Massive underfitting
  • Poor accuracy on both train and test

Why NOT B (Decision Tree):
  • Axis-aligned boundaries
  • Concentric circles need radial/circular boundary
  • Tree would create rectangular approximation
  • Possible overfitting with deep tree
  • Better than logistic, but not ideal

Why C (RBF SVM):
  • RBF kernel creates radial basis functions
  • Can capture circular/radial patterns
  • Would create circular decision boundary
  • Perfect for concentric circles!
  • Good generalization with proper C parameter
  ✓ BEST CHOICE

Why D (Neural Network) is acceptable:
  • With enough hidden units: Can learn circular boundary
  • Overfitting risk if not regularized
  • More complex to tune than RBF SVM
  • Still good choice, but RBF SVM is simpler and proven for this problem

Justification:
  Concentric circles need a circular/radial boundary,
  which linear models can't create. RBF SVM with RBF 
  kernel naturally learns radial patterns through 
  basis functions centered at support vectors.
```

---

### Q5: Interpretation - Multiple Models

**Q:**
```
You've trained 3 models on a 2D classification dataset:

Model 1 (Logistic): Straight line boundary, 75% train, 74% test
Model 2 (Tree): Jagged boundary, 98% train, 65% test
Model 3 (RF): Smooth curved boundary, 86% train, 84% test

Which model should you deploy? Why?
```

**A:**
```
Answer: Model 3 (Random Forest)

Analysis:

Model 1 (Logistic - Linear):
  Boundary: Smooth, straight
  Train/Test gap: 75%-74% (excellent)
  Issue: May be underfitting
         Straight line might not capture data patterns
  Verdict: Simple but possibly too simple

Model 2 (Tree - Jagged):
  Boundary: Wiggly, irregular
  Train/Test gap: 98%-65% (HUGE gap!)
  Issue: SEVERE OVERFITTING
         Memorized training data
         Won't generalize
  Verdict: ✗ Avoid this model

Model 3 (RF - Smooth Curve):
  Boundary: Smooth, curved
  Train/Test gap: 86%-84% (small gap)
  Issue: None apparent
  Verdict: ✓ Good generalization

Decision:
  Deploy Model 3 (Random Forest)

Why:
  1. Best test accuracy (84%)
  2. Small train-test gap (only 2%)
  3. Smooth, sensible boundary
  4. Shows good generalization
  5. Not overfitting like Model 2
  6. More flexible than Model 1

Trade-offs:
  • Model 1 is simpler (faster)
  • Model 3 is more accurate (better predictions)
  → For most applications, accuracy > speed
  → Deploy Model 3
```

---

## Part 11: Practice Problems

### Problem 1: Boundary Diagnosis

```
You're debugging a classifier. The decision boundary 
looks like this:

    X₂
    │  ●●●●●
    │ ● ╱╲╱╲ ●    [Very zigzag pattern]
    │●  ╱ ╲╱╲ ●
    │  ╱  ○ ╲  
    │ ───○○───
    │  ○
    └──────────── X₁

Training accuracy: 99.5%
Test accuracy: 62%

Questions:
a) Identify the problem (overfitting / underfitting / other)
b) Describe how the boundary indicates this problem
c) Propose 2 fixes to improve test accuracy
d) Which fix is likely better? Why?
```

### Problem 2: Compare Two Boundaries

```
Same dataset, two different models:

Model A Boundary:
    X₂
    │   ●●●
    │  ● ─── ●    [Clean, smooth line]
    │ ●  ──  ●
    │  ─────
    │    ○○
    │   ○ ○
    └───────── X₁

Model B Boundary:
    X₂
    │   ●●●
    │  ●╱╲╱╲●    [Wiggly approximation]
    │ ●╱ ╲╱ ●
    │ ╱ ○ ╲
    │╱ ○○ ╲
    │   ○○
    └───────── X₁

Questions:
a) Which model is likely logistic regression?
b) Which is likely a deep decision tree?
c) If train/test accuracy gaps are:
   Model A: 78% train, 77% test
   Model B: 96% train, 75% test
   
   Which generalizes better?
d) Explain using boundary shape why generalization differs
```

### Problem 3: Design a Boundary

```
Your task: Classify 2D points into regions:

Data pattern:
  • Narrow horizontal strip at y ≈ 3 is Class 0
  • Everything else is Class 1
  
Visual:
    X₂
    │  ●●●●●●●  [Class 1]
    │
    3 ◯◯◯◯◯◯◯◯  [Class 0: narrow strip]
    │
    │  ●●●●●●●  [Class 1]
    └──────────── X₁

Questions:
a) Sketch what a logistic regression boundary would look like
b) Sketch what a decision tree boundary would look like
c) Which model is better for this data? Why?
d) What problem might each model have?
```

---

## Part 12: Key Takeaways

### ✅ Decision Boundary Concepts

```
1. Definition:
   • Surface separating class predictions
   • Line (2D), plane (3D), hyperplane (n-D)
   • Determined by model type and coefficients

2. Logistic Regression:
   • Always linear
   • Smooth probability transition
   • Can't capture curved patterns

3. Decision Trees:
   • Axis-aligned rectangles
   • Can be non-linear
   • Risk of overfitting

4. Random Forest / Ensemble:
   • Smooth, curved boundaries
   • Better generalization than single trees
   • Balances complexity and accuracy

5. Neural Networks:
   • Can learn any boundary shape
   • Risk of overfitting
   • Needs good regularization
```

### ✅ Reading Boundaries to Diagnose

```
Boundary Shape → Diagnosis → Action

Linear & Too Simple
→ Underfitting (High Bias)
→ Increase model complexity

Smooth & Balanced
→ Good Fit
→ Keep this model! ✓

Slightly Jagged
→ Some Overfitting
→ If test accuracy OK, accept
→ If test accuracy poor, regularize

Very Jagged & Wiggly
→ Severe Overfitting (High Variance)
→ Reduce complexity
→ Add regularization
→ Collect more data
```

### ✅ Model Selection by Boundary

```
Use Logistic Regression if:
  • Linear pattern expected
  • Interpretability important
  • Fast predictions needed

Use Decision Tree if:
  • Non-linear patterns
  • Axis-aligned relationships
  • Need interpretable rules

Use Random Forest if:
  • Unknown pattern type
  • Need good accuracy
  • Trade-off: less interpretable than single tree

Use SVM (RBF) if:
  • Radial/circular patterns
  • High-dimensional data
  • Small-medium dataset

Use Neural Network if:
  • Complex patterns
  • Large dataset
  • Can afford training time
```

---

## Tips for CT Exam

### ✅ DO

- **Sketch boundaries when explaining models**
  Example: "Logistic regression creates a straight line, so it can't capture this curved pattern"

- **Use boundary shape to diagnose problems**
  Example: "The jagged boundary and large train-test gap indicate overfitting"

- **Describe boundaries in business terms**
  Example: "The boundary separates low-risk customers (left) from high-risk (right)"

- **Connect boundary to model complexity**
  Example: "More flexible models create more complex boundaries"

### ❌ DON'T

- Don't say "the boundary is good" without explaining why
  Better: "The boundary is smooth and generalization gap is small, indicating good fit"

- Don't ignore overfitting indicators
  Watch for: large train-test gap + jagged boundary = overfitting

- Don't assume more complex = better
  Remember: Overfitted complex boundary often performs worse than simpler boundary

- Don't forget to consider interpretability
  Sometimes simpler linear boundary is better despite lower accuracy

---

## Next Steps

→ [Back to Module 2 Overview](./00-overview.md)  
→ [Practice Problems Solutions](#practice-problems)  
→ Ready for Module 3 (Advanced Topics)

---

## Summary Table

| Model | Boundary Shape | Complexity | Interpretability | When to Use |
|-------|---|---|---|---|
| **Logistic Reg** | Linear line | Low | ✓ Very high | Simple patterns, speed |
| **Decision Tree** | Axis-aligned | Medium | ✓ High | Interpretable rules |
| **Random Forest** | Smooth curves | High | ✗ Medium | Accuracy + balance |
| **SVM (RBF)** | Radial curves | High | ✗ Low | Kernel patterns |
| **Neural Net** | Any shape | Very High | ✗ Low | Complex patterns |
| **KNN** | Data-driven | Medium | ✗ Medium | Non-parametric |

