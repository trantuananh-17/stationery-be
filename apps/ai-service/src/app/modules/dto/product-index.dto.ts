import { ArrayMaxSize, ArrayNotEmpty, IsArray, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/** Mỗi lần index lại phải gọi embedding API, nên chặn lô quá lớn. */
const MAX_BATCH = 50;

export class IndexProductsDto {
  @ApiProperty({
    type: [String],
    example: ['9f1c1d0e-4c1a-4f0b-9a7d-2b2f5f3a0c11'],
    description: 'Danh sách productId cần cập nhật lại trong index ngữ nghĩa',
  })
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMaxSize(MAX_BATCH)
  @IsUUID(undefined, { each: true })
  productIds: string[];
}
