import { pool } from '@/db.config';

export async function fetchCategories() {
    try {
        const data = await pool.query(
          `SELECT id, name 
          FROM categories`);

        return data.rows;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch the categories.');
    }
}

export async function fetchCategory(id: string) {
    try {
        const data = await pool.query(
          `SELECT id, name 
          FROM categories
          WHERE id = ${id}`);

        return data.rows[0];
    } catch (error) {
        console.error("Failed to fetch category with id", id);
        console.error('Database Error:', error);
        throw new Error('Failed to fetch the category by id.');
    }
}
