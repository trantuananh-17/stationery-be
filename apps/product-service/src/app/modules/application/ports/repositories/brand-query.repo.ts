export abstract class IBrandQueryRepository {
  abstract findBrandExist(brandId?: string): Promise<boolean>;
  abstract findBySlug(brandSlug: string): Promise<string | null>;
}
