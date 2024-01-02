const Pool = require('pg').Pool

//                   [2]       [3]
// npm run seed -- postgres password

const pool = new Pool({
  user: process.argv[2],
  host: 'localhost',
  database: 'cfresh-inventory',
  password: process.argv[3],
  port: 5432,
})

async function dropTables() {
    try {
        // drop table 'user' if exists
        await pool.query(`
            DROP TABLE IF EXISTS users
        `);

        // drop table 'vendors' if exists
        await pool.query(`
            DROP TABLE IF EXISTS vendors
        `);

        // drop table 'categories' if exists
        await pool.query(`
          DROP TABLE IF EXISTS categories
        `);

        // drop table 'products' if exists
        await pool.query(`
            DROP TABLE IF EXISTS products
        `);

        // drop table 'product_images' if exists
        await pool.query(`
          DROP TABLE IF EXISTS product_images
        `);

        console.log("Cleared tables");
    } catch (error) {
        console.error('Error clearing tables:', error);
        throw error;  
    }
}

async function seedUsers() {
  try {
    // Create the "users" table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        password TEXT NOT NULL,
        access VARCHAR(25) NOT NULL
      );
    `);

    console.log(`Created "users" table`);

    let users = [
      {
        username: 'admin',
        password: 'admin123',
        access: 'administrator'
      } ,
      {
        username: 'user',
        password: 'user123',
        access: 'user'
      }
    ]
    
    // Insert data into the "users" table
    const insertedVendors = await Promise.all(
      users.map(async (user) => {
        await pool.query(
          'INSERT INTO users (name, password, access) VALUES ($1, $2, $3)', 
          [user.username, user.password, user.access]);
      }),
    ).then(
      console.log(`Successfully seeded users!`)
    ).catch(
      (err) => { if (err) throw err; }
    )

    return {
      message: "Okay"
    };
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
}

async function seedVendors() {
    try {
        // Create the "vendors" table if it doesn't exist
        await pool.query(`
            CREATE TABLE IF NOT EXISTS vendors (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL UNIQUE,
                created_at TIMESTAMP with time zone NOT NULL,
                updated_at TIMESTAMP with time zone NOT NULL
            );
        `);

        console.log(`Created "vendors" table`);
        
        let values = ['Walmart', 'Hy-Vee', 'ALDI'];

        // Insert data into the "vendors" table
        const insertedVendors = await Promise.all(
            values.map(async (value) => {
              await pool.query(
                'INSERT INTO vendors (name, created_at, updated_at) VALUES ($1, localtimestamp, localtimestamp)', 
                [value]);
          }),
        ).then(
          console.log(`Successfully seeded vendors!`)
        )

        return {
            message: "Okay"
        };
    } catch (error) {
        console.error('Error seeding vendors:', error);
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

    let categoryNames = ["Meat", "Seafood", "Fruit", "Vegetables"]

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

async function seedProducts() {
    try {
      // Create the "products" table if it doesn't exist
      const createProducts = await pool.query(`
          CREATE TABLE IF NOT EXISTS products (
              id SERIAL PRIMARY KEY,
              vendor_id VARCHAR(10) NOT NULL,
              name VARCHAR(255) NOT NULL,
              image VARCHAR(255) NULL,
              category int NOT NULL,
              itemcode VARCHAR(100) NOT NULL,
              barcode VARCHAR(100) NOT NULL,
              size int NOT NULL,
              stock int NOT NULL,
              unit VARCHAR(100) NOT NULL,
              created_at TIMESTAMP with time zone NOT NULL,
              updated_at TIMESTAMP with time zone NOT NULL
          );
      `);
  
      console.log(`Created "products" table`);
  
      let values = [
        {
            vendor_id: 1,
            name: 'Apple',
            image: '/product_images/apple.png',
            category: 1,
            itemcode: 'A123',
            barcode: '123-456-789',
            size: 1000,
            stock: 500,
            unit: 'pc'
        },
        {
            vendor_id: 2,
            name: 'Orange',
            image: '/product_images/orange.png',
            category: 2,
            itemcode: 'B456',
            barcode: '987-654-321',
            size: 2518,
            stock: 1200,
            unit: 'oz'
        },
        {
            vendor_id: 3,
            name: 'Banana',
            image: '/product_images/banana.png',
            category: 3,
            itemcode: 'C789',
            barcode: '111-222-333',
            size: 1515,
            stock: 1225,
            unit: 'lb'
        }
      ];
  
      // Insert data into the "products" table
      const insertedProducts = await Promise.all(
        values.map(async (value) => {
          return pool.query(
          'INSERT INTO products (vendor_id, name, image, category, itemcode, barcode, size, stock, unit, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, localtimestamp, localtimestamp)',
          [value.vendor_id, value.name, value.image, value.category, value.itemcode, value.barcode, value.size, value.stock, value.unit]
          );
        }),
      )
  
      console.log(`Successfully seeded products!`)

      return {
        createProducts,
        products: insertedProducts
      };
    } catch (error) {
      console.error('Error seeding products:', error);
      throw error;
    }
  }

// async function seedProductImages() {
//   try {
//       // Create the "product_images" table if it doesn't exist
//       const createProductImages = await pool.query(`
//           CREATE TABLE IF NOT EXISTS product_images (
//               id SERIAL PRIMARY KEY,
//               product_id int NOT NULL,
//               path bytea NOT NULL,
//               type VARCHAR(100) NOT NULL
//           );
//       `);

//       console.log(`Created "product_images" table`);

//       return {
//           message: "Okay"
//       };
//   } catch (error) {
//       console.error('Error seeding product images:', error);
//       throw error;
//   }
// }

async function main() {
  try {
    if (process.argv[2] === undefined || process.argv[3] === undefined) {
      throw new Error("Missing database credentials");
    }

    await dropTables();
    await seedUsers();
    await seedVendors();
    await seedProducts();
    await seedCategory();
    // await seedProductImages();
  } catch (error) {
    console.error("Error seeding database" + error.message, error);
  }
}

main().catch((err) => {
    console.error(
        'An error occurred while attempting to seed the database:' + err.message,
        err,
    );
});
  