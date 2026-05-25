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
  InputSelect,
  InputTextSearch,
  LoadingOverlay,
  Pagination,
  PaymentStatusBadge,
  ReviewStatusBadge,
} from '@/components/molecules';
import { SubmissionQuickReview } from '@/components/organisms/providers/submission/quick-review';
import { EmptyState } from '@/components/templates';
import { ROUTES } from '@/shared/constants';
import { useScreenSize } from '@/shared/hooks';
import { Eye, FileSpreadsheet, Inbox, Loader2, Users, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { ProviderSubmission } from '../../domain/entities';
import { ISubmissionListItem } from '../../domain/response';
import { useProviderSubmissionsController } from '../controller';
import { SubmissionsSkeleton } from './skeleton';

export const SubmissionsMonitoring = () => {
  const t = useTranslations('ProviderSubmissions');
  const { isMobile } = useScreenSize();

  const [search, setSearch] = useState<string | undefined>();
  const [paymentStatuses, setPaymentStatuses] = useState<string[]>([]);
  const [reviewStatuses, setReviewStatuses] = useState<string[]>([]);
  const [page, setPage] = useState<number>(1);

  React.useEffect(() => {
    setPage(1);
  }, [search, paymentStatuses, reviewStatuses]);

  const { useSubmissions, useExportSubmission, fetchSubmissionDetail, useLOV } =
    useProviderSubmissionsController();

  const { data: paymentLov } = useLOV('payment-status');
  const { data: reviewLov } = useLOV('review-status');

  const paymentOptions = paymentLov?.data
    ? paymentLov.data
    : [{ label: 'Semua Payment', value: 'ALL' }];
  const reviewOptions = reviewLov?.data
    ? reviewLov.data
    : [{ label: 'Semua Review', value: 'ALL' }];

  const {
    data: res,
    isPending,
    isFetching,
  } = useSubmissions({
    page,
    limit: 10,
    search,
    paymentStatuses: paymentStatuses.length > 0 ? paymentStatuses : undefined,
    reviewStatuses: reviewStatuses.length > 0 ? reviewStatuses : undefined,
  });

  const totalPages = res?.data?.totalPages || 1;
  const { mutateAsync: exportSubmission, isPending: isExporting } = useExportSubmission();

  const [reviewData, setReviewData] = useState<ISubmissionListItem | null>(null);
  const [isReviewOpen, setIsReviewOpen] = useState<boolean>(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<{ src: string; alt: string } | null>(null);
  const [isFetchingDetail, setIsFetchingDetail] = useState<string | null>(null);

  const { slug } = useParams();
  const { push: navigate } = useRouter();

  const handleOpenReview = async (id: string) => {
    setIsFetchingDetail(id);
    try {
      const detail = await fetchSubmissionDetail(id);

      if (detail?.data) {
        if (detail?.data?.paymentStatus === 'CHECKING') {
          return navigate(ROUTES.PROVIDER.DETAIL(slug as string, id));
        }
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
    try {
      await exportSubmission(id);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Gagal melakukan export data');
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
    reviewStatus: s.reviewStatus,
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
                {t('cardTitle', { count: res?.data?.totalItems || 0 })}
              </h3>
              <p className="text-xs text-gray-400 font-medium">{t('cardSubtitle')}</p>
            </div>
          </div>
          <div className="flex items-center justify-between gap-3 mt-4">
            <div className="w-full max-w-sm">
              <InputTextSearch
                search={search || ''}
                setSearch={setSearch}
                placeholder="Cari ID atau Leader..."
                delayDebounce={500}
              />
            </div>
            <div className="flex justify-end gap-2 items-center">
              <div className="w-48 relative group">
                <InputSelect
                  placeholder="Payment Status"
                  options={paymentOptions}
                  value={paymentStatuses[0] || 'ALL'}
                  setValue={(val) => setPaymentStatuses(val === 'ALL' ? [] : [val])}
                  size="md"
                  className="h-11 pr-14"
                />
                {paymentStatuses.length > 0 && paymentStatuses[0] !== 'ALL' && (
                  <button
                    onClick={() => setPaymentStatuses([])}
                    className="absolute right-8 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 z-10"
                  >
                    <X className="w-3.5 h-3.5 text-gray-500" />
                  </button>
                )}
              </div>
              <div className="w-48 relative group">
                <InputSelect
                  placeholder="Review Status"
                  options={reviewOptions}
                  value={reviewStatuses[0] || 'ALL'}
                  setValue={(val) => setReviewStatuses(val === 'ALL' ? [] : [val])}
                  size="md"
                  className="h-11 pr-14"
                />
                {reviewStatuses.length > 0 && reviewStatuses[0] !== 'ALL' && (
                  <button
                    onClick={() => setReviewStatuses([])}
                    className="absolute right-8 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 z-10"
                  >
                    <X className="w-3.5 h-3.5 text-gray-500" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="px-6 pb-6 relative min-h-[300px]">
          {isFetching && !isPending && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-20 flex items-center justify-center rounded-b-xl">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          )}
          {submissions.length === 0 ? (
            <EmptyState title={t('emptyTitle')} description={t('emptyDescription')} />
          ) : !isMobile ? (
            <>
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
                        {s.reviewStatus === 'AUTO_CANCELED' ? (
                          <ReviewStatusBadge status={s.reviewStatus} />
                        ) : (
                          <PaymentStatusBadge status={s.paymentStatus} />
                        )}
                      </TableCell>
                      <TableCell>
                        <ReviewStatusBadge status={s.reviewStatus} />
                      </TableCell>
                      <TableCell className="text-right">
                        {s.reviewStatus !== 'AUTO_CANCELED' && s.paymentStatus !== 'PENDING' ? (
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="transparent"
                              size="sm"
                              className="cursor-pointer"
                              onClick={() => {
                                if (s.reviewStatus === 'IN_REVIEW') {
                                  navigate(ROUTES.PROVIDER.DETAIL(slug as string, s.id));
                                } else {
                                  handleOpenReview(s.id);
                                }
                              }}
                              title="Detail"
                              disabled={!!isFetchingDetail && s.reviewStatus !== 'IN_REVIEW'}
                            >
                              {isFetchingDetail === s.id && s.reviewStatus !== 'IN_REVIEW' ? (
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
                        ) : null}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-6 flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  {t('showingData', {
                    count: submissions.length,
                    total: res?.data?.totalItems || 0,
                  })}
                </span>
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={(p) => setPage(p)}
                />
              </div>
            </>
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

                      {s.reviewStatus !== 'AUTO_CANCELED' && s.paymentStatus !== 'PENDING' && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              if (s.reviewStatus === 'IN_REVIEW') {
                                navigate(ROUTES.PROVIDER.DETAIL(slug as string, s.id));
                              } else {
                                handleOpenReview(s.id);
                              }
                            }}
                            disabled={!!isFetchingDetail && s.reviewStatus !== 'IN_REVIEW'}
                            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-all active:scale-90 cursor-pointer border border-gray-100"
                          >
                            {isFetchingDetail === s.id && s.reviewStatus !== 'IN_REVIEW' ? (
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
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div className="pt-4 flex justify-center">
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={(p) => setPage(p)}
                />
              </div>
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
