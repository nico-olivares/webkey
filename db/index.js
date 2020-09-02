// Connect to DB
const { Client } = require('pg');

const DB_NAME = 'webkey'

const DB_URL = process.env.DATABASE_URL || `postgres://localhost:5432/webkey`;
const client = new Client(DB_URL);

// database methods

async function getAllLinks() {
  try {
    const { rows: links } = await client.query(`
            SELECT * 
            FROM links;
        `);
    const linkarr = await Promise.all(links.map(
      link => {
        getTagsByLinkId(link.id)
        console.log('is this link tags', link);
      }
      // link => link.tags = [1, 2]
    ));
    return linkarr;
  } catch (error) {
    throw error;
  }
}

async function getTagsByLinkId(linkId) {
  try {
    console.log('working? get tags by link id', linkId)
    const { rows: tag } = await client.query(`
            SELECT * 
            FROM links
            WHERE id=$1
            RETURNING *;
        `, [linkId])

    console.log('this is the tag', linkId)

    const { rows } = await client.query(`
            SELECT * FROM links
            JOIN links_tags ON tags.id=links_tags."tagId"
            WHERE links_tags."linkId"=$1;
        `, [linkId]);
    console.log('this is the tag', tag)
    return tag;

  } catch (error) {
    throw error
  }
}

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

async function connectTagsToLinks(linkId, tagId) {
  try {
    const { rows } = await client.query(`
        INSERT INTO links_tags ("linkId", "tagId")
        VALUES ($1, $2)
        ON CONFLICT ("linkId", "tagId") DO NOTHING
        RETURNING *;
    `, [linkId, tagId]
    );
  } catch (error) {
    throw error;
  }
}

// export
module.exports = {
  client,
  getAllLinks,
  createLinks,
  createTags,
  connectTagsToLinks
  // db methods
}