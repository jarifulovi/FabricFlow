import { Request, Response } from 'express';
import { warehouseServicePublic } from '../services';
import { asyncHandler } from '../utils/async-handler';
import { createWarehouseSchema, updateWarehouseSchema } from '../database/types/warehouse';
import { warehouseParamsSchema, warehouseApiQuerySchema } from '../types/warehouse.types';

export const warehouseController = {
  // GET /warehouses
  getWarehouses: asyncHandler(async (req: Request, res: Response) => {
    const filters = warehouseApiQuerySchema.parse(req.query);
    const warehouses = await warehouseServicePublic.findAll(filters);
    res.json({
      success: true,
      data: warehouses,
      pagination: {
        ...(filters.page && filters.pageSize && {
          currentPage: filters.page,
          pageSize: filters.pageSize
        })
      }
    });
  }),

  // GET /warehouses/default
  getWarehousesDefault: asyncHandler(async (req: Request, res: Response) => {
    const warehouses = await warehouseServicePublic.findAllDefault();
    res.json({
      success: true,
      data: warehouses
    });
  }),

  // GET /warehouses/:id
  getWarehouseById: asyncHandler(async (req: Request, res: Response) => {
    const { id } = warehouseParamsSchema.parse(req.params);
    const warehouse = await warehouseServicePublic.findById(id);
    
    res.json({
      success: true,
      data: warehouse
    });
  }),

  // POST /warehouses
  createWarehouse: asyncHandler(async (req: Request, res: Response) => {
    const warehouseData = createWarehouseSchema.parse(req.body);
    const newWarehouse = await warehouseServicePublic.create(warehouseData);
    res.status(201).json({
      success: true,
      data: newWarehouse,
      message: 'Warehouse created successfully'
    });
  }),

  // PATCH /warehouses/:id
  updateWarehouse: asyncHandler(async (req: Request, res: Response) => {
    const { id } = warehouseParamsSchema.parse(req.params);
    const updateData = updateWarehouseSchema.parse(req.body);
    const updatedWarehouse = await warehouseServicePublic.update(id, updateData);
    res.json({
      success: true,
      data: updatedWarehouse,
      message: 'Warehouse updated successfully'
    });
  }),

  // DELETE /warehouses/:id
  deleteWarehouse: asyncHandler(async (req: Request, res: Response) => {
    const { id } = warehouseParamsSchema.parse(req.params);
    // const deletedWarehouse = await warehouseServicePublic.softDelete(id);
    
    res.json({
      success: true,
      data: {},
      message: 'Warehouse deletion is not implemented yet'
    });
  })
};
