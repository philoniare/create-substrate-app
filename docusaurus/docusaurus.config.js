/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';

const siteConfig = {
  title: 'Create Substrate App',
  tagline: 'Set up a modern substrate web app by running one command.',
  url: 'https://create-substrate-app.dev',
  baseUrl: '/',
  projectName: 'create-substrate-app',
  organizationName: 'philoniare',
  favicon: 'img/favicon/favicon.svg',
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          path: './docs',
          sidebarPath: require.resolve('./sidebars.json'),
          editUrl:
            'https://github.com/facebook/create-substrate-app/edit/main/docusaurus/website',
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
  themeConfig: {
    image: 'img/logo-og.png',
    algolia: {
      appId: '40DJPLPCGS',
      apiKey: '73b5baefa88c4daae100624f628fb0cd',
      indexName: 'create-substrate-app',
    },
    navbar: {
      title: 'Create Substrate App',
      logo: {
        alt: 'Create Substrate App Logo',
        src: 'img/logo.svg',
      },
      items: [
        { to: 'docs/getting-started', label: 'Docs', position: 'right' },
        {
          href: 'https://github.com/philoniare/create-substrate-app',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Get Started',
              to: 'docs/getting-started',
            },
            {
              label: 'Learn Polkadot.js',
              href: 'https://polkadot.js.org/docs/',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Stack Overflow',
              href: 'https://substrate.stackexchange.com/questions/tagged/create-substrate-app',
            },
            {
              label: 'GitHub Discussions',
              href: 'https://github.com/philoniare/create-substrate-app/discussions',
            },
          ],
        },
        {
          title: 'Social',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/philoniare/create-substrate-app',
            },
          ],
        },
      ],
    },
  },
};

module.exports = siteConfig;
