import { validationMessage } from '@/shared/constants';
import axios, { AxiosInstance, AxiosRequestConfig, HttpStatusCode } from 'axios';
import { signOut } from 'next-auth/react';
import { serializeParam } from '../serialize';
import { RequestAPI, ResponseREST } from './types';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const http: AxiosInstance = axios.create({
  baseURL: process.env.BASE_API_URL,
  timeout: parseInt(process.env.TIMEOUT ?? '60000'),
  withCredentials: true,
});

http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const data = error.response?.data as ResponseREST<any>;

      if (status === 401 || data?.code === 401 || data?.code === '401') {
        if (typeof window !== 'undefined') {
          signOut({ callbackUrl: '/', redirect: true });
        }
      }
    }
    return Promise.reject(error);
  },
);

export class RestAPI implements RequestAPI {
  private http: AxiosInstance;
  private httpDefault: AxiosInstance = axios.create({
    timeout: parseInt(process.env.TIMEOUT ?? '60000'),
  });

  constructor(httpInstance?: AxiosInstance, token?: string, userId?: string) {
    this.http = httpInstance ?? this.httpDefault;
    
    if (token) {
      this.http.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    if (userId) {
      this.http.defaults.headers.common['x-user-id'] = userId;
    }
  }

  private getBaseURL(isNextApi?: boolean, config?: AxiosRequestConfig): string {
    if (config?.baseURL) return config.baseURL;

    const isServer = typeof window === 'undefined';
    const serverBaseURL = process.env.NEXTAUTH_URL || process.env.BASE_URL || '';
    
    return isNextApi 
      ? (isServer ? serverBaseURL : '') 
      : (process.env.BASE_API_URL || '');
  }

  async get<T extends Partial<object> | undefined | void>({
    endpoint,
    config,
    queryParam,
    isNextApi,
  }: {
    endpoint: string;
    queryParam?: object;
    config?: AxiosRequestConfig;
    isNextApi?: boolean;
  }): Promise<ResponseREST<T>> {
    try {
      let url = endpoint;
      if (queryParam && Object.keys(queryParam).length > 0) {
        url = `${url}${url.includes('?') ? '&' : '?'}${serializeParam(queryParam)}`;
      }

      const res = await this.http.get(url, {
        ...config,
        baseURL: this.getBaseURL(isNextApi, config),
      });

      return res.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const errData = error.response?.data as ResponseREST<T>;
        if (error?.code === 'ECONNABORTED') {
          return { code: 408, message: validationMessage()[408]() };
        }
        return { 
          code: errData?.code || error.response?.status || 500, 
          message: errData?.message || error.message || validationMessage()[500](),
          data: errData?.data
        };
      }
      return { code: 500, message: validationMessage()[500]() };
    }
  }

  async post<T extends Partial<object> | undefined | void>({
    endpoint,
    body,
    config,
    queryParam,
    isNextApi,
  }: {
    endpoint: string;
    body?: object;
    queryParam?: object;
    config?: AxiosRequestConfig;
    isNextApi?: boolean;
  }): Promise<ResponseREST<T>> {
    const maxRetries = 3;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        if (attempt > 0) {
          await sleep(1000 * attempt);
        }

        let url = endpoint;
        if (queryParam && Object.keys(queryParam).length > 0) {
          url = `${url}${url.includes('?') ? '&' : '?'}${serializeParam(queryParam)}`;
        }

        const res = await this.http.post(url, body, {
          ...config,
          baseURL: this.getBaseURL(isNextApi, config),
        });

        if (res.status === HttpStatusCode.Ok || res.status === HttpStatusCode.Created) {
          return res.data;
        }

        return { ...res.data, code: res.status || 500 };
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          const errData = error.response?.data as ResponseREST<T>;
          if (error?.code === 'ECONNABORTED') {
            return { code: 408, message: validationMessage()[408]() };
          }
          if (error?.code === 'ECONNRESET' || error?.code === 'ETIMEDOUT' || !error.response) {
            if (attempt < maxRetries - 1) continue;
          }
          return {
            code: errData?.code || error.response?.status || 500,
            message: errData?.message || error.message || validationMessage()[500](),
            data: errData?.data,
          };
        }
        if (attempt < maxRetries - 1) continue;
        return { code: 500, message: validationMessage()[500]() };
      }
    }
    return { code: 500, message: validationMessage()[500]() };
  }

  async put<T extends Partial<object> | undefined | void>({
    endpoint,
    body,
    config,
    queryParam,
    isNextApi,
  }: {
    endpoint: string;
    body?: object;
    queryParam?: object;
    config?: AxiosRequestConfig;
    isNextApi?: boolean;
  }): Promise<ResponseREST<T>> {
    try {
      let url = endpoint;
      if (queryParam && Object.keys(queryParam).length > 0) {
        url = `${url}${url.includes('?') ? '&' : '?'}${serializeParam(queryParam)}`;
      }

      const res = await this.http.put(url, body, {
        ...config,
        baseURL: this.getBaseURL(isNextApi, config),
      });

      if (res.status !== HttpStatusCode.Ok) {
        return { ...res.data, code: res.status || 500 };
      }

      return res.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const errData = error.response?.data as ResponseREST<T>;
        if (error?.code === 'ECONNABORTED') {
          return { code: 408, message: validationMessage()[408]() };
        }
        return { 
          code: errData?.code || error.response?.status || 500, 
          message: errData?.message || error.message || validationMessage()[500](),
          data: errData?.data
        };
      }
      return { code: 500, message: validationMessage()[500]() };
    }
  }

  async patch<T extends Partial<object> | undefined | void>({
    endpoint,
    body,
    config,
    queryParam,
    isNextApi,
  }: {
    endpoint: string;
    body?: object;
    queryParam?: object;
    config?: AxiosRequestConfig;
    isNextApi?: boolean;
  }): Promise<ResponseREST<T>> {
    const maxRetries = 3;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        if (attempt > 0) {
          await sleep(1000 * attempt);
        }

        let url = endpoint;
        if (queryParam && Object.keys(queryParam).length > 0) {
          url = `${url}${url.includes('?') ? '&' : '?'}${serializeParam(queryParam)}`;
        }

        const res = await this.http.patch(url, body, {
          ...config,
          baseURL: this.getBaseURL(isNextApi, config),
        });

        if (res.status !== HttpStatusCode.Ok) {
          return { ...res.data, code: res.status || 500 };
        }

        return res.data;
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          const errData = error.response?.data as ResponseREST<T>;
          if (error?.code === 'ECONNABORTED') {
            return { code: 408, message: validationMessage()[408]() };
          }
          if (error?.code === 'ECONNRESET' || error?.code === 'ETIMEDOUT' || !error.response) {
            if (attempt < maxRetries - 1) continue;
          }
          return { 
            code: errData?.code || error.response?.status || 500, 
            message: errData?.message || error.message || validationMessage()[500](),
            data: errData?.data
          };
        }
        if (attempt < maxRetries - 1) continue;
        return { code: 500, message: validationMessage()[500]() };
      }
    }
    return { code: 500, message: validationMessage()[500]() };
  }

  async delete<T extends Partial<object> | undefined | void>({
    endpoint,
    bodyparam,
    config,
    queryParam,
    isNextApi,
  }: {
    endpoint: string;
    bodyparam?: object;
    queryParam?: object;
    config?: AxiosRequestConfig;
    isNextApi?: boolean;
  }): Promise<ResponseREST<T>> {
    try {
      let url = endpoint;
      if (queryParam && Object.keys(queryParam).length > 0) {
        url = `${url}${url.includes('?') ? '&' : '?'}${serializeParam(queryParam)}`;
      }

      const res = await this.http.delete(url, {
        ...config,
        data: bodyparam,
        baseURL: this.getBaseURL(isNextApi, config),
      });

      if (res.status !== HttpStatusCode.Ok) {
        return { ...res.data, code: res.status || 500 };
      }

      return res.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const errData = error.response?.data as ResponseREST<T>;
        if (error?.code === 'ECONNABORTED') {
          return { code: 408, message: validationMessage()[408]() };
        }
        return { 
          code: errData?.code || error.response?.status || 500, 
          message: errData?.message || error.message || validationMessage()[500](),
          data: errData?.data
        };
      }
      return { code: 500, message: validationMessage()[500]() };
    }
  }
}
