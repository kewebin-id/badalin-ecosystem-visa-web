import { endpoints } from '@/shared/constants/endpoints';
import Logger from '@/shared/utils/logger';
import { RestAPI } from '@/shared/utils/rest-api';
import { response } from '@/shared/utils/rest-api/response';
import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const apiKey = process.env.API_KEY;

    if (!apiKey) {
      throw new Error('API_KEY not configured');
    }

    const restApi = new RestAPI();
    const res = await restApi.post<{ message: string }>({
      endpoint: endpoints.provider.auth.forgotPassword,
      body,
      config: {
        headers: {
          'x-api-key': apiKey,
        },
      },
    });

    Logger.info(`POST ${endpoints.provider.auth.forgotPassword} - Response: ${JSON.stringify(res)}`, {
      location: 'api/provider/auth/forgot-password/route.ts - POST',
    });

    return response.handler(res);
  } catch (error: unknown) {
    Logger.error(error, { location: 'api/provider/auth/forgot-password/route.ts - POST' });
    return response[500]({ message: 'Internal server error' });
  }
};
