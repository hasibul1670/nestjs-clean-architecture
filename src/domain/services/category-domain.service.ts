import { v4 as uuidv4 } from 'uuid';
import { Category } from '@domain/entities/Category';

export class CategoryDomainService {
  canCreateCategory(existingCategory: Category | null): boolean {
    return !existingCategory;
  }

  createCategoryEntity(categoryData: {
    name: string;
    description?: string;
    isActive?: boolean;
  }): Category {
    this.validateCategoryData(categoryData);

    const category: Category = {
      id: this.generateCategoryId(),
      name: categoryData.name,
      description: categoryData.description,
      isActive: categoryData.isActive ?? true,
    };

    return category;
  }

  validateCategoryUpdate(
    existingCategory: Category | null,
    updates: Partial<Category>,
  ): Partial<Category> {
    if (!existingCategory) {
      throw new Error('Category not found');
    }

    if (updates.name !== undefined) {
      this.validateName(updates.name);
    }

    if (updates.description !== undefined) {
      this.validateDescription(updates.description);
    }

    return updates;
  }

  validateCategoryData(categoryData: {
    name: string;
    description?: string;
  }): void {
    this.validateName(categoryData.name);
    if (categoryData.description !== undefined) {
      this.validateDescription(categoryData.description);
    }
  }

  validateName(name: string): void {
    if (!name || name.trim().length < 2) {
      throw new Error('Category name must be at least 2 characters long');
    }
  }

  validateDescription(description?: string): void {
    if (description && description.trim().length > 500) {
      throw new Error('Category description must be at most 500 characters long');
    }
  }

  generateCategoryId(): string {
    return 'category-' + uuidv4();
  }
}
