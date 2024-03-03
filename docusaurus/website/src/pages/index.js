/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';

import Layout from '@theme/Layout';
import CodeBlock from '@theme/CodeBlock';

import clsx from 'clsx';

import styles from './styles.module.css';

const features = [
  {
    title: 'Less to Learn',
    content:
      "Polkadot.js is configured and helper interfaces to interacting with the wallet are provided out of box",
  },
  {
    title: 'Connect to any Substrate Chain',
    content:
      'Your app only needs one config change to connect to a different Substrate based chain.',
  },
  {
    title: 'No Lock-In',
    content:
      'We don\'t make assumptions on any UI library so you can freely choose to build on top of the template using whichever libraries you prefer',
  },
];

function Home() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;

  return (
    <Layout
      permalink={'/'}
      description={'Set up a modern web app by running one command.'}
    >
      <div className={clsx('hero hero--dark', styles.heroBanner)}>
        <div className="container">
          <img
            className={clsx(styles.heroBannerLogo, 'margin-vert--md')}
            alt="Create Substrate App logo"
            src={useBaseUrl('img/logo.svg')}
          />
          <h1 className="hero__title">{siteConfig.title}</h1>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
          <div className={styles.getStarted}>
            <Link
              className="button button--outline button--primary button--lg"
              to={useBaseUrl('docs/getting-started')}
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
      {features && features.length && (
        <div className={styles.features}>
          <div className="container">
            <div className="row">
              {features.map(({ title, content }, idx) => (
                <div key={idx} className={clsx('col col--4', styles.feature)}>
                  <h2>{title}</h2>
                  <p>{content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      <div className={styles.gettingStartedSection}>
        <div className="container padding-vert--xl text--left">
          <div className="row">
            <div className="col col--4 col--offset-4">
              <h2>Get started in seconds</h2>
              <p>
                Whether you’re using React or another framework, Create Substrate App
                lets you <strong>focus on code, not build tools</strong>.
                <br />
                <br />
                To create a project called <i>my-app</i>, run this command:
              </p>
              <CodeBlock className="language-sh">
                npx create-substrate-app my-app
              </CodeBlock>
              <br />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Home;
