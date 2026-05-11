import { IUsecaseResponse } from '@/shared/domain/response.usecase';
import { IDashboardSummary } from '../domain/response';

export interface IProviderDashboardUseCase {
  getSummary(): Promise<IUsecaseResponse<IDashboardSummary>>;
}
