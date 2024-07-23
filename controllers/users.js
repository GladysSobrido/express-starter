const { sql } = require("@vercel/postgres");

/* DONE ✅
  - [x] create a new user
*/
const createUser = async (req, res) => {
  const { name } = req.body;
  const { rowCount } = await sql`INSERT INTO users (name) VALUES (${name})`;

  if (rowCount) {
    res.json({ message: `User with name ${name} was successfully created.` });
  } else {
    res.json({ message: `User with name ${name} COULD NOT be created.` });
  }
};

/* DONE ✅
  - [x] list all users
*/
const getAllUsers = async (req, res) => {
  const { rows } = await sql`SELECT * FROM users`;
  res.json(rows);
};

//New function to edit users. done!
const editUser = async (req, res) => {
  const { id, name } = req.body;
  const { rowCount } =
    await sql`UPDATE users SET name = ${name} WHERE id = ${id}`;
  res.json({ msg: `User with id = ${id} was updated` });
};
module.exports = { createUser, getAllUsers, editUser };
