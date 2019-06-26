const express = require("express");

const server = express();

server.use(express.json());

let countRequests = 0;
const projects = [];

function sumOneToCountRequests(req, res, next) {
  countRequests++;
  console.log(`Total de requests: ${countRequests}`);

  next();
}

server.use(sumOneToCountRequests);

function projectIdExists(req, res, next) {
  const { id } = req.params;
  const project = projects.find(project => project.id === id);

  if (!project) {
    return res.status(400).json({ error: "Project not found" });
  }

  next();
}

server.post("/projects", (req, res) => {
  const { id, title } = req.body;

  const project = {
    id,
    title,
    tasks: []
  };

  projects.push({ id, title });
  res.send(projects);
});

server.get("/projects", (req, res) => {
  return res.send(projects);
});

server.put("/projects/:id", projectIdExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(project => project.id === id);
  project.title = title;

  res.send(project);
});

server.delete("/projects/:id", projectIdExists, (req, res) => {
  const { id } = req.params;

  const projectIndex = projects.findIndex(project => project.id === id);

  projects.splice(projectIndex, 1);

  return res.send();
});

server.post("/projects/:id/tasks", projectIdExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(project => project.id === id);

  projects.tasks.push(title);

  return res.json(project);
});

server.listen(3333);
