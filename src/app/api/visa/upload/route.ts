import { endpoints } from '@/shared/constants/endpoints';
import { getAuthTokenFromRequest } from '@/shared/hooks/use-auth-server';
import Logger from '@/shared/utils/logger';
import { RestAPI } from '@/shared/utils/rest-api';
import { response } from '@/shared/utils/rest-api/response';
import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export const POST = async (req: NextRequest) => {
  let rawBody = '';
  try {
    const session = await getAuthTokenFromRequest(req);
    const apiKey = process.env.API_KEY;

    try {
      rawBody = await req.text();
      if (!rawBody) {
        return response[400]({ message: 'Empty body' });
      }
    } catch {
      Logger.error('Failed to read request body', { location: 'api/visa/upload/route.ts - POST' });
      return response[400]({ message: 'Failed to read request body' });
    }

    let body;
    try {
      body = JSON.parse(rawBody);
    } catch (parseError) {
      Logger.error(
        `Invalid JSON body: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`,
        {
          location: 'api/visa/upload/route.ts - POST',
        },
      );
      return response[400]({ message: 'Invalid JSON body' });
    }

    if (!session?.token) {
      return response[401]({ message: 'Unauthorized' });
    }

    if (!apiKey) {
      Logger.error('API_KEY not configured', { location: 'api/visa/upload/route.ts - POST' });
      return response[500]({ message: 'Internal server error' });
    }

    const restApi = new RestAPI(undefined, session.token as string);
    const res = await restApi.post<Record<string, unknown>>({
      endpoint: endpoints.visa.upload,
      body,
      config: {
        headers: {
          'x-api-key': apiKey,
        },
      },
    });

    Logger.info(`POST ${endpoints.visa.upload} - Response: ${JSON.stringify(res)}`, {
      location: 'api/visa/upload/route.ts - POST',
    });

    return response.handler(res);
  } catch (error: unknown) {
    Logger.error(error, {
      location: 'api/visa/upload/route.ts - POST',
    });
    return response[500]({ message: 'Internal server error' });
  }
};
