import { RestAPI } from '@/shared/utils/rest-api';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ILoginRequest, IRegisterRequest, IResetPasswordRequest } from '../domain/request';
import { AuthRepository } from '../repository';
import { AuthUseCase } from '../usecase';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ROUTES, validationMessage } from '@/shared/constants';

export const useAuthController = () => {
  const restApi = new RestAPI();
  const repository = new AuthRepository(restApi);
  const usecase = new AuthUseCase(repository);
  const router = useRouter();

  const registerMutation = useMutation({
    mutationFn: async (payload: IRegisterRequest) => {
      const result = await usecase.register(payload);
      if (result?.error) {
        toast.error(result.message || validationMessage('Register')[500]());
        throw new Error(result.message);
      }
      toast.success(result.message);
      return result;
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (payload: ILoginRequest) => {
      // Encrypt credentials before sending to server
      const { encryptClient } = await import('@/shared/utils/crypto-client');
      const encryptedPayload = {
        identifier: await encryptClient(payload.identifier),
        password: await encryptClient(payload.password),
      };

      // Proceed with session establishment directly
      const res = await signIn('credentials', {
        identifier: encryptedPayload.identifier,
        password: encryptedPayload.password,
        redirect: false,
      });

      if (res?.error) {
        toast.error(res.error);
        throw new Error(res.error);
      }

      toast.success('Login successful');
      window.location.assign(ROUTES.PILGRIM.DASHBOARD);
      return res;
    },
  });

  const checkIdentifierMutation = useMutation({
    mutationFn: async (identifier: string) => {
      const result = await usecase.checkIdentifier(identifier);
      if (result?.error) {
        toast.error(result.message || validationMessage('Account')[500]());
        throw new Error(result.message);
      }
      return result.data;
    },
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: async (identifier: string) => {
      const result = await usecase.forgotPassword({ identifier });
      if (result?.error) {
        toast.error(result.message || validationMessage('Email')[500]());
        throw new Error(result.message);
      }
      toast.success(result.message || validationMessage('Email').saved);
      return result.data;
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async (data: IResetPasswordRequest) => {
      const result = await usecase.resetPassword(data);
      if (result?.error) {
        toast.error(result.message || validationMessage('Password')[500]());
        throw new Error(result.message);
      }
      toast.success(result.message || validationMessage('Password').updated);
      return result.data;
    },
  });

  return {
    registerMutation,
    loginMutation,
    checkIdentifierMutation,
    forgotPasswordMutation,
    resetPasswordMutation,
  };
};
