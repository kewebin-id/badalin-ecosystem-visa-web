import { ResetPasswordView } from '@/packages/pilgrim/auth/presentation/view';
import { Loader2 } from 'lucide-react';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Badalin | Atur Ulang Kata Sandi - Portal Umrah Mandiri',
  description:
    'Silakan masukkan kata sandi baru Anda untuk memulihkan akses ke portal Badalin dan sistem tracker visa digital.',
  metadataBase: new URL('https://visa.serbaserbiumroh.id'),
  alternates: {
    canonical: '/auth/reset-password',
  },
  openGraph: {
    title: 'Badalin | Form Atur Ulang Kata Sandi Digital',
    description:
      'Halaman pengaturan ulang kata sandi portal Badalin. Pastikan akun Anda aman dengan kata sandi baru yang kuat.',
    url: 'https://visa.serbaserbiumroh.id/auth/reset-password',
    siteName: 'Badalin - Portal Umrah Mandiri Digital',
    images: [
      {
        url: '/og-image.webp',
        width: 1200,
        height: 630,
        alt: 'Badalin - Digitalisasi Umrah Mandiri & Tracker Visa Digital',
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Badalin | Reset Kata Sandi Portal Umrah Mandiri',
    description:
      'Masukkan kata sandi baru Anda untuk kembali mengelola manifest jamaah dan visa umrah dengan aman.',
    images: ['/og-image.webp'],
  },
  authors: [
    {
      name: 'Kewebin Indonesia',
      url: 'https://kewebin.id',
    },
  ],
  publisher: 'Badalin',
  keywords: [
    'Atur Ulang Kata Sandi',
    'Reset Password',
    'Password Baru',
    'Badalin',
    'Portal Umrah',
    'Jakarta',
    'Jakarta Pusat',
    'Jakarta Selatan',
    'Jakarta Barat',
    'Jakarta Timur',
    'Jakarta Utara',
    'Surabaya',
    'Sidoarjo',
    'Gresik',
    'Malang',
    'Batu',
    'Pasuruan',
    'Probolinggo',
    'Jember',
    'Banyuwangi',
    'Madiun',
    'Kediri',
    'Blitar',
    'Mojokerto',
    'Jombang',
    'Tuban',
    'Lamongan',
    'Bojonegoro',
    'Bandung',
    'Bekasi',
    'Depok',
    'Tangerang',
    'Tangerang Selatan',
    'Bogor',
    'Cimahi',
    'Tasikmalaya',
    'Cirebon',
    'Semarang',
    'Solo',
    'Surakarta',
    'Yogyakarta',
    'Sleman',
    'Bantul',
    'Magelang',
    'Pekalongan',
    'Tegal',
    'Medan',
    'Deli Serdang',
    'Binjai',
    'Pematangsiantar',
    'Banda Aceh',
    'Lhokseumawe',
    'Palembang',
    'Pekanbaru',
    'Batam',
    'Tanjung Pinang',
    'Padang',
    'Bukittinggi',
    'Jambi',
    'Bengkulu',
    'Bandar Lampung',
    'Metro',
    'Pangkal Pinang',
    'Denpasar Bali',
    'Badung',
    'Mataram',
    'Lombok',
    'Kupang',
    'Makassar',
    'Maros',
    'Gowa',
    'Manado',
    'Kendari',
    'Palu',
    'Gorontalo',
    'Mamuju',
    'Banjarmasin',
    'Banjarbaru',
    'Balikpapan',
    'Samarinda',
    'Pontianak',
    'Palangkaraya',
    'Tarakan',
    'IKN Nusantara',
    'Ambon',
    'Ternate',
    'Jayapura',
    'Sorong',
    'Manokwari',
    'Merauke',
  ],
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

const ResetPasswordPage = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary-default" />
        </div>
      }
    >
      <ResetPasswordView />
    </Suspense>
  );
};

export default ResetPasswordPage;
