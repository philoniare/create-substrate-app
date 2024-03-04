---
id: deployment
title: Deployment
sidebar_label: Deployment
---

`npm run build` runs the command for specific build operation on respective framework starter.

## [AWS Amplify](https://console.amplify.aws)

The AWS Amplify Console provides continuous deployment and hosting for modern web apps (single page apps and static site generators) with serverless backends. The Amplify Console offers globally available CDNs, custom domain setup, feature branch deployments, and password protection.

1. Login to the Amplify Console [here](https://console.aws.amazon.com/amplify/home).
1. Connect your Create Substrate App repo and pick a branch.
1. The Amplify Console automatically detects the build settings. Choose Next.
1. Choose _Save and deploy_.

If the build succeeds, the app is deployed and hosted on a global CDN with an amplifyapp.com domain. You can now continuously deploy changes to your frontend or backend. Continuous deployment allows developers to deploy updates to their frontend and backend on every code commit to their Git repository.

## [Azure](https://azure.microsoft.com/)

Azure Static Web Apps creates an automated build and deploy pipeline for your Substrate app powered by GitHub Actions. Applications are geo-distributed by default with multiple points of presence. PR's are built automatically for staging environment previews.

1. Create a new Static Web App [here](https://ms.portal.azure.com/#create/Microsoft.StaticApp).
1. Add in the details and connect to your GitHub repo.
1. Make sure the build folder is set correctly on the "build" tab and create the resource.

Azure Static Web Apps will automatically configure a GitHub Action in your repo and begin the deployment.

See the [Azure Static Web Apps documentation](https://aka.ms/swadocs) for more information on routing, APIs, authentication and authorization, custom domains and more.

## [Firebase](https://firebase.google.com/)

Install the Firebase CLI if you haven’t already by running `npm install -g firebase-tools`. Sign up for a [Firebase account](https://console.firebase.google.com/) and create a new project. Run `firebase login` and login with your previous created Firebase account.

Then run the `firebase init` command from your project’s root. You need to choose the **Hosting: Configure and deploy Firebase Hosting sites** and choose the Firebase project you created in the previous step. You will need to agree with `database.rules.json` being created, choose `build` as the public directory, and also agree to **Configure as a single-page app** by replying with `y`.

```sh
    === Project Setup

    First, let's associate this project directory with a Firebase project.
    You can create multiple project aliases by running firebase use --add,
    but for now we'll set up a default project.

    ? What Firebase project do you want to associate as default? Example app (example-app-fd690)

    === Database Setup

    Firebase Realtime Database Rules allow you to define how your data should be
    structured and when your data can be read from and written to.

    ? What file should be used for Database Rules? database.rules.json
    ✔  Database Rules for example-app-fd690 have been downloaded to database.rules.json.
    Future modifications to database.rules.json will update Database Rules when you run
    firebase deploy.

    === Hosting Setup

    Your public directory is the folder (relative to your project directory) that
    will contain Hosting assets to uploaded with firebase deploy. If you
    have a build process for your assets, use your build's output directory.

    ? What do you want to use as your public directory? build
    ? Configure as a single-page app (rewrite all urls to /index.html)? Yes
    ✔  Wrote build/index.html

    i  Writing configuration info to firebase.json...
    i  Writing project information to .firebaserc...

    ✔  Firebase initialization complete!
```

Now, after you create a production build with `npm run build`, you can deploy it by running `firebase deploy`.

```sh
    === Deploying to 'example-app-fd690'...

    i  deploying database, hosting
    ✔  database: rules ready to deploy.
    i  hosting: preparing build directory for upload...
    Uploading: [==============================          ] 75%✔  hosting: build folder uploaded successfully
    ✔  hosting: 8 files uploaded successfully
    i  starting release process (may take several minutes)...

    ✔  Deploy complete!

    Project Console: https://console.firebase.google.com/project/example-app-fd690/overview
    Hosting URL: https://example-app-fd690.firebaseapp.com
```

For more information see [Firebase Hosting](https://firebase.google.com/docs/hosting).

## [GitHub Pages](https://pages.github.com/)

### Step 1: Add `homepage` to `package.json`

**The step below is important!**<br/>

**If you skip it, your app will not deploy correctly.**

Open your `package.json` and add a `homepage` field for your project:

```json
  "homepage": "https://myusername.github.io/my-app",
```

or for a GitHub user page:

```json
  "homepage": "https://myusername.github.io",
```

or for a custom domain page:

```json
  "homepage": "https://mywebsite.com",
```

Create Substrate App uses the `homepage` field to determine the root URL in the built HTML file.

### Step 2: Install `gh-pages` and add `deploy` to `scripts` in `package.json`

Now, whenever you run `npm run build`, you will see a cheat sheet with instructions on how to deploy to GitHub Pages.

To publish it at [https://myusername.github.io/my-app](https://myusername.github.io/my-app), run:

```sh
npm install --save gh-pages
```

Alternatively you may use `yarn`:

```sh
yarn add gh-pages
```

Add the following scripts in your `package.json`:

```diff
  "scripts": {
+   "predeploy": "npm run build",
+   "deploy": "gh-pages -d build",
    "start": "react-scripts start",
    "build": "react-scripts build",
```

The `predeploy` script will run automatically before `deploy` is run.

If you are deploying to a GitHub user page instead of a project page you'll need to make one
additional modification:

1. Tweak your `package.json` scripts to push deployments to **main**:

```diff
  "scripts": {
    "predeploy": "npm run build",
-   "deploy": "gh-pages -d build",
+   "deploy": "gh-pages -b main -d build",
```

### Step 3: Deploy the site by running `npm run deploy`

Then run:

```sh
npm run deploy
```

### Step 4: For a project page, ensure your project’s settings use `gh-pages`

Finally, make sure **GitHub Pages** option in your GitHub project settings is set to use the `gh-pages` branch:

<img src="https://i.imgur.com/HUjEr9l.png" width="500" alt="gh-pages branch setting" />

### Step 5: Optionally, configure the domain

You can configure a custom domain with GitHub Pages by adding a `CNAME` file to the `public/` folder.

Your CNAME file should look like this:

```
mywebsite.com
```

## [Netlify](https://www.netlify.com/)

**To do a manual deploy to Netlify’s CDN:**

```sh
npm install netlify-cli -g
netlify deploy
```

Choose `build` as the path to deploy.

**To setup continuous delivery:**

With this setup Netlify will build and deploy when you push to git or open a pull request:

1. [Start a new netlify project](https://app.netlify.com/signup)
2. Pick your Git hosting service and select your repository
3. Click `Build your site`

**Support for client-side routing:**

To support `pushState`, make sure to create a `public/_redirects` file with the following rewrite rules:

```
/*  /index.html  200
```

When you build the project, Create Substrate App will place the `public` folder contents into the build output.

## [Vercel](https://vercel.com)

[Vercel](https://vercel.com/home) is a cloud platform that enables developers to host Jamstack websites and web services that deploy instantly, scale automatically, and requires no supervision, all with zero configuration. They provide a global edge network, SSL encryption, asset compression, cache invalidation, and more.

### Step 1: Deploying your React project to Vercel

To deploy your React project with a [Vercel for Git Integration](https://vercel.com/docs/git-integrations), make sure it has been pushed to a Git repository.

Import the project into Vercel using the [Import Flow](https://vercel.com/import/git). During the import, you will find all relevant [options](https://vercel.com/docs/build-step#build-&-development-settings) preconfigured for you with the ability to change as needed.

After your project has been imported, all subsequent pushes to branches will generate [Preview Deployments](https://vercel.com/docs/platform/deployments#preview), and all changes made to the [Production Branch](https://vercel.com/docs/git-integrations#production-branch) (commonly "master" or "main") will result in a [Production Deployment](https://vercel.com/docs/platform/deployments#production).

Once deployed, you will get a URL to see your app live, such as the following: https://create-substrate-app-example.vercel.app/.

### Step 2 (optional): Using a Custom Domain

If you want to use a Custom Domain with your Vercel deployment, you can **Add** or **Transfer in** your domain via your Vercel [account Domain settings.](https://vercel.com/dashboard/domains)

To add your domain to your project, navigate to your [Project](https://vercel.com/docs/platform/projects) from the Vercel Dashboard. Once you have selected your project, click on the "Settings" tab, then select the **Domains** menu item. From your projects **Domain** page, enter the domain you wish to add to your project.

Once the domain has been added, you will be presented with different methods for configuring it.

### Deploying a fresh React project

### Vercel References:

- [Official Vercel Guide](https://vercel.com/guides/deploying-react-with-vercel-cra)
- [Vercel Deployment Docs](https://vercel.com/docs)
- [Vercel Custom Domain Docs](https://vercel.com/docs/custom-domains)
