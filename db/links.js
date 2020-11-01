/** @format */

const client = require('./client');
//const bcrypt = require('bcrypt');
const Promise = require('bluebird');

const {
	addTagsToLink,
	// addTagsToLinkObject,
	getTagsFromLinkId,
	removeTagFromLink,
	tagIdStillPresentInJointTable,
} = require('./links_tags.js');
const { createTag, getTagIdFromTitle, getTitleFromTagId, destroyTag } = require('./tags');
const tags = require('./tags');

// database methods

// goal: create a new link that tags can be add to
// input: takes in parameters of url, title, clicks, description, date
// output: returns a new link

async function createLink({ creatorId, url, title, description, tags = [] }) {
	
	let today = new Date();
	let date = today.getFullYear() + '/' + today.getDate() + '/' + (today.getMonth() + 1);

	try {
		//create the new link without tags
		const {
			rows: [newLink],
		} = await Promise.delay(100, client.query(
			`
            INSERT into links ("creatorId", url, title, clicks, description, date)
            VALUES($1, $2, $3, $4, $5, $6)
            ON CONFLICT ("creatorId", url) DO NOTHING
            RETURNING *;
        `,
			[creatorId, url, title, 0, description, date],
		));
		if (!newLink) {
			return {
				name: 'Error creating link',
				message: `Couldn't create the new link. It may already exist`,
			};
		}
		
		//add tags to link
		if (tags.length > 0) {
			await Promise.delay(500, addTagsToLink(creatorId, newLink.id, tags));		//working links_tags:10
		}

		//get link with tags attached
		const newLinkWithTags = getAllLinks(newLink.creatorId, newLink.id);				//working links:237

		return newLinkWithTags;
	} catch (error) {
		throw error;
	}
}

// goal: update the link
// input: link id and fields as an object
// output: returns an updated link

async function updateLink(userId, linkId, fields = {}, tags = []) {
	try {
		const [ { tags: oldTags } ] = await getAllLinks(userId, linkId);
		
		console.log('old tags in updateLink ', oldTags);
		//update link without tags
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
				}

				//compare tags and see which to add and which to remove

				//working
				const removeTags = oldTags.filter(oldTag => {
					let removed = true;
					tags.forEach(newTag => {
						
						if (oldTag === newTag) {
							removed = false;
						}
					});
					return removed;
				});

				//working
				const addTags = tags.filter(newTag => {
					let addTag = true;
					oldTags.forEach(oldTag => {
						if (oldTag === newTag) {
							addTag = false;
						}
					});
					return addTag;
				});
				

				

				Promise.mapSeries(removeTags, async (tagTitle) => {
					await removeTagFromLink(userId, linkId, tagTitle);
				});

				Promise.mapSeries(addTags, async (tagTitle) => {
					const tagArray = [tagTitle];
					await addTagsToLink(userId, linkId, tagArray);
				});

				await Promise.delay(200, getAllLinks(userId, linkId));
				const newLink = await getAllLinks(userId, linkId);

				return newLink;




	} catch (error) {
		throw error;
	}





	// let newLink;
	// try {
	// 	async function updateLinkFields(linkId, fields) {
	// 		try {
	// 			const setString = Object.keys(fields)
	// 				.map((key, index) => `"${key}"=$${index + 1}`)
	// 				.join(', ');

	// 			if (setString.length === 0 && tags.length === 0) {
	// 				return;
	// 			}
	// 			if (setString.length !== 0) {
	// 				const {
	// 					rows: [link],
	// 				} = await client.query(
	// 					`
	// 			UPDATE links
	// 			SET ${setString}
	// 			WHERE id=${linkId} 
	// 			RETURNING *;
	// 		`,
	// 					Object.values(fields),
	// 				);
	// 				newLink = link; //without tags
	// 			}

	// 			return newLink;
	// 		} catch (error) {
	// 			throw error;
	// 		}
	// 	}

	// 	async function addOrRemoveTags(newLink, tags) {
	// 		//variables passing in correctly

	// 		try {
	// 			const oldTags = await getTagsFromLinkId(linkId); //working

	// 			//drop all old tags WORKING
	// 			if (oldTags.length > 0 && tags.length === 0) {
	// 				await Promise.all(
	// 					oldTags.map(async (tag) => {
	// 						try {
	// 							await removeTagFromLink(newLink.creatorId, newLink.id, tag.title); //working

	// 							const moreLinks = await tagIdStillPresentInJointTable(tag.id); //working
	// 							if (!moreLinks) {
	// 								await destroyTag(newLink.creatorId, tag.title); //working
	// 							}
	// 						} catch (error) {
	// 							throw error;
	// 						}
	// 					}),
	// 				);

	// 				newLink = await getAllLinks(newLink.creatorId, newLink.id);

	// 				return newLink;

	// 				//add new tags  NOT WORKING
	// 			} else if (tags.length > 0 && oldTags.length === 0) {
	// 				await Promise.all(
	// 					tags.map(async (tag) => {
	// 						const newTag = await createTag(newLink.creatorId, tag);
	// 						await addTagToLink(newLink.id, newTag.id);
	// 					}),
	// 				);

	// 				newLink = await getAllLinks(newLink.creatorId, newLink.id);

	// 				return newLink;

	// 				//compare tags. Add new ones, drop old ones, do nothing to the ones that were in the old and the new
	// 			} else {
	// 				const removeTagsBinTemp = oldTags.map((tag) => {
	// 					let absent = true;
	// 					tags.forEach((newTagTitle) => {
	// 						if (tag.title === newTagTitle) {
	// 							absent = false;
	// 						}
	// 					});
	// 					if (absent) {
	// 						return tag;
	// 					}
	// 				});

	// 				const removeTagsBin = removeTagsBinTemp.filter((item) => item);

	// 				const addTagsBinTemp = tags.map((newTag) => {
	// 					let newTagBoolean = true;
	// 					oldTags.forEach((oldTag) => {
	// 						if (oldTag.title === newTag) {
	// 							newTag = false;
	// 						}
	// 					});
	// 					if (newTagBoolean) {
	// 						return newTag;
	// 					}
	// 				});

	// 				const addTagsBin = addTagsBinTemp.filter((item) => item);

	// 				if (removeTagsBin.length > 0) {
	// 					await Promise.all(
	// 						removeTagsBin.map(async (tag) => {
	// 							try {
	// 								await removeTagFromLink(
	// 									newLink.creatorId,
	// 									newLink.id,
	// 									tag.title,
	// 								); //working

	// 								const moreLinks = await tagIdStillPresentInJointTable(tag.id); //working
	// 								if (!moreLinks) {
	// 									await destroyTag(newLink.creatorId, tag.title); //working
	// 								}
	// 							} catch (error) {
	// 								throw error;
	// 							}
	// 						}),
	// 					);
	// 				}

	// 				if (addTagsBin.length > 0) {
	// 					await Promise.all(
	// 						addTagsBin.map(async (tag) => {
	// 							const newTag = await createTag(newLink.creatorId, tag);
	// 							await addTagToLink(newLink.id, newTag.id);
	// 						}),
	// 					);
	// 				}

	// 				newLink = await getAllLinks(newLink.creatorId, newLink.id);

	// 				return newLink;
	// 			}
	// 		} catch (error) {
	// 			throw error;
	// 		}
	// 	}

	// 	newLink = await updateLinkFields(linkId, fields);
	// 	newLink = await addOrRemoveTags(newLink, tags);
	// 	return newLink;
	// } catch (error) {
	// 	throw error;
	// }
}


// goal: get a list of all links with tags attached. If a link id is provided then
// it gets that link only.
// These are the links that belong to the given user only.
// input: userId and linkId (optional)
// output: returns an array of objects (links with their tags)

async function getAllLinks(userId, linkId = null) {
	
	try {
		//working
		const { rows: links } = await client.query(`				
            SELECT * 
            FROM links
            WHERE "creatorId"=${userId}
            ${linkId ? `AND id = ${linkId};` : ';'}
		`);
		

		const newLinkArray = Promise.mapSeries(links, async (link) => {
			
			const tagTitleArray = await getTagsFromLinkId(link.id);			//working links_tags:249
				link.tags = tagTitleArray;
				return link;
		})

		if (links) {
			return newLinkArray;
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
//working
async function getLinksByTagName(userId, tagName) {
	try {
		const links = await getAllLinks(userId);
		
		
		const tagLinks = links.filter(link => {
			let hasTag = false;
			link.tags.forEach(tag => {
				if (tag === tagName) {
					hasTag = true;
				}
			})
			return hasTag;
		})

		
		return tagLinks;

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
