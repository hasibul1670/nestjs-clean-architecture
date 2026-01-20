import { CategoryService } from '@application/services/category.service';
import { CategoryDomainService } from '@domain/services/category-domain.service';
import { DatabaseModule } from '@infrastructure/database/database.module';
import { CategoryEntity } from '@infrastructure/entities/category.entity';
import { CategoryRepository } from '@infrastructure/repository/category.repository';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([CategoryEntity])],
  providers: [
    CategoryService,
    CategoryDomainService,
    {
      provide: 'ICategoryRepository',
      useClass: CategoryRepository,
    },
  ],
  exports: [CategoryService, CategoryDomainService, 'ICategoryRepository'],
})
export class CategoryModule {}
