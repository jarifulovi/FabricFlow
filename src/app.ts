import express from 'express';
import compression from 'compression';
import type { Store } from 'express-session';
import {
	categoryRoutes,
	brandRoutes,
	productRoutes,
	variantRoutes,
	inventoryMovementRoutes,
	authRoutes,
	invitationRoutes,
} from './routes';
import { createSessionMiddleware, errorHandler, notFoundHandler } from './middlewares';
import security from './middlewares';

export const createApp = (sessionStore?: Store) => {
	const app = express();

	app.set('trust proxy', 1); // Trust first proxy (if behind a reverse proxy)
	app.use(express.json({ limit: '10mb' })); // Set JSON body size limit
	app.use(compression()); // Enable gzip compression for responses
	app.use(createSessionMiddleware(sessionStore));

	// Apply security middleware (helmet, cors, rate limiting) conditionally based on environment
	security(app, process.env.NODE_ENV || 'development');

	// API Routes
	app.use('/api/categories', categoryRoutes);
	app.use('/api/brands', brandRoutes);
	app.use('/api/products', productRoutes);
	app.use('/api/variants', variantRoutes);
	app.use('/api/inventory-movements', inventoryMovementRoutes);
	app.use('/api/auth', authRoutes);
	app.use('/api/invitations', invitationRoutes);

	// 404 handler for unmatched routes (must be after all routes)
	app.use(notFoundHandler);

	// Error handler (must be last middleware)
	app.use(errorHandler);

	return app;
};

const app = createApp();

export default app;
