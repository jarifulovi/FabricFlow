import pool from '../connection.js';

/**
 * Clear all seeded data from the database
 * WARNING: This will delete all data from the tables in the correct order
 */
async function clearAllData() {
  console.log('🗑️  Clearing all seeded data...\n');
  
  try {
    // Delete in reverse order of dependencies to avoid FK constraint violations
    console.log('Deleting variants...');
    await pool.query('DELETE FROM product_variants');
    console.log('✅ Variants cleared');

    console.log('Deleting products...');
    await pool.query('DELETE FROM products');
    console.log('✅ Products cleared');

    console.log('Deleting categories...');
    await pool.query('DELETE FROM categories');
    console.log('✅ Categories cleared');

    console.log('Deleting warehouses...');
    await pool.query('DELETE FROM warehouses');
    console.log('✅ Warehouses cleared');

    console.log('\n✅ All data cleared successfully!');
    
  } catch (error) {
    console.error('\n❌ Failed to clear data:', error);
    throw error;
  } finally {
    await pool.end();
    console.log('✅ Database connection closed');
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  clearAllData()
    .then(() => {
      console.log('\n✅ Data clearing completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Data clearing failed:', error);
      process.exit(1);
    });
}

export { clearAllData };
