'use server';
 
import { z } from 'zod';
// import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { createDatabaseErrorMsg, formatQuantity } from '../utils';
import { redirect } from 'next/navigation';
// import { Product, Vendor } from '../definitions';
import { unstable_noStore as noStore } from 'next/cache';
import { deleteProductsByVendor } from './product-actions';
import { pool } from '@/db.config';
import { Product, Vendor } from '../definitions';
import path from 'path';
import fs from 'fs';

const VendorSchema = z.object({
    id: z.string(),
    vendorName: z.string({
        required_error: 'Please enter vendor name',
    }).min(3),
    category: z.string({
        invalid_type_error: 'Please select a category.',
    }),
    address: z.string(),
    phone: z.string(),
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
        category: formData.get('category'),
        address: formData.get('address'),
        phone: formData.get('phone'),
    });

    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            errorMessage: 'Missing/Invalid Fields. Failed to Create Vendor.',
        };
    }

    const { vendorName, category, address, phone } = validatedFields.data;

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
                `INSERT INTO vendors (name, category, address, phone, created_at, updated_at) 
                VALUES ('${vendorName}', ${category}, '${address}', '${phone}', localtimestamp, localtimestamp)`
            );
        }

    } catch (error : any) {
        console.error("Failed to create vendor", error);
        return {
            errorMessage: createDatabaseErrorMsg(`Failed to create vendor (Make sure vendor name does not contain '"). ${error.message}`),
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
        category: formData.get('category'),
        address: formData.get('address'),
        phone: formData.get('phone'),
    });

    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            errorMessage: 'Missing Fields. Failed to Update Vendor.',
        };
    }

    const { vendorName, category, address, phone } = validatedFields.data;

    try {

        // const existingVendor = await pool.query(`
        //     SELECT * FROM vendors
        //     WHERE name = '${vendorName}'
        // `);

        // if (existingVendor.rows.length > 0) {
        //     console.log("[Update Vendor] already exists for => ", existingVendor.rows);
        //     return {
        //         errorMessage: 'Failed to update vendor, name already exists',
        //         errors: { vendorName: ['Vendor name already exists!']}
        //     };
        // } else {
            await pool.query(`
                UPDATE vendors
                SET 
                    name = '${vendorName}', 
                    category = ${category}, 
                    address = '${address}', 
                    phone='${phone}', 
                    updated_at = localtimestamp
                WHERE id = ${id}
            `);
        // }

    } catch (error : any) {
        console.error("Failed to update vendor", error);
        return {
            errorMessage: createDatabaseErrorMsg('Failed to update vendor. ' + error.message)
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

        const sheet = workbook.addWorksheet(`${vendor.name} Inventory Report`, { // A4 Size
            pageSetup: {
                paperSize: 9,
                orientation: 'portrait',
            }
        });

        // sheet.columns = [
        //     { header: 'Item No.', key: 'itemcode'},
        //     { header: 'Qty per Case/Bx', key: 'size'},
        //     { header: 'Item Wt.', key: 'unit'},
        //     { header: 'QTY CS Order', key: 'stock'},
        // ]

        // Create Default Page Header
        sheet.mergeCells('A1:C1'); // Address Line 1
        sheet.mergeCells('A2:C2'); // Address Line 2
        sheet.getCell('A1').value = "801 University Ave, Unit 1";
        sheet.getCell('A2').value = "Des Moines, IA 50134";
        sheet.getCell('A1').alignment = { horizontal: 'left'};
        sheet.getCell('A2').alignment = { horizontal: 'left'};
        
        sheet.mergeCells('D1:F1'); // C Fresh Market
        sheet.mergeCells('D2:F2'); // Purchase Order Form
        sheet.getCell('D1').value = "C Fresh Market";
        sheet.getCell('D2').value = "PURCHASE ORDER FORM";
        sheet.getCell('D1').style = { font: {bold: true }};
        sheet.getCell('D1').alignment = { horizontal: 'center'};
        sheet.getCell('D2').style = { font: {bold: true }};
        sheet.getCell('D2').alignment = { horizontal: 'center' };

        sheet.mergeCells('H1:I1'); // Tel No.
        sheet.mergeCells('H2:I2'); // Fax No.
        sheet.getCell('H1').value = "Tel:(515) 288-0525";
        sheet.getCell('H2').value = "Fax:(515) 288-0602";
        sheet.getCell('H1').alignment = { horizontal: 'left'};
        sheet.getCell('H2').alignment = { horizontal: 'left'};

        sheet.getCell('A4').value = "Company:";
        sheet.getCell('D4').value = "Salesman:";
        sheet.getCell('H4').value = "Date:";

        sheet.mergeCells('A5:I5');
        sheet.getCell('A5').style = {font: { bold: true }};
        sheet.getCell('A5').value = "* PLEASE INFORM US ANY SHORTED OR DISCONTINUED ITEM, SO WE CAN FIND OTHER ALTERNATIVES."

        // table header row
        const borderAround = {bottom: {style:'thin'}, top: {style:'thin'}, left: {style:'thin'}, right: {style:'thin'}};
        sheet.mergeCells('B6:C6'); // Item No.
        sheet.mergeCells('D6:E6'); // Qty per Case/Bx
        sheet.mergeCells('G6:H6'); // Stock on Hand
        sheet.getCell('A6').value = '#';
        sheet.getCell('A6').border = borderAround;
        sheet.getCell('B6').value = 'Item No.';
        sheet.getCell('B6').alignment = { horizontal: 'center', vertical: 'middle'};
        sheet.getCell('B6').border = borderAround;
        sheet.getCell('D6').value = "Qty per Case/Bx";
        sheet.getCell('D6').alignment = { wrapText: true, horizontal: 'center', vertical: 'middle' };
        sheet.getCell('D6').border = borderAround;
        sheet.getCell('F6').value = "Item Wt. (oz/lb)"
        sheet.getCell('F6').alignment = { wrapText: true, horizontal: 'center', vertical: 'middle' };
        sheet.getCell('F6').border = borderAround;
        sheet.getCell('G6').value = "Stock on Hand"
        sheet.getCell('G6').alignment = { wrapText: true, horizontal: 'center', vertical: 'middle' };
        sheet.getCell('G6').border = borderAround;
        sheet.getCell('I6').value = "Order Amount"
        sheet.getCell('I6').alignment = { wrapText: true, horizontal: 'center', vertical: 'middle' };
        sheet.getCell('I6').border = borderAround;

        // print 38 rows of items
        for (let i = 0; i < 38; i++) {
            let curRow = sheet.addRow([]);
            sheet.mergeCells(curRow.number, 2, curRow.number, 3); // Item No.
            sheet.mergeCells(curRow.number, 4, curRow.number, 5); // Qty per Case/Bx
            sheet.mergeCells(curRow.number, 7, curRow.number, 8); // Stock on Hand

            curRow.getCell(1).value = i + 1;
            if (i < products.rows.length) { // item details if exists
                let rowValues = [
                    products.rows[i]['itemcode'],
                    formatQuantity(products.rows[i]['size']),
                    products.rows[i]['unit'],
                    formatQuantity(products.rows[i]['stock'])
                ];

                curRow.getCell(2).value = rowValues[0];
                curRow.getCell(4).value = rowValues[1];
                curRow.getCell(6).value = rowValues[2];
                curRow.getCell(7).value = rowValues[3];
            }

            for (let i = 1; i <= 9; i++) { // border style and text-align left
                curRow.getCell(i).border = borderAround;
                curRow.getCell(i).alignment = { horizontal : 'left'};
            }
        }

        // Footer rows
        sheet.addRow(['* Pick ONLY The Item On The List, Unless Notify Us.']);
        sheet.addRow(['* Fax Back The Total Weights and Pallets.'])
        sheet.addRow(['* Drop-Off Order at "YD Trucking" Warehouse on.'])
        let lastRowVals = ['Authorized Signature:', 'Kevin Ng', 'Tel: (714) 249-3345'];
        let footerRow = sheet.addRow([]);
        sheet.mergeCells(footerRow.number, 1, footerRow.number, 2)
        sheet.mergeCells(footerRow.number, 3, footerRow.number, 4)
        sheet.mergeCells(footerRow.number, 5, footerRow.number, 6)
        footerRow.getCell(1).value = lastRowVals[0];
        footerRow.getCell(1).style = { font: {bold: true}};
        footerRow.getCell(3).value = lastRowVals[1];
        footerRow.getCell(3).style = { font: {bold: true, underline: true}};
        footerRow.getCell(3).alignment = { horizontal: 'center'};
        footerRow.getCell(5).value = lastRowVals[2];
        footerRow.getCell(5).style = { font: {bold: true, underline: true}};

        sheet.getColumn(1).width = 9;
        sheet.getColumn(2).width = 11;
        sheet.getColumn(9).width = 13;

        const currentTimestamp = Date.now();
        const fileName = `vendor_report_${currentTimestamp}.xlsx`;
        // const fileName = `test.xlsx`; // for testing purposes (overwrite same file)
        const excelFilePath = path.join(process.cwd(), `public/vendor_reports`, fileName);

        await workbook.xlsx.writeFile(excelFilePath);
        const file = await fs.promises.readFile(excelFilePath.toString()).catch((err) => { if (err) throw err });
        // console.log('excel file', file);

        return file;
    } catch (error) {
        if (error) {
            console.error("Failed to generate vendor report", error);
            throw error;
        } 
    }
}
