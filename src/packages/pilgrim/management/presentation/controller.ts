import { ROUTES } from '@/shared/constants/routes';
import { RestAPI } from '@/shared/utils/rest-api';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { IFamilyMember, INusukCompatibility, IPaginationParams, TRelation, MARITAL_STATUS_MAP } from '../domain/member';
import {
  getFormSchema,
  ICreateMemberRequest,
  IUpdateMemberRequest,
  TManagementForm,
} from '../domain/request';
import { ManagementRepository } from '../repository';
import { ManagementUseCase } from '../usecase';

const api = new RestAPI();
const repository = new ManagementRepository(api);
const useCase = new ManagementUseCase(repository);

export const useManagementController = () => {
  const t = useTranslations('PilgrimManagement');
  const queryClient = useQueryClient();
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const formSchema = useMemo(() => getFormSchema(t), [t]);

  const useMembers = (paginationParams?: IPaginationParams) => {
    const membersRes = useQuery({
      queryKey: ['family-members', paginationParams],
      queryFn: () => useCase.getMembers(paginationParams),
      staleTime: 0,
    });
    const members = useMemo(() => membersRes?.data?.data?.items || [], [membersRes]);
    const pageCount = useMemo(() => membersRes?.data?.data?.totalPages || 0, [membersRes]);
    return { ...membersRes, members, pageCount };
  };

  const useMemberDetail = (memberId: string | null) =>
    useQuery({
      queryKey: ['family-member', memberId],
      queryFn: () => useCase.getMemberDetail(memberId!),
      enabled: !!memberId,
      staleTime: 0,
    });

  const createMemberMutation = useMutation({
    mutationFn: (data: ICreateMemberRequest) => useCase.createMember(data),
    onSuccess: (res) => {
      if (!res.error) {
        queryClient.invalidateQueries({ queryKey: ['family-members'] });
        toast.success(res.message || t('addMemberSuccess'));
        router.push(ROUTES.PILGRIM.FAMILY.INDEX);
      } else {
        toast.error(res.message || res.error.message || t('addMemberError'));
      }
    },
    onError: (err: Error) => toast.error(err.message || t('systemError')),
  });

  const updateMemberMutation = useMutation({
    mutationFn: (data: IUpdateMemberRequest) => useCase.updateMember(data),
    onSuccess: (res) => {
      if (!res.error) {
        queryClient.invalidateQueries({ queryKey: ['family-members'] });
        toast.success(res.message || t('updateMemberSuccess'));
        router.push(ROUTES.PILGRIM.FAMILY.INDEX);
      } else {
        toast.error(res.message || res.error.message || t('updateMemberError'));
      }
    },
    onError: (err: Error) => toast.error(err.message || t('systemError')),
  });

  const deleteMemberMutation = useMutation({
    mutationFn: (memberId: string) => useCase.deleteMember(memberId),
    onSuccess: (res) => {
      if (!res.error) {
        queryClient.invalidateQueries({ queryKey: ['family-members'] });
        toast.success(res.message || t('deleteMemberSuccess'));
      } else {
        toast.error(res.message || res.error.message || t('deleteMemberError'));
      }
    },
    onError: (err: Error) => toast.error(err.message || t('systemError')),
  });

  return {
    id,
    useMembers,
    useMemberDetail,
    updateMemberMutation,
    useCreateMember: () => createMemberMutation,
    useUpdateMember: (options?: { redirectUrl?: string }) => { return useMutation({
    mutationFn: (data: IUpdateMemberRequest) => useCase.updateMember(data),
    onSuccess: (res) => {
      if (!res.error) {
        queryClient.invalidateQueries({ queryKey: ['family-members'] });
        queryClient.invalidateQueries({ queryKey: ['visa-transaction'] });
        queryClient.invalidateQueries({ queryKey: ['provider-submissions'] });
        toast.success(res.message || t('updateMemberSuccess'));
        router.push(options?.redirectUrl || ROUTES.PILGRIM.FAMILY.INDEX);
      } else {
        toast.error(res.message || res.error.message || t('updateMemberError'));
      }
    },
    onError: (err: Error) => toast.error(err.message || t('systemError')),
  }); },
    useDeleteMember: () => deleteMemberMutation,
    useProcessOcr: (
      onOcrSuccess: (
        data: Partial<IFamilyMember> & {
          confidence: number;
          publicUrl?: string;
          nusuk_compatibility?: INusukCompatibility;
        },
      ) => void,
      onOcrError?: (type: 'passport' | 'ktp') => void,
    ) =>
      // eslint-disable-next-line react-hooks/rules-of-hooks
      useMutation({
        mutationFn: ({ file, type }: { file: File; type: 'passport' | 'ktp' }) =>
          useCase.processOcr(file, type),
        onSuccess: (res, variables) => {
          if (res.data) {
            onOcrSuccess(res.data);
          } else {
            toast.error(res.message || t('ocrReadError'));
            onOcrError?.(variables.type);
          }
        },
        onError: (_err, variables) => {
          toast.error(t('ocrReadError'));
          onOcrError?.(variables.type);
        },
      }),
    formSchema,
  };
};

export const useManagementForm = (
  initialData?: Partial<IFamilyMember>,
  options?: { mode?: 'all' | 'onChange' | 'onBlur' | 'onSubmit' | 'onTouched' },
) => {
  const t = useTranslations('PilgrimManagement');
  const formSchema = useMemo(() => getFormSchema(t), [t]);

  const form = useForm<TManagementForm>({
    resolver: zodResolver(formSchema),
    mode: options?.mode ?? (initialData ? 'all' : undefined),
    values: useMemo(() => {
      const normalizedRelation = initialData?.relation as TRelation;
      const normalizedMaritalStatus = initialData?.maritalStatus
        ? MARITAL_STATUS_MAP[initialData.maritalStatus] || initialData.maritalStatus
        : '';
      return {
        fullName: initialData?.fullName || '',
        passportNumber: initialData?.passportNumber || '',
        passportExpiry: initialData?.passportExpiry || '',
        dob: initialData?.dob || '',
        nik: initialData?.nik || '',
        gender: (initialData?.gender as 'Male' | 'Female') || 'Male',
        maritalStatus: normalizedMaritalStatus,
        relation: normalizedRelation || 'SELF',
        ocrConfidence: initialData?.ocrConfidence || 0,
        selfieUrl: initialData?.selfieUrl || '',
        ktpUrl: initialData?.ktpUrl || '',
        passportUrl: initialData?.passportUrl || '',
        bukuNikahUrl: initialData?.bukuNikahUrl || '',
        akteKelahiranUrl: initialData?.akteKelahiranUrl || '',
        employmentCertificateUrl: initialData?.employmentCertificateUrl || '',
      };
    }, [initialData]),
  });

  return form;
};
