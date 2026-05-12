import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationOrmEntity } from '../entities/typeorm-notification.entity';
import { INotificationCommandRepository } from '../../application/ports/repositories/notification-command.repo';
import { Notification } from '../../domain/entities/notification.entity';
import { NotificationStatus } from '../../domain/enums/notification-status.enum';
@Injectable()
export class TypeOrmNotificationCommandRepository implements INotificationCommandRepository {
  constructor(
    @InjectRepository(NotificationOrmEntity)
    private readonly notificationRepo: Repository<NotificationOrmEntity>,
  ) {}

  async markAllAsRead(receiverId: string): Promise<void> {
    await this.notificationRepo
      .createQueryBuilder()
      .update(NotificationOrmEntity)
      .set({
        status: NotificationStatus.READ,

        readAt: new Date(),
      })
      .where('receiverId = :receiverId', {
        receiverId,
      })
      .andWhere('status = :status', {
        status: NotificationStatus.UNREAD,
      })
      .execute();
  }

  async findById(id: string): Promise<Notification | null> {
    const entity = await this.notificationRepo.findOne({
      where: { id },
    });
    if (!entity) {
      return null;
    }

    return this.toDomain(entity);
  }

  async save(notification: Notification): Promise<void> {
    const entity = this.toOrm(notification);
    await this.notificationRepo.save(entity);
  }

  private toDomain(entity: NotificationOrmEntity): Notification {
    return new Notification({
      id: entity.id,
      receiverId: entity.receiverId,
      type: entity.type,
      status: entity.status,
      title: entity.title,
      message: entity.message,
      metadata: entity.metadata,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      readAt: entity.readAt,
    });
  }

  private toOrm(notification: Notification): NotificationOrmEntity {
    const entity = new NotificationOrmEntity();
    entity.id = notification.id;
    entity.receiverId = notification.receiverId;
    entity.type = notification.type;
    entity.status = notification.status;
    entity.title = notification.title;
    entity.message = notification.message;
    entity.metadata = notification.metadata;
    entity.createdAt = notification.createdAt;
    entity.updatedAt = notification.updatedAt;
    entity.readAt = notification.readAt;
    return entity;
  }
}
