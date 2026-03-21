import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '@common/databases/base.entity';
import { VariantOrmEntity } from './typeorm-variant.entity';
import { ProductStatus } from '../../domain/enum/product-status.enum';
import { SpecificationOrmEntity } from './typeorm-specification.enity';
import { CategoryOrmEntity } from './typeorm-category.entity';
import { BrandOrmEntity } from './typeorm-brand.entity';

@Entity({ name: 'products' })
export class ProductOrmEntity extends BaseEntity {
  @Column()
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ name: 'category_id', type: 'uuid' })
  categoryId: string;

  @ManyToOne(() => CategoryOrmEntity)
  @JoinColumn({ name: 'category_id' })
  category: CategoryOrmEntity;

  @Column({ name: 'brand_id', type: 'uuid' })
  brandId: string;

  @ManyToOne(() => BrandOrmEntity)
  @JoinColumn({ name: 'brand_id' })
  brand: BrandOrmEntity;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ name: 'short_description', type: 'text', nullable: true })
  shortDescription?: string;

  @Column({ type: 'json', nullable: true })
  images: string[];

  @Column({ nullable: true })
  thumbnail?: string;

  @Column({ type: 'enum', enum: ProductStatus, default: ProductStatus.INACTIVE })
  status: ProductStatus;

  @Column({ default: false })
  featured: boolean;

  @Column({ name: 'seo_title', nullable: true })
  seoTitle?: string;

  @Column({ name: 'seo_description', nullable: true })
  seoDescription?: string;

  @Column({ name: 'search_keywords', type: 'jsonb', nullable: true })
  searchKeywords: string[];

  @Column({ name: 'base_name', nullable: true })
  baseName: string;

  @Column({ name: 'deleted_at', default: null, nullable: true })
  deletedAt?: Date;

  @OneToMany(() => VariantOrmEntity, (variant) => variant.product)
  variants: VariantOrmEntity[];

  @OneToMany(() => SpecificationOrmEntity, (spec) => spec.product)
  specifications: SpecificationOrmEntity[];
}
