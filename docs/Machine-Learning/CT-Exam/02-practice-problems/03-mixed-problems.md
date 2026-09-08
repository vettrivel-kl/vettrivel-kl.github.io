---
sidebar_position: 3
title: Mixed & Real-World Problems
description: 25 advanced problems combining multiple concepts with real-world business scenarios and end-to-end pipelines
tags: [practice-problems, real-world, business-scenarios, integration]
---

# Mixed & Real-World Problems

Challenge yourself with these 25 integrated problems that combine multiple concepts. These prepare you for complex exam questions and real-world ML projects.

---

## Real-World Scenarios (10 Problems)

### Problem 1.1: Customer Churn Prediction
**Difficulty:** Hard | **Time:** 30 min | **Topics:** Classification, Metrics, Cost-Benefit

**Business Context:**
```
Telecom company wants to prevent customer churn
- 100,000 customers
- 5% churn rate (5,000 churners)
- Intervention cost: $50 per customer
- Revenue from retained customer: $5,000
- Customer lifetime value if saved: $5,000 (net benefit)
```

**Problem Statement:**
```
You train two models on historical data:

Model A (Simple):
  Precision: 0.60
  Recall: 0.80
  Cost to deploy: $10,000
  
Model B (Complex):
  Precision: 0.75
  Recall: 0.85
  Cost to deploy: $50,000
```

**Questions:**
a) For Model A: How many interventions? True positives? False positives? False negatives?  
b) For Model B: How many interventions? True positives? False positives? False negatives?  
c) Calculate ROI for each model: (Benefit - Cost) / Cost  
d) Which model should you deploy?  
e) What other factors would you consider?  

---

### Problem 1.2: Medical Diagnosis System
**Difficulty:** Hard | **Time:** 25 min | **Topics:** Imbalanced Data, Metrics, Threshold Tuning

**Business Context:**
```
Rare disease detection system (0.5% prevalence)
- 10,000 patients screened
- 50 have disease, 9,950 don't
- False negative: $100,000 (miss disease, patient dies)
- False positive: $1,000 (unnecessary treatment)
- True positive: -$100,000 (save life)
- True negative: $0
```

**Problem Statement:**
```
Model produces probabilities. Compare 3 thresholds:

Threshold 0.5:
  TP: 40, FN: 10, FP: 200, TN: 9,750

Threshold 0.3 (lower threshold):
  TP: 45, FN: 5, FP: 500, TN: 9,450

Threshold 0.7 (higher threshold):
  TP: 35, FN: 15, FP: 50, TN: 9,900
```

**Questions:**
a) Calculate total cost for each threshold  
b) Which threshold minimizes cost?  
c) Calculate sensitivity (recall) for each  
d) Calculate specificity for each  
e) How does disease prevalence affect threshold choice?  

---

### Problem 1.3: Fraud Detection at Scale
**Difficulty:** Hard | **Time:** 25 min | **Topics:** Large-Scale Classification, Metrics

**Business Context:**
```
Credit card fraud detection:
- Process 1,000,000 transactions/day
- Fraud rate: 0.1% (1,000 frauds)
- False positive cost: $20 (investigation)
- False negative cost: $5,000 (fraud loss)
- Detection latency constraint: <50ms
```

**Problem Statement:**
```
Three model options:

Model A: Accuracy 99.8% (catches mostly non-frauds)
  Precision: 0.50, Recall: 0.60, Inference: 5ms
  
Model B: Accuracy 99.5% (balanced)
  Precision: 0.75, Recall: 0.80, Inference: 50ms
  
Model C: Accuracy 98.0% (high recall)
  Precision: 0.40, Recall: 0.95, Inference: 200ms
```

**Questions:**
a) Calculate daily costs for each model (1M transactions)  
b) Which model respects the latency constraint?  
c) Best model considering latency + cost?  
d) What if latency constraint relaxed to 100ms?  
e) How does model choice change at scale?  

---

### Problem 1.4: Recommendation System Evaluation
**Difficulty:** Hard | **Time:** 25 min | **Topics:** Multi-Class Metrics, Ranking

**Business Context:**
```
E-commerce recommendation system
- Users rate products (1-5 stars)
- Goal: Recommend products user would rate ≥4 stars
- Two types of errors:
  * Recommend bad product (user rates ≤3): Wastes attention
  * Don't recommend good product: Misses sale opportunity

Reclassify as binary:
- Class 1: Would rate ≥4 (good recommendation)
- Class 0: Would rate ≤3 (bad recommendation)
```

**Problem Statement:**
```
Tested on 1,000 products:

Model A (Conservative):
  TP: 300, FN: 100, FP: 50, TN: 550

Model B (Aggressive):
  TP: 350, FN: 50, FP: 150, TN: 450
```

**Questions:**
a) Calculate precision and recall for each  
b) Which shows more recommendations?  
c) For business: missing good product = 2× worse than showing bad product  
d) Which model maximizes user satisfaction?  
e) How would you evaluate rankings (not just classification)?  

---

### Problem 1.5: Email Spam Classification
**Difficulty:** Medium | **Time:** 20 min | **Topics:** Classification, Threshold, Precision-Recall

**Business Context:**
```
Gmail-like spam filter:
- 100 million emails/day
- Spam rate: 30% (30M spam, 70M legitimate)
- False positive (mark legitimate as spam): User loses important email
- False negative (let spam through): Annoyance

Metric: Users prefer false negatives to false positives
```

**Problem Statement:**
```
Model with different thresholds:

Conservative (threshold 0.9):
  Precision: 0.95, Recall: 0.50

Moderate (threshold 0.5):
  Precision: 0.85, Recall: 0.80

Aggressive (threshold 0.1):
  Precision: 0.70, Recall: 0.95
```

**Questions:**
a) Which threshold maximizes precision? Recall?  
b) Which would miss the most spam?  
c) Which would incorrectly flag the most legitimate?  
d) Which would you choose? Why?  
e) Could you use precision-recall curve?  

---

### Problem 1.6: Loan Approval System
**Difficulty:** Hard | **Time:** 25 min | **Topics:** Fairness, Metrics, Multiple Objectives

**Business Context:**
```
Bank loan approval model
- Model optimizes for profit (minimize defaults)
- But must also be fair across demographic groups

Prediction task: Will applicant default?
- Class 0 (no default): Approve loan
- Class 1 (default): Reject loan

Hidden issue: Historical data shows racial bias
- Model achieves high accuracy but discriminates
```

**Problem Statement:**
```
Model results by demographic group:

Group A (protected group):
  Approval rate: 60%, Default rate: 10%

Group B (majority):
  Approval rate: 80%, Default rate: 8%

Model accuracy: 92% overall
But different false negative rate by group!
```

**Questions:**
a) Is the model "fair"? Why/why not?  
b) Which group faces discrimination?  
c) What metric captures fairness?  
d) Could you achieve both high accuracy AND fairness?  
e) What's your recommendation?  

---

### Problem 1.7: Manufacturing Quality Control
**Difficulty:** Medium | **Time:** 20 min | **Topics:** Classification, Cost-Benefit, Metrics

**Business Context:**
```
Automated defect detection on assembly line
- Production: 100,000 items/day
- Defect rate: 2% (2,000 defects)
- False positive (scrap good item): $10 cost
- False negative (ship defect): $500 liability cost
- Inspection staff: $50/unit inspected
```

**Problem Statement:**
```
Model: Automatically flags suspected defects

Two strategies:
Strategy A: Model flags, then human inspects flagged items
  Precision: 0.80 → 20% flagged are actually good
  Recall: 0.90 → 10% of defects slip through
  Expected: 12,500 items flagged/day

Strategy B: Model flags with higher threshold
  Precision: 0.95 → 5% flagged are good
  Recall: 0.70 → 30% of defects slip through
  Expected: 5,000 items flagged/day
```

**Questions:**
a) Calculate daily cost for Strategy A (inspection + scrap + liability)  
b) Calculate daily cost for Strategy B  
c) Which strategy minimizes cost?  
d) What threshold trade-off would you accept?  
e) Could you improve without changing model?  

---

### Problem 1.8: Student Dropout Prediction
**Difficulty:** Hard | **Time:** 25 min | **Topics:** Early Prediction, Multi-Class, Intervention

**Business Context:**
```
University early warning system:
- Predict student will dropout BEFORE it happens
- Early intervention (tutoring, counseling): $500/student
- Cost of dropout (lost tuition, resources): $50,000
- True positive: Catch at-risk student early
- False positive: Spend $500 on student who would succeed anyway
- False negative: Miss opportunity to save $50,000
```

**Problem Statement:**
```
Baseline: No intervention, 5% dropout rate

Model predicts dropout probability:

With intervention on high-risk students:
  50 identified as high-risk
    - 40 actually would drop out (saved 40 × $50k)
    - 10 would succeed anyway (wasted $5k)

Without intervention, among those 50:
  - 40 would drop out (lost opportunity)
  - 10 would succeed
```

**Questions:**
a) Calculate savings from intervention  
b) What's the net benefit?  
c) How many students should you intervene with?  
d) Is perfect prediction necessary?  
e) What's the break-even accuracy?  

---

### Problem 1.9: Click-Through Rate (CTR) Prediction
**Difficulty:** Medium | **Time:** 20 min | **Topics:** Regression, Classification, Ranking

**Business Context:**
```
Online advertising platform:
- 100,000 ad impressions/day
- Average CTR: 2% (2,000 clicks)
- Revenue per click: $5
- Model predicts: P(click | features)

Two strategies:
- Show ads with highest predicted CTR
- Show diverse ads (some uncertainty)
```

**Problem Statement:**
```
Model predictions on 100,000 impressions:

Strategy A (Highest predicted CTR):
  Average predicted CTR: 0.040 (4%)
  Average actual CTR: 0.038 (3.8%)
  Calibration error: Small

Strategy B (Diverse):
  Average predicted CTR: 0.022 (2.2%)
  Average actual CTR: 0.025 (2.5%)
  Calibration error: Moderate
```

**Questions:**
a) Which strategy generates more revenue?  
b) Why might Strategy B be better long-term?  
c) How do you balance exploration vs exploitation?  
d) What's the right metric for this problem?  
e) How would you validate model predictions?  

---

### Problem 1.10: Multi-Class Text Classification
**Difficulty:** Hard | **Time:** 25 min | **Topics:** Multi-Class Metrics, Class Imbalance

**Business Context:**
```
Customer support ticket router:
- Classify support tickets to 5 departments
- Misrouting costs: Delays, customer frustration
- Revenue implications: Lost sales, retention

Ticket types (imbalanced):
- Billing: 50% (high volume, easy to handle)
- Technical: 30% (medium volume, complex)
- Product: 10% (lower volume)
- Returns: 7% (lower volume)
- Other: 3% (rare)
```

**Problem Statement:**
```
Multi-class model results:

Per-class metrics:
Billing:   Precision 0.90, Recall 0.95, F1 0.92
Technical: Precision 0.75, Recall 0.70, F1 0.72
Product:   Precision 0.60, Recall 0.50, F1 0.55
Returns:   Precision 0.40, Recall 0.30, F1 0.34
Other:     Precision 0.50, Recall 0.20, F1 0.29
```

**Questions:**
a) Calculate macro-averaged F1  
b) Calculate weighted F1 (by class frequency)  
c) Which classes perform poorly?  
d) Why might "Other" be hard to predict?  
e) How would you improve rare class performance?  

---

## End-to-End Pipelines (8 Problems)

### Problem 2.1: Complete ML Workflow - Binary Classification
**Difficulty:** Hard | **Time:** 30 min | **Topics:** All concepts integrated

**Scenario:**
```
A bank wants to predict loan defaults to reduce risk

Step 1: Problem Definition
- Target: Will customer default? (Yes/No)
- Dataset: 5,000 past loans with outcomes
- Features: Income, Credit Score, Loan Amount, Age, etc.
- Class distribution: 80% non-default, 20% default (imbalanced)

Step 2: Data Split & Validation
- Choose 80-20 train-test split? Or K-fold CV? Or stratified?
- Explain your choice

Step 3: Model Selection
- Candidate models: Logistic, Tree, RF, SVM, Neural Net
- Dataset size: 5,000
- Explainability needed? Yes (for regulatory)
- Speed needed? Yes (real-time decisions)

Step 4: Hyperparameter Tuning
- Ridge regression with λ selection
- Or: Tree depth, max_features for RF

Step 5: Evaluation
- Which metrics matter: Accuracy? Precision? Recall? F1? ROC?
- Why?

Step 6: Threshold Tuning
- Default cost: $50,000 loss
- False positive cost: $100 investigation
- Optimal threshold?

Step 7: Production Deployment
- Acceptable error rate?
- Monitoring plan?
- Retraining frequency?
```

**Questions:**
a) Explain your choice for train-test strategy  
b) Which model would you choose? Why?  
c) How would you tune hyperparameters?  
d) Which metrics would you use? Why?  
e) Calculate optimal decision threshold  
f) Design monitoring & retraining plan  
g) What would you document for stakeholders?  

---

### Problem 2.2: Feature Engineering Impact
**Difficulty:** Hard | **Time:** 25 min | **Topics:** Feature Engineering, Model Evaluation

**Scenario:**
```
House price prediction with different feature sets

Baseline (raw features):
- Square feet, Bedrooms, Bathrooms, Age

Model A (baseline):
  R² = 0.65, RMSE = $50,000

Added features:
- sqrt(Square feet), Price/SqFt, Bedrooms×Bathrooms
- Neighborhood (categorical)
- Distance to transit, School quality

Model B (engineered features):
  R² = 0.75, RMSE = $35,000
```

**Questions:**
a) How much did R² improve?  
b) Is improvement significant? Statistically?  
c) Did RMSE improve proportionally?  
d) What could explain the improvement?  
e) Risk of overfitting? How would you check?  
f) Which features might be most important?  
g) Would all features help equally?  

---

### Problem 2.3: Class Imbalance Handling
**Difficulty:** Hard | **Time:** 25 min | **Topics:** Imbalanced Data, Techniques

**Scenario:**
```
Fraud detection (99.9% non-fraud, 0.1% fraud)

Naive approach (standard model):
- Accuracy: 99.9% (predicting everything as non-fraud!)
- Useless for fraud detection

Solutions to explore:
1. Class weights: Weight fraud class higher
2. Resampling: Oversample fraud, undersample non-fraud
3. Different threshold: Lower detection threshold
4. Different metric: Use F1 instead of accuracy
```

**Problem Statement:**
```
Compare approaches on 10,000 test samples:

Naive Model:
  Confusion matrix: TP=5, FP=0, TN=9995, FN=0
  Accuracy: 99.95%
  Precision: undefined (TP/(TP+FP) = 5/5 = 1.0 with no FP)
  Recall: 1.0

With class weights:
  Confusion matrix: TP=7, FP=50, TN=9945, FN=3
  Accuracy: 99.55%
  Precision: 0.12
  Recall: 0.70

With threshold tuning:
  Confusion matrix: TP=8, FP=100, TN=9895, FN=2
  Accuracy: 99.03%
  Precision: 0.07
  Recall: 0.80
```

**Questions:**
a) Why is naive model accuracy "perfect" but useless?  
b) Explain confusion matrix for each approach  
c) Which approach would you use? Why?  
d) How do false positives cost you at scale?  
e) When is recall more important than precision?  

---

### Problem 2.4: Cross-Validation for Model Selection
**Difficulty:** Medium | **Time:** 20 min | **Topics:** CV, Hyperparameter Tuning

**Scenario:**
```
Predicting customer lifetime value (continuous target)

Grid search over hyperparameters:

Ridge λ values: [0.001, 0.01, 0.1, 1.0, 10]
Tree depths: [3, 5, 10, 15, 20]

Each combination evaluated with 5-fold CV
Total: 5 × 5 = 25 configurations
Each tested 5 times = 125 model trainings
```

**Problem Statement:**
```
CV Results (5-fold, RMSE metric):

Ridge λ = 0.1:   CV RMSE = 2500 ± 100
Ridge λ = 1.0:   CV RMSE = 2600 ± 80

Tree depth = 5:  CV RMSE = 2400 ± 150
Tree depth = 10: CV RMSE = 2200 ± 400
Tree depth = 20: CV RMSE = 2000 ± 600

Best: Tree depth = 20 (lowest mean RMSE)
But highest std dev (600)!
```

**Questions:**
a) Which hyperparameter would you choose?  
b) Why might depth=20 have high std dev?  
c) Is depth=20 stable? Reproducible?  
d) What's the trade-off?  
e) Would you choose based on mean or std dev?  
f) How would you break the tie?  

---

### Problem 2.5: Train-Test Leakage Detection
**Difficulty:** Hard | **Time:** 20 min | **Topics:** Data Leakage, Validation

**Scenario:**
```
Predicting if patient will get disease

WARNING SIGNS OF LEAKAGE:

Model A:
  Training accuracy: 95%
  Test accuracy: 91%
  Gap: 4% (reasonable)

Model B:
  Training accuracy: 92%
  Test accuracy: 88%
  Gap: 4% (reasonable)

Model C:
  Training accuracy: 99%
  Test accuracy: 52%
  Gap: 47% (HUGE! Leakage suspected!)
```

**Problem Statement:**
```
Investigating Model C:

Features used:
- Age, Weight, Blood pressure
- Insulin level (MEASURED AT HOSPITAL VISIT)
- Prior medications
- Disease test result (MEASURED AT HOSPITAL VISIT)

Problem: Insulin & test results are MEASURED when
patient visits hospital, not predictions!
This is LEAKAGE if disease correlates with test visit.
```

**Questions:**
a) Identify the leakage source  
b) Why doesn't it show in training accuracy?  
c) Why does it crash in test accuracy?  
d) How would you fix it?  
e) What features should you actually use?  
f) How would you catch leakage early?  

---

### Problem 2.6: Model Serving & Latency
**Difficulty:** Medium | **Time:** 15 min | **Topics:** Production, Trade-offs

**Scenario:**
```
Real-time recommendation system:
- User visits site, must get recommendation in <100ms
- Page loads: 50ms
- Available for ML: <50ms

Model options:

Model A (Simple):
  Inference time: 5ms
  Accuracy: 85%
  
Model B (Medium):
  Inference time: 40ms
  Accuracy: 90%
  
Model C (Complex):
  Inference time: 150ms
  Accuracy: 92%
```

**Questions:**
a) Which model meets latency constraint?  
b) What's the accuracy-latency tradeoff?  
c) Could you use Model C with caching?  
d) What preprocessing could speed up inference?  
e) Would batch processing help?  
f) Is ensemble possible within latency?  

---

### Problem 2.7: A/B Testing New Model
**Difficulty:** Hard | **Time:** 25 min | **Topics:** Deployment, Experimentation

**Scenario:**
```
Current production model (Model A) vs. new model (Model B)

Current Model A:
- Conversion rate: 5.0%
- Deployed 1 year ago
- Known issues: Doesn't handle new products well

Proposed Model B:
- Testing shows: Conversion rate 5.3%
- More complex, riskier
- Better on new products

A/B Test Setup:
- 100,000 users
- 50% see Model A (control), 50% see Model B (treatment)
- Run for 2 weeks
- Goal: Detect 0.3% lift with 95% confidence
```

**Questions:**
a) What metrics would you track?  
b) How would you detect if Model B breaks something?  
c) What's the expected lift in revenue?  
d) What would cause you to reject Model B?  
e) How long should you run the test?  
f) What if results are inconclusive?  

---

### Problem 2.8: Model Debugging Workflow
**Difficulty:** Hard | **Time:** 25 min | **Topics:** Troubleshooting, Diagnosis

**Scenario:**
```
Production model degradation:

Week 1: Model accuracy 90%, production deployed
Week 2: Accuracy drops to 85% (on same data!)
Week 3: Accuracy drops to 80%

Investigating:

Possibility A: Data drift (data distribution changed)
  → Check: Training data vs current data distribution

Possibility B: Label noise (ground truth changed)
  → Check: Are labels being recorded correctly?

Possibility C: Feature drift (features computed differently)
  → Check: Did upstream data pipeline change?

Possibility D: Bug in evaluation (measurement error)
  → Check: Is evaluation code correct?
```

**Problem Statement:**
```
Debug timeline:

Day 1: Accuracy 90%
Day 2: Accuracy 88%
Day 3: Accuracy 85%
Day 4: Accuracy 82%

Correlation check:
- No deployment changes (Possibility D ruled out)
- Feature computation same (Possibility C ruled out)
- Labels still being recorded (Possibility B seems OK)
- Training data: Income distribution shifted
  * Previously: 40% < $50k, 60% > $50k
  * Current: 60% < $50k, 40% > $50k
```

**Questions:**
a) What's the most likely cause?  
b) How would you confirm data drift?  
c) Should you retrain? When?  
d) How do you prevent this?  
e) What monitoring would help?  
f) Is this a model problem or data problem?  

---

## Critical Thinking Problems (7 Problems)

### Problem 3.1: The Accuracy Trap
**Difficulty:** Hard | **Time:** 20 min | **Topics:** Metrics, Trade-offs

**Scenario:**
```
Rare disease classifier: 
- 99% of people don't have disease
- Model predicts everyone as "no disease"
- Accuracy: 99%
- But catches 0 actual cases (useless!)
```

**Questions:**
a) Why is 99% accuracy misleading?  
b) Which metric would you use instead?  
c) What if you weighted precision vs recall?  
d) How would you explain this to non-technical stakeholder?  
e) Design a better evaluation framework  

---

### Problem 3.2: The Interpretability-Accuracy Trade-Off
**Difficulty:** Hard | **Time:** 20 min | **Topics:** Model choice, Stakeholders

**Scenario:**
```
Bank loan approval model:

Option A (Linear):
- Accuracy: 85%
- Interpretable: YES
- Stakeholder feedback: "We can explain decisions"

Option B (Neural Net):
- Accuracy: 92%
- Interpretable: NO
- Stakeholder concern: "Why was John's loan rejected?"
- Legal requirement: Must explain decisions (Fair Lending Act)
```

**Questions:**
a) Which would you recommend?  
b) Can you have both? How?  
c) What's the true cost of accuracy gain?  
d) Could you use both models (ensemble)?  
e) Design a solution that satisfies both needs  

---

### Problem 3.3: The Bias-Fairness Trade-Off
**Difficulty:** Hard | **Time:** 25 min | **Topics:** Ethics, Metrics

**Scenario:**
```
Credit risk model trained on historical data:

Historical data shows: Past loans from Group A defaulted more
(But: This could be due to discrimination in past lending!)

Model learns:
- Default probability higher for Group A
- Denies more loans to Group A
- Perpetuates discrimination

Dilemma:
- Optimizing for accuracy → Model discriminates
- Optimizing for fairness → Lower accuracy, may reject worthy applicants
```

**Questions:**
a) Is high accuracy ethically acceptable?  
b) How do you measure fairness?  
c) What's the business impact of fairness constraint?  
d) Can you optimize for both?  
e) Who decides the fairness-accuracy tradeoff?  
f) How would you present this to executives?  

---

### Problem 3.4: The Overfitting vs Real-World Gap
**Difficulty:** Hard | **Time:** 20 min | **Topics:** Validation, Deployment

**Scenario:**
```
Kaggle competition model:

Model achieves:
- 94% accuracy on competition test set
- Wins competition
- $50,000 prize!

But when deployed to real customers:
- Real-world accuracy: 72%
- Business impact: Terrible predictions
- Customer satisfaction drops

Why the gap?
- Competition test set ≠ real distribution
- Overfitting to competition quirks
- Real data has different patterns
```

**Questions:**
a) Why did test accuracy not predict real-world performance?  
b) What would you have done differently?  
c) How do you validate for real-world performance?  
d) When is Kaggle not representative?  
e) Design a better validation strategy  

---

### Problem 3.5: The Cost of False Positives vs False Negatives
**Difficulty:** Hard | **Time:** 20 min | **Topics:** Cost-benefit, Decision Making

**Scenario:**
```
Medical screening test:

False Negative: Patient has disease but test says "no"
  - Risk: Disease progresses undetected, dies
  - Cost to patient: LIFE

False Positive: Patient doesn't have disease but test says "yes"
  - Risk: Unnecessary treatment, anxiety, cost
  - Cost to patient: $10,000 + stress

Which error is worse?
```

**Questions:**
a) How do you quantify these costs?  
b) Can you price a human life?  
c) Who should decide the threshold?  
d) Is 95% sensitivity (5% false negative rate) acceptable?  
e) How would you communicate risk to patients?  
f) Design a threshold that balances risks  

---

### Problem 3.6: The Automation Bias Trap
**Difficulty:** Medium | **Time:** 15 min | **Topics:** Ethics, Human-in-loop

**Scenario:**
```
Loan approval automated by ML model:
- Model rejects John's loan application
- John is human, appeals to human manager
- Manager says: "The model rejected it, sorry"
- No human review, no appeal process

Risks:
- Errors from model go unchallenged
- People trust model too much ("computer said no")
- Removes human judgment and empathy
- Legal liability if discrimination occurs
```

**Questions:**
a) What's wrong with full automation?  
b) When should humans override models?  
c) Design a better human-in-loop system  
d) When is humans-in-loop too expensive?  
e) How do you balance efficiency and fairness?  

---

### Problem 3.7: The Long-Term Impact of Model Choices
**Difficulty:** Hard | **Time:** 20 min | **Topics:** Strategy, Feedback loops

**Scenario:**
```
Hiring algorithm learns from historical data:
- Past hires from College A were more successful
- Model learns to prefer College A graduates
- Starts hiring more from College A
- Other colleges fall behind
- By year 5: College A has monopoly on hiring
- Diversity drops, innovation suffers

Was the model wrong?
- It predicted success correctly
- But created self-fulfilling prophecy through feedback loop
```

**Questions:**
a) Is the model's prediction inaccurate?  
b) What went wrong?  
c) How could you have prevented this?  
d) When do models create feedback loops?  
e) How do you detect when feedback loops are harmful?  
f) Design monitoring for long-term impact  

---

## Final Exam-Style Integration Problems

### Practice Test 1: Complete End-to-End (Integrated)
**Difficulty:** Hard | **Time:** 60 min | **Topics:** Everything

**Problem:** Design complete ML solution for real-world problem:
- Define the problem clearly
- Choose data collection strategy
- Design train-test split & validation
- Select model & tune hyperparameters
- Evaluate with appropriate metrics
- Tune decision threshold
- Plan for production deployment
- Design monitoring & retraining
- Address ethical considerations

**Sample problem:** Predicting which customers will churn to maximize retention ROI

---

### Practice Test 2: Debugging Challenge (Integration)
**Difficulty:** Hard | **Time:** 45 min | **Topics:** Troubleshooting, Diagnosis

**Problem:** Model's production accuracy dropped. Debug:
- Identify possible causes (leakage, drift, bugs)
- Design experiments to test hypotheses
- Recommend solutions
- Create monitoring system to prevent recurrence

---

## Study Path for Mixed Problems

**Progression:**
1. Solve real-world problems 1-5 (get comfortable with integration)
2. Solve end-to-end pipelines 1-3 (practice complete workflows)
3. Attempt critical thinking 1-3 (develop judgment)
4. Try practice tests 1-2 (full exam simulation)

**Difficulty ladder:**
- Easy → Medium problems → Hard → Real-world scenarios → Integration → Critical thinking

**Time commitment:**
- 4-5 hours for thorough understanding
- 2-3 hours for speed practice

---

## Next Steps

**Completed all 95 problems?**

✓ You've covered all CT exam topics comprehensively  
✓ Ready for exam with confidence  
✓ Next: Timed practice test simulating actual exam conditions  

**Need solutions?** See [Solutions Guide](./04-solutions-guide.md)

**Questions or stuck?** Review related [Concept Pages](../00-overview.md)

---

**Good luck! You've got this! 🚀**

