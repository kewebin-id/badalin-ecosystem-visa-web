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
  const completeMembers = useMemo(() => members.filter((m) => m.isComplete), [members]);

  const { watch, setValue, getValues } = useFormContext<TWizardForm>();
  const selectedIds = watch('pilgrimIds') || [];

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground font-medium">{t('form.memberHelper')}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {isLoading ? (
          Array.from({ length: limit }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-2xl" />
          ))
        ) : completeMembers.length > 0 ? (
          completeMembers.map((m) => (
            <label
              key={m.id}
              className={`flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                selectedIds.includes(m.id)
                  ? 'border-primary-default bg-primary-default/5 shadow-sm'
                  : 'border-gray-100 hover:border-gray-200 bg-white'
              }`}
            >
              <Checkbox
                checked={selectedIds.includes(m.id)}
                onCheckedChange={(checked) => {
                  const current = getValues('pilgrimIds') || [];
                  if (checked) {
                    setValue('pilgrimIds', [...current, m.id], { shouldValidate: true });
                  } else {
                    setValue(
                      'pilgrimIds',
                      current.filter((id: string) => id !== m.id),
                      { shouldValidate: true }
                    );
                  }
                }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-foreground truncate">{m.fullName}</p>
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
