import { RestAPI } from '@/shared/utils/rest-api';
import { useQuery } from '@tanstack/react-query';

export interface ISearchUser {
  employeeId: string;
  fullName: string;
  email: string;
  orgUnit?: {
    id: number;
    code: string;
    name: string;
  };
}

interface UseSearchUserParams {
  query?: string;
  employeeId?: string;
  email?: string;
  fullName?: string;
  enabled?: boolean;
  endpoint?: string; // Optional custom endpoint
}

export const useSearchUser = (params?: UseSearchUserParams) => {
  const restApi = new RestAPI();

  return useQuery({
    queryKey: [
      'search-user',
      params?.query,
      params?.employeeId,
      params?.email,
      params?.fullName,
      params?.endpoint,
    ],
    queryFn: async () => {
      const queryParams: Record<string, string> = {};
      if (params?.query) queryParams.query = params.query;
      if (params?.employeeId) queryParams.employeeId = params.employeeId;
      if (params?.email) queryParams.email = params.email;
      if (params?.fullName) queryParams.fullName = params.fullName;

      const endpoint = params?.endpoint || '/api/auth/search-user';

      const response = await restApi.get<ISearchUser[]>({
        endpoint,
        queryParam: queryParams,
        isNextApi: true,
      });

      if (!response.data) {
        throw new Error('No data returned from search-user');
      }

      return response.data;
    },
    enabled: params?.enabled ?? true,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
