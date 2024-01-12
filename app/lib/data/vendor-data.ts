// import { sql } from '@vercel/postgres';
import { unstable_noStore as noStore } from 'next/cache';
import { Vendor } from '../definitions';
import { pool } from '@/db.config';

const ITEMS_PER_PAGE = 6;

export async function fetchVendors() {
    noStore();

    try {
        const data = await pool.query('SELECT id, name, created_at, updated_at FROM vendors ORDER BY name ASC LIMIT 5');

        return data.rows;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch the vendors.');
    }
}

export async function fetchVendorsPages(query: string) {
    noStore();
    
    try {
      const count = await pool.query(
        "SELECT COUNT(*) FROM vendors WHERE name ILIKE $1 OR created_at::text ILIKE $1 OR updated_at::text ILIKE $1",
        [`%${query}%`,]
      )
  
      const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
      return totalPages;
    } catch (error) {
      console.error('Database Error:', error);
      throw new Error('Failed to fetch total number of vendors.');
    }
}

export async function fetchFilteredVendors(
    query: string,
    currentPage: number,
  ) {
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;
    
    noStore();
    
    try {
      const vendors = await pool.query(`
      SELECT v.id, v.name, c.name as category, v.address, v.phone, v.created_at, v.updated_at 
      FROM vendors v
      JOIN categories c ON c.id = v.category
      WHERE 
        v.name ILIKE $1 OR 
        c.name ILIKE $1 OR
        v.address ILIKE $1 OR
        v.phone ILIKE $1 OR
        v.created_at::text ILIKE $1 OR 
        v.updated_at::text ILIKE $1 
        ORDER BY v.updated_at DESC LIMIT $2 OFFSET $3`,
      [`%${query}%`, ITEMS_PER_PAGE, offset]);
  
      return vendors.rows;
    } catch (error) {
      console.error('Database Error:', error);
      throw new Error('Failed to fetch vendors.');
    }
}
  
export async function fetchVendorById(id: string) {
    noStore();
    
    try {
      const data = await pool.query(`
        SELECT *
        FROM vendors 
        WHERE id = $1`, 
        [id]);
  
      return data.rows[0];
    } catch (error) {
      console.error('Database Error:', error);
      throw new Error('Failed to fetch vendor.');
    }
  }