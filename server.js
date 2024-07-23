require("dotenv").config();
const cors = require("cors");
const express = require("express");
const { sql } = require("@vercel/postgres");
const { createUser, getAllUsers, editUser } = require("./controllers/users");
const {
  getAllNotes,
  getNotesByUser,
  getIndividualNoteByUser,
  postNote,
  deleteNote,
  editNote,
} = require("./controllers/notes");

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.json({ msg: "Hello from the Notes App - This is the demo" });
});

app.post("/users", createUser);

app.get("/users", getAllUsers);

app.get("/notes", getAllNotes);

app.get("/:user/notes", getNotesByUser);

app.get("/:user/notes/:id", getIndividualNoteByUser);

app.post("/:user/notes", postNote);

//New function to edit users. done!
app.patch("/users", editUser);

app.delete("/notes/:id", deleteNote);

app.patch("/notes/:id", editNote);

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
//cors added
