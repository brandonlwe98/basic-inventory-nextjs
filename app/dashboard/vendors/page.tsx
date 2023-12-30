import { ArrowPathIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import Image from 'next/image';
import { lusitana } from '@/app/ui/fonts';
import { fetchVendorsPages } from '@/app/lib/data/vendor-data';
import Search from '@/app/ui/search';
import { CreateVendor } from '@/app/ui/vendors/buttons';
import Table from '@/app/ui/vendors/table';
import Pagination from '@/app/ui/vendors/pagination';

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
  
    const totalPages = await fetchVendorsPages(query);
  
    return (
      <div className="w-full">
        <div className="flex w-full items-center justify-between">
          <h1 className={`${lusitana.className} text-2xl`}>Vendors</h1>
        </div>
        <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
          <Search placeholder="Search vendors..." />
          <CreateVendor />
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