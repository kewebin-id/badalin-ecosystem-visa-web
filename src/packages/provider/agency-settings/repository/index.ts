import { endpoints } from '@/shared/constants/endpoints';
import { RequestAPI, ResponseREST } from '@/shared/utils/rest-api/types';
import { IAgency } from '../domain/agency';
import { IUpdateAgencyRequest } from '../domain/request';
import { IAgencySettingsRepository } from '../port/repository.port';

export class AgencySettingsRepository implements IAgencySettingsRepository {
  constructor(private api: RequestAPI) {}

  async getAgencyData(): Promise<ResponseREST<IAgency>> {
    return this.api.get<IAgency>({
      endpoint: endpoints.nextApi.provider.agency.base,
      isNextApi: true,
    });
  }

  async updateAgencyData(data: IUpdateAgencyRequest): Promise<ResponseREST<IAgency>> {
    return this.api.patch<IAgency>({
      endpoint: endpoints.nextApi.provider.agency.base,
      body: data,
      isNextApi: true,
    });
  }

  async checkSlugAvailability(slug: string): Promise<ResponseREST<{ available: boolean }>> {
    return this.api.get<{ available: boolean }>({
      endpoint: endpoints.nextApi.provider.agency.checkSlug,
      queryParam: { slug },
      isNextApi: true,
    });
  }

  async validate(slug: string): Promise<ResponseREST<{ name: string }>> {
    return this.api.get<{ name: string }>({
      endpoint: endpoints.nextApi.provider.agency.validateSession,
      queryParam: { slug },
      isNextApi: true,
    });
  }
}
