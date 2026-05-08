import { exportSubmissionToZip } from '@/shared/utils/manifest-export';
import { RestAPI } from '@/shared/utils/rest-api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  IFlightManifestPayload,
  IGetSubmissionsQuery,
  IHotelManifestPayload,
  IReviewSubmissionPayload,
  ITransportManifestPayload,
} from '../../domain/request';
import { ProviderSubmissionsRepository } from '../../repository';
import { ProviderSubmissionsUseCase } from '../../usecase';

export const useProviderSubmissionsController = () => {
  const queryClient = useQueryClient();
  const api = new RestAPI();
  const repo = new ProviderSubmissionsRepository(api);
  const usecase = new ProviderSubmissionsUseCase(repo);

  const useSubmissions = (query: IGetSubmissionsQuery) =>
    useQuery({
      queryKey: ['provider', 'submissions', query],
      queryFn: () => usecase.getSubmissions(query),
    });

  const useSubmissionDetail = (id: string) =>
    useQuery({
      queryKey: ['provider', 'submissions', id],
      queryFn: () => usecase.getSubmissionDetail(id),
      enabled: !!id,
    });

  const useVerifyPayment = () =>
    useMutation({
      mutationFn: (id: string) => usecase.verifyPayment(id),
      onSuccess: (_, id) => {
        queryClient.invalidateQueries({ queryKey: ['provider', 'submissions'] });
        queryClient.invalidateQueries({ queryKey: ['provider', 'submissions', id] });
      },
    });

  const useAddFlightManifest = () =>
    useMutation({
      mutationFn: ({ id, payloads }: { id: string; payloads: IFlightManifestPayload[] }) =>
        usecase.addFlightManifest(id, payloads),
      onSuccess: (_, { id }) => {
        queryClient.invalidateQueries({ queryKey: ['provider', 'submissions', id] });
      },
    });

  const useAddHotelManifest = () =>
    useMutation({
      mutationFn: ({ id, payloads }: { id: string; payloads: IHotelManifestPayload[] }) =>
        usecase.addHotelManifest(id, payloads),
      onSuccess: (_, { id }) => {
        queryClient.invalidateQueries({ queryKey: ['provider', 'submissions', id] });
      },
    });

  const useAddTransportManifest = () =>
    useMutation({
      mutationFn: ({ id, payloads }: { id: string; payloads: ITransportManifestPayload[] }) =>
        usecase.addTransportManifest(id, payloads),
      onSuccess: (_, { id }) => {
        queryClient.invalidateQueries({ queryKey: ['provider', 'submissions', id] });
      },
    });

  const useReviewSubmission = () =>
    useMutation({
      mutationFn: ({ id, payload }: { id: string; payload: IReviewSubmissionPayload }) =>
        usecase.reviewSubmission(id, payload),
      onSuccess: (_, { id }) => {
        queryClient.invalidateQueries({ queryKey: ['provider', 'submissions'] });
        queryClient.invalidateQueries({ queryKey: ['provider', 'submissions', id] });
      },
    });

  const useExportSubmission = () =>
    useMutation({
      mutationFn: async (id: string) => {
        const detail = await queryClient.fetchQuery({
          queryKey: ['provider', 'submissions', id],
          queryFn: () => usecase.getSubmissionDetail(id),
        });

        if (detail?.data) {
          await exportSubmissionToZip(detail.data);
        } else {
          throw new Error('Failed to fetch submission details');
        }
      },
    });

  const fetchSubmissionDetail = (id: string) =>
    queryClient.fetchQuery({
      queryKey: ['provider', 'submissions', id],
      queryFn: () => usecase.getSubmissionDetail(id),
    });

  return {
    useSubmissions,
    useSubmissionDetail,
    useVerifyPayment,
    useAddFlightManifest,
    useAddHotelManifest,
    useAddTransportManifest,
    useReviewSubmission,
    useExportSubmission,
    fetchSubmissionDetail,
  };
};
