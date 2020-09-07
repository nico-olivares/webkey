// sets up DB

// const { Client } = require('pg');

// const DB_NAME = 'webkey';

// const DB_URL = process.env.DATABASE_URL || `postgres://localhost:5432/webkey`;
// const client = new Client(DB_URL);

const client = require('./client');

const bcrypt = require('bcrypt');

const { removeTagFromAllLinks } = require('./index');

// database methods

// goal: create a new tag that can be added to links
// input: takes in a parameter of 'title'
// output: returns a new tag

async function createTag(userId, title) {
	try {
		const { rows } = await client.query(
			`

            INSERT INTO tags("creatorId", title)
            VALUES($1, $2)
            ON CONFLICT ("creatorId", title) DO NOTHING
            RETURNING *;

        `,
			[userId, title],
		);
		return rows;
	} catch (error) {
		throw error;
	}
}

// goal: to remove a tag-link pair in the joint table
// input: link id, and tag title
// output: true if success, false otherwise

// goal: permanently delete a tag from the tags table
// input: tag name
// output: true if success, false otherwise

async function destroyTag(userId, tagName) {
	try {

		const tagId = await getTagIdFromTitle(userId, tagName);

		await removeTagFromAllLinks(tagId);

		const { rowCount } = await client.query(
			`
        DELETE FROM tags
        WHERE "creatorId"=$1
        AND title=$2;
    `,
			[userId, tagName],
		);
		if (rowCount === 1) {
			return true;
		} else {
			return false;
		}
	} catch (error) {
		throw error;
	}
}

async function getTagIdFromTitle(userId, tagTitle) {
	try {
		const {
			rows: [tagId],
		} = await client.query(
			`
        SELECT id
        FROM tags
        WHERE "creatorId"=$1
        AND title=$2;
    `,
			[userId, tagTitle],
		);
		if (tagId) {
			return tagId;
		} else {
			return false;
		}
	} catch (error) {
		throw error;
	}
}

module.exports = {
	createTag,
	destroyTag,
	getTagIdFromTitle,
};
