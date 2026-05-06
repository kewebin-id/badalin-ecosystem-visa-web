import { ResponseREST } from '@/shared/utils/rest-api/types';
import {
  IVerifyTokenRequest,
  IRegisterProviderRequest,
  ILoginRequest,
  IForgotPasswordRequest,
  IResetPasswordRequest,
} from '../domain/request';
import {
  IVerifyTokenResponse,
  IRegisterProviderResponse,
  ILoginResponse,
  ICheckSlugResponse,
} from '../domain/response';

export interface IAuthRepository {
  verifyToken(data: IVerifyTokenRequest): Promise<ResponseREST<IVerifyTokenResponse>>;
  register(data: IRegisterProviderRequest): Promise<ResponseREST<IRegisterProviderResponse>>;
  login(data: ILoginRequest): Promise<ResponseREST<ILoginResponse>>;
  forgotPassword(data: IForgotPasswordRequest): Promise<ResponseREST<{ message: string }>>;
  resetPassword(data: IResetPasswordRequest): Promise<ResponseREST<{ message: string }>>;
  checkSlug(slug: string): Promise<ResponseREST<ICheckSlugResponse>>;
  updateAgency(body: {
    slug: string;
    name?: string;
  }): Promise<ResponseREST<Record<string, unknown>>>;
  validateSession(slug?: string): Promise<ResponseREST<{ valid: boolean }>>;
}
