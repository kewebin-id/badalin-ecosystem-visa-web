import { GlobalProvider, SessionProvider } from '@/shared/providers';
import '@/shared/styles/globals.css';
import '@/shared/styles/tailwind.css';
import 'moment/locale/id';
import type { Metadata, Viewport } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import { Geist } from 'next/font/google';
import { ReactNode } from 'react';

const geist = Geist({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  style: ['normal'],
  variable: '--font-geist',
});

export const viewport: Viewport = {
  themeColor: '#F57D28',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  title: {
    default: 'Badalin | Portal Umrah Mandiri & Tracker Visa Digital Terpercaya No.1',
    template: '%s | Badalin',
  },
  description:
    'Solusi cerdas Umrah Mandiri. Badalin menyediakan sistem tracker visa real-time, integrasi manifest digital, dan manajemen data jamaah berbasis OCR Paspor termurah dan terpercaya di Indonesia.',
  metadataBase: new URL('https://badalin.visa.com'),
  openGraph: {
    title: 'Badalin | Portal Umrah Mandiri & Tracker Visa Digital No.1 di Indonesia',
    description:
      'Digitalisasi Umrah Mandiri end-to-end. Pantau status visa real-time, upload dokumen via OCR, dan kelola manifest grup jamaah dalam satu dashboard profesional yang aman dan transparan.',
    url: 'https://badalin.visa.com',
    siteName: 'Badalin - Digitalisasi Umrah Mandiri',
    images: [
      {
        url: '/og-image.webp',
        width: 1200,
        height: 630,
        alt: 'Badalin - Portal Umrah Mandiri Digital & Tracker Visa No.1',
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Badalin | Urus Umrah Mandiri & Tracker Visa Tanpa Ribet',
    description:
      'Platform Tracker Visa dan Manajemen Jamaah Umrah Mandiri paling transparan dengan teknologi OCR Paspor otomatis.',
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
    nocache: false,
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'article:author': 'Brilian Rachmad Nurwachidin',
    'article:publisher': 'Badalin',
    'geo.region': 'ID-JI',
    'geo.placename': 'Sidoarjo, Jawa Timur, Indonesia',
    'geo.position': '-7.4478;112.7183',
    ICBM: '-7.4478, 112.7183',
  },
};

const RootLayout = async ({
  children,
}: Readonly<{
  children: ReactNode;
}>) => {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} className={geist.variable}>
      <body suppressHydrationWarning>
        <NextIntlClientProvider key={locale} locale={locale} messages={messages}>
          <SessionProvider>
            <GlobalProvider>{children}</GlobalProvider>
          </SessionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
};

export default RootLayout;
