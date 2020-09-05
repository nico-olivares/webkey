// code to build and initialize DB goes here

const {
    client,
    getAllUsers,
    createUser,
    getUserByUsername,
    getUserById,
    getAllLinks,
    createLink,
    updateLink,
    createTag,
    addTagToLink,
    getLinksByTagName
   
} = require('./index');

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
                url VARCHAR(255) UNIQUE,
                title VARCHAR(255) UNIQUE NOT NULL,
                clicks INTEGER NOT NULL,
                comments VARCHAR(255) UNIQUE,
                date VARCHAR(10) NOT NULL
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
        throw error;
    }
}

//create the user
async function createInitialUsers() {

    try {
        console.log('creating intital users..')
        const user1 = await createUser({
            username: 'Marcello',
            password: 'coyotwind1'
        })
        const user2 = await createUser({
            username: 'Kamikaze1',
            password: 'Password1'
        })
        const user3 = await createUser({
            username: 'NicoIsCool',
            password: 'Olivares123'
        })
        console.log('this is user1', user1);
        console.log('this is user2', user2);
        console.log('this is user3', user3)
        console.log("finsihed creating intitial users..")
    } catch (error) {
        throw error
    }

}

async function getInitialUser() {
    try {
        const getUser1 = await getUserByUsername({
            username: "JohnMarcello"
        })
        console.log('retrieving first user', getUser1);
        const userById1 = await getUserById(1);
        console.log('Getting user by id=1: ', userById1);
    } catch (error) {
        throw error
    }
}

// create the tags

async function createInitialTags() {
    try {
        console.log('creating intitial tags...')

        const tag1 = await createTag('#popular');
        console.log('tag 1: ', tag1);

        const tag2 = await createTag('#code')
        console.log('tag 2: ', tag2);

        const tag3 = await createTag('#front-end')
        console.log('tag 3: ', tag3);

        console.log('finished creating tags...')

    } catch (error) {
        throw error
    }
}

// create the links

async function createInitialLinks() {
    try {
        console.log('Starting to create links...');

        const [Marcello, Kamikaze1, NicoIsCool] = await getAllUsers();

        const link1 = await createLink({
            creatorId: Marcello.id,
            url: 'https://learn.fullstackacademy.com/workshop',
            title: 'learn fullstack',
            comments: 'This is fullstack\'s Learndot',
            tags: ['#test', '#another']
        });
        console.log('link 1: ', link1);

        const link2 = await createLink({
            creatorId: Kamikaze1.id,
            url: 'https://github.com',
            title: 'Git Hub',
            comments: 'This is where the code lives',
            tags: []
        });
        console.log('link 2: ', link2);

        const link3 = await createLink({
            creatorId: NicoIsCool.id,
            url: 'https://zoom.com',
            title: 'Zoom Room',
            comments: 'Use this to talk to teammates',
            tags: ['#test', '#more']
        });
        console.log('link 3: ', link3);

        console.log('finished creating links...')
    } catch (error) {
        throw error
    }
}

// log out all the initial links

async function getInitialLinks() {
    try {
        console.log('Getting initial links: ', await getAllLinks());
        console.log('Getting only one link (2)', await getAllLinks(2));
    } catch (error) {
        throw error
    }
}

// update the links

async function updateInitialLinks() {
    try {
        console.log('Starting to update links');
        const updatedLink2 = await updateLink(2, {
            url: 'https://github.com/',
            title: 'Git Hub Repo',
            comments: 'The code repos live here',
            date: "2020-09-15"
        });
        console.log('link 2: ', updatedLink2);

        const updatedLink3 = await updateLink(3, {
            url: 'https://zoom.com/',
            title: 'Zoom Room',
            comments: 'Teleconference software',
            date: "2020-09-15"
        });
        console.log('link 3: ', updatedLink3);

        console.log('Finished updating links');
    } catch (error) {
        throw error;
    }
}

// coonect some tags to links

async function createJointTagLink() {
    try {
        const joint1 = await addTagToLink(1, 1);
        const joint2 = await addTagToLink(1, 2);
        const joint3 = await addTagToLink(2, 1);
        const joint4 = await addTagToLink(2, 2);
        const joint5 = await addTagToLink(3, 1);
        console.log('joint links_tags 1 ', joint1);
        console.log('joint links_tags 2 ', joint2);
        console.log('joint links_tags 3 ', joint3);
        console.log('joint links_tags 4 ', joint4);
        console.log('joint links_tags 5 ', joint5);
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
        console.log('finished rebuilding db..')
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
        await createInitialTags();
        await addTagToLink();
        await createJointTagLink();
        await getInitialLinks();
        await getLinksByTagName('#popular');
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