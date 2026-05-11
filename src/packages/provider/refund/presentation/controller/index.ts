import { RestAPI } from '@/shared/utils/rest-api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { RefundRepository } from '../../repository';
import { RefundUseCase } from '../../usecase';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

const api = new RestAPI();
const repo = new RefundRepository(api);
const usecase = new RefundUseCase(repo);

export const useRefundController = () => {
  const queryClient = useQueryClient();
  const t = useTranslations('RefundManagement.toasts');

  const useRefundList = () => {
    const refundRes = useQuery({
      queryKey: ['provider', 'refund', 'list'],
      queryFn: () => usecase.getRefundList(),
    });
    
    const refunds = useMemo(() => refundRes?.data?.data || [], [refundRes]);
    
    return { ...refundRes, refunds };
  };

  const useSettleRefund = () =>
    useMutation({
      mutationFn: ({ submissionId, file }: { submissionId: string; file: string }) =>
        usecase.settleRefund(submissionId, file),
      onSuccess: (res) => {
        if (!res.error) {
          toast.success(t('success'));
          queryClient.invalidateQueries({ queryKey: ['provider', 'refund', 'list'] });
          queryClient.invalidateQueries({ queryKey: ['provider', 'agency-settings'] });
        } else {
          toast.error(res.message || t('error'));
        }
      },
      onError: (error: Error) => {
        toast.error(error.message || t('error'));
      },
    });

  return {
    useRefundList,
    useSettleRefund,
  };
};
