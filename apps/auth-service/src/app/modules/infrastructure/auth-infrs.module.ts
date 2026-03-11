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
import { JwtModule } from '@nestjs/jwt';
import { ITokenService } from '../application/ports/services/token.port';
import { TokenService } from './services/token.service';
import { ICredentialQueryRepository } from '../application/ports/repositories/credential-query.repo';
import { TypeOrmCredentialQueryRepository } from './repositories/typeorm-credential.query';

@Module({
  imports: [
    TypeOrmModule.forFeature([CredentialOrmEntity]),
    ClientsModule.registerAsync([GrpcProvider(GRPC_SERVICES.USER_SERVICE)]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
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
      provide: ICredentialQueryRepository,
      useClass: TypeOrmCredentialQueryRepository,
    },
    {
      provide: IPasswordService,
      useClass: PasswordService,
    },
    {
      provide: ITokenService,
      useClass: TokenService,
    },
  ],
  exports: [
    UserPort,
    ICredentialCommandRepository,
    ICredentialQueryRepository,
    IPasswordService,
    ITokenService,
  ],
})
export class AuthInfraModule {}
