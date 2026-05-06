import { endpoints } from '@/shared/constants/endpoints';
import { RequestAPI } from '@/shared/utils/rest-api/types';
import { ResponseREST } from '@/shared/utils/rest-api/types';
import {
  IPaginationParams,
  IUploadResponse,
  IApiFamilyMember,
  IApiPaginatedPilgrims,
  IApiCreateMemberRequest,
  IApiUpdateMemberRequest,
} from '../domain/member';
import { TOcrType } from '../../transaction/domain/transaction';
import { IManagementRepository } from '../port/repository.port';

export class ManagementRepository implements IManagementRepository {
  constructor(private readonly restApi: RequestAPI) {}

  async findAll(params?: IPaginationParams): Promise<ResponseREST<IApiPaginatedPilgrims>> {
    return this.restApi.get({
      endpoint: endpoints.nextApi.visa.pilgrims.base,
      queryParam: params,
      isNextApi: true,
    });
  }

  async findById(id: string): Promise<ResponseREST<IApiFamilyMember>> {
    return this.restApi.get({
      endpoint: endpoints.nextApi.visa.pilgrims.detail(id),
      isNextApi: true,
    });
  }

  async create(data: IApiCreateMemberRequest): Promise<ResponseREST<IApiFamilyMember>> {
    return this.restApi.post({
      endpoint: endpoints.nextApi.visa.pilgrims.base,
      body: data,
      isNextApi: true,
    });
  }

  async update(data: IApiUpdateMemberRequest): Promise<ResponseREST<IApiFamilyMember>> {
    const { id, ...body } = data;
    return this.restApi.put({
      endpoint: endpoints.nextApi.visa.pilgrims.detail(id),
      body,
      isNextApi: true,
    });
  }

  async delete(id: string): Promise<ResponseREST<{ success: boolean }>> {
    return this.restApi.delete({
      endpoint: endpoints.nextApi.visa.pilgrims.detail(id),
      isNextApi: true,
    });
  }

  async uploadFile(file: File, bucket: string): Promise<ResponseREST<IUploadResponse>> {
    try {
      const base64 = await this.fileToBase64(file);
      return await this.restApi.post<IUploadResponse>({
        endpoint: endpoints.nextApi.visa.upload,
        body: {
          file: base64,
          bucket,
          fileName: file.name,
        },
        isNextApi: true,
      });
    } catch {
      return { code: 500, message: 'Gagal mengunggah file' };
    }
  }

  async processOcr(file: File, type: 'passport' | 'ktp'): Promise<ResponseREST<IUploadResponse>> {
    try {
      const base64 = await this.fileToBase64(file);
      return await this.restApi.post<IUploadResponse>({
        endpoint: endpoints.nextApi.visa.upload,
        body: {
          file: base64,
          isOcr: true,
          ocrType: type.toUpperCase() as TOcrType,
        },
        isNextApi: true,
      });
    } catch {
      return { code: 500, message: 'Gagal memproses file' };
    }
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
