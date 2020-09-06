const { Client } = require('pg');

const DB_NAME = 'webkey';

const DB_URL = process.env.DATABASE_URL || `postgres://localhost:5432/webkey`;
const client = new Client(DB_URL);

module.exports = client;