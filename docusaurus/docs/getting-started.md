---
id: getting-started
title: Getting Started
---

Create Substrate App is a way to bootstrap the process to create a Decentralized Application on the Polkadot Ecosystem.
It offers a modern build setup with no configuration.

## Quick Start

```sh
npx create-substrate-app my-app
cd my-app
npm start
```

## Creating an App

**You’ll need to have Node >= 14 on your local development machine**.

To create a new app, you may choose one of the following methods:

### npx

```sh
npx create-substrate-app@latest my-app
```

### npm

```sh
npm init substrate-app my-app
```

_`npm init <initializer>` is available in npm 6+_

### Yarn

```sh
yarn create substrate-app my-app
```

_`yarn create` is available in Yarn 0.25+_

### Selecting a package manager

When you create a new app, the CLI will use [npm](https://docs.npmjs.com) or [Yarn](https://yarnpkg.com/) to install dependencies, depending on which tool you use to run `create-substrate-app`. For example:

```sh
# Run this to use npm
npx create-substrate-app my-app
# Or run this to use yarn
yarn create substrate-app my-app
```

## Output

Running any of these commands will create a directory called `my-app` inside the current folder. Inside that directory,
it will generate the initial project structure and install the transitive dependencies:

No configuration or complicated folder structures, only the files you need to build your app. Once the installation is done, you can open your project folder:

```sh
cd my-app
```

## Scripts

Inside the newly created project, you can run some built-in commands:

### `npm start` or `yarn start`

Runs the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser (when using React, Angular
and Vue will be using different ports and show on cli).

The page will automatically reload if you make changes to the code. You will see the build errors and lint warnings in the console.

### `npm test` or `yarn test`

Runs the test watcher in an interactive mode. By default, runs tests related to files changed since the last commit.

### `npm run build` or `yarn build`

Builds the app for production to the `build` folder. It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.

Your app is ready to be deployed.
