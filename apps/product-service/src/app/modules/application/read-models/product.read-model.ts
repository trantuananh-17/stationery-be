export interface ProductReadModel {
  id: string;
  name: string;
  slug: string;
  thumbnail: string;
  images: string[];
  price: number;
  compareAtPrice?: number;
}
