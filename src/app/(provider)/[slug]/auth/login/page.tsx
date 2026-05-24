import { ProviderLoginView } from '@/packages/provider/auth/presentation/view/login';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Portal Mitra Agensi Badalin | Tracking & Manajemen Visa Umrah Digital',
  description:
    'Portal khusus mitra agensi Badalin. Kelola pengajuan visa jamaah, verifikasi dokumen OCR, dan pantau status pembayaran secara real-time dalam satu dashboard profesional.',
  metadataBase: new URL('https://visa.serbaserbiumroh.id'),
  alternates: {
    canonical: '/p/auth/login',
  },
  openGraph: {
    title: 'Portal Mitra Agensi Badalin | Solusi Digital Manajemen Visa Umrah',
    description:
      'Masuk ke portal agensi untuk mengelola manifest jamaah dan tracking visa. Sistem mandiri, transparan, dan profesional untuk mitra terpercaya.',
    url: 'https://visa.serbaserbiumroh.id/p/auth/login',
    siteName: 'Badalin - Portal Mitra Agensi',
    images: [
      {
        url: '/og-image.webp',
        width: 1200,
        height: 630,
        alt: 'Badalin Provider Portal - Manajemen Visa Agensi',
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Portal Mitra Agensi Badalin | Tracking Visa Umrah Real-time',
    description:
      'Kelola semua pengajuan visa jamaah Anda dalam satu dashboard digital khusus mitra agensi.',
    images: ['/og-image.webp'],
  },
  authors: [
    {
      name: 'Brilian Rachmad Nurwachidin',
      url: 'https://brilianrachmad.vercel.app',
    },
  ],
  publisher: 'Badalin',
  keywords: [
    'Portal Agensi Badalin',
    'Provider Portal Badalin',
    'Manajemen Visa Agensi',
    'Tracking Visa Umrah Mitra',
    'Verifikasi Pembayaran Jamaah',
    'Dashboard Agensi Umrah',
    'Badalin untuk Mitra',
  ],
  robots: {
    index: false,
    follow: true,
    nocache: true,
  },
};

export default async function ProviderLoginPage({ params }: { params: Promise<{ slug: string }> }) {
  await params; // Ensure params are resolved though not directly used here
  return <ProviderLoginView />;
}
