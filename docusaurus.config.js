// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Vettrivel's Notes",
  tagline: 'Java, Spring Boot, React, and beyond — one note at a time.',
  favicon: 'img/vettri/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://vettrivel-kl.github.io',
  baseUrl: '/',
  organizationName: 'vettrivel-kl', // Usually your GitHub org/user name.
  projectName: 'vettrivel-kl.github.io', // Usually your repo name.
  trailingSlash: false,
  onBrokenLinks: 'throw',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  // Parse .md as CommonMark and only .mdx as MDX. Without this, MDX v3 treats
  // `{` and `<` in plain .md as JSX and the build fails on things like
  // <class 'int'> or {value:spec} outside a code fence.
  markdown: {
    format: 'detect',
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          editUrl:
            'https://github.com/vettrivel-kl/vettrivel-kl.github.io/tree/master/',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          editUrl:
            'https://github.com/vettrivel-kl/vettrivel-kl.github.io/tree/master/',
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/vettri/vettri-384x384.png',
      colorMode: {
        respectPrefersColorScheme: true,
      },
      navbar: {
        title: "Vettrivel's Notes",
        logo: {
          alt: 'My Site Logo',
          src: 'img/vettri/vettri-384x384.png',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Notes ',
          },
          {to: '/blog', label: 'Blog', position: 'left'},
        ],
      },
      footer: {
        style: 'dark',
        links: [
        ],
        copyright: `Copyright © ${new Date().getFullYear()} vettrivel.com`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.oneDark,
        additionalLanguages: [
          'java',
          'bash',
          'json',
          'properties',
          'yaml',
          'sql',
          'docker',
          'nginx',
          'markup',
          'toml',
          'ini',
          'diff',
          'graphql',
          'typescript',
          'jsx',
          'tsx',
          'markdown',
        ],
      },
    }),
};

export default config;
