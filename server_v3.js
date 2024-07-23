require("dotenv").config();
const express = require("express");
const { sql } = require("@vercel/postgres");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ msg: "Hello from the Notes App - This is the demo" });
});
//CREATE A NEW USER
app.post("/users", async (req, res) => {
  const { name } = req.body;
  const { rowCount } = await sql`INSERT INTO users(NAME) VALUES (${name})`;

  if (rowCount) {
    res.json(`User with name ${name} was successfully created`);
  } else {
    res.json(`User with name ${name} COULD NOT be created`);
  }
});
//GET the list of all users
app.get("/users", async (req, res) => {
  const { rows } = await sql`SELECT * FROM USERS`;
  res.json(rows);
});
/*This code needs to be adjusted: 
 -change route to something like "/:user/notes"
 -Check if user exists
 -REturn all notes by that user
 */
app.get("/notes", async (req, res) => {
  const { rows } = await sql`SELECT * FROM notes`;
  res.json(rows);
});
/* Change this to /:user/notes/:id
 */
app.get("/notes/:id", async (req, res) => {
  const { id } = req.params;
  const { rows } = await sql`SELECT * FROM notes WHERE notes.id = ${id} `;
  res.json(rows);
});

app.post("/notes", async (req, res) => {
  const newNote = req.body;

  const { rowCount } =
    await sql`INSERT INTO  notes (CONTENT, CATEGORY) VALUES (${newNote.content},${newNote.category})`;

  res.json({
    msg: `A new element with content = ${newNote.content} and category= ${newNote.category} was added.`,
  });
});

app.delete("/notes/:id", async (req, res) => {
  const { id } = req.params;

  const { rowCount } = await sql`DELETE FROM notes where id = ${id}`;

  res.json({ msg: `Element with id=${id} successfully deleted` });
});

app.patch("/notes/:id", async (req, res) => {
  const { id } = req.params;
  const { content, category } = req.body;

  const { rowCount } =
    await sql`UPDATE notes SET content = ${content},category = ${category} WHERE id = ${id}`;

  res.json({ msg: `Element with id=${id} successfully updated` });
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
