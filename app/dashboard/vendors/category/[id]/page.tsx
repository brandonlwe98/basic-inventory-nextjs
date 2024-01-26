import Form from '@/app/ui/vendors/edit-form';
import Breadcrumbs from '@/app/ui/vendors/breadcrumbs';
import { fetchVendorsByCategory, fetchVendorById } from '@/app/lib/data/vendor-data';
import { notFound } from 'next/navigation';
import { getVendorProductCount } from '@/app/lib/actions/vendor-actions';
import { auth } from '@/auth';
import { fetchUser } from '@/app/lib/data/user-data';
import { fetchCategory } from '@/app/lib/data/category-data';
import { Category, Vendor } from '@/app/lib/definitions';
import Link from 'next/link';
import { Card } from '@/app/ui/vendors/cards';

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
    const categoryData : Category = await fetchCategory(id);
    const vendors : Vendor[] = await fetchVendorsByCategory(id);
    // const categories : Category[] = await fetchCategories();
    // const totalProducts = await getVendorProductCount(id);
    const session = await auth();
    const user = await fetchUser(session?.user?.name);

    if (!vendors) {
        notFound();
    }
    
    return (
        <main>
            <Breadcrumbs
            breadcrumbs={[
                { label: 'Vendors', href: '/dashboard/vendors' },
                {
                label: categoryData.name,
                href: `/dashboard/vendors/category/${id}`,
                active: true,
                },
            ]}
            />
            <div className="grid gap-6 grid-cols-2">
            {
                vendors?.map((vendor: Vendor) => (
                    <Link href={`/dashboard/vendors/${vendor.id}/view`}>
                        <div className="text-white w-full">
                            <Card vendorName={vendor.name} />
                        </div>
                    </Link>
                ))
            }
            </div>
        </main>
    );
}