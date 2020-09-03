const { Client } = require('pg');

const DB_NAME = 'webkey'

const DB_URL = process.env.DATABASE_URL || `postgres://localhost:5432/webkey`;
const client = new Client(DB_URL);

// database methods


async function getAllLinks(linkId = null) {
  try {
    const { rows: links } = await client.query(`

            SELECT * 
            FROM links
            ${linkId ? `WHERE id = ${linkId};` : ';'}
      `);
    await Promise.all(links.map(
      async function (link) {
        const { rows: tagsArr } = await client.query(`
                SELECT (tags.title)
                FROM tags
                JOIN links_tags ON tags.id = links_tags."tagId"
                WHERE links_tags."linkId" = ${link.id};
              `);
        console.log('tags array: ', tagsArr);
        link.tags = tagsArr;
      }
      // link => link.tags = [1, 2]
    ));
    return links;
  } catch (error) {
    throw error;
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
    const { rows: [joint] } = await client.query(`
        INSERT INTO links_tags ("linkId", "tagId")
        VALUES ($1, $2)
        ON CONFLICT ("linkId", "tagId") DO NOTHING
        RETURNING *;
    `, [linkId, tagId]
    );
    return joint;
  } catch (error) {
    throw error;
  }
}
async function getLinksByTagName(tagName) {
  try {
    const links = await getAllLinks();

    const { rows: [tagId] } = await client.query(`
        SELECT id
        FROM tags
        WHERE title=$1;
    `, [tagName]
    );

    const { rows: linkArray } = await client.query(`
          SELECT (links.id)
          FROM links
          JOIN links_tags ON links.id = links_tags."linkId"
          WHERE links_tags."tagId" = $1;
        `, [tagId.id]
    );


    const requestedLinks = await Promise.all(linkArray.map(async function (arrayItem) {
      try {
        return await getAllLinks(arrayItem.id);
      } catch (error) {
        throw error;
      }
    }));

    console.log('return of the get Links by Tag Name ', requestedLinks);
    return requestedLinks;


  } catch (error) {
    throw error;
  }


}

module.exports = {
  client,
  getAllLinks,
  createLinks,
  createTags,
  connectTagsToLinks,
  getLinksByTagName
  // db methods
}