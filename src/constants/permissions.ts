/**
 * Permissions are mostly route focused, but can also be less granular (e.g. category:read_any for all types of category reads)
 * Sometime permissions can be controller focused where single routes have different permissions (e.g. partial read vs full read of a category)
 */
export const PERMISSIONS = {
  // Category permissions
  CATEGORY_CREATE: 'category:create',
  CATEGORY_READ_ANY: 'category:read_any',
  CATEGORY_UPDATE: 'category:update',
  CATEGORY_DELETE: 'category:delete',

  // Product permissions
  PRODUCT_CREATE: 'product:create',
  PRODUCT_READ_ALL: 'product:read_all',
  PRODUCT_READ: 'product:read',
  PRODUCT_UPDATE: 'product:update',
  PRODUCT_DELETE: 'product:delete',

  // Brand permissions
  BRAND_CREATE: 'brand:create',
  BRAND_READ_ALL: 'brand:read_all',
  BRAND_READ: 'brand:read',
  BRAND_UPDATE: 'brand:update',
  BRAND_DELETE: 'brand:delete',

  // Variant permissions
  VARIANT_CREATE: 'variant:create',
  VARIANT_READ_ALL: 'variant:read_all',
  VARIANT_READ: 'variant:read',
  VARIANT_UPDATE: 'variant:update',
  VARIANT_DELETE: 'variant:delete',

  // Inventory Movement permissions
  INVENTORY_MOVEMENT_CREATE: 'inventory_movement:create',
  INVENTORY_MOVEMENT_CREATE_BULK: 'inventory_movement:create_bulk',
  INVENTORY_MOVEMENT_READ_ALL: 'inventory_movement:read_all',
  INVENTORY_MOVEMENT_READ: 'inventory_movement:read',
  INVENTORY_MOVEMENT_DELETE: 'inventory_movement:delete',

  // User permissions (for future use)
  USER_READ: 'user:read',
  USER_UPDATE: 'user:update',
  USER_DELETE: 'user:delete',
  USER_CREATE: 'user:create',

  // Company/Concept permissions (for future use)

  // Subscription/pricing permissions (for future use)
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];