import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';

/**
 * Helper to retrieve the server-side session token for API routes and server components
 * @param req - NextRequest object
 * @returns JWT token with user data or null
 */
export const getAuthTokenFromRequest = async (req: NextRequest) => {
  return getToken({ req, secret: process.env.NEXTAUTH_SECRET });
};
