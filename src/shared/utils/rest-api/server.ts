import { getAuthTokenFromRequest } from '@/shared/hooks/use-auth-server';
import { NextRequest } from 'next/server';
import Logger from '../logger';
import { RestAPI } from './rest-api';

export const createAuthenticatedApi = async (req: NextRequest) => {
  const session = await getAuthTokenFromRequest(req);

  if (!session?.token) {
    Logger.error('createAuthenticatedApi: Token is missing from session', {
      location: 'shared/utils/rest-api/server.ts',
    });
  } else {
    Logger.info('createAuthenticatedApi: Creating API with token', {
      location: 'shared/utils/rest-api/server.ts',
    });
  }

  return new RestAPI(
    undefined,
    session?.token as string | undefined,
    session?.employeeId as string | undefined,
  );
};
