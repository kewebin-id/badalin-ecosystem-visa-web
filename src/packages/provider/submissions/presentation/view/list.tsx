'use client';

import {
  Button,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/atoms';
import { HeaderPageContent, PaymentStatusBadge, ReviewStatusBadge } from '@/components/molecules';
import {
  ActionMenuDrawer,
  ReviewDocumentDialog,
  VerifyPaymentDialog,
} from '@/components/organisms/providers/submission';
import { EmptyState } from '@/components/templates';
import { ROUTES } from '@/shared/constants/routes';
import { useScreenSize } from '@/shared/hooks';
import { currencyFormat } from '@/shared/utils/formattor';
import { ClipboardCheck, Eye, Inbox, MapPin } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { ProviderSubmission } from '../../domain/entities';
import { useProviderSubmissionsController } from '../controller';
import { SubmissionsSkeleton } from './skeleton';

export const SubmissionsMonitoring = () => {
  const t = useTranslations('ProviderSubmissions');
  const { isMobile } = useScreenSize();
  const router = useRouter();
  const params = useParams();
  const slug = (params?.slug as string) || 'p';

  const { useSubmissions, useVerifyPayment, useReviewSubmission } =
    useProviderSubmissionsController();
  const { data: res, isPending } = useSubmissions({ page: 1, limit: 50 });
  const verifyPaymentMutation = useVerifyPayment();
  const reviewMutation = useReviewSubmission();

  const [paymentTarget, setPaymentTarget] = useState<ProviderSubmission | null>(null);
  const [reviewTarget, setReviewTarget] = useState<ProviderSubmission | null>(null);
  const [actionMenuTarget, setActionMenuTarget] = useState<ProviderSubmission | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const submissions: ProviderSubmission[] = (res?.data?.data || []).map((s) => ({
    id: s.id,
    leaderName: s.leader?.fullName || '-',
    totalMembers: s.members?.length || 0,
    paymentStatus: s.paymentStatus,
    reviewStatus: s.verifyStatus,
    amount: s.totalAmount,
  }));

  const handleMarkCompleted = async (id: string) => {
    try {
      await verifyPaymentMutation.mutateAsync(id);
      setPaymentTarget(null);
      toast.success(t('toasts.success'), {
        description: t('manifest.saveSuccessDesc', { id }),
      });
    } catch {
      toast.error(t('toasts.error'));
    }
  };

  const handleVerify = async (id: string) => {
    try {
      await reviewMutation.mutateAsync({ id, payload: { status: 'VERIFIED' } });
      setReviewTarget(null);
      toast.success(t('toasts.verified'), { description: t('toasts.verifiedDesc', { id }) });
    } catch {
      toast.error(t('toasts.error'));
    }
  };

  const handleReject = async (id: string) => {
    if (!rejectReason.trim()) {
      toast.error(t('toasts.reasonRequired'), {
        description: t('toasts.reasonRequiredDesc'),
      });
      return;
    }
    try {
      await reviewMutation.mutateAsync({
        id,
        payload: { status: 'REJECTED', rejectionReason: rejectReason.trim() },
      });
      setReviewTarget(null);
      setRejectReason('');
      toast.success(t('toasts.rejected'), {
        description: t('toasts.rejectedDesc', { id }),
      });
    } catch {
      toast.error(t('toasts.error'));
    }
  };

  if (isPending) return <SubmissionsSkeleton />;

  return (
    <div className="space-y-6">
      <HeaderPageContent title={t('title')} subtitle={t('subtitle')} hideBack />

      <Card className="overflow-hidden !p-0">
        <div className="pb-4 border-b border-gray-50 mb-4 px-6 pt-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-50 rounded-xl">
              <Inbox className="h-5 w-5 text-gray-400" strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 tracking-tight">
                {t('cardTitle', { count: submissions.length })}
              </h3>
              <p className="text-xs text-gray-400 font-medium">{t('cardSubtitle')}</p>
            </div>
          </div>
        </div>
        <div className="px-6 pb-6">
          {submissions.length === 0 ? (
            <EmptyState title={t('emptyTitle')} description={t('emptyDescription')} />
          ) : !isMobile ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('table.id')}</TableHead>
                  <TableHead>{t('table.leader')}</TableHead>
                  <TableHead className="text-center">{t('table.members')}</TableHead>
                  <TableHead>{t('table.payment')}</TableHead>
                  <TableHead>{t('table.review')}</TableHead>
                  <TableHead className="text-right">{t('table.action')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-mono text-xs">{s.id}</TableCell>
                    <TableCell className="font-medium">{s.leaderName}</TableCell>
                    <TableCell className="text-center">{s.totalMembers}</TableCell>
                    <TableCell>
                      <PaymentStatusBadge status={s.paymentStatus} />
                    </TableCell>
                    <TableCell>
                      <ReviewStatusBadge status={s.reviewStatus} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="transparent"
                          size="sm"
                          className="cursor-pointer"
                          onClick={() => setPaymentTarget(s)}
                          title="Verifikasi Pembayaran"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="transparent"
                          size="sm"
                          className="cursor-pointer"
                          onClick={() => setReviewTarget(s)}
                          title="Review Dokumen"
                        >
                          <ClipboardCheck className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="transparent"
                          size="sm"
                          className="cursor-pointer"
                          onClick={() => router.push(ROUTES.PROVIDER.MANIFEST(slug, s.id))}
                          title="Logistik & Manifest"
                        >
                          <MapPin className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="space-y-6">
              {submissions.map((s) => (
                <div
                  key={s.id}
                  className="group relative overflow-hidden rounded-[2rem] border border-gray-100 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md"
                >
                  <div className="relative space-y-5">
                    {/* Header: ID (Top Left) and Statuses (Top Right) */}
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                          Submission ID
                        </span>
                        <h4 className="font-mono text-sm font-bold text-gray-900 tracking-tight bg-gray-50 px-2 py-0.5 rounded-lg border border-gray-100 w-fit">
                          {s.id}
                        </h4>
                      </div>
                      <div className="flex flex-col items-end gap-1.5">
                        <PaymentStatusBadge status={s.paymentStatus} />
                        <ReviewStatusBadge status={s.reviewStatus} />
                      </div>
                    </div>

                    {/* Main Content: Leader and Info */}
                    <div className="flex items-center justify-between gap-4 pt-2">
                      <div className="space-y-1">
                        <h4 className="text-xl font-extrabold tracking-tight text-gray-900">
                          {s.leaderName}
                        </h4>
                        <div className="flex items-center gap-2">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-50">
                            <Inbox className="h-3 w-3 text-primary-default" strokeWidth={3} />
                          </div>
                          <p className="text-sm font-semibold text-gray-500">
                            {s.totalMembers}{' '}
                            <span className="text-gray-400 font-medium">Participants</span>
                          </p>
                        </div>
                      </div>

                      {/* Action Menu Trigger (Three Dots) */}
                      <button
                        onClick={() => setActionMenuTarget(s)}
                        className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-all active:scale-90 cursor-pointer border border-gray-100"
                      >
                        <svg
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      <ActionMenuDrawer
        isOpen={!!actionMenuTarget}
        onOpenChange={(o) => !o && setActionMenuTarget(null)}
        submission={actionMenuTarget}
        onVerifyPayment={() => {
          if (actionMenuTarget) {
            setPaymentTarget(actionMenuTarget);
            setActionMenuTarget(null);
          }
        }}
        onReviewDocuments={() => {
          if (actionMenuTarget) {
            setReviewTarget(actionMenuTarget);
            setActionMenuTarget(null);
          }
        }}
        onManifest={() => {
          if (actionMenuTarget) {
            router.push(ROUTES.PROVIDER.MANIFEST(slug, actionMenuTarget.id));
            setActionMenuTarget(null);
          }
        }}
      />

      <VerifyPaymentDialog
        submission={paymentTarget}
        isOpen={!!paymentTarget}
        onOpenChange={(o) => !o && setPaymentTarget(null)}
        onConfirm={handleMarkCompleted}
        renderPaymentBadge={(status) => <PaymentStatusBadge status={status} />}
        formatCurrency={currencyFormat}
      />

      <ReviewDocumentDialog
        submission={reviewTarget}
        isOpen={!!reviewTarget}
        onOpenChange={(o) => !o && setReviewTarget(null)}
        rejectReason={rejectReason}
        setRejectReason={setRejectReason}
        onReject={handleReject}
        onVerify={handleVerify}
        renderPaymentBadge={(status) => <PaymentStatusBadge status={status} />}
        renderReviewBadge={(status) => <ReviewStatusBadge status={status} />}
      />
    </div>
  );
};
