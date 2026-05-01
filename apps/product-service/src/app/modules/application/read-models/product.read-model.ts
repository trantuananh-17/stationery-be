type GrpcTimestamp = {
  seconds: number;
  nanos: number;
};

export interface ProductReadModel {
  id: string;
  name: string;
  slug: string;
  thumbnail: string;
  description: string;
  sku: string;
  category: string;
  brand: string;
  status: string;
  price: number;
  compareAtPrice?: number | null;
  stock: number;
  createdAt: Date;
}
