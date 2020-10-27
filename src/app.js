const express = require('express');
const cors = require('cors');
const { v4: uuidv4, validate } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateRepoId(req, res, next) {
  const { id } = req.params;

  if (!validate(id)) {
    return res.status(400).json({ error: 'Invalid Repo ID.' });
  }

  return next();
}

app.use('/repositories/:id', validateRepoId);

app.get('/repositories', (request, response) => {
  return response.json(repositories);
});

app.post('/repositories', (request, response) => {
  const { title, url, techs } = request.body;

  const repo = {
    id: uuidv4(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(repo);

  return response.status(201).json(repo);
});

app.put('/repositories/:id', (request, response) => {
  const { title, url, techs } = request.body;
  const { id } = request.params;

  const repoIndex = repositories.findIndex((repo) => repo.id === id);
  if (repoIndex < 0) {
    return response.status(400).json({ error: 'Repository not found.' });
  }

  const { likes } = repositories.find((repo) => repo.id === id);

  const repo = {
    id,
    title,
    url,
    techs,
    likes,
  };

  repositories[repoIndex] = repo;

  return response.json(repo);
});

app.delete('/repositories/:id', (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex((repo) => repo.id === id);
  if (repoIndex < 0) {
    return response.status(400).json({ error: 'Repository not found.' });
  }

  repositories.splice(repoIndex, 1);

  return response.status(204).send();
});

app.post('/repositories/:id/like', (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex((repo) => repo.id === id);
  if (repoIndex < 0) {
    return response.status(400).json({ error: 'Repository not found.' });
  }

  repositories[repoIndex]['likes'] += 1;

  return response.json(repositories[repoIndex]);
});

module.exports = app;
