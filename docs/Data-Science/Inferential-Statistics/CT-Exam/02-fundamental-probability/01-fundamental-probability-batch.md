---
sidebar_position: 1
title: Fundamental Probability
description: Complete step-by-step solutions for CT1 Fundamental Probability questions
tags: [probability, bayes, contingency-tables, ct-exam]
---
# CT1 Sample Questions — Batch 2: Fundamental Probability

This document provides rigorous, textbook-style solutions for the fundamental probability questions (Q4, Q5, Q6, Q15, Q16, Q22, and Q23) from the **IFS UNIT - 1 & 2** sample questions sheet. All formulas are rendered in LaTeX, with step-by-step mathematical derivations and formal academic inferences.

---

## Question 4: Successive Draws (Replacement vs. Non-Replacement)

### Given Data
A bag contains:
- **Red balls ($R$):** $3$
- **Black balls ($B$):** $6$
- **Total balls ($N$):** $9$

Let $R_1$ denote the event that the first ball drawn is red, and $R_2$ denote the event that the second ball drawn is red.

---

### Step-by-Step Derivation

#### (i) Case 1: With Replacement
If the first ball is replaced before the second draw, the trials are **independent**. The composition of the bag remains unchanged for both draws.

- Probability of first red ball:
  $$P(R_1) = \frac{3}{9} = \frac{1}{3}$$
- Since the ball is replaced, the conditional probability of the second draw is equal to its marginal probability:
  $$P(R_2 \mid R_1) = P(R_2) = \frac{3}{9} = \frac{1}{3}$$
- Joint probability of drawing two red balls in succession:
  $$P(R_1 \cap R_2) = P(R_1) \cdot P(R_2 \mid R_1) = \frac{1}{3} \times \frac{1}{3} = \frac{1}{9} \approx 0.1111$$

**Inference:** Under the independent trial condition (with replacement), the probability of drawing two red balls in succession is $1/9 \approx 11.11\%$.

---

#### (ii) Case 2: Without Replacement
If the first ball is not replaced, the trials are **dependent**. The composition of the bag for the second draw depends on the outcome of the first.

- Probability of first red ball:
  $$P(R_1) = \frac{3}{9} = \frac{1}{3}$$
- After drawing a red ball, the remaining red balls are $2$ and the total balls are $8$:
  $$P(R_2 \mid R_1) = \frac{2}{8} = \frac{1}{4}$$
- Joint probability of drawing two red balls in succession:
  $$P(R_1 \cap R_2) = P(R_1) \cdot P(R_2 \mid R_1) = \frac{1}{3} \times \frac{1}{4} = \frac{1}{12} \approx 0.0833$$

**Inference:** Under the dependent trial condition (without replacement), the probability of drawing two red balls in succession decreases to $1/12 \approx 8.33\%$ due to the depletion of the target class in the first draw.

---

## Question 5: Drawing Red Balls Without Replacement

### Given Data
A bag contains:
- **Red balls ($R$):** $3$
- **White balls ($W$):** $4$
- **Total balls ($N$):** $7$

We seek the joint probability of drawing two red balls in succession without replacement.

---

### Step-by-Step Derivation

Let $R_1$ and $R_2$ represent drawing a red ball on the first and second draws respectively.

- Probability of drawing red on the first draw:
  $$P(R_1) = \frac{3}{7}$$
- Since the draw is made without replacement, the conditional probability of drawing red on the second draw given that the first was red is:
  $$P(R_2 \mid R_1) = \frac{3-1}{7-1} = \frac{2}{6} = \frac{1}{3}$$
- Applying the multiplication rule for dependent events:
  $$P(R_1 \cap R_2) = P(R_1) \cdot P(R_2 \mid R_1) = \frac{3}{7} \times \frac{1}{3} = \frac{1}{7} \approx 0.1429$$

**Inference:** The probability that both drawn balls are red without replacement is $1/7 \approx 14.29\%$.

---

## Question 6: Bayes' Theorem and Bulbs from Selected Boxes

### Given Data
Let $B_1$ denote selecting Box 1, and $B_2$ denote selecting Box 2. Since the box selection is random:
$$P(B_1) = P(B_2) = 0.5$$

- **Box 1:** $1000$ bulbs total, $10\%$ defective ($100$ defective, $900$ non-defective).
- **Box 2:** $2000$ bulbs total, $5\%$ defective ($100$ defective, $1900$ non-defective).

Let $D_{both}$ denote the event that both drawn bulbs are defective (drawn without replacement).

---

### Step-by-Step Derivation

#### (i) Find the probability that both balls are defective ($P(D_{both})$)
Using the Law of Total Probability:
$$P(D_{both}) = P(D_{both} \mid B_1)P(B_1) + P(D_{both} \mid B_2)P(B_2)$$

First, calculate the conditional probabilities of drawing two defective bulbs from each box:
- **From Box 1:**
  $$P(D_{both} \mid B_1) = \frac{100}{1000} \times \frac{99}{999} = \frac{1}{10} \times \frac{11}{111} = \frac{11}{1110} \approx 0.009910$$
- **From Box 2:**
  $$P(D_{both} \mid B_2) = \frac{100}{2000} \times \frac{99}{1999} = \frac{1}{20} \times \frac{99}{1999} = \frac{99}{39980} \approx 0.002476$$

Now, substitute these into the total probability formula:
$$P(D_{both}) = 0.5 \times \left(\frac{11}{1110}\right) + 0.5 \times \left(\frac{99}{39980}\right)$$
$$P(D_{both}) = \frac{11}{2220} + \frac{99}{79960} = \frac{11 \times 3998 + 99 \times 111}{4437780 \times 2}$$
Let's calculate decimals to preserve absolute clarity:
$$P(D_{both}) \approx 0.00495495 + 0.00123812 = 0.00619307$$
Or in exact fractional representation:
$$P(D_{both}) = \frac{54967}{8875560} \approx 0.0061931$$

**Inference:** The total probability that both drawn bulbs are defective is approximately $0.619\%$.

---

#### (ii) Assuming both are defective, find the probability they came from Box 1 ($P(B_1 \mid D_{both})$)
Using Bayes' Theorem:
$$P(B_1 \mid D_{both}) = \frac{P(D_{both} \mid B_1)P(B_1)}{P(D_{both})}$$
$$P(B_1 \mid D_{both}) = \frac{\frac{11}{2220}}{\frac{54967}{8875560}} = \frac{11}{2220} \times \frac{8875560}{54967} = \frac{11 \times 3998}{54967} = \frac{43978}{54967} \approx 0.80008$$

**Inference:** Given that both drawn bulbs are defective, there is an $80.01\%$ posterior probability that they originated from Box 1. This higher probability is due to Box 1 having a significantly higher density of defective items ($10\%$) than Box 2 ($5\%$).

---

## Question 15: Course Enrollment Contingency Table Analysis

### Given Data
We construct a formal contingency table from the given data ($N = 200$):

| Gender | Mathematics ($M$) | Science ($S$) | Arts ($A$) | **Total** |
| :---: | :---: | :---: | :---: | :---: |
| **Male ($M_1$)** | $30$ | $50$ | $20$ | **$100$** |
| **Female ($F$)** | $20$ | $30$ | $50$ | **$100$** |
| **Total** | **$50$** | **$80$** | **$70$** | **$200$** |

---

### Step-by-Step Probability Calculations

#### A. Probability that a student is enrolled in Science ($P(S)$)
$$P(S) = \frac{n(S)}{N} = \frac{80}{200} = 0.40$$

#### B. Probability that a student is Female ($P(F)$)
$$P(F) = \frac{n(F)}{N} = \frac{100}{200} = 0.50$$

#### C. Probability that a student is a Male enrolled in Mathematics ($P(M_1 \cap M)$)
$$P(M_1 \cap M) = \frac{n(M_1 \cap M)}{N} = \frac{30}{200} = 0.15$$

#### D. Probability that a student is a Female enrolled in Arts ($P(F \cap A)$)
$$P(F \cap A) = \frac{n(F \cap A)}{N} = \frac{50}{200} = 0.25$$

#### E. Probability that a student is Male given they are enrolled in Science ($P(M_1 \mid S)$)
$$P(M_1 \mid S) = \frac{P(M_1 \cap S)}{P(S)} = \frac{n(M_1 \cap S)}{n(S)} = \frac{50}{80} = 0.625$$

#### F. Probability that a student is enrolled in Mathematics given they are Female ($P(M \mid F)$)
$$P(M \mid F) = \frac{P(M \cap F)}{P(F)} = \frac{n(M \cap F)}{n(F)} = \frac{20}{100} = 0.20$$

---

## Question 16: Family Vehicle Ownership Contingency Table

### Given Data
We construct the formal contingency table ($N = 300$):

| Family Class | Cars ($Ca$) | Motorcycles ($Mc$) | Bicycles ($Bi$) | **Total** |
| :---: | :---: | :---: | :---: | :---: |
| **With Children ($C$)** | $90$ | $30$ | $20$ | **$140$** |
| **Without Children ($NC$)** | $80$ | $50$ | $30$ | **$160$** |
| **Total** | **$170$** | **$80$** | **$50$** | **$300$** |

---

### Step-by-Step Probability Calculations

#### a. Probability that a selected family owns a motorcycle ($P(Mc)$)
$$P(Mc) = \frac{n(Mc)}{N} = \frac{80}{300} = \frac{4}{15} \approx 0.2667$$

#### b. Probability that a selected family has children ($P(C)$)
$$P(C) = \frac{n(C)}{N} = \frac{140}{300} = \frac{7}{15} \approx 0.4667$$

#### c. Probability that a selected family owns a car and has children ($P(Ca \cap C)$)
$$P(Ca \cap C) = \frac{n(Ca \cap C)}{N} = \frac{90}{300} = 0.30$$

#### d. Probability that a selected family owns a bicycle and has no children ($P(Bi \cap NC)$)
$$P(Bi \cap NC) = \frac{n(Bi \cap NC)}{N} = \frac{30}{300} = 0.10$$

#### e. Probability that a family has children given they own a car ($P(C \mid Ca)$)
$$P(C \mid Ca) = \frac{P(Ca \cap C)}{P(Ca)} = \frac{n(Ca \cap C)}{n(Ca)} = \frac{90}{170} \approx 0.5294$$

#### f. Probability that a family owns a motorcycle given they have no children ($P(Mc \mid NC)$)
$$P(Mc \mid NC) = \frac{P(Mc \cap NC)}{P(NC)} = \frac{n(Mc \cap NC)}{n(NC)} = \frac{50}{160} = 0.3125$$

---

## Question 22: Drawing King or Queen (Addition Rule)

### Given Data
A standard playing deck contains $N = 52$ cards.
- Number of Kings ($K$) = $4$
- Number of Queens ($Q$) = $4$

We seek the probability of drawing either a King or a Queen in a single draw ($P(K \cup Q)$).

---

### Step-by-Step Derivation

- Probability of drawing a King:
  $$P(K) = \frac{4}{52} = \frac{1}{13}$$
- Probability of drawing a Queen:
  $$P(Q) = \frac{4}{52} = \frac{1}{13}$$
- Since a card cannot be both a King and a Queen simultaneously, these events are **mutually exclusive**:
  $$P(K \cap Q) = 0$$
- Applying the general Addition Rule:
  $$P(K \cup Q) = P(K) + P(Q) - P(K \cap Q) = \frac{4}{52} + \frac{4}{52} - 0 = \frac{8}{52} = \frac{2}{13} \approx 0.1538$$

**Inference:** The probability of drawing a King or a Queen is $2/13 \approx 15.38\%$.

---

## Question 23: Club Membership Probability (Addition Rule)

### Given Data
Let $A$ denote membership in the Art Club, and $M$ denote membership in the Music Club.
- Probability of being in Art Club: $P(A) = 0.4$
- Probability of being in Music Club: $P(M) = 0.5$
- Probability of being in both clubs: $P(A \cap M) = 0.2$

We seek the probability of being a member of at least one club, i.e., $P(A \cup M)$.

---

### Step-by-Step Derivation

Applying the General Addition Rule of Probability:
$$P(A \cup M) = P(A) + P(M) - P(A \cap M)$$
Substitute the given values into the equation:
$$P(A \cup M) = 0.4 + 0.5 - 0.2 = 0.7$$

**Inference:** The probability that a randomly selected student is a member of at least one of the clubs is $0.70$ (or $70\%$). This accounts for the overlap of students who are members of both clubs, avoiding double-counting.

---

## Quick-Facts & Formula Sheet (Fundamental Probability)

| Concept / Axiom | Mathematical Formulation | Description / Note |
| :--- | :--- | :--- |
| **Probability Bounds** | $$0 \le P(A) \le 1$$ | Probability must lie in the range $[0, 1]$. |
| **Complement Rule** | $$P(A^c) = 1 - P(A)$$ | Probability of event $A$ not occurring. |
| **Addition Rule (Mutually Exclusive)** | $$P(A \cup B) = P(A) + P(B)$$ | If events cannot occur simultaneously ($P(A \cap B) = 0$). |
| **General Addition Rule** | $$P(A \cup B) = P(A) + P(B) - P(A \cap B)$$ | For any two overlapping events $A$ and $B$. |
| **Conditional Probability** | $$P(A \mid B) = \frac{P(A \cap B)}{P(B)}$$ | Probability of $A$ occurring given that $B$ has occurred. |
| **Multiplication Rule (Dependent)** | $$P(A \cap B) = P(B) \cdot P(A \mid B)$$ | Joint probability of dependent events. |
| **Multiplication Rule (Independent)** | $$P(A \cap B) = P(A) \cdot P(B)$$ | If occurrence of one doesn't affect the other ($P(A \mid B) = P(A)$). |
| **Law of Total Probability** | $$P(A) = \sum_{i=1}^k P(A \mid B_i)P(B_i)$$ | Where $B_1, \dots, B_k$ partition the sample space $\Omega$. |
| **Bayes' Theorem** | $$P(B_j \mid A) = \frac{P(A \mid B_j)P(B_j)}{\sum_{i=1}^k P(A \mid B_i)P(B_i)}$$ | Calculates posterior probability of partition $B_j$ given event $A$. |