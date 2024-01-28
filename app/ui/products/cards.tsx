import { Square3Stack3DIcon } from '@heroicons/react/24/outline';

export function Card({ productName } : { productName: string}) {
  
  return (
    <div className="rounded-xl bg-blue-500 p-2 shadow-sm hover:bg-blue-400">
      <div className="flex p-4">
        <Square3Stack3DIcon className="h-5 w-5 text-white" />
        <h3 className="ml-2 text-sm font-medium text-white">{productName}</h3>
      </div>
    </div>
  );
}
