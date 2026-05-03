import { SubmissionsMonitoring } from '@/packages/provider/submissions/presentation/view/list';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Submissions | Badalin Visa',
};

export default function ProviderSubmissionsPage() {
  return <SubmissionsMonitoring />;
}
