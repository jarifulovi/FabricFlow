import { Router } from 'express';
import { brandController } from '../controllers';

const router = Router();

// GET routes
router.get('/:id', brandController.findById);
router.get('/', brandController.findAll);

// POST routes
router.post('/', brandController.create);

// PATCH routes
router.patch('/:id', brandController.update);

// DELETE routes
router.delete('/:id', brandController.delete);

export const brandRoutes = router;
