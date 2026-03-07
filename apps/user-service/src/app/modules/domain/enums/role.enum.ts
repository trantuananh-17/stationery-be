export const RoleName = {
  ADMIN: 'ADMIN',
  USER: 'USER',
  STAFF: 'STAFF',
} as const;

export type RoleName = (typeof RoleName)[keyof typeof RoleName];
