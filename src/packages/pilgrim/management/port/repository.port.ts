import { ResponseREST } from '@/shared/utils/rest-api/types';
import {
  IFamilyMember,
  ICreateMemberRequest,
  IUpdateMemberRequest,
  IPaginatedPilgrims,
  IPaginationParams,
  IUploadResponse,
  IApiFamilyMember,
  IApiPaginatedPilgrims,
  IApiCreateMemberRequest,
  IApiUpdateMemberRequest,
} from '../domain/member';

export interface IManagementRepository {
  findAll(params?: IPaginationParams): Promise<ResponseREST<IApiPaginatedPilgrims>>;
  findById(id: string): Promise<ResponseREST<IApiFamilyMember>>;
  create(data: IApiCreateMemberRequest): Promise<ResponseREST<IApiFamilyMember>>;
  update(data: IApiUpdateMemberRequest): Promise<ResponseREST<IApiFamilyMember>>;
  delete(id: string): Promise<ResponseREST<{ success: boolean }>>;
  uploadFile(file: File, bucket?: string): Promise<ResponseREST<IUploadResponse>>;
  processOcr(file: File, type: 'passport' | 'ktp'): Promise<ResponseREST<IUploadResponse>>;
}
