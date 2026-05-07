import { ResponseREST } from '@/shared/utils/rest-api/types';
import {
  IApiTransaction,
  ICreateTransactionRequest,
  ILogisticsOcrResponse,
} from '../domain/transaction';

export interface ITransactionRepository {
  findAll(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<
    ResponseREST<{
      items: IApiTransaction[];
      totalItems: number;
      currentPage: number;
      totalPages: number;
    }>
  >;
  findById(id: string): Promise<ResponseREST<IApiTransaction>>;
  create(data: ICreateTransactionRequest): Promise<ResponseREST<IApiTransaction>>;
  update(id: string, data: ICreateTransactionRequest): Promise<ResponseREST<IApiTransaction>>;
  uploadProof(id: string, file: File): Promise<ResponseREST<IApiTransaction>>;
  processOcr(file: File, ocrType?: string): Promise<ResponseREST<ILogisticsOcrResponse>>;
  preview(
    data: ICreateTransactionRequest,
  ): Promise<ResponseREST<import('../domain/transaction').IPreviewResponse>>;
  upload(base64: string, ocrType?: string): Promise<ResponseREST<ILogisticsOcrResponse>>;
}
