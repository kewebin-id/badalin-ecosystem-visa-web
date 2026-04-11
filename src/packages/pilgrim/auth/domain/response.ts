export interface IAgency {
  name: string;
  slug: string;
  isActive: boolean;
}

export interface IUser {
  id: string;
  email: string;
  phoneNumber: string;
  fullName: string | null;
  role: string;
  employeeId?: string;
  photoUrl: string | null;
  agency: IAgency | null;
}

export interface ILoginResponse {
  user: IUser;
  token: string;
}

export interface IRegisterResponse {
  id: string;
  email: string;
}

export interface ICheckUserResponse {
  exists: boolean;
}

export interface IAuthUser extends IUser {
  token: string;
  provider?: string;
  isVerified?: boolean;
}

export interface ISearchUserResponse {
  employeeId: string;
  fullName: string;
  email: string;
  orgUnit?: {
    id: number;
    code: string;
    name: string;
  };
}
