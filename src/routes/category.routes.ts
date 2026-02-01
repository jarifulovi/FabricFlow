import { Router } from 'express';
import { categoryController } from '../controllers';

const router = Router();

// POST /categories - Create new category
router.post('/', categoryController.create);

// PATCH /categories/:id - Update category
router.patch('/:id', categoryController.update);

// GET /categories/default - Get default categories view (must be before GET /categories/:id to avoid route conflicts)
router.get('/default', categoryController.findAllDefault);

// GET /categories/:id - Get category by ID
router.get('/:id', categoryController.findById);

// GET /categories - Get all categories with filters
router.get('/', categoryController.findAll);

// DELETE /categories/:id - Soft delete category
router.delete('/:id', categoryController.softDelete);

export { router as categoryRoutes };