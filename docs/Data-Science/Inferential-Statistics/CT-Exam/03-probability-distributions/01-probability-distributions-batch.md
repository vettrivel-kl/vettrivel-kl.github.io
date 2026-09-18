---
sidebar_position: 1
title: Probability Distributions & Bayes
description: Complete step-by-step solutions for CT1 Probability Distribution questions
tags: [poisson, binomial, hypergeometric, bayes, ct-exam]
---
# CT1 Sample Questions — Batch 3: Probability Distributions & Bayes

This document provides rigorous, textbook-style solutions for the probability distribution and advanced Bayes' Theorem questions (Q10, Q11, Q12, Q13, and Q21) from the **IFS UNIT - 1 & 2** sample questions sheet. All formulas are rendered in LaTeX, with step-by-step mathematical derivations and formal academic inferences.

---

## Question 10: Bayes' Theorem / Posterior Analysis of Electronic Devices

### Given Data
Let $X, Y, Z$ represent the events that a produced device is of Type X, Type Y, or Type Z respectively. Let $D$ represent the event that a device is defective.

- **Defective conditional probabilities:**
  $$P(D \mid X) = 0.01, \quad P(D \mid Y) = 0.04, \quad P(D \mid Z) = 0.02$$
- **Posteriors of device type given a defective is found:**
  $$P(X \mid D) = 0.5, \quad P(Y \mid D) = 0.3, \quad P(Z \mid D) = 0.2$$

---

### Analysis & Derivations

The question asks: *"If a defective device is picked up from the factory, what is the most likely type of device?"*

#### Interpretation A: Direct Posterior Comparison (MAP Decision)
If we are given that a defective device has been picked up from the factory, we are seeking to find the maximum posterior probability:
$$\operatorname{argmax}_{k \in \{X,Y,Z\}} P(k \mid D)$$
Since the posteriors are explicitly provided in the problem statement:
- $P(X \mid D) = 0.5$ (or $50\%$)
- $P(Y \mid D) = 0.3$ (or $30\%$)
- $P(Z \mid D) = 0.2$ (or $20\%$)

**Conclusion A:** **Type X is the most likely type of device** among the defectives, with a probability of $0.5$.

---

#### Interpretation B: Deriving the Production Proportions (Priors)
To demonstrate advanced mastery, we can derive the overall production proportions (the priors $P(X), P(Y), P(Z)$) to see which device type the factory produces the most.

According to Bayes' Theorem:
$$P(k \mid D) = \frac{P(D \mid k)P(k)}{P(D)} \implies P(k) = \frac{P(k \mid D)P(D)}{P(D \mid k)}$$
Let $P(D) = c$ represent the total probability of a defective device (constant).
$$P(X) = \frac{0.5 \cdot c}{0.01} = 50c$$
$$P(Y) = \frac{0.3 \cdot c}{0.04} = 7.5c$$
$$P(Z) = \frac{0.2 \cdot c}{0.02} = 10c$$

Since the probabilities must sum to 1 ($P(X) + P(Y) + P(Z) = 1$):
$$50c + 7.5c + 10c = 1 \implies 67.5c = 1 \implies c = \frac{1}{67.5} = \frac{2}{135}$$

Now, substitute $c$ back to find the exact priors:
- **Prior of Type X:**
  $$P(X) = 50 \times \frac{2}{135} = \frac{100}{135} = \frac{20}{27} \approx 0.7407 \quad (74.07\%)$$
- **Prior of Type Y:**
  $$P(Y) = 7.5 \times \frac{2}{135} = \frac{15}{135} = \frac{3}{27} = \frac{1}{9} \approx 0.1111 \quad (11.11\%)$$
- **Prior of Type Z:**
  $$P(Z) = 10 \times \frac{2}{135} = \frac{20}{135} = \frac{4}{27} \approx 0.1481 \quad (14.81\%)$$

**Conclusion B:** If the question refers to the overall production volume of the factory, **Type X is the most likely type of device produced** by the factory, accounting for approximately $74.07\%$ of total production.

---

## Question 11: Bayes' Theorem / Posterior Analysis of Food Products

### Given Data
Let $D, E, F$ represent the events that an inspected food product is of Type D, Type E, or Type F respectively. Let $Def$ represent the event that a product is defective.

- **Defective conditional probabilities:**
  $$P(Def \mid D) = 0.03, \quad P(Def \mid E) = 0.01, \quad P(Def \mid F) = 0.04$$
- **Posteriors of product type given a defective is found:**
  $$P(D \mid Def) = 0.2, \quad P(E \mid Def) = 0.5, \quad P(F \mid Def) = 0.3$$

---

### Analysis & Derivations

The question asks: *"If a defective product is selected, what is the most likely type of food product it belongs to?"*

#### Interpretation A: Direct Posterior Comparison (MAP Decision)
Since we are given that a defective product has been selected, we compare the given posterior probabilities:
- $P(D \mid Def) = 0.2$ (or $20\%$)
- $P(E \mid Def) = 0.5$ (or $50\%$)
- $P(F \mid Def) = 0.3$ (or $30\%$)

**Conclusion A:** **Type E is the most likely type of food product** to have been selected among defectives, with a probability of $0.5$.

---

#### Interpretation B: Deriving the Production Proportions (Priors)
Let us compute the total production distribution (the priors $P(D), P(E), P(F)$) across the factory.

According to Bayes' Theorem:
$$P(k) = \frac{P(k \mid Def)P(Def)}{P(Def \mid k)}$$
Let $P(Def) = c$ represent the total probability of a defective product.
$$P(D) = \frac{0.2 \cdot c}{0.03} = \frac{20}{3}c = \frac{80}{12}c$$
$$P(E) = \frac{0.5 \cdot c}{0.01} = 50c = \frac{600}{12}c$$
$$P(F) = \frac{0.3 \cdot c}{0.04} = \frac{30}{4}c = \frac{90}{12}c$$

Summing the probabilities to 1:
$$\frac{80 + 600 + 90}{12} c = 1 \implies \frac{770}{12}c = 1 \implies c = \frac{12}{770} = \frac{6}{385}$$

Now, substitute $c$ back to find the priors:
- **Prior of Type D:**
  $$P(D) = \frac{80}{12} \times \frac{12}{770} = \frac{80}{770} = \frac{8}{77} \approx 0.1039 \quad (10.39\%)$$
- **Prior of Type E:**
  $$P(E) = \frac{600}{12} \times \frac{12}{770} = \frac{600}{770} = \frac{60}{77} \approx 0.7792 \quad (77.92\%)$$
- **Prior of Type F:**
  $$P(F) = \frac{90}{12} \times \frac{12}{770} = \frac{90}{770} = \frac{9}{77} \approx 0.1169 \quad (11.69\%)$$

**Conclusion B:** If the question refers to the overall production volume, **Type E is the most likely type of food product produced** by the facility, accounting for approximately $77.92\%$ of total production.

---

## Question 12: Poisson Distribution - Fire Alarm Activations

### Given Data
Let $X$ denote the number of fire alarm activations in a week.
- Average rate of activation ($\lambda$) = $2$ activations/week
- Distribution model: $X \sim \operatorname{Pois}(\lambda = 2)$

We seek the probability of exactly 3 alarm activations in a week: $P(X = 3)$.

---

### Step-by-Step Derivation

The Probability Mass Function (PMF) of a Poisson random variable is:
$$P(X = x) = \frac{e^{-\lambda} \lambda^x}{x!}$$

Substitute $\lambda = 2$ and $x = 3$:
$$P(X = 3) = \frac{e^{-2} 2^3}{3!}$$
$$P(X = 3) = \frac{e^{-2} \times 8}{6} = \frac{4}{3} e^{-2}$$

Using the approximation $e^{-2} \approx 0.135335$:
$$P(X = 3) \approx \frac{4}{3} \times 0.135335 \approx 0.180447$$

**Inference:** The probability that exactly 3 fire alarms will activate in a given week is approximately $18.04\%$.

---

## Question 13: Poisson Distribution - Coffee Shop Customer Arrivals

### Given Data
Let $X$ denote the number of customers arriving at a coffee shop in a given hour.
- Average rate of arrival ($\lambda$) = $10$ customers/hour
- Distribution model: $X \sim \operatorname{Pois}(\lambda = 10)$

We seek the probability of exactly 15 customer arrivals in an hour: $P(X = 15)$.

---

### Step-by-Step Derivation

Using the Poisson PMF:
$$P(X = x) = \frac{e^{-\lambda} \lambda^x}{x!}$$

Substitute $\lambda = 10$ and $x = 15$:
$$P(X = 15) = \frac{e^{-10} 10^{15}}{15!}$$

Given:
- $10^{15} = 10^{15}$
- $15! = 1,307,674,368,000 = 1.307674368 \times 10^{12}$
- $e^{-10} \approx 0.0000453999$

Substitute these numerical values:
$$P(X = 15) \approx \frac{0.0000453999 \times 10^{15}}{1.307674368 \times 10^{12}} = \frac{4.53999 \times 10^{10}}{1.307674368 \times 10^{12}}$$
$$P(X = 15) \approx \frac{4.53999}{130.7674368} \approx 0.034718$$

**Inference:** The probability that exactly 15 customers arrive in a given hour is approximately $3.47\%$.

---

## Question 21: Defective Bulbs - Binomial vs. Hypergeometric Models

### Given Data
- Total production batch size ($N$) = $1000$
- Probability of a bulb being defective ($p$) = $0.01$
- Number of defective bulbs in the run ($D$) = $1000 \times 0.01 = 10$
- Number of non-defective bulbs ($N - D$) = $990$
- Sample size selected ($n$) = $2$

Let $X$ denote the number of defective bulbs in our sample of size $2$. We solve this using both standard models to ensure complete accuracy.

---

### Model 1: Binomial Distribution (With Replacement Approximation)
Since $N$ is large relative to $n$, we can model this as $X \sim \operatorname{Bin}(n=2, p=0.01)$.

#### 1. Probability that both are defective ($P(X = 2)$)
$$P(X = 2) = \binom{2}{2} p^2 (1-p)^0 = (0.01)^2 = 0.0001$$

#### 2. Probability that both are non-defective ($P(X = 0)$)
$$P(X = 0) = \binom{2}{0} p^0 (1-p)^2 = (0.99)^2 = 0.9801$$

#### 3. Probability that one is defective and the other is non-defective ($P(X = 1)$)
$$P(X = 1) = \binom{2}{1} p^1 (1-p)^1 = 2 \times 0.01 \times 0.99 = 0.0198$$

---

### Model 2: Hypergeometric Distribution (Exact Without Replacement)
Since the bulbs are drawn *without replacement* from a finite batch of $1000$, the exact model is $X \sim \operatorname{Hypergeom}(N=1000, D=10, n=2)$.
$$P(X = x) = \frac{\binom{D}{x}\binom{N-D}{n-x}}{\binom{N}{n}}$$

Total combinations of choosing 2 bulbs out of 1000:
$$\binom{1000}{2} = \frac{1000 \times 999}{2} = 499500$$

#### 1. Probability that both are defective ($P(X = 2)$)
$$P(X = 2) = \frac{\binom{10}{2}\binom{990}{0}}{499500} = \frac{45 \times 1}{499500} = \frac{1}{11100} \approx 0.00009009$$

#### 2. Probability that both are non-defective ($P(X = 0)$)
$$P(X = 0) = \frac{\binom{10}{0}\binom{990}{2}}{499500} = \frac{1 \times \frac{990 \times 989}{2}}{499500} = \frac{489555}{499500} = \frac{10879}{11100} \approx 0.980090$$

#### 3. Probability that one is defective and the other is non-defective ($P(X = 1)$)
$$P(X = 1) = \frac{\binom{10}{1}\binom{990}{1}}{499500} = \frac{10 \times 990}{499500} = \frac{9900}{499500} = \frac{22}{1110} \approx 0.0198198$$

---

### Academic Summary of Results
| Event | Binomial Model (Approx) | Hypergeometric Model (Exact) |
| :--- | :---: | :---: |
| **Both Defective** | $0.000100$ ($0.01\%$) | $0.000090$ ($0.009\%$) |
| **Both Non-Defective** | $0.980100$ ($98.01\%$) | $0.980090$ ($98.01\%$) |
| **One Defective, One Non-Defective** | $0.019800$ ($1.98\%$) | $0.019820$ ($1.982\%$) |

> **Exam tip:** Mentioning both models in your answer shows exceptional depth. Explain that because the sample size ($n=2$) is extremely small compared to the population ($N=1000$), the Binomial model is an incredibly accurate approximation of the exact Hypergeometric process.

---

## Quick-Facts & Formula Sheet (Probability Distributions)

| Distribution Model | Probability Mass Function (PMF) | Mean ($\mu$) | Variance ($\sigma^2$) | Characteristics / Conditions |
| :--- | :--- | :--- | :--- | :--- |
| **Binomial** | $$P(X=k) = \binom{n}{k} p^k (1-p)^{n-k}$$ | $$np$$ | $$np(1-p)$$ | $n$ trials; binary outcomes; independent; constant success probability $p$. |
| **Poisson** | $$P(X=x) = \frac{e^{-\lambda} \lambda^x}{x!}$$ | $$\lambda$$ | $$\lambda$$ | Rare event count; continuous interval; rate $\lambda$ is constant; independence. |
| **Hypergeometric** | $$P(X=x) = \frac{\binom{D}{x}\binom{N-D}{n-x}}{\binom{N}{n}}$$ | $$n \left(\frac{D}{N}\right)$$ | $$n\left(\frac{D}{N}\right)\left(\frac{N-D}{N}\right)\left(\frac{N-n}{N-1}\right)$$ | Finite population $N$; $D$ items of interest; size $n$ sampled without replacement. |