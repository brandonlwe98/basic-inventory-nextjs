'use server';
 
import { z } from 'zod';
import fs from 'fs';
// import { sql } from '@vercel/postgres';
import { pool } from '@/db.config';
import { revalidatePath } from 'next/cache';
import { createDatabaseErrorMsg } from '../utils';
import { redirect } from 'next/navigation';
import { unstable_noStore as noStore } from 'next/cache';
import { Product, ProductImage } from '../definitions';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

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
    itemcode: z.string().trim().min(1, 'Please enter itemcode value'),
    barcode: z.string().trim().min(1, 'Please enter barcode value'),
    size: z.coerce
        .number()
        .gt(0, { message: 'Please enter size greater than 0.'}),
    stock: z.coerce
        .number()
        .nonnegative(),
    unit: z.string().trim().min(1, 'Please enter product unit measurement'),
});

export type ProductState = {
    errors?: {
        productName?: string[];
        imageURL?: string[];
        vendorId?: string[];
        itemcode?: string[];
        barcode?: string[];
        size?: string[];
        stock?: string[];
        unit?: string[];
    };
    errorMessage?: string | null;
}

const CreateProduct = ProductSchema.omit({ id: true });
const UpdateProduct = ProductSchema.omit({ id: true, imageURL: true});
const EditStock = ProductSchema.omit(
    { id: true, imageURL: true, productName: true, vendorId: true, itemcode: true, barcode: true, size: true, unit: true}
);

export async function createProduct(prevState: ProductState, formData: FormData) {
    noStore();

    const validatedFields = CreateProduct.safeParse({
        productName: formData.get('productName'),
        imageURL: formData.get('imageURL'),
        vendorId: formData.get('vendorId'),
        itemcode: formData.get('itemcode'),
        barcode: formData.get('barcode'),
        size: formData.get('size'),
        stock: formData.get('stock'),
        unit: formData.get('unit'),
    });

    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
        console.info("Missing create-product fields", validatedFields.error.flatten().fieldErrors);
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            errorMessage: 'Missing Fields. Failed to Create Product.',
        };
    }

    const { productName, imageURL, vendorId, itemcode, barcode, size, stock, unit } = validatedFields.data;

    // console.log("IMAGE URL", imageURL);
    // var buffer = await Buffer.from(JSON.stringify(imageURL)); // imageURL returns a File Object
    // const imageBlob : Blob = new Blob([imageURL], { type: imageURL.type});
    // const imageBuffer = await imageBlob.arrayBuffer();
    // console.log("IMG BUFFER", imageBuffer);
    // const bytea : any = new Uint8Array(imageBuffer);
    // console.log("BYTE ARRAY", bytea);

    const formattedSize = size * 100;
    const formattedStock = stock * 100;

    try {
        // const res = await pool.query(
        //     `INSERT INTO product_images (product_id, image_byte, type) VALUES (1, '${bytea.toString()}', '${imageURL.type}')
        //     RETURNING *`
        // );
        // console.log(res.rows);
        // create image path (e.g. /product_images/1/1.png)
        const imageExt = path.extname(imageURL.name);
        const uniqueImageCode = uuidv4();

        // construct file path with .ext
        const imagePath = `/product_images/${uniqueImageCode}${imageExt}`;
        const actualFilePath = path.join(process.cwd(), `public${imagePath}`);

        // get buffer from file upload
        const bytes = await imageURL.arrayBuffer();
        const buffer = Buffer.from(bytes);

        await fs.promises.writeFile(actualFilePath, buffer).catch(
            (err) => {
                if (err) {
                    throw new Error(`Failed to write image into local directory. ${err.message}`);
                }
            }
        );

        const queryString = (`
            INSERT INTO products (vendor_id, name, image, itemcode, barcode, size, stock, unit, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, localtimestamp, localtimestamp)
            RETURNING id;
        `);

        await pool.query(queryString, [vendorId, productName, imagePath, itemcode, barcode, formattedSize, formattedStock, unit]);
    } catch (error : any) {
        console.error("Error creating product: ", error);
        return {
            errorMessage: error.message
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
        itemcode: formData.get('itemcode'),
        barcode: formData.get('barcode'),
        size: formData.get('size'),
        stock: formData.get('stock'),
        unit: formData.get('unit'),
    });

    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            errorMessage: 'Missing/Invalid Fields. Failed to Update Product.',
        };
    }

    const { productName, vendorId, itemcode, barcode, size, stock, unit } = validatedFields.data;
    const formattedSize = size * 100;
    const formattedStock = stock * 100;

    try {
        const queryString = `
            UPDATE products
            SET name = $1,
                vendor_id = $2,
                itemcode = $3,
                barcode = $4,
                size = $5,
                stock = $6,
                unit = $7,
                updated_at = localtimestamp
            WHERE id = $8
        `
        await pool.query(queryString,
                        [productName, vendorId, itemcode, barcode, formattedSize, formattedStock, unit, id]);
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
        const product = await pool.query(`SELECT * FROM products WHERE id = ${id}`);

        const actualFilePath = path.join(process.cwd(), `public${product.rows[0].image}`);
        console.log("actual file path", actualFilePath);
        await fs.promises.unlink(actualFilePath).catch(((err) => {
            if (err) {
                throw new Error("Error removing product image from local directory", err);
            }
        }));

        await pool.query(`DELETE FROM products WHERE id = ${id}`);
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

        const products = await pool.query(`SELECT * FROM products WHERE vendor_id = '${vendorId}'`);

        await Promise.all(
            products.rows.map(async (product : Product) => {
                const pathToRemove = path.join(process.cwd(), `public${product.image}`);
                await fs.promises.unlink(pathToRemove).catch(((err) => {
                    console.log("Unlinked product image file with id", product.id);
                    if (err) {
                        console.error("Error removing product image file from directory", err)
                        throw new Error("Failed to remove product image of vendor", err);
                    }
                }))

                return pool.query(`DELETE FROM products WHERE id = ${product.id}`);
          })
          ).catch((err) => {
                if (err) throw err;
            });

        
    } catch (error: any) {
        console.error("Failed to delete products by vendor", error);
        return {
            errorMessage: createDatabaseErrorMsg(`Failed to delete vendor products. ${error.message}`),
        };
    }

    revalidatePath('/dashboard/products');
}

// function that will be called only when USER access level edits stock value of product
export async function editStock(productId: string, prevState: ProductState, formData: FormData) {
    noStore();

    const validatedFields = EditStock.safeParse({
        stock: formData.get('stock')
    })

    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
        console.log("FIELD ERROR", validatedFields.error.flatten());
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            errorMessage: 'Missing Fields. Failed to Create Product.',
        };
    }

    const { stock } = validatedFields.data;

    const formattedStock = stock * 100;

    try {
        const queryString = `
            UPDATE products
            SET stock = $1
            WHERE id = $2
        `
        await pool.query(queryString,
                        [formattedStock, productId]);
    } catch (error) {
        console.error("Failed to update product stock", error);
        return {
            errorMessage: createDatabaseErrorMsg('Failed to update product stock.')
        };
    }

    revalidatePath('/dashboard/products');
    redirect('/dashboard/products');
}

// export async function getProductImage(id: string) {
//     try {
//         console.log("Retrieving product img");

//         const res = await pool.query(`SELECT * from product_images WHERE id = 2`);

//         const productImg : ProductImage = res.rows?.[0];
//         console.log("Product res", productImg);
//         console.log("RETURNING BYTEA", productImg.image_byte);
//         // return productImg.rows[0]?.image_byte;
//         const blob = new Blob([productImg?.image_byte], {type: productImg.type});
//         const imgUrl = URL.createObjectURL(blob);
//         console.log("BLOB IS ", blob);
//         return imgUrl;
//     } catch (error: any) {
//         console.error(" Failed to retrieve product image from database", error);
//         return '';
//     }
// }