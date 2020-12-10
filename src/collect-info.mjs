import * as fs from 'fs';

export function collectInfo(name, path) {
  // lgtm[js/path-injection]
  const stats = fs.lstatSync(path);
  // lgtm[js/path-injection]
  const hasNVMRc = fs.existsSync(`${path}/.nvmrc`);
  // lgtm[js/path-injection]
  const hasPackageJson = fs.existsSync(`${path}/package.json`);
  // lgtm[js/path-injection]
  const nodeVersion = (hasNVMRc) ? fs.readFileSync(`${path}/.nvmrc`, 'utf8') : 'N/A';
  // lgtm[js/path-injection]
  const hasNodeModules = fs.existsSync(`${path}/node_modules`);

  let hasRepo = false;
  if(hasPackageJson) {
    // lgtm[js/path-injection]
    const packageJson = JSON.parse(fs.readFileSync(`${path}/package.json`, 'utf8'));
    hasRepo = (packageJson.repository) ? true : false;
  }

  return {
    name,
    path,
    lastAccessTime: stats.atime,
    lastModifiedTime: stats.mtime,
    birthTime: stats.birthtime,
    hasNVMRc,
    nodeVersion,
    hasNodeModules,
    hasPackageJson,
    hasRepo,
  }
}