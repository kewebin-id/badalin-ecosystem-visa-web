import { endpoints } from '@/shared/constants/endpoints';
import { getAuthTokenFromRequest } from '@/shared/hooks/use-auth-server';
import Logger from '@/shared/utils/logger';
import { RestAPI } from '@/shared/utils/rest-api';
import { response } from '@/shared/utils/rest-api/response';
import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export const PATCH = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const session = await getAuthTokenFromRequest(req);
    const apiKey = process.env.API_KEY;
    const { id } = await params;

    if (!session?.token) {
      return response[401]({ message: 'Unauthorized' });
    }

    if (!apiKey) {
      Logger.error('API_KEY not configured', { location: `api/visa/notifications/[id]/read/route.ts - PATCH` });
      return response[500]({ message: 'Internal server error' });
    }

    const restApi = new RestAPI(undefined, session.token as string);
    const res = await restApi.patch<void>({
      endpoint: endpoints.notifications.markAsRead(id),
      config: {
        headers: {
          'x-api-key': apiKey,
        },
      },
    });

    return response.handler(res);
  } catch (error: unknown) {
    Logger.error(error, { location: `api/visa/notifications/[id]/read/route.ts - PATCH` });
    return response[500]({ message: 'Internal server error' });
  }
};
