const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const {title, url, techs} = request.body;

  if(title.trim() === "" || url.trim() === "" || techs.length === 0 ){
    return response.status(400).json({ error: "Values cannot be null or empty." });
  }

  const repository = { 
    id: uuid(), 
    title, 
    url, 
    techs, 
    likes: 0 
  };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const {id} = request.params;
  const {title, url, techs, likes} = request.body;
  const repositoryIndex = repositories.findIndex(repo => repo.id === id);

  if (likes !== undefined){
    return response.status(400).json({likes: 0});
  }
  
  if (repositoryIndex < 0) {
    return response.status(400).json({ error: "Repository not found." });
  }

  
  if(title.trim() === "" || url.trim() === "" || techs.length === 0 ){
    return response.status(400).json({ error: "Values cannot be null or empty." });
  }



  const newRepository = {
    ...repositories[repositoryIndex],
    id,
    title,
    url,
    techs
  }

  repositories[repositoryIndex] = newRepository;

  return response.json(newRepository);
});

app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params;

  const repositoryIndex = repositories.findIndex(repo => repo.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: "Repository not found." });
  }

  repositories.splice(repositoryIndex);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const {id} = request.params;

  const repositoryIndex = repositories.findIndex(repo => repo.id === id);

  if (Object.keys(request.body).length > 0){
    return response.status(400).json({ error: "Cannot like manually." });
  }

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: "Repository not found." });
  }


  const { likes } = repositories[repositoryIndex];

  const liked = likes + 1;

  const newRepository = {
    ...repositories[repositoryIndex],
    likes: liked
  }

  repositories[repositoryIndex] = newRepository;

  return response.json(newRepository);


});

module.exports = app;
