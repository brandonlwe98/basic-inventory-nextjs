'use server';
 
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { createDatabaseErrorMsg, formatQuantity } from '../utils';
import { redirect } from 'next/navigation';
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
    salesman: z.string(),
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
        salesman: formData.get('salesman'),
    });

    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            errorMessage: 'Missing/Invalid Fields. Failed to Create Vendor.',
        };
    }

    const { vendorName, category, address, phone, salesman } = validatedFields.data;

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
                `INSERT INTO vendors (name, category, address, phone, salesman, created_at, updated_at) 
                VALUES ('${vendorName}', ${category}, '${address}', '${phone}', '${salesman}', localtimestamp, localtimestamp)`
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
        salesman: formData.get('salesman'),
    });

    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            errorMessage: 'Missing Fields. Failed to Update Vendor.',
        };
    }

    const { vendorName, category, address, phone, salesman } = validatedFields.data;

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
                    salesman='${salesman}',
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
        const data = await pool.query(
            `
            SELECT 
                p.id,
                p.vendor_id,
                p.name,
                p.itemcode,
                p.barcode,
                p.quantity,
                p.size,
                p.stock,
                p.unit
            from products p
            JOIN vendors v ON v.id::integer = p.vendor_id::integer
            WHERE v.id = ${vendor.id}`
        );

        const products : Product[] = data.rows;

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
        sheet.mergeCells('A1:D1'); // Address Line 1
        sheet.mergeCells('A2:D2'); // Address Line 2
        sheet.getCell('A1').value = "801 University Ave, Unit 1";
        sheet.getCell('A2').value = "Des Moines, IA 50134";
        sheet.getCell('A1').alignment = { horizontal: 'left'};
        sheet.getCell('A2').alignment = { horizontal: 'left'};
        
        sheet.mergeCells('E1:G1'); // C Fresh Market
        sheet.mergeCells('E2:G2'); // Purchase Order Form
        sheet.getCell('E1').value = "C Fresh Market";
        sheet.getCell('E2').value = "PURCHASE ORDER FORM";
        sheet.getCell('E1').style = { font: {bold: true }};
        sheet.getCell('E1').alignment = { horizontal: 'center'};
        sheet.getCell('E2').style = { font: {bold: true }};
        sheet.getCell('E2').alignment = { horizontal: 'center' };

        sheet.mergeCells('I1:J1'); // Tel No.
        sheet.mergeCells('I2:J2'); // Fax No.
        sheet.getCell('I1').value = "Tel:(515) 288-0525";
        sheet.getCell('I2').value = "Fax:(515) 288-0602";
        sheet.getCell('I1').alignment = { horizontal: 'left'};
        sheet.getCell('I2').alignment = { horizontal: 'left'};

        sheet.mergeCells('A4:D4'); // Company:
        // sheet.getCell('A4').value = `Company: ${vendor.name}`;
        sheet.getCell('A4').value = `Company:`;

        sheet.mergeCells('E4:H4'); // Salesman:
        // sheet.getCell('E4').value = `Salesman: ${vendor.salesman}`;
        sheet.getCell('E4').value = `Salesman:`;

        sheet.mergeCells('I4:J4'); // Date:
        sheet.getCell('I4').value = "Date:";

        sheet.mergeCells('A5:J5'); // * Please inform us....
        sheet.getCell('A5').style = {font: { bold: true }};
        sheet.getCell('A5').value = "* PLEASE INFORM US ANY SHORTED OR DISCONTINUED ITEM, SO WE CAN FIND OTHER ALTERNATIVES."

        // table header row
        const borderAround = {bottom: {style:'thin'}, top: {style:'thin'}, left: {style:'thin'}, right: {style:'thin'}};
        sheet.mergeCells('B6:C6'); // Item No.
        sheet.mergeCells('D6:E6'); // Qty per Case/Bx
                                   // F6 => Size
                                   // G6 => Item wt.
        sheet.mergeCells('H6:I6'); // Stock on Hand
                                   // J6 => Order Amount
        sheet.getCell('A6').value = '#';
        sheet.getCell('A6').border = borderAround;
        sheet.getCell('B6').value = 'Item No.';
        sheet.getCell('B6').alignment = { horizontal: 'center', vertical: 'middle'};
        sheet.getCell('B6').border = borderAround;
        sheet.getCell('D6').value = "Qty/Case";
        sheet.getCell('D6').alignment = { wrapText: true, horizontal: 'center', vertical: 'middle' };
        sheet.getCell('D6').border = borderAround;
        sheet.getCell('F6').value = "Size";
        sheet.getCell('F6').alignment = { wrapText: true, horizontal: 'center', vertical: 'middle' };
        sheet.getCell('F6').border = borderAround;
        sheet.getCell('G6').value = "Item Wt. (oz/lb)"
        sheet.getCell('G6').alignment = { wrapText: true, horizontal: 'center', vertical: 'middle' };
        sheet.getCell('G6').border = borderAround;
        sheet.getCell('H6').value = "Stock on Hand"
        sheet.getCell('H6').alignment = { wrapText: true, horizontal: 'center', vertical: 'middle' };
        sheet.getCell('H6').border = borderAround;
        sheet.getCell('J6').value = "Order Amount"
        sheet.getCell('J6').alignment = { wrapText: true, horizontal: 'center', vertical: 'middle' };
        sheet.getCell('J6').border = borderAround;

        // print 38 rows of items
        for (let i = 0; i < 38; i++) {
            let curRow = sheet.addRow([]);
            sheet.mergeCells(curRow.number, 2, curRow.number, 3); // Item No.
            sheet.mergeCells(curRow.number, 4, curRow.number, 5); // Qty per Case/Bx
            sheet.mergeCells(curRow.number, 8, curRow.number, 9); // Stock on Hand

            curRow.getCell(1).value = i + 1; // item index no.

            if (i < products.length) { // item details if exists
                let rowValues = [
                    products[i]['itemcode'],
                    formatQuantity(products[i]['quantity']),
                    formatQuantity(products[i]['size']),
                    products[i]['unit'],
                    formatQuantity(products[i]['stock'])
                ];

                curRow.getCell(2).value = rowValues[0]; // item code
                curRow.getCell(4).value = rowValues[1]; // quantity
                curRow.getCell(6).value = rowValues[2]; // size
                curRow.getCell(7).value = rowValues[3]; // unit
                curRow.getCell(8).value = rowValues[4]; // stock
            }

            for (let i = 1; i <= 10; i++) { // border style and text-align left
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
        sheet.mergeCells(footerRow.number, 1, footerRow.number, 3)
        sheet.mergeCells(footerRow.number, 4, footerRow.number, 7)
        sheet.mergeCells(footerRow.number, 8, footerRow.number, 10)
        footerRow.getCell(1).value = lastRowVals[0];
        footerRow.getCell(1).style = { font: {bold: true}};
        footerRow.getCell(4).value = lastRowVals[1];
        footerRow.getCell(4).style = { font: {bold: true, underline: true}};
        footerRow.getCell(4).alignment = { horizontal: 'center'};
        footerRow.getCell(8).value = lastRowVals[2];
        footerRow.getCell(8).style = { font: {bold: true, underline: true}};

        sheet.getColumn(1).width = 5;
        sheet.getColumn(2).width = 7;
        sheet.getColumn(10).width = 13;

        const currentTimestamp = Date.now();
        const fileName = `vendor_report_${currentTimestamp}.xlsx`;
        // const fileName = `test.xlsx`; // for testing purposes (overwrite same file)
        const excelFilePath = path.join(process.cwd(), `public/vendor_reports`, fileName);

        await workbook.xlsx.writeFile(excelFilePath);
        const file = await fs.promises.readFile(excelFilePath.toString()).catch((err) => { if (err) throw err });

        return file;
    } catch (error) {
        if (error) {
            console.error("Failed to generate vendor report", error);
            throw error;
        } 
    }
}
