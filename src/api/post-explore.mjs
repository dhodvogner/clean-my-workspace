import { projectStore } from "../project-store.mjs"

export function postExplore(req, res) {
  projectStore.collectProjects(req.body.path);
  return res.status(200).send('OK');
}