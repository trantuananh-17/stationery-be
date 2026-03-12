import { Module } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule],
  providers: [JwtAuthGuard],
  exports: [JwtAuthGuard],
})
export class GuardsModule {}
