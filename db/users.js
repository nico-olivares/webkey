// sets up DB

// const { Client } = require('pg');

// const DB_NAME = 'webkey';

// const DB_URL = process.env.DATABASE_URL || `postgres://localhost:5432/webkey`;
// const client = new Client(DB_URL);

const client = require('./client');
const bcrypt = require('bcrypt');

// database methods

async function getAllUsers() {
	const { rows } = await client.query(`SELECT id, username FROM users;`);
	return rows;
}

// goal: create a new user that can be validated
// input: takes in username and password
// output: returns the user object

async function createUser({ username, password }) {
	try {
		const {
			rows: [user],
		} = await client.query(
			`
            INSERT INTO users(username, password)
            VALUES ($1, $2)
            ON CONFLICT (username) DO NOTHING 
            RETURNING *;
        `,
			[username, password],
		);
		return user;
	} catch (error) {
		throw error;
	}
}

async function getUserByUsername({ username }) {
	try {
		const {
			rows: [user],
		} = await client.query(
			`
            SELECT *
            FROM users
            WHERE username=$1;
        `,
			[username],
		);
		if (!user || user.length === 0) {
			return null;
		}
		return user;
	} catch (error) {
		throw error;
	}
}

async function getUserById(id) {
	try {
		const {
			rows: [user],
		} = await client.query(
			`
            SELECT *
            FROM users
            WHERE id=$1;
        `,
			[id],
		);
		if (!user || user.length === 0) {
			return null;
		}
		return user;
	} catch (error) {
		throw error;
	}
}

async function getUser({ username, password }) {
	try {
		const user = await getUserByUsername({ username });

		if (!user) {
			return;
		}
		const matchingPassword = bcrypt.compareSync(password, user.password);

		if (!matchingPassword) {
			return;
		}
		return user;
	} catch (error) {
		throw error;
	}
}


module.exports = {
	createUser,
	getUser,
	getUserByUsername,
	getUserById,
	getAllUsers,
};
