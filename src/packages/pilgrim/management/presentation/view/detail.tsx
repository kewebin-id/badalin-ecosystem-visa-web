'use client';

import { Image } from '@/components/atoms';
import { StatusBadge } from '@/components/molecules/badge-status';
import { UserAvatar } from '@/components/molecules/user-avatar';
import { DialogDrawer } from '@/components/molecules/dialog-drawer';
import { MemberDetailSkeleton } from '@/components/organisms/pilgrim-management/skeleton/detail.skeleton';
import { Camera, CreditCard, Plane, User } from 'lucide-react';
import moment from 'moment';
import 'moment/locale/id';
import { useTranslations } from 'next-intl';
import { IFamilyMember } from '../../domain/member';

interface MemberDetailViewProps {
  member: IFamilyMember | null;
  isLoading?: boolean;
  isOpen: boolean;
  onClose: () => void;
}

export const MemberDetailView = ({ member, isLoading, isOpen, onClose }: MemberDetailViewProps) => {
  const t = useTranslations('PilgrimManagement');
  moment.locale('id');

  if (!member && !isLoading) return null;

  const formatDate = (date?: string) => {
    if (!date) return '—';
    return moment(date).format('DD MMMM yyyy');
  };

  const sections = [
    {
      title: t('personalIdentity'),
      icon: User,
      items: [
        { label: t('fullName'), value: member?.fullName },
        { label: t('relation'), value: member?.relation ? t(`relations.${member.relation}`) : '—' },
        { label: t('birthDate'), value: formatDate(member?.dob) },
        { label: t('gender'), value: member?.gender ? t(member.gender.toLowerCase()) : '—' },
        { label: t('maritalStatus'), value: member?.maritalStatus || '—' },
      ],
    },
    {
      title: t('travelDocument'),
      icon: Plane,
      items: [
        { label: t('passportNumber'), value: member?.passportNumber },
        { label: t('passportExpiry'), value: formatDate(member?.passportExpiry) },
      ],
    },
    {
      title: t('nationalIdentity'),
      icon: CreditCard,
      items: [{ label: t('nikLabel'), value: member?.nik }],
    },
  ];

  return (
    <DialogDrawer
      open={isOpen}
      setOpen={(open) => !open && onClose()}
      title={t('memberDetail')}
      onCancel={onClose}
    >
      <div className="space-y-8 pb-8 min-h-[300px]">
        {isLoading ? (
          <MemberDetailSkeleton />
        ) : (
          member && (
            <>
              <div className="flex flex-col items-center gap-4 py-4">
                <div className="relative">
                  <UserAvatar
                    name={member.fullName}
                    src={member.selfieUrl}
                    seed={member.id}
                    className="h-28 w-28 rounded-3xl border-4 border-white shadow-xl"
                    fallbackClassName="text-3xl rounded-3xl"
                  />
                  <div className="absolute -bottom-2 -right-2">
                    <StatusBadge
                      className="bg-white!"
                      status={member.isComplete ? 'approved' : 'pending'}
                    />
                  </div>
                </div>
                <div className="text-center">
                  <h2 className="text-xl font-bold text-foreground">{member.fullName}</h2>
                  <p className="text-sm text-muted-foreground font-medium">
                    {t(`relations.${member.relation}`)}
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                {sections.map((section) => (
                  <div key={section.title} className="space-y-3">
                    <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                      <section.icon size={16} className="text-primary-default" />
                      <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        {section.title}
                      </h3>
                    </div>
                    <div className="grid gap-3">
                      {section.items.map((item) => (
                        <div key={item.label} className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground">{item.label}</span>
                          <span className="font-semibold text-foreground">{item.value || '—'}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                  <Camera size={16} className="text-primary-default" />
                  <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    {t('documentPreview')}
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {member.passportUrl && (
                    <div className="aspect-3/2 rounded-xl overflow-hidden border border-gray-200 bg-gray-50 relative">
                      <Image
                        src={member.passportUrl}
                        alt="Passport"
                        width={200}
                        height={133}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-0 inset-x-0 bg-black/50 py-1 text-center">
                        <span className="text-[8px] text-white font-bold uppercase">Passport</span>
                      </div>
                    </div>
                  )}
                  {member.ktpUrl && (
                    <div className="aspect-3/2 rounded-xl overflow-hidden border border-gray-200 bg-gray-50 relative">
                      <Image
                        src={member.ktpUrl}
                        alt="KTP"
                        width={200}
                        height={133}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-0 inset-x-0 bg-black/50 py-1 text-center">
                        <span className="text-[8px] text-white font-bold uppercase">KTP</span>
                      </div>
                    </div>
                  )}
                  {member.bukuNikahUrl && (
                    <div className="aspect-3/2 rounded-xl overflow-hidden border border-gray-200 bg-gray-50 relative">
                      <Image
                        src={member.bukuNikahUrl}
                        alt="Buku Nikah"
                        width={200}
                        height={133}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-0 inset-x-0 bg-black/50 py-1 text-center">
                        <span className="text-[8px] text-white font-bold uppercase">
                          Buku Nikah
                        </span>
                      </div>
                    </div>
                  )}
                  {member.akteKelahiranUrl && (
                    <div className="aspect-3/2 rounded-xl overflow-hidden border border-gray-200 bg-gray-50 relative">
                      <Image
                        src={member.akteKelahiranUrl}
                        alt="Akte Kelahiran"
                        width={200}
                        height={133}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-0 inset-x-0 bg-black/50 py-1 text-center">
                        <span className="text-[8px] text-white font-bold uppercase">
                          Akte Kelahiran
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )
        )}
      </div>
    </DialogDrawer>
  );
};
