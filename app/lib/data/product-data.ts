// import { sql } from '@vercel/postgres';
import { unstable_noStore as noStore } from 'next/cache';
import { Product, ProductTable } from '../definitions';
import { pool } from '@/db.config';

const ITEMS_PER_PAGE = 10;

export async function fetchProducts() {
    noStore();

    try {
        const data = await pool.query(
          `SELECT id, vendor_id, name, image, itemcode, barcode, size, stock, unit, created_at, updated_at FROM products ORDER BY name ASC LIMIT ${ITEMS_PER_PAGE}`);

        return data;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch the products.');
    }
}

export async function fetchProductsPages(query: string) {
    noStore();
    
    try {
      const queryString = `SELECT COUNT(*)
        FROM products p
        JOIN vendors v ON p.vendor_id::integer = v.id::integer
        WHERE 
          p.name ILIKE $1 OR
          p.itemcode ILIKE $1 OR
          p.barcode ILIKE $1 OR
          p.size::text ILIKE $1 OR
          p.stock::text ILIKE $1 OR
          p.unit ILIKE $1 OR
          p.created_at::text ILIKE $1 OR
          p.updated_at::text ILIKE $1
      `;

      const count = await pool.query(queryString, [`%${query}%`]);
  
      const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
      return totalPages;
    } catch (error) {
      console.error('Database Error:', error);
      throw new Error('Failed to fetch total pages for products.');
    }
}

export async function fetchFilteredProducts(
    query: string,
    currentPage: number,
  ) {
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  
    noStore();
    
    try {
      const queryString = `
        SELECT
          p.id,
          p.vendor_id,
          v.name as vendor_name,
          p.name,
          p.image,
          p.itemcode,
          p.barcode,
          p.size,
          p.stock,
          p.unit,
          p.created_at,
          p.updated_at
        FROM products p
        JOIN vendors v ON p.vendor_id::integer = v.id::integer
        WHERE
          p.name ILIKE $1 OR
          v.name ILIKE $1 OR
          p.itemcode ILIKE $1 OR
          p.barcode ILIKE $1 OR
          p.size::text ILIKE $1 OR
          p.stock::text ILIKE $1 OR
          p.unit ILIKE $1 OR
          p.created_at::text ILIKE $1 OR
          p.updated_at::text ILIKE $1
        ORDER BY p.updated_at DESC
        LIMIT $2 OFFSET $3
      `;

      const products = await pool.query(queryString, [`%${query}%`, ITEMS_PER_PAGE, offset]);

      return products.rows;
    } catch (error) {
      console.error('Database Error:', error);
      throw new Error('Failed to fetch filtered products.');
    }
}
  
export async function fetchProductById(id: string) {
    noStore();
    
    try {
      const queryString = `
      SELECT *
      FROM products
      WHERE id = ${id}`;

      const data = await pool.query(queryString);
      
      return data.rows?.[0];
    } catch (error) {
      console.error('Database Error:', error);
      throw new Error('Failed to fetch product.');
    }
  }