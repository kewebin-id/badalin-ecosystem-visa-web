import { endpoints } from '@/shared/constants/endpoints';
import { getAuthTokenFromRequest } from '@/shared/hooks/use-auth-server';
import Logger from '@/shared/utils/logger';
import { RestAPI } from '@/shared/utils/rest-api';
import { response } from '@/shared/utils/rest-api/response';
import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export const POST = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  let id = '';
  try {
    const p = await params;
    id = p.id;
    const session = await getAuthTokenFromRequest(req);
    const agencySlug = req.cookies.get('agency_slug')?.value || session?.user?.agency?.slug;
    const apiKey = process.env.API_KEY;
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!session?.token) return response[401]({ message: 'Unauthorized' });
    if (!apiKey) return response[500]({ message: 'Internal server error' });
    if (!file) return response[400]({ message: 'No file uploaded' });

    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');
    const base64WithPrefix = `data:${file.type};base64,${base64}`;

    const restApi = new RestAPI(undefined, session.token as string);
    const endpoint = endpoints.visa.submissions.paymentProof(id);

    Logger.info(`POST ${endpoint} - Starting upload (base64)`, {
      location: `api/visa/submissions/${id}/payment-proof/route.ts - POST`,
    });

    const res = await restApi.post({
      endpoint,
      body: {
        file: base64WithPrefix,
      },
      config: {
        headers: {
          'x-api-key': apiKey,
          Cookie: `agency_slug=${agencySlug}`,
        },
      },
    });

    Logger.info(`POST ${endpoint} - Response: ${JSON.stringify(res)}`, {
      location: `api/visa/submissions/${id}/payment-proof/route.ts - POST`,
    });

    return response.handler(res);
  } catch (error: unknown) {
    Logger.error(error, { location: `api/visa/submissions/${id}/payment-proof/route.ts - POST` });
    return response[500]({ message: 'Internal server error' });
  }
};
