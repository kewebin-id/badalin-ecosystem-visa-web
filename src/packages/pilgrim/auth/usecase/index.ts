import { IUsecaseResponse } from '@/shared/domain/response.usecase';
import Logger from '@/shared/utils/logger';
import { validationMessage } from '@/shared/constants';
import { ILoginResponse, IRegisterResponse } from '../domain/response';
import {
  ILoginRequest,
  IRegisterRequest,
  IForgotPasswordRequest,
  IResetPasswordRequest,
} from '../domain/request';
import { IAuthRepository } from '../port/repository.port';
import { IAuthUsecase } from '../port/usecase.port';

export class AuthUseCase implements IAuthUsecase {
  private repository: IAuthRepository;

  constructor(repository: IAuthRepository) {
    this.repository = repository;
  }

  login = async (data: ILoginRequest): Promise<IUsecaseResponse<ILoginResponse>> => {
    try {
      const result = await this.repository.login(data);

      if (result?.data?.token) {
        return {
          data: result.data,
          message: result.message,
        };
      }

      return {
        error: new Error(result?.message || validationMessage().failedLogin('Email')),
        message: result?.message || validationMessage().failedLogin('Email'),
      };
    } catch (err) {
      Logger.error(err, { location: 'AuthUseCase.login' });
      return {
        error: new Error(err instanceof Error ? err.message : validationMessage()[500]()),
        message: validationMessage()[500](),
      };
    }
  };

  register = async (data: IRegisterRequest): Promise<IUsecaseResponse<IRegisterResponse>> => {
    try {
      const result = await this.repository.register(data);

      if (result?.data?.id) {
        return {
          data: result.data,
          message: result.message || 'Registration successful',
        };
      }

      return {
        error: new Error(result?.message || validationMessage('Register').failedCreate),
        message: result?.message || validationMessage('Register').failedCreate,
      };
    } catch (err) {
      Logger.error(err, { location: 'AuthUseCase.register' });
      return {
        error: new Error(err instanceof Error ? err.message : validationMessage()[500]()),
        message: validationMessage()[500](),
      };
    }
  };

  checkIdentifier = async (
    identifier: string,
  ): Promise<IUsecaseResponse<{ exists: boolean; type: 'login' | 'register' }>> => {
    try {
      const result = await this.repository.checkIdentifier(identifier);
      const exists = result.data?.exists ?? false;

      return {
        data: {
          exists,
          type: exists ? 'login' : 'register',
        },
        message: exists ? 'Account found' : 'Account not found. Please register.',
      };
    } catch (err) {
      Logger.error(err, { location: 'AuthUseCase.checkIdentifier' });
      return {
        error: new Error(err instanceof Error ? err.message : 'Internal server error'),
        message: 'Failed to check account',
      };
    }
  };

  socialAuth = async (token: string): Promise<IUsecaseResponse<ILoginResponse>> => {
    try {
      if (!this.repository.socialAuth) {
        throw new Error('Social authentication not supported by repository');
      }
      const result = await this.repository.socialAuth(token);
      return { data: result.data as ILoginResponse, message: result.message };
    } catch (err) {
      Logger.error(err, { location: 'AuthUseCase.socialAuth' });
      return {
        error: new Error(err instanceof Error ? err.message : 'Internal server error'),
        message: 'Social authentication failed',
      };
    }
  };

  forgotPassword = async (data: IForgotPasswordRequest): Promise<IUsecaseResponse<boolean>> => {
    try {
      const result = await this.repository.forgotPassword?.(data);
      return { data: true, message: result?.message || 'Password reset link sent' };
    } catch (err) {
      Logger.error(err, { location: 'AuthUseCase.forgotPassword' });
      return {
        error: new Error(err instanceof Error ? err.message : 'Internal server error'),
        message: 'Failed to send reset email',
      };
    }
  };

  resetPassword = async (data: IResetPasswordRequest): Promise<IUsecaseResponse<boolean>> => {
    try {
      const result = await this.repository.resetPassword?.(data);
      return { data: true, message: result?.message || 'Password reset successful' };
    } catch (err) {
      Logger.error(err, { location: 'AuthUseCase.resetPassword' });
      return {
        error: new Error(err instanceof Error ? err.message : 'Internal server error'),
        message: 'Failed to reset password',
      };
    }
  };
}
