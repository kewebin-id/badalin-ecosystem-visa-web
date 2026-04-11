import { ResponseREST } from '@/shared/utils/rest-api/types';
import { ILoginRequest, IRegisterRequest, IForgotPasswordRequest, IResetPasswordRequest } from '../domain/request';
import { ILoginResponse, IRegisterResponse, ICheckUserResponse, ISearchUserResponse } from '../domain/response';

/**
 * Auth repository interface for API calls
 */
export interface IAuthRepository {
  login(data: ILoginRequest): Promise<ResponseREST<ILoginResponse>>;
  register(data: IRegisterRequest): Promise<ResponseREST<IRegisterResponse>>;
  checkIdentifier(identifier: string): Promise<ResponseREST<ICheckUserResponse>>;
  
  // Legacy/Other methods (keep for now to avoid breaking other parts if they use them)
  socialAuth?(token: string): Promise<ResponseREST<ILoginResponse>>;
  verify?(token: string): Promise<ResponseREST<object>>;
  ssoLogin?(token: string): Promise<ResponseREST<ILoginResponse>>;
  searchUsers?(params?: {
    query?: string;
    employeeId?: string;
    email?: string;
    fullName?: string;
    roles?: string;
  }): Promise<ResponseREST<ISearchUserResponse[]>>;
  forgotPassword?(data: IForgotPasswordRequest): Promise<ResponseREST<{ message: string }>>;
  resetPassword?(data: IResetPasswordRequest): Promise<ResponseREST<{ message: string }>>;
}
