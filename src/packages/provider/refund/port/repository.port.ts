import { ResponseREST } from '@/shared/utils/rest-api/types';
import { IRefundListItem, ISettleRefundResponse } from '../domain/response';

export interface IRefundRepository {
  getRefundList(): Promise<ResponseREST<IRefundListItem[]>>;
  settleRefund(submissionId: string, file: string): Promise<ResponseREST<ISettleRefundResponse>>;
}
