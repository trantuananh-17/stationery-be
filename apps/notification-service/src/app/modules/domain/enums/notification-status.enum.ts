export const NotificationStatus = {
  UNREAD: 'UNREAD',
  READ: 'READ',
};
export type NotificationStatus = (typeof NotificationStatus)[keyof typeof NotificationStatus];
