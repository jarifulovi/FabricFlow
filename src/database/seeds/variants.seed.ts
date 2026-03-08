import pool from '../connection.js';
import { variantRepo } from '../repositories/variant.repo.js';
import { productRepo } from '../repositories/product.repo.js';
import type { CreateProductVariantInput } from '../types/variant.js';
import type { ProductRow } from '../types/product.js';

export async function seedVariants(products?: ProductRow[]) {
  console.log('🌱 Seeding variants...');
  
  try {
    // Fetch products if not provided
    let productsMap: Map<string, string>;
    
    if (products && products.length > 0) {
      productsMap = new Map(products.map((prod) => [prod.sku, prod.id]));
    } else {
      const fetchedProducts = await productRepo.findAll({}, pool);
      if (fetchedProducts.length === 0) {
        throw new Error('No products found. Please seed products first.');
      }
      productsMap = new Map(fetchedProducts.map((prod) => [prod.sku, prod.id]));
    }

    const variantsData: CreateProductVariantInput[] = [
      // Classic Cotton T-Shirt variants
      {
        productId: productsMap.get('MEN-TSH-001')!,
        sku: 'MEN-TSH-001-BLK-S',
        vendorSku: 'VEND-TSH-001-BLK-S',
        color: 'Black',
        size: 'S',
        gender: 'men',
        season: 'All Season',
        fit: 'Regular',
        price: 19.99,
        reorderLevel: 50,
      },
      {
        productId: productsMap.get('MEN-TSH-001')!,
        sku: 'MEN-TSH-001-BLK-M',
        vendorSku: 'VEND-TSH-001-BLK-M',
        color: 'Black',
        size: 'M',
        gender: 'men',
        season: 'All Season',
        fit: 'Regular',
        price: 19.99,
        reorderLevel: 75,
      },
      {
        productId: productsMap.get('MEN-TSH-001')!,
        sku: 'MEN-TSH-001-BLK-L',
        vendorSku: 'VEND-TSH-001-BLK-L',
        color: 'Black',
        size: 'L',
        gender: 'men',
        season: 'All Season',
        fit: 'Regular',
        price: 19.99,
        reorderLevel: 75,
      },
      {
        productId: productsMap.get('MEN-TSH-001')!,
        sku: 'MEN-TSH-001-WHT-M',
        vendorSku: 'VEND-TSH-001-WHT-M',
        color: 'White',
        size: 'M',
        gender: 'men',
        season: 'All Season',
        fit: 'Regular',
        price: 19.99,
        reorderLevel: 75,
      },
      {
        productId: productsMap.get('MEN-TSH-001')!,
        sku: 'MEN-TSH-001-WHT-L',
        vendorSku: 'VEND-TSH-001-WHT-L',
        color: 'White',
        size: 'L',
        gender: 'men',
        season: 'All Season',
        fit: 'Regular',
        price: 19.99,
        reorderLevel: 75,
      },
      {
        productId: productsMap.get('MEN-TSH-001')!,
        sku: 'MEN-TSH-001-NVY-M',
        vendorSku: 'VEND-TSH-001-NVY-M',
        color: 'Navy',
        size: 'M',
        gender: 'men',
        season: 'All Season',
        fit: 'Regular',
        price: 19.99,
        reorderLevel: 60,
      },
      
      // Formal Dress Shirt variants
      {
        productId: productsMap.get('MEN-SHT-001')!,
        sku: 'MEN-SHT-001-WHT-M',
        vendorSku: 'VEND-SHT-001-WHT-M',
        color: 'White',
        size: 'M',
        gender: 'men',
        season: 'All Season',
        fit: 'Slim',
        price: 39.99,
        reorderLevel: 40,
      },
      {
        productId: productsMap.get('MEN-SHT-001')!,
        sku: 'MEN-SHT-001-WHT-L',
        vendorSku: 'VEND-SHT-001-WHT-L',
        color: 'White',
        size: 'L',
        gender: 'men',
        season: 'All Season',
        fit: 'Slim',
        price: 39.99,
        reorderLevel: 40,
      },
      {
        productId: productsMap.get('MEN-SHT-001')!,
        sku: 'MEN-SHT-001-BLU-M',
        vendorSku: 'VEND-SHT-001-BLU-M',
        color: 'Light Blue',
        size: 'M',
        gender: 'men',
        season: 'All Season',
        fit: 'Slim',
        price: 39.99,
        reorderLevel: 40,
      },
      
      // Chino Pants variants
      {
        productId: productsMap.get('MEN-PNT-001')!,
        sku: 'MEN-PNT-001-KHK-32',
        vendorSku: 'VEND-PNT-001-KHK-32',
        color: 'Khaki',
        size: '32',
        gender: 'men',
        season: 'All Season',
        fit: 'Regular',
        price: 49.99,
        reorderLevel: 30,
      },
      {
        productId: productsMap.get('MEN-PNT-001')!,
        sku: 'MEN-PNT-001-KHK-34',
        vendorSku: 'VEND-PNT-001-KHK-34',
        color: 'Khaki',
        size: '34',
        gender: 'men',
        season: 'All Season',
        fit: 'Regular',
        price: 49.99,
        reorderLevel: 35,
      },
      {
        productId: productsMap.get('MEN-PNT-001')!,
        sku: 'MEN-PNT-001-NVY-32',
        vendorSku: 'VEND-PNT-001-NVY-32',
        color: 'Navy',
        size: '32',
        gender: 'men',
        season: 'All Season',
        fit: 'Regular',
        price: 49.99,
        reorderLevel: 30,
      },
      
      // Summer Floral Dress variants
      {
        productId: productsMap.get('WMN-DRS-001')!,
        sku: 'WMN-DRS-001-FLR-S',
        vendorSku: 'VEND-DRS-001-FLR-S',
        color: 'Floral Pattern',
        size: 'S',
        gender: 'women',
        season: 'Summer',
        fit: 'Regular',
        price: 59.99,
        reorderLevel: 25,
      },
      {
        productId: productsMap.get('WMN-DRS-001')!,
        sku: 'WMN-DRS-001-FLR-M',
        vendorSku: 'VEND-DRS-001-FLR-M',
        color: 'Floral Pattern',
        size: 'M',
        gender: 'women',
        season: 'Summer',
        fit: 'Regular',
        price: 59.99,
        reorderLevel: 30,
      },
      {
        productId: productsMap.get('WMN-DRS-001')!,
        sku: 'WMN-DRS-001-FLR-L',
        vendorSku: 'VEND-DRS-001-FLR-L',
        color: 'Floral Pattern',
        size: 'L',
        gender: 'women',
        season: 'Summer',
        fit: 'Regular',
        price: 59.99,
        reorderLevel: 25,
      },
      
      // Silk Blouse variants
      {
        productId: productsMap.get('WMN-BLS-001')!,
        sku: 'WMN-BLS-001-WHT-S',
        vendorSku: 'VEND-BLS-001-WHT-S',
        color: 'White',
        size: 'S',
        gender: 'women',
        season: 'All Season',
        fit: 'Regular',
        price: 79.99,
        reorderLevel: 20,
      },
      {
        productId: productsMap.get('WMN-BLS-001')!,
        sku: 'WMN-BLS-001-WHT-M',
        vendorSku: 'VEND-BLS-001-WHT-M',
        color: 'White',
        size: 'M',
        gender: 'women',
        season: 'All Season',
        fit: 'Regular',
        price: 79.99,
        reorderLevel: 25,
      },
      {
        productId: productsMap.get('WMN-BLS-001')!,
        sku: 'WMN-BLS-001-PNK-M',
        vendorSku: 'VEND-BLS-001-PNK-M',
        color: 'Pink',
        size: 'M',
        gender: 'women',
        season: 'All Season',
        fit: 'Regular',
        price: 79.99,
        reorderLevel: 20,
      },
      
      // Pleated Midi Skirt variants
      {
        productId: productsMap.get('WMN-SKT-001')!,
        sku: 'WMN-SKT-001-BLK-S',
        vendorSku: 'VEND-SKT-001-BLK-S',
        color: 'Black',
        size: 'S',
        gender: 'women',
        season: 'All Season',
        fit: 'Regular',
        price: 44.99,
        reorderLevel: 30,
      },
      {
        productId: productsMap.get('WMN-SKT-001')!,
        sku: 'WMN-SKT-001-BLK-M',
        vendorSku: 'VEND-SKT-001-BLK-M',
        color: 'Black',
        size: 'M',
        gender: 'women',
        season: 'All Season',
        fit: 'Regular',
        price: 44.99,
        reorderLevel: 35,
      },
      {
        productId: productsMap.get('WMN-SKT-001')!,
        sku: 'WMN-SKT-001-GRY-M',
        vendorSku: 'VEND-SKT-001-GRY-M',
        color: 'Gray',
        size: 'M',
        gender: 'women',
        season: 'All Season',
        fit: 'Regular',
        price: 44.99,
        reorderLevel: 30,
      },
      
      // Kids T-Shirt variants
      {
        productId: productsMap.get('KID-TSH-001')!,
        sku: 'KID-TSH-001-RED-4',
        vendorSku: 'VEND-KID-001-RED-4',
        color: 'Red',
        size: '4Y',
        gender: 'unisex',
        season: 'All Season',
        fit: 'Regular',
        price: 14.99,
        reorderLevel: 40,
      },
      {
        productId: productsMap.get('KID-TSH-001')!,
        sku: 'KID-TSH-001-BLU-6',
        vendorSku: 'VEND-KID-001-BLU-6',
        color: 'Blue',
        size: '6Y',
        gender: 'unisex',
        season: 'All Season',
        fit: 'Regular',
        price: 14.99,
        reorderLevel: 45,
      },
      {
        productId: productsMap.get('KID-TSH-001')!,
        sku: 'KID-TSH-001-YLW-8',
        vendorSku: 'VEND-KID-001-YLW-8',
        color: 'Yellow',
        size: '8Y',
        gender: 'unisex',
        season: 'All Season',
        fit: 'Regular',
        price: 14.99,
        reorderLevel: 40,
      },
      
      // Slim Fit Jeans variants
      {
        productId: productsMap.get('DNM-JEA-001')!,
        sku: 'DNM-JEA-001-BLU-30',
        vendorSku: 'VEND-JEA-001-BLU-30',
        color: 'Dark Blue',
        size: '30',
        gender: 'unisex',
        season: 'All Season',
        fit: 'Slim',
        price: 69.99,
        reorderLevel: 35,
      },
      {
        productId: productsMap.get('DNM-JEA-001')!,
        sku: 'DNM-JEA-001-BLU-32',
        vendorSku: 'VEND-JEA-001-BLU-32',
        color: 'Dark Blue',
        size: '32',
        gender: 'unisex',
        season: 'All Season',
        fit: 'Slim',
        price: 69.99,
        reorderLevel: 40,
      },
      {
        productId: productsMap.get('DNM-JEA-001')!,
        sku: 'DNM-JEA-001-BLK-32',
        vendorSku: 'VEND-JEA-001-BLK-32',
        color: 'Black',
        size: '32',
        gender: 'unisex',
        season: 'All Season',
        fit: 'Slim',
        price: 69.99,
        reorderLevel: 35,
      },
      
      // High-Performance Leggings variants
      {
        productId: productsMap.get('ACT-LEG-001')!,
        sku: 'ACT-LEG-001-BLK-XS',
        vendorSku: 'VEND-LEG-001-BLK-XS',
        color: 'Black',
        size: 'XS',
        gender: 'women',
        season: 'All Season',
        fit: 'Compression',
        price: 44.99,
        reorderLevel: 30,
      },
      {
        productId: productsMap.get('ACT-LEG-001')!,
        sku: 'ACT-LEG-001-BLK-S',
        vendorSku: 'VEND-LEG-001-BLK-S',
        color: 'Black',
        size: 'S',
        gender: 'women',
        season: 'All Season',
        fit: 'Compression',
        price: 44.99,
        reorderLevel: 40,
      },
      {
        productId: productsMap.get('ACT-LEG-001')!,
        sku: 'ACT-LEG-001-BLK-M',
        vendorSku: 'VEND-LEG-001-BLK-M',
        color: 'Black',
        size: 'M',
        gender: 'women',
        season: 'All Season',
        fit: 'Compression',
        price: 44.99,
        reorderLevel: 45,
      },
      {
        productId: productsMap.get('ACT-LEG-001')!,
        sku: 'ACT-LEG-001-GRY-M',
        vendorSku: 'VEND-LEG-001-GRY-M',
        color: 'Gray',
        size: 'M',
        gender: 'women',
        season: 'All Season',
        fit: 'Compression',
        price: 44.99,
        reorderLevel: 35,
      },
      
      // Sports Tank Top variants
      {
        productId: productsMap.get('ACT-TOP-001')!,
        sku: 'ACT-TOP-001-WHT-S',
        vendorSku: 'VEND-TOP-001-WHT-S',
        color: 'White',
        size: 'S',
        gender: 'unisex',
        season: 'Summer',
        fit: 'Regular',
        price: 24.99,
        reorderLevel: 50,
      },
      {
        productId: productsMap.get('ACT-TOP-001')!,
        sku: 'ACT-TOP-001-WHT-M',
        vendorSku: 'VEND-TOP-001-WHT-M',
        color: 'White',
        size: 'M',
        gender: 'unisex',
        season: 'Summer',
        fit: 'Regular',
        price: 24.99,
        reorderLevel: 60,
      },
      {
        productId: productsMap.get('ACT-TOP-001')!,
        sku: 'ACT-TOP-001-BLK-M',
        vendorSku: 'VEND-TOP-001-BLK-M',
        color: 'Black',
        size: 'M',
        gender: 'unisex',
        season: 'Summer',
        fit: 'Regular',
        price: 24.99,
        reorderLevel: 55,
      },
      
      // Business Suit variants
      {
        productId: productsMap.get('FRM-SUT-001')!,
        sku: 'FRM-SUT-001-CHR-40',
        vendorSku: 'VEND-SUT-001-CHR-40',
        color: 'Charcoal',
        size: '40',
        gender: 'men',
        season: 'All Season',
        fit: 'Tailored',
        price: 299.99,
        reorderLevel: 10,
      },
      {
        productId: productsMap.get('FRM-SUT-001')!,
        sku: 'FRM-SUT-001-CHR-42',
        vendorSku: 'VEND-SUT-001-CHR-42',
        color: 'Charcoal',
        size: '42',
        gender: 'men',
        season: 'All Season',
        fit: 'Tailored',
        price: 299.99,
        reorderLevel: 12,
      },
      {
        productId: productsMap.get('FRM-SUT-001')!,
        sku: 'FRM-SUT-001-NVY-42',
        vendorSku: 'VEND-SUT-001-NVY-42',
        color: 'Navy',
        size: '42',
        gender: 'men',
        season: 'All Season',
        fit: 'Tailored',
        price: 299.99,
        reorderLevel: 10,
      },
      
      // Wool Sweater variants
      {
        productId: productsMap.get('KNT-SWE-001')!,
        sku: 'KNT-SWE-001-GRY-M',
        vendorSku: 'VEND-SWE-001-GRY-M',
        color: 'Gray',
        size: 'M',
        gender: 'unisex',
        season: 'Winter',
        fit: 'Regular',
        price: 89.99,
        reorderLevel: 25,
      },
      {
        productId: productsMap.get('KNT-SWE-001')!,
        sku: 'KNT-SWE-001-GRY-L',
        vendorSku: 'VEND-SWE-001-GRY-L',
        color: 'Gray',
        size: 'L',
        gender: 'unisex',
        season: 'Winter',
        fit: 'Regular',
        price: 89.99,
        reorderLevel: 25,
      },
      {
        productId: productsMap.get('KNT-SWE-001')!,
        sku: 'KNT-SWE-001-NVY-L',
        vendorSku: 'VEND-SWE-001-NVY-L',
        color: 'Navy',
        size: 'L',
        gender: 'unisex',
        season: 'Winter',
        fit: 'Regular',
        price: 89.99,
        reorderLevel: 20,
      },
      
      // Rain Jacket variants
      {
        productId: productsMap.get('OUT-JKT-001')!,
        sku: 'OUT-JKT-001-YLW-M',
        vendorSku: 'VEND-JKT-001-YLW-M',
        color: 'Yellow',
        size: 'M',
        gender: 'unisex',
        season: 'Spring',
        fit: 'Regular',
        price: 79.99,
        reorderLevel: 20,
      },
      {
        productId: productsMap.get('OUT-JKT-001')!,
        sku: 'OUT-JKT-001-YLW-L',
        vendorSku: 'VEND-JKT-001-YLW-L',
        color: 'Yellow',
        size: 'L',
        gender: 'unisex',
        season: 'Spring',
        fit: 'Regular',
        price: 79.99,
        reorderLevel: 20,
      },
      {
        productId: productsMap.get('OUT-JKT-001')!,
        sku: 'OUT-JKT-001-BLK-L',
        vendorSku: 'VEND-JKT-001-BLK-L',
        color: 'Black',
        size: 'L',
        gender: 'unisex',
        season: 'Spring',
        fit: 'Regular',
        price: 79.99,
        reorderLevel: 25,
      },
    ];

    const createdVariants = await Promise.all(
      variantsData.map((variant) => variantRepo.create(variant, pool))
    );

    console.log(`✅ Created ${createdVariants.length} variants`);
    return createdVariants;
  } catch (error) {
    console.error('❌ Failed to seed variants:', error);
    throw error;
  }
}

// Run directly if executed as a standalone script
if (import.meta.url === `file://${process.argv[1]}`) {
  seedVariants()
    .then(() => {
      console.log('✅ Variant seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Variant seeding failed:', error);
      process.exit(1);
    });
}
