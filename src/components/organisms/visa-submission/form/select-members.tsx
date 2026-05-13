'use client';

import { Badge, Skeleton } from '@/components/atoms';
import { Button } from '@/components/atoms/button';
import { Checkbox } from '@/components/atoms/checkbox';
import { useManagementController } from '@/packages/pilgrim/management/presentation/controller';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { TWizardForm } from '@/packages/pilgrim/transaction/presentation/controller';

export const SelectMembersForm = () => {
  const t = useTranslations('VisaTransaction');
  const tDashboard = useTranslations('PilgrimManagement');
  const [page, setPage] = useState<number>(1);
  const limit = 6;

  const { useMembers } = useManagementController();
  const { members, pageCount, isLoading } = useMembers({ page, limit });

  const { watch, setValue, getValues } = useFormContext<TWizardForm>();
  const selectedIds = watch('pilgrimIds') || [];

  const allCompleteIds = useMemo(
    () => members.filter((m) => m.isComplete).map((m) => m.id),
    [members],
  );

  const isAllSelected = useMemo(() => {
    if (allCompleteIds.length === 0) return false;
    return allCompleteIds.every((id) => selectedIds.includes(id));
  }, [allCompleteIds, selectedIds]);

  const handleSelectAll = (checked: boolean) => {
    const current = getValues('pilgrimIds') || [];
    if (checked) {
      const newIds = Array.from(new Set([...current, ...allCompleteIds]));
      setValue('pilgrimIds', newIds, { shouldValidate: true });
    } else {
      const filtered = current.filter((id) => !allCompleteIds.includes(id));
      setValue('pilgrimIds', filtered, { shouldValidate: true });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground font-medium">{t('form.memberHelper')}</p>
        {!isLoading && members.length > 0 && (
          <label className="flex items-center gap-2 cursor-pointer group">
            <Checkbox checked={isAllSelected} onCheckedChange={handleSelectAll} />
            <span className="text-xs font-bold text-foreground group-hover:text-primary-default transition-colors">
              Pilih Semua (Yang Lengkap)
            </span>
          </label>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {isLoading ? (
          Array.from({ length: limit }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-2xl" />
          ))
        ) : members.length > 0 ? (
          members.map((m) => (
            <label
              key={m.id}
              title={!m.isComplete ? 'Data jamaah belum lengkap / Pilgrim data is incomplete' : ''}
              className={`flex items-center gap-4 p-4 rounded-2xl border transition-all relative overflow-hidden ${
                !m.isComplete
                  ? 'bg-gray-50 border-gray-100 opacity-60 cursor-not-allowed'
                  : selectedIds.includes(m.id)
                    ? 'border-primary-default bg-primary-default/5 shadow-sm cursor-pointer'
                    : 'border-gray-100 hover:border-gray-200 bg-white cursor-pointer'
              }`}
            >
              <Checkbox
                disabled={!m.isComplete}
                checked={selectedIds.includes(m.id)}
                onCheckedChange={(checked) => {
                  const current = getValues('pilgrimIds') || [];
                  if (checked) {
                    setValue('pilgrimIds', [...current, m.id], { shouldValidate: true });
                  } else {
                    setValue(
                      'pilgrimIds',
                      current.filter((id: string) => id !== m.id),
                      { shouldValidate: true },
                    );
                  }
                }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-foreground truncate">{m.fullName}</p>
                  {!m.isComplete && <Badge variant="destructive">Incomplete</Badge>}
                </div>
                <p className="text-xs text-muted-foreground font-medium">
                  {m.passportNumber} •{' '}
                  {tDashboard(`relations.${String(m.relation).toUpperCase() as 'SELF'}`)}
                </p>
              </div>
              {selectedIds[0] === m.id && <Badge variant="default">Lead</Badge>}
            </label>
          ))
        ) : (
          <div className="col-span-full py-10 flex flex-col items-center justify-center text-center bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
            <p className="text-sm font-bold text-foreground">{tDashboard('emptyTitle')}</p>
            <p className="text-xs text-muted-foreground mt-1">{tDashboard('emptyDescription')}</p>
          </div>
        )}
      </div>

      {pageCount > 1 && (
        <div className="flex items-center justify-center gap-4 pt-4">
          <Button
            variant="transparent"
            size="icon"
            onClick={() => setPage((p: number) => Math.max(1, p - 1))}
            disabled={page === 1}
            type="button"
          >
            <ChevronLeft className="size-4" />
          </Button>
          <span className="text-sm font-medium">
            {page} / {pageCount}
          </span>
          <Button
            variant="transparent"
            size="icon"
            onClick={() => setPage((p: number) => Math.min(pageCount, p + 1))}
            disabled={page === pageCount}
            type="button"
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      )}
    </div>
  );
};
