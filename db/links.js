const client = require('./client');
//const bcrypt = require('bcrypt');

const { addTagToLink, addTagsToLinkObject, getTagsForLinkId } = require('./links_tags.js');
const { createTag, getTagIdFromTitle } = require('./tags');

// database methods

// goal: create a new link that tags can be add to
// input: takes in parameters of url, title, clicks, description, date
// output: returns a new link

async function createLink({ creatorId, url, title, description, tags = [] }) {
	let today = new Date();
	let date = today.getFullYear() + '/' + today.getDate() + '/' + (today.getMonth() + 1);

	try {
		let {
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

		if (tags.length > 0) {
			
			tags.forEach(async function (tag) {
				let tagId = await getTagIdFromTitle(creatorId, tag);
				if (!tagId) {
					const newTag = await createTag(creatorId, tag);
					tagId = newTag.id;
				}

				await addTagToLink(newLink.id, tagId);
				
			});
		}

		// newLink = await addTagsToLinkObject(newLink);   Why is it not working?
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

	if (setString.length === 0 && tags.length === 0) {
		return;
	}

	try {
		if (setString.length !== 0) {
			const {
				rows: [link],
			} = await client.query(
				`
            UPDATE links
            SET ${setString}
			WHERE id=${linkId} 
			AND "creatorId"=${userId}
            RETURNING *;
        `,
				Object.values(fields),
			);
		}

		if (tags.length !== 0) {
			//check if tag exists for user. If it does, add to link
			//if tag doesn't exist, create and add to link
			//check to see if there's a tag that was in the link and isn't there anymore
			//then check to see if once removed this is going to be belong to no link
			//no link destroy. Other links then remove from link only
		}


		return getAllLinks(link.creatorId, linkId);
	} catch (error) {
		throw error;
	}
}

// goal: get a list of all links
// input: linkId as null
// output: returns an array of objects (links with their tags)

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

async function getLinkById(linkId) {
	try {
		const {
			rows: [link],
		} = await client.query(
			`
			SELECT *
			FROM links
			WHERE id=$1;
		`,
			[linkId],
		);

		if (link) {
			link.tags = await getTagsForLinkId(linkId);
			return link;
		} else {
			return { name: 'No link found', message: 'No link with that id' };
		}
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
