export const StatusCart = {
  ACTIVE: 'ACTIVE',
  CHECK_OUT: 'CHECK_OUT',
  EXPIRED: 'EXPIRED',
  MERGED: 'MERGED',
} as const;

export type StatusCart = (typeof StatusCart)[keyof typeof StatusCart];
