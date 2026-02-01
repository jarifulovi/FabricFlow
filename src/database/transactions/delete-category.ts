// Delete category with validation for active products in a transaction
import pool from './../connection';
import { categoryRepo } from './../repositories/category.repo';
import { productRepo } from './../repositories/product.repo';
import { CategoryRow } from './../types/category';

export const deleteCategoryTransaction = async (
  categoryId: string,
  hardDelete: boolean = false,
): Promise<CategoryRow> => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Check if category has active products (this needs to be in transaction)
    const existingProductsCount = await productRepo.count(
      { categoryId, includeDeleted: false },
      client
    );
    if (existingProductsCount > 0) {
      throw new Error('Cannot delete category with active products');
    }

    // Perform the delete operation
    const deletedCategory = hardDelete
      ? await categoryRepo.hardDelete(categoryId, client)
      : await categoryRepo.softDelete(categoryId, client);

    await client.query('COMMIT');
    return deletedCategory;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};
