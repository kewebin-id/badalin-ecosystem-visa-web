import { ResponseREST } from '@/shared/utils/rest-api/types';
import { IAgency } from '../domain/agency';
import { IUpdateAgencyRequest } from '../domain/request';

export interface IAgencySettingsRepository {
  getAgencyData(): Promise<ResponseREST<IAgency>>;
  updateAgencyData(data: IUpdateAgencyRequest): Promise<ResponseREST<IAgency>>;
  checkSlugAvailability(slug: string): Promise<ResponseREST<{ available: boolean }>>;
}
