import { ROUTES } from '@/shared/constants/routes';
import { RestAPI } from '@/shared/utils/rest-api';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import {
  ICreateMemberRequest,
  IFamilyMember,
  INusukCompatibility,
  IPaginationParams,
  IUpdateMemberRequest,
  TRelation,
} from '../domain/member';
import { ManagementRepository } from '../repository';
import { ManagementUseCase } from '../usecase';

const api = new RestAPI();
const repository = new ManagementRepository(api);
const useCase = new ManagementUseCase(repository);

const getFormSchema = (t: (key: string) => string) =>
  z.object({
    fullName: z.string().min(3, t('validation.nameMin')),
    passportNumber: z.string().min(5, t('validation.passportInvalid')),
    passportExpiry: z.string().min(1, t('validation.required')),
    dob: z.string().min(1, t('validation.required')),
    nik: z.string().length(16, t('validation.nikDigit')),
    gender: z.enum(['Male', 'Female']),
    maritalStatus: z.string().min(1, t('validation.required')),
    relation: z.enum(['SELF', 'SPOUSE', 'FATHER', 'MOTHER', 'CHILD', 'SIBLING']),
    ocrConfidence: z.number().optional(),
    selfieUrl: z.string().optional(),
    ktpUrl: z.string().optional(),
    passportUrl: z.string().optional(),
    bukuNikahUrl: z.string().optional(),
    akteKelahiranUrl: z.string().optional(),
  });

export type TManagementForm = z.infer<ReturnType<typeof getFormSchema>>;

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

  const useCreateMember = () =>
    useMutation({
      mutationFn: (data: ICreateMemberRequest) => useCase.createMember(data),
      onSuccess: (res) => {
        if (res.code === 201 || res.code === 200) {
          queryClient.invalidateQueries({ queryKey: ['family-members'] });
          toast.success(res.message || t('addMemberSuccess'));
          router.push(ROUTES.PILGRIM.FAMILY.INDEX);
        } else {
          toast.error(res.message || res.error?.message || t('addMemberError'));
        }
      },
      onError: (err: Error) => toast.error(err.message || t('systemError')),
    });

  const useUpdateMember = () =>
    useMutation({
      mutationFn: (data: IUpdateMemberRequest) => useCase.updateMember(data),
      onSuccess: (res) => {
        if (res.code === 200 || res.code === 201) {
          queryClient.invalidateQueries({ queryKey: ['family-members'] });
          toast.success(res.message || t('updateMemberSuccess'));
          router.push(ROUTES.PILGRIM.FAMILY.INDEX);
        } else {
          toast.error(res.message || res.error?.message || t('updateMemberError'));
        }
      },
      onError: (err: Error) => toast.error(err.message || t('systemError')),
    });

  const useDeleteMember = () =>
    useMutation({
      mutationFn: (memberId: string) => useCase.deleteMember(memberId),
      onSuccess: (res) => {
        if (res.code === 200 || res.code === 201) {
          queryClient.invalidateQueries({ queryKey: ['family-members'] });
          toast.success(res.message || t('deleteMemberSuccess'));
        } else {
          toast.error(res.message || res.error?.message || t('deleteMemberError'));
        }
      },
      onError: (err: Error) => toast.error(err.message || t('systemError')),
    });

  const useProcessOcr = (
    onOcrSuccess: (
      data: Partial<IFamilyMember> & {
        confidence: number;
        publicUrl?: string;
        nusuk_compatibility?: INusukCompatibility;
      },
    ) => void,
  ) =>
    useMutation({
      mutationFn: ({ file, type }: { file: File; type: 'passport' | 'ktp' }) =>
        useCase.processOcr(file, type),
      onSuccess: (res) => {
        if (res.data) onOcrSuccess(res.data);
      },
      onError: () => toast.error(t('ocrReadError')),
    });

  return {
    id,
    useMembers,
    useMemberDetail,
    useCreateMember,
    useUpdateMember,
    useDeleteMember,
    useProcessOcr,
    formSchema,
  };
};

export const useManagementForm = (initialData?: Partial<IFamilyMember>) => {
  const t = useTranslations('PilgrimManagement');
  const formSchema = useMemo(() => getFormSchema(t), [t]);

  const form = useForm<TManagementForm>({
    resolver: zodResolver(formSchema),
    mode: 'all',
    values: useMemo(() => {
      const normalizedRelation = initialData?.relation as TRelation;
      return {
        fullName: initialData?.fullName || '',
        passportNumber: initialData?.passportNumber || '',
        passportExpiry: initialData?.passportExpiry || '',
        dob: initialData?.dob || '',
        nik: initialData?.nik || '',
        gender: (initialData?.gender as 'Male' | 'Female') || 'Male',
        maritalStatus: initialData?.maritalStatus || '',
        relation: normalizedRelation || 'SELF',
        ocrConfidence: initialData?.ocrConfidence || 0,
        selfieUrl: initialData?.selfieUrl || '',
        ktpUrl: initialData?.ktpUrl || '',
        passportUrl: initialData?.passportUrl || '',
        bukuNikahUrl: initialData?.bukuNikahUrl || '',
        akteKelahiranUrl: initialData?.akteKelahiranUrl || '',
      };
    }, [initialData]),
  });

  return form;
};
