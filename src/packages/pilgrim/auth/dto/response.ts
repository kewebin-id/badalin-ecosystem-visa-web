export interface IAuthUser {
  employeeId: string;
  fullName: string;
  email: string;
  roles: string[];
  orgUnit?: {
    code: string;
    name: string;
    type: string;
  };
}

export interface ILoginResponse {
  accessToken: string;
  user: IAuthUser;
}

export interface IRegisterResponse {
  message: string;
  userId: string;
}
