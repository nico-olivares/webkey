// code to build and initialize DB goes here
const {
    client,
    // other db methods
    createLinks
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
                posting_date DATE NOT NULL
            );
            CREATE TABLE tags (
                id SERIAL PRIMARY KEY,
                title VArCHAR(255) UNIQUE NOT NULL
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
async function createInitialLinks() {

    try {
        console.log("Starting to create links...");

        await createLinks({
            url: 'https://learn.fullstackacademy.com/workshop',
            title: 'learn fullstack',
            comments: 'this is fullstacks learndot',
            clicks: 1,
            posting_date: "2020-08-01"

        });
        await createLinks({
            url: 'www.brettcausey.com',
            title: 'bretts web page',
            comments: 'this is bretts comment',
            clicks: 5,
            posting_date: "2020-08-01"
        });
        console.log('finished creating links...')
    } catch (error) {
        throw error
    }
}




async function rebuildDb() {
    try {
        console.log('rebuilding db..')
        client.connect();
        await dropTables();
        await createTables();
        await createInitialLinks();

        // build tables in correct order

        console.log('finished rebuilding db..')
    } catch (error) {
        throw error;
    }
}

async function populateInitialData() {
    try {
        // create useful starting data
    } catch (error) {
        throw error;
    }
}
rebuildDb()
    .then(populateInitialData)
    .catch(console.error)
    .finally(() => client.end());
