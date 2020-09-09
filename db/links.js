const client = require('./client');
//const bcrypt = require('bcrypt');

const { addTagToLink, addTagsToLinkObject, getTagsFromLinkId } = require('./links_tags.js');
const { createTag, getTagIdFromTitle, getTitleFromTagId } = require('./tags');

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
	try {
		try {
			const setString = Object.keys(fields)
			.map((key, index) => `"${key}"=$${index + 1}`)
			.join(', ');
	
		if (setString.length === 0 && tags.length === 0) {
			return;
		}
			let newLink;
			if (setString.length !== 0) {
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
				newLink = link;	//without tags
			}
			
			const oldTags = await getTagsFromLinkId(linkId);
			console.log('the new link without tags ', newLink);
			

			//From here on out it needs some work. Make sure everything is working properly
			//If removing a tag I need to check that the tag isn't unlink from everywhere, if it is it needs to be destroyed
			if (oldTags && tags.length === 0) {
				newLink = await getAllLinks(newLink.creatorId, newLink.id);
				console.log('new link from within oldTags, but no new tags: ', newLink);
				return newLink;
			} else if (tags.length > 0 && !oldTags) {
				Promise.all(tags.forEach(async tag => {
					await createTag(newLink.creatorId, tag);
				}));
				newLink = await getAllLinks(newLink.creatorId, newLink.id);
				console.log('new link from within no old tags, but some new tags ', newLink);
			} else {

			const removeTagsBin = oldTags.map(tag => {
				let absent = true;
				tags.forEach(newTagTitle => {
					if (tag.title === newTagTitle) {
						absent = false;
					}
				})
				if (absent) {
					return tag;
				}
			});
			

			const addTagsBin = tags.map(newTag => {
				let newTagBoolean = true;
				oldTags.forEach(oldTag => {
					if (oldTag.title === newTag) {
						newTag = false;
					}
				});
				if (newTagBoolean) {
					return newTag;
				}
			});

			console.log('removeTagsBin ', removeTagsBin);
			console.log('addTagsBin ', addTagsBin);
			newLink = await getAllLinks(newLink.creatorId, newLink.id);;
			console.log('newLink from within both old and new tags ', newLink);
		}
			
		return newLink;

		} catch (error) {
	
		}
	} catch (error) {
		throw error;
	}
}



//make add bin and remove bin
async function compareNewAndOldTags(oldTags, newTags) {
	try {

	} catch (error) {

	}
}

//Return same removeTagBins
async function removeRemovalTags(removeTagsBin) {
	try {

	} catch (error) {

	}
}

//destroy if there's no more connections
async function checkForMoreConnections(removeTagsBin) {
	try {

	} catch (error) {

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
				console.log('tags arrays ', tagsArr);
				const tagTitleArray = tagsArr.map(tags => {
					return tags.title;
				});
				link.tags = tagTitleArray;
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
			link.tags = await getTagTitlesFromLinkId(linkId);
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
