'use client';

import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/atoms';
import { ActionButton } from '@/components/molecules';
import { IMember } from '@/packages/provider/submissions/domain/response';
import { cn } from '@/shared/utils';
import { useScreenSize } from '@/shared/hooks';
import { Check, FileText, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface DetailMemberValidationProps {
  members: IMember[];
  memberStatuses: Record<string, { valid: boolean; reason?: string }>;
  onToggleStatus: (memberId: string) => void;
  onPreview: (image: { src: string; alt: string } | null) => void;
}

export const DetailMemberValidation = ({
  members,
  memberStatuses,
  onToggleStatus,
  onPreview,
}: DetailMemberValidationProps) => {
  const t = useTranslations('ProviderSubmissions.detail.member');
  const ts = useTranslations('ProviderSubmissions.detail.sections');
  const { isMobile } = useScreenSize();

  return (
    <Card className="overflow-hidden border-2 border-gray-100 shadow-sm transition-all hover:shadow-md">
      <div className="p-6 border-b border-gray-50 bg-gray-50/50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-xl">
            <Users className="h-5 w-5 text-blue-500" />
          </div>
          <h3 className="text-lg font-black text-gray-900 tracking-tight">
            2. {ts('member', { count: members.length })}
          </h3>
        </div>
      </div>
      <div className="p-0">
        {!isMobile ? (
          <Table>
            <TableHeader className="bg-gray-50/30">
              <TableRow>
                <TableHead className="pl-6 font-bold uppercase text-[10px] tracking-widest text-gray-400">
                  {t('table.data')}
                </TableHead>
                <TableHead className="font-bold uppercase text-[10px] tracking-widest text-gray-400">
                  {t('table.docs')}
                </TableHead>
                <TableHead className="pr-6 text-right font-bold uppercase text-[10px] tracking-widest text-gray-400">
                  {t('table.verify')}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((member) => (
                <TableRow
                  key={member.id}
                  className={cn(
                    'transition-colors',
                    memberStatuses[member.id]?.valid
                      ? 'bg-green-50/30 hover:bg-green-50/50'
                      : '',
                  )}
                >
                  <TableCell className="pl-6 py-5">
                    <div className="space-y-1">
                      <p className="font-black text-gray-900">{member.fullName}</p>
                      <p className="text-xs font-mono text-gray-400">
                        PASSPORT: {member.passportNumber}
                      </p>
                      <p className="text-xs text-gray-500 font-medium">
                        {member.relation} • {member.nik}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="py-5">
                    <div className="flex gap-2">
                      <ActionButton
                        icon={FileText}
                        title={t('docs.passport')}
                        onClick={() =>
                          onPreview({
                            src: member.passportUrl || '',
                            alt: `Paspor ${member.fullName}`,
                          })
                        }
                      />
                      <ActionButton
                        icon={FileText}
                        title={t('docs.ktp')}
                        onClick={() =>
                          onPreview({
                            src: member.ktpUrl || '',
                            alt: `KTP ${member.fullName}`,
                          })
                        }
                      />
                      <ActionButton
                        icon={FileText}
                        title={t('docs.photo')}
                        onClick={() =>
                          onPreview({
                            src: member.photoUrl || '',
                            alt: `Foto ${member.fullName}`,
                          })
                        }
                      />
                    </div>
                  </TableCell>
                  <TableCell className="pr-6 py-5 text-right">
                    <button
                      onClick={() => onToggleStatus(member.id)}
                      className={cn(
                        'inline-flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all active:scale-90 cursor-pointer',
                        memberStatuses[member.id]?.valid
                          ? 'bg-green-500 border-green-500 text-white shadow-lg shadow-green-100'
                          : 'bg-white border-gray-200 text-gray-300 hover:border-gray-300',
                      )}
                    >
                      <Check className="h-6 w-6 stroke-[3px]" />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="p-4 space-y-4">
            {members.map((member) => (
              <div
                key={member.id}
                className={cn(
                  'p-5 rounded-[1.5rem] border transition-all',
                  memberStatuses[member.id]?.valid
                    ? 'bg-green-50 border-green-200 shadow-sm'
                    : 'bg-white border-gray-100',
                )}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="space-y-1">
                    <p className="font-black text-gray-900 text-lg leading-tight">
                      {member.fullName}
                    </p>
                    <p className="text-xs font-mono text-gray-400 uppercase tracking-tighter">
                      PASSPORT: {member.passportNumber}
                    </p>
                    <p className="text-xs text-gray-500 font-bold bg-gray-100 px-2 py-0.5 rounded w-fit mt-1">
                      {member.relation.toUpperCase()}
                    </p>
                  </div>
                  <button
                    onClick={() => onToggleStatus(member.id)}
                    className={cn(
                      'flex h-12 w-12 items-center justify-center rounded-2xl border-2 transition-all active:scale-90 cursor-pointer',
                      memberStatuses[member.id]?.valid
                        ? 'bg-green-500 border-green-500 text-white shadow-lg shadow-green-200'
                        : 'bg-white border-gray-100 text-gray-200',
                    )}
                  >
                    <Check className="h-7 w-7 stroke-[3px]" />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <ActionButton
                    icon={FileText}
                    label="PASPOR"
                    onClick={() =>
                      onPreview({
                        src: member.passportUrl || '',
                        alt: `Paspor ${member.fullName}`,
                      })
                    }
                  />
                  <ActionButton
                    icon={FileText}
                    label="KTP"
                    onClick={() =>
                      onPreview({
                        src: member.ktpUrl || '',
                        alt: `KTP ${member.fullName}`,
                      })
                    }
                  />
                  <ActionButton
                    icon={FileText}
                    label="FOTO"
                    onClick={() =>
                      onPreview({
                        src: member.photoUrl || '',
                        alt: `Foto ${member.fullName}`,
                      })
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};
