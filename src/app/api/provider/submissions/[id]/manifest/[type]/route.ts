import { endpoints } from '@/shared/constants/endpoints';
import { getAuthTokenFromRequest } from '@/shared/hooks/use-auth-server';
import Logger from '@/shared/utils/logger';
import { RestAPI } from '@/shared/utils/rest-api';
import { response } from '@/shared/utils/rest-api/response';
import { NextRequest } from 'next/server';
import { JWT } from 'next-auth/jwt';
import { IUser } from '@/packages/pilgrim/auth/domain/response';

export const dynamic = 'force-dynamic';

interface ProviderToken extends JWT {
  user?: IUser;
  token?: string;
  agencySlug?: string;
}

export const POST = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string; type: string }> }
) => {
  try {
    const { id, type } = await params;
    const session = (await getAuthTokenFromRequest(req)) as ProviderToken | null;
    const apiKey = process.env.API_KEY;

    if (!session?.token) return response[401]({ message: 'Unauthorized' });
    if (!apiKey) return response[500]({ message: 'Internal server error' });

    const body = await req.json();

    const user = session?.user;
    const userSlug = user?.agency?.slug || user?.agencySlug || session?.agencySlug || 'p';

    let endpoint = '';
    switch (type) {
      case 'flight':
        endpoint = endpoints.provider.submissions.flightManifest(userSlug, id);
        break;
      case 'hotel':
        endpoint = endpoints.provider.submissions.hotelManifest(userSlug, id);
        break;
      case 'transport':
        endpoint = endpoints.provider.submissions.transportManifest(userSlug, id);
        break;
      default:
        return response[400]({ message: 'Invalid manifest type' });
    }

    const restApi = new RestAPI(undefined, session.token as string);
    const res = await restApi.post({
      endpoint,
      body,
      config: {
        headers: {
          'x-api-key': apiKey,
        },
      },
    });

    Logger.info(
      `POST ${endpoint} - Response Status: ${res?.code}`,
      {
        location: `api/provider/submissions/[id]/manifest/[type]/route.ts - POST (${type})`,
      }
    );

    return response.handler(res);
  } catch (error: unknown) {
    Logger.error(error, { location: 'api/provider/submissions/[id]/manifest/[type]/route.ts - POST' });
    return response[500]({ message: 'Internal server error' });
  }
};
