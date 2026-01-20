import { SuccessResponseDto } from '@api/dto/common/api-response.dto';
import { CreateCategoryDto } from '@api/dto/create-category.dto';
import { UpdateCategoryDto } from '@api/dto/update-category.dto';
import { Roles } from '@application/auth/decorators/roles.decorator';
import { RolesGuard } from '@application/auth/guards/roles.guard';
import { LoggingInterceptor } from '@application/interceptors/logging.interceptor';
import { CategoryService } from '@application/services/category.service';
import { ResponseService } from '@application/services/response.service';
import { Role } from '@domain/entities/enums/role.enum';
import { Category } from '@domain/entities/Category';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('category')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'category',
  version: '1',
})
@UseInterceptors(LoggingInterceptor)
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly responseService: ResponseService,
  ) {}

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Post('')
  @ApiOperation({ summary: 'Create a new category' })
  @ApiResponse({
    status: 201,
    description: 'The category has been successfully created',
    type: Category,
  })
  async create(
    @Body() category: CreateCategoryDto,
  ): Promise<SuccessResponseDto<Category>> {
    const newCategory = await this.categoryService.create(category);
    return this.responseService.created(newCategory, 'Category created successfully');
  }

  @Get('')
  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({ status: 200, description: 'Returns all categories', type: [Category] })
  async getAll(): Promise<SuccessResponseDto<Category[]>> {
    const categories = await this.categoryService.findAll();
    return this.responseService.retrieved(categories, 'All categories retrieved successfully');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get category by id' })
  @ApiResponse({ status: 200, description: 'Returns category.' })
  @ApiResponse({ status: 404, description: 'Category not found.' })
  async getById(@Param('id') id: string): Promise<SuccessResponseDto<Category>> {
    if (!id) {
      throw new BadRequestException('Category id is required');
    }

    const category = await this.categoryService.findById(id);
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return this.responseService.retrieved(category, 'Category retrieved successfully');
  }

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Put(':id')
  @ApiOperation({ summary: 'Update category by id' })
  @ApiResponse({ status: 200, description: 'Category updated successfully', type: Category })
  async update(
    @Param('id') id: string,
    @Body() updates: UpdateCategoryDto,
  ): Promise<SuccessResponseDto<Category>> {
    if (!id) {
      throw new BadRequestException('Category id is required');
    }

    const updatedCategory = await this.categoryService.update(id, updates);
    return this.responseService.updated(updatedCategory, 'Category updated successfully');
  }

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete category by id' })
  @ApiResponse({ status: 200, description: 'Category deleted successfully' })
  async delete(@Param('id') id: string): Promise<SuccessResponseDto> {
    if (!id) {
      throw new BadRequestException('Category id is required');
    }

    const category = await this.categoryService.findById(id);
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    await this.categoryService.delete(id);
    return this.responseService.deleted('Category deleted successfully');
  }
}
