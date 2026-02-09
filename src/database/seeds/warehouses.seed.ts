import pool from '../connection.js';
import { warehouseRepo } from '../repositories/warehouse.repo.js';
import type { CreateWarehouseInput } from '../types/warehouse.js';

const warehousesData: CreateWarehouseInput[] = [
  {
    name: 'Main Warehouse',
    location: 'Downtown District, 123 Industrial Ave',
  },
  {
    name: 'North Branch',
    location: 'North Side, 456 Commerce Blvd',
  },
  {
    name: 'South Branch',
    location: 'South End, 789 Logistics Road',
  },
  {
    name: 'East Distribution Center',
    location: 'East Zone, 321 Warehouse Lane',
  },
  {
    name: 'West Storage Facility',
    location: 'West Quarter, 654 Storage Street',
  },
  {
    name: 'Central Hub',
    location: 'City Center, 987 Central Plaza',
  },
  {
    name: 'Coastal Warehouse',
    location: 'Harbor Area, 147 Port Road',
  },
  {
    name: 'Airport Logistics',
    location: 'Airport Zone, 258 Cargo Terminal',
  },
];

export async function seedWarehouses() {
  console.log('🌱 Seeding warehouses...');
  
  try {
    const createdWarehouses = await Promise.all(
      warehousesData.map((warehouse) => warehouseRepo.create(warehouse, pool))
    );

    console.log(`✅ Created ${createdWarehouses.length} warehouses`);
    return createdWarehouses;
  } catch (error) {
    console.error('❌ Failed to seed warehouses:', error);
    throw error;
  }
}

// Run directly if executed as a standalone script
if (import.meta.url === `file://${process.argv[1]}`) {
  seedWarehouses()
    .then(() => {
      console.log('✅ Warehouse seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Warehouse seeding failed:', error);
      process.exit(1);
    });
}
