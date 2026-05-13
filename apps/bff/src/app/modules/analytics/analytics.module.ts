import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ClientsModule } from '@nestjs/microservices';
import { GRPC_SERVICES, GrpcProvider } from '@common/configuration/grpc.config';
import { AnalyticsPort } from './application/analytics.port';
import { AnalyticsGrpcAdapter } from './infrastructure/analytics.adapter';
import { AnalyticsController } from './presentation/analytics.controller';
import { JwtProvider } from '@common/configuration/jwt.config';
import { GuardsModule } from '@common/guards/guards.module';

@Module({
  imports: [
    CqrsModule,
    JwtProvider,
    GuardsModule,
    ClientsModule.registerAsync([GrpcProvider(GRPC_SERVICES.ANALYTICS_SERVICE)]),
  ],
  controllers: [AnalyticsController],
  providers: [
    {
      provide: AnalyticsPort,
      useClass: AnalyticsGrpcAdapter,
    },
  ],
  exports: [],
})
export class AnalyticsModule {}
