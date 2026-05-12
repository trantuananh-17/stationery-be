import { ProductPerformanceChartDto, TopProductDto } from '../dtos/product-performance.dto';

export abstract class IProductPerformanceQueryRepository {
  abstract getTopProducts(
    startDate: string,
    endDate: string,
    limit: number,
  ): Promise<TopProductDto[]>;

  abstract getChart(
    productId: string,
    startDate: string,
    endDate: string,
  ): Promise<ProductPerformanceChartDto[]>;
}
