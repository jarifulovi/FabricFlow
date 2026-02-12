import { Router } from 'express';
import { productController } from '../controllers';

const router = Router();

// GET routes (most specific first)
router.get('/default', productController.findAllDefault);
router.get('/sku/:sku', productController.findBySku);
router.get('/:id', productController.findById);
router.get('/', productController.findAll);

// POST routes
router.post('/', productController.create);

// PUT routes
router.patch('/:id', productController.update);

// DELETE /products/:id/hard - Hard delete product (only for testing and clean-up)
if (process.env.NODE_ENV === 'test') {
  router.delete('/:id/hard', productController.hardDelete);
}

// DELETE routes
router.delete('/:id', productController.softDelete);

export const productRoutes = router;