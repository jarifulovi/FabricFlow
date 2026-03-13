import express from 'express';
import { categoryRoutes, brandRoutes, productRoutes, variantRoutes, inventoryMovementRoutes } from './routes/index.js';
import { errorHandler, notFoundHandler } from './middlewares/index.js';

const app = express();

app.use(express.json());

// API Routes
app.use('/api/categories', categoryRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/products', productRoutes);
app.use('/api/variants', variantRoutes);
app.use('/api/inventory-movements', inventoryMovementRoutes);

// 404 handler for unmatched routes (must be after all routes)
app.use(notFoundHandler);

// Error handler (must be last middleware)
app.use(errorHandler);

export default app;
