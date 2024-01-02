const Pool = require('pg').Pool

export const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'cfresh-inventory',
  password: 'password',
  port: 5432,
})
