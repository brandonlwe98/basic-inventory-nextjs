'use server';
 
import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { createDatabaseErrorMsg } from '../utils';
import { redirect } from 'next/navigation';
import { Product, Vendor } from '../definitions';
import { unstable_noStore as noStore } from 'next/cache';
import { deleteProduct, deleteProductsByVendor } from './product-actions';
import { join } from 'path';
import fs from 'fs';

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
        const existingVendor = await sql<Vendor>`
        SELECT * FROM vendors
        WHERE name = ${vendorName}
        `;

        if (existingVendor.rows.length > 0) {
            console.log("Vendor already exists for => ", existingVendor.rows);
            return {
                errorMessage: 'Failed to create vendor, name already exists',
                errors: { vendorName: ['[Create Vendor] name already exists!']}
            };
        } else {
            await sql`
            INSERT INTO vendors (name, created_at, updated_at)
            VALUES (${vendorName}, localtimestamp, localtimestamp)`;
        }

    } catch (error) {
        console.error("Failed to create vendor", error);
        return {
            errorMessage: createDatabaseErrorMsg('Failed to create vendor.'),
        };
    }

    revalidatePath('/dashboard/vendors');
    redirect('/dashboard/vendors');
}

export async function getVendorProductCount(id: string) {
    try {
        const totalProducts = await sql`
                SELECT COUNT(*)
                FROM products p
                JOIN vendors v ON p.vendor_id::integer = v.id::integer
                WHERE v.id = ${id}`;
        
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

        const existingVendor = await sql<Vendor>`
        SELECT * FROM vendors
        WHERE name = ${vendorName}
        `;

        if (existingVendor.rows.length > 0) {
            console.log("[Update Vendor] already exists for => ", existingVendor.rows);
            return {
                errorMessage: 'Failed to update vendor, name already exists',
                errors: { vendorName: ['Vendor name already exists!']}
            };
        } else {
            await sql`
            UPDATE vendors
            SET name = ${vendorName}, updated_at = localtimestamp
            WHERE id = ${id}
        `;
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
        await sql`
        DELETE FROM vendors 
        WHERE id = ${id}`;
        
        await deleteProductsByVendor(id);

        // remove vendor image directory
        await fs.promises.rmdir(join('public', 'product_images', id.toString()));

    } catch (error) {
        console.error("Failed to delete vendor", error);
        return {
            errorMessage: createDatabaseErrorMsg('Failed to delete vendor.'),
        };
    }

    revalidatePath('/dashboard/vendors');
    redirect('/dashboard/vendors');
}