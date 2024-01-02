import { lusitana } from '@/app/ui/fonts';
import Search from '@/app/ui/search';
import Table from '@/app/ui/products/table';
import Pagination from '@/app/ui/products/pagination';
import { CreateProduct } from '@/app/ui/products/buttons';
import { fetchProductsPages } from '@/app/lib/data/product-data';
import { accessLevel } from '@/app/lib/utils';
import { auth } from '@/auth';
import { fetchUser } from '@/app/lib/data/user-data';

export default async function Page({
    searchParams,
  }: {
    searchParams?: {
      query?: string;
      page?: string;
    }
  }) {
    const query = searchParams?.query || '';
    const currentPage = Number(searchParams?.page) || 1;
    const totalPages = await fetchProductsPages(query);
    const session = await auth();
    const user = await fetchUser(session?.user?.name);
    
    return (
      <div className="w-full">
        <div className="flex w-full items-center justify-between">
          <h1 className={`${lusitana.className} text-2xl`}>Products</h1>
        </div>
        <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
          <Search placeholder="Search products..." />
          {
            user?.access === accessLevel.ADMIN
            &&
            <CreateProduct />
          }
        </div>
         {/* <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}> */}
          <Table query={query} currentPage={currentPage} />
        {/* </Suspense> */}
        <div className="mt-5 flex w-full justify-center">
          <Pagination totalPages={totalPages} />
        </div>
      </div>
    );
  }