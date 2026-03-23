export { errorHandler, notFoundHandler } from './error-handler';
export { requirePermission } from './require-permission';
export { createSessionMiddleware } from './session';

import { Application } from 'express';
import { applyHelmet } from './helmet';
import { applyCors } from './cors';
import { applyRateLimiter } from './rate-limiter';

/**
 * Aggregator to apply security middleware (helmet, cors, rate limiting)
 */
export default function security(app: Application, env: string) {
	if (env !== 'test') {
		app.use(applyHelmet());
		app.use(applyCors());
		app.use(applyRateLimiter());
	}
}