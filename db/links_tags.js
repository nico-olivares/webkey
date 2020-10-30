/** @format */

const client = require("./client");
const { getTagIdFromTitle, createTag, destroyTag } = require("./tags");

// database methods

//Add tag to link
async function addTagToLink(userId, linkId, tagTitle) {
    
    try {
        //does tag already exist
        let tagId = await getTagIdFromTitle(tagTitle);
        //if it doesn't create tag
        if (!tagId) {
            const newTag = await createTag(userId, tagTitle);
            tagId = newTag.id;
        }

        //then add links_tag
        await client.query(`
            INSERT INTO links_tags ("linkId", "tagId")
            VALUES ($1, $2)
            ON CONFLICT ("linkId", "tagId") DO NOTHING;
        `, [ linkId, tagId ]);
        return;
    } catch (error) {
        throw error;
    }

}

async function removeTagFromLink(userId, linkId, tagTitle) {
    try {
        //get tag id
        const tagId = await getTagIdFromTitle(tagTitle);
        //how many instances of the tag are there in the joint table
        const { rowCount } = await client.query(`
            SELECT id
            FROM links_tags
            WHERE "tagId"=$1;
        `, [ tagId ]);
        //remove from joint table
        await client.query(`
            DELETE
            FROM links_tags
            WHERE "linkId"=$1 
            AND "tagId"=$2;
        `, [ linkId, tagId ]);
        //if only one instance remove also from tags table
        if (rowCount === 1) {
            await destroyTag(userId, tagTitle);
        }
    } catch (error) {
        throw error;
    }
}









/*
//not working, not needed
async function addTagsToLinkObject(link) {
    try {
        const { id: linkId } = link;
        
        let { rows: tagIds } = await client.query(
            `
        SELECT "tagId"
        FROM links_tags
		WHERE "linkId"=$1
		;
    `,
            [linkId]
        );

        tagIds.map((tag) => {
            return tag.id;
        });
        
        const tags = await Promise.all(
            tagIds.map(async (tagId) => {
                const {
                    rows: [title],
                } = client.query(
                    `
              SELECT title
              FROM tags
              WHERE id = $1;
		  `,
                    [tagId.tagId]
                ); //array already???
               
                return title;
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
            [userId, tagTitle]
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
                [linkId, tagId]
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

//not working at all. The query is crashing
async function tagIdStillPresentInJointTable(tagId) {
   
    try {
        const { rowCount } = await client.query(
            `
			SELECT *
			FROM links_tags
			WHERE "tagId"=${tagId}
			;
		`
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
            [linkId, tagId]
        );
        return joint;
    } catch (error) {
        throw error;
    }
}

async function removeTagFromAllLinks(tagId) {
    try {
        const { rowCount } = await client.query(
            `
			DELETE FROM links_tags
			WHERE "tagId"=$1;
		`,
            [tagId]
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
*/
async function getTagsFromLinkId(linkId) {
    console.log('getting to get tags from link id');
    try {
        const { rows: tags } = await client.query(
            `
				SELECT "tagId"
				FROM links_tags
				WHERE "linkId"=$1
				;
			`,
            [linkId]
		);
		
		if (tags.length === 0) {
			return [];
		}
		
        const tagIds = tags;

        const conditionString = tagIds
            .map((tagId, index) => {
                return `id=$${index + 1}`;
            })
            .join(" OR ");
        
        const { rows: tagTitles } = await client.query(
            `
				SELECT *
				FROM tags
				WHERE ${conditionString};
			`,
            tagIds
        );
        console.log('the tags to be returned are ', tagTitles);
        return tagTitles;
    } catch (error) {
        throw error;
    }
}


module.exports = {
    addTagToLink,
    removeTagFromLink,
    // removeTagFromAllLinks,
    // addTagsToLinkObject,
    getTagsFromLinkId,
    // tagIdStillPresentInJointTable,
};
