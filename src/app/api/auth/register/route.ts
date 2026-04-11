import { IRegisterResponse } from '@/packages/pilgrim/auth/domain/response';
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
    const agencySlug = req.cookies.get('agency_id')?.value;

    if (!apiKey) {
      throw new Error('API_KEY not configured');
    }

    const headers: Record<string, string> = {
      'x-api-key': apiKey,
    };

    if (agencySlug) {
      headers['Cookie'] = `agency_id=${agencySlug}`;
    }

    const api = new RestAPI();
    const res = await api.post<IRegisterResponse>({
      endpoint: endpoints.auth.register,
      body,
      config: {
        headers,
      },
    });

    Logger.info(`POST ${endpoints.auth.register} - Response: ${JSON.stringify(res)}`, {
      location: 'api/auth/register/route.ts - POST',
    });

    return response.handler(res);
  } catch (error: unknown) {
    Logger.error(error, { location: 'api/auth/register/route.ts - POST' });
    return response[500]({ message: 'Internal server error' });
  }
};
