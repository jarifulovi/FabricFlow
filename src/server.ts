import express from 'express';
import { categoryRoutes, productRoutes } from './routes';
import { errorHandler, notFoundHandler } from './middlewares';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// API Routes
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);

// 404 handler for unmatched routes (must be after all routes)
app.use(notFoundHandler);

// Error handler (must be last middleware)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
