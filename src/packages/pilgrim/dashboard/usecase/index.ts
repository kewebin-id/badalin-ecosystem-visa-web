import { validationMessage } from '@/shared/constants';
import { IUsecaseResponse } from '@/shared/domain/response.usecase';
import { IVisaHistory } from '../domain';
import { IDashboardRepository } from '../port/repository.port';
import { IDashboardUseCase } from '../port/usecase.port';

export class DashboardUseCase implements IDashboardUseCase {
  private repository: IDashboardRepository;

  constructor(repository: IDashboardRepository) {
    this.repository = repository;
  }

  getHistory = async (): Promise<IUsecaseResponse<IVisaHistory[]>> => {
    try {
      const data = await this.repository.getHistory();
      return {
        data,
        message: validationMessage().historyFetched,
      };
    } catch (error: any) {
      return {
        error,
        message: error?.message || validationMessage()[500](),
      };
    }
  };
}
