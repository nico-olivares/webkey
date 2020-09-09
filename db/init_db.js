/** @format */

// code to build and initialize DB goes here

const client = require("./client");

const {
    getAllUsers,
    createUser,
    getUserByUsername,
    getUserById,
    getAllLinks,
    createLink,
    updateLink,
    createTag,
    addTagToLink,
    getLinksByTagName,
    removeTagFromLink,
    destroyTag,
} = require("./index");
const { addTagsToLinkObject } = require("./links_tags");

// drop the tables before rebuilding

async function dropTables() {
    try {
        await client.query(`
	        DROP TABLE IF EXISTS links_tags; 
            DROP TABLE IF EXISTS tags;
            DROP TABLE IF EXISTS links;
            DROP TABLE IF EXISTS users;
    `);
    } catch (error) {
        throw error;
    }
}

// create the tables

async function createTables() {
    console.log("Starting to build tables...");
    try {
        await client.query(`
            CREATE TABLE users(
                id SERIAL PRIMARY KEY,
                username VARCHAR(50) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL
            );
            CREATE TABLE links (
                id SERIAL PRIMARY KEY,
                "creatorId" INTEGER REFERENCES users(id),
                url VARCHAR(255),
                title VARCHAR(255) NOT NULL,
                clicks INTEGER NOT NULL,
                description VARCHAR(255),
                date VARCHAR(10) NOT NULL,
                UNIQUE ("creatorId", url)
            );
            CREATE TABLE tags (
                id SERIAL PRIMARY KEY,
                "creatorId" INTEGER REFERENCES users(id),
                title VARCHAR(255) NOT NULL,
                UNIQUE ("creatorId", title)
			);
			CREATE TABLE links_tags (
				"linkId" INTEGER REFERENCES links(id),
				"tagId" INTEGER REFERENCES tags(id),
				UNIQUE("linkId", "tagId")
			);
        `);
    } catch (error) {
        throw error;
    }
}

//create the user
async function createInitialUsers() {
    try {
        console.log("creating intital users..");

        const user1 = await createUser({
            username: "Marcello",
            password: "coyotwind1",
        });
        console.log("this is user1", user1);

        const user2 = await createUser({
            username: "Kamikaze1",
            password: "Password1",
        });
        console.log("this is user2", user2);

        const user3 = await createUser({
            username: "NicoIsCool",
            password: "Olivares123",
        });
        console.log("this is user3", user3);

        console.log("finsihed creating intitial users..");
    } catch (error) {
        throw error;
    }
}

async function getInitialUser() {
    try {
        const getUser1 = await getUserByUsername({ username: "Marcello" });
        console.log("retrieving first user", getUser1);

        const userById1 = await getUserById(1);
        console.log("Getting user by id=1: ", userById1);
    } catch (error) {
        throw error;
    }
}

// create the links

async function createInitialLinks() {
    try {
        console.log("Starting to create links...");

        const [Marcello, Kamikaze1, NicoIsCool] = await getAllUsers();

        const link1 = await createLink({
            creatorId: Marcello.id,
            url: "https://learn.fullstackacademy.com/workshop",
            title: "learn fullstack",
            description: "This is fullstack's Learndot",
            tags: ["test", "another"],
        });
        console.log("link 1: ", link1);

        const link2 = await createLink({
            creatorId: Kamikaze1.id,
            url: "https://github.com",
            title: "Git Hub",
            description: "This is where the code lives",
            tags: [],
        });
        console.log("link 2: ", link2);

        const link3 = await createLink({
            creatorId: NicoIsCool.id,
            url: "https://zoom.com",
            title: "Zoom Room",
            description: "Use this to talk to teammates",
            tags: ["test", "more"],
        });
        console.log("link 3: ", link3);

        console.log("finished creating links...");
    } catch (error) {
        throw error;
    }
}

// create the tags

// async function createInitialTags() {
//     try {
//         console.log('creating initial tags...')

//         const tag1 = await createTag(1, 'popular');
//         console.log('tag 1 for user 1: ', tag1);

//         const tag2 = await createTag(1, 'code')
//         console.log('tag 2 for user 1: ', tag2);

//         const tag3 = await createTag(2, 'front-end')
//         console.log('tag 1 for user 2: ', tag3);

//         console.log('finished creating tags...')
//     } catch (error) {
//         throw error
//     }
// }

// log out all the initial links

async function getInitialLinks() {
    try {
        console.log("Getting initial links for user 1: ", await getAllLinks(1));
        console.log("Getting only one link (2) for user 2", await getAllLinks(2, 2));
    } catch (error) {
        throw error;
    }
}

// update the links

async function updateInitialLinks() {
    try {
        console.log("Starting to update links");

        //2 tags to no tags
        const updatedLink0 = await updateLink(1, {
            url: "https://cnn.com/",
            title: "The news",
            description: "Good news",
        });
        console.log("link 1.0: ", updatedLink0);

        //no tags to 1 tag (or 2 tags to 1 tag)
        const updatedLink1 = await updateLink(
            1,
            {
                url: "https://cnn.com/",
                title: "The news",
                description: "Good news"
            },
            ["newTag"]
        );
        console.log("link 1.1: ", updatedLink1);

        //no tags to 1 tag
        const updatedLink2 = await updateLink(
            2,
            {
                url: "https://github.com/",
                title: "Git Hub Repo",
                description: "The code repos live here"
            },
            ["newTag"]
        );
        console.log("link 2: ", updatedLink2);

        //2 tags to one repeated and one new tag
        const updatedLink3 = await updateLink(
          3,
          {
            url: "https://zoom.com/",
            title: "Zoom Room",
            description: "Teleconference software",
          },
          ["test", "newTag3"]
        );
        console.log("link 3: ", updatedLink3);

        console.log("Finished updating links");
    } catch (error) {
        throw error;
    }
}

// connect some tags to links

// async function createJointTagLink() {
//     try {
//         const joint1 = await addTagToLink(1, 1);
//         const joint2 = await addTagToLink(1, 2);
//         const joint3 = await addTagToLink(2, 1);
//         const joint4 = await addTagToLink(2, 2);
//         const joint5 = await addTagToLink(3, 1);

//         console.log('joint links_tags 1 ', joint1);
//         console.log('joint links_tags 2 ', joint2);
//         console.log('joint links_tags 3 ', joint3);
//         console.log('joint links_tags 4 ', joint4);
//         console.log('joint links_tags 5 ', joint5);
//     } catch (error) {
//         throw error;
//     }
// }

// Delete a link-tag pair
// async function deleteLinksTagsPair() {
//     try {
//         //correct pairing
//         const deleted = await removeTagFromLink(1, 1, 'test');
//         console.log('Deleted links tag pair. Link 1 to tag 1 (test) from user 1: ', deleted);
//         //correct link, wrong tag
//         const deleted2 = await removeTagFromLink(1, 1, 'whatever');
//         console.log('Deleted correct link wrong tag ', deleted2);
//         //incorrect link, correct tag
//         const deleted3 = await removeTagFromLink(2, 15, 'another');
//         console.log('Deleted incorrect link, correct tag ', deleted3);
//         //incorrect link and tag
//         const deleted4 = await removeTagFromLink(3, 17, 'whatever');
//         console.log('Deleted incorrect link and tag ', deleted4);
//     } catch (error) {
//         throw error;
//     }
// }

// Delete a tag
// async function deleteTag() {
//     try {
//         //delete existing tag
//         const deleted1 = await destroyTag(3, 'more');
//         console.log('more tag deleted ', deleted1);
//         //delete non existing tag
//         const deleted2 = await destroyTag(1, 'whatever');
//         console.log('non existing tag deletion ', deleted2);

//     } catch (error) {
//         throw error;
//     }
// }

async function getLinksFromTags() {
    try {
        // get links for user1 with tag name test
        const links1 = await getLinksByTagName(1, "another");
        console.log('Links for user 1 with tag name "test": ', links1);
        // non existing user, existing tag
        const links2 = await getLinksByTagName(7, "test");
        console.log('Getting links for non existing user with existing tag ("test"): ', links2);
        // existing user, wrong tag
        const link3 = await getLinksByTagName(1, "front-end");
        console.log("Getting links from existing user, but wrong tag: ", link3);
    } catch (error) {
        throw error;
    }
}

// async function addTagsToLinkObjectTest() {
//     try {
//         const emptyLink1 = await getAllLinks(1, 1);
//         console.log('emptyLink1 ', emptyLink1);
// const link1 = await addTagsToLinkObject(emptyLink1);
// console.log('Getting link1 with tags ', link1);
// const emptyLink2 = await getAllLinks(2, 2);
// const link2 = await addTagsToLinkObject(emptyLink2);
// console.log('Getting link3 with tags ', link3);
// const emptyLink3 = await getAllLinks(3, 3);
// const link3 = await addTagsToLinkObject(emptyLink3);
// console.log('Getting link3 with tags ', link3);

//     } catch (error) {
//         throw error;
//     }
// }

async function rebuildDb() {
    try {
        console.log("rebuilding db..");

        client.connect();
        await dropTables();
        await createTables();

        console.log("finished rebuilding db..");
    } catch (error) {
        throw error;
    }
}

// populate the data, runs the tests

async function populateInitialData() {
    try {
        await createInitialUsers();
        await getInitialUser();
        await createInitialLinks();
        // await createInitialTags();
        // await createJointTagLink();
        // await deleteLinksTagsPair();
        // await deleteTag();
        await getInitialLinks();
        await getLinksFromTags();
        // await addTagsToLinkObjectTest();
        await updateInitialLinks();
    } catch (error) {
        throw error;
    }
}

// initializes the test run

rebuildDb()
    .then(populateInitialData)
    .catch(console.error)
    .finally(() => client.end());
