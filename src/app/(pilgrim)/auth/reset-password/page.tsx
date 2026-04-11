import { ResetPasswordView } from '@/packages/pilgrim/auth/presentation/view';
import { Loader2 } from 'lucide-react';
import { Suspense } from 'react';

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
