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
import { ActionButton, DialogDrawer, InputTextarea } from '@/components/molecules';
import { InputFile, UploadFile } from '@/components/molecules/input/file';
import { IMember } from '@/packages/provider/submissions/domain/response';
import { useScreenSize } from '@/shared/hooks';
import { cn } from '@/shared/utils';
import { Book, Check, CreditCard, Users, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

interface DetailMemberValidationProps {
  members: IMember[];
  memberStatuses: Record<string, { valid: boolean; reason?: string }>;
  onToggleStatus: (memberId: string, reason?: string) => void;
  onPreview: (image: { src: string; alt: string } | null) => void;
  isVisaPhase?: boolean;
  visaFiles?: Record<string, UploadFile[]>;
  onVisaChange?: (memberId: string, files: UploadFile[]) => void;
}

export const DetailMemberValidation = ({
  members,
  memberStatuses,
  onToggleStatus,
  onPreview,
  isVisaPhase,
  visaFiles = {},
  onVisaChange,
}: DetailMemberValidationProps) => {
  const t = useTranslations('ProviderSubmissions.detail.member');
  const ts = useTranslations('ProviderSubmissions.detail.sections');
  const td = useTranslations('ProviderSubmissions.dialogs.review');
  const tq = useTranslations('ProviderSubmissions.quickReview');
  const { isMobile } = useScreenSize();

  const [rejectingMemberId, setRejectingMemberId] = useState<string | null>(null);
  const [rejectionReasonInput, setRejectionReasonInput] = useState('');

  const handleRejectSubmit = () => {
    if (rejectingMemberId) {
      onToggleStatus(rejectingMemberId, rejectionReasonInput);
      setRejectingMemberId(null);
      setRejectionReasonInput('');
    }
  };

  return (
    <Card className="overflow-hidden border-2 border-gray-100 shadow-sm transition-all hover:shadow-md">
      <div className="p-6 border-b border-gray-50 bg-gray-50/50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-xl">
            <Users className="h-5 w-5 text-blue-500" />
          </div>
          <h3 className="text-lg font-black text-gray-900 tracking-tight">
            {!isVisaPhase ? '2. ' : ''}
            {ts('member', { count: members.length })}
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
                  {isVisaPhase ? tq('documents') : t('table.verify')}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((member) => (
                <TableRow
                  key={member.id}
                  className={cn(
                    'transition-colors',
                    !isVisaPhase && memberStatuses[member.id]?.valid
                      ? 'bg-green-50/30 hover:bg-green-50/50'
                      : !isVisaPhase && memberStatuses[member.id]?.reason
                        ? 'bg-red-50/30 hover:bg-red-50/50'
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
                      {memberStatuses[member.id]?.reason && (
                        <p className="text-[10px] text-gray-500 italic font-medium mt-2">
                          Note: {memberStatuses[member.id]?.reason}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="py-5">
                    <div className="flex gap-2">
                      <ActionButton
                        image={member.passportUrl}
                        title={t('docs.passport')}
                        onClick={() =>
                          onPreview({
                            src: member.passportUrl || '',
                            alt: `Paspor ${member.fullName}`,
                          })
                        }
                      />
                      <ActionButton
                        image={member.ktpUrl}
                        title={t('docs.ktp')}
                        onClick={() =>
                          onPreview({
                            src: member.ktpUrl || '',
                            alt: `KTP ${member.fullName}`,
                          })
                        }
                      />
                      <ActionButton
                        image={member.photoUrl}
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
                    {isVisaPhase ? (
                      <div className="flex justify-end min-w-[220px]">
                        <InputFile
                          maxFiles={5}
                          value={visaFiles[member.id] || []}
                          onChange={(files) => onVisaChange?.(member.id, files)}
                          className="!w-fit"
                        />
                      </div>
                    ) : (
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => {
                            setRejectingMemberId(member.id);
                            setRejectionReasonInput(memberStatuses[member.id]?.reason || '');
                          }}
                          className={cn(
                            'inline-flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all active:scale-90 cursor-pointer',
                            memberStatuses[member.id]?.reason
                              ? 'bg-red-500 border-red-500 text-white shadow-lg shadow-red-100'
                              : 'bg-white border-gray-200 text-gray-300 hover:border-red-200 hover:text-red-400',
                          )}
                        >
                          <X className="h-5 w-5 stroke-[3px]" />
                        </button>
                        <button
                          onClick={() => onToggleStatus(member.id)}
                          className={cn(
                            'inline-flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all active:scale-90 cursor-pointer',
                            memberStatuses[member.id]?.valid
                              ? 'bg-green-500 border-green-500 text-white shadow-lg shadow-green-100'
                              : 'bg-white border-gray-200 text-gray-300 hover:border-green-200 hover:text-green-400',
                          )}
                        >
                          <Check className="h-6 w-6 stroke-[3px]" />
                        </button>
                      </div>
                    )}
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
                  !isVisaPhase && memberStatuses[member.id]?.valid
                    ? 'bg-green-50 border-green-200 shadow-sm'
                    : !isVisaPhase && memberStatuses[member.id]?.reason
                      ? 'bg-red-50 border-red-200 shadow-sm'
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
                    {memberStatuses[member.id]?.reason && (
                      <p className="text-[10px] text-red-500 italic font-medium mt-2">
                        Note: {memberStatuses[member.id]?.reason}
                      </p>
                    )}
                  </div>
                  {!isVisaPhase && (
                    <div className="flex flex-col gap-2">
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
                      <button
                        onClick={() => {
                          setRejectingMemberId(member.id);
                          setRejectionReasonInput(memberStatuses[member.id]?.reason || '');
                        }}
                        className={cn(
                          'flex h-12 w-12 items-center justify-center rounded-2xl border-2 transition-all active:scale-90 cursor-pointer',
                          memberStatuses[member.id]?.reason
                            ? 'bg-red-500 border-red-500 text-white shadow-lg shadow-red-200'
                            : 'bg-white border-gray-100 text-gray-200',
                        )}
                      >
                        <X className="h-7 w-7 stroke-[3px]" />
                      </button>
                    </div>
                  )}
                </div>

                {isVisaPhase && (
                  <div className="mb-4">
                    <InputFile
                      maxFiles={5}
                      value={visaFiles[member.id] || []}
                      onChange={(files) => onVisaChange?.(member.id, files)}
                    />
                  </div>
                )}

                <div className="grid grid-cols-3 gap-3">
                  <ActionButton
                    icon={Book}
                    label="PASPOR"
                    onClick={() =>
                      onPreview({
                        src: member.passportUrl || '',
                        alt: `Paspor ${member.fullName}`,
                      })
                    }
                  />
                  <ActionButton
                    icon={CreditCard}
                    label="KTP"
                    onClick={() =>
                      onPreview({
                        src: member.ktpUrl || '',
                        alt: `KTP ${member.fullName}`,
                      })
                    }
                  />
                  <ActionButton
                    image={member.photoUrl}
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

      <DialogDrawer
        open={!!rejectingMemberId}
        setOpen={(o) => !o && setRejectingMemberId(null)}
        title={td('title', { id: rejectingMemberId?.slice(0, 8) || '' })}
        description={td('description')}
        submitButton={td('reject')}
        onSubmit={handleRejectSubmit}
        onCancel={() => setRejectingMemberId(null)}
        disabledSubmitButton={!rejectionReasonInput.trim()}
      >
        <InputTextarea
          useLabelInside
          label={td('rejectionReasonLabel')}
          placeholder={td('rejectionReasonPlaceholder')}
          value={rejectionReasonInput}
          setValue={setRejectionReasonInput}
          className="min-h-[120px]"
        />
      </DialogDrawer>
    </Card>
  );
};
