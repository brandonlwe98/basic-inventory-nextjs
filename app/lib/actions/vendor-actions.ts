'use server';
 
import { z } from 'zod';
// import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { createDatabaseErrorMsg } from '../utils';
import { redirect } from 'next/navigation';
// import { Product, Vendor } from '../definitions';
import { unstable_noStore as noStore } from 'next/cache';
import { deleteProductsByVendor } from './product-actions';
import { pool } from '@/db.config';
import { Product, Vendor } from '../definitions';
import path from 'path';
const {escapeIdentifier} = require('pg');

const VendorSchema = z.object({
    id: z.string(),
    vendorName: z.string({
        required_error: 'Please enter vendor name',
    }).min(3),
});

export type VendorState = {
    errors?: {
        vendorName?: string[];
    };
    errorMessage?: string | null;
}

const CreateVendor = VendorSchema.omit({ id: true });
const UpdateVendor = VendorSchema.omit({ id: true });

export async function createVendor(prevState: VendorState, formData: FormData) {
    noStore();

    const validatedFields = CreateVendor.safeParse({
        vendorName: formData.get('vendorName'),
    });

    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            errorMessage: 'Missing Fields. Failed to Create Vendor.',
        };
    }

    const { vendorName } = validatedFields.data;

    try {
        const existingVendor = await pool.query(`SELECT * FROM vendors WHERE name = '${vendorName}'`);

        if (existingVendor.rows.length > 0) {
            console.log("Vendor already exists for => ", existingVendor.rows);
            return {
                errorMessage: 'Failed to create vendor, name already exists',
                errors: { vendorName: ['[Create Vendor] name already exists!']}
            };
        } else {
            await pool.query(
                `INSERT INTO vendors (name, created_at, updated_at) VALUES ('${vendorName}', localtimestamp, localtimestamp)`
            );
        }

    } catch (error) {
        console.error("Failed to create vendor", error);
        return {
            errorMessage: createDatabaseErrorMsg(`Failed to create vendor. Please make sure there are no special characters (/\'$!,)`),
        };
    }

    revalidatePath('/dashboard/vendors');
    redirect('/dashboard/vendors');
}

export async function getVendorProductCount(id: string) {
    try {
        const totalProducts = await pool.query(`
                SELECT COUNT(*)
                FROM products p
                JOIN vendors v ON p.vendor_id::integer = v.id::integer
                WHERE v.id = ${id}`);
        
        return String(totalProducts.rows[0].count);
    } catch (err) {
        console.error("Failed to retrieve total product count", err);
        return {
            errorMessage: createDatabaseErrorMsg('Failed to retrieve total product count.')
        };
    }
}

export async function updateVendor(id: string, prevState: VendorState, formData: FormData) {
    noStore();

    const validatedFields = UpdateVendor.safeParse({
        vendorName: formData.get('vendorName'),
    });

    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            errorMessage: 'Missing Fields. Failed to Update Vendor.',
        };
    }

    const { vendorName } = validatedFields.data;

    try {

        const existingVendor = await pool.query(`
        SELECT * FROM vendors
        WHERE name = '${vendorName}'
        `);

        if (existingVendor.rows.length > 0) {
            console.log("[Update Vendor] already exists for => ", existingVendor.rows);
            return {
                errorMessage: 'Failed to update vendor, name already exists',
                errors: { vendorName: ['Vendor name already exists!']}
            };
        } else {
            await pool.query(`
            UPDATE vendors
            SET name = '${vendorName}', updated_at = localtimestamp
            WHERE id = ${id}
            `);
        }

    } catch (error) {
        console.error("Failed to update vendor", error);
        return {
            errorMessage: createDatabaseErrorMsg('Failed to update vendor.')
        };
    }

    revalidatePath('/dashboard/vendors');
    redirect('/dashboard/vendors');
}

export async function deleteVendor(id: string) {
    try {
        await pool.query(`
        DELETE FROM vendors 
        WHERE id = ${id}`);
        
        await deleteProductsByVendor(id);

    } catch (error: any) {
        console.error("Failed to delete vendor", error);
        return {
            errorMessage: error.message,
        };
    }

    revalidatePath('/dashboard/vendors');
    redirect('/dashboard/vendors');
}

export async function generateReport(vendor: Vendor) {
    try {

    } catch (error) {
        if (error) {
            console.error("Failed to generate vendor report", error);
        } 
    }
    const products = await pool.query(
        `
        SELECT 
            p.id,
            p.vendor_id,
            p.name,
            p.itemcode,
            p.barcode,
            p.size,
            p.stock,
            p.unit
        from products p
        JOIN vendors v ON v.id::integer = p.vendor_id::integer
        WHERE v.id = ${vendor.id}`
    );

    const ExcelJS = require('exceljs');
    console.log("Generating vendor report...");
    const workbook = new ExcelJS.Workbook();

    const sheet = workbook.addWorksheet(`${vendor.name} Inventory Report`);

    sheet.columns = [
        { header: 'Product Name', key: 'name'},
        { header: 'Item Code', key: 'itemcode'},
        { header: 'Barcode', key: 'barcode'},
        { header: 'Size', key: 'size'},
        { header: 'Current Stock', key: 'stock'},
        { header: 'Unit', key: 'unit'},
    ]

    // set column headers
    for (let i = 1; i <= sheet.columns.length; i++) {
        sheet.getRow(1).getCell(i).value = sheet.getColumn(i).header;
        // console.log(sheet.getColumn('unit').header);
    }

    products.rows.forEach((product: any) => {
        let rowIterator = 2;

        for (let i = 1; i <= sheet.columns.length; i++) {
            // let curRow = sheet.getRow(rowIterator);
            sheet.getRow(rowIterator).getCell(i).value = product[sheet.getColumn(i).key];
        }
        rowIterator++;
    });

    const currentTimestamp = Date.now();
    const excelFilePath = path.join(process.cwd(), `public/vendor_reports/${vendor.name}_report_${currentTimestamp}.xlsx`);

    await workbook.xlsx.writeFile(excelFilePath);
    const res = await fetch(`${process.env.API_URL}/report?file=${excelFilePath.toString()}`, {
        method: 'POST',
        body : JSON.stringify({ file: excelFilePath.toString()}),
    })
    
    // res.blob().then((blob) => {
        
    // })
}
