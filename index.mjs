#!/usr/bin/env node

import * as readline from 'readline';
import * as path from 'path';

import bodyParser from 'body-parser';
import express from 'express';
import rimraf from 'rimraf';
import ora from 'ora';

import { collectInfo } from './src/collect-info.mjs';
import { showLogo } from './src/show-logo.mjs';
import { getFolders } from './src/get-folders.mjs';

showLogo();

if (process.argv.length <= 2) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('Where is your Workplace folder? ', (workspacePath) => {
    cleanMyWorkspace(workspacePath);
    rl.close();
  });
}
else {
  cleanMyWorkspace(process.argv[2]);
}

function getResults(workspacePath) {
  const spinner = ora('🧭 Exploring your Workspace').start();

  const results = [];
  const folders = getFolders(workspacePath);

  folders.forEach(folder => {
    const info = collectInfo(folder, `${workspacePath}/${folder}`);
    results.push(info);
  });
  spinner.succeed('🧭 Exploring your Workspace');

  return results;
}

function cleanMyWorkspace(workspacePath) {
  let results = getResults(workspacePath);

  console.log('🚀 Starting server...');
  const app = express();

  const appDir = path.dirname(import.meta.url).replace('file://', '');
  const publicDir = path.resolve(appDir + '/public');
  console.info('Public dir: ', publicDir);
  
  app.get('/', express.static(publicDir));
  app.get('/results', (req, res) => res.send(results));

  const jsonParser = bodyParser.json();

  app.post('/delete-node-modules', jsonParser, (req, res) => {
    const project = req.body;
    const spinner = ora(`💀 Deleting node_modules of ${project.name}`).start();

    try {
      rimraf.sync(`${project.path}/node_modules`);
    } catch (err) {
      spinner.fail(`💀 Deleting node_modules of ${project.name}`);
      console.error(err);
      return res.status(500).send('NOPE');
    }

    spinner.succeed(`💀 Deleting node_modules of ${project.name}`);
    results = getResults(workspacePath);
    return res.status(200).send('OK');
  });

  const server = app.listen(3000, () => {
    console.log('🚀 Server running on port 3000! Press Crtl+C to exit.');
  });

  process.on('SIGINT', () => {
    server.close(() => {
      console.log('\n\r🚀 Server is stoped!');
      console.log('👋 Bye!');
    });
  });
}


