import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiProperty,
  ApiPropertyOptional,
  ApiTags,
} from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

import { ProductAiSortBy } from '../dto/product-ai.dto';
import { ProductAiGrpcClientService } from '../services/product-ai.service';

class TestSearchProductAiDto {
  @ApiPropertyOptional({
    example: 'bút',
    description: 'Từ khóa sản phẩm cần tìm',
  })
  @IsOptional()
  @IsString()
  keyword?: string;

  @ApiPropertyOptional({
    example: 'học sinh',
    description: 'Đối tượng sử dụng sản phẩm',
  })
  @IsOptional()
  @IsString()
  audience?: string;

  @ApiPropertyOptional({
    example: 'viết bài hằng ngày',
    description: 'Nhu cầu sử dụng sản phẩm',
  })
  @IsOptional()
  @IsString()
  need?: string;

  @ApiPropertyOptional({
    example: 'bút viết',
    description: 'Tên danh mục hoặc categoryId',
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({
    example: 'Thiên Long',
    description: 'Tên thương hiệu hoặc brandId',
  })
  @IsOptional()
  @IsString()
  brand?: string;

  @ApiPropertyOptional({
    example: 0,
    description: 'Giá thấp nhất',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  budgetMin?: number;

  @ApiPropertyOptional({
    example: 100000,
    description: 'Giá cao nhất',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  budgetMax?: number;

  @ApiPropertyOptional({
    enum: ['relevant', 'price_asc', 'price_desc'],
    example: 'price_asc',
    description: 'Cách sắp xếp sản phẩm',
  })
  @IsOptional()
  @IsIn(['relevant', 'price_asc', 'price_desc'])
  sortBy?: ProductAiSortBy;

  @ApiPropertyOptional({
    example: 8,
    description: 'Số lượng sản phẩm muốn lấy',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(20)
  limit?: number;
}

class AdvisorProductResponseDto {
  @ApiProperty({ example: 'uuid-product' })
  product_id: string;

  @ApiProperty({ example: 'Bút bi xanh Thiên Long' })
  product_name: string;

  @ApiProperty({ example: 'but-bi-xanh-thien-long' })
  slug: string;

  @ApiProperty({ example: 'uuid-category' })
  category_id: string;

  @ApiProperty({ example: 'Bút viết' })
  category_name: string;

  @ApiProperty({ example: 'uuid-brand' })
  brand_id: string;

  @ApiProperty({ example: 'Thiên Long' })
  brand_name: string;

  @ApiProperty({ example: 'Bút bi dùng cho học sinh, sinh viên và văn phòng' })
  short_description: string;

  @ApiProperty({ example: 'Mô tả chi tiết sản phẩm...' })
  description: string;

  @ApiProperty({ example: 'https://example.com/thumb.jpg' })
  thumbnail: string;

  @ApiProperty({ example: 'uuid-variant' })
  variant_id: string;

  @ApiProperty({ example: 'Màu xanh' })
  variant_name: string;

  @ApiProperty({ example: 'BUT-XANH-001' })
  sku: string;

  @ApiProperty({ example: 5000 })
  price: number;

  @ApiProperty({ example: 7000 })
  compare_at_price: number;

  @ApiProperty({ example: 120 })
  stock: number;

  @ApiProperty({ example: 'https://example.com/image.jpg' })
  image: string;

  @ApiProperty({ example: '/products/but-bi-xanh-thien-long' })
  product_url: string;
}

class ProductAiSearchResponseDto {
  @ApiProperty({ example: 2 })
  total: number;

  @ApiProperty({
    type: [AdvisorProductResponseDto],
  })
  items: AdvisorProductResponseDto[];
}

@ApiTags('Product AI Test')
@Controller('product-ai-test')
export class ProductAiController {
  constructor(private readonly productAiGrpcClient: ProductAiGrpcClientService) {}

  @Post('search')
  @ApiOperation({
    summary: 'Test gọi Product Service qua gRPC để tìm sản phẩm cho AI tư vấn',
  })
  @ApiBody({
    type: TestSearchProductAiDto,
    examples: {
      studentPen: {
        summary: 'Tìm bút cho học sinh dưới 100k',
        value: {
          keyword: 'bút',
          audience: 'học sinh',
          need: 'viết bài hằng ngày',
          budgetMin: 0,
          budgetMax: 100000,
          sortBy: 'price_asc',
          limit: 5,
        },
      },
      officePaper: {
        summary: 'Tìm giấy cho văn phòng',
        value: {
          keyword: 'giấy',
          audience: 'văn phòng',
          need: 'in tài liệu',
          budgetMin: 50000,
          budgetMax: 300000,
          sortBy: 'relevant',
          limit: 8,
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Danh sách sản phẩm lấy từ Product Service',
    type: ProductAiSearchResponseDto,
  })
  async search(@Body() body: TestSearchProductAiDto): Promise<ProductAiSearchResponseDto> {
    const items = await this.productAiGrpcClient.searchProductsForAdvisor({
      keyword: body.keyword,
      audience: body.audience,
      need: body.need,
      category: body.category,
      brand: body.brand,
      budgetMin: body.budgetMin,
      budgetMax: body.budgetMax,
      sortBy: body.sortBy || 'relevant',
      limit: body.limit || 8,
    });

    return {
      total: items.length,
      items,
    };
  }
}
