import session, { SessionOptions, Store } from 'express-session';

const isProduction = process.env.NODE_ENV === 'production';
const SESSION_SECRET = process.env.SESSION_SECRET;
const SESSION_COOKIE_NAME = process.env.SESSION_COOKIE_NAME || 'fabricflow.sid';
const SESSION_MAX_AGE_MS = Number(process.env.SESSION_MAX_AGE_MS || 1000 * 60 * 60 * 24 * 7);

const buildSessionOptions = (store?: Store): SessionOptions => {
  if (!SESSION_SECRET) {
    throw new Error('SESSION_SECRET environment variable is required for session management');
  }
  if (isProduction && !store) {
    console.warn('⚠️ Production environment should provide a session store (Redis, etc.)');
  }

  return {
    name: SESSION_COOKIE_NAME,
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store,
    rolling: true,
    cookie: {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'strict' : 'lax',
      maxAge: SESSION_MAX_AGE_MS,
    },
  };
};

export const createSessionMiddleware = (store?: Store) => {
  // To switch to Redis later, pass a Redis-backed store here.
  return session(buildSessionOptions(store));
};
