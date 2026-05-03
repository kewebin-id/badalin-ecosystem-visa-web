import { useQuery } from '@tanstack/react-query';
import { RestAPI } from '@/shared/utils/rest-api';
import { ProviderDashboardRepository } from '../../repository';
import { ProviderDashboardUseCase } from '../../usecase';

export const useProviderDashboardController = () => {
  const api = new RestAPI();
  const repo = new ProviderDashboardRepository(api);
  const usecase = new ProviderDashboardUseCase(repo);

  const useSummary = () =>
    useQuery({
      queryKey: ['provider', 'dashboard', 'summary'],
      queryFn: () => usecase.getSummary(),
    });

  return {
    useSummary,
  };
};
