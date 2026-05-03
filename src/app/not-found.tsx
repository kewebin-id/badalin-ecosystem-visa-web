'use client';

import { Button } from '@/components/atoms';
import { Home, Plane, Search, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

const NotFoundPage = () => {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-primary-50 via-white to-orange-50 p-6">
      <div className="relative w-full max-w-lg text-center space-y-10">
        {/* Decorative Background Blob */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary-200/20 blur-3xl rounded-full -z-10" />

        <div className="flex justify-center">
          <div className="relative">
            <div className="p-8 bg-white rounded-[2rem] shadow-2xl border border-primary-50 relative z-10 transition-transform hover:scale-105 duration-500">
              <Plane className="h-20 w-20 text-primary-600 -rotate-12 animate-pulse" />
            </div>
            <Sparkles className="h-8 w-8 text-yellow-400 absolute -top-4 -right-4 animate-bounce" />
            <div className="absolute -bottom-2 -left-2 size-12 bg-primary-100 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
              <Search className="size-6 text-primary-600" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="relative inline-block">
            <h1 className="text-8xl font-black text-primary-900 tracking-tighter opacity-10">404</h1>
            <h2 className="text-3xl font-bold text-gray-900 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full">
              Destination Not Found
            </h2>
          </div>
          <div className="space-y-3">
            <p className="text-gray-500 max-w-sm mx-auto text-lg leading-relaxed">
              Oops! It looks like your request has wandered off the map. The page you are looking
              for is either under maintenance or has moved to a new terminal.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            variant="primary"
            size="lg"
            className="px-8 shadow-lg shadow-primary-200"
            onClick={() => router.push('/')}
          >
            <Home className="size-5 mr-2" />
            Back to Dashboard
          </Button>
          <Button
            variant="transparent"
            size="lg"
            className="text-gray-600 hover:text-primary-600"
            onClick={() => router.back()}
          >
            Go Back
          </Button>
        </div>

        <div className="pt-12 border-t border-gray-100">
          <p className="text-sm text-gray-400">
            Need assistance with your visa?{' '}
            <span className="text-primary-600 font-semibold cursor-pointer hover:underline transition-all">
              Contact Support
            </span>
          </p>
        </div>

        {/* Animated Background Dots */}
        <div className="flex justify-center space-x-3 pt-6">
          {[0, 150, 300].map((delay) => (
            <div
              key={delay}
              className="w-2 h-2 bg-primary-300 rounded-full animate-bounce"
              style={{ animationDelay: `${delay}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
