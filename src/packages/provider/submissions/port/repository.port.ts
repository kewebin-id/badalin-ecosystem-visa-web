import { ResponseREST } from '@/shared/utils/rest-api/types';
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

export interface IProviderSubmissionsRepository {
  getSubmissions(query: IGetSubmissionsQuery): Promise<ResponseREST<ISubmissionListResponse>>;
  getSubmissionDetail(id: string): Promise<ResponseREST<ISubmissionResponse>>;
  verifyPayment(id: string): Promise<ResponseREST<IVerifyPaymentResponse>>;
  addFlightManifest(id: string, payloads: IFlightManifestPayload[]): Promise<ResponseREST<void>>;
  addHotelManifest(id: string, payloads: IHotelManifestPayload[]): Promise<ResponseREST<void>>;
  addTransportManifest(
    id: string,
    payloads: ITransportManifestPayload[],
  ): Promise<ResponseREST<void>>;
  reviewSubmission(id: string, payload: IReviewSubmissionPayload): Promise<ResponseREST<void>>;
  uploadVisas(
    id: string,
    visaFiles: Record<string, { name: string; base64: string }[]>,
  ): Promise<ResponseREST<Record<string, string>>>;
  submitVisas(id: string, visaUrls: Record<string, string>): Promise<ResponseREST<void>>;
  getLOV(type: 'payment-status' | 'review-status'): Promise<ResponseREST<{ label: string; value: string }[]>>;
}
