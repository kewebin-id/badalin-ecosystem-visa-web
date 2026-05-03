export interface IGetSubmissionsQuery {
  page?: number;
  limit?: number;
  search?: string;
}

export interface IFlightManifestPayload {
  type: 'DEPARTURE' | 'RETURN';
  flightNo: string;
  carrier: string;
  flightDate: string;
  eta: string;
  etd: string;
  imageUrls: string[];
}

export interface IHotelManifestPayload {
  name: string;
  resvNo: string;
  checkIn: string;
  checkOut: string;
  city: string;
  roomType: string;
  imageUrls: string[];
}

export interface ITransportManifestPayload {
  type: string;
  company: string;
  time: string;
  date: string;
  from: string;
  to: string;
  totalVehicle: number;
  imageUrls: string[];
}

export interface IReviewSubmissionPayload {
  status: 'VERIFIED' | 'REJECTED';
  rejectionReason?: string;
}
