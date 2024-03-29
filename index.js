#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

async function updateProjectName(destinationPath, projectName) {
    // Assuming destinationPath is the path to the newly created project directory
    const packageJsonPath = path.join(destinationPath, 'package.json');

    try {
        // Read the existing package.json
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

        // Update the name property with the projectName
        packageJson.name = projectName;

        // Write the updated package.json back to the file
        fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf8');
    } catch (err) {
        console.error('Error updating package.json: ', err);
    }
}

async function copyDirectory(source, destination) {
    fs.mkdirSync(destination, { recursive: true }); // Ensure destination exists
    const files = fs.readdirSync(source);

    for (const file of files) {
        const srcPath = path.join(source, file);
        const destPath = path.join(destination, file);
        if (fs.lstatSync(srcPath).isDirectory()) {
            await copyDirectory(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

async function executeCommand(command, args, cwd) {
    return new Promise((resolve, reject) => {
        const proc = spawn(command, args, { cwd, shell: true, stdio: 'inherit' });

        proc.on('close', (code) => {
            if (code === 0) {
                resolve();
            } else {
                reject(new Error(`Command exited with code ${code}`));
            }
        });
    });
}


async function runCLI() {
    const { default: inquirer } = await import('inquirer'); // Destructure default export
    let projectName = process.argv[2]; // project name

    if (!projectName) {
        console.error('Error: Project name must be provided as an argument.');
        process.exit(1);
    }

    const questions = [
        {
            type: 'list',
            name: 'framework',
            message: 'Choose a framework:',
            choices: ['React', 'Vue', 'Angular']
        },
        {
            type: 'list',
            name: 'chain',
            message: 'Select a blockchain:',
            choices: ['Polkadot', 'Kusama', 'Astar']
        }
    ];

    inquirer.prompt(questions).then(async answers => {
        const framework = answers.framework.toLowerCase();
        const chain = answers.chain.toLowerCase();

        // Construct paths to create the project in
        const templatePath = path.join(__dirname, 'packages', framework);
        const destinationPath = path.join(process.cwd(), projectName);
        console.log(`Creating a new Substrate app in ${destinationPath}`);

        // Copy template files over
        try {
            await copyDirectory(templatePath, destinationPath);
            await updateProjectName(destinationPath, projectName);
        } catch(err) {
            console.error('Error copying template: ', err);
            return;
        }

        // Create .env.local file
        let envFilePath;
        let envContent;
        if(framework === 'angular') {
            const environmentsDir = path.join(destinationPath, 'src', 'environments');
            fs.mkdirSync(environmentsDir, { recursive: true });
            // create environment.ts
            envFilePath = path.join(destinationPath, 'src', 'environments', 'environment.ts');
            envContent = `export const environment = {\n    appName: '${projectName}',\n    chain: '${chain}'\n};`;
        } else if(framework === 'vue') {
            envFilePath = path.join(destinationPath, '.env');
            envContent = `VITE_APP_NAME=${projectName}\nVITE_CHAIN=${chain}`;
        } else if(framework === 'react') {
            envFilePath = path.join(destinationPath, '.env');
            envContent = `REACT_APP_NAME=${projectName}\nREACT_APP_CHAIN=${chain}`;
        }
        fs.writeFileSync(envFilePath, envContent);

        console.log('Installing packages. This might take a couple of minutes.');
        await executeCommand('npm', ['install'], destinationPath);
    });

}

runCLI();