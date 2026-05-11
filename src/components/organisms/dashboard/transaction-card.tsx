import { Button } from '@/components/atoms/button';
import { ArrowRight, Building2, Calendar, FileCheck, Hash, Plane, Users } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { StatusBadge } from './status-badge';
import dayjs from 'dayjs';
import 'dayjs/locale/id';

import { IVisaHistory } from '@/packages/pilgrim/dashboard/domain';
import { getSeasonConfig } from '@/packages/pilgrim/dashboard/domain/utils';
import { getTransactionDisplayStatus } from '@/packages/pilgrim/transaction/domain/utils';
import { ROUTES } from '@/shared/constants';

interface TransactionCardProps {
  transaction: IVisaHistory;
}

export const TransactionCard = ({ transaction }: TransactionCardProps) => {
  const t = useTranslations('TransactionHistory');
  const tTrx = useTranslations('VisaTransaction');
  const locale = useLocale();
  const router = useRouter();

  const seasonConfig = getSeasonConfig(transaction, locale);
  const displayStatus = getTransactionDisplayStatus(transaction);

  const formatIDR = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    })
      .format(amount)
      .replace('Rp', 'Rp ');
  };

  const departureDateLong = dayjs(transaction.destinationDate)
    .locale(locale === 'id' ? 'id' : 'en')
    .format('dddd, D MMMM YYYY');

  const handleDetail = () => {
    router.push(
      `${ROUTES.PILGRIM.TRANSACTION.DETAIL}/${transaction.transactionId || transaction.id}`,
    );
  };

  const isIssued = transaction.status === 'ISSUED';

  return (
    <div className="bg-white/70 backdrop-blur-sm border border-white/60 rounded-[2rem] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-500 group relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary-default/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-primary-default/10 transition-colors" />

      <div className="flex justify-between items-start mb-6 relative z-10">
        <div className="flex flex-col gap-1">
          <h3
            className={`font-black text-lg tracking-tight group-hover:translate-x-1 transition-all duration-300 ${seasonConfig.themeColor.split(' ')[0]}`}
          >
            {seasonConfig.title}
          </h3>
          <div className="flex items-center gap-2 text-gray-400">
            <Users className="size-3" />
            <span className="text-[10px] font-bold uppercase tracking-wider">
              {transaction.memberCount === 1 ? 'Hanya Anda' : `${transaction.memberCount} Orang`}
            </span>
          </div>
        </div>
        <StatusBadge
          status={displayStatus.status}
          label={tTrx(displayStatus.labelKey as Parameters<typeof tTrx>[0])}
        />
      </div>

      <div className="space-y-3 relative z-10 mb-6">
        <div className="flex items-center gap-4 p-4 bg-gray-50/50 rounded-2xl border border-gray-100/50 group-hover:bg-white transition-colors">
          <div className={`p-2.5 rounded-xl shadow-sm ${seasonConfig.iconBg}`}>
            <Calendar className={`size-5 ${seasonConfig.iconColor}`} />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] text-gray-400 uppercase font-black tracking-widest">
              Keberangkatan
            </span>
            <span className="font-bold text-dark-900 text-sm truncate">{departureDateLong}</span>
          </div>
        </div>

        <div className="flex items-center gap-4 p-4 bg-gray-50/50 rounded-2xl border border-gray-100/50 group-hover:bg-white transition-colors">
          <div className="p-2.5 bg-gray-100 rounded-xl shadow-sm">
            <Plane className="size-5 text-gray-600" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] text-gray-400 uppercase font-black tracking-widest">
              Penerbangan
            </span>
            <span className="font-bold text-dark-900 text-sm truncate">
              {transaction.airlineName || 'Informasi Maskapai Menyusul'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 p-4 bg-gray-50/50 rounded-2xl border border-gray-100/50 group-hover:bg-white transition-colors">
          <div className="p-2.5 bg-gray-100 rounded-xl shadow-sm">
            <Building2 className="size-5 text-gray-600" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] text-gray-400 uppercase font-black tracking-widest">
              Akomodasi
            </span>
            <span className="font-bold text-dark-900 text-sm truncate">
              {transaction.hotelName || '-'} ({transaction.totalDays} Hari)
            </span>
          </div>
        </div>
      </div>

      <div className="pt-5 border-t border-gray-100 flex justify-between items-center relative z-10">
        <div className="flex flex-col">
          <div className="flex items-center gap-1 text-[10px] text-gray-400 uppercase font-black tracking-widest mb-0.5">
            <Hash className="size-2.5" />
            {transaction.transactionId?.split('-').pop()?.toUpperCase() ||
              transaction.id?.split('-').pop()?.toUpperCase()}
          </div>
          <span className={`text-xl font-black tracking-tighter ${seasonConfig.themeColor.split(' ')[0]}`}>
            {formatIDR(transaction?.totalAmount || transaction.invoiceAmount || 0)}
          </span>
        </div>
        <Button
          onClick={handleDetail}
          variant={isIssued ? 'success' : 'dark'}
          size="lg"
          className="w-fit !rounded-2xl text-xs font-black active:scale-95 flex items-center gap-2 group/btn"
        >
          {isIssued ? 'Lihat E-Visa' : t('detail')}
          {isIssued ? (
            <FileCheck className="size-4 group-hover/btn:scale-110 transition-transform" />
          ) : (
            <ArrowRight className="size-3.5 group-hover/btn:translate-x-1 transition-transform" />
          )}
        </Button>
      </div>
    </div>
  );
};
