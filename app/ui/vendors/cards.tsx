import { UserGroupIcon } from '@heroicons/react/24/outline';

export function Card({ vendorName } : { vendorName: string}) {
  
  return (
    <div className="rounded-xl bg-blue-500 p-2 shadow-sm hover:bg-blue-400">
      <div className="flex p-4">
        <UserGroupIcon className="h-5 w-5 text-white" />
        <h3 className="ml-2 text-sm font-medium text-white">{vendorName}</h3>
      </div>
    </div>
  );
}
