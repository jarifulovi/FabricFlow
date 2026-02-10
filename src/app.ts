import express from 'express';
import { categoryRoutes, productRoutes } from './routes/index.js';
import { errorHandler, notFoundHandler } from './middlewares/index.js';

const app = express();

app.use(express.json());

// API Routes
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);

// 404 handler for unmatched routes (must be after all routes)
app.use(notFoundHandler);

// Error handler (must be last middleware)
app.use(errorHandler);

export default app;
