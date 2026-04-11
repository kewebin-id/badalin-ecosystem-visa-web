import { IFamilyMember, IPaginatedPilgrims } from '@/packages/pilgrim/management/domain/member';
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
    const agencySlug = req.cookies.get('agency_slug')?.value || session?.user?.agency?.slug;
    const apiKey = process.env.API_KEY;

    const { searchParams } = new URL(req.url);
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '10';
    const search = searchParams.get('search') || '';

    if (!session?.token) {
      return response[401]({ message: 'Unauthorized' });
    }

    if (!apiKey) {
      Logger.error('API_KEY not configured', { location: 'api/visa/pilgrims/route.ts - GET' });
      return response[500]({ message: 'Internal server error' });
    }

    const restApi = new RestAPI(undefined, session.token as string);
    const res = await restApi.get<IPaginatedPilgrims>({
      endpoint: endpoints.visa.pilgrims.base,
      queryParam: { page, limit, search },
      config: {
        headers: {
          'x-api-key': apiKey,
          Cookie: `agency_slug=${agencySlug}`,
        },
      },
    });

    Logger.info(`GET ${endpoints.visa.pilgrims.base} - Response: ${JSON.stringify(res)}`, {
      location: 'api/visa/pilgrims/route.ts - GET',
    });

    return response.handler(res);
  } catch (error: unknown) {
    Logger.error(error, { location: 'api/visa/pilgrims/route.ts - GET' });
    return response[500]({ message: 'Internal server error' });
  }
};

export const POST = async (req: NextRequest) => {
  try {
    const session = await getAuthTokenFromRequest(req);
    const agencySlug = req.cookies.get('agency_slug')?.value || session?.user?.agency?.slug;
    const apiKey = process.env.API_KEY;
    const body = await req.json();

    if (!session?.token) {
      return response[401]({ message: 'Unauthorized' });
    }

    if (!apiKey) {
      Logger.error('API_KEY not configured', { location: 'api/visa/pilgrims/route.ts - POST' });
      return response[500]({ message: 'Internal server error' });
    }

    const restApi = new RestAPI(undefined, session.token as string);
    const res = await restApi.post<IFamilyMember>({
      endpoint: endpoints.visa.pilgrims.base,
      body,
      config: {
        headers: {
          'x-api-key': apiKey,
          Cookie: `agency_slug=${agencySlug}`,
        },
      },
    });

    Logger.info(`POST ${endpoints.visa.pilgrims.base} - Response: ${JSON.stringify(res)}`, {
      location: 'api/visa/pilgrims/route.ts - POST',
    });

    return response.handler({ ...res, data: { id: res?.data?.id } });
  } catch (error: unknown) {
    Logger.error(error, { location: 'api/visa/pilgrims/route.ts - POST' });
    return response[500]({ message: 'Internal server error' });
  }
};
