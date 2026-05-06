import { endpoints } from '@/shared/constants/endpoints';
import { RestAPI } from '@/shared/utils/rest-api';
import { ResponseREST } from '@/shared/utils/rest-api/types';
import {
  IApiTransaction,
  ICreateTransactionRequest,
  ILogisticsOcrResponse,
  TOcrType,
} from '../domain/transaction';
import { ITransactionRepository } from '../port/repository.port';

export class TransactionRepository implements ITransactionRepository {
  constructor(private readonly api: RestAPI) {}

  async findAll(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<
    ResponseREST<{ items: IApiTransaction[]; meta: { total: number; page: number; limit: number } }>
  > {
    return this.api.get<{
      items: IApiTransaction[];
      meta: { total: number; page: number; limit: number };
    }>({
      endpoint: endpoints.nextApi.visa.submissions.base,
      queryParam: params,
      isNextApi: true,
    });
  }

  async findById(id: string): Promise<ResponseREST<IApiTransaction>> {
    return this.api.get<IApiTransaction>({
      endpoint: endpoints.nextApi.visa.submissions.detail(id),
      isNextApi: true,
    });
  }

  async create(data: ICreateTransactionRequest): Promise<ResponseREST<IApiTransaction>> {
    return this.api.post<IApiTransaction>({
      endpoint: endpoints.nextApi.visa.submissions.base,
      body: data,
      isNextApi: true,
    });
  }

  async uploadProof(id: string, file: File): Promise<ResponseREST<IApiTransaction>> {
    const formData = new FormData();
    formData.append('file', file);
    return this.api.post<IApiTransaction>({
      endpoint: endpoints.nextApi.visa.submissions.paymentProof(id),
      body: formData,
      isNextApi: true,
    });
  }

  async update(
    id: string,
    data: ICreateTransactionRequest,
  ): Promise<ResponseREST<IApiTransaction>> {
    return this.api.put<IApiTransaction>({
      endpoint: endpoints.nextApi.visa.submissions.detail(id),
      body: data,
      isNextApi: true,
    });
  }

  async processOcr(
    file: File,
    ocrType: TOcrType = 'LOGISTICS',
  ): Promise<ResponseREST<ILogisticsOcrResponse>> {
    try {
      const base64 = await this.fileToBase64(file);
      return await this.api.post<ILogisticsOcrResponse>({
        endpoint: endpoints.nextApi.visa.upload,
        body: {
          file: base64,
          isOcr: true,
          ocrType,
        },
        isNextApi: true,
      });
    } catch {
      return { code: 500, message: 'Gagal memproses file' };
    }
  }

  async upload(
    base64: string,
    ocrType: TOcrType = 'LOGISTICS',
  ): Promise<ResponseREST<ILogisticsOcrResponse>> {
    try {
      return await this.api.post<ILogisticsOcrResponse>({
        endpoint: endpoints.nextApi.visa.upload,
        body: {
          file: base64,
          isOcr: false,
          ocrType,
        },
        isNextApi: true,
      });
    } catch (error: unknown) {
      return { code: 500, message: error instanceof Error ? error.message : 'Gagal upload file' };
    }
  }

  async preview(
    data: ICreateTransactionRequest,
  ): Promise<ResponseREST<import('../domain/transaction').IPreviewResponse>> {
    return this.api.post<import('../domain/transaction').IPreviewResponse>({
      endpoint: endpoints.nextApi.visa.submissions.preview,
      body: data,
      isNextApi: true,
    });
  }

  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
}
