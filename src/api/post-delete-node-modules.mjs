import ora from 'ora';
import rimraf from 'rimraf';

export function postDeleteNodeModules(req, res) {
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
}