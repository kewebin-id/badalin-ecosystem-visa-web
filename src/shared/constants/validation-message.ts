export const validationMessage = (label?: string, locale: 'id' | 'en' = 'id') => {
  const isId = locale === 'id';
  return {
    200: () => isId ? `Proses${label ? ` ${label}` : ''} berhasil` : `Process${label ? ` ${label}` : ''} successful`,
    201: () => isId ? `${label || 'Data'} berhasil dibuat` : `${label || 'Data'} created successfully`,
    402: () => isId ? 'Field tidak valid' : 'Invalid field',
    400: () => isId ? 'Silakan periksa data yang Anda kirimkan' : 'Please check your submitted data',
    401: () => isId ? 'Maaf, Anda tidak memiliki akses' : 'Sorry, you do not have access',
    404: () => isId ? `${label || 'Data'} tidak ditemukan` : `${label || 'Data'} not found`,
    408: () => isId ? 'Silakan periksa koneksi internet Anda!' : 'Please check your internet connection!',
    500: () => isId ? 'Terjadi kesalahan server. Silakan coba lagi nanti' : 'Server error occurred. Please try again later',
    failedCreate: isId ? `Gagal membuat ${label || 'form'}. Silakan periksa form Anda.` : `Failed to create ${label || 'form'}. Please check your form.`,
    failedLogin: (method: 'Email' | 'Phone number') => {
      if (isId) {
        const methodId = method === 'Email' ? 'Email' : 'Nomor HP';
        return `${methodId} atau kata sandi tidak valid`;
      }
      return `Invalid ${method} or password`;
    },
    failedUpdate: isId ? `Gagal memperbarui ${label || 'form'}. Silakan periksa form Anda.` : `Failed to update ${label || 'form'}. Please check your form.`,
    unstableNetwork: isId ? 'Koneksi internet tidak stabil' : 'Unstable internet connection',
    noNetwork: isId ? 'Tidak ada koneksi internet' : 'No internet connection',
    unstableNetworkDesc: isId ? 'Terjadi kesalahan pada koneksi internet Anda. Pastikan Anda terhubung ke internet dan muat ulang browser Anda' : 'There was an error with your internet connection. Please make sure you are connected to the internet and reload your browser',
    required: () => isId ? `${label} wajib diisi` : `${label} is required`,
    invalidField: () => isId ? `${label} tidak valid` : `${label} is invalid`,
    minChar: (length: number) => isId ? `${label} minimal harus ${length} karakter` : `${label} must be at least ${length} characters`,
    duplicateValue: isId ? `${label || 'Nilai ini'} sudah digunakan` : `${label || 'This value'} is already in use`,
    updated: isId ? `${label || 'Data'} berhasil diperbarui` : `${label || 'Data'} updated successfully`,
    deleted: isId ? `${label || 'Data'} berhasil dihapus` : `${label || 'Data'} deleted successfully`,
    min: (min: number) => isId ? `${label} minimal adalah ${min}` : `Minimum ${label} is ${min}`,
    max: (max: number) => isId ? `${label} maksimal adalah ${max}` : `Maximum ${label} is ${max}`,
    saved: isId ? `${label || 'Data'} berhasil disimpan` : `${label || 'Data'} saved successfully`,
    alreadyRegister: isId ? `${label || 'Pengguna'} sudah terdaftar. Anda akan diarahkan ke login` : `${label || 'User'} is already registered. You will be redirected to login`,
    invalidPassword: isId ? 'Kata sandi minimal 8 karakter dan mengandung huruf besar, huruf kecil, angka, dan simbol' : 'Password must be at least 8 characters and contain uppercase, lowercase, numbers and symbols',
    waitingResend: isId ? 'Tunggu sejenak sebelum mengirim ulang OTP' : 'Please wait a moment before resending OTP',
    notSame: (compare: string) => isId ? `${label} tidak cocok dengan ${compare}` : `${label} does not match with ${compare}`,
    historyFetched: isId ? 'Riwayat berhasil diambil' : 'History fetched successfully',
  };
};
