import { Router } from 'express';
import { inventoryMovementController } from '../controllers';

const router = Router();

// GET routes (most specific first)
router.get('/default', inventoryMovementController.getInventoryMovementsDefault);
router.get('/source/:sourceType/:sourceId', inventoryMovementController.getInventoryMovementsBySource);
router.get('/:id', inventoryMovementController.getInventoryMovementById);
router.get('/', inventoryMovementController.getInventoryMovements);

// DELETE /inventory-movements/:id/hard - Hard delete (only for testing)
if (process.env.NODE_ENV === 'test') {
  router.post('/', inventoryMovementController.createInventoryMovement);
  router.post('/bulk', inventoryMovementController.createInventoryMovementBulk);
  router.delete('/:id/hard', inventoryMovementController.deleteInventoryMovement);
}

export const inventoryMovementRoutes = router;
