'use client';

import {
  Badge,
  Button,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/atoms';
import { HeaderPageContent } from '@/components/molecules';
import { Bed, CheckCircle, ChevronLeft, FileText, Plane, Truck, XCircle } from 'lucide-react';
import moment from 'moment';
import { useParams, useRouter } from 'next/navigation';
import { useProviderSubmissionsController } from '../controller';

export const SubmissionDetailView = () => {
  const router = useRouter();
  const { id, slug } = useParams();
  const { useSubmissionDetail, useVerifyPayment, useReviewSubmission } =
    useProviderSubmissionsController();

  const { data, isPending } = useSubmissionDetail(id as string);
  const verifyPayment = useVerifyPayment();
  const reviewSubmission = useReviewSubmission();

  const submission = data?.data;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
      case 'VERIFIED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      case 'IN_REVIEW':
      case 'CHECKING':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isPending) {
    return <div className="p-8 text-center text-gray-500">Loading submission details...</div>;
  }

  if (!submission) {
    return <div className="p-8 text-center text-red-500">Submission not found.</div>;
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
        <button
          onClick={() => router.push(`/${slug}/submissions`)}
          className="hover:text-blue-600 flex items-center gap-1"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Submissions
        </button>
      </div>

      <HeaderPageContent
        title={`Submission Detail: #${submission.id.split('-')[0].toUpperCase()}`}
        subtitle={`Submitted on ${moment(submission.createdAt).format('DD MMM YYYY HH:mm')}`}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Members Table */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              Jamaah List ({submission.members.length} pax)
            </h3>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Full Name</TableHead>
                    <TableHead>Passport</TableHead>
                    <TableHead>NIK</TableHead>
                    <TableHead>Relation</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submission.members.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium">{member.fullName}</TableCell>
                      <TableCell>{member.passportNumber}</TableCell>
                      <TableCell>{member.nik}</TableCell>
                      <TableCell>{member.relation}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>

          {/* Logistics Scaffolds */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4 flex flex-col items-center justify-center border-dashed text-gray-400 hover:text-blue-600 hover:border-blue-300 cursor-pointer transition-colors h-32">
              <Plane className="h-8 w-8 mb-2" />
              <span className="text-sm font-medium">Add Flight Manifest</span>
            </Card>
            <Card className="p-4 flex flex-col items-center justify-center border-dashed text-gray-400 hover:text-blue-600 hover:border-blue-300 cursor-pointer transition-colors h-32">
              <Bed className="h-8 w-8 mb-2" />
              <span className="text-sm font-medium">Add Hotel Manifest</span>
            </Card>
            <Card className="p-4 flex flex-col items-center justify-center border-dashed text-gray-400 hover:text-blue-600 hover:border-blue-300 cursor-pointer transition-colors h-32">
              <Truck className="h-8 w-8 mb-2" />
              <span className="text-sm font-medium">Add Transport Manifest</span>
            </Card>
          </div>
        </div>

        <div className="space-y-6">
          {/* Leader Info */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Leader Information</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-400 uppercase font-bold">Full Name</label>
                <p className="font-medium text-gray-900">{submission.leader.fullName}</p>
              </div>
              <div>
                <label className="text-xs text-gray-400 uppercase font-bold">Phone Number</label>
                <p className="font-medium text-gray-900">{submission.leader.phoneNumber}</p>
              </div>
              <div>
                <label className="text-xs text-gray-400 uppercase font-bold">Email Address</label>
                <p className="font-medium text-gray-900">{submission.leader.email}</p>
              </div>
            </div>
          </Card>

          {/* Status & Actions */}
          <Card className="p-6 bg-gray-50 border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Status & Actions</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-100 shadow-sm">
                <span className="text-sm text-gray-600">Payment Status</span>
                <Badge className={getStatusColor(submission.paymentStatus)}>
                  {submission.paymentStatus}
                </Badge>
              </div>
              <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-100 shadow-sm">
                <span className="text-sm text-gray-600">Verification</span>
                <Badge className={getStatusColor(submission.verifyStatus)}>
                  {submission.verifyStatus}
                </Badge>
              </div>

              <div className="pt-4 space-y-2">
                {submission.paymentStatus === 'PENDING' && (
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={() => verifyPayment.mutate(submission.id)}
                    disabled={verifyPayment.isPending}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Verify Payment
                  </Button>
                )}
                {submission.verifyStatus === 'IN_REVIEW' && (
                  <div className="flex gap-2">
                    <Button
                      variant="dangerOutline"
                      className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                      onClick={() =>
                        reviewSubmission.mutate({
                          id: submission.id,
                          payload: { status: 'REJECTED', rejectionReason: 'Document incomplete' },
                        })
                      }
                      disabled={reviewSubmission.isPending}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                    <Button
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                      onClick={() =>
                        reviewSubmission.mutate({
                          id: submission.id,
                          payload: { status: 'VERIFIED' },
                        })
                      }
                      disabled={reviewSubmission.isPending}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
