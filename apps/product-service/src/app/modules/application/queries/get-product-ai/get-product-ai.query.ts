import { IQuery } from '@nestjs/cqrs';
import { GetProductAiDto } from './get-product-ai.dto';

export class GetProductAiQuery implements IQuery {
  constructor(public readonly payload: GetProductAiDto) {}
}
