import { IFamilyMember } from '@/packages/pilgrim/management/domain/member';
import { endpoints } from '@/shared/constants/endpoints';
import { getAuthTokenFromRequest } from '@/shared/hooks/use-auth-server';
import Logger from '@/shared/utils/logger';
import { RestAPI } from '@/shared/utils/rest-api';
import { response } from '@/shared/utils/rest-api/response';
import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export const GET = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const session = await getAuthTokenFromRequest(req);
    const agencySlug = req.cookies.get('agency_slug')?.value || session?.user?.agency?.slug;
    const apiKey = process.env.API_KEY;
    const { id } = await params;

    if (!session?.token) {
      return response[401]({ message: 'Unauthorized' });
    }

    if (!apiKey) {
      Logger.error('API_KEY not configured', { location: 'api/visa/pilgrims/[id]/route.ts - GET' });
      return response[500]({ message: 'Internal server error' });
    }

    const restApi = new RestAPI(undefined, session.token as string);
    const res = await restApi.get({
      endpoint: endpoints.visa.pilgrims.detail(id),
      config: {
        headers: {
          'x-api-key': apiKey,
          Cookie: `agency_slug=${agencySlug}`,
        },
      },
    });

    Logger.info(`GET ${endpoints.visa.pilgrims.detail(id)} - Response: ${JSON.stringify(res)}`, {
      location: 'api/visa/pilgrims/[id]/route.ts - GET',
    });

    return response.handler(res);
  } catch (error: unknown) {
    Logger.error(error, { location: 'api/visa/pilgrims/[id]/route.ts - GET' });
    return response[500]({ message: 'Internal server error' });
  }
};

export const PUT = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const session = await getAuthTokenFromRequest(req);
    const agencySlug = req.cookies.get('agency_slug')?.value || session?.user?.agency?.slug;
    const apiKey = process.env.API_KEY;
    const body = await req.json();
    const { id } = await params;

    if (!session?.token) {
      return response[401]({ message: 'Unauthorized' });
    }

    if (!apiKey) {
      Logger.error('API_KEY not configured', { location: 'api/visa/pilgrims/[id]/route.ts - PUT' });
      return response[500]({ message: 'Internal server error' });
    }

    const restApi = new RestAPI(undefined, session.token as string);
    const res = await restApi.put<IFamilyMember>({
      endpoint: endpoints.visa.pilgrims.detail(id),
      body,
      config: {
        headers: {
          'x-api-key': apiKey,
          Cookie: `agency_slug=${agencySlug}`,
        },
      },
    });

    Logger.info(`PUT ${endpoints.visa.pilgrims.detail(id)} - Response: ${JSON.stringify(res)}`, {
      location: 'api/visa/pilgrims/[id]/route.ts - PUT',
    });

    return response.handler({ ...res, data: { id } });
  } catch (error: unknown) {
    Logger.error(error, { location: 'api/visa/pilgrims/[id]/route.ts - PUT' });
    return response[500]({ message: 'Internal server error' });
  }
};

export const DELETE = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const session = await getAuthTokenFromRequest(req);
    const agencySlug = req.cookies.get('agency_slug')?.value || session?.user?.agency?.slug;
    const apiKey = process.env.API_KEY;
    const { id } = await params;

    if (!session?.token) {
      return response[401]({ message: 'Unauthorized' });
    }

    if (!apiKey) {
      Logger.error('API_KEY not configured', {
        location: 'api/visa/pilgrims/[id]/route.ts - DELETE',
      });
      return response[500]({ message: 'Internal server error' });
    }

    const restApi = new RestAPI(undefined, session.token as string);
    const res = await restApi.delete({
      endpoint: endpoints.visa.pilgrims.detail(id),
      config: {
        headers: {
          'x-api-key': apiKey,
          Cookie: `agency_slug=${agencySlug}`,
        },
      },
    });

    Logger.info(`DELETE ${endpoints.visa.pilgrims.detail(id)} - Response: ${JSON.stringify(res)}`, {
      location: 'api/visa/pilgrims/[id]/route.ts - DELETE',
    });

    return response.handler(res);
  } catch (error: unknown) {
    Logger.error(error, { location: 'api/visa/pilgrims/[id]/route.ts - DELETE' });
    return response[500]({ message: 'Internal server error' });
  }
};
