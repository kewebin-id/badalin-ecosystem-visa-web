export interface IVerifyTokenResponse {
  email: string;
}

export interface IRegisterProviderResponse {
  id: string;
  email: string;
}

export interface IAgencyInfo {
  name: string;
  slug: string;
  isActive: boolean;
}

export interface IProviderUser {
  id: string;
  email: string;
  phoneNumber?: string;
  fullName: string;
  role: 'PROVIDER' | 'SUPERADMIN';
  photoUrl?: string;
  agency?: IAgencyInfo;
}

export interface ILoginResponse {
  user: IProviderUser;
  token: string;
}

export interface ICheckSlugResponse {
  available: boolean;
}
