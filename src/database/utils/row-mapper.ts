/**
 * Row Mapper Utilities
 *
 * Converts snake_case DB result rows to camelCase to match TypeScript type definitions.
 * Used at the repo layer so that services and controllers always receive camelCase fields.
 */

/**
 * Converts a single snake_case column name to camelCase.
 * Example: "product_id" → "productId", "is_deleted" → "isDeleted"
 */
export function snakeToCamel(col: string): string {
  return col.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Converts all keys of a flat DB result row from snake_case to camelCase.
 * Keys that are already camelCase (no underscores) are passed through unchanged.
 */
export function mapRowToCamel<T>(row: Record<string, any>): T {
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(row)) {
    result[snakeToCamel(key)] = value;
  }
  return result as T;
}

/**
 * Applies mapRowToCamel to every row in an array.
 */
export function mapRowsToCamel<T>(rows: Record<string, any>[]): T[] {
  return rows.map(row => mapRowToCamel<T>(row));
}
