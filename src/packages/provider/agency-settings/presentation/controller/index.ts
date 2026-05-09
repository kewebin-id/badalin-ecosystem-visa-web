import { RestAPI } from '@/shared/utils/rest-api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { IUpdateAgencyRequest } from '../../domain/request';
import { AgencySettingsRepository } from '../../repository';
import { AgencySettingsUseCase } from '../../usecase';

const api = new RestAPI();
const repo = new AgencySettingsRepository(api);
const usecase = new AgencySettingsUseCase(repo);

export const useAgencySettingsController = () => {
  const queryClient = useQueryClient();

  const useAgencyData = () =>
    useQuery({
      queryKey: ['provider', 'agency-settings'],
      queryFn: () => usecase.getAgencyData(),
    });

  const useUpdateAgency = (t: (key: string) => string) =>
    useMutation({
      mutationFn: (data: IUpdateAgencyRequest) => usecase.updateAgencyData(data),
      onSuccess: (res) => {
        if (!res.error) {
          toast.success(t('updateSuccess'));
          queryClient.invalidateQueries({ queryKey: ['provider', 'agency-settings'] });

          if (res.data?.newToken && res.data?.slug) {
            window.location.href = `/${res.data.slug}/settings?success=true`;
          }
        } else {
          toast.error(res.message || t('updateError'));
        }
      },
      onError: (error: Error) => {
        toast.error(error.message || t('updateError'));
      },
    });

  const useCheckSlug = () =>
    useMutation({
      mutationFn: (slug: string) => usecase.checkSlugAvailability(slug),
    });

  return {
    useAgencyData,
    useUpdateAgency,
    useCheckSlug,
  };
};
