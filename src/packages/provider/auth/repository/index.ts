import { endpoints } from '@/shared/constants/endpoints';
import Logger from '@/shared/utils/logger';
import { RestAPI } from '@/shared/utils/rest-api';
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
import { IAuthRepository } from '../port/repository.port';

export class AuthRepository implements IAuthRepository {
  private restApi: RestAPI;

  constructor(api: RestAPI) {
    this.restApi = api;
  }

  verifyToken = async (body: IVerifyTokenRequest) => {
    try {
      return await this.restApi.post<IVerifyTokenResponse>({
        endpoint: endpoints.nextApi.provider.auth.verifyToken,
        body,
        isNextApi: true,
      });
    } catch (error) {
      Logger.error(error, { location: 'ProviderAuthRepository.verifyToken' });
      throw error;
    }
  };

  register = async (body: IRegisterProviderRequest) => {
    try {
      return await this.restApi.post<IRegisterProviderResponse>({
        endpoint: endpoints.nextApi.provider.auth.register,
        body,
        isNextApi: true,
      });
    } catch (error) {
      Logger.error(error, { location: 'ProviderAuthRepository.register' });
      throw error;
    }
  };

  login = async (body: ILoginRequest) => {
    try {
      return await this.restApi.post<ILoginResponse>({
        endpoint: endpoints.nextApi.provider.auth.login,
        body,
        isNextApi: true,
      });
    } catch (error) {
      Logger.error(error, { location: 'ProviderAuthRepository.login' });
      throw error;
    }
  };

  forgotPassword = async (body: IForgotPasswordRequest) => {
    try {
      return await this.restApi.post<{ message: string }>({
        endpoint: endpoints.nextApi.provider.auth.forgotPassword,
        body,
        isNextApi: true,
      });
    } catch (error) {
      Logger.error(error, { location: 'ProviderAuthRepository.forgotPassword' });
      throw error;
    }
  };

  resetPassword = async (body: IResetPasswordRequest) => {
    try {
      return await this.restApi.post<{ message: string }>({
        endpoint: endpoints.nextApi.provider.auth.resetPassword,
        body,
        isNextApi: true,
      });
    } catch (error) {
      Logger.error(error, { location: 'ProviderAuthRepository.resetPassword' });
      throw error;
    }
  };

  checkSlug = async (slug: string) => {
    try {
      return await this.restApi.get<ICheckSlugResponse>({
        endpoint: endpoints.nextApi.provider.agency.checkSlug,
        queryParam: { slug },
        isNextApi: true,
      });
    } catch (error) {
      Logger.error(error, { location: 'ProviderAuthRepository.checkSlug' });
      throw error;
    }
  };

  updateAgency = async (body: { slug: string; name?: string }) => {
    try {
      return await this.restApi.patch<any>({
        endpoint: endpoints.nextApi.provider.agency.base,
        body,
        isNextApi: true,
      });
    } catch (error) {
      Logger.error(error, { location: 'ProviderAuthRepository.updateAgency' });
      throw error;
    }
  };

  validateSession = async () => {
    try {
      return await this.restApi.get<{ valid: boolean }>({
        endpoint: endpoints.nextApi.provider.agency.validateSession,
        isNextApi: true,
      });
    } catch (error) {
      Logger.error(error, { location: 'ProviderAuthRepository.validateSession' });
      throw error;
    }
  };
}
