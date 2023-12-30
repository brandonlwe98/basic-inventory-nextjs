import { lusitana } from '@/app/ui/fonts';

export default function CFreshLogo() {
  return (
    <div
      className={`${lusitana.className} flex flex-row items-center leading-none text-white`}
    >
      <p className="text-[24px]">C Fresh Inventory Management</p>
    </div>
  );
}
