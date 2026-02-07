import { Request, Response } from 'express';
import { inventoryMovementServicePublic } from '../services';
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

  // POST /inventory-movements
  createInventoryMovement: asyncHandler(async (req: Request, res: Response) => {
    const movementData = createInventoryMovementSchema.parse(req.body);
    // const newMovement = await inventoryMovementServicePublic.create(movementData);
    res.status(201).json({
      success: true,
      data: {},
      message: 'Inventory movement creation is internal only for testing purposes'
    });
  })
};
