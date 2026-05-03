import { SubmissionDetailView } from '@/packages/provider/submissions/presentation/view/detail';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Submission Detail',
};

export default function ProviderSubmissionDetailPage() {
  return <SubmissionDetailView />;
}
