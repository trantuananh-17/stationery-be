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
import { ITokenService } from '../application/ports/services/token.port';
import { TokenService } from './services/token.service';
import { ICredentialQueryRepository } from '../application/ports/repositories/credential-query.repo';
import { TypeOrmCredentialQueryRepository } from './repositories/typeorm-credential.query';
import { JwtProvider } from '@common/configuration/jwt.config';
import { KafkaModule } from '@common/kafka/kafka.module';
import { QUEUE_SERVICES } from '@common/constants/enums/queue.enum';
import { IEventPublisher } from '../application/ports/producers/event-publisher.port';
import { EventPublisherKafka } from './kafka/event-publisher.kafka';

@Module({
  imports: [
    TypeOrmModule.forFeature([CredentialOrmEntity]),
    ClientsModule.registerAsync([GrpcProvider(GRPC_SERVICES.USER_SERVICE)]),
    JwtProvider,
    KafkaModule.register(QUEUE_SERVICES.AUTH),
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
    {
      provide: IEventPublisher,
      useClass: EventPublisherKafka,
    },
  ],
  exports: [
    UserPort,
    ICredentialCommandRepository,
    ICredentialQueryRepository,
    IPasswordService,
    ITokenService,
    IEventPublisher,
  ],
})
export class AuthInfraModule {}
