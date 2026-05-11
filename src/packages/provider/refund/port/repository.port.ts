import { ResponseREST } from '@/shared/utils/rest-api/types';
import { IRefundListItem, ISettleRefundResponse } from '../domain/response';

export interface IRefundRepository {
  getRefundList(
    page?: number,
    limit?: number,
    search?: string,
  ): Promise<
    ResponseREST<{
      items: IRefundListItem[];
      totalItems: number;
      totalPages: number;
      currentPage: number;
    }>
  >;
  settleRefund(submissionId: string, file: string): Promise<ResponseREST<ISettleRefundResponse>>;
}
