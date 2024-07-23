const { sql } = require("@vercel/postgres");

const getAllNotes = async (req, res) => {
  const { user } = req.params;
  const { rows } = await sql`SELECT * FROM notes `;
  res.json({
    "These are all the notes. Write username/ notes to filter them by user.":
      rows,
  });
};

/* Done! 🕜
  - change route to something like "/:user/notes"
  - check if user exists
  - return all notes by that user
*/
const getNotesByUser = async (req, res) => {
  const { user } = req.params;

  const { rows } =
    await sql`SELECT notes.id, users.name, notes.content, notes.category FROM notes 
                               inner JOIN users ON notes."userId" = users.id
                               WHERE users.name = ${user}`;
  if (!rows.length) {
    return res.json({
      message: `Error. Could NOT find the user ${user} or this user has no notes.`,
    });
  } else {
    res.json(rows);
  }
};

/* TODO 🕜
UNFINISHED
  - change route to something like "/:user/notes/:id"
  - check if user exists
  - return the individual note by that user
*/
const getIndividualNoteByUser = async (req, res) => {
  const { id, user } = req.params;
  const { rows: rowsUser } =
    await sql`SELECT * FROM users WHERE name = ${user}`;

  /* if the user DOES NOT EXIST respond with a message and return from the function */
  if (!rowsUser.length) {
    return res.json({
      message: `Error. Could NOT find the user ${user} or this user has no notes.`,
    });
  }
  const { rows } =
    await sql`SELECT notes.id, users.name, notes.content, notes.category FROM notes
                                  inner JOIN users ON notes."userId" = users.id
                
                                   WHERE  notes.id = ${Number(id)}
                                   AND users.id = ${rowsUser[0].id}`;

  res.json(rows);
};
/* DONE ✅
  - [x] change route to something like "/:user/notes"
  - [x] check if user exists
  - [x] return success/failure message
*/
const postNote = async (req, res) => {
  const { user } = req.params;
  const { content, category } = req.body;

  if (!content || !category) {
    return res.json({
      message:
        "Could NOT add note because content and category were not provided.",
    });
  }

  const { rows } = await sql`SELECT * FROM users WHERE name = ${user}`;

  /* if the user DOES NOT EXIST respond with a message and return from the function */
  if (!rows.length) {
    return res.json({ message: `Could NOT find the user ${user}.` });
  }

  const { rowCount } =
    await sql`INSERT INTO notes (CONTENT, CATEGORY, "userId") VALUES (${content},${category},${rows[0].id})`;

  if (rowCount) {
    res.json({
      message: `A new note with content = ${content} and category = ${category} was added.`,
    });
  } else {
    res.json({
      message: `Note could NOT be created.`,
    });
  }
};
/* TODO 🕜
  - change route to something like "/:user/notes/:id"
  - check if user exists
  - delete the individual note by that user
  - return a success/failure message
*/
const deleteNote = async (req, res) => {
  const { id } = req.params;

  const { rowCount } = await sql`DELETE FROM notes where id = ${id}`;

  res.json({ msg: `Element with id=${id} successfully deleted` });
};

/* TODO 🕜
  - change route to something like "/:user/notes/:id"
  - check if user exists
  - update the individual note by that user
  - return a success/failure message
*/
const editNote = async (req, res) => {
  const { id } = req.params;
  const { content, category } = req.body;

  const { rowCount } =
    await sql`UPDATE notes SET content = ${content},category = ${category} WHERE id = ${id}`;

  res.json({ msg: `Element with id=${id} successfully updated` });
};
module.exports = {
  getAllNotes,
  getIndividualNoteByUser,
  getNotesByUser,
  deleteNote,
  postNote,
  editNote,
};
