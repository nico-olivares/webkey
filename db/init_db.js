/** @format */

// code to build and initialize DB goes here

const client = require('./client');

const {
	// getAllUsers,
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
	linkClick,
	getTagsForUser,
} = require('./index');
const { addTagsToLinkObject } = require('./links_tags');

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
	console.log('Starting to build tables...');
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
		console.log('creating intital users..');

		const user1 = await createUser({
			username: 'Marcello',
			password: 'coyotwind1',
		});
		console.log('this is user1', user1);

		const user2 = await createUser({
			username: 'Kamikaze1',
			password: 'Password1',
		});
		console.log('this is user2', user2);

		const user3 = await createUser({
			username: 'NicoIsCool',
			password: 'Olivares123',
		});
		console.log('this is user3', user3);

		const user4 = await createUser({
			username: 'testUser',
			password: 'password',
		});
		console.log('This is the test user: ', user4);

		console.log('finsihed creating intitial users..');
	} catch (error) {
		throw error;
	}
}

async function getInitialUser() {
	try {
		const getUser1 = await getUserByUsername({ username: 'Marcello' });
		console.log('retrieving first user', getUser1);

		const userById1 = await getUserById(1);
		console.log('Getting user by id=1: ', userById1);
	} catch (error) {
		throw error;
	}
}

// create the links

async function createInitialLinks() {
	try {
		console.log('Starting to create links...');

		

		const link1 = await createLink({
			creatorId: 1,
			url: 'https://learn.fullstackacademy.com/workshop',
			title: 'learn fullstack',
			description: "This is fullstack's Learndot",
			tags: ['test', 'another'],
		});
		console.log('link 1: ', link1);

		const link2 = await createLink({
			creatorId: 2,
			url: 'https://github.com',
			title: 'Git Hub',
			description: 'This is where the code lives',
			tags: [],
		});
		console.log('link 2: ', link2);

		const link3 = await createLink({
			creatorId: 3,
			url: 'https://zoom.com',
			title: 'Zoom Room',
			description: 'Use this to talk to teammates',
			tags: ['test', 'more'],
		});
		console.log('link 3: ', link3);

		const link4 = await createLink({
			creatorId: 4,
			url: 'https://netflix.com',
			title: 'Fun fun',
			description: 'Use this to watch movies all day long',
			tags: ['fun', 'chill'],
		});
		console.log('link 4: ', link4);

		const link5 = await createLink({
			creatorId: 4,
			url: 'https://news4jax.com',
			title: 'Local news',
			description: 'Stay informed',
			tags: ['test', 'fun'],
		});
		console.log('link 5: ', link5);

		const link6 = await createLink({
			creatorId: 4,
			url: 'https://amazon.com',
			title: 'Buying spree',
			description: 'Control yourself',
			tags: ['test', 'scary'],
		});
		console.log('link 6: ', link6);

		const link7 = await createLink({
			creatorId: 4,
			url: 'https://hulu.com',
			title: 'Great shows',
			description: 'Better than old TV',
			tags: [],
		});
		console.log('link 7: ', link7);

		console.log('finished creating links...');
	} catch (error) {
		throw error;
	}
}

//delete tags
async function deleteTags() {
	console.log('deleting a repeated tag ', await removeTagFromLink(1, 1, 'test'));
	console.log('deleting a single tag ', await removeTagFromLink(4, 6, 'scary'));
}



// log out all the initial links

async function getInitialLinks() {
	try {
		console.log('Getting initial links for user 1: ', await getAllLinks(1));
		console.log('Getting only one link (2) for user 2', await getAllLinks(2, 2));
	} catch (error) {
		throw error;
	}
}

// update the links

async function updateInitialLinks() {
	try {
		console.log('Starting to update links');

		//1 tags to no tags
		const updatedLink0 = await updateLink(1, 1, {
			url: 'https://cnn.com/',
			title: 'The news',
			description: 'Good news',
		});
		console.log('1 tag to no tags, link 1.0: ', updatedLink0);

		//no tags to 1 tag (or 2 tags to 1 tag)
		const updatedLink1 = await updateLink(
			1, 1,
			{
				url: 'https://cnn.com/',
				title: 'The news',
				description: 'Good news',
			},
			['newTag'],
		);
		console.log('no tags to 1 tag (newTag) link 1.1: ', updatedLink1);

		//no tags to 1 tag
		const updatedLink2 = await updateLink(
			2, 2,
			{
				url: 'https://github.com/',
				title: 'Git Hub Repo',
				description: 'The code repos live here',
			},
			['newTag2'],
		);
		console.log('no tags to 1 tag (newTag2) link 2: ', updatedLink2);

		//2 tags to one repeated and one new tag
		const updatedLink3 = await updateLink(
			3, 3,
			{
				url: 'https://zoom.com/',
				title: 'Zoom Room',
				description: 'Teleconference software',
			},
			['test', 'newTag3'],
		);
		console.log('2 tags to one repeated and one new tag (test, newTag3), link 3: ', updatedLink3);

		console.log('Finished updating links');
	} catch (error) {
		throw error;
	}
}

async function getLinksFromTags() {
	try {
		// get links for user1 with tag name test
		const links1 = await getLinksByTagName(1, 'another');
		console.log('Links for user 1 with tag name "another": ', links1);
		// non existing user, existing tag
		const links2 = await getLinksByTagName(7, 'test');
		console.log('Getting links for non existing user with existing tag ("test"): ', links2);
		// existing user, wrong tag
		const link3 = await getLinksByTagName(1, 'front-end');
		console.log('Getting links from existing user, but wrong tag: ', link3);
	} catch (error) {
		throw error;
	}
}

async function clickClick() {
	try {
		//2 clicks to link 1
		await linkClick(1);
		console.log('2 clicks to link 1: ', await linkClick(1));
		//1 click to link 2
		console.log('One click to link 2: ', await linkClick(2));
	} catch (error) {
		throw error;
	}
}

async function getTags() {
	try {
		//All tags for user 1
		console.log('All tags for user 1: ', await getTagsForUser(1));
	} catch (error) {
		throw error;
	}
}

async function rebuildDb() {
	try {
		console.log('rebuilding db..');

		client.connect();
		await dropTables();
		await createTables();

		console.log('finished rebuilding db..');
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
		await deleteTags();
		await getInitialLinks();
		await getLinksFromTags();
		await updateInitialLinks();
		await clickClick();
		await getTags();
	} catch (error) {
		throw error;
	}
}

// initializes the test run

rebuildDb()
	.then(populateInitialData)
	.catch(console.error)
	.finally(() => client.end());
