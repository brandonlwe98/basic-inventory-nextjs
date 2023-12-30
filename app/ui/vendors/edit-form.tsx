'use client';

import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { deleteVendor, getVendorProductCount, updateVendor } from '@/app/lib/actions/vendor-actions';
import { useFormState } from 'react-dom';
import { Vendor } from '@/app/lib/definitions';
import { generateReport, formatDateToLocal } from '@/app/lib/utils';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

export default function EditVendorForm({
  vendor,
  totalProducts
}: {
  vendor: Vendor;
  totalProducts: String;
}) {
  const initialState = { errorMessage: '', errors: {}};
  const updateVendorWithId = updateVendor.bind(null, vendor.id);
  const [state, dispatch] = useFormState(updateVendorWithId, initialState);

  const deleteVendorHandler = () => {
    if (confirm("Are you sure you want to delete this vendor? All the associated products will be removed as well."))
      deleteVendor(vendor.id);
  }

  async function generateVendorReport() {
    await generateReport(vendor);
  }

  return (
    <form action={dispatch}>
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
                defaultValue={vendor.name}
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

      <div className="mb-4">
        <label htmlFor="amount" className="mb-2 block text-sm font-medium">
          Total Products In Inventory
        </label>
        <div className="relative mt-2 rounded-md">
          <div className="relative">
            <input
              id="updatedAt"
              name="updatedAt"
              type="text"
              defaultValue={totalProducts.toString()}
              className="peer block w-full rounded-md border py-2 text-sm outline-2 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200"
              readOnly
              disabled
            />
          </div>
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="amount" className="mb-2 block text-sm font-medium">
          Created At
        </label>
        <div className="relative mt-2 rounded-md">
          <div className="relative">
            <input
              id="createdAt"
              name="createdAt"
              type="text"
              defaultValue={formatDateToLocal(vendor.created_at)}
              className="peer block w-full rounded-md border py-2 text-sm outline-2 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200"
              readOnly
              disabled
            />
          </div>
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="amount" className="mb-2 block text-sm font-medium">
          Updated At
        </label>
        <div className="relative mt-2 rounded-md">
          <div className="relative">
            <input
              id="updatedAt"
              name="updatedAt"
              type="text"
              defaultValue={formatDateToLocal(vendor.updated_at)}
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
        
      </div>
      <div className="mt-6 flex justify-between gap-4">
        <Button type="button" onClick={deleteVendorHandler} className="flex bg-red-500 hover:bg-red-400 focus:bg-red-600 active:bg-red-600">
            Delete Vendor
        </Button>
        <div className="flex">
          <Link
            href="/dashboard/vendors"
            className="flex mx-2 h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
          >
            Cancel
          </Link>
          <Button type="button" onClick={generateVendorReport} className="flex bg-blue-400 hover:bg-blue-500 focus:bg-blue-600 active:bg-blue-600 mr-2">
            Generate Report
          </Button>
          <Button type="submit">Edit Vendor</Button>
        </div>

      </div>
    </form>
  );
}