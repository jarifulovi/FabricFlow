/**
 * Database-level validators for PostgreSQL data integrity.
 * These validators ensure data meets basic PostgreSQL constraints.
 * Does NOT include business logic validation.
 */

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const dbValidator = {
  /**
   * Validates a UUID string format
   */
  isValidUUID(value: unknown): boolean {
    return typeof value === 'string' && UUID_REGEX.test(value);
  },

  /**
   * Validates optional UUID (can be null/undefined, but if present must be valid)
   */
  isValidOptionalUUID(value: unknown): boolean {
    if (value === null || value === undefined) return true;
    return this.isValidUUID(value);
  },

  /**
   * Validates required field is not null/undefined
   */
  isRequired(value: unknown): boolean {
    return value !== null && value !== undefined;
  },

  /**
   * Validates string is not empty and doesn't exceed max length
   */
  isValidString(value: unknown, maxLength: number = 500): boolean {
    if (typeof value !== 'string') return false;
    const trimmed = value.trim();
    return trimmed.length > 0 && trimmed.length <= maxLength;
  },

  /**
   * Validates optional string (can be null/undefined, but if present must be valid)
   */
  isValidOptionalString(value: unknown, maxLength: number = 500): boolean {
    if (value === null || value === undefined) return true;
    return this.isValidString(value, maxLength);
  },

  /**
   * Validates a number is within precision and scale constraints
   * e.g., NUMERIC(12,2) means max 12 digits total, 2 after decimal
   */
  isValidNumeric(value: unknown, precision: number, scale: number = 0): boolean {
    if (typeof value !== 'number' || isNaN(value) || !isFinite(value)) return false;
    
    const strValue = value.toFixed(scale);
    const [intPart, decPart = ''] = strValue.split('.');
    const totalDigits = intPart.replace('-', '').length + decPart.length;
    
    return totalDigits <= precision && decPart.length <= scale;
  },

  /**
   * Validates positive number (for quantities, prices, etc.)
   */
  isPositiveNumber(value: unknown): boolean {
    return typeof value === 'number' && value > 0 && isFinite(value);
  },

  /**
   * Validates non-negative number (can be zero)
   */
  isNonNegativeNumber(value: unknown): boolean {
    return typeof value === 'number' && value >= 0 && isFinite(value);
  },

  /**
   * Validates boolean value
   */
  isBoolean(value: unknown): boolean {
    return typeof value === 'boolean';
  },

  /**
   * Validates value is one of the allowed enum values
   */
  isValidEnum<T extends string>(value: unknown, allowedValues: readonly T[]): value is T {
    return typeof value === 'string' && (allowedValues as readonly string[]).includes(value);
  },

  /**
   * Validates array of strings (for TEXT[] columns)
   */
  isValidStringArray(value: unknown, maxLength: number = 500): boolean {
    if (!Array.isArray(value)) return false;
    return value.every(item => this.isValidString(item, maxLength));
  },

  /**
   * Validates ISO 8601 date string or Date object
   * PostgreSQL returns timestamps as ISO strings in pg driver
   */
  isValidDate(value: unknown): boolean {
    if (value instanceof Date) {
      return !isNaN(value.getTime());
    }
    if (typeof value === 'string') {
      const date = new Date(value);
      return !isNaN(date.getTime());
    }
    return false;
  },

  /**
   * Validates email format (basic check for VARCHAR fields storing emails)
   */
  isValidEmail(value: unknown): boolean {
    if (typeof value !== 'string') return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value) && value.length <= 255;
  },
};
