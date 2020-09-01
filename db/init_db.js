// code to build and initialize DB goes here
const {
	client,
	// other db methods
} = require('./index');

async function dropTables() {
	try {
		await client.query(`
		
	  DROP TABLE IF EXISTS links_tags; 
	  DROP TABLE IF EXIST links;
    `);
	} catch (error) {
		throw error;
	}
}

async function createTables() {
	console.log("Starting to build tables...");
	try {
		await client.query(`CREATE TABLE links (
			id SERIAL PRIMARY KEY,
			url VARCHAR(255) UNIQUE NOT NULL,
			title VARCHAR(255) UNIQUE,
			clicks INTEGER NOT NULL
						);`)
	} catch (error) {
		throw error
	}


}

async function buildTables() {
	try {
		client.connect();

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
