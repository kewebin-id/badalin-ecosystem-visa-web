import { NotificationCenterView } from '@/packages/notification/presentation/view';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pusat Notifikasi Jamaah | Badalin Portal',
  description:
    'Pantau seluruh notifikasi dan pembaruan penting mengenai status pengajuan visa dan riwayat jamaah Anda secara real-time di Badalin Portal.',
  metadataBase: new URL('https://visa.serbaserbiumroh.id'),
  alternates: {
    canonical: '/notifications',
  },
  openGraph: {
    title: 'Pusat Notifikasi Jamaah | Badalin Digital Portal',
    description:
      'Pusat informasi dan peringatan dini tentang progres dokumen serta konfirmasi pembayaran visa Umrah Mandiri Anda.',
    url: 'https://visa.serbaserbiumroh.id/notifications',
    siteName: 'Badalin - Portal Umrah Mandiri Digital',
    images: [
      {
        url: '/og-image.webp',
        width: 1200,
        height: 630,
        alt: 'Badalin Notifications - Pusat Notifikasi Jamaah',
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pusat Notifikasi Jamaah | Badalin',
    description: 'Selalu terupdate dengan progres dan status dokumen jamaah Anda.',
    images: ['/og-image.webp'],
  },
  authors: [
    {
      name: 'Brilian Rachmad Nurwachidin',
      url: 'https://brilianrachmad.vercel.app',
    },
  ],
  publisher: 'Badalin',
  robots: {
    index: false,
    follow: true,
    nocache: true,
  },
};

export default NotificationCenterView;
