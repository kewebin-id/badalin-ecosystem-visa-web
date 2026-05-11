import { IUsecaseResponse } from '@/shared/domain/response.usecase';
import { ResponseREST } from '@/shared/utils/rest-api/types';
import { IRefundListItem } from '../domain/response';

export interface IRefundRepository {
  getRefundList(): Promise<ResponseREST<IRefundListItem[]>>;
  settleRefund(submissionId: string, file: string): Promise<ResponseREST<any>>;
}

export interface IRefundUseCase {
  getRefundList(): Promise<IUsecaseResponse<IRefundListItem[]>>;
  settleRefund(submissionId: string, file: string): Promise<IUsecaseResponse<any>>;
}
