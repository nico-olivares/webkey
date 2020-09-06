// sets up DB

// const { Client } = require('pg');

// const DB_NAME = 'webkey';

// const DB_URL = process.env.DATABASE_URL || `postgres://localhost:5432/webkey`;
// const client = new Client(DB_URL);

const client = require('./client');
const bcrypt = require('bcrypt');

const { addTagToLink, addTagsToLinkObject } = require('./links_tags.js');
const { createTag } = require('./tags');


// database methods


// goal: create a new link that tags can be add to
// input: takes in parameters of url, title, clicks, description, date
// output: returns a new link

async function createLink({ creatorId, url, title, description, tags = [] }) {
	let today = new Date();
	let date = today.getFullYear() + '/' + today.getDate() + '/' + (today.getMonth() + 1);
	
	try {
		const {
			rows: [newLink],
		} = await client.query(
			`
            INSERT into links ("creatorId", url, title, clicks, description, date)
            VALUES($1, $2, $3, $4, $5, $6)
            ON CONFLICT ("creatorId", url) DO NOTHING
            RETURNING *;
        `,
			[creatorId, url, title, 0, description, date],
		);
		if (!newLink) {
			return {
				name: 'Error creating link',
				message: `Couldn't create the new link. It may already exist`,
			};
		}

		if (tags.length > 0 && newLink) {
			tags.forEach(async function (tag) {
				const [newTag] = await createTag(creatorId, tag);
				
				await addTagToLink(newLink.id, newTag.id);
			});
		}
	// 	setTimeout(()=>{}, 4000);
	// 	console.log('newLink ', newLink);
	// 	console.log('linkId ', newLink.id);
		
	// 	const { rows: tagIds } = await client.query(`
    //     SELECT *
    //     FROM links_tags
	// 	WHERE "linkId"=${newLink.id}
	// 	;
    // `
	// );
	
    // console.log('tagIds ', tagIds);
    // const tagsArray = await Promise.all(
    //     tagIds.map(async (tagId) => {
    //       const { rows: [ id ] } = client.query(`
    //           SELECT title
    //           FROM tags
    //           WHERE id = $1;
    //       `, [ tagId ]);
    //       return id;
    //   })
    // );

	 newLink.tags = tags;
	

    return newLink;

	} catch (error) {
		throw error;
	}
}

// goal: update the link
// input: link id and fields as an object
// output: returns an updated link

async function updateLink(linkId, fields = {}, tags = []) {
	const setString = Object.keys(fields)
		.map((key, index) => `"${key}"=$${index + 1}`)
		.join(', ');

	if (setString.length === 0) {
		return;
	}

	try {
		const {
			rows: [link],
		} = await client.query(
			`

            UPDATE links
            SET ${setString}
            WHERE id=${linkId}
            RETURNING *;

        `,
			Object.values(fields),
		);
		return getAllLinks(linkId);
	} catch (error) {
		throw error;
	}
}

// goal: get a list of all links
// input: linkId as null
// output: returns an array of objects

async function getAllLinks(userId, linkId = null) {
	try {
		const { rows: links } = await client.query(`
            SELECT * 
            FROM links
            WHERE "creatorId"=${userId}
            ${linkId ? `AND id = ${linkId};` : ';'}
        `);
		await Promise.all(
			links.map(async function (link) {
				const { rows: tagsArr } = await client.query(`

                SELECT (tags.title)
                FROM tags
                JOIN links_tags ON tags.id = links_tags."tagId"
                WHERE links_tags."linkId" = ${link.id};
              `);

				link.tags = tagsArr;
			}),
		);
		return links;
	} catch (error) {
		throw error;
	}
}




// goal: get a list of links by tag name
// input: take in a a tagname
// output: an array of links associated with the tag

async function getLinksByTagName(userId, tagName) {
	try {
		const links = await getAllLinks(userId);

		const {
			rows: [tagId],
		} = await client.query(
			`
                SELECT id
                FROM tags
                WHERE "creatorId"=$1
                AND title=$2;
        `,
			[userId, tagName],
		);

		if (!tagId) {
			return { name: 'No such user or tag name', message: "couldn't get the tag id" };
		}

		const { rows: linkArray } = await client.query(
			`
            SELECT *
            FROM links
            JOIN links_tags ON links.id = links_tags."linkId"
            WHERE links_tags."tagId" = $1
            AND links."creatorId"=$2;
        `,
			[tagId.id, userId],
		);

		if (linkArray) {
			linkArray.map((link) => {
				delete link.linkId;
				delete link.tagId;
			});
		} else {
			return {
				name: 'No links for user',
				message: "This user doesn't have any links for that tag",
			};
		}

		const requestedLinks = await Promise.all(
			linkArray.map(async function (arrayItem) {
				try {
					return await getAllLinks(userId, arrayItem.id);
				} catch (error) {
					throw error;
				}
			}),
		);

		return requestedLinks;
	} catch (error) {
		throw error;
	}
}

module.exports = {
	getAllLinks,
	createLink,
	updateLink,
	getLinksByTagName,
};
