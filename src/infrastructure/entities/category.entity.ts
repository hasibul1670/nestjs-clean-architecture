import { SoftDeletableEntity } from '@infrastructure/entities/base/soft-deletable.entity';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('categories')
export class CategoryEntity extends SoftDeletableEntity {
  @PrimaryColumn()
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true, type: 'text' })
  description?: string;

  @Column({ default: true })
  isActive: boolean;
}
