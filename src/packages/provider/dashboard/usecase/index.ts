import { IUsecaseResponse } from '@/shared/domain/response.usecase';
import Logger from '@/shared/utils/logger';
import { IDashboardSummary } from '../domain/response';
import { IProviderDashboardRepository } from '../port/repository.port';
import { IProviderDashboardUseCase } from '../port/usecase.port';

export class ProviderDashboardUseCase implements IProviderDashboardUseCase {
  constructor(private repo: IProviderDashboardRepository) {}

  async getSummary(): Promise<IUsecaseResponse<IDashboardSummary>> {
    try {
      const res = await this.repo.getSummary();
      if (res.data) {
        return { data: res.data, message: res.message };
      }
      return {
        error: new Error(res.message || 'Failed to fetch dashboard summary'),
        message: res.message,
      };
    } catch (error) {
      Logger.error(error, { location: 'ProviderDashboardUseCase.getSummary' });
      return { error: error as Error, message: 'Internal server error' };
    }
  }
}
