import * as path from 'path';

import bodyParser from 'body-parser';
import express from 'express';

import { getResults } from './get-results.mjs';
import { postExplore } from './post-explore.mjs';
import { postDeleteNodeModules } from './post-delete-node-modules.mjs';

export function startServer(appDir) {
  console.log('🚀 Starting server...');

  const app = express();
  const publicDir = path.resolve(appDir + '/public');
  const jsonParser = bodyParser.json();

  console.info('Public dir: ', publicDir);

  app.use(express.static(publicDir));
  app.get('/results', getResults);
  app.post('/explore', jsonParser, postExplore);
  app.post('/delete-node-modules', jsonParser, postDeleteNodeModules);

  const server = app.listen(3000, () => {
    console.log('🚀 Server running on port 3000! Press Crtl+C to exit.');
  });

  return server;
}