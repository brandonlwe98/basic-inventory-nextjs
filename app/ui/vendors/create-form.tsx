'use client';

import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { createVendor } from '@/app/lib/actions/vendor-actions';
import { useFormState } from 'react-dom';
import { ArchiveBoxIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { Category } from '@/app/lib/definitions';

export default function Form({
  categories
} : {
  categories: Category[]
}) {
  const initialState = { errorMessage: '', errors: {}};
  const [state, dispatch] = useFormState(createVendor, initialState);

  return (
    <form action={dispatch} id='formCreateVendor'>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        <div className="mb-4">
          <label htmlFor="amount" className="mb-2 block text-sm font-medium">
            Vendor name
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="vendorName"
                name="vendorName"
                type="text"
                placeholder="Enter Vendor's Name"
                className="peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby='vendor-error'
              />
            </div>
            <div id="vendor-error" aria-live="polite" aria-atomic="true">
              {state.errors?.vendorName &&
                state.errors.vendorName.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
              ))}
            </div>
          </div>
        </div>

        {/* Category */}
        <div className="mb-4">
          <label htmlFor="category" className="mb-2 block text-sm font-medium">
            Category
          </label>
          <div className="relative">
            <select
              id="category"
              name="category"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500
                        disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 "
              aria-describedby='category-error'
              defaultValue=""
            >
              <option value="" disabled>
                Select a category
              </option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <ArchiveBoxIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          <div id="category-error" aria-live="polite" aria-atomic="true">
            {state.errors?.category &&
              state.errors.category.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
            ))}
          </div>
        </div>

        {/* {Address} */}
        <div className="mb-4">
          <label htmlFor="address" className="mb-2 block text-sm font-medium">
            Address
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              {/* <input
                id="address"
                name="address"
                type="text"
                placeholder="Enter Vendor Address"
                className="peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500
                          disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200"
                aria-describedby='address-error'
              /> */}
              <textarea name='address' id='address' form='formCreateVendor' 
                className='peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500
                disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 overflow-y-scroll'
                aria-describedby='address-error'
                rows={3}
              />
            </div>
            <div id="address-error" aria-live="polite" aria-atomic="true">
              {state.errors?.address &&
                state.errors.address.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
              ))}
            </div>
          </div>
        </div>
        
        {/* {Phone Number} */}
        <div className="mb-4">
          <label htmlFor="phone" className="mb-2 block text-sm font-medium">
            Phone Number
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="phone"
                name="phone"
                type="text"
                placeholder="Enter Vendor Phone Number"
                className="peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500
                          disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200"
                aria-describedby='phone-error'
              />
            </div>
            <div id="phone-error" aria-live="polite" aria-atomic="true">
              {state.errors?.phone &&
                state.errors.phone.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
              ))}
            </div>
          </div>
        </div>

        {/* {Salesman} */}
        <div className="mb-4">
          <label htmlFor="salesman" className="mb-2 block text-sm font-medium">
            Salesman
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="salesman">
              <input
                id="salesman"
                name="salesman"
                type="text"
                placeholder="Enter Vendor Salesman"
                className="peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500
                          disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200"
                aria-describedby='salesman-error'
              />
            </div>
            <div id="salesman-error" aria-live="polite" aria-atomic="true">
              {state.errors?.salesman &&
                state.errors.salesman.map((error: string) => (
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
          href="/dashboard/vendors"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Create Vendor</Button>
      </div>
    </form>
  );
}
