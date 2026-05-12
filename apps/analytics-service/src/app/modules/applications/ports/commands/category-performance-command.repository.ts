import { CategoryPerformance } from '../../../domain/entities/category-performanc.entity';

export abstract class ICategoryPerformanceCommandRepository {
  abstract findByCategoryAndDate(
    categoryId: string,
    date: string,
  ): Promise<CategoryPerformance | null>;

  abstract save(performance: CategoryPerformance): Promise<void>;
}
