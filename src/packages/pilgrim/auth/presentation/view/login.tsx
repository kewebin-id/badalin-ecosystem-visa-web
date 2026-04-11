'use client';

import { LoginContent } from '@/components/organisms';
import { useAuth } from '@/shared/hooks';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Suspense, useEffect } from 'react';

export const LoginView = () => {
  const { user, isLoggedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn || user) {
      router.replace('/');
    }
  }, [isLoggedIn, user, router]);

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary-default" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
};
