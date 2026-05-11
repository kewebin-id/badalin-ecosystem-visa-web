import { ITransaction } from '../../transaction/domain/transaction';

export interface IVisaHistory extends ITransaction {
  transactionId: string;
  destinationDate: string;
  flightRoute: string;
  airlineName: string;
  hotelName: string;
  totalDays: number;
  memberCount: number;
}
