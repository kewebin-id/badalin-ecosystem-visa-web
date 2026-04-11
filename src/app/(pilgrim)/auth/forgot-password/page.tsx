import { ForgotPasswordView } from '@/packages/pilgrim/auth/presentation/view';
import { Loader2 } from 'lucide-react';
import { Suspense } from 'react';

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
