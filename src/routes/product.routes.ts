import { Router } from 'express';
import { productController } from '../controllers';

const router = Router();

// GET routes (most specific first)
router.get('/default', productController.getProductsDefault);
router.get('/sku/:sku', productController.getProductBySku);
router.get('/:id', productController.getProductById);
router.get('/', productController.getProducts);

// POST routes
router.post('/', productController.createProduct);

// PUT routes
router.patch('/:id', productController.updateProduct);

// DELETE routes
router.delete('/:id', productController.deleteProduct);

export const productRoutes = router;