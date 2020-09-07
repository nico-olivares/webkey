// sets up DB

// const { Client } = require('pg');

// const DB_NAME = 'webkey';

// const DB_URL = process.env.DATABASE_URL || `postgres://localhost:5432/webkey`;
// const client = new Client(DB_URL);

const client = require('./client');

const bcrypt = require('bcrypt');
const e = require('express');

// database methods





async function addTagsToLinkObject(link) {
  try {
    const { id: linkId } = link;
    console.log('link ', link);
    console.log('linkId ', linkId);
    const { rows: tagIds } = await client.query(`
        SELECT *
        FROM links_tags
		WHERE "linkId"=$1
		;
    `, [ link.id ]
    );
    console.log('tagIds ', tagIds);
    const tags = await Promise.all(
        tagIds.map(async (tagId) => {
          const { rows: [ id ] } = client.query(`
              SELECT title
              FROM tags
              WHERE id = $1;
          `, [ tagId ]);
          return id;
      })
    );

    link.tags = tags;
    return link;

  } catch (error) {
    throw error;
  }
}




// goal: to remove a tag-link pair in the joint table
// input: link id, and tag title
// output: true if success, false otherwise

async function removeTagFromLink(userId, linkId, tagTitle) {
	try {
		const {
			rows: [id],
		} = await client.query(
			`
        SELECT id
        FROM tags
        WHERE "creatorId"=$1
        AND title=$2;
    `,
			[userId, tagTitle],
		);
		let tagId;
		if (id) {
			tagId = id.id;
		} else {
			tagId = null;
		}

		let rows;
		if (tagId) {
			rows = await client.query(
				`
        DELETE
        FROM links_tags
        WHERE "linkId"=$1 
        AND "tagId"=$2;
    `,
				[linkId, tagId],
			);
		} else {
			return false;
		}
		const { rowCount } = rows;

		if (rowCount === 1) {
			return true;
		} else {
			return false;
		}
	} catch (error) {
		throw error;
	}
}



// goal: adds a tag to a link
// input: take in a link id and a tag id
// output: makes a connection between the link and tag

async function addTagToLink(linkId, tagId) {
	try {
		const {
			rows: [joint],
		} = await client.query(
			`
            INSERT INTO links_tags ("linkId", "tagId")
            VALUES ($1, $2)
            ON CONFLICT ("linkId", "tagId") DO NOTHING
            RETURNING *;
        `,
			[linkId, tagId],
		);
		return joint;
	} catch (error) {
		throw error;
	}
}


async function removeTagFromAllLinks(tagId) {
	try {
		const { rowCount } = await client.query(`
			DELETE FROM links_tags
			WHERE "tagId"=$1;
		`, [ tagId ]
		);
		if (rowCount > 0) {
			return true;
		} else {
			return false;
		}
	} catch (error) {
		throw error;
	}
}




module.exports = {
	addTagToLink,
	removeTagFromLink,
	removeTagFromAllLinks,
	addTagsToLinkObject
};
