import { UpdateVendor } from '@/app/ui/vendors/buttons';
import { fetchFilteredVendors } from '@/app/lib/data/vendor-data';
import { formatDateToLocal } from '@/app/lib/utils';
import { VendorField } from '@/app/lib/definitions';

export default async function VendorsTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const vendors = await fetchFilteredVendors(query, currentPage);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          {/** Mobile Responsive View */}
          <div className="md:hidden"> 
            {vendors?.map((vendor: VendorField) => (
              <div
                key={vendor.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4 text-2xl">
                  <div>
                    <div className="mb-2 flex items-center">
                      <p>{vendor.name}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <p><b>Category</b>: {vendor.category}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <p><b>Address</b>: {vendor.address}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <p><b>Phone</b>: {vendor.phone}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <p><b>Salesman</b>: {vendor.salesman}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <p><b>Updated</b>: {formatDateToLocal(vendor.updated_at)}</p>
                    </div>
                  </div>
                </div>
                {/* <div className="flex items-center justify-between pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <p><b>Created</b>: {formatDateToLocal(vendor.created_at)}</p>
                    </div>
                  </div>
                </div> */}
                <div className="flex w-full items-center justify-between pt-4">
                  <div className="flex justify-end gap-2">
                    <UpdateVendor id={vendor.id} />
                    {/* <DeleteVendor id={vendor.id} /> */}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-3 py-5 font-medium sm:pl-6">
                  Vendor
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Category
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Address
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Phone
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Salesman
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Updated At
                </th>
                {/* <th scope="col" className="px-3 py-5 font-medium">
                  Created At
                </th> */}
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {vendors?.map((vendor: VendorField) => (
                <tr
                  key={vendor.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <p>{vendor.name}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap py-3 pl-3 pr-3">
                    <p>{vendor.category}</p>
                  </td>
                  <td className="whitespace-wrap py-3 pl-3 pr-3" width='20%'>
                    <p>{vendor.address}</p>
                  </td>
                  <td className="whitespace-nowrap py-3 pl-3 pr-3">
                    <p>{vendor.phone}</p>
                  </td>
                  <td className="whitespace-nowrap py-3 pl-3 pr-3">
                    <p>{vendor.salesman}</p>
                  </td>
                  <td className="whitespace-wrap py-3 pl-3 pr-3">
                    <p>{formatDateToLocal(vendor.updated_at)}</p>
                  </td>
                  {/* <td className="whitespace-wrap py-3 pl-3 pr-3">
                    <p>{formatDateToLocal(vendor.created_at)}</p>
                  </td> */}
                  <td className="whitespace-nowrap py-3 pl-3 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateVendor id={vendor.id} />
                      {/* <DeleteVendor id={vendor.id} /> */}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
