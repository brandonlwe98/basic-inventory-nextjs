import Form from '@/app/ui/vendors/edit-form';
import Breadcrumbs from '@/app/ui/vendors/breadcrumbs';
import { fetchVendorById } from '@/app/lib/data/vendor-data';
import { notFound } from 'next/navigation';
import { getVendorProductCount } from '@/app/lib/actions/vendor-actions';
import { auth } from '@/auth';
import { fetchUser } from '@/app/lib/data/user-data';
import { fetchCategories } from '@/app/lib/data/category-data';
import { Category } from '@/app/lib/definitions';

export default async function Page({ params } : {params: { id: string }}) {
    const id = params.id;
    const vendor = await fetchVendorById(id);
    const categories : Category[] = await fetchCategories();
    const totalProducts = await getVendorProductCount(id);
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
                label: 'Vendor Details',
                href: `/dashboard/vendors/${id}/view`,
                active: true,
                },
            ]}
            />
            <Form vendor={vendor} categories={categories} totalProducts={totalProducts.toString()} userAccess={user?.access} />
        </main>
    );
}