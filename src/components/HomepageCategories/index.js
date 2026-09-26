import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

// Mirrors the docs tree: one entry per top-level subject, one card per category.
// The hrefs are the generated-index URLs Docusaurus derives from the labels in
// each `_category_.json`, so renaming a label there means renaming it here too —
// `onBrokenLinks: 'throw'` will fail the build if they drift apart.
const SUBJECTS = [
  {
    title: 'Machine Learning Algorithms',
    href: '/docs/category/machine-learning-algorithms',
    categories: [
      {
        label: '1 · Foundations',
        href: '/docs/category/1--foundations',
        description:
          'What machine learning is and why it works — the types of learning, and the Python toolkit behind them.',
      },
      {
        label: '2 · Data Preprocessing',
        href: '/docs/category/2--data-preprocessing',
        description:
          'Missing values, categorical encoding, feature scaling, outliers, and the train-test split.',
      },
      {
        label: '3 · Linear Regression',
        href: '/docs/category/3--linear-regression',
        description:
          'Least-squares by hand and in scikit-learn, the matrix formulation, and what the model assumes.',
      },
      {
        label: '4 · Optimisation',
        href: '/docs/category/4--optimisation',
        description:
          'Loss functions, gradient descent, the learning rate, and how many rows each update sees.',
      },
      {
        label: '5 · Regression Metrics',
        href: '/docs/category/5--regression-metrics',
        description:
          'Scoring a fitted regression — the three error averages that live in the units of the target, the two ratio-based scores that do not, and the residual plots that catch a good score sitting on top of a bad fit.',
      },
      {
        label: '6 · Validation Strategy',
        href: '/docs/category/6--validation-strategy',
        description:
          'Evaluating model generalisation — why single train-test splits can be a lottery, the mechanics of K-Fold and Stratified K-Fold cross-validation, and the strict protocols required to prevent data leakage.',
      },
      {
        label: '7 · Logistic Regression',
        href: '/docs/category/7--logistic-regression',
        description:
          'Transitioning to classification — why linear regression fails on discrete targets, the mathematical necessity of the sigmoid curve, and the mechanics of binary and multiclass decision boundaries.',
      },
      {
        label: '8 · Classification Metrics',
        href: '/docs/category/8--classification-metrics',
        description:
          'Measuring classifier performance — decomposing predictions with the 2x2 confusion matrix, navigating the accuracy paradox on imbalanced data, and tuning thresholds with precision, recall, F-scores, and ROC-AUC.',
      },
      {
        label: '9 · Generalization',
        href: '/docs/category/9--generalization',
        description:
          'Ensuring model robustness — balancing the bias-variance tradeoff, controlling model complexity using L1, L2, and Elastic Net penalties, and understanding how the curse of dimensionality impacts model fit.',
      },
    ],
  },
  {
    title: 'Inferential Statistics',
    href: '/docs/category/inferential-statistics',
    categories: [
      {
        label: 'Batch 1: Descriptive Stats',
        href: '/docs/Exam-Prep/Inferential-Statistics/CT-1/descriptive-stats-batch',
        description: 'Descriptive statistics, covariance, and correlation.',
      },
      {
        label: 'Batch 2: Fundamental Probability',
        href: '/docs/Exam-Prep/Inferential-Statistics/CT-1/fundamental-probability-batch',
        description: 'Fundamental probability and the addition/multiplication rules.',
      },
      {
        label: 'Batch 3: Probability Distributions',
        href: '/docs/Exam-Prep/Inferential-Statistics/CT-1/probability-distributions-batch',
        description: 'Probability distributions and Bayes’ theorem.',
      },
      {
        label: 'Batch 4: Theoretical Concepts',
        href: '/docs/Exam-Prep/Inferential-Statistics/CT-1/theory-batch',
        description: 'Theoretical frameworks for sampling, probability, and metrics.',
      },
    ],
  },
  {
    title: 'Fundamentals of AI',
    href: '/docs/category/fundamentals-of-ai',
    categories: [
      {
        label: '1 · Basics',
        href: '/docs/category/1--basics',
        description:
          'Values and types, variable naming, expressions and operators, f-strings, and input/output.',
      },
      {
        label: '2 · Control Flow',
        href: '/docs/category/2--control-flow',
        description:
          'Making decisions with if/elif/else, and repeating work with for and while loops.',
      },
      {
        label: '3 · Collections',
        href: '/docs/category/3--collections',
        description:
          'Strings and slicing, lists, tuples, dictionaries and sets — methods and mutability traps.',
      },
      {
        label: '4 · NumPy',
        href: '/docs/category/4--numpy',
        description:
          'Arrays and dtypes, indexing and views, broadcasting, and aggregations along an axis.',
      },
      {
        label: '5 · Pandas',
        href: '/docs/category/5--pandas',
        description:
          'Series and DataFrames — reading, inspecting, cleaning, selecting and grouping tabular data.',
      },
      {
        label: '6 · Statistics & EDA',
        href: '/docs/category/6--statistics--eda',
        description:
          'Centre and spread, measuring relationships between variables, and the EDA workflow.',
      },
      {
        label: '7 · Visualization',
        href: '/docs/category/7--visualization',
        description:
          'Choosing the right chart, then drawing it with Matplotlib, Seaborn or Plotly.',
      },
      {
        label: 'CT-1 · Class Test 1',
        href: '/docs/category/ct-1--class-test-1',
        description:
          'Class Test 1 revision packages and practice sets, covering NumPy arrays, collections, Pandas, exploratory data analysis, and Matplotlib.',
      },
    ],
  },
];

function CategoryCard({label, href, description}) {
  return (
    <div className="col col--4">
      <Link to={href} className={styles.card}>
        <Heading as="h3" className={styles.cardTitle}>
          {label}
        </Heading>
        <p className={styles.cardDescription}>{description}</p>
      </Link>
    </div>
  );
}

function Subject({title, href, categories}) {
  return (
    <div className={styles.subject}>
      <Heading as="h2" className={styles.subjectTitle}>
        <Link to={href}>{title}</Link>
      </Heading>
      <div className="row">
        {categories.map((category) => (
          <CategoryCard key={category.href} {...category} />
        ))}
      </div>
    </div>
  );
}

export default function HomepageCategories() {
  return (
    <section className={styles.categories}>
      <div className="container">
        {SUBJECTS.map((subject) => (
          <Subject key={subject.href} {...subject} />
        ))}
      </div>
    </section>
  );
}
