This is a [Next.js](https://nextjs.org/) project running on [Node.js](https://nodejs.org/en).

The web application is a basic inventory system with sign in/sign out authentication, vendor, and product information.
Product categories are accessed

## Getting Started
First, install [Node.js](https://nodejs.org/en), select LTS for long term support.

Second, install [PostgreSQL](https://www.postgresql.org/download/) based on Operating System.
Create a database with the `user`, `host`, `password`, and `port`.
Edit the `db.config.ts` file based on the database settings.

Third, run the following command to setup the database on postgres for the first time

```bash
npm run seed -- [database_name] [database_password]
```
> :warning: **This script will delete all data in your database and setup mock data**: Be very careful here!

If the database fails to seed, check your database settings to ensure it matches the details set in `db.config.ts`

Lastly, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.