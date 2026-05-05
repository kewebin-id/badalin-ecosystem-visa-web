import { endpoints } from '@/shared/constants/endpoints';
import { getAuthTokenFromRequest } from '@/shared/hooks/use-auth-server';
import Logger from '@/shared/utils/logger';
import { RestAPI } from '@/shared/utils/rest-api';
import { response } from '@/shared/utils/rest-api/response';
import { NextRequest } from 'next/server';
import { JWT } from 'next-auth/jwt';
import { IUser } from '@/packages/pilgrim/auth/domain/response';

export const dynamic = 'force-dynamic';

interface ProviderToken extends JWT {
  user?: IUser;
  token?: string;
  agencySlug?: string;
}

export const GET = async (req: NextRequest) => {
  try {
    const session = (await getAuthTokenFromRequest(req)) as ProviderToken | null;
    const apiKey = process.env.API_KEY;

    if (!session?.token) return response[401]({ message: 'Unauthorized' });
    if (!apiKey) return response[500]({ message: 'Internal server error' });

    const searchParams = req.nextUrl.searchParams;
    const query = Object.fromEntries(searchParams.entries());

    const user = session?.user;
    const userSlug = user?.agency?.slug || user?.agencySlug || session?.agencySlug || 'p';
    
    const restApi = new RestAPI(undefined, session.token as string);
    const res = await restApi.get({
      endpoint: endpoints.provider.submissions.base(userSlug),
      queryParam: query,
      config: {
        headers: {
          'x-api-key': apiKey,
        },
      },
    });

    Logger.info(`GET ${endpoints.provider.submissions.base(userSlug)} - Response Status: ${res?.code}`, {
      location: 'api/provider/submissions/route.ts - GET',
      data: res,
    });

    return response.handler(res);
  } catch (error: unknown) {
    Logger.error(error, { 
      location: 'api/provider/submissions/route.ts - GET',
      error: error instanceof Error ? { message: error.message, stack: error.stack } : error 
    });
    return response[500]({ message: 'Internal server error' });
  }
};
