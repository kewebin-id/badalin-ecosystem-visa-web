import { IUsecaseResponse } from '@/shared/domain/response.usecase';
import { IVisaHistory } from '../domain';

export interface IDashboardUseCase {
  getHistory(): Promise<IUsecaseResponse<IVisaHistory[]>>;
}
