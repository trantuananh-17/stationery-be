export abstract class IBrandQueryRepository {
  abstract findBrandExist(brandId: string): Promise<boolean>;
}
