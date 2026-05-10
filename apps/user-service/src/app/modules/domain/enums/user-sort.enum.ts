export const UserSort = {
  ORDER_ASC: 'order_asc',
  ORDER_DESC: 'order_desc',
  PRICE_ASC: 'price_asc',
  PRICE_DESC: 'price_desc',
  CREATED_AT_DESC: 'created_at_desc',
  CREATED_AT_ASC: 'created_at_asc',
};
export type UserSort = (typeof UserSort)[keyof typeof UserSort];
