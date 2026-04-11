import { endpoints } from '@/shared/constants/endpoints';
import { RestAPI } from '@/shared/utils/rest-api';
import { IVisaHistory } from '../domain';
import { IDashboardRepository } from '../port/repository.port';

export class DashboardRepository implements IDashboardRepository {
  private restApi: RestAPI;

  constructor(api: RestAPI) {
    this.restApi = api;
  }

  getHistory = async (): Promise<IVisaHistory[]> => {
    try {
      const result = await this.restApi.get<{ items: IVisaHistory[] }>({
        endpoint: endpoints.nextApi.visa.dashboard.history,
        isNextApi: true,
      });
      return result.data?.items || [];
    } catch (error) {
      throw error;
    }
  };
}
