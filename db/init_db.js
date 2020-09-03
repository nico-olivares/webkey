// code to build and initialize DB goes here

const {
    client,
    getAllLinks,
    createTags,
    createLinks,
    connectTagsToLinks,
    getLinksByTagName
} = require('./index');

async function dropTables() {
    try {
        await client.query(`
	        DROP TABLE IF EXISTS links_tags; 
            DROP TABLE IF EXISTS tags;
            DROP TABLE IF EXISTS links;
    `);
    } catch (error) {
        throw error;
    }
}

async function createTables() {
    console.log('Starting to build tables...');
    try {
        await client.query(`
            CREATE TABLE links (
                id SERIAL PRIMARY KEY,
                url VARCHAR(255) UNIQUE NOT NULL,
                title VARCHAR(255) UNIQUE,
                clicks INTEGER NOT NULL,
                comments VARCHAR(255) UNIQUE NOT NULL,
                date DATE NOT NULL
            );
            CREATE TABLE tags (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) UNIQUE NOT NULL
			);
			CREATE TABLE links_tags (
				"linkId" INTEGER REFERENCES links(id),
				"tagId" INTEGER REFERENCES tags(id),
				UNIQUE("linkId", "tagId")
			);
        `);
    } catch (error) {
        throw error; s
    }
}

async function getInitialLinks() {
    try {
        console.log('Getting initial links: ', await getAllLinks());
<<<<<<< HEAD
    } catch (error) {
=======
        console.log('Getting only one link (2)', await getAllLinks(2));
    } catch(error) {
>>>>>>> 7f7e9bad8e2d818f402003fe37a73bb1c703a0ed
        throw error
    }
}

async function createInitialTags() {
    try {
        console.log('creating intitial tags..')

        const tag1 = await createTags({
            title: "#badass"
        });
        console.log('tag 1: ', tag1);

        const tag2 = await createTags({
            title: '#peaceful'
        })
        console.log('tag 2: ', tag2);

        console.log('finished creating tags... check db')

    } catch (error) {
        throw error
    }
}

async function createInitialLinks() {
    try {
        console.log('Starting to create links...');

        const link1 = await createLinks({
            url: 'https://learn.fullstackacademy.com/workshop',
            title: 'learn fullstack',
            comments: 'this is fullstacks learndot',
            clicks: 1,
            date: "2020-08-01"
        });
        console.log('link 1: ', link1);

        const link2 = await createLinks({
            url: 'www.brettcausey.com',
            title: 'bretts web page',
            comments: 'this is bretts comment',
            clicks: 5,
            date: "2020-08-01"
        });
        console.log('link 2: ', link2);

        console.log('finished creating links...')
    } catch (error) {
        throw error
    }
}


async function createJointTagLink() {
    try {
        const joint1 = await connectTagsToLinks(1, 1);
        const joint2 = await connectTagsToLinks(1, 2);
        const joint3 = await connectTagsToLinks(2, 1);
        console.log('joint links_tags 1 ', joint1);
        console.log('joint links_tags 2 ', joint2);
        console.log('joint links_tags 3 ', joint3);
    } catch (error) {
        throw error;
    }
}

async function rebuildDb() {
    try {
        console.log('rebuilding db..')
        client.connect();
        await dropTables();
        await createTables();

        // build tables in correct order

        console.log('finished rebuilding db..')
    } catch (error) {
        throw error;
    }
}

async function populateInitialData() {
    try {
        await createInitialLinks();
        await createInitialTags();
        await connectTagsToLinks();
        await createJointTagLink();
        await getInitialLinks();
        await getLinksByTagName('#peaceful');
    } catch (error) {
        throw error;
    }
}

rebuildDb()
    .then(populateInitialData)
    .catch(console.error)
    .finally(() => client.end());