import cors from 'cors';

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const allowedOrigins = [FRONTEND_URL];

export function applyCors() {
  const env = process.env.NODE_ENV;
  if (env === 'production' || env === 'staging') {
    return cors({ 
      origin: allowedOrigins,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    });
  }
  // Allow all in development and test
  return cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD', 'CONNECT', 'TRACE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });
}
