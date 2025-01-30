import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());
const port = 8000;
const users = {
    users_list: [
      {
        id: "xyz789",
        name: "Charlie",
        job: "Janitor"
      },
      {
        id: "abc123",
        name: "Mac",
        job: "Bouncer"
      },
      {
        id: "ppp222",
        name: "Mac",
        job: "Professor"
      },
      {
        id: "yat999",
        name: "Dee",
        job: "Aspring actress"
      },
      {
        id: "zap555",
        name: "Dennis",
        job: "Bartender"
      }
    ]
  };

  const findUserByName = (name) => {
    return users["users_list"].filter(
      (user) => user["name"] === name
    );
  };
  
  app.get("/users", (req, res) => {
    const name = req.query.name;
    if (name != undefined) {
      let result = findUserByName(name);
      result = { users_list: result };
      res.send(result);
    } else {
      res.send(users);
    }
  });

  const findUserById = (id) =>
    users["users_list"].find((user) => user["id"] === id);
  
  app.get("/users/:id", (req, res) => {
    const id = req.params["id"]; //or req.params.id
    let result = findUserById(id);
    if (result === undefined) {
      res.status(404).send("Resource not found.");
    } else {
      res.send(result);
    }
  });

  const generateId = () => {
    return Math.random().toString(36).substring(2, 10);
  };

  const addUser = (user) => {
    user.id = generateId();
    users["users_list"].push(user);
    return user;
  };
  
  app.post("/users", (req, res) => {
    const userToAdd = req.body;
    if (!userToAdd.name || !userToAdd.job) {
      res.status(400).send({error: "Missing required fields"});
      return; 
    }
    const newUser = addUser(userToAdd);
    res.status(201).json(newUser)
  });

const deleteUserByID = (id) => {
    const index = users["users_list"].findIndex((user) => user["id"] == id);
    if (index != -1) {
        users["users_list"].splice(index, 1);
        return true;
    }
    return false;
};

app.delete("/users/:id", (req, res) => {
    const id = req.params.id;
    let deleted = deleteUserByID(id);
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).send('Couldnt find user');
    }
});

const findUserByNameAndJob = (name, job) => {
    return users["users_list"].filter(
      (user) => user["name"] === name && user["job"] == job);
  };
  
  app.get("/users", (req, res) => {
    const {name, job} = req.query;
    if (name && job) {
      let result = findUserByNameAndJob(name, job);
      res.send({user_list: result})
    } else if (name) {
      let result = findUserByName(name);
      res.send({user_list: result});
    } else {
        res.send(users);
    }
  });

app.get("/users", (req, res) => {
  res.send(users);
});

app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});