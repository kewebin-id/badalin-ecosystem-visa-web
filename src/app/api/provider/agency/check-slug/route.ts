import { ICheckSlugResponse } from '@/packages/provider/auth/domain/response';
import { endpoints } from '@/shared/constants/endpoints';
import { getAuthTokenFromRequest } from '@/shared/hooks/use-auth-server';
import Logger from '@/shared/utils/logger';
import { RestAPI } from '@/shared/utils/rest-api';
import { createAuthenticatedApi } from '@/shared/utils/rest-api/server';
import { response } from '@/shared/utils/rest-api/response';
import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');
    const apiKey = process.env.API_KEY;

    if (!apiKey) {
      throw new Error('API_KEY not configured');
    }

    if (!slug) {
      return response[400]({ message: 'Slug is required' });
    }

    const restApi = await createAuthenticatedApi(req);
    const session = await getAuthTokenFromRequest(req);
    const userSlug = session?.user?.agency?.slug || 'p';

    // Replace generic 'p' with actual user slug to bypass reserved-word 403
    const endpoint = endpoints.provider.agency.checkSlug.replace('/p/', `/${userSlug}/`);

    const res = await restApi.get<ICheckSlugResponse>({
      endpoint,
      queryParam: { slug },
      config: {
        headers: {
          'x-api-key': apiKey,
        },
      },
    });

    Logger.info(`GET ${endpoint} - Response: ${JSON.stringify(res)}`, {
      location: 'api/provider/agency/check-slug/route.ts - GET',
    });

    return response.handler(res);
  } catch (error: unknown) {
    Logger.error(error, { location: 'api/provider/agency/check-slug/route.ts - GET' });
    return response[500]({ message: 'Internal server error' });
  }
};
