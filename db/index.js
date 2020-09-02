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
        await Promise.all(links.map(
            link => { 
                link.tags = getTagsByLinkId(link.id) 
            }
            // link => link.tags = [1, 2]
        ));
        return links;
    } catch(error) {
        throw error;
    }
}

async function getTagsByLinkId( linkId ) {
    try {
        const { rows: [link] } = await client.query(`
            SELECT * 
            FROM links
            WHERE id=$1;
        `, [linkId]);
        console.log('this', link)
        const { rows } = await client.query(`
            SELECT tags.* 
            FROM tags
            JOIN links_tags 
            ON tags.id=links_tags."tagId"
            WHERE links_tags."linkId"=$1;
        `, [linkId]);

        return link;

    } catch(error) {
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

async function connectTagsToLinks (linkId, tagId) {
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
    getAllLinks,
    createLinks,
    createTags,
    connectTagsToLinks
    // db methods
}