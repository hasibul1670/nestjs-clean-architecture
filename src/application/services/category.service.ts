import { Inject, Injectable } from '@nestjs/common';

import { CreateCategoryDto } from '@api/dto/create-category.dto';
import { UpdateCategoryDto } from '@api/dto/update-category.dto';
import { LoggerService } from '@application/services/logger.service';
import { Category } from '@domain/entities/Category';
import { ICategoryRepository } from '@domain/interfaces/repositories/category-repository.interface';
import { CategoryDomainService } from '@domain/services/category-domain.service';

@Injectable()
export class CategoryService {
  constructor(
    @Inject('ICategoryRepository')
    private readonly repository: ICategoryRepository,
    private readonly logger: LoggerService,
    private readonly categoryDomainService: CategoryDomainService,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    this.logger.logger('Creating category.', {
      module: 'CategoryService',
      method: 'create',
    });

    const existingCategory = await this.repository.findByName(
      createCategoryDto.name,
    );

    if (!this.categoryDomainService.canCreateCategory(existingCategory)) {
      throw new Error('Category already exists with this name');
    }

    const categoryEntity = this.categoryDomainService.createCategoryEntity({
      name: createCategoryDto.name,
      description: createCategoryDto.description,
      isActive: createCategoryDto.isActive,
    });

    return await this.repository.create(categoryEntity);
  }

  async findAll(): Promise<Category[]> {
    const context = { module: 'CategoryService', method: 'findAll' };
    this.logger.logger('Fetching all categories', context);
    return this.repository.findAll();
  }

  async findById(id: string): Promise<Category | null> {
    const context = { module: 'CategoryService', method: 'findById' };
    this.logger.logger(`Fetching category for id: ${id}`, context);
    return this.repository.findById(id);
  }

  async update(id: string, updates: UpdateCategoryDto): Promise<Category> {
    this.logger.logger(`Updating category ${id}`, {
      module: 'CategoryService',
      method: 'update',
    });

    const existingCategory = await this.repository.findById(id);
    const validatedUpdates =
      this.categoryDomainService.validateCategoryUpdate(
        existingCategory,
        updates,
      );

    if (updates.name) {
      const existingByName = await this.repository.findByName(updates.name);
      if (existingByName && existingByName.id !== id) {
        throw new Error('Category already exists with this name');
      }
    }

    return await this.repository.update(id, validatedUpdates);
  }

  async delete(id: string): Promise<void> {
    this.logger.logger(`Deleting category ${id}`, {
      module: 'CategoryService',
      method: 'delete',
    });

    await this.repository.delete(id);
  }
}
