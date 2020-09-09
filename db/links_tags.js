/** @format */

const client = require("./client");

// database methods

//not working, not needed
async function addTagsToLinkObject(link) {
    try {
        const { id: linkId } = link;
        console.log("link id ", linkId);
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
        console.log("tagIds from addTagsToLinkObjects ", tagIds);
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
                console.log("title from within the map ", title);
                return title;
            })
        );
        console.log("tags to attach ", tags);
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
    console.log("getting to tagIdStill present", tagId);
    try {
        const { rows } = await client.query(
            `
			SELECT *
			FROM links_tags
			WHERE "tagId"=${tagId}
			;
		`
        );

        console.log("row count ", rows);
        return true;
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

async function getTagsFromLinkId(linkId) {
    try {
        const { rows: tags } = await client.query(
            `
				SELECT *
				FROM links_tags
				WHERE "linkId"=$1
				;
			`,
            [linkId]
        );
        const tagIds = tags.map((tag) => tag.tagId);

        const conditionString = tagIds
            .map((tagId, index) => {
                return `id=$${index + 1}`;
            })
            .join(" OR ");
        console.log(conditionString);
        const { rows: tagTitles } = await client.query(
            `
				SELECT *
				FROM tags
				WHERE ${conditionString};
			`,
            tagIds
        );
        console.log("getting here also");
        return tagTitles;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    addTagToLink,
    removeTagFromLink,
    removeTagFromAllLinks,
    addTagsToLinkObject,
    getTagsFromLinkId,
    tagIdStillPresentInJointTable,
};
