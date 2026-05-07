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
      if (res.code !== 200) {
        return {
          message: res.message,
          error: new Error(res.message || 'Gagal mengambil data transaksi'),
        };
      }
      if (!res.data) {
        return {
          error: new Error('Data tidak ditemukan'),
        };
      }

      return {
        message: res.message,
        data: {
          ...res.data,
          items: res.data.items.map((item: IApiTransaction) => this.mapToDomain(item)),
        },
      };
    } catch (error) {
      Logger.error(error, { location: 'TransactionUseCase.getTransactions' });
      return { error: new Error('Terjadi kesalahan saat mengambil data transaksi') };
    }
  }

  async getTransactionDetail(id: string): Promise<IUsecaseResponse<ITransaction>> {
    try {
      const res = await this.repository.findById(id);
      if (res.code !== 200) {
        return {
          message: res.message,
          error: new Error(res.message || 'Gagal mengambil detail transaksi'),
        };
      }
      if (!res.data) {
        return {
          error: new Error('Data tidak ditemukan'),
        };
      }
      return {
        message: res.message,
        data: this.mapToDomain(res.data),
      };
    } catch {
      return { error: new Error('Terjadi kesalahan saat mengambil detail transaksi') };
    }
  }

  async createTransaction(
    data: ICreateTransactionRequest,
  ): Promise<IUsecaseResponse<ITransaction>> {
    try {
      const { ocrConfidence, ...reqData } = data;
      const res = await this.repository.create(reqData);
      if (res.code !== 201) {
        return {
          message: res.message,
          error: new Error(res.message || 'Gagal membuat pengajuan visa'),
        };
      }
      if (!res.data) {
        return {
          error: new Error('Data tidak ditemukan'),
        };
      }
      return { message: res.message, data: this.mapToDomain(res.data) };
    } catch {
      return { error: new Error('Terjadi kesalahan saat membuat pengajuan visa') };
    }
  }

  async updatePaymentProof(id: string, file: File): Promise<IUsecaseResponse<ITransaction>> {
    try {
      const res = await this.repository.uploadProof(id, file);
      if (res.code !== 200) {
        return {
          message: res.message,
          error: new Error(res.message || 'Gagal mengunggah bukti pembayaran'),
        };
      }
      if (!res.data) {
        return {
          error: new Error('Data tidak ditemukan'),
        };
      }
      return { message: res.message, data: this.mapToDomain(res.data) };
    } catch {
      return { error: new Error('Terjadi kesalahan saat mengunggah bukti pembayaran') };
    }
  }

  async updateTransaction(
    id: string,
    data: ICreateTransactionRequest,
  ): Promise<IUsecaseResponse<ITransaction>> {
    try {
      const { ocrConfidence, ...reqData } = data;
      const res = await this.repository.update(id, reqData);
      if (res.code !== 200) {
        return {
          message: res.message,
          error: new Error(res.message || 'Gagal memperbarui pengajuan visa'),
        };
      }
      if (!res.data) {
        return {
          error: new Error('Data tidak ditemukan'),
        };
      }
      return { message: res.message, data: this.mapToDomain(res.data) };
    } catch {
      return { error: new Error('Terjadi kesalahan saat memperbarui pengajuan visa') };
    }
  }

  async processOcr(file: File, ocrType?: string): Promise<IUsecaseResponse<ILogisticsOcrResponse>> {
    try {
      const res = await this.repository.processOcr(file, ocrType);
      if (res.code !== 200) {
        return {
          message: res.message,
          error: new Error(res.message || 'Gagal memproses OCR'),
        };
      }
      if (!res.data) {
        return {
          error: new Error('Data tidak ditemukan'),
        };
      }
      return {
        message: res.message,
        data: { ...res.data, ocrType: ocrType as TOcrType },
      };
    } catch {
      return { error: new Error('Terjadi kesalahan saat memproses OCR') };
    }
  }

  async previewSubmission(
    data: ICreateTransactionRequest,
  ): Promise<IUsecaseResponse<import('../domain/transaction').IPreviewResponse>> {
    try {
      const { ocrConfidence, ...reqData } = data;
      const res = await this.repository.preview(reqData);
      if (res.code !== 200) {
        return {
          message: res.message,
          error: new Error(res.message || 'Gagal melakukan preview pengajuan visa'),
        };
      }
      if (!res.data) {
        return {
          error: new Error('Data tidak ditemukan'),
        };
      }
      return { message: res.message, data: res.data };
    } catch {
      return {
        error: new Error('Terjadi kesalahan saat melakukan preview pengajuan visa'),
      };
    }
  }

  async upload(base64: string, ocrType?: string): Promise<IUsecaseResponse<ILogisticsOcrResponse>> {
    try {
      const res = await this.repository.upload(base64, ocrType);
      if (res.code !== 200) {
        return {
          message: res.message,
          error: new Error(res.message || 'Gagal mengunggah file'),
        };
      }
      if (!res.data) {
        return {
          error: new Error('Data tidak ditemukan'),
        };
      }
      return {
        message: res.message,
        data: { ...res.data, ocrType: ocrType as TOcrType },
      };
    } catch {
      return { error: new Error('Terjadi kesalahan saat mengunggah file') };
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
