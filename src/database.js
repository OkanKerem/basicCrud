const { Pool } = require('pg')

const pool = new Pool({
    host: 'db',
    port: 5432,
    user: 'postgres',
    password: 'password123',
    database: 'postgres'
});

module.exports = pool