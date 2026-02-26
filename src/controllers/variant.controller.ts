import { Request, Response } from 'express';
import { variantServicePublic, variantServicePrivate } from '../services';
import { asyncHandler } from '../utils/async-handler';
import { createProductVariantSchema, updateProductVariantSchema } from '../database/types/variant';
import { variantParamsSchema, variantSkuParamsSchema, variantApiQuerySchema } from '../types/variant.types';

export const variantController = {
  // GET /variants
  findAll: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const filters = variantApiQuerySchema.parse(req.query);
    const variants = await variantServicePublic.findAll(filters);
    res.status(200).json({
      success: true,
      data: variants,
      pagination: {
        ...(filters.page && filters.pageSize && {
          currentPage: filters.page,
          pageSize: filters.pageSize
        })
      }
    });
  }),

  // GET /variants/default
  findAllDefault: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const filters = variantApiQuerySchema.pick({ page: true, pageSize: true }).parse(req.query);
    const variants = await variantServicePublic.findAllDefault(filters);
    res.status(200).json({
      success: true,
      data: variants,
      pagination: {
        ...(filters.page && filters.pageSize && {
          currentPage: filters.page,
          pageSize: filters.pageSize
        })
      }
    });
  }),

  // GET /variants/:id
  findById: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = variantParamsSchema.parse(req.params);
    const variant = await variantServicePublic.findById(id);
    res.status(200).json({
      success: true,
      data: variant
    });
  }),

  // GET /variants/sku/:sku
  findBySku: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { sku } = variantSkuParamsSchema.parse(req.params);
    const variant = await variantServicePublic.findBySku(sku);
    res.status(200).json({
      success: true,
      data: variant
    });
  }),

  // POST /variants
  create: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const variantData = createProductVariantSchema.parse(req.body);
    const newVariant = await variantServicePublic.create(variantData);
    res.status(201).json({
      success: true,
      data: newVariant,
      message: 'Variant created successfully'
    });
  }),

  // PATCH /variants/:id
  update: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = variantParamsSchema.parse(req.params);
    const updateData = updateProductVariantSchema.parse(req.body);
    const updatedVariant = await variantServicePublic.update(id, updateData);
    res.status(200).json({
      success: true,
      data: updatedVariant,
      message: 'Variant updated successfully'
    });
  }),

  // DELETE /variants/:id - Soft delete variant
  softDelete: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = variantParamsSchema.parse(req.params);
    const deletedVariant = await variantServicePublic.softDelete(id);
    res.status(200).json({
      success: true,
      data: deletedVariant,
      message: 'Variant deleted successfully'
    });
  }),

  // DELETE /variants/:id/hard - Hard delete variant (only for testing and clean-up)
  hardDelete: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = variantParamsSchema.parse(req.params);
    const deletedVariant = await variantServicePrivate.hardDelete(id);
    res.status(200).json({
      success: true,
      data: deletedVariant,
      message: 'Variant permanently deleted successfully'
    });
  })
};
