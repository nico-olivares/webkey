const { Client } = require('pg');

const DB_NAME = 'webkey';

const DB_URL = process.env.DATABASE_URL || `postgres://localhost:5432/webkey`;


/*
This code will work with heroku by establishing an ssl connection.
This code won't work on the other hand in the localhost. For that purpose the code needs to be changed to:
const client = new Client(DB_URL);
*/
const client = new Client({
    connectionString: DB_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

module.exports = client;