---
sidebar_position: 2
title: Multiple Linear Regression
description: More than one feature — the normal equations solved by hand, why a coefficient changes when a correlated feature joins it, and the measurement showing Adjusted R² fails to penalise 100 columns of pure noise while cross-validation catches them cleanly.
tags: [machine-learning, linear-regression, scikit-learn]
toc_max_heading_level: 3
---

# Multiple Linear Regression

> **Topic —** The previous page fitted one feature and found something unresolved: `age` had a real
> effect of `−800` that its marginal correlation of `−0.0392` completely hid, and only became visible
> once `size`'s contribution was removed. Doing that removal automatically, for every feature at once,
> is what multiple regression *is*. This page works out how, and then asks which measure can be
> trusted to tell you whether an added feature helped.

---

## The model, and the meaning of one coefficient

Each feature gets its own coefficient:

```
y = b₀ + b₁x₁ + b₂x₂ + … + bₖxₖ
```

With one feature this is a line, with two a plane, with more a **hyperplane** — impossible to picture
and no different algebraically.

The definition of `bᵢ` is the part that carries all the weight:

> **Holding every other feature in the model constant**, one additional unit of `xᵢ` is associated
> with a `bᵢ` increase in `y`.

Both qualifications are load-bearing, and the first one is not a caveat but a description of what the
arithmetic actually does. **"Holding every other feature constant"** means `bᵢ` is fitted on the
variation in `xᵢ` that the other features cannot explain — exactly the residual-then-refit operation
the previous page did by hand. **"Is associated with"** is not "causes"; regression measures
association, and nothing about fitting a hyperplane establishes direction.

---

## Solving for two coefficients by hand

The two-feature case has a closed form small enough to compute on paper, and doing so shows where the
"holding constant" behaviour comes from mechanically.

Working in deviations from the means — `d₁ᵢ = x₁ᵢ − x̄₁`, and so on — the least-squares coefficients
satisfy two simultaneous equations, the **normal equations**:

```
S₁₁·b₁ + S₁₂·b₂ = S₁y
S₁₂·b₁ + S₂₂·b₂ = S₂y

  where   S₁₁ = Σd₁²      S₂₂ = Σd₂²      S₁₂ = Σd₁d₂
          S₁y = Σd₁dy     S₂y = Σd₂dy
```

`S₁₁` and `S₂₂` measure how much each feature varies. `S₁₂` measures how much they vary *together* —
and it is the only term that couples the two equations. Set `S₁₂ = 0` and they decouple completely:
`b₁ = S₁y/S₁₁` and `b₂ = S₂y/S₂₂`, each identical to its simple-regression value. **Everything
interesting about multiple regression lives in `S₁₂`.**

### Worked all the way through

Four rows, two features, chosen so the arithmetic stays exact:

| `x₁` | 1 | 2 | 3 | 4 |
|---|---|---|---|---|
| `x₂` | 2 | 3 | 1 | 4 |
| `y` | 7 | 10 | 8 | 13 |

`x̄₁ = 2.5`, `x̄₂ = 2.5`, `ȳ = 9.5`, and the five sums come out at `S₁₁ = 5`, `S₂₂ = 5`, `S₁₂ = 2`,
`S₁y = 8`, `S₂y = 9`. So:

```
5·b₁ + 2·b₂ = 8
2·b₁ + 5·b₂ = 9
```

Solve by determinants (Cramer's rule):

```
det = S₁₁·S₂₂ − S₁₂²  =  5×5 − 2²  =  21

      S₁y·S₂₂ − S₁₂·S₂y     8×5 − 2×9     22
b₁ = ───────────────────  = ───────────  = ──── = 1.0476
             det                 21         21

      S₁₁·S₂y − S₁₂·S₁y     5×9 − 2×8     29
b₂ = ───────────────────  = ───────────  = ──── = 1.3810
             det                 21         21

b₀ = ȳ − b₁x̄₁ − b₂x̄₂  =  9.5 − 1.0476×2.5 − 1.3810×2.5  =  3.4286
```

Against scikit-learn: `intercept_ = 3.4286`, `coef_ = [1.0476 1.3810]`. **Identical.**

:::tip That determinant is the whole story of collinearity

`det = S₁₁S₂₂ − S₁₂²` sits in the denominator of both coefficients. `S₁₂` is the coupling term, so as
the two features become more alike, `S₁₂²` grows toward `S₁₁S₂₂` and **the determinant heads to zero**
— dividing by something arbitrarily small. That is the algebraic source of every instability later on
this page, and at exactly `S₁₂² = S₁₁S₂₂` the determinant is zero and there is no unique solution at
all, which is [the next page](./03-the-matrix-formulation.md#three-ways-it-breaks)'s
subject.

:::

The same structure generalises: with `k` features you get `k` simultaneous equations, which is
unwieldy by hand and elegant in matrix form — hence the next page.

---

## What "holding all else constant" does to a coefficient

A coefficient's value depends on **what else is in the model**. Two cases on the house-price data,
where the truth is `price = 3000·size − 800·age + 50000`:

```text title="Output"
2. WHAT 'HOLDING ALL ELSE CONSTANT' DOES TO A COEFFICIENT
   size's DIRECT effect is 3000 in both models.
   but rooms = 2 + 0.05·size, so in the second model size ALSO acts
   through rooms: 3000 + 5000×0.05 = 3250 is its total marginal effect.

   pair              corr  size alone  size joint    shift
   size, age       0.0614     3043.86     3062.84   +18.98
   size, rooms     0.8244     3218.22     2921.04  -297.18
```

**With a near-orthogonal partner, the coefficient barely moves.** `size` and `age` correlate at
`0.0614`, and `size`'s coefficient shifts by `+18.98` — under 1% — between the solo and joint fits.
`S₁₂ ≈ 0`, so the equations nearly decouple and each feature is estimated as though the other were not
there.

**With a correlated partner, it moves substantially and for a specific reason.** `rooms` is built as
`2 + 0.05·size`, correlating with `size` at `0.8244`. Now `size` influences `price` through two
channels: directly at `3000`, and through `rooms` at `5000 × 0.05 = 250`. Its **total** marginal
effect is therefore `3250`, and its **direct** effect is `3000`.

Read the row against those two numbers and it is exactly right:

| Fit | Measured | Estimating | True value |
|---|---|---|---|
| `size` alone | **`3218.22`** | Total effect, both channels | `3250` |
| `size` with `rooms` | **`2921.04`** | Direct effect, `rooms` held constant | `3000` |

Neither is wrong. They answer different questions. The solo fit answers *"if I see a bigger house,
how much more does it cost?"* — which includes the extra rooms that come with it. The joint fit
answers *"for two houses with the same number of rooms, how much does extra floor area add?"*

:::danger A coefficient is not a property of a feature

It is a property of a feature **in a particular model**. Add or drop a correlated column and it
changes — `3218.22` to `2921.04` here. Reporting "size is worth 3000 per unit" without stating what
else was in the model is not a rounding-level imprecision; it is an incomplete statement.

:::

---

## Marginal correlation is a poor screen

The obvious way to choose features is to rank them by correlation with the target and keep the strong
ones. On this data that ranking is:

```text title="Output"
3. MARGINAL CORRELATION AS A FEATURE SCREEN
   corr(size, price)        =  +0.9849
   corr(age, price)         =  -0.0392
   corr(door_colour, price) =  +0.0419
```

`age`, with a real effect of `−800` per year, ranks **below** `door_colour`, which is pure noise. Any
threshold that keeps `door_colour` keeps `age`, and any threshold that drops `age` drops nothing else
of value — the screen simply carries no information about these two.

Now fit them in combination:

```text title="Output"
   features                     k  train R²    CV R²   adj R²
   size                         1    0.9700   0.9661   0.9698
   size, age                    2    0.9800   0.9773   0.9797
   size, age, door_colour       3    0.9800   0.9766   0.9795
   size, age + 20 noise        22    0.9838   0.9732   0.9802
```

Three readings, in increasing order of importance.

**`age` genuinely helps.** CV `R²` rises `0.9661 → 0.9773` when it joins `size`, despite that marginal
correlation of `−0.0392`. The joint fit finds the effect the screen missed, for the reason the previous
page demonstrated: once `size` is accounted for, `age` correlates with what remains at `−0.5758`.

**`door_colour` is harmless in small numbers.** Train `R²` unchanged at `0.9800`, CV `R²` down a hair
to `0.9766`. One irrelevant column costs almost nothing.

**Twenty noise columns raised train `R²` to `0.9838` while CV `R²` fell to `0.9732`.** Both numbers
moved, in opposite directions, from the same change.

:::danger Training `R²` never decreases when you add a feature

Not "rarely" — **never**, as a mathematical fact. The model can always set a new coefficient to zero
and do exactly as well as before, so the best achievable fit is at least as good as it was. Twenty
columns of noise bought `+0.0038` of training `R²` and cost `−0.0041` of measured out-of-sample
performance.

So training `R²` cannot be used to decide whether a feature belongs.

:::

The standard answer to that problem is Adjusted R², which penalises the model for the number of
features it uses. Look at its column above: `0.9797` for `size, age`, and **`0.9802`** for the same
model plus twenty columns of pure noise. It ranks the noise model **higher**.

---

## Does Adjusted R² actually catch the noise?

That single comparison could be luck, so here is the sweep: noise columns from 0 to 100 on `n = 120`
rows, every row averaged over 30 independent regenerations of both the data and the noise.

```text title="Output"
4. DOES ADJUSTED R² CATCH THE NOISE COLUMNS?   (30 seeds per row)
    noise cols    k   train R²    adj R²     CV R²
             0    2     0.9782    0.9779    0.9751
             5    7     0.9792    0.9779    0.9737
            10   12     0.9799    0.9777    0.9719
            20   22     0.9817    0.9776    0.9675
            30   32     0.9842    0.9783    0.9649
            40   42     0.9857    0.9779    0.9537
            60   62     0.9898    0.9787    0.9289
            80   82     0.9931    0.9779    0.8184
           100  102     0.9971    0.9794    0.5904

   baseline adj R² (0 noise) = 0.9779
   adj R² range across the sweep = 0.9776 to 0.9794   (spread 0.0018)
   adj R² monotonically decreasing?  False
   adj R² ever below baseline and STAYS below?  False
   adj R² at k=102 (0.9794) vs baseline (0.9779): ABOVE
   CV R² monotonically decreasing?  True
   CV R² fell 0.9751 -> 0.5904  (loss of 0.3847)
```

The result is unambiguous and not what Adjusted R² is usually sold as doing.

**Adjusted R² is flat.** Across the entire sweep it moves between `0.9776` and `0.9794` — a total
spread of **`0.0018`** — while the number of useless columns goes from 0 to 100. It is not
monotonically decreasing, it never settles below its own baseline, and at `k = 102` on `n = 120` rows
— **85% as many features as rows** — it reads `0.9794`, *higher* than the `0.9779` it started at.

**Cross-validated `R²` falls monotonically and catastrophically**, `0.9751 → 0.5904`. It loses
**`0.3847`** of `R²`, and every single step is downward.

### Why the penalty fails

Adjusted R² is

```
adj R² = 1 − (1 − R²) × (n − 1) / (n − k − 1)
```

and the mechanism is a race between two quantities that happen to grow at similar rates. As `k` rises,
the penalty factor `(n−1)/(n−k−1)` grows — at `k = 102, n = 120` it is `119/17 = 7.0`, a sevenfold
inflation of the unexplained variance. But `(1 − R²)` is *shrinking* at almost exactly the rate that
offsets it, because spurious columns inflate train `R²`: from `0.9782` to `0.9971`, so `(1 − R²)` goes
`0.0218 → 0.0029`, a factor of **7.5**.

Multiply the two and you get roughly what you started with. The penalty is real, correctly
implemented, and almost exactly cancelled by the overfitting it is meant to expose.

:::danger Adjusted R² is not an overfitting guard

At `n = 120` it failed to flag 100 columns of pure noise. It is a mild correction for the fact that
`R²` cannot decrease — useful for comparing two models that differ by a feature or two, and no
substitute for measuring out-of-sample performance.

The number that worked here is **cross-validated `R²`**, which fell monotonically and by `0.3847`.
When train `R²` and CV `R²` diverge, the training number is the one lying — and Adjusted R² is close
enough to a training number to lie with it.

:::

This is also why the honest form of the earlier claim matters: Adjusted R² and cross-validation are
often presented as two interchangeable remedies for feature-count inflation. On this data they are
not remotely interchangeable. Only one of them worked.

---

## When coefficients stop meaning anything

The determinant warning from the hand-worked fit, measured. Two features, each with a true coefficient
of exactly `3.00`, fitted 40 times at increasing correlation between them:

```text title="Output"
5. MULTICOLLINEARITY — true coefficients are 3.00 and 3.00 in every row
    corr(x1,x2)  mean coef1  mean coef2     sum  std of coef1
          0.000      2.9927      3.0017  5.9944        0.0646
          0.500      2.9918      3.0019  5.9937        0.0718
          0.900      2.9893      3.0038  5.9931        0.1426
          0.990      2.9810      3.0118  5.9928        0.4500
          0.999      2.9554      3.0373  5.9928        1.4312
```

Read the columns carefully, because the result is subtle:

- **The means stay correct.** `2.9554` and `3.0373` at the extreme — still centred near `3.00`.
  Collinearity does **not** bias the coefficients.
- **The sum stays exact.** `5.9928` in the last three rows, against a true total of `6.00`, and it
  barely moves across the whole table.
- **The spread explodes.** Standard deviation of the first coefficient goes `0.0646 → 1.4312` — **22×
  larger** — and most of that happens between `0.99` and `0.999`.

The interpretation is precise and worth stating carefully: when two features carry nearly the same
information, the data determines their **combined** effect perfectly well and says almost nothing
about how to **divide** it between them. Any individual fit picks a split more or less arbitrarily,
and the next sample picks a different one.

This is **multicollinearity**. Its consequences:

| Affected | How |
|---|---|
| Predictions | **Barely** — the sum is what drives them, and the sum is stable |
| Individual coefficients | **Severely** — unstable, and can even flip sign |
| Interpretation | **Fatally** — "size adds 3000" is not a supportable claim |
| Standard errors | Inflated, so significance tests fail to reject |

### What ridge does about it

Ridge regression adds a penalty on the size of the coefficients, which resolves the ambiguity by
preferring the split that keeps them small. At `corr = 0.999`:

```text title="Output"
6. RIDGE AT corr = 0.999   (40 seeds, 150 train / 50 test)
   model                 mean coef1  mean coef2  std coef1     sum   test R²
   LinearRegression          3.2657      2.7314     1.8311  5.9971    0.9710
   Ridge(alpha=1.0)          3.0206      2.9563     0.2378  5.9769    0.9713
```

**The stability gain is dramatic.** Coefficient spread drops `1.8311 → 0.2378`, an **87% reduction**,
and the split becomes even: the gap between the two means narrows from `0.5342` to `0.0644`.

**The prediction gain is nil.** Test `R²` goes `0.9710 → 0.9713` — an improvement of **`0.0003`**,
which is nothing.

That pairing is the lesson, and it confirms the thesis of the table above from the opposite direction:
since collinearity was never damaging the predictions, fixing collinearity cannot improve them. What
ridge buys is **coefficients you can report and reproduce**. Whether that is worth a small bias
depends entirely on whether anyone is going to read the coefficients.

:::note Regularisation gets its own treatment later

Ridge appears here only as the direct answer to collinearity. The penalty term, choosing its strength,
and the different behaviour of **lasso** — which drives coefficients to exactly zero rather than
merely shrinking them — belong with **generalisation and model control**.

:::

---

## Common Mistakes

| # | Mistake | Wrong | Right |
|---|---|---|---|
| 1 | Reading a coefficient without the caveat | "size adds 3000" | *Holding all else constant*, and *associated with* |
| 2 | Treating a coefficient as causal | Association implies cause | It does not |
| 3 | Expecting a coefficient to be stable across models | It's the feature's effect | `3218.22` alone, `2921.04` with `rooms` |
| 4 | Comparing a solo and a joint coefficient as if one is wrong | One must be the error | They estimate **total** vs **direct** effect |
| 5 | Selecting features by marginal correlation | Weak correlation ⇒ drop it | `age` at `−0.0392` ranked below pure noise |
| 6 | Using training `R²` to add features | Higher is better | It **never** decreases; 20 noise columns raised it |
| 7 | Trusting Adjusted R² to catch overfitting | That's its job | It read **higher** at `k = 102` than at `k = 2` |
| 8 | Treating Adjusted R² and CV as interchangeable | Both penalise complexity | CV fell `0.3847`; Adjusted R² moved `0.0018` |
| 9 | Ignoring multicollinearity | Predictions are fine | They are — **interpretation isn't** |
| 10 | Believing collinearity biases coefficients | The estimates are wrong | Means stay right; **spread** explodes 22× |
| 11 | Interpreting one coefficient of a collinear pair | "x1 contributes 2.9554" | Only their **sum** is identified |
| 12 | Expecting ridge to improve predictions | It fixes the problem | It gained `0.0003`; it buys **stability** |

---

## Summary

| | |
|---|---|
| Model | `y = b₀ + b₁x₁ + … + bₖxₖ` |
| Two-feature solution | Normal equations, `det = S₁₁S₂₂ − S₁₂²` |
| The coupling term | `S₁₂` — zero means the features decouple entirely |
| Coefficient reads as | Change in `y` per unit of `xᵢ`, **all else in the model held constant** |
| Feature screening | Marginal correlation is a weak screen; fit jointly |
| Judging an added feature | **Cross-validated `R²`** — not train `R²`, not Adjusted R² |
| Collinearity harms | **Interpretation**, not prediction |
| Ridge buys | Coefficient **stability**, not accuracy |

**Key takeaways**

- A coefficient means *"per unit of this feature, **holding the others constant**"*, and *"is
  associated with"*, never *"causes"*
- The two-feature fit is two simultaneous equations; hand-solved `b₀ = 3.4286`, `b₁ = 1.0476`,
  `b₂ = 1.3810` with `det = 21` — **identical** to scikit-learn
- **`S₁₂` is the only term coupling the equations.** At `S₁₂ = 0` multiple regression collapses into
  independent simple regressions
- `det = S₁₁S₂₂ − S₁₂²` sits in both denominators, so as features become alike the determinant heads
  to zero — the algebraic root of every instability here
- A coefficient is a property of a feature **in a model**, not of the feature: `size` measured
  `3218.22` alone and `2921.04` beside `rooms`
- Those two numbers estimate different things — **total** effect (`3250` true) versus **direct**
  effect (`3000` true) — and both were right
- With a near-orthogonal partner (`corr = 0.0614`) the coefficient moved only `+18.98`; with a
  correlated one (`corr = 0.8244`), `−297.18`
- `age` ranked **below pure noise** on marginal correlation (`−0.0392` vs `+0.0419`) yet lifted CV `R²`
  from `0.9661` to `0.9773`
- **Training `R²` never decreases when you add a feature** — 20 noise columns took it to `0.9838`
  while CV `R²` fell to `0.9732`
- **Adjusted R² failed completely as an overfitting guard**: across 0 → 100 noise columns it moved
  within a spread of `0.0018`, non-monotonically, and read **`0.9794` at `k = 102` against a `0.9779`
  baseline at `k = 2`**
- The reason is a near-exact cancellation — the penalty factor grew `7.0×` while `(1 − R²)` shrank
  `7.5×`
- **CV `R²` fell monotonically from `0.9751` to `0.5904`**, a loss of `0.3847`; it is the measure that
  worked
- Under collinearity the coefficient **means stay correct** and their **sum stays exact** (`5.9928`
  against `6.00`), while the spread of a single estimate grew **22×**
- The data identifies the **combined** effect of correlated features, not the **split** — which is why
  interpretation fails and prediction survives
- Ridge cut coefficient spread by **87%** (`1.8311 → 0.2378`) and evened the split, for a test-`R²`
  gain of **`0.0003`** — it buys reportable coefficients, not accuracy

**Next in this section:** [The Matrix Formulation](./03-the-matrix-formulation.md) — the same solution
for any number of features in one algebraic step, and what happens when correlation reaches exactly 1.0

**See also:** [Simple Linear Regression](./01-simple-linear-regression.md#correlation-with-the-target-and-why-it-misleads)
for the partial correlation that revealed `age` · [Train / Test Split](../02-data-preprocessing/06-train-test-split.md#why-hold-anything-back)
for why CV `R²` is the number to trust · [Feature Scaling and Transformation](../02-data-preprocessing/04-feature-scaling-and-transformation.md)
for why ridge needs its features on comparable scales

---

## Run It Yourself

```python title="multiple_linear_regression.py"
"""Multiple linear regression — the normal equations by hand, what a coefficient means, and whether Adjusted R² earns its reputation."""

import numpy as np
from sklearn.linear_model import LinearRegression, Ridge
from sklearn.model_selection import cross_val_score

# ---------- 1. two features, solved by hand ----------
x1 = np.array([1, 2, 3, 4], dtype=float)
x2 = np.array([2, 3, 1, 4], dtype=float)
y = np.array([7, 10, 8, 13], dtype=float)
m1, m2, my = x1.mean(), x2.mean(), y.mean()
d1, d2, dy = x1 - m1, x2 - m2, y - my

S11, S22, S12 = (d1 ** 2).sum(), (d2 ** 2).sum(), (d1 * d2).sum()
S1y, S2y = (d1 * dy).sum(), (d2 * dy).sum()

print("1. TWO FEATURES, SOLVED BY HAND")
print(f"   {'x1':>4}{'x2':>4}{'y':>5}")
for a, b, c in zip(x1, x2, y):
    print(f"   {a:>4.0f}{b:>4.0f}{c:>5.0f}")
print(f"\n   means:  x̄1 = {m1}   x̄2 = {m2}   ȳ = {my}")
print(f"   S11 = {S11:.0f}   S22 = {S22:.0f}   S12 = {S12:.0f}   "
      f"S1y = {S1y:.0f}   S2y = {S2y:.0f}")
print(f"\n   normal equations:   {S11:.0f}·b1 + {S12:.0f}·b2 = {S1y:.0f}")
print(f"                       {S12:.0f}·b1 + {S22:.0f}·b2 = {S2y:.0f}")

det = S11 * S22 - S12 ** 2
b1 = (S1y * S22 - S12 * S2y) / det
b2 = (S11 * S2y - S12 * S1y) / det
b0 = my - b1 * m1 - b2 * m2
print(f"\n   det = {S11:.0f}×{S22:.0f} − {S12:.0f}² = {det:.0f}")
print(f"   b1  = ({S1y:.0f}×{S22:.0f} − {S12:.0f}×{S2y:.0f}) / {det:.0f} = {b1:.4f}")
print(f"   b2  = ({S11:.0f}×{S2y:.0f} − {S12:.0f}×{S1y:.0f}) / {det:.0f} = {b2:.4f}")
print(f"   b0  = {my} − {b1:.4f}×{m1} − {b2:.4f}×{m2} = {b0:.4f}")
print(f"   fitted:  ŷ = {b0:.4f} + {b1:.4f}·x1 + {b2:.4f}·x2")

fit = LinearRegression().fit(np.column_stack([x1, x2]), y)
print(f"\n   scikit-learn: intercept_ = {fit.intercept_:.4f}   "
      f"coef_ = {np.array2string(fit.coef_, precision=4, floatmode='fixed')}   -> identical")

# ---------- 2. what 'holding all else constant' costs ----------
r = np.random.RandomState(4)
n = 120
size = r.uniform(50, 200, n)
age = r.uniform(0, 50, n)
door = r.normal(0, 1, n)                       # front-door colour: pure noise
price = 3000 * size - 800 * age + 50000 + r.normal(0, 20000, n)

# rooms is built FROM size, so the two are strongly correlated
rooms = 2 + 0.05 * size + r.normal(0, 1.5, n)
price_r = 3000 * size + 5000 * rooms - 800 * age + 50000 + r.normal(0, 20000, n)

print("\n2. WHAT 'HOLDING ALL ELSE CONSTANT' DOES TO A COEFFICIENT")
print("   size's DIRECT effect is 3000 in both models.")
print("   but rooms = 2 + 0.05·size, so in the second model size ALSO acts")
print("   through rooms: 3000 + 5000×0.05 = 3250 is its total marginal effect.")
print(f"\n   {'pair':<14}{'corr':>8}{'size alone':>12}{'size joint':>12}{'shift':>9}")
for label, other, target in [("size, age", age, price), ("size, rooms", rooms, price_r)]:
    solo = LinearRegression().fit(size.reshape(-1, 1), target).coef_[0]
    joint = LinearRegression().fit(np.column_stack([size, other]), target).coef_[0]
    print(f"   {label:<14}{np.corrcoef(size, other)[0, 1]:>8.4f}{solo:>12.2f}"
          f"{joint:>12.2f}{joint - solo:>+9.2f}")
print("\n   expected:  size, age   -> both near 3000 (no other channel)")
print("              size, rooms -> alone near 3250, joint near 3000")

# ---------- 3. marginal correlation as a screen ----------
print("\n3. MARGINAL CORRELATION AS A FEATURE SCREEN")
for nm, v in [("size", size), ("age", age), ("door_colour", door)]:
    print(f"   corr({nm}, price)".ljust(28) + f"= {np.corrcoef(v, price)[0, 1]:>+8.4f}")

rn = np.random.RandomState(70)
noise20 = rn.normal(0, 1, (n, 20))
print(f"\n   {'features':<26}{'k':>4}{'train R²':>10}{'CV R²':>9}{'adj R²':>9}")
for label, cols in [("size", [size]),
                    ("size, age", [size, age]),
                    ("size, age, door_colour", [size, age, door]),
                    ("size, age + 20 noise", [size, age, noise20])]:
    F = np.column_stack(cols)
    k = F.shape[1]
    tr = LinearRegression().fit(F, price).score(F, price)
    cv = cross_val_score(LinearRegression(), F, price, cv=5, scoring="r2").mean()
    adj = 1 - (1 - tr) * (n - 1) / (n - k - 1)
    print(f"   {label:<26}{k:>4}{tr:>10.4f}{cv:>9.4f}{adj:>9.4f}")

# ---------- 4. does Adjusted R2 catch the noise? ----------
print("\n4. DOES ADJUSTED R² CATCH THE NOISE COLUMNS?   (30 seeds per row)")
print(f"   {'noise cols':>11}{'k':>5}{'train R²':>11}{'adj R²':>10}{'CV R²':>10}")
rows = []
for n_noise in [0, 5, 10, 20, 30, 40, 60, 80, 100]:
    tr_l, adj_l, cv_l = [], [], []
    for seed in range(30):
        ra = np.random.RandomState(seed + 500)
        sz = ra.uniform(50, 200, n)
        ag = ra.uniform(0, 50, n)
        pr = 3000 * sz - 800 * ag + 50000 + ra.normal(0, 20000, n)
        F = np.column_stack([sz, ag] + ([ra.normal(0, 1, (n, n_noise))] if n_noise else []))
        k = F.shape[1]
        tr = LinearRegression().fit(F, pr).score(F, pr)
        tr_l.append(tr)
        adj_l.append(1 - (1 - tr) * (n - 1) / (n - k - 1))
        cv_l.append(cross_val_score(LinearRegression(), F, pr, cv=5, scoring="r2").mean())
    rows.append((n_noise, k, np.mean(tr_l), np.mean(adj_l), np.mean(cv_l)))
    print(f"   {n_noise:>11}{k:>5}{np.mean(tr_l):>11.4f}{np.mean(adj_l):>10.4f}{np.mean(cv_l):>10.4f}")

base_adj = rows[0][3]
adj_all = [x[3] for x in rows]
cv_all = [x[4] for x in rows]
print(f"\n   baseline adj R² (0 noise) = {base_adj:.4f}")
print(f"   adj R² range across the sweep = {min(adj_all):.4f} to {max(adj_all):.4f}"
      f"   (spread {max(adj_all) - min(adj_all):.4f})")
print(f"   adj R² monotonically decreasing?  "
      f"{all(adj_all[i] >= adj_all[i + 1] for i in range(len(adj_all) - 1))}")
print(f"   adj R² ever below baseline and STAYS below?  "
      f"{any(all(a < base_adj for a in adj_all[i:]) for i in range(1, len(adj_all)))}")
print(f"   adj R² at k=102 ({adj_all[-1]:.4f}) vs baseline ({base_adj:.4f}): "
      f"{'ABOVE' if adj_all[-1] > base_adj else 'below'}")
print(f"   CV R² monotonically decreasing?  "
      f"{all(cv_all[i] >= cv_all[i + 1] for i in range(len(cv_all) - 1))}")
print(f"   CV R² fell {cv_all[0]:.4f} -> {cv_all[-1]:.4f}  (loss of {cv_all[0] - cv_all[-1]:.4f})")

# ---------- 5. two features carrying the same information ----------
print("\n5. MULTICOLLINEARITY — true coefficients are 3.00 and 3.00 in every row")
print(f"   {'corr(x1,x2)':>12}{'mean coef1':>12}{'mean coef2':>12}{'sum':>8}{'std of coef1':>14}")
for corr in [0.0, 0.5, 0.9, 0.99, 0.999]:
    c1, c2 = [], []
    for seed in range(40):
        rm = np.random.RandomState(seed + 100)
        a = rm.normal(0, 1, 200)
        b = corr * a + np.sqrt(1 - corr ** 2) * rm.normal(0, 1, 200)
        t = 3 * a + 3 * b + rm.normal(0, 1, 200)
        cf = LinearRegression().fit(np.column_stack([a, b]), t).coef_
        c1.append(cf[0]); c2.append(cf[1])
    print(f"   {corr:>12.3f}{np.mean(c1):>12.4f}{np.mean(c2):>12.4f}"
          f"{np.mean(c1) + np.mean(c2):>8.4f}{np.std(c1, ddof=1):>14.4f}")

# ---------- 6. ridge on the same collinear pair ----------
print("\n6. RIDGE AT corr = 0.999   (40 seeds, 150 train / 50 test)")
print(f"   {'model':<20}{'mean coef1':>12}{'mean coef2':>12}{'std coef1':>11}"
      f"{'sum':>8}{'test R²':>10}")
for name, model in [("LinearRegression", LinearRegression()), ("Ridge(alpha=1.0)", Ridge(alpha=1.0))]:
    c1, c2, sc = [], [], []
    for seed in range(40):
        rr2 = np.random.RandomState(seed + 200)
        a = rr2.normal(0, 1, 200)
        b = 0.999 * a + np.sqrt(1 - 0.999 ** 2) * rr2.normal(0, 1, 200)
        t = 3 * a + 3 * b + rr2.normal(0, 1, 200)
        X = np.column_stack([a, b])
        model.fit(X[:150], t[:150])
        c1.append(model.coef_[0]); c2.append(model.coef_[1])
        sc.append(model.score(X[150:], t[150:]))
    print(f"   {name:<20}{np.mean(c1):>12.4f}{np.mean(c2):>12.4f}"
          f"{np.std(c1, ddof=1):>11.4f}{np.mean(c1) + np.mean(c2):>8.4f}{np.mean(sc):>10.4f}")
```

```text title="Output"
1. TWO FEATURES, SOLVED BY HAND
     x1  x2    y
      1   2    7
      2   3   10
      3   1    8
      4   4   13

   means:  x̄1 = 2.5   x̄2 = 2.5   ȳ = 9.5
   S11 = 5   S22 = 5   S12 = 2   S1y = 8   S2y = 9

   normal equations:   5·b1 + 2·b2 = 8
                       2·b1 + 5·b2 = 9

   det = 5×5 − 2² = 21
   b1  = (8×5 − 2×9) / 21 = 1.0476
   b2  = (5×9 − 2×8) / 21 = 1.3810
   b0  = 9.5 − 1.0476×2.5 − 1.3810×2.5 = 3.4286
   fitted:  ŷ = 3.4286 + 1.0476·x1 + 1.3810·x2

   scikit-learn: intercept_ = 3.4286   coef_ = [1.0476 1.3810]   -> identical

2. WHAT 'HOLDING ALL ELSE CONSTANT' DOES TO A COEFFICIENT
   size's DIRECT effect is 3000 in both models.
   but rooms = 2 + 0.05·size, so in the second model size ALSO acts
   through rooms: 3000 + 5000×0.05 = 3250 is its total marginal effect.

   pair              corr  size alone  size joint    shift
   size, age       0.0614     3043.86     3062.84   +18.98
   size, rooms     0.8244     3218.22     2921.04  -297.18

   expected:  size, age   -> both near 3000 (no other channel)
              size, rooms -> alone near 3250, joint near 3000

3. MARGINAL CORRELATION AS A FEATURE SCREEN
   corr(size, price)        =  +0.9849
   corr(age, price)         =  -0.0392
   corr(door_colour, price) =  +0.0419

   features                     k  train R²    CV R²   adj R²
   size                         1    0.9700   0.9661   0.9698
   size, age                    2    0.9800   0.9773   0.9797
   size, age, door_colour       3    0.9800   0.9766   0.9795
   size, age + 20 noise        22    0.9838   0.9732   0.9802

4. DOES ADJUSTED R² CATCH THE NOISE COLUMNS?   (30 seeds per row)
    noise cols    k   train R²    adj R²     CV R²
             0    2     0.9782    0.9779    0.9751
             5    7     0.9792    0.9779    0.9737
            10   12     0.9799    0.9777    0.9719
            20   22     0.9817    0.9776    0.9675
            30   32     0.9842    0.9783    0.9649
            40   42     0.9857    0.9779    0.9537
            60   62     0.9898    0.9787    0.9289
            80   82     0.9931    0.9779    0.8184
           100  102     0.9971    0.9794    0.5904

   baseline adj R² (0 noise) = 0.9779
   adj R² range across the sweep = 0.9776 to 0.9794   (spread 0.0018)
   adj R² monotonically decreasing?  False
   adj R² ever below baseline and STAYS below?  False
   adj R² at k=102 (0.9794) vs baseline (0.9779): ABOVE
   CV R² monotonically decreasing?  True
   CV R² fell 0.9751 -> 0.5904  (loss of 0.3847)

5. MULTICOLLINEARITY — true coefficients are 3.00 and 3.00 in every row
    corr(x1,x2)  mean coef1  mean coef2     sum  std of coef1
          0.000      2.9927      3.0017  5.9944        0.0646
          0.500      2.9918      3.0019  5.9937        0.0718
          0.900      2.9893      3.0038  5.9931        0.1426
          0.990      2.9810      3.0118  5.9928        0.4500
          0.999      2.9554      3.0373  5.9928        1.4312

6. RIDGE AT corr = 0.999   (40 seeds, 150 train / 50 test)
   model                 mean coef1  mean coef2  std coef1     sum   test R²
   LinearRegression          3.2657      2.7314     1.8311  5.9971    0.9710
   Ridge(alpha=1.0)          3.0206      2.9563     0.2378  5.9769    0.9713
```

### What to notice in that output

- **`S₁₁` and `S₂₂` are both `5` while `S₁₂` is `2`.** The features are mildly related, so the
  equations are mildly coupled — and `det = 21` rather than `25`. Coupling costs determinant.
- **In section 2, the `size, age` shift is `+18.98` and the `size, rooms` shift is `−297.18`** — 16×
  larger, from a correlation 13× higher. And the shift has a *direction*: adding a positively
  correlated feature pulled `size`'s coefficient **down**, because `rooms` took its share of the credit.
- **`train R²` rises on every single row of section 4**, `0.9782` through `0.9971`, with nothing but
  noise being added. That column is a monotone function of `k`, not of model quality.
- **`adj R²` at 100 noise columns (`0.9794`) is higher than at 5 (`0.9779`).** Any decision rule of
  the form "prefer the higher Adjusted R²" picks the 102-feature model over the 7-feature one.
- **`CV R²` collapses fastest at the end** — `0.9289 → 0.8184 → 0.5904` for the last three rows. As
  `k` approaches `n`, out-of-sample performance falls off a cliff, and only this column shows it.
- **The `sum` column in section 5 reads `5.99` in all five rows.** That invariance is the whole story
  of multicollinearity: what the data can determine stays stable, and what it cannot determine is what
  moves.
- **`std of coef1` grows faster than the correlation does.** From `0.99` to `0.999` — a small change —
  the spread went `0.4500 → 1.4312`. The damage is highly non-linear in the correlation.
- **Ridge's `sum` (`5.9769`) is slightly further from `6.00` than OLS's (`5.9971`).** That is the bias
  the penalty introduces, and it is the price of the 87% variance reduction.

**Things worth trying:**

1. In section 1, change `x2` to `[2, 4, 6, 8]` — exactly `2×x1`. Then `det = 0`, and the hand solution
   divides by zero. Compare what `LinearRegression` returns instead of failing.
2. In section 4, raise `n` from `120` to `2000` while keeping the noise counts. Adjusted R² has far
   more room before `k` matters — find the `k/n` ratio where it finally starts falling.
3. In section 4, replace Adjusted R² with **AIC** or **BIC** and see whether either ranks the models
   correctly where Adjusted R² failed.
4. In section 6, sweep `alpha` over `[0.01, 0.1, 1, 10, 100]` and plot the trade: coefficient spread
   falls, and at some point test `R²` starts falling too.
5. In section 5, replace `LinearRegression` with `Ridge(alpha=1.0)` throughout and watch the
   `std of coef1` column stay flat as correlation climbs.

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

### Solving for the coefficients

**N1. [THEORY]** Write the two normal equations for a two-feature fit, defining all five sums.

**N2. [PROG]** For `x₁ = [1, 3, 5, 7]`, `x₂ = [2, 2, 4, 6]`, `y = [5, 9, 14, 20]`, compute all five
sums, the determinant, and all three coefficients by hand. Confirm with `LinearRegression`.

**N3. [THEORY]** What does `S₁₂ = 0` mean about the two features, and what happens to the normal
equations when it holds?

**N4. [ANALYZE]** Explain why `det = S₁₁S₂₂ − S₁₂²` approaching zero is the same event as the
coefficients becoming unstable.

**N5. [OUT]** In the worked example `S₁₁ = S₂₂ = 5` but `det = 21`, not `25`. Account for the
difference.

### What a coefficient means

**H1. [THEORY]** State the full reading of a coefficient `b₁ = 3000`, including both qualifications.

**H2. [OUT]** `size` measured `3218.22` alone and `2921.04` beside `rooms`. Explain why neither number
is an error.

**H3. [THEORY]** Given `rooms = 2 + 0.05·size` and a true `rooms` coefficient of `5000`, derive
`size`'s total marginal effect from its direct effect of `3000`.

**H4. [ANALYZE]** Which of the two fits would you use to advise a builder deciding whether to add
floor area, and which to advise a valuer pricing an existing house?

**H5. [OUT]** Adding `rooms` pulled `size`'s coefficient **down** by `297.18`. Why down rather than up?

**H6. [ANALYZE]** Why is it incomplete to report a coefficient without listing the model's other
features?

### Choosing features

**F1. [OUT]** `age` correlates `−0.0392` with price and `door_colour` `+0.0419`. One has a real effect
of `−800` and one is noise. What does that do to correlation-based screening?

**F2. [THEORY]** Why can training `R²` never decrease when a feature is added? Give the argument, not
just the fact.

**F3. [OUT]** Twenty noise columns took train `R²` to `0.9838` and CV `R²` to `0.9732`. Which number is
misleading, and why do they move in opposite directions?

**F4. [ANALYZE]** `age` improved CV `R²` from `0.9661` to `0.9773` despite near-zero marginal
correlation. Connect this to the partial correlation of `−0.5758` from the previous page.

### Adjusted R²

**A1. [THEORY]** Write the Adjusted R² formula and identify which term is the penalty.

**A2. [OUT]** At `k = 102` on `n = 120` rows, Adjusted R² read `0.9794` against a baseline of `0.9779`
at `k = 2`. State plainly what that means for using it to detect overfitting.

**A3. [ANALYZE]** The penalty factor grew `7.0×` while `(1 − R²)` shrank `7.5×`. Explain how those two
facts produce a flat Adjusted R², and why the near-cancellation is not a coincidence.

**A4. [OUT]** Adjusted R² moved within a spread of `0.0018` while CV `R²` fell `0.3847`. Which would
you report, and what would you say about the other?

**A5. [ANALYZE]** Adjusted R² is widely taught as the fix for `R²` inflation. Is it wrong to teach, or
wrong to rely on? Argue a position using the sweep.

**A6. [PROG]** Repeat the sweep at `n = 1000` and find the smallest `k` at which Adjusted R² falls
below its own baseline and stays there.

**A7. [ANALYZE]** Under what circumstances *is* Adjusted R² the right tool?

### Multicollinearity

**C1. [OUT]** At `corr = 0.999` the mean coefficients were `2.9554` and `3.0373`, their sum `5.9928`,
true values both `3.00`. State precisely what is and isn't damaged.

**C2. [ANALYZE]** Explain why the *sum* is stable while the individual coefficients are not.

**C3. [OUT]** `std of coef1` went `0.4500 → 1.4312` as correlation went `0.99 → 0.999`. What does the
non-linearity of that growth imply in practice?

**C4. [THEORY]** Does multicollinearity bias the coefficients? Does it harm predictions? Justify both
from the output.

**C5. [ANALYZE]** A colleague reports "floor area adds ₹3000 per unit" from a model where floor area
and room count correlate at `0.98`. Rebut the claim.

**C6. [OUT]** Ridge cut coefficient spread by `87%` and gained `0.0003` test `R²`. Explain why the
second number *had* to be small given the finding in C4.

**C7. [ANALYZE]** When is ridge's bias worth paying, and when would you keep plain least squares?

**C8. [PROG]** Reproduce section 5 with `Ridge(alpha=1.0)` and compare the `std of coef1` column
against the OLS version.

### Quick self-check

1. Write the multiple linear regression equation.
2. What are the two normal equations for two features?
3. Which sum couples them, and what happens when it is zero?
4. What is `det` in terms of the five sums?
5. State both qualifications when reading a coefficient.
6. Why does a coefficient change when a correlated feature is added?
7. Which fit estimates the *total* effect, and which the *direct* effect?
8. Can training `R²` decrease when you add a feature?
9. Write the Adjusted R² formula.
10. Did Adjusted R² catch 100 columns of noise on 120 rows?
11. Which measure did?
12. Under collinearity, what stays stable and what doesn't?
13. Does collinearity bias coefficients, harm predictions, or neither?
14. What does ridge improve, and what does it not?
