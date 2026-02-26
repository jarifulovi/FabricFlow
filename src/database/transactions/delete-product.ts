import pool from './../connection';
import { productRepo } from './../repositories/product.repo';
import { variantRepo } from './../repositories/variant.repo';
import { ProductRow } from './../types/product';


export const deleteProductTransaction = async (
  productId: string,
  hardDelete: boolean = false,
): Promise<ProductRow> => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 1️⃣ Check if product has active variants
    const variantCount = await variantRepo.count(
      { productId, includeDeleted: false },
      client
    );

    if (variantCount > 0) {
      throw new Error(
        'Cannot delete product that has variants. Delete variants first.'
      );
    }

    // 2️⃣ Perform delete
    const deletedProduct = hardDelete
      ? await productRepo.hardDelete(productId, client)
      : await productRepo.softDelete(productId, client);

    await client.query('COMMIT');
    return deletedProduct;

  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};