import Image from 'next/image';
import { fetchFilteredProducts } from '@/app/lib/data/product-data';
import { DeleteProduct, UpdateProduct } from './buttons';
import { formatQuantity } from '@/app/lib/utils';
import { ProductTable } from '@/app/lib/definitions';

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
          <div className="lg:hidden">
            {products?.map((product: ProductTable) => (
              <div
                key={product.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <p>{product.name}</p>
                    </div>
                    {/* <p className="text-sm text-gray-600">{product.category}</p> */}
                  </div>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    {product.image &&
                      <Image
                        src={product.image}
                        className="mr-2"
                        width={64}
                        height={64}
                        alt={`${product.name} picture`}
                      />
                    }
                    <p className="text-xl font-medium">
                      {product.vendor_name}
                    </p>
                    <p className="text-md font-light">
                      Item Code: {product.itemcode}
                    </p>
                    <p className="text-md font-light">
                      Bar Code: {product.barcode}
                    </p>
                    <p className="text-md font-light">
                      Size: {formatQuantity(product.size)}
                    </p>
                    <p className="text-md font-light">
                      Current Stock: {formatQuantity(product.stock)}
                      {/* Current Stock:
                      <input
                        id="stock"
                        name="stock"
                        type="number"
                        step="0.01"
                        placeholder="Enter Current Stock"
                        className="peer block rounded-md w-16 border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
                        aria-describedby='stock-error'
                        defaultValue={formatQuantity(product.stock)}
                      /> */}
                    </p>
                    <p className="text-md">{product.unit}</p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <UpdateProduct id={product.id} />
                    {/* <DeleteProduct id={product.id} /> */}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 lg:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Name
                </th>
                {/* <th scope="col" className="px-3 py-5 font-medium">
                  Category
                </th> */}
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
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {products?.map((product: ProductTable) => (
                <tr
                  key={product.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <p>{product.name}</p>
                    </div>
                  </td>
                  {/* <td className="whitespace-nowrap px-3 py-3">
                    {product.category}
                  </td> */}
                  <td className="whitespace-nowrap px-3 py-3">
                    {product.image &&
                      <Image
                        width={128}
                        height={128}
                        alt={`${product.name} Product`}
                        src={product.image}
                      />
                    }

                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {product.vendor_name}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {product.itemcode}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {product.barcode}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatQuantity(product.size)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {/* <input
                      id={`stock${product.id}`}
                      name="stock"
                      type="number"
                      step="0.01"
                      placeholder="Enter Current Stock"
                      className="peer block rounded-md w-16 border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
                      aria-describedby='stock-error'
                      defaultValue={formatQuantity(product.stock)}
                    /> */}
                    {formatQuantity(product.stock)}
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
