
/**
 * Convert page and pageSize to limit and offset
 */
export function convertToLimitAndOffset(
  page?: number,
  pageSize?: number,
  defaultLimit = 20,
  maxLimit = 100
): { limit: number; offset: number } {
  let limit = defaultLimit;
  let offset = 0;

  if (pageSize !== undefined) {
    limit = Math.min(pageSize, maxLimit);
  }

  if (page !== undefined && page > 0) {
    offset = (page - 1) * limit;
  }
  return { limit, offset };
}

// Check if updated input has at least one field to update
export function hasUpdateFields<T>(input: Partial<T>): boolean {
  return Object.keys(input).length > 0;
}