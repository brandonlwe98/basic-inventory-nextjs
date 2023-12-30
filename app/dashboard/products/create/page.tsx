import { fetchVendors } from '@/app/lib/data/vendor-data';
import Form from '@/app/ui/products/create-form';
import Breadcrumbs from '@/app/ui/vendors/breadcrumbs';
 
export default async function Page() {
  const vendors = await fetchVendors();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Products', href: '/dashboard/products' },
          {
            label: 'Create Product',
            href: '/dashboard/products/create',
            active: true,
          },
        ]}
      />
      <Form vendors={vendors}/>
    </main>
  );
}