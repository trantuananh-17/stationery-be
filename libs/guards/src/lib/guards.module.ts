import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from './jwt-auth.guard';
import { OwnerGuard } from './owner.guard';
import { PermissionGuard } from './permission.guard';
import { OptionalJwtAuthGuard } from './option-jwt-auth.guard';

@Module({
  imports: [JwtModule],
  providers: [JwtAuthGuard, OwnerGuard, PermissionGuard, OptionalJwtAuthGuard],
  exports: [JwtAuthGuard, OwnerGuard, PermissionGuard, OptionalJwtAuthGuard],
})
export class GuardsModule {}
