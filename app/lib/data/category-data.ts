import { pool } from '@/db.config';

export async function fetchCategories() {
    try {
        const data = await pool.query(
          `SELECT id, name 
          FROM categories`);

        return data.rows;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch the products.');
    }
}
