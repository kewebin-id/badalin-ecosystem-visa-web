import { IUsecaseResponse } from '@/shared/domain/response.usecase';
import {
  IFlightManifestPayload,
  IHotelManifestPayload,
  IReviewSubmissionPayload,
  ITransportManifestPayload,
  IGetSubmissionsQuery,
} from '../domain/request';
import {
  ISubmissionListResponse,
  IVerifyPaymentResponse,
  ISubmissionResponse,
} from '../domain/response';

export interface IProviderSubmissionsUseCase {
  getSubmissions(query: IGetSubmissionsQuery): Promise<IUsecaseResponse<ISubmissionListResponse>>;
  getSubmissionDetail(id: string): Promise<IUsecaseResponse<ISubmissionResponse>>;
  verifyPayment(id: string): Promise<IUsecaseResponse<IVerifyPaymentResponse>>;
  addFlightManifest(
    id: string,
    payloads: IFlightManifestPayload[],
  ): Promise<IUsecaseResponse<boolean>>;
  addHotelManifest(
    id: string,
    payloads: IHotelManifestPayload[],
  ): Promise<IUsecaseResponse<boolean>>;
  addTransportManifest(
    id: string,
    payloads: ITransportManifestPayload[],
  ): Promise<IUsecaseResponse<boolean>>;
  reviewSubmission(
    id: string,
    payload: IReviewSubmissionPayload,
  ): Promise<IUsecaseResponse<boolean>>;
  submitVisas(
    id: string,
    visaFiles: Record<string, { name: string; base64: string }[]>,
  ): Promise<IUsecaseResponse<boolean>>;
}
