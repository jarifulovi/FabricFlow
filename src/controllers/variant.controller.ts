import { Request, Response } from 'express';
import { variantServicePublic } from '../services';
import { asyncHandler } from '../utils/async-handler';
import { createProductVariantSchema, updateProductVariantSchema } from '../database/types/variant';
import { variantParamsSchema, variantSkuParamsSchema, variantApiQuerySchema } from '../types/variant.types';

export const variantController = {
  // GET /variants
  getVariants: asyncHandler(async (req: Request, res: Response) => {
    const filters = variantApiQuerySchema.parse(req.query);

    const variants = await variantServicePublic.findAll(filters);
    res.json({
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
  getVariantsDefault: asyncHandler(async (req: Request, res: Response) => {
    const variants = await variantServicePublic.findAllDefault();
    res.json({
      success: true,
      data: variants
    });
  }),

  // GET /variants/:id
  getVariantById: asyncHandler(async (req: Request, res: Response) => {
    const { id } = variantParamsSchema.parse(req.params);
    const variant = await variantServicePublic.findById(id);
    
    res.json({
      success: true,
      data: variant
    });
  }),

  // GET /variants/sku/:sku
  getVariantBySku: asyncHandler(async (req: Request, res: Response) => {
    const { sku } = variantSkuParamsSchema.parse(req.params);
    const variant = await variantServicePublic.findBySku(sku);
    
    res.json({
      success: true,
      data: variant
    });
  }),

  // POST /variants
  createVariant: asyncHandler(async (req: Request, res: Response) => {
    const variantData = createProductVariantSchema.parse(req.body);
    const newVariant = await variantServicePublic.create(variantData);
    res.status(201).json({
      success: true,
      data: newVariant,
      message: 'Variant created successfully'
    });
  }),

  // PATCH /variants/:id
  updateVariant: asyncHandler(async (req: Request, res: Response) => {
    const { id } = variantParamsSchema.parse(req.params);
    const updateData = updateProductVariantSchema.parse(req.body);
    const updatedVariant = await variantServicePublic.update(id, updateData);
    res.json({
      success: true,
      data: updatedVariant,
      message: 'Variant updated successfully'
    });
  }),

  // DELETE /variants/:id
  deleteVariant: asyncHandler(async (req: Request, res: Response) => {
    const { id } = variantParamsSchema.parse(req.params);
    const deletedVariant = await variantServicePublic.softDelete(id);
    
    res.json({
      success: true,
      data: deletedVariant,
      message: 'Variant deleted successfully'
    });
  })
};
