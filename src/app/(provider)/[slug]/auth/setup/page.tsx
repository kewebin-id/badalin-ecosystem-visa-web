import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Badalin | Setup Profil Agensi',
  description: 'Inisialisasi profil agensi Anda di sini.',
};

const SetupPage = ({ params }: { params: { slug: string } }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl text-center">
        <h1 className="text-2xl font-bold mb-4">Setup Profil Agensi</h1>
        <p className="text-gray-500 mb-6">Halaman inisialisasi untuk agensi ({params.slug}).</p>
        <div className="bg-primary-default/10 text-primary-default p-4 rounded-2xl text-sm font-semibold mb-6">
          Lengkapi profil agensi Anda untuk mendapatkan slug kustom.
        </div>
        <button 
          onClick={() => window.history.back()} 
          className="text-primary-default font-semibold hover:underline"
        >
          Kembali
        </button>
      </div>
    </div>
  );
};

export default SetupPage;
