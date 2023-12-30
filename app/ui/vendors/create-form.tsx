'use client';

import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { createVendor } from '@/app/lib/actions/vendor-actions';
import { useFormState } from 'react-dom';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

export default function Form() {
  const initialState = { errorMessage: '', errors: {}};
  const [state, dispatch] = useFormState(createVendor, initialState);

  return (
    <form action={dispatch}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        <div className="mb-4">
          <label htmlFor="amount" className="mb-2 block text-sm font-medium">
            Vendor's name
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
