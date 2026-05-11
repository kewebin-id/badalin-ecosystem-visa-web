import { IUsecaseResponse } from '@/shared/domain/response.usecase';
import Logger from '@/shared/utils/logger';
import { IRefundListItem, ISettleRefundResponse } from '../domain/response';
import { IRefundRepository } from '../port/repository.port';
import { IRefundUseCase } from '../port/usecase.port';

export class RefundUseCase implements IRefundUseCase {
  constructor(private readonly repository: IRefundRepository) {}

  async getRefundList(): Promise<IUsecaseResponse<IRefundListItem[]>> {
    try {
      const res = await this.repository.getRefundList();
      if (res.code === 200 && res.data) {
        return { data: res.data, message: res.message };
      }
      return {
        error: new Error(res.message || 'Failed to fetch refund list'),
        message: res.message,
      };
    } catch (error) {
      Logger.error(error, { location: 'RefundUseCase.getRefundList' });
      return { error: error as Error, message: 'Internal server error' };
    }
  }

  async settleRefund(
    submissionId: string,
    file: string,
  ): Promise<IUsecaseResponse<ISettleRefundResponse>> {
    try {
      const res = await this.repository.settleRefund(submissionId, file);
      if ((res.code === 200 || res.code === 201) && res.data) {
        return { data: res.data, message: res.message };
      }
      return {
        error: new Error(res.message || 'Failed to settle refund'),
        message: res.message,
      };
    } catch (error) {
      Logger.error(error, { location: 'RefundUseCase.settleRefund' });
      return { error: error as Error, message: 'Internal server error' };
    }
  }
}
