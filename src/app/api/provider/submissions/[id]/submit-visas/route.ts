import { endpoints } from '@/shared/constants/endpoints';
import { getAuthTokenFromRequest } from '@/shared/hooks/use-auth-server';
import Logger from '@/shared/utils/logger';
import { RestAPI } from '@/shared/utils/rest-api';
import { response } from '@/shared/utils/rest-api/response';
import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export const PATCH = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  try {
    const session = await getAuthTokenFromRequest(req);
    const agencySlug = req.cookies.get('agency_slug')?.value || session?.user?.agency?.slug;
    const apiKey = process.env.API_KEY;

    if (!session?.token) return response[401]({ message: 'Unauthorized' });
    if (!apiKey) return response[500]({ message: 'Internal server error' });

    const body = await req.json();

    const restApi = new RestAPI(undefined, session.token as string);
    const res = await restApi.patch({
      endpoint: endpoints.provider.submissions.submitVisas(agencySlug || 'p', id),
      body,
      config: {
        headers: {
          'x-api-key': apiKey,
          Cookie: `agency_slug=${agencySlug}`,
        },
      },
    });

    Logger.info(JSON.stringify(res), {
      location: `api/provider/submissions/${id}/submit-visas/route.ts - PATCH`,
    });

    return response.handler(res);
  } catch (error: unknown) {
    Logger.error(error, { location: `api/provider/submissions/${id}/submit-visas/route.ts - PATCH` });
    return response[500]({ message: 'Internal server error' });
  }
};
