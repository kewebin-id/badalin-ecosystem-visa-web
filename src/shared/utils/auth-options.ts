import { IAuthUser, ILoginResponse, IUser } from '@/packages/pilgrim/auth/domain/response';
import { ILoginRequest } from '@/packages/pilgrim/auth/domain/request';
import { AuthRepository } from '@/packages/pilgrim/auth/repository';
import { AuthUseCase } from '@/packages/pilgrim/auth/usecase';
import type { NextAuthOptions, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import Logger from './logger';
import { RestAPI } from './rest-api';

type AuthenticatedSessionUser = User & IUser & { token: string; isVerified?: boolean };

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        identifier: { label: 'NIK or Corporate Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials): Promise<User | null> => {
        try {
          const dataStoreApi = new RestAPI();
          const authRepository = new AuthRepository(dataStoreApi);
          const authUseCase = new AuthUseCase(authRepository);

          const { decrypt } = await import('./crypto');

          const payload: ILoginRequest = {
            identifier: decrypt<string>(credentials?.identifier || '') || credentials?.identifier || '',
            password: decrypt<string>(credentials?.password || '') || credentials?.password || '',
          };

          const response = await authUseCase.login(payload);
          if (response?.error) {
            Logger.error(response.error, { location: 'NextAuth.authorize' });
            return null;
          }

          const loginData = response?.data as ILoginResponse;

          return {
            token: loginData.token,
            ...loginData.user,
          } as User & IUser & { token: string };
        } catch (error) {
          Logger.error(error, { location: 'NextAuth.authorize' });
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      const dataStoreApi = new RestAPI();
      const authRepository = new AuthRepository(dataStoreApi);
      const authUseCase = new AuthUseCase(authRepository);

      try {
        if (account?.provider === 'google' && account.id_token) {
          token.provider = 'google';
          token.idToken = account.id_token;
          token.accessToken = account.access_token;

          const response = await authUseCase.socialAuth(account.id_token);
          if (response?.data) {
            const loginData = response.data;
            token.id = loginData.user.id;
            token.email = loginData.user.email;
            token.fullName = loginData.user.fullName || undefined;
            token.role = loginData.user.role;
            token.token = loginData.token;
          }
        }

        if (user && account?.provider === 'credentials') {
          const userData = user as AuthenticatedSessionUser;
          token.provider = account?.provider;
          token.user = {
            id: userData.id,
            email: userData.email,
            phoneNumber: userData.phoneNumber,
            fullName: userData.fullName,
            role: userData.role,
            photoUrl: userData.photoUrl,
            agency: userData.agency,
          };
          token.role = userData.role;
          token.token = userData.token;
        }

        return token;
      } catch (err) {
        console.error('NextAuth JWT callback error:', err);
        return token;
      }
    },

    async session({ session, token }) {
      if (token.user) {
        session.user = {
          ...(token.user as IUser),
          token: token.token as string,
          provider: token.provider as string | undefined,
        };
      }
      return session;
    },
  },

  pages: {
    signIn: '/auth/login',
    signOut: '/',
  },

  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: parseInt(process.env.NEXTAUTH_SESSION_MAX_AGE ?? '2592000'),
  },
  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === 'production'
          ? `__Secure-next-auth.session-token`
          : `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure:
          process.env.NODE_ENV === 'production' &&
          !process.env.NEXTAUTH_URL?.includes('localhost'),
      },
    },
  },
};
