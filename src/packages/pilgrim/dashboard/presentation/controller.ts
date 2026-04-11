import { RestAPI } from '@/shared/utils/rest-api';
import { useQuery } from '@tanstack/react-query';
import { DashboardRepository } from '../repository';
import { DashboardUseCase } from '../usecase';

export const useDashboardController = () => {
  const restApi = new RestAPI();
  const repository = new DashboardRepository(restApi);
  const usecase = new DashboardUseCase(repository);

  const useGetHistory = () => {
    return useQuery({
      queryKey: ['visa-history'],
      queryFn: async () => {
        const result = await usecase.getHistory();
        if (result.error) {
          throw result.error;
        }
        return result.data || [];
      },
    });
  };

  return {
    useGetHistory,
  };
};
