export type TTransactionStatus = 'Submit' | 'Process' | 'Issued' | 'Expired' | 'IN_REVIEW';
export type TPaymentStatus = 'Menunggu' | 'Checking' | 'Completed' | 'PENDING';

export type TOcrType =
  | 'PASSPORT'
  | 'KTP'
  | 'LOGISTICS'
  | 'DEPARTURE_TICKET'
  | 'RETURN_TICKET'
  | 'HOTEL_MECCA'
  | 'HOTEL_MEDINA';

export interface IFlight {
  type: 'DEPARTURE' | 'RETURN';
  flightNo: string;
  carrier: string;
  flightDate: string;
  eta: string;
  etd: string;
  imageUrls: string[];
}

export interface IHotel {
  name: string;
  resvNo: string;
  checkIn: string;
  checkOut: string;
  city: 'MAKKAH' | 'MADINAH';
  roomType: string;
  imageUrls: string[];
}

export interface ITransportation {
  type: 'BUS' | 'TRAIN' | 'TAXI' | 'MPV' | 'OTHER';
  company: string;
  time: string;
  date: string;
  from: string;
  to: string;
  totalVehicle: number;
  totalH?: number;
  imageUrls: string[];
}

export interface ITransaction {
  id: string;
  route?: string;
  createdAt: string;
  updatedAt?: string;
  pilgrimIds: string[];
  status: TTransactionStatus;

  flights: IFlight[];
  hotels: IHotel[];
  transportations: ITransportation[];

  rawdahMenTime?: string;
  rawdahWomenTime?: string;
  notes?: string;
  resultSnapshot?: any;

  invoiceAmount: number;
  totalAmount?: number;
  paymentStatus: TPaymentStatus;
  paymentDeadline?: string;
  paymentProofUrl?: string;
  proofOfPayment?: string;
  members: {
    id: string;
    fullName: string;
    passportNumber: string;
    relation: string;
    photoUrl?: string;
    ktpUrl?: string;
    passportUrl?: string;
    nik?: string;
    gender?: string;
    maritalStatus?: string;
    birthDate?: string;
    passportExpiry?: string;
  }[];
  agency?: {
    bankName?: string;
    bankAccountName?: string;
    bankAccountNumber?: string;
  };
}

export interface IApiTransaction extends Omit<ITransaction, 'pilgrimIds'> {
  members: ITransaction['members'];
}

export interface ICreateTransactionRequest {
  agencySlug?: string;
  pilgrimIds: string[];

  rawdahMenTime?: string;
  rawdahWomenTime?: string;

  flights: IFlight[];
  hotels: IHotel[];
  transportations: ITransportation[];
  notes?: string;
  ocrConfidence?: number;
}

export interface IPaginatedTransactions {
  items: ITransaction[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ILogisticsOcrResponse {
  flightNo?: string;
  flightNumber?: string;
  flight_no?: string;
  carrier?: string;
  date?: string;
  eta?: string;
  etd?: string;
  hotelName?: string;
  hotelCheckin?: string;
  hotelCheckout?: string;
  city?: 'MAKKAH' | 'MADINAH';
  type?: string;
  category?: string;
  isReturn?: boolean;
  confidence?: number;
  publicUrl?: string;
  totalVehicle?: number;
  ocr?: ILogisticsOcrResponse;
  ocrType?: TOcrType;
}

export interface IPreviewResponse {
  isValid: boolean;
  totalAmount: number;
  breakdown: string;
  errors: { path: string; message: string }[];
  warnings: string[];
}
