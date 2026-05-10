import { IUsecaseResponse } from '@/shared/domain/response.usecase';
import Logger from '@/shared/utils/logger';
import { IAgency } from '../domain/agency';
import { IUpdateAgencyRequest } from '../domain/request';
import { IAgencySettingsRepository } from '../port/repository.port';
import { IAgencySettingsUseCase } from '../port/usecase.port';

export class AgencySettingsUseCase implements IAgencySettingsUseCase {
  constructor(private repo: IAgencySettingsRepository) {}

  async getAgencyData(): Promise<IUsecaseResponse<IAgency>> {
    try {
      const res = await this.repo.getAgencyData();
      if (res.data) {
        return { data: res.data, message: res.message };
      }
      return {
        error: new Error(res.message || 'Failed to fetch agency data'),
        message: res.message,
      };
    } catch (error) {
      Logger.error(error, { location: 'AgencySettingsUseCase.getAgencyData' });
      return { error: error as Error, message: 'Internal server error' };
    }
  }

  async updateAgencyData(data: IUpdateAgencyRequest): Promise<IUsecaseResponse<IAgency>> {
    try {
      const payload = {
        ...data,
        visaPrice: data.visaPrice !== undefined ? Math.abs(Number(data.visaPrice)) : undefined,
      };
      const res = await this.repo.updateAgencyData(payload as any);
      if (res.data) {
        return { data: res.data, message: res.message };
      }
      return {
        error: new Error(res.message || 'Failed to update agency data'),
        message: res.message,
      };
    } catch (error) {
      Logger.error(error, { location: 'AgencySettingsUseCase.updateAgencyData' });
      return { error: error as Error, message: 'Internal server error' };
    }
  }

  async checkSlugAvailability(slug: string): Promise<IUsecaseResponse<{ available: boolean }>> {
    try {
      const res = await this.repo.checkSlugAvailability(slug);
      if (res.data) {
        return { data: res.data, message: res.message };
      }
      return {
        error: new Error(res.message || 'Failed to check slug availability'),
        message: res.message,
      };
    } catch (error) {
      Logger.error(error, { location: 'AgencySettingsUseCase.checkSlugAvailability' });
      return { error: error as Error, message: 'Internal server error' };
    }
  }

  async validateSlug(slug: string): Promise<IUsecaseResponse<{ name: string }>> {
    try {
      const res = await this.repo.validate(slug);
      if (res.data) {
        return { data: res.data, message: res.message };
      }
      return {
        error: new Error(res.message || 'Failed to validate slug'),
        message: res.message,
      };
    } catch (error) {
      Logger.error(error, { location: 'AgencySettingsUseCase.validateSlug' });
      return { error: error as Error, message: 'Internal server error' };
    }
  }
}
