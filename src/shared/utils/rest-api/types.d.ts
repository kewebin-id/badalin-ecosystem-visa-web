export interface RequestAPI {
  get: <T extends Partial<object> | undefined | void>(payload: {
    endpoint: string;
    queryParam?: object;
    config?: any;
    isNextApi?: boolean;
  }) => Promise<ResponseREST<T>>;
  post: <T extends Partial<object> | undefined | void>(payload: {
    endpoint: string;
    body?: object;
    queryParam?: object;
    config?: any;
    isNextApi?: boolean;
  }) => Promise<ResponseREST<T>>;
  put: <T extends Partial<object> | undefined | void>(payload: {
    endpoint: string;
    body?: object;
    queryParam?: object;
    config?: any;
    isNextApi?: boolean;
  }) => Promise<ResponseREST<T>>;
  patch: <T extends Partial<object> | undefined | void>(payload: {
    endpoint: string;
    body?: object;
    queryParam?: object;
    config?: any;
    isNextApi?: boolean;
  }) => Promise<ResponseREST<T>>;
  delete: <T extends Partial<object> | undefined | void>(payload: {
    endpoint: string;
    bodyparam?: object;
    queryParam?: object;
    config?: any;
    isNextApi?: boolean;
  }) => Promise<ResponseREST<T>>;
}

export interface ResponseRESTPagination<T extends Partial<object> | undefined | void> {
  data: Array<T>;
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPending?: number;
  };
}

export interface ResponseREST<T extends Partial<object> | undefined | void> {
  [key: string]: unknown;
  code?: number | string;
  message: string;
  data?: T;
}

export interface IUseCaseInfiniteScroll<T extends object> {
  data?: T;
  prevPage: number;
}

export type IQueryParams = {
  limit: number;
  take?: number;
  page: number;
  search?: string;
  isDropdown?: boolean;
  sortBy?: string;
  ascDesc?: 'asc' | 'desc';
  licensePlate?: string;
  brandModel?: string;
  vehicleType?: string;
  vendorId?: number;
  status?: string;
  fullName?: string;
  driverType?: string;
  realtimeStatus?: string;
  transmission?: string;
  location?: string;
  requesterId?: number | string;
  bookingStatus?: string;
  serviceType?: string;
  resourceMode?: string;
  categoryId?: number;
  bookingNumber?: string;
  startDateFrom?: string;
  startDateTo?: string;
  submittedDateFrom?: string;
  submittedDateTo?: string;
};

export interface ConfigService {
  Authorization: string;
  [key: string]: string | number | object | boolean;
}

export interface Context<T = unknown> {
  params: T;
}
