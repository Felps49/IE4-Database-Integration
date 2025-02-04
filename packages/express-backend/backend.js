import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userService from "./services/user-service.js";

dotenv.config();

const { MONGO_CONNECTION_STRING } = process.env;

mongoose.set("debug", true);
mongoose
  .connect(MONGO_CONNECTION_STRING + "users") // connect to Db "users"
  .catch((error) => console.log(error));
  
const app = express();
app.use(cors());
app.use(express.json());
const port = 8000;

app.get("/users", (req, res) => {
  const {name, job} = req.query;
  userService
    .getUsers(name, job)
    .then((users) => res.send({users_list: users}))
    .catch((err) => res.status(500).send({error: err.message}));
});
  
  app.get("/users/:id", (req, res) => {
    const id = req.params["id"]; //or req.params.id
    userService
      .findUserById(id)
      .then((user) => {
        if(user) res.send(user);
        else res.status(404).send("Not Found");
    })
    .catch((err) => res.status(500).send({error: err.message}));
  });
  
  app.post("/users", (req, res) => {
    const userToAdd = req.body;
    if (!userToAdd.name || !userToAdd.job) {
      res.status(400).send({error: "Missing required fields"});
      return; 
    }
    userService
      .addUser(userToAdd)
      .then((newUser) => res.status(201).json(newUser))
      .catch((err) => res.status(500).send({error: err.message}));
  });

app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});