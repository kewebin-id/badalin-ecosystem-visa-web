import { ROUTES } from '@/shared/constants/routes';
import { formatRupiah } from '@/shared/utils';
import { CalendarIcon, HashIcon, MapPinIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { StatusBadge } from './status-badge';

import { IVisaHistory } from '@/packages/pilgrim/dashboard/domain';

interface TransactionCardProps {
  transaction: IVisaHistory;
}

export const TransactionCard = ({ transaction }: TransactionCardProps) => {
  const t = useTranslations('TransactionHistory');
  const router = useRouter();
  const date = new Date(transaction.destination_date);
  const formattedDate =
    date instanceof Date && !isNaN(date.getTime())
      ? date.toLocaleDateString(t('locale'), { day: 'numeric', month: 'long', year: 'numeric' })
      : transaction.destination_date;

  const handleDetail = () => {
    router.push(`${ROUTES.PILGRIM.TRANSACTION.DETAIL}/${transaction.transaction_id}`);
  };

  return (
    <div className="bg-white/70 backdrop-blur-sm border border-white/60 rounded-[2rem] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-500 group relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary-default/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-primary-default/10 transition-colors" />

      <div className="flex justify-between items-start mb-6 relative z-10">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-gray-400 group-hover:text-primary-default transition-colors">
            <HashIcon className="size-3.5" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">
              {t('trxId')}: {transaction.transaction_id.split('-').pop()?.toUpperCase()}
            </span>
          </div>
          <h3 className="font-black text-dark-950 text-lg tracking-tight group-hover:translate-x-1 transition-transform">
            {transaction.flight_route.split('-')[0]} ✈️ {transaction.flight_route.split('-').pop()}
          </h3>
        </div>
        <StatusBadge status={transaction.status} />
      </div>

      <div className="space-y-4 relative z-10 mb-6">
        <div className="flex items-center gap-4 p-3 bg-gray-50/50 rounded-2xl border border-gray-100/50 group-hover:bg-white transition-colors">
          <div className="p-2.5 bg-primary-lighter rounded-xl shadow-sm">
            <MapPinIcon className="size-5 text-primary-default" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 uppercase font-black tracking-widest">
              {t('route')}
            </span>
            <span className="font-bold text-dark-900 text-sm">{transaction.flight_route}</span>
          </div>
        </div>

        <div className="flex items-center gap-4 p-3 bg-gray-50/50 rounded-2xl border border-gray-100/50 group-hover:bg-white transition-colors">
          <div className="p-2.5 bg-secondary-100 rounded-xl shadow-sm">
            <CalendarIcon className="size-5 text-secondary-600" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 uppercase font-black tracking-widest">
              {t('date')}
            </span>
            <span className="font-bold text-dark-900 text-sm">{formattedDate}</span>
          </div>
        </div>
      </div>

      <div className="pt-5 border-t border-gray-100 flex justify-between items-center relative z-10">
        <div className="flex flex-col">
          <span className="text-[10px] text-gray-400 uppercase font-black tracking-widest">
            {t('totalAmount')}
          </span>
          <span className="text-xl font-black text-primary-default tracking-tighter">
            {formatRupiah(transaction.total_amount)}
          </span>
        </div>
        <button
          onClick={handleDetail}
          className="px-5 py-2.5 bg-dark-950 text-white text-xs font-bold rounded-xl hover:bg-primary-default transition-all shadow-lg shadow-dark-950/10 active:scale-95"
        >
          {t('detail')}
        </button>
      </div>
    </div>
  );
};
