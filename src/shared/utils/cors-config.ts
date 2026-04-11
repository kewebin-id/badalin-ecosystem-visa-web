import { NextResponse } from 'next/server';

const ALLOWED_ORIGIN = (process.env.NODE_ENV === 'production' ? process.env.BASE_URL : '*') || '*';
const ALLOWED_METHODS = 'GET, POST, PUT, DELETE, OPTIONS, PATCH';
const ALLOWED_HEADERS = 'Content-Type, Authorization, X-Requested-With';
const MAX_AGE = '86400';

export const setCorsHeaders = (response: NextResponse): NextResponse => {
  response.headers.set('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
  response.headers.set('Access-Control-Allow-Methods', ALLOWED_METHODS);
  response.headers.set('Access-Control-Allow-Headers', ALLOWED_HEADERS);
  response.headers.set('Access-Control-Max-Age', MAX_AGE);
  return response;
};
