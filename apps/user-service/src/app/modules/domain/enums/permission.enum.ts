export const Permission = {
  /* USER */
  USER_CREATE: 'user.create',
  USER_GET_ALL: 'user.get_all',
  USER_DELETE: 'user.delete',

  /* PRODUCT */
  PRODUCT_CREATE: 'product.create',
  PRODUCT_UPDATE: 'product.update',
  PRODUCT_DELETE: 'product.delete',
} as const;

export type Permission = (typeof Permission)[keyof typeof Permission];
