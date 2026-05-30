import { ITransaction } from './transaction';

export const getTransactionDisplayStatus = (transaction: ITransaction) => {
  if (transaction.status === 'AUTO_CANCELED') {
    return {
      status: transaction.status,
      labelKey: `status.${transaction.status}`,
    };
  }

  if (transaction.paymentStatus === 'PENDING') {
    return {
      status: 'PENDING_PAYMENT',
      labelKey: 'detail.pendingPayment',
    };
  }
  if (transaction.paymentStatus === 'CHECKING') {
    return {
      status: 'CHECKING_PAYMENT',
      labelKey: 'detail.checkingPayment',
    };
  }
  return {
    status: transaction.status,
    labelKey: `status.${transaction.status}`,
  };
};
