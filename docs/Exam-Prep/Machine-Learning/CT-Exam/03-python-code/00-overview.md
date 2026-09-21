---
sidebar_position: 0
title: Python Implementation Guide
description: Complete Python code examples using scikit-learn for all ML algorithms and techniques
tags: [python, scikit-learn, implementation, code-examples]
---

# Python Implementation Guide

Complete working code examples for implementing all concepts from the course.

---

## Overview

This guide provides production-ready Python code using **scikit-learn** for:
- Linear and multiple regression
- Cross-validation techniques
- Logistic regression (binary & multi-class)
- Classification metrics
- Model comparison and selection
- Complete ML pipelines

### Requirements

```bash
pip install scikit-learn numpy pandas matplotlib seaborn
```

---

## Part 1: Linear Regression

### Simple Linear Regression

```python
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score
import numpy as np

# Generate data
X = np.array([[500], [800], [1200], [1500]])
y = np.array([50, 70, 100, 130])

# Create and fit model
model = LinearRegression()
model.fit(X, y)

# Get coefficients
print(f"Intercept (b₀): {model.intercept_:.2f}")
print(f"Slope (b₁): {model.coef_[0]:.4f}")

# Make predictions
predictions = model.predict(X)
print(f"Predictions: {predictions}")

# Evaluate
mse = mean_squared_error(y, predictions)
rmse = np.sqrt(mse)
r2 = r2_score(y, predictions)

print(f"MSE: {mse:.4f}")
print(f"RMSE: {rmse:.4f}")
print(f"R²: {r2:.4f}")

# Predict new value
new_x = np.array([[1000]])
pred = model.predict(new_x)
print(f"Price for 1000 sq ft: ${pred[0]:.2f}k")
```

### Multiple Regression

```python
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import StandardScaler
import pandas as pd

# Load data
data = pd.DataFrame({
    'sq_ft': [1000, 1500, 2000, 2500, 3000],
    'bedrooms': [2, 3, 3, 4, 4],
    'age': [5, 10, 2, 15, 1]
})

X = data[['sq_ft', 'bedrooms', 'age']]
y = np.array([200, 300, 350, 400, 500])

# Optional: Scale features
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Fit model
model = LinearRegression()
model.fit(X_scaled, y)

# Coefficients
print("Coefficients:")
for feature, coef in zip(X.columns, model.coef_):
    print(f"  {feature}: {coef:.4f}")
```

---

## Part 2: Cross-Validation

### K-Fold Cross-Validation

```python
from sklearn.model_selection import cross_val_score, KFold
from sklearn.linear_model import LinearRegression
from sklearn.datasets import make_regression

# Generate data
X, y = make_regression(n_samples=100, n_features=5, noise=10)

# Create model
model = LinearRegression()

# 5-Fold CV
kfold = KFold(n_splits=5, shuffle=True, random_state=42)
cv_scores = cross_val_score(model, X, y, cv=kfold, scoring='neg_mean_squared_error')

# Convert negative MSE to positive
mse_scores = -cv_scores
rmse_scores = np.sqrt(mse_scores)

print(f"CV RMSE: {rmse_scores.mean():.4f} ± {rmse_scores.std():.4f}")
print(f"Individual fold RMSE: {rmse_scores}")
```

### Stratified K-Fold (for Classification)

```python
from sklearn.model_selection import StratifiedKFold
from sklearn.linear_model import LogisticRegression

# Generate imbalanced data
X, y = make_classification(
    n_samples=1000,
    n_features=10,
    weights=[0.9, 0.1],  # 90% negative, 10% positive
    random_state=42
)

# Stratified K-Fold ensures balanced class distribution
skfold = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)

model = LogisticRegression()
cv_scores = cross_val_score(model, X, y, cv=skfold, scoring='f1')

print(f"CV F1 Score: {cv_scores.mean():.4f} ± {cv_scores.std():.4f}")
```

### Hyperparameter Tuning with GridSearchCV

```python
from sklearn.model_selection import GridSearchCV
from sklearn.linear_model import Ridge

# Parameter grid
param_grid = {
    'alpha': [0.001, 0.01, 0.1, 1.0, 10.0]
}

# Grid search
grid_search = GridSearchCV(
    Ridge(),
    param_grid,
    cv=5,
    scoring='neg_mean_squared_error'
)

grid_search.fit(X, y)

print(f"Best alpha: {grid_search.best_params_['alpha']}")
print(f"Best CV score: {-grid_search.best_score_:.4f}")

# Use best model
best_model = grid_search.best_estimator_
```

---

## Part 3: Logistic Regression

### Binary Classification

```python
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import confusion_matrix, classification_report

# Generate binary classification data
X, y = make_classification(
    n_samples=200,
    n_features=5,
    n_classes=2,
    random_state=42
)

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Train model
model = LogisticRegression()
model.fit(X_train, y_train)

# Predictions and probabilities
y_pred = model.predict(X_test)
y_pred_proba = model.predict_proba(X_test)

print("Predicted classes:", y_pred)
print("Predicted probabilities (class 0, class 1):")
print(y_pred_proba)

# Evaluate
print("\nConfusion Matrix:")
print(confusion_matrix(y_test, y_pred))
print("\nClassification Report:")
print(classification_report(y_test, y_pred))
```

### Multi-Class Classification

```python
from sklearn.linear_model import LogisticRegression
from sklearn.multiclass import OneVsRestClassifier

# Multi-class data
X, y = make_classification(
    n_samples=300,
    n_features=10,
    n_informative=8,
    n_classes=3,
    n_clusters_per_class=1,
    random_state=42
)

# Softmax (default for multi-class)
model = LogisticRegression(multi_class='softmax', max_iter=1000)
model.fit(X_train, y_train)

# Predictions
y_pred = model.predict(X_test)
y_pred_proba = model.predict_proba(X_test)

print("Class probabilities shape:", y_pred_proba.shape)  # (n_samples, 3)
print("Probabilities for first sample:", y_pred_proba[0])
```

---

## Part 4: Classification Metrics

### Confusion Matrix & Basic Metrics

```python
from sklearn.metrics import (
    confusion_matrix,
    accuracy_score,
    precision_score,
    recall_score,
    f1_score
)

# Predictions vs actual
y_true = [0, 1, 0, 1, 0, 1, 1, 1, 0, 0]
y_pred = [0, 1, 0, 1, 1, 1, 0, 1, 0, 0]

# Confusion matrix
tn, fp, fn, tp = confusion_matrix(y_true, y_pred).ravel()
print(f"TP: {tp}, FP: {fp}, TN: {tn}, FN: {fn}")

# Metrics
accuracy = accuracy_score(y_true, y_pred)
precision = precision_score(y_true, y_pred)
recall = recall_score(y_true, y_pred)
f1 = f1_score(y_true, y_pred)

print(f"Accuracy: {accuracy:.4f}")
print(f"Precision: {precision:.4f}")
print(f"Recall: {recall:.4f}")
print(f"F1: {f1:.4f}")
```

### ROC Curve & AUC

```python
from sklearn.metrics import roc_curve, auc, roc_auc_score
import matplotlib.pyplot as plt

# Get probability predictions
y_pred_proba = model.predict_proba(X_test)[:, 1]

# Calculate ROC curve
fpr, tpr, thresholds = roc_curve(y_test, y_pred_proba)
roc_auc = auc(fpr, tpr)

# Plot
plt.figure(figsize=(8, 6))
plt.plot(fpr, tpr, label=f'ROC curve (AUC = {roc_auc:.3f})')
plt.plot([0, 1], [0, 1], 'k--', label='Random')
plt.xlabel('False Positive Rate')
plt.ylabel('True Positive Rate')
plt.legend()
plt.show()

print(f"AUC Score: {roc_auc:.4f}")
```

### Precision-Recall Curve

```python
from sklearn.metrics import precision_recall_curve, average_precision_score
import matplotlib.pyplot as plt

# Calculate PR curve
precision_vals, recall_vals, _ = precision_recall_curve(
    y_test, 
    y_pred_proba
)

# Average precision
ap = average_precision_score(y_test, y_pred_proba)

# Plot
plt.figure(figsize=(8, 6))
plt.plot(recall_vals, precision_vals, label=f'AP = {ap:.3f}')
plt.xlabel('Recall')
plt.ylabel('Precision')
plt.legend()
plt.show()
```

---

## Part 5: Model Comparison

### Compare Multiple Models

```python
from sklearn.ensemble import RandomForestClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.svm import SVC
from sklearn.model_selection import cross_val_score

models = {
    'Logistic Regression': LogisticRegression(),
    'Decision Tree': DecisionTreeClassifier(),
    'Random Forest': RandomForestClassifier(n_estimators=100),
    'SVM': SVC(probability=True)
}

results = {}

for name, model in models.items():
    cv_scores = cross_val_score(
        model, X, y, cv=5, scoring='accuracy'
    )
    results[name] = {
        'mean': cv_scores.mean(),
        'std': cv_scores.std()
    }
    print(f"{name}: {cv_scores.mean():.4f} ± {cv_scores.std():.4f}")

# Find best
best_model = max(results, key=lambda x: results[x]['mean'])
print(f"\nBest model: {best_model}")
```

---

## Part 6: Complete ML Pipeline

### End-to-End Workflow

```python
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split, cross_val_score

# Create pipeline
pipeline = Pipeline([
    ('scaler', StandardScaler()),
    ('model', LogisticRegression())
])

# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Cross-validation
cv_scores = cross_val_score(pipeline, X_train, y_train, cv=5)
print(f"CV Accuracy: {cv_scores.mean():.4f} ± {cv_scores.std():.4f}")

# Train on full training set
pipeline.fit(X_train, y_train)

# Evaluate on test set
test_score = pipeline.score(X_test, y_test)
print(f"Test Accuracy: {test_score:.4f}")

# Make predictions
new_data = X_test[:5]
predictions = pipeline.predict(new_data)
probabilities = pipeline.predict_proba(new_data)

print(f"Predictions: {predictions}")
print(f"Probabilities: {probabilities}")
```

---

## Part 7: Regularization

### Ridge Regression (L2)

```python
from sklearn.linear_model import Ridge
from sklearn.model_selection import cross_val_score

# Test different alpha values
alphas = [0.001, 0.01, 0.1, 1.0, 10.0]
cv_scores = []

for alpha in alphas:
    model = Ridge(alpha=alpha)
    scores = cross_val_score(model, X, y, cv=5, scoring='r2')
    cv_scores.append(scores.mean())
    print(f"Alpha {alpha}: CV R² = {scores.mean():.4f}")

# Best alpha
best_alpha = alphas[np.argmax(cv_scores)]
print(f"\nBest alpha: {best_alpha}")

# Train with best alpha
best_model = Ridge(alpha=best_alpha)
best_model.fit(X, y)
```

### Lasso Regression (L1)

```python
from sklearn.linear_model import Lasso

# Lasso performs feature selection
model = Lasso(alpha=0.1)
model.fit(X, y)

# See which coefficients become zero
print("Coefficients:")
for i, coef in enumerate(model.coef_):
    print(f"  Feature {i}: {coef:.4f}")

# Count non-zero coefficients
non_zero = np.sum(model.coef_ != 0)
print(f"\nNon-zero coefficients: {non_zero}/{len(model.coef_)}")
```

---

## Part 8: Feature Importance

### For Tree-Based Models

```python
from sklearn.ensemble import RandomForestClassifier
import pandas as pd

model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Feature importances
importances = model.feature_importances_

# Create dataframe for visualization
feature_importance_df = pd.DataFrame({
    'feature': [f'Feature {i}' for i in range(len(importances))],
    'importance': importances
}).sort_values('importance', ascending=False)

print(feature_importance_df)

# Plot
import matplotlib.pyplot as plt
plt.barh(feature_importance_df['feature'], feature_importance_df['importance'])
plt.xlabel('Importance')
plt.show()
```

### For Linear Models (Coefficients)

```python
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression

# Scale features first (important for coefficient comparison)
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

model = LogisticRegression()
model.fit(X_scaled, y)

# Coefficients show feature importance
importances = np.abs(model.coef_[0])

feature_importance_df = pd.DataFrame({
    'feature': [f'Feature {i}' for i in range(len(importances))],
    'importance': importances
}).sort_values('importance', ascending=False)

print(feature_importance_df)
```

---

## Part 9: Handling Imbalanced Data

### Class Weights

```python
from sklearn.linear_model import LogisticRegression

# Automatic: calculate weights inversely proportional to class frequencies
model = LogisticRegression(class_weight='balanced')
model.fit(X_train, y_train)

# Manual: specify weights
class_weights = {0: 1, 1: 5}  # Weight minority class higher
model = LogisticRegression(class_weight=class_weights)
model.fit(X_train, y_train)
```

### Resampling

```python
from imblearn.over_sampling import RandomOverSampler
from imblearn.under_sampling import RandomUnderSampler
from imblearn.pipeline import Pipeline as ImbPipeline

# Oversample minority class
oversampler = RandomOverSampler(random_state=42)
X_resampled, y_resampled = oversampler.fit_resample(X_train, y_train)

# Undersampler minority class
undersampler = RandomUnderSampler(random_state=42)
X_resampled, y_resampled = undersampler.fit_resample(X_train, y_train)

# Combined pipeline
pipeline = ImbPipeline([
    ('over', RandomOverSampler()),
    ('under', RandomUnderSampler()),
    ('model', LogisticRegression())
])

pipeline.fit(X_train, y_train)
```

---

## Quick Reference

| Task | Code |
|------|------|
| **Train model** | `model.fit(X_train, y_train)` |
| **Predict** | `model.predict(X_test)` |
| **Predict proba** | `model.predict_proba(X_test)` |
| **K-Fold CV** | `cross_val_score(model, X, y, cv=5)` |
| **Grid search** | `GridSearchCV(model, params, cv=5)` |
| **Train-test split** | `train_test_split(X, y, test_size=0.2)` |
| **Scale features** | `StandardScaler().fit_transform(X)` |
| **Confusion matrix** | `confusion_matrix(y_true, y_pred)` |
| **ROC curve** | `roc_curve(y_true, y_pred_proba)` |
| **Feature importance** | `model.feature_importances_` |

---

## Common Imports

```python
# Data handling
import numpy as np
import pandas as pd

# Preprocessing
from sklearn.preprocessing import StandardScaler, MinMaxScaler

# Models
from sklearn.linear_model import LinearRegression, LogisticRegression, Ridge, Lasso
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC

# Model selection
from sklearn.model_selection import (
    train_test_split,
    cross_val_score,
    GridSearchCV,
    KFold,
    StratifiedKFold
)

# Metrics
from sklearn.metrics import (
    confusion_matrix,
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    roc_curve
)

# Visualization
import matplotlib.pyplot as plt
import seaborn as sns
```

---

## Next Steps

- Run code examples locally
- Modify parameters and observe effects
- Apply to practice problems
- Build your own pipelines

**Happy coding! 🐍**

