---
sidebar_position: 3
title: The Matrix Formulation
description: Solving for every coefficient in one algebraic step — the design matrix, the column of ones, the normal equation verified against scikit-learn, and the three situations where the inverse does not exist.
tags: [machine-learning, linear-regression, numpy]
toc_max_heading_level: 3
---

# The Matrix Formulation

> **Topic —** Linear regression has a **closed-form solution**. Not an approximation, not an iterative
> search — one line of linear algebra that returns the exact best-fit coefficients. This page derives
> it, verifies it against scikit-learn digit for digit, and then shows the three cases where it
> collapses.

This is also where the linear algebra earns its place: matrices, transposes, inverses and rank all
appear for a concrete reason rather than as background.

---

## From equations to matrices

Multiple linear regression with two features and five samples is five equations:

```
 8 = b₀ + b₁(1) + b₂(2)
 7 = b₀ + b₁(2) + b₂(1)
15 = b₀ + b₁(3) + b₂(4)
14 = b₀ + b₁(4) + b₂(3)
20 = b₀ + b₁(5) + b₂(5)
```

Five equations, three unknowns. Writing them out one by one doesn't scale to 30 features and 20,000
rows, so they are stacked into matrices:

```text title="Output"
   X (5 samples x 2 features) =
[[1. 2.]
 [2. 1.]
 [3. 4.]
 [4. 3.]
 [5. 5.]]
   y = [ 8.  7. 15. 14. 20.]
```

The whole system becomes one statement:

```
y = X·β
```

where `X` holds the features, `β` (beta) is the column of coefficients we want, and `y` is the target.

---

## The column of ones

There is a problem with `y = X·β` as written: the intercept `b₀` has no feature to multiply. Every
other coefficient is attached to a column of `X`; `b₀` stands alone.

The fix is to **give it a column** — one filled entirely with `1`s:

```text title="Output"
   prepend a column of ones -> the design matrix:
[[1. 1. 2.]
 [1. 2. 1.]
 [1. 3. 4.]
 [1. 4. 3.]
 [1. 5. 5.]]
   shape (5, 3): 3 unknowns to solve for (b0, b1, b2)
```

Now `b₀` multiplies a column that is `1` in every row, so it contributes `b₀ × 1 = b₀` to every
prediction — exactly what an intercept does. The result is called the **design matrix**, and the
intercept has become an ordinary coefficient.

:::tip Why this trick matters

It is not cosmetic. Once the intercept is inside `β`, there is **no special case** — one matrix
equation solves for the intercept and all the slopes simultaneously. Every formula below works
unchanged whether or not there is an intercept.

The same device appears throughout machine learning; in a neural network the equivalent is called
the **bias** term, and it is implemented the same way.

:::

Note the shape bookkeeping: `X` is `(5, 3)` and `β` must be `(3,)` for `X·β` to produce the `(5,)`
predictions. The number of coefficients equals the number of **columns**, including the ones column.

---

## The normal equation

We want the `β` that minimises the sum of squared errors. Because squared error is convex and
differentiable, the minimum is where the derivative is zero — and solving that condition gives a
formula directly:

```
β = (Xᵀ X)⁻¹ Xᵀ y
```

This is the **normal equation**. Reading it right to left:

| Piece | Shape here | What it is |
|---|---|---|
| `Xᵀ` | `(3, 5)` | The transpose — rows become columns |
| `Xᵀ y` | `(3,)` | Each feature's correlation with the target, unnormalised |
| `Xᵀ X` | `(3, 3)` | Every feature against every other — the **Gram matrix** |
| `(Xᵀ X)⁻¹` | `(3, 3)` | Its inverse |
| `β` | `(3,)` | The coefficients |

Worked on our data:

```text title="Output"
   X^T X =
[[ 5. 15. 15.]
 [15. 55. 53.]
 [15. 53. 55.]]
   X^T y = [ 64. 223. 225.]

   beta = [2.1333 1.2778 2.2778]
   -> b0 = 2.1333, b1 = 1.2778, b2 = 2.2778
```

Two entries in `Xᵀ X` are worth naming. The top-left `5` is the **number of samples** — it is the
ones column dotted with itself. And `15` appears three times: the sum of each feature column, which
is that column dotted with the ones column.

`Xᵀ X` is always **square** (`features × features`) and **symmetric**, since the correlation of
feature `i` with `j` equals that of `j` with `i`. That symmetry is what makes the inverse tractable.

### Verified against scikit-learn

```text title="Output"
   scikit-learn: intercept = 2.1333, coef = [1.2778 2.2778]
   identical: True
```

Digit for digit. `LinearRegression` is not doing anything mysterious — it is solving this equation,
and `np.allclose` confirms the agreement exactly.

:::note What the model *is*

After fitting, a linear regression is **three numbers**. `b₀ = 2.1333`, `b₁ = 1.2778`, `b₂ = 2.2778`.
Prediction is one dot product.

That is the entire trained model — no stored training data, no tree structure, no iteration state.
It's worth contrasting with 1-nearest-neighbour, which stores the whole training set and does all its
work at prediction time. Linear regression is the opposite extreme: expensive to fit, trivial to
deploy.

:::

---

## Three ways it breaks

The formula requires `(Xᵀ X)⁻¹` to exist. A matrix has an inverse only if it is **full rank**, and
there are three ordinary situations in which it isn't.

### 1. Perfectly correlated features

The previous page showed coefficients destabilising as correlation approached `1.0`. At exactly `1.0`,
they stop existing:

```text title="Output"
   feature 2 = 2 x feature 1, exactly
   det(X^T X) = 0.000e+00
   rank(X) = 2, but X has 3 columns
   np.linalg.inv -> LinAlgError: Singular matrix
```

**The determinant is exactly zero and the matrix is singular.** `rank(X) = 2` against 3 columns means
one column carries no information the others don't already have — so the system has **infinitely many**
solutions, all fitting equally well, and no basis for choosing among them.

This is the endpoint of the collinearity story: at `corr = 0.999` the coefficient split was arbitrary
but unique; at `corr = 1.0` it isn't even unique.

### What scikit-learn does instead

```text title="Output"
   pseudo-inverse   = [-0.0015  0.5991  1.1982]
   scikit-learn     = [-0.0015 0.5991 1.1982]
   no exception — sklearn solves with lstsq/SVD, not an explicit inverse
   the true effect of 3.0 is split across the identical columns:
     0.5991 + 2 x 1.1982 = 2.9954
```

`LinearRegression` returned an answer where `np.linalg.inv` raised. It does not use an explicit
inverse — it calls `scipy.linalg.lstsq`, which uses **SVD** and returns the **minimum-norm** solution
when there are many: of all the equally-good answers, the one with the smallest coefficients.

And look at the last line. The true effect was `3.0`, and the pseudo-inverse split it as
`0.5991 + 2 × 1.1982 = 2.9954`. **The total is recovered exactly** even though the individual
coefficients are arbitrary — precisely the invariant the previous page measured.

:::warning No exception is not the same as no problem

`LinearRegression` will fit perfectly collinear data and report plausible-looking coefficients. Nothing
warns you. The predictions are fine; the coefficients are one arbitrary choice from an infinite set,
and any interpretation of them is meaningless.

Check `np.linalg.matrix_rank(X)` against `X.shape[1]`, or look at the correlation matrix, before
reading coefficients from any model.

:::

### 2. More features than samples

```text title="Output"
   X shape (3, 5) -> 5 unknowns from 3 equations
   rank(X) = 3: infinitely many exact solutions
   train R2 = 1.0000   <- meaningless
```

Three equations cannot pin down five unknowns. `Xᵀ X` is `(5, 5)` with rank at most `3`, so it is
singular for the same reason as above — and the model achieves a **perfect `R² = 1.0000`** on its
training data by passing exactly through every point.

That perfect score carries no information whatsoever. It is the
[memorisation](../02-data-preprocessing/06-train-test-split.md#why-hold-anything-back) problem in its
purest algebraic form: with `p ≥ n` an exact fit always exists.

This case is common in practice — genomics, text with one column per word, and any wide one-hot
encoding. It is one of the main reasons regularisation exists, since a penalty term makes `Xᵀ X + λI`
invertible even when `Xᵀ X` is not.

### 3. A constant column

A column with the same value in every row is a multiple of the ones column, so it too destroys
independence. That is precisely why the
[pre-flight audit](../02-data-preprocessing/01-loading-and-preparing-data.md#a-pre-flight-audit)
checked for constant columns — the `Region` column that was `EU` in every row would have made the
design matrix singular.

| Failure | Cause | Detect with |
|---|---|---|
| Perfect collinearity | A column is a combination of others | `matrix_rank(X) < X.shape[1]` |
| `p ≥ n` | Fewer samples than coefficients | `X.shape[0] <= X.shape[1]` |
| Constant column | It duplicates the ones column | `df[c].nunique() <= 1` |

---

## Why anyone bothers with gradient descent

If there is an exact formula, why does the next section spend its time on an iterative search?

| | Normal equation | Gradient descent |
|---|---|---|
| Result | **Exact** minimum | Approaches it iteratively |
| Cost | ~`O(p³)` for the inverse, `O(np²)` to form `Xᵀ X` | `O(np)` per step |
| Feasible at `p = 100,000` | **No** | Yes |
| Needs all data in memory | Yes | **No** — can stream batches |
| Works for other losses | **No** — squared error only | Any differentiable loss |
| Works for logistic regression | **No** | Yes |

Two rows decide it. The `p³` cost makes the closed form impractical once features run to tens of
thousands. And more fundamentally, **the closed form exists only for squared error** — logistic
regression's log loss has no closed-form solution at all, which is why the very next algorithm needs
an iterative method.

So the normal equation is the right tool for the problem it solves, and gradient descent is what you
use for everything else.

---

## Common Mistakes

| # | Mistake | Wrong | Right |
|---|---|---|---|
| 1 | Forgetting the ones column | `X` as loaded | The intercept needs a column to multiply |
| 2 | Mixing up the shapes | `β` has one entry per feature | One per **column**, including ones |
| 3 | Computing `inv(X.T @ X)` explicitly | It's the formula | Use `lstsq`/`pinv` — more stable |
| 4 | Reading "no exception" as "no problem" | It fitted, so it's fine | Coefficients may be arbitrary |
| 5 | Interpreting coefficients without checking rank | They came out of the fit | `matrix_rank(X)` vs `X.shape[1]` |
| 6 | Trusting `R² = 1.0` when `p ≥ n` | Perfect fit | An exact fit always exists |
| 7 | Leaving constant columns in | Harmless | They make the matrix singular |
| 8 | Assuming the closed form always applies | Regression is solved | Squared error only |
| 9 | Using the normal equation on wide data | It's exact, so it's better | `O(p³)` — infeasible |

---

## Summary

| | |
|---|---|
| System | `y = X·β` |
| Design matrix | `X` with a column of `1`s prepended |
| Normal equation | `β = (Xᵀ X)⁻¹ Xᵀ y` |
| `Xᵀ X` | Square, symmetric, `features × features` |
| Requires | `X` full rank |
| scikit-learn uses | `lstsq` / SVD, giving the minimum-norm solution |
| Rank check | `np.linalg.matrix_rank(X)` vs `X.shape[1]` |

**Key takeaways**

- Stacking the per-sample equations gives one statement, `y = X·β`
- The intercept gets a **column of ones** so it becomes an ordinary coefficient — no special case
  anywhere in the algebra; a neural network's **bias** term is the same device
- The number of coefficients equals the number of **columns**, ones column included
- `β = (Xᵀ X)⁻¹ Xᵀ y` is the **normal equation**, exact because squared error is convex and
  differentiable
- `Xᵀ X` is square and symmetric; its top-left entry is the **sample count**, from the ones column
  dotted with itself
- Verified `[2.1333, 1.2778, 2.2778]` against scikit-learn — **identical**, so `LinearRegression` is
  solving exactly this
- A fitted linear regression **is** those few numbers; prediction is one dot product, and no training
  data is retained
- Three failures: **perfect collinearity**, **`p ≥ n`**, and a **constant column** — all the same
  underlying defect, `X` not being full rank
- At exactly `corr = 1.0`, `det(Xᵀ X) = 0` and `np.linalg.inv` raises `LinAlgError`
- scikit-learn **does not raise** — it uses `lstsq`/SVD and returns the **minimum-norm** solution
- The pseudo-inverse still recovered the true total effect: `0.5991 + 2 × 1.1982 = 2.9954` against a
  true `3.0`
- With `p ≥ n`, `R² = 1.0000` on training data always, and means nothing
- The closed form exists **only for squared error**, which is why logistic regression needs gradient
  descent

**Next in this section:** [Loss Functions](../04-optimisation/01-loss-functions.md) — the closed
form exists only for squared error, so the next section begins by asking what else you might
minimise, and what that choice costs

**See also:** [Multiple Linear Regression](./02-multiple-linear-regression.md#when-coefficients-stop-meaning-anything)
for collinearity short of perfect · [Loading and Preparing Data](../02-data-preprocessing/01-loading-and-preparing-data.md#a-pre-flight-audit)
for the constant-column check · [Train / Test Split](../02-data-preprocessing/06-train-test-split.md#why-hold-anything-back)
for why a perfect training fit is worthless

---

## Run It Yourself

```python title="matrix_formulation.py"
"""The matrix formulation — solving regression in one algebraic step, and when it breaks."""

import warnings
import numpy as np
from sklearn.linear_model import LinearRegression

warnings.filterwarnings("ignore")
np.set_printoptions(precision=4, suppress=True)

# ---------- 1. the design matrix ----------
X_raw = np.array([[1.0, 2.0],
                  [2.0, 1.0],
                  [3.0, 4.0],
                  [4.0, 3.0],
                  [5.0, 5.0]])
y = np.array([8.0, 7.0, 15.0, 14.0, 20.0])
print("1. THE DESIGN MATRIX")
print(f"   X (5 samples x 2 features) =\n{X_raw}")
print(f"   y = {y}")

X = np.hstack([np.ones((len(X_raw), 1)), X_raw])
print(f"\n   prepend a column of ones -> the design matrix:\n{X}")
print(f"   shape {X.shape}: 3 unknowns to solve for (b0, b1, b2)")

# ---------- 2. the normal equation ----------
print("\n2. THE NORMAL EQUATION   beta = (X^T X)^-1 X^T y")
XtX, Xty = X.T @ X, X.T @ y
print(f"   X^T X =\n{XtX}")
print(f"   X^T y = {Xty}")
beta = np.linalg.inv(XtX) @ Xty
print(f"\n   beta = {beta}")
print(f"   -> b0 = {beta[0]:.4f}, b1 = {beta[1]:.4f}, b2 = {beta[2]:.4f}")

sk = LinearRegression().fit(X_raw, y)
print(f"\n   scikit-learn: intercept = {sk.intercept_:.4f}, coef = {sk.coef_}")
print(f"   identical: {np.allclose(beta, np.r_[sk.intercept_, sk.coef_])}")

# ---------- 3. when the inverse does not exist ----------
print("\n3. WHEN (X^T X)^-1 DOES NOT EXIST")
n = 50
rng = np.random.RandomState(0)
a = rng.normal(0, 1, n)
Xb = np.column_stack([np.ones(n), a, 2 * a])       # third column = 2 x second
yb = 3 * a + rng.normal(0, 0.1, n)
print(f"   feature 2 = 2 x feature 1, exactly")
print(f"   det(X^T X) = {np.linalg.det(Xb.T @ Xb):.3e}")
print(f"   rank(X) = {np.linalg.matrix_rank(Xb)}, but X has {Xb.shape[1]} columns")
try:
    np.linalg.inv(Xb.T @ Xb)
    print("   np.linalg.inv: succeeded")
except np.linalg.LinAlgError as e:
    print(f"   np.linalg.inv -> LinAlgError: {e}")

bp = np.linalg.pinv(Xb) @ yb
skb = LinearRegression().fit(Xb[:, 1:], yb)
print(f"\n   pseudo-inverse   = {bp}")
print(f"   scikit-learn     = [{skb.intercept_:.4f} {skb.coef_[0]:.4f} {skb.coef_[1]:.4f}]")
print(f"   no exception — sklearn solves with lstsq/SVD, not an explicit inverse")
print(f"   the true effect of 3.0 is split across the identical columns:")
print(f"     {bp[1]:.4f} + 2 x {bp[2]:.4f} = {bp[1] + 2 * bp[2]:.4f}")

# ---------- 4. more unknowns than equations ----------
print("\n4. MORE FEATURES THAN SAMPLES")
Xw = rng.normal(0, 1, (3, 5))
yw = rng.normal(0, 1, 3)
print(f"   X shape {Xw.shape} -> {Xw.shape[1]} unknowns from {Xw.shape[0]} equations")
print(f"   rank(X) = {np.linalg.matrix_rank(Xw)}: infinitely many exact solutions")
print(f"   train R2 = {LinearRegression().fit(Xw, yw).score(Xw, yw):.4f}   <- meaningless")
```

```text title="Output"
1. THE DESIGN MATRIX
   X (5 samples x 2 features) =
[[1. 2.]
 [2. 1.]
 [3. 4.]
 [4. 3.]
 [5. 5.]]
   y = [ 8.  7. 15. 14. 20.]

   prepend a column of ones -> the design matrix:
[[1. 1. 2.]
 [1. 2. 1.]
 [1. 3. 4.]
 [1. 4. 3.]
 [1. 5. 5.]]
   shape (5, 3): 3 unknowns to solve for (b0, b1, b2)

2. THE NORMAL EQUATION   beta = (X^T X)^-1 X^T y
   X^T X =
[[ 5. 15. 15.]
 [15. 55. 53.]
 [15. 53. 55.]]
   X^T y = [ 64. 223. 225.]

   beta = [2.1333 1.2778 2.2778]
   -> b0 = 2.1333, b1 = 1.2778, b2 = 2.2778

   scikit-learn: intercept = 2.1333, coef = [1.2778 2.2778]
   identical: True

3. WHEN (X^T X)^-1 DOES NOT EXIST
   feature 2 = 2 x feature 1, exactly
   det(X^T X) = 0.000e+00
   rank(X) = 2, but X has 3 columns
   np.linalg.inv -> LinAlgError: Singular matrix

   pseudo-inverse   = [-0.0015  0.5991  1.1982]
   scikit-learn     = [-0.0015 0.5991 1.1982]
   no exception — sklearn solves with lstsq/SVD, not an explicit inverse
   the true effect of 3.0 is split across the identical columns:
     0.5991 + 2 x 1.1982 = 2.9954

4. MORE FEATURES THAN SAMPLES
   X shape (3, 5) -> 5 unknowns from 3 equations
   rank(X) = 3: infinitely many exact solutions
   train R2 = 1.0000   <- meaningless
```

### What to notice in that output

- **`X^T X`'s top-left entry is `5`, the sample count.** It is the ones column dotted with itself, so
  it counts rows. The three `15`s are the column sums, from each feature dotted with the ones column —
  the matrix is readable once you know what produced it.
- **`identical: True`.** The hand-computed `β` and scikit-learn's fit agree to floating-point
  tolerance. There is no hidden machinery in `LinearRegression` for this problem.
- **`det(X^T X)` is `0.000e+00`, not merely small.** With an exact linear dependence the determinant is
  exactly zero, and `rank(X) = 2` against 3 columns says the same thing more usefully.
- **The pseudo-inverse and scikit-learn returned the *same* numbers** — `[-0.0015, 0.5991, 1.1982]`.
  That's the evidence for what sklearn does internally: it matches `pinv`, not `inv`.
- **`0.5991 + 2 × 1.1982 = 2.9954`** against a true effect of `3.0`. The split is arbitrary and the
  total is nearly exact — the same invariant the previous page found at `corr = 0.999`, now at
  `corr = 1.0`.
- **`R² = 1.0000` from three samples and five features.** No noise was removed and nothing was learned;
  a hyperplane can always be threaded through 3 points in 5 dimensions.

**Things worth trying:**

1. Change one value in `X_raw` and recompute `β` by hand-multiplying the matrices, then check against
   `LinearRegression`. Doing it once removes any remaining mystery.
2. Drop the ones column and solve without it. The fitted line is forced through the origin — compare
   the residuals.
3. Replace `np.linalg.inv` with `np.linalg.solve(XtX, Xty)`. Same answer, better numerics, and it's
   what you should use if you ever implement this.
4. Make the third column `2*a + 1e-10 * rng.normal(...)` — near-perfect rather than perfect
   collinearity. `inv` now succeeds and returns enormous coefficients, which is the numerical
   instability behind the previous page's exploding standard deviations.
5. Compute `np.linalg.cond(XtX)` for correlations of `0.5`, `0.99` and `0.999`. The **condition
   number** quantifies how close to singular a matrix is.

---

## Practice Questions

*Work each one out on paper first, then check it by running the code — everything you need is on
this page. **No answers are included, deliberately.***

| Tag | Means |
|---|---|
| **[THEORY]** | *Explain in words.* Definitions, reasons, comparisons. |
| **[PROG]** | *Write the program.* Complete, runnable code. |
| **[OUT]** | *Read the output.* Interpret given results exactly as printed. |
| **[ANALYZE]** | *Argue a position.* Weigh a claim, diagnose a failure, justify a trade-off. |

### The design matrix

**D1. [THEORY]** Write the matrix form of multiple linear regression, naming each symbol and its shape.

**D2. [THEORY]** Why is a column of ones prepended to `X`? What would happen without it?

**D3. [ANALYZE]** Explain how a coefficient multiplying a column of `1`s behaves as an intercept.

**D4. [THEORY]** For `X` of shape `(100, 7)` before the ones column is added, how many coefficients
will be solved for?

**D5. [THEORY]** What is this device called in a neural network?

### The normal equation

**N1. [THEORY]** Write the normal equation and describe each of `Xᵀ`, `Xᵀ y`, `Xᵀ X` and `(Xᵀ X)⁻¹`.

**N2. [THEORY]** What two properties of squared error make a closed-form solution possible?

**N3. [OUT]** In the worked output, `Xᵀ X` has `5` in its top-left position and `15` three times.
Explain where each comes from.

**N4. [THEORY]** What shape is `Xᵀ X`, and why is it symmetric?

**N5. [OUT]** The hand computation gave `[2.1333, 1.2778, 2.2778]` and scikit-learn agreed exactly.
What does that tell you about `LinearRegression`?

**N6. [ANALYZE]** After fitting, what *is* the model? Contrast with 1-nearest-neighbour.

### When it breaks

**B1. [THEORY]** Name the three situations in which `(Xᵀ X)⁻¹` does not exist, and give the single
underlying condition they share.

**B2. [OUT]** `det(Xᵀ X) = 0.000e+00` and `rank(X) = 2` with 3 columns. Explain both facts and what
they imply about the number of solutions.

**B3. [ANALYZE]** `np.linalg.inv` raised while `LinearRegression` returned coefficients. Explain what
scikit-learn does differently and what "minimum-norm solution" means.

**B4. [OUT]** The pseudo-inverse gave `0.5991` and `1.1982` where the true effect was `3.0`, and
`0.5991 + 2 × 1.1982 = 2.9954`. Explain what is recovered and what is arbitrary.

**B5. [ANALYZE]** "It fitted without an error, so the coefficients are usable." Rebut this.

**B6. [OUT]** Three samples and five features gave `R² = 1.0000`. Explain geometrically why an exact
fit always exists when `p ≥ n`.

**B7. [THEORY]** Name three real domains where `p ≥ n` is normal.

**B8. [THEORY]** Why does a constant column make the design matrix singular?

**B9. [PROG]** Write the two checks that detect rank deficiency and the `p ≥ n` case.

### Normal equation versus gradient descent

**G1. [THEORY]** Give three reasons gradient descent is used despite an exact formula existing.

**G2. [ANALYZE]** The normal equation costs roughly `O(p³)`. At `p = 100,000`, what does that imply?

**G3. [ANALYZE]** Which limitation is more fundamental — the cost, or the restriction to squared error?
Justify.

**G4. [THEORY]** Why can't the normal equation solve logistic regression?

### Applying it

**P1. [PROG]** Build the design matrix for a small dataset, compute `β` via the normal equation, and
assert it matches `LinearRegression`.

**P2. [PROG]** Solve the same system with `np.linalg.solve`, `np.linalg.pinv` and `np.linalg.lstsq`,
and compare all three against `inv`.

**P3. [PROG]** Construct an `X` whose third column is exactly the sum of the first two. Print the rank,
the determinant of `Xᵀ X`, and what `LinearRegression` returns.

**P4. [PROG]** Compute `np.linalg.cond(Xᵀ X)` for feature correlations of `0.5`, `0.9`, `0.99` and
`0.999`, and describe the trend.

**P5. [PROG]** Fit a model with more features than samples and print both the training `R²` and the
cross-validated `R²`.

**P6. [ANALYZE]** You inherit a model with 5,000 one-hot columns and 800 rows, reporting `R² = 1.0`.
Diagnose it and state what you would do.

### Quick self-check

1. Write the matrix form of linear regression.
2. Why prepend a column of ones?
3. Write the normal equation.
4. What shape is `Xᵀ X`, and what is its top-left entry?
5. What two properties of squared error permit a closed form?
6. What *is* a fitted linear regression?
7. Name the three ways the inverse fails.
8. What is `det(Xᵀ X)` under perfect collinearity?
9. Does `LinearRegression` raise on singular input?
10. What does it return instead?
11. What is recovered exactly when coefficients are arbitrary?
12. Why is `R² = 1.0` guaranteed when `p ≥ n`?
13. Give two reasons to prefer gradient descent.
