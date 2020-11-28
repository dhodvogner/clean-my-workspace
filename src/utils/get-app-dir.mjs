import * as path from 'path';

export function getAppDir() {
  return path.resolve(path.dirname(import.meta.url).replace('file://', '') + '../../../');
}