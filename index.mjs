#!/usr/bin/env node

import { showLogo } from './src/show-logo.mjs';
import { startServer } from './src/api/index.mjs';
import { projectStore } from './src/project-store.mjs';
import { getAppDir } from './src/utils/get-app-dir.mjs';

showLogo();

const appDir = getAppDir();
let currentFolder = (process.argv[2]) ? process.argv[2] : process.cwd();

projectStore.collectProjects(currentFolder);

const server = startServer(appDir);

process.on('SIGINT', () => {
  server.close(() => {
    console.log('\n\r🚀 Server is stoped!');
    console.log('👋 Bye!');
  });
});
