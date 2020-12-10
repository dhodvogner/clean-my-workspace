import * as fs from 'fs';

export function getFolders(path) {
  // lgtm[js/path-injection]
  return fs
    .readdirSync(path, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);
}