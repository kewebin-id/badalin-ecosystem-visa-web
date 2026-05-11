import { ResponseREST } from '@/shared/utils/rest-api/types';
import { IDashboardSummary } from '../domain/response';

export interface IProviderDashboardRepository {
  getSummary(): Promise<ResponseREST<IDashboardSummary>>;
}
