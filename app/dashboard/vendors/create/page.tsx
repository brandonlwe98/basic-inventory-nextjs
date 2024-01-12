import Form from '@/app/ui/vendors/create-form';
import Breadcrumbs from '@/app/ui/vendors/breadcrumbs';
import { fetchCategories } from '@/app/lib/data/category-data';
 
export default async function Page() {
  const categories = await fetchCategories();

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
      <Form categories={categories}/>
    </main>
  );
}