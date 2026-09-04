import { BaseEntity } from '@common/databases/base.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne, Unique } from 'typeorm';

import { UserOrmEntity } from './typeorm-user.entity';

@Entity({ name: 'wishlist_items' })
@Index(['userId'])
@Unique(['userId', 'productId'])
export class WishlistItemOrmEntity extends BaseEntity {
  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @ManyToOne(() => UserOrmEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserOrmEntity;

  @Column({ name: 'product_id', type: 'uuid' })
  productId: string;

  // Snapshot để hiển thị danh sách mà không phải gọi chéo product-service.
  // Giá có thể lệch giá hiện tại — FE luôn dẫn về trang sản phẩm để xem giá thật.
  @Column({ name: 'product_name', type: 'varchar', length: 255 })
  productName: string;

  @Column({ name: 'product_slug', type: 'varchar', length: 255 })
  productSlug: string;

  @Column({ type: 'varchar', length: 500, default: '' })
  thumbnail: string;

  @Column({ type: 'decimal', default: 0 })
  price: number;
}
