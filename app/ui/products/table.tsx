import Image from 'next/image';
import { fetchFilteredProducts } from '@/app/lib/data/product-data';
import { DeleteProduct, UpdateProduct } from './buttons';
import { formatQuantity } from '@/app/lib/utils';

export default async function ProductsTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const products = await fetchFilteredProducts(query, currentPage);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {products?.map((product) => (
              <div
                key={product.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <p>{product.name}</p>
                    </div>
                    <p className="text-sm text-gray-500">{product.barcode}</p>
                  </div>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    {product.image_url &&
                      <Image
                        src={product.image_url}
                        className="mr-2"
                        width={35}
                        height={35}
                        alt={`${product.name} picture`}
                      />
                    }
                    <p className="text-xl font-medium">
                      {product.vendor_name}
                    </p>
                    <p className="text-xl font-medium">
                      {product.quantity}
                    </p>
                    <p>{product.unit}</p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <UpdateProduct id={product.id} />
                    {/* <DeleteProduct id={product.id} /> */}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Product Name
                </th>
                <th scope="col" className="px-4 py-5 font-medium">
                  Image
                </th>
                <th scope="col" className="px-4 py-5 font-medium">
                  Vendor
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Barcode
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Quantity
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Unit
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {products?.map((product) => (
                <tr
                  key={product.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <p>{product.name}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {product.image_url &&
                      <Image
                      src={product.image_url}
                      className=""
                      width={64}
                      height={64}
                      alt={`${product.name} picture`}
                    />}

                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {product.vendor_name}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {product.barcode}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatQuantity(product.quantity)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {product.unit}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateProduct id={product.id} />
                      {/* <DeleteProduct id={product.id} /> */}
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
