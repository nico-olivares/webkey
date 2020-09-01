// Connect to DB
const { Client } = require('pg');
const DB_NAME = 'change-this-name'
const DB_URL = process.env.DATABASE_URL || `postgres://localhost:5432/webkey`;
const client = new Client(DB_URL);

// database methods
async function createTags({ title }) {
  try {
    const { rows } = await client.query(`insert into tags(title)
    VALUES($1)
    RETURNING *;`, [title])
    return rows
  } catch (error) {
    throw error
  }
}
// export
module.exports = {
  client,
  createTags
  // db methods
}