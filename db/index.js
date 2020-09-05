// sets up DB

const { Client } = require('pg');
const DB_NAME = 'webkey'

const DB_URL = process.env.DATABASE_URL || `postgres://localhost:5432/webkey`;
const client = new Client(DB_URL);

// database methods

// goal: update the link
// input: link id and fields as an object
// output: returns an updated link
// debt: need to also update tags

async function updateLink(linkId, fields={}) {
    const setString = Object.keys(fields).map(
        (key, index) => `"${key}"=$${index + 1}`
    ).join(', ');

    if (setString.length === 0) {
        return;
    }

    try {
        const { rows: [link]} = await client.query(`
            UPDATE links
            SET ${setString}
            WHERE id=${linkId}
            RETURNING *;
        `, Object.values(fields)
        );
        return getAllLinks(linkId);
    } catch(error) {
        throw error;
    }
}

// goal: get a list of all links
// input: linkId as null
// output: returns an array of objects

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
    ));
    return links;
  } catch (error) {
    throw error;
  }
}

// goal: create a new link that tags can be add to
// input: takes in parameters of url, title, clicks, comments, date
// output: returns a new link

async function createLink({ url, title, clicks, comments, date }) {
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

// goal: create a new tag that can be added to links
// input: takes in a parameter of 'title'
// output: returns a new tag

async function createTag({ title }) {
    try {
      const { rows } = await client.query(`insert into tags(title)
      VALUES($1)
      RETURNING *;`, [title])
      return rows
    } catch (error) {
      throw error
    }
  }

// goal: adds a tag to a link
// input: take in a link id and a tag id
// output: makes a connection between the link and tag

async function addTagToLink(linkId, tagId) {
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

// goal: get a list of links by tag name
// input: take in a a tagname
// output: an array of links associated with the tag

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

    const { requestedLinks } = await Promise.all(linkArray.map(
        async function (arrayItem) {
            try {
                return await getAllLinks(arrayItem.id);
            } catch (error) {
                throw error;
            }
        }
    ));
    return requestedLinks;
  } catch (error) {
    throw error;
  }

}

module.exports = {
  client,
  getAllLinks,
  createLink,
  updateLink,
  createTag,
  addTagToLink,
  getLinksByTagName,
  // db methods
}