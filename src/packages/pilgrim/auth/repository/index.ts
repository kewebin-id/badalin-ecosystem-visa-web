import { endpoints } from '@/shared/constants/endpoints';
import Logger from '@/shared/utils/logger';
import { RestAPI } from '@/shared/utils/rest-api';
import {
  IForgotPasswordRequest,
  ILoginRequest,
  IRegisterRequest,
  IResetPasswordRequest,
} from '../domain/request';
import { ICheckUserResponse, ILoginResponse, IRegisterResponse } from '../domain/response';
import { IAuthRepository } from '../port/repository.port';

export class AuthRepository implements IAuthRepository {
  private restApi: RestAPI;

  constructor(api: RestAPI) {
    this.restApi = api;
  }

  login = async (body: ILoginRequest) => {
    try {
      return await this.restApi.post<ILoginResponse>({
        endpoint: endpoints.nextApi.auth.login,
        body,
        isNextApi: true,
      });
    } catch (error) {
      Logger.error(error, { location: 'AuthRepository.login' });
      throw error;
    }
  };

  register = async (body: IRegisterRequest) => {
    try {
      return await this.restApi.post<IRegisterResponse>({
        endpoint: endpoints.nextApi.auth.register,
        body,
        isNextApi: true,
      });
    } catch (error) {
      Logger.error(error, { location: 'AuthRepository.register' });
      throw error;
    }
  };

  checkIdentifier = async (identifier: string) => {
    try {
      return await this.restApi.post<ICheckUserResponse>({
        endpoint: endpoints.nextApi.auth.checkUser,
        body: { identifier },
        isNextApi: true,
      });
    } catch (error) {
      Logger.error(error, { location: 'AuthRepository.checkIdentifier' });
      throw error;
    }
  };

  socialAuth = async (token: string) => {
    try {
      return await this.restApi.post<ILoginResponse>({
        endpoint: endpoints.nextApi.auth.socialAuth,
        body: { token },
        isNextApi: true,
      });
    } catch (error) {
      Logger.error(error, { location: 'AuthRepository.socialAuth' });
      throw error;
    }
  };

  ssoLogin = async (token: string) => {
    try {
      return await this.restApi.post<ILoginResponse>({
        endpoint: endpoints.nextApi.auth.login,
        body: { token },
        isNextApi: true,
      });
    } catch (error) {
      Logger.error(error, { location: 'AuthRepository.ssoLogin' });
      throw error;
    }
  };

  forgotPassword = async (body: IForgotPasswordRequest) => {
    try {
      return await this.restApi.post<{ message: string }>({
        endpoint: endpoints.nextApi.auth.forgotPassword,
        body,
        isNextApi: true,
      });
    } catch (error) {
      Logger.error(error, { location: 'AuthRepository.forgotPassword' });
      throw error;
    }
  };

  resetPassword = async (body: IResetPasswordRequest) => {
    try {
      return await this.restApi.post<{ message: string }>({
        endpoint: endpoints.nextApi.auth.resetPassword,
        body,
        isNextApi: true,
      });
    } catch (error) {
      Logger.error(error, { location: 'AuthRepository.resetPassword' });
      throw error;
    }
  };
}
