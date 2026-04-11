import { IAuthUser, IUser } from '@/packages/pilgrim/auth/domain/response';
import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: IAuthUser;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-interface,@typescript-eslint/no-empty-object-type
  interface User extends IAuthUser {}
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    roles?: string[];
    isVerified?: boolean;
    employeeId?: string;
    fullName?: string;
    orgUnitId?: number;
    avatar?: string;
    phone?: string | null;
    token?: string;
    provider?: string;
    idToken?: string;
    accessToken?: string;
    user?: IUser;
  }
}
