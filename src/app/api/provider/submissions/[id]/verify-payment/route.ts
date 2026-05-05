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

export const PATCH = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await params;
    const session = (await getAuthTokenFromRequest(req)) as ProviderToken | null;
    const apiKey = process.env.API_KEY;

    if (!session?.token) return response[401]({ message: 'Unauthorized' });
    if (!apiKey) return response[500]({ message: 'Internal server error' });

    const user = session?.user;
    const userSlug = user?.agency?.slug || user?.agencySlug || session?.agencySlug || 'p';
    
    const restApi = new RestAPI(undefined, session.token as string);
    const res = await restApi.patch({
      endpoint: endpoints.provider.submissions.verifyPayment(userSlug, id),
      config: {
        headers: {
          'x-api-key': apiKey,
        },
      },
    });

    Logger.info(`PATCH ${endpoints.provider.submissions.verifyPayment(userSlug, id)} - Response Status: ${res?.code}`, {
      location: 'api/provider/submissions/[id]/verify-payment/route.ts - PATCH',
    });

    return response.handler(res);
  } catch (error: unknown) {
    Logger.error(error, { location: 'api/provider/submissions/[id]/verify-payment/route.ts - PATCH' });
    return response[500]({ message: 'Internal server error' });
  }
};
