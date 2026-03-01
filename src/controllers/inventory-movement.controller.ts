import { Request, Response } from 'express';
import { inventoryMovementServicePrivate, inventoryMovementServicePublic } from '../services';
import { asyncHandler } from '../utils/async-handler';
import { createInventoryMovementSchema } from '../database/types/inventory-movement';
import { inventoryMovementParamsSchema, inventoryMovementSourceParamsSchema, inventoryMovementApiQuerySchema } from '../types/inventory-movement.types';

export const inventoryMovementController = {
  // GET /inventory-movements
  getInventoryMovements: asyncHandler(async (req: Request, res: Response) => {
    const filters = inventoryMovementApiQuerySchema.parse(req.query);
    const movements = await inventoryMovementServicePublic.findAll(filters);
    res.json({
      success: true,
      data: movements,
      pagination: {
        ...(filters.page && filters.pageSize && {
          currentPage: filters.page,
          pageSize: filters.pageSize
        })
      }
    });
  }),

  // GET /inventory-movements/default
  getInventoryMovementsDefault: asyncHandler(async (req: Request, res: Response) => {
    const movements = await inventoryMovementServicePublic.findAllDefault();
    res.json({
      success: true,
      data: movements
    });
  }),

  // GET /inventory-movements/:id
  getInventoryMovementById: asyncHandler(async (req: Request, res: Response) => {
    const { id } = inventoryMovementParamsSchema.parse(req.params);
    const movement = await inventoryMovementServicePublic.findById(id);
    
    res.json({
      success: true,
      data: movement
    });
  }),

  // GET /inventory-movements/source/:sourceType/:sourceId
  getInventoryMovementsBySource: asyncHandler(async (req: Request, res: Response) => {
    const { sourceType, sourceId } = inventoryMovementSourceParamsSchema.parse(req.params);
    const movements = await inventoryMovementServicePublic.findBySource(sourceType, sourceId);
    
    res.json({
      success: true,
      data: movements
    });
  }),

  // POST /inventory-movements (test env only)
  createInventoryMovement: asyncHandler(async (req: Request, res: Response) => {
    const movementData = createInventoryMovementSchema.parse(req.body);
    const newMovement = await inventoryMovementServicePrivate.create(movementData);
    res.status(201).json({
      success: true,
      data: newMovement,
      message: 'Inventory movement created successfully'
    });
  }),

  // POST /inventory-movements/bulk (test env only)
  createInventoryMovementBulk: asyncHandler(async (req: Request, res: Response) => {
    const movementsData = createInventoryMovementSchema.array().parse(req.body);
    const newMovements = await inventoryMovementServicePrivate.createBulk(movementsData);
    res.status(201).json({
      success: true,
      data: newMovements,
      message: 'Inventory movements created successfully'
    });
  }),

  // DELETE /inventory-movements/:id (test env only)
  deleteInventoryMovement: asyncHandler(async (req: Request, res: Response) => {
    const { id } = inventoryMovementParamsSchema.parse(req.params);
    await inventoryMovementServicePrivate.delete(id);
    res.json({
      success: true,
      message: 'Inventory movement deleted successfully'
    });
  })
};
