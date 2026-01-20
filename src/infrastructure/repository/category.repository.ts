import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, IsNull, Repository } from 'typeorm';
import { Category } from '@domain/entities/Category';
import { ICategoryRepository } from '@domain/interfaces/repositories/category-repository.interface';
import { CategoryEntity } from '@infrastructure/entities/category.entity';

export type CategoryResponse = Category & {
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
};

@Injectable()
export class CategoryRepository implements ICategoryRepository {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  async create(category: Partial<Category>): Promise<Category> {
    const newCategory = this.categoryRepository.create(category);
    const savedCategory = await this.categoryRepository.save(newCategory);
    return this.mapToCategory(savedCategory);
  }

  async findAll(): Promise<Category[]> {
    const categories = await this.categoryRepository.find();
    return categories.map(category => this.mapToCategory(category));
  }

  async findById(id: string): Promise<Category | null> {
    const category = await this.categoryRepository.findOne({ where: { id } });
    return category ? this.mapToCategory(category) : null;
  }

  async findByName(name: string): Promise<Category | null> {
    const category = await this.categoryRepository.findOne({ where: { name } });
    return category ? this.mapToCategory(category) : null;
  }

  async update(id: string, categoryData: Partial<Category>): Promise<Category> {
    const criteria: FindOptionsWhere<CategoryEntity> = {
      id,
      deletedAt: IsNull(),
    };

    const updateResult = await this.categoryRepository.update(
      criteria,
      categoryData,
    );

    if (updateResult.affected === 0) {
      throw new Error('Category not found');
    }

    const updatedCategory = await this.categoryRepository.findOne({
      where: { id },
    });

    return this.mapToCategory(updatedCategory);
  }

  async delete(id: string): Promise<void> {
    await this.categoryRepository.softDelete({ id });
  }

  private mapToCategory(categoryEntity: CategoryEntity): CategoryResponse {
    return {
      id: categoryEntity.id,
      name: categoryEntity.name,
      description: categoryEntity.description,
      isActive: categoryEntity.isActive,
      createdAt: categoryEntity.createdAt,
      updatedAt: categoryEntity.updatedAt,
      deletedAt: categoryEntity.deletedAt ?? null,
    };
  }
}
