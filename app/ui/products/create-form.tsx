'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { createProduct } from '@/app/lib/actions/product-actions';
import { useFormState, useFormStatus } from 'react-dom';
import { VendorField } from '@/app/lib/definitions';
import { UserCircleIcon, ScaleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { useRef, useState } from 'react';

export default function Form({ vendors }: { vendors: VendorField[] }) {
  const initialState = { errorMessage: '', errors: {}};
  const [state, dispatch] = useFormState(createProduct, initialState);
  const [previewImage, setPreviewImage] = useState<File | null>(null);
  const productImageInput = useRef<any>(null);
  const { pending } = useFormStatus();
  
  return (
    <form action={dispatch}>
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
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue=""
              aria-describedby='customer-error'
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
          <label htmlFor="amount" className="mb-2 block text-sm font-medium">
            Product name
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="productName"
                name="productName"
                type="text"
                placeholder="Enter Product Name"
                className="peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby='product-error'
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

        {/* {Product Image} */}
        <div className="mb-4">
          <label htmlFor="amount" className="mb-2 block text-sm font-medium">
            Product Image
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="imageURL"
                name="imageURL"
                type="file"
                ref={productImageInput}
                className="peer block w-full rounded-md border py-2 text-sm outline-2"
                aria-describedby='image-error'
                required
                onChange={(event) => {
                  if (event.target.files) {
                      setPreviewImage(event.target.files[0]);
                  }
                }}
              />
            </div>
            <div id="image-error" aria-live="polite" aria-atomic="true">
              {state.errors?.imageURL &&
                state.errors.imageURL.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>))
              }
            </div>

            {previewImage &&
              (
                <div>
                  <Image
                    alt="Preview Image Not Found"
                    className=""
                    width={100}
                    height={100}
                    src={URL.createObjectURL(previewImage)}
                  />
                  <Button onClick={() => {
                      productImageInput.current.value = null;
                      setPreviewImage(null); 
                    }}>Remove</Button>
                </div> 
              )
            }
          </div>
        </div>

        {/* {Barcode} */}
        <div className="mb-4">
          <label htmlFor="amount" className="mb-2 block text-sm font-medium">
            Product Barcode
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="barcode"
                name="barcode"
                type="text"
                placeholder="Enter Barcode"
                className="peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby='barcode-error'
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
          <label htmlFor="amount" className="mb-2 block text-sm font-medium">
            Choose a quantity
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="quantity"
                name="quantity"
                type="number"
                step="0.01"
                placeholder="Enter Product Quantity"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby='quantity-error'
              />
              <ScaleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            <div id="amount-error" aria-live="polite" aria-atomic="true">
              {state.errors?.quantity &&
                state.errors.quantity.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
              ))}
            </div>
          </div>
        </div>

        {/* {Unit} */}
        <div className="mb-4">
          <label htmlFor="amount" className="mb-2 block text-sm font-medium">
            Unit Measurement
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="unit"
                name="unit"
                type="text"
                placeholder="Enter Unit Measurement (lbs, oz, ...)"
                className="peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby='unit-error'
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
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/products"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit" disabled={pending} aria-disabled={pending}>Create Product</Button>
      </div>
    </form>
  );
}
