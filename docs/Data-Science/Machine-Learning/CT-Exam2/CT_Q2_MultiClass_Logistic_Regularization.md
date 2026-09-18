# Continuous Training (CT) Exam: Multiclass Classification, Logistic Regression, and Regularization

## Question 2

### Question Prompt

1. **(i)** How you will handle more than two class using Logistic regression? Explain with example? **[10 marks]**
2. **(ii)** What is Logistic Regression? How you will convert the line equation into Sigmoid curve? **[5 marks]**
3. **(iii)** What is Regularization and explain different types of it? **[5 marks]**

---

### (i) Handling More Than Two Classes Using Logistic Regression (10 Marks)

Standard binary Logistic Regression is fundamentally designed for two-class (binary) classification. To extend it to handle multi-class classification (where the number of classes $C > 2$), three primary strategies are utilized in machine learning: **One-vs-Rest (OvR)**, **One-vs-One (OvO)**, and **Multinomial Logistic Regression (Softmax Regression)**.

---

#### Strategy 1: One-vs-Rest (OvR) / One-vs-All (OvA)
*   **Mechanism**: If there are $C$ unique classes, we train $C$ separate, independent binary logistic regression classifiers. For each classifier $i \in \{1, 2, \dots, C\}$:
    *   Class $i$ is treated as the **positive class** (target label = 1).
    *   All other $C-1$ classes are grouped together and treated as the **negative class** (target label = 0).
*   **Mathematical Probability**: Each classifier $i$ computes the probability of class $i$ versus all other classes combined using the standard Sigmoid function:
    $$P(y = i \mid \mathbf{x}) = \sigma(\mathbf{w}_i^T \mathbf{x} + b_i) = \frac{1}{1 + e^{-(\mathbf{w}_i^T \mathbf{x} + b_i)}}$$
*   **Prediction (Inference)**: To classify a new unseen instance $\mathbf{x}$, it is evaluated by all $C$ classifiers. The final predicted class $\hat{y}$ is the one that achieves the highest confidence score:
    $$\hat{y} = \arg\max_{i \in \{1, \dots, C\}} P(y = i \mid \mathbf{x})$$

##### Step-by-Step Example (OvR):
Imagine predicting a customer's preferred subscription plan from three classes ($C = 3$): **Basic**, **Standard**, and **Premium**.
1.  **Train Classifiers**:
    *   **Classifier 1 (Basic Classifier)**: Basic (1) vs. [Standard, Premium] (0) $\rightarrow$ Outputs $P(y = \text{Basic} \mid \mathbf{x})$.
    *   **Classifier 2 (Standard Classifier)**: Standard (1) vs. [Basic, Premium] (0) $\rightarrow$ Outputs $P(y = \text{Standard} \mid \mathbf{x})$.
    *   **Classifier 3 (Premium Classifier)**: Premium (1) vs. [Basic, Standard] (0) $\rightarrow$ Outputs $P(y = \text{Premium} \mid \mathbf{x})$.
2.  **Inference**: A new customer has features $\mathbf{x}$.
    *   Classifier 1 outputs: $P(y = \text{Basic} \mid \mathbf{x}) = 0.15$
    *   Classifier 2 outputs: $P(y = \text{Standard} \mid \mathbf{x}) = 0.65$
    *   Classifier 3 outputs: $P(y = \text{Premium} \mid \mathbf{x}) = 0.20$
3.  **Decision**: Since $0.65$ is the maximum probability, the model predicts **Standard**:
    $$\hat{y} = \arg\max(0.15, 0.65, 0.20) = \text{Standard}$$
*   **Limitations**:
    1.  **Class Imbalance**: During training, the negative class (all other classes combined) easily dominates the positive class, introducing bias into individual classifiers.
    2.  **Probability Unnormalization**: The computed probabilities do not naturally sum to 1 ($\sum P(y=i \mid \mathbf{x}) = 0.15 + 0.65 + 0.20 = 1.00$ here by chance; normally they don't, e.g., they could sum to 1.3 or 0.8), because they are predicted by independent models.

---

#### Strategy 2: One-vs-One (OvO)
*   **Mechanism**: Instead of training one classifier per class, OvO trains a binary classifier for **every possible pair** of classes.
*   **Number of Classifiers**: For $C$ classes, the total number of binary classifiers trained is given by the combination formula:
    $$N_{\text{classifiers}} = \frac{C(C-1)}{2}$$
*   **Inference Voting Scheme**: When a new instance $\mathbf{x}$ is evaluated, it is passed through all $\frac{C(C-1)}{2}$ classifiers. Each classifier votes for one of its two target classes. The class with the most "wins" (votes) across all pairwise comparisons is predicted as the final label.

##### Step-by-Step Example (OvO):
Using the same subscription plan classes ($C = 3$):
1.  **Train Classifiers**: We train $\frac{3(2)}{2} = 3$ independent binary classifiers:
    *   **Classifier 1**: Basic vs. Standard
    *   **Classifier 2**: Basic vs. Premium
    *   **Classifier 3**: Standard vs. Premium
2.  **Inference voting**: A new customer $\mathbf{x}$ is evaluated:
    *   Classifier 1 predicts: **Standard** (Basic: 0, Standard: 1, Premium: 0)
    *   Classifier 2 predicts: **Basic** (Basic: 1, Standard: 1, Premium: 0)
    *   Classifier 3 predicts: **Standard** (Basic: 1, Standard: 2, Premium: 0)
3.  **Decision**: Standard has $2$ votes, Basic has $1$ vote, and Premium has $0$ votes. The model predicts the **Standard** plan.
*   **Trade-offs**:
    *   *Pro*: Mitigates the class imbalance issues of OvR because each classifier is only trained on a pairwise subset of the dataset.
    *   *Con*: The number of classifiers grows quadratically ($O(C^2)$), making it computationally expensive for datasets with many classes.

---

#### Strategy 3: Multinomial Logistic Regression (Softmax Regression)
*   **Mechanism**: Softmax Regression generalizes Logistic Regression to directly model multi-class probability using a single joint model. We define a separate weight vector $\mathbf{w}_j$ and bias $b_j$ for each class $j \in \{1, \dots, C\}$.
*   For an input vector $\mathbf{x}$, we calculate a raw score (called a **logit**) $z_j$ for each class:
    $$z_j = \mathbf{w}_j^T \mathbf{x} + b_j$$
*   We map these raw logits into a valid, normalized probability distribution (where all values lie in $[0, 1]$ and sum to exactly $1$) using the **Softmax function**:
    $$P(y = k \mid \mathbf{x}) = \frac{e^{z_k}}{\sum_{j=1}^{C} e^{z_j}} = \frac{e^{\mathbf{w}_k^T \mathbf{x} + b_k}}{\sum_{j=1}^{C} e^{\mathbf{w}_j^T \mathbf{x} + b_j}}$$

##### Step-by-Step Example & Explicit Calculations (Softmax):
Using the same subscription plan classes (**Basic, Standard, Premium**):
1.  **Calculate Logits**: For a specific customer, suppose our trained model outputs:
    *   $z_{\text{Basic}} = 2.0$
    *   $z_{\text{Standard}} = 1.0$
    *   $z_{\text{Premium}} = -1.0$
2.  **Calculate Exponentials ($e^{z_k}$)**:
    *   $e^{z_{\text{Basic}}} = e^{2.0} \approx \mathbf{7.389056}$
    *   $e^{z_{\text{Standard}}} = e^{1.0} \approx \mathbf{2.718282}$
    *   $e^{z_{\text{Premium}}} = e^{-1.0} \approx \mathbf{0.367879}$
3.  **Perform Sum of Exponentials (Denominator)**:
    $$\sum_{j=1}^{3} e^{z_j} = e^{2.0} + e^{1.0} + e^{-1.0}$$
    $$\sum_{j=1}^{3} e^{z_j} = 7.389056 + 2.718282 + 0.367879 = \mathbf{10.475217}$$
4.  **Perform Normalized Division for Each Class**:
    *   **Basic**:
        $$P(y = \text{Basic}) = \frac{7.389056}{10.475217} = 0.705384 \rightarrow \mathbf{70.54\%}$$
    *   **Standard**:
        $$P(y = \text{Standard}) = \frac{2.718282}{10.475217} = 0.259496 \rightarrow \mathbf{25.95\%}$$
    *   **Premium**:
        $$P(y = \text{Premium}) = \frac{0.367879}{10.475217} = 0.035119 \rightarrow \mathbf{3.51\%}$$
5.  **Probability Sum Validation Check**:
    $$\sum_{i=1}^{3} P(y=i) = 0.705384 + 0.259496 + 0.035119 = \mathbf{1.000000 \ (100\%)}$$
    The mathematical constraint holds perfectly.

##### Loss Function: Cross-Entropy (Multinomial Log-Loss)
To train Softmax regression, we minimize the **Cross-Entropy loss** over $N$ observations:
$$\mathcal{L}(\mathbf{W}) = -\frac{1}{N} \sum_{i=1}^{N} \sum_{k=1}^{C} y_{i,k} \ln\left(P(y_{i} = k \mid \mathbf{x}_i)\right)$$
Where $y_{i,k}$ is a binary indicator ($1$ if actual label of instance $i$ is class $k$, $0$ otherwise). This penalizes the model logarithmically based on how far its predicted probability deviates from the actual one-hot encoded ground truth.

---

### (ii) What is Logistic Regression & Sigmoid Curve Derivation (5 Marks)

#### 1. What is Logistic Regression?
Logistic Regression is a supervised learning classification algorithm used to predict the probability of a discrete target variable. It models the probability $P(y=1 \mid \mathbf{x})$ that a given input $\mathbf{x}$ belongs to a positive class. Although it contains "Regression" in its name, it is fundamentally a **classifier** that places a decision boundary (e.g., $P \ge 0.5$) on top of continuous probability estimates. 

Statistically, it is a **Generalized Linear Model (GLM)** where the target variable is assumed to follow a **Bernoulli distribution**, and the **link function** is the **logit function** which maps the linear prediction to probability.

---

#### 2. Converting the Line Equation into a Sigmoid Curve
To fit a binary classification problem, we must map an unbounded linear regression equation output to a bounded probability domain. This is achieved mathematically using the **log-odds (logit)** transformation.

```
DOMAIN MAPPING FLOW:
[Probability Space]        --->       [Odds Space]        --->       [Log-Odds Space]
    P ∈ (0, 1)                         Odds ∈ (0, ∞)                   ln(Odds) ∈ (-∞, ∞)
                       P / (1 - P)                     ln(P / (1 - P))
```

##### Step-by-Step Mathematical Derivation:

1.  **The Unbounded Linear Line Equation**: A standard linear regression model predicts a continuous, unbounded output $z$:
    $$z = \mathbf{w}^T \mathbf{x} + b$$
    Since $z \in (-\infty, +\infty)$, it cannot represent a probability $P \in [0, 1]$.

2.  **Introducing the Odds Ratio**: To restrict the lower bound to 0, we calculate the odds of an event occurring (probability of success divided by probability of failure):
    $$Odds = \frac{P}{1 - P}$$
    Since $P \in [0, 1]$, the $Odds \in [0, +\infty)$.

3.  **Introducing Log-Odds (Logit)**: To map the odds from $[0, +\infty)$ to the entire real line $(-\infty, +\infty)$ to match the range of our linear output $z$, we take the natural logarithm of the odds:
    $$\ln(Odds) = \ln\left(\frac{P}{1 - P}\right)$$
    We now set this log-odds equal to our linear equation $z$:
    $$\ln\left(\frac{P}{1 - P}\right) = \mathbf{w}^T \mathbf{x} + b$$

4.  **Solving for Probability $P$ (The Algebraic Conversion)**:
    - **Step 4a: Exponentiate both sides to remove the logarithm**:
      $$\frac{P}{1 - P} = e^{\mathbf{w}^T \mathbf{x} + b}$$
    - **Step 4b: Multiply by $(1 - P)$ to clear the denominator**:
      $$P = (1 - P) e^{\mathbf{w}^T \mathbf{x} + b}$$
    - **Step 4c: Expand the right side**:
      $$P = e^{\mathbf{w}^T \mathbf{x} + b} - P e^{\mathbf{w}^T \mathbf{x} + b}$$
    - **Step 4d: Group $P$ terms on the left side**:
      $$P + P e^{\mathbf{w}^T \mathbf{x} + b} = e^{\mathbf{w}^T \mathbf{x} + b}$$
    - **Step 4e: Factor out $P$ on the left side**:
      $$P \left(1 + e^{\mathbf{w}^T \mathbf{x} + b}\right) = e^{\mathbf{w}^T \mathbf{x} + b}$$
    - **Step 4f: Isolate $P$**:
      $$P = \frac{e^{\mathbf{w}^T \mathbf{x} + b}}{1 + e^{\mathbf{w}^T \mathbf{x} + b}}$$
    - **Step 4g: Divide the numerator and denominator by $e^{\mathbf{w}^T \mathbf{x} + b}$ (which is equivalent to multiplying by $e^{-(\mathbf{w}^T \mathbf{x} + b)}$)**:
      $$P = \frac{\frac{e^{\mathbf{w}^T \mathbf{x} + b}}{e^{\mathbf{w}^T \mathbf{x} + b}}}{\frac{1}{e^{\mathbf{w}^T \mathbf{x} + b}} + \frac{e^{\mathbf{w}^T \mathbf{x} + b}}{e^{\mathbf{w}^T \mathbf{x} + b}}}$$
      $$P = \frac{1}{e^{-(\mathbf{w}^T \mathbf{x} + b)} + 1}$$
      $$P = \frac{1}{1 + e^{-(\mathbf{w}^T \mathbf{x} + b)}}$$

5.  **The Sigmoid Function**: Replacing $\mathbf{w}^T \mathbf{x} + b$ back with $z$ yields the standard Sigmoid (Logistic) function:
    $$\sigma(z) = \frac{1}{1 + e^{-z}}$$
    This function compresses any real-valued continuous input $z$ into an S-shaped curve strictly bounded between $[0, 1]$, allowing the output to be interpreted directly as a probability.

---

#### 3. Mathematical Proof of the Sigmoid Derivative (High-Value Academic Concept)
Examiners frequently ask to prove that the derivative of the Sigmoid function satisfies the relation $\sigma'(z) = \sigma(z)(1 - \sigma(z))$.

**Proof**:
Given:
$$\sigma(z) = \frac{1}{1 + e^{-z}} = (1 + e^{-z})^{-1}$$
Using the power rule and the chain rule:
$$\sigma'(z) = \frac{d}{dz} \left[ (1 + e^{-z})^{-1} \right] = -1 \cdot (1 + e^{-z})^{-2} \cdot \frac{d}{dz}\left(1 + e^{-z}\right)$$
$$\sigma'(z) = -(1 + e^{-z})^{-2} \cdot \left(-e^{-z}\right) = \frac{e^{-z}}{(1 + e^{-z})^2}$$
Now, we algebraically rearrange this fraction:
$$\sigma'(z) = \frac{1}{1 + e^{-z}} \cdot \frac{e^{-z}}{1 + e^{-z}}$$
Since $\sigma(z) = \frac{1}{1 + e^{-z}}$:
$$\sigma'(z) = \sigma(z) \cdot \left( \frac{e^{-z}}{1 + e^{-z}} \right)$$
Add and subtract 1 in the numerator of the second term:
$$\frac{e^{-z}}{1 + e^{-z}} = \frac{(1 + e^{-z}) - 1}{1 + e^{-z}} = \frac{1 + e^{-z}}{1 + e^{-z}} - \frac{1}{1 + e^{-z}} = 1 - \sigma(z)$$
Substituting this back yields:
$$\sigma'(z) = \sigma(z)(1 - \sigma(z))$$
**Q.E.D.** *(This proves that the derivative of the sigmoid is incredibly simple to compute, which is highly utilized in neural network backpropagation equations).*

---

### (iii) What is Regularization & Its Types (5 Marks)

#### 1. What is Regularization?
Regularization is a set of techniques used to prevent **overfitting** in machine learning models by adding a penalty term to the cost/loss function. Overfitting occurs when a model fits the training noise too closely, resulting in extremely large parameter weights ($\mathbf{w}$) and poor generalization on unseen test data. Regularization constrains or shrinks the model weights toward zero, simplifying the model's decision boundaries and ensuring better generalizability.

Mathematically, it balances the tradeoff between minimizing empirical training loss and minimizing model complexity:
$$Loss_{Regularized}(\mathbf{w}) = Loss_{original}(\mathbf{w}) + \lambda \cdot \Omega(\mathbf{w})$$
Where $\Omega(\mathbf{w})$ is the complexity penalty and $\lambda \ge 0$ is the regularization strength hyperparameter.

---

#### 2. Types of Regularization

##### Type 1: L1 Regularization (Lasso - Least Absolute Shrinkage and Selection Operator)
*   **Mechanism**: Adds a penalty proportional to the **sum of the absolute values** of the coefficients to the original loss function.
*   **Primal Formulation Under Constraint**:
    $$\min_{\mathbf{w}} Loss_{original} \quad \text{subject to} \quad \sum_{i=1}^{n} |w_i| \le t$$
*   **Mathematical Formula (Regularized Loss)**:
    $$Loss_{L1} = Loss_{original} + \lambda \sum_{i=1}^{n} |w_i|$$
*   **Why L1 Causes Sparsity (Geometric Intuition)**:
    In two dimensions ($w_1, w_2$), the L1 constraint region $\sum |w_i| \le t$ forms a **diamond shape with sharp corners (vertices) on the axes**. The contours of the original loss function expand outward from their unconstrained minimum. Because of the diamond's sharp corners, the loss function's contours are highly likely to first touch the constraint region at one of the corners on an axis (where one of the coefficients is exactly zero). This forces less important features to be completely eliminated.
*   **Optimization Challenge**:
    Because the L1 penalty $|w_i|$ is **non-differentiable at $w_i = 0$**, standard gradient descent cannot be directly applied. Advanced numerical optimization methods like **Coordinate Descent** or **Proximal Gradient Descent** are used instead to optimize Lasso objectives.

---

##### Type 2: L2 Regularization (Ridge Regression / Weight Decay)
*   **Mechanism**: Adds a penalty proportional to the **sum of the squared values** of the coefficients to the original loss function.
*   **Primal Formulation Under Constraint**:
    $$\min_{\mathbf{w}} Loss_{original} \quad \text{subject to} \quad \sum_{i=1}^{n} w_i^2 \le t$$
*   **Mathematical Formula (Regularized Loss)**:
    $$Loss_{L2} = Loss_{original} + \lambda \sum_{i=1}^{n} w_i^2$$
*   **Why L2 is called "Weight Decay" (Gradient Descent Update Proof)**:
    Let's derive the gradient descent update for the regularized loss function (assuming $\frac{1}{2}$ scaling factor on the penalty for mathematical convenience):
    $$Loss(\mathbf{w}) = Loss_{\text{original}}(\mathbf{w}) + \lambda \frac{1}{2} \sum_{i=1}^n w_i^2$$
    Taking the gradient with respect to parameter weight vector $\mathbf{w}$:
    $$\nabla_{\mathbf{w}} Loss(\mathbf{w}) = \nabla_{\mathbf{w}} Loss_{\text{original}}(\mathbf{w}) + \lambda \mathbf{w}$$
    The gradient descent update step is:
    $$\mathbf{w}^{(t+1)} = \mathbf{w}^{(t)} - \eta \nabla_{\mathbf{w}} Loss(\mathbf{w}^{(t)})$$
    Substituting our regularized gradient:
    $$\mathbf{w}^{(t+1)} = \mathbf{w}^{(t)} - \eta \left( \nabla_{\mathbf{w}} Loss_{\text{original}}(\mathbf{w}^{(t)}) + \lambda \mathbf{w}^{(t)} \right)$$
    $$\mathbf{w}^{(t+1)} = \mathbf{w}^{(t)} - \eta \lambda \mathbf{w}^{(t)} - \eta \nabla_{\mathbf{w}} Loss_{\text{original}}(\mathbf{w}^{(t)})$$
    $$\mathbf{w}^{(t+1)} = \mathbf{1 - \eta \lambda}\mathbf{w}^{(t)} - \eta \nabla_{\mathbf{w}} Loss_{\text{original}}(\mathbf{w}^{(t)})$$
    Since $\eta > 0$ (learning rate) and $\lambda > 0$, the term $(1 - \eta\lambda)$ is **strictly less than 1**. At every step of gradient descent, the weights are first scaled down (decayed) by this factor before the standard training loss gradient is subtracted. This keeps the model weights highly stable and bounded.

---

##### Type 3: Elastic Net Regularization
*   **Mechanism**: A hybrid approach that linearly combines both L1 (Lasso) and L2 (Ridge) penalties in the loss function.
*   **Mathematical Formula (Regularized Loss)**:
    $$Loss_{ElasticNet} = Loss_{original} + \lambda \left[ \alpha \sum_{i=1}^{n} |w_i| + (1 - \alpha) \sum_{i=1}^{n} w_i^2 \right]$$
    Where $\alpha \in [0, 1]$ is the mixing ratio.
*   **Business Impact**: Highly recommended when the number of features ($n$) is much larger than the number of training samples ($N$), or when there are multiple groups of strongly correlated variables. It selects groups of correlated features together (grouping effect) while still enforcing sparse selection.

---

### Summary Checklist for Exam Preparation
- **Multiclass**: 
  - *OvR*: Train $C$ models. Simple, but suffers from imbalance and unnormalized probabilities.
  - *OvO*: Train $\frac{C(C-1)}{2}$ models. Pairwise comparisons; voting-scheme prediction. High computational complexity ($O(C^2)$).
  - *Softmax*: Single model optimizing **Cross-Entropy loss** directly over a normalized probability distribution.
- **Sigmoid Conversion**:
  - Memorize the sequence: Linear Line Equation $\rightarrow$ Odds Ratio $\rightarrow$ Logit $\rightarrow$ Algebraic Rearrangement (isolate $P$) $\rightarrow$ Negative Exponent Division $\rightarrow$ Sigmoid Function.
  - **Be ready to prove** the derivative relation: $\sigma'(z) = \sigma(z)(1 - \sigma(z))$.
- **Regularization Intuition**:
  - *L1*: Diamond boundary, touches at corners, forces coefficients to $0$ (Automatic Feature Selection). Non-differentiable at 0 (requires Coordinate Descent).
  - *L2*: Circular boundary, touches smoothly, shrinks coefficients to near-$0$ but never exactly $0$ (Handles Multicollinearity). Mathematically derived as **Weight Decay** in gradient descent updates.
  - *Elastic Net*: Hybrid boundary, handles correlation groups and sparsity concurrently.
