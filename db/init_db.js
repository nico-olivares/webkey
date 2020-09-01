// code to build and initialize DB goes here
const {
    client,
    createTags,
    // other db methods
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
                clicks INTEGER NOT NULL
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
async function createInitialTags() {
    try {
        console.log('creating intitial tags..')
        await createTags({
            title: "#badass"
        })
        await createTags({
            title: '#peaceful'
        })
        console.log('finished creating tags... check db')
    } catch (error) {
        throw error
    }


}

async function buildTables() {
    try {
        client.connect();
        await dropTables();
        await createTables();
        await createInitialTags();

        // drop tables in correct order

        // build tables in correct order
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

buildTables()
    .then(populateInitialData)
    .catch(console.error)
    .finally(() => client.end());
