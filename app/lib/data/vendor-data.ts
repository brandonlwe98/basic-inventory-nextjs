import { sql } from '@vercel/postgres';
import { unstable_noStore as noStore } from 'next/cache';
import { Vendor } from '../definitions';

const ITEMS_PER_PAGE = 6;

export async function fetchVendors() {
    noStore();

    try {
        const data = await sql<Vendor>`
        SELECT id, name, created_at, updated_at
        FROM vendors
        ORDER BY name ASC
        LIMIT 5`;

        return data.rows;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch the vendors.');
    }
}

export async function fetchVendorsPages(query: string) {
    noStore();
    
    try {
      const count = await sql`SELECT COUNT(*)
      FROM vendors
      WHERE
        name ILIKE ${`%${query}%`} OR
        created_at::text ILIKE ${`%${query}%`} OR
        updated_at::text ILIKE ${`%${query}%`}
    `;
  
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
      const vendors = await sql<Vendor>`
        SELECT
          id,
          name,
          created_at,
          updated_at
        FROM vendors
        WHERE
          name ILIKE ${`%${query}%`} OR
          created_at::text ILIKE ${`%${query}%`} OR
          updated_at::text ILIKE ${`%${query}%`}
        ORDER BY updated_at DESC
        LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
      `;
  
      return vendors.rows;
    } catch (error) {
      console.error('Database Error:', error);
      throw new Error('Failed to fetch vendors.');
    }
}
  
export async function fetchVendorById(id: string) {
    noStore();
    
    try {
      const data = await sql<Vendor>`
        SELECT
          id,
          name,
          created_at,
          updated_at
        FROM vendors
        WHERE id = ${id};
      `;
  
      return data.rows[0];
    } catch (error) {
      console.error('Database Error:', error);
      throw new Error('Failed to fetch vendor.');
    }
  }