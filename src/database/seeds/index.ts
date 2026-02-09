import pool from '../connection.js';
import { seedCategories } from './categories.seed.js';
import { seedWarehouses } from './warehouses.seed.js';
import { seedProducts } from './products.seed.js';
import { seedVariants } from './variants.seed.js';

async function runAllSeeds() {
  console.log('🚀 Starting database seeding...\n');
  
  try {
    // Seed in order (respecting foreign key dependencies)
    const categories = await seedCategories();
    console.log('');
    
    const warehouses = await seedWarehouses();
    console.log('');
    
    const products = await seedProducts(categories);
    console.log('');
    
    const variants = await seedVariants(products);
    console.log('');

    console.log('✅ All seeds completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Categories: ${categories.length}`);
    console.log(`   - Warehouses: ${warehouses.length}`);
    console.log(`   - Products: ${products.length}`);
    console.log(`   - Variants: ${variants.length}`);
    
  } catch (error) {
    console.error('\n❌ Seeding failed:', error);
    throw error;
  } finally {
    // Close pool connection
    await pool.end();
    console.log('\n✅ Database connection closed');
  }
}

// Run all seeds
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllSeeds()
    .then(() => {
      console.log('\n✅ Seeding process completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Seeding process failed:', error);
      process.exit(1);
    });
}

export { runAllSeeds, seedCategories, seedWarehouses, seedProducts, seedVariants };
