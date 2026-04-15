import { IUsecaseResponse } from '@/shared/domain/response.usecase';
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
} from '../domain/response';

export interface IAuthUsecase {
  verifyToken(data: IVerifyTokenRequest): Promise<IUsecaseResponse<IVerifyTokenResponse>>;
  register(data: IRegisterProviderRequest): Promise<IUsecaseResponse<IRegisterProviderResponse>>;
  login(data: ILoginRequest): Promise<IUsecaseResponse<ILoginResponse>>;
  forgotPassword(data: IForgotPasswordRequest): Promise<IUsecaseResponse<boolean>>;
  resetPassword(data: IResetPasswordRequest): Promise<IUsecaseResponse<boolean>>;
  checkSlug(slug: string): Promise<IUsecaseResponse<{ available: boolean }>>;
}
