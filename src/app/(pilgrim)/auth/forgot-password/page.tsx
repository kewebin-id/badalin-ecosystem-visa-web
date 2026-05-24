import { ForgotPasswordView } from '@/packages/pilgrim/auth/presentation/view';
import { Loader2 } from 'lucide-react';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Badalin | Lupa Kata Sandi Portal Umrah Mandiri & Tracker Visa Digital',
  description:
    'Lupa kata sandi Anda? Atur ulang kata sandi portal Badalin Anda di sini untuk kembali mengakses sistem tracker visa real-time dan manajemen jamaah digital.',
  metadataBase: new URL('https://visa.serbaserbiumroh.id'),
  alternates: {
    canonical: '/auth/forgot-password',
  },
  openGraph: {
    title: 'Badalin | Atur Ulang Kata Sandi Portal Umrah Mandiri Digital',
    description:
      'Halaman pemulihan kata sandi portal Badalin. Masukkan detail Anda untuk mendapatkan akses kembali ke tracker visa Umrah dan manifest jamaah digital.',
    url: 'https://visa.serbaserbiumroh.id/auth/forgot-password',
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
    title: 'Badalin | Pemulihan Kata Sandi Portal Umrah Mandiri',
    description:
      'Atur ulang kata sandi Anda untuk mengakses platform Tracker Visa dan Manajemen Jamaah Umrah Mandiri yang paling transparan dan aman.',
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
    // Brand
    'Badalin',
    'Badalin Visa',
    'Badalin Umrah',

    // Specific to this page
    'Lupa Kata Sandi',
    'Reset Password',
    'Pemulihan Akun',
    'Lupa Password Badalin',

    // Core Services
    'Portal Visa Jamaah',
    'Portal Umrah Mandiri',
    'Tracker Visa Digital',
    'Visa Umrah Online',
    'Cek Status Visa Umrah',
    'Update Visa Umrah Real-time',
    'Sistem Tracker Visa No.1',
    'Effortlessly manage your Umrah',
    'Platform manajemen visa dan jamaah mandiri paling transparan dan aman',
    'Effortlessly',

    // Features
    'OCR Paspor Umrah',
    'Scan Paspor Digital',
    'Manajemen Jamaah Digital',
    'Manifest Umrah Otomatis',
    'Digitalisasi Dokumen Umrah',

    // Target Audience / Keywords
    'Jamaah Umrah',
    'Daftar Umrah Mandiri',
    'Umrah DIY',
    'Umrah Backpacker',
    'Umrah Tanpa Travel',
    'Umrah Hemat',
    'Umrah Murah Terpercaya',
    'Haji Mandiri Digital',

    // Locations
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

    // Performance/Quality
    'Harga Termurah',
    'Pelayanan Terbaik',
    'Transparan',
    'Aman',
    'Sistem Profesional',
    'Teknologi Terbaru',

    // General Search
    'Aplikasi Umrah Terbaik',
    'Platform Ibadah Digital',
    'Dashboard Jamaah Umrah',
  ],
  robots: {
    index: true,
    follow: true,
    nocache: true,
  },
  other: {
    'article:author': 'Brilian Rachmad Nurwachidin',
    'article:publisher': 'Badalin',
    'geo.region': 'ID-JI',
    'geo.placename': 'Sidoarjo, Jawa Timur, Indonesia',
    'geo.position': '-7.4478;112.7183',
    ICBM: '-7.4478, 112.7183',
  },
};

const ForgotPasswordPage = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary-default" />
        </div>
      }
    >
      <ForgotPasswordView />
    </Suspense>
  );
};

export default ForgotPasswordPage;
