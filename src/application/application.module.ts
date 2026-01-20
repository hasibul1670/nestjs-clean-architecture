import { AuthModule } from '@application/auth/auth.module';
import { CategoryModule } from '@application/category/category.module';
import { ProfileModule } from '@application/profile/profile.module';
import { DatabaseModule } from '@infrastructure/database/database.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [AuthModule, ProfileModule, CategoryModule, DatabaseModule],
  providers: [],
  exports: [AuthModule, ProfileModule, CategoryModule],
})
export class ApplicationModule {} 
