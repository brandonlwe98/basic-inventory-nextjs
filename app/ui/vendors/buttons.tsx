import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { deleteVendor } from '@/app/lib/actions/vendor-actions';

export function CreateVendor() {
  return (
    <Link
      href="/dashboard/vendors/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Create Vendor</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateVendor({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/vendors/${id}/edit`}
      className="rounded-md border p-2 hover:bg-blue-300 bg-blue-500 text-white"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function DeleteVendor({ id }: { id: string }) {
  const deleteVendorWithId = deleteVendor.bind(null, id);

  return (
    <form action={deleteVendorWithId}>
      <button className="rounded-md border p-2 hover:bg-gray-100">
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-5" />
      </button>
    </form>
  );
}
