import { IUsecaseResponse } from '@/shared/domain/response.usecase';
import Logger from '@/shared/utils/logger';
import { validationMessage } from '@/shared/constants';
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
import { IAuthRepository } from '../port/repository.port';
import { IAuthUsecase } from '../port/usecase.port';

export class AuthUseCase implements IAuthUsecase {
  private repository: IAuthRepository;

  constructor(repository: IAuthRepository) {
    this.repository = repository;
  }

  verifyToken = async (
    data: IVerifyTokenRequest,
  ): Promise<IUsecaseResponse<IVerifyTokenResponse>> => {
    try {
      const result = await this.repository.verifyToken(data);
      if (result?.data) {
        return { data: result.data, message: result.message };
      }
      return {
        error: new Error(result?.message || 'Invalid token'),
        message: result?.message || 'Token verification failed',
      };
    } catch (err) {
      Logger.error(err, { location: 'ProviderAuthUseCase.verifyToken' });
      return {
        error: new Error(err instanceof Error ? err.message : 'Internal server error'),
        message: 'Failed to verify token',
      };
    }
  };

  register = async (
    data: IRegisterProviderRequest,
  ): Promise<IUsecaseResponse<IRegisterProviderResponse>> => {
    try {
      const result = await this.repository.register(data);
      if (result?.data?.id) {
        return { data: result.data, message: result.message || 'Registration successful' };
      }
      return {
        error: new Error(result?.message || validationMessage('Register').failedCreate),
        message: result?.message || validationMessage('Register').failedCreate,
      };
    } catch (err) {
      Logger.error(err, { location: 'ProviderAuthUseCase.register' });
      return {
        error: new Error(err instanceof Error ? err.message : validationMessage()[500]()),
        message: validationMessage()[500](),
      };
    }
  };

  login = async (data: ILoginRequest): Promise<IUsecaseResponse<ILoginResponse>> => {
    try {
      const result = await this.repository.login(data);
      if (result?.data?.token) {
        return { data: result.data, message: result.message };
      }
      return {
        error: new Error(result?.message || validationMessage().failedLogin('Email')),
        message: result?.message || validationMessage().failedLogin('Email'),
      };
    } catch (err) {
      Logger.error(err, { location: 'ProviderAuthUseCase.login' });
      return {
        error: new Error(err instanceof Error ? err.message : validationMessage()[500]()),
        message: validationMessage()[500](),
      };
    }
  };

  forgotPassword = async (data: IForgotPasswordRequest): Promise<IUsecaseResponse<boolean>> => {
    try {
      const result = await this.repository.forgotPassword(data);
      return { data: true, message: result?.message || 'Password reset link sent' };
    } catch (err) {
      Logger.error(err, { location: 'ProviderAuthUseCase.forgotPassword' });
      return {
        error: new Error(err instanceof Error ? err.message : 'Internal server error'),
        message: 'Failed to send reset email',
      };
    }
  };

  resetPassword = async (data: IResetPasswordRequest): Promise<IUsecaseResponse<boolean>> => {
    try {
      const result = await this.repository.resetPassword(data);
      return { data: true, message: result?.message || 'Password reset successful' };
    } catch (err) {
      Logger.error(err, { location: 'ProviderAuthUseCase.resetPassword' });
      return {
        error: new Error(err instanceof Error ? err.message : 'Internal server error'),
        message: 'Failed to reset password',
      };
    }
  };

  checkSlug = async (slug: string): Promise<IUsecaseResponse<{ available: boolean }>> => {
    try {
      const result = await this.repository.checkSlug(slug);
      return { data: { available: result.data?.available ?? false }, message: result.message };
    } catch (err) {
      Logger.error(err, { location: 'ProviderAuthUseCase.checkSlug' });
      return {
        error: new Error(err instanceof Error ? err.message : 'Internal server error'),
        message: 'Failed to check slug availability',
      };
    }
  };

  updateAgency = async (data: {
    slug: string;
    name?: string;
  }): Promise<IUsecaseResponse<Record<string, unknown>>> => {
    try {
      const result = await this.repository.updateAgency(data);
      if (result?.data) {
        return { data: result.data, message: result.message };
      }
      return {
        error: new Error(result?.message || 'Failed to update agency'),
        message: result?.message || 'Update failed',
      };
    } catch (err) {
      Logger.error(err, { location: 'ProviderAuthUseCase.updateAgency' });
      return {
        error: new Error(err instanceof Error ? err.message : 'Internal server error'),
        message: 'Failed to update agency',
      };
    }
  };

  validateSession = async (): Promise<IUsecaseResponse<{ valid: boolean }>> => {
    try {
      const result = await this.repository.validateSession();
      return { data: { valid: result.data?.valid ?? false }, message: result.message };
    } catch (err) {
      Logger.error(err, { location: 'ProviderAuthUseCase.validateSession' });
      return {
        error: new Error(err instanceof Error ? err.message : 'Internal server error'),
        message: 'Failed to validate session',
      };
    }
  };
}
