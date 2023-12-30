import Form from '@/app/ui/vendors/create-form';
import Breadcrumbs from '@/app/ui/vendors/breadcrumbs';
 
export default async function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Vendors', href: '/dashboard/vendors' },
          {
            label: 'Create Vendor',
            href: '/dashboard/vendors/create',
            active: true,
          },
        ]}
      />
      <Form />
    </main>
  );
}