import { Metadata } from 'next';
import { BackButton } from '@/components/atoms/back-button';

export const metadata: Metadata = {
  title: 'Badalin | Lupa Kata Sandi Portal Agensi',
  description: 'Atur ulang kata sandi portal Agensi Anda di sini.',
};

const ForgotPasswordPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl text-center">
        <h1 className="text-2xl font-bold mb-4">Lupa Kata Sandi Agensi</h1>
        <p className="text-gray-500 mb-6">
          Fitur pemulihan kata sandi untuk agensi ({slug}) sedang dalam pengembangan.
        </p>
        <BackButton className="text-primary-default font-semibold hover:underline">
          Kembali
        </BackButton>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
