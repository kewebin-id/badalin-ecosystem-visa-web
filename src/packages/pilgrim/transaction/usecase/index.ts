import { IUsecaseResponse } from '@/shared/domain/response.usecase';
import Logger from '@/shared/utils/logger';
import {
  IApiTransaction,
  ICreateTransactionRequest,
  ILogisticsOcrResponse,
  IPaginatedTransactions,
  ITransaction,
  TOcrType,
} from '../domain/transaction';
import { ITransactionRepository } from '../port/repository.port';
import { ITransactionUseCase } from '../port/usecase.port';

export class TransactionUseCase implements ITransactionUseCase {
  constructor(private readonly repository: ITransactionRepository) {}

  async getTransactions(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<IUsecaseResponse<IPaginatedTransactions>> {
    try {
      const res = await this.repository.findAll(params);
      if (res.code !== 200 || !res.data) {
        return {
          code: Number(res.code),
          message: res.message,
          error: new Error(res.message || 'Gagal mengambil data transaksi'),
        };
      }

      // Handle both array directly, meta object and top-level pagination properties
      const resData = res.data as {
        items?: IApiTransaction[];
        meta?: { total?: number; page?: number; limit?: number; totalPages?: number };
        totalItems?: number;
        currentPage?: number;
        limit?: number;
        totalPages?: number;
      };
      const items = Array.isArray(res.data) ? res.data : resData.items || [];
      const total = resData.meta?.total ?? resData.totalItems ?? items.length;
      const page = resData.meta?.page ?? resData.currentPage ?? 1;
      const limit = resData.meta?.limit ?? resData.limit ?? 10;
      const totalPages = resData.meta?.totalPages ?? resData.totalPages ?? Math.ceil(total / limit);

      return {
        code: 200,
        message: res.message,
        data: {
          items: items.map((item: IApiTransaction) => this.mapToDomain(item)),
          total,
          page,
          limit,
          totalPages,
        },
      };
    } catch (error) {
      Logger.error(error, { location: 'TransactionUseCase.getTransactions' });
      return { code: 500, error: new Error('Terjadi kesalahan saat mengambil data transaksi') };
    }
  }

  async getTransactionDetail(id: string): Promise<IUsecaseResponse<ITransaction>> {
    try {
      const res = await this.repository.findById(id);
      if (res.code !== 200 || !res.data) {
        return {
          code: Number(res.code),
          message: res.message,
          error: new Error(res.message || 'Gagal mengambil detail transaksi'),
        };
      }
      return {
        code: 200,
        message: res.message,
        data: this.mapToDomain(res.data),
      };
    } catch {
      return { code: 500, error: new Error('Terjadi kesalahan saat mengambil detail transaksi') };
    }
  }

  async createTransaction(
    data: ICreateTransactionRequest,
  ): Promise<IUsecaseResponse<ITransaction>> {
    try {
      delete data.ocrConfidence;
      const res = await this.repository.create(data);
      if (res.code !== 201 || !res.data) {
        return {
          code: Number(res.code),
          message: res.message,
          error: new Error(res.message || 'Gagal membuat pengajuan visa'),
        };
      }
      return { code: 201, message: res.message, data: this.mapToDomain(res.data) };
    } catch {
      return { code: 500, error: new Error('Terjadi kesalahan saat membuat pengajuan visa') };
    }
  }

  async updatePaymentProof(id: string, file: File): Promise<IUsecaseResponse<ITransaction>> {
    try {
      const res = await this.repository.uploadProof(id, file);
      if (res.code !== 200 || !res.data) {
        return {
          code: Number(res.code),
          message: res.message,
          error: new Error(res.message || 'Gagal mengunggah bukti pembayaran'),
        };
      }
      return { code: 200, message: res.message, data: this.mapToDomain(res.data) };
    } catch {
      return { code: 500, error: new Error('Terjadi kesalahan saat mengunggah bukti pembayaran') };
    }
  }

  async updateTransaction(
    id: string,
    data: ICreateTransactionRequest,
  ): Promise<IUsecaseResponse<ITransaction>> {
    try {
      delete data.ocrConfidence;
      const res = await this.repository.update(id, data);
      if (res.code !== 200 || !res.data) {
        return {
          code: Number(res.code),
          message: res.message,
          error: new Error(res.message || 'Gagal memperbarui pengajuan visa'),
        };
      }
      return { code: 200, message: res.message, data: this.mapToDomain(res.data) };
    } catch {
      return { code: 500, error: new Error('Terjadi kesalahan saat memperbarui pengajuan visa') };
    }
  }

  async processOcr(file: File, ocrType?: string): Promise<IUsecaseResponse<ILogisticsOcrResponse>> {
    try {
      const res = await this.repository.processOcr(file, ocrType);
      if (res.code !== 200 || !res.data) {
        return {
          code: Number(res.code),
          message: res.message,
          error: new Error(res.message || 'Gagal memproses OCR'),
        };
      }
      return {
        code: 200,
        message: res.message,
        data: { ...res.data, ocrType: ocrType as TOcrType },
      };
    } catch {
      return { code: 500, error: new Error('Terjadi kesalahan saat memproses OCR') };
    }
  }

  async previewSubmission(
    data: ICreateTransactionRequest,
  ): Promise<IUsecaseResponse<import('../domain/transaction').IPreviewResponse>> {
    try {
      delete data.ocrConfidence;
      const res = await this.repository.preview(data);
      if (res.code !== 200 || !res.data) {
        return {
          code: Number(res.code),
          message: res.message,
          error: new Error(res.message || 'Gagal melakukan preview pengajuan visa'),
        };
      }
      return { code: 200, message: res.message, data: res.data };
    } catch {
      return {
        error: new Error('Terjadi kesalahan saat melakukan preview pengajuan visa'),
      };
    }
  }

  async upload(base64: string, ocrType?: string): Promise<IUsecaseResponse<ILogisticsOcrResponse>> {
    try {
      const res = await this.repository.upload(base64, ocrType);
      if (res.code !== 200 || !res.data) {
        return {
          code: Number(res.code),
          message: res.message,
          error: new Error(res.message || 'Gagal mengunggah file'),
        };
      }
      return {
        code: 200,
        message: res.message,
        data: { ...res.data, ocrType: ocrType as TOcrType },
      };
    } catch {
      return { code: 500, error: new Error('Terjadi kesalahan saat mengunggah file') };
    }
  }

  private mapToDomain(item: IApiTransaction): ITransaction {
    const hotels = item.hotels || [];

    // Derive route from hotels
    const cities = Array.from(new Set(hotels.map((h: { city?: string }) => h.city))).filter(
      Boolean,
    );
    const derivedRoute = cities.length > 0 ? cities.join(' - ') : 'Umrah';

    return {
      ...item,
      route: item.route || derivedRoute,
      invoiceAmount:
        item.invoiceAmount || (item as unknown as { totalAmount?: number }).totalAmount || 0,
      pilgrimIds:
        (item as unknown as { members?: { id: string }[] })?.members?.map(
          (m: { id?: string } | string) => (typeof m === 'string' ? m : m.id),
        ) || [],
    } as unknown as ITransaction;
  }
}
