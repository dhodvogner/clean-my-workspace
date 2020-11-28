import { projectStore } from "../project-store.mjs";

export function getResults(req, res) {
  const results = projectStore.getLatest()
  res.send(results); 
}