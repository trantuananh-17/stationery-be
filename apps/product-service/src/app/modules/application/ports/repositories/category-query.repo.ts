export abstract class ICategoryQueryRepository {
  abstract findCategoryExist(categoryId: string): Promise<boolean>;
}
