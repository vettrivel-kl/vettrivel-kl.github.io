import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

// Mirrors the docs tree: one entry per top-level subject, one card per category.
// The hrefs are the generated-index URLs Docusaurus derives from the labels in
// each `_category_.json`, so renaming a label there means renaming it here too —
// `onBrokenLinks: 'throw'` will fail the build if they drift apart.
const SUBJECTS = [
  {
    title: 'Python',
    href: '/docs/Python',
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
    ],
  },
  {
    title: 'Machine Learning',
    href: '/docs/category/machine-learning',
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
