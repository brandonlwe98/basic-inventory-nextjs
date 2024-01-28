'use client';

import Image from 'next/image';
import { Button } from '@/app/ui/button';
import { deleteProduct, updateProduct, editStock } from '@/app/lib/actions/product-actions';
import { useFormState, useFormStatus } from 'react-dom';
import { Product } from '@/app/lib/definitions';
import { ScaleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { accessLevel, formatDateToLocal, formatQuantity } from '@/app/lib/utils';

export default function Form(
  { vendorName, product, userAccess }: 
  { vendorName: string,
    product: Product,
    userAccess: string
  }
) {
  const initialState = { errorMessage: '', successMessage: '', errors: {}};
  const editStockWithId = editStock.bind(null, product.id);

  const [state, editAction] = useFormState(editStockWithId, initialState);
  const { pending } = useFormStatus();
  
  const deleteProductHandler = () => {
    if (confirm("Are you sure you want to delete this product?"))
      deleteProduct(product.id);
  }

  return (
    <form action={editAction}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        <div className="grid gap-6 grid-cols-4 grid-rows-6">

          {/* {Vendor Name} */}
          <div className='col-span-2'>
            <label htmlFor="vendor" className="mb-2 block text-sm font-medium">
              Vendor
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="vendor"
                  name="vendor"
                  type="text"
                  className="peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500
                          disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200"
                  defaultValue={vendorName}
                  disabled
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* {Product Image} */}
          <div className="col-span-2 row-span-4">
            <div className="relative mt-2 rounded-md">
              {product.image &&
                (
                  <div>
                    <Image
                      alt="Preview Image Not Found"
                      className=""
                      width={256}
                      height={256}
                      src={product.image}
                    />
                  </div> 
                )
              }
            </div>
          </div>

          {/* {Product Name} */}
          <div className="col-span-2">
            <label htmlFor="name" className="mb-2 block text-sm font-medium">
              Product Name
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="name"
                  name="name"
                  type="text"
                  className="peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500
                          disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200"
                  defaultValue={product.name}
                  disabled
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* {Itemcode} */}
          <div className="col-span-2">
            <label htmlFor="itemcode" className="mb-2 block text-sm font-medium">
              Product Item Code
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="itemcode"
                  name="itemcode"
                  type="text"
                  className="peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500
                            disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200"
                  defaultValue={product.itemcode}
                  disabled
                />
              </div>
            </div>
          </div>

          {/* {Quantity} */}
          <div className="col-span-2">
            <label htmlFor="quantity" className="mb-2 block text-sm font-medium">
              Quantity Per Case
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="quantity"
                  name="quantity"
                  type="number"
                  step="0.01"
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500
                            disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200"
                  defaultValue={product.quantity}
                  disabled
                />
                <ScaleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>
          </div>

          {/* {Size} */}
          <div className="col-span-1">
            <label htmlFor="size" className="mb-2 block text-sm font-medium">
              Size
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="size"
                  name="size"
                  type="number"
                  step="0.01"
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500
                            disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200"
                  defaultValue={product.size}
                  disabled
                />
                <ScaleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>
          </div>

          {/* {Unit} */}
          <div className="col-span-1">
            <label htmlFor="unit" className="mb-2 block text-sm font-medium">
              Unit
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="unit"
                  name="unit"
                  type="text"
                  className="peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500
                            disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200"
                  defaultValue={product.unit}
                  disabled
                />
              </div>
            </div>
          </div>

          {/* {Stock} */}
          <div className="col-span-2">
            <label htmlFor="stock" className="mb-2 block text-sm font-medium">
              Stock On Hand
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
              </div>
            </div>
          </div>

          {/* {CreatedAt} */}
          <div className="col-span-2">
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

          {/* {UpdatedAt} */}
          <div className="col-span-2">
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
        </div>

        <div
          className="flex h-4 items-end space-x-1"
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
          className="flex h-4 items-end space-x-1"
          aria-live="polite"
          aria-atomic="true"
        >
          {state.successMessage?.trim().length > 0 && (
            <>
              <ExclamationCircleIcon className="h-5 w-5 text-green-500" />
              <p className="text-sm text-green-500">{state.successMessage}</p>
            </>
          )}
        </div>

        <div className="mt-6 flex justify-between gap-4">
          {
            userAccess 
            && userAccess === 'administrator' ?
            
            <>
              <div className='flex'>
                <Button type="submit" disabled={pending} className='mr-2'>Save</Button>
                <Button type="button" onClick={deleteProductHandler} className="flex bg-red-500 hover:bg-red-400 focus:bg-red-600 active:bg-red-600">
                    Delete Product
                </Button>
              </div>
            </>
          :
            <>
              <div className='flex'>
                <Button type="submit" disabled={pending}>Save</Button>
              </div>
            </>
          }
        </div>
      </div>
    </form>
  );
}
