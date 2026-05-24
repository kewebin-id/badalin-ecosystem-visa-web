import { endpoints } from '@/shared/constants/endpoints';
import { getAuthTokenFromRequest } from '@/shared/hooks/use-auth-server';
import Logger from '@/shared/utils/logger';
import { RestAPI } from '@/shared/utils/rest-api';
import { response } from '@/shared/utils/rest-api/response';
import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export const GET = async (req: NextRequest) => {
  try {
    const session = await getAuthTokenFromRequest(req);
    const apiKey = process.env.API_KEY;

    const { searchParams } = new URL(req.url);
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '10';

    if (!session?.token) {
      return response[401]({ message: 'Unauthorized' });
    }

    if (!apiKey) {
      Logger.error('API_KEY not configured', { location: 'api/visa/notifications/route.ts - GET' });
      return response[500]({ message: 'Internal server error' });
    }

    const restApi = new RestAPI(undefined, session.token as string);
    // Note: Use `any` or a specific paginated type since the response structure might have changed to support pagination
    const res = await restApi.get<any>({
      endpoint: endpoints.notifications.list,
      queryParam: { page, limit },
      config: {
        headers: {
          'x-api-key': apiKey,
        },
      },
    });

    return response.handler(res);
  } catch (error: unknown) {
    Logger.error(error, { location: 'api/visa/notifications/route.ts - GET' });
    return response[500]({ message: 'Internal server error' });
  }
};
