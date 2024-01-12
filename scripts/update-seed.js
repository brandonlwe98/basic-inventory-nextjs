const Pool = require('pg').Pool

//                          [2]       [3]
// npm run update-seed -- postgres password

const pool = new Pool({
  user: process.argv[2],
  host: 'localhost',
  database: 'cfresh-inventory',
  password: process.argv[3],
  port: 5432,
})

async function dropTables() {
    try {
        // drop table 'categories' if exists
        await pool.query(`
          DROP TABLE IF EXISTS categories
        `);

        console.log("Cleared tables");
    } catch (error) {
        console.error('Error clearing tables:', error);
        throw error;  
    }
}

async function seedCategory() {
    try {
      // Create the "categories" table if it doesn't exist
      const createCategory = await pool.query(`
        CREATE TABLE IF NOT EXISTS categories (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL UNIQUE
        );
      `)
  
      console.log(`Created "categories" table`);
  
      let categoryNames = ["Meat", "Produce", "Grocery"]
  
      for (let i = 1; i <= categoryNames.length; i++) {
        const insertedCategory = await pool.query(
          `INSERT INTO categories (id, name) VALUES ($1, $2)`
        , [i, categoryNames[i - 1]])
      }
  
      console.log(`Successfully seeded categories!`)
  
      return {
        createCategory
      };
  
    } catch (error) {
      console.error("Failed to seed category", error)
      throw error;
    }
}

async function updateVendors() {
    const addAddress = `
        ALTER TABLE vendors
        ADD COLUMN address text NULL
    `

    await pool.query(addAddress);

    const addCategory = `
        ALTER TABLE vendors
        ADD COLUMN category int NOT NULL DEFAULT 1
    `

    await pool.query(addCategory);

    const addPhone = `
        ALTER TABLE vendors
        ADD COLUMN phone text NULL
    `
    await pool.query(addPhone);

    const addSalesman = `
        ALTER TABLE vendors
        ADD COLUMN salesman text NULL
    `

    await pool.query(addSalesman);

    console.log("Successfully updated vendors table");
}

async function main() {
    try {
      if (process.argv[2] === undefined || process.argv[3] === undefined) {
        throw new Error("Missing database credentials");
      }
  
      await dropTables();
      await seedCategory();
      await updateVendors();

    } catch (error) {
      console.error("Error seeding database: " + error.message, error);
    }
}

main().catch((err) => {
    console.error(
        'An error occurred while attempting to seed the database:' + err.message,
        err,
    );
});