/**
 * Controller utility functions for parsing and validating request inputs
 */

/**
 * Extract string value from request param that can be string or string[]
 */
export function extractParamString(param: string | string[]): string {
  return Array.isArray(param) ? param[0] : param;
}

/**
 * Parse query string to number with validation
 */
export function parseQueryNumber(value: unknown, defaultValue?: number): number | undefined {
  if (value === undefined || value === null) return defaultValue;
  if (typeof value === 'string') {
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? defaultValue : parsed;
  }
  return defaultValue;
}

/**
 * Parse query string to positive number (for pagination, limits, etc.)
 */
export function parseQueryPositiveNumber(value: unknown, defaultValue?: number): number | undefined {
  const parsed = parseQueryNumber(value, defaultValue);
  return parsed !== undefined && parsed > 0 ? parsed : defaultValue;
}

/**
 * Parse query string to non-negative number (for offsets, etc.)
 */
export function parseQueryNonNegativeNumber(value: unknown, defaultValue?: number): number | undefined {
  const parsed = parseQueryNumber(value, defaultValue);
  return parsed !== undefined && parsed >= 0 ? parsed : defaultValue;
}

/**
 * Extract and validate pagination parameters from query
 */
export function parsePaginationParams(query: { page?: unknown; pageSize?: unknown }) {
  const page = parseQueryPositiveNumber(query.page);
  const pageSize = parseQueryPositiveNumber(query.pageSize);
  
  // If either page or pageSize is provided, both must be valid
  // Issue: place it to controller validator when implemented
  if ((query.page !== undefined || query.pageSize !== undefined) && 
      (page === undefined || pageSize === undefined)) {
    throw new Error('Both page and pageSize must be valid positive numbers when pagination is used');
  }
  
  // Use defaults if nothing is provided
  const finalPage = page ?? 1;
  const finalPageSize = pageSize ?? 10;
  
  return {
    page: finalPage,
    pageSize: finalPageSize,
    limit: finalPageSize,
    offset: (finalPage - 1) * finalPageSize
  };
}

/**
 * Extract string from query param, handling arrays
 */
export function extractQueryString(param: unknown): string | undefined {
  if (typeof param === 'string') return param;
  if (Array.isArray(param) && param.length > 0 && typeof param[0] === 'string') {
    return param[0];
  }
  return undefined;
}

/**
 * Parse query param to boolean
 */
export function parseQueryBoolean(value: unknown): boolean | undefined {
  if (value === undefined || value === null) return undefined;
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const lower = value.toLowerCase();
    if (lower === 'true' || lower === '1') return true;
    if (lower === 'false' || lower === '0') return false;
  }
  return undefined;
}

/**
 * Parse comma-separated string to array of strings
 */
export function parseQueryStringArray(param: unknown): string[] | undefined {
  if (!param) return undefined;
  if (typeof param === 'string') {
    return param.split(',').map(s => s.trim()).filter(s => s.length > 0);
  }
  if (Array.isArray(param)) {
    return param.filter(item => typeof item === 'string').map(s => s.trim());
  }
  return undefined;
}

/**
 * Parse comma-separated string to array of numbers
 */
export function parseQueryNumberArray(param: unknown): number[] | undefined {
  const stringArray = parseQueryStringArray(param);
  if (!stringArray) return undefined;
  
  const numbers = stringArray.map(s => parseInt(s, 10)).filter(n => !isNaN(n));
  return numbers.length > 0 ? numbers : undefined;
}

/**
 * Parse and validate enum value from query
 */
export function parseQueryEnum<T extends string>(
  param: unknown, 
  allowedValues: readonly T[]
): T | undefined {
  const value = extractQueryString(param);
  if (value && (allowedValues as readonly string[]).includes(value)) {
    return value as T;
  }
  return undefined;
}