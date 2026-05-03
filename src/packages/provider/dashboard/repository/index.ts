import { RequestAPI, ResponseREST } from '@/shared/utils/rest-api/types';
import { IDashboardSummary } from '../domain/response';

export interface IProviderDashboardRepository {
  getSummary(): Promise<ResponseREST<IDashboardSummary>>;
}

export class ProviderDashboardRepository implements IProviderDashboardRepository {
  constructor(private api: RequestAPI) {}

  async getSummary(): Promise<ResponseREST<IDashboardSummary>> {
    return this.api.get<IDashboardSummary>({
      endpoint: '/api/v1/p/dashboard/summary',
    });
  }
}
