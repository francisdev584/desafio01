const express = require("express");

const server = express();

server.use(express.json());

const projects = [];

//função que checa se o projeto existe
function checkProjectExists(req, res, next) {
  const { id } = req.params;
  const project = projects.find(p => p.id === id);

  if (!project) {
    return res.status(400).json({ error: "Project not found" });
  }

  req.project = project;

  return next();
}

//função que conta quantas requisições foram feitas

let numberOfRequests = 0;

function CountRequests(req, res, next) {
  numberOfRequests++;

  console.log(`Número de requisições: ${numberOfRequests}`);

  next();
}

server.get("/projects", CountRequests, (req, res) => {
  return res.json(projects);
});

server.post("/projects", CountRequests, (req, res) => {
  const { id, title } = req.body;

  const project = {
    id,
    title,
    tasks: []
  };

  projects.push(project);

  return res.status(200).json(projects);
});

server.put("/projects/:id", CountRequests, checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  let project = projects.find(proj => proj.id === id);

  project.title = title;

  return res.status(200).json(projects);
});

server.delete(
  "/projects/:id",
  CountRequests,
  checkProjectExists,
  (req, res) => {
    const { id } = req.params;

    let index = projects.findIndex(p => p.id === id);

    projects.splice(index, 1);

    return res.send();
  }
);

// TASKS

server.post(
  "/projects/:id/tasks",
  CountRequests,
  checkProjectExists,
  (req, res) => {
    const { id } = req.params;
    const { title } = req.body;

    let project = projects.find(proj => proj.id === id);

    project.tasks.push(title);

    return res.send();
  }
);

server.listen(3000);
