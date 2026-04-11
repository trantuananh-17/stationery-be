export abstract class ICategoryQueryRepository {
  abstract findCategoryExist(categoryId?: string): Promise<boolean>;
  abstract findBySlug(categorySlug: string): Promise<string | null>;
}
