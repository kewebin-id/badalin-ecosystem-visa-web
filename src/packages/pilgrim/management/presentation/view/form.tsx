'use client';

import { Skeleton } from '@/components/atoms/skeleton';
import { HeaderPageContent } from '@/components/molecules';
import { useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import { useManagementController } from '../controller';
import { PilgrimCreateForm } from './pilgrim-create-form';
import { PilgrimUpdateForm } from './pilgrim-update-form';

const FormSkeleton = () => (
  <div className="mx-auto space-y-8 pb-20 animate-in fade-in duration-500">
    <Skeleton className="h-24 w-full rounded-3xl" />
    <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center gap-4">
      <Skeleton className="size-24 rounded-full" />
    </section>
    <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
      <Skeleton className="h-4 w-32" />
      <div className="grid md:grid-cols-2 gap-6">
        <Skeleton className="h-[200px] w-full rounded-2xl" />
        <Skeleton className="h-[200px] w-full rounded-2xl" />
      </div>
    </section>
    <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
      <Skeleton className="h-4 w-32" />
      <div className="grid md:grid-cols-2 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="h-14 w-full rounded-2xl" />
        ))}
      </div>
    </section>
  </div>
);

export const MemberFormView = () => {
  const t = useTranslations('PilgrimManagement');
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const { useMemberDetail } = useManagementController();
  const { data: detailRes, isPending: isLoadingDetail } = useMemberDetail(id);

  if (id && isLoadingDetail) {
    return <FormSkeleton />;
  }

  const initialData = detailRes?.data;

  return (
    <div className="mx-auto space-y-8 pb-20">
      <HeaderPageContent
        title={id ? t('editMember') : t('addMember')}
        subtitle={t('formSubtitle')}
        onBack={() => router.back()}
      />

      {id && initialData ? (
        <PilgrimUpdateForm id={id} initialData={initialData} />
      ) : (
        <PilgrimCreateForm />
      )}
    </div>
  );
};
