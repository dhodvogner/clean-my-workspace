import * as fs from 'fs';

export function collectInfo(name, path) {
  const stats = fs.lstatSync(path);
  const hasNVMRc = fs.existsSync(`${path}/.nvmrc`);
  const hasPackageJson = fs.existsSync(`${path}/package.json`);
  const nodeVersion = (hasNVMRc) ? fs.readFileSync(`${path}/.nvmrc`, 'utf8') : 'N/A';
  let hasRepo = false;

  if(hasPackageJson) {
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
    hasNodeModules: fs.existsSync(`${path}/node_modules`),
    hasPackageJson,
    hasRepo,
  }
}