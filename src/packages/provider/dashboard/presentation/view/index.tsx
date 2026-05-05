'use client';

import { Badge } from '@/components/atoms';
import { HeaderPageContent } from '@/components/molecules';
import { cn } from '@/shared/utils';
import { BadgeCheck, BarChart3, Clock, CreditCard, FileSearch, FileText } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useProviderDashboardController } from '../controller';
import { DashboardSkeleton } from './skeleton';

export const ProviderDashboardView = () => {
  const t = useTranslations('ProviderDashboard');
  const { useSummary } = useProviderDashboardController();
  const { data, isPending } = useSummary();

  const summary = data?.data;

  const defaultTrends = [
    { month: 'Okt', visas: 0 },
    { month: 'Nov', visas: 0 },
    { month: 'Des', visas: 0 },
    { month: 'Jan', visas: 0 },
    { month: 'Feb', visas: 0 },
    { month: 'Mar', visas: 0 },
  ];

  const trendsData = summary?.trends?.length ? summary.trends : defaultTrends;

  const stats = [
    {
      label: t('totalSubmissions'),
      value: summary?.stats?.totalSubmissions || 0,
      icon: FileText,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: t('pendingPayments'),
      value: summary?.stats?.pendingPayments || 0,
      icon: Clock,
      color: 'text-primary-default',
      bg: 'bg-primary-50',
    },
    {
      label: t('documentsInReview'),
      value: summary?.stats?.documentsInReview || 0,
      icon: FileSearch,
      color: 'text-primary-400',
      bg: 'bg-primary-50',
    },
    {
      label: t('issuedVisas'),
      value: summary?.stats?.issuedVisas || 0,
      icon: BadgeCheck,
      color: 'text-success-500',
      bg: 'bg-success-50',
    },
  ];

  const typeBadge = (type: string) => {
    switch (type) {
      case 'payment':
        return (
          <Badge className="bg-primary-50 text-primary-default border-0 text-[10px] py-0.5 px-2">
            {t('badges.payment')}
          </Badge>
        );
      case 'visa':
        return (
          <Badge className="bg-success-50 text-success-500 border-0 text-[10px] py-0.5 px-2">
            {t('badges.visa')}
          </Badge>
        );
      case 'manifest':
        return (
          <Badge className="bg-blue-50 text-blue-600 border-0 text-[10px] py-0.5 px-2">
            {t('badges.manifest')}
          </Badge>
        );
      default:
        return null;
    }
  };

  const CardWrapper = ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <div
      className={cn(
        'rounded-[1.25rem] border border-gray-100 shadow-sm bg-white overflow-hidden',
        className,
      )}
    >
      {children}
    </div>
  );

  const locale = useLocale();
  const formatStatus = (status: string) => {
    switch (status) {
      case 'IN_REVIEW':
        return t('badges.inReview');
      case 'VERIFIED':
        return t('badges.verified');
      case 'REJECTED':
        return t('badges.rejected');
      default:
        return status;
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return new Intl.DateTimeFormat(locale === 'id' ? 'id-ID' : 'en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    } catch (e) {
      return dateStr;
    }
  };

  if (isPending) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-8 w-full">
      <HeaderPageContent title={t('title')} subtitle={t('subtitle')} hideBack />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {stats.map((s) => (
          <CardWrapper
            key={s.label}
            className="p-6 hover:shadow-md transition-all duration-300 group"
          >
            <div className="flex items-center gap-4">
              <div
                className={`h-11 w-11 rounded-xl ${s.bg} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}
              >
                <s.icon className={`h-5 w-5 ${s.color}`} strokeWidth={1.5} />
              </div>
              <div className="flex flex-col">
                <p className="text-2xl font-bold text-gray-900 leading-tight tracking-tight">
                  {s.value}
                </p>
                <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">
                  {s.label}
                </p>
              </div>
            </div>
          </CardWrapper>
        ))}
      </div>

      {/* Main Content Grid - Using Flex for 2:1 ratio */}
      <div className="flex flex-col lg:flex-row gap-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 w-full items-stretch">
        {/* Bar Chart - 2/3 width */}
        <CardWrapper className="flex-[2] flex flex-col p-8 min-w-0">
          <div className="pb-4 border-b border-gray-50 flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-gray-400" strokeWidth={1.5} />
              {t('monthlyTrends')}
            </h3>
          </div>
          <div className="pt-8 flex-1">
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trendsData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis
                    dataKey="month"
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    dy={10}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    dx={-10}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #f1f5f9',
                      borderRadius: '0.75rem',
                      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                      fontSize: '11px',
                      padding: '12px',
                    }}
                    cursor={{ fill: '#f8fafc' }}
                  />
                  <Bar dataKey="visas" fill="#f57d28" radius={[4, 4, 0, 0]} barSize={52} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardWrapper>

        {/* Recent Activity - 1/3 width */}
        <CardWrapper className="flex-[1] flex flex-col p-8 min-w-0">
          <div className="pb-4 border-b border-gray-50 flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-gray-400" strokeWidth={1.5} />
              {t('recentActivity')}
            </h3>
          </div>
          <div className="pt-6 flex-1 space-y-5 overflow-y-auto custom-scrollbar">
            {summary?.activities?.map((a) => (
              <div
                key={a.id}
                className="flex items-start justify-between p-5 rounded-2xl bg-gray-50/50 border border-transparent hover:border-gray-100 hover:bg-white transition-all duration-300"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-bold text-gray-900 leading-relaxed truncate">
                    {a.description}
                  </p>
                  <p className="text-[11px] text-gray-500 mt-1 font-medium flex items-center gap-2">
                    <Badge className="bg-gray-100 text-gray-600 border-0 text-[9px] py-0 px-1.5 h-4">
                      {formatStatus(a.status)}
                    </Badge>
                  </p>
                  <p className="text-[10px] text-gray-400 mt-2 font-medium flex items-center gap-1">
                    <Clock className="size-3" />
                    {formatDate(a.timestamp)}
                  </p>
                </div>
                <div className="ml-3 shrink-0">{typeBadge(a.type)}</div>
              </div>
            ))}
            {(!summary?.activities || summary.activities.length === 0) && (
              <div className="h-full flex flex-col items-center justify-center text-center py-10 opacity-30">
                <div className="p-4 bg-gray-50 rounded-full mb-4">
                  <Clock className="size-8 text-gray-300" />
                </div>
                <p className="text-xs text-gray-500 font-medium">{t('noActivity')}</p>
              </div>
            )}
          </div>
        </CardWrapper>
      </div>
    </div>
  );
};
