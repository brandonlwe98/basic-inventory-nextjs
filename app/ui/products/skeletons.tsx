// Loading animation
const shimmer =
  'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent';

export function ProductTableRowSkeleton() {
  return (
    <tr className="w-full border-b border-gray-100 last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg">
      {/* Product Name */}
      <td className="relative overflow-hidden whitespace-nowrap py-3 pl-6 pr-3">
        <div className="flex items-center gap-3">
          {/* <div className="h-8 w-8 rounded-full bg-gray-100"></div> */}
          <div className="h-6 w-16 rounded bg-gray-100"></div>
        </div>
      </td>
      {/* Image */}
      <td className="whitespace-nowrap px-3 py-3">
        <div className="h-14 w-12 rounded bg-gray-100"></div>
      </td>
      {/* Vendor */}
      <td className="whitespace-nowrap px-3 py-3">
        <div className="h-6 w-24 rounded bg-gray-100"></div>
      </td>
      {/* Item Code */}
      <td className="whitespace-nowrap px-3 py-3">
        <div className="h-6 w-16 rounded bg-gray-100"></div>
      </td>
      {/* Barcode */}
      <td className="whitespace-nowrap px-3 py-3">
        <div className="h-6 w-16 rounded bg-gray-100"></div>
      </td>
      {/* Size */}
      <td className="whitespace-nowrap px-3 py-3">
        <div className="h-6 w-12 rounded bg-gray-100"></div>
      </td>
      {/* Cur. Stock */}
      <td className="whitespace-nowrap px-3 py-3">
        <div className="h-6 w-12 rounded bg-gray-100"></div>
      </td>
      {/* Unit */}
      <td className="whitespace-nowrap px-3 py-3">
        <div className="h-6 w-16 rounded bg-gray-100"></div>
      </td>
      {/* Actions */}
      <td className="whitespace-nowrap py-3 pl-6 pr-3">
        <div className="flex justify-end gap-3">
          <div className="h-[38px] w-[38px] rounded bg-gray-100"></div>
        </div>
      </td>
    </tr>
  );
}

export function ProductsMobileSkeleton() {
  return (
    <div className="mb-2 w-full rounded-md bg-white p-4">
      <div className="flex items-center justify-between border-b border-gray-100 pb-8">
        <div className="flex items-center">
          <div className="h-6 w-16 rounded bg-gray-100"></div>
        </div>
        <div className="h-6 w-16 rounded bg-gray-100"></div>
      </div>
      <div className="flex w-full items-center justify-between pt-4">
        <div>
          <div className="h-6 w-16 rounded bg-gray-100"></div>
          <div className="mt-2 h-6 w-24 rounded bg-gray-100"></div>
        </div>
        <div className="flex justify-end gap-2">
          <div className="h-10 w-10 rounded bg-gray-100"></div>
          <div className="h-10 w-10 rounded bg-gray-100"></div>
        </div>
      </div>
    </div>
  );
}

export function ProductsTableSkeleton() {
  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            <ProductsMobileSkeleton />
            <ProductsMobileSkeleton />
            <ProductsMobileSkeleton />
            <ProductsMobileSkeleton />
            <ProductsMobileSkeleton />
            <ProductsMobileSkeleton />
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Name
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Image
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Vendor
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Item Code
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Barcode
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Size
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Cur. Stock
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Unit
                </th>
                <th
                  scope="col"
                  className="relative pb-4 pl-3 pr-6 pt-2 sm:pr-6"
                >
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              <ProductTableRowSkeleton />
              <ProductTableRowSkeleton />
              <ProductTableRowSkeleton />
              <ProductTableRowSkeleton />
              <ProductTableRowSkeleton />
              <ProductTableRowSkeleton />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
