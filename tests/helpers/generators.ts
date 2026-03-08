/**
 * Test data generators with unique defaults and per-field overrides.
 *
 * Usage:
 *   makeCategory()                         // all defaults
 *   makeCategory({ name: 'Custom Name' })  // override any field
 *   makeProduct(categoryId, { sku: 'MY-SKU' })
 */

import type { CreateCategoryInput } from '../../src/database/types/category';
import type { CreateWarehouseInput } from '../../src/database/types/warehouse';
import type { CreateProductInput } from '../../src/database/types/product';
import type { CreateProductVariantInput } from '../../src/database/types/variant';
import type { CreateReceivingSlipInput, SlipType } from '../../src/database/types/receiving-slip';

let seq = 0;
const next = () => `${Date.now()}-${++seq}`;

// ─────────────────────────────────────────────────────────────────────────────
// Category
// ─────────────────────────────────────────────────────────────────────────────

export const makeCategory = (overrides: Partial<CreateCategoryInput> = {}): CreateCategoryInput => ({
  type: 'product',
  name: `Test Category ${next()}`,
  ...overrides,
});

// ─────────────────────────────────────────────────────────────────────────────
// Warehouse
// ─────────────────────────────────────────────────────────────────────────────

export const makeWarehouse = (overrides: Partial<CreateWarehouseInput> = {}): CreateWarehouseInput => ({
  name: `Test Warehouse ${next()}`,
  ...overrides,
});

// ─────────────────────────────────────────────────────────────────────────────
// Product
// ─────────────────────────────────────────────────────────────────────────────

export const makeProduct = (
  categoryId: string,
  overrides: Partial<CreateProductInput> = {}
): CreateProductInput => ({
  sku: `SKU-${next()}`,
  name: `Test Product ${next()}`,
  categoryId,
  status: 'active',
  unit: 'piece',
  ...overrides,
});

// ─────────────────────────────────────────────────────────────────────────────
// Variant
// ─────────────────────────────────────────────────────────────────────────────

export const makeVariant = (
  productId: string,
  overrides: Partial<CreateProductVariantInput> = {}
): CreateProductVariantInput => ({
  productId,
  sku: `VAR-SKU-${next()}`,
  price: 0,
  ...overrides,
});

export const makeFullVariant = (
  productId: string, 
  overrides: Partial<CreateProductVariantInput> = {}
): CreateProductVariantInput => ({
  productId,
  sku: `VAR-SKU-${next()}`,
  price: 19.99,
  vendorSku: `VENDOR-SKU-${next()}`,
  barcode: `BARCODE-${next()}`,
  color: 'Red',
  size: 'M',
  gender: 'unisex',
  season: 'Summer',
  fit: 'Regular',
  reorderLevel: 10,
  attributes: { material: 'cotton', pattern: 'striped' },
  imageUrls: [`https://example.com/image-${next()}.jpg`],
  ...overrides,
});

// ─────────────────────────────────────────────────────────────────────────────
// Receiving Slip
// date is z.date() in CreateReceivingSlipInput, but the API accepts ISO strings
// ─────────────────────────────────────────────────────────────────────────────

export type ReceivingSlipPayload = Omit<CreateReceivingSlipInput, 'date'> & { date: string };

export const makeReceivingSlip = (
  warehouseId: string,
  overrides: Partial<ReceivingSlipPayload> = {}
): ReceivingSlipPayload => ({
  slipNumber: `SLIP-${next()}`,
  type: 'purchase' as SlipType,
  date: new Date().toISOString().split('T')[0],
  warehouseId,
  ...overrides,
});
