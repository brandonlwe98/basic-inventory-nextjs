import Form from '@/app/ui/products/view-form';
import Breadcrumbs from '@/app/ui/vendors/breadcrumbs';
import { fetchVendorById, fetchVendors } from '@/app/lib/data/vendor-data';
import { notFound } from 'next/navigation';
import { fetchNextProductView, fetchPrevProductView, fetchProductById } from '@/app/lib/data/product-data';
import { auth } from '@/auth';
import { fetchUser } from '@/app/lib/data/user-data';
import { Product, Vendor } from '@/app/lib/definitions';
import Link from 'next/link';

export default async function Page(
    { searchParams, params } : 
    {searchParams: {   
            categoryId: string,
            categoryName: string,
            vendorId: string,
            vendorName: string 
        },
    params: { id: string }}) {
        
    const id = params.id; // product id
    const product : Product = await fetchProductById(id);
    const session = await auth();
    const user = await fetchUser(session?.user?.name);

    const nextProduct = await fetchNextProductView(id, product.vendor_id);
    const prevProduct = await fetchPrevProductView(id, product.vendor_id);

    if (!product) {
        notFound();
    }

    return (
        <main>
            <Breadcrumbs
            breadcrumbs={[
                { label: 'Vendors', href: '/dashboard/vendors' },
                {
                    label: searchParams.categoryName,
                    href: `/dashboard/vendors/category/${searchParams.categoryId}`,
                },
                {
                    label: searchParams.vendorName,
                    href: `/dashboard/vendors/${searchParams.vendorId}/products`,
                },
                {
                    label: product.name,
                    href: `/dashboard/products/${id}/view?categoryId=${searchParams.categoryId}&categoryName=${searchParams.categoryName}&vendorId=${searchParams.vendorId}&vendorName=${searchParams.vendorName}`,
                    active: true
                },
            ]}
            />
            <Form vendorName={searchParams.vendorName} product={product} userAccess={user?.access} />
            <div className='flex mt-2'>
                <Link
                    href={`/dashboard/products/${prevProduct?.id}/view?categoryId=${searchParams.categoryId}&categoryName=${searchParams.categoryName}&vendorId=${searchParams.vendorId}&vendorName=${searchParams.vendorName}`}
                    className={`flex mx-2 h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200 ${prevProduct ? '' : ' hidden'}`}
                >
                    Previous
                </Link>
                <Link
                    href={`/dashboard/products/${nextProduct?.id}/view?categoryId=${searchParams.categoryId}&categoryName=${searchParams.categoryName}&vendorId=${searchParams.vendorId}&vendorName=${searchParams.vendorName}`}
                    className={`flex mx-2 h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200  ${nextProduct ? '' : ' hidden'}`}
                >
                    Next
                </Link>
            </div>

        </main>
    );
}