import { IUsecaseResponse } from '@/shared/domain/response.usecase';
import { IRefundListItem, ISettleRefundResponse } from '../domain/response';

export interface IRefundUseCase {
  getRefundList(
    page?: number,
    limit?: number,
    search?: string,
  ): Promise<
    IUsecaseResponse<{
      items: IRefundListItem[];
      totalItems: number;
      totalPages: number;
      currentPage: number;
    }>
  >;
  settleRefund(submissionId: string, file: string): Promise<IUsecaseResponse<ISettleRefundResponse>>;
}
