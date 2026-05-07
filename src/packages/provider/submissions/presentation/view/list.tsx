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
import {
  DialogDrawer,
  HeaderPageContent,
  ImagePreviewModal,
  LoadingOverlay,
  PaymentStatusBadge,
  ReviewStatusBadge,
} from '@/components/molecules';
import { SubmissionQuickReview } from '@/components/organisms/providers/submission/quick-review';
import { EmptyState } from '@/components/templates';
import { useScreenSize } from '@/shared/hooks';
import { exportSubmissionToZip } from '@/shared/utils/manifest-export';
import { useQueryClient } from '@tanstack/react-query';
import { Eye, FileSpreadsheet, Inbox, Loader2, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'sonner';
import { ProviderSubmission } from '../../domain/entities';
import { ISubmissionListItem } from '../../domain/response';
import { useProviderSubmissionsController } from '../controller';
import { SubmissionsSkeleton } from './skeleton';

export const SubmissionsMonitoring = () => {
  const t = useTranslations('ProviderSubmissions');
  const { isMobile } = useScreenSize();

  const { useSubmissions, usecase } = useProviderSubmissionsController();
  const queryClient = useQueryClient();
  const { data: res, isPending } = useSubmissions({ page: 1, limit: 50 });

  const [reviewData, setReviewData] = useState<ISubmissionListItem | null>(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<{ src: string; alt: string } | null>(null);
  const [isFetchingDetail, setIsFetchingDetail] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleOpenReview = async (id: string) => {
    setIsFetchingDetail(id);
    try {
      const detail = await queryClient.fetchQuery({
        queryKey: ['provider', 'submissions', id],
        queryFn: () => usecase.getSubmissionDetail(id),
      });

      if (detail?.data) {
        setReviewData(detail.data);
        setIsReviewOpen(true);
      } else {
        toast.error('Failed to fetch submission details');
      }
    } catch (error) {
      console.error('Fetch detail error:', error);
      toast.error('An error occurred while fetching details');
    } finally {
      setIsFetchingDetail(null);
    }
  };

  const handleExport = async (id: string) => {
    setIsExporting(true);
    const loadingToast = toast.loading('Fetching data and generating Archive (ZIP)...');
    try {
      const detail = await queryClient.fetchQuery({
        queryKey: ['provider', 'submissions', id],
        queryFn: () => usecase.getSubmissionDetail(id),
      });

      if (detail?.data) {
        await exportSubmissionToZip(detail.data);
        toast.success('Archive generated successfully', {
          id: loadingToast,
        });
      } else {
        toast.error('Failed to fetch submission details', {
          id: loadingToast,
        });
      }
    } catch (error) {
      console.error('Export error:', error);
      toast.error('An error occurred during export', {
        id: loadingToast,
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handlePreview = (image: { src: string; alt: string }) => {
    setPreviewImage(image);
    setIsPreviewOpen(true);
  };

  const submissions: ProviderSubmission[] = (res?.data?.items || []).map((s) => ({
    id: s.id,
    leaderName: s.leader?.fullName || '-',
    totalMembers: s.members?.length || 0,
    paymentStatus: s.paymentStatus,
    reviewStatus: s.verifyStatus,
    amount: Number(s.totalAmount || 0),
    paymentProofUrl: s.proofOfPayment,
    rejectionReason: s.rejectionReason,
  }));

  if (isPending) return <SubmissionsSkeleton />;

  return (
    <div className="space-y-6">
      <LoadingOverlay isLoading={isExporting} message="Sedang mengunduh data manifest..." />
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
                          onClick={() => handleOpenReview(s.id)}
                          title="Quick Review"
                          disabled={!!isFetchingDetail}
                        >
                          {isFetchingDetail === s.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                        {s.paymentStatus === 'COMPLETED' && s.reviewStatus === 'VERIFIED' && (
                          <Button
                            variant="primary"
                            size="sm"
                            className="cursor-pointer gap-2"
                            onClick={() => handleExport(s.id)}
                          >
                            <FileSpreadsheet className="h-4 w-4" />
                            <span>Export</span>
                          </Button>
                        )}
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
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                          Submission ID
                        </span>
                        <h4 className="font-mono text-sm font-bold text-gray-900 tracking-tight bg-gray-50 px-2 py-0.5 rounded-lg border border-gray-100 w-fit">
                          {s.id.split('-')[0].toUpperCase()}
                        </h4>
                      </div>
                      <div className="flex flex-col items-end gap-1.5">
                        <PaymentStatusBadge status={s.paymentStatus} />
                        <ReviewStatusBadge status={s.reviewStatus} />
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-4 pt-2">
                      <div className="space-y-1">
                        <h4 className="text-xl font-extrabold tracking-tight text-gray-900">
                          {s.leaderName}
                        </h4>
                        <div className="flex items-center gap-2 text-xs font-semibold text-gray-400">
                          <Users className="h-3.5 w-3.5" />
                          <span>{s.totalMembers} Jamaah</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenReview(s.id)}
                          disabled={!!isFetchingDetail}
                          className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-all active:scale-90 cursor-pointer border border-gray-100"
                        >
                          {isFetchingDetail === s.id ? (
                            <Loader2 className="h-6 w-6 animate-spin text-primary" />
                          ) : (
                            <Eye className="h-6 w-6" />
                          )}
                        </button>

                        {s.paymentStatus === 'COMPLETED' && s.reviewStatus === 'VERIFIED' && (
                          <button
                            onClick={() => handleExport(s.id)}
                            className="flex-1 flex h-12 px-4 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-all active:scale-90 cursor-pointer border border-emerald-100 gap-2 font-bold text-sm"
                          >
                            <FileSpreadsheet className="h-5 w-5" />
                            <span>Export</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
      <DialogDrawer
        open={isReviewOpen}
        setOpen={setIsReviewOpen}
        title={t('quickReview.title')}
        description={t('quickReview.subtitle', {
          id: reviewData?.id.split('-')?.[0]?.toUpperCase() || '',
        })}
        className="max-w-4xl"
      >
        {reviewData && <SubmissionQuickReview submission={reviewData} onPreview={handlePreview} />}
      </DialogDrawer>

      <ImagePreviewModal
        open={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
        imageSrc={previewImage?.src || ''}
        imageAlt={previewImage?.alt || 'Preview'}
      />
    </div>
  );
};
