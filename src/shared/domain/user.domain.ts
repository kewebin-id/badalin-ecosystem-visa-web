export interface IUser {
  id: string;
  email?: string;
  name?: string;
  image?: string;
  token?: string;
  [key: string]: unknown;
}

export interface IAuthUser extends IUser {
  token: string;
}
