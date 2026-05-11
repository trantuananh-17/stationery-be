import { NotificationStatus } from '../enums/notification-status.enum';
import { NotificationType } from '../enums/notification-type.enum';

export type NotificationParams = {
  readonly id: string;
  title: string;
  message: string;
  type: NotificationType;
  status: NotificationStatus;
  receiverId: string;
  metadata?: Record<string, any>;
  readonly createdAt: Date;
  updatedAt: Date;
  readAt?: Date;
};

export class Notification {
  constructor(private params: NotificationParams) {}

  static create(
    receiverId: string,
    type: NotificationType,
    title: string,
    message: string,
    metadata?: Record<string, any>,
  ) {
    const now = new Date();

    return new Notification({
      id: crypto.randomUUID(),
      receiverId,
      type,
      title,
      message,
      metadata,

      status: NotificationStatus.UNREAD,

      createdAt: now,
      updatedAt: now,
    });
  }

  private setUpdatedAt() {
    this.params.updatedAt = new Date();
  }

  markAsRead() {
    if (this.params.status === NotificationStatus.READ) {
      return;
    }

    this.params.status = NotificationStatus.READ;
    this.params.readAt = new Date();

    this.setUpdatedAt();
  }

  updateMessage(title: string, message: string) {
    this.params.title = title;
    this.params.message = message;

    this.setUpdatedAt();
  }

  get id(): string {
    return this.params.id;
  }

  get title(): string {
    return this.params.title;
  }

  get message(): string {
    return this.params.message;
  }

  get type(): NotificationType {
    return this.params.type;
  }

  get status(): NotificationStatus {
    return this.params.status;
  }

  get receiverId(): string {
    return this.params.receiverId;
  }

  get metadata(): Record<string, any> | undefined {
    return this.params.metadata;
  }

  get createdAt(): Date {
    return this.params.createdAt;
  }

  get updatedAt(): Date {
    return this.params.updatedAt;
  }

  get readAt(): Date | undefined {
    return this.params.readAt;
  }
}
