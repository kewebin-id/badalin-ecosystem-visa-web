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
    default: 'Badalin | Portal Umrah Mandiri & Tracker Visa Digital No.1',
    template: '%s | Badalin',
  },
  description:
    'Urus Umrah Mandiri jadi lebih mudah, transparan, dan aman. Badalin menyediakan sistem tracker visa real-time, integrasi manifest digital, dan manajemen data jamaah berbasis OCR.',
  metadataBase: new URL('https://visa.badalin.com'),
  openGraph: {
    title: 'Badalin - Digitalisasi Umrah Mandiri End-to-End',
    description:
      'Solusi cerdas Umrah Mandiri. Pantau status visa, upload dokumen via OCR, dan kelola manifest grup jamaah dalam satu dashboard profesional.',
    url: 'https://visa.badalin.com',
    siteName: 'Badalin Global Digital',
    images: [
      {
        url: '/og-image.webp',
        width: 1200,
        height: 630,
        alt: 'Badalin - Portal Umrah Mandiri Digital',
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Badalin | Urus Umrah Mandiri Tanpa Ribet',
    description:
      'Platform Tracker Visa dan Manajemen Jamaah Umrah Mandiri dengan teknologi OCR dan transparansi penuh.',
    images: ['/og-image.webp'],
  },
  authors: [
    {
      name: 'Brilian Rachmad Nurwachidin',
      url: 'https://brilianrn.com',
    },
  ],
  publisher: 'Badalin',
  keywords: [
    'Umrah Mandiri',
    'Visa Umrah Digital',
    'Tracker Visa Umrah',
    'Badalin',
    'Aplikasi Umrah',
    'OCR Passport Umrah',
    'Manifest Umrah Digital',
    'Umrah DIY',
    'Portal Visa Umrah',
    'Haji Mandiri',
    'Manajemen Jamaah Digital',
    'Booking Visa Umrah Online',
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
