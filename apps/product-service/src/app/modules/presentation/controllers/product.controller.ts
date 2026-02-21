import { Controller, Logger, UseInterceptors } from '@nestjs/common';
import { TcpLoggingInterceptor } from '@common/interceptors/tcpLogging.interceptor';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateProductCommand } from '../../application/commands/create-product.command';
import { CreateProductDto } from '../dtos/create-product.dto';

@Controller()
@UseInterceptors(TcpLoggingInterceptor)
export class ProductController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @MessagePattern('create_product')
  async create(@Payload() body: CreateProductDto) {
    const { name, categoryId } = body;
    return this.commandBus.execute(new CreateProductCommand(name, categoryId));
  }
}
