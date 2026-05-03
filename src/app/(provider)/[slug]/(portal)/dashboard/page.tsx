import { ProviderDashboardView } from '@/packages/provider/dashboard/presentation/view';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Provider Dashboard',
};

export default function ProviderDashboardPage() {
  return <ProviderDashboardView />;
}
