import { IUsecaseResponse } from '@/shared/domain/response.usecase';
import Logger from '@/shared/utils/logger';
import {
  IFlightManifestPayload,
  IGetSubmissionsQuery,
  IHotelManifestPayload,
  IReviewSubmissionPayload,
  ITransportManifestPayload,
} from '../domain/request';
import {
  ISubmissionListResponse,
  ISubmissionResponse,
  IVerifyPaymentResponse,
} from '../domain/response';
import { IProviderSubmissionsRepository } from '../port/repository.port';
import { IProviderSubmissionsUseCase } from '../port/usecase.port';

export class ProviderSubmissionsUseCase implements IProviderSubmissionsUseCase {
  constructor(private repo: IProviderSubmissionsRepository) {}

  async getSubmissions(
    query: IGetSubmissionsQuery,
  ): Promise<IUsecaseResponse<ISubmissionListResponse>> {
    try {
      const res = await this.repo.getSubmissions(query);
      if (res.data) {
        return { data: res.data, message: res.message };
      }
      return {
        error: new Error(res.message || 'Failed to fetch submissions'),
        message: res.message,
      };
    } catch (error) {
      Logger.error(error, {
        location: 'ProviderSubmissionsUseCase.getSubmissions',
        error: error instanceof Error ? error.message : error,
      });
      return { error: error as Error, message: 'Internal server error' };
    }
  }

  async getSubmissionDetail(id: string): Promise<IUsecaseResponse<ISubmissionResponse>> {
    try {
      const res = await this.repo.getSubmissionDetail(id);
      if (res.data) {
        return { data: res.data, message: res.message };
      }
      return {
        error: new Error(res.message || 'Failed to fetch submission detail'),
        message: res.message,
      };
    } catch (error) {
      Logger.error(error, { location: 'ProviderSubmissionsUseCase.getSubmissionDetail' });
      return { error: error as Error, message: 'Internal server error' };
    }
  }

  async verifyPayment(id: string): Promise<IUsecaseResponse<IVerifyPaymentResponse>> {
    try {
      const res = await this.repo.verifyPayment(id);
      if (res.data) {
        return { data: res.data, message: res.message };
      }
      return { error: new Error(res.message || 'Failed to verify payment'), message: res.message };
    } catch (error) {
      Logger.error(error, { location: 'ProviderSubmissionsUseCase.verifyPayment' });
      return { error: error as Error, message: 'Internal server error' };
    }
  }

  async addFlightManifest(
    id: string,
    payloads: IFlightManifestPayload[],
  ): Promise<IUsecaseResponse<boolean>> {
    try {
      const res = await this.repo.addFlightManifest(id, payloads);
      if (res.code === 200 || res.code === 201) {
        return { data: true, message: res.message };
      }
      return {
        error: new Error(res.message || 'Failed to add flight manifest'),
        message: res.message,
      };
    } catch (error) {
      Logger.error(error, { location: 'ProviderSubmissionsUseCase.addFlightManifest' });
      return { error: error as Error, message: 'Internal server error' };
    }
  }

  async addHotelManifest(
    id: string,
    payloads: IHotelManifestPayload[],
  ): Promise<IUsecaseResponse<boolean>> {
    try {
      const res = await this.repo.addHotelManifest(id, payloads);
      if (res.code === 200 || res.code === 201) {
        return { data: true, message: res.message };
      }
      return {
        error: new Error(res.message || 'Failed to add hotel manifest'),
        message: res.message,
      };
    } catch (error) {
      Logger.error(error, { location: 'ProviderSubmissionsUseCase.addHotelManifest' });
      return { error: error as Error, message: 'Internal server error' };
    }
  }

  async addTransportManifest(
    id: string,
    payloads: ITransportManifestPayload[],
  ): Promise<IUsecaseResponse<boolean>> {
    try {
      const res = await this.repo.addTransportManifest(id, payloads);
      if (res.code === 200 || res.code === 201) {
        return { data: true, message: res.message };
      }
      return {
        error: new Error(res.message || 'Failed to add transport manifest'),
        message: res.message,
      };
    } catch (error) {
      Logger.error(error, { location: 'ProviderSubmissionsUseCase.addTransportManifest' });
      return { error: error as Error, message: 'Internal server error' };
    }
  }

  async reviewSubmission(
    id: string,
    payload: IReviewSubmissionPayload,
  ): Promise<IUsecaseResponse<boolean>> {
    try {
      const res = await this.repo.reviewSubmission(id, payload);
      if (res.code === 200 || res.code === 201) {
        return { data: true, message: res.message };
      }
      return {
        error: new Error(res.message || 'Failed to review submission'),
        message: res.message,
      };
    } catch (error) {
      Logger.error(error, { location: 'ProviderSubmissionsUseCase.reviewSubmission' });
      return { error: error as Error, message: 'Internal server error' };
    }
  }

  async uploadVisas(
    id: string,
    visaFiles: Record<string, { name: string; base64: string }[]>,
  ): Promise<IUsecaseResponse<Record<string, string>>> {
    try {
      const res = await this.repo.uploadVisas(id, visaFiles);
      if (res.data) {
        return { data: res.data, message: res.message };
      }
      return {
        error: new Error(res.message || 'Failed to upload visas'),
        message: res.message,
      };
    } catch (error) {
      Logger.error(error, { location: 'ProviderSubmissionsUseCase.uploadVisas' });
      return { error: error as Error, message: 'Internal server error' };
    }
  }

  async submitVisas(
    id: string,
    visaUrls: Record<string, string>,
  ): Promise<IUsecaseResponse<boolean>> {
    try {
      const res = await this.repo.submitVisas(id, visaUrls);
      if (res.code === 200 || res.code === 201) {
        return { data: true, message: res.message };
      }
      return {
        error: new Error(res.message || 'Failed to submit visas'),
        message: res.message,
      };
    } catch (error) {
      Logger.error(error, { location: 'ProviderSubmissionsUseCase.submitVisas' });
      return { error: error as Error, message: 'Internal server error' };
    }
  }

  async getLOV(type: 'payment-status' | 'review-status'): Promise<IUsecaseResponse<{ label: string; value: string }[]>> {
    try {
      const res = await this.repo.getLOV(type);
      if (res.data) {
        return { data: res.data, message: res.message };
      }
      return {
        error: new Error(res.message || 'Failed to fetch LOV'),
        message: res.message,
      };
    } catch (error) {
      Logger.error(error, { location: 'ProviderSubmissionsUseCase.getLOV' });
      return { error: error as Error, message: 'Internal server error' };
    }
  }
}
