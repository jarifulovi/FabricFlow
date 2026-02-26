import { Router } from 'express';
import { variantController } from '../controllers';

const router = Router();

// GET /variants/default - must be before /:id to avoid route conflicts
router.get('/default', variantController.findAllDefault);

// GET /variants/sku/:sku
router.get('/sku/:sku', variantController.findBySku);

// GET /variants/:id
router.get('/:id', variantController.findById);

// GET /variants
router.get('/', variantController.findAll);

// POST /variants
router.post('/', variantController.create);

// PATCH /variants/:id
router.patch('/:id', variantController.update);

// DELETE /variants/:id/hard - Hard delete (only for testing and clean-up)
if (process.env.NODE_ENV === 'test') {
  router.delete('/:id/hard', variantController.hardDelete);
}

// DELETE /variants/:id - Soft delete
router.delete('/:id', variantController.softDelete);

export const variantRoutes = router;
