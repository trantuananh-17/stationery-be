import { UserData } from '@common/decorators/user-data.decorator';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { ResponseDto } from '@common/interfaces/gateway/response.interface';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

import { CreateReviewUseCase } from '../../application/create-review.usecase';
import { DeleteReviewUseCase } from '../../application/delete-review.usecase';
import { GetReviewsUseCase } from '../../application/get-reviews.usecase';
import {
  CreateReviewBodyDto,
  GetReviewsQueryDto,
  ReviewResponseDto,
} from '../dtos/review.dto';

@ApiTags('Product Review')
@Controller('products/:productId/reviews')
export class ReviewController {
  constructor(
    private readonly getReviewsUseCase: GetReviewsUseCase,
    private readonly createReviewUseCase: CreateReviewUseCase,
    private readonly deleteReviewUseCase: DeleteReviewUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get reviews of a product' })
  @ApiParam({ name: 'productId', type: String, format: 'uuid' })
  @ApiOkResponse({ type: ResponseDto<ReviewResponseDto[]> })
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Param('productId', new ParseUUIDPipe()) productId: string,
    @Query() query: GetReviewsQueryDto,
  ) {
    const result = await this.getReviewsUseCase.execute({ productId, ...query });

    return {
      items: result.data ?? [],
      summary: result.summary ?? { average: 0, count: 0 },
      total: result.total ?? 0,
      page: result.page ?? query.page,
      limit: result.limit ?? query.limit,
      totalPages: result.totalPages ?? 0,
    };
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create or update my review for a product' })
  @ApiParam({ name: 'productId', type: String, format: 'uuid' })
  @HttpCode(HttpStatus.CREATED)
  async create(
    @UserData('userId') userId: string,
    @Param('productId', new ParseUUIDPipe()) productId: string,
    @Body() body: CreateReviewBodyDto,
  ) {
    return this.createReviewUseCase.execute({ productId, userId, ...body });
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete my review for a product' })
  @ApiParam({ name: 'productId', type: String, format: 'uuid' })
  @HttpCode(HttpStatus.OK)
  async remove(
    @UserData('userId') userId: string,
    @Param('productId', new ParseUUIDPipe()) productId: string,
  ) {
    return this.deleteReviewUseCase.execute({ productId, userId });
  }
}
