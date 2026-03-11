import { GRPC_SERVICES, GrpcProvider } from '@common/configuration/grpc.config';
import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserPort } from '../application/ports/grpc/user-grpc.port';
import { ICredentialCommandRepository } from '../application/ports/repositories/credential-command.repo';
import { IPasswordService } from '../application/ports/services/password.port';
import { CredentialOrmEntity } from './entities/typeorm-credential.entity';
import { UserGrpcAdapter } from './grpc/user-grpc.adapter';
import { TypeOrmCredentialCommandRepository } from './repositories/typeorm-credential.command';
import { PasswordService } from './services/password.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CredentialOrmEntity]),
    ClientsModule.registerAsync([GrpcProvider(GRPC_SERVICES.USER_SERVICE)]),
  ],
  providers: [
    UserGrpcAdapter,
    {
      provide: UserPort,
      useExisting: UserGrpcAdapter,
    },
    {
      provide: ICredentialCommandRepository,
      useClass: TypeOrmCredentialCommandRepository,
    },
    {
      provide: IPasswordService,
      useClass: PasswordService,
    },
  ],
  exports: [UserPort, ICredentialCommandRepository, IPasswordService],
})
export class AuthInfraModule {}
