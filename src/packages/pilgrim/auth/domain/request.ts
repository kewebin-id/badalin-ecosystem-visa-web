export enum ELoginType {
  EMAIL = 'EMAIL',
  WHATSAPP = 'WHATSAPP',
  SMS = 'SMS',
}

export interface ILoginRequest {
  identifier: string;
  password: string;
}

export interface IRegisterRequest {
  fullName: string;
  identifier: string;
  email: string;
  phoneNumber: string;
  password: string;
}

export interface IRequestVerifyOtp {
  token: string;
  otp: string;
  purpose: 'REGISTRATION' | 'LOGIN' | 'FORGOT_PASSWORD';
}

export interface IForgotPasswordRequest {
  identifier: string;
}

export interface IResetPasswordRequest {
  token: string;
  password: string;
}
