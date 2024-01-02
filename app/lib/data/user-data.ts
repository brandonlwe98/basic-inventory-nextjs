import { unstable_noStore as noStore } from 'next/cache';
import { pool } from '@/db.config';


export async function fetchUser(username?: string | null) {
    noStore();

    if (!username)
        return null;

    try {
        const user = await pool.query(
          `SELECT * 
          FROM users
          WHERE name='${username}'`);

        return user.rows?.[0];
    } catch (error) {
        console.error('Failed to fetch user', error);
    }
}