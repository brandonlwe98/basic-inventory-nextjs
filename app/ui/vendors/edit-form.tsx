'use client';

import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { deleteVendor, generateReport, updateVendor } from '@/app/lib/actions/vendor-actions';
import { useFormState } from 'react-dom';
import { Category, Vendor } from '@/app/lib/definitions';
import { accessLevel, formatDateToLocal } from '@/app/lib/utils';
import { ArchiveBoxIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

export default function EditVendorForm({
  vendor,
  categories,
  totalProducts,
  userAccess,
}: {
  vendor: Vendor;
  categories: Category[];
  totalProducts: String;
  userAccess: String
}) {
  const initialState = { errorMessage: '', errors: {}};
  const updateVendorWithId = updateVendor.bind(null, vendor.id);
  const [state, dispatch] = useFormState(updateVendorWithId, initialState);

  const deleteVendorHandler = () => {
    if (confirm("Are you sure you want to delete this vendor? All the associated products will be removed as well."))
      deleteVendor(vendor.id)
  }

  async function generateVendorReport() {
    const res = await generateReport(vendor) // expect file on success
    .catch((err) => {
        if (err) {
          alert(`Failed to generate vendor report: ${err.message}`);
        }
    })

    if (res) { // if file, prompt user to download it
      let buffer = Buffer.from(res);
      let blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
      let url = URL.createObjectURL(blob);
      let link = document.createElement('a');
      link.href=url;
      link.setAttribute(
        'download',
        `${vendor.name}_Inventory_Report.xlsx`,
      );
      link.click();
    }
  }

  return (
    <form action={dispatch} id='formEditVendor'>
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
                className="peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200"
                aria-describedby='vendor-error'
                readOnly={
                  accessLevel.ADMIN === userAccess ? false : true
                }
                disabled={
                  accessLevel.ADMIN === userAccess ? false : true
                }
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
              defaultValue={vendor.category}
              aria-describedby='category-error'
              disabled={
                accessLevel.ADMIN === userAccess ? false : true
              }
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
                type="textarea"
                placeholder="Enter Vendor Address"
                className="peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500
                          disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200"
                aria-describedby='address-error'
                defaultValue={vendor.address || ''}
                disabled={
                  accessLevel.ADMIN === userAccess ? false : true
                }
              /> */}
              <textarea name='address' id='address' form='formEditVendor' 
                className='peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500
                disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 overflow-y-scroll'
                aria-describedby='address-error'
                defaultValue={vendor.address || ''}
                disabled={accessLevel.ADMIN === userAccess ? false : true}
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
                defaultValue={vendor.phone}
                disabled={
                  accessLevel.ADMIN === userAccess ? false : true
                }
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
            <div className="relative">
              <input
                id="salesman"
                name="salesman"
                type="text"
                placeholder="Enter Vendor Salesman"
                className="peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500
                          disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200"
                aria-describedby='salesman-error'
                defaultValue={vendor.salesman}
                disabled={
                  accessLevel.ADMIN === userAccess ? false : true
                }
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

        { /** {Total Products} */}
        <div className="mb-4">
          <label htmlFor="totalProducts" className="mb-2 block text-sm font-medium">
            Total Products In Inventory
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="totalProducts"
                name="totalProducts"
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
          <label htmlFor="createdAt" className="mb-2 block text-sm font-medium">
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
          <label htmlFor="updatedAt" className="mb-2 block text-sm font-medium">
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
        {
          userAccess && userAccess === 'administrator' ?
            <>
              <Button type="button" name="btnDelete" onClick={deleteVendorHandler} className="flex bg-red-500 hover:bg-red-400 focus:bg-red-600 active:bg-red-600">
                  Delete
              </Button>
              <div className="flex">
                <Link
                  href="/dashboard/vendors"
                  className="flex mx-2 h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
                >
                  Cancel
                </Link>
                <Button type="button" name="btnGenerateReport" onClick={generateVendorReport} className="flex bg-yellow-500 hover:bg-yellow-400 focus:bg-yellow-600 active:bg-yellow-600 mr-2">
                  Generate Report
                </Button>
                <Button type="submit">Edit</Button>
              </div>
            </>
          :
          <Link
          href="/dashboard/vendors"
          className="flex mx-2 h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
          >
            Cancel
          </Link>
        }

      </div>
    </form>
  );
}