import { IUsecaseResponse } from '@/shared/domain/response.usecase';
import { IRefundListItem, ISettleRefundResponse } from '../domain/response';

export interface IRefundUseCase {
  getRefundList(): Promise<IUsecaseResponse<IRefundListItem[]>>;
  settleRefund(submissionId: string, file: string): Promise<IUsecaseResponse<ISettleRefundResponse>>;
}
