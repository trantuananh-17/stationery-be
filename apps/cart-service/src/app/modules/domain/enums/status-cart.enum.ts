export const StatusCart = {
  ACTIVE: 'ACTIVE',
  CHECK_OUT: 'CHECK_OUT',
  EXPIRED: 'EXPIRED',
} as const;

export type StatusCart = (typeof StatusCart)[keyof typeof StatusCart];
