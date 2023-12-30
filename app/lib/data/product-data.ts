import { sql } from '@vercel/postgres';
import { unstable_noStore as noStore } from 'next/cache';
import { Product, ProductTable } from '../definitions';

const ITEMS_PER_PAGE = 10;

export async function fetchProducts() {
    noStore();

    try {
        const data = await sql<Product>`
        SELECT id, vendor_id, name, image_url, barcode, quantity, unit, created_at, updated_at
        FROM products
        ORDER BY name ASC
        LIMIT ${ITEMS_PER_PAGE}`;

        return data;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch the products.');
    }
}

export async function fetchProductsPages(query: string) {
    noStore();
    
    try {
      const count = await sql`SELECT COUNT(*)
        FROM products p
        JOIN vendors v ON p.vendor_id::integer = v.id::integer
        WHERE
          p.name ILIKE ${`%${query}%`} OR
          v.name ILIKE ${`%${query}%`} OR
          p.barcode ILIKE ${`%${query}%`} OR
          p.quantity::text ILIKE ${`%${query}%`} OR
          p.unit ILIKE ${`%${query}%`} OR
          p.created_at::text ILIKE ${`%${query}%`} OR
          p.updated_at::text ILIKE ${`%${query}%`}
      `;
  
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
      const products = await sql<ProductTable>`
        SELECT
          p.id,
          p.vendor_id,
          v.name as vendor_name,
          p.name,
          p.image_url,
          p.barcode,
          p.quantity,
          p.unit,
          p.created_at,
          p.updated_at
        FROM products p
        JOIN vendors v ON p.vendor_id::integer = v.id::integer
        WHERE
          p.name ILIKE ${`%${query}%`} OR
          v.name ILIKE ${`%${query}%`} OR
          p.barcode ILIKE ${`%${query}%`} OR
          p.quantity::text ILIKE ${`%${query}%`} OR
          p.unit ILIKE ${`%${query}%`} OR
          p.created_at::text ILIKE ${`%${query}%`} OR
          p.updated_at::text ILIKE ${`%${query}%`}
        ORDER BY p.updated_at DESC
        LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
      `;

      return products.rows;
    } catch (error) {
      console.error('Database Error:', error);
      throw new Error('Failed to fetch products.');
    }
}
  
export async function fetchProductById(id: string) {
    noStore();
    
    try {
      const data = await sql<Product>`
        SELECT
          id,
          vendor_id,
          name,
          image_url,
          barcode,
          quantity,
          unit,
          created_at,
          updated_at
        FROM products
        WHERE id = ${id};
      `;
  
      return data.rows[0];
    } catch (error) {
      console.error('Database Error:', error);
      throw new Error('Failed to fetch product.');
    }
  }