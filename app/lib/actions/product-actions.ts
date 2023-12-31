'use server';
 
import { z } from 'zod';
import fs from 'fs';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { createDatabaseErrorMsg } from '../utils';
import { redirect } from 'next/navigation';
import { unstable_noStore as noStore } from 'next/cache';
import path, { join } from 'path';

const MAX_FILE_SIZE = 1024 * 1024 * 5;
const allowedFileTypes = ["image/jpeg", "image/png", "image/jpg", "image/svg"];

const ProductSchema = z.object({
    id: z.string(),
    imageURL: z.any()
                .refine((files) => {
                    let fileSize = files ? files.size : 0;
                    return fileSize <= MAX_FILE_SIZE;
                }, 'Max image size is 5MB')
                .refine((files) => {
                    return allowedFileTypes.includes(files?.type)
                }, "Only 'jpg', 'jpeg', 'png', and 'svg' formats are supported."),
    productName: z.string()
                    .trim()
                    .min(3, 'Product name must be at least 3 characters'),
    vendorId: z.string({
        invalid_type_error: 'Please select a vendor.',
    }),
    barcode: z.string().trim().min(1, 'Please enter barcode value'),
    quantity: z.coerce
        .number()
        .gt(0, { message: 'Please enter a quantity greater than 0.'}),
    unit: z.string().trim().min(1, 'Please enter product unit measurement'),
});

export type ProductState = {
    errors?: {
        productName?: string[];
        imageURL?: string[];
        vendorId?: string[];
        barcode?: string[];
        quantity?: string[];
        unit?: string[];
    };
    errorMessage?: string | null;
}

const CreateProduct = ProductSchema.omit({ id: true });
const UpdateProduct = ProductSchema.omit({ id: true, imageURL: true});

export async function createProduct(prevState: ProductState, formData: FormData) {
    noStore();

    const validatedFields = CreateProduct.safeParse({
        productName: formData.get('productName'),
        imageURL: formData.get('imageURL'),
        vendorId: formData.get('vendorId'),
        barcode: formData.get('barcode'),
        quantity: formData.get('quantity'),
        unit: formData.get('unit'),
    });

    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            errorMessage: 'Missing Fields. Failed to Create Product.',
        };
    }

    const { productName, imageURL, vendorId, barcode, quantity, unit } = validatedFields.data;

    const image : File = imageURL as File;

    const formattedQuantity = quantity * 100;
    try {
        const insertedProduct = await sql`
            INSERT INTO products (vendor_id, name, barcode, quantity, unit, created_at, updated_at)
            VALUES (${vendorId}, ${productName}, ${barcode}, ${formattedQuantity}, ${unit}, localtimestamp, localtimestamp)
            RETURNING id;
        `;


        const productId = insertedProduct.rows[0].id;
        // create image path (e.g. /product_images/1/1.png)
        const imagePath = `/product_images/${vendorId}/${productId}${path.extname(imageURL.name)}`;

        const bytes = await imageURL.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        // create the product image dir if not exist
        const makingDir = await fs.promises.mkdir(`${join('/product_images', vendorId)}`, { recursive: true}).catch(
            (err) => {
                throw err;
            }
        )

        await fs.writeFile(join(imagePath), buffer, ((err) => { // write the image file to the path
            if (err) {
                console.error("Error writing image to file", err);
                return {
                    errorMessage: createDatabaseErrorMsg(`Failed to create product. Error saving product image. ${err.message}`),
                };
            }
        }));

        await sql`
            UPDATE products
            SET image_url=${imagePath}
            WHERE id=${productId}
            `
    } catch (error : any) {
        console.error("Error creating product: ", error);
        return {
            errorMessage: createDatabaseErrorMsg(`Failed to create product. ${error.message}`),
        };
    }

    revalidatePath('/dashboard/products');
    redirect('/dashboard/products');
}

export async function updateProduct(id: string, prevState: ProductState, formData: FormData) {
    noStore();

    const validatedFields = UpdateProduct.safeParse({
        productName: formData.get('productName'),
        vendorId: formData.get('vendorId'),
        barcode: formData.get('barcode'),
        quantity: formData.get('quantity'),
        unit: formData.get('unit'),
    });

    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            errorMessage: 'Missing/Invalid Fields. Failed to Update Product.',
        };
    }

    const { productName, vendorId, barcode, quantity, unit } = validatedFields.data;
    const formattedQuantity = quantity * 100;

    try {
        await sql`
            UPDATE products
            SET name = ${productName}, vendor_id = ${vendorId}, barcode = ${barcode}, quantity = ${formattedQuantity}, unit = ${unit}, updated_at = localtimestamp
            WHERE id = ${id}
        `;
    } catch (error) {
        console.error("Failed to update product", error);
        return {
            errorMessage: createDatabaseErrorMsg('Failed to update product.')
        };
    }

    revalidatePath('/dashboard/products');
    redirect('/dashboard/products');
}

export async function deleteProduct(id: string) {
    try {
        const image_path = await sql`SELECT image_url FROM products
        WHERE id = ${id}`;
        
        await sql`DELETE FROM products 
            WHERE id = ${id}`;

        // remove product image from directory
        const pathToRemove = join(image_path.rows[0]?.image_url);
        await fs.unlink(pathToRemove, ((err) => {
            console.log("Unlinked product image file with id", id);
            if (err) {
                console.error("Error removing product image file from directory", err)
                throw err;
            }
        }));
    } catch (error: any) {
        console.error("Failed to delete product", error);
        revalidatePath('/dashboard/products');
        return {
            errorMessage: createDatabaseErrorMsg(`Failed to delete product. ${error.message}`),
        };
    }

    revalidatePath('/dashboard/products');
    redirect('/dashboard/products');
}

export async function deleteProductsByVendor(vendorId: string) {
    try {
        console.log("Deleting vendor products with vendor id" ,vendorId);

        const products = await sql
        `SELECT * 
        FROM products 
        WHERE vendor_id = ${vendorId}`;

        await Promise.all(
            products.rows.map(async (product) => {
                const pathToRemove = join(product.image_url);
                await fs.promises.unlink(pathToRemove).catch(((err) => {
                    console.log("Unlinked product image file with id", product.id);
                    if (err) {
                        console.error("Error removing product image file from directory", err)
                        throw err;
                    }
                }))

                return sql`
                DELETE FROM products
                WHERE id = ${product.id}`;
          }));

        
    } catch (error: any) {
        console.error("Failed to delete products by vendor", error);
        return {
            errorMessage: createDatabaseErrorMsg(`Failed to delete vendor products. ${error.message}`),
        };
    }

    revalidatePath('/dashboard/products');
}
