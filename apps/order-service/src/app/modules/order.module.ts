import { TypeOrmProvider } from '@common/configuration/type-orm.config';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { OrderInfraModule } from './infrastructure/order-infras.module';

@Module({
  imports: [CqrsModule, TypeOrmProvider, OrderInfraModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class OrderModule {}
