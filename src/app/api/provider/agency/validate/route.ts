import { endpoints } from '@/shared/constants/endpoints';
import { getAuthTokenFromRequest } from '@/shared/hooks/use-auth-server';
import Logger from '@/shared/utils/logger';
import { RestAPI } from '@/shared/utils/rest-api';
import { response } from '@/shared/utils/rest-api/response';
import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export const GET = async (req: NextRequest) => {
  try {
    const apiKey = process.env.API_KEY;

    if (!apiKey) {
      Logger.error('API_KEY is not defined in environment variables', {
        location: 'api/provider/agency/validate/route.ts - GET',
      });
      return response[500]({ message: 'Internal server error' });
    }

    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return response[400]({ message: 'Slug is required' });
    }

    const restApi = new RestAPI();
    const res = await restApi.get({
      endpoint: endpoints.provider.agency.validateSession(slug),
      config: {
        headers: {
          'x-api-key': apiKey,
        },
      },
    });

    Logger.info(
      `GET ${endpoints.provider.agency.validateSession(slug)} - Response: ${JSON.stringify(res)}`,
      {
        location: 'api/provider/agency/validate/route.ts - GET',
      },
    );

    return response.handler(res);
  } catch (error: unknown) {
    Logger.error(error, { location: 'api/provider/agency/validate/route.ts - GET' });
    return response[500]({ message: 'Internal server error' });
  }
};
