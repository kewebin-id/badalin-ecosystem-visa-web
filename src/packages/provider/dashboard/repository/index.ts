import { endpoints } from '@/shared/constants/endpoints';
import { RequestAPI, ResponseREST } from '@/shared/utils/rest-api/types';
import { IDashboardSummary } from '../domain/response';
import { IProviderDashboardRepository } from '../port/repository.port';

export class ProviderDashboardRepository implements IProviderDashboardRepository {
  constructor(private api: RequestAPI) {}

  async getSummary(): Promise<ResponseREST<IDashboardSummary>> {
    return this.api.get<IDashboardSummary>({
      endpoint: endpoints.nextApi.provider.dashboard.summary,
      isNextApi: true,
    });
  }
}
