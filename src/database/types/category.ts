export interface Category {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Derived types for queries
export type CreateCategoryInput = Omit<Category, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateCategoryInput = Partial<CreateCategoryInput>;
export type CategoryRow = Omit<Category, 'createdAt' | 'updatedAt'> & {
  createdAt: string;
  updatedAt: string;
};

export const categoryColumnMapping: Record<string, string> = {
  name: 'name',
  description: 'description',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
};
