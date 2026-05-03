import { RequestAPI, ResponseREST } from '@/shared/utils/rest-api/types';
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

export class ProviderSubmissionsRepository implements IProviderSubmissionsRepository {
  constructor(private api: RequestAPI) {}

  async getSubmissions(
    query: IGetSubmissionsQuery,
  ): Promise<ResponseREST<ISubmissionListResponse>> {
    return this.api.get<ISubmissionListResponse>({
      endpoint: '/api/v1/p/submissions',
      queryParam: query,
    });
  }

  async getSubmissionDetail(id: string): Promise<ResponseREST<ISubmissionResponse>> {
    return this.api.get<ISubmissionResponse>({
      endpoint: `/api/v1/p/submissions/${id}`,
    });
  }

  async verifyPayment(id: string): Promise<ResponseREST<IVerifyPaymentResponse>> {
    return this.api.patch<IVerifyPaymentResponse>({
      endpoint: `/api/v1/p/submissions/${id}/verify-payment`,
    });
  }

  async addFlightManifest(
    id: string,
    payloads: IFlightManifestPayload[],
  ): Promise<ResponseREST<void>> {
    return this.api.post<void>({
      endpoint: `/api/v1/p/submissions/${id}/manifest/flight`,
      body: payloads as unknown as object,
    });
  }

  async addHotelManifest(
    id: string,
    payloads: IHotelManifestPayload[],
  ): Promise<ResponseREST<void>> {
    return this.api.post<void>({
      endpoint: `/api/v1/p/submissions/${id}/manifest/hotel`,
      body: payloads as unknown as object,
    });
  }

  async addTransportManifest(
    id: string,
    payloads: ITransportManifestPayload[],
  ): Promise<ResponseREST<void>> {
    return this.api.post<void>({
      endpoint: `/api/v1/p/submissions/${id}/manifest/transport`,
      body: payloads as unknown as object,
    });
  }

  async reviewSubmission(
    id: string,
    payload: IReviewSubmissionPayload,
  ): Promise<ResponseREST<void>> {
    return this.api.patch<void>({
      endpoint: `/api/v1/p/submissions/${id}/review`,
      body: payload,
    });
  }
}
