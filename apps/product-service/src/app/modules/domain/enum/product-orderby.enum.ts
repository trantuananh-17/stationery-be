export const ProductOrderBy = {
  PRICE_ASC: 'price_asc',
  PRICE_DESC: 'price_desc',
  CREATED_AT_DESC: 'created_at_desc',
  CREATED_AT_ASC: 'created_at_asc',
  NAME_ASC: 'name_asc',
  NAME_DESC: 'name_desc',
} as const;

export type ProductOrderBy = (typeof ProductOrderBy)[keyof typeof ProductOrderBy];

export const AdminProductOrderBy = {
  PRICE_ASC: 'price_asc',
  PRICE_DESC: 'price_desc',
  CREATED_AT_DESC: 'created_at_desc',
  CREATED_AT_ASC: 'created_at_asc',
  NAME_ASC: 'name_asc',
  NAME_DESC: 'name_desc',
  STOCK_ASC: 'stock_asc',
  STOCK_DESC: 'stock_desc',
};
export type AdminProductOrderBy = (typeof AdminProductOrderBy)[keyof typeof AdminProductOrderBy];
