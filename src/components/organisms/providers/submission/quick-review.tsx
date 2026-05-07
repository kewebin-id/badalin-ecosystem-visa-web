'use client';

import { Card } from '@/components/atoms';
import { ImageThumbnailList } from '@/components/molecules';
import { ISubmissionListItem } from '@/packages/provider/submissions/domain/response';
import { Hotel, Plane, Truck, Users, FileText, Smartphone } from 'lucide-react';
import moment from 'moment';

interface SubmissionQuickReviewProps {
  submission: ISubmissionListItem;
  onPreview: (image: { src: string; alt: string }) => void;
}

export const SubmissionQuickReview = ({ submission, onPreview }: SubmissionQuickReviewProps) => {
  const membersToShow = (submission.members || []).filter((m) => {
    const status = submission.resultSnapshot?.memberStatuses?.[m.id];
    if (status) return status.valid;
    return true;
  });

  return (
    <div className="space-y-6 py-4">
      {/* Summary Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 bg-blue-50 border-blue-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-blue-400 uppercase tracking-wider">Total Jamaah</p>
              <p className="text-lg font-black text-blue-900">{membersToShow.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-purple-50 border-purple-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
              <Smartphone className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-purple-400 uppercase tracking-wider">Kontak Leader</p>
              <p className="text-sm font-black text-purple-900">{submission.leader?.phoneNumber || '-'}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-orange-50 border-orange-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-orange-400 uppercase tracking-wider">Status Visa</p>
              <p className="text-sm font-black text-orange-900">{submission.verifyStatus || '-'}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Logistics Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest flex items-center gap-2">
          <Plane className="h-4 w-4" /> Logistik & Akomodasi
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Flights */}
          <div className="space-y-3">
            <p className="text-xs font-bold text-gray-400">Penerbangan</p>
            {submission.flights?.map((f, i) => (
              <div key={i} className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-sm font-bold text-gray-900">{f.carrier} ({f.flightNo})</p>
                <p className="text-xs text-gray-500">
                  {f.from || '-'} to {f.to || '-'} • {f.flightDate ? moment(f.flightDate).format('DD MMM YYYY') : '-'}
                </p>
                <p className="text-[10px] text-gray-400 uppercase font-bold">ETA: {f.eta} • ETD: {f.etd}</p>
                <ImageThumbnailList images={f.imageUrls} onPreview={onPreview} altPrefix="Tiket" />
              </div>
            ))}
          </div>

          {/* Hotels */}
          <div className="space-y-3">
            <p className="text-xs font-bold text-gray-400">Hotel</p>
            {submission.hotels?.map((h, i) => (
              <div key={i} className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-sm font-bold text-gray-900">{h.name} - {h.city}</p>
                <p className="text-xs text-gray-500">
                  In: {h.checkIn ? moment(h.checkIn).format('DD MMM') : '-'} • 
                  Out: {h.checkOut ? moment(h.checkOut).format('DD MMM') : '-'}
                </p>
                <ImageThumbnailList images={h.imageUrls} onPreview={onPreview} altPrefix="Voucher" />
              </div>
            ))}
          </div>
        </div>

        {/* Transport */}
        <div className="space-y-3">
          <p className="text-xs font-bold text-gray-400">Transportasi</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {submission.transportations?.map((t, i) => (
              <div key={i} className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-sm font-bold text-gray-900">{t.company} ({t.type})</p>
                <p className="text-xs text-gray-500">{t.date ? moment(t.date).format('DD MMM YYYY') : '-'} • {t.from} - {t.to}</p>
                <ImageThumbnailList images={t.imageUrls} onPreview={onPreview} altPrefix="Bukti" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Members Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest flex items-center gap-2">
          <Users className="h-4 w-4" /> Daftar Jamaah
        </h3>
        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-gray-50 text-gray-500 font-bold">
              <tr>
                <th className="p-3">Nama Lengkap</th>
                <th className="p-3">Passport</th>
                <th className="p-3">Dokumen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {membersToShow.map((m) => (
                <tr key={m.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-3">
                    <p className="font-bold text-gray-900">{m.fullName || '-'}</p>
                    <p className="text-xs text-gray-400">{m.relation || '-'}</p>
                  </td>
                  <td className="p-3">
                    <p className="font-mono text-xs">{m.passportNumber || '-'}</p>
                    <p className="text-[10px] text-gray-400">{m.nik || '-'}</p>
                  </td>
                  <td className="p-3">
                    <ImageThumbnailList 
                      images={[m.photoUrl, m.passportUrl, m.ktpUrl].filter(Boolean) as string[]} 
                      onPreview={onPreview} 
                      altPrefix={m.fullName || 'Jamaah'}
                      className="!mt-0"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
