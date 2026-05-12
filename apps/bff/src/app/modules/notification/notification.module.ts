import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ClientsModule } from '@nestjs/microservices';
import { GRPC_SERVICES, GrpcProvider } from '@common/configuration/grpc.config';
import { AuthModule } from '../auth/auth.module';
import { NotificationPort } from './applications/ports/notification.port';
import { NotificationGrpcAdapter } from './infrastructure/grpc/notifcation-grpc.adapter';
import { NotificationController } from './presentation/controllers/notification.controller';

@Module({
  imports: [
    AuthModule,
    CqrsModule,
    ClientsModule.registerAsync([GrpcProvider(GRPC_SERVICES.NOTIFICATION_SERVICE)]),
  ],
  controllers: [NotificationController],
  providers: [
    {
      provide: NotificationPort,
      useClass: NotificationGrpcAdapter,
    },
  ],
  exports: [],
})
export class NotificationModule {}
