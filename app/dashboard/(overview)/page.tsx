import { fetchCategories } from '@/app/lib/data/category-data';
import { Category } from '@/app/lib/definitions';
import { Card } from '@/app/ui/dashboard/cards';
import { lusitana } from '@/app/ui/fonts';
import Link from 'next/link';
import { Suspense, useEffect, useState } from 'react';
// import { LatestInvoicesSkeleton, RevenueChartSkeleton, CardsSkeleton } from '@/app/ui/skeletons';
// import CardWrapper from '@/app/ui/dashboard/cards';
export default async function Page() {
    const categories : Category[] = await fetchCategories();

    return (
        <main>
        <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
            Dashboard
        </h1>
        <div className="grid gap-6 grid-cols-2 lg:grid-cols-4">
            {
                categories?.map((category: Category) => (
                    <div>
                        <Link href={`/dashboard/vendors/category/${category.id}`}>
                            <Card categoryName={category.name} />
                        </Link>
                    </div>
                ))
            }
            </div>
        {/* <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Suspense fallback={<CardsSkeleton />}>
                <CardWrapper />
            </Suspense>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
            <Suspense fallback={<RevenueChartSkeleton />}>
                <RevenueChart />
            </Suspense>
            <Suspense fallback={<LatestInvoicesSkeleton/>}>
                <LatestInvoices />
            </Suspense>
        </div> */}
        </main>
    );
}