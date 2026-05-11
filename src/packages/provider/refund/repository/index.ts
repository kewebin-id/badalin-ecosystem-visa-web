import { endpoints } from '@/shared/constants/endpoints';
import { RestAPI } from '@/shared/utils/rest-api';
import { ResponseREST } from '@/shared/utils/rest-api/types';
import { IRefundListItem, ISettleRefundResponse } from '../domain/response';
import { IRefundRepository } from '../port/repository.port';

export class RefundRepository implements IRefundRepository {
  constructor(private readonly api: RestAPI) {}

  async getRefundList(): Promise<ResponseREST<IRefundListItem[]>> {
    try {
      return await this.api.get<IRefundListItem[]>({
        endpoint: endpoints.nextApi.provider.refund.base,
        isNextApi: true,
      });
    } catch {
      return { code: 500, message: 'Gagal mengambil data refund' };
    }
  }

  async settleRefund(
    submissionId: string,
    file: string,
  ): Promise<ResponseREST<ISettleRefundResponse>> {
    try {
      return await this.api.post<ISettleRefundResponse>({
        endpoint: endpoints.nextApi.provider.refund.settle(submissionId),
        body: { file },
        isNextApi: true,
      });
    } catch {
      return { code: 500, message: 'Gagal memproses penyelesaian refund' };
    }
  }
}
