import { ROUTES } from '@/shared/constants/routes';
import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

// Daftarkan semua root path menu jamaah di sini
const pilgrimBasePaths = ['transactions', 'family', 'pilgrim', 'profile', 'dashboard']; 

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;

    const rawRole = token?.role || (token?.user as any)?.role;
    const role = typeof rawRole === 'string' ? rawRole.toUpperCase() : null;

    const segments = pathname.split('/').filter(Boolean);
    const slug = segments[0];
    const isAuthPage = pathname.includes('/auth/');

    // 2. Proteksi Provider (Unauthenticated)
    const isProviderProtectedArea =
      segments.length >= 2 &&
      !isAuthPage &&
      (segments[1] === 'dashboard' ||
        ['transactions', 'submissions', 'family', 'settings'].includes(segments[1]));

    if (!token && isProviderProtectedArea) {
      const loginUrl = new URL(`/${slug}/auth/login`, req.url);
      return NextResponse.redirect(loginUrl);
    }

    // 3. Auth Page Redirect (Authenticated)
    if (token && isAuthPage) {
      let landing: string = ROUTES.PILGRIM.DASHBOARD;
      if (role === 'SUPERADMIN') landing = ROUTES.ADMIN.CONSOLE;
      if (role === 'PROVIDER') {
        const userSlug = (token?.user as any)?.agency?.slug || slug || 'p';
        landing = ROUTES.PROVIDER.DASHBOARD(userSlug);
      }
      return NextResponse.redirect(new URL(landing, req.url));
    }

    // 4. Proteksi Route berdasarkan Role (Authenticated)
    if (token) {
      if (pathname.startsWith('/console') && role !== 'SUPERADMIN') {
        return NextResponse.redirect(new URL(ROUTES.PILGRIM.DASHBOARD, req.url));
      }

      // FIX: Bypass pengecekan slug jika segment pertama adalah menu jamaah
      const isPotentialProviderPath =
        segments.length > 0 && 
        !['console', 'auth', 'public', 'api', ...pilgrimBasePaths].includes(segments[0]);

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

        if (pathname.startsWith('/auth/') || pathname.startsWith('/public/')) return true;
        if (segments.length >= 2 && segments[1] === 'auth') return true;

        // Biarkan request masuk ke middleware function untuk di-redirect ke login provider
        if (segments.length >= 2 && segments[1] === 'dashboard') return true;
        if (segments.length >= 2 && ['transactions', 'submissions', 'family', 'settings'].includes(segments[1])) return true;

        return !!token;
      },
    },
    pages: {
      signIn: '/auth/login',
    },
  }
);

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|assets|favicon.ico|manifest.json|sw.js|.*\\.(?:svg|png|jpg|jpeg|gif|webp)).*)',
  ],
};
