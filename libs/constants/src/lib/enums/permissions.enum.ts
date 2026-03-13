export enum PERMISSION {
  /* PRODUCT */
  PRODUCT_CREATE = 'product.create',
  PRODUCT_GET_BY_ID = 'product.get_by_id',
  PRODUCT_GET_ALL = 'product.get_all',
  PRODUCT_UPDATE = 'product.update',
  PRODUCT_DELETE = 'product.delete',

  /* CATEGORY */
  CATEGORY_CREATE = 'category.create',
  CATEGORY_GET_ALL = 'category.get_all',
  CATEGORY_UPDATE = 'category.update',
  CATEGORY_DELETE = 'category.delete',

  /* ORDER */
  ORDER_CREATE = 'order.create',
  ORDER_GET_BY_ID = 'order.get_by_id',
  ORDER_GET_ALL = 'order.get_all',
  ORDER_UPDATE_STATUS = 'order.update_status',
  ORDER_CANCEL = 'order.cancel',

  /* CART */
  CART_ADD_ITEM = 'cart.add_item',
  CART_REMOVE_ITEM = 'cart.remove_item',
  CART_GET = 'cart.get',

  /* USER */
  USER_CREATE = 'user.create',
  USER_GET_BY_ID = 'user.get_by_id',
  USER_GET_ALL = 'user.get_all',
  USER_UPDATE = 'user.update',
  USER_DELETE = 'user.delete',

  /* ROLE */
  ROLE_CREATE = 'role.create',
  ROLE_GET_BY_ID = 'role.get_by_id',
  ROLE_GET_ALL = 'role.get_all',
  ROLE_UPDATE = 'role.update',
  ROLE_DELETE = 'role.delete',

  /* INVENTORY */
  INVENTORY_UPDATE = 'inventory.update',

  /* REPORT */
  REPORT_GET_SALES = 'report.get_sales',
}
