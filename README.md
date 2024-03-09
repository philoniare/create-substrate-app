# Create Substrate App
***
`create-substrate-app` is a command-line tool that simplifies the process of starting a new decentralized web app
creation connected to a Substrate based chain. It allows developers to quickly bootstrap a new project with templates
for React, Vue, and Angular, getting you started with Substrate DApp development in no time. The basic interface allows
you to query the on-chain balance and transfer funds between accounts.

## Prerequisites
Before you begin, ensure you have the following installed on your system:
- Node.js (v12.x or later)
- npm (v6.x or later)

## Getting Started
To create a new app, run the following command in your terminal:
```sh
npx create-substrate-app my-app
```
Replace `my-app` with the name of your project. This command creates a new directory named `my-app`, initializes a new
project, and installs dependencies automatically.

## Selecting a Frontend Framework
During the setup process, you will be prompted to choose a frontend framework from the following options:
- React
- Vue
- Angular

The tool will then generate a project template based on your selection.

## Running Your Application
Navigate to your project directory:
```sh
cd my-app
```
To start the application, run:
```sh
npm start
```

All of the templates are based on the starter templates provided by respective frameworks:
- React: [create-react-app](https://github.com/facebook/create-react-app)
- Vue: [create-vue](https://github.com/vuejs/create-vue)
- Angular: [angular-cli](https://github.com/angular/angular-cli)

No opinionated assumptions have been made regarding state management, allowing the user to freely choose their
preferred tool.

### Screenshots
#### React
<img width="960" alt="image" src="https://github.com/philoniare/create-substrate-app/assets/13562152/c7b868b6-0e9a-4eec-96f7-99e21670f2bb">
#### Angular
<img width="920" alt="image" src="https://github.com/philoniare/create-substrate-app/assets/13562152/d69e9f98-2d58-4c97-b717-3bbed89705fe">
#### Vue
<img width="1214" alt="image" src="https://github.com/philoniare/create-substrate-app/assets/13562152/6c1c9f96-555b-4b12-b8cd-e6fc42577ea8">


### FAQ
#### How do I set it up with a custom chain?
Simple add the RPC endpoint in `substrate/chain.ts` and update the env chain variable in the `.env` file
#### How do I handle multiple wallets?
You can use the `injectedAccounts` array to add functionality to interact with multiple wallets.


## License
`create-substrate-app` is open source software licensed as [Apache 2.0](https://www.apache.org/licenses/LICENSE-2.0)

