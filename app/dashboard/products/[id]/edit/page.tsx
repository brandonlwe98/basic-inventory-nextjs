import Form from '@/app/ui/products/edit-form';
import Breadcrumbs from '@/app/ui/vendors/breadcrumbs';
import { fetchVendors } from '@/app/lib/data/vendor-data';
import { notFound } from 'next/navigation';
import { fetchProductById } from '@/app/lib/data/product-data';

export default async function Page({ params } : {params: { id: string }}) {
    const id = params.id;
    const [vendors, product] = await Promise.all([
        fetchVendors(),
        fetchProductById(id),
    ]);
    
    if (!product) {
        notFound();
    }
    
    return (
        <main>
            <Breadcrumbs
            breadcrumbs={[
                { label: 'Products', href: '/dashboard/products' },
                {
                label: 'Edit Product',
                href: `/dashboard/products/${id}/edit`,
                active: true,
                },
            ]}
            />
            <Form vendors={vendors} product={product} />
        </main>
    );
}