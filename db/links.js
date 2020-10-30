/** @format */

const client = require('./client');
//const bcrypt = require('bcrypt');
const Promise = require('bluebird');

const {
	addTagToLink,
	// addTagsToLinkObject,
	getTagsFromLinkId,
	removeTagFromLink,
	tagIdStillPresentInJointTable,
} = require('./links_tags.js');
const { createTag, getTagIdFromTitle, getTitleFromTagId, destroyTag } = require('./tags');

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
		const tagsLength = tags.length;

		if (tags.length > 0) {
			Promise.each(tags, async (tag, i, tagsLength) => {
				await addTagToLink(creatorId, newLink.id, tag);
			})
		}

		const newLinkWithTags = await getAllLinks(newLink.creatorId, newLink.id);

		return newLinkWithTags;
	} catch (error) {
		throw error;
	}
}

// goal: update the link
// input: link id and fields as an object
// output: returns an updated link

/*
Needs review
update link without tags
get old tags and compare to new
ignore tags that didn't change
the tags that did change:
list deletions and additions.
For addition, check to see if already exists. If it does then just add to joint table. Else create
in tags table and add to join table.
For deletion check the number of instances of the tag in the joint table. If it's 1, then remove from
joint table and from tags table.
If it's more than 1 then just remove from join table
*/

async function updateLink(linkId, fields = {}, tags = []) {
	
	let newLink;
	try {
		async function updateLinkFields(linkId, fields) {
			try {
				const setString = Object.keys(fields)
					.map((key, index) => `"${key}"=$${index + 1}`)
					.join(', ');

				if (setString.length === 0 && tags.length === 0) {
					return;
				}
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
					newLink = link; //without tags
				}

				return newLink;
			} catch (error) {
				throw error;
			}
		}

		async function addOrRemoveTags(newLink, tags) {
			//variables passing in correctly

			try {
				const oldTags = await getTagsFromLinkId(linkId); //working

				//drop all old tags WORKING
				if (oldTags.length > 0 && tags.length === 0) {
					await Promise.all(
						oldTags.map(async (tag) => {
							try {
								await removeTagFromLink(newLink.creatorId, newLink.id, tag.title); //working

								const moreLinks = await tagIdStillPresentInJointTable(tag.id); //working
								if (!moreLinks) {
									await destroyTag(newLink.creatorId, tag.title); //working
								}
							} catch (error) {
								throw error;
							}
						}),
					);

					newLink = await getAllLinks(newLink.creatorId, newLink.id);

					return newLink;

					//add new tags  NOT WORKING
				} else if (tags.length > 0 && oldTags.length === 0) {
					await Promise.all(
						tags.map(async (tag) => {
							const newTag = await createTag(newLink.creatorId, tag);
							await addTagToLink(newLink.id, newTag.id);
						}),
					);

					newLink = await getAllLinks(newLink.creatorId, newLink.id);

					return newLink;

					//compare tags. Add new ones, drop old ones, do nothing to the ones that were in the old and the new
				} else {
					const removeTagsBinTemp = oldTags.map((tag) => {
						let absent = true;
						tags.forEach((newTagTitle) => {
							if (tag.title === newTagTitle) {
								absent = false;
							}
						});
						if (absent) {
							return tag;
						}
					});

					const removeTagsBin = removeTagsBinTemp.filter((item) => item);

					const addTagsBinTemp = tags.map((newTag) => {
						let newTagBoolean = true;
						oldTags.forEach((oldTag) => {
							if (oldTag.title === newTag) {
								newTag = false;
							}
						});
						if (newTagBoolean) {
							return newTag;
						}
					});

					const addTagsBin = addTagsBinTemp.filter((item) => item);

					if (removeTagsBin.length > 0) {
						await Promise.all(
							removeTagsBin.map(async (tag) => {
								try {
									await removeTagFromLink(
										newLink.creatorId,
										newLink.id,
										tag.title,
									); //working

									const moreLinks = await tagIdStillPresentInJointTable(tag.id); //working
									if (!moreLinks) {
										await destroyTag(newLink.creatorId, tag.title); //working
									}
								} catch (error) {
									throw error;
								}
							}),
						);
					}

					if (addTagsBin.length > 0) {
						await Promise.all(
							addTagsBin.map(async (tag) => {
								const newTag = await createTag(newLink.creatorId, tag);
								await addTagToLink(newLink.id, newTag.id);
							}),
						);
					}

					newLink = await getAllLinks(newLink.creatorId, newLink.id);

					return newLink;
				}
			} catch (error) {
				throw error;
			}
		}

		newLink = await updateLinkFields(linkId, fields);
		newLink = await addOrRemoveTags(newLink, tags);
		return newLink;
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
		
		const linksLength = links.length; 

		Promise.each(links, async (link, i, linksLength) => {
			// const { rows: tagsArr } = await client.query(`

            //     SELECT (tags.title)
            //     FROM tags
            //     JOIN links_tags ON tags.id = links_tags."tagId"
            //     WHERE links_tags."linkId" = $1;
            //   `, [ link.id ]);
			// console.log('tags array raw ', tagsArr);
			// 	const tagTitleArray = tagsArr.map((tags) => {
			// 		return tags.title;
			// 	});
			// console.log('tags array ', tagTitleArray);

			const tagTitleArray = await getTagsFromLinkId(link.id);
				link.tags = tagTitleArray;
		})


		// await Promise.all(
		// 	links.map(async function (link) {
		// 		const { rows: tagsArr } = await client.query(`

        //         SELECT (tags.title)
        //         FROM tags
        //         JOIN links_tags ON tags.id = links_tags."tagId"
        //         WHERE links_tags."linkId" = ${link.id};
        //       `);
				
		// 		const tagTitleArray = tagsArr.map((tags) => {
		// 			return tags.title;
		// 		});
		// 		link.tags = tagTitleArray;
		// 	}),
		// );
		if (links) {
			return links;
		} else {
			return [];
		}
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
			return {
				name: 'No such user or tag name',
				message: "couldn't get the tag id",
			};
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

async function linkClick(linkId) {
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
		const clicks = link.clicks + 1;
		const {
			rows: [newLink],
		} = await client.query(
			`
			UPDATE links
			SET clicks=${clicks}
			WHERE id=$1
			RETURNING *
		`,
			[linkId],
		);
		return await getAllLinks(newLink.creatorId, linkId);
	} catch (error) {
		throw error;
	}
}

module.exports = {
	getAllLinks,
	createLink,
	updateLink,
	getLinksByTagName,
	linkClick,
};
