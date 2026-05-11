export const ProductStatus = {
  ACTIVE: 'ACTIVE',
  ARCHIVED: 'ARCHIVED',
  DRAFT: 'DRAFT',
  DELETED: 'DELETED',
} as const;

export type ProductStatus = (typeof ProductStatus)[keyof typeof ProductStatus];
