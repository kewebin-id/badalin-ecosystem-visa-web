import { endpoints } from '@/shared/constants/endpoints';
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
      endpoint: endpoints.nextApi.provider.submissions.base,
      queryParam: query,
      isNextApi: true,
    });
  }

  async getSubmissionDetail(id: string): Promise<ResponseREST<ISubmissionResponse>> {
    return this.api.get<ISubmissionResponse>({
      endpoint: `${endpoints.nextApi.provider.submissions.base}/${id}`,
      isNextApi: true,
    });
  }

  async verifyPayment(id: string): Promise<ResponseREST<IVerifyPaymentResponse>> {
    return this.api.patch<IVerifyPaymentResponse>({
      endpoint: endpoints.nextApi.provider.submissions.verifyPayment(id),
      isNextApi: true,
    });
  }

  async addFlightManifest(
    id: string,
    payloads: IFlightManifestPayload[],
  ): Promise<ResponseREST<void>> {
    return this.addManifest(id, 'flight', payloads);
  }

  async addHotelManifest(
    id: string,
    payloads: IHotelManifestPayload[],
  ): Promise<ResponseREST<void>> {
    return this.addManifest(id, 'hotel', payloads);
  }

  async addTransportManifest(
    id: string,
    payloads: ITransportManifestPayload[],
  ): Promise<ResponseREST<void>> {
    return this.addManifest(id, 'transport', payloads);
  }

  async reviewSubmission(
    id: string,
    payload: IReviewSubmissionPayload,
  ): Promise<ResponseREST<void>> {
    return this.api.patch<void>({
      endpoint: endpoints.nextApi.provider.submissions.review(id),
      body: payload,
      isNextApi: true,
    });
  }

  private async addManifest(
    id: string,
    type: 'flight' | 'hotel' | 'transport',
    payloads: object[],
  ): Promise<ResponseREST<void>> {
    const endpointMap = {
      flight: endpoints.nextApi.provider.submissions.flightManifest,
      hotel: endpoints.nextApi.provider.submissions.hotelManifest,
      transport: endpoints.nextApi.provider.submissions.transportManifest,
    };

    return this.api.post<void>({
      endpoint: endpointMap[type](id),
      body: payloads,
      isNextApi: true,
    });
  }
}
