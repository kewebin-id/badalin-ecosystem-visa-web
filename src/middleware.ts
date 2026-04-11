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

    const isAuthPage = pathname.startsWith('/auth/') || pathname.startsWith('/p/');

    // 2. Jika sudah login tapi masih di halaman Auth (Login/Forgot)
    if (token && isAuthPage) {
      let landing: string = ROUTES.PILGRIM.DASHBOARD;
      if (role === 'SUPERADMIN') landing = ROUTES.ADMIN.CONSOLE;
      if (role === 'PROVIDER') landing = ROUTES.PROVIDER.DASHBOARD;

      return NextResponse.redirect(new URL(landing, req.url));
    }

    // 3. Proteksi Route berdasarkan Role
    if (token) {
      // Console hanya untuk SUPERADMIN
      if (pathname.startsWith('/console') && role !== 'SUPERADMIN') {
        return NextResponse.redirect(new URL(ROUTES.PILGRIM.DASHBOARD, req.url));
      }

      // Provider hanya untuk PROVIDER
      if (pathname.startsWith('/provider') && role !== 'PROVIDER') {
        return NextResponse.redirect(new URL(ROUTES.PILGRIM.DASHBOARD, req.url));
      }

      // 4. FIX LOOP: Jangan redirect '/' kalau role-nya ADMIN tapi sudah di dashboard yang benar
      const pilgrimRoutes = ['/visa', '/billing', '/family', '/transactions']; // Hapus '/' dari sini
      const isPilgrimRoute = pilgrimRoutes.some((route) => pathname.startsWith(route));

      // Jika Admin nyasar ke halaman Pilgrim, balikin ke Console
      if (
        (isPilgrimRoute || pathname === '/') &&
        role === 'SUPERADMIN' &&
        !pathname.startsWith('/console')
      ) {
        return NextResponse.redirect(new URL(ROUTES.ADMIN.CONSOLE, req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        // Halaman publik yang gak butuh token
        if (pathname.startsWith('/auth/') || pathname.startsWith('/public/')) return true;
        return !!token;
      },
    },
    pages: {
      signIn: '/auth/login', // Pastikan path ini bener sesuai ROUTES.AUTH.LOGIN
    },
  },
);

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js|.*\\.(?:svg|png|jpg|jpeg|gif|webp)).*)',
  ],
};
