'use client';

import { Button } from '@/components/atoms';
import { Car, Home, Search, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

const NotFoundPage = () => {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-primary-50 via-white to-ocean-50 p-6">
      <div className="relative w-full max-w-lg text-center space-y-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary-200/20 blur-3xl rounded-full -z-10" />

        <div className="flex justify-center">
          <div className="relative">
            <div className="p-6 bg-white rounded-3xl shadow-xl border border-gray-100 relative z-10">
              <Car className="h-20 w-20 text-primary-600 animate-pulse" />
            </div>
            <Sparkles className="h-8 w-8 text-primary-400 absolute -top-4 -right-4 animate-bounce" />
            <div className="absolute -bottom-2 -left-2 size-10 bg-ocean-100 rounded-full flex items-center justify-center border border-white shadow-sm">
              <Search className="size-5 text-ocean-600" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-7xl font-extrabold text-gray-900 tracking-tight">404</h1>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-800">Page Not Found</h2>
            <p className="text-gray-600 max-w-sm mx-auto">
              Oops! It looks like you've taken an unexpected detour. The page you're searching for
              doesn't exist or has been moved.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button variant="primary" size="lg" onClick={() => router.push('/')}>
            <Home className="size-5" />
            Back to Home
          </Button>
          <Button variant="transparent" size="lg" onClick={() => router.back()}>
            Go Back
          </Button>
        </div>

        <p className="text-sm text-gray-500 pt-8">
          Need help?{' '}
          <span className="text-primary-600 font-medium cursor-pointer hover:underline">
            Contact Support
          </span>
        </p>

        <div className="flex justify-center space-x-2 pt-4">
          {[0, 150, 300].map((delay) => (
            <div
              key={delay}
              className="w-2.5 h-2.5 bg-primary-400/40 rounded-full animate-bounce"
              style={{ animationDelay: `${delay}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
