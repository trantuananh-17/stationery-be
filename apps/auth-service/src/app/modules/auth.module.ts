import { TypeOrmProvider } from '@common/configuration/type-orm.config';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { RegisterHandler } from './application/commands/handlers/register.handler';
import { AuthInfraModule } from './infrastructure/auth-infrs.module';
import { AuthController } from './presentation/controllers/auth.controller';

@Module({
  imports: [CqrsModule, TypeOrmProvider, AuthInfraModule],
  controllers: [AuthController],
  providers: [RegisterHandler],
  exports: [],
})
export class AuthModule {}
