import { IUsecaseResponse } from '@/shared/domain/response.usecase';
import {
  ICreateTransactionRequest,
  ILogisticsOcrResponse,
  IPaginatedTransactions,
  ITransaction,
} from '../domain/transaction';

export interface ITransactionUseCase {
  getTransactions(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<IUsecaseResponse<IPaginatedTransactions>>;
  getTransactionDetail(id: string): Promise<IUsecaseResponse<ITransaction>>;
  createTransaction(data: ICreateTransactionRequest): Promise<IUsecaseResponse<ITransaction>>;
  updateTransaction(
    id: string,
    data: ICreateTransactionRequest,
  ): Promise<IUsecaseResponse<ITransaction>>;
  updatePaymentProof(id: string, file: File): Promise<IUsecaseResponse<ITransaction>>;
  processOcr(file: File, ocrType?: string): Promise<IUsecaseResponse<ILogisticsOcrResponse>>;
  previewSubmission(
    data: ICreateTransactionRequest,
  ): Promise<
    import('@/shared/domain/response.usecase').IUsecaseResponse<
      import('../domain/transaction').IPreviewResponse
    >
  >;
  upload(base64: string, ocrType?: string): Promise<IUsecaseResponse<ILogisticsOcrResponse>>;
}
