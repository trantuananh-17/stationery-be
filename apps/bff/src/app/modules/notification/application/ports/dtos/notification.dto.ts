import { GrpcTimestamp } from '@common/interfaces/grpc/common/timestamp.interface';

export type NotificationDto = {
  id: string;
  receiverId: string;
  type: string;
  status: string;
  title: string;
  message: string;
  metadata?: Record<string, string>;
  createdAt: GrpcTimestamp;
  updatedAt: GrpcTimestamp;
  readAt?: GrpcTimestamp;
};

export type GetNotificationsRequest = {
  receiverId: string;
  page?: number;
  limit?: number;
  status?: string;
  type?: string;
};

export type GetNotificationsResponse = {
  items: NotificationDto[];
  total: number;
};

export type GetUnreadCountRequest = {
  receiverId: string;
};

export type GetUnreadCountResponse = {
  count: number;
};

export type MarkAsReadRequest = {
  notificationId: string;
};

export type MarkAsReadResponse = void;

export type MarkAllAsReadRequest = {
  receiverId: string;
};
export type MarkAllAsReadResponse = void;

export const NotificationStatus = {
  UNREAD: 'UNREAD',
  READ: 'READ',
};
export type NotificationStatus = (typeof NotificationStatus)[keyof typeof NotificationStatus];

export const NotificationType = {
  USER_REGISTERED: 'USER_REGISTERED',
  ORDER_CREATED: 'ORDER_CREATED',
  PAYMENT_SUCCESS: 'PAYMENT_SUCCESS',
  PAYMENT_FAILED: 'PAYMENT_FAILED',
} as const;

export type NotificationType = (typeof NotificationType)[keyof typeof NotificationType];
