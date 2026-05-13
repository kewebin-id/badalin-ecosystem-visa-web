'use client';

import { Button } from '@/components/atoms/button';
import { Card } from '@/components/atoms/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/atoms/sheet';
import { InputFile } from '@/components/molecules/input/file';
import { UserAvatar } from '@/components/molecules/user-avatar';
import { ITransaction } from '@/packages/pilgrim/transaction/domain/transaction';
import { useTransactionController } from '@/packages/pilgrim/transaction/presentation/controller';
import { formatDate } from '@/shared/utils';
import {
  AlertCircle,
  Bus,
  FileText,
  History as HistoryIcon,
  MessageCircle,
  Plane,
  Timer,
  XCircle,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useState } from 'react';

const BADALIN_CS_NUMBER = process.env.BADALIN_CS_NUMBER || '6281333737330';

interface DetailLogisticsTabProps {
  transaction: ITransaction;
}

export const DetailLogisticsTab = ({ transaction }: DetailLogisticsTabProps) => {
  const t = useTranslations('VisaTransaction');
  const tPilgrim = useTranslations('PilgrimManagement');
  const { handleDownloadAllVisas, isDownloading } = useTransactionController();
  const [selectedMember, setSelectedMember] = useState<(typeof transaction.members)[0] | null>(
    null,
  );

  const allDocuments = [
    ...(transaction.flights?.flatMap((f) =>
      (f.imageUrls || [])
        .concat(
          (f as unknown as Record<string, unknown>).imageUrl
            ? [(f as unknown as Record<string, unknown>).imageUrl as string]
            : [],
        )
        .map((url) => ({
          url,
          label: f.type,
        })),
    ) || []),
    ...(transaction.hotels?.flatMap((h) =>
      (h.imageUrls || [])
        .concat(
          (h as unknown as Record<string, unknown>).imageUrl
            ? [(h as unknown as Record<string, unknown>).imageUrl as string]
            : [],
        )
        .map((url) => ({
          url,
          label: h.city,
        })),
    ) || []),
    ...(transaction.transportations?.flatMap((tr) =>
      (tr.imageUrls || [])
        .concat(
          (tr as unknown as Record<string, unknown>).imageUrl
            ? [(tr as unknown as Record<string, unknown>).imageUrl as string]
            : [],
        )
        .map((url) => ({
          url,
          label: tr.type,
        })),
    ) || []),
    ...(transaction.paymentProofUrl
      ? [{ url: transaction.paymentProofUrl, label: 'PAYMENT_PROOF' }]
      : []),
  ].filter((doc) => doc.url && typeof doc.url === 'string' && doc.url.startsWith('http'));

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Pilgrim List Section */}
      {transaction.members && transaction.members.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary-default">
              {t('detail.pilgrimListHeader')}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {transaction.members.map((member) => (
              <Card
                key={member.id}
                onClick={() => setSelectedMember(member)}
                className={`bg-white border shadow-sm rounded-3xl overflow-hidden transition-all hover:shadow-md group cursor-pointer active:scale-95 flex flex-col ${
                  member.isEligible === false && transaction.paymentStatus === 'COMPLETED'
                    ? 'border-danger-500'
                    : 'border-gray-100 hover:border-primary-default/20'
                }`}
              >
                <div className="p-5 flex items-center gap-4">
                  <div className="size-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-primary-default group-hover:text-white transition-all shadow-inner overflow-hidden border border-gray-100/50">
                    <UserAvatar
                      name={member.fullName}
                      src={member.photoUrl}
                      seed={member.id}
                      className="size-full"
                      fallbackClassName="text-sm rounded-none"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-black text-foreground truncate">{member.fullName}</p>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-0.5">
                      {tPilgrim(`relations.${member.relation}`)} • {member.passportNumber}
                    </p>
                  </div>
                </div>

                {member.isEligible === false && transaction.paymentStatus === 'COMPLETED' && (
                  <div className="bg-danger-50 border-t border-danger-100 p-3 px-5 flex items-center gap-3">
                    <XCircle className="size-4 text-danger-500 shrink-0" />
                    <p className="text-[10px] font-bold text-danger-600 truncate flex-1 uppercase tracking-tight">
                      {t('detail.rejectionBanner', {
                        reason: member.rejectionReason || t('detail.checkDetail'),
                      })}
                    </p>
                    <AlertCircle className="size-3 text-danger-400" />
                  </div>
                )}
              </Card>
            ))}
          </div>

          <Sheet open={!!selectedMember} onOpenChange={(open) => !open && setSelectedMember(null)}>
            <SheetContent className="overflow-y-auto w-full sm:max-w-md p-0 border-0">
              <div className="h-32 bg-primary-default/5 w-full absolute top-0 -z-1" />
              <SheetHeader className="p-6 pb-0">
                <SheetTitle className="sr-only">Detail Jamaah</SheetTitle>
                <div className="flex flex-col items-center text-center mt-4">
                  <div className="size-24 rounded-[2rem] border-4 border-white shadow-xl overflow-hidden bg-white mb-4">
                    <UserAvatar
                      name={selectedMember?.fullName || ''}
                      src={selectedMember?.photoUrl}
                      seed={selectedMember?.id}
                      className="size-full"
                      fallbackClassName="text-3xl rounded-none"
                    />
                  </div>
                  <h3 className="text-xl font-black text-foreground">{selectedMember?.fullName}</h3>
                  <p className="text-xs font-bold text-primary-default uppercase tracking-widest mt-1">
                    {selectedMember?.relation && tPilgrim(`relations.${selectedMember.relation}`)}
                  </p>
                </div>
              </SheetHeader>

              <div className="p-6 space-y-8">
                {/* Rejection Alert */}
                {selectedMember?.isEligible === false &&
                  transaction.paymentStatus === 'COMPLETED' && (
                    <div className="bg-danger-50 border border-danger-100 rounded-3xl p-5 space-y-4">
                      <div className="flex items-start gap-3 text-danger-600">
                        <AlertCircle className="size-5 mt-0.5 shrink-0" />
                        <div className="space-y-1">
                          <p className="text-xs font-black uppercase tracking-wider">
                            {t('detail.rejectionTitle')}
                          </p>
                          <p className="text-sm font-medium leading-relaxed">
                            {selectedMember.rejectionReason || t('detail.rejectionDefaultReason')}
                          </p>
                        </div>
                      </div>

                      <Button
                        className="w-full bg-danger-600 hover:bg-danger-700 text-white rounded-2xl h-12 flex items-center gap-2"
                        onClick={() => {
                          const phone = transaction.agency?.phoneNumber || BADALIN_CS_NUMBER;
                          const message = `Halo, saya ${selectedMember.fullName}. Saya mendapatkan informasi bahwa pengajuan visa saya ditolak dengan alasan: ${selectedMember.rejectionReason || '-'}. Mohon bantuannya untuk proses perbaikan dokumen. Terima kasih.`;
                          window.open(
                            `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
                            '_blank',
                          );
                        }}
                      >
                        <MessageCircle className="size-4" />
                        {t('detail.contactSupport')}
                      </Button>
                    </div>
                  )}

                {/* Personal Info */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-50">
                    {tPilgrim('identitySection')}
                  </h4>
                  <div className="grid grid-cols-2 gap-6 bg-gray-50/50 p-5 rounded-3xl border border-gray-100">
                    <div className="space-y-1">
                      <p className="text-[9px] font-bold text-muted-foreground uppercase">
                        {tPilgrim('nikLabel')}
                      </p>
                      <p className="text-sm font-bold text-foreground">
                        {selectedMember?.nik || '-'}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[9px] font-bold text-muted-foreground uppercase">
                        {tPilgrim('gender')}
                      </p>
                      <p className="text-sm font-bold text-foreground">
                        {selectedMember?.gender || '-'}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[9px] font-bold text-muted-foreground uppercase">
                        {tPilgrim('birthDate')}
                      </p>
                      <p className="text-sm font-bold text-foreground">
                        {selectedMember?.birthDate ? formatDate(selectedMember.birthDate) : '-'}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[9px] font-bold text-muted-foreground uppercase">
                        {tPilgrim('maritalStatus')}
                      </p>
                      <p className="text-sm font-bold text-foreground">
                        {selectedMember?.maritalStatus || '-'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Passport Info */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-50">
                    {tPilgrim('travelDocument')}
                  </h4>
                  <div className="grid grid-cols-2 gap-6 bg-gray-50/50 p-5 rounded-3xl border border-gray-100">
                    <div className="space-y-1">
                      <p className="text-[9px] font-bold text-muted-foreground uppercase">
                        {tPilgrim('passportNumber')}
                      </p>
                      <p className="text-sm font-bold text-foreground">
                        {selectedMember?.passportNumber || '-'}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[9px] font-bold text-muted-foreground uppercase">
                        {tPilgrim('passportExpiry')}
                      </p>
                      <p className="text-sm font-bold text-foreground">
                        {selectedMember?.passportExpiry
                          ? formatDate(selectedMember.passportExpiry)
                          : '-'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Attachments */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-50">
                    {tPilgrim('documentPreview')}
                  </h4>
                  <div className="grid grid-cols-1 gap-4">
                    {selectedMember?.passportUrl && (
                      <InputFile
                        disabled
                        label={tPilgrim('passportPhoto')}
                        value={[{ name: 'Passport', base64: selectedMember.passportUrl }]}
                        onChange={() => {}}
                        maxSize={1}
                      />
                    )}
                    {selectedMember?.ktpUrl && (
                      <InputFile
                        disabled
                        label={tPilgrim('ktpPhoto')}
                        value={[{ name: 'KTP', base64: selectedMember.ktpUrl }]}
                        onChange={() => {}}
                        maxSize={1}
                      />
                    )}
                    {selectedMember?.employmentCertificateUrl && (
                      <InputFile
                        disabled
                        label={tPilgrim('employmentCertificate')}
                        value={[
                          {
                            name: tPilgrim('employmentCertificate'),
                            base64: selectedMember.employmentCertificateUrl,
                          },
                        ]}
                        onChange={() => {}}
                        maxSize={1}
                      />
                    )}
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {transaction.flights?.map((flight, idx) => (
          <div
            key={idx}
            className="bg-white border border-gray-100 shadow-sm rounded-3xl p-6 space-y-4 relative overflow-hidden group hover:border-primary-default/20 transition-all"
          >
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
              {flight.type === 'DEPARTURE' ? (
                <Plane className="size-16" />
              ) : (
                <HistoryIcon className="size-16" />
              )}
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-primary-default flex items-center gap-2">
              {flight.type === 'DEPARTURE' ? (
                <Plane className="size-3" />
              ) : (
                <HistoryIcon className="size-3" />
              )}
              {flight.type === 'DEPARTURE' ? t('form.departureSection') : t('form.returnSection')}
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase">
                  {t('form.carrier')}
                </p>
                <p className="text-sm font-bold text-foreground">{flight.carrier}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase">
                  {t('form.flightNo')}
                </p>
                <p className="text-sm font-bold text-foreground">{flight.flightNo}</p>
              </div>
              <div className="col-span-2 border-t border-gray-50 pt-4 grid grid-cols-3 gap-2">
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase">
                    {t('form.flightDate')}
                  </p>
                  <p className="text-[11px] font-black text-foreground">
                    {formatDate(flight.flightDate, 'DD MMM YYYY') || '—'}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase">ETA</p>
                  <p className="text-[11px] font-black text-foreground">
                    {formatDate(flight.eta, 'HH:mm') || '—'}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase">ETD</p>
                  <p className="text-[11px] font-black text-foreground">
                    {formatDate(flight.etd, 'HH:mm') || '—'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {transaction.hotels?.map((hotel) => (
          <div
            key={hotel.city}
            className="bg-white border border-gray-100 shadow-sm rounded-3xl p-6 space-y-3"
          >
            <p className="text-[10px] font-black uppercase tracking-widest text-primary-default">
              Hotel {hotel.city === 'MAKKAH' ? 'Makkah' : 'Madinah'}
            </p>
            <p className="text-sm font-bold text-foreground truncate">{hotel.name}</p>
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-50">
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase">Check-in</p>
                <p className="text-xs font-black text-foreground">
                  {formatDate(hotel.checkIn, 'DD MMM YYYY') || '—'}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase">Check-out</p>
                <p className="text-xs font-black text-foreground">
                  {formatDate(hotel.checkOut, 'DD MMM YYYY') || '—'}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {transaction.transportations && transaction.transportations.length > 0 && (
        <div className="space-y-4">
          <p className="text-xs font-black uppercase tracking-widest text-primary-default px-1">
            {t('detail.transport')}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {transaction.transportations.map((trans, idx) => (
              <div
                key={idx}
                className="bg-white border border-gray-100 shadow-sm rounded-3xl p-6 flex items-center gap-5"
              >
                <div className="size-12 rounded-2xl bg-primary-default/5 flex items-center justify-center text-primary-default shadow-[0_4px_12px_rgba(var(--primary-default-rgb),0.1)] shrink-0">
                  {trans.type === 'BUS' ? (
                    <Bus className="size-6" strokeWidth={1.5} />
                  ) : (
                    <Timer className="size-6" strokeWidth={1.5} />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-foreground truncate">
                    {trans.from} - {trans.to}
                  </p>
                  <p className="text-xs text-muted-foreground font-medium mt-0.5">
                    {trans.type} • {trans.company} • {formatDate(trans.time, 'HH:mm') || '-'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Uploaded Documents Section */}
      <div className="space-y-4 pt-4">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-primary-default px-1">
          {t('detail.uploadedDocuments')}
        </p>
        {allDocuments.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {allDocuments.map((doc, idx) => (
              <a
                key={idx}
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative aspect-square rounded-[2rem] overflow-hidden border border-gray-100 bg-gray-50 hover:border-primary-default/40 transition-all shadow-sm hover:shadow-xl"
              >
                <Image
                  src={doc.url}
                  alt={doc.label || 'Document preview'}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                  <p className="text-[10px] font-black text-white uppercase tracking-widest truncate">
                    {doc.label}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1 text-[8px] font-bold text-white/70">
                    <FileText className="size-2.5 text-primary-default" />
                    VIEW DOCUMENT
                  </div>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50/50 border border-dashed border-gray-200 rounded-[2.5rem] p-12 text-center">
            <div className="size-16 rounded-[1.5rem] bg-white shadow-sm flex items-center justify-center text-gray-300 mx-auto mb-4">
              <FileText className="size-8" strokeWidth={1} />
            </div>
            <p className="text-sm font-bold text-muted-foreground">{t('detail.noDocuments')}</p>
          </div>
        )}
      </div>
    </div>
  );
};
