import { IUsecaseResponse } from '@/shared/domain/response.usecase';
import { ILoginResponse, IRegisterResponse } from '../domain/response';
import { ILoginRequest, IRegisterRequest, IForgotPasswordRequest, IResetPasswordRequest } from '../domain/request';

export interface IAuthUsecase {
  login(data: ILoginRequest): Promise<IUsecaseResponse<ILoginResponse>>;
  register(data: IRegisterRequest): Promise<IUsecaseResponse<IRegisterResponse>>;
  checkIdentifier?(identifier: string): Promise<IUsecaseResponse<{ exists: boolean; type: 'login' | 'register' }>>;
  socialAuth?(token: string): Promise<IUsecaseResponse<ILoginResponse>>;
  verify?(token: string): Promise<IUsecaseResponse<void>>;
  forgotPassword?(data: IForgotPasswordRequest): Promise<IUsecaseResponse<boolean>>;
  resetPassword?(data: IResetPasswordRequest): Promise<IUsecaseResponse<boolean>>;
}
