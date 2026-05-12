import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationOrmEntity } from '../entities/typeorm-notification.entity';
import { INotificationQueryRepository } from '../../application/ports/repositories/notification-query.repo';
import { Notification } from '../../domain/entities/notification.entity';
import { NotificationStatus } from '../../domain/enums/notification-status.enum';
import { NotificationType } from '../../domain/enums/notification-type.enum';

@Injectable()
export class TypeOrmNotificationQueryRepository implements INotificationQueryRepository {
  constructor(
    @InjectRepository(NotificationOrmEntity)
    private readonly notificationRepo: Repository<NotificationOrmEntity>,
  ) {}

  async findById(id: string): Promise<Notification | null> {
    const entity = await this.notificationRepo.findOne({
      where: { id },
    });

    if (!entity) {
      return null;
    }

    return this._toDomain(entity);
  }

  async getNotifications(params: {
    receiverId: string;
    page: number;
    limit: number;
    status?: NotificationStatus;
    type?: NotificationType;
  }): Promise<{
    items: Notification[];
    total: number;
  }> {
    const { receiverId, page, limit, status, type } = params;
    const query = this.notificationRepo.createQueryBuilder('notification');
    query.where('notification.receiverId = :receiverId', {
      receiverId,
    });
    if (status) {
      query.andWhere('notification.status = :status', {
        status,
      });
    }

    if (type) {
      query.andWhere('notification.type = :type', {
        type,
      });
    }

    query.orderBy('notification.createdAt', 'DESC');
    query.skip((page - 1) * limit);
    query.take(limit);

    const [entities, total] = await query.getManyAndCount();
    return {
      items: entities.map((entity) => this._toDomain(entity)),

      total,
    };
  }

  async getUnreadCount(receiverId: string): Promise<number> {
    return this.notificationRepo.count({
      where: {
        receiverId,

        status: NotificationStatus.UNREAD,
      },
    });
  }

  private _toDomain(entity: NotificationOrmEntity): Notification {
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
}
