import Form from '@/app/ui/vendors/edit-form';
import Breadcrumbs from '@/app/ui/vendors/breadcrumbs';
import { fetchVendorById } from '@/app/lib/data/vendor-data';
import { notFound } from 'next/navigation';
import { getVendorProductCount } from '@/app/lib/actions/vendor-actions';

export default async function Page({ params } : {params: { id: string }}) {
    const id = params.id;
    const vendor = await fetchVendorById(id);
    const totalProducts = await getVendorProductCount(id);

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
            <Form vendor={vendor} totalProducts={totalProducts.toString()} />
        </main>
    );
}