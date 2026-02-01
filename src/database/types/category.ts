export interface Category {
  id: string;
  name: string;
  description?: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

// Derived types for queries
export type CreateCategoryInput = Omit<Category, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'isDeleted'>;
export type UpdateCategoryInput = Partial<CreateCategoryInput>;
export type CategoryRow = Omit<Category, 'createdAt' | 'updatedAt' | 'deletedAt'> & {
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export const categoryColumnMapping: Record<string, string> = {
  name: 'name',
  description: 'description',
  isDeleted: 'is_deleted',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at',
};
