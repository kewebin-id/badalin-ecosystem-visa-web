import { ROUTES } from '@/shared/constants';
import { useAuth } from '@/shared/hooks';
import { RestAPI } from '@/shared/utils/rest-api';
import { useMutation } from '@tanstack/react-query';
import { signIn } from 'next-auth/react';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';
import {
  IForgotPasswordRequest,
  ILoginRequest,
  IRegisterProviderRequest,
  IResetPasswordRequest,
  IVerifyTokenRequest,
} from '../domain/request';
import { AuthRepository } from '../repository';
import { AuthUseCase } from '../usecase';

export const useProviderAuthController = () => {
  const restApi = new RestAPI();
  const repository = new AuthRepository(restApi);
  const usecase = new AuthUseCase(repository);
  const { user, update } = useAuth();

  const params = useParams();
  const slug = (params?.slug as string) || 'p';

  const loginMutation = useMutation({
    mutationFn: async (payload: ILoginRequest) => {
      const { encryptClient } = await import('@/shared/utils/crypto-client');
      const encryptedPayload = {
        identifier: await encryptClient(payload.identifier),
        password: await encryptClient(payload.password),
      };

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
      window.location.assign(ROUTES.PROVIDER.DASHBOARD(slug));
      return res;
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
    updateAgencyMutation: useMutation({
      mutationFn: async (payload: { slug: string; name?: string }) => {
        const result = await usecase.updateAgency(payload);
        if (result.error) {
          toast.error(result.message);
          throw result.error;
        }

        const res = result.data;

        await update({
          user: {
            ...user,
            token: res.newToken || user?.token,
            agencySlug: res.slug,
            agency: {
              ...user?.agency,
              slug: res.slug,
              name: res.name,
              isSlugSetup: true,
            },
          },
        });

        toast.success(result.message);

        window.location.assign(ROUTES.PROVIDER.DASHBOARD(res.slug));

        return result.data;
      },
    }),
    slug,
  };
};
