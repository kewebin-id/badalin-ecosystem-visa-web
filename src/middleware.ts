import { ROUTES } from '@/shared/constants/routes';
import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;

    // 1. Ambil role dengan lebih aman
    const rawRole = token?.role || (token?.user as any)?.role;
    const role = typeof rawRole === 'string' ? rawRole.toUpperCase() : null;

    // Helper untuk mengekstrak slug provider (segmen pertama jika bukan rute statis)
    const segments = pathname.split('/').filter(Boolean);
    const slug = segments[0];
    const isAuthPage = pathname.includes('/auth/');

    // 2. Proteksi Provider: Jika user belum login dan mengakses area dashboard provider
    // Misal: /nusantara-tour/dashboard atau /[slug]/transactions
    // Jika segmen kedua adalah dashboard atau modul provider lainnya
    const isProviderProtectedArea =
      segments.length >= 2 &&
      !isAuthPage &&
      (segments[1] === 'dashboard' ||
        ['transactions', 'submissions', 'family'].includes(segments[1]));

    if (!token && isProviderProtectedArea) {
      const loginUrl = new URL(`/${slug}/auth/login`, req.url);
      return NextResponse.redirect(loginUrl);
    }

    // 3. Jika sudah login tapi masih di halaman Auth (Login/Forgot)
    if (token && isAuthPage) {
      let landing: string = ROUTES.PILGRIM.DASHBOARD;
      if (role === 'SUPERADMIN') landing = ROUTES.ADMIN.CONSOLE;
      if (role === 'PROVIDER') {
        // Coba ambil slug dari token atau URL
        const userSlug = (token?.user as any)?.agency?.slug || slug || 'p';
        landing = ROUTES.PROVIDER.DASHBOARD(userSlug);
      }

      return NextResponse.redirect(new URL(landing, req.url));
    }

    // 4. Proteksi Route berdasarkan Role (setelah login)
    if (token) {
      // Console hanya untuk SUPERADMIN
      if (pathname.startsWith('/console') && role !== 'SUPERADMIN') {
        return NextResponse.redirect(new URL(ROUTES.PILGRIM.DASHBOARD, req.url));
      }

      // Provider area hanya untuk PROVIDER
      // Jika segmen pertama bukan statis dan bukan 'console'/'auth', asumsikan itu slug provider
      const isPotentialProviderPath =
        segments.length > 0 && !['console', 'auth', 'public', 'api'].includes(segments[0]);

      if (isPotentialProviderPath && role !== 'PROVIDER' && role !== 'SUPERADMIN') {
        return NextResponse.redirect(new URL(ROUTES.PILGRIM.DASHBOARD, req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        const segments = pathname.split('/').filter(Boolean);

        // Halaman publik yang gak butuh token
        if (pathname.startsWith('/auth/') || pathname.startsWith('/public/')) return true;

        // Semua halaman di /[slug]/auth/ adalah publik (Login, Setup, Forgot)
        if (segments.length >= 2 && segments[1] === 'auth') return true;

        // Biarkan middleware function menangani redirect untuk area provider agar slug tetap terjaga
        if (segments.length >= 2 && segments[1] === 'dashboard') return true;
        if (['transactions', 'submissions', 'family'].includes(segments[1])) return true;

        return !!token;
      },
    },
    pages: {
      signIn: '/auth/login',
    },
  },
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - manifest.json (PWA manifest)
     * - sw.js (Service worker)
     * - assets (public assets)
     */
    '/((?!api|_next/static|_next/image|assets|favicon.ico|manifest.json|sw.js|.*\\.(?:svg|png|jpg|jpeg|gif|webp)).*)',
  ],
};
