export interface IVerifyTokenRequest {
  token: string;
}

export interface IRegisterProviderRequest {
  invitationToken: string;
  password: string;
  fullName: string;
}

export interface ILoginRequest {
  identifier: string;
  password: string;
}

export interface IForgotPasswordRequest {
  identifier: string;
}

export interface IResetPasswordRequest {
  token: string;
  password: string;
}
