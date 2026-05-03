import { SubmissionManifest } from '@/packages/provider/submissions/presentation/view/manifest';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Logistik & Manifest | Badalin Visa',
};

export default function SubmissionManifestPage() {
  return <SubmissionManifest />;
}
