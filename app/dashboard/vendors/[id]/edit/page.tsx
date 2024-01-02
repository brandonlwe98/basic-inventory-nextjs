import Form from '@/app/ui/vendors/edit-form';
import Breadcrumbs from '@/app/ui/vendors/breadcrumbs';
import { fetchVendorById } from '@/app/lib/data/vendor-data';
import { notFound } from 'next/navigation';
import { getVendorProductCount } from '@/app/lib/actions/vendor-actions';
import { auth } from '@/auth';
import { fetchUser } from '@/app/lib/data/user-data';

export default async function Page({ params } : {params: { id: string }}) {
    const id = params.id;
    const vendor = await fetchVendorById(id);
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
                label: 'Edit Vendor',
                href: `/dashboard/vendors/${id}/edit`,
                active: true,
                },
            ]}
            />
            <Form vendor={vendor} totalProducts={totalProducts.toString()} userAccess={user?.access} />
        </main>
    );
}