#!/usr/bin/env node
const { program } = require('commander');
const download = require('download-git-repo'); // We'll need this to fetch templates

program
    .command('create-substrate-app <project-name>')
    .description('Create a new substrate web app based on chosen template')
    .option('-t, --template <template-name>', 'Name of the template to use')
    .action((projectName, options) => {
        const templateOwner = 'philoniare';
        const templateRepo = `packages/${options.template}`;
        const destination = projectName;

        download(`${templateOwner}/${templateRepo}`, destination, { clone: true }, (err) => {
            if (err) {
                console.error('Error downloading the template:', err);
            } else {
                console.log('Project created successfully!');
                // Optional: Run post-install scripts here (e.g., 'npm install')
            }
        });
    });

program.parse(process.argv);
