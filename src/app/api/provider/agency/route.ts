import { endpoints } from '@/shared/constants/endpoints';
import { getAuthTokenFromRequest } from '@/shared/hooks/use-auth-server';
import Logger from '@/shared/utils/logger';
import { RestAPI } from '@/shared/utils/rest-api';
import { response } from '@/shared/utils/rest-api/response';
import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export const PATCH = async (req: NextRequest) => {
  try {
    const session = await getAuthTokenFromRequest(req);
    const apiKey = process.env.API_KEY;
    const body = await req.json();

    if (!session?.token) return response[401]({ message: 'Unauthorized' });
    if (!apiKey) return response[500]({ message: 'Internal server error' });

    const restApi = new RestAPI(undefined, session.token as string);
    const res = await restApi.patch({
      endpoint: endpoints.provider.agency.base,
      body,
      config: {
        headers: {
          'x-api-key': apiKey,
        },
      },
    });

    Logger.info(`PATCH ${endpoints.provider.agency.base} - Response: ${JSON.stringify(res)}`, {
      location: 'api/provider/agency/route.ts - PATCH',
    });

    if (res?.code !== 200) {
      return response[res.code as keyof typeof response]({
        message: res.message,
      });
    }

    return response.handler(res);
  } catch (error: unknown) {
    Logger.error(error, { location: 'api/provider/agency/route.ts - PATCH' });
    return response[500]({ message: 'Internal server error' });
  }
};
