'use client';

import {
  HeaderPageContent,
  ImagePreviewModal,
  LoadingOverlay,
  PaymentStatusBadge,
  ReviewStatusBadge,
} from '@/components/molecules';
import { UploadFile } from '@/components/molecules/input/file';
import moment from 'moment';
import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

import { NotFoundComp } from '@/components/atoms';
import {
  DetailLogisticsReview,
  DetailMemberValidation,
  DetailPaymentValidation,
  DetailReviewSidebar,
} from '@/components/organisms/providers/submission/detail';
import { ROUTES } from '@/shared/constants/routes';
import { useProviderSubmissionsController } from '../controller';
import { SubmissionDetailSkeleton } from './skeleton';

const VEHICLE_CAPACITIES: Record<string, number> = {
  Bus: 50,
  'Mini Bus': 15,
  Sedan: 4,
  MPV: 7,
  TAXI: 4,
  OTHER: 100,
};

export const SubmissionDetailView = () => {
  const t = useTranslations('ProviderSubmissions');
  const router = useRouter();
  const { id, slug } = useParams();
  const { useSubmissionDetail, useVerifyPayment, useReviewSubmission } =
    useProviderSubmissionsController();

  const { data, isPending } = useSubmissionDetail(id as string);
  const verifyPaymentMutation = useVerifyPayment();
  const reviewSubmissionMutation = useReviewSubmission();

  const submission = data?.data;

  const isVisaPhase = submission?.verifyStatus === 'VERIFIED';

  const [paymentAction, setPaymentAction] = useState<'APPROVE' | 'REJECT' | null>(null);
  const [paymentReason, setPaymentReason] = useState('');
  const [memberStatuses, setMemberStatuses] = useState<
    Record<string, { valid: boolean; reason?: string }>
  >(submission?.resultSnapshot?.memberStatuses || {});
  const [logisticsValid, setLogisticsValid] = useState<boolean | null>(null);
  const [logisticsReason, setLogisticsReason] = useState('');
  const [visaFiles, setVisaFiles] = useState<Record<string, UploadFile[]>>({});
  const [previewImage, setPreviewImage] = useState<{ src: string; alt: string } | null>(null);

  useEffect(() => {
    if (submission?.resultSnapshot?.memberStatuses) {
      setMemberStatuses(submission.resultSnapshot.memberStatuses);
    }
  }, [submission]);

  useEffect(() => {
    if (paymentAction === 'REJECT') {
      const updatedStatuses: Record<string, { valid: boolean; reason?: string }> = {};
      submission?.members.forEach((m) => {
        updatedStatuses[m.id] = {
          valid: false,
          reason: paymentReason || 'Payment Rejected',
        };
      });
      setMemberStatuses(updatedStatuses);
      setLogisticsValid(false);
      setLogisticsReason(paymentReason || 'Payment Rejected');
    }
  }, [paymentAction, submission?.members, paymentReason]);

  const capacityWarning = useMemo(() => {
    if (!submission?.transportations?.[0]) return null;
    const vehicleType = submission.transportations[0].type;
    const capacity = VEHICLE_CAPACITIES[vehicleType] || 0;
    const totalMembers = submission.members?.length || 0;

    if (totalMembers > capacity) {
      return t('detail.logistics.capacityWarning', {
        type: vehicleType,
        capacity,
        count: totalMembers,
      });
    }
    return null;
  }, [submission, t]);

  const toggleMemberStatus = (memberId: string, reason?: string) => {
    if (isVisaPhase) return;
    setMemberStatuses((prev) => ({
      ...prev,
      [memberId]: {
        valid: reason ? false : !prev[memberId]?.valid,
        reason: reason || undefined,
      },
    }));
  };

  const handleVisaChange = (memberId: string, files: UploadFile[]) => {
    setVisaFiles((prev) => ({
      ...prev,
      [memberId]: files,
    }));
  };

  const handleFinalSubmit = async () => {
    if (isVisaPhase) {
      // Handle Visa Final Submission Logic
      toast.success('Visa submitted successfully');
      router.push(ROUTES.PROVIDER.SUBMISSIONS(slug as string));
      return;
    }

    if (!paymentAction) {
      toast.error(t('toasts.paymentStatusRequired'));
      return;
    }

    if (paymentAction === 'REJECT' && !paymentReason.trim()) {
      toast.error(t('toasts.paymentReasonRequired'));
      return;
    }

    const allMembersValid = submission?.members.every((m) => memberStatuses[m.id]?.valid);

    try {
      const status = paymentAction === 'APPROVE' && logisticsValid === true ? 'VERIFIED' : 'REJECTED';

      const reason =
        paymentAction === 'REJECT'
          ? paymentReason
          : logisticsValid === false
            ? logisticsReason
            : !allMembersValid
              ? t('toasts.invalidMemberDocs')
              : '';

      const members = (submission?.members || []).map((m) => ({
        id: m.id,
        isEligible: memberStatuses[m.id]?.valid ?? true,
        rejectionReason: memberStatuses[m.id]?.reason || undefined,
      }));

      if (paymentAction === 'APPROVE' && submission?.paymentStatus !== 'COMPLETED') {
        await verifyPaymentMutation.mutateAsync(submission!.id);
      }

      await reviewSubmissionMutation.mutateAsync({
        id: submission!.id,
        payload: {
          status,
          rejectionReason: reason,
          resultSnapshot: { memberStatuses },
          members,
        },
      });

      toast.success(t('toasts.saveSuccess'));
      router.push(ROUTES.PROVIDER.SUBMISSIONS(slug as string));
    } catch (error) {
      toast.error(t('toasts.saveError'));
    }
  };

  const isSubmissionRejected = submission?.verifyStatus === 'REJECTED';
  const isPaymentApproved = paymentAction === 'APPROVE';
  const showProcessGuard = !isPaymentApproved && !isVisaPhase && !isSubmissionRejected;

  if (isPending) {
    return <SubmissionDetailSkeleton />;
  }

  if (!submission) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] animate-in fade-in duration-500">
        <NotFoundComp
          label={t('manifest.notFoundTitle')}
          message={t('manifest.notFoundDesc')}
          actionButton={t('detail.backToList')}
          actionHref={ROUTES.PROVIDER.SUBMISSIONS(slug as string)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-24 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <LoadingOverlay
        isLoading={reviewSubmissionMutation.isPending || verifyPaymentMutation.isPending}
        message={t('detail.loading')}
      />

      <HeaderPageContent
        title={t('detail.title')}
        subtitle={t('detail.subtitle', {
          id: submission.id.slice(0, 8).toUpperCase(),
          leader: submission.leader?.fullName || '-',
          date: moment(submission.createdAt).format('DD MMMM YYYY, HH:mm'),
        })}
        onBack={() => router.push(ROUTES.PROVIDER.SUBMISSIONS(slug as string))}
        extra={
          <div className="flex gap-2">
            <PaymentStatusBadge status={submission.paymentStatus} />
            <ReviewStatusBadge status={submission.verifyStatus} />
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          {!isVisaPhase && !isSubmissionRejected && (
            <>
              <DetailPaymentValidation
                submission={submission}
                paymentAction={paymentAction}
                setPaymentAction={setPaymentAction}
                paymentReason={paymentReason}
                setPaymentReason={setPaymentReason}
                onPreview={setPreviewImage}
              />
            </>
          )}

          <div className="relative group">
            {showProcessGuard && (
              <div className="absolute inset-0 z-10 bg-white/50 backdrop-blur-[1px] rounded-[2rem] flex items-center justify-center cursor-not-allowed opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-gray-900 text-white px-4 py-2 rounded-xl text-xs font-black shadow-2xl">
                  {t('detail.processPaymentFirst')}
                </div>
              </div>
            )}
            <DetailMemberValidation
              members={
                isVisaPhase
                  ? (submission.members || []).filter((m) => memberStatuses[m.id]?.valid)
                  : submission.members || []
              }
              memberStatuses={memberStatuses}
              onToggleStatus={toggleMemberStatus}
              onPreview={setPreviewImage}
              isVisaPhase={isVisaPhase}
              visaFiles={visaFiles}
              onVisaChange={handleVisaChange}
            />
          </div>

          <div className="relative group">
            {showProcessGuard && (
              <div className="absolute inset-0 z-10 bg-white/50 backdrop-blur-[1px] rounded-[2rem] flex items-center justify-center cursor-not-allowed opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-gray-900 text-white px-4 py-2 rounded-xl text-xs font-black shadow-2xl">
                  {t('detail.processPaymentFirst')}
                </div>
              </div>
            )}
            <DetailLogisticsReview
              submission={submission}
              capacityWarning={capacityWarning}
              logisticsValid={logisticsValid}
              setLogisticsValid={setLogisticsValid}
              logisticsReason={logisticsReason}
              setLogisticsReason={setLogisticsReason}
              onPreview={setPreviewImage}
              readOnly={isVisaPhase || isSubmissionRejected}
            />
          </div>
        </div>

        {!isSubmissionRejected && (
          <div className="lg:col-span-4">
            <DetailReviewSidebar
              submission={submission}
              paymentAction={paymentAction}
              memberStatuses={memberStatuses}
              logisticsValid={logisticsValid}
              onFinalSubmit={handleFinalSubmit}
              onCancel={() => router.push(ROUTES.PROVIDER.SUBMISSIONS(slug as string))}
              isSubmitting={reviewSubmissionMutation.isPending || verifyPaymentMutation.isPending}
              isVisaPhase={isVisaPhase}
              visaFiles={visaFiles}
            />
          </div>
        )}
      </div>

      <ImagePreviewModal
        open={!!previewImage}
        onOpenChange={(o) => !o && setPreviewImage(null)}
        imageSrc={previewImage?.src || ''}
        imageAlt={previewImage?.alt || 'Preview'}
      />
    </div>
  );
};
