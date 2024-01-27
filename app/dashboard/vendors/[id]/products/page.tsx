import Form from '@/app/ui/vendors/edit-form';
import Breadcrumbs from '@/app/ui/vendors/breadcrumbs';
import { fetchVendorsByCategory, fetchVendorById } from '@/app/lib/data/vendor-data';
import { notFound } from 'next/navigation';
import { getVendorProductCount } from '@/app/lib/actions/vendor-actions';
import { auth } from '@/auth';
import { fetchUser } from '@/app/lib/data/user-data';
import { fetchCategory } from '@/app/lib/data/category-data';
import { Category, Product, Vendor } from '@/app/lib/definitions';
import Link from 'next/link';
import { Card } from '@/app/ui/vendors/cards';
import { fetchVendorProducts } from '@/app/lib/data/product-data';
import { lusitana } from '@/app/ui/fonts';

export default async function Page({ 
    params,
    searchParams,
 } : {
    params: { id: string },
    searchParams?: {
        query?: string;
        page?: string;
    }
}) {
    const id = params.id;
    const vendor : Vendor = await fetchVendorById(id);
    const categoryData : Category = await fetchCategory(vendor.category);
    const vendorProducts : Product[] = await fetchVendorProducts(vendor.id);

    const session = await auth();
    const user = await fetchUser(session?.user?.name);

    if (!vendor) {
        notFound();
    }
    
    return (
        <main>
            <Breadcrumbs
            breadcrumbs={[
                { label: 'Vendors', href: '/dashboard/vendors' },
                {
                    label: categoryData.name,
                    href: `/dashboard/vendors/category/${categoryData.id}`,
                },
                {
                    label: vendor.name,
                    href: `/dashboard/vendors/${id}/products/`,
                    active: true,
                },
            ]}
            />
            <div className="flex w-full items-center justify-between mb-2">
                <h1 className={`${lusitana.className} text-2xl`}>Products</h1>
            </div>
            <div className="grid gap-6 grid-cols-2">
            {
                vendorProducts?.map((product: Product) => (
                    <Link key={product.id} 
                        href={{
                            pathname: `/dashboard/products/${product.id}/view`,
                            query: {
                                categoryId : categoryData.id,
                                categoryName: categoryData.name,
                                vendorId: id,
                                vendorName: vendor.name
                            }
                            
                    }}>
                        <div className="text-white w-full">
                            <Card vendorName={product.name} />
                        </div>
                    </Link>
                ))
            }
            </div>
        </main>
    );
}