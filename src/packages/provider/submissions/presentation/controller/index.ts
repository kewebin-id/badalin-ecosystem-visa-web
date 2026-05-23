import { exportSubmissionToZip } from '@/shared/utils/manifest-export';
import { RestAPI } from '@/shared/utils/rest-api';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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
      placeholderData: keepPreviousData,
    });

  const useSubmissionDetail = (id: string) =>
    useQuery({
      queryKey: ['provider', 'submissions', id],
      queryFn: () => usecase.getSubmissionDetail(id),
      enabled: !!id,
    });

  const useLOV = (type: 'payment-status' | 'review-status') =>
    useQuery({
      queryKey: ['provider', 'submissions', 'lov', type],
      queryFn: () => usecase.getLOV(type),
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

  const useSubmitVisas = () =>
    useMutation({
      mutationFn: async ({
        id,
        visaFiles,
      }: {
        id: string;
        visaFiles: Record<string, { name: string; base64: string }[]>;
      }) => {
        // Step 1: Upload files and get URLs
        const uploadRes = await usecase.uploadVisas(id, visaFiles);
        if (uploadRes.error || !uploadRes.data) {
          throw uploadRes.error || new Error(uploadRes.message || 'Failed to upload visas');
        }

        // Step 2: Submit with URLs to update status to ISSUED
        const submitRes = await usecase.submitVisas(id, uploadRes.data);
        if (submitRes.error) {
          throw submitRes.error;
        }

        return submitRes.data;
      },
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
    useSubmitVisas,
    useExportSubmission,
    fetchSubmissionDetail,
    useLOV,
  };
};
