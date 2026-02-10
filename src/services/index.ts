import { categoryService } from './category.service';
import { productService } from './product.service';
import { variantService } from './variant.service';
import { warehouseService } from './warehouse.service';
import { receivingSlipService } from './receiving-slip.service';
import { inventoryMovementService } from './inventory-movement.service';

export const categoryServicePublic = {
  findAll: categoryService.findAll,
  findAllDefault: categoryService.findAllDefault,
  findById: categoryService.findById,
  create: categoryService.create,
  update: categoryService.update,
  softDelete: categoryService.softDelete,
};

export const categoryServicePrivate = {
  hardDelete: categoryService.hardDelete,
};

export const productServicePublic = {
  findAll: productService.findAll,
  findAllDefault: productService.findAllDefault,
  findById: productService.findById,
  findBySku: productService.findBySku,
  create: productService.create,
  update: productService.update,
  softDelete: productService.softDelete,
};

export const variantServicePublic = {
  findAll: variantService.findAll,
  findAllDefault: variantService.findAllDefault,
  findById: variantService.findById,
  findBySku: variantService.findBySku,
  create: variantService.create,
  update: variantService.update,
  softDelete: variantService.softDelete,
};

export const warehouseServicePublic = {
  findAll: warehouseService.findAll,
  findAllDefault: warehouseService.findAllDefault,
  findById: warehouseService.findById,
  create: warehouseService.create,
  update: warehouseService.update,
};

export const receivingSlipServicePublic = {
  findAll: receivingSlipService.findAll,
  findAllDefault: receivingSlipService.findAllDefault,
  findById: receivingSlipService.findById,
  findBySlipNumber: receivingSlipService.findBySlipNumber,
  create: receivingSlipService.create,
  update: receivingSlipService.update,
  confirm: receivingSlipService.confirm,
};

export const inventoryMovementServicePublic = {
  findAll: inventoryMovementService.findAll,
  findAllDefault: inventoryMovementService.findAllDefault,
  findById: inventoryMovementService.findById,
  findBySource: inventoryMovementService.findBySource,
};