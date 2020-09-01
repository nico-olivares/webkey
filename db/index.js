// Connect to DB
const { Client } = require('pg');

const DB_NAME = 'webkey'

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

async function createLinks({ url, title, clicks, comments, date }) {
  try {
    const { rows } = await client.query(`insert into links (url, title,clicks, comments, date)
    VALUES($1, $2, $3, $4, $5)
    ON CONFLICT (url) DO NOTHING
    RETURNING *;`, [url, title, clicks, comments, date])
    return rows
  }
  catch (error) {
    throw error
  }
}

async function connectTagsToLinks (linkId, tagId) {
  console.log(linkId);
  try {
    const { rows } = await client.query(`
        INSERT INTO links_tags ("linkId", "tagId")
        VALUES ($1, $2)
        ON CONFLICT ("linkId", "tagId") DO NOTHING
        RETURNING *;
    `, [ linkId, tagId ]
    );
  } catch (error) {
    throw error;
  }
}

// export
module.exports = {
  client,
  createLinks,
  createTags,
  connectTagsToLinks
  // db methods
}