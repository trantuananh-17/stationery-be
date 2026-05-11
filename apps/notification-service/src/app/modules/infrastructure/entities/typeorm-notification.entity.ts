import { Column, Entity } from 'typeorm';
import { BaseEntity } from '@common/databases/base.entity';
import { NotificationType } from '../../domain/enums/notification-type.enum';
import { NotificationStatus } from '../../domain/enums/notification-status.enum';

@Entity({ name: 'notifications' })
export class NotificationOrmEntity extends BaseEntity {
  @Column({ name: 'receiver_id', type: 'uuid' })
  receiverId: string;

  @Column({
    type: 'enum',
    enum: NotificationType,
  })
  type: NotificationType;

  @Column({
    type: 'enum',
    enum: NotificationStatus,
  })
  status: NotificationStatus;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'text' })
  message: string;

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  metadata?: Record<string, any>;

  @Column({
    name: 'read_at',
    type: 'timestamp',
    nullable: true,
  })
  readAt?: Date;
}
