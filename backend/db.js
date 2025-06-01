const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'db_name',
    password: 'password',
    port: 5432,
  });


pool.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch((err) => {
    console.error('PostgreSQL connection error:', err);
});

module.exports = pool;