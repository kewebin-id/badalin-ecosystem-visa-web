import { RestAPI } from '@/shared/utils/rest-api';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { signIn } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import { ROUTES, validationMessage } from '@/shared/constants';
import { AuthRepository } from '../repository';
import { AuthUseCase } from '../usecase';
import {
  ILoginRequest,
  IRegisterProviderRequest,
  IForgotPasswordRequest,
  IResetPasswordRequest,
  IVerifyTokenRequest,
} from '../domain/request';

export const useProviderAuthController = () => {
  const restApi = new RestAPI();
  const repository = new AuthRepository(restApi);
  const usecase = new AuthUseCase(repository);
  
  const router = useRouter();
  const params = useParams();
  const slug = (params?.slug as string) || 'p';

  const loginMutation = useMutation({
    mutationFn: async (payload: ILoginRequest) => {
      // 1. Call logic from UseCase to get professional error/success messages
      const authResult = await usecase.login(payload);
      
      if (authResult.error) {
        toast.error(authResult.message);
        throw new Error(authResult.message);
      }

      // 2. Establish NextAuth session
      const res = await signIn('credentials', {
        identifier: payload.identifier,
        password: payload.password,
        redirect: false,
      });

      if (res?.error) {
        toast.error(res.error);
        throw new Error(res.error);
      }

      toast.success(authResult.message);
      
      // 3. Redirect to dashboard
      // Use window.location.assign for a clean reload/redirect with fresh session
      window.location.assign(ROUTES.PROVIDER.DASHBOARD(slug));
      
      return authResult.data;
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (payload: IRegisterProviderRequest) => {
      const result = await usecase.register(payload);
      if (result.error) {
        toast.error(result.message);
        throw result.error;
      }
      toast.success(result.message);
      return result.data;
    },
  });

  const verifyTokenMutation = useMutation({
    mutationFn: async (payload: IVerifyTokenRequest) => {
      const result = await usecase.verifyToken(payload);
      if (result.error) {
        toast.error(result.message);
        throw result.error;
      }
      return result.data;
    },
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: async (payload: IForgotPasswordRequest) => {
      const result = await usecase.forgotPassword(payload);
      if (result.error) {
        toast.error(result.message);
        throw result.error;
      }
      toast.success(result.message);
      return result.data;
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async (payload: IResetPasswordRequest) => {
      const result = await usecase.resetPassword(payload);
      if (result.error) {
        toast.error(result.message);
        throw result.error;
      }
      toast.success(result.message);
      return result.data;
    },
  });

  const checkSlugMutation = useMutation({
    mutationFn: async (slug: string) => {
      const result = await usecase.checkSlug(slug);
      if (result.error) {
        throw result.error;
      }
      return result.data;
    },
  });

  return {
    loginMutation,
    registerMutation,
    verifyTokenMutation,
    forgotPasswordMutation,
    resetPasswordMutation,
    checkSlugMutation,
    slug,
  };
};
