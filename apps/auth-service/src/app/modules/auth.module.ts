import { TypeOrmProvider } from '@common/configuration/type-orm.config';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthController } from './presentation/controllers/auth.controller';
import { RegisterHandler } from './application/commands/handlers/register.handler';

@Module({
  imports: [CqrsModule, TypeOrmProvider],
  controllers: [AuthController],
  providers: [RegisterHandler],
  exports: [],
})
export class AuthModule {}
