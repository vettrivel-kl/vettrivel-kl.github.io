# Preprocessing Refactoring Playbook: Interactive MDX & Lab Transition Guide

This document serves as a comprehensive case study, reference architecture, and implementation playbook for refactoring other chapters of **Vettri's Notes** (Data Science & ML Engineering Handbook) to meet the absolute Gold Standard of pedagogical interactivity and MDX v3 compliance.

---

## 🏛️ 1. Core Architectural Pillars

When refactoring a static markdown (`.md`) page into a highly interactive, warning-free `.mdx` page, proceed along three primary axes: **Lab Extraction**, **High-Fidelity Interactivity**, and **Content Consolidation**.

```
  Raw Static Markdown (.md)
            │
            ├───► 🧪 1. STANDALONE LAB: Extract Python scripts to Jupyter Notebooks
            │
            ├───► 🎛️ 2. INTERACTIVE ACTIONS: Inject custom React Simulators & Quizzes
            │
            └───► 📦 3. CONSOLIDATION: Group Mistakes (Tabs), Summaries (Grids), & Flashcards
```

---

## 🧪 2. Lab Extraction & "Open in Colab" Badging

Monolithic, un-testable Python scripts at the bottom of pages must be migrated into standalone Jupyter Labs to keep pages focused, readable, and lightning-fast.

### Step-by-Step Transition
1.  **File Placement:** Save the lab notebook under `static/labs/<module-name>/<lab_name>.ipynb`.
2.  **Hands-On Exercises:** Move all heavy programming (`[PROG]`) and data-reading (`[OUT]`) questions from the bottom of the page directly into the notebook as final practical exercises.
3.  **Admonition Linkage:** In the `.mdx` file, replace the old code block with a `:::tip` Admonition titled **"Implementation Lab"**.
4.  **Colab Badge Standard:** Use a strict React-compatible HTML link containing the official Google Colab badge. The badge **must** be styled at exactly `48px` height to prevent visual distortion.

### Standard Lab Link Template
```markdown
## Implementation Lab

:::tip

**Lab Exercise: [Concept Name]**

An interactive, fully-functional Google Colab / Jupyter Notebook is available to experiment with this concept live in your browser.

<a href="https://colab.research.google.com/github/vettrivel-kl/vettrivel-kl.github.io/blob/master/static/labs/02-data-preprocessing/your_notebook.ipynb" target="_blank" rel="noopener noreferrer">
  <img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open In Colab" style={{ height: '48px', width: 'auto', display: 'block', margin: '15px 0' }} />
</a>

**How to run the lab:**
1. Click the **"Open In Colab"** badge above to launch the interactive notebook.
2. Click **"Run all"** or execute cells individually using `Shift + Enter`.

**Things to try inside the script:**
*   **Experiment 1:** [Instruction 1]
*   **Experiment 2:** [Instruction 2]

:::
```

---

## 🎛️ 3. High-Fidelity Interactivity (Custom React)

Interactive widgets allow students to "feel" mathematical and algorithmic concepts (like masking, encoding dimension blowups, or outlier compression) before reading code.

### A. Parameter / Parameter-Tuning Quizzes
For immediate checkpoints, use a simple React state quiz.
*   **Crucial Rule:** Never place success or error emojis (✅ / ❌) directly on selector buttons, as it spoils the answer before a user clicks. Keep them strictly inside the conditional feedback panels that render below.

#### Parameter Quiz Template
```javascript
export const ConceptQuiz = () => {
  const [selected, setSelected] = React.useState(null);
  return (
    <div style={{ padding: '20px', border: '1px solid var(--ifm-color-emphasis-200)', borderRadius: '8px', backgroundColor: 'rgba(148, 163, 184, 0.05)', margin: '20px 0' }}>
      <h4 style={{ margin: '0 0 10px 0' }}>🧠 Interactive Checkpoint: [Topic]</h4>
      <p style={{ margin: '0 0 15px 0' }}>[The conceptual question goes here?]</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <button onClick={() => setSelected('opt1')} style={{ padding: '10px', borderRadius: '4px', border: '1px solid #3182ce', textAlign: 'left', backgroundColor: selected === 'opt1' ? '#e53e3e' : 'transparent', color: selected === 'opt1' ? '#fff' : 'var(--ifm-font-color-base)', cursor: 'pointer', transition: '0.2s' }}>Option A: [Wrong Option]</button>
        <button onClick={() => setSelected('opt2')} style={{ padding: '10px', borderRadius: '4px', border: '1px solid #3182ce', textAlign: 'left', backgroundColor: selected === 'opt2' ? '#38a169' : 'transparent', color: selected === 'opt2' ? '#fff' : 'var(--ifm-font-color-base)', cursor: 'pointer', transition: '0.2s' }}>Option B: [Correct Option]</button>
      </div>
      {selected === 'opt1' && <p style={{ color: '#e53e3e', marginTop: '15px', fontWeight: 'bold', fontSize: '14px', marginBottom: '0' }}>❌ Incorrect. [Explain why Option A is mathematically or logically wrong.]</p>}
      {selected === 'opt2' && <p style={{ color: '#38a169', marginTop: '15px', fontWeight: 'bold', fontSize: '14px', marginBottom: '0' }}>✅ Correct! [Validate Option B and state the core takeaway.]</p>}
    </div>
  );
};
```

### B. Live Sandboxes & Matrix Visualizers
Toggles and select boxes let students manipulate mock data arrays and immediately see output matrix transformations.

*   **Case 1 (Categorical Encoding):** Toggling between *Label*, *One-Hot*, and *Binary* immediately renders the output dimensions, reinforcing memory footprints.
*   **Case 2 (Feature Scaling):** Toggling an *Outlier (e.g. 1000)* on and off immediately visually demonstrates how MinMaxScaler squashes regular values into a 1% band, while RobustScaler maintains spacing.
*   **Case 3 (Group Leakage Grid):** Toggling between *Random Split* and *Group Split* color-codes patient scans. It visually exposes scans from Patient A bleeding (leaking) into both training and testing datasets.

*Tip: Keep React logic lightweight and self-contained within the MDX file so it compiles rapidly.*

---

## 📦 4. Structural Content Consolidation

To prevent "DOM bloat" and ensure clean readability, extensive static text, tables, and questions must be structured into high-impact interactive containers.

### A. Common Mistakes into Interactive Tabs
Instead of a flat markdown table of 14 rows, condense the mistakes into the **top 5 most critical engineering pitfalls**, grouping them by category and wrapping them in Docusaurus `<Tabs>`:

```markdown
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="pitfall1" label="🚨 Pitfall 1: [Name]" default>
    <br/>
    
    *   **The Misconception:** *"[Common wrong belief]"*
    *   **❌ Wrong Thinking:** [Explain why this fails in production or degrades score]
    *   **✅ The Right Principle:** [State the best practice or correct pipeline sequence]
  </TabItem>
  <TabItem value="pitfall2" label="🚨 Pitfall 2: [Name]">
    <br/>
    ...
  </TabItem>
</Tabs>
```

### B. Bullet Summaries into Responsive CSS Grids
Replace flat summaries with dual-column, mobile-responsive grids leveraging standard Docusaurus/Infima CSS classes (`row`, `col col--6`, `card`):

```markdown
## Summary

<div className="row">
  <div className="col col--6">
    <div className="card" style={{ height: '100%', marginBottom: '15px' }}>
      <div className="card__header" style={{ padding: '15px', borderBottom: '1px solid var(--ifm-color-emphasis-200)' }}>
        <h3>🤖 [Grid Title 1]</h3>
      </div>
      <div className="card__body" style={{ padding: '15px' }}>
        <ul>
          <li><b>[Term 1]:</b> Explanation of term 1.</li>
          <li><b>[Term 2]:</b> Explanation of term 2.</li>
        </ul>
      </div>
    </div>
  </div>
  <div className="col col--6">
    <div className="card" style={{ height: '100%', marginBottom: '15px' }}>
      <div className="card__header" style={{ padding: '15px', borderBottom: '1px solid var(--ifm-color-emphasis-200)' }}>
        <h3>⚠️ [Grid Title 2]</h3>
      </div>
      <div className="card__body" style={{ padding: '15px' }}>
        <ul>
          <li><b>[Rule 1]:</b> Explanation of rule 1.</li>
          <li><b>[Rule 2]:</b> Explanation of rule 2.</li>
        </ul>
      </div>
    </div>
  </div>
</div>
```

### C. Large Question Lists into Active Recall Flashcards
Paring 50+ mixed questions down to a curated set of **10 high-yield, conceptual Active Recall questions** prevents DOM bloat. Wrap each question in interactive `<details>` tags:

```markdown
## Active Recall Flashcards

*Attempt each question first, then click to reveal detailed answers, mathematical derivations, and sample explanations.*

<details>
  <summary>❓ <b>1. [[CATEGORY]] [Your high-signal conceptual question goes here?]</b></summary>
  <div className="answer-content">
    <br/>
    
    *   **Key Concept:** Brief high-level summary of the answer.
    *   **Detailed Explanation:** Mathematical or logical proof behind the behavior (e.g., how the matrix inversion becomes singular under the dummy variable trap).
  </div>
</details>
```

---

## 🛠️ 5. MDX Compiler & Build Troubleshooting

MDX v3 (with the Acorn/JSX parser) introduces strict compilation constraints that standard markdown does not have.

### A. The MDX Bracket-Parsing Quirk
Raw curly braces `{` and `}` inside standard code blocks `<code>` will cause the acorn compiler to fail, thinking it is an unparsed JSX expression.
*   **Wrong:** `pd.read_csv('data.csv', dtype={'zip': str})`
*   **Right:** `pd.read_csv('data.csv', dtype={"{"}'zip': str{"}"})`

### B. Strict Admonition Box Syntax
Admonition headers (`:::note`, `:::tip`, `:::warning`, `:::danger`, `:::info`) **must** have NO text on their opening lines. Titles must sit on a new line as bold headers.
```markdown
:::tip

**Title here**

Your content goes here.

:::
```
*   **Spacing rule:** There must be exactly one blank line after the opening tag, after the title header, and before the closing `:::` tag.
*   **Lists inside Admonitions:** If the admonition contains a bulleted list, there **must** be a blank line before the closing `:::` tag, otherwise the compiler extends the list context and fails.

### C. Standard ASCII Hyphens Only
To avoid visual encoding bugs (e.g. `â€“`) or LaTeX rendering errors, **strictly avoid Unicode en-dashes (`–`) and em-dashes (`—`) anywhere in the document.** Always use standard ASCII hyphens (`-`).

### D. The Docusaurus Custom Heading ID Spacing Trick
In Docusaurus, other files may link to specific anchors (e.g., `#standardisation-z-score-normalisation`). When you refactor headings, these anchors can break, raising compilation errors during `npm run build`.

Using standard Markdown custom heading syntax `{#custom-id}` will cause MDX to throw a syntax error.
*   **Wrong:** `## Standardisation {#standardisation-z-score-normalisation}` (MDX parsing error)
*   **Right (Surgical spacing):** Match the slug naturally by adjusting heading spacing.
    *   `### Interactions- the product...` naturally generates `#interactions--the-product...` (two hyphens!).
    *   `### 2. Grouped rows- the worst case` naturally generates `#2-grouped-rows--the-worst-case` (two hyphens!).
    *   Alternatively, use standard Docusaurus Custom Heading ID syntax strictly on the heading element:
        *   `## Standardisation (Z-score normalisation) {#standardisation-z-score-normalisation}` (Note: only works on H1/H2 markdown headings configured in your Docusaurus settings).

---

## 🧪 6. Final Verification checklist
Before considering any refactoring complete, always execute:
```bash
npm run build
```
The refactoring is only finalized when Docusaurus outputs a **100% warning-free, successful static bundle** with `[SUCCESS] Generated static files in "build"`.