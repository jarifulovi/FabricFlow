import axios from 'axios';
import { AppError, BadRequestError } from '../utils/errors';

type TokenResponse = {
  access_token?: string;
  id_token?: string;
};

type GoogleUserInfoResponse = {
  sub?: string;
  email?: string;
  email_verified?: boolean;
  name?: string;
};

type GoogleOAuthProfile = {
  externalId: string;
  email: string;
  name: string | null;
};

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;
const GOOGLE_OAUTH_SCOPE = process.env.GOOGLE_OAUTH_SCOPE || 'openid email profile';

const GOOGLE_AUTHORIZE_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GOOGLE_USERINFO_URL = 'https://openidconnect.googleapis.com/v1/userinfo';

export const googleOAuthService = {
  ensureConfigured(): void {
    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REDIRECT_URI) {
      throw new AppError('Google OAuth is not configured', 500);
    }
  },

  buildAuthorizationUrl(state: string): string {
    this.ensureConfigured();

    const query = new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID as string,
      redirect_uri: GOOGLE_REDIRECT_URI as string,
      response_type: 'code',
      scope: GOOGLE_OAUTH_SCOPE,
      state,
      access_type: 'offline',
      prompt: 'consent',
    });

    return `${GOOGLE_AUTHORIZE_URL}?${query.toString()}`;
  },

  async exchangeCodeForTokens(code: string): Promise<TokenResponse> {
    this.ensureConfigured();

    const body = new URLSearchParams({
      code,
      client_id: GOOGLE_CLIENT_ID as string,
      client_secret: GOOGLE_CLIENT_SECRET as string,
      redirect_uri: GOOGLE_REDIRECT_URI as string,
      grant_type: 'authorization_code',
    });

    const response = await axios.post<TokenResponse>(GOOGLE_TOKEN_URL, body.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      timeout: 15000,
    });

    if (!response.data?.access_token) {
      throw new BadRequestError('Google token exchange failed');
    }

    return response.data;
  },

  async fetchUserProfile(accessToken: string): Promise<GoogleOAuthProfile> {
    const response = await axios.get<GoogleUserInfoResponse>(GOOGLE_USERINFO_URL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      timeout: 15000,
    });

    const payload = response.data;
    if (!payload?.sub || !payload?.email) {
      throw new BadRequestError('Google user profile is incomplete');
    }

    if (payload.email_verified === false) {
      throw new BadRequestError('Google email is not verified');
    }

    return {
      externalId: payload.sub,
      email: payload.email.trim().toLowerCase(),
      name: payload.name?.trim() || null,
    };
  },
};
