import ora from 'ora';

import { collectInfo } from './collect-info.mjs';
import { getFolders } from './get-folders.mjs';

class ProjectStore {
  constructor() {
    this.cache = [];
    this.latest = { path: null, projects: []};
  }

  getLatest() {
    return this.latest;
  }

  collectProjects(path) {
    let projects = this.has(path);

    if(!projects) {
      projects = this.explore(path);
    } else {
      console.log(`🧭 From cache: ${path}`);
    }

    this.latest = projects;
  }

  has(path) {
    return this.cache.find(r => {
      return r.path === path;
    });
  }

  explore(path) {
    const spinner = ora(`🧭 Exploring: ${path}`).start();
  
    const projects = [];
    const folders = getFolders(path);
  
    folders.forEach(folder => {
      const info = collectInfo(folder, `${path}/${folder}`);
      projects.push(info);
    });
    
    spinner.succeed(`🧭 Explored: ${path}`);
  
    this.cache.push({
      path,
      projects
    });

    return {
      path,
      projects
    };
  }
}

export const projectStore = new ProjectStore();