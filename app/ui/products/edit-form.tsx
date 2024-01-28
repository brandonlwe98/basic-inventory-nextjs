'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { deleteProduct, updateProduct, editStock } from '@/app/lib/actions/product-actions';
import { useFormState, useFormStatus } from 'react-dom';
import { Product, VendorField } from '@/app/lib/definitions';
import { UserCircleIcon, ScaleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { accessLevel, formatDateToLocal } from '@/app/lib/utils';

export default function Form(
  { vendors, product, userAccess }: 
  { vendors: VendorField[],
    product: Product,
    userAccess: string
  }
) {
  const initialState = { errorMessage: '', errors: {}, successMessage: ''};
  const updateProductWithId = updateProduct.bind(null, product.id);
  const editStockWithId = editStock.bind(null, product.id);

  const [state, dispatch] = useFormState(updateProductWithId, initialState);
  const [userState, userEdit] = useFormState(editStockWithId, initialState);
  const [previewImage, setPreviewImage] = useState<string | null>(product.image);
  const { pending } = useFormStatus();
  
  const deleteProductHandler = () => {
    if (confirm("Are you sure you want to delete this product?"))
      deleteProduct(product.id);
  }

  return (
    <form action={userAccess === accessLevel.ADMIN ? dispatch : userEdit}> {/** ADMIN->dispatch/ User->edit */}
      <div className="rounded-md bg-gray-50 p-4 md:p-6">

        {/* {Vendor} */}
        <div className="mb-4">
          <label htmlFor="vendor" className="mb-2 block text-sm font-medium">
            Choose vendor
          </label>
          <div className="relative">
            <select
              id="vendorId"
              name="vendorId"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500
                        disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 "
              defaultValue={product.vendor_id}
              aria-describedby='customer-error'
              disabled={
                accessLevel.ADMIN === userAccess ? false : true
              }
            >
              <option value="" disabled>
                Select a vendor
              </option>
              {vendors.map((vendor) => (
                <option key={vendor.id} value={vendor.id}>
                  {vendor.name}
                </option>
              ))}
            </select>
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          <div id="customer-error" aria-live="polite" aria-atomic="true">
            {state.errors?.vendorId &&
              state.errors.vendorId.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
            ))}
          </div>
        </div>

        {/* {Product Name} */}
        <div className="mb-4">
          <label htmlFor="productName" className="mb-2 block text-sm font-medium">
            Product Name
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="productName"
                name="productName"
                type="text"
                placeholder="Enter Product Name"
                className="peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500
                        disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200"
                aria-describedby='product-error'
                defaultValue={product.name}
                disabled={
                  accessLevel.ADMIN === userAccess ? false : true
                }
              />
            </div>
            <div id="product-error" aria-live="polite" aria-atomic="true">
              {state.errors?.productName &&
                state.errors.productName.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
              ))}
            </div>
          </div>
        </div>

        {/* {Product Category} */}
        {/* <div className="mb-4">
          <label htmlFor="category" className="mb-2 block text-sm font-medium">
            Product Category
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="category"
                name="category"
                type="text"
                className="peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500
                        disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200"
                defaultValue={product.category}
                disabled
                readOnly
              />
            </div>
          </div>
        </div> */}

        {/* {Product Image} */}
        <div className="mb-4">
          <label htmlFor="amount" className="mb-2 block text-sm font-medium">
            Product Image
          </label>
          <div className="relative mt-2 rounded-md">
            {previewImage &&
              (
                <div>
                  <Image
                    alt="Preview Image Not Found"
                    className=""
                    width={128}
                    height={128}
                    src={previewImage}
                  />
                </div> 
              )
            }
          </div>
        </div>

        {/* {Itemcode} */}
        <div className="mb-4">
          <label htmlFor="itemcode" className="mb-2 block text-sm font-medium">
            Product Item Code
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="itemcode"
                name="itemcode"
                type="text"
                placeholder="Enter Item Code"
                className="peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500
                          disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200"
                aria-describedby='itemcode-error'
                defaultValue={product.itemcode}
                disabled={
                  accessLevel.ADMIN === userAccess ? false : true
                }
              />
            </div>
            <div id="itemcode-error" aria-live="polite" aria-atomic="true">
              {state.errors?.itemcode &&
                state.errors.itemcode.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
              ))}
            </div>
          </div>
        </div>

        {/* {Barcode} */}
        <div className="mb-4">
          <label htmlFor="barcode" className="mb-2 block text-sm font-medium">
            Product Barcode
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="barcode"
                name="barcode"
                type="text"
                placeholder="Enter Barcode"
                className="peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500
                          disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200"
                aria-describedby='barcode-error'
                defaultValue={product.barcode}
                disabled={
                  accessLevel.ADMIN === userAccess ? false : true
                }
              />
            </div>
            <div id="barcode-error" aria-live="polite" aria-atomic="true">
              {state.errors?.barcode &&
                state.errors.barcode.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
              ))}
            </div>
          </div>
        </div>

        {/* {Quantity} */}
        <div className="mb-4">
          <label htmlFor="quantity" className="mb-2 block text-sm font-medium">
            Choose Product Quantity
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="quantity"
                name="quantity"
                type="number"
                step="0.01"
                placeholder="Enter Product Quantity per Case"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500
                          disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200"
                aria-describedby='quantity-error'
                defaultValue={product.quantity}
                disabled={
                  accessLevel.ADMIN === userAccess ? false : true
                }
              />
              <ScaleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            <div id="quantity-error" aria-live="polite" aria-atomic="true">
              {state.errors?.quantity &&
                state.errors.quantity.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
              ))}
            </div>
          </div>
        </div>

        {/* {Size} */}
        <div className="mb-4">
          <label htmlFor="size" className="mb-2 block text-sm font-medium">
            Choose Product Size
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="size"
                name="size"
                type="number"
                step="0.01"
                placeholder="Enter Product Size"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500
                          disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200"
                aria-describedby='size-error'
                defaultValue={product.size}
                disabled={
                  accessLevel.ADMIN === userAccess ? false : true
                }
              />
              <ScaleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            <div id="size-error" aria-live="polite" aria-atomic="true">
              {state.errors?.size &&
                state.errors.size.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
              ))}
            </div>
          </div>
        </div>

        {/* {Stock} */}
        <div className="mb-4">
          <label htmlFor="stock" className="mb-2 block text-sm font-medium">
            Choose Current Stock
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="stock"
                name="stock"
                type="number"
                step="0.01"
                placeholder="Enter Current Stock"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500
                          disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200"
                aria-describedby='stock-error'
                defaultValue={product.stock}
              />
              <ScaleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            <div id="stock-error" aria-live="polite" aria-atomic="true">
              {state.errors?.stock &&
                state.errors.stock.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
              ))}
              {userState.errors?.stock &&
                userState.errors.stock.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
              ))}
            </div>
          </div>
        </div>

        {/* {Unit} */}
        <div className="mb-4">
          <label htmlFor="unit" className="mb-2 block text-sm font-medium">
            Unit Measurement
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="unit"
                name="unit"
                type="text"
                placeholder="Enter Unit Measurement (lbs, oz, ...)"
                className="peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500
                          disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200"
                aria-describedby='unit-error'
                defaultValue={product.unit}
                disabled={
                  accessLevel.ADMIN === userAccess ? false : true
                }
              />
            </div>
            <div id="unit-error" aria-live="polite" aria-atomic="true">
              {state.errors?.unit &&
                state.errors.unit.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="createdAt" className="mb-2 block text-sm font-medium">
            Created At
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="createdAt"
                name="createdAt"
                type="text"
                defaultValue={formatDateToLocal(product.created_at)}
                className="peer block w-full rounded-md border py-2 text-sm outline-2 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200"
                readOnly
                disabled
              />
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="updatedAt" className="mb-2 block text-sm font-medium">
            Updated At
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="updatedAt"
                name="updatedAt"
                type="text"
                defaultValue={formatDateToLocal(product.updated_at)}
                className="peer block w-full rounded-md border py-2 text-sm outline-2 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200"
                readOnly
                disabled
              />
            </div>
          </div>
        </div>

        <div
          className="flex h-8 items-end space-x-1"
          aria-live="polite"
          aria-atomic="true"
        >
          {state.errorMessage?.trim().length > 0 && (
            <>
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-500">{state.errorMessage}</p>
            </>
          )}
        </div>

        <div
          className="flex h-8 items-end space-x-1"
          aria-live="polite"
          aria-atomic="true"
        >
          {userState.successMessage?.trim().length > 0 && (
            <>
              <ExclamationCircleIcon className="h-5 w-5 text-green-500" />
              <p className="text-sm text-green-500">{userState.successMessage}</p>
            </>
          )}
        </div>
        
      </div>

      <div className="mt-6 flex justify-between gap-4">
        {
          userAccess 
          && userAccess === 'administrator' ?
          
          <>
            <Button type="button" onClick={deleteProductHandler} className="flex bg-red-500 hover:bg-red-400 focus:bg-red-600 active:bg-red-600">
                Delete Product
            </Button>
            <div className="flex">
              <Link
                href="/dashboard/products"
                className="flex mx-2 h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
              >
                Cancel
              </Link>
              <Button type="submit" disabled={pending}>Edit Product</Button>
            </div>
          </>
        :
          <>
            <Link
              href="/dashboard/products"
              className="flex mx-2 h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
            >
              Cancel
            </Link>
            <Button type="submit" disabled={pending}>Edit Product</Button>
          </>
        }


      </div>
    </form>
  );
}
