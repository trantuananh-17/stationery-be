import { TypeOrmProvider } from '@common/configuration/type-orm.config';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthController } from './presentation/controllers/auth.controller';

@Module({
  imports: [CqrsModule, TypeOrmProvider],
  controllers: [AuthController],
  providers: [],
  exports: [],
})
export class UserModule {}
