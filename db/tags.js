/** @format */

const client = require("./client");

//const bcrypt = require('bcrypt');


// database methods

// goal: create a new tag that can be added to links
// input: takes in a parameter of 'title'
// output: returns a new tag

async function createTag(userId, title) {
  
    try {
        const {
            rows: [tag],
        } = await client.query(
            `

            INSERT INTO tags("creatorId", title)
            VALUES($1, $2)
            ON CONFLICT ("creatorId", title) DO NOTHING
            RETURNING *;
        `,
            [userId, title]
        );
        return tag;
    } catch (error) {
        throw error;
    }
}



// goal: permanently delete a tag from the tags table
// input: tag name
// output: true if success, false otherwise

async function destroyTag(userId, tagName) {
    
    try {
            
       await client.query(
                `
        DELETE FROM tags
        WHERE "creatorId"=$1
        AND title=$2;
    `,
                [userId, tagName]
            );

    } catch (error) {
        throw error;
    }
}

//working
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
            [userId, tagTitle]
        );

        if (tagId) {
        
            return tagId.id;
        } else {
            return false;
        }
    } catch (error) {
        throw error;
    }
}

async function getTitleFromTagId(userId, tagId) {
    try {
        const {
            rows: [title],
        } = await client.query(
            `
			SELECT title
			FROM tags
			WHERE "creatorId"=$1
			AND id=$2;
		`,
            [userId, tagId]
        );

        if (title) {
            return title;
        } else {
            return { name: "no match", message: `Couldn't find a matching user-tag pair` };
        }
    } catch (error) {
        throw error;
    }
}

async function getTagsForUser(userId) {
	try {
		const { rows: tags } = await client.query(`
			SELECT *
			FROM tags
			WHERE "creatorId"=$1;
		`, [userId]
		);
		return tags;
	} catch (error) {
		throw error;
	}
}

module.exports = {
    createTag,
    destroyTag,
    getTagIdFromTitle,
	getTitleFromTagId,
	getTagsForUser
};
