import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '@common/databases/base.entity';
import { VariantOrmEntity } from './typeorm-variant.entity';
import { ProductStatus } from '../../domain/enum/product-status.enum';
import { SpecificationOrmEntity } from './typeorm-specification.enity';

@Entity({ name: 'products' })
export class ProductOrmEntity extends BaseEntity {
  @Column()
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ name: 'category_id', type: 'uuid' })
  categoryId: string;

  @Column({ name: 'brand_id', type: 'uuid' })
  brandId: string;

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

  @Column({ name: 'search_keywords', type: 'json', nullable: true })
  searchKeywords: string[];

  @Column({ name: 'base_name', nullable: true })
  baseName: string;

  @Column({ name: 'is_variant_product', default: false })
  isVariantProduct: boolean;

  @OneToMany(() => VariantOrmEntity, (variant) => variant.product)
  variants: VariantOrmEntity[];

  @OneToMany(() => SpecificationOrmEntity, (spec) => spec.product)
  specifications: SpecificationOrmEntity[];
}
