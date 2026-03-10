import { TypeOrmProvider } from '@common/configuration/type-orm.config';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthController } from './presentation/controllers/auth.controller';
import { RegisterHandler } from './application/commands/handlers/register.handler';
import { ClientsModule } from '@nestjs/microservices';
import { GRPC_SERVICES, GrpcProvider } from '@common/configuration/grpc.config';
import { UserGrpcAdapter } from './infrastructure/grpc/user-grpc.adapter';
import { UserPort } from './application/ports/grpc/user-grpc.port';
import { ICredentialCommandRepository } from './application/ports/repositories/credential-command.repo';
import { TypeOrmCredentialCommandRepository } from './infrastructure/repositories/typeorm-credential.command';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CredentialOrmEntity } from './infrastructure/entities/typeorm-credential.entity';

@Module({
  imports: [
    CqrsModule,
    TypeOrmProvider,
    TypeOrmModule.forFeature([CredentialOrmEntity]),
    ClientsModule.registerAsync([GrpcProvider(GRPC_SERVICES.USER_SERVICE)]),
  ],
  controllers: [AuthController],
  providers: [
    RegisterHandler,
    UserGrpcAdapter,
    {
      provide: UserPort,
      useExisting: UserGrpcAdapter,
    },
    {
      provide: ICredentialCommandRepository,
      useClass: TypeOrmCredentialCommandRepository,
    },
  ],
  exports: [],
})
export class AuthModule {}
