import { Request, Response } from 'express';
import { receivingSlipServicePublic } from '../services';
import { asyncHandler } from '../utils/async-handler';
import { createReceivingSlipSchema, updateReceivingSlipSchema } from '../database/types/receiving-slip';
import { createReceivingSlipLineSchema } from '../database/types/receiving-slip-line';
import { receivingSlipParamsSchema, receivingSlipSlipNumberParamsSchema, receivingSlipApiQuerySchema } from '../types/receiving-slip.types';
import { z } from 'zod/v4';

// Schema for creating receiving slip with line items
const createReceivingSlipWithLinesSchema = z.object({
  slip: createReceivingSlipSchema,
  lineItems: z.array(createReceivingSlipLineSchema.omit({ slipId: true })).min(1, 'At least one line item is required')
});

export const receivingSlipController = {
  // GET /receiving-slips
  getReceivingSlips: asyncHandler(async (req: Request, res: Response) => {
    const filters = receivingSlipApiQuerySchema.parse(req.query);
    const slips = await receivingSlipServicePublic.findAll(filters);
    res.json({
      success: true,
      data: slips,
      pagination: {
        ...(filters.page && filters.pageSize && {
          currentPage: filters.page,
          pageSize: filters.pageSize
        })
      }
    });
  }),

  // GET /receiving-slips/default
  getReceivingSlipsDefault: asyncHandler(async (req: Request, res: Response) => {
    const slips = await receivingSlipServicePublic.findAllDefault();
    res.json({
      success: true,
      data: slips
    });
  }),

  // GET /receiving-slips/:id
  getReceivingSlipById: asyncHandler(async (req: Request, res: Response) => {
    const { id } = receivingSlipParamsSchema.parse(req.params);
    const slip = await receivingSlipServicePublic.findById(id);
    
    res.json({
      success: true,
      data: slip
    });
  }),

  // GET /receiving-slips/slip-number/:slipNumber
  getReceivingSlipByNumber: asyncHandler(async (req: Request, res: Response) => {
    const { slipNumber } = receivingSlipSlipNumberParamsSchema.parse(req.params);
    const slip = await receivingSlipServicePublic.findBySlipNumber(slipNumber);
    
    res.json({
      success: true,
      data: slip
    });
  }),

  // POST /receiving-slips
  createReceivingSlip: asyncHandler(async (req: Request, res: Response) => {
    const slipData = createReceivingSlipWithLinesSchema.parse(req.body);
    const newSlip = await receivingSlipServicePublic.create(slipData);
    res.status(201).json({
      success: true,
      data: newSlip,
      message: 'Receiving slip created successfully'
    });
  }),

  // PATCH /receiving-slips/:id
  updateReceivingSlip: asyncHandler(async (req: Request, res: Response) => {
    const { id } = receivingSlipParamsSchema.parse(req.params);
    const updateData = updateReceivingSlipSchema.parse(req.body);
    const updatedSlip = await receivingSlipServicePublic.update(id, updateData);
    res.json({
      success: true,
      data: updatedSlip,
      message: 'Receiving slip updated successfully'
    });
  }),

  // POST /receiving-slips/:id/confirm
  confirmReceivingSlip: asyncHandler(async (req: Request, res: Response) => {
    const { id } = receivingSlipParamsSchema.parse(req.params);
    await receivingSlipServicePublic.confirm(id);
    res.json({
      success: true,
      message: 'Receiving slip confirmed successfully'
    });
  })
};
