import { IUsecaseResponse } from '@/shared/domain/response.usecase';
import { IFamilyMember, ICreateMemberRequest, IUpdateMemberRequest, IPaginatedPilgrims, IPaginationParams } from '../domain/member';

export interface IManagementUseCase {
  getMembers(params?: IPaginationParams): Promise<IUsecaseResponse<IPaginatedPilgrims>>;
  getMemberDetail(id: string): Promise<IUsecaseResponse<IFamilyMember>>;
  createMember(data: ICreateMemberRequest): Promise<IUsecaseResponse<IFamilyMember>>;
  updateMember(data: IUpdateMemberRequest): Promise<IUsecaseResponse<IFamilyMember>>;
  deleteMember(id: string): Promise<IUsecaseResponse<boolean>>;
  processOcr(file: File, type: 'passport' | 'ktp'): Promise<IUsecaseResponse<Partial<IFamilyMember> & { confidence: number; publicUrl?: string }>>;
}
