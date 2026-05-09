'use client';

import { UnderConstruction } from '@/components/molecules/under-construction';
import { useTranslations } from 'next-intl';

const ManifestsPage = () => {
  const t = useTranslations('ProviderSidebar');
  const tm = useTranslations('ManifestsPage');

  return (
    <div className="flex-1 bg-white rounded-[2rem] border border-gray-100 shadow-sm min-h-[calc(100vh-120px)] flex items-center justify-center">
      <UnderConstruction
        title={t('manifestData')}
        description={tm('description')}
      />
    </div>
  );
};

export default ManifestsPage;
