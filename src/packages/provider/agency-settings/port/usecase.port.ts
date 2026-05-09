import { IUsecaseResponse } from '@/shared/domain/response.usecase';
import { IAgency } from '../domain/agency';
import { IUpdateAgencyRequest } from '../domain/request';

export interface IAgencySettingsUseCase {
  getAgencyData(): Promise<IUsecaseResponse<IAgency>>;
  updateAgencyData(data: IUpdateAgencyRequest): Promise<IUsecaseResponse<IAgency>>;
  checkSlugAvailability(slug: string): Promise<IUsecaseResponse<{ available: boolean }>>;
  validateSlug(slug: string): Promise<IUsecaseResponse<{ name: string }>>;
}
