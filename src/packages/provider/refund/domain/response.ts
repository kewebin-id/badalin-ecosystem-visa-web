export interface IRefundListItem {
  pilgrimId: string;
  fullName: string;
  passportNumber: string;
  submissionId: string;
  refundAmount: number;
  refundStatus: string;
  deadline: string | null;
}

export interface ISettleRefundResponse {
  success: boolean;
}
