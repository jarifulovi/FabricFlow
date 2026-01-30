/**
 * Database-level validators for PostgreSQL data integrity.
 * These validators ensure data meets basic PostgreSQL constraints.
 * Does NOT include business logic validation.
 */

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const dbValidator = {
  /**
   * Validates a UUID string format
   * @param optional - If true, allows null/undefined values
   */
  isValidUUID(value: unknown, optional: boolean = false): boolean {
    if (optional && (value === null || value === undefined)) return true;
    return typeof value === 'string' && UUID_REGEX.test(value);
  },



  /**
   * Validates required field is not null/undefined
   */
  isRequired(value: unknown): boolean {
    return value !== null && value !== undefined;
  },

  /**
   * Validates string is not empty and doesn't exceed max length
   * @param optional - If true, allows null/undefined values
   */
  isValidString(value: unknown, maxLength: number = 500, optional: boolean = false): boolean {
    if (optional && (value === null || value === undefined)) return true;
    if (typeof value !== 'string') return false;
    const trimmed = value.trim();
    return trimmed.length > 0 && trimmed.length <= maxLength;
  },



  /**
   * Validates a number is within precision and scale constraints
   * e.g., NUMERIC(12,2) means max 12 digits total, 2 after decimal
   * @param optional - If true, allows null/undefined values
   */
  isValidNumeric(value: unknown, precision: number, scale: number = 0, optional: boolean = false): boolean {
    if (optional && (value === null || value === undefined)) return true;
    if (typeof value !== 'number' || isNaN(value) || !isFinite(value)) return false;
    
    const strValue = value.toFixed(scale);
    const [intPart, decPart = ''] = strValue.split('.');
    const totalDigits = intPart.replace('-', '').length + decPart.length;
    
    return totalDigits <= precision && decPart.length <= scale;
  },

  /**
   * Validates positive number (for quantities, prices, etc.)
   * @param optional - If true, allows null/undefined values
   */
  isPositiveNumber(value: unknown, optional: boolean = false): boolean {
    if (optional && (value === null || value === undefined)) return true;
    return typeof value === 'number' && value > 0 && isFinite(value);
  },

  /**
   * Validates non-negative number (can be zero)
   * @param optional - If true, allows null/undefined values
   */
  isNonNegativeNumber(value: unknown, optional: boolean = false): boolean {
    if (optional && (value === null || value === undefined)) return true;
    return typeof value === 'number' && value >= 0 && isFinite(value);
  },

  /**
   * Validates boolean value
   * @param optional - If true, allows null/undefined values
   */
  isBoolean(value: unknown, optional: boolean = false): boolean {
    if (optional && (value === null || value === undefined)) return true;
    return typeof value === 'boolean';
  },

  /**
   * Validates value is one of the allowed enum values
   * @param optional - If true, allows null/undefined values
   */
  isValidEnum<T extends string>(value: unknown, allowedValues: readonly T[], optional: boolean = false): value is T {
    if (optional && (value === null || value === undefined)) return true;
    return typeof value === 'string' && (allowedValues as readonly string[]).includes(value);
  },

  /**
   * Validates array of strings (for TEXT[] columns)
   * @param optional - If true, allows null/undefined values
   */
  isValidStringArray(value: unknown, maxLength: number = 500, optional: boolean = false): boolean {
    if (optional && (value === null || value === undefined)) return true;
    if (!Array.isArray(value)) return false;
    return value.every(item => this.isValidString(item, maxLength));
  },

  /**
   * Validates ISO 8601 date string or Date object
   * PostgreSQL returns timestamps as ISO strings in pg driver
   * @param optional - If true, allows null/undefined values
   */
  isValidDate(value: unknown, optional: boolean = false): boolean {
    if (optional && (value === null || value === undefined)) return true;
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
   * @param optional - If true, allows null/undefined values
   */
  isValidEmail(value: unknown, optional: boolean = false): boolean {
    if (optional && (value === null || value === undefined)) return true;
    if (typeof value !== 'string') return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value) && value.length <= 255;
  },
};
